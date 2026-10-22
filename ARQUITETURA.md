# Lab Leles — Plataforma

Documento de arquitetura e operação. O site institucional continua funcionando
como antes; esta etapa acrescenta a camada de servidor sobre a qual o portal do
dentista e o painel administrativo serão construídos.

## Estado atual

| Etapa (ordem do briefing) | Situação |
| --- | --- |
| 1. Auditoria e arquitetura | Concluída |
| 2. Backend, Neon e Blob | Camada pronta e testada; **falta provisionar as contas** |
| 3. Autenticação e permissões | Concluída e testada (31 testes) |
| 4. Serviços, clientes e pedidos | Concluída e testada (24 testes) |
| 5. Fluxo de criação de pedidos | Regras de domínio prontas; **falta a interface** |
| 6. Upload e acesso a arquivos | Concluída e testada (15 testes) |
| 7. Orçamentos | Schema pronto; **lógica de domínio pendente** |
| 8–14 | **Pendentes** (painel, editor de conteúdo, notificações, relatórios, deploy) |

## Decisões de arquitetura

**O domínio não conhece HTTP.** Tudo em `src/server/domain/` são funções que
recebem um `Sql` e um `SessionUser` e devolvem dados ou lançam `AppError`. Os
endpoints em `api/` ficam finos: interpretam a requisição, resolvem a sessão,
chamam o domínio e traduzem o erro em status HTTP. Isso é o que permite testar
regra de negócio sem subir servidor.

**O banco é um só, em dois sabores.** A aplicação depende da interface `Sql`
(`src/server/db/client.ts`). Em produção ela é servida pelo driver serverless do
Neon; nos testes, por PostgreSQL 18 real compilado em WASM (PGlite). As mesmas
migrations rodam nos dois, então o que passa no teste é o que vai ao ar.

**Permissão é verificada no servidor, sempre.** `src/server/auth/rbac.ts` é a
fonte única da tabela de permissões. Toda função de domínio começa checando
`can(role, permissão)`. Esconder botão no front-end não entra nessa conta.

**Isolamento por SQL, não por interface.** Quando um cliente lista pedidos, o
filtro `client_id` entra na consulta. Pedido de terceiro responde 404 com a
mesma mensagem de um id inexistente, para não confirmar que o registro existe.

**Senha com scrypt do próprio Node.** Argon2 e bcrypt exigem binário nativo, o
que quebra no runtime serverless da Vercel. scrypt é recomendado pelo OWASP e
vem no `node:crypto`.

**Sessão opaca, não JWT.** O token é aleatório e o banco guarda apenas o seu
hash SHA-256. Isso permite revogar de verdade: suspender uma conta ou trocar a
senha derruba as sessões abertas no mesmo instante.

**Arquivo é validado pelo conteúdo.** `sniffFileType` lê os bytes iniciais e
identifica PNG, JPG, PDF, PLY e STL (ASCII e binário). Um executável renomeado
para `.stl` é recusado. Anexos de pedido são privados, ficam em caminho com ids
opacos (sem nome de paciente) e só são alcançáveis por link de validade curta,
emitido depois da checagem de permissão.

## Mapa do projeto

```
api/                        Funções serverless da Vercel (a implementar)
scripts/
  migrate.ts                Aplica migrations      — npm run db:migrate
  create-admin.ts           Primeiro administrador — npm run db:create-admin
  seed-catalog.ts           Categorias e serviços  — npm run db:seed
src/
  server/
    db/
      client.ts             Interface Sql e erros
      neon.ts               Driver de produção
      migrate.ts            Runner versionado
      migrations/           001..008, append-only após o primeiro deploy
    auth/
      password.ts           scrypt
      tokens.ts             Tokens opacos
      session.ts            Criação, resolução e revogação
      rateLimit.ts          Limite por conta e por IP
      rbac.ts               Tabela de permissões
    domain/                 Regras de negócio
    storage/                Blob, adaptador local e detecção de tipo
    http/errors.ts          AppError
  (frontend existente)
tests/                      79 testes sobre PostgreSQL real
```

## Modelo de dados

26 tabelas em 8 migrations. Pontos que o schema garante por si:

- E-mail só minúsculo e único entre contas vivas (índice parcial).
- Serviço sem preço é obrigatoriamente sob orçamento (`CHECK`).
- Campo de seleção não existe sem opções (`CHECK` com `jsonb_array_length`).
- Total da linha do orçamento é coluna gerada, nunca enviada pelo cliente.
- Um único orçamento aberto por pedido (índice parcial único).
- Um pedido por chave de idempotência e cliente: reenvio não duplica.
- Histórico de status sobrevive ao cancelamento.
- Binário nunca entra no PostgreSQL: a tabela `media` guarda só metadados.

## Implantação

### 1. Provisionar

1. **Neon**: criar projeto, copiar a connection string com pooling.
2. **Vercel Blob**: criar store, gerar token de leitura e escrita.
3. Preencher as variáveis conforme `.env.example` no painel da Vercel.

### 2. Preparar o banco

```bash
npm run db:migrate                                   # cria o schema
ADMIN_EMAIL=voce@lableles.com.br \
  ADMIN_NAME="Seu Nome" npm run db:create-admin      # imprime a senha uma vez
npm run db:seed                                      # categorias, serviços, horários
```

Não há senha de administrador no código. O script gera uma senha forte e a
mostra uma única vez, ou aceita `ADMIN_PASSWORD` do ambiente.

### 3. Publicar

O front-end é estático (Vite) e os endpoints vão em `api/` como funções Node da
Vercel. As migrations rodam fora do deploy, pelo comando acima.

### Backup e recuperação

O Neon mantém restauração a um ponto no tempo conforme o plano contratado. O
procedimento de recuperação depende dessa janela e **precisa ser definido com o
plano escolhido** — não há nada configurado ainda.

## Privacidade

O sistema pode receber arquivo odontológico ligado a um paciente. O desenho
assume isso:

- O pedido tem `case_code`, não nome de paciente. A interface deve orientar o
  dentista a usar código.
- Caminho de arquivo e log de auditoria não carregam nome nem dado clínico.
- A auditoria omite senha e token por lista de campos (`domain/audit.ts`).
- Acesso a arquivo privado é registrado com autor e horário.
- Política de retenção, exclusão e atendimento ao titular: **a definir** com o
  laboratório antes de entrar em produção.

## Testes

```bash
npm test          # 79 testes
npm run typecheck
npm run lint
npm run build
```

Os testes sobem um PostgreSQL real em memória e aplicam as migrations de
verdade. Cobrem hash e força de senha, permissões dos quatro perfis, cadastro
transacional, login com resposta uniforme e bloqueio por força bruta, ciclo de
sessão, recuperação de senha, máquina de status, isolamento entre clientes,
idempotência de pedido, detecção de tipo de arquivo e autorização de download.
