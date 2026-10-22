import { WHATSAPP_PHONE } from '@/data/site';
import type { ContactFormValues } from '@/types';

/** Monta a URL oficial do WhatsApp com uma mensagem opcional já preenchida. */
export function buildWhatsAppUrl(message?: string): string {
  const base = `https://api.whatsapp.com/send?phone=${WHATSAPP_PHONE}`;
  return message ? `${base}&text=${encodeURIComponent(message)}` : base;
}

/** Mensagem padrão do botão "Solicitar orçamento". */
export const quoteMessage =
  'Olá! Gostaria de solicitar um orçamento com o Lab Leles. Poderia me passar mais informações?';

/** Mensagem de consulta sobre um serviço específico. */
export function serviceMessage(serviceName: string): string {
  return `Olá! Gostaria de consultar o serviço de ${serviceName} do Lab Leles.`;
}

/** Converte os dados do formulário visual em uma mensagem para revisão no WhatsApp. */
export function contactFormMessage(values: ContactFormValues): string {
  const lines = [
    'Olá! Entro em contato pelo site do Lab Leles.',
    '',
    `Nome: ${values.name.trim()}`,
    values.clinic.trim() ? `Clínica/Laboratório: ${values.clinic.trim()}` : null,
    `Telefone: ${values.phone.trim()}`,
    `E-mail: ${values.email.trim()}`,
    `Serviço de interesse: ${values.service}`,
    '',
    'Mensagem:',
    values.message.trim(),
  ].filter((line): line is string => line !== null);

  return lines.join('\n');
}
