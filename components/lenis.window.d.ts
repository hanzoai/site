/* The smooth-scroll instance the page shell publishes on window (absent until it mounts, and under reduced motion). */
interface SmoothScrollOptions {
  offset?: number;
  duration?: number;
  immediate?: boolean;
  force?: boolean;
  easing?: (t: number) => number;
}

interface SmoothScroll {
  scrollTo(target: number | Element, options?: SmoothScrollOptions): void;
  start(): void;
  stop(): void;
}

interface Window {
  __lenis?: SmoothScroll;
}
