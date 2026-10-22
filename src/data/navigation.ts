import type { NavItem } from '@/types';

export const navItems: NavItem[] = [
  { label: 'Início', sectionId: 'inicio' },
  { label: 'O Laboratório', sectionId: 'laboratorio' },
  { label: 'Serviços', sectionId: 'servicos' },
  { label: 'Tecnologia', sectionId: 'tecnologia' },
  { label: 'Como Trabalhamos', sectionId: 'como-trabalhamos' },
  { label: 'Contato', sectionId: 'contato' },
];

/**
 * Seções observadas pelo scroll spy.
 * Apenas as que existem no menu: seções intermediárias (bastidores, galeria,
 * diferenciais) mantêm ativo o último item de menu já percorrido.
 */
export const trackedSections: string[] = navItems.map((item) => item.sectionId);
