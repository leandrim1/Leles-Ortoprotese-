import { SectionHeading } from '@/components/ui/SectionHeading';
import { ContactForm } from './ContactForm';
import { Hours } from './Hours';
import { site } from '@/data/site';
import { buildWhatsAppUrl, quoteMessage } from '@/utils/whatsapp';

const channels = [
  { id: 'whatsapp', label: 'WhatsApp', value: site.phoneDisplay, href: buildWhatsAppUrl(quoteMessage) },
  { id: 'instagram', label: 'Instagram', value: site.instagramHandle, href: site.instagramUrl },
  {
    id: 'endereco',
    label: 'Endereço',
    value: `${site.address.street}, ${site.address.district} · ${site.address.city} — ${site.address.state}`,
    href: site.mapsUrl,
  },
] as const;

export function Contact() {
  return (
    <section id="contato" aria-labelledby="contato-title" className="bg-paper-dim py-16 lg:py-24">
      <div className="container">
        <SectionHeading
          id="contato-title"
          index="07"
          label="Contato"
          title="Fale com o laboratório"
          intro="O caminho mais rápido é o WhatsApp. Se preferir, use o formulário e a mensagem é montada para você."
        />

        <div className="mt-12 grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <h3 className="label border-t border-ink/85 pt-5 text-ink-faint">Canais</h3>

            <dl className="mt-5">
              {channels.map((channel) => (
                <div key={channel.id} className="border-b border-rule py-4">
                  <dt className="text-meta text-ink-faint">{channel.label}</dt>
                  <dd className="mt-1">
                    <a
                      href={channel.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-body text-ink underline decoration-rule-strong underline-offset-4 transition-colors hover:text-wine hover:decoration-wine"
                    >
                      {channel.value}
                    </a>
                  </dd>
                </div>
              ))}
            </dl>

            <div className="mt-12">
              <Hours />
            </div>
          </div>

          <div className="lg:col-span-7">
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}
