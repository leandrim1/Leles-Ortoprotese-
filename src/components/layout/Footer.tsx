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

const linkClass = 'text-meta text-white/60 transition-colors hover:text-white';

export function Footer() {
  const { today, isOpen } = useBusinessHours();
  const year = new Date().getFullYear();

  return (
    <footer className="on-dark bg-ink text-white">
      <div className="container py-14 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-4">
            <Logo size={38} withWordmark tone="light" />
            <p className="mt-5 max-w-measure-sm text-meta text-white/60">{site.shortDescription}</p>
          </div>

          <nav className="lg:col-span-2" aria-label="Navegação do rodapé">
            <h2 className="label text-white/55">Navegação</h2>
            <ul className="mt-4 space-y-2.5">
              {navItems.map((item) => (
                <li key={item.sectionId}>
                  <a
                    href={`#${item.sectionId}`}
                    onClick={(event) => {
                      event.preventDefault();
                      scrollToSection(item.sectionId);
                    }}
                    className={linkClass}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="lg:col-span-3">
            <h2 className="label text-white/55">Serviços</h2>
            <ul className="mt-4 space-y-2.5">
              {services.map((service) => (
                <li key={service.id}>
                  <a
                    href={buildWhatsAppUrl(serviceMessage(service.name))}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={linkClass}
                  >
                    {service.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h2 className="label text-white/55">Contato</h2>

            <address className="mt-4 space-y-2.5 not-italic">
              <a href={site.mapsUrl} target="_blank" rel="noopener noreferrer" className={cn(linkClass, 'block')}>
                {site.address.street}
                <br />
                {site.address.district}, {site.address.city} — {site.address.state}
                <br />
                CEP {site.address.zip}
              </a>
              <a
                href={buildWhatsAppUrl(quoteMessage)}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(linkClass, 'block')}
              >
                {site.phoneDisplay}
              </a>
              <a href={site.instagramUrl} target="_blank" rel="noopener noreferrer" className={cn(linkClass, 'block')}>
                {site.instagramHandle}
              </a>
            </address>

            <h2 className="label mt-8 text-white/55">
              Horários
              <span className={cn('ml-2', isOpen ? 'text-white' : 'text-white/55')}>
                · {isOpen ? 'aberto' : 'fechado'}
              </span>
            </h2>

            <dl className="mt-4">
              {businessHours.map((day) => (
                <div
                  key={day.weekday}
                  className={cn(
                    'flex justify-between gap-4 py-1 text-meta',
                    day.weekday === today.weekday ? 'text-white' : 'text-white/50',
                  )}
                >
                  <dt>{day.shortLabel}</dt>
                  <dd className="font-mono tabular-nums">{formatDayRange(day)}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        <div className="mt-14 flex flex-wrap items-center justify-between gap-4 border-t border-white/15 pt-6">
          <p className="text-meta text-white/55">
            © {year} {site.legalName}
          </p>

          <button
            type="button"
            onClick={() => scrollToSection('inicio')}
            className="label text-white/55 transition-colors hover:text-white"
          >
            Voltar ao topo
          </button>
        </div>
      </div>
    </footer>
  );
}
