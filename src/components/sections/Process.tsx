import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/ui/Reveal';
import { processSteps } from '@/data/content';

export function Process() {
  return (
    <section id="como-trabalhamos" aria-labelledby="como-trabalhamos-title" className="section-padding bg-white">
      <div className="container">
        <Reveal>
          <SectionHeading
            id="como-trabalhamos-title"
            eyebrow="Como trabalhamos"
            title="Do primeiro contato à entrega"
            description="O caminho é o mesmo para todos os serviços. O que muda de um trabalho para outro é o fluxo técnico da produção."
          />
        </Reveal>

        <ol className="relative mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {/* Linha de conexão entre as etapas, apenas no desktop */}
          <div
            className="pointer-events-none absolute left-0 right-0 top-[3.25rem] hidden h-px bg-gradient-to-r from-transparent via-steel/60 to-transparent lg:block"
            aria-hidden="true"
          />

          {processSteps.map((step, index) => {
            const Icon = step.icon;

            return (
              <Reveal as="li" key={step.id} delay={index * 100} className="relative h-full">
                <div className="flex h-full flex-col rounded-2xl border border-steel/40 bg-white p-6 text-center shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-wine/30 hover:shadow-card-hover">
                  <span
                    className="mx-auto inline-flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-2xl bg-wine-gradient text-white shadow-wine"
                    aria-hidden="true"
                  >
                    <Icon className="h-7 w-7" />
                  </span>

                  <span className="mx-auto mt-5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-wine-tint font-display text-xs font-bold text-wine">
                    {step.step}
                  </span>

                  <h3 className="mt-3 font-display text-base font-semibold">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-graphite/70">{step.description}</p>
                </div>
              </Reveal>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
