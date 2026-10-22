import { LinkButton, Button } from '@/components/ui/Button';
import heroImage from '@/assets/gallery/ortodontia-digital.webp';
import heroImageSmall from '@/assets/gallery/ortodontia-digital-sm.webp';
import { services } from '@/data/services';
import { site } from '@/data/site';
import { buildWhatsAppUrl, quoteMessage } from '@/utils/whatsapp';
import { scrollToSection } from '@/utils/scroll';

export function Hero() {
  return (
    <section id="inicio" aria-labelledby="hero-title" className="border-b border-rule">
      <div className="container">
        <div className="grid items-start gap-10 pb-12 pt-28 lg:grid-cols-12 lg:gap-12 lg:pb-16 lg:pt-36">
          {/* Texto */}
          <div className="lg:col-span-7">
            <p className="label text-ink-faint">
              Laboratório de prótese dentária
              <span className="mx-2 text-rule-strong">/</span>
              {site.city} — {site.state}
            </p>

            <h1 id="hero-title" className="mt-6 max-w-[14ch] text-h1 lg:text-h1-lg">
              Prótese dentária feita caso a caso.
            </h1>

            <p className="mt-6 max-w-measure text-lead text-ink-soft">
              O Lab Leles confecciona aparelhos, placas e peças protéticas a partir dos modelos e do
              planejamento enviados pelo dentista responsável pelo caso.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-4 lg:mt-10">
              <LinkButton
                href={buildWhatsAppUrl(quoteMessage)}
                external
                aria-label="Solicitar orçamento pelo WhatsApp"
              >
                Solicitar orçamento
              </LinkButton>

              <Button variant="quiet" onClick={() => scrollToSection('servicos')}>
                Ver os serviços
              </Button>
            </div>

            {/* Índice de serviços: informação concreta no lugar de espaço vazio */}
            <ul className="mt-12 lg:mt-16">
              {services.map((service) => (
                <li key={service.id} className="border-t border-rule last:border-b">
                  <a
                    href={`#servicos`}
                    onClick={(event) => {
                      event.preventDefault();
                      scrollToSection('servicos');
                    }}
                    className="group flex items-baseline gap-4 py-2.5 text-meta text-ink-soft transition-colors hover:text-wine"
                  >
                    <span className="label text-ink-faint transition-colors group-hover:text-wine">
                      {service.index}
                    </span>
                    {service.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Imagem: começa acima da linha do texto e desce abaixo dela */}
          <div className="lg:col-span-5 lg:-mt-16">
            <img
              src={heroImage}
              srcSet={`${heroImageSmall} 760w, ${heroImage} 1200w`}
              sizes="(min-width: 1024px) 440px, 100vw"
              alt="Modelo odontológico impresso em 3D com estrutura metálica de ortodontia fixa adaptada, produzido no Lab Leles."
              width={1200}
              height={1500}
              loading="eager"
              fetchPriority="high"
              decoding="async"
              className="aspect-[4/5] w-full bg-paper-dim object-cover"
            />
            <p className="mt-3 text-meta text-ink-faint">
              Ortodontia fixa adaptada sobre modelo impresso.
            </p>
          </div>
        </div>
      </div>

    </section>
  );
}
