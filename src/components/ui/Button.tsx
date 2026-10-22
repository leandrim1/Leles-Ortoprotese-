import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/utils/cn';

type Variant = 'solid' | 'outline' | 'onDark' | 'quiet';

const base =
  'inline-flex items-center justify-center gap-2 rounded px-5 text-meta font-medium ' +
  'min-h-[44px] transition-colors disabled:cursor-not-allowed disabled:opacity-50';

const variants: Record<Variant, string> = {
  solid: 'bg-wine text-white hover:bg-wine-deep',
  outline: 'border border-rule-strong text-ink hover:border-ink hover:bg-paper-dim',
  onDark: 'border border-white/35 text-white hover:border-white hover:bg-white/10',
  // Link textual: alternativa ao segundo botão, evita dois pesos iguais lado a lado.
  quiet: 'min-h-0 px-0 text-wine underline decoration-rule-strong underline-offset-4 hover:decoration-wine',
};

interface Common {
  variant?: Variant;
  className?: string;
  children: ReactNode;
}

type ButtonProps = Common & ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({ variant = 'solid', className, children, ...props }: ButtonProps) {
  return (
    <button className={cn(base, variants[variant], className)} {...props}>
      {children}
    </button>
  );
}

interface LinkButtonProps extends Common {
  href: string;
  external?: boolean;
  'aria-label'?: string;
}

export function LinkButton({ href, external = false, variant = 'solid', className, children, ...props }: LinkButtonProps) {
  const externalProps = external ? { target: '_blank', rel: 'noopener noreferrer' } : {};

  return (
    <a href={href} className={cn(base, variants[variant], className)} {...externalProps} {...props}>
      {children}
    </a>
  );
}
