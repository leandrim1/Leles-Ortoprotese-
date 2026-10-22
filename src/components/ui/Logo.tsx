import logoSrc from '@/assets/logo-leles.webp';
import { site } from '@/data/site';
import { cn } from '@/utils/cn';

interface LogoProps {
  size?: number;
  withWordmark?: boolean;
  tone?: 'dark' | 'light';
  className?: string;
  priority?: boolean;
}

/**
 * Marca do Lab Leles. A arte original é usada sem recorte nem redesenho,
 * apenas redimensionada proporcionalmente.
 */
export function Logo({ size = 40, withWordmark = false, tone = 'dark', className, priority = false }: LogoProps) {
  return (
    <span className={cn('inline-flex items-center gap-3', className)}>
      <img
        src={logoSrc}
        alt={site.legalName}
        width={size}
        height={size}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        fetchPriority={priority ? 'high' : 'auto'}
        className="block shrink-0 rounded-sm object-contain"
        style={{ width: size, height: size }}
      />

      {withWordmark && (
        <span className="flex flex-col leading-none">
          <span className={cn('text-h4 font-bold', tone === 'light' ? 'text-white' : 'text-ink')}>Lab Leles</span>
          <span className={cn('label mt-1', tone === 'light' ? 'text-white/55' : 'text-ink-faint')}>Ortoprótese</span>
        </span>
      )}
    </span>
  );
}
