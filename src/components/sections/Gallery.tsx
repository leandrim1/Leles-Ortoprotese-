import { useCallback, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Modal } from '@/components/ui/Modal';
import { galleryItems } from '@/data/gallery';

export function Gallery() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const isOpen = activeIndex !== null;
  const activeItem = activeIndex !== null ? galleryItems[activeIndex] : null;

  const showPrevious = useCallback(() => {
    setActiveIndex((i) => (i === null ? i : (i - 1 + galleryItems.length) % galleryItems.length));
  }, []);

  const showNext = useCallback(() => {
    setActiveIndex((i) => (i === null ? i : (i + 1) % galleryItems.length));
  }, []);

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
    <section id="trabalhos" aria-labelledby="trabalhos-title" className="py-16 lg:py-24">
      <div className="container">
        <SectionHeading
          id="trabalhos-title"
          index="06"
          label="Trabalhos"
          title="Peças produzidas no laboratório"
          intro="Fotografias dos próprios trabalhos do Lab Leles. Toque em uma imagem para ampliar."
        />

        {/* Mosaico: a primeira peça ocupa quatro células, o resto preenche a grade */}
        <ul className="mt-12 grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-3">
          {galleryItems.map((item, index) => (
            <li key={item.id} className={index === 0 ? 'col-span-2 row-span-2' : undefined}>
              <button
                type="button"
                onClick={() => setActiveIndex(index)}
                aria-label={`Ampliar: ${item.caption}`}
                className="group relative block h-full w-full overflow-hidden bg-paper-dim"
              >
                <img
                  src={index === 0 ? item.src : item.thumb}
                  alt={item.alt}
                  width={760}
                  height={760}
                  loading={index < 3 ? 'eager' : 'lazy'}
                  decoding="async"
                  className="aspect-square h-full w-full object-cover"
                />

                {/* Legenda discreta, só no foco ou ao passar o mouse */}
                <span className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-full bg-ink/90 px-3 py-2 text-left font-mono text-label uppercase text-white transition-transform duration-150 group-hover:translate-y-0 group-focus-visible:translate-y-0">
                  {item.category}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <Modal isOpen={isOpen} onClose={() => setActiveIndex(null)} label="Visualização ampliada do trabalho">
        {activeItem && (
          <div className="bg-paper">
            <div className="relative flex items-center justify-center bg-ink">
              <img
                src={activeItem.src}
                alt={activeItem.alt}
                width={1200}
                height={1200}
                decoding="async"
                className="max-h-[66vh] w-auto max-w-full object-contain"
              />

              <button
                type="button"
                onClick={showPrevious}
                aria-label="Imagem anterior"
                className="absolute left-0 top-0 flex h-full w-14 items-center justify-center text-white/70 transition-colors hover:bg-ink/40 hover:text-white"
              >
                <ChevronLeft className="h-5 w-5" aria-hidden="true" />
              </button>

              <button
                type="button"
                onClick={showNext}
                aria-label="Próxima imagem"
                className="absolute right-0 top-0 flex h-full w-14 items-center justify-center text-white/70 transition-colors hover:bg-ink/40 hover:text-white"
              >
                <ChevronRight className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            <div className="flex items-baseline justify-between gap-6 px-4 py-4">
              <div>
                <p className="label text-ink-faint">{activeItem.category}</p>
                <p className="mt-1.5 text-body text-ink">{activeItem.caption}</p>
              </div>

              <p aria-live="polite" className="shrink-0 font-mono text-meta text-ink-faint">
                {String((activeIndex ?? 0) + 1).padStart(2, '0')} / {String(galleryItems.length).padStart(2, '0')}
              </p>
            </div>
          </div>
        )}
      </Modal>
    </section>
  );
}
