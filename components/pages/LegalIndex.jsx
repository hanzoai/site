'use client';
/* Persona: buyers, security and legal reviewers, and users checking their terms. Goal: reach the right document in one step. CTA: none (legal pages carry no ask; PLAN-COMPONENTS 2.4), so the ask bar is off. Metric: document open (data-cta legal.doc.<slug>).
   /legal, the Trust Center. V2: 9/10 motion-map pass (7 Nov): the twelve documents are rows that open in place (hover, tap or keys) into Hanzo's own sentence and address; each of the five rooms arrives its own way (ripple, grid wave, cursor trail, scramble, ink spread); the pile still deals; no line-mask cut-ins, no lamp
   Signature: rows-open. The document index is a tight list of kind and title; a row opens in place into its detail
   panel (Hanzo's own line for that document and its address, which opens it). A resting mouse opens the row under it
   (only on a real move, so rows sliding under a still pointer never cascade), a tap or Enter/Space toggles it, the arrow
   keys walk the rows, and the first row of the list stands open so the pattern shows itself. The arrow at the row's end
   still opens the document in one step.
   Entrances: ripple, grid-wave, cursor-trail, scramble, ink-spread (one per room, in order, once each, page-local:
   hero = rings spread from its centre and its parts arrive outward; intro = a grid of paper tiles lifts in a wave from
   the cursor; index = a trail of dots runs from the cursor down the list and lays each row; how = the heading and the
   ladder's labels decode out of scrambled letters; contact = an ink-blot mask spreads from the contact sheet).
   Kept: the dealing pile (out on top, under, the next forward) with its pause, the stamped status sheet, the chips that
   re-deal their rows, the growing ladder, the contact sheet that shows the address you point at. 0 UI hues.
   Every word and link is Hanzo's; the stamp on the pile and the contact sheet repeats Hanzo's own
   "Status: draft, pending counsel." as decoration.
   Ledger: deletes the reading lamp and its second pause (the rows open instead), the line-mask cut-ins, the 3-up grey
   boxes, the second black pill, the sepia accent, the invented stamp, the stage settle, the status ping. */
import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { EASE } from '../ui';
import { play } from '../../lib/sound';
import { A } from '../kit';
import { Nodes } from './DocNodes';
import { useArrival } from './doorway';
import { useLive, useEvery } from './cloud/Frame';
import NoJs from '../v2/x-gauss/NoJs';
import PlainNoJs from '../NoJs';
import '../v2/Scale.css';
import '../v2/x-gauss/Rhythm.css';
import './LegalIndex.css';

const LADDER = [['service-only', 'by default'], ['private improvement'], ['research and training'], ['public commons']];
/* Hanzo's own line for a document, as plain text (its note, without the leading dash) */
const flat = (n) => (typeof n === 'string' ? n : n && n.c ? n.c.map(flat).join('') : '');
const lineOf = (it) => it.note.map(flat).join('').replace(/^\s*—\s*/, '').trim();
const slugOf = (href) => href.split('/').filter(Boolean).pop();
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

/* ---------- entrances (page-local) ----------
   The server paints every room in its true layout. html.js (set before first paint) holds each room's first frame in
   LegalIndex.css; the first time the room reaches the screen, play(el) runs and data-in lets the room settle. Reduced
   motion: data-in at once, no frames. JavaScript off: html:not(.js), so nothing is ever held. */
const ptr = { x: -1, y: -1 }; // the last place a pointer was (viewport px); -1 = none yet (touch, keyboard)
const calmNow = () => typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;
function useEnter(play) {
  const ref = useRef(null);
  const run = useRef(play);
  run.current = play;
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (calmNow() || !('IntersectionObserver' in window)) { el.setAttribute('data-in', ''); el.setAttribute('data-done', ''); return; }
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      if (run.current) run.current(el);
      el.setAttribute('data-in', '');
    }, { rootMargin: '0px 0px -12% 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return ref;
}

/* e4 scramble: letters scramble and decode into the real words, left to right (spaces hold their place) */
const GLYPHS = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
function scramble(els) {
  els.forEach((el, n) => {
    const real = el.textContent;
    const box = el.closest('[data-scr-box]');
    if (box && !box.style.height) box.style.height = box.offsetHeight + 'px'; // the decode never reflows the room
    let f = -n * 3; // each label starts a beat after the one before
    const frames = 18;
    const t = setInterval(() => {
      f++;
      if (f < 0) return;
      const done = Math.floor((f / frames) * real.length);
      el.textContent = real.split('').map((c, i) => (c === ' ' || i < done ? c : GLYPHS[(Math.random() * GLYPHS.length) | 0])).join('');
      if (f >= frames) { clearInterval(t); el.textContent = real; if (box) box.style.height = ''; }
    }, 42);
  });
}

/* the page's one pause (WCAG 2.2.2): it stops the deal; the same 44px control as the shared Pause */
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
    <div className="lgi-stack lgi-rip-a" style={{ '--r': 0 }} ref={ref}>
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

/* e2 grid-wave: a grid of paper tiles over the intro; they lift in a wave by their distance from the cursor (or, with
   no pointer yet, from the top centre), uncovering the statement and the status sheet */
const COLS = 12, ROWS = 5;
function gridWave(sec) {
  const g = sec.querySelector('.lgi-grid');
  if (!g) return;
  const b = g.getBoundingClientRect();
  const ox = ptr.x >= 0 ? ptr.x - b.left : b.width / 2;
  const oy = ptr.x >= 0 ? ptr.y - b.top : 0;
  const far = Math.hypot(Math.max(ox, b.width - ox), Math.max(oy, b.height - oy)) || 1;
  [...g.children].forEach((t, i) => {
    const cx = ((i % COLS) + 0.5) * (b.width / COLS), cy = (Math.floor(i / COLS) + 0.5) * (b.height / ROWS);
    t.style.setProperty('--d', Math.round((Math.hypot(cx - ox, cy - oy) / far) * 620) + 'ms');
  });
}

/* ---------- the signature: rows that open ---------- */
function Row({ it, group, open, onOpen, onToggle, onKey }) {
  const slug = slugOf(it.href);
  const note = it.note.map((n, k) => (k === 0 && typeof n === 'string' ? n.replace(/^\s*—\s*/, '') : n));
  const rest = useRef(0);
  useEffect(() => () => clearTimeout(rest.current), []);
  // a resting mouse opens the row under it; only a real move counts (movement 0 = the row slid under a still pointer)
  const move = (e) => {
    if (e.pointerType !== 'mouse' || open || (!e.movementX && !e.movementY)) return;
    clearTimeout(rest.current);
    rest.current = setTimeout(onOpen, 140);
  };
  return (
    <div className={'lgi-row' + (open ? ' open' : '')} onPointerMove={move} onPointerLeave={() => clearTimeout(rest.current)}>
      <div className="lgi-row-h">
        <button type="button" className="lgi-row-b" aria-expanded={open} aria-controls={'lgi-p-' + slug} onClick={onToggle} onKeyDown={onKey}>
          <span className="lgi-card-k x-mono">{group}</span>
          <span className="lgi-card-t" data-morph>{it.title}</span>
          <span className="lgi-row-x" aria-hidden="true"><i /><i /></span>
        </button>
        <A to={it.href} className="lgi-card-go" tabIndex={-1} aria-hidden="true" data-cta={'legal.doc.' + slug}>
          <svg viewBox="0 0 16 16" width="16" height="16"><path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </A>
      </div>
      <div className="lgi-row-p" id={'lgi-p-' + slug} role="region" aria-label={it.title} inert={!open}>
        <div className="lgi-row-pi">
          <p className="lgi-card-d"><Nodes nodes={note} /></p>
          <A to={it.href} className="lgi-row-go" data-cta={'legal.doc.' + slug}>
            <span className="x-mono">hanzo.ai{it.href}</span>
            <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </A>
        </div>
      </div>
    </div>
  );
}

/* e3 cursor-trail: a short trail of ink dots starts where the cursor is (or at the list's left edge), runs down the
   list row by row and lays each row as it passes; a pointer moving over the list pulls the trail along with it */
function trail(sec) {
  const list = sec.querySelector('.lgi-list');
  const dots = sec.querySelector('.lgi-trail');
  if (!list || !dots) return;
  const lis = [...list.querySelectorAll('.lgi-group:not([hidden]) .lgi-cards > li')];
  const lb = list.getBoundingClientRect();
  let x = ptr.x >= 0 ? Math.min(Math.max(ptr.x - lb.left, 24), lb.width - 24) : 24;
  const put = (px, py) => { dots.style.setProperty('--x', px + 'px'); dots.style.setProperty('--y', py + 'px'); };
  const y0 = lis[0] ? lis[0].offsetTop + 30 : 0;
  dots.style.transition = 'none';
  put(x, y0);
  dots.getBoundingClientRect();
  dots.style.transition = '';
  sec.setAttribute('data-trail', '');
  let k = 0;
  const lay = (upTo) => { while (k < lis.length && lis[k].offsetTop <= upTo) lis[k++].setAttribute('data-t', ''); };
  const follow = (e) => {
    if (e.pointerType !== 'mouse') return;
    const r = list.getBoundingClientRect();
    put(e.clientX - r.left, e.clientY - r.top);
    lay(e.clientY - r.top);
  };
  list.addEventListener('pointermove', follow);
  const step = setInterval(() => {
    if (k >= lis.length) {
      clearInterval(step);
      list.removeEventListener('pointermove', follow);
      setTimeout(() => { sec.removeAttribute('data-trail'); sec.setAttribute('data-done', ''); }, 420);
      return;
    }
    const li = lis[k];
    x += (k % 2 ? -1 : 1) * Math.min(90, lb.width * 0.08);
    put(x, li.offsetTop + li.offsetHeight / 2);
    li.setAttribute('data-t', '');
    k++;
  }, 95);
}

function Catalogue({ groups }) {
  const [on, setOn] = useState('all');
  const calm = useCalm();
  const [stuck, setStuck] = useState(false);
  const pin = useRef(null);
  const list = useRef(null);
  const all = groups.flatMap((g) => g.items.map((it) => ({ ...it, g })));
  const showing = all.filter((x) => on === 'all' || x.g.id === on).map((x) => x.href);
  // one row stands open: the first of the list, until the reader opens another
  const [open, setOpen] = useState(showing[0]);
  const sec = useEnter(trail);
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
  function choose(id, quiet) {
    if (id === on) return;
    setOn(id);
    const firstOf = all.find((x) => id === 'all' || x.g.id === id);
    if (firstOf) setOpen(firstOf.href);
    if (!quiet) play('tick');
  }
  const toggle = (href) => { setOpen((o) => (o === href ? null : href)); play('tick'); };
  // the arrow keys walk the rows (Home and End jump), focus stays on the row buttons
  const walk = (e) => {
    const keys = { ArrowDown: 1, ArrowUp: -1, Home: -99, End: 99 };
    if (!(e.key in keys) || !list.current) return;
    const bs = [...list.current.querySelectorAll('.lgi-group:not([hidden]) .lgi-row-b')];
    const i = bs.indexOf(e.currentTarget);
    const j = Math.max(0, Math.min(bs.length - 1, i + keys[e.key]));
    if (j !== i) { e.preventDefault(); bs[j].focus(); }
  };
  return (
    <section className="w2-sec lgi-cat" ref={sec}>
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
          <span className="lgi-trail" aria-hidden="true">{[0, 1, 2, 3, 4, 5].map((i) => <i key={i} style={{ '--i': i }} />)}</span>
          {groups.map((g) => (
            <div key={g.id} className="lgi-group" hidden={!(on === 'all' || on === g.id)}>
              <h2 className="x-sr">{g.title}</h2>
              <ul className="lgi-cards">
                {g.items.map((it) => (
                  <li key={it.href}>
                    <Row it={it} group={g.title} open={open === it.href} onOpen={() => setOpen(it.href)} onToggle={() => toggle(it.href)} onKey={walk} />
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
        <motion.li key={t} style={{ '--k': i, originY: 1 }} initial={{ scaleY: 0.3 }} whileInView={{ scaleY: 1 }} viewport={{ once: true, amount: 0.25 }} transition={{ duration: 0.8, ease: EASE, delay: i * 0.08 }}>
          <span className="lgi-step-n x-mono">0{i + 1}</span><b data-scr>{t}</b>{s && <em data-scr>{s}</em>}
        </motion.li>
      ))}
    </ol>
  );
}

/* e5 ink-spread: an ink-blot mask, its edge wobbling, spreads from the contact sheet over the whole room */
function blob(cx, cy, r, ph) {
  const pts = [];
  for (let i = 0; i < 28; i++) {
    const a = (i / 28) * Math.PI * 2;
    const k = 1 + 0.16 * Math.sin(3 * a + ph) + 0.09 * Math.sin(5 * a - ph * 1.7) + 0.05 * Math.sin(9 * a + ph * 0.6);
    pts.push(Math.round(cx + Math.cos(a) * r * k) + 'px ' + Math.round(cy + Math.sin(a) * r * k) + 'px');
  }
  return 'polygon(' + pts.join(',') + ')';
}
function inkSpread(sec) {
  const g = sec.querySelector('.lgi-contact-g');
  const env = sec.querySelector('.lgi-env');
  if (!g || !g.animate) return;
  const b = g.getBoundingClientRect();
  const e = env ? env.getBoundingClientRect() : b;
  const cx = e.left - b.left + e.width / 2, cy = e.top - b.top + e.height / 2;
  const R = Math.hypot(Math.max(cx, b.width - cx), Math.max(cy, b.height - cy)) * 1.25;
  g.animate([
    { clipPath: blob(cx, cy, 4, 0) },
    { clipPath: blob(cx, cy, R * 0.22, 1.2), offset: 0.25 },
    { clipPath: blob(cx, cy, R * 0.6, 2.3), offset: 0.6 },
    { clipPath: blob(cx, cy, R, 3.1) },
  ], { duration: 1300, easing: 'cubic-bezier(.3,.1,.3,1)', fill: 'backwards' });
}

/* Contact: the four addresses beside one last sheet from the pile; the sheet shows the address you point at or focus */
function Contact({ contact, mail, title, stamp }) {
  const addr = mail.c.map((li) => flat({ c: li.c.slice(1) }).trim());
  const [at, setAt] = useState(-1);
  const sec = useEnter(inkSpread);
  return (
    <section className="w2-sec lgi-contact" ref={sec}>
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
          {mail.c.map((li, i) => (
            <li key={i} data-on={at === i || undefined} onPointerEnter={() => setAt(i)} onFocus={() => setAt(i)} onBlur={() => setAt(-1)}><span>{li.c[0]}</span><Nodes nodes={li.c.slice(1)} /></li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function How({ how }) {
  const sec = useEnter((el) => scramble([...el.querySelectorAll('[data-scr]')]));
  return (
    <section className="w2-sec lgi-how" ref={sec}>
      <div className="w2-wrap lgi-how-g">
        <div>
          <h2 className="w2-headline" data-scr-box><span className="x-sr">{how.title}</span><span aria-hidden="true" data-scr>{how.title}</span></h2><span id={how.id} className="lgi-anchor" />
          <div className="lgi-prose lgi-how-p"><Nodes nodes={how.nodes} /></div>
        </div>
        <Ladder />
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
  // e1 ripple: the hero is the first screen, so it plays from first paint in CSS (no wait for a script)
  const intro = useEnter(gridWave);
  // the last place the pointer was: the grid wave and the trail start from it
  useEffect(() => {
    const at = (e) => { ptr.x = e.clientX; ptr.y = e.clientY; };
    addEventListener('pointermove', at, { passive: true });
    addEventListener('pointerdown', at, { passive: true });
    return () => { removeEventListener('pointermove', at); removeEventListener('pointerdown', at); };
  }, []);
  const lines = d.title.split(' & ').map((t, i, a) => (i < a.length - 1 ? t + ' & ' : t));
  return (
    <main id="main" className="lgi w2 gx" data-ask="off">
      <NoJs />
      <PlainNoJs css=".lgi-pause{display:none!important}" />
      <section className="lgi-hero" aria-labelledby="lgi-h1" data-morph-target>
        <span className="lgi-rings" aria-hidden="true"><i /><i /><i /></span>
        <div className="w2-wrap lgi-hero-g">
          <div className="lgi-hero-copy">
            <h1 id="lgi-h1" className="w2-display lgi-h1 lgi-rip-a" style={{ '--r': 1 }}>{lines.map((t, i) => <span key={i} className="lgi-h1-l">{t}</span>)}</h1>
            <p className="lgi-kick x-mono lgi-rip-a" style={{ '--r': 2 }}>{d.kicker}</p>
            <p className="w2-lede lgi-lede lgi-rip-a" style={{ '--r': 3 }}>{d.lede}</p>
          </div>
          <Stack docs={docs} stamp={stamp} paused={paused} setPaused={setPaused} />
        </div>
      </section>

      <section className="w2-sec lgi-intro" ref={intro}>
        <div className="w2-wrap lgi-intro-g">
          <div className="lgi-big"><Nodes nodes={[first]} /></div>
          {/* the status as a sheet on the desk: Hanzo's note, its first bold phrase set as the stamp */}
          <div className="lgi-status">
            <span className="lgi-sheet-u x-mono" aria-hidden="true">hanzo.ai/legal</span>
            <div className="lgi-prose"><Nodes nodes={status} /></div>
          </div>
          <span className="lgi-grid" aria-hidden="true">{Array.from({ length: COLS * ROWS }, (_, i) => <i key={i} />)}</span>
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
