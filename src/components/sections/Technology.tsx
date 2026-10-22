import { Box, Cpu, Layers, Printer } from 'lucide-react';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/ui/Reveal';
import { technologyHighlights } from '@/data/content';
import techPrimary from '@/assets/gallery/modelo-3d-banda.webp';
import techPrimarySmall from '@/assets/gallery/modelo-3d-banda-sm.webp';
import techSecondary from '@/assets/gallery/aparelho-contencao.webp';
import techSecondarySmall from '@/assets/gallery/aparelho-contencao-sm.webp';

const ICONS = [Cpu, Box, Printer, Layers];

export function Technology() {
  return (
    <section
      id="tecnologia"
      aria-labelledby="tecnologia-title"
      className="on-wine section-padding relative overflow-hidden bg-graphite text-white"
    >
      <div className="absolute inset-0 grid-texture opacity-70" aria-hidden="true" />
      <div
        className="pointer-events-none absolute -left-40 top-1/4 h-96 w-96 rounded-full bg-wine/35 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -right-32 bottom-0 h-80 w-80 rounded-full bg-wine-soft/20 blur-3xl"
        aria-hidden="true"
      />

      <div className="container relative">
        <div className="grid gap-14 lg:grid-cols-2 lg:items-center lg:gap-16">
          <div>
            <Reveal>
              <SectionHeading
                id="tecnologia-title"
                eyebrow="Tecnologia"
                title="Planejamento digital e impressão 3D"
                tone="light"
                align="left"
                description="Parte dos casos é trabalhada em ambiente digital antes de ir para a produção. Os modelos impressos servem para montar a peça e conferir a adaptação."
              />
            </Reveal>

            <ul className="mt-10 grid gap-4 sm:grid-cols-2">
              {technologyHighlights.map((item, index) => {
                const Icon = ICONS[index % ICONS.length];

                return (
                  <Reveal as="li" key={item.id} delay={index * 80} className="h-full">
                    <div className="h-full rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-sm transition-colors duration-300 hover:border-white/30 hover:bg-white/[0.08]">
                      <span
                        className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-wine text-white"
                        aria-hidden="true"
                      >
                        <Icon className="h-5 w-5" />
                      </span>
                      <h3 className="mt-4 font-display text-sm font-semibold text-white">{item.title}</h3>
                      <p className="mt-2 text-xs leading-relaxed text-steel/80">{item.description}</p>
                    </div>
                  </Reveal>
                );
              })}
            </ul>
          </div>

          {/* Composição visual técnica */}
          <Reveal delay={100}>
            <div className="relative mx-auto max-w-md lg:ml-auto lg:mr-0 lg:max-w-lg">
              <div className="overflow-hidden rounded-3xl ring-1 ring-white/15">
                <img
                  src={techPrimary}
                  srcSet={`${techPrimarySmall} 760w, ${techPrimary} 1200w`}
                  sizes="(min-width: 1024px) 480px, 90vw"
                  alt="Modelo odontológico impresso em 3D com peça metálica adaptada."
                  width={1200}
                  height={954}
                  loading="lazy"
                  decoding="async"
                  className="aspect-[4/3] w-full object-cover"
                />
              </div>

              <div className="mt-4 grid grid-cols-5 gap-4">
                <div className="col-span-3 overflow-hidden rounded-2xl ring-1 ring-white/15">
                  <img
                    src={techSecondarySmall}
                    srcSet={`${techSecondarySmall} 760w, ${techSecondary} 1200w`}
                    sizes="(min-width: 1024px) 288px, 54vw"
                    alt="Aparelho em fio metálico montado sobre modelo impresso em 3D."
                    width={760}
                    height={570}
                    loading="lazy"
                    decoding="async"
                    className="aspect-[4/3] w-full object-cover"
                  />
                </div>

                <div className="col-span-2 flex flex-col justify-center rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-center">
                  <p className="font-display text-2xl font-bold text-white">3D</p>
                  <p className="mt-1 text-[0.625rem] font-semibold uppercase tracking-[0.14em] text-steel/80">
                    Modelos impressos no fluxo do laboratório
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
