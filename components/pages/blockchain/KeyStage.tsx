'use client';
/* KeyStage: the /blockchain/<product> hero object, beside the h1 (part of the BlockPage template).
   Hanzo's own "Get Your API Key" card (its figures, its chains streaming, its contour) carries the product acting
   itself out above them, drawn in the server HTML and moving from frame 0 with CSS alone: the product's own first
   capabilities are the stations of one lane and a block travels through them and lands on one of the chains its page
   names; three runs (about 8 s), then it settles on the first chain. Each member plays it in its own way:
   - bundler ('merge'): four operations drop in and merge into one block before it leaves (one bundle, one transaction);
   - oracle ('tick'): the first station keeps ticking out while the block runs (a feed);
   - every other product ('pass'): one block passes through its capabilities in order (DeFi: stake, lend, swap, yield).
   The figures (HA, <50ms, 100+) count up once when the card arrives; the server prints the true value.
   Reduced motion and JS off show the settled frame. */
import { useEffect, useRef } from 'react';
import Sigil from '../../Sigil';

const R = 2.6; // seconds a run
const HITS = [0.06, 0.24, 0.42, 0.6]; // when the block reaches each station within a run (see xb3-hop)

/* a figure that counts up once, from 0 to Hanzo's own value (prefix and suffix kept, e.g. "<50ms", "100+") */
function Count({ v }) {
  const ref = useRef(null);
  const m = /^([^0-9]*)([0-9][0-9,]*)(.*)$/.exec(v || '');
  useEffect(() => {
    const el = ref.current;
    if (!el || !m || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const to = parseInt(m[2].replace(/,/g, ''), 10);
    let raf = 0, t0 = 0;
    const tick = (t: number) => {
      if (!t0) t0 = t;
      const p = Math.min(1, (t - t0 - 500) / 1400);
      const e = p <= 0 ? 0 : 1 - Math.pow(1 - p, 3);
      el.textContent = m[1] + Math.round(to * e) + m[3];
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); el.textContent = v; };
  }, [v]); // eslint-disable-line react-hooks/exhaustive-deps
  return <dd className="v2f-num" ref={ref} style={{ minWidth: String(v).length + 'ch' }}>{v}</dd>;
}

function Flow({ stations, chains, mode }) {
  const st = stations.slice(0, 4);
  // three runs land on three of the product's chains; the last lands on its first chain
  const land = chains.length > 2 ? [chains[1], chains[2], chains[0]] : chains.length === 2 ? [chains[1], chains[0], chains[0]] : [chains[0], chains[0], chains[0]];
  return (
    <div className="xb3-flow" data-mode={mode} style={{ '--R': R + 's' }} aria-hidden="true">
      <div className="xb3-track">
        <i className="xb3-line" />
        {st.map((s, i) => (
          <div key={s} className="xb3-st" style={{ '--x': i / 4, '--h': HITS[i] }}>
            <i className="xb3-node"><b /></i>
            <span>{s}</span>
            {i === 0 && mode === 'merge' && [0, 1, 2, 3].map((k) => <i key={k} className="xb3-op" style={{ '--k': k }} />)}
            {i === 0 && mode === 'tick' && <i className="xb3-ring" />}
          </div>
        ))}
        <div className="xb3-st xb3-end" style={{ '--x': 1, '--h': 0.8 }}>
          <i className="xb3-node"><b /></i>
          {land[0] && <span className="xb3-roll"><span className="xb3-roll-in">{land.map((c, k) => <span key={k}>{c}</span>)}</span></span>}
        </div>
        <div className="xb3-run"><i className="xb3-pk" /></div>
      </div>
    </div>
  );
}

export default function KeyStage({ k, chains, seed, stations, mode, stream }) {
  return (
    <aside className="xb2-key xb3-key">
      <Sigil seed={seed} data={[chains.length, ...k.stats.map(([v]) => parseFloat(String(v).replace(/[^\d.]/g, ''))).filter((x: number) => x > 0)]} className="xb2-key-sig" />
      {stations.length > 1 && chains.length > 0 && <Flow stations={stations} chains={chains} mode={mode} />}
      {stream}
      <div className="xb2-key-g xb3-key-g">
        <div className="xb2-key-l">
          <h2 id="xb2-key-h">{k.title}</h2>
          {k.sub && <p className="xb2-key-sub">{k.sub}</p>}
          {k.note && <p className="xb2-note">{k.note}</p>}
        </div>
        {k.stats.length > 0 && <dl className="xb2-stats">{k.stats.map(([v, l]) => <div key={l}><Count v={v} /><dt>{l}</dt></div>)}</dl>}
      </div>
      {k.trusted && <div className="xb2-trust"><p>{k.trusted.label}</p><ul>{k.trusted.tags.map((t) => <li key={t}>{t}</li>)}</ul></div>}
    </aside>
  );
}
