import { useState } from 'react';
import type { FormEvent } from 'react';
import { Info, MessageCircle, Send } from 'lucide-react';
import { Button, LinkButton } from '@/components/ui/Button';
import { SelectField, TextAreaField, TextField } from '@/components/ui/Field';
import { services } from '@/data/services';
import { buildWhatsAppUrl, contactFormMessage } from '@/utils/whatsapp';
import { formatPhone, validateContactForm } from '@/utils/validation';
import type { ContactFormErrors, ContactFormValues } from '@/types';

const EMPTY_FORM: ContactFormValues = {
  name: '',
  clinic: '',
  phone: '',
  email: '',
  service: '',
  message: '',
};

/**
 * Formulário visual de contato.
 * Nesta etapa o envio não é integrado a nenhum servidor: os dados ficam apenas
 * no navegador e podem ser usados para montar uma mensagem no WhatsApp.
 */
export function ContactForm() {
  const [values, setValues] = useState<ContactFormValues>(EMPTY_FORM);
  const [errors, setErrors] = useState<ContactFormErrors>({});
  const [isValidated, setIsValidated] = useState(false);

  const updateField = <K extends keyof ContactFormValues>(field: K, value: ContactFormValues[K]) => {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setIsValidated(false);
  };

  const runValidation = (): boolean => {
    const validationErrors = validateContactForm(values);
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsValidated(runValidation());
  };

  const handleWhatsAppHandoff = () => {
    if (!runValidation()) {
      setIsValidated(false);
      return;
    }

    setIsValidated(true);
    window.open(buildWhatsAppUrl(contactFormMessage(values)), '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="rounded-2xl border border-steel/40 bg-white p-6 shadow-card sm:p-8">
      <h3 className="font-display text-xl font-semibold">Enviar um caso</h3>
      <p className="mt-2 text-sm leading-relaxed text-graphite/70">
        Preencha os campos e o site monta a mensagem no WhatsApp para você revisar antes de enviar. Nada é
        gravado aqui.
      </p>

      <form onSubmit={handleSubmit} noValidate className="mt-7 space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField
            label="Nome"
            name="name"
            autoComplete="name"
            placeholder="Nome completo"
            value={values.name}
            error={errors.name}
            onChange={(event) => updateField('name', event.target.value)}
            required
          />

          <TextField
            label="Clínica ou laboratório"
            name="clinic"
            autoComplete="organization"
            placeholder="Opcional"
            optional
            value={values.clinic}
            onChange={(event) => updateField('clinic', event.target.value)}
          />

          <TextField
            label="Telefone"
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="(34) 99975-3818"
            value={values.phone}
            error={errors.phone}
            onChange={(event) => updateField('phone', formatPhone(event.target.value))}
            required
          />

          <TextField
            label="E-mail"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="nome@clinica.com.br"
            value={values.email}
            error={errors.email}
            onChange={(event) => updateField('email', event.target.value)}
            required
          />
        </div>

        <SelectField
          label="Serviço de interesse"
          name="service"
          value={values.service}
          error={errors.service}
          onChange={(event) => updateField('service', event.target.value)}
          required
        >
          <option value="">Selecione um serviço</option>
          {services.map((service) => (
            <option key={service.id} value={service.name}>
              {service.name}
            </option>
          ))}
          <option value="Outro serviço">Outro serviço</option>
        </SelectField>

        <TextAreaField
          label="Mensagem"
          name="message"
          rows={4}
          placeholder="Conte o que precisa ser feito."
          value={values.message}
          error={errors.message}
          onChange={(event) => updateField('message', event.target.value)}
          required
        />

        {/* Aviso permanente sobre o estado do formulário nesta etapa */}
        <p className="flex items-start gap-2.5 rounded-xl border border-steel/50 bg-steel-light/60 p-4 text-xs leading-relaxed text-graphite/70">
          <Info className="mt-px h-4 w-4 shrink-0 text-wine" aria-hidden="true" />
          <span>
            Este formulário é apenas visual. Os dados não são enviados nem armazenados em nenhum servidor. Use o
            botão do WhatsApp para montar a mensagem e revisá-la antes de enviar.
          </span>
        </p>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button type="submit" variant="ghost" size="lg" className="sm:flex-1">
            <Send className="h-4 w-4" aria-hidden="true" />
            Validar dados
          </Button>

          <Button type="button" size="lg" className="sm:flex-1" onClick={handleWhatsAppHandoff}>
            <MessageCircle className="h-5 w-5" aria-hidden="true" />
            Montar mensagem no WhatsApp
          </Button>
        </div>

        <div aria-live="polite" className="min-h-[1.25rem]">
          {isValidated && (
            <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs leading-relaxed text-emerald-800">
              Dados validados. O envio automático ainda não foi configurado — abra o WhatsApp pelo botão acima ou
              fale diretamente com o laboratório.
            </p>
          )}

          {!isValidated && Object.keys(errors).length > 0 && (
            <p className="rounded-xl border border-wine/25 bg-wine-tint px-4 py-3 text-xs leading-relaxed text-wine">
              Revise os campos destacados para continuar.
            </p>
          )}
        </div>
      </form>

      <p className="mt-6 border-t border-steel/40 pt-5 text-xs text-graphite/70">
        Prefere falar agora?{' '}
        <LinkButton
          href={buildWhatsAppUrl()}
          external
          variant="ghost"
          size="sm"
          className="ml-1 border-0 px-0 text-wine underline underline-offset-4 hover:text-wine-deep"
        >
          Abrir conversa no WhatsApp
        </LinkButton>
      </p>
    </div>
  );
}
