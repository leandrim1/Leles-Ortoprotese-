import type { ContactFormErrors, ContactFormValues } from '@/types';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Remove tudo que não for dígito, para conferir o tamanho do telefone. */
export function digitsOnly(value: string): string {
  return value.replace(/\D/g, '');
}

/** Formata progressivamente um telefone brasileiro: (34) 99975-3818. */
export function formatPhone(value: string): string {
  const digits = digitsOnly(value).slice(0, 11);

  if (digits.length <= 2) return digits;
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

/** Valida os campos do formulário visual de contato. */
export function validateContactForm(values: ContactFormValues): ContactFormErrors {
  const errors: ContactFormErrors = {};

  if (values.name.trim().length < 3) {
    errors.name = 'Informe seu nome completo.';
  }

  const phoneDigits = digitsOnly(values.phone);
  if (phoneDigits.length < 10 || phoneDigits.length > 11) {
    errors.phone = 'Informe um telefone com DDD, por exemplo (34) 99975-3818.';
  }

  if (!EMAIL_PATTERN.test(values.email.trim())) {
    errors.email = 'Informe um e-mail válido.';
  }

  if (!values.service) {
    errors.service = 'Selecione o serviço de interesse.';
  }

  if (values.message.trim().length < 10) {
    errors.message = 'Descreva o trabalho em pelo menos 10 caracteres.';
  }

  return errors;
}
