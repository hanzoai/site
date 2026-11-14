// Scroll helpers that work the same with or without Lenis (components/Chrome.jsx runs Lenis unless reduced motion).
// HOW TO USE: import { scrollToEl, scrollToY } from '../lib/scroll';  scrollToEl(el, { offset: -110 })
// The offset clears Hanzo's 60 px sticky header; reduced motion jumps instead of gliding.
const calm = () => typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;

export function scrollToY(y: number, { duration = 1.1, immediate = false }: { duration?: number; immediate?: boolean } = {}) {
  const l = typeof window !== 'undefined' && window.__lenis;
  if (l) l.scrollTo(y, { duration, immediate: immediate || calm(), force: true });
  else window.scrollTo({ top: y, behavior: immediate || calm() ? 'auto' : 'smooth' });
}

export function scrollToEl(el: Element | null | undefined, { offset = -80, duration, immediate }: { offset?: number; duration?: number; immediate?: boolean } = {}) {
  if (!el) return;
  const y = el.getBoundingClientRect().top + window.scrollY + offset;
  scrollToY(y, { duration, immediate });
}
