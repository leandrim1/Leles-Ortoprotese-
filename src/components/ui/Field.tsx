import { useId } from 'react';
import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

/* Campo sublinhado: a régua é o mesmo elemento estrutural do resto da página. */
const control =
  'w-full rounded-none border-0 border-b bg-transparent px-0 py-2.5 text-body text-ink transition-colors ' +
  'placeholder:text-ink-faint focus:border-wine focus:outline-none focus:ring-0';

interface WrapperProps {
  label: string;
  error?: string;
  optional?: boolean;
  children: (p: { id: string; describedBy?: string; invalid: boolean }) => ReactNode;
}

function Wrapper({ label, error, optional, children }: WrapperProps) {
  const id = useId();
  const errorId = `${id}-error`;

  return (
    <div>
      <label htmlFor={id} className="label mb-2 block text-ink-faint">
        {label}
        {optional && <span className="ml-1.5 normal-case tracking-normal"> · opcional</span>}
      </label>

      {children({ id, describedBy: error ? errorId : undefined, invalid: Boolean(error) })}

      {error && (
        <p id={errorId} role="alert" className="mt-2 text-meta text-wine">
          {error}
        </p>
      )}
    </div>
  );
}

type TextFieldProps = { label: string; error?: string; optional?: boolean } & Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'id'
>;

export function TextField({ label, error, optional, className, ...props }: TextFieldProps) {
  return (
    <Wrapper label={label} error={error} optional={optional}>
      {({ id, describedBy, invalid }) => (
        <input
          id={id}
          aria-invalid={invalid || undefined}
          aria-describedby={describedBy}
          className={cn(control, invalid ? 'border-wine' : 'border-rule-strong', className)}
          {...props}
        />
      )}
    </Wrapper>
  );
}

type SelectFieldProps = { label: string; error?: string; children: ReactNode } & Omit<
  SelectHTMLAttributes<HTMLSelectElement>,
  'id'
>;

export function SelectField({ label, error, className, children, ...props }: SelectFieldProps) {
  return (
    <Wrapper label={label} error={error}>
      {({ id, describedBy, invalid }) => (
        <select
          id={id}
          aria-invalid={invalid || undefined}
          aria-describedby={describedBy}
          className={cn(control, 'appearance-none pr-8', invalid ? 'border-wine' : 'border-rule-strong', className)}
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%2355534D' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")",
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right 0.25rem center',
          }}
          {...props}
        >
          {children}
        </select>
      )}
    </Wrapper>
  );
}

type TextAreaFieldProps = { label: string; error?: string } & Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'id'>;

export function TextAreaField({ label, error, className, ...props }: TextAreaFieldProps) {
  return (
    <Wrapper label={label} error={error}>
      {({ id, describedBy, invalid }) => (
        <textarea
          id={id}
          aria-invalid={invalid || undefined}
          aria-describedby={describedBy}
          className={cn(control, 'resize-y', invalid ? 'border-wine' : 'border-rule-strong', className)}
          {...props}
        />
      )}
    </Wrapper>
  );
}
