import { ArrowUpRight, Check } from 'lucide-react';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/ui/Reveal';
import { services } from '@/data/services';
import { buildWhatsAppUrl, serviceMessage } from '@/utils/whatsapp';

export function Services() {
  return (
    <section id="servicos" aria-labelledby="servicos-title" className="section-padding bg-steel-light/60">
      <div className="container">
        <Reveal>
          <SectionHeading
            id="servicos-title"
            eyebrow="Serviços"
            title="Soluções para diferentes necessidades clínicas."
            description="Trabalhos executados a partir do planejamento enviado pelo profissional responsável pelo caso."
          />
        </Reveal>

        <ul className="mt-14 flex flex-wrap justify-center gap-6">
          {services.map((service, index) => {
            const Icon = service.icon;

            return (
              <Reveal
                as="li"
                key={service.id}
                delay={index * 70}
                // Flex em vez de grid para que a última linha fique centralizada com 5 cards.
                className="w-full sm:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)]"
              >
                <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-steel/40 bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-wine/30 hover:shadow-card-hover">
                  <div className="relative aspect-[16/10] overflow-hidden bg-graphite">
                    <img
                      src={service.imageSmall}
                      srcSet={`${service.imageSmall} 760w, ${service.image} 1200w`}
                      sizes="(min-width: 1024px) 380px, (min-width: 640px) 45vw, 90vw"
                      alt={service.imageAlt}
                      width={760}
                      height={475}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div
                      className="pointer-events-none absolute inset-0 bg-gradient-to-t from-graphite/60 to-transparent"
                      aria-hidden="true"
                    />

                    <span
                      className="absolute left-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/95 text-wine shadow-sm backdrop-blur"
                      aria-hidden="true"
                    >
                      <Icon className="h-5 w-5" />
                    </span>

                    <span className="absolute bottom-3 left-4 text-[0.625rem] font-semibold uppercase tracking-[0.16em] text-white/90">
                      {service.tagline}
                    </span>
                  </div>

                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="font-display text-lg font-semibold">{service.name}</h3>
                    <p className="mt-2.5 text-sm leading-relaxed text-graphite/70">{service.description}</p>

                    <ul className="mt-4 space-y-2">
                      {service.highlights.map((highlight) => (
                        <li key={highlight} className="flex items-start gap-2 text-xs text-graphite/70">
                          <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-wine" aria-hidden="true" />
                          {highlight}
                        </li>
                      ))}
                    </ul>

                    <a
                      href={buildWhatsAppUrl(serviceMessage(service.name))}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Consultar o serviço de ${service.name} pelo WhatsApp`}
                      className="mt-6 inline-flex items-center gap-1.5 self-start rounded-full text-sm font-semibold text-wine transition-colors hover:text-wine-deep"
                    >
                      Consultar este serviço
                      <ArrowUpRight
                        className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        aria-hidden="true"
                      />
                    </a>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </ul>

        <Reveal delay={120}>
          <p className="mx-auto mt-10 max-w-2xl text-center text-xs leading-relaxed text-graphite/70">
            Materiais, prazos e especificações técnicas são definidos caso a caso, diretamente com o laboratório.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
