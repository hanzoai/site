'use client';
/* MaskFig (components/v2, owned by the Models chat). A figure rises once into its own line as it comes into view.
   Only Hanzo's value is ever drawn: no count-up and no split-flap, so nothing on screen flashes a number Hanzo did not
   print. Reduced motion and JS off show it in place (CSS below and the page's NoScript sheet).
   Usage: <b className="my-big-number"><MaskFig>84.4%</MaskFig></b>   (delay in seconds for a second figure) */
import { motion } from 'motion/react';
import './MaskFig.css';

const V = { hide: { y: '110%' }, show: { y: 0 } };

export default function MaskFig({ children, delay = 0, className = '' }) {
  // the mask is what is watched (the moving line inside it is clipped, so it could never count as "in view")
  return (
    <motion.span className={'v2-maskfig ' + className} initial="hide" whileInView="show" viewport={{ once: true, amount: 0.5 }}>
      <motion.span className="v2-maskfig-in" variants={V} transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay }}>
        {children}
      </motion.span>
    </motion.span>
  );
}
