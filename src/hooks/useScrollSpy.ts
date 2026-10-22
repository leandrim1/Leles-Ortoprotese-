import { useEffect, useState } from 'react';
import { HEADER_OFFSET } from '@/utils/scroll';

/** Devolve o id da seção atualmente visível entre as informadas. */
export function useScrollSpy(sectionIds: string[]): string {
  const [activeId, setActiveId] = useState(sectionIds[0] ?? '');

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + HEADER_OFFSET + 24;

      // No fim da página, destaca sempre a última seção observada.
      const reachedBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 2;
      if (reachedBottom) {
        setActiveId(sectionIds[sectionIds.length - 1] ?? '');
        return;
      }

      let current = sectionIds[0] ?? '';
      for (const id of sectionIds) {
        const element = document.getElementById(id);
        if (element && element.offsetTop <= scrollPosition) {
          current = id;
        }
      }

      setActiveId(current);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [sectionIds]);

  return activeId;
}
