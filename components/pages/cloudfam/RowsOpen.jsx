'use client';
/* The page's signature (MOTION-MAP `rows-open`): the product's family as a tight list whose rows open in place, on
   hover (a short dwell, so a pass over the list does not flicker) or on a tap, into that product's full detail panel:
   its console bar and endpoint, its status, its name and its own line, its Google Cloud pair, and a way in. This
   product's own row is open first; its panel is its console view: its features, lit in turn once (or its Start with
   command), and the console link. One row is always open, so the list keeps its height. Every word is the family's
   own (read by cloudData.js previewsOf). With JS off every row is open. */
import { useEffect, useRef, useState } from 'react';
import { useInView } from 'motion/react';
import { A } from '../../kit';
import useCalm from '../../v2/useCalm';

const Arrow = ({ s = 14 }) => <svg viewBox="0 0 16 16" width={s} height={s} aria-hidden="true"><path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>;
const shape = (label) => (/^Generally available$/i.test(label) ? 'ga' : /^Beta$/i.test(label) ? 'beta' : 'fam');
const Chip = ({ label }) => <span className={'xcf-chip ' + shape(label)}><i aria-hidden="true" />{label}</span>;

/* this product's own features, lit one after another once while its panel is open and on screen (hover picks one) */
function Feats({ list, open }) {
  const ref = useRef(null);
  const seen = useInView(ref, { amount: 0.5 });
  const calm = useCalm();
  const [at, setAt] = useState(0);
  const [held, setHeld] = useState(false);
  useEffect(() => {
    if (calm || held || !open || !seen || at >= list.length - 1) return undefined;
    const id = setTimeout(() => setAt((i) => i + 1), 1600);
    return () => clearTimeout(id);
  }, [calm, held, open, seen, at, list.length]);
  return (
    <ol ref={ref} className="xro-feats" onPointerLeave={() => setHeld(false)}>
      {list.map((f, i) => (
        <li key={f} className={at === i ? 'on' : ''} onPointerEnter={() => { setHeld(true); setAt(i); }}>
          <span className="xcf-n">{String(i + 1).padStart(2, '0')}</span><span className="xro-ft">{f}</span><i className="xcf-dot" aria-hidden="true" />
        </li>
      ))}
    </ol>
  );
}

function Detail({ s, p, own, open }) {
  const host = p && p.api ? ['api.hanzo.ai', p.api] : ['hanzo.ai', s.href];
  return (
    <div className="xro-win" data-room="dark">
      <div className="xro-bar" aria-hidden="true">
        <span className="xcf-dots"><i /><i /><i /></span>
        <code className="xcf-host"><span>{host[0]}</span><span className="xcf-path">{host[1]}</span><i className="xcf-pulse" /></code>
      </div>
      <div className="xro-body">
        <div className="xro-id">
          {p && p.label && <Chip label={p.label} />}
          <p className="xro-name">{p ? p.name : s.label}</p>
          {p && p.lede && <p className="xro-lede">{p.lede}</p>}
          {p && p.google && <p className="xro-g"><span>Google Cloud</span><b>{p.google}</b></p>}
        </div>
        <div className="xro-act">
          {own && own.features.length > 0 && <Feats list={own.features} open={open} />}
          {own && !own.features.length && own.cmd && <p className="xro-cmd"><b aria-hidden="true">$</b><span>{own.cmd}</span></p>}
          {own
            ? own.console && <A to={own.console.href} className="xcf-open">{own.console.label}<Arrow /></A>
            : <A to={s.href} className="xcf-open">{s.label}<Arrow /></A>}
        </div>
      </div>
    </div>
  );
}

/* closed panels go inert only once hydrated, so with JS off every (open) panel's link still works */
export function useMounted() {
  const [m, setM] = useState(false);
  useEffect(() => setM(true), []);
  return m;
}

export default function RowsOpen({ doc, previews, own }) {
  const sibs = doc.window ? doc.window.siblings : [];
  const first = Math.max(0, sibs.findIndex((s) => s.current));
  const [at, setAt] = useState(first);
  const dwell = useRef(0);
  const mounted = useMounted();
  useEffect(() => () => clearTimeout(dwell.current), []);
  const id = 'xro-' + doc.slug;
  // a row opens on a click, tap or focus, never on a passing pointer: an opening row is a few hundred px tall, and opening
  // under a moving mouse pushed the rows below (and the section after) up and down (CLS 0.16). Hover only lights the row.
  const pointIn = () => {};
  return (
    <ol className="xro" onPointerLeave={() => clearTimeout(dwell.current)}>
      {sibs.map((s, i) => {
        const p = s.current ? own.preview : previews[s.href];
        const open = at === i;
        return (
          <li key={s.href} className={'xro-r' + (open ? ' open' : '') + (s.current ? ' here' : '')}>
            <h3 className="xro-h">
              <button type="button" id={id + '-h' + i} className="xro-head" aria-expanded={open} aria-controls={id + '-p' + i}
                onClick={() => setAt(i)} onFocus={() => setAt(i)} onPointerEnter={(e) => pointIn(e, i)} onPointerLeave={() => clearTimeout(dwell.current)}>
                <span className="xcf-n">{String(i + 1).padStart(2, '0')}</span>
                <span className="xro-l">{s.label}</span>
                {p && p.api && <span className="xro-api">{p.api}</span>}
                <i className="xro-x" aria-hidden="true" />
              </button>
            </h3>
            <div id={id + '-p' + i} role="region" aria-labelledby={id + '-h' + i} className="xro-p" inert={(mounted && !open) || undefined}>
              <div className="xro-pi">
                <Detail s={s} p={p} own={s.current ? own : null} open={open} />
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
