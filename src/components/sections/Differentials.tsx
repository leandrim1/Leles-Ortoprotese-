import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/ui/Reveal';
import { differentials } from '@/data/content';

export function Differentials() {
  return (
    <section aria-labelledby="diferenciais-title" className="section-padding relative overflow-hidden bg-white">
      <div className="absolute inset-0 grid-texture-light" aria-hidden="true" />

      <div className="container relative">
        <Reveal>
          <SectionHeading
            id="diferenciais-title"
            eyebrow="Diferenciais"
            title="Como o laboratório trabalha"
          />
        </Reveal>

        <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {differentials.map((item, index) => {
            const Icon = item.icon;

            return (
              <Reveal as="li" key={item.id} delay={index * 80} className="h-full">
                <div className="group relative h-full overflow-hidden rounded-2xl border border-steel/40 bg-white p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-wine/30 hover:shadow-card-hover">
                  <span
                    className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-wine-tint transition-transform duration-500 group-hover:scale-150"
                    aria-hidden="true"
                  />

                  <span
                    className="relative inline-flex h-12 w-12 items-center justify-center rounded-xl bg-wine text-white"
                    aria-hidden="true"
                  >
                    <Icon className="h-5 w-5" />
                  </span>

                  <h3 className="relative mt-5 font-display text-base font-semibold">{item.title}</h3>
                  <p className="relative mt-2 text-sm leading-relaxed text-graphite/70">{item.description}</p>
                </div>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
