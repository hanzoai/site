'use client';
/* The error state for every page: if a page throws while rendering, this replaces it (header and footer stay), in the
   same dark room as the 404. "Try again" re-renders the page; "Go home" leaves. Pages need nothing. */
import { useEffect } from 'react';
import { motion } from 'motion/react';
import { A } from '../components/kit';
import { EASE } from '../components/ui';
import '../components/pages/Lost.css';

export default function PageError({ error, reset }) {
  useEffect(() => { console.error(error); dispatchEvent(new CustomEvent('hz-event', { detail: { name: 'page_error', path: location.pathname, message: String(error?.message || '') } })); }, [error]);
  const rise = (d) => ({ initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.8, ease: EASE, delay: d } });
  return (
    <main className="xlo" data-room="dark" data-ask="off">
      <section className="xlo-in x-wrap">
        <h1 className="xlo-h1"><span className="x-line"><motion.span className="x-line-in" initial={{ y: '105%' }} animate={{ y: 0 }} transition={{ duration: 1.1, ease: EASE }}>This page didn&apos;t load.</motion.span></span></h1>
        <motion.div className="xlo-acts" {...rise(0.3)}>
          <button type="button" className="x-btn solid" onClick={() => reset()}>Try again</button>
          <A to="/" className="x-btn">Go home</A>
        </motion.div>
      </section>
    </main>
  );
}
