import type { BusinessDay } from '@/types';

/** Converte "HH:MM" em minutos desde a meia-noite. */
const toMinutes = (time: string): number => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

/**
 * Horários de funcionamento informados pelo laboratório.
 * Ordenados de domingo (0) a sábado (6), igual ao retorno de Date#getDay.
 */
export const businessHours: BusinessDay[] = [
  { weekday: 0, label: 'Domingo', shortLabel: 'Dom', opensAt: null, closesAt: null },
  { weekday: 1, label: 'Segunda-feira', shortLabel: 'Seg', opensAt: toMinutes('07:30'), closesAt: toMinutes('17:30') },
  { weekday: 2, label: 'Terça-feira', shortLabel: 'Ter', opensAt: toMinutes('07:30'), closesAt: toMinutes('17:30') },
  { weekday: 3, label: 'Quarta-feira', shortLabel: 'Qua', opensAt: toMinutes('07:30'), closesAt: toMinutes('17:30') },
  { weekday: 4, label: 'Quinta-feira', shortLabel: 'Qui', opensAt: toMinutes('07:00'), closesAt: toMinutes('17:30') },
  { weekday: 5, label: 'Sexta-feira', shortLabel: 'Sex', opensAt: toMinutes('07:30'), closesAt: toMinutes('17:30') },
  { weekday: 6, label: 'Sábado', shortLabel: 'Sáb', opensAt: null, closesAt: null },
];
