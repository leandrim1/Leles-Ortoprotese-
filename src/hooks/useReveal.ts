import { useEffect, useRef, useState } from 'react';
import { usePrefersReducedMotion } from './usePrefersReducedMotion';

interface UseRevealOptions {
  /** Fração do elemento visível necessária para disparar a revelação. */
  threshold?: number;
  /** Margem aplicada à raiz do observer. */
  rootMargin?: string;
}

/** Revela um elemento quando ele entra na viewport, uma única vez. */
export function useReveal<T extends HTMLElement = HTMLDivElement>({
  threshold = 0.15,
  rootMargin = '0px 0px -10% 0px',
}: UseRevealOptions = {}) {
  const ref = useRef<T | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const [isVisible, setIsVisible] = useState(prefersReducedMotion);

  useEffect(() => {
    if (prefersReducedMotion) {
      setIsVisible(true);
      return;
    }

    const element = ref.current;
    if (!element || typeof IntersectionObserver === 'undefined') {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        }
      },
      { threshold, rootMargin },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [prefersReducedMotion, rootMargin, threshold]);

  return { ref, isVisible };
}
