import { useCallback, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/ui/Reveal';
import { Modal } from '@/components/ui/Modal';
import { galleryItems } from '@/data/gallery';

export function Gallery() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const isOpen = activeIndex !== null;
  const activeItem = activeIndex !== null ? galleryItems[activeIndex] : null;

  const showPrevious = useCallback(() => {
    setActiveIndex((current) =>
      current === null ? current : (current - 1 + galleryItems.length) % galleryItems.length,
    );
  }, []);

  const showNext = useCallback(() => {
    setActiveIndex((current) => (current === null ? current : (current + 1) % galleryItems.length));
  }, []);

  // Navegação pelo teclado entre as imagens com o modal aberto.
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        showPrevious();
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        showNext();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, showNext, showPrevious]);

  return (
    <section id="trabalhos" aria-labelledby="trabalhos-title" className="section-padding bg-steel-light/60">
      <div className="container">
        <Reveal>
          <SectionHeading
            id="trabalhos-title"
            eyebrow="Galeria"
            title="Peças produzidas no laboratório"
            description="Fotografias dos próprios trabalhos do Lab Leles. Toque em uma imagem para ampliar."
          />
        </Reveal>

        <ul className="mt-14 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
          {galleryItems.map((item, index) => (
            <Reveal as="li" key={item.id} delay={(index % 3) * 70}>
              <button
                type="button"
                onClick={() => setActiveIndex(index)}
                aria-label={`Ampliar imagem: ${item.caption}`}
                className="group relative block w-full overflow-hidden rounded-2xl bg-graphite shadow-card transition-shadow duration-300 hover:shadow-card-hover"
              >
                <img
                  src={item.thumb}
                  srcSet={`${item.thumb} 760w, ${item.src} 1200w`}
                  sizes="(min-width: 1024px) 380px, 46vw"
                  alt={item.alt}
                  width={760}
                  height={760}
                  loading="lazy"
                  decoding="async"
                  className="aspect-square w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />

                <span
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-graphite/95 via-graphite/45 to-graphite/5 transition-opacity duration-300 group-hover:from-graphite"
                  aria-hidden="true"
                />

                <span
                  className="pointer-events-none absolute right-3 top-3 inline-flex h-9 w-9 translate-y-1 items-center justify-center rounded-xl bg-white/15 text-white opacity-0 backdrop-blur transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100"
                  aria-hidden="true"
                >
                  <Maximize2 className="h-4 w-4" />
                </span>

                <span className="pointer-events-none absolute inset-x-0 bottom-0 p-3 text-left sm:p-4">
                  <span className="block text-[0.625rem] font-semibold uppercase tracking-[0.14em] text-steel">
                    {item.category}
                  </span>
                  <span className="mt-1 block text-xs font-medium leading-snug text-white sm:text-sm">
                    {item.caption}
                  </span>
                </span>
              </button>
            </Reveal>
          ))}
        </ul>
      </div>

      <Modal isOpen={isOpen} onClose={() => setActiveIndex(null)} label="Visualização ampliada do trabalho">
        {activeItem && (
          <div className="flex flex-col overflow-hidden rounded-2xl bg-white">
            <div className="relative flex items-center justify-center bg-graphite">
              <img
                src={activeItem.src}
                alt={activeItem.alt}
                width={1200}
                height={1200}
                decoding="async"
                className="max-h-[68vh] w-auto max-w-full object-contain"
              />

              <button
                type="button"
                onClick={showPrevious}
                aria-label="Imagem anterior"
                className="absolute left-3 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur transition hover:bg-white/30"
              >
                <ChevronLeft className="h-5 w-5" aria-hidden="true" />
              </button>

              <button
                type="button"
                onClick={showNext}
                aria-label="Próxima imagem"
                className="absolute right-3 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur transition hover:bg-white/30"
              >
                <ChevronRight className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            <div className="flex items-center justify-between gap-4 px-5 py-4">
              <div>
                <p className="text-[0.625rem] font-semibold uppercase tracking-[0.14em] text-wine">
                  {activeItem.category}
                </p>
                <p className="mt-1 text-sm font-medium text-graphite">{activeItem.caption}</p>
              </div>

              <p aria-live="polite" className="shrink-0 text-xs font-medium text-graphite/70">
                {(activeIndex ?? 0) + 1} / {galleryItems.length}
              </p>
            </div>
          </div>
        )}
      </Modal>
    </section>
  );
}
