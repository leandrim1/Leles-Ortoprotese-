import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/utils/cn';

type Variant = 'primary' | 'secondary' | 'ghost' | 'light' | 'outlineLight';
type Size = 'sm' | 'md' | 'lg';

const base =
  'inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-300 ' +
  'disabled:cursor-not-allowed disabled:opacity-60 active:translate-y-0';

const variants: Record<Variant, string> = {
  primary: 'bg-wine text-white shadow-wine hover:bg-wine-soft hover:-translate-y-0.5',
  secondary: 'bg-graphite text-white hover:bg-graphite-soft hover:-translate-y-0.5',
  ghost: 'border border-steel/70 bg-white text-graphite hover:border-wine hover:text-wine',
  light: 'bg-white text-wine shadow-lg hover:bg-steel-light hover:-translate-y-0.5',
  outlineLight: 'border border-white/40 bg-white/5 text-white hover:border-white hover:bg-white/15',
};

const sizes: Record<Size, string> = {
  sm: 'px-4 py-2 text-sm min-h-[40px]',
  md: 'px-6 py-3 text-sm min-h-[48px]',
  lg: 'px-7 py-3.5 text-base min-h-[52px]',
};

interface CommonProps {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
}

type ButtonProps = CommonProps & ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({ variant = 'primary', size = 'md', className, children, ...props }: ButtonProps) {
  return (
    <button className={cn(base, variants[variant], sizes[size], className)} {...props}>
      {children}
    </button>
  );
}

interface LinkButtonProps extends CommonProps {
  href: string;
  /** Links externos recebem target e rel seguros automaticamente. */
  external?: boolean;
  'aria-label'?: string;
}

export function LinkButton({
  href,
  external = false,
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}: LinkButtonProps) {
  const externalProps = external ? { target: '_blank', rel: 'noopener noreferrer' } : {};

  return (
    <a href={href} className={cn(base, variants[variant], sizes[size], className)} {...externalProps} {...props}>
      {children}
    </a>
  );
}
