'use client';
/* Operative.
   V2: 8/10 a live desktop worked by four hands as the hero, the container exploding into its six layers as you scroll, one docker run that types itself, four providers with one variable, one dark room for the loop.
   Persona: a developer trying computer use safely. Goal: run the container. CTA: Get Started (operative.hero).
   Signature: the container comes apart. Pinned on screen, the image is a stack of six slabs pressed into one box;
   as you scroll the box explodes upward layer by layer (scrubbed, transform only), and each layer lights with what
   it is (Xvfb · X11, the ports, the objective, bash · edit, the allowlist, API · Bedrock · Vertex) while its words
   come in beside it. The hero object is the desktop inside the container, worked by its four hands in turn
   (screen vision, the model reading, the cursor, the keys). One docker run types itself and the four ports light.
   The one dark room is the loop: plans, acts, looks at the result, goes again, and you can interrupt it.
   Beyond: "Which way in?" Choose the provider and only the one environment variable in the command changes; the
   container, desktop and tools stay identical, as Hanzo says. Accent: tide blue, Hanzo's own art colour.
   Every word, port and command is Hanzo's. */
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useInView, useReducedMotion, useScroll, useTransform, useMotionValueEvent } from 'motion/react';
import { Copy, Mark } from '../ui';
import { A, Go, More } from '../kit';
import A2Lines from '../v2/A2Lines';
import '../v2/A2.css';
import './Operative.css';

const EASE = [0.16, 1, 0.3, 1];
const HANDS = ['Screen Vision', 'Multimodal Models', 'Cursor Control', 'Keyboard Actions'];
const AIM = [[0.2, 0.3], [0.62, 0.24], [0.7, 0.64], [0.34, 0.7]]; // where the cursor goes, as fractions of the screen

function useLive(ref, amount = 0.2) {
  const seen = useInView(ref, { amount });
  const calm = useReducedMotion();
  return [seen && !calm, calm];
}
function useSteps(n, ms, live) {
  const [at, setAt] = useState(0);
  const [mine, setMine] = useState(false);
  useEffect(() => {
    if (!live || mine) return;
    const t = setTimeout(() => setAt((v) => (v + 1) % n), ms);
    return () => clearTimeout(t);
  }, [at, live, mine, n, ms]);
  return [at, (i) => { setAt(i); setMine(true); }];
}

/* The desktop inside the box, worked by one hand at a time. */
function Desk({ at }) {
  const [x, y] = AIM[at];
  return (
    <div className={'xov-desk h' + at} aria-hidden="true">
      <div className="xov-desk-bar"><i /><i /><i /><span className="x-mono">Xvfb :1</span><span className="x-mono xov-desk-r">localhost:6080</span></div>
      <div className="xov-desk-in">
        <img className="xov-wall" src="/models/iro.webp" alt="" />
        <div className="xov-win">
          <div className="xov-win-bar"><i /><i /><i /></div>
          <div className="xov-win-body">
            <div className="xov-win-text"><i /><i /><i /><i /></div>
            <div className="xov-field"><span className="xov-typed" /><b /></div>
            <div className="xov-win-btn">OK</div>
          </div>
        </div>
        <div className="xov-scan" />
        <div className="xov-read"><Mark size={14} /><i /><i /><i /></div>
        <div className="xov-keys">{['Esc', 'Tab', 'Ctrl', '⌘', 'Enter'].map((k, i) => <b key={k} style={{ '--k': i }}>{k}</b>)}</div>
        {/* the layer is the screen's size, so a % translate is a % of the screen: the cursor moves by transform only */}
        <motion.div className="xov-aim-w" animate={{ x: x * 100 + '%', y: y * 100 + '%' }} transition={{ type: 'spring', stiffness: 300, damping: 30 }}>
          <span className="xov-aim"><svg viewBox="0 0 20 20" width="22" height="22"><path d="M3 2l12 7-5.2 1.3L7 16z" fill="#0a0a0a" stroke="#fff" strokeWidth="1.2" strokeLinejoin="round" /></svg><span className="xov-ring" key={at} /></span>
        </motion.div>
      </div>
    </div>
  );
}

function Hero() {
  const ref = useRef(null);
  const [live] = useLive(ref, 0.15);
  const [at, choose] = useSteps(4, 2400, live);
  return (
    <section className="xov-hero" ref={ref} aria-labelledby="xov-h1">
      <div className="a2-wrap a2-grid xov-top">
        <div className="xov-top-l">
          <p className="a2-kick"><b>Computer use, in a container</b></p>
          <A2Lines as="h1" id="xov-h1" className="a2-display xov-h1" lines={['Hanzo', 'Operative']} now />
        </div>
        <div className="xov-top-r">
          <p className="a2-lede">A container with a Linux desktop inside it, and a model driving that desktop by screenshot, mouse and keyboard.</p>
          <div className="a2-acts">
            <a href="#get-started" className="x-btn solid" data-thumb="Get Started" data-cta="operative.hero">Get Started</a>
            <Go to="https://docs.hanzo.ai">View Docs</Go>
          </div>
        </div>
      </div>
      <motion.div className="a2-wrap xov-stage" initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, ease: EASE, delay: 0.25 }}>
        <div className="xov-crate">
          <span className="xov-crate-tag x-mono">ghcr.io/hanzoai/operative:latest</span>
          <Desk at={at} />
        </div>
        <div className="xov-hands">
          <p className="xov-hands-k"><span>The container&apos;s hands</span><span className="x-mono">{String(at + 1).padStart(2, '0')} / 04</span></p>
          <ul>
            {HANDS.map((h, i) => (
              <li key={h}>
                <button type="button" aria-pressed={at === i} className={at === i ? 'on' : ''} onClick={() => choose(i)}>
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

/* What is in the container: six slabs pressed into one box, exploding apart as you scroll. */
const INSIDE = [
  ['A desktop in the image', 'Xvfb and X11 give the container a screen with no monitor attached, so a real window manager and real applications run inside it.', 'Xvfb · X11'],
  ['Watch it work', 'VNC on 5900 for a native client, noVNC on 6080 in a browser, and the control page on 8501. You see the cursor move as it moves.', '5900 · 6080 · 8501'],
  ['Say what you want', 'Type an objective and it plans, acts, looks at the result, and goes again. You can interrupt at any point.', 'objective'],
  ['Bash and a file editor too', 'Not only the screen. It can run a command or edit a file directly when that is the shorter path, instead of typing into a GUI text editor.', 'bash · edit'],
  ['Blast radius is the container', 'Stop it and everything it touched goes with it. Give it the narrowest privileges and an allowlist of domains, and keep credentials that matter out of the image.', 'allowlist'],
  ['Where the model comes from', 'The API directly, AWS Bedrock, or Google Vertex — chosen with an environment variable. The container is the same in all three cases.', 'API · Bedrock · Vertex'],
];

function Inside() {
  const ref = useRef(null);
  const calm = useReducedMotion();
  const [on, setOn] = useState(0);
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const e = useTransform(p, (v) => (calm ? 1 : Math.min(1, Math.max(0, v / 0.14)))); // how far apart the slabs are
  useMotionValueEvent(p, 'change', (v) => setOn(Math.min(5, Math.max(0, Math.floor(((v - 0.1) / 0.9) * 6)))));
  const go = (k) => {
    const el = ref.current;
    const y = el.getBoundingClientRect().top + scrollY + (el.offsetHeight - innerHeight) * (0.1 + (k + 0.5) * 0.15);
    window.__lenis ? window.__lenis.scrollTo(y, { duration: 1.1 }) : scrollTo({ top: y, behavior: 'smooth' });
  };
  return (
    <section className="xov-inside" ref={ref} aria-labelledby="xov-in">
      <div className="xov-inside-stick">
        <div className="a2-wrap a2-grid xov-inside-grid">
          <div className="xov-inside-copy">
            <p className="a2-kick">What is in the container</p>
            <h2 id="xov-in" className="a2-headline">A screen, a way to watch it, and the tools the model drives it with</h2>
            <ol className="xov-list">
              {INSIDE.map(([t, d], i) => (
                <li key={t} className={i === on ? 'on' : ''}>
                  <button type="button" aria-current={i === on ? 'step' : undefined} onClick={() => go(i)}>
                    <span className="x-mono">{String(i + 1).padStart(2, '0')}</span><b>{t}</b>
                  </button>
                  <p>{d}</p>
                </li>
              ))}
            </ol>
            <p className="xov-oss">Open Source on <A to="https://github.com/hanzoai">GitHub</A></p>
          </div>
          <motion.div className="xov-stack" aria-hidden="true" style={{ '--e': e }}>
            {INSIDE.map(([t, , k], i) => (
              <div key={t} className={'xov-slab' + (i === on ? ' on' : '')} style={{ '--i': i }}>
                <span className="x-mono">{k}</span>
              </div>
            ))}
            <div className="xov-base x-mono">ghcr.io/hanzoai/operative:latest</div>
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
          <A2Lines id="xov-run" className="a2-display m xov-run-h" lines={['One docker run']} />
          <p className="a2-lede xov-run-l">Nothing is installed on your machine. The desktop, the tools and the agent are all inside the image</p>
        </div>
        <div className="a2-grid xov-run-grid">
          <div className="xov-term">
            <div className="xov-term-bar"><i /><i /><i /><b>Installation</b><button type="button" className="xov-replay" onClick={() => setGo((g) => g + 1)} aria-label="Replay the install">Replay</button></div>
            <ol className="xov-steps">
              <li><span className="xov-n x-mono">1</span><p>Pull the image</p><code className="x-mono xov-type"><span className="xov-ghost" aria-hidden="true">$ {PULL}</span><span><span className="xov-p">$</span> <span ref={pull}>{PULL}</span></span></code></li>
              <li><span className="xov-n x-mono">2</span><p>Run it with your key and the four ports</p><code className="x-mono xov-type"><span className="xov-ghost" aria-hidden="true">$ {RUN}_</span><span><span className="xov-p">$</span> <span ref={run}>{RUN}</span><i className="xov-caret" /></span></code></li>
              <li><span className="xov-n x-mono">3</span><p>Open localhost:8501 and type an objective</p></li>
            </ol>
            <div className="xov-term-f"><Copy text={PULL + '\n' + RUN} label="Copy Installation Commands" /></div>
          </div>
          <div className="xov-ports" aria-label="The four ports, lit as the container starts">
            <span className="x-mono xov-ports-k">operative</span>
            {PORTS.map(([p, what], i) => (
              <div key={p} className={'xov-port' + (i < lit ? ' on' : '')}><i /><b className="a2-fig">{p}</b>{what && <span>{what}</span>}</div>
            ))}
          </div>
        </div>
        <div className="a2-grid xov-run-more">
          <div className="xov-req">
            <h3 className="a2-title">System Requirements</h3>
            <ul>{REQ.map((r) => <li key={r}><span className="xov-chk" aria-hidden="true">✓</span><span>{r}</span></li>)}</ul>
          </div>
          <div className="xov-usage">
            <h3 className="a2-title">Basic Usage</h3>
            <ul>{USAGE.map(([t, c]) => <li key={t}><p>{t}</p><code className="x-mono">{c}</code></li>)}</ul>
          </div>
        </div>
        <p className="xov-warn">Computer use is beta, and instructions written into a web page or an image can try to talk to the model as if they were you. Limit outbound traffic to domains you name, and ask for a human yes before anything with consequences outside the container.</p>
      </div>
    </section>
  );
}

/* Which way in: the four providers; only the one variable in the command changes. */
const WAYS = [
  { k: 'Hanzo', by: 'The default', rec: true, pts: ['Runs through api.hanzo.ai', 'Every run shows up in the console with its cost', 'Bring a Hanzo key, or one you already have'], set: 'Pick the model in the sidebar', env: '-e HANZO_API_KEY …' },
  { k: 'Direct', by: 'Straight to the model vendor', pts: ['No Hanzo in the request path', 'Your existing key and your existing bill', 'Nothing here to log the run for you'], set: 'Set API_PROVIDER=anthropic', env: '-e API_PROVIDER=anthropic …' },
  { k: 'Bedrock', by: 'Inside your AWS account', pts: ['Reads your local AWS profile', 'Stays in the region you name', 'For when the model must not leave your account'], set: 'Set API_PROVIDER=bedrock', env: '-e API_PROVIDER=bedrock -e AWS_PROFILE …' },
  { k: 'Vertex', by: 'Inside your Google Cloud project', pts: ['Application default credentials', 'Names a region and a project id', 'Same container, same desktop, same tools'], set: 'Set API_PROVIDER=vertex', env: '-e API_PROVIDER=vertex -e VERTEX_PROJECT_ID …' },
];

function Ways() {
  const ref = useRef(null);
  const [live] = useLive(ref, 0.2);
  const [at, choose] = useSteps(4, 3400, live);
  return (
    <section className="a2-sec xov-ways" ref={ref} aria-labelledby="xov-ways">
      <div className="a2-wrap">
        <div className="xov-ways-head">
          <p className="a2-kick">Which way in?</p>
          <A2Lines id="xov-ways" className="a2-display s" lines={['Where the model', 'comes from']} />
          <p className="a2-lede">One environment variable decides. The container, the desktop and the tools are identical in all four cases</p>
        </div>
        <div className="xov-seg" role="radiogroup" aria-label="Provider">
          {WAYS.map((v, i) => (
            <button key={v.k} type="button" role="radio" aria-checked={at === i} onClick={() => choose(i)}>
              {at === i && <motion.span layoutId="xov-seg" className="xov-seg-bg" transition={{ type: 'spring', stiffness: 300, damping: 30 }} />}
              <span>{v.k}</span>
            </button>
          ))}
        </div>
        <div className="xov-cmd x-mono" aria-live="polite">
          <span className="xov-p">$</span> docker run{' '}
          <span className="xov-env">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span key={at} initial={{ y: '100%', opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: '-100%', opacity: 0 }} transition={{ type: 'spring', stiffness: 300, damping: 30 }}>{WAYS[at].env}</motion.span>
            </AnimatePresence>
          </span>{' '}
          <span className="xov-same">ghcr.io/hanzoai/operative:latest</span>
        </div>
        <div className="xov-cards">
          {WAYS.map((v, i) => (
            <div key={v.k} className={'xov-card' + (at === i ? ' on' : '')}>
              <button type="button" className="xov-card-h" aria-pressed={at === i} onClick={() => choose(i)}>
                {v.rec && <span className="xov-rec">Recommended</span>}
                <b>{v.k}</b>
                <span>by {v.by}</span>
              </button>
              <ul>{v.pts.map((p) => <li key={p}>{p}</li>)}</ul>
              <p className="xov-card-set">{v.set}</p>
              <code className="x-mono">docker run {v.env}</code>
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
  useEffect(() => {
    if (!live || held) return;
    const t = setInterval(() => setK((v) => (v + 1) % 4), 1500);
    return () => clearInterval(t);
  }, [live, held]);
  return (
    <section className="a2-sec a2-dark xov-act" data-room="dark" ref={ref} aria-labelledby="xov-act">
      <div className="a2-wrap a2-grid">
        <div className="xov-act-copy">
          <h2 id="xov-act" className="a2-headline">See Operative in Action</h2>
          <p className="a2-body">Watch as Hanzo Operative uses multimodal AI to router interfaces, complete tasks, and solve problems autonomously.</p>
          <div className="xov-act-links">
            <button type="button" className="xov-hold" aria-pressed={held} onClick={() => setHeld((h) => !h)}>{held ? 'Resume' : 'Interrupt'}</button>
            <More to="https://docs.hanzo.ai">View more examples →</More>
          </div>
        </div>
        <ol className="xov-loop" aria-label="The loop">
          {LOOP.map((l, i) => <li key={l} className={(i === k ? 'on' : '') + (held ? ' held' : '')}><span className="x-mono">{String(i + 1).padStart(2, '0')}</span>{l}</li>)}
        </ol>
        <div className="xov-browser" aria-hidden="true">
          <div className="xov-browser-bar"><i /><i /><i /><span className="x-mono">localhost:6080</span><em>Demo Video</em></div>
          <div className={'xov-screen s' + k + (held ? ' held' : '')}>
            <img src="/models/iro.webp" alt="" />
            <div className="xov-shot" />
            <motion.div className="xov-aim-w" animate={{ x: AIM[k][0] * 100 + '%', y: AIM[k][1] * 100 + '%' }} transition={{ type: 'spring', stiffness: 300, damping: 30 }}>
              <span className="xov-aim"><svg viewBox="0 0 20 20" width="24" height="24"><path d="M3 2l12 7-5.2 1.3L7 16z" fill="#fff" stroke="#0a0a0a" strokeWidth="1.2" strokeLinejoin="round" /></svg></span>
            </motion.div>
            {held && <span className="xov-paused x-mono">interrupted</span>}
          </div>
        </div>
      </div>
    </section>
  );
}

const SOCIAL = [['Star on GitHub', 'https://github.com/hanzoai'], ['Join Discord Community', 'https://discord.gg/XthHQQj'], ['Read the Blog', 'https://hanzo.blog/blog/2025-04-20-hanzo-operative-launch/'], ['Follow Updates', 'https://twitter.com/hanzoai'], ['Contribute', 'https://github.com/hanzoai']];

function Watch() {
  return (
    <section className="a2-sec xov-watch" aria-labelledby="xov-watch">
      <div className="a2-wrap a2-grid">
        <div className="xov-watch-copy">
          <A2Lines id="xov-watch" className="a2-display s" lines={['Run it', 'and watch']} />
          <p className="a2-lede">The most useful hour you can spend with computer use is the first one, watching where it gets stuck.</p>
        </div>
        <ul className="xov-social">{SOCIAL.map(([t, to]) => <li key={t}><A to={to} className="xov-soc"><span>{t}</span><i aria-hidden="true">↗</i></A></li>)}</ul>
      </div>
      <div className="a2-wrap a2-grid xov-end">
        <div className="xov-read-b">
          <h2 className="a2-title">Read before you run it</h2>
          <div className="a2-acts"><Go to="https://docs.hanzo.ai">Read the docs</Go><Go to="https://github.com/hanzoai">View on GitHub</Go></div>
        </div>
        <div className="xov-get">
          <h2>Get Operative</h2>
          <p>Computer-use harness</p>
          <p className="xov-get-meta x-mono"><span><span>License:</span> Apache-2.0</span><A to="https://github.com/hanzoai">hanzoai</A></p>
          <p className="xov-get-cmd x-mono" aria-hidden="true">{PULL}</p>
          <A to="https://platform.hanzo.ai/deploy" className="x-btn solid" data-cta="operative.close">Deploy to Cloud</A>
        </div>
      </div>
    </section>
  );
}

export default function Operative() {
  return (
    <main className="a2 xov">
      <Hero />
      <Inside />
      <Run />
      <Ways />
      <Action />
      <Watch />
    </main>
  );
}
