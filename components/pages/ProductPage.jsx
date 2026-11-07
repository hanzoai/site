'use client';
/* A product as a live API console (/products/<name>, seven of them, one template). A contour field seeded from the
   product's own counts sits behind its name, so the seven never share a picture.
   Signature: the console. The request types itself, then the API answers: its operations stream in row by row and,
   where Hanzo has measured the product, the numbers count up. Replay runs it again.
   Beyond: peek the seven. Hanzo OS beside the name shows each product's operation count from its own API table, and
   pointing at one reads its line, so you can choose the next product without opening six pages. */
import { useLayoutEffect, useEffect, useRef, useState } from 'react';
import { motion, useInView, useReducedMotion } from 'motion/react';
import { EASE, Rise, Count, Copy } from '../ui';
import { A, More } from '../kit';
import Sigil from '../Sigil';
import { Nodes } from './DocNodes';
import './ProductPage.css';

const CPS = 120; // characters a second

function Measured({ links, run }) {
  // the figures in Hanzo's sentences count up; the words around them stay put
  const re = /(?<![A-Za-z@/\d.,])(\d[\d,]*(?:\.\d+)?)(%|k)?/g;
  return (
    <ul className="xpd-meas">
      {links.map((l) => {
        const [name, ...rest] = l.text.split(': ');
        const text = rest.join(': ');
        const parts = [];
        let last = 0, m;
        while ((m = re.exec(text))) {
          if (m.index > last) parts.push(text.slice(last, m.index));
          const raw = m[1];
          parts.push(<Count key={m.index} to={parseFloat(raw.replace(/,/g, ''))} decimals={(raw.split('.')[1] || '').length} suffix={m[2] || ''} run={run} duration={1.8} />);
          last = m.index + m[0].length;
        }
        parts.push(text.slice(last));
        return (
          <li key={l.href} data-row>
            <A to={l.href}><b>{name}</b>{rest.length > 0 && <span>{': '}{parts}</span>}</A>
          </li>
        );
      })}
    </ul>
  );
}

function Console({ p }) {
  const root = useRef(null);
  const seen = useInView(root, { amount: 0.3, once: true });
  const calm = useReducedMotion();
  const [run, setRun] = useState(0);
  const [nums, setNums] = useState(false);
  const code = p.tryIt.toks.map((t) => t[1]).join('');
  const rows = p.api.table.c.find((k) => k.t === 'tbody').c;
  const head = p.api.table.c.find((k) => k.t === 'thead').c[0].c;

  useLayoutEffect(() => { // from here the browser takes over: hold the answer back until the request is typed
    if (calm || !root.current) return;
    const pre = root.current.querySelector('pre');
    pre.style.minHeight = pre.offsetHeight + 'px';
    root.current.dataset.armed = '1';
    root.current.querySelectorAll('[data-t]').forEach((n) => { n.textContent = ''; });
  }, [calm]);

  useEffect(() => {
    if (calm || !seen) return;
    const el = root.current;
    const toks = [...el.querySelectorAll('[data-t]')];
    const full = p.tryIt.toks.map((t) => t[1]);
    el.dataset.armed = '1';
    el.querySelectorAll('[data-row]').forEach((r) => r.removeAttribute('data-in'));
    toks.forEach((n) => { n.textContent = ''; n.removeAttribute('data-cur'); });
    setNums(false);
    const timers = [];
    let raf = 0;
    const t0 = performance.now() + 500;
    const total = code.length;
    const tick = (now) => {
      let n = Math.min(total, Math.max(0, Math.floor(((now - t0) / 1000) * CPS)));
      let cur = -1;
      for (let i = 0; i < toks.length; i++) {
        const take = Math.max(0, Math.min(full[i].length, n));
        if (toks[i].textContent.length !== take) toks[i].textContent = full[i].slice(0, take);
        n -= take;
        if (take > 0 && take <= full[i].length && cur < i && (n > 0 || take === full[i].length) ) cur = i;
      }
      toks.forEach((t, i) => (i === cur ? t.setAttribute('data-cur', '') : t.removeAttribute('data-cur')));
      if (now - t0 < (total / CPS) * 1000 + 40) { raf = requestAnimationFrame(tick); return; }
      toks.forEach((t, i) => { t.textContent = full[i]; t.removeAttribute('data-cur'); });
      el.dataset.phase = 'answer';
      const rs = [...el.querySelectorAll('[data-row]')];
      rs.forEach((r, i) => timers.push(setTimeout(() => r.setAttribute('data-in', ''), 260 + i * 150)));
      timers.push(setTimeout(() => setNums(true), 260 + rs.length * 150));
    };
    raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); timers.forEach(clearTimeout); };
  }, [seen, run, calm, code, p.tryIt.toks]);

  return (
    <div className="xpd-con" ref={root} data-room-card>
      <span className="xpd-sweep" aria-hidden="true" />
      <div className="xpd-con-bar">
        <span className="xpd-live" aria-hidden="true" />
        <span className="x-mono">api.hanzo.ai</span>
        <button type="button" className="xpd-replay" onClick={() => setRun((r) => r + 1)} aria-label="Replay the request">
          <svg viewBox="0 0 16 16" width="13" height="13" aria-hidden="true"><path d="M13 8a5 5 0 1 1-1.6-3.7M13 2.5v3h-3" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
          <span>Replay</span>
        </button>
      </div>
      <div className="xpd-con-g">
        <div className="xpd-req">
          <div className="xpd-pane-h">
            <h2>{p.tryIt.title}</h2>
            <Copy text={code} />
          </div>
          <pre tabIndex={0}><code>{p.tryIt.toks.map(([k, t], i) => <span key={i} data-t data-k={k}>{t}</span>)}</code></pre>
        </div>
        <div className="xpd-res">
          <div className="xpd-pane-h"><h2>{p.api.title}</h2></div>
          <p className="xpd-api-l">{p.api.lede}</p>
          <div className="xpd-tw" tabIndex={0} role="region" aria-label={p.api.title + ' operations'}>
            <table>
              <thead><tr>{head.map((h, i) => <th key={i}><Nodes nodes={h.c} /></th>)}</tr></thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={i} data-row>
                    {r.c.map((c, j) => <td key={j}><Nodes nodes={c.c} /></td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {p.measured && (
        <div className="xpd-m">
          <h2>{p.measured.title}</h2>
          <Measured key={run} links={p.measured.links} run={nums} />
        </div>
      )}
    </div>
  );
}

const opsOf = (p) => ((p.api && p.api.table.c.find((k) => k.t === 'tbody')) || { c: [] }).c.length;

export default function ProductPage({ p, peek = {} }) {
  const slugOf = (h) => h.replace(/\/$/, '').split('/').pop();
  const [look, setLook] = useState(p.slug);
  const seen = peek[look] ? look : p.slug;
  const nums = [opsOf(p), p.os.length, ...(p.measured ? p.measured.links.flatMap((l) => (l.text.match(/\d[\d,]*(?:\.\d+)?/g) || []).map((x) => +x.replace(/,/g, ''))) : [])];
  const line = (t, d) => (
    <span className="x-line"><motion.span className="x-line-in" initial={{ y: '105%' }} animate={{ y: 0 }} transition={{ duration: 1.1, ease: EASE, delay: d }}>{t}</motion.span></span>
  );
  return (
    <main className="xpd">
      <section className="xpd-hero" aria-labelledby="xpd-h1">
        <Sigil seed={'/products/' + p.slug} data={nums} className="xpd-sigil" />
        <div className="x-wrap xpd-hero-g">
          <div>
            <motion.p className="x-kick" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: EASE }}>{p.kicker}</motion.p>
            <h1 id="xpd-h1" className="xpd-h1">{line(p.title, 0.05)}</h1>
            <motion.p className="xpd-lede" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: EASE, delay: 0.35 }}>{p.lede}</motion.p>
            <motion.div className="xpd-acts" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: EASE, delay: 0.5 }}>
              <A to={p.acts[0].href} className="x-btn solid" data-thumb="">{p.acts[0].text}</A>
              <A to={p.acts[1].href} className="x-btn">{p.acts[1].text}</A>
            </motion.div>
          </div>
          <motion.nav className="xpd-os" aria-label={p.osTitle} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.1, ease: EASE, delay: 0.25 }}>
            <p className="xpd-os-h"><span className="xpd-live" aria-hidden="true" />{p.osTitle}</p>
            <ol>
              {p.os.map((o) => {
                const k = slugOf(o.href), q = peek[k];
                return (
                  <li key={o.href} onMouseEnter={() => setLook(k)} onFocus={() => setLook(k)}>
                    <A to={o.href} aria-current={o.current ? 'page' : undefined}>
                      <b>{o.name}</b>
                      <span>{o.desc}</span>
                      {q && <i className="xpd-ops x-mono">{q.ops}</i>}
                    </A>
                  </li>
                );
              })}
            </ol>
            {peek[seen] && <p className="xpd-peek" aria-hidden="true"><b className="x-mono">{peek[seen].ops} operations</b>{peek[seen].lede}</p>}
          </motion.nav>
        </div>
      </section>

      <section className="xpd-intro">
        <div className="x-wrap"><Rise className="xpd-big"><Nodes nodes={p.intro} /></Rise></div>
      </section>

      <section className="xpd-room" data-room="dark">
        <div className="x-wrap"><Console p={p} /></div>
      </section>

      <section className="xpd-links">
        <div className="x-wrap xpd-links-g">
          {p.docs && (
            <div>
              <h2>{p.docs.title}</h2>
              <ul className="xpd-docs">{p.docs.links.map((l) => <li key={l.href}><More to={l.href}>{l.text}</More></li>)}</ul>
            </div>
          )}
          {p.site && (
            <div>
              <h2>{p.site.title}</h2>
              <ul className="xpd-strip">{p.site.links.map((l, i) => (
                <Rise as="li" key={l.href} y={14} delay={i * 0.04}><A to={l.href}>{l.text}</A></Rise>
              ))}</ul>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
