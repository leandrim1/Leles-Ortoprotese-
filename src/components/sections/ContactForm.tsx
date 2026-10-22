import { useState } from 'react';
import type { FormEvent } from 'react';
import { Button } from '@/components/ui/Button';
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
 * Formulário visual. Nesta etapa nada é enviado a um servidor: os dados ficam
 * no navegador e servem para montar a mensagem no WhatsApp.
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
    if (!runValidation()) {
      setIsValidated(false);
      return;
    }

    setIsValidated(true);
    window.open(buildWhatsAppUrl(contactFormMessage(values)), '_blank', 'noopener,noreferrer');
  };

  return (
    <div>
      <h3 className="label border-t border-ink/85 pt-5 text-ink-faint">Enviar um caso</h3>

      <p className="mt-5 max-w-measure text-body text-ink-soft">
        Preencha os campos e o site monta a mensagem no WhatsApp para você revisar antes de enviar. Nada é
        gravado aqui.
      </p>

      <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-6">
        <div className="grid gap-6 sm:grid-cols-2">
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
          label="Serviço"
          name="service"
          value={values.service}
          error={errors.service}
          onChange={(event) => updateField('service', event.target.value)}
          required
        >
          <option value="">Selecione</option>
          {services.map((service) => (
            <option key={service.id} value={service.name}>
              {service.name}
            </option>
          ))}
          <option value="Outro serviço">Outro serviço</option>
        </SelectField>

        <TextAreaField
          label="O caso"
          name="message"
          rows={4}
          placeholder="Conte o que precisa ser feito."
          value={values.message}
          error={errors.message}
          onChange={(event) => updateField('message', event.target.value)}
          required
        />

        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 pt-1">
          <Button type="submit">Abrir no WhatsApp</Button>
          <p className="text-meta text-ink-faint">O envio direto pelo site ainda não foi configurado.</p>
        </div>

        <div aria-live="polite" className="min-h-[1.25rem]">
          {isValidated && (
            <p className="text-meta text-wine">
              Mensagem montada. Revise no WhatsApp antes de enviar.
            </p>
          )}
          {!isValidated && Object.keys(errors).length > 0 && (
            <p className="text-meta text-wine">Revise os campos marcados.</p>
          )}
        </div>
      </form>
    </div>
  );
}
