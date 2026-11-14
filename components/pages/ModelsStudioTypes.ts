import type { MouseEvent } from 'react';

/* what the open transition (Opener) hands a card: lift its picture off the page, then go to the page */
export interface Opener {
  open: (e: MouseEvent<HTMLElement>, to: { el: Element | null | undefined; src: string; href: string; key: string }) => Promise<void>;
  prefetch?: (href: string) => void;
}
