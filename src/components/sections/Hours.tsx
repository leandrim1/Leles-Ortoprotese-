import { Clock } from 'lucide-react';
import { Reveal } from '@/components/ui/Reveal';
import { businessHours } from '@/data/hours';
import { site } from '@/data/site';
import { useBusinessHours } from '@/hooks/useBusinessHours';
import { formatDayRange } from '@/utils/businessHours';
import { cn } from '@/utils/cn';

export function Hours() {
  const { isOpen, today, nextChange } = useBusinessHours();

  return (
    <Reveal>
      <div className="overflow-hidden rounded-2xl border border-steel/40 bg-white shadow-card">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-steel/40 bg-steel-light/60 px-6 py-5">
          <h3 className="inline-flex items-center gap-2.5 font-display text-base font-semibold">
            <Clock className="h-4 w-4 text-wine" aria-hidden="true" />
            Horários de atendimento
          </h3>

          {/* Indicação calculada no navegador, no fuso America/Sao_Paulo */}
          <p
            aria-live="polite"
            className={cn(
              'inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold',
              isOpen ? 'bg-emerald-50 text-emerald-700' : 'bg-steel-light text-graphite/70',
            )}
          >
            <span className="relative flex h-2 w-2" aria-hidden="true">
              {isOpen && (
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75 motion-reduce:hidden" />
              )}
              <span
                className={cn('relative inline-flex h-2 w-2 rounded-full', isOpen ? 'bg-emerald-600' : 'bg-steel')}
              />
            </span>
            {isOpen ? 'Aberto agora' : 'Fechado agora'}
          </p>
        </div>

        <ul className="divide-y divide-steel/30">
          {businessHours.map((day) => {
            const isToday = day.weekday === today.weekday;
            const isClosed = day.opensAt === null;

            return (
              <li
                key={day.weekday}
                aria-current={isToday ? 'date' : undefined}
                className={cn(
                  'flex items-center justify-between gap-4 px-6 py-3.5 text-sm transition-colors',
                  isToday && 'bg-wine-tint',
                )}
              >
                <span
                  className={cn(
                    'inline-flex items-center gap-2',
                    isToday ? 'font-semibold text-wine' : 'text-graphite/75',
                  )}
                >
                  {isToday && <span className="h-1.5 w-1.5 rounded-full bg-wine" aria-hidden="true" />}
                  {day.label}
                  {isToday && <span className="sr-only">(hoje)</span>}
                </span>

                <span
                  className={cn(
                    'tabular-nums',
                    isClosed ? 'text-graphite/65' : isToday ? 'font-semibold text-wine' : 'text-graphite/75',
                  )}
                >
                  {formatDayRange(day)}
                </span>
              </li>
            );
          })}
        </ul>

        <p className="border-t border-steel/40 bg-steel-light/40 px-6 py-4 text-xs text-graphite/70">
          {nextChange} · Horário de Brasília ({site.timeZone.replace('_', ' ')})
        </p>
      </div>
    </Reveal>
  );
}
