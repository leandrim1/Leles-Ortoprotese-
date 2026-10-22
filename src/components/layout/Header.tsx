import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
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
  const isScrolled = useScrolled(16);
  const activeSection = useScrollSpy(trackedSections);

  useLockBodyScroll(isMenuOpen);

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
    window.setTimeout(() => scrollToSection(sectionId), 10);
  };

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 bg-paper transition-colors',
        isScrolled || isMenuOpen ? 'border-b border-rule' : 'border-b border-transparent',
      )}
    >
      <div className="container flex h-[72px] items-center justify-between gap-6">
        <a
          href="#inicio"
          onClick={(event) => {
            event.preventDefault();
            handleNavClick('inicio');
          }}
          className="rounded-sm"
          aria-label="Lab Leles — ir para o início"
        >
          <Logo size={34} withWordmark priority />
        </a>

        <nav className="hidden lg:block" aria-label="Navegação principal">
          <ul className="flex items-center gap-7">
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
                      'border-b py-1 text-meta transition-colors',
                      isActive
                        ? 'border-wine text-wine'
                        : 'border-transparent text-ink-soft hover:border-rule-strong hover:text-ink',
                    )}
                  >
                    {item.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <LinkButton
            href={buildWhatsAppUrl(quoteMessage)}
            external
            className="hidden sm:inline-flex"
            aria-label="Solicitar orçamento pelo WhatsApp"
          >
            Solicitar orçamento
          </LinkButton>

          <button
            type="button"
            onClick={() => setIsMenuOpen((open) => !open)}
            aria-expanded={isMenuOpen}
            aria-controls="menu-mobile"
            aria-label={isMenuOpen ? 'Fechar menu' : 'Abrir menu'}
            className="-mr-2 inline-flex h-11 w-11 items-center justify-center rounded text-ink transition-colors hover:text-wine lg:hidden"
          >
            {isMenuOpen ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
          </button>
        </div>
      </div>

      <div id="menu-mobile" hidden={!isMenuOpen} className="border-t border-rule bg-paper lg:hidden">
        <nav className="container py-2" aria-label="Navegação principal (celular)">
          <ul>
            {navItems.map((item, index) => {
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
                      'flex min-h-[52px] items-center gap-4 border-b border-rule text-body',
                      isActive ? 'text-wine' : 'text-ink',
                    )}
                  >
                    <span className="label text-ink-faint">{String(index + 1).padStart(2, '0')}</span>
                    {item.label}
                  </a>
                </li>
              );
            })}
          </ul>

          <LinkButton
            href={buildWhatsAppUrl(quoteMessage)}
            external
            className="my-5 w-full"
            aria-label="Solicitar orçamento pelo WhatsApp"
          >
            Solicitar orçamento
          </LinkButton>
        </nav>
      </div>
    </header>
  );
}
