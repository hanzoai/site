'use client';
/* Web3 overview (/blockchain). Its idea is Hanzo's own line, "the chain becomes a parameter": the first screen holds
   one argument, chain, whose value turns through every network Hanzo lists, by itself.
   Signature: the turning argument. chain: Ethereum → Solana → Bitcoin → … each name rolling into place, pausing while
   you hover, still for reduced motion.
   Beyond: the coverage matrix. Every Web3 product against every chain its own page names, in one table you can read
   across (a product) or down (a chain), built only from those pages. */
import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence, useInView, useReducedMotion } from 'motion/react';
import { EASE } from '../../ui';
import { A } from '../../kit';
import { Code } from './BlockPage';
import './blockchain.css';
import './BlockchainIndex.css';

const up = (d) => ({ initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.9, ease: EASE, delay: d } });
const GO = { 'Try Hanzo': '/signup', 'View Pricing': '/pricing?tab=blockchain' };

function Argument({ chains, facts }) {
  const [i, setI] = useState(0);
  const [held, setHeld] = useState(false);
  const box = useRef(null);
  const seen = useInView(box, { amount: 0.4 });
  const calm = useReducedMotion();
  useEffect(() => {
    if (!seen || held || calm || chains.length < 2) return;
    const t = setTimeout(() => setI((v) => (v + 1) % chains.length), 1500);
    return () => clearTimeout(t);
  }, [seen, held, calm, i, chains.length]);
  return (
    <div className="xbc-arg" ref={box} onPointerEnter={() => setHeld(true)} onPointerLeave={() => setHeld(false)}>
      <p className="xbc-arg-l x-mono"><span>chain</span><span aria-hidden="true">:</span></p>
      <div className="xbc-arg-v" aria-live="off">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span key={chains[i]} initial={{ y: '90%', opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: '-90%', opacity: 0 }} transition={{ duration: 0.55, ease: EASE }}>{chains[i]}</motion.span>
        </AnimatePresence>
      </div>
      <div className="xbc-arg-bar" aria-hidden="true"><i style={{ transform: `scaleX(${(i + 1) / chains.length})` }} /></div>
      <dl className="xbc-facts">{facts.map(([a, b, c]) => <div key={a}><dt className="x-mono">{a}</dt><dd><b>{b}</b><span>{c}</span></dd></div>)}</dl>
    </div>
  );
}

function Matrix({ all }) {
  const chains = useMemo(() => {
    const c = {};
    all.forEach((p) => p.chains.forEach((x) => { c[x] = (c[x] || 0) + 1; }));
    return Object.keys(c).sort((a, b) => c[b] - c[a]);
  }, [all]);
  const [hot, setHot] = useState(null);
  return (
    <div className="xbc-mx" role="region" aria-label="Products by chain" tabIndex={0} data-swipe-own>
      <table onPointerLeave={() => setHot(null)}>
        <thead><tr><th scope="col"><span className="xbc-sr">Product</span></th>{chains.map((c, j) => <th key={c} scope="col" className={hot && hot[1] === j ? 'hot' : ''}><span>{c}</span></th>)}</tr></thead>
        <tbody>
          {all.map((p, i) => (
            <tr key={p.slug} className={hot && hot[0] === i ? 'hot' : ''}>
              <th scope="row"><A to={p.href}>{p.name}</A></th>
              {chains.map((c, j) => {
                const on = p.chains.includes(c);
                return <td key={c} onPointerEnter={() => setHot([i, j])} className={on ? 'on' : ''}>{on ? <i aria-label={`${p.name} names ${c}`} /> : <span className="xbc-sr">—</span>}</td>;
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function BlockchainIndex({ doc, all }) {
  const chainsBlock = doc.blocks.find((b) => b.kind === 'chains');
  const chains = chainsBlock ? chainsBlock.chains : [];
  return (
    <main className="xbc xbc-index">
      <section className="xbc-hero" aria-labelledby="xbc-h1">
        <div className="x-wrap xbc-hero-g">
          <div>
            {doc.chip && <motion.p className="xbc-chip" {...up(0)}><i aria-hidden="true" />{doc.chip}</motion.p>}
            <h1 id="xbc-h1" className="xbc-h1 xbc-h1-i" data-morph-target>
              {doc.title.map((t, i) => <span key={i} className="x-line"><motion.span className={'x-line-in' + (i ? ' soft' : '')} initial={{ y: '105%' }} animate={{ y: 0 }} transition={{ duration: 1.1, ease: EASE, delay: 0.06 + i * 0.12 }}>{t}</motion.span></span>)}
            </h1>
            <motion.p className="xbc-lede" {...up(0.32)}>{doc.lede}</motion.p>
            <motion.div className="xbc-acts" {...up(0.42)}>{doc.actions.map((t, i) => <A key={t} to={GO[t] || '/signup'} className={'x-btn' + (i ? '' : ' solid')} {...(i ? {} : { 'data-thumb': '' })}>{t}</A>)}</motion.div>
            {doc.note && <motion.p className="xbc-note" {...up(0.48)}>{doc.note}</motion.p>}
            <motion.ul className="xbc-cats" {...up(0.55)}>{doc.cats.map((c) => <li key={c}>{c}</li>)}</motion.ul>
          </div>
          <motion.div initial={{ opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.1, ease: EASE, delay: 0.15 }}>
            <Argument chains={chains.length ? chains : ['Ethereum']} facts={doc.facts} />
          </motion.div>
        </div>
      </section>

      {doc.blocks.map((b, i) => {
        if (b.kind === 'pieces') return (
          <section key={i} className="x-sec xbc-pieces">
            <div className="x-wrap">
              <header className="xbc-sh"><h2>{b.title}</h2>{b.lede && <p>{b.lede}</p>}</header>
              <ul className="xbc-pgrid">
                {b.cards.map((c, k) => (
                  <motion.li key={c.name} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.6, ease: EASE, delay: (k % 4) * 0.05 }}>
                    <A to={c.href} className="xbc-pcard"><b data-morph>{c.name}</b><span>{c.text}</span><i className="x-arrow">{c.cta}</i></A>
                  </motion.li>
                ))}
              </ul>
              {all.length > 1 && (
                <div className="xbc-mx-wrap">
                  <h3 className="xbc-mx-h x-mono">Products × chains</h3>
                  <Matrix all={all} />
                </div>
              )}
            </div>
          </section>
        );
        if (b.kind === 'groups') return (
          <section key={i} className="x-sec xbc-groups">
            <div className="x-wrap">
              <header className="xbc-sh"><h2>{b.title}</h2>{b.lede && <p>{b.lede}</p>}</header>
              <ul className="xbc-ggrid">{b.groups.map((g, k) => <li key={g.title}><span className="x-mono">{String(k + 1).padStart(2, '0')}</span><h3>{g.title}</h3><p>{g.text}</p></li>)}</ul>
            </div>
          </section>
        );
        if (b.kind === 'agent') return (
          <section key={i} className="x-sec xbc-agent" data-room="dark">
            <div className="x-wrap xbc-agent-g">
              <div>
                {b.chip && <p className="xbc-chip dark"><i aria-hidden="true" />{b.chip}</p>}
                <h2>{b.title.map((t, k) => <span key={k} className={k ? 'soft' : ''}>{t}{k < b.title.length - 1 ? ' ' : ''}</span>)}</h2>
                <p className="xbc-agent-l">{b.lede}</p>
                <ul className="xbc-bul">{b.bullets.map((x) => <li key={x}>{x}</li>)}</ul>
              </div>
              <Code file={b.file} code={b.code} />
            </div>
          </section>
        );
        if (b.kind === 'chains') return (
          <section key={i} className="x-sec xbc-chains">
            <div className="x-wrap">
              <header className="xbc-sh"><h2>{b.title}</h2>{b.lede && <p>{b.lede}</p>}</header>
              <ul className="xbc-chiplist big">{b.chains.map((c) => <li key={c}>{c}</li>)}</ul>
            </div>
          </section>
        );
        return (
          <section key={i} className="x-sec xbc-last">
            <div className="x-wrap">
              <h2>{b.title}</h2>
              {b.lede && <p>{b.lede}</p>}
              <div className="xbc-acts">{b.buttons.map((t, k) => <A key={t} to={GO[t] || '/signup'} className={'x-btn' + (k ? '' : ' solid')}>{t}</A>)}{b.links.map((l) => <A key={l.href} to={l.href} className="x-btn">{l.label}</A>)}</div>
              {b.points.length > 0 && <ul className="xbc-points">{b.points.map((p) => <li key={p}>{p}</li>)}</ul>}
            </div>
          </section>
        );
      })}
    </main>
  );
}
