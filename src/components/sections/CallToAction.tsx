import { Instagram, MessageCircle } from 'lucide-react';
import { LinkButton } from '@/components/ui/Button';
import { Reveal } from '@/components/ui/Reveal';
import { Logo } from '@/components/ui/Logo';
import { site } from '@/data/site';
import { buildWhatsAppUrl, quoteMessage } from '@/utils/whatsapp';

export function CallToAction() {
  return (
    <section aria-labelledby="cta-title" className="on-wine relative overflow-hidden bg-wine-gradient py-16 text-white lg:py-20">
      <div className="absolute inset-0 grid-texture opacity-50" aria-hidden="true" />
      <div
        className="pointer-events-none absolute -right-24 top-0 h-80 w-80 rounded-full bg-white/[0.06] blur-3xl"
        aria-hidden="true"
      />

      <div className="container relative">
        <Reveal>
          <div className="flex flex-col items-center gap-8 text-center lg:flex-row lg:justify-between lg:text-left">
            <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center lg:gap-7">
              <Logo size={72} tone="light" />

              <div>
                <h2 id="cta-title" className="font-display text-2xl font-bold text-white sm:text-3xl">
                  Envie seu caso para o laboratório.
                </h2>
                <p className="mt-2 max-w-xl text-sm text-steel sm:text-base">
                  {site.shortDescription}
                </p>
              </div>
            </div>

            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
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

              <LinkButton
                href={site.instagramUrl}
                external
                variant="outlineLight"
                size="lg"
                aria-label={`Abrir o Instagram ${site.instagramHandle}`}
              >
                <Instagram className="h-5 w-5" aria-hidden="true" />
                Instagram
              </LinkButton>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
