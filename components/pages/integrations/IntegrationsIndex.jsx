'use client';
/* Integrations. Its idea is the hub: every tool Hanzo has a guide for orbits Hanzo's one base URL, turning slowly by
   itself; press any of them and it opens its guide. Below, the same tools in their families, a three-language
   starter that swaps by itself, and the agent prompt to paste.
   Signature: the orbit. Nineteen badges circle https://api.hanzo.ai/v1 (counter-rotated so they stay upright),
   hovering one pauses the ring and names it, a press opens its guide.
   Beyond: "Find your tool": type a tool, a language or a family and the shelves narrow as you type. */
import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useReducedMotion } from 'motion/react';
import { EASE, Copy } from '../../ui';
import { A } from '../../kit';
import { Loose } from '../models/parts';
import './integrations.css';

const up = (d) => ({ initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.9, ease: EASE, delay: d } });

function Orbit({ cards, base }) {
  const [hot, setHot] = useState(null);
  const n = cards.length;
  return (
    <div className={'xin-orbit' + (hot ? ' held' : '')} style={{ '--n': n }}>
      <div className="xin-orbit-c"><span className="x-mono">{base.replace(/^https:\/\//, '')}</span><b>{hot ? hot.name : `${n} guides`}</b></div>
      <ul className="xin-ring" aria-label="Every integration">
        {cards.map((c, i) => (
          <li key={c.href} style={{ '--a': (i / n) * 360 + 'deg' }}>
            <A to={c.href} className="xin-sat" aria-label={c.name} data-cursor={c.name} onPointerEnter={() => setHot(c)} onPointerLeave={() => setHot(null)} onFocus={() => setHot(c)} onBlur={() => setHot(null)}>
              <span aria-hidden="true">{c.emoji}</span>
            </A>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Starter({ samples, base }) {
  const [on, setOn] = useState(0);
  const touched = useRef(false);
  const box = useRef(null);
  const seen = useInView(box, { amount: 0.4 });
  const calm = useReducedMotion();
  useEffect(() => {
    if (!seen || calm || touched.current) return;
    const t = setInterval(() => { if (!touched.current) setOn((v) => (v + 1) % samples.length); }, 4800);
    return () => clearInterval(t);
  }, [seen, calm, samples.length]);
  const pick = (i) => { touched.current = true; setOn(i); };
  return (
    <div className="xin-win" ref={box}>
      <div className="xin-win-h"><i aria-hidden="true" /><i aria-hidden="true" /><i aria-hidden="true" /><span className="x-mono">{base}</span></div>
      <div className="xin-win-tabs" role="tablist" aria-label="Language" onKeyDown={(e) => { const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0; if (d) { e.preventDefault(); const j = (on + d + samples.length) % samples.length; pick(j); box.current.querySelectorAll('[role=tab]')[j].focus(); } }}>
        {samples.map((s, i) => (
          <button key={s.lang} type="button" role="tab" id={'xin-s-' + i} aria-selected={on === i} aria-controls={'xin-sp-' + i} tabIndex={on === i ? 0 : -1} onClick={() => pick(i)}>
            {on === i && <motion.span layoutId="xin-win-tab" className="xin-win-bg" transition={{ type: 'spring', stiffness: 420, damping: 34 }} />}
            <span>{s.lang}</span>
          </button>
        ))}
        <Copy text={samples[on].text} />
      </div>
      {samples.map((s, i) => (
        <div key={s.lang} role="tabpanel" id={'xin-sp-' + i} aria-labelledby={'xin-s-' + i} hidden={on !== i}>
          <pre tabIndex={0}><code>{s.lines.map((l, j) => (
            <motion.span key={j + ':' + on} className={'xin-ln' + (/hanzo/i.test(l.map((x) => x[1]).join('')) ? ' hz' : '')} initial={on === i ? { opacity: 0, x: -6 } : false} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.35, ease: EASE, delay: j * 0.04 }}>
              {l.length ? l.map(([k, x], n) => <span key={n} className={'c-' + k}>{x}</span>) : ' '}{'\n'}
            </motion.span>
          ))}</code></pre>
        </div>
      ))}
    </div>
  );
}

export default function IntegrationsIndex({ doc }) {
  const [q, setQ] = useState('');
  const cards = doc.groups.flatMap((g) => g.cards);
  const t = q.trim().toLowerCase();
  const fit = (c) => !t || (c.name + ' ' + c.desc + ' ' + c.tag).toLowerCase().includes(t);
  const any = cards.some(fit);
  return (
    <main className="xin xin-index">
      <section className="xin-hero xin-hero-i" aria-labelledby="xin-h1">
        <div className="x-wrap xin-hero-g">
          <div>
            {doc.label && <motion.p className="xin-badge" {...up(0)}><span className="x-mono">{doc.label}</span></motion.p>}
            <h1 id="xin-h1" className="xin-h1" data-morph-target>
              <span className="x-line"><motion.span className="x-line-in" initial={{ y: '105%' }} animate={{ y: 0 }} transition={{ duration: 1.1, ease: EASE, delay: 0.06 }}>{doc.title}</motion.span></span>
            </h1>
            <motion.p className="xin-lede" {...up(0.28)}><Loose nodes={doc.lede} /></motion.p>
            <motion.div className="xin-acts" {...up(0.4)}>
              {doc.actions.map((a, i) => <A key={a.label} to={a.href} className={'x-btn' + (i ? '' : ' solid')} {...(i ? {} : { 'data-thumb': '' })}>{a.label}</A>)}
            </motion.div>
          </div>
          <motion.div initial={{ opacity: 0, scale: 0.94, rotate: -8 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} transition={{ duration: 1.4, ease: EASE, delay: 0.1 }}>
            <Orbit cards={cards} base={doc.base} />
          </motion.div>
        </div>
      </section>

      <section className="xin-start">
        <div className="x-wrap"><Starter samples={doc.samples} base={doc.base} /></div>
      </section>

      <section className="x-sec xin-shelves" id="all">
        <div className="x-wrap">
          <label className="xin-find">
            <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><circle cx="7" cy="7" r="4.6" fill="none" stroke="currentColor" strokeWidth="1.5" /><path d="M10.5 10.5 14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
            <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Find your tool" aria-label="Find your tool" />
          </label>
          {!any && <p className="xin-none" role="status">Nothing matches “{q}”.</p>}
          {doc.groups.map((g) => {
            const shown = g.cards.filter(fit);
            return (
              <div className="xin-shelf" key={g.title} hidden={!shown.length}>
                <h2>{g.title}<span className="x-mono">{shown.length}</span></h2>
                <ul>
                  {g.cards.map((c, i) => (
                    <motion.li key={c.href} hidden={!fit(c)} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.6, ease: EASE, delay: (i % 4) * 0.05 }}>
                      <A to={c.href} className="xin-card">
                        <span className="xin-card-e" aria-hidden="true">{c.emoji}</span>
                        <b data-morph>{c.name}</b>
                        <span className="xin-card-d">{c.desc}</span>
                        <span className="xin-card-t x-mono">{c.tag}</span>
                      </A>
                    </motion.li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </section>

      {doc.paste && (
        <section className="x-sec xin-paste" data-room="dark">
          <div className="x-wrap xin-paste-g">
            <div>
              <p className="x-kick">{doc.paste.kicker}</p>
              <p className="xin-paste-l">{doc.paste.lede}</p>
            </div>
            <div className="xin-prompt">
              <div className="xin-prompt-h"><span className="x-mono">{doc.paste.label}</span><Copy text={doc.paste.code} label="Copy the agent prompt" /></div>
              <pre tabIndex={0}><code>{doc.paste.code}</code></pre>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
