'use client';
/* Persona: buyers, security and legal reviewers, and users checking their terms. Goal: reach the right document in one step. CTA: none (legal pages carry no ask; PLAN-COMPONENTS 2.4), so the ask bar is off. Metric: document open (data-cta legal.doc.<slug>).
   /legal, the Trust Center. V2: 8/10 the deal is a real deal (the top sheet leaves on top, x -110% and -8deg, then tucks under; the next comes up 200ms later), the pile stays inside its sheets with the pause on the pile's corner, index rows arrive once, an opaque chip bar that draws its hairline only when stuck, group h2s, print and no-JS sheets; greys only
   Signature: the documents as a stack of paper that deals itself. Every few seconds the top sheet travels out on top, then
   slides in under the pile, and the next document comes forward, each with its own address on hanzo.ai/legal.
   Beyond: "Find the one you need". Filter the twelve documents by kind (Agreements, Policies, Notices and registers)
   in a ruled index; each row previews its address on hover and opens into its document.
   Motion budget: signature = the dealing stack; supporting = LineMask cut-ins, Settle, rows rising once, the ladder growing,
   open-into-page (Morph navigation). No springs. Utility archetype: calm, precise, one delight. Colour: none (0 UI hues).
   The stack has a pause button. Every word and link is Hanzo's.
   Ledger: deletes the 3-up grey boxes, the second black pill, the sepia accent and the stamp on every sheet. */
import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { EASE } from '../ui';
import { play } from '../../lib/sound';
import { A } from '../kit';
import { Nodes } from './DocNodes';
import { useArrival } from './doorway';
import { useLive, useEvery } from './cloud/Frame';
import LineMask from '../v2/x-gauss/LineMask';
import Settle from '../v2/Settle';
import NoJs from '../v2/x-gauss/NoJs';
import { usePause } from '../v2/x-gauss/Pause';
import '../v2/Scale.css';
import '../v2/x-gauss/Rhythm.css';
import './LegalIndex.css';

const LADDER = [['service-only', 'by default'], ['private improvement'], ['research and training'], ['public commons']];
/* Hanzo's own line for a document, as plain text (its note, without the leading dash) */
const flat = (n) => (typeof n === 'string' ? n : n && n.c ? n.c.map(flat).join('') : '');
const lineOf = (it) => it.note.map(flat).join('').replace(/^\s*—\s*/, '').trim();

/* The hero object: the documents as a stack of paper; the top sheet goes to the back on its own. */
function Stack({ docs }) {
  const [ref, live] = useLive(0.3);
  const [paused, pauseBtn] = usePause({ position: 'relative', right: 'auto', top: 'auto' });
  const [top, setTop] = useState(0);
  const [out, setOut] = useState(-1); // the sheet leaving: it travels out on top first, then tucks under the pile
  useEvery(2600, live && !paused, () => {
    setOut(top);
    setTimeout(() => { setTop((t) => (t + 1) % docs.length); setOut(-1); }, 450);
  });
  const order = docs.map((_, i) => (i - top + docs.length) % docs.length);
  return (
    <div className="lgi-stack" ref={ref}>
      <div className="lgi-pile">
        {docs.map((it, i) => {
          const leaving = i === out;
          const k = Math.min(order[i], 4);
          const back = order[i] >= 4;
          const pose = leaving
            ? { x: '-110%', y: 0, rotate: -8, scale: 1, opacity: 1, zIndex: 40 }
            : { x: k * 24, y: k * -20, rotate: k * 2 - 2, scale: 1 - k * 0.04, opacity: back ? 0 : 1, zIndex: 20 - order[i] };
          const tr = leaving ? { duration: 0.45, ease: [0.16, 1, 0.3, 1] } : order[i] === 0 ? { duration: 0.4, ease: [0.16, 1, 0.3, 1], delay: 0.2 } : { duration: 0.4, ease: [0.4, 0, 0.2, 1] };
          return (
            <motion.div key={it.href} className="lgi-sheet" aria-hidden="true" initial={false} animate={pose} transition={tr}>
              <span className="lgi-sheet-u x-mono">hanzo.ai{it.href}</span>
              <b>{it.title}</b>
              <span className="lgi-sheet-p">{lineOf(it)}</span>
              {order[i] === 0 && <span className="lgi-sheet-s x-mono">draft · pending counsel</span>}
            </motion.div>
          );
        })}
      </div>
      <span className="lgi-pause">{pauseBtn}</span>
    </div>
  );
}

function Card({ it, group }) {
  const note = it.note.map((n, k) => (k === 0 && typeof n === 'string' ? n.replace(/^\s*—\s*/, '') : n));
  return (
    <A to={it.href} className="lgi-card" data-cta={'legal.doc.' + it.href.split('/').filter(Boolean).pop()}>
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
  const [stuck, setStuck] = useState(false);
  const pin = useRef(null);
  // the chip bar draws its hairline only once it is stuck under the header
  useEffect(() => {
    const el = pin.current; if (!el) return;
    const io = new IntersectionObserver(([e]) => setStuck(!e.isIntersecting && e.boundingClientRect.top < 80), { rootMargin: '-61px 0px 0px 0px' });
    io.observe(el); return () => io.disconnect();
  }, []);
  const all = groups.flatMap((g) => g.items.map((it) => ({ ...it, g })));
  // #agreements, #policies … pick their chip
  useEffect(() => {
    const pick = () => { const h = location.hash.slice(1); if (groups.some((g) => g.id === h)) setOn(h); };
    pick(); addEventListener('hashchange', pick);
    return () => removeEventListener('hashchange', pick);
  }, [groups]);
  return (
    <section className="w2-sec lgi-cat">
      <div className="w2-wrap">
        <span ref={pin} className="lgi-pin" aria-hidden="true" />
        <div className="lgi-chips" data-stuck={stuck || undefined}>
          <button type="button" aria-pressed={on === 'all'} onClick={() => { setOn('all'); play('tick'); }}>All <span className="x-mono">{all.length}</span></button>
          {groups.map((g) => (
            <button key={g.id} type="button" aria-pressed={on === g.id} onClick={() => { setOn(g.id); play('tick'); }}>
              <span className="lgi-chip-t">{g.title}</span><span className="x-mono">{g.items.length}</span><span id={g.id} className="lgi-anchor" />
            </button>
          ))}
        </div>
        {groups.map((g) => (
          <div key={g.id} className="lgi-group" hidden={!(on === 'all' || on === g.id)}>
            <h2 className="x-sr">{g.title}</h2>
            <ul className="lgi-cards">
              {g.items.map((it, i) => (
                <motion.li key={it.href} initial={{ y: 16 }} whileInView={{ y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1], delay: (i % 4) * 0.06 }}>
                  <Card it={it} group={g.title} />
                </motion.li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

function Ladder() {
  return (
    <ol className="lgi-ladder" aria-hidden="true">
      {LADDER.map(([t, s], i) => (
        <motion.li key={t} style={{ '--k': i, originY: 1 }} initial={{ scaleY: 0.3 }} whileInView={{ scaleY: 1 }} viewport={{ once: true, amount: 0.25 }} transition={{ duration: 0.8, ease: EASE, delay: i * 0.08 }}>
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
    <main id="main" className="lgi w2 gx" data-ask="off">
      <NoJs />
      <noscript><style>{'.lgi-pause{display:none!important}'}</style></noscript>
      <section className="lgi-hero" aria-labelledby="lgi-h1" data-morph-target>
        <div className="w2-wrap lgi-hero-g">
          <div className="lgi-hero-copy">
            <LineMask as="h1" id="lgi-h1" now className="w2-display lgi-h1" lines={d.title.split(' & ').map((t, i, a) => (i < a.length - 1 ? t + ' &' : t))} />
            <p className="lgi-kick x-mono">{d.kicker}</p>
            <motion.p className="w2-lede lgi-lede" initial={{ y: 14 }} animate={{ y: 0 }} transition={{ duration: 0.9, ease: EASE, delay: 0.35 }}>{d.lede}</motion.p>
          </div>
          <Settle from={1.02} lift={10}><Stack docs={docs} /></Settle>
        </div>
      </section>

      <section className="w2-sec tight lgi-intro">
        <div className="w2-wrap lgi-intro-g">
          <div className="lgi-big gx-say"><Nodes nodes={[first]} /></div>
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
