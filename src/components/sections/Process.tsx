import { SectionHeading } from '@/components/ui/SectionHeading';
import { processSteps } from '@/data/content';

export function Process() {
  return (
    <section id="como-trabalhamos" aria-labelledby="como-trabalhamos-title" className="py-16 lg:py-24">
      <div className="container">
        <SectionHeading
          id="como-trabalhamos-title"
          index="04"
          label="Como trabalhamos"
          title="Do primeiro contato à entrega"
          intro="O caminho é o mesmo para todos os serviços. O que muda de um trabalho para outro é o fluxo técnico da produção."
        />

        {/* Sequência numerada: régua contínua no topo, sem cards nem ícones */}
        <ol className="mt-12 grid gap-x-8 sm:grid-cols-2 lg:grid-cols-4">
          {processSteps.map((step) => (
            <li key={step.id} className="border-t border-ink/85 pt-5 max-sm:pb-6 sm:max-lg:[&:nth-child(-n+2)]:pb-10">
              <p className="label text-wine">{step.step}</p>
              <h3 className="mt-4 text-h4">{step.title}</h3>
              <p className="mt-2 max-w-measure-sm text-body text-ink-soft">{step.description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
