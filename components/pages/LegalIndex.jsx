'use client';
/* Persona: buyers, security and legal reviewers, and users checking their terms. Goal: reach the right document in one step. CTA: none (legal pages carry no ask; PLAN-COMPONENTS 2.4), so the ask bar is off. Metric: document open (data-cta legal.doc.<slug>).
   /legal, the Trust Center. V2: 8/10 one paper language from top to bottom: the pile deals (out on top, under, the next forward), the status is a stamped sheet beside a 21px statement, the index reads small and exact (21px titles, 44px chips in one row on phones, a filter that re-deals its rows), the ladder, and the contact sheet that shows the address you point at; h1 near 38%, no dead gaps, deck tokens only
   Signature: the documents as a stack of paper that deals itself. Every few seconds the top sheet travels out on top, then
   slides in under the pile, and the next document comes forward, each with its own address on hanzo.ai/legal.
   Beyond: "Find the one you need". Filter the twelve documents by kind (Agreements, Policies, Notices and registers)
   in a ruled index; each row previews its address on hover and opens into its document.
   Motion budget (Utility: one delight plus three): signature = the dealing pile, echoed by the index's reading lamp
   (one row lit at a time, once through); supporting = line-mask cut-ins (h1, lede, headings), the index rows (rise once,
   re-deal on a filter change), the ladder growing. No springs. Colour: none (0 UI hues).
   One pause (beside the pile and at the end of the chip bar) stops the deal and the lamp. Every word and link is Hanzo's;
   the stamp on the pile and the contact sheet repeats Hanzo's own "Status: draft, pending counsel." as decoration.
   Ledger: deletes the 3-up grey boxes, the second black pill, the sepia accent, the invented "draft · pending counsel"
   stamp, the stage settle, the status ping, the lede's own rise, the 32px statement wall and the 350px gaps. */
import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { EASE } from '../ui';
import { play } from '../../lib/sound';
import { A } from '../kit';
import { Nodes } from './DocNodes';
import { useArrival } from './doorway';
import { useLive, useEvery } from './cloud/Frame';
import LineMask from '../v2/x-gauss/LineMask';
import NoJs from '../v2/x-gauss/NoJs';
import '../v2/Scale.css';
import '../v2/x-gauss/Rhythm.css';
import './LegalIndex.css';

const LADDER = [['service-only', 'by default'], ['private improvement'], ['research and training'], ['public commons']];
/* Hanzo's own line for a document, as plain text (its note, without the leading dash) */
const flat = (n) => (typeof n === 'string' ? n : n && n.c ? n.c.map(flat).join('') : '');
const lineOf = (it) => it.note.map(flat).join('').replace(/^\s*—\s*/, '').trim();
/* the first bold phrase in Hanzo's status note ("Status: draft, pending counsel."), used verbatim as the sheets' stamp */
const firstStrong = (nodes) => {
  for (const n of nodes || []) {
    if (n && typeof n === 'object') { if (n.t === 'strong') return flat(n).trim(); const k = firstStrong(n.c); if (k) return k; }
  }
  return '';
};

/* reduced motion, read after hydration so the server's HTML and the first client render agree */
function useCalm() {
  const rm = useReducedMotion();
  const [calm, setCalm] = useState(false);
  useEffect(() => setCalm(!!rm), [rm]);
  return calm;
}

/* the page's one pause (WCAG 2.2.2): it stops the deal and the index's reading lamp together; the same 44px control as
   the shared Pause, shown beside the pile and at the end of the chip bar */
function PauseBtn({ paused, set }) {
  return (
    <button type="button" className="w2-pause" style={{ position: 'relative', right: 'auto', top: 'auto' }} aria-pressed={paused} aria-label={paused ? 'Play' : 'Pause'} onClick={() => set((p) => !p)}>
      {paused
        ? <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M4.5 3v10l8.5-5z" fill="currentColor" /></svg>
        : <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><rect x="4" y="3" width="2.6" height="10" rx="1" fill="currentColor" /><rect x="9.4" y="3" width="2.6" height="10" rx="1" fill="currentColor" /></svg>}
    </button>
  );
}

/* The hero object: the documents as a stack of paper that deals itself. */
function Stack({ docs, stamp, paused, setPaused }) {
  const [ref, live] = useLive(0.3);
  const [top, setTop] = useState(0);
  const [out, setOut] = useState(-1); // the sheet leaving: it travels out on top first, then tucks under the pile
  const calm = useCalm();
  const tuck = useRef(0);
  useEffect(() => () => clearTimeout(tuck.current), []);
  useEvery(2600, live && !paused, () => {
    // reduced motion: a plain cut to the next sheet
    if (calm) { setTop((t) => (t + 1) % docs.length); return; }
    setOut(top);
    clearTimeout(tuck.current);
    tuck.current = setTimeout(() => { setTop((t) => (t + 1) % docs.length); setOut(-1); }, 450);
  });
  const order = docs.map((_, i) => (i - top + docs.length) % docs.length);
  const last = docs.length - 1;
  return (
    <div className="lgi-stack" ref={ref}>
      <div className="lgi-pile">
        {docs.map((it, i) => {
          const leaving = i === out;
          const k = Math.min(order[i], 4);
          const back = order[i] >= 4;
          // the leaving sheet lifts up and out to the left on top of the pile, clear of the lede
          const pose = leaving
            ? { x: '-55%', y: -56, rotate: -8, scale: 1, opacity: 1, zIndex: 40 }
            : { x: k * 24, y: k * -20, rotate: k * 2 - 2, scale: 1 - k * 0.04, opacity: back ? 0 : 1, zIndex: 20 - order[i] };
          // leaving: out on top (450ms ease-emphasis); then it slides in under the pile, seen going under before it fades
          // at the back; the next sheet comes forward 200ms after the leaving one has cleared
          const tr = calm ? { duration: 0 }
            : leaving ? { duration: 0.45, ease: [0.16, 1, 0.3, 1] }
            : order[i] === 0 ? { duration: 0.4, ease: [0.16, 1, 0.3, 1], delay: 0.2 }
            : order[i] === last ? { duration: 0.5, ease: [0.4, 0, 0.2, 1], opacity: { duration: 0.25, delay: 0.35 } }
            : { duration: 0.4, ease: [0.4, 0, 0.2, 1] };
          return (
            <motion.div key={it.href} className="lgi-sheet" aria-hidden="true" initial={false} animate={pose} transition={tr}>
              <span className="lgi-sheet-u x-mono">hanzo.ai{it.href}</span>
              <b>{it.title}</b>
              <span className="lgi-sheet-p">{lineOf(it)}</span>
              {order[i] === 0 && stamp && <span className="lgi-stamp">{stamp}</span>}
            </motion.div>
          );
        })}
      </div>
      <span className="lgi-pause"><PauseBtn paused={paused} set={setPaused} /></span>
    </div>
  );
}

function Card({ it, group, lit }) {
  const note = it.note.map((n, k) => (k === 0 && typeof n === 'string' ? n.replace(/^\s*—\s*/, '') : n));
  return (
    <A to={it.href} className={'lgi-card' + (lit ? ' lit' : '')} data-cta={'legal.doc.' + it.href.split('/').filter(Boolean).pop()}>
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

function Catalogue({ groups, paused, setPaused }) {
  const [on, setOn] = useState('all');
  const calm = useCalm();
  // the reading lamp: while the index is on screen, it lights one row at a time (its address shows, its arrow turns
  // ink), once through the list, the way the pile deals its sheets. It hides while a pointer is over the list (the
  // hover takes over), the shared pause stops it, and keyboard focus on a row puts it out for good.
  const [box, seen] = useLive(0.1);
  const [lit, setLit] = useState(-1);
  const [done, setDone] = useState(false);
  const stop = () => { if (!done) { setDone(true); setLit(-1); } };
  const [stuck, setStuck] = useState(false);
  const pin = useRef(null);
  const list = useRef(null);
  // the chip bar draws its hairline only once it is stuck under the header
  useEffect(() => {
    const el = pin.current; if (!el) return;
    const io = new IntersectionObserver(([e]) => setStuck(!e.isIntersecting && e.boundingClientRect.top < 80), { rootMargin: '-61px 0px 0px 0px' });
    io.observe(el); return () => io.disconnect();
  }, []);
  // a filter change re-deals the rows: each visible row comes in 8px low, 150ms, 30ms apart (not a cut)
  const first = useRef(true);
  useEffect(() => {
    if (first.current) { first.current = false; return; }
    if (calm || !list.current) return;
    list.current.querySelectorAll('.lgi-group:not([hidden]) .lgi-card').forEach((el, i) => {
      if (el.animate) el.animate([{ opacity: 0, transform: 'translateY(8px)' }, { opacity: 1, transform: 'none' }], { duration: 150, delay: Math.min(i, 8) * 30, easing: 'cubic-bezier(0,0,.2,1)', fill: 'backwards' });
    });
  }, [on, calm]);
  const all = groups.flatMap((g) => g.items.map((it) => ({ ...it, g })));
  const showing = all.filter((x) => on === 'all' || x.g.id === on).map((x) => x.href);
  useEvery(1300, seen && !paused && !done && !calm, () => setLit((k) => { if (k + 1 >= showing.length) { setDone(true); return -1; } return k + 1; }));
  const litHref = lit >= 0 ? showing[lit] : null;
  // #agreements, #policies … pick their chip
  useEffect(() => {
    const pick = () => { const h = location.hash.slice(1); if (groups.some((g) => g.id === h)) setOn(h); };
    pick(); addEventListener('hashchange', pick);
    return () => removeEventListener('hashchange', pick);
  }, [groups]);
  const choose = (id) => { if (id !== on) { setOn(id); setLit(-1); play('tick'); } };
  return (
    <section className="w2-sec lgi-cat">
      <div className="w2-wrap" ref={box} onFocus={(e) => e.target.closest('.lgi-card') && stop()}>
        <span ref={pin} className="lgi-pin" aria-hidden="true" />
        <div className="lgi-chips" data-stuck={stuck || undefined}>
          <div className="lgi-chips-r">
            <button type="button" aria-pressed={on === 'all'} onClick={() => choose('all')}>All <span className="x-mono">{all.length}</span></button>
            {groups.map((g) => (
              <button key={g.id} type="button" aria-pressed={on === g.id} onClick={() => choose(g.id)}>
                <span className="lgi-chip-t">{g.title}</span><span className="x-mono">{g.items.length}</span><span id={g.id} className="lgi-anchor" />
              </button>
            ))}
          </div>
          {!done && <span className="lgi-chips-p"><PauseBtn paused={paused} set={setPaused} /></span>}
        </div>
        <div ref={list}>
          {groups.map((g) => (
            <div key={g.id} className="lgi-group" hidden={!(on === 'all' || on === g.id)}>
              <h2 className="x-sr">{g.title}</h2>
              <ul className="lgi-cards">
                {g.items.map((it, i) => (
                  <motion.li key={it.href} initial={{ y: 16 }} whileInView={{ y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1], delay: (i % 4) * 0.06 }}>
                    <Card it={it} group={g.title} lit={it.href === litHref} />
                  </motion.li>
                ))}
              </ul>
            </div>
          ))}
        </div>
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

/* Contact: the four addresses beside one last sheet from the pile; the sheet shows the address you point at or focus */
function Contact({ contact, mail, title, stamp }) {
  const addr = mail.c.map((li) => flat({ c: li.c.slice(1) }).trim());
  const [at, setAt] = useState(-1);
  return (
    <section className="w2-sec lgi-contact">
      <div className="w2-wrap lgi-contact-g">
        <div className="lgi-contact-l">
          <LineMask as="h2" className="w2-headline" lines={[contact.title]} /><span id={contact.id} className="lgi-anchor" />
          <div className="lgi-sheet lgi-env" aria-hidden="true">
            <span className="lgi-sheet-u x-mono" key={at}>{at >= 0 ? addr[at] : 'hanzo.ai/legal'}</span>
            <b>{title}</b>
            {stamp && <span className="lgi-stamp">{stamp}</span>}
          </div>
        </div>
        <ul className="lgi-mail" onPointerLeave={() => setAt(-1)}>
          {mail.c.map((li, i) => (
            <li key={i} data-on={at === i || undefined} onPointerEnter={() => setAt(i)} onFocus={() => setAt(i)} onBlur={() => setAt(-1)}><span>{li.c[0]}</span><Nodes nodes={li.c.slice(1)} /></li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default function LegalIndex({ d }) {
  useArrival();
  const [paused, setPaused] = useState(false);
  const [first, ...status] = d.intro;
  const stamp = firstStrong(status);
  const docs = d.groups.flatMap((g) => g.items);
  const how = d.rest.find((g) => g.id === 'how-these-fit-together');
  const contact = d.rest.find((g) => g.id === 'contact');
  const other = d.rest.filter((g) => g !== how && g !== contact);
  const mail = contact && contact.nodes.find((n) => n.t === 'ul');
  return (
    <main id="main" className="lgi w2 gx" data-ask="off">
      <NoJs />
      <noscript><style>{'.lgi-pause,.lgi-chips-p{display:none!important}'}</style></noscript>
      <section className="lgi-hero" aria-labelledby="lgi-h1" data-morph-target>
        <div className="w2-wrap lgi-hero-g">
          <div className="lgi-hero-copy">
            <LineMask as="h1" id="lgi-h1" now className="w2-display lgi-h1" lines={d.title.split(' & ').map((t, i, a) => (i < a.length - 1 ? t + ' &' : t))} />
            <p className="lgi-kick x-mono">{d.kicker}</p>
            <LineMask as="p" now delay={0.3} className="w2-lede lgi-lede" lines={[d.lede]} />
          </div>
          <Stack docs={docs} stamp={stamp} paused={paused} setPaused={setPaused} />
        </div>
      </section>

      <section className="w2-sec lgi-intro">
        <div className="w2-wrap lgi-intro-g">
          <div className="lgi-big"><Nodes nodes={[first]} /></div>
          {/* the status as a sheet on the desk: Hanzo's note, its first bold phrase set as the stamp */}
          <div className="lgi-status">
            <span className="lgi-sheet-u x-mono" aria-hidden="true">hanzo.ai/legal</span>
            <div className="lgi-prose"><Nodes nodes={status} /></div>
          </div>
        </div>
      </section>

      <Catalogue groups={d.groups} paused={paused} setPaused={setPaused} />

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
        <section className="w2-sec lgi-other" key={g.id}>
          <div className="w2-wrap"><h2 className="w2-headline">{g.title}<span id={g.id} className="lgi-anchor" /></h2><div className="lgi-prose"><Nodes nodes={g.nodes} /></div></div>
        </section>
      ))}

      {contact && mail && <Contact contact={contact} mail={mail} title={d.title} stamp={stamp} />}
    </main>
  );
}
