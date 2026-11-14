'use client';
/* Functions' "Common Use Cases" (page-local to /functions): a different move from the pinned chapters above it. The four
   cases stand together as one uneven grid of tiles (7 + 5 columns, twice), each with a small live drawing made
   only from that case's own words (REST and GraphQL through authentication and validation; a webhook stream through
   transformation and enrichment; image and text through GPU acceleration to classification; a schedule sweeping its
   jobs), its numeral, title and line. The tiles rise in as they are reached and their drawings run while on screen.
   - A tile grows into its own page: the tile hands its place to a full-screen sheet that grows out of the tile's own
     rectangle (600 ms, ease-in-out, transform only), with the drawing large and the case's three points; Esc, Close or
     Back shrinks it back into the tile, which reappears in its place.
   The three points stay in the HTML (shown inline with JS off). Phones stack the tiles in one column.
   Reduced motion: nothing loops and the sheet cuts in and out. */
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { useReducedMotion } from 'motion/react';
import KeynoteLines from '../../../v2/KeynoteLines';
import './FnUses.css';

export const USES: [string, string, string[]][] = [
  ['API Backends', 'Build complete REST or GraphQL APIs with automatic scaling and no server management.', ['Custom middleware for authentication and validation', 'API versioning and documentation generation', 'Automatic OpenAPI schema generation']],
  ['Real-time Processing', 'Process events in real-time with automatic scaling for traffic spikes.', ['Webhook handlers for third-party services', 'Event-driven data transformation and enrichment', 'Real-time analytics processing']],
  ['AI/ML Inference', 'Deploy machine learning models for inference with built-in GPU acceleration.', ['Image and text classification', 'AI chatbots and virtual assistants', 'Real-time recommendations']],
  ['Scheduled Tasks', 'Run tasks on a schedule without maintaining a dedicated server.', ['Periodic data cleanup and maintenance', 'Scheduled reports and notifications', 'Recurring data integration and ETL processes']],
];
const pad = (n: number) => String(n).padStart(2, '0');
const range = (n: number) => Array.from({ length: n }, (_, i) => i);

/* ---------- the four drawings (labels are the case's own words) ---------- */
function ApiObj() {
  return (
    <div className="fn-uo fn-uo-api" aria-hidden="true">
      <div className="fn-uo-col"><span className="fn-uo-pill a" data-t="REST">REST</span><span className="fn-uo-pill b" data-t="GraphQL">GraphQL</span></div>
      <div className="fn-uo-lane"><i className="fn-uo-dot" /><i className="fn-uo-dot back" /></div>
      <div className="fn-uo-box"><span>authentication</span><span>validation</span></div>
      <div className="fn-uo-lane"><i className="fn-uo-dot late" /></div>
      <div className="fn-uo-pods">{range(6).map((i) => <i key={i} style={{ '--j': i }} className={i < 3 ? 'on' : ''} />)}</div>
    </div>
  );
}

function StreamObj() {
  return (
    <div className="fn-uo fn-uo-stream" aria-hidden="true">
      <span className="fn-uo-pill">Webhook</span>
      <div className="fn-uo-lane wide">{range(7).map((i) => <i key={i} className="fn-uo-ev" style={{ '--j': i }} />)}</div>
      <div className="fn-uo-box ink"><span>transformation</span><span>enrichment</span></div>
      <div className="fn-uo-bars">{range(7).map((i) => <i key={i} style={{ '--j': i, '--h': [0.35, 0.55, 0.4, 0.7, 0.5, 0.85, 0.6][i] }} />)}</div>
    </div>
  );
}

function GpuObj() {
  return (
    <div className="fn-uo fn-uo-gpu" aria-hidden="true">
      <div className="fn-uo-col"><span className="fn-uo-pill a" data-t="Image">Image</span><span className="fn-uo-pill b" data-t="text">text</span></div>
      <div className="fn-uo-lane"><i className="fn-uo-dot" /><i className="fn-uo-dot late" /></div>
      <div className="fn-uo-chip"><div className="fn-uo-cells">{range(16).map((i) => <i key={i} style={{ '--j': (i % 4) + Math.floor(i / 4) }} />)}</div><span>GPU acceleration</span></div>
      <div className="fn-uo-lane"><i className="fn-uo-dot late" /></div>
      <span className="fn-uo-pill ink" data-t="classification">classification</span>
    </div>
  );
}

function CronObj() {
  return (
    <div className="fn-uo fn-uo-cron" aria-hidden="true">
      <div className="fn-uo-clock">
        <svg viewBox="0 0 120 120">{range(24).map((i) => <line key={i} x1="60" y1="6" x2="60" y2={i % 6 ? 12 : 18} transform={`rotate(${i * 15} 60 60)`} />)}</svg>
        <i className="fn-uo-hand" />
      </div>
      <ul className="fn-uo-jobs">
        {['data cleanup', 'reports and notifications', 'ETL processes'].map((t, i) => <li key={t} style={{ '--j': i }}><i />{t}</li>)}
      </ul>
    </div>
  );
}

const OBJS = [ApiObj, StreamObj, GpuObj, CronObj];
const Arrow = () => <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M5 11 11 5M6 5h5v5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>;
const EASE = 'cubic-bezier(.4,0,.2,1)';

export default function FnUses({ children }: { children?: ReactNode }) {
  const sec = useRef<HTMLElement>(null);
  const cards = useRef<(HTMLElement | null)[]>([]);
  const dlg = useRef<HTMLDialogElement>(null);
  const box = useRef<HTMLDivElement>(null);
  const from = useRef<DOMRect | null>(null);
  const openRef = useRef(-1);
  const calm = useReducedMotion();
  const [live, setLive] = useState(false);
  const [seen, setSeen] = useState<number[]>([]);
  const [open, setOpen] = useState(-1);
  const n = USES.length;

  // the drawings run only while the grid is on screen; each tile rises in the first time it is reached
  useEffect(() => {
    const el = sec.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setLive(e.isIntersecting), { threshold: 0.05 });
    io.observe(el);
    const io2 = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { const i = cards.current.indexOf(e.target as HTMLElement); setSeen((v) => (v.includes(i) ? v : [...v, i])); } }), { threshold: 0.2 });
    cards.current.forEach((c) => c && io2.observe(c));
    return () => { io.disconnect(); io2.disconnect(); };
  }, []);

  // the card opens into its page: the sheet grows out of the card's own rectangle, then its words fade in
  const show = (i: number) => {
    const card = cards.current[i];
    from.current = card ? card.getBoundingClientRect() : null;
    openRef.current = i;
    setOpen(i);
    // the entry keeps the router's own state (without it Next reloads the page on Back), plus a mark of ours
    try { history.pushState({ ...(history.state || {}), fnUse: i }, ''); } catch {}
  };
  useLayoutEffect(() => {
    const d = dlg.current;
    if (open < 0 || !d) return;
    if (!d.open) d.showModal();
    const b = box.current, r = from.current;
    b?.focus({ preventScroll: true }); // the sheet itself takes focus (no ring on a button the visitor did not reach)
    if (!b || !r || calm) return;
    const W = innerWidth, H = innerHeight;
    b.animate([
      { transform: `translate(${r.left}px, ${r.top}px) scale(${r.width / W}, ${r.height / H})` },
      { transform: 'none' },
    ], { duration: 600, easing: EASE });
    b.querySelector('.fn-uc-sh-in')?.animate([{ opacity: 0 }, { opacity: 0, offset: 0.45 }, { opacity: 1 }], { duration: 600, easing: EASE });
    from.current = null;
  }, [open, calm]);

  const shut = () => {
    const d = dlg.current, b = box.current, i = openRef.current;
    const done = () => { d?.close(); openRef.current = -1; setOpen(-1); cards.current[i]?.querySelector<HTMLElement>('.fn-uc-open')?.focus({ preventScroll: true }); };
    const card = cards.current[i];
    if (!b || !card || calm) return done();
    const r = card.getBoundingClientRect();
    const W = innerWidth, H = innerHeight;
    b.querySelector('.fn-uc-sh-in')?.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 250, easing: EASE, fill: 'forwards' });
    b.animate([
      { transform: 'none' },
      { transform: `translate(${r.left}px, ${r.top}px) scale(${r.width / W}, ${r.height / H})` },
    ], { duration: 600, easing: EASE, fill: 'forwards' }).onfinish = done;
  };
  // Back reverses the open; Close and Esc go back through history so the entry never lingers
  useEffect(() => {
    const pop = () => { if (openRef.current >= 0) shut(); };
    addEventListener('popstate', pop);
    return () => removeEventListener('popstate', pop);
  }, [calm]); // eslint-disable-line react-hooks/exhaustive-deps
  const close = () => {
    if (history.state && history.state.fnUse != null) history.back();
    else shut();
  };
  const step = (k: number) => {

    const j = (openRef.current + k + n) % n;
    openRef.current = j;
    setOpen(j);
  };

  const O = open >= 0 ? OBJS[open] : null;
  return (
    <section className="fn-uc" ref={sec} aria-labelledby="fn-uses-h" data-live={live && !calm ? '' : undefined}>
      <div className="kn-wrap">
        <div className="fn-uc-h">
          <KeynoteLines id="fn-uses-h" className="kn-headline" lines="Common Use Cases" />
          <p className="kn-lede">Hanzo Functions powers a wide range of serverless applications</p>
        </div>
        <div className="fn-uc-r">
          {USES.map(([t, d, pts], i) => {
            const Obj = OBJS[i];
            return (
              <article key={t} ref={(el) => { cards.current[i] = el; }} className="fn-uc-card" style={{ '--j': i % 2 }}
                data-seen={seen.includes(i) ? '' : undefined} data-away={open === i ? '' : undefined}>
                <div className="fn-uc-obj"><Obj /></div>
                <div className="fn-uc-t">
                  <span className="fn-uc-n kn-fig" aria-hidden="true">{pad(i + 1)}</span>
                  <h3 className="fn-uc-title"><button type="button" className="fn-uc-open" data-sound="whoosh" aria-haspopup="dialog" onClick={() => show(i)}>{t}</button></h3>
                  <p className="kn-body">{d}</p>
                  <ul className="fn-uc-pts">{pts.map((x) => <li key={x}>{x}</li>)}</ul>
                  <span className="fn-uc-go" aria-hidden="true"><Arrow /></span>
                </div>
              </article>
            );
          })}
        </div>
      </div>
      {children}

      <dialog ref={dlg} className="fn-uc-sheet" aria-labelledby="fn-uc-sh-h" onCancel={(e) => { e.preventDefault(); close(); }}>
        {open >= 0 && (
          <div className="fn-uc-sh" ref={box} tabIndex={-1} data-live={calm ? undefined : ''}>
            <div className="fn-uc-sh-in kn-wrap">
              <div className="fn-uc-sh-bar">
                <span className="fn-uc-sh-n kn-fig">{pad(open + 1)} / {pad(n)}</span>
                <div className="fn-uc-sh-nav">
                  <button type="button" className="fn-uc-sh-b" data-sound="tick" aria-label="Previous" onClick={() => step(-1)}><svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M10 3.5 5.5 8l4.5 4.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg></button>
                  <button type="button" className="fn-uc-sh-b" data-sound="tick" aria-label="Next" onClick={() => step(1)}><svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M6 3.5 10.5 8 6 12.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg></button>
                  <button type="button" className="fn-uc-sh-b" aria-label="Close" onClick={close}><svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M4 4l8 8M12 4l-8 8" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg></button>
                </div>
              </div>
              <div className="fn-uc-sh-g" key={open}>
                <div className="fn-uc-sh-t">
                  <h2 id="fn-uc-sh-h" className="fn-uc-sh-h">{USES[open][0]}</h2>
                  <p className="kn-lede">{USES[open][1]}</p>
                  <ol className="fn-uc-sh-pts">{USES[open][2].map((x, k) => <li key={x}><span className="kn-fig">{pad(k + 1)}</span>{x}</li>)}</ol>
                </div>
                <div className="fn-uc-sh-obj">{O && <O />}</div>
              </div>
            </div>
          </div>
        )}
      </dialog>
    </section>
  );
}
