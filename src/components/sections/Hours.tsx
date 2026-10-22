import { businessHours } from '@/data/hours';
import { useBusinessHours } from '@/hooks/useBusinessHours';
import { formatDayRange } from '@/utils/businessHours';
import { cn } from '@/utils/cn';

export function Hours() {
  const { isOpen, today, nextChange } = useBusinessHours();

  return (
    <div>
      <div className="flex items-baseline justify-between gap-4 border-t border-ink/85 pt-5">
        <h3 className="label text-ink-faint">Atendimento</h3>

        {/* Situação calculada no navegador, no fuso do laboratório */}
        <p aria-live="polite" className={cn('label', isOpen ? 'text-wine' : 'text-ink-faint')}>
          {isOpen ? 'Aberto agora' : 'Fechado agora'}
        </p>
      </div>

      <dl className="mt-5">
        {businessHours.map((day) => {
          const isToday = day.weekday === today.weekday;
          const isClosed = day.opensAt === null;

          return (
            <div
              key={day.weekday}
              className={cn(
                'flex items-baseline justify-between gap-4 border-b border-rule py-2.5 text-body',
                isToday && 'text-wine',
              )}
            >
              <dt className={cn(isToday ? 'font-medium' : 'text-ink-soft')}>
                {day.label}
                {isToday && <span className="sr-only"> (hoje)</span>}
              </dt>
              <dd
                className={cn(
                  'font-mono text-meta tabular-nums',
                  isToday ? 'font-medium' : isClosed ? 'text-ink-faint' : 'text-ink-soft',
                )}
              >
                {formatDayRange(day)}
              </dd>
            </div>
          );
        })}
      </dl>

      <p className="mt-4 text-meta text-ink-faint">{nextChange} · horário de Brasília.</p>
    </div>
  );
}
