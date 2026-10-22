import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';

interface SectionHeadingProps {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  /** Variante clara para uso sobre fundos escuros. */
  tone?: 'dark' | 'light';
  align?: 'left' | 'center';
  className?: string;
  /** Id usado pelo aria-labelledby da seção. */
  id?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  tone = 'dark',
  align = 'center',
  className,
  id,
}: SectionHeadingProps) {
  const isLight = tone === 'light';

  return (
    <div
      className={cn(
        'max-w-3xl',
        align === 'center' ? 'mx-auto text-center' : 'text-left',
        className,
      )}
    >
      {eyebrow && (
        <span
          className={cn(
            'eyebrow mb-4',
            align === 'center' && 'justify-center',
            isLight ? 'text-steel' : 'text-wine',
          )}
        >
          <span className={cn('h-px w-6', isLight ? 'bg-steel/60' : 'bg-wine/50')} aria-hidden="true" />
          {eyebrow}
        </span>
      )}

      <h2
        id={id}
        className={cn('text-3xl sm:text-4xl lg:text-[2.75rem] lg:leading-[1.1]', isLight && 'text-white')}
      >
        {title}
      </h2>

      {description && (
        <p className={cn('mt-5 text-base leading-relaxed sm:text-lg', isLight ? 'text-steel' : 'text-graphite/75')}>
          {description}
        </p>
      )}
    </div>
  );
}
