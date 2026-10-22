/**
 * Permissões por perfil.
 *
 * Esta tabela é a fonte única de verdade e é consultada no servidor, em todo
 * endpoint. Esconder botão no front-end não é controle de acesso.
 */
export type UserRole = 'admin' | 'atendimento' | 'producao' | 'cliente';

export type Permission =
  // Pedidos
  | 'orders:create'
  | 'orders:read:own'
  | 'orders:read:all'
  | 'orders:advance:commercial'
  | 'orders:advance:production'
  | 'orders:cancel'
  // Mensagens
  | 'messages:write:client'
  | 'messages:write:internal'
  // Arquivos
  | 'files:read:own'
  | 'files:read:all'
  | 'files:upload:own'
  // Orçamentos
  | 'quotes:manage'
  | 'quotes:decide:own'
  // Clientes
  | 'clients:read'
  | 'clients:manage'
  // Catálogo e conteúdo
  | 'services:manage'
  | 'content:edit'
  | 'content:publish'
  // Administração
  | 'users:manage'
  | 'settings:manage'
  | 'reports:read'
  | 'audit:read';

const CLIENTE: Permission[] = [
  'orders:create',
  'orders:read:own',
  'messages:write:client',
  'files:read:own',
  'files:upload:own',
  'quotes:decide:own',
];

const PRODUCAO: Permission[] = [
  'orders:read:all',
  'orders:advance:production',
  'messages:write:internal',
  'files:read:all',
];

const ATENDIMENTO: Permission[] = [
  'orders:read:all',
  'orders:advance:commercial',
  'orders:cancel',
  'messages:write:client',
  'messages:write:internal',
  'files:read:all',
  'quotes:manage',
  'clients:read',
  'clients:manage',
  'reports:read',
];

const ADMIN: Permission[] = [
  ...new Set<Permission>([
    ...ATENDIMENTO,
    ...PRODUCAO,
    'services:manage',
    'content:edit',
    'content:publish',
    'users:manage',
    'settings:manage',
    'audit:read',
  ]),
];

const PERMISSIONS: Record<UserRole, ReadonlySet<Permission>> = {
  admin: new Set(ADMIN),
  atendimento: new Set(ATENDIMENTO),
  producao: new Set(PRODUCAO),
  cliente: new Set(CLIENTE),
};

export function can(role: UserRole, permission: Permission): boolean {
  return PERMISSIONS[role]?.has(permission) ?? false;
}

export function permissionsFor(role: UserRole): Permission[] {
  return [...(PERMISSIONS[role] ?? [])].sort();
}

/** Perfis que operam o laboratório, por oposição aos clientes. */
export function isStaff(role: UserRole): boolean {
  return role === 'admin' || role === 'atendimento' || role === 'producao';
}
