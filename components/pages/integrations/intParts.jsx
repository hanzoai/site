'use client';
/* Parts of the /integrations family: the connection diagram that draws itself, and the code viewer whose one switch
   shows only the lines that point at Hanzo. */
import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useReducedMotion } from 'motion/react';
import { EASE, Copy } from '../../ui';

/* ---------- the connection: your tool -> the base URL -> the models its code names ----------
   Lines draw in order, then requests travel them for as long as the diagram is on screen. Two shapes: across on wide
   screens, down on phones. */
function geometry(n, tall) {
  const W = tall ? 360 : 640, H = tall ? 520 : 400;
  const app = tall ? [180, 64] : [86, 200];
  const hub = tall ? [180, 250] : [320, 200];
  const ends = Array.from({ length: n }, (_, i) => {
    const t = n === 1 ? 0.5 : i / (n - 1);
    return tall ? [40 + t * 280, 448] : [560, 70 + t * 260];
  });
  const lead = tall ? `M${app[0]},${app[1] + 34} L${hub[0]},${hub[1] - 30}` : `M${app[0] + 64},${app[1]} L${hub[0] - 92},${hub[1]}`;
  const fans = ends.map(([x, y]) => (tall
    ? `M${hub[0]},${hub[1] + 30} C${hub[0]},${hub[1] + 110} ${x},${y - 110} ${x},${y - 22}`
    : `M${hub[0] + 92},${hub[1]} C${hub[0] + 170},${hub[1]} ${x - 110},${y} ${x - 64},${y}`));
  return { W, H, app, hub, ends, lead, fans, routes: fans.map((f) => lead + ' L' + f.slice(1)) };
}
function Shape({ g, tall, emoji, name, base, models, seen, calm }) {
  const svg = useRef(null);
  useEffect(() => {
    const s = svg.current;
    if (!s || !s.pauseAnimations) return;
    if (seen && !calm) { const t = setTimeout(() => s.unpauseAnimations(), 1500); return () => { clearTimeout(t); s.pauseAnimations(); }; }
    s.pauseAnimations();
  }, [seen, calm]);
  const at = (p) => ({ left: (p[0] / g.W) * 100 + '%', top: (p[1] / g.H) * 100 + '%' });
  // calm only changes timing, never the rendered markup (the server cannot know it): reduced motion lands at once
  const draw = (d) => ({ initial: { pathLength: 0 }, animate: seen ? { pathLength: 1 } : {}, transition: calm ? { duration: 0 } : { duration: 0.9, ease: EASE, delay: d } });
  const pop = (d) => ({ initial: { opacity: 0, scale: 0.85 }, animate: seen ? { opacity: 1, scale: 1 } : {}, transition: calm ? { duration: 0 } : { duration: 0.6, ease: EASE, delay: d } });
  return (
    <div className={'xin-shape ' + (tall ? 'tall' : 'wide')} style={{ aspectRatio: g.W + ' / ' + g.H }}>
      <svg ref={svg} viewBox={`0 0 ${g.W} ${g.H}`} aria-hidden="true" onLoad={(e) => e.currentTarget.pauseAnimations?.()}>
        <motion.path d={g.lead} className="xin-wire" {...draw(0.35)} />
        {g.fans.map((d, i) => <motion.path key={i} d={d} className="xin-wire" {...draw(0.95 + i * 0.08)} />)}
        {g.fans.map((d, i) => (
          <circle key={i} r="4" className="xin-packet">
            <animateMotion dur="2.6s" begin={`${i * (2.6 / Math.max(1, g.fans.length))}s`} repeatCount="indefinite" path={g.routes[i]} />
          </circle>
        ))}
      </svg>
      <motion.div className="xin-node xin-app" style={at(g.app)} {...pop(0.1)}><span className="xin-emo" aria-hidden="true">{emoji}</span><b>{name}</b></motion.div>
      <motion.div className="xin-node xin-hub" style={at(g.hub)} {...pop(0.7)}><span className="x-mono">{base.replace(/^https:\/\//, '')}</span></motion.div>
      {models.map((m, i) => <motion.div key={m} className="xin-node xin-end x-mono" style={at(g.ends[i])} {...pop(1.3 + i * 0.08)}>{m}</motion.div>)}
    </div>
  );
}
export function Connection({ emoji, name, base, models }) {
  const ref = useRef(null);
  const seen = useInView(ref, { amount: 0.3 });
  const calm = useReducedMotion();
  const list = models.slice(0, 5);
  return (
    <figure className="xin-conn" ref={ref} aria-label={`${name} sends its requests to ${base}${list.length ? ', naming ' + list.join(', ') : ''}`}>
      <Shape g={geometry(list.length, false)} emoji={emoji} name={name} base={base} models={list} seen={seen} calm={calm} />
      <Shape g={geometry(list.length, true)} tall emoji={emoji} name={name} base={base} models={list} seen={seen} calm={calm} />
    </figure>
  );
}

/* ---------- the code viewer: titles on one side, the sample on the other; one switch dims every line that is not about Hanzo ---------- */
const HANZO = /hanzo/i;
export function Viewer({ samples, Loose }) {
  const [on, setOn] = useState(0);
  const [only, setOnly] = useState(false);
  const box = useRef(null);
  const calm = useReducedMotion();
  const keys = (e) => {
    const d = e.key === 'ArrowDown' || e.key === 'ArrowRight' ? 1 : e.key === 'ArrowUp' || e.key === 'ArrowLeft' ? -1 : 0;
    if (!d) return;
    e.preventDefault();
    const j = (on + d + samples.length) % samples.length;
    setOn(j);
    box.current.querySelectorAll('[role=tab]')[j].focus();
  };
  const cur = samples[on];
  const lines = cur && cur.code ? cur.code.lines : [];
  const hits = lines.filter((l) => HANZO.test(l.map((t) => t[1]).join(''))).length;
  return (
    <div className="xin-view" ref={box}>
      <div className="xin-files" role="tablist" aria-orientation="vertical" aria-label="Guide" onKeyDown={keys}>
        {samples.map((s, i) => (
          <button key={s.title} type="button" role="tab" id={'xin-tab-' + i} aria-selected={on === i} aria-controls={'xin-pane-' + i} tabIndex={on === i ? 0 : -1} onClick={() => setOn(i)}>
            {on === i && <motion.span layoutId="xin-file" className="xin-file-bg" transition={{ type: 'spring', stiffness: 420, damping: 36 }} />}
            <span className="xin-file-n x-mono">{String(i + 1).padStart(2, '0')}</span>
            <span>{s.title}</span>
          </button>
        ))}
      </div>
      <div className="xin-panes">
        {samples.map((s, i) => (
          <section key={s.title} role="tabpanel" id={'xin-pane-' + i} aria-labelledby={'xin-tab-' + i} hidden={on !== i} className="xin-pane">
            <header className="xin-pane-h">
              <h2>{s.title}</h2>
              {s.lang && <span className="x-mono xin-lang">{s.lang}</span>}
              {s.code && <Copy text={s.code.text} />}
            </header>
            {s.code ? (
              <pre tabIndex={0} className={only ? 'only' : ''}><code>
                {s.code.lines.map((l, j) => {
                  const t = l.map((x) => x[1]).join('');
                  return (
                    <motion.span key={j + ':' + on} className={'xin-ln' + (HANZO.test(t) ? ' hz' : '')} initial={on === i ? { opacity: 0, y: 4 } : false} animate={{ opacity: 1, y: 0 }} transition={calm ? { duration: 0 } : { duration: 0.32, ease: EASE, delay: Math.min(j, 16) * 0.025 }}>
                      {l.length ? l.map(([k, x], n) => <span key={n} className={'c-' + k}>{x}</span>) : ' '}{'\n'}
                    </motion.span>
                  );
                })}
              </code></pre>
            ) : <div className="xin-prose"><Loose nodes={s.nodes} /></div>}
          </section>
        ))}
        {cur && cur.code && (
          <div className="xin-only">
            <button type="button" aria-pressed={only} onClick={() => setOnly(!only)} className="xin-switch"><i aria-hidden="true" /><span>Only the Hanzo lines</span></button>
            <span className="x-mono" aria-live="polite">{hits} of {lines.filter((l) => l.length).length} lines point at Hanzo</span>
          </div>
        )}
      </div>
    </div>
  );
}
