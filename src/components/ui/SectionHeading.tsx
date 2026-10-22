import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';

interface SectionHeadingProps {
  /** Índice da seção, no formato "01". */
  index: string;
  /** Rótulo técnico curto. */
  label: string;
  title: ReactNode;
  /** Texto de apoio, limitado à medida de leitura. */
  intro?: ReactNode;
  tone?: 'dark' | 'light';
  /** Id usado pelo aria-labelledby da seção. */
  id: string;
  className?: string;
}

/**
 * Cabeçalho de seção no formato de ficha técnica: índice e rótulo em mono
 * sobre uma régua, título alinhado à esquerda. Sem centralização nem eyebrow
 * decorativo repetido.
 */
export function SectionHeading({ index, label, title, intro, tone = 'dark', id, className }: SectionHeadingProps) {
  const isLight = tone === 'light';

  return (
    <header className={cn('border-t pt-5', isLight ? 'border-white/25' : 'border-ink/85', className)}>
      <p className={cn('label flex items-center gap-3', isLight ? 'text-white/70' : 'text-ink-faint')}>
        <span className={isLight ? 'text-white' : 'text-wine'}>{index}</span>
        {label}
      </p>

      <div className="mt-6 gap-x-12 gap-y-5 lg:grid lg:grid-cols-12">
        <h2
          id={id}
          className={cn('text-h2 lg:col-span-7 lg:text-h2-lg', isLight && 'text-white')}
        >
          {title}
        </h2>

        {intro && (
          <p
            className={cn(
              'mt-4 max-w-measure text-body lg:col-span-5 lg:mt-1.5',
              isLight ? 'text-white/70' : 'text-ink-soft',
            )}
          >
            {intro}
          </p>
        )}
      </div>
    </header>
  );
}
