'use client';
/* Hanzo Cloud products (/cloud/<slug>, 42 pages, one template), v2. Archetype A, Launch: stage hero, chapters, a spec
   sheet, a compare, one action. Each product carries its own accent (its family's hue, turned a few degrees per
   sibling, so neighbours never match) and its own Sigil, seeded by its slug and its own figures.
   Signature: the session runs in the console. The product's own console is the hero object: it starts tipped back
   like a lid and settles flat as you scroll (the stage), while the agent prompt from "Paste and ship" types itself
   into the session bar and the example plays: the request walks the project's services (each lights in the
   product's colour), or the conversation with the agent arrives turn by turn, or the CLI session prints line by line.
   Click any service and the walk stops on it.
   Supporting motion (3): the stage settle, one variable-weight moment (Hanzo's line about genesis grows bold as you
   read it), and related cards that open into their page (each card shows the Sigil its page opens with).
   Beyond: Google Cloud to Hanzo, in one lookup. A dark-room finder over every cloud page that names its Google Cloud
   counterpart (18 of them): type the Google Cloud service you use now and its Hanzo product and endpoint come forward,
   each a link. Built only from those pages' own "Google Cloud" and "API" lines. */
import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence, useInView, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { EASE, Copy } from '../../ui';
import { A } from '../../kit';
import Sigil from '../../Sigil';
import StageSettle from '../../v2/StageSettle';
import useCalm from '../../v2/useCalm';
import './cloudfam.css';

const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const size = (name) => (name.length <= 9 ? 'xl' : name.length <= 14 ? 'l' : 'm');
const Arrow = ({ s = 14 }) => <svg viewBox="0 0 16 16" width={s} height={s} aria-hidden="true"><path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>;
const Check = () => <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M3.5 8.5l3 3 6-7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>;

/* the typing: text goes into a text node a character at a time (no React state per character); resolves when done */
function typing(el, text, cps, alive) {
  return new Promise((done) => {
    let i = 0;
    el.textContent = '';
    const step = () => {
      if (!alive()) return done(false);
      el.textContent = text.slice(0, ++i);
      if (i < text.length) setTimeout(step, 1000 / cps); else done(true);
    };
    setTimeout(step, 1000 / cps);
  });
}

function Console({ doc }) {
  const w = doc.window;
  const box = useRef(null);
  const typed = useRef(null);
  const seen = useInView(box, { amount: 0.3 });
  const calm = useReducedMotion();
  const kind = w.rows.length ? 'rows' : w.turns.length ? 'turns' : 'lines';
  const count = w.rows.length || w.turns.length || w.lines.length;
  const prompt = (doc.ship && doc.ship.prompt) || '';
  const [phase, setPhase] = useState('idle'); // idle → typing → play (→ done for reduced motion)
  const typedOnce = useRef(false);
  const [at, setAt] = useState(kind === 'rows' ? 0 : count); // rows: the lit service; turns/lines: how many are shown
  const hold = useRef(0);

  // type the prompt once, then play the example; it only runs while the console is on screen
  useEffect(() => {
    if (calm) { setPhase('done'); setAt(kind === 'rows' ? 0 : count); if (typed.current) typed.current.textContent = prompt; return; }
    if (!seen || typedOnce.current) return;
    let live = true;
    (async () => {
      setPhase('typing');
      if (kind !== 'rows') setAt(0);
      await wait(500);
      if (typed.current && prompt && !(await typing(typed.current, prompt, 44, () => live))) return;
      if (!live) return;
      typedOnce.current = true;
      setPhase('play');
    })();
    return () => { live = false; };
  }, [seen, calm]); // eslint-disable-line react-hooks/exhaustive-deps

  // the walk: rows light in turn; turns and lines arrive one by one, rest two beats, then the session replays
  useEffect(() => {
    if (calm || !seen || phase !== 'play') return;
    const id = setInterval(() => {
      if (Date.now() < hold.current) return;
      if (kind === 'rows') setAt((a) => (a + 1) % count);
      else setAt((a) => (a >= count + 2 ? 0 : a + 1));
    }, kind === 'rows' ? 1900 : 1400);
    return () => clearInterval(id);
  }, [seen, calm, phase, kind, count]);

  const alt = doc.liveLinks[0];
  const title = w.title.map((t, i) => <span key={i} className={i ? 'xcf-wt-b' : ''}>{t}{i < w.title.length - 1 ? ' ' : ''}</span>);
  const pick = (i) => { hold.current = Date.now() + 9000; setAt(i); };
  const note = doc.live[0];
  return (
    <figure ref={box} className="xcf-con">
      <div className="xcf-win">
        <div className="xcf-bar">
          <span className="xcf-dots" aria-hidden="true"><i /><i /><i /></span>
          {alt && w.console ? <A to={w.console.href} className="xcf-wt">{title}</A> : <span className="xcf-wt">{title}</span>}
        </div>
        {prompt && (
          <div className={'xcf-sess' + (phase === 'typing' ? ' typing' : '')}>
            <span className="xcf-sess-g" aria-hidden="true">›</span>
            <p className="xcf-sess-t"><span className="xcf-ghost" aria-hidden="true">{prompt}<i className="xcf-caret" /></span><span className="xcf-typed"><span ref={typed}>{prompt}</span><i className="xcf-caret" aria-hidden="true" /></span></p>
            {note && <p className={'xcf-sess-n' + (phase === 'typing' ? '' : ' on')}>{note}</p>}
          </div>
        )}
        <div className="xcf-wbody">
          <nav className="xcf-sibs" aria-label={doc.crumb[1] ? doc.crumb[1].label : doc.name} data-swipe-own>
            {w.siblings.map((s) => (
              <A key={s.href} to={s.href} className={'xcf-sib' + (s.current ? ' on' : '')} aria-current={s.current ? 'page' : undefined}>
                <span>{s.label}</span><Arrow s={12} />
              </A>
            ))}
          </nav>
          <div className="xcf-main">
            {kind === 'rows' && (
              <ul className="xcf-rows">
                {w.rows.map((r, i) => (
                  <li key={r.name}>
                    <button type="button" className={'xcf-row' + (at === i ? ' on' : '')} aria-pressed={at === i} onClick={() => pick(i)}>
                      {at === i && <motion.span layoutId={'xcf-lit-' + doc.slug} className="xcf-lit" transition={{ type: 'spring', stiffness: 300, damping: 30 }} />}
                      <span className="xcf-row-n">{r.name}</span>
                      <span className={'xcf-st ' + (/build/i.test(r.state) ? 'build' : 'ok')}><i aria-hidden="true" />{r.state}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
            {kind === 'turns' && (
              <ol className="xcf-turns">
                {w.turns.map((t, i) => <li key={i} className={(i % 2 ? 'agent' : 'you') + (at > i ? ' on' : '')}>{t}</li>)}
              </ol>
            )}
            {kind === 'lines' && (
              <ol className="xcf-lines">
                {w.lines.map((l, i) => <li key={i} className={at > i ? 'on' : ''}><b data-g={l.g}>{l.g}</b><span>{l.text}</span></li>)}
              </ol>
            )}
            {w.caption && <p className="xcf-cap">{w.caption}</p>}
          </div>
        </div>
        <div className="xcf-foot">
          <code className="xcf-host">{w.host.map((h, i) => <span key={i} className={i ? 'xcf-path' : ''}>{h}</span>)}<i className="xcf-pulse" aria-hidden="true" /></code>
          {w.console && <A to={alt || w.console.href} className="xcf-open">{w.console.label}<Arrow /></A>}
        </div>
      </div>
      {w.note && <figcaption className="xcf-note">{w.note}</figcaption>}
    </figure>
  );
}

/* /cloud/local: the boot, as a terminal session that replays itself */
function Boot({ boot }) {
  const box = useRef(null);
  const seen = useInView(box, { amount: 0.3 });
  const calm = useReducedMotion();
  const refs = useRef([]);
  const [shown, setShown] = useState(boot.lines.length);
  const [run, setRun] = useState(0);
  useEffect(() => {
    if (calm || !seen) return;
    let live = true;
    (async () => {
      setShown(0);
      await wait(500);
      for (let i = 0; i < boot.lines.length && live; i++) {
        const l = boot.lines[i];
        setShown(i + 1);
        if (l.cmd && refs.current[i] && l.text) await typing(refs.current[i], l.text, 30, () => live);
        await wait(l.cmd ? 260 : 420);
      }
      if (!live) return;
      await wait(5200);
      if (live) setRun((r) => r + 1); // replay while it stays on screen
    })();
    return () => { live = false; };
  }, [seen, calm, run]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <figure ref={box} className="xcf-con xcf-term">
      <div className="xcf-win">
        <div className="xcf-bar">
          <span className="xcf-dots" aria-hidden="true"><i /><i /><i /></span>
          <span className="xcf-wt xcf-mono">{boot.cwd}</span>
        </div>
        <ol className="xcf-tlines">
          {boot.lines.map((l, i) => (
            <li key={i} className={(l.cmd ? 'cmd' : 'out') + (i < shown ? ' on' : '') + (i === shown - 1 ? ' cur' : '')}>
              {l.cmd && <b aria-hidden="true">$</b>}
              <span ref={(el) => { refs.current[i] = el; }}>{l.text}</span>
              {l.time && <em>{l.time}</em>}
              {l.cmd && !l.text && <i className="xcf-caret" aria-hidden="true" />}
            </li>
          ))}
        </ol>
      </div>
    </figure>
  );
}

/* Beyond: the Google Cloud service you use now, and its Hanzo counterpart */
function Finder({ pairs, here }) {
  const [q, setQ] = useState('');
  const [lit, setLit] = useState(0);
  const box = useRef(null);
  const seen = useInView(box, { amount: 0.3 });
  const calm = useReducedMotion();
  const list = useMemo(() => {
    const k = q.trim().toLowerCase();
    const all = [...pairs].sort((a, b) => (b.slug === here) - (a.slug === here));
    return k ? all.filter((p) => (p.google + ' ' + p.name + ' ' + p.api).toLowerCase().includes(k)) : all;
  }, [q, pairs, here]);
  // idle scan: the rows are read one after another until you type
  useEffect(() => {
    if (calm || !seen || q) return;
    const id = setInterval(() => setLit((i) => (i + 1) % Math.max(1, list.length)), 1700);
    return () => clearInterval(id);
  }, [calm, seen, q, list.length]);
  if (!pairs.length) return null;
  const head = 'Google Cloud';
  return (
    <section ref={box} className="xcf-gc" data-room="dark" aria-labelledby="xcf-gc-h">
      <div className="xcf-wrap xcf-gc-g">
        <div className="xcf-gc-l">
          <h2 id="xcf-gc-h" className="xcf-gc-h"><span>{head}</span><svg viewBox="0 0 40 16" aria-hidden="true"><path d="M2 8h34M30 3l6 5-6 5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg><span>Hanzo</span></h2>
          <label className="xcf-gc-in">
            <span className="x-sr">{head}</span>
            <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><circle cx="7" cy="7" r="4.6" fill="none" stroke="currentColor" strokeWidth="1.5" /><path d="M10.4 10.4 14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
            <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder={pairs[0].google} autoComplete="off" />
          </label>
          <p className="xcf-gc-n" aria-live="polite"><b>{list.length}</b> / {pairs.length}</p>
        </div>
        <ul className="xcf-gc-list">
          <AnimatePresence initial={false}>
            {list.map((p, i) => (
              <motion.li key={p.slug} layout={!calm} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, transition: { duration: 0.15 } }} transition={{ duration: 0.4, ease: EASE }}>
                <A to={'/cloud/' + p.slug} className={'xcf-gc-row' + (p.slug === here ? ' here' : '') + (!q && i === lit ? ' lit' : '')} aria-current={p.slug === here ? 'page' : undefined}>
                  <span className="xcf-gc-from">{p.google}</span>
                  <i className="xcf-gc-ar" aria-hidden="true" />
                  <span className="xcf-gc-hz"><b>{p.name}</b><span>{p.api}</span></span>
                </A>
              </motion.li>
            ))}
          </AnimatePresence>
          {!list.length && (
            <li className="xcf-gc-none">
              <span>{q}</span>
              <button type="button" className="x-btn sm" onClick={() => setQ('')}>Clear</button>
            </li>
          )}
        </ul>
      </div>
    </section>
  );
}

/* the one variable-weight moment: Hanzo's line grows bold, sentence by sentence, as it is read */
function Motto({ text }) {
  const ref = useRef(null);
  const calm = useCalm();
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const parts = text.split(/(?<=\.)\s+/);
  // computed in JS on purpose (a plain range map would go to the browser's scroll timeline, which misreads ranges)
  const w0 = useTransform(p, (v) => 220 + 440 * Math.min(1, Math.max(0, (v - 0.18) / 0.27)));
  const w1 = useTransform(p, (v) => 220 + 440 * Math.min(1, Math.max(0, (v - 0.34) / 0.27)));
  const o0 = useTransform(w0, (w) => 0.28 + 0.72 * ((w - 220) / 440));
  const o1 = useTransform(w1, (w) => 0.28 + 0.72 * ((w - 220) / 440));
  const st = [{ fontWeight: w0, opacity: o0 }, { fontWeight: w1, opacity: o1 }];
  return (
    <section ref={ref} className="xcf-motto" aria-label={text}>
      <div className="xcf-wrap">
        <p className="xcf-motto-t">
          {parts.map((s, i) => <motion.span key={i} style={calm ? undefined : st[Math.min(i, 1)]}>{s}{i < parts.length - 1 ? ' ' : ''}</motion.span>)}
        </p>
      </div>
    </section>
  );
}

function Prompt({ text }) {
  const at = text.indexOf('Start with: ');
  if (at < 0) return text;
  return <>{text.slice(0, at)}<span className="xcf-pr-k">Start with: </span><b>{text.slice(at + 12)}</b></>;
}

const Acts = ({ list, thumb = true }) => (
  <div className="xcf-acts">
    {list.map((a, i) => <A key={a.href} to={a.href} className={'x-btn xcf-btn' + (i ? '' : ' solid')} {...(i || !thumb ? {} : { 'data-thumb': '' })}>{a.label}</A>)}
  </div>
);

export default function CloudProduct({ doc, pairs, tone, sigil, cards = {} }) {
  const isLocal = doc.kind === 'local';
  const kind = isLocal ? 'term' : doc.window ? (doc.window.rows.length ? 'rows' : doc.window.turns.length ? 'turns' : 'lines') : 'none';
  const style = { '--acc': tone.acc, '--acc-hi': tone.hi };
  const sibs = doc.window ? doc.window.siblings : [];
  const source = !isLocal && doc.actions.find((a) => /github\.com/.test(a.href));
  return (
    <main className={'xcf k-' + kind} style={style}>
      <section className="xcf-hero" aria-labelledby="xcf-h1">
        <div className="xcf-band" data-morph-target>
          <Sigil seed={sigil.seed} data={sigil.data} className="xcf-sigil" />
          <div className="xcf-wrap xcf-head">
            <div className="xcf-head-l">
              <div className="xcf-top">
                {!!(doc.crumb && doc.crumb.length) && (
                  <nav className="xcf-crumb" aria-label="Breadcrumb">
                    {doc.crumb.map((c, i) => <span key={i}>{i > 0 && <i aria-hidden="true">/</i>}{c.href ? <A to={c.href}>{c.label}</A> : <span>{c.label}</span>}</span>)}
                  </nav>
                )}
                <p className={'xcf-label' + (/^Generally available$/i.test(doc.label) ? ' ga' : /^Beta$/i.test(doc.label) ? ' beta' : '')}><i aria-hidden="true" />{doc.label}</p>
              </div>
              <h1 id="xcf-h1" className={'xcf-display s-' + size(doc.name)}>{doc.name}</h1>
            </div>
            <div className="xcf-head-r">
              {doc.lede && <p className="xcf-lede">{doc.lede}</p>}
              {!isLocal && <Acts list={doc.actions} />}
            </div>
          </div>
        </div>
        <div className="xcf-wrap xcf-stage-w">
          <StageSettle className="xcf-stage" over={620} from={{ rotateX: 24, scale: 1.04, y: 0 }}>
            {isLocal ? <Boot boot={doc.boot} /> : doc.window && <Console doc={doc} />}
          </StageSettle>
        </div>
      </section>

      {isLocal && (
        <section id={doc.boot.id} className="xcf-sec xcf-boot" aria-labelledby="xcf-boot-h">
          <div className="xcf-wrap">
            <div className="xcf-boot-head">
              <div>
                <p className="xcf-kick">{doc.boot.eyebrow}</p>
                <h2 id="xcf-boot-h" className="xcf-h2">{doc.boot.title}</h2>
              </div>
              <p className="xcf-body">{doc.boot.lede}</p>
            </div>
            <dl className="xcf-figs">
              {doc.boot.figures.map((f) => <div key={f.value}><dd>{f.value}</dd><dt>{f.label}</dt></div>)}
            </dl>
            <Acts list={doc.boot.actions} />
          </div>
        </section>
      )}

      {doc.ship && (
        <section className="xcf-sec xcf-ship" aria-labelledby="xcf-ship-h">
          <div className="xcf-wrap xcf-ship-g">
            <div className="xcf-ship-l">
              <p id="xcf-ship-h" className="xcf-kick">{doc.ship.eyebrow}</p>
              <p className="xcf-body">{doc.ship.lede}</p>
              <p className="xcf-api"><span className="xcf-api-l">{doc.ship.label}</span><span className="xcf-mono">{doc.ship.api.map((t, i) => <span key={i} className={i ? '' : 'xcf-api-k'}>{t}</span>)}</span></p>
              <Copy text={doc.ship.prompt} className="xcf-copy" />
            </div>
            <pre className="xcf-prompt"><Prompt text={doc.ship.prompt} /></pre>
          </div>
        </section>
      )}

      {!isLocal && (doc.desc.length > 0 || doc.features.length > 0) && (
        <section className="xcf-sec xcf-about">
          <div className="xcf-wrap">
            {doc.desc.map((p) => <p key={p} className="xcf-desc">{p}</p>)}
            {!!doc.features.length && (
              <ol className="xcf-feats">
                {doc.features.map((f, i) => <li key={f}><span className="xcf-kick">{String(i + 1).padStart(2, '0')}</span><b>{f}</b></li>)}
              </ol>
            )}
          </div>
        </section>
      )}

      {!isLocal && doc.motto && <Motto text={doc.motto} />}

      {!isLocal && (
        <section className="xcf-sec xcf-specs" aria-labelledby="xcf-sp-h">
          <div className="xcf-wrap xcf-specs-g">
            <div className="xcf-specs-l">
              <p className="xcf-kick">{tone.group}</p>
              <h2 id="xcf-sp-h" className="xcf-h2">{doc.name}</h2>
              {source && <A to={source.href} className="xcf-go"><span>{source.label}</span><Arrow /></A>}
            </div>
            <div className="xcf-specs-r">
              <dl className="xcf-dl">
                {doc.meta.map((m) => <div key={m.k}><dt>{m.k}</dt><dd className={m.k === 'API' ? 'xcf-mono' : ''}>{m.v}</dd></div>)}
                {sibs.length > 1 && doc.crumb[1] && (
                  <div><dt>{doc.crumb[1].label}</dt><dd><ul className="xcf-fam">{sibs.map((s) => <li key={s.href}><A to={s.href} className={s.current ? 'on' : ''} aria-current={s.current ? 'page' : undefined}>{s.label}</A></li>)}</ul></dd></div>
                )}
              </dl>
              {!!doc.badges.length && <ul className="xcf-badges">{doc.badges.map((b) => <li key={b}><Check />{b}</li>)}</ul>}
            </div>
          </div>
        </section>
      )}

      <Finder pairs={pairs} here={doc.slug} />

      {doc.related && (
        <section className="xcf-sec xcf-rel" aria-labelledby="xcf-rel-h">
          <div className="xcf-wrap">
            <div className="xcf-rel-top">
              <p id="xcf-rel-h" className="xcf-kick">{doc.related.eyebrow}</p>
              {doc.related.more.map((m) => <A key={m.href} to={m.href} className="xcf-go"><span>{m.label}</span></A>)}
            </div>
            <ul className="xcf-cards">
              {doc.related.items.map((r, i) => {
                const sg = cards[r.href] || { seed: r.href, data: [] };
                return (
                  <li key={r.href} className={'c' + i}>
                    <A to={r.href} className="xcf-card">
                      <span className="xcf-card-art" data-morph><Sigil seed={sg.seed} data={sg.data} still className="xcf-card-sig" /></span>
                      <span className="xcf-card-n">{r.label}</span>
                      {r.desc && <span className="xcf-card-d">{r.desc}</span>}
                      <span className="xcf-card-go" aria-hidden="true"><Arrow s={18} /></span>
                    </A>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>
      )}

      {!isLocal && (
        <section className="xcf-cta" aria-labelledby="xcf-cta-h">
          <div className="xcf-wrap xcf-cta-g">
            <h2 id="xcf-cta-h" className={'xcf-display s-' + size(doc.name)}>{doc.name}</h2>
            <div>
              {doc.lede && <p className="xcf-lede">{doc.lede}</p>}
              <Acts list={doc.actions} thumb={false} />
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
