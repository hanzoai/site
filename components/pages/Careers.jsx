'use client';
/* /careers.
   V2: 8/10 re-review fixes: JS-off and reduced motion clean; the 21-button toolbar is one quiet skill row with a gliding
   ink pill; perks crossfade (300ms) and stay in view on phones; phone numerals in their own row; a sheet opens in its own
   white carrying its title and numeral onto the role page's h1 and numeral (page-local careers/door.js); the next
   section peeks at 1470×801.
   Persona: an engineer or researcher deciding whether to apply (PLAN 1.1 "one contact click").
   Goal: open a role and apply.  CTA: "View Open Positions" (careers.hero), again only in the dark close (careers has no
   sticky ask: data-ask="off", MASTER part 4).
   Metric: cta_click careers.* leading to a role page.
   Signature: the open roles are a deck of sheets. Scroll and each role rises over the last while the stack behind it
   settles back; click a sheet and it grows to fill the screen in its own white, its title and numeral flying onto the
   role page's h1 and numeral (synchronized.studio; the site Morph times out, docs/requests/careers.md).
   Supporting (3): masked kinetic headline, once, from first paint (CSS); the How-we-hire card sliding its steps by
   itself; the perk tile crossfading its Sigil field and numeral to the perk you point at or tap. A Utility page (MASTER
   4.5): the deck is its one delight, entries 0.4s.
   Beyond: match what you know. Pick a skill, word for word from the role descriptions (LLVM, RLHF, zero-knowledge, data
   visualization…): the ink pill glides to it, the roles that ask for it stay lit with the words marked, the rest step back.
   Deletes: the orange accent, the kicker over the h1 and over every headline, the 8-pill team filter (each team had one
   role), "Link" / "Copied" / "Clear" / "Match what you know" as visible words (icons with aria-labels), native title=
   tooltips, the second solid button in Academic, solid "Apply" on every sheet.
   The role pages (/careers/<slug>) are CareerRole.jsx; this index has its own CareersBoard.css. */
import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useInView, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { useRouter } from 'next/navigation';
import { A, Cta } from '../kit';
import Sigil from '../Sigil';
import MaskLines from './careers/MaskLines'; // careers' own variant; main's v2/MaskLines differs
import { openSheet, useSheetLanding } from './careers/door';
import { Roll, useEnter } from './careers/enter';
import { href as hrefOf } from '../../lib/route';
import { play } from '../../lib/sound';
import '../v2/vc-type.css';
import './company/deck.css';
import './CareersBoard.css';

const EASE = [0.16, 1, 0.3, 1];
// JS off: the hero is legible; the hiring steps read as a plain list (only one step per row, no counter, no bars)
const NOJS = { __html: '<style>.xcb-hero-f,.xcb-hero-o{opacity:1!important;transform:none!important}.xcb-hire-stage{display:block!important;overflow:visible!important}.xcb-hire-s{transform:none!important;margin-top:20px}.xcb-hire-n,.xcb-hire-t,.xcb-hire-h .vc-num{display:none!important}</style>' };

/* How we hire: the four steps slide through a mask by themselves (never two titles at once); tap a step to hold it. */
function Hire({ how }) {
  const [at, setAt] = useState(0);
  const [mine, setMine] = useState(false);
  const box = useRef(null);
  const seen = useInView(box, { amount: 0.15 });
  const calm = useReducedMotion();
  const n = how.steps.length;
  useEffect(() => {
    if (calm || !seen) return;
    // a tapped step holds for two beats, then the card carries on by itself
    const t = mine ? setTimeout(() => setMine(false), 6800) : setTimeout(() => setAt((v) => (v + 1) % n), 3400);
    return () => clearTimeout(t);
  }, [at, mine, calm, seen, n]);
  return (
    <div className="xcb-hire vc-obj" ref={box}>
      <div className="xcb-hire-h">
        <span className="xcb-hire-k">{how.title}</span>
        <span className="xcb-hire-k vc-num" aria-hidden="true">{String(at + 1).padStart(2, '0')} / {String(n).padStart(2, '0')}</span>
      </div>
      {/* phones: the step's timer also runs along the card's top, so the peek of the card shows it moving */}
      <i className="xcb-hire-t" aria-hidden="true"><u key={at + (mine ? 'm' : '')} className={mine ? 'done' : seen ? 'run' : 'wait'} /></i>
      <div className="xcb-hire-stage">
        {how.steps.map(([t, d], i) => (
          <motion.div key={t} className="xcb-hire-s" initial={false} aria-hidden={i !== at}
            animate={{ y: i === at ? '0%' : i < at ? '-104%' : '104%' }}
            transition={{ duration: 0.8, ease: EASE }}>
            <b>{t}</b>
            <p>{d}</p>
          </motion.div>
        ))}
      </div>
      <ol className="xcb-hire-n">
        {how.steps.map(([t], i) => (
          <li key={t}>
            <button type="button" aria-pressed={i === at} onClick={() => { setMine(true); setAt(i); }}>
              <i>{i < at && <u className="done" />}{i === at && <u key={at + (mine ? 'm' : '')} className={mine ? 'done' : seen ? 'run' : 'wait'} />}</i>
              <span>{t}</span>
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}

/* Copy the role's direct link. An icon only: a link glyph that turns into a drawn tick (the words live in aria). */
function CopyDirect({ id, title }) {
  const [ok, setOk] = useState(false);
  return (
    <button type="button" className={'xcb-cp' + (ok ? ' ok' : '')} aria-label={ok ? 'Link copied' : 'Copy direct link to ' + title}
      onClick={async () => {
        let done = true;
        try { await navigator.clipboard.writeText(location.origin + '/careers#' + id); } catch { done = false; }
        if (!done) return;
        setOk(true); setTimeout(() => setOk(false), 1600);
      }}>
      {ok
        ? <svg viewBox="0 0 16 16" width="18" height="18" aria-hidden="true"><motion.path d="M3 8.5l3 3 7-7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.3, ease: EASE }} /></svg>
        : <svg viewBox="0 0 16 16" width="18" height="18" aria-hidden="true"><path d="M6.8 9.2a2.6 2.6 0 0 0 3.7 0l2-2a2.6 2.6 0 0 0-3.7-3.7l-.6.6M9.2 6.8a2.6 2.6 0 0 0-3.7 0l-2 2a2.6 2.6 0 0 0 3.7 3.7l.6-.6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>}
      <span className="x-sr" role="status">{ok ? 'Link copied' : ''}</span>
    </button>
  );
}

// skills as Hanzo's role descriptions write them; a chip is shown only if some role asks for it
const SKILLS = ['transformers', 'RLHF', 'distributed', 'LLVM', 'MLIR', 'compilers', 'Model Context Protocol', 'agents', 'zero-knowledge', 'cryptography', 'Go/Rust', 'developer tools', 'data visualization'];
const stem = (t) => t.toLowerCase().replace(/s$/, ''); // "agents" also finds "agent infrastructure"
const asks = (r, k) => (r.title + ' ' + r.desc).toLowerCase().includes(stem(k));
const esc = (t) => t.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&');
function Marked({ text, know }) {
  if (!know.length) return text;
  const re = new RegExp('(' + know.map((k) => esc(stem(k)) + '\\w*').join('|') + ')', 'gi');
  return text.split(re).map((p, i) => (i % 2 ? <mark key={i}>{p}</mark> : p));
}

/* One role, one sheet. It sticks a little lower than the one before, and settles back as later sheets cover it. */
/* The sheet opens into its page: the whole sheet grows to fill the screen in its own white, carrying its title and
   numeral, which then land on the role page's h1 and numeral (careers/door.js). The site Morph is skipped here
   (data-no-morph): it times out today (docs/requests/careers.md). */
const open = (e, to, router, el) => openSheet(e, hrefOf(to), router, el || e.currentTarget.closest('.xcb-sheet-in'));

function Sheet({ r, i, n, know, progress, on }) {
  const router = useRouter();
  const card = useRef(null);
  const [where, kind, team] = r.chips;
  const miss = know.length > 0 && !know.some((k) => asks(r, k));
  const scale = useTransform(progress, [i / n, 1], [1, 1 - (n - 1 - i) * 0.028]);
  return (
    <li id={r.id} className={'xcb-sheet' + (miss ? ' miss' : '') + (on ? ' on' : '')} style={{ '--i': i }}>
      <motion.div className="xcb-sheet-in" style={{ scale }} ref={card}>
        {/* the role's own contour (seeded with its slug, like its page's), drifting only on the sheet in front */}
        <Sigil seed={'/careers/' + r.href.split('/').filter(Boolean).pop()} data={[r.desc.length, i + 1]} className="xcb-sheet-c" still={!on} />
        <A to={r.href} className="xcb-sheet-a" data-no-morph onClick={(e) => open(e, r.href, router, card.current)}>
          <span className="xcb-sheet-no vc-num" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
          <span className="xcb-sheet-t">{r.title}</span>
          <span className="xcb-sheet-tags"><span>{team}</span><span>{where}</span><span>{kind}</span></span>
          <span className="xcb-sheet-d"><Marked text={r.desc} know={know} /></span>
        </A>
        <div className="xcb-sheet-act">
          <Cta to={r.acts[0].href} kind="quiet" className="xcb-big" id={'careers.role.' + r.id} data-no-morph onClick={(e) => open(e, r.acts[0].href, router, card.current)}>{r.acts[0].text}</Cta>
          <Cta to={r.acts[1].href} kind="link" className="xcb-tap" data-no-morph onClick={(e) => open(e, r.acts[1].href, router, card.current)}>{r.acts[1].text}</Cta>
          <CopyDirect id={r.id} title={r.title} />
        </div>
      </motion.div>
    </li>
  );
}

function Deck({ roles, know, dont, dontA }) {
  const router = useRouter();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const n = roles.length + 1;
  const [front, setFront] = useState(0);
  useMotionValueEvent(scrollYProgress, 'change', (v) => setFront(Math.min(n - 1, Math.max(0, Math.round(v * (n - 1))))));
  return (
    <ul className="xcb-deck" ref={ref}>
      {roles.map((r, i) => <Sheet key={r.id} r={r} i={i} n={n} know={know} progress={scrollYProgress} on={front === i} />)}
      <li className="xcb-sheet last" style={{ '--i': roles.length }}>
        <div className="xcb-sheet-in">
          <span className="xcb-sheet-sig" aria-hidden="true"><Sigil seed="careers/open" data={[n]} /></span>
          <p className="xcb-sheet-t">{dont}</p>
          <div className="xcb-sheet-act"><Cta to={dontA.href} className="xcb-big" id="careers.open" thumb data-no-morph onClick={(e) => open(e, dontA.href, router)}>{dontA.text}</Cta></div>
        </div>
      </li>
    </ul>
  );
}

/* The signature, word-light (MOTION-MAP.md): how the team works, read as one long statement. Every word of the four
   perks lights in turn as you read down the list (scroll-linked, ink from a pale grey); the tile beside it crossfades its
   Sigil field and numeral to the perk being lit, or to the one you point at, tap or focus. Server HTML, JS off and
   reduced motion show every word lit. */
const split = (t) => t.split(/(\s+)/);
function Perks({ perks }) {
  const list = useRef(null);
  const calm = useReducedMotion();
  const counts = perks.items.map(([pt, pp]) => split(pt + ' ' + pp).filter((w) => w.trim()).length);
  const total = counts.reduce((a, b) => a + b, 0);
  const [lit, setLit] = useState(total);
  const [hover, setHover] = useState(null);
  const { scrollYProgress } = useScroll({ target: list, offset: ['start 78%', 'end 55%'] });
  const read = (v) => setLit(calm ? total : Math.round(Math.min(1, Math.max(0, v)) * total));
  useMotionValueEvent(scrollYProgress, 'change', read);
  useEffect(() => { read(scrollYProgress.get()); }, [calm]); // eslint-disable-line react-hooks/exhaustive-deps
  let reading = 0;
  for (let s = 0, i = 0; i < counts.length; s += counts[i], i++) if (lit > s) reading = i;
  const at = hover ?? reading;
  const [t, p] = perks.items[at];
  const fade = { duration: calm ? 0 : 0.3, ease: EASE };
  let w = 0;
  const words = (text) => split(text).map((x, k) => (x.trim() ? <span key={k} className={'xcb-w' + (w++ < lit ? '' : ' off')}>{x}</span> : x));
  return (
    <div className="vc-grid xcb-perk-g xce-swing" ref={useEnter()}>
      <div className="xcb-perk-v" aria-hidden="true">
        {/* the field and numeral crossfade (300ms, ease-emphasis) to the perk you point at, tap or focus */}
        <AnimatePresence initial={false}>
          <motion.div key={at} className="xcb-perk-f" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={fade}>
            <Sigil seed={'careers/' + t} data={[t.length, p.length, at + 1]} className="xcb-perk-sig" />
            <motion.span className="xcb-perk-big vc-num" initial={{ y: calm ? 0 : 12 }} animate={{ y: 0 }} exit={{ y: calm ? 0 : -12 }} transition={fade}>{String(at + 1).padStart(2, '0')}</motion.span>
          </motion.div>
        </AnimatePresence>
      </div>
      <ol className="xcb-perk-l" ref={list} onPointerLeave={() => setHover(null)}>
        {perks.items.map(([pt, pp], i) => (
          <li key={pt} className={i === at ? 'on' : ''} tabIndex={0} onPointerEnter={(e) => e.pointerType === 'mouse' && setHover(i)} onFocus={() => setHover(i)} onBlur={() => setHover(null)} onClick={() => setHover(i)}>
            <span className="xcb-perk-n vc-num" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
            <h3 className="vc-title">{words(pt)}</h3>
            <p className="vc-body">{words(pp)}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}

const fig = (t) => /^([\d,]+\+)\s+(.*)$/.exec(t);

export default function Careers({ d }) {
  useSheetLanding();
  const roles = d.pos.leaves;
  const [pick, setPick] = useState(null); // one skill at a time: the ink pill glides to it
  const know = pick ? [pick] : [];
  const shown = roles;
  const skills = SKILLS.filter((k) => roles.some((r) => asks(r, k)));
  const hits = shown.filter((r) => know.some((k) => asks(r, k))).length;
  const words = d.lines.join(' ').split(' ');
  // four short lines that break where the sentence breaks: Compilers, / cryptography, / and the cloud / they run on.
  const lines = [words[0], words[1], words.slice(2, 5).join(' '), words.slice(5).join(' ')];
  const [intA, intB] = d.intern.leaves;
  const ask = d.hacts[0];
  const draw = useEnter('0px');
  const iris = useEnter();
  const count = useEnter();
  const under = useRef(null);
  const stack = useEnter('0px 0px -30% 0px');
  // sticky-stack: Academic holds with its bottom on the screen's bottom while the dark close slides over it
  useEffect(() => {
    const el = under.current, top = stack.current;
    if (!el || !top) return;
    const fit = () => { el.style.top = Math.min(0, innerHeight - el.offsetHeight) + 'px'; };
    fit();
    const ro = new ResizeObserver(fit); ro.observe(el);
    addEventListener('resize', fit);
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) el.dataset.under = ''; else if (e.boundingClientRect.top > 0) delete el.dataset.under; }, { rootMargin: '0px 0px -40% 0px' });
    io.observe(top);
    return () => { ro.disconnect(); io.disconnect(); removeEventListener('resize', fit); };
  }, [stack]);
  return (
    <main className="vc xcb" style={{ '--acc': '#0a0a0a' }} data-ask="off">
      <noscript dangerouslySetInnerHTML={NOJS} />
      <section className="xcb-hero vc-scene" aria-label={d.kicker} data-ask-name={d.kicker}>
        <div className="vc-grid xcb-hero-g">
          <div className="xcb-hero-c">
            <MaskLines as="h1" id="xcb-h1" now delay={-0.38} lines={lines} className="vc-display xcb-h1" />
            <div className="xcb-hero-f">
              <p className="vc-lede">{d.lede}</p>
              <div className="xcb-acts">
                <Cta to={'/careers' + ask.href} className="xcb-big" id="careers.hero" thumb>{ask.text}</Cta>
                <Cta to={d.hacts[1].href} kind="link" className="xcb-tap" id="careers.history">{d.hacts[1].text}</Cta>
              </div>
            </div>
          </div>
          {/* entrance 1, line-draw: the card's outline draws itself, then the card fills */}
          <div className="xcb-hero-o xce-draw" ref={draw}>
            <svg className="xce-draw-svg" aria-hidden="true"><rect x="0" y="0" width="100%" height="100%" rx="28" pathLength="1" /></svg>
            <Hire how={d.how} />
          </div>
        </div>
      </section>

      <section className="xcb-perks" aria-labelledby="xcb-perks-h">
        <div className="vc-grid xcb-perks-hd">
          <h2 id="xcb-perks-h" className="vc-headline">{d.perks.lede}</h2>
          <p className="xcb-meta">{d.perks.title}</p>
        </div>
        <Perks perks={d.perks} />
      </section>

      <section className="xcb-pos" id="open-positions" aria-labelledby="xcb-pos-h">
        {/* entrance 3, iris: the title, lede and skill row open from a circle at the centre */}
        <div className="vc-grid xcb-pos-g xce-iris" ref={iris}>
          <div className="xcb-pos-h">
            <h2 id="xcb-pos-h" className="vc-display s">{d.pos.title}</h2>
            <p className="vc-lede">{d.pos.lede}</p>
          </div>
          {/* one quiet row: the skills, word for word from the roles; pick one and the ink pill glides to it */}
          <div className="xcb-tools">
            <span className="xcb-know-i" aria-hidden="true"><svg viewBox="0 0 20 20" width="20" height="20"><circle cx="10" cy="10" r="7.2" fill="none" stroke="currentColor" strokeWidth="1.4" /><circle cx="10" cy="10" r="3.2" fill="none" stroke="currentColor" strokeWidth="1.4" /><circle cx="10" cy="10" r=".9" fill="currentColor" /></svg></span>
            <div className="xcb-know" role="group" aria-label="Match what you know">
              {skills.map((k) => {
                const on = pick === k;
                return (
                  <button key={k} type="button" aria-pressed={on} onClick={(e) => { play('tick'); setPick(on ? null : k); e.currentTarget.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'smooth' }); }}>
                    {on && <motion.span layoutId="xcb-know-pill" className="xcb-pill" transition={{ duration: 0.3, ease: EASE }} />}
                    <span>{k}</span>
                  </button>
                );
              })}
            </div>
            {pick && (
              <button type="button" className="xcb-know-x" aria-label="Clear" onClick={() => setPick(null)}>
                <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M4 4l8 8M12 4l-8 8" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
              </button>
            )}
            <p className="xcb-count vc-num" role="status" aria-label={`${shown.length} of ${roles.length} roles${know.length ? `, ${hits} ask for what you know` : ''}`}>
              <b>{know.length ? hits : shown.length}</b> / {know.length ? shown.length : roles.length}
            </p>
          </div>
        </div>
        <div className="vc-wrap">
          <Deck roles={shown} know={know} dont={d.pos.dont} dontA={d.pos.dontA} />
        </div>
      </section>

      <section className="vc-sec xcb-int xce-under" id="internships" aria-labelledby="xcb-int-h" ref={under}>
        {/* entrance 4, count-roll: the 2,137+ figure's digits roll into their values */}
        <div className="vc-grid xce-count" ref={count}>
          <header className="xcb-int-h">
            <h2 id="xcb-int-h" className="vc-headline">{d.intern.title}</h2>
            <p className="vc-body">{d.intern.lede}</p>
          </header>
          {[intA, intB].map((l, k) => (
            <article key={l.title} className={'xcb-panel ' + (k ? 'b' : 'a')}>
              {k === 0 && <span className="xcb-panel-sig" aria-hidden="true"><Sigil seed={'careers/' + l.title} data={[l.desc.length]} /></span>}
              {l.perks.filter(fig).map((p) => { const m = fig(p); return <p key={p} className="xcb-fig"><Roll text={m[1]} className="vc-num" /><span>{m[2]}</span></p>; })}
              <h3 className="vc-title">{l.title}</h3>
              <ul className="xcb-panel-p">{l.perks.filter((p) => !fig(p)).map((p) => <li key={p}>{p}</li>)}</ul>
              <p className="vc-body">{l.desc}</p>
              <div className="xcb-panel-a">
                <Cta to={l.acts[0].href} kind={k ? 'quiet' : 'solid'} className="xcb-big" id={'careers.' + (k ? 'grant' : 'intern')} thumb={!k}>{l.acts[0].text}</Cta>
                <Cta to={l.acts[1].href} kind="link" className="xcb-tap">{l.acts[1].text}</Cta>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* entrance 5, sticky-stack: the dark close slides up over Academic and lands on it as a card that opens to full width */}
      <section className="xcb-close xce-stack" data-room="dark" aria-labelledby="xcb-close-h" ref={stack}>
        <div className="vc-grid">
          <div className="xcb-close-l">
            <h2 id="xcb-close-h" className="vc-display m">{d.close.title}</h2>
            <p className="vc-lede">{d.close.lede}</p>
            <div className="xcb-acts">
              <Cta to={'/careers' + d.close.acts[0].href} className="xcb-big" id="careers.close" thumb>{d.close.acts[0].text}</Cta>
              <a className="xcb-mail" href={d.close.acts[1].href}>{d.close.acts[1].text}</a>
            </div>
          </div>
          <div className="xcb-close-sig" aria-hidden="true"><Sigil seed="/careers" data={[2137, 122, roles.length]} /></div>
        </div>
      </section>

    </main>
  );
}
