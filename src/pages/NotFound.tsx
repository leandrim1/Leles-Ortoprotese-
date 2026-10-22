import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Logo } from '@/components/ui/Logo';
import { useDocumentMeta } from '@/hooks/useDocumentMeta';
import { site } from '@/data/site';

export default function NotFound() {
  useDocumentMeta({
    title: `Página não encontrada — ${site.legalName}`,
    description: 'A página que você procura não está disponível no site do Lab Leles.',
  });

  return (
    <section className="flex min-h-[70vh] items-center justify-center px-5 py-24">
      <div className="text-center">
        <Logo size={72} className="mx-auto" />

        <p className="mt-8 font-display text-5xl font-bold text-wine">404</p>
        <h1 className="mt-3 text-2xl sm:text-3xl">Página não encontrada</h1>
        <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-graphite/70">
          O endereço acessado não existe ou foi movido. Volte para a página inicial para conhecer os serviços do
          Lab Leles.
        </p>

        <Link
          to="/"
          className="mt-8 inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full bg-wine px-6 py-3 text-sm font-semibold text-white shadow-wine transition hover:-translate-y-0.5 hover:bg-wine-soft"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Voltar ao início
        </Link>
      </div>
    </section>
  );
}
