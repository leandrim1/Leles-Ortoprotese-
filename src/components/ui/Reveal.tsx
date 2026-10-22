import type { ElementType, ReactNode } from 'react';
import { useReveal } from '@/hooks/useReveal';
import { cn } from '@/utils/cn';

interface RevealProps {
  children: ReactNode;
  /** Atraso em milissegundos, para escalonar listas de cards. */
  delay?: number;
  className?: string;
  as?: ElementType;
}

/** Revela o conteúdo com uma transição discreta ao entrar na viewport. */
export function Reveal({ children, delay = 0, className, as: Tag = 'div' }: RevealProps) {
  const { ref, isVisible } = useReveal<HTMLDivElement>();

  return (
    <Tag
      ref={ref}
      className={cn('reveal', isVisible && 'reveal-visible', className)}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}
