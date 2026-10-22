import { ArrowRight } from 'lucide-react';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { services } from '@/data/services';
import { buildWhatsAppUrl, serviceMessage } from '@/utils/whatsapp';

export function Services() {
  return (
    <section id="servicos" aria-labelledby="servicos-title" className="bg-paper-dim py-16 lg:py-24">
      <div className="container">
        <SectionHeading
          id="servicos-title"
          index="02"
          label="Serviços"
          title="O que o laboratório executa"
          intro="Cinco frentes de trabalho. Materiais, prazos e detalhes técnicos são combinados caso a caso, direto com o laboratório."
        />

        {/* Índice de serviços: linhas numeradas, sem cards nem ícones */}
        <ul className="mt-12">
          {services.map((service) => (
            <li key={service.id} className="border-t border-rule-strong last:border-b">
              <a
                href={buildWhatsAppUrl(serviceMessage(service.name))}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Consultar o serviço de ${service.name} pelo WhatsApp`}
                className="group block py-6 transition-colors hover:bg-paper sm:grid sm:grid-cols-12 sm:items-center sm:gap-x-8 lg:py-7"
              >
                <span className="label block text-wine sm:col-span-1">{service.index}</span>

                <span className="mt-3 block sm:col-span-5 sm:mt-0">
                  <span className="block text-h3 transition-colors group-hover:text-wine">{service.name}</span>
                  <span className="mt-2 block max-w-measure text-body text-ink-soft">{service.description}</span>
                </span>

                <img
                  src={service.imageSmall}
                  alt={service.imageAlt}
                  width={760}
                  height={507}
                  loading="lazy"
                  decoding="async"
                  className="mt-5 aspect-[16/9] w-full bg-paper-deep object-cover sm:col-span-4 sm:mt-0 sm:aspect-[3/2]"
                />

                <span className="mt-4 flex items-center gap-2 text-meta font-medium text-ink-soft transition-colors group-hover:text-wine sm:col-span-2 sm:mt-0 sm:justify-end">
                  Consultar
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
