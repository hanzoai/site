/* A2Motion — Hanzo's deck motion tokens for the Apps 2 pages (Apps 2 chat; MASTER.md 3.1 "Motion").
   Usage: import { T, EMPH, INOUT, OUT } from '../v2/A2Motion';  transition={{ duration: T.base, ease: EMPH }}
   press 90 ms, fast 150, base 300, slow 400, slower 500; only scene moves run longer: the h1 line mask 700 ms
   (MASTER part 3), a hairline or line art 900 ms. No springs, no overshoot. */
export const T = { press: 0.09, fast: 0.15, base: 0.3, slow: 0.4, slower: 0.5, line: 0.7, scene: 0.9, stagger: 0.06 };
export const EMPH = [0.16, 1, 0.3, 1] as const; // ease-emphasis: arrivals
export const INOUT = [0.4, 0, 0.2, 1] as const; // ease-in-out: things that move and stay
export const OUT = [0, 0, 0.2, 1] as const; // ease-out: hover and colour
export const MOVE = { duration: T.base, ease: EMPH }; // the one transition for a toggle or a thing the hand moves
