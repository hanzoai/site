'use client';
/* Persona: buyers, security and legal reviewers, and users checking their terms. Goal: reach the right document in one step. CTA: none (legal pages carry no ask; PLAN-COMPONENTS 2.4), so the ask bar is off. Metric: document open (data-cta legal.doc.<slug>).
   /legal, the Trust Center. 8 Nov (COPY-RULE rule 4, simple pages stay simple): it reads like Hanzo's own index. Every
   document is a row with its kind, its title (the link) and Hanzo's line for it, all visible at once; the five room
   entrances (ripple, grid wave, cursor trail, scramble, ink spread) and the rows-open panels are gone, so nothing is
   held back or hidden until it plays; every room is in place at first paint.
   Kept: the dealing pile (out on top, under, the next forward) with its pause, the stamped status sheet, the chips that
   re-deal their rows, the ladder, the contact sheet that shows the address you point at. 0 UI hues.
   Every word and link is Hanzo's; the stamp on the pile and the contact sheet repeats Hanzo's own
   "Status: draft, pending counsel." as decoration.
   Ledger: deletes the reading lamp and its second pause (rows instead), the line-mask cut-ins, the 3-up grey
   boxes, the second black pill, the sepia accent, the invented stamp, the stage settle, the status ping. */
import { useEffect, useRef, useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import type { Transition } from 'motion/react';
import { play } from '../../lib/sound';
import { A } from '../kit';
import { Nodes } from './DocNodes';
import { useArrival } from './doorway';
import { useLive, useEvery } from './cloud/Frame';
import NoJs from '../v2/x-gauss/NoJs';
import PlainNoJs from '../NoJs';
import '../v2/Scale.css';
import '../v2/x-gauss/Rhythm.css';
import type { Branch, Child } from './htmltree';
import type { legalIndex, LegalGroup, LegalItem } from './legalData';
import './LegalIndex.css';

type Index = ReturnType<typeof legalIndex>;

const LADDER = [['service-only', 'by default'], ['private improvement'], ['research and training'], ['public commons']];
/* Hanzo's own line for a document, as plain text (its note, without the leading dash) */
const flat = (n: Child | { c: Child[] } | null | undefined): string => (typeof n === 'string' ? n : n && n.c ? n.c.map(flat).join('') : '');
const lineOf = (it: LegalItem) => it.note.map(flat).join('').replace(/^\s*—\s*/, '').trim();
const slugOf = (href: string) => href.split('/').filter(Boolean).pop();
/* the first bold phrase in Hanzo's status note ("Status: draft, pending counsel."), used verbatim as the sheets' stamp */
const firstStrong = (nodes: Child[] | undefined): string => {
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

/* the page's one pause (WCAG 2.2.2): it stops the deal; the same 44px control as the shared Pause */
function PauseBtn({ paused, set }: { paused: boolean; set: Dispatch<SetStateAction<boolean>> }) {
  return (
    <button type="button" className="w2-pause" style={{ position: 'relative', right: 'auto', top: 'auto' }} aria-pressed={paused} aria-label={paused ? 'Play' : 'Pause'} onClick={() => set((p) => !p)}>
      {paused
        ? <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M4.5 3v10l8.5-5z" fill="currentColor" /></svg>
        : <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><rect x="4" y="3" width="2.6" height="10" rx="1" fill="currentColor" /><rect x="9.4" y="3" width="2.6" height="10" rx="1" fill="currentColor" /></svg>}
    </button>
  );
}

/* The hero object: the documents as a stack of paper that deals itself. */
function Stack({ docs, stamp, paused, setPaused }: { docs: LegalItem[]; stamp: string; paused: boolean; setPaused: Dispatch<SetStateAction<boolean>> }) {
  const [ref, live] = useLive(0.3);
  const [top, setTop] = useState(0);
  const [out, setOut] = useState(-1); // the sheet leaving: it travels out on top first, then tucks under the pile
  const calm = useCalm();
  const tuck = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
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
          const tr: Transition = calm ? { duration: 0 }
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

/* ---------- the index: every document with Hanzo's own line for it, as live lists them ----------
   8 Nov (COPY-RULE rule 4): a legal index reads at a glance, so every row shows its line (no row has to be opened to
   read it); the title is the link and the whole row answers it (hover tint, arrow nudges, press 1px). */
function Row({ it, group }: { it: LegalItem; group: string }) {
  const slug = slugOf(it.href);
  // Hanzo's line as written, its leading dash set faint
  const first = it.note[0];
  const lead = typeof first === 'string' && /^\s*—/.test(first);
  const note = typeof first === 'string' && lead ? [first.replace(/^\s*—\s*/, ' '), ...it.note.slice(1)] : it.note;
  return (
    <div className="lgi-row">
      <span className="lgi-card-k x-mono">{group}</span>
      <div className="lgi-row-m">
        <A to={it.href} className="lgi-card-t" data-cta={'legal.doc.' + slug} data-morph>{it.title}</A>
        <p className="lgi-card-d">{lead && <span className="lgi-dash" aria-hidden="true">— </span>}<Nodes nodes={note} /></p>
      </div>
      <span className="lgi-card-go" aria-hidden="true">
        <svg viewBox="0 0 16 16" width="16" height="16"><path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </span>
    </div>
  );
}

function Catalogue({ groups }: { groups: Index['groups'] }) {
  const [on, setOn] = useState('all');
  const calm = useCalm();
  const [stuck, setStuck] = useState(false);
  const pin = useRef<HTMLSpanElement>(null);
  const list = useRef<HTMLDivElement>(null);
  const all = groups.flatMap((g) => g.items.map((it) => ({ ...it, g })));
  const showing = all.filter((x) => on === 'all' || x.g.id === on).map((x) => x.href);
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
    list.current.querySelectorAll('.lgi-group:not([hidden]) .lgi-row').forEach((el, i) => {
      if (el.animate) el.animate([{ opacity: 0, transform: 'translateY(8px)' }, { opacity: 1, transform: 'none' }], { duration: 150, delay: Math.min(i, 8) * 30, easing: 'cubic-bezier(0,0,.2,1)', fill: 'backwards' });
    });
  }, [on, calm]);
  // #agreements, #policies … pick their chip
  useEffect(() => {
    const pick = () => { const h = location.hash.slice(1); if (groups.some((g) => g.id === h)) choose(h, true); };
    pick(); addEventListener('hashchange', pick);
    return () => removeEventListener('hashchange', pick);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groups]);
  function choose(id: string, quiet?: boolean) {
    if (id === on) return;
    setOn(id);
    if (!quiet) play('tick');
  }
  return (
    <section className="w2-sec lgi-cat">
      <div className="w2-wrap">
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
        </div>
        <div ref={list} className="lgi-list">
          {groups.map((g) => (
            <div key={g.id} className="lgi-group" hidden={!(on === 'all' || on === g.id)}>
              <h2 className="x-sr">{g.title}</h2>
              <ul className="lgi-cards">
                {g.items.map((it) => (
                  <li key={it.href}>
                    <Row it={it} group={g.title} />
                  </li>
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
        <li key={t} style={{ '--k': i }}>
          <span className="lgi-step-n x-mono">0{i + 1}</span><b>{t}</b>{s && <em>{s}</em>}
        </li>
      ))}
    </ol>
  );
}

/* Contact: the four addresses beside one last sheet from the pile; the sheet shows the address you point at or focus */
function Contact({ contact, mail, title, stamp }: { contact: LegalGroup; mail: Branch; title: string; stamp: string }) {
  const items = mail.c.filter((li): li is Branch => typeof li !== 'string');
  const addr = items.map((li) => flat({ c: li.c.slice(1) }).trim());
  const [at, setAt] = useState(-1);
  return (
    <section className="w2-sec lgi-contact">
      <div className="w2-wrap lgi-contact-g">
        <div className="lgi-contact-l">
          <h2 className="w2-headline">{contact.title}</h2><span id={contact.id} className="lgi-anchor" />
          <div className="lgi-sheet lgi-env" aria-hidden="true">
            <span className="lgi-sheet-u x-mono" key={at}>{at >= 0 ? addr[at] : 'hanzo.ai/legal'}</span>
            <b>{title}</b>
            {stamp && <span className="lgi-stamp">{stamp}</span>}
          </div>
        </div>
        <ul className="lgi-mail" onPointerLeave={() => setAt(-1)}>
          {items.map((li, i) => (
            <li key={i} data-on={at === i || undefined} onPointerEnter={() => setAt(i)} onFocus={() => setAt(i)} onBlur={() => setAt(-1)}><span><Nodes nodes={[li.c[0]]} /></span><Nodes nodes={li.c.slice(1)} />
</li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function How({ how }: { how: LegalGroup }) {
  return (
    <section className="w2-sec lgi-how">
      <div className="w2-wrap lgi-how-g">
        <div>
          <h2 className="w2-headline">{how.title}</h2><span id={how.id} className="lgi-anchor" />
          <div className="lgi-prose lgi-how-p"><Nodes nodes={how.nodes} /></div>
        </div>
        <Ladder />
      </div>
    </section>
  );
}

export default function LegalIndex({ d }: { d: Index }) {
  useArrival();
  const [paused, setPaused] = useState(false);
  const [first, ...status] = d.intro;
  const stamp = firstStrong(status);
  const docs = d.groups.flatMap((g) => g.items);
  const how = d.rest.find((g) => g.id === 'how-these-fit-together');
  const contact = d.rest.find((g) => g.id === 'contact');
  const other = d.rest.filter((g) => g !== how && g !== contact);
  const mail = contact && contact.nodes.find((n): n is Branch => typeof n !== 'string' && n.t === 'ul');
  const lines = d.title.split(' & ').map((t, i, a) => (i < a.length - 1 ? t + ' & ' : t));
  return (
    <main id="main" className="lgi w2 gx" data-ask="off">
      <NoJs />
      <PlainNoJs css=".lgi-pause{display:none!important}" />
      <section className="lgi-hero" aria-labelledby="lgi-h1" data-morph-target>
        <div className="w2-wrap lgi-hero-g">
          <div className="lgi-hero-copy">
            <h1 id="lgi-h1" className="w2-display lgi-h1">{lines.map((t, i) => <span key={i} className="lgi-h1-l">{t}</span>)}</h1>
            <p className="lgi-kick x-mono">{d.kicker}</p>
            <p className="w2-lede lgi-lede">{d.lede}</p>
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

      <Catalogue groups={d.groups} />

      {how && <How how={how} />}

      {other.map((g) => (
        <section className="w2-sec lgi-other" key={g.id}>
          <div className="w2-wrap"><h2 className="w2-headline">{g.title}<span id={g.id} className="lgi-anchor" /></h2><div className="lgi-prose"><Nodes nodes={g.nodes} /></div></div>
        </section>
      ))}

      {contact && mail && <Contact contact={contact} mail={mail} title={d.title} stamp={stamp} />}
    </main>
  );
}
