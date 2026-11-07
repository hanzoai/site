'use client';
// Persona: a team shipping an LLM feature that worries about pasted secrets and prompt injection.
// Goal: watch both directions get read, then try it on their own text.
// CTA: View on GitHub (guard.hero, guard.close).
// Metric: cta_click guard.hero
// Signature: both directions, live: a request types, its secrets become typed markers, the injection is scored, the reply is read too; below, the six facts pin as one detector board stepped by a numbered rail.
// Beyond: Paste your own with real dials: detectors on or off and the marker text, run in the page.
/* Guard (v2, archetype A Launch).
   V2: 8/10 round 5: the hero console types data-shaped values (a test card number, an address at example.com, a test-key string, the documentation IP) that become Hanzo's typed markers, with the finished frame in the server HTML; the playground rests prefilled and redacted, its dials down the left column; detector chips are outlined toggles with a tick; reduced motion stacks the six facts beside their boards; panel 05 on its own surface with its tick landing; no invented heading; 44px targets; close hover fills with ink. Round 4: the stage's 26px title and numbered rail lead the left column (no navigation in the bottom of the screen), chapter titles 21px under it; each panel does one thing as it arrives (shapes light, the Luhn tick, a token through the gate and back, dials flip and the bucket drains, content struck while its hash is written, the proxy wires itself to CLI and MCP) on its own surface; phones get a sideways snap rail, one chapter per screen, panel first, words clamped behind Read more; the close's ask is quiet; touch-safe hovers; deck greys only; one ask.
   Signature: both directions, live. In the composer a request types itself; as it is sent, the things people paste by
   accident turn into typed markers and the injection attempt gets a confidence (not a verdict) against the threshold;
   then the model's reply streams back and is read by the same detectors.
   Supporting: kinetic title lines; a pointer tilt on the composer (fine pointers); the six facts as one pinned
   detector board with a numbered rail (page-local, not the shared PinChapters, so it is not /gateway's stage).
   Beyond: "Paste your own" with real dials - type or paste anything, switch each detector on or off and choose the
   marker text; the same kinds of detector run in your own page and nothing is sent (Guard.redact.mjs, self-check in
   Guard.redact.test.mjs).
   Greys only (Hanzo's deck). Every word and link is Hanzo's; the request and reply are made-up examples.
   Persona: a team shipping an LLM feature that worries about pasted secrets and prompt injection.
   Goal: watch both directions get read, then try it on their own text.
   CTA: View on GitHub (hero, the sticky ask bar and the close; one solid button per screen). */
import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useMotionValueEvent, useReducedMotion } from 'motion/react';
import { A, Cta } from '../../kit';
import { useLive } from './Frame';
import { redact } from './Guard.redact.mjs';
import { Lines } from '../../v2/LiftStage';
import ShipPrompt from '../../v2/ShipPrompt';
import GetIt from '../../v2/GetIt';
import LivePause, { usePause } from '../../v2/LivePause';
import '../../v2/v2scale.css';
import './Guard.css';

const EASE = [0.16, 1, 0.3, 1];
/* what each detector is called, in Hanzo's own words (the second fact's sentence); the brackets of a marker are drawn
   by CSS, so every word on the page is Hanzo's */
const NAME = { CARD: 'card numbers', EMAIL: 'emails', SSN: 'Social security numbers', PHONE: 'phone numbers', IP: 'IP addresses', API_KEY: 'provider API keys' };
/* the request and the reply hold data, not sentences: data-shaped values (a standard test card number, an address at
   example.com, a test-key-shaped string, the documentation IP) that turn into Hanzo's typed markers once read, and the
   injection shown by Hanzo's own name for its first shape, underlined once it is scored. No invented prose. */
const REQ = [{ k: 'CARD', v: '4111 1111 1111 1111' }, { k: 'EMAIL', v: 'jane@example.com' }, { inj: 'Overriding the instructions' }];
const REP = [{ k: 'API_KEY', v: 'sk-test-51Hx9Qb2aZ' }, { k: 'IP', v: '192.0.2.1' }];
const Arrow = ({ back }) => <svg className="gd-arr" viewBox="0 0 16 10" width="16" height="10" aria-hidden="true"><path d={back ? 'M15 5H2M5.5 1.5 2 5l3.5 3.5' : 'M1 5h13M10.5 1.5 14 5l-3.5 3.5'} fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>;

/* a line typed character by character (n of them so far); once read, the values become Hanzo's typed markers */
function Typed({ seq, n, read }) {
  let left = n;
  return seq.map((x, i) => {
    if (x.k && read) return <motion.span key={i} className="gd-mk" initial={{ opacity: 0, scale: 0.8, y: 4 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 0.3, ease: EASE }}>{NAME[x.k]}</motion.span>;
    const full = x.k ? x.v : x.inj;
    if (left <= 0) return null;
    const t = full.slice(0, left); left -= full.length;
    return <span key={i} className={x.k ? 'gd-tv sec' : 'gd-tv gd-injr' + (read ? ' on' : '')}>{t}</span>;
  });
}
const count = (seq) => seq.reduce((s, x) => s + (x.k ? x.v : x.inj).length, 0);

/* The composer: the request types, then is read (values become markers, the injection gets its confidence); the
   reply comes back and is read too. 0 typing req, 1 req read, 2 typing reply, 3 reply read, 4 hold. It starts on the
   finished frame (4) so the server HTML and a JS-off visit show the whole exchange; once seen, it plays from the top. */
function Composer() {
  const [ref, seen, calm] = useLive(0.3);
  const [paused, togglePause] = usePause();
  const live = seen && !paused;
  const [st, setSt] = useState(4);
  const [n, setN] = useState(0);
  const [loop, setLoop] = useState(0);
  useEffect(() => { if (calm) setSt(4); }, [calm]);
  useEffect(() => {
    if (!live) return;
    if (st === 0 || st === 2) {
      const total = count(st === 0 ? REQ : REP);
      const t = setTimeout(() => { if (n >= total) { setSt(st + 1); setN(0); } else setN(n + 1); }, n >= total ? 300 : 38);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => { if (st === 4) { setLoop((l) => l + 1); setSt(0); } else setSt(st + 1); }, st === 1 ? 2200 : st === 3 ? 1600 : loop ? 2600 : 900);
    return () => clearTimeout(t);
  }, [st, n, live]);
  const read1 = st >= 1;
  const read2 = st >= 3;
  const all = 99;
  return (
    <div className="lp-host">
    <LivePause paused={paused} onToggle={togglePause} className="gd-pause" dark />
    <div className="gd-comp" ref={ref} aria-hidden="true">
      <div className="gd-comp-bar"><span className={'gd-dot' + (read1 ? ' on' : '')} /><span>hanzoai/guard</span><span className={'gd-dot r' + (read2 ? ' on' : '')} /></div>
      <div className="gd-msg me">
        <p className="gd-who">request <Arrow /> model</p>
        <p className="gd-body" key={'q' + loop}><Typed seq={REQ} n={st === 0 ? n : all} read={read1} />{!read1 && <i className="gd-caret" />}</p>
      </div>
      <div className="gd-conf">
        <span>confidence</span>
        <div className="gd-bar"><motion.i initial={false} animate={{ scaleX: read1 ? 0.82 : 0 }} transition={{ duration: 1.1, ease: EASE, delay: 0.3 }} /><b style={{ left: '70%' }} /></div>
        <svg className={'gd-over' + (read1 ? ' on' : '')} viewBox="0 0 16 16" width="16" height="16"><path d="M3.5 8.5 6.5 11.5 12.5 4.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </div>
      <div className={'gd-msg it' + (st >= 2 ? ' on' : '')}>
        <p className="gd-who">reply <Arrow back /> model</p>
        <p className="gd-body" key={'r' + loop}>{st >= 2 ? <><Typed seq={REP} n={st === 2 ? n : all} read={read2} />{!read2 && <i className="gd-caret" />}</> : <span className="gd-wait">…</span>}</p>
      </div>
    </div>
    </div>
  );
}

const FACTS = [
  ['Six shapes an injection takes', 'Overriding the instructions, role-play, asking for the system prompt, bypassing a rule, hiding the ask in an encoding, and reframing the context. A match returns a confidence rather than a verdict, and you decide what confidence is worth blocking.'],
  ['The things people paste by accident', 'Social security numbers, card numbers checked against the Luhn digit so a phone number is not mistaken for one, emails, phone numbers, IP addresses, and provider API keys. Each becomes a typed marker, so the model still knows a card number was there and does not lose the sentence.'],
  ['Both directions, on purpose', 'The reply is read with the same detectors as the request, because the leak that matters is usually the one coming back. A machine-learning classifier for categories like violence and self-harm is available and off unless you turn it on — pattern matching is the default because it is the part that behaves the same every time.'],
  ['You set the dials', 'Turn each detector on or off, set the injection threshold, add your own patterns for whatever is sensitive in your domain, and choose the marker text. Requests are rate limited per user with a token bucket, so a single caller cannot burn the budget.'],
  ['A log that is not a second copy of the leak', 'Decisions are written as JSON lines with a hash of the content, not the content. Logging what you just redacted would put it in a file with weaker access control than the one you took it out of. Turn content logging on deliberately, or leave it off.'],
  ['Nothing to rewrite', 'Start the proxy with your provider as the upstream and point the base URL at it. Or wrap a CLI tool over a pseudo-terminal and everything you type is filtered on its way in. Or put it in front of an MCP server and filter the tool calls.'],
];

/* The detector board: what each fact looks like, in its own words. */
const BOARD = [
  { kind: 'list', items: ['Overriding the instructions', 'role-play', 'asking for the system prompt', 'bypassing a rule', 'hiding the ask in an encoding', 'reframing the context'], foot: 'confidence' },
  { kind: 'tiles', items: [['SSN', ''], ['CARD', 'Luhn'], ['EMAIL', ''], ['PHONE', ''], ['IP', ''], ['API_KEY', '']] },
  { kind: 'lanes', items: [['request', false], ['reply', true]], foot: 'machine-learning classifier' },
  { kind: 'dials', items: ['each detector', 'injection threshold', 'your own patterns', 'marker text', 'token bucket'] },
  { kind: 'log', items: [['content', false], ['hash of the content', true]] },
  { kind: 'modes', items: [['proxy', 'base URL'], ['CLI tool', 'pseudo-terminal'], ['MCP server', 'tool calls']] },
];

const it = (j) => ({ in: { opacity: 0, y: 18 }, on: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE, delay: 0.05 + j * 0.05 } } });

/* Each panel does one thing as it arrives (CSS keyframes, so they restart whenever the panel is remounted and freeze
   under reduced motion): the six shapes light in turn, [CARD] gets its Luhn tick, a token runs through the gate and
   back, the dials flip on and the bucket drains, "content" is struck while its hash is written, the proxy draws its
   lines to the CLI tool and the MCP server. Each kind also sits on its own surface, so it is not one grey box six times. */
function Board({ at, still }) {
  const b = BOARD[at];
  return (
    <div className="gd-board" data-k={b.kind} aria-hidden="true">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div key={at} className={'gd-b gd-b-' + b.kind} initial={still ? 'on' : 'in'} animate="on" exit={{ opacity: 0, transition: { duration: 0.16 } }}>
          {b.kind === 'list' && (
            <>
              <ol>{b.items.map((t, j) => <motion.li key={t} variants={it(j)} style={{ '--j': j }}><span>{String(j + 1).padStart(2, '0')}</span>{t}</motion.li>)}</ol>
              <motion.div className="gd-b-conf" variants={it(6)}><span>{b.foot}</span><div><motion.i variants={{ in: { scaleX: 0 }, on: { scaleX: 0.82, transition: { duration: 1.2, ease: EASE, delay: 0.5 } } }} /></div></motion.div>
            </>
          )}
          {b.kind === 'tiles' && <div className="gd-tiles">{b.items.map(([t, s], j) => <motion.p key={t} variants={it(j)}><b className="gd-mkt">{NAME[t]}</b>{s && <span className="gd-luhn">{s} ✓</span>}</motion.p>)}</div>}
          {b.kind === 'lanes' && (
            <>
              {b.items.map(([t, back], j) => <motion.div key={t} className={'gd-lane' + (back ? ' back' : '')} variants={it(j)}><b>{t}</b><s /><i>Guard</i><s /><span><Arrow back={back} /> model</span><em className="gd-tokw"><em className="gd-tok" /></em></motion.div>)}
              <motion.p className="gd-b-off" variants={it(3)}><i />{b.foot}</motion.p>
            </>
          )}
          {b.kind === 'dials' && <ul>{b.items.map((t, j) => <motion.li key={t} variants={it(j)} style={{ '--j': j }}><span>{t}</span><i className={j === 4 ? 'bucket' : 'sw'} /></motion.li>)}</ul>}
          {b.kind === 'log' && b.items.map(([t, ok], j) => <motion.p key={t} className={'gd-logl' + (ok ? ' ok' : ' no')} variants={it(j)}><b>{ok ? '✓' : '×'}</b><span>{t}</span></motion.p>)}
          {b.kind === 'modes' && (
            <div className="gd-modes">
              {b.items.map(([t, d], j) => <motion.div key={t} className={j ? 'gd-mode' : 'gd-mode lead'} variants={it(j)}><b>{t}</b><span>{d}</span></motion.div>)}
              <svg className="gd-wire" viewBox="0 0 44 100" preserveAspectRatio="none"><path d="M0 50 C22 50 22 25 44 25" /><path d="M0 50 C22 50 22 75 44 75" /></svg>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

const KINDS = ['CARD', 'EMAIL', 'SSN', 'PHONE', 'IP', 'API_KEY'];
/* the marker text you choose: square brackets, angle brackets or a solid block (the shape is the label; the radio's
   name is the detector's own name in that shape, built by the page) */
const STYLES = [(m) => `[${m}]`, (m) => `<${m}>`, (m) => '█'.repeat(Math.max(4, Math.round(m.length / 2)))];

/* Beyond: paste your own, with the dials. Runs in this page; nothing you type is sent. Every label is Hanzo's: the
   detectors by their names in the second fact, the field as "request" to "model", the reset as the site's "Reset". */
const SAMPLE = '4111 1111 1111 1111\njane@example.com\n192.0.2.1';
function Yours() {
  const [text, setText] = useState(SAMPLE);
  const [on, setOn] = useState(() => Object.fromEntries(KINDS.map((k) => [k, true])));
  const [sty, setSty] = useState(0);
  const { parts, found, inject } = useMemo(() => redact(text), [text]);
  const shown = parts.map(([t, m]) => (m && on[m] ? [t, m] : [t, null]));
  const kinds = Object.entries(found).filter(([m]) => on[m]);
  return (
    <section className="v2-sec gd-yours" aria-labelledby="gd-ft1">
      <div className="v2-wrap">
        <div className="gd-ed v2-obj">
          <div className="gd-ed-in">
            <label className="gd-ed-k" htmlFor="gd-in">request <Arrow /> model</label>
            <textarea id="gd-in" suppressHydrationWarning value={text} onChange={(e) => setText(e.target.value)} rows={3} maxLength={4000} spellCheck={false} />
          </div>
          <div className="gd-ed-dials">
            <div className="gd-chips" role="group" aria-label="each detector">
              {KINDS.map((k) => (
                <button key={k} type="button" aria-pressed={on[k]} onClick={() => setOn((o) => ({ ...o, [k]: !o[k] }))}>{NAME[k]}</button>
              ))}
            </div>
            <div className="gd-seg" role="radiogroup" aria-label="marker text">
              {STYLES.map((f, i) => (
                <button key={i} type="button" role="radio" data-sound="tick" aria-checked={sty === i} onClick={() => setSty(i)}>{f(NAME.CARD)}</button>
              ))}
            </div>
          </div>
          <div className="gd-ed-out">
            <p className="gd-ed-k" aria-hidden="true"><Arrow /> model</p>
            <p className="gd-out">{shown.map(([t, m], i) => (m ? <span key={i} className="gd-mk">{STYLES[sty](NAME[m])}</span> : <span key={i}>{t}</span>))}</p>
            <p className="gd-ed-f" aria-live="polite">
              {kinds.map(([m, c]) => <span key={m}><b>{c}</b> {NAME[m]}</span>)}
              {inject && <span className="gd-ed-inj">Overriding the instructions</span>}
              {text !== SAMPLE && <button type="button" className="gd-ed-x" onClick={() => setText(SAMPLE)}>Reset</button>}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

const pad = (n) => String(n).padStart(2, '0');

/* Guard's own pinned stage: the detector board on top, a numbered rail beside the section title (hover a number to
   read its fact's title), and the fact under the board. Desktop pins; phones stack each fact over its own board. */
function Passes() {
  const ref = useRef(null);
  const n = FACTS.length;
  const [at, setAt] = useState(0);
  const [peek, setPeek] = useState(null);
  const [open, setOpen] = useState({});
  // phones: a panel plays its arrival once its card is mostly on screen in the sideways rail
  useEffect(() => {
    const els = ref.current ? [...ref.current.querySelectorAll('.gd-f-vis')] : [];
    if (!els.length || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && e.target.classList.add('on')), { threshold: 0.6 });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  useMotionValueEvent(scrollYProgress, 'change', (p) => setAt(Math.max(0, Math.min(n - 1, Math.floor(p * n * 0.9999)))));
  const go = (i) => {
    const el = ref.current;
    if (!el) return;
    if (innerWidth <= 900) { document.getElementById('gd-f' + i)?.scrollIntoView({ behavior: 'smooth', block: 'start' }); return; }
    const y = el.getBoundingClientRect().top + scrollY + ((i + 0.5) / n) * (el.offsetHeight - innerHeight);
    window.__lenis ? window.__lenis.scrollTo(y, { duration: 1.1 }) : scrollTo({ top: y, behavior: 'smooth' });
  };
  return (
    <section ref={ref} className="gd-ps" style={{ '--n': n }} aria-labelledby="gd-ps-h">
      <div className="gd-ps-stage">
        <div className="v2-wrap gd-ps-in">
          <div className="gd-ps-top">
            <h2 id="gd-ps-h" className="v2-headline gd-ps-h">What it looks for</h2>
            <nav className="gd-rail" aria-label="What it looks for" onPointerLeave={() => setPeek(null)}>
              {FACTS.map(([t], i) => (
                <button key={t} type="button" aria-label={t} aria-current={i === at ? 'step' : undefined} data-past={i < at || undefined} onClick={() => go(i)} onPointerEnter={(e) => e.pointerType === 'mouse' && setPeek(i)} onFocus={() => setPeek(i)} onBlur={() => setPeek(null)}>
                  <span className="x-mono">{pad(i + 1)}</span><i />
                </button>
              ))}
              <span className="gd-rail-peek" aria-hidden="true">{peek !== null && peek !== at ? FACTS[peek][0] : ''}</span>
            </nav>
          </div>
          <div className="gd-ps-board"><Board at={at} /></div>
          <div className="gd-ps-facts">
            {FACTS.map(([t, d], i) => (
              <article key={t} id={'gd-f' + i} className="gd-f" data-on={i === at || undefined} data-past={i < at || undefined}>
                <div className="gd-f-h">
                  <h3 className="gd-f-t" id={'gd-ft' + i}><span>{t}</span></h3>
                  <p className="gd-f-n x-mono">{pad(i + 1)} / {pad(n)}</p>
                </div>
                <p className="v2-body gd-f-d" id={'gd-fd' + i} data-open={open[i] || undefined}>{d}</p>
                {!open[i] && <button type="button" className="gd-f-more" aria-expanded="false" aria-controls={'gd-fd' + i} onClick={() => setOpen((o) => ({ ...o, [i]: true }))}>Read more</button>}
                <div className="gd-f-vis"><Board at={i} still /></div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* the hero composer: true size from the first paint; a 2.5° tilt under a fine pointer, and it settles a little
   smaller only as the hero scrolls away (start big, shrink as things happen) */
function HeroObject({ children }) {
  const ref = useRef(null);
  const calm = useReducedMotion();
  // the server cannot know the visitor's motion setting: render the same style on the server and the first client
  // pass, and only drop the scroll scale once mounted (so reduced-motion loads hydrate without a mismatch)
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const [tilt, setTilt] = useState(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.35', 'end start'] });
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.94]);
  const move = (e) => {
    if (calm || e.pointerType !== 'mouse') return;
    const r = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5, py = (e.clientY - r.top) / r.height - 0.5;
    setTilt({ rx: (-py * 5).toFixed(2), ry: (px * 5).toFixed(2) });
  };
  return (
    <div ref={ref} className="v2-wrap gd-lift" onPointerMove={move} onPointerLeave={() => setTilt(null)}>
      <motion.div style={mounted && calm ? undefined : { scale, transformOrigin: '50% 0%' }}>
        <div className="gd-tilt" style={tilt ? { transform: `perspective(1400px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)` } : undefined}>{children}</div>
      </motion.div>
    </div>
  );
}

export default function Guard() {
  // the kit marks a cross-origin hand-off busy for 2.5 s; Guard's pressed state is short (300 ms) and clears on return
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    if (!busy) return;
    const t = setTimeout(() => setBusy(false), 300);
    const back = () => setBusy(false);
    addEventListener('pageshow', back); document.addEventListener('visibilitychange', back);
    return () => { clearTimeout(t); removeEventListener('pageshow', back); document.removeEventListener('visibilitychange', back); };
  }, [busy]);
  return (
    <main className="v2 gd">
      <section className="gd-hero v2-dark" data-room="dark">
        <div className="v2-wrap gd-hero-t">
          <Lines as="h1" className="v2-display gd-h1" lines={['Guard']} data-morph-target="" />
          <p className="v2-lede gd-sub"><span className="v2-line"><span className="v2-cut" style={{ animationDelay: '.14s' }}>It reads what goes into a model, and what comes back</span></span></p>
          <div className="v2-acts gd-acts"><Cta to="https://github.com/hanzoai" id="guard.hero" thumb className="gd-ask" aria-busy={busy || undefined} onClick={() => setBusy(true)}>View on GitHub</Cta></div>
        </div>
        <HeroObject>
          <Composer />
        </HeroObject>
      </section>

      <Passes />

      <ShipPrompt name="Guard" prompt="Read https://hanzo.ai/skill.md and use Hanzo Guard in my project." flip className="gd-sp" />

      <Yours />

      <GetIt name="Guard" tag="AI guardrails" seed="guard" data={[6, 6]} lead="Get started with Guard" ask={['View on GitHub', 'https://github.com/hanzoai', 'guard.close']} className="gd-gi" />
    </main>
  );
}
