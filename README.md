# Lab Leles — Ortoprótese

Site institucional do **Lab Leles — Prótese Dentária**, laboratório de prótese
dentária em Patos de Minas (MG) que atende profissionais da odontologia.

Esta é a **primeira etapa do projeto: apenas front-end**. Não há backend, banco de
dados, autenticação, painel administrativo nem envio real de formulários. Todo o
conteúdo vem de arquivos estáticos em `src/data/`.

## Tecnologias

- **React 18** + **TypeScript**
- **Vite 5** (build e servidor de desenvolvimento)
- **React Router 6** (rota principal e página 404)
- **Tailwind CSS 3**
- **lucide-react** (ícones)

## Como executar

```bash
npm install     # instala as dependências
npm run dev     # servidor de desenvolvimento em http://localhost:5173
npm run build   # build de produção em dist/
npm run preview # serve o build de produção
npm run lint    # ESLint
npm run typecheck # checagem de tipos sem gerar arquivos
```

## Estrutura

```
src/
├── assets/            Logo, fotos dos trabalhos e vídeos do laboratório
│   ├── gallery/       Fotos em .webp (versão grande e versão -sm para a grade)
│   └── video/         Vídeos .mp4 e seus frames de capa
├── components/
│   ├── layout/        Header, Footer, Layout e botão flutuante do WhatsApp
│   ├── sections/      Uma seção da página por arquivo
│   └── ui/            Button, Modal, Logo, Reveal, Field, SectionHeading, VideoPlayer
├── data/              Conteúdo editável: site, serviços, horários, galeria, vídeos
├── hooks/             Scroll spy, reveal, horário de funcionamento, foco e rolagem
├── pages/             Home e NotFound
├── styles/            CSS global e camadas do Tailwind
├── types/             Tipos compartilhados
└── utils/             WhatsApp, validação, horários e rolagem suave
```

### Onde alterar o conteúdo

Os dados institucionais ficam separados dos componentes, para que o conteúdo possa
ser atualizado sem mexer no layout:

| Arquivo | Conteúdo |
| --- | --- |
| `src/data/site.ts` | Nome, endereço, WhatsApp, Instagram, Google Maps, SEO |
| `src/data/services.ts` | Os cinco serviços, suas descrições e imagens |
| `src/data/hours.ts` | Horários de funcionamento por dia da semana |
| `src/data/gallery.ts` | Fotos da galeria de trabalhos |
| `src/data/videos.ts` | Vídeos do laboratório e seus frames de capa |
| `src/data/content.ts` | Pilares, etapas do processo, diferenciais e tecnologia |
| `src/data/navigation.ts` | Itens do menu |

## Seções da página

Início (hero) · O Laboratório · Serviços · Tecnologia · Como Trabalhamos ·
Bastidores (vídeos) · Galeria de trabalhos · Diferenciais · Contato e horários.

## Decisões relevantes

- **Logo**: a imagem enviada pelo cliente é usada sem recorte nem redesenho, apenas
  redimensionada proporcionalmente (`src/components/ui/Logo.tsx`). Sobre fundos
  escuros recebe um contorno claro para não se perder no vinho.
- **Fotos e vídeos**: são materiais do próprio laboratório. As descrições relatam
  apenas o que aparece na imagem, sem classificação clínica ou técnica que o
  laboratório não tenha confirmado.
- **Vídeos**: carregam com `preload="none"` — só são baixados quando o visitante
  aperta play. Até lá aparece apenas o frame de capa.
- **Horário de funcionamento**: a indicação "Aberto agora / Fechado agora" é
  calculada no navegador no fuso `America/Sao_Paulo`, independente do fuso do
  visitante, e se atualiza a cada minuto.
- **Formulário de contato**: é somente visual. Valida os campos no front-end, avisa
  explicitamente que o envio real ainda não foi configurado e oferece um botão que
  monta a mensagem no WhatsApp para o usuário revisar antes de enviar.
- **Acessibilidade**: HTML semântico, atalho para pular a navegação, foco visível,
  modal com foco preso e navegação por teclado, textos com contraste mínimo AA e
  respeito a `prefers-reduced-motion`.

## Preparado para as próximas etapas

As seções consomem dados por meio dos módulos de `src/data/`. Para ligar o site a um
backend no futuro, basta trocar a origem desses dados (por exemplo, por uma chamada
de API dentro de um hook) sem reescrever as páginas. O formulário já concentra os
valores e a validação em `ContactForm`, de modo que o envio real pode ser plugado em
um único ponto.
