'use client';
/* One Web3 product (/blockchain/<product>, 16 pages, one template). The first screen is this product's own: its name
   and claim beside a black key card where its supported chains stream past as linked blocks, over a contour field
   seeded from its name and its counts.
   Signature: the block stream. The chains this product names run as a chain of blocks across the key card, by
   themselves; hover to stop the stream and read it.
   Beyond: "Your chain". Pick any chain Hanzo lists across its Web3 products and see at once whether this product
   names it, and which of the other products do (each one a link), from every product page's own Supported Chains. */
import { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { EASE, Copy } from '../../ui';
import { A } from '../../kit';
import Sigil from '../../Sigil';
import './blockchain.css';

const up = (d) => ({ initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.9, ease: EASE, delay: d } });
const pad = (n) => String(n).padStart(2, '0');
const GO = { 'Try Hanzo': '/signup', 'View Documentation': 'https://docs.hanzo.ai', 'View Pricing': '/pricing?tab=blockchain' };

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

function Items({ b }) {
  return (
    <section className={'x-sec xbc-items' + (b.cols ? ' wide' : '') + (b.items.length <= 4 && !b.cols ? ' few' : '')}>
      <div className="x-wrap">
        <header className="xbc-sh">{b.title && <h2>{b.title}</h2>}{b.lede && <p>{b.lede}</p>}</header>
        <ul className="xbc-grid">
          {b.items.map((it, i) => (
            <motion.li key={it.title} initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.65, ease: EASE, delay: (i % 3) * 0.06 }}>
              <span className="xbc-n x-mono">{pad(i + 1)}</span>
              <h3>{it.title}</h3>
              {it.text && <p>{it.text}</p>}
              {it.bullets.length > 0 && <ul className="xbc-bul">{it.bullets.map((x) => <li key={x}>{x}</li>)}</ul>}
              {it.link && <A to={it.link.href} className="x-arrow">{it.link.label}</A>}
            </motion.li>
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
    <div className="xbc-your">
      <p className="xbc-your-k x-mono">Your chain</p>
      <div className="xbc-your-pick" role="group" aria-label="Your chain" data-swipe-own>
        {chains.map((c) => (
          <button key={c} type="button" aria-pressed={c === pick} onClick={() => setPick(c)} className={here.includes(c) ? 'in' : ''}>
            {c === pick && <motion.span layoutId="xbc-your" className="xbc-your-bg" transition={{ type: 'spring', stiffness: 420, damping: 34 }} />}
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

export default function BlockPage({ doc, all }) {
  const h = doc.hero;
  const key = doc.key;
  const chains = doc.chains;
  const nums = [chains.length, h.features.length, ...doc.blocks.filter((b) => b.items).map((b) => b.items.length)];
  return (
    <main className="xbc">
      <section className="xbc-hero" aria-labelledby="xbc-h1">
        <Sigil seed={doc.route} data={nums} className="xbc-sigil" />
        <div className={'x-wrap xbc-hero-g' + (key ? '' : ' solo')}>
          <div>
            {h.chip && <motion.p className="xbc-chip" {...up(0)}><i aria-hidden="true" />{h.chip}</motion.p>}
            <h1 id="xbc-h1" className="xbc-h1" data-morph-target>
              <span className="x-line"><motion.span className="x-line-in" initial={{ y: '105%' }} animate={{ y: 0 }} transition={{ duration: 1.1, ease: EASE, delay: 0.06 }}>{h.title}</motion.span></span>
            </h1>
            {h.claim && <motion.p className="xbc-claim" {...up(0.22)}>{h.claim}</motion.p>}
            {h.lede && <motion.p className="xbc-lede" {...up(0.3)}>{h.lede}</motion.p>}
            {h.actions.length > 0 && (
              <motion.div className="xbc-acts" {...up(0.38)}>{h.actions.map((a, i) => <A key={a.label} to={a.href} className={'x-btn' + (i ? '' : ' solid')} {...(i ? {} : { 'data-thumb': '' })}>{a.label}</A>)}</motion.div>
            )}
            {h.features.length > 0 && (
              <motion.ul className="xbc-feat" {...up(0.45)}>
                {h.features.map((f) => <li key={f.title}><b>{f.title}</b><span>{f.text}</span></li>)}
              </motion.ul>
            )}
            {h.back && <motion.p {...up(0.55)}><A to={h.back.href} className="x-arrow xbc-back">{h.back.text}</A></motion.p>}
          </div>
          {key && (
            <motion.aside className="xbc-key" initial={{ opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.1, ease: EASE, delay: 0.15 }}>
              <Stream chains={chains} label={`Supported chains: ${chains.join(', ')}`} />
              <div className="xbc-key-in">
                <h2>{key.title}</h2>
                {key.sub && <p className="xbc-key-sub">{key.sub}</p>}
                {key.stats.length > 0 && <dl className="xbc-stats">{key.stats.map(([v, l]) => <div key={l}><dd className="x-mono">{v}</dd><dt>{l}</dt></div>)}</dl>}
                <div className="xbc-acts">{key.actions.map((t, i) => <A key={t} to={GO[t] || '/signup'} className={'x-btn' + (i ? '' : ' solid')} {...(i || h.actions.length ? {} : { 'data-thumb': '' })}>{t}</A>)}</div>
                {key.note && <p className="xbc-note">{key.note}</p>}
                {key.trusted && <div className="xbc-trust"><p>{key.trusted.label}</p><ul>{key.trusted.tags.map((t) => <li key={t}>{t}</li>)}</ul></div>}
              </div>
            </motion.aside>
          )}
        </div>
      </section>

      {doc.blocks.map((b, i) => {
        if (b.kind === 'items') return <Items key={i} b={b} />;
        if (b.kind === 'code') return (
          <section key={i} className="x-sec xbc-int">
            <div className="x-wrap xbc-int-g">
              <header className="xbc-sh">{b.title && <h2>{b.title}</h2>}{b.lede && <p>{b.lede}</p>}</header>
              <Code file={b.file} code={b.code} langs={b.langs} />
            </div>
          </section>
        );
        if (b.kind === 'chains') return (
          <section key={i} className="x-sec xbc-chains">
            <div className="x-wrap xbc-chains-g">
              <div>
                <header className="xbc-sh"><h2>{b.title}</h2></header>
                <ul className="xbc-chiplist">{b.chains.map((c) => <li key={c}>{c}</li>)}</ul>
              </div>
              {all.length > 1 && <YourChain here={b.chains} all={all} self={doc.slug} />}
            </div>
          </section>
        );
        if (b.kind === 'band') return (
          <section key={i} className="xbc-band" data-room="dark">
            <div className="x-wrap">
              <h2>{b.title}</h2>
              {b.lede && <p>{b.lede}</p>}
              <div className="xbc-acts">{b.links.map((l, k) => <A key={l.href + k} to={l.href} className={'x-btn' + (k ? '' : ' solid')}>{l.label}</A>)}{b.buttons.map((t) => <A key={t} to={GO[t] || '/signup'} className="x-btn">{t}</A>)}</div>
            </div>
          </section>
        );
        if (b.kind === 'get') return (
          <section key={i} className="xbc-get">
            <div className="x-wrap xbc-get-g">
              <div><h2>{b.title}</h2>{b.text && <p>{b.text}</p>}</div>
              <div className="xbc-get-r">
                {b.chips.map((c) => <span key={c} className="xbc-tag x-mono">{c}</span>)}
                {b.github && <A to={b.github.href} className="xbc-tag x-mono">{b.github.text}</A>}
                {b.deploy && <A to={b.deploy.href} className="x-btn solid">{b.deploy.text}</A>}
              </div>
            </div>
          </section>
        );
        return null;
      })}
    </main>
  );
}
