import { Link } from 'react-router-dom';
import { Logo } from '@/components/ui/Logo';
import { useDocumentMeta } from '@/hooks/useDocumentMeta';
import { site } from '@/data/site';

export default function NotFound() {
  useDocumentMeta({
    title: `Página não encontrada — ${site.legalName}`,
    description: 'A página que você procura não está disponível no site do Lab Leles.',
  });

  return (
    <section className="flex min-h-[70vh] items-center py-28">
      <div className="container">
        <div className="max-w-measure">
          <Logo size={40} />

          <p className="label mt-10 text-wine">Erro 404</p>
          <h1 className="mt-4 text-h2 lg:text-h2-lg">Esta página não existe</h1>
          <p className="mt-4 text-body text-ink-soft">
            O endereço acessado não existe ou foi movido. Volte para a página inicial para ver os serviços do
            laboratório.
          </p>

          <Link
            to="/"
            className="mt-8 inline-flex min-h-[44px] items-center rounded bg-wine px-5 text-meta font-medium text-white transition-colors hover:bg-wine-deep"
          >
            Voltar ao início
          </Link>
        </div>
      </div>
    </section>
  );
}
