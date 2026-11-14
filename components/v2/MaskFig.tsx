'use client';
/* MaskFig (components/v2, owned by the Models chat). A figure rises once into its own line as it comes into view.
   Only Hanzo's value is ever drawn: no count-up and no split-flap, so nothing on screen flashes a number Hanzo did not
   print. Reduced motion and JS off show it in place (CSS below and the page's NoScript sheet).
   Usage: <b className="my-big-number"><MaskFig>84.4%</MaskFig></b>   (delay in seconds for a second figure)
          <MaskFig now delay={0.15} dur={0.55}>1M</MaskFig>   a first-screen figure rises on load, not on view, and
          lands inside the first second */
import type { ReactNode } from 'react';
import { motion } from 'motion/react';
import './MaskFig.css';

const V = { hide: { y: '110%' }, show: { y: 0 } };

interface MaskFigProps {
  children?: ReactNode;
  delay?: number;
  dur?: number;
  now?: boolean;
  className?: string;
}

export default function MaskFig({ children, delay = 0, dur = 0.9, now = false, className = '' }: MaskFigProps) {
  // the mask is what is watched (the moving line inside it is clipped, so it could never count as "in view")
  const when = now ? { animate: 'show' } : { whileInView: 'show', viewport: { once: true, amount: 0.5 } };
  return (
    <motion.span className={'v2-maskfig ' + className} initial="hide" {...when}>
      <motion.span className="v2-maskfig-in" variants={V} transition={{ duration: dur, ease: [0.16, 1, 0.3, 1], delay }}>
        {children}
      </motion.span>
    </motion.span>
  );
}
