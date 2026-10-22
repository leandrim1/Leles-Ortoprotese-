import logoSrc from '@/assets/logo-leles.webp';
import { site } from '@/data/site';
import { cn } from '@/utils/cn';

interface LogoProps {
  /** Lado do quadrado da marca, em pixels. */
  size?: number;
  /** Exibe o nome do laboratório ao lado da marca. */
  withWordmark?: boolean;
  /** Variante clara para uso sobre fundos escuros. */
  tone?: 'dark' | 'light';
  className?: string;
  priority?: boolean;
}

/**
 * Marca do Lab Leles.
 * A imagem original é usada sem recorte nem redesenho, apenas redimensionada
 * proporcionalmente dentro de um contêiner quadrado.
 */
export function Logo({ size = 48, withWordmark = false, tone = 'dark', className, priority = false }: LogoProps) {
  return (
    <span className={cn('inline-flex items-center gap-3', className)}>
      <img
        src={logoSrc}
        alt={`${site.legalName}`}
        width={size}
        height={size}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        fetchPriority={priority ? 'high' : 'auto'}
        className={cn(
          'block shrink-0 rounded-xl object-contain shadow-sm ring-1',
          // Sobre o vinho o selo some sem um contorno claro delimitando a marca.
          tone === 'light' ? 'ring-white/30' : 'ring-black/5',
        )}
        style={{ width: size, height: size }}
      />

      {withWordmark && (
        <span className="flex flex-col leading-none">
          <span
            className={cn(
              'font-display text-base font-bold tracking-tight sm:text-lg',
              tone === 'light' ? 'text-white' : 'text-graphite',
            )}
          >
            Lab Leles
          </span>
          <span
            className={cn(
              'mt-1 text-[0.625rem] font-medium uppercase tracking-[0.16em]',
              tone === 'light' ? 'text-steel' : 'text-graphite/70',
            )}
          >
            Ortoprótese
          </span>
        </span>
      )}
    </span>
  );
}
