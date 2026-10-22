import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/ui/Reveal';
import { pillars } from '@/data/content';
import aboutPrimary from '@/assets/gallery/impressao-3d-expansor.webp';
import aboutPrimarySmall from '@/assets/gallery/impressao-3d-expansor-sm.webp';
import aboutSecondary from '@/assets/gallery/proteses-resina.webp';
import aboutSecondarySmall from '@/assets/gallery/proteses-resina-sm.webp';

export function About() {
  return (
    <section id="laboratorio" aria-labelledby="laboratorio-title" className="section-padding bg-white">
      <div className="container">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Composição fotográfica */}
          <Reveal className="order-2 lg:order-1">
            <div className="relative mx-auto max-w-lg lg:mx-0">
              <div className="overflow-hidden rounded-3xl shadow-card">
                <img
                  src={aboutPrimary}
                  srcSet={`${aboutPrimarySmall} 760w, ${aboutPrimary} 1200w`}
                  sizes="(min-width: 1024px) 480px, 90vw"
                  alt="Modelos odontológicos impressos em 3D com aparelho expansor instalado."
                  width={1200}
                  height={1200}
                  loading="lazy"
                  decoding="async"
                  className="aspect-[4/3] w-full object-cover transition-transform duration-700 hover:scale-[1.03]"
                />
              </div>

              <div className="absolute -bottom-10 -right-2 w-40 overflow-hidden rounded-2xl border-4 border-white shadow-card-hover sm:-right-8 sm:w-52">
                <img
                  src={aboutSecondarySmall}
                  srcSet={`${aboutSecondarySmall} 760w, ${aboutSecondary} 1200w`}
                  sizes="208px"
                  alt="Peças em resina e acrílico finalizadas sobre modelos odontológicos."
                  width={760}
                  height={760}
                  loading="lazy"
                  decoding="async"
                  className="aspect-square w-full object-cover"
                />
              </div>

              <div
                className="absolute -left-4 -top-4 h-24 w-24 rounded-2xl border-2 border-wine/20 sm:-left-6 sm:-top-6"
                aria-hidden="true"
              />
            </div>
          </Reveal>

          {/* Texto institucional */}
          <div className="order-1 lg:order-2">
            <Reveal>
              <SectionHeading
                id="laboratorio-title"
                eyebrow="O Laboratório"
                title="Tecnologia e precisão a serviço da odontologia."
                align="left"
                description="O Lab Leles é um laboratório especializado em soluções protéticas, unindo conhecimento técnico, tecnologia digital e atenção aos detalhes. Com sede em Patos de Minas, atendemos profissionais que buscam qualidade, precisão e parceria em cada trabalho."
              />
            </Reveal>

            <ul className="mt-10 space-y-5">
              {pillars.map((pillar, index) => {
                const Icon = pillar.icon;

                return (
                  <Reveal as="li" key={pillar.id} delay={index * 90}>
                    <div className="flex gap-4 rounded-2xl border border-steel/40 bg-steel-light/40 p-5 transition-colors duration-300 hover:border-wine/30 hover:bg-wine-tint">
                      <span
                        className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-wine text-white"
                        aria-hidden="true"
                      >
                        <Icon className="h-5 w-5" />
                      </span>
                      <div>
                        <h3 className="font-display text-base font-semibold">{pillar.title}</h3>
                        <p className="mt-1.5 text-sm leading-relaxed text-graphite/70">{pillar.description}</p>
                      </div>
                    </div>
                  </Reveal>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
