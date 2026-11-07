'use client';
/* /legal, the Trust Center: the documents as cards. Each one is a page waiting to be read; press it and the card
   opens, ink first, into the document. */
import { motion } from 'motion/react';
import { EASE, Rise, Words, useTilt } from '../ui';
import { A } from '../kit';
import { href as hrefOf } from '../../lib/route';
import { Nodes } from './DocNodes';
import { useArrival } from './doorway';
import { Paper } from './LegalDoc';
import './LegalDoc.css';

const LADDER = [['service-only', 'by default'], ['private improvement'], ['research and training'], ['public commons']];

function DocCard({ it, i }) {
  const tilt = useTilt(4, 'rgba(10,132,255,.10)');
  const h = hrefOf(it.href);
  const note = it.note.map((n, k) => (k === 0 && typeof n === 'string' ? n.replace(/^\s*—\s*/, '') : n));
  return (
    <Rise as="li" delay={(i % 3) * 0.06} y={26}>
      <motion.div className="xlg-cardw" style={{ rotateX: tilt.rx, rotateY: tilt.ry, transformPerspective: 900 }} {...tilt.on}>
        <A to={it.href} className="xlg-card">
          <motion.span className="xlg-card-glow" style={{ background: tilt.glow }} aria-hidden="true" />
          <span className="xlg-card-sheet" aria-hidden="true"><i /><i /><i /><b /><i /><i /></span>
          <span className="xlg-card-t">{it.title}</span>
          <span className="xlg-card-d"><span className="xlg-dash" aria-hidden="true">—</span> <Nodes nodes={note} /></span>
          <span className="xlg-card-go" aria-hidden="true">
            <svg viewBox="0 0 16 16" width="16" height="16"><path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </span>
        </A>
      </motion.div>
    </Rise>
  );
}

function Ladder() {
  return (
    <ol className="xlg-ladder" aria-hidden="true">
      {LADDER.map(([t, s], i) => (
        <motion.li key={t} style={{ '--k': i }} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.6 }} transition={{ duration: 0.9, ease: EASE, delay: i * 0.12 }}>
          <span className="xlg-step"><span className="xlg-step-n x-mono">0{i + 1}</span><b>{t}</b>{s && <em>{s}</em>}</span>
        </motion.li>
      ))}
      <i className="xlg-climb" />
    </ol>
  );
}

function Contact({ g }) {
  const ul = g.nodes.find((n) => n.t === 'ul');
  return (
    <ul className="xlg-contact">
      {ul.c.map((li, i) => (
        <Rise as="li" key={i} y={18} delay={i * 0.06}>
          <span>{li.c[0]}</span>
          <Nodes nodes={li.c.slice(1)} />
        </Rise>
      ))}
    </ul>
  );
}

export default function LegalIndex({ d }) {
  useArrival();
  const line = (t, dl) => (
    <span className="x-line"><motion.span className="x-line-in" initial={{ y: '105%' }} animate={{ y: 0 }} transition={{ duration: 1.1, ease: EASE, delay: dl }}>{t}</motion.span></span>
  );
  const [first, ...status] = d.intro;
  return (
    <main className="xlg xlg-ix">
      <section className="xlg-hero" aria-labelledby="xlg-h1">
        <div className="x-wrap xlg-hero-g">
          <div>
            <motion.p className="x-kick" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: EASE }}>{d.kicker}</motion.p>
            <h1 id="xlg-h1" className="xlg-h1">{line(d.title, 0.05)}</h1>
            <motion.p className="xlg-lede" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: EASE, delay: 0.35 }}>{d.lede}</motion.p>
          </div>
          <Paper />
        </div>
      </section>
      <section className="xlg-intro">
        <div className="x-wrap xlg-intro-g">
          <Rise className="xlg-prose xlg-big"><Nodes nodes={[first]} /></Rise>
          <Rise className="xlg-prose xlg-status" delay={0.15}><Nodes nodes={status} /></Rise>
        </div>
      </section>
      {d.groups.map((g) => (
        <section className="xlg-grp" key={g.id}>
          <div className="x-wrap xlg-grp-g">
            <header className="xlg-gh"><Words text={g.title} as="h2" /><span id={g.id} /></header>
            <ul className="xlg-cards">{g.items.map((it, i) => <DocCard key={it.href} it={it} i={i} />)}</ul>
          </div>
        </section>
      ))}
      {d.rest.map((g) => (
        <section className="xlg-grp xlg-rest" key={g.id}>
          <div className="x-wrap xlg-grp-g">
            <header className="xlg-gh"><Words text={g.title} as="h2" /><span id={g.id} /></header>
            <div className="xlg-prose">
              {g.id === 'how-these-fit-together' && <Ladder />}
              {g.id === 'contact' ? <Contact g={g} /> : <Nodes nodes={g.nodes} />}
            </div>
          </div>
        </section>
      ))}
    </main>
  );
}
