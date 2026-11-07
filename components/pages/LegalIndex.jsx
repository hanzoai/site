'use client';
/* /legal, the Trust Center, v2. V2: 8/10 Stage stack (the documents arrive as a pile of paper that deals itself), the catalogue as filter chips with cards that re-flow and open into their document, the four data-use states as a ladder, calm contact rows, sepia accent
   Signature: the documents as a stack of paper that deals itself. The top sheet slides to the back every few seconds
   and the next document comes up, each with its own address on hanzo.ai/legal.
   Beyond: "Find the one you need". Filter the twelve documents by kind (Agreements, Policies, Notices and registers)
   and the cards re-flow; every card opens into its document.
   Motion budget: signature = the dealing stack; supporting = Stage (Settle), layout re-flow (filter), open-into-page
   (Morph navigation). Utility archetype: calm, precise, one delight. Every word and link is Hanzo's. */
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { EASE } from '../ui';
import { A } from '../kit';
import { Nodes } from './DocNodes';
import { useArrival } from './doorway';
import { useLive, useEvery } from './cloud/Frame';
import LineMask from '../v2/x-gauss/LineMask';
import Settle from '../v2/Settle';
import '../v2/Scale.css';
import './LegalIndex.css';

const LADDER = [['service-only', 'by default'], ['private improvement'], ['research and training'], ['public commons']];

/* The hero object: the documents as a stack of paper; the top sheet goes to the back on its own. */
function Stack({ docs }) {
  const [ref, live] = useLive(0.3);
  const [top, setTop] = useState(0);
  useEvery(2400, live, () => setTop((t) => (t + 1) % docs.length));
  const order = docs.map((_, i) => (i - top + docs.length) % docs.length);
  return (
    <div className="lx-stack" ref={ref} aria-hidden="true">
      {docs.map((it, i) => {
        const k = order[i];
        if (k > 4) return null;
        return (
          <motion.div key={it.href} className="lx-sheet" initial={false}
            animate={{ x: k * 26, y: k * -22, rotate: k * 2.2 - 2, scale: 1 - k * 0.04, opacity: k === 4 ? 0 : 1, zIndex: 10 - k }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}>
            <span className="lx-sheet-u x-mono">hanzo.ai{it.href}</span>
            <b>{it.title}</b>
            <span className="lx-sheet-l"><i /><i /><i /><i /><i /></span>
            <span className="lx-sheet-s x-mono">draft · pending counsel</span>
          </motion.div>
        );
      })}
    </div>
  );
}

function Card({ it, group }) {
  const note = it.note.map((n, k) => (k === 0 && typeof n === 'string' ? n.replace(/^\s*—\s*/, '') : n));
  return (
    <A to={it.href} className="lx-card" data-cursor="Open">
      <span className="lx-card-k x-mono">{group}</span>
      <span className="lx-card-t" data-morph>{it.title}</span>
      <span className="lx-card-d"><span className="lx-dash" aria-hidden="true">—</span> <Nodes nodes={note} /></span>
      <span className="lx-card-go" aria-hidden="true">
        <svg viewBox="0 0 16 16" width="16" height="16"><path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </span>
    </A>
  );
}

function Catalogue({ groups }) {
  const [on, setOn] = useState('all');
  const all = groups.flatMap((g) => g.items.map((it) => ({ ...it, g })));
  return (
    <section className="w2-sec lx-cat" aria-label="Documents">
      <div className="w2-wrap">
        <div className="lx-chips" role="group" aria-label="Show">
          <button type="button" aria-pressed={on === 'all'} onClick={() => setOn('all')}>All <span className="x-mono">{all.length}</span></button>
          {groups.map((g) => (
            <button key={g.id} type="button" aria-pressed={on === g.id} onClick={() => setOn(g.id)}>
              <span className="lx-chip-t">{g.title}</span><span className="x-mono">{g.items.length}</span><span id={g.id} className="lx-anchor" />
            </button>
          ))}
        </div>
        <motion.ul className="lx-cards" layout>
          <AnimatePresence initial={false}>
            {all.filter((it) => on === 'all' || it.g.id === on).map((it) => (
              <motion.li key={it.href} layout initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.15 } }} transition={{ type: 'spring', stiffness: 300, damping: 30 }}>
                <Card it={it} group={it.g.title} />
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
        {/* every document stays in the page while a filter hides it */}
        <ul hidden>{all.filter((it) => !(on === 'all' || it.g.id === on)).map((it) => <li key={it.href}><Card it={it} group={it.g.title} /></li>)}</ul>
      </div>
    </section>
  );
}

function Ladder() {
  return (
    <ol className="lx-ladder" aria-hidden="true">
      {LADDER.map(([t, s], i) => (
        <li key={t} style={{ '--k': i }}>
          <span className="lx-step-n x-mono">0{i + 1}</span><b>{t}</b>{s && <em>{s}</em>}
        </li>
      ))}
    </ol>
  );
}

export default function LegalIndex({ d }) {
  useArrival();
  const [first, ...status] = d.intro;
  const docs = d.groups.flatMap((g) => g.items);
  const how = d.rest.find((g) => g.id === 'how-these-fit-together');
  const contact = d.rest.find((g) => g.id === 'contact');
  const other = d.rest.filter((g) => g !== how && g !== contact);
  const mail = contact && contact.nodes.find((n) => n.t === 'ul');
  return (
    <main className="lx w2">
      <section className="lx-hero" aria-labelledby="lx-h1" data-morph-target>
        <div className="w2-wrap lx-hero-g">
          <div className="lx-hero-copy">
            <motion.p className="w2-kicker acc" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>{d.kicker}</motion.p>
            <LineMask as="h1" id="lx-h1" now className="w2-display lx-h1" lines={d.title.split(' & ').map((t, i, a) => (i < a.length - 1 ? t + ' &' : t))} />
            <motion.p className="w2-lede lx-lede" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: EASE, delay: 0.35 }}>{d.lede}</motion.p>
          </div>
          <Settle from={1.08} lift={50}><Stack docs={docs} /></Settle>
        </div>
      </section>

      <section className="w2-sec tight lx-intro">
        <div className="w2-wrap lx-intro-g">
          <div className="lx-big"><Nodes nodes={[first]} /></div>
          <div className="lx-status"><span className="lx-status-dot" aria-hidden="true" /><div className="lx-prose"><Nodes nodes={status} /></div></div>
        </div>
      </section>

      <Catalogue groups={d.groups} />

      {how && (
        <section className="w2-sec lx-how">
          <div className="w2-wrap lx-how-g">
            <div>
              <h2 className="w2-headline">{how.title}<span id={how.id} className="lx-anchor" /></h2>
              <div className="lx-prose lx-how-p"><Nodes nodes={how.nodes} /></div>
            </div>
            <Ladder />
          </div>
        </section>
      )}

      {other.map((g) => (
        <section className="w2-sec tight lx-other" key={g.id}>
          <div className="w2-wrap"><h2 className="w2-headline">{g.title}<span id={g.id} className="lx-anchor" /></h2><div className="lx-prose"><Nodes nodes={g.nodes} /></div></div>
        </section>
      ))}

      {contact && (
        <section className="w2-sec lx-contact">
          <div className="w2-wrap lx-contact-g">
            <h2 className="w2-display s">{contact.title}<span id={contact.id} className="lx-anchor" /></h2>
            <ul className="lx-mail">
              {mail.c.map((li, i) => (
                <li key={i}><span>{li.c[0]}</span><Nodes nodes={li.c.slice(1)} /></li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </main>
  );
}
