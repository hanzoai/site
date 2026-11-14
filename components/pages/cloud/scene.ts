import type { MotionValue } from 'motion/react';

/** A chapter picture: the scroll's progress through it (desktop), or no progress and it builds by itself once seen. */
export interface SceneProps {
  p?: MotionValue<number>;
  on: boolean;
}
