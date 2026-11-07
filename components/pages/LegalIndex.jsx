'use client';
/* Persona: buyers, security and legal reviewers, and users checking their terms. Goal: reach the right document in one step. CTA: none (legal pages carry no ask; PLAN-COMPONENTS 2.4), so the ask bar is off. Metric: document open.
   /legal, the Trust Center, v2. V2: 8/10 Stage stack (the documents arrive as a pile of paper that deals itself), the catalogue as filter chips with cards that re-flow and open into their document, the four data-use states as a ladder, calm contact rows, sepia accent
   Signature: the documents as a stack of paper that deals itself. The top sheet slides to the back every few seconds
   and the next document comes up, each with its own address on hanzo.ai/legal.
   Beyond: "Find the one you need". Filter the twelve documents by kind (Agreements, Policies, Notices and registers)
   and the cards re-flow; every card opens into its document.
   Motion budget: signature = the dealing stack; supporting = Stage (Settle), layout re-flow (filter), open-into-page
   (Morph navigation). Utility archetype: calm, precise, one delight. Colour: none (0 UI hues). The stack has a pause
   button. Every word and link is Hanzo's. */
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { EASE } from '../ui';
import { A } from '../kit';
import { Nodes } from './DocNodes';
import { useArrival } from './doorway';
import { useLive, useEvery } from './cloud/Frame';
import LineMask from '../v2/x-gauss/LineMask';
import Settle from '../v2/Settle';
import NoJs from '../v2/x-gauss/NoJs';
import { usePause } from '../v2/x-gauss/Pause';
import '../v2/Scale.css';
import './LegalIndex.css';

const LADDER = [['service-only', 'by default'], ['private improvement'], ['research and training'], ['public commons']];
/* Hanzo's own line for a document, as plain text (its note, without the leading dash) */
const flat = (n) => (typeof n === 'string' ? n : n && n.c ? n.c.map(flat).join('') : '');
const lineOf = (it) => it.note.map(flat).join('').replace(/^\s*—\s*/, '').trim();

/* The hero object: the documents as a stack of paper; the top sheet goes to the back on its own. */
function Stack({ docs }) {
  const [ref, live] = useLive(0.3);
  const [paused, pauseBtn] = usePause({ right: 0, top: -4 });
  const [top, setTop] = useState(0);
  useEvery(2400, live && !paused, () => setTop((t) => (t + 1) % docs.length));
  const order = docs.map((_, i) => (i - top + docs.length) % docs.length);
  return (
    <div className="lgi-stack" ref={ref}>
      {pauseBtn}
      {docs.map((it, i) => {
        // every sheet stays on the desk: the top one slides out and settles at the back of the pile
        const k = Math.min(order[i], 4);
        const back = order[i] >= 4;
        return (
          <motion.div key={it.href} className="lgi-sheet" aria-hidden="true" initial={false}
            animate={{ x: k * 24, y: k * -20, rotate: k * 2 - 2, scale: 1 - k * 0.04, opacity: back ? 0 : 1, zIndex: 20 - order[i] }}
            transition={order[i] === docs.length - 1 ? { duration: 0.7, ease: EASE } : { type: 'spring', stiffness: 300, damping: 30 }}>
            <span className="lgi-sheet-u x-mono">hanzo.ai{it.href}</span>
            <b>{it.title}</b>
            <span className="lgi-sheet-p">{lineOf(it)}</span>
            <span className="lgi-sheet-s x-mono">draft · pending counsel</span>
          </motion.div>
        );
      })}
    </div>
  );
}

function Card({ it, group }) {
  const note = it.note.map((n, k) => (k === 0 && typeof n === 'string' ? n.replace(/^\s*—\s*/, '') : n));
  return (
    <A to={it.href} className="lgi-card" data-cursor="Open" data-cta={'legal.doc' + it.href.replace(/\//g, '.')}>
      <span className="lgi-card-k x-mono">{group}</span>
      <span className="lgi-card-t" data-morph>{it.title}</span>
      <span className="lgi-card-d"><span className="lgi-dash" aria-hidden="true">—</span> <Nodes nodes={note} /></span>
      <span className="lgi-card-u x-mono" aria-hidden="true">hanzo.ai{it.href}</span>
      <span className="lgi-card-go" aria-hidden="true">
        <svg viewBox="0 0 16 16" width="16" height="16"><path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </span>
    </A>
  );
}

function Catalogue({ groups }) {
  const [on, setOn] = useState('all');
  const all = groups.flatMap((g) => g.items.map((it) => ({ ...it, g })));
  // #agreements, #policies … pick their chip
  useEffect(() => {
    const pick = () => { const h = location.hash.slice(1); if (groups.some((g) => g.id === h)) setOn(h); };
    pick(); addEventListener('hashchange', pick);
    return () => removeEventListener('hashchange', pick);
  }, [groups]);
  return (
    <section className="w2-sec lgi-cat" aria-label="Documents">
      <div className="w2-wrap">
        <div className="lgi-chips" role="group" aria-label="Show">
          <button type="button" aria-pressed={on === 'all'} onClick={() => setOn('all')}>All <span className="x-mono">{all.length}</span></button>
          {groups.map((g) => (
            <button key={g.id} type="button" aria-pressed={on === g.id} onClick={() => setOn(g.id)}>
              <span className="lgi-chip-t">{g.title}</span><span className="x-mono">{g.items.length}</span><span id={g.id} className="lgi-anchor" />
            </button>
          ))}
        </div>
        <motion.ul className="lgi-cards" layout>
          <AnimatePresence initial={false}>
            {all.filter((it) => on === 'all' || it.g.id === on).map((it, i) => (
              <motion.li key={it.href} layout initial={{ y: 24 }} whileInView={{ y: 0 }} viewport={{ once: true, amount: 0.4 }} exit={{ opacity: 0, transition: { duration: 0.15 } }} transition={{ type: 'spring', stiffness: 300, damping: 30, delay: (i % 4) * 0.04 }}>
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
    <ol className="lgi-ladder" aria-hidden="true">
      {LADDER.map(([t, s], i) => (
        <motion.li key={t} style={{ '--k': i, originY: 1 }} initial={{ scaleY: 0.3 }} whileInView={{ scaleY: 1 }} viewport={{ once: true, amount: 0.6 }} transition={{ duration: 0.8, ease: EASE, delay: i * 0.08 }}>
          <span className="lgi-step-n x-mono">0{i + 1}</span><b>{t}</b>{s && <em>{s}</em>}
        </motion.li>
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
    <main className="lgi w2" data-ask="off">
      <NoJs />
      <section className="lgi-hero" aria-labelledby="lgi-h1" data-morph-target>
        <div className="w2-wrap lgi-hero-g">
          <div className="lgi-hero-copy">
            <LineMask as="h1" id="lgi-h1" now className="w2-display lgi-h1" lines={d.title.split(' & ').map((t, i, a) => (i < a.length - 1 ? t + ' &' : t))} />
            <p className="lgi-kick x-mono">{d.kicker}</p>
            <motion.p className="w2-lede lgi-lede" initial={{ y: 14 }} animate={{ y: 0 }} transition={{ duration: 0.9, ease: EASE, delay: 0.35 }}>{d.lede}</motion.p>
          </div>
          <Settle from={1.08} lift={50}><Stack docs={docs} /></Settle>
        </div>
      </section>

      <section className="w2-sec tight lgi-intro">
        <div className="w2-wrap lgi-intro-g">
          <div className="lgi-big"><Nodes nodes={[first]} /></div>
          <div className="lgi-status"><span className="lgi-status-dot" aria-hidden="true" /><div className="lgi-prose"><Nodes nodes={status} /></div></div>
        </div>
      </section>

      <Catalogue groups={d.groups} />

      {how && (
        <section className="w2-sec lgi-how">
          <div className="w2-wrap lgi-how-g">
            <div>
              <LineMask as="h2" className="w2-headline" lines={[how.title]} /><span id={how.id} className="lgi-anchor" />
              <div className="lgi-prose lgi-how-p"><Nodes nodes={how.nodes} /></div>
            </div>
            <Ladder />
          </div>
        </section>
      )}

      {other.map((g) => (
        <section className="w2-sec tight lgi-other" key={g.id}>
          <div className="w2-wrap"><h2 className="w2-headline">{g.title}<span id={g.id} className="lgi-anchor" /></h2><div className="lgi-prose"><Nodes nodes={g.nodes} /></div></div>
        </section>
      ))}

      {contact && (
        <section className="w2-sec lgi-contact">
          <div className="w2-wrap lgi-contact-g">
            <div><LineMask as="h2" className="w2-display s" lines={[contact.title]} /><span id={contact.id} className="lgi-anchor" /></div>
            <ul className="lgi-mail">
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
