// Motion tokens, defined once (BRIEF-v3 §8). The same values are CSS variables in app/system.css.
// HOW TO USE: import { EASE_OUT_EXPO, DUR, SPRING } from '../lib/motion' (or '../../lib/motion'), e.g.
//   transition={{ duration: DUR.enter, ease: EASE_OUT_EXPO }}   or   transition={SPRING.sheet}
// Ad hoc easings are banned; reach for these. Reduced motion is handled site-wide (MotionConfig reducedMotion="user").
export type Bezier = [number, number, number, number]; // a cubic-bezier ease, as motion takes it
export const EASE_OUT_EXPO: Bezier = [0.16, 1, 0.3, 1]; // headline reveals, hero moves
export const EASE_CALM: Bezier = [0.33, 1, 0.68, 1]; // enter, the ask bar
export const EASE_SOFT: Bezier = [0.22, 1, 0.36, 1]; // fades
export const EASE_IN: Bezier = [0.7, 0, 0.84, 0]; // exits

export const DUR = { press: 0.1, hover: 0.2, exit: 0.25, fade: 0.4, enter: 0.6, morph: 0.6, reveal: 1.1 };
export const SPRING = {
  sheet: { type: 'spring', stiffness: 300, damping: 34 },
  toggle: { type: 'spring', stiffness: 300, damping: 34 },
  morph: { type: 'spring', stiffness: 260, damping: 32 },
  pill: { type: 'spring', stiffness: 500, damping: 35 },
  cursor: { type: 'spring', stiffness: 500, damping: 40, mass: 0.4 },
};
export const STAGGER = 0.08; // max 4 items
