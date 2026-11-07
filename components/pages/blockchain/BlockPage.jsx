'use client';
/* One Web3 product (/blockchain/<product>, 16 pages, one template), read as a launch.
   Persona: a developer or product team building on chains (Developer). Goal: see what this product does on which
   chains, then get a key. CTA: Hanzo's "Try Hanzo" on the key card (data-thumb, data-cta="blockchain.key"; the site
   ask bar carries it after the hero), "View Documentation" outlined. Metric: api_key_created (signup_start).
   First screen: the product's name at display size, its claim and lede on the left; on the right the hero object,
   the black key card (Hanzo's "Get Your API Key" with its figures), its supported chains streaming across its top and
   this product's own contour (Sigil seeded with its slug) drifting behind it; it settles as you scroll. The product
   line without a key card (the exchange) puts its products up as the hero object instead: a console that walks
   through them by itself and holds when you point at it.
   Signature: the deck, one capability at a time. The product's capabilities sit as one deck in a pinned scene: the
   words stay on the left while the deck on the right shows a single capability; as you scroll the top card lifts
   away and the next comes forward. Marks under the words show where you are and jump to any card. Phones swipe the
   same cards one at a time. No counters: the only numbers on the page are Hanzo's.
   Beyond: "Your chain". Pick any chain Hanzo lists across its Web3 products and see at once whether this product
   names it (a tick or a dash) and which other products do (each a link), from every product page's own lists.
   Each member has its own living object: its own code types itself in when it reaches the screen, its own chains run
   across its key card, its own contour drifts behind it.
   Motion: idle (the chain stream, the contour, the exchange console) · time (the code typing in) · pointer (magnetic
   ask, the stream holds under a pointer, sibling rail drags with inertia, cards lift) · state (the deck's cards, the
   chain picker, console tabs) · scroll (the stage settle, which card the deck shows).
   V2: 8/10 key card (or product console) whole beside the headline with its ask and the member's contour, the capabilities as one pinned deck showing one card at a time (no grid, no counters), the member's own code typing in, ink only, no eyebrows, siblings that drag and open. */
import { useEffect, useMemo, useRef, useState } from 'react';
import { useScroll, useMotionValueEvent, useReducedMotion } from 'motion/react';
import { Copy, Magnetic } from '../../ui';
import Sigil from '../../Sigil';
import { A } from '../../kit';
import FamLines from '../../v2/FamLines';
import FamStage from '../../v2/FamStage';
import FamNext from '../../v2/FamNext';
import { ui } from '../../v2/famUi';
import '../../v2/fam.css';
import './blockchain.css';
import './BlockPage.css';

const GO = { 'Try Hanzo': '/signup', 'View Documentation': 'https://docs.hanzo.ai', 'View Pricing': '/pricing?tab=blockchain' };

export function Stream({ chains, label }) {
  if (!chains.length) return null;
  const row = (k) => chains.map((c) => <li key={k + c} aria-hidden={k ? true : undefined}><i className="xb2-blk" aria-hidden="true" /><b>{c}</b></li>);
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

/* this product's own code, typed in once when it reaches the screen: every line is in the HTML from the start (and
   copies whole); the lines light up one after another by class, through refs, never a re-render per line. Reduced
   motion and no-JS show it whole. */
function Typed({ file, code, langs }) {
  const box = useRef(null);
  useEffect(() => {
    const el = box.current;
    if (!el || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const lines = [...el.querySelectorAll('.xbc-ln')];
    const r = el.getBoundingClientRect();
    if (r.top < innerHeight && r.bottom > 0) return; // already on screen: leave it whole
    el.classList.add('xb2-type');
    let t = 0;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      let k = 0;
      const step = () => {
        if (k >= lines.length) { el.classList.add('done'); return; }
        lines[k].classList.add('on');
        k++;
        t = setTimeout(step, lines[k - 1].textContent.trim() ? 70 : 20);
      };
      step();
    }, { threshold: 0.3 });
    io.observe(el);
    return () => { clearTimeout(t); io.disconnect(); };
  }, []);
  return <div ref={box}><Code file={file} code={code} langs={langs} /></div>;
}

/* ---------- the signature: the deck, one capability at a time ---------- */
/* The capabilities as one pinned deck (desktop): the words stay on the left while the deck on the right shows one
   capability at a time; as you scroll the top card lifts away and the next one comes forward (state changes with
   springs, not a scrub). Marks under the words show where you are and jump to any card. Phones swipe the same cards
   one at a time. Hanzo's numbers only: no counters. */
function Deck({ b }) {
  const sec = useRef(null);
  const rail = useRef(null);
  const n = b.items.length;
  const [at, setAt] = useState(0);
  const { scrollYProgress } = useScroll({ target: sec, offset: ['start start', 'end end'] });
  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    if (!matchMedia('(min-width: 901px)').matches) return;
    const k = Math.max(0, Math.min(n - 1, Math.floor(p * n * 0.999)));
    if (k !== at) setAt(k);
  });
  // phones: the rail itself says which card is in view
  useEffect(() => {
    const el = rail.current;
    if (!el) return;
    const on = () => { if (matchMedia('(max-width: 900px)').matches) setAt(Math.round(el.scrollLeft / Math.max(1, el.firstElementChild ? el.firstElementChild.offsetWidth + 12 : 1))); };
    el.addEventListener('scroll', on, { passive: true });
    return () => el.removeEventListener('scroll', on);
  }, []);
  const jump = (k) => {
    if (matchMedia('(max-width: 900px)').matches) { const el = rail.current; const c = el && el.children[k]; c && el.scrollTo({ left: c.offsetLeft - el.offsetLeft, behavior: 'smooth' }); return; }
    const el = sec.current;
    const top = el.getBoundingClientRect().top + scrollY + ((el.offsetHeight - innerHeight) * (k + 0.5)) / n;
    window.__lenis ? window.__lenis.scrollTo(top, { duration: 1 }) : scrollTo({ top, behavior: 'smooth' });
  };
  const titleId = 'xb2-deck-' + b.title.length;
  return (
    <section ref={sec} className="xb2-deckx" style={{ '--n': n }} aria-labelledby={titleId}>
      <noscript><style>{'.xb2-deckx{height:auto}.xb2-deckx-pin{position:static;height:auto}.xb2-cards{display:grid;gap:12px;height:auto}.xb2-card{position:static!important;opacity:1!important;transform:none!important;visibility:visible!important}.xb2-card>*{opacity:1!important}.xb2-marks2{display:none}'}</style></noscript>
      <div className="xb2-deckx-pin">
        <div className="v2f-wrap v2f-grid xb2-deckx-g">
          <header className="xb2-deckx-h">
            <FamLines as="h2" id={titleId} play="view" className="v2f-head" text={b.title} />
            {b.lede && <p className="v2f-lede">{b.lede}</p>}
            <div className="xb2-marks2" role="group" aria-label={b.title}>
              {b.items.map((it, k) => (
                <button key={it.title} type="button" aria-label={it.title + ', ' + ui('chapter') + ' ' + (k + 1) + ' ' + ui('of') + ' ' + n} aria-current={k === at ? 'step' : undefined} className={k < at ? 'past' : ''} onClick={() => jump(k)}><i><b /></i></button>
              ))}
            </div>
          </header>
          <ul ref={rail} className="xb2-cards" data-swipe-own>
            {b.items.map((it, k) => (
              <li key={it.title} className="xb2-card" data-s={k < at ? 'gone' : k === at ? 'on' : k - at < 4 ? 'next' : 'far'} style={{ '--d': Math.max(0, k - at) }}>
                <h3>{it.title}</h3>
                {it.text && <p>{it.text}</p>}
                {it.link && <A to={it.link.href} className="x-arrow">{it.link.label}</A>}
              </li>
            ))}
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

function YourChain({ here, all, self, title }) {
  const chains = useMemo(() => [...new Set(all.flatMap((p) => p.chains))], [all]);
  const [pick, setPick] = useState(here[0] || chains[0]);
  const yes = here.includes(pick);
  const others = all.filter((p) => p.slug !== self && p.chains.includes(pick));
  return (
    <div className="xbc-your xb2-your">
      <div className="xbc-your-pick" role="group" aria-label={title} data-swipe-own data-lenis-prevent>
        {chains.map((c) => (
          <button key={c} type="button" aria-pressed={c === pick} onClick={() => setPick(c)} className={here.includes(c) ? 'in' : ''}>
            <span>{c}</span>
          </button>
        ))}
      </div>
      <div className="xbc-your-a" aria-live="polite">
        <p className={'xbc-verdict xb2-verdict' + (yes ? ' yes' : '')}>
          <i role="img" aria-label={ui(yes ? 'named_here' : 'not_named_here')}>{yes ? '✓' : '–'}</i>
          <b>{pick}</b>
        </p>
        <p className="xb2-others" aria-label={ui('others_name') + ' ' + pick}><b className="v2f-num">{others.length}</b></p>
        <ul>{others.map((p) => <li key={p.slug}><A to={p.href}>{p.name}</A></li>)}</ul>
      </div>
    </div>
  );
}

/* a product line without a key card (the exchange): its products become the hero object, a console that walks
   through them by itself (pausing when touched); every product's words stay in the page, the others hidden */
function Console({ b, seed }) {
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
        {seed && <Sigil seed={seed} data={[n]} className="xb2-con-sig" />}
        {b.title && <h2 className="v2f-title xb2-con-h">{b.title}</h2>}
        {b.lede && <p className="xb2-con-lede">{b.lede}</p>}
        <div className="xb2-con-tabs" role="tablist" aria-label={b.title}>
          {b.items.map((x, i) => (
            <button key={x.title} type="button" role="tab" id={'xb2-tab-' + i} aria-controls={'xb2-pan-' + i} aria-selected={i === at} onClick={() => { setAt(i); setHeld(true); }}>
              <b>{x.title}</b>
              {i === at && !calm && !held && <i className="xb2-con-t" aria-hidden="true" />}
            </button>
          ))}
        </div>
      </div>
      <div className="xb2-con-r">
        {b.items.map((x, i) => (
          <div key={x.title} role="tabpanel" id={'xb2-pan-' + i} aria-labelledby={'xb2-tab-' + i} hidden={i !== at} className="xb2-con-p">
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
  const next = (at < 0 ? all : [...all.slice(at + 1), ...all.slice(0, at)]).slice(0, 6).map((p) => ({ href: p.href, title: p.name, meta: p.chains.slice(0, 3).join(' · '), seed: p.href, data: [p.chains.length] }));
  return (
    <main className="xbc xb2 v2f">
      <section className={'xb2-hero' + (key || conAt >= 0 ? ' side' : '')} aria-labelledby="xbc-h1">
        <div className="v2f-wrap v2f-grid xb2-hero-g">
          <div className="xb2-hero-t">
            <FamLines as="h1" id="xbc-h1" text={h.title} className={'v2f-display xb2-h1' + (h.title.length > 11 ? ' mid' : '')} data-morph-target />
            {h.claim && <p className="xb2-claim">{h.claim}</p>}
            {h.lede && <p className="v2f-lede xb2-lede">{h.lede}</p>}
            {h.actions.length > 0 && (
              <div className="xb2-acts">{h.actions.map((a, i) => (i ? <A key={a.label} to={a.href} className="v2f-btn" data-cta="blockchain.hero-second">{a.label}</A>
                : <Magnetic key={a.label} strength={0.25}><A to={a.href} className="v2f-btn solid" data-thumb={a.label} data-cta="blockchain.hero">{a.label}</A></Magnetic>))}</div>
            )}
            {(h.chip || h.back) && (
              <p className="xb2-meta">
                {h.chip && <span className="v2f-kick">{h.chip}</span>}
                {h.back && <A to={h.back.href} className="x-arrow xb2-back"><span>{h.back.text}</span></A>}
              </p>
            )}
          </div>
          {conAt >= 0 && (
            <div className="xb2-hero-o">
              <FamStage className="xb2-stage" from={1.05} span={480}><Console b={doc.blocks[conAt]} seed={doc.route} /></FamStage>
            </div>
          )}
          {key && (
            <div className="xb2-hero-o">
              <FamStage className="xb2-stage" from={1.05} span={480}>
                <aside className="xb2-key">
                  <Sigil seed={doc.route} data={[chains.length, ...key.stats.map(([v]) => parseFloat(String(v).replace(/[^\d.]/g, ''))).filter((x) => x > 0)]} className="xb2-key-sig" />
                  <Stream chains={chains} label={`${key.title}: ${chains.join(', ')}`} />
                  <div className="xb2-key-g">
                    <div className="xb2-key-l">
                      <h2>{key.title}</h2>
                      {key.sub && <p className="xb2-key-sub">{key.sub}</p>}
                      <div className="xb2-acts">{key.actions.map((t, i) => (i ? <A key={t} to={GO[t] || '/signup'} className="x-arrow xb2-key-link" data-cta="blockchain.key-second"><span>{t}</span><svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg></A>
                        : <Magnetic key={t} strength={0.25}><A to={GO[t] || '/signup'} className="v2f-btn light" data-cta="blockchain.key" {...(h.actions.length ? {} : { 'data-thumb': t })}>{t}</A></Magnetic>))}</div>
                      {key.note && <p className="xb2-note">{key.note}</p>}
                    </div>
                    {key.stats.length > 0 && <dl className="xb2-stats">{key.stats.map(([v, l]) => <div key={l}><dd className="v2f-num">{v}</dd><dt>{l}</dt></div>)}</dl>}
                  </div>
                  {key.trusted && <div className="xb2-trust"><p>{key.trusted.label}</p><ul>{key.trusted.tags.map((t) => <li key={t}>{t}</li>)}</ul></div>}
                </aside>
              </FamStage>
            </div>
          )}
        </div>
        {feats.length > 0 && (
          <div className="v2f-wrap">
            <ul className="xb2-feat">{feats.map((f) => <li key={f.title}><b>{f.title}</b><span>{f.text}</span></li>)}</ul>
          </div>
        )}
      </section>

      {doc.blocks.map((b, i) => {
        if (i === conAt) return null;
        if (b.kind === 'items') {
          if (i === deckAt) return <Deck key={i} b={b} />;
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
              <div className="xb2-code"><Typed file={b.file} code={b.code} langs={b.langs} /></div>
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
              {all.length > 1 && <div className="xb2-chains-r"><YourChain here={b.chains} all={all} self={doc.slug} title={b.title} /></div>}
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
            <section className="xb2-band" data-room="dark" data-ask-hide>
              <div className="v2f-wrap v2f-grid xb2-band-g">
                {b.title ? <h2 className="v2f-display small xb2-band-h">{b.title}</h2> : <span className="xb2-band-h" />}
                <div className="xb2-band-r">
                  {b.lede && <p className="v2f-lede">{b.lede}</p>}
                  <div className="xb2-acts">{b.links.map((l, k) => <A key={l.href + k} to={l.href} className={'v2f-btn' + (k ? ' ghost' : ' light')} data-cta={k ? 'blockchain.band-second' : 'blockchain.band'}>{l.label}</A>)}{b.buttons.map((t) => <A key={t} to={GO[t] || '/signup'} className="v2f-btn ghost">{t}</A>)}</div>
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
                {b.deploy && <A to={b.deploy.href} className="v2f-btn" data-cta="blockchain.deploy">{b.deploy.text}</A>}
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
