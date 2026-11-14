'use client';
/* PubSub's six facts ("More than pub/sub") as one list beside one drawing. The fact at the middle of the screen (or
   under the pointer) is the one in ink; the drawing beside the heading stays put and draws that fact once, in about
   three seconds, then rests: the stream keeps its newest and ages out its oldest while a consumer reads along; a
   duplicate collapses and the ack comes home; a bucket's key takes a new value under a watch; a request reaches
   exactly one instance of a queue group and one answer comes back; a payload is chunked into a stream and put back
   together; an account wall stops a subject at the edge. On phones each fact carries its own drawing, drawn once as
   it comes up the screen. Every run ends on a still frame (no loop, so no pause is needed). Reduced motion: the final frame.
   Grey only; labels, keys and numbers in the drawings are drawn, never Hanzo's figures. */
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useCalm } from '../../../ui';
import { useSnap } from './PsEnter';

type Bezier = [number, number, number, number];
const EASE: Bezier = [0.16, 1, 0.3, 1];
const IO: Bezier = [0.4, 0, 0.2, 1];
const at = (delay: number, duration = 0.4, ease: Bezier = EASE) => ({ delay, duration, ease });
const pad = (n: number) => String(n).padStart(2, '0');

/* one drawing; `still` renders its final frame with no animation */
function Fig({ i, still }: { i: number; still: boolean }) {
  const ini = <T,>(o: T) => (still ? false : o);
  // the one cell that fills (the consumer, the instance that answers): a class after mount, its colour from CSS so dark
  // mode has its own; the fill's delay sits on the element
  const [lit, setLit] = useState(false);
  useEffect(() => { const t = requestAnimationFrame(() => setLit(true)); return () => cancelAnimationFrame(t); }, []);
  const M = motion;
  if (i === 0) {
    // streams: the newest written at the right, the oldest aged out at the left, a consumer reading along
    const xs = Array.from({ length: 8 }, (_, k) => 14 + k * 40);
    return (
      <g>
        <text x="14" y="40">stream EVENTS · events.&gt;</text>
        {xs.map((x, k) => {
          const n = 38 + k;
          if (k === 7) return (
            <M.g key={n} initial={ini({ opacity: 0, x: 18 })} animate={{ opacity: 1, x: 0 }} transition={at(0.2)}>
              <rect x={x} y="88" width="34" height="40" rx="8" className="f-ink" />
              <text x={x + 17} y="113" textAnchor="middle" className="t-inv">{n}</text>
            </M.g>
          );
          if (k === 0) return (
            <M.g key={n} initial={ini({ opacity: 1 })} animate={{ opacity: 0.4 }} transition={at(0.9, 0.5, IO)}>
              <rect x={x} y="88" width="34" height="40" rx="8" className="f-out dash" />
              <text x={x + 17} y="113" textAnchor="middle">{n}</text>
            </M.g>
          );
          return (
            <g key={n}>
              <rect x={x} y="88" width="34" height="40" rx="8" className="f-cell" />
              <text x={x + 17} y="113" textAnchor="middle">{n}</text>
            </g>
          );
        })}
        <M.text x="14" y="76" initial={ini({ opacity: 0 })} animate={{ opacity: 1 }} transition={at(1.1)}>aged out</M.text>
        <M.g initial={ini({ x: 0 })} animate={{ x: [0, 40, 80, 120, 160, 200, 240] }} transition={{ delay: 1.3, duration: 1.8, ease: 'linear', times: [0, 0.17, 0.33, 0.5, 0.67, 0.83, 1] }}>
          <path d="M71 142 l-6 9 h12 z" className="f-ink" />
          <text x="71" y="174" textAnchor="middle" className="t-ink">consumer</text>
        </M.g>
      </g>
    );
  }
  if (i === 1) {
    // acked: one message stored and delivered, its duplicate collapsed, the ack home on an arc
    return (
      <g>
        <rect x="12" y="84" width="88" height="48" rx="12" className="f-cell" />
        <text x="56" y="113" textAnchor="middle">publish</text>
        <rect x="126" y="84" width="88" height="48" rx="12" className="f-cell" />
        <text x="170" y="113" textAnchor="middle">EVENTS</text>
        <rect x="240" y="84" width="88" height="48" rx="12" className={'f-sw' + (lit ? ' on' : '')} style={still ? { transition: 'none' } : { transitionDelay: '1s' }} />
        <M.text x="284" y="113" textAnchor="middle" initial={ini({ opacity: 1 })} animate={{ opacity: 0 }} transition={at(1.0, 0.3, IO)}>consumer</M.text>
        <M.text x="284" y="113" textAnchor="middle" className="t-inv" initial={ini({ opacity: 0 })} animate={{ opacity: 1 }} transition={at(1.0, 0.3, IO)}>consumer</M.text>
        <M.circle cy="108" r="6" className="f-ink" initial={ini({ cx: 100, opacity: 0 })} animate={{ cx: [100, 126, 214, 240], opacity: [0, 1, 1, 0] }} transition={{ delay: 0.2, duration: 0.9, ease: 'linear', times: [0, 0.3, 0.7, 1] }} />
        <M.circle cy="108" r="6" className="f-ring" initial={ini({ cx: 100, opacity: 0 })} animate={{ cx: [100, 122, 122], opacity: [0, 1, 0] }} transition={{ delay: 1.2, duration: 0.8, ease: IO, times: [0, 0.5, 1] }} />
        <M.text x="170" y="160" textAnchor="middle" initial={ini({ opacity: 0 })} animate={{ opacity: 1 }} transition={at(1.6)}>duplicate collapsed</M.text>
        <M.path d="M284 80 Q227 22 170 80" className="s-ink dash" initial={ini({ pathLength: 0 })} animate={{ pathLength: 1 }} transition={at(2.1, 0.6, IO)} />
        <M.text x="227" y="40" textAnchor="middle" className="t-ink" initial={ini({ opacity: 0 })} animate={{ opacity: 1 }} transition={at(2.5)}>✓ ack</M.text>
      </g>
    );
  }
  if (i === 2) {
    // key-value: the last value per key; one key changes under a watch and its history grows by one
    const rows: [string, string, number][] = [['orders', '412', 2], ['payments', '96', 3], ['signups', '1055', 3]];
    return (
      <g>
        <M.text x="14" y="36" initial={ini({ opacity: 0.35 })} animate={{ opacity: 1 }} transition={at(1.0)} className="t-ink">watch signups</M.text>
        {rows.map(([k, v, h], r) => {
          const y = 54 + r * 46;
          const live = r === 2;
          return (
            <g key={k}>
              {live
                ? <M.rect x="12" y={y} width="316" height="38" rx="10" className="f-cell" initial={ini({ strokeWidth: 1 })} animate={{ strokeWidth: 2 }} transition={at(0.4, 0.3, IO)} />
                : <rect x="12" y={y} width="316" height="38" rx="10" className="f-cell" />}
              <text x="28" y={y + 24}>{k}</text>
              {live ? (
                <>
                  <M.text x="160" y={y + 24} initial={ini({ opacity: 1, y: 0 })} animate={{ opacity: 0, y: -10 }} transition={at(0.7, 0.3, IO)}>{v}</M.text>
                  <M.text x="160" y={y + 24} className="t-ink" initial={ini({ opacity: 0, y: 10 })} animate={{ opacity: 1, y: 0 }} transition={at(0.8)}>1056</M.text>
                </>
              ) : <text x="160" y={y + 24} className="t-ink">{v}</text>}
              {Array.from({ length: h }, (_, d) => <circle key={d} cx={300 - d * 14} cy={y + 19} r="4" className="f-hist" />)}
              {live && <M.circle cx={300 - h * 14} cy={y + 19} r="4" className="f-ink" initial={ini({ scale: 0 })} animate={{ scale: 1 }} transition={at(1.0, 0.3)} />}
            </g>
          );
        })}
      </g>
    );
  }
  if (i === 3) {
    // request-reply: three instances in a queue group; the request goes to exactly one, one answer comes back
    const ys = [40, 96, 152];
    return (
      <g>
        <rect x="12" y="92" width="84" height="48" rx="12" className="f-cell" />
        <text x="54" y="121" textAnchor="middle">request</text>
        {ys.map((y, k) => <path key={k} d={`M96 116 L244 ${y + 20}`} className="s-faint" />)}
        <M.path d="M96 116 L244 172" className="s-ink" initial={ini({ pathLength: 0 })} animate={{ pathLength: 1 }} transition={at(0.3, 0.5, IO)} />
        {ys.map((y, k) => (
          <g key={k}>
            {k === 2
              ? <rect x="244" y={y} width="84" height="40" rx="10" className={'f-sw' + (lit ? ' on' : '')} style={still ? { transition: 'none' } : { transitionDelay: '.8s' }} />
              : <rect x="244" y={y} width="84" height="40" rx="10" className="f-cell" />}
            {k === 2
              ? <>
                <M.text x="286" y={y + 25} textAnchor="middle" initial={ini({ opacity: 1 })} animate={{ opacity: 0 }} transition={at(0.8, 0.3, IO)}>{'svc ' + (k + 1)}</M.text>
                <M.text x="286" y={y + 25} textAnchor="middle" className="t-inv" initial={ini({ opacity: 0 })} animate={{ opacity: 1 }} transition={at(0.8, 0.3, IO)}>{'svc ' + (k + 1)}</M.text>
              </>
              : <text x="286" y={y + 25} textAnchor="middle">{'svc ' + (k + 1)}</text>}
          </g>
        ))}
        <text x="244" y="26">queue group</text>
        <M.path d="M244 184 Q170 200 96 132" className="s-ink dash" initial={ini({ pathLength: 0 })} animate={{ pathLength: 1 }} transition={at(1.3, 0.6, IO)} />
        <M.text x="54" y="176" textAnchor="middle" className="t-ink" initial={ini({ opacity: 0 })} animate={{ opacity: 1 }} transition={at(1.8)}>one answer</M.text>
      </g>
    );
  }
  if (i === 4) {
    // object store: a payload chunked into a stream, then put back together on the way out
    return (
      <g>
        <M.rect x="26" y="54" width="44" height="108" rx="10" className="f-out" initial={ini({ opacity: 1 })} animate={{ opacity: 0.35 }} transition={at(0.9, 0.4, IO)} />
        <text x="48" y="186" textAnchor="middle">payload</text>
        {Array.from({ length: 6 }, (_, k) => <rect key={k} x={104 + k * 24} y="101" width="20" height="14" rx="4" className="f-hist" />)}
        <text x="170" y="142" textAnchor="middle">chunks</text>
        <M.rect x="270" y="54" width="44" height="108" rx="10" className="f-out" initial={ini({ opacity: 0 })} animate={{ opacity: 1 }} transition={at(2.2, 0.4, IO)} />
        <M.text x="292" y="186" textAnchor="middle" className="t-ink" initial={ini({ opacity: 0 })} animate={{ opacity: 1 }} transition={at(2.6)}>put back</M.text>
        {Array.from({ length: 6 }, (_, k) => (
          <M.rect key={'c' + k} x="0" y="0" width="20" height="14" rx="4" className="f-ink"
            initial={ini({ x: 38, y: 62 + k * 16 })}
            animate={{ x: [38, 104 + k * 24, 104 + k * 24, 282], y: [62 + k * 16, 101, 101, 62 + k * 16] }}
            transition={{ delay: 0.2 + k * 0.08, duration: 2.4, ease: IO, times: [0, 0.3, 0.6, 1] }} />
        ))}
      </g>
    );
  }
  // accounts: a wall between two tenants; a subject from one stops at the wall
  return (
    <g>
      <rect x="12" y="48" width="140" height="132" rx="14" className="f-cell" />
      <rect x="188" y="48" width="140" height="132" rx="14" className="f-cell" />
      <text x="28" y="76" className="t-ink">account a</text>
      <text x="204" y="76" className="t-ink">account b</text>
      <text x="28" y="164">nkey</text>
      <text x="204" y="164">JWT</text>
      <rect x="28" y="96" width="92" height="28" rx="8" className="f-hist" />
      <text x="40" y="115">orders.&gt;</text>
      <rect x="204" y="96" width="92" height="28" rx="8" className="f-hist" />
      <text x="216" y="115">orders.&gt;</text>
      <M.line x1="170" x2="170" y1="30" y2="198" className="s-wall" initial={ini({ pathLength: 0 })} animate={{ pathLength: 1 }} transition={at(0.2, 0.5, IO)} />
      <M.circle cy="110" r="6" className="f-ink" initial={ini({ cx: 126, opacity: 0 })} animate={{ cx: [126, 160, 152], opacity: [0, 1, 1] }} transition={{ delay: 0.8, duration: 0.9, ease: IO, times: [0, 0.7, 1] }} />
      <M.text x="170" y="22" textAnchor="middle" className="t-ink" initial={ini({ opacity: 0 })} animate={{ opacity: 1 }} transition={at(1.6)}>walled off</M.text>
    </g>
  );
}

function Drawing({ i, still, n }: { i: number; still: boolean; n: number }) {
  return (
    <svg viewBox="0 0 340 210" className="ps-fig" role="img" aria-label={`Drawing for fact ${n} of 6`}>
      <Fig i={i} still={still} />
    </svg>
  );
}

export default function PsFacts({ facts }: { facts: [string, string][] }) {
  const calm = useCalm();
  const [mid, setMid] = useState(0); // the fact at the middle of the screen
  const [hov, setHov] = useState<number | null>(null); // the fact under the pointer, while it is there
  const [drawn, setDrawn] = useState<number[]>([]); // phones: the facts whose own drawing has come up the screen and drawn
  const items = useRef<(HTMLLIElement | null)[]>([]);
  useEffect(() => {
    const io = new IntersectionObserver((es) => {
      es.forEach((e) => { if (e.isIntersecting) setMid(+(e.target as HTMLElement).dataset.i!); });
    }, { rootMargin: '-45% 0px -50% 0px' });
    const up = new IntersectionObserver((es) => {
      es.forEach((e) => { if (e.isIntersecting) { const i = +(e.target as HTMLElement).dataset.i!; setDrawn((d) => (d.includes(i) ? d : [...d, i])); } });
    }, { rootMargin: '0px 0px -6% 0px' });
    items.current.forEach((el) => { if (el) { io.observe(el); up.observe(el); } });
    return () => { io.disconnect(); up.disconnect(); };
  }, []);
  const on = hov ?? mid;
  const root = useRef<HTMLDivElement>(null);
  useSnap(root);

  return (
    <div className="ps-facts-in" ref={root}>
      <div className="ps-facts-l">
        <h2 id="ps-facts-h" className="lx-headline ps-facts-h">More than pub/sub</h2>
        <div className="ps-figw" aria-hidden="true" data-snap="" data-from="l">
          <p className="ps-fign">{`${pad(on + 1)} / ${pad(facts.length)}`}</p>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={on} className="ps-figin" initial={calm ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8, transition: { duration: 0.15, ease: [0, 0, 0.2, 1] } }} transition={at(0, 0.3)}>
              <Drawing i={on} still={calm} n={on + 1} />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
      <ol className="ps-flist" onPointerLeave={() => setHov(null)}>
        {facts.map(([h, d], i) => (
          <li key={h} data-i={i} data-snap="" ref={(el) => { items.current[i] = el; }} className={on === i ? 'on' : ''}
            onPointerEnter={(e) => e.pointerType === 'mouse' && setHov(i)}>
            <div className="ps-figm" aria-hidden="true">
              {(calm || drawn.includes(i)) && <Drawing i={i} still={calm} n={i + 1} />}
            </div>
            <p className="lx-kick ps-fk">{`${pad(i + 1)} / ${pad(facts.length)}`}</p>
            <h3 className="ps-ft">{h}</h3>
            <p className="ps-fd">{d}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
