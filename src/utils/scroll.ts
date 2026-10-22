/** Altura do cabeçalho fixo, usada como deslocamento ao rolar até uma âncora. */
export const HEADER_OFFSET = 80;

/** Rola suavemente até uma seção, respeitando `prefers-reduced-motion`. */
export function scrollToSection(sectionId: string): void {
  const target = document.getElementById(sectionId);
  if (!target) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const top = target.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;

  window.scrollTo({ top, behavior: prefersReducedMotion ? 'auto' : 'smooth' });

  // Mantém a navegação por teclado coerente com a rolagem.
  target.setAttribute('tabindex', '-1');
  target.focus({ preventScroll: true });
}
