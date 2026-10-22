import { useEffect } from 'react';

interface DocumentMeta {
  title: string;
  description: string;
}

/** Atualiza título e descrição da página, preparando o terreno para novas rotas. */
export function useDocumentMeta({ title, description }: DocumentMeta): void {
  useEffect(() => {
    document.title = title;

    const descriptionTag = document.querySelector('meta[name="description"]');
    descriptionTag?.setAttribute('content', description);

    const ogTitle = document.querySelector('meta[property="og:title"]');
    ogTitle?.setAttribute('content', title);

    const ogDescription = document.querySelector('meta[property="og:description"]');
    ogDescription?.setAttribute('content', description);
  }, [description, title]);
}
