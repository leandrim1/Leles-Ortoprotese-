import { Instagram, MapPin, MessageCircle, Navigation } from 'lucide-react';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/ui/Reveal';
import { ContactForm } from './ContactForm';
import { Hours } from './Hours';
import { site } from '@/data/site';
import { buildWhatsAppUrl, quoteMessage } from '@/utils/whatsapp';

const channels = [
  {
    id: 'whatsapp',
    label: 'WhatsApp',
    value: site.phoneDisplay,
    href: buildWhatsAppUrl(quoteMessage),
    icon: MessageCircle,
    action: 'Conversar pelo WhatsApp',
  },
  {
    id: 'instagram',
    label: 'Instagram',
    value: site.instagramHandle,
    href: site.instagramUrl,
    icon: Instagram,
    action: 'Visitar o Instagram',
  },
  {
    id: 'endereco',
    label: 'Endereço',
    value: `${site.address.street} — ${site.address.district}, ${site.address.city}/${site.address.state}`,
    href: site.mapsUrl,
    icon: MapPin,
    action: 'Abrir no Google Maps',
  },
] as const;

export function Contact() {
  return (
    <section id="contato" aria-labelledby="contato-title" className="section-padding bg-steel-light/60">
      <div className="container">
        <Reveal>
          <SectionHeading
            id="contato-title"
            eyebrow="Contato"
            title="Vamos conversar sobre seu próximo trabalho?"
            description="Entre em contato com o Lab Leles para consultar nossos serviços e alinhar as necessidades do seu laboratório ou consultório."
          />
        </Reveal>

        <div className="mt-14 grid gap-8 lg:grid-cols-12 lg:gap-10">
          {/* Canais oficiais e horários */}
          <div className="space-y-6 lg:col-span-5">
            <Reveal>
              <ul className="space-y-4">
                {channels.map((channel) => {
                  const Icon = channel.icon;

                  return (
                    <li key={channel.id}>
                      <a
                        href={channel.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={channel.action}
                        className="group flex items-center gap-4 rounded-2xl border border-steel/40 bg-white p-5 shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:border-wine/30 hover:shadow-card-hover"
                      >
                        <span
                          className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-wine text-white"
                          aria-hidden="true"
                        >
                          <Icon className="h-5 w-5" />
                        </span>

                        <span className="min-w-0 flex-1">
                          <span className="block text-[0.625rem] font-semibold uppercase tracking-[0.14em] text-graphite/70">
                            {channel.label}
                          </span>
                          <span className="mt-1 block text-sm font-medium leading-snug text-graphite">
                            {channel.value}
                          </span>
                        </span>

                        <Navigation
                          className="h-4 w-4 shrink-0 text-steel transition-colors duration-300 group-hover:text-wine"
                          aria-hidden="true"
                        />
                      </a>
                    </li>
                  );
                })}
              </ul>
            </Reveal>

            <Hours />
          </div>

          {/* Formulário visual */}
          <Reveal delay={120} className="lg:col-span-7">
            <ContactForm />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
