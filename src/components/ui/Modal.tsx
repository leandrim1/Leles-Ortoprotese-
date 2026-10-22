import { useCallback, useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { X } from 'lucide-react';
import { useLockBodyScroll } from '@/hooks/useLockBodyScroll';

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** Rótulo acessível do diálogo. */
  label: string;
  children: ReactNode;
}

/** Diálogo acessível com foco preso, fechamento por Esc e clique no fundo. */
export function Modal({ isOpen, onClose, label, children }: ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  useLockBodyScroll(isOpen);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== 'Tab' || !dialogRef.current) return;

      const focusable = Array.from(dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    },
    [onClose],
  );

  useEffect(() => {
    if (!isOpen) return;

    previouslyFocused.current = document.activeElement as HTMLElement | null;
    document.addEventListener('keydown', handleKeyDown);

    // Dá foco ao diálogo para que leitores de tela anunciem o conteúdo.
    const frame = window.requestAnimationFrame(() => {
      dialogRef.current?.querySelector<HTMLElement>(FOCUSABLE)?.focus();
    });

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      window.cancelAnimationFrame(frame);
      previouslyFocused.current?.focus();
    };
  }, [handleKeyDown, isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center p-4 sm:p-6"
      role="presentation"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="absolute inset-0 animate-fade-in bg-graphite/85 backdrop-blur-sm" aria-hidden="true" />

      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={label}
        className="relative z-10 flex max-h-[90vh] w-full max-w-4xl animate-scale-in flex-col"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar visualização"
          className="absolute -top-2 right-0 z-20 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition hover:bg-white/25 sm:-top-12 sm:right-0"
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>

        {children}
      </div>
    </div>
  );
}
