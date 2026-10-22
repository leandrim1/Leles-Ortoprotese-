import type { ReactNode } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { WhatsAppFloat } from './WhatsAppFloat';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <>
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[90] focus:inline-flex focus:min-h-[44px] focus:items-center focus:rounded focus:bg-wine focus:px-5 focus:text-meta focus:font-medium focus:text-white"
      >
        Ir para o conteúdo
      </a>

      <Header />

      {/* tabIndex -1 faz o atalho de pular navegação mover o foco de fato para o conteúdo. */}
      <main id="conteudo" tabIndex={-1} className="focus:outline-none">
        {children}
      </main>

      <Footer />
      <WhatsAppFloat />
    </>
  );
}
