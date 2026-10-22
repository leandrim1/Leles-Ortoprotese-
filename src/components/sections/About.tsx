import { SectionHeading } from '@/components/ui/SectionHeading';
import { practices } from '@/data/content';
import aboutImage from '@/assets/gallery/impressao-3d-expansor.webp';
import aboutImageSmall from '@/assets/gallery/impressao-3d-expansor-sm.webp';

export function About() {
  return (
    <section id="laboratorio" aria-labelledby="laboratorio-title" className="py-16 lg:py-24">
      <div className="container">
        <SectionHeading
          id="laboratorio-title"
          index="01"
          label="O laboratório"
          title="Um laboratório de prótese em Patos de Minas"
          intro="Atendemos dentistas e clínicas da cidade e de outras regiões do país. O trabalho chega por indicação do profissional e volta pronto para a consulta."
        />

        <div className="mt-12 grid gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Lista de práticas, separada por réguas em vez de cards */}
          <dl className="lg:col-span-7">
            {practices.map((practice, index) => (
              <div
                key={practice.id}
                className={`grid gap-x-8 gap-y-2 border-t border-rule py-6 sm:grid-cols-12 ${
                  index === practices.length - 1 ? 'border-b' : ''
                }`}
              >
                <dt className="text-h4 sm:col-span-5">{practice.title}</dt>
                <dd className="max-w-measure text-body text-ink-soft sm:col-span-7">{practice.description}</dd>
              </div>
            ))}
          </dl>

          <figure className="lg:col-span-5">
            <img
              src={aboutImage}
              srcSet={`${aboutImageSmall} 760w, ${aboutImage} 1200w`}
              sizes="(min-width: 1024px) 420px, 100vw"
              alt="Modelos odontológicos impressos em 3D com aparelho expansor instalado."
              width={1200}
              height={1200}
              loading="lazy"
              decoding="async"
              className="aspect-square w-full bg-paper-dim object-cover"
            />
            <figcaption className="mt-3 text-meta text-ink-faint">
              Modelos impressos com aparelho instalado, antes da conferência.
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
