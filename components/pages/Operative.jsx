'use client';
// Persona: a developer trying computer use safely.
// Goal: run the container.
// CTA: Get Started (operative.hero, to the docker run on this page); the close is Deploy to Cloud in the Band.
// Metric: cta_click operative.hero
// Signature: the container comes apart: six slabs pressed into one box explode upward, then each layer lifts out and opens as you scroll.
// Beyond: pick the provider and only the one environment variable in the command changes; the container stays the same.
/* Operative.
   V2: 8/10 round 2: the pinned stack now works the whole scroll (it explodes, then each of the six layers lifts out flat and opens to show what it is while the gap travels up the stack), the chapter text sits in one fixed slot (no accordion shift), the four provider boxes became one panel behind the gliding tabs, requirements and usage fold under the terminal, Get Operative is the closed container again, every hover answers (hand ghost on the desktop, slab lift, env preview, port light), hero reads name first with a 2.5° pointer tilt, deck greys only.
   Signature: the container comes apart. Pinned on screen, the image is a stack of six slabs pressed into one box;
   as you scroll the box explodes upward, then layer by layer the active slab lifts out, turns flat to face you and
   opens to show what it is (a screen, the ports, the objective field, a prompt, the allowlist, the three providers),
   while the slabs around it part to make room (scrubbed, transform only). The hero object is the desktop inside the
   container, worked by its four hands in turn. One docker run types itself and the four ports light. The one dark
   room is the loop: plans, acts, looks at the result, goes again, and you can stop it. Get Operative closes the box.
   Beyond: choose the provider and only the one environment variable in the command changes; the container, desktop
   and tools stay identical, as Hanzo says. Every word, port and command is Hanzo's. */
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, animate, useInView, useMotionValue, useReducedMotion, useScroll, useTransform, useMotionValueEvent } from 'motion/react';
import { Copy, Mark } from '../ui';
import { A, Cta, Band, Img } from '../kit';
import A2Lines from '../v2/A2Lines';
import A2Pause from '../v2/A2Pause';
import A2Room from '../v2/A2Room';
import A2Grow from '../v2/A2Grow';
import { T, EMPH, MOVE } from '../v2/A2Motion';
import '../v2/A2.css';
import './Operative.css';

const HANDS = ['Screen Vision', 'Multimodal Models', 'Cursor Control', 'Keyboard Actions'];
const AIM = [[0.2, 0.3], [0.62, 0.24], [0.7, 0.64], [0.34, 0.7]]; // where the cursor goes, as fractions of the screen
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));

function useLive(ref, amount = 0.2) {
  const seen = useInView(ref, { amount });
  const calm = useReducedMotion();
  return [seen && !calm, calm];
}
function useSmall() { // under 900px the pinned scene stacks and steps by tap
  const [small, setSmall] = useState(false);
  useEffect(() => {
    const m = matchMedia('(max-width: 899px)');
    const f = () => setSmall(m.matches);
    f();
    m.addEventListener('change', f);
    return () => m.removeEventListener('change', f);
  }, []);
  return small;
}
function useSteps(n, ms, live, paused) {
  const [at, setAt] = useState(0);
  const [mine, setMine] = useState(false);
  const first = useRef(true);
  useEffect(() => {
    if (!live || mine || paused) return;
    const t = setTimeout(() => setAt((v) => (v + 1) % n), first.current ? 700 : ms); // the first move comes within a second
    first.current = false;
    return () => clearTimeout(t);
  }, [at, live, mine, n, ms, paused]);
  return [at, (i) => { setAt(i); setMine(true); }];
}

/* The desktop inside the box, worked by one hand at a time; a hovered hand shows as a ghost. */
function Desk({ at, peek }) {
  const [x, y] = AIM[at];
  const g = AIM[peek ?? at];
  return (
    <div className={'xov-desk h' + at + (peek != null && peek !== at ? ' pk' + peek : '')} aria-hidden="true">
      <div className="xov-desk-bar"><i /><i /><i /><span className="x-mono">Xvfb :1</span><span className="x-mono xov-desk-r">localhost:8501</span></div>
      <div className="xov-desk-in">
        <Img className="xov-wall" src="/models/iro.webp" alt="" w={1200} h={1500} sizes="(max-width: 900px) 100vw, 1152px" priority />
        <div className="xov-win">
          <div className="xov-win-bar"><i /><i /><i /></div>
          <div className="xov-win-body">
            <p className="xov-win-h">Say what you want</p>
            <p className="xov-win-p">Type an objective and it plans, acts, looks at the result, and goes again.</p>
            <div className="xov-field"><span className="xov-typed x-mono">objective</span><b /></div>
            <div className="xov-win-btn">OK</div>
          </div>
        </div>
        <div className="xov-scan" />
        <div className="xov-read"><Mark size={14} /><span>Multimodal Models</span></div>
        <div className="xov-keys">{['Esc', 'Tab', 'Ctrl', '⌘', 'Enter'].map((k, i) => <b key={k} style={{ '--k': i }}>{k}</b>)}</div>
        {/* the layer is the screen's size, so a % translate is a % of the screen: the cursor moves by transform only */}
        <motion.div className={'xov-aim-w xov-ghost-w' + (peek != null && peek !== at ? ' on' : '')} animate={{ x: g[0] * 100 + '%', y: g[1] * 100 + '%' }} transition={{ duration: T.slow, ease: EMPH }}>
          <span className="xov-aim"><svg viewBox="0 0 20 20" width="22" height="22"><path d="M3 2l12 7-5.2 1.3L7 16z" fill="none" stroke="#fff" strokeWidth="1.4" strokeLinejoin="round" /></svg></span>
        </motion.div>
        <motion.div className="xov-aim-w" animate={{ x: x * 100 + '%', y: y * 100 + '%' }} transition={{ duration: T.slower, ease: EMPH }}>
          <span className="xov-aim"><svg viewBox="0 0 20 20" width="22" height="22"><path d="M3 2l12 7-5.2 1.3L7 16z" fill="#0a0a0a" stroke="#fff" strokeWidth="1.2" strokeLinejoin="round" /></svg><span className="xov-ring" key={at} /></span>
        </motion.div>
      </div>
    </div>
  );
}

function Hero() {
  const ref = useRef(null);
  const [live, calm] = useLive(ref, 0.15);
  const [paused, setPaused] = useState(false);
  const [peek, setPeek] = useState(null);
  const [at, choose] = useSteps(4, 2400, live, paused);
  const tilt = (ev) => { // a pointer tilt of 2.5° at most, fine pointers only
    if (calm || ev.pointerType !== 'mouse') return;
    const r = ev.currentTarget.getBoundingClientRect();
    ev.currentTarget.style.setProperty('--ry', ((ev.clientX - r.left) / r.width - 0.5) * 5 + 'deg');
    ev.currentTarget.style.setProperty('--rx', (0.5 - (ev.clientY - r.top) / r.height) * 5 + 'deg');
  };
  const flat = (ev) => { ev.currentTarget.style.setProperty('--rx', '0deg'); ev.currentTarget.style.setProperty('--ry', '0deg'); };
  return (
    <section className="xov-hero" ref={ref} aria-labelledby="xov-h1">
      <div className="a2-wrap a2-grid xov-top">
        <A2Lines as="h1" id="xov-h1" className="a2-display xov-h1" lines={['Hanzo', 'Operative']} now />
        <p className="a2-kick"><b>Computer use, in a container</b></p>
        <A2Lines as="p" className="a2-lede xov-lede" lines={['A container with a Linux desktop inside it, and a model driving that desktop by screenshot, mouse and keyboard.']} now delay={0.18} />
        <div className="a2-acts xov-acts">
          <Cta to="#get-started" id="operative.hero" thumb>Get Started</Cta>
          <Cta to="https://docs.hanzo.ai" kind="quiet">View Docs</Cta>
        </div>
      </div>
      <motion.div className={'a2-wrap xov-stage' + (paused ? ' a2-paused' : '')} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: T.slower, ease: EMPH, delay: 0.15 }}>
        <div className="xov-crate" onPointerMove={tilt} onPointerLeave={flat}>
          <span className="xov-crate-tag x-mono">ghcr.io/hanzoai/operative:latest</span>
          <Desk at={at} peek={peek} />
        </div>
        <div className="xov-hands">
          <A2Pause paused={paused} onChange={setPaused} label="Pause" className="xov-pause" />
          <p className="xov-hands-k"><span>The container&apos;s hands</span><span className="x-mono">{String(at + 1).padStart(2, '0')} / 04</span></p>
          <ul>
            {HANDS.map((h, i) => (
              <li key={h}>
                <button type="button" aria-pressed={at === i} className={at === i ? 'on' : ''} onClick={() => choose(i)}
                  onPointerEnter={(ev) => ev.pointerType === 'mouse' && setPeek(i)} onPointerLeave={() => setPeek(null)} onFocus={() => setPeek(i)} onBlur={() => setPeek(null)}>
                  <span className="x-mono">{String(i + 1).padStart(2, '0')}</span><b>{h}</b><i key={at === i ? 'on' : 'off'} />
                </button>
              </li>
            ))}
          </ul>
        </div>
      </motion.div>
    </section>
  );
}

/* What is in the container: six slabs pressed into one box. The scroll explodes them, then lifts each one out in turn. */
const INSIDE = [
  ['A desktop in the image', 'Xvfb and X11 give the container a screen with no monitor attached, so a real window manager and real applications run inside it.', 'Xvfb · X11'],
  ['Watch it work', 'VNC on 5900 for a native client, noVNC on 6080 in a browser, and the control page on 8501. You see the cursor move as it moves.', '5900 · 6080 · 8501'],
  ['Say what you want', 'Type an objective and it plans, acts, looks at the result, and goes again. You can interrupt at any point.', 'objective'],
  ['Bash and a file editor too', 'Not only the screen. It can run a command or edit a file directly when that is the shorter path, instead of typing into a GUI text editor.', 'bash · edit'],
  ['Blast radius is the container', 'Stop it and everything it touched goes with it. Give it the narrowest privileges and an allowlist of domains, and keep credentials that matter out of the image.', 'allowlist'],
  ['Where the model comes from', 'The API directly, AWS Bedrock, or Google Vertex — chosen with an environment variable. The container is the same in all three cases.', 'API · Bedrock · Vertex'],
];
const P0 = 0.1, P1 = 0.94; // the explode runs to P0, then the six layers share the rest of the scroll

function Slab({ i, k, pos, on, hov }) {
  const f = useTransform(pos, (x) => Math.max(0, 1 - Math.abs(x - i))); // how far this layer has lifted out and opened
  const s = useTransform(pos, (x) => clamp(i - x, -1, 1)); // above the open layer (+1) or below it (-1)
  const bits = k.split(' · ');
  return (
    <motion.div className={'xov-slab' + (on ? ' on' : '') + (hov ? ' hov' : '')} style={{ '--i': i, '--f': f, '--s': s }}>
      <span className={'xov-face xov-face' + i}><i /><i /><i /></span>
      <span className="xov-slab-k x-mono">{bits.map((b, j) => <b key={b} style={{ '--j': j - (bits.length - 1) / 2 }}>{b}</b>)}</span>
    </motion.div>
  );
}

function Inside() {
  const ref = useRef(null);
  const calm = useReducedMotion();
  const small = useSmall();
  const [on, setOn] = useState(0);
  const [hov, setHov] = useState(-1);
  const pos = useMotionValue(0);
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const e = useTransform(p, (v) => (calm ? 1 : clamp(v / P0))); // how far apart the slabs are
  useMotionValueEvent(p, 'change', (v) => {
    if (small) return;
    const x = clamp((v - P0) / (P1 - P0)) * 5;
    pos.set(x);
    setOn(Math.round(x));
  });
  const go = (k) => {
    if (small) { setOn(k); if (calm) pos.set(k); else animate(pos, k, { duration: T.slower, ease: EMPH }); return; }
    const el = ref.current;
    const y = el.getBoundingClientRect().top + scrollY + (el.offsetHeight - innerHeight) * (P0 + (k / 5) * (P1 - P0)) + 2;
    window.__lenis ? window.__lenis.scrollTo(y, { duration: 1.1 }) : scrollTo({ top: y, behavior: calm ? 'auto' : 'smooth' });
  };
  return (
    <section className="xov-inside" ref={ref} aria-labelledby="xov-in">
      <noscript><style>{'.xov-slot{display:block!important}.xov-slot p{opacity:1!important;transform:none!important;margin:0 0 12px!important}.xov-list button{color:var(--ink)!important}'}</style></noscript>
      <div className="xov-inside-stick">
        <div className="a2-wrap a2-grid xov-inside-grid">
          <div className="xov-inside-copy">
            <p className="a2-kick">What is in the container</p>
            <h2 id="xov-in" className="a2-headline">A screen, a way to watch it, and the tools the model drives it with</h2>
            <ol className="xov-list">
              {INSIDE.map(([t], i) => (
                <li key={t} className={i === on ? 'on' : ''}>
                  <button type="button" aria-current={i === on ? 'step' : undefined} aria-describedby={'xov-d' + i} onClick={() => go(i)}
                    onPointerEnter={(ev) => ev.pointerType === 'mouse' && setHov(i)} onPointerLeave={() => setHov(-1)}>
                    <span className="x-mono">{String(i + 1).padStart(2, '0')}</span><b>{t}</b>
                  </button>
                </li>
              ))}
            </ol>
            <div className="xov-slot">
              {INSIDE.map(([t, d], i) => <p key={t} id={'xov-d' + i} className={i === on ? 'on' : ''} aria-hidden={i === on ? undefined : true}>{d}</p>)}
            </div>
            <p className="xov-oss">Open Source on <A to="https://github.com/hanzoai">GitHub</A></p>
          </div>
          <motion.div className="xov-stack" aria-hidden="true" style={{ '--e': e }}>
            {INSIDE.map(([t, , k], i) => <Slab key={t} i={i} k={k} pos={pos} on={i === on} hov={i === hov} />)}
            <div className="xov-base x-mono"><span>ghcr.io/hanzoai/operative:latest</span></div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* One docker run: the two commands type themselves, then the four ports come up one by one. */
const PULL = 'docker pull ghcr.io/hanzoai/operative:latest';
const RUN = 'docker run -e ANTHROPIC_API_KEY -p 8501:8501 -p 6080:6080 -p 5900:5900 -p 8080:8080 -it ghcr.io/hanzoai/operative:latest';
const PORTS = [['8501', 'the control page'], ['6080', 'noVNC, in a browser'], ['5900', 'VNC, for a native client'], ['8080', '']];
const USAGE = [
  ['Watch it in a browser, no VNC client needed', 'open http://localhost:6080'],
  ['Send the model through Bedrock instead', 'docker run -e API_PROVIDER=bedrock -e AWS_PROFILE -e AWS_REGION=us-west-2 …'],
  ['Or through Vertex', 'docker run -e API_PROVIDER=vertex -e VERTEX_REGION -e VERTEX_PROJECT_ID …'],
  ['Keep the session between runs', 'docker run -v $HOME/.anthropic:/home/operative/.anthropic …'],
];
const REQ = ['Docker. Nothing else installed on the host', 'A key for the API, Bedrock, or Vertex', 'Four ports free: 8501, 6080, 5900, 8080', 'Give the container the fewest privileges that work'];

function Run() {
  const ref = useRef(null);
  const [live, calm] = useLive(ref, 0.35);
  const pull = useRef(null), run = useRef(null);
  const [lit, setLit] = useState(4);
  const [go, setGo] = useState(0);
  const done = useRef(-1);
  useEffect(() => { // typing writes to text nodes, not React state
    if (!live || calm || done.current === go) return;
    let i = 0, t = 0;
    const all = PULL.length + RUN.length;
    setLit(0);
    const draw = () => { if (!pull.current) return; pull.current.textContent = PULL.slice(0, i); run.current.textContent = i > PULL.length ? RUN.slice(0, i - PULL.length) : ''; };
    const typing = () => {
      const was = i;
      i = Math.min(all, i + 2);
      draw();
      if (i < all) t = setTimeout(typing, was < PULL.length && i >= PULL.length ? 500 : 18);
      else { let k = 0; const next = () => { k += 1; setLit(k); if (k < 4) t = setTimeout(next, 420); else done.current = go; }; t = setTimeout(next, 300); }
    };
    draw();
    t = setTimeout(typing, 400);
    return () => { clearTimeout(t); setLit(4); if (pull.current) { pull.current.textContent = PULL; run.current.textContent = RUN; } };
  }, [live, calm, go]);
  return (
    <section className="a2-sec xov-run" id="get-started" ref={ref} aria-labelledby="xov-run">
      <div className="a2-wrap">
        <div className="a2-grid xov-run-head">
          <A2Lines id="xov-run" className="a2-headline xov-run-h" lines={['One docker run']} />
          <p className="a2-lede xov-run-l">Nothing is installed on your machine. The desktop, the tools and the agent are all inside the image</p>
        </div>
        <div className="a2-grid xov-run-grid">
          <div className="xov-term">
            <div className="xov-term-bar"><i /><i /><i /><b>Installation</b><button type="button" className="xov-replay" onClick={() => setGo((g) => g + 1)}>Replay</button></div>
            <ol className="xov-steps">
              <li><span className="xov-n x-mono">1</span><p id="xov-s1">Pull the image</p><div className="xov-scroll" tabIndex={0} role="region" aria-labelledby="xov-s1"><code className="x-mono xov-type"><span className="xov-ghost" aria-hidden="true">$ {PULL}</span><span><span className="xov-p">$</span> <span ref={pull}>{PULL}</span></span></code></div></li>
              <li><span className="xov-n x-mono">2</span><p id="xov-s2">Run it with your key and the four ports</p><div className="xov-scroll" tabIndex={0} role="region" aria-labelledby="xov-s2"><code className="x-mono xov-type"><span className="xov-ghost" aria-hidden="true">$ {RUN}_</span><span><span className="xov-p">$</span> <span ref={run}>{RUN}</span><i className="xov-caret" /></span></code></div></li>
              <li><span className="xov-n x-mono">3</span><p>Open localhost:8501 and type an objective</p></li>
            </ol>
            <div className="xov-term-f"><Copy text={PULL + '\n' + RUN} label="Copy Installation Commands" /></div>
          </div>
          <div className="xov-ports" aria-label="The four ports, lit as the container starts">
            <span className="x-mono xov-ports-k">operative</span>
            {PORTS.map(([p, what], i) => (
              <div key={p} className={'xov-port' + (i < lit ? ' on' : '')}>
                <b className="a2-fig">{p}</b>
                <span className="xov-port-w">{what && <span>{what}</span>}<code className="x-mono" aria-hidden="true">-p {p}:{p}</code></span>
                <i aria-hidden="true" />
              </div>
            ))}
          </div>
          <div className="xov-more-w">
            <details className="xov-dis">
              <summary><h3 className="a2-title">System Requirements</h3><i aria-hidden="true" /></summary>
              <ul className="xov-req">{REQ.map((r) => <li key={r}><span className="xov-chk" aria-hidden="true">✓</span><span>{r}</span></li>)}</ul>
            </details>
            <details className="xov-dis">
              <summary><h3 className="a2-title">Basic Usage</h3><i aria-hidden="true" /></summary>
              <ul className="xov-usage">{USAGE.map(([t, c], i) => <li key={t}><p id={'xov-u' + i}>{t}</p><div className="xov-scroll" tabIndex={0} role="region" aria-labelledby={'xov-u' + i}><code className="x-mono">{c}</code></div></li>)}</ul>
            </details>
          </div>
        </div>
        <p className="xov-warn">Computer use is beta, and instructions written into a web page or an image can try to talk to the model as if they were you. Limit outbound traffic to domains you name, and ask for a human yes before anything with consequences outside the container.</p>
      </div>
    </section>
  );
}

/* Which way in: the four providers as tabs over one panel; only the one variable in the command changes. */
const WAYS = [
  { k: 'Hanzo', by: 'The default', rec: true, pts: ['Runs through api.hanzo.ai', 'Every run shows up in the console with its cost', 'Bring a Hanzo key, or one you already have'], set: 'Pick the model in the sidebar', env: '-e HANZO_API_KEY …' },
  { k: 'Direct', by: 'Straight to the model vendor', pts: ['No Hanzo in the request path', 'Your existing key and your existing bill', 'Nothing here to log the run for you'], set: 'Set API_PROVIDER=anthropic', env: '-e API_PROVIDER=anthropic …' },
  { k: 'Bedrock', by: 'Inside your AWS account', pts: ['Reads your local AWS profile', 'Stays in the region you name', 'For when the model must not leave your account'], set: 'Set API_PROVIDER=bedrock', env: '-e API_PROVIDER=bedrock -e AWS_PROFILE …' },
  { k: 'Vertex', by: 'Inside your Google Cloud project', pts: ['Application default credentials', 'Names a region and a project id', 'Same container, same desktop, same tools'], set: 'Set API_PROVIDER=vertex', env: '-e API_PROVIDER=vertex -e VERTEX_PROJECT_ID …' },
];

function Ways() {
  const [at, choose] = useState(0); // changes only when you choose
  const [peek, setPeek] = useState(null); // a hovered provider previews its variable in the command
  const tabs = useRef([]);
  const show = peek ?? at;
  const key = (ev, i) => { // APG tabs: arrows, Home and End move and select
    const n = WAYS.length;
    const to = { ArrowRight: (i + 1) % n, ArrowLeft: (i + n - 1) % n, Home: 0, End: n - 1 }[ev.key];
    if (to == null) return;
    ev.preventDefault();
    choose(to);
    tabs.current[to]?.focus();
  };
  return (
    <section className="a2-sec xov-ways" aria-labelledby="xov-ways">
      <div className="a2-wrap">
        <div className="a2-grid xov-ways-head">
          <A2Lines id="xov-ways" className="a2-headline xov-ways-h" lines={['Where the model comes from']} />
          <p className="a2-lede xov-ways-l">One environment variable decides. The container, the desktop and the tools are identical in all four cases</p>
        </div>
        <div className="xov-seg" role="tablist" aria-labelledby="xov-ways">
          {WAYS.map((v, i) => (
            <button key={v.k} ref={(el) => { tabs.current[i] = el; }} type="button" role="tab" id={'xov-tab-' + i} aria-selected={at === i} aria-controls={'xov-way-' + i} tabIndex={at === i ? 0 : -1}
              onClick={() => choose(i)} onKeyDown={(ev) => key(ev, i)} onPointerEnter={(ev) => ev.pointerType === 'mouse' && setPeek(i)} onPointerLeave={() => setPeek(null)}>
              {at === i && <motion.span layoutId="xov-seg" className="xov-seg-bg" transition={MOVE} />}
              <span>{v.k}</span>
            </button>
          ))}
        </div>
        <div className={'xov-cmd x-mono' + (show !== at ? ' peek' : '')} tabIndex={0} role="region" aria-labelledby="xov-ways">
          <span className="xov-p">$</span> docker run{' '}
          <span className="xov-env">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span key={show} initial={{ y: '100%', opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: '-100%', opacity: 0 }} transition={MOVE}>{WAYS[show].env}</motion.span>
            </AnimatePresence>
          </span>{' '}
          <span className="xov-same">ghcr.io/hanzoai/operative:latest</span>
        </div>
        <div className="xov-panels">
          {WAYS.map((v, i) => (
            <div key={v.k} id={'xov-way-' + i} role="tabpanel" aria-labelledby={'xov-tab-' + i} tabIndex={0} hidden={at !== i} className="xov-way">
              <div className="xov-way-id">
                <p className="xov-way-k">{v.k}{v.rec && <span className="xov-rec">Recommended</span>}</p>
                <p className="xov-way-by">by {v.by}</p>
              </div>
              <ol className="xov-way-pts">{v.pts.map((p, j) => <li key={p} style={{ '--j': j }}><span className="x-mono" aria-hidden="true">{String(j + 1).padStart(2, '0')}</span>{p}</li>)}</ol>
              <div className="xov-way-set">
                <p>{v.set}</p>
                <code className="x-mono">docker run {v.env}</code>
              </div>
            </div>
          ))}
        </div>
        <p className="xov-note">Which model a provider offers changes; the container does not. The <A to="https://docs.hanzo.ai">documentation</A> lists what each one currently accepts.</p>
      </div>
    </section>
  );
}

/* The one dark room: the loop as huge type, and a hand to stop it. */
const LOOP = ['plans', 'acts', 'looks at the result', 'goes again'];

function Action() {
  const ref = useRef(null);
  const [live] = useLive(ref, 0.3);
  const [held, setHeld] = useState(false);
  const [k, setK] = useState(0);
  useEffect(() => { // a chain of timeouts (no setInterval); the pause control stops it
    if (!live || held) return;
    const t = setTimeout(() => setK((v) => (v + 1) % 4), 1500);
    return () => clearTimeout(t);
  }, [k, live, held]);
  return (
    <A2Room className="a2-sec xov-act" aria-labelledby="xov-act">
      <div className="a2-wrap a2-grid" ref={ref}>
        <div className="xov-act-copy">
          <h2 id="xov-act" className="a2-headline">See Operative in Action</h2>
          <p className="a2-body">Watch as Hanzo Operative uses multimodal AI to router interfaces, complete tasks, and solve problems autonomously.</p>
          <div className="xov-act-links">
            <A2Pause paused={held} onChange={setHeld} label="Pause" />
            <A to="https://docs.hanzo.ai" className="xov-more">View more examples <i aria-hidden="true">→</i></A>
          </div>
        </div>
        <div className="xov-loop-w">
          <A2Grow to={1.3}>
            <ol className="xov-loop" aria-label="The loop">
              {LOOP.map((l, i) => <li key={l} className={(i === k ? 'on' : '') + (held ? ' held' : '')}><span className="x-mono">{String(i + 1).padStart(2, '0')}</span>{l}</li>)}
            </ol>
          </A2Grow>
        </div>
        <div className="xov-browser" aria-hidden="true">
          <div className="xov-browser-bar"><i /><i /><i /><span className="x-mono">localhost:6080</span><em>Demo Video</em></div>
          <div className={'xov-screen s' + k + (held ? ' held' : '')}>
            <Img src="/models/iro.webp" alt="" w={1200} h={1500} sizes="(max-width: 900px) 100vw, 480px" />
            <div className="xov-shot" />
            <motion.div className="xov-aim-w" animate={{ x: AIM[k][0] * 100 + '%', y: AIM[k][1] * 100 + '%' }} transition={{ duration: T.slower, ease: EMPH }}>
              <span className="xov-aim"><svg viewBox="0 0 20 20" width="24" height="24"><path d="M3 2l12 7-5.2 1.3L7 16z" fill="#fff" stroke="#0a0a0a" strokeWidth="1.2" strokeLinejoin="round" /></svg></span>
            </motion.div>
          </div>
        </div>
      </div>
    </A2Room>
  );
}

const SOCIAL = [['Star on GitHub', 'https://github.com/hanzoai'], ['Join Discord Community', 'https://discord.gg/XthHQQj'], ['Read the Blog', 'https://hanzo.blog/blog/2025-04-20-hanzo-operative-launch/'], ['Follow Updates', 'https://twitter.com/hanzoai'], ['Contribute', 'https://github.com/hanzoai']];

/* Read before you run it, and the box closed again: the six layers press back into one image. */
function Watch() {
  const box = useRef(null);
  const shut = useInView(box, { once: true, amount: 0.5 });
  return (
    <section className="a2-sec xov-watch" aria-labelledby="xov-read-h">
      <div className="a2-wrap a2-grid">
        <div className="xov-read-b">
          <h2 id="xov-read-h" className="a2-headline">Read before you run it</h2>
          <div className="a2-acts"><Cta to="https://docs.hanzo.ai" kind="quiet">Read the docs</Cta><Cta to="https://github.com/hanzoai" kind="link">View on GitHub</Cta></div>
          <ul className="xov-social">{SOCIAL.map(([t, to]) => <li key={t}><A to={to} className="xov-soc"><span>{t}</span><i aria-hidden="true">↗</i></A></li>)}</ul>
        </div>
        <div className={'xov-get' + (shut ? ' shut' : '')} ref={box}>
          <div className="xov-get-t">
            <h2 className="a2-headline">Get Operative</h2>
            <p>Computer-use harness</p>
            <p className="xov-get-meta x-mono"><span><span>License:</span> Apache-2.0</span><A to="https://github.com/hanzoai">hanzoai</A></p>
          </div>
          <div className="xov-box" aria-hidden="true">
            {INSIDE.map(([t], i) => <i key={t} style={{ '--i': 5 - i }} />)}
            <p className="xov-get-cmd x-mono">docker pull ghcr.io/<wbr />hanzoai/<wbr />operative:latest</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Operative() {
  return (
    <main className="a2 xov" id="main">
      <Hero />
      <Inside />
      <Run />
      <Ways />
      <Action />
      <Watch />
      <Band title="Run it and watch" lede="The most useful hour you can spend with computer use is the first one, watching where it gets stuck." action="Deploy to Cloud" to="https://platform.hanzo.ai/deploy" />
    </main>
  );
}
