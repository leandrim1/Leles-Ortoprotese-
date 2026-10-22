import { businessHours } from '@/data/hours';
import { site } from '@/data/site';
import type { BusinessDay, OpenStatus, WeekdayIndex } from '@/types';

const WEEKDAY_KEYS: Record<string, WeekdayIndex> = {
  sun: 0,
  mon: 1,
  tue: 2,
  wed: 3,
  thu: 4,
  fri: 5,
  sat: 6,
};

/** Formata minutos desde a meia-noite como "07:30". */
export function formatMinutes(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return `${String(hours).padStart(2, '0')}:${String(rest).padStart(2, '0')}`;
}

/** Texto do horário de um dia, ou "Fechado". */
export function formatDayRange(day: BusinessDay): string {
  if (day.opensAt === null || day.closesAt === null) return 'Fechado';
  return `${formatMinutes(day.opensAt)} às ${formatMinutes(day.closesAt)}`;
}

/** Lê o dia da semana e o horário atuais no fuso do laboratório. */
export function getLocalTime(now: Date = new Date()): { weekday: WeekdayIndex; minutes: number } {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: site.timeZone,
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  const parts = formatter.formatToParts(now);
  const weekdayPart = parts.find((part) => part.type === 'weekday')?.value ?? 'Mon';
  const hourPart = parts.find((part) => part.type === 'hour')?.value ?? '00';
  const minutePart = parts.find((part) => part.type === 'minute')?.value ?? '00';

  // Intl pode devolver "24" à meia-noite em alguns ambientes.
  const hour = Number(hourPart) % 24;

  return {
    weekday: WEEKDAY_KEYS[weekdayPart.toLowerCase().slice(0, 3)] ?? 1,
    minutes: hour * 60 + Number(minutePart),
  };
}

/** Próximo dia com atendimento a partir de um dia da semana (exclusive). */
function findNextOpenDay(fromWeekday: WeekdayIndex): BusinessDay | null {
  for (let offset = 1; offset <= 7; offset += 1) {
    const index = ((fromWeekday + offset) % 7) as WeekdayIndex;
    const day = businessHours[index];
    if (day.opensAt !== null) return day;
  }
  return null;
}

/** Calcula a situação de atendimento no fuso America/Sao_Paulo. */
export function getOpenStatus(now: Date = new Date()): OpenStatus {
  const { weekday, minutes } = getLocalTime(now);
  const today = businessHours[weekday];

  const isOpen =
    today.opensAt !== null && today.closesAt !== null && minutes >= today.opensAt && minutes < today.closesAt;

  if (isOpen && today.closesAt !== null) {
    return {
      isOpen: true,
      today,
      nowMinutes: minutes,
      nextChange: `Atendimento até ${formatMinutes(today.closesAt)}`,
    };
  }

  // Ainda vai abrir hoje.
  if (today.opensAt !== null && minutes < today.opensAt) {
    return {
      isOpen: false,
      today,
      nowMinutes: minutes,
      nextChange: `Abre hoje às ${formatMinutes(today.opensAt)}`,
    };
  }

  const nextDay = findNextOpenDay(weekday);
  const nextChange = nextDay
    ? `Abre ${nextDay.weekday === ((weekday + 1) % 7) ? 'amanhã' : nextDay.label.toLowerCase()} às ${formatMinutes(nextDay.opensAt as number)}`
    : 'Consulte os horários de atendimento';

  return { isOpen: false, today, nowMinutes: minutes, nextChange };
}
