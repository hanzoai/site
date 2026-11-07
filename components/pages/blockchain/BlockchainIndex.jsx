'use client';
/* Blockchain overview (/blockchain), v2 archetype C "Catalogue"; greys and ink only (JAMES.md 7).
   Persona: a developer building on one chain who will need a second
   Metric: signup_start (the catalogue's action: open a card)
   Goal: see that the chain is just an argument, find the piece they need, then start
   CTA: Try Hanzo -> /signup (hero, the site's sticky ask bar at every width, close; data-thumb, data-cta)
   Signature: the chain becomes a parameter. One giant line, chain: plus a value that rolls through every network Hanzo
   lists, by itself, like a reel; under it the product pages that name that chain light up as the value lands. It
   pauses on its own button (WCAG 2.2.2), stops off screen and stands still for reduced motion.
   Beyond: the coverage matrix. Every Web3 product against every chain its own page names, readable across (a product,
   with its count) and down (a chain, with its count); hover or tap a cell to light its row and column.
   Also: the pieces as a catalogue index whose names open into their page (Morph, data-morph: the name you click is
   the next page's hero, synchronized.studio); the nine groups open one at a time; one dark room for the agent.
   Motion: the reel (idle, signature) + headlines cut into their line (arrival) + the card-to-page morph (state) + the
   matrix answering the pointer. Every word and link is Hanzo's; counts are counted from Hanzo's product pages.
V2: 8/10 deck scale (h1 52, headings 26, the chain: reel 64 as the one moment), the reel lighting the product pages that name each chain, a catalogue index that morphs into each page, groups that open, an agent dark room on the kit CodeBlock, the coverage matrix on the kit DataTable read across and down; deck greys, no springs or hover lifts, quiet asks under the header's solid
*/
import { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import { useInView, useReducedMotion } from 'motion/react';
import { A, More, Cta, DataTable, CodeBlock } from '../../kit';
import BizLines from '../../v2/BizLines';
import './BlockchainIndex.css';

const GO = { 'Try Hanzo': '/signup', 'View Pricing': '/pricing?tab=blockchain' };
const two = (n) => String(n).padStart(2, '0');
const bare = (h) => (h || '').replace(/\/$/, '');
// a chain the overview lists, named on a product's page ("Lux D-Chain" is "Lux D-Chain (DEX)" there)
const names = (list, c) => list.some((x) => x === c || x.startsWith(c + ' '));
const PauseI = ({ held }) => (held
  ? <svg viewBox="0 0 12 12" width="12" height="12" aria-hidden="true"><path d="M3 1.5v9l7.5-4.5z" fill="currentColor" /></svg>
  : <svg viewBox="0 0 12 12" width="12" height="12" aria-hidden="true"><path d="M3 1.5h2v9H3zM7 1.5h2v9H7z" fill="currentColor" /></svg>);
const Arrow = () => <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>;

/* The signature: chain: and a reel of every network Hanzo lists; the product pages that name it light up. */
function Reel({ chains, all }) {
  const box = useRef(null);
  const seen = useInView(box, { amount: 0.3 });
  const calm = useReducedMotion();
  const [held, setHeld] = useState(false);
  const [i, setI] = useState(0);
  const [jump, setJump] = useState(false);
  const n = chains.length;
  const fresh = useRef(true); // the first roll after coming into view comes quickly, so the line moves within a second
  useEffect(() => { if (!seen) fresh.current = true; }, [seen]);
  useEffect(() => {
    if (!seen || held || calm || n < 2) return;
    const wait = i >= n ? 60 : fresh.current ? 900 : 2000;
    const t = setTimeout(() => { fresh.current = false; if (i >= n) { setJump(true); setI(0); } else { setJump(false); setI(i + 1); } }, wait);
    return () => clearTimeout(t);
  }, [seen, held, calm, i, n]);
  const at = i % n;
  const lit = all.filter((p) => names(p.chains, chains[at]));
  return (
    <div className="bci-reel" ref={box}>
      <div className="bci-line">
        <span className="bci-key x-mono" aria-hidden="true">chain:</span>
        <span className="bci-win" aria-hidden="true">
          <span className={'bci-roll' + (jump ? ' jump' : '')} style={{ transform: `translateY(${-i * 1.2}em)` }}>
            {[...chains, chains[0]].map((c, k) => <span key={k}>{c}</span>)}
          </span>
        </span>
        <span className="x-sr">chain: {chains[at]}</span>
      </div>
      <div className="bci-reel-bar">
        <span className="bci-reel-n x-mono" aria-hidden="true"><b>{two(at + 1)}</b> / {two(n)}</span>
        <span className="bci-track" aria-hidden="true"><i style={{ transform: `scaleX(${(at + 1) / n})` }} /></span>
        <span className="bci-lit x-mono" aria-hidden="true"><b>{lit.length}</b> / {all.length} product pages name it</span>
        {!calm && <button type="button" className="bci-pause" onClick={() => setHeld(!held)} aria-pressed={held} aria-label={held ? 'Play the chains' : 'Pause the chains'}><PauseI held={held} /></button>}
      </div>
      <ul className="bci-prods" aria-label="Product pages that name this chain">
        {all.map((p) => <li key={p.slug} className={lit.includes(p) ? 'on' : ''}>{p.name}</li>)}
      </ul>
    </div>
  );
}

function Hero({ doc, chains, all }) {
  const [t1, ...tr] = doc.title;
  return (
    <section className="bci-hero" aria-labelledby="bci-h1">
      <div className="bz-wrap">
        <div className="bci-top">
          <h1 id="bci-h1" className="bci-h1 bz-lines now" data-morph-target>
            <span className="bz-line"><span style={{ '--i': 0 }}>{t1}</span></span>
            {tr.map((t, k) => <span key={k} className="bz-line soft"><span style={{ '--i': k + 1 }}>{t}</span></span>)}
          </h1>
          <div className="bci-ask">
            <div className="bci-acts">
              <Cta to={GO[doc.actions[0]] || '/signup'} id="blockchain.hero" kind="quiet" thumb>{doc.actions[0]}</Cta>
              {doc.actions.slice(1).map((t) => <More key={t} to={GO[t] || '/signup'}>{t}</More>)}
            </div>
            <p className="bci-note"><span className="bci-chip x-mono">{doc.chip}</span>{doc.note}</p>
          </div>
        </div>
        <Reel chains={chains} all={all} />
        <div className="bci-more">
          <p className="bz-body">{doc.lede}</p>
          <ul className="bci-cats">{doc.cats.map((c) => <li key={c}>{c}</li>)}</ul>
        </div>
        <dl className="bci-facts">
          {doc.facts.map(([a, b, c]) => <div key={a}><dt className="x-mono">{a}</dt><dd><b>{b}</b><span>{c}</span></dd></div>)}
        </dl>
      </div>
    </section>
  );
}

/* The pieces: a catalogue index; each name morphs into its page's hero when you open it. */
const FIRST = 8;
function Pieces({ b, all }) {
  const count = (h) => all.find((p) => bare(p.href) === bare(h));
  const [more, setMore] = useState(false);
  return (
    <section className="bz-sec bci-pieces" aria-labelledby="bci-pieces-h">
      <div className="bz-wrap bz-grid">
        <header className="bci-ph">
          <BizLines id="bci-pieces-h" className="bz-headline" lines={[b.title]} />
          <p className="bz-body">{b.lede}</p>
          <p className="bci-ph-n x-mono">{b.cards.length} pieces · open one</p>
        </header>
        <ol className="bci-index">
          {b.cards.map((c, k) => {
            const p = count(c.href);
            return (
              <li key={c.name} hidden={k >= FIRST && !more}>
                <A to={c.href} className="bci-card">
                  <span className="bci-card-n x-mono" aria-hidden="true">{two(k + 1)}</span>
                  <b className="bci-card-t" data-morph>{c.name}</b>
                  <span className="bci-card-d">{c.text}</span>
                  <span className="bci-card-c x-mono">{p ? <><b>{p.chains.length}</b> chains on its page</> : ' '}</span>
                  <span className="bci-card-go"><i>{c.cta}</i><Arrow /></span>
                </A>
              </li>
            );
          })}
        </ol>
        {b.cards.length > FIRST && (
          <button type="button" className="bci-all" aria-expanded={more} onClick={() => setMore(!more)}>
            <span>{more ? 'Show the first ' + FIRST : `Show all ${b.cards.length} pieces`}</span><i aria-hidden="true" />
          </button>
        )}
      </div>
    </section>
  );
}

/* What sits behind the key: nine groups, one open at a time. */
function Groups({ b }) {
  const [open, setOpen] = useState(0);
  return (
    <section className="bz-sec bci-groups" aria-labelledby="bci-groups-h">
      <div className="bz-wrap bz-grid">
        <header className="bci-gh">
          <BizLines id="bci-groups-h" className="bz-headline" lines={[b.title]} />
          <p className="bz-body">{b.lede}</p>
        </header>
        <ul className="bci-glist">
          {b.groups.map((g, k) => (
            <li key={g.title} className={open === k ? 'on' : ''}>
              <button type="button" aria-expanded={open === k} aria-controls={'bci-g' + k} onClick={() => setOpen(open === k ? -1 : k)}>
                <span className="x-mono">{two(k + 1)}</span>
                <b>{g.title}</b>
                <i aria-hidden="true" />
              </button>
              <p id={'bci-g' + k} className="bci-gtext" hidden={open !== k}>{g.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* The one dark room: an agent with an address, and the code that gives it one. */
function Agent({ b }) {
  return (
    <section className="bz-sec bci-agent" data-room="dark" aria-labelledby="bci-agent-h">
      <div className="bz-wrap bz-grid">
        <div className="bci-agent-copy">
          <BizLines id="bci-agent-h" className="bz-headline" lines={b.title} />
          <p className="bci-tag x-mono">{b.chip}</p>
          <p className="bz-body">{b.lede}</p>
          <ul className="bci-bul">{b.bullets.map((x) => <li key={x}>{x}</li>)}</ul>
        </div>
        <CodeBlock code={b.code.text} label={b.file} className="bci-code" />
      </div>
    </section>
  );
}

/* Beyond: the coverage matrix, read across (a product) and down (a chain); a cell lights its row and column. */
function Matrix({ b, all }) {
  const cols = useMemo(() => {
    const c = {};
    all.forEach((p) => p.chains.forEach((x) => { c[x] = (c[x] || 0) + 1; }));
    return Object.keys(c).sort((x, y) => c[y] - c[x]).map((x) => [x, c[x]]);
  }, [all]);
  const [hot, setHot] = useState(null);
  const [r, c] = hot || [-1, -1];
  const read = hot ? `${all[r].name} × ${cols[c][0]}: ${all[r].chains.includes(cols[c][0]) ? 'named on its page' : 'not named on its page'} · ${all[r].chains.length} chains across · ${cols[c][1]} ${cols[c][1] === 1 ? 'product' : 'products'} down` : 'Point at a cell, or tap one';
  return (
    <section className="bz-sec bci-mx-sec" aria-labelledby="bci-chains-h">
      <div className="bz-wrap">
        <div className="bci-mx-head">
          <BizLines id="bci-chains-h" className="bz-headline" lines={[b.title]} />
          <p className="bz-body">{b.lede}</p>
        </div>
        <p className="bci-run">{b.chains.map((x, k) => <Fragment key={x}><span>{x}</span>{k < b.chains.length - 1 && <i aria-hidden="true"> · </i>}</Fragment>)}</p>
        <p className="bci-read x-mono" aria-live="polite">{read}</p>
        <div className="bci-mx" data-swipe-own onPointerLeave={() => setHot(null)} style={{ '--cols': cols.length }}>
          {hot && <style>{`.bci-mx .x-table tbody tr:nth-child(${r + 1}) > *, .bci-mx .x-table tr > :nth-child(${c + 2}) { background-color: #f5f5f5; } .bci-mx .x-table tbody tr:nth-child(${r + 1}) > :nth-child(${c + 2}) { background-color: #d4d4d4; } .bci-mx .x-table thead th:nth-child(${c + 2}) .bci-vh { color: #0a0a0a; font-weight: 606; }`}</style>}
          <DataTable
            caption="Products × chains"
            cols={[{ key: 'p', label: 'Product' }, ...cols.map(([x], j) => ({ key: 'c' + j, label: <span className="bci-vh">{x}</span> })), { key: 'n', label: 'chains', num: true }]}
            rows={[
              ...all.map((p, i) => ({
                p: <A to={p.href}>{p.name}</A>,
                ...Object.fromEntries(cols.map(([x], j) => {
                  const on = p.chains.includes(x);
                  return ['c' + j, <span className={'bci-cell' + (on ? ' on' : '')} onPointerEnter={() => setHot([i, j])} onClick={() => setHot([i, j])}>{on ? <i aria-label={`${p.name} names ${x}`} /> : <span className="x-sr">—</span>}</span>];
                })),
                n: p.chains.length,
              })),
              { p: 'products', ...Object.fromEntries(cols.map(([x, k], j) => ['c' + j, k])), n: '' },
            ]}
          />
        </div>
      </div>
    </section>
  );
}

/* The close: one sentence at Display size, the same solid ask, and one full-width row for the other door. */
function End({ b }) {
  const [ask, ...rest] = b.buttons;
  return (
    <section className="bz-sec bci-end" aria-labelledby="bci-end-h">
      <div className="bz-wrap">
        <div className="bci-end-top">
          <div className="bci-end-main">
            <BizLines id="bci-end-h" className="bz-display md" lines={[b.title]} />
            <p className="bz-lede">{b.lede}</p>
          </div>
          <Cta to={GO[ask] || '/signup'} id="blockchain.close" kind="quiet" size="lg" thumb>{ask}</Cta>
        </div>
        <ul className="bci-rows">
          {rest.map((t) => <li key={t}><A to={GO[t] || '/signup'} className="bci-row"><b>{t}</b><Arrow /></A></li>)}
          {b.links.map((l) => <li key={l.href}><A to={l.href} className="bci-row"><b>{l.label}</b><Arrow /></A></li>)}
        </ul>
        <ul className="bci-points">{b.points.map((x) => <li key={x}>{x}</li>)}</ul>
      </div>
    </section>
  );
}

export default function BlockchainIndex({ doc, all }) {
  const find = (k) => doc.blocks.find((b) => b.kind === k);
  const chainsBlock = find('chains');
  const chains = chainsBlock ? chainsBlock.chains : ['Ethereum'];
  const pieces = find('pieces'), groups = find('groups'), agent = find('agent'), last = find('band');
  return (
    <main className="bz bci">
      <span data-ask-name="Hanzo Blockchain" hidden />
      <Hero doc={doc} chains={chains} all={all} />
      {pieces && <Pieces b={pieces} all={all} />}
      {groups && <Groups b={groups} />}
      {agent && <Agent b={agent} />}
      {chainsBlock && <Matrix b={chainsBlock} all={all} />}
      {last && <End b={last} />}
    </main>
  );
}
