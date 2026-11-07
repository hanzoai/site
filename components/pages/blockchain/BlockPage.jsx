'use client';
/* One Web3 product (/blockchain/<product>, 16 pages, one template), read as a launch. The first screen is the
   product's name at display size and its claim; under it the hero object, the black key card, starts close and settles
   as you scroll, its supported chains streaming across its top as linked blocks, its figures huge.
   Signature: the exploded deck. The product's capabilities arrive as one stacked deck of sheets in the middle of a
   pinned scene; as you scroll, the sheets are dealt off the top one by one and separate into their places, until the
   deck has become the full grid. A counter keeps how many are out. Phones read the grid as it is.
   Beyond: "Your chain". Pick any chain Hanzo lists across its Web3 products and see at once whether this product
   names it, and which of the other products do (each one a link), from every product page's own Supported Chains.
   A product line without a key card (the exchange) puts its products up as the hero object instead: a console that
   walks through them by itself.
   V2: 8/10 Stage key card (or product console) settling under a display headline, capabilities as a scroll-dealt exploded deck, code as the developer hero, editorial Built For rows, sibling products as cards that open, one accent per member. */
import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent, useReducedMotion } from 'motion/react';
import { Copy } from '../../ui';
import { A } from '../../kit';
import FamLines from '../../v2/FamLines';
import FamStage from '../../v2/FamStage';
import FamNext from '../../v2/FamNext';
import { accentAt } from '../../v2/famAccent';
import '../../v2/fam.css';
import './blockchain.css';
import './BlockPage.css';

const pad = (n) => String(n).padStart(2, '0');
const GO = { 'Try Hanzo': '/signup', 'View Documentation': 'https://docs.hanzo.ai', 'View Pricing': '/pricing?tab=blockchain' };
const out3 = (v) => 1 - Math.pow(1 - v, 3);

export function Stream({ chains, label }) {
  if (!chains.length) return null;
  const row = (k) => chains.map((c, i) => <li key={k + c} aria-hidden={k ? true : undefined}><span className="x-mono">{pad(i + 1)}</span><b>{c}</b></li>);
  return (
    <div className="xbc-stream" aria-label={label}>
      <ul style={{ '--n': chains.length }}>{row('')}{row('b')}</ul>
    </div>
  );
}

export function Code({ file, code, langs }) {
  return (
    <div className="xbc-code">
      <div className="xbc-code-h">
        {file && <span className="x-mono">{file}</span>}
        {langs && langs.length > 0 && <span className="xbc-langs">{langs.map((l) => <i key={l} className="x-mono">{l}</i>)}</span>}
        <Copy text={code.text} />
      </div>
      <pre tabIndex={0}><code>{code.lines.map((l, j) => <span key={j} className="xbc-ln">{l.length ? l.map(([k, t], n) => <span key={n} className={'c-' + k}>{t}</span>) : ' '}{'\n'}</span>)}</code></pre>
    </div>
  );
}

/* ---------- the signature: a deck of sheets, dealt into the grid by scroll ---------- */
function Sheet({ it, i, n, off, p }) {
  const a = 0.04 + (i / n) * 0.5;
  const e = useTransform(p, [a, a + 0.36], [0, 1], { clamp: true });
  const k = (v) => 1 - out3(v);
  const x = useTransform(e, (v) => (off ? k(v) * off.dx : 0));
  const y = useTransform(e, (v) => (off ? k(v) * (off.dy + i * 9) : 0));
  const rotate = useTransform(e, (v) => (off ? k(v) * ((i % 2 ? 1 : -1) * (1.5 + (i % 3) * 1.2)) : 0));
  const scale = useTransform(e, (v) => (off ? 1 - k(v) * Math.min(0.12, i * 0.014) : 1));
  return (
    <motion.li className="xb2-sheet" style={off ? { x, y, rotate, scale, zIndex: n - i } : undefined}>
      <span className="xb2-sheet-n x-mono">{pad(i + 1)}</span>
      <h3>{it.title}</h3>
      {it.text && <p>{it.text}</p>}
      {it.link && <A to={it.link.href} className="x-arrow">{it.link.label}</A>}
    </motion.li>
  );
}

function Explode({ b }) {
  const sec = useRef(null);
  const grid = useRef(null);
  const calm = useReducedMotion();
  const [off, setOff] = useState(null);
  const [dealt, setDealt] = useState(0);
  const n = b.items.length;
  const { scrollYProgress } = useScroll({ target: sec, offset: ['start start', 'end end'] });
  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    let k = 0;
    for (let i = 0; i < n; i++) if (p >= 0.04 + (i / n) * 0.5 + 0.2) k = i + 1;
    if (k !== dealt) setDealt(k);
  });
  useEffect(() => {
    const measure = () => {
      const g = grid.current;
      if (!g || calm || !matchMedia('(min-width: 901px)').matches) { setOff(null); return; }
      const cx = g.clientWidth / 2, cy = g.clientHeight / 2;
      setOff([...g.children].map((li) => ({ dx: cx - (li.offsetLeft + li.offsetWidth / 2), dy: cy - (li.offsetTop + li.offsetHeight / 2) })));
    };
    measure();
    addEventListener('resize', measure);
    return () => removeEventListener('resize', measure);
  }, [calm, n]);
  return (
    <section ref={sec} className={'xb2-ex' + (off ? ' pin' : '')} aria-labelledby={'xb2-ex-' + b.title.length}>
      <div className="xb2-ex-pin">
        <div className="v2f-wrap v2f-grid xb2-ex-g">
          <header className="xb2-ex-h">
            <FamLines as="h2" id={'xb2-ex-' + b.title.length} play="view" className="v2f-head" text={b.title} />
            {b.lede && <p className="v2f-lede">{b.lede}</p>}
            <p className="xb2-ex-c" aria-hidden="true"><b className="v2f-num">{pad(off ? dealt : n)}</b><span className="x-mono">/ {pad(n)}</span></p>
          </header>
          <ul ref={grid} className="xb2-deck">
            {b.items.map((it, i) => <Sheet key={it.title} it={it} i={i} n={n} off={off && off[i]} p={scrollYProgress} />)}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* a short list (Built For): editorial rows */
function Rows({ b }) {
  return (
    <section className="v2f-sec xb2-rows">
      <div className="v2f-wrap">
        <header className="xb2-sh">
          {b.title && <FamLines as="h2" play="view" className="v2f-head" text={b.title} />}
          {b.lede && <p className="v2f-lede">{b.lede}</p>}
        </header>
        <ol className="xb2-rl">
          {b.items.map((it, i) => (
            <li key={it.title} className="v2f-grid">
              <span className="xb2-rl-n x-mono">{pad(i + 1)}</span>
              <h3>{it.title}</h3>
              <div className="xb2-rl-t">
                {it.text && <p>{it.text}</p>}
                {it.link && <A to={it.link.href} className="x-arrow">{it.link.label}</A>}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* products with their bullets (the exchange): big tiles */
function Tiles({ b }) {
  return (
    <section className="v2f-sec xb2-tiles">
      <div className="v2f-wrap">
        <header className="xb2-sh">
          {b.title && <FamLines as="h2" play="view" className="v2f-head" text={b.title} />}
          {b.lede && <p className="v2f-lede">{b.lede}</p>}
        </header>
        <ul className="xb2-tl">
          {b.items.map((it, i) => (
            <li key={it.title} className="v2f-card">
              <span className="xb2-sheet-n x-mono">{pad(i + 1)}</span>
              <h3 className="v2f-title">{it.title}</h3>
              {it.text && <p>{it.text}</p>}
              {it.bullets.length > 0 && <ul className="xbc-bul">{it.bullets.map((x) => <li key={x}>{x}</li>)}</ul>}
              {it.link && <A to={it.link.href} className="x-arrow">{it.link.label}</A>}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function YourChain({ here, all, self }) {
  const chains = useMemo(() => [...new Set(all.flatMap((p) => p.chains))], [all]);
  const [pick, setPick] = useState(here[0] || chains[0]);
  const yes = here.includes(pick);
  const others = all.filter((p) => p.slug !== self && p.chains.includes(pick));
  return (
    <div className="xbc-your xb2-your">
      <p className="xbc-your-k x-mono">Your chain</p>
      <div className="xbc-your-pick" role="group" aria-label="Your chain" data-swipe-own data-lenis-prevent>
        {chains.map((c) => (
          <button key={c} type="button" aria-pressed={c === pick} onClick={() => setPick(c)} className={here.includes(c) ? 'in' : ''}>
            <span>{c}</span>
          </button>
        ))}
      </div>
      <div className="xbc-your-a" aria-live="polite">
        <p className={'xbc-verdict' + (yes ? ' yes' : '')}><i aria-hidden="true">{yes ? '✓' : '–'}</i>{yes ? `Named on this page` : `Not named on this page`}</p>
        <p className="xbc-your-l">{others.length ? `${others.length} other product${others.length > 1 ? 's' : ''} name${others.length > 1 ? '' : 's'} ${pick}:` : `No other product page names ${pick}.`}</p>
        <ul>{others.map((p) => <li key={p.slug}><A to={p.href}>{p.name}</A></li>)}</ul>
      </div>
    </div>
  );
}

/* a product line without a key card (the exchange): its products become the hero object, a console that walks
   through them by itself (pausing when touched); every product's words stay in the page, the others hidden */
function Console({ b }) {
  const calm = useReducedMotion();
  const box = useRef(null);
  const [at, setAt] = useState(0);
  const [held, setHeld] = useState(false);
  const n = b.items.length;
  useEffect(() => {
    if (calm || held) return;
    let seen = true;
    const io = new IntersectionObserver(([e]) => { seen = e.isIntersecting; });
    box.current && io.observe(box.current);
    const t = setInterval(() => { if (seen && !document.hidden) setAt((k) => (k + 1) % n); }, 3600);
    return () => { clearInterval(t); io.disconnect(); };
  }, [calm, held, n]);
  const it = b.items[at];
  return (
    <div ref={box} className="xb2-con v2f-obj" onPointerEnter={(e) => e.pointerType === 'mouse' && setHeld(true)} onPointerLeave={() => setHeld(false)}>
      <div className="xb2-con-l">
        {b.title && <h2 className="v2f-title xb2-con-h">{b.title}</h2>}
        {b.lede && <p className="xb2-con-lede">{b.lede}</p>}
        <div className="xb2-con-tabs" role="tablist" aria-label={b.title}>
          {b.items.map((x, i) => (
            <button key={x.title} type="button" role="tab" id={'xb2-tab-' + i} aria-controls={'xb2-pan-' + i} aria-selected={i === at} onClick={() => { setAt(i); setHeld(true); }}>
              <span className="x-mono">{pad(i + 1)}</span><b>{x.title}</b>
              {i === at && !calm && !held && <i className="xb2-con-t" aria-hidden="true" />}
            </button>
          ))}
        </div>
      </div>
      <div className="xb2-con-r">
        {b.items.map((x, i) => (
          <div key={x.title} role="tabpanel" id={'xb2-pan-' + i} aria-labelledby={'xb2-tab-' + i} hidden={i !== at} className="xb2-con-p">
            <p className="xb2-con-n v2f-num" aria-hidden="true">{pad(i + 1)}</p>
            <h3 className="v2f-head">{x.title}</h3>
            {x.text && <p className="v2f-lede">{x.text}</p>}
            {x.bullets.length > 0 && <ul className="xbc-bul xb2-con-b">{x.bullets.map((y) => <li key={y}>{y}</li>)}</ul>}
            {x.link && <A to={x.link.href} className="x-arrow">{x.link.label}</A>}
          </div>
        ))}
        <span className="x-sr" aria-live="polite">{it.title}</span>
      </div>
    </div>
  );
}

export default function BlockPage({ doc, all }) {
  const h = doc.hero;
  const key = doc.key;
  const chains = doc.chains;
  // the hero's four features repeat the first capabilities word for word on most pages: show them once
  const capText = new Set(doc.blocks.filter((b) => b.items).flatMap((b) => b.items.map((it) => it.title + '|' + it.text)));
  const feats = h.features.filter((f) => !capText.has(f.title + '|' + f.text));
  // no key card: the first list of products with their bullets becomes the hero object
  const conAt = key ? -1 : doc.blocks.findIndex((b) => b.kind === 'items' && b.items.some((it) => it.bullets.length));
  const deckAt = doc.blocks.findIndex((b) => b.kind === 'items' && b.items.length >= 6 && !b.items.some((it) => it.bullets.length));
  // the products after this one, in the family's order, as cards that open into their page
  const at = all.findIndex((p) => p.slug === doc.slug);
  const next = (at < 0 ? all : [...all.slice(at + 1), ...all.slice(0, at)]).slice(0, 6).map((p) => ({ href: p.href, title: p.name, meta: p.chains.slice(0, 3).join(' · '), seed: p.href, data: [p.chains.length], acc: accentAt(p.i) }));
  return (
    <main className="xbc xb2 v2f" style={{ '--acc': accentAt(doc.i) }}>
      <section className="xb2-hero" aria-labelledby="xbc-h1">
        <div className="v2f-wrap v2f-grid xb2-hero-g">
          <div className="xb2-hero-t">
            {h.back && <A to={h.back.href} className="x-arrow xb2-back"><span>{h.back.text}</span></A>}
            {h.chip && <p className="v2f-kick acc xb2-chip"><i aria-hidden="true" />{h.chip}</p>}
            <FamLines as="h1" id="xbc-h1" text={h.title} className="v2f-display xb2-h1" data-morph-target />
          </div>
          <div className="xb2-hero-r">
            {h.claim && <p className="xb2-claim">{h.claim}</p>}
            {h.lede && <p className="v2f-lede xb2-lede">{h.lede}</p>}
            {h.actions.length > 0 && (
              <div className="xb2-acts">{h.actions.map((a, i) => <A key={a.label} to={a.href} className={'v2f-btn' + (i ? '' : ' acc')} {...(i ? {} : { 'data-thumb': '' })}>{a.label}</A>)}</div>
            )}
          </div>
        </div>
        {key && (
          <div className="v2f-wrap">
            <FamStage className="xb2-stage" from={1.08}>
              <aside className="xb2-key">
                <Stream chains={chains} label={`Supported chains: ${chains.join(', ')}`} />
                <div className="xb2-key-g">
                  <div className="xb2-key-l">
                    <h2>{key.title}</h2>
                    {key.sub && <p className="xb2-key-sub">{key.sub}</p>}
                    <div className="xb2-acts">{key.actions.map((t, i) => <A key={t} to={GO[t] || '/signup'} className={'v2f-btn' + (i ? ' ghost' : ' light')} {...(i || h.actions.length ? {} : { 'data-thumb': '' })}>{t}</A>)}</div>
                    {key.note && <p className="xb2-note">{key.note}</p>}
                  </div>
                  {key.stats.length > 0 && <dl className="xb2-stats">{key.stats.map(([v, l]) => <div key={l}><dd className="v2f-num">{v}</dd><dt>{l}</dt></div>)}</dl>}
                </div>
                {key.trusted && <div className="xb2-trust"><p>{key.trusted.label}</p><ul>{key.trusted.tags.map((t) => <li key={t}>{t}</li>)}</ul></div>}
              </aside>
            </FamStage>
          </div>
        )}
        {conAt >= 0 && (
          <div className="v2f-wrap">
            <FamStage className="xb2-stage" from={1.08}><Console b={doc.blocks[conAt]} /></FamStage>
          </div>
        )}
        {feats.length > 0 && (
          <div className="v2f-wrap">
            <ul className="xb2-feat">{feats.map((f) => <li key={f.title}><b>{f.title}</b><span>{f.text}</span></li>)}</ul>
          </div>
        )}
      </section>

      {doc.blocks.map((b, i) => {
        if (i === conAt) return null;
        if (b.kind === 'items') {
          if (i === deckAt) return <Explode key={i} b={b} />;
          if (b.items.some((it) => it.bullets.length)) return <Tiles key={i} b={b} />;
          return <Rows key={i} b={b} />;
        }
        if (b.kind === 'code') return (
          <section key={i} className="v2f-sec xb2-int">
            <div className="v2f-wrap v2f-grid">
              <header className="xb2-int-h">
                {b.title && <FamLines as="h2" play="view" className="v2f-head" text={b.title} />}
                {b.lede && <p className="v2f-lede">{b.lede}</p>}
                {b.items.length > 0 && <ul className="xb2-int-i">{b.items.map((it) => <li key={it.title}><b>{it.title}</b>{it.text && <span>{it.text}</span>}</li>)}</ul>}
              </header>
              <div className="xb2-code"><Code file={b.file} code={b.code} langs={b.langs} /></div>
            </div>
          </section>
        );
        if (b.kind === 'chains') return (
          <section key={i} className="v2f-sec xb2-chains">
            <div className="v2f-wrap v2f-grid">
              <div className="xb2-chains-l">
                <FamLines as="h2" play="view" className="v2f-head" text={b.title} />
                <ul className="xb2-chiplist">{b.chains.map((c) => <li key={c}>{c}</li>)}</ul>
              </div>
              {all.length > 1 && <div className="xb2-chains-r"><YourChain here={b.chains} all={all} self={doc.slug} /></div>}
            </div>
          </section>
        );
        if (b.kind === 'band') return (
          <div key={i}>
            {next.length > 0 && (
              <section className="v2f-sec tight xb2-next" aria-label={h.back ? h.back.text : 'Web3'}>
                <div className="v2f-wrap"><FamNext items={next} label={h.back ? h.back.text : 'Web3'} /></div>
              </section>
            )}
            <section className="xb2-band" data-room="dark">
              <div className="v2f-wrap v2f-grid xb2-band-g">
                {b.title ? <h2 className="v2f-display small xb2-band-h">{b.title}</h2> : <span className="xb2-band-h" />}
                <div className="xb2-band-r">
                  {b.lede && <p className="v2f-lede">{b.lede}</p>}
                  <div className="xb2-acts">{b.links.map((l, k) => <A key={l.href + k} to={l.href} className={'v2f-btn' + (k ? ' ghost' : ' light')}>{l.label}</A>)}{b.buttons.map((t) => <A key={t} to={GO[t] || '/signup'} className="v2f-btn ghost">{t}</A>)}</div>
                </div>
              </div>
            </section>
          </div>
        );
        if (b.kind === 'get') return (
          <section key={i} className="xb2-get">
            <div className="v2f-wrap xb2-get-g">
              <div><h2 className="v2f-title">{b.title}</h2>{b.text && <p>{b.text}</p>}</div>
              <div className="xb2-get-r">
                {b.chips.map((c) => <span key={c} className="xbc-tag x-mono">{c}</span>)}
                {b.github && <A to={b.github.href} className="xbc-tag x-mono">{b.github.text}</A>}
                {b.deploy && <A to={b.deploy.href} className="v2f-btn acc">{b.deploy.text}</A>}
              </div>
            </div>
          </section>
        );
        return null;
      })}
      {!doc.blocks.some((b) => b.kind === 'band') && next.length > 0 && (
        <section className="v2f-sec tight xb2-next" aria-label={h.back ? h.back.text : 'Web3'}>
          <div className="v2f-wrap"><FamNext items={next} label={h.back ? h.back.text : 'Web3'} /></div>
        </section>
      )}
    </main>
  );
}
