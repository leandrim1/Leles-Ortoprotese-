import { SectionHeading } from '@/components/ui/SectionHeading';
import techImage from '@/assets/gallery/modelo-3d-banda.webp';
import techImageSmall from '@/assets/gallery/modelo-3d-banda-sm.webp';
import techDetail from '@/assets/gallery/aparelho-contencao.webp';
import techDetailSmall from '@/assets/gallery/aparelho-contencao-sm.webp';

/**
 * Única seção escura da página. O vinho aparece aqui em área cheia,
 * para separar o bloco técnico do restante do conteúdo em papel claro.
 */
export function Technology() {
  return (
    <section
      id="tecnologia"
      aria-labelledby="tecnologia-title"
      className="on-dark bg-wine-deep py-16 text-white lg:py-24"
    >
      <div className="container">
        <SectionHeading
          id="tecnologia-title"
          index="03"
          label="Fluxo digital"
          title="Planejamento digital e impressão 3D"
          tone="light"
          intro="Parte dos casos é trabalhada em ambiente digital antes de ir para a produção. Os modelos impressos servem para montar a peça e conferir a adaptação."
        />

        <div className="mt-12 grid gap-8 lg:grid-cols-12 lg:gap-10">
          <figure className="lg:col-span-7">
            <img
              src={techImage}
              srcSet={`${techImageSmall} 760w, ${techImage} 1200w`}
              sizes="(min-width: 1024px) 700px, 100vw"
              alt="Modelo odontológico impresso em 3D com peça metálica adaptada."
              width={1200}
              height={800}
              loading="lazy"
              decoding="async"
              className="aspect-[3/2] w-full bg-wine-dark object-cover"
            />
            <figcaption className="mt-3 text-meta text-white/55">
              Peça metálica adaptada sobre modelo impresso.
            </figcaption>
          </figure>

          <div className="lg:col-span-5">
            <figure>
              <img
                src={techDetail}
                srcSet={`${techDetailSmall} 760w, ${techDetail} 1200w`}
                sizes="(min-width: 1024px) 480px, 100vw"
                alt="Aparelho em fio metálico montado sobre modelo impresso em 3D."
                width={1200}
                height={1200}
                loading="lazy"
                decoding="async"
                className="aspect-square w-full bg-wine-dark object-cover"
              />
            </figure>

            <p className="mt-6 max-w-measure text-body text-white/70">
              O que define o fluxo é o serviço: alguns trabalhos passam pelo digital do começo ao fim, outros
              seguem o caminho convencional. Em ambos os casos a peça é conferida sobre o modelo antes de sair
              do laboratório.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
