import { useEffect, useState } from 'react';
import { Menu, MessageCircle, X } from 'lucide-react';
import { Logo } from '@/components/ui/Logo';
import { LinkButton } from '@/components/ui/Button';
import { navItems, trackedSections } from '@/data/navigation';
import { useScrollSpy } from '@/hooks/useScrollSpy';
import { useScrolled } from '@/hooks/useScrolled';
import { useLockBodyScroll } from '@/hooks/useLockBodyScroll';
import { buildWhatsAppUrl, quoteMessage } from '@/utils/whatsapp';
import { scrollToSection } from '@/utils/scroll';
import { cn } from '@/utils/cn';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isScrolled = useScrolled(24);
  const activeSection = useScrollSpy(trackedSections);

  useLockBodyScroll(isMenuOpen);

  // Fecha o menu ao voltar para o desktop, evitando um overlay preso.
  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 1024px)');
    const handleChange = (event: MediaQueryListEvent) => {
      if (event.matches) setIsMenuOpen(false);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    if (!isMenuOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsMenuOpen(false);
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isMenuOpen]);

  const handleNavClick = (sectionId: string) => {
    setIsMenuOpen(false);
    // Aguarda o fechamento do menu antes de rolar, para a medida ficar correta.
    window.setTimeout(() => scrollToSection(sectionId), 10);
  };

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-all duration-300',
        isScrolled || isMenuOpen
          ? 'border-b border-steel/40 bg-white/95 shadow-sm backdrop-blur-md'
          : 'border-b border-transparent bg-white/80 backdrop-blur-sm',
      )}
    >
      <div className="container flex h-20 items-center justify-between gap-4">
        <a
          href="#inicio"
          onClick={(event) => {
            event.preventDefault();
            handleNavClick('inicio');
          }}
          className="rounded-xl"
          aria-label="Lab Leles — ir para o início"
        >
          <Logo size={44} withWordmark priority />
        </a>

        <nav className="hidden lg:block" aria-label="Navegação principal">
          <ul className="flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = activeSection === item.sectionId;

              return (
                <li key={item.sectionId}>
                  <a
                    href={`#${item.sectionId}`}
                    onClick={(event) => {
                      event.preventDefault();
                      handleNavClick(item.sectionId);
                    }}
                    aria-current={isActive ? 'true' : undefined}
                    className={cn(
                      'relative rounded-full px-3.5 py-2 text-sm font-medium transition-colors',
                      isActive ? 'text-wine' : 'text-graphite/70 hover:text-wine',
                    )}
                  >
                    {item.label}
                    <span
                      className={cn(
                        'absolute inset-x-3.5 -bottom-0.5 h-0.5 rounded-full bg-wine transition-transform duration-300',
                        isActive ? 'scale-x-100' : 'scale-x-0',
                      )}
                      aria-hidden="true"
                    />
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <LinkButton
            href={buildWhatsAppUrl(quoteMessage)}
            external
            size="sm"
            className="hidden sm:inline-flex"
            aria-label="Solicitar orçamento pelo WhatsApp"
          >
            <MessageCircle className="h-4 w-4" aria-hidden="true" />
            Solicitar Orçamento
          </LinkButton>

          <button
            type="button"
            onClick={() => setIsMenuOpen((open) => !open)}
            aria-expanded={isMenuOpen}
            aria-controls="menu-mobile"
            aria-label={isMenuOpen ? 'Fechar menu' : 'Abrir menu'}
            className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-steel/60 text-graphite transition hover:border-wine hover:text-wine lg:hidden"
          >
            {isMenuOpen ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
          </button>
        </div>
      </div>

      {/* Menu compacto para celular e tablet */}
      <div
        id="menu-mobile"
        hidden={!isMenuOpen}
        className="border-t border-steel/40 bg-white lg:hidden"
      >
        <nav className="container py-4" aria-label="Navegação principal (celular)">
          <ul className="flex flex-col">
            {navItems.map((item) => {
              const isActive = activeSection === item.sectionId;

              return (
                <li key={item.sectionId}>
                  <a
                    href={`#${item.sectionId}`}
                    onClick={(event) => {
                      event.preventDefault();
                      handleNavClick(item.sectionId);
                    }}
                    aria-current={isActive ? 'true' : undefined}
                    className={cn(
                      'flex min-h-[52px] items-center rounded-xl border-l-2 px-4 text-base font-medium transition-colors',
                      isActive
                        ? 'border-wine bg-wine-tint text-wine'
                        : 'border-transparent text-graphite/80 hover:bg-steel-light hover:text-wine',
                    )}
                  >
                    {item.label}
                  </a>
                </li>
              );
            })}
          </ul>

          <LinkButton
            href={buildWhatsAppUrl(quoteMessage)}
            external
            size="lg"
            className="mt-4 w-full"
            aria-label="Solicitar orçamento pelo WhatsApp"
          >
            <MessageCircle className="h-5 w-5" aria-hidden="true" />
            Solicitar Orçamento
          </LinkButton>
        </nav>
      </div>
    </header>
  );
}
