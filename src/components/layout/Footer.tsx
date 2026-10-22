import { ArrowUp, Clock, Instagram, MapPin, MessageCircle } from 'lucide-react';
import { Logo } from '@/components/ui/Logo';
import { navItems } from '@/data/navigation';
import { services } from '@/data/services';
import { businessHours } from '@/data/hours';
import { site } from '@/data/site';
import { useBusinessHours } from '@/hooks/useBusinessHours';
import { formatDayRange } from '@/utils/businessHours';
import { buildWhatsAppUrl, quoteMessage, serviceMessage } from '@/utils/whatsapp';
import { scrollToSection } from '@/utils/scroll';
import { cn } from '@/utils/cn';

export function Footer() {
  const { today, isOpen } = useBusinessHours();
  const year = new Date().getFullYear();

  return (
    <footer className="on-wine relative overflow-hidden bg-wine-gradient text-steel">
      <div className="absolute inset-0 grid-texture opacity-50" aria-hidden="true" />

      <div className="container relative py-16 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
          {/* Marca e descrição */}
          <div className="lg:col-span-4">
            <Logo size={56} withWordmark tone="light" />

            <p className="mt-5 max-w-sm text-sm leading-relaxed text-steel">{site.shortDescription}</p>

            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={buildWhatsAppUrl(quoteMessage)}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Falar pelo WhatsApp"
                className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/20 bg-white/5 text-white transition hover:border-white/60 hover:bg-white/15"
              >
                <MessageCircle className="h-5 w-5" aria-hidden="true" />
              </a>
              <a
                href={site.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Instagram ${site.instagramHandle}`}
                className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/20 bg-white/5 text-white transition hover:border-white/60 hover:bg-white/15"
              >
                <Instagram className="h-5 w-5" aria-hidden="true" />
              </a>
              <a
                href={site.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Abrir endereço no Google Maps"
                className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/20 bg-white/5 text-white transition hover:border-white/60 hover:bg-white/15"
              >
                <MapPin className="h-5 w-5" aria-hidden="true" />
              </a>
            </div>
          </div>

          {/* Navegação */}
          <nav className="lg:col-span-2" aria-label="Navegação do rodapé">
            <h2 className="font-display text-sm font-semibold uppercase tracking-[0.14em] text-white">Navegação</h2>
            <ul className="mt-5 space-y-3">
              {navItems.map((item) => (
                <li key={item.sectionId}>
                  <a
                    href={`#${item.sectionId}`}
                    onClick={(event) => {
                      event.preventDefault();
                      scrollToSection(item.sectionId);
                    }}
                    className="text-sm text-steel transition hover:text-white"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Serviços */}
          <div className="lg:col-span-3">
            <h2 className="font-display text-sm font-semibold uppercase tracking-[0.14em] text-white">Serviços</h2>
            <ul className="mt-5 space-y-3">
              {services.map((service) => (
                <li key={service.id}>
                  <a
                    href={buildWhatsAppUrl(serviceMessage(service.name))}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-steel transition hover:text-white"
                  >
                    {service.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contato e horários */}
          <div className="lg:col-span-3">
            <h2 className="font-display text-sm font-semibold uppercase tracking-[0.14em] text-white">Contato</h2>

            <address className="mt-5 space-y-3 not-italic">
              <a
                href={site.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex gap-3 text-sm text-steel transition hover:text-white"
              >
                <MapPin className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                <span>
                  {site.address.street}
                  <br />
                  {site.address.district}, {site.address.city} — {site.address.state}
                  <br />
                  CEP {site.address.zip}
                </span>
              </a>

              <a
                href={buildWhatsAppUrl(quoteMessage)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-sm text-steel transition hover:text-white"
              >
                <MessageCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
                {site.phoneDisplay}
              </a>

              <a
                href={site.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-sm text-steel transition hover:text-white"
              >
                <Instagram className="h-4 w-4 shrink-0" aria-hidden="true" />
                {site.instagramHandle}
              </a>
            </address>

            <h2 className="mt-8 font-display text-sm font-semibold uppercase tracking-[0.14em] text-white">
              Horários
            </h2>

            <p className="mt-4 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider">
              <span
                className={cn('h-2 w-2 rounded-full', isOpen ? 'bg-emerald-400' : 'bg-steel/70')}
                aria-hidden="true"
              />
              <span className={isOpen ? 'text-emerald-300' : 'text-steel'}>
                {isOpen ? 'Aberto agora' : 'Fechado agora'}
              </span>
            </p>

            <ul className="mt-3 space-y-1.5">
              {businessHours.map((day) => (
                <li
                  key={day.weekday}
                  className={cn(
                    'flex items-center justify-between gap-4 text-sm',
                    day.weekday === today.weekday ? 'font-semibold text-white' : 'text-steel',
                  )}
                >
                  <span className="inline-flex items-center gap-2">
                    {day.weekday === today.weekday && <Clock className="h-3.5 w-3.5" aria-hidden="true" />}
                    {day.shortLabel}
                  </span>
                  <span>{formatDayRange(day)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/15 pt-8 sm:flex-row">
          <p className="text-center text-xs text-steel sm:text-left">
            © {year} {site.legalName}. Todos os direitos reservados.
          </p>

          <button
            type="button"
            onClick={() => scrollToSection('inicio')}
            className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white transition hover:border-white/60 hover:bg-white/10"
          >
            <ArrowUp className="h-3.5 w-3.5" aria-hidden="true" />
            Voltar ao topo
          </button>
        </div>
      </div>
    </footer>
  );
}
