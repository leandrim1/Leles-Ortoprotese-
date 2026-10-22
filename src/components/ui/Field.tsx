import { useId } from 'react';
import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react';
import { AlertCircle } from 'lucide-react';
import { cn } from '@/utils/cn';

const controlClass =
  'w-full rounded-xl border bg-white px-4 py-3 text-sm text-graphite transition ' +
  'placeholder:text-graphite/65 focus:border-wine focus:outline-none focus:ring-2 focus:ring-wine/25';

interface FieldWrapperProps {
  label: string;
  error?: string;
  optional?: boolean;
  children: (props: { id: string; describedBy: string | undefined; invalid: boolean }) => ReactNode;
}

function FieldWrapper({ label, error, optional, children }: FieldWrapperProps) {
  const id = useId();
  const errorId = `${id}-error`;

  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-medium text-graphite">
        {label}
        {optional && <span className="ml-1.5 font-normal text-graphite/70">(opcional)</span>}
      </label>

      {children({ id, describedBy: error ? errorId : undefined, invalid: Boolean(error) })}

      {error && (
        <p id={errorId} role="alert" className="mt-2 flex items-start gap-1.5 text-xs font-medium text-wine">
          <AlertCircle className="mt-px h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          {error}
        </p>
      )}
    </div>
  );
}

type TextFieldProps = {
  label: string;
  error?: string;
  optional?: boolean;
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'id'>;

export function TextField({ label, error, optional, className, ...props }: TextFieldProps) {
  return (
    <FieldWrapper label={label} error={error} optional={optional}>
      {({ id, describedBy, invalid }) => (
        <input
          id={id}
          aria-invalid={invalid || undefined}
          aria-describedby={describedBy}
          className={cn(controlClass, invalid ? 'border-wine' : 'border-steel/60', className)}
          {...props}
        />
      )}
    </FieldWrapper>
  );
}

type SelectFieldProps = {
  label: string;
  error?: string;
  optional?: boolean;
  children: ReactNode;
} & Omit<SelectHTMLAttributes<HTMLSelectElement>, 'id'>;

export function SelectField({ label, error, optional, className, children, ...props }: SelectFieldProps) {
  return (
    <FieldWrapper label={label} error={error} optional={optional}>
      {({ id, describedBy, invalid }) => (
        <select
          id={id}
          aria-invalid={invalid || undefined}
          aria-describedby={describedBy}
          className={cn(controlClass, 'appearance-none pr-10', invalid ? 'border-wine' : 'border-steel/60', className)}
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2325272B' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")",
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right 1rem center',
          }}
          {...props}
        >
          {children}
        </select>
      )}
    </FieldWrapper>
  );
}

type TextAreaFieldProps = {
  label: string;
  error?: string;
  optional?: boolean;
} & Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'id'>;

export function TextAreaField({ label, error, optional, className, ...props }: TextAreaFieldProps) {
  return (
    <FieldWrapper label={label} error={error} optional={optional}>
      {({ id, describedBy, invalid }) => (
        <textarea
          id={id}
          aria-invalid={invalid || undefined}
          aria-describedby={describedBy}
          className={cn(controlClass, 'resize-y', invalid ? 'border-wine' : 'border-steel/60', className)}
          {...props}
        />
      )}
    </FieldWrapper>
  );
}
