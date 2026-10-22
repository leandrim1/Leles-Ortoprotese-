import { ArrowDown, MapPin, MessageCircle, Sparkles } from 'lucide-react';
import { LinkButton, Button } from '@/components/ui/Button';
import { Logo } from '@/components/ui/Logo';
import heroImage from '@/assets/gallery/ortodontia-digital.webp';
import heroImageSmall from '@/assets/gallery/ortodontia-digital-sm.webp';
import { buildWhatsAppUrl, quoteMessage } from '@/utils/whatsapp';
import { scrollToSection } from '@/utils/scroll';

export function Hero() {
  return (
    <section
      id="inicio"
      aria-labelledby="hero-title"
      className="on-wine relative overflow-hidden bg-wine-gradient pb-20 pt-32 text-white sm:pb-24 sm:pt-36 lg:pb-28 lg:pt-40"
    >
      {/* Elementos gráficos sutis: malha técnica e halos de luz */}
      <div className="absolute inset-0 grid-texture opacity-60" aria-hidden="true" />
      <div
        className="pointer-events-none absolute -right-32 -top-32 h-[28rem] w-[28rem] rounded-full bg-white/[0.07] blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-40 -left-24 h-96 w-96 rounded-full bg-wine-soft/30 blur-3xl"
        aria-hidden="true"
      />

      <div className="container relative">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-12">
          {/* Conteúdo */}
          <div className="lg:col-span-6 xl:col-span-6">
            <span className="eyebrow rounded-full border border-white/25 bg-white/5 px-4 py-2 text-steel backdrop-blur-sm">
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              Laboratório de prótese dentária
            </span>

            <h1
              id="hero-title"
              className="mt-7 font-display text-4xl font-bold leading-[1.08] text-white sm:text-5xl lg:text-[3.5rem] xl:text-6xl"
            >
              Prótese dentária
              <span className="mt-1 block bg-gradient-to-b from-white to-steel bg-clip-text text-transparent">
                feita caso a caso.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-relaxed text-steel sm:text-lg">
              O Lab Leles confecciona aparelhos, placas e peças protéticas a partir dos modelos e do
              planejamento enviados pelo dentista responsável pelo caso.
            </p>

            <p className="mt-7 inline-flex items-center gap-2.5 rounded-xl border-l-2 border-white/50 bg-white/[0.06] py-3 pl-4 pr-5 font-display text-sm font-semibold text-white sm:text-base">
              <MapPin className="h-4 w-4 shrink-0 text-steel" aria-hidden="true" />
              De Patos de Minas para o Brasil e o mundo.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
              <LinkButton
                href={buildWhatsAppUrl(quoteMessage)}
                external
                variant="light"
                size="lg"
                aria-label="Solicitar orçamento pelo WhatsApp"
              >
                <MessageCircle className="h-5 w-5" aria-hidden="true" />
                Solicitar orçamento
              </LinkButton>

              <Button variant="outlineLight" size="lg" onClick={() => scrollToSection('servicos')}>
                Ver os serviços
                <ArrowDown className="h-4 w-4" aria-hidden="true" />
              </Button>
            </div>
          </div>

          {/* Composição visual */}
          <div className="lg:col-span-6 xl:col-span-6">
            <div className="relative mx-auto max-w-md lg:ml-auto lg:mr-0 lg:max-w-lg">
              {/* Moldura geométrica de apoio */}
              <div
                className="absolute -inset-3 rounded-[2rem] border border-white/15 sm:-inset-4"
                aria-hidden="true"
              />
              <div
                className="absolute -right-5 -top-5 h-20 w-20 rounded-2xl border-2 border-white/20 sm:h-24 sm:w-24"
                aria-hidden="true"
              />

              <div className="relative overflow-hidden rounded-[1.75rem] bg-graphite shadow-2xl ring-1 ring-white/10">
                <img
                  src={heroImage}
                  srcSet={`${heroImageSmall} 760w, ${heroImage} 1200w`}
                  sizes="(min-width: 1024px) 512px, (min-width: 640px) 448px, 92vw"
                  alt="Modelo odontológico impresso em 3D com estrutura metálica de ortodontia fixa produzida no Lab Leles."
                  width={1200}
                  height={1200}
                  loading="eager"
                  fetchPriority="high"
                  decoding="async"
                  className="aspect-square w-full object-cover"
                />

                <div
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-wine-dark/70 via-transparent to-transparent"
                  aria-hidden="true"
                />

                <div className="absolute inset-x-0 bottom-0 flex items-center gap-3 p-5">
                  <Logo size={44} tone="light" priority />
                  <div>
                    <p className="font-display text-sm font-semibold text-white">Ortodontia fixa digital</p>
                    <p className="text-xs text-steel">Peça adaptada sobre modelo impresso</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
