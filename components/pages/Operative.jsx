'use client';
/* Operative. Computer use, in a container.
   Signature: the container opens. Its doors swing back on the first screen to show what is inside: a desktop with no
   monitor, worked by the model's four hands in turn (it sees the screen, the model reads it, the cursor moves, the keys
   press). Further down one docker run starts it: the command types itself and the four ports light up one by one.
   Beyond: "Which way in?" Say what matters most to you and the provider that gives it lights up with its one
   environment variable and its command, while the container in the middle stays the same, as Hanzo says it does.
   Every word, port and command is Hanzo's. */
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { EASE, Rise, Copy } from '../ui';
import { A, Go, More } from '../kit';
import Sigil from '../Sigil';
import { Get, useLive, useEvery, useSteps } from './cloud/Frame';
import './Operative.css';

const up = (d) => ({ initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.9, ease: EASE, delay: d } });
const HANDS = ['Screen Vision', 'Multimodal Models', 'Cursor Control', 'Keyboard Actions'];
// where the cursor goes on the little desktop, as fractions of the screen
const AIM = [[0.18, 0.3], [0.62, 0.22], [0.72, 0.66], [0.3, 0.72]];

/* The desktop inside the box, worked by one hand at a time. */
function Desk({ at, beat }) {
  const [x, y] = AIM[at];
  return (
    <div className={'xov-desk h' + at} aria-hidden="true">
      <div className="xov-desk-bar"><i /><i /><i /><span className="x-mono">Xvfb :1</span></div>
      <div className="xov-win">
        <div className="xov-win-bar"><i /><i /><i /></div>
        <img src="/models/iro.webp" alt="" />
        <div className="xov-win-text"><i /><i /><i /></div>
        <div className="xov-win-btn">OK</div>
      </div>
      <div className="xov-scan" />
      <div className="xov-model"><img src="/models/iro.webp" alt="" /><i /><i /><i /></div>
      <div className="xov-keys">{['Esc', 'Tab', 'Ctrl', '⌘', 'Enter'].map((k, i) => <b key={k} style={{ '--k': i }}>{k}</b>)}</div>
      <motion.div className="xov-aim" animate={{ x: x * 100 + '%', y: y * 100 + '%' }} transition={{ type: 'spring', stiffness: 90, damping: 16 }}>
        <svg viewBox="0 0 20 20" width="20" height="20"><path d="M3 2l12 7-5.2 1.3L7 16z" fill="#0a0a0a" stroke="#fff" strokeWidth="1.2" strokeLinejoin="round" /></svg>
        <span className="xov-ring" key={at + '-' + beat} />
      </motion.div>
    </div>
  );
}

function Hero() {
  const [ref, live] = useLive(0.12);
  const [at, choose] = useSteps(4, 2600, live);
  const [beat, setBeat] = useState(0);
  const pick = (i) => { choose(i); setBeat((b) => b + 1); };
  const calm = useReducedMotion();
  const line = (t, d) => <span className="x-line"><motion.span className="x-line-in" initial={{ y: '105%' }} animate={{ y: 0 }} transition={{ duration: 1.1, ease: EASE, delay: d }}>{t}</motion.span></span>;
  return (
    <section className="xov-hero" ref={ref} aria-labelledby="xov-h1">
      <div className="x-wrap xov-hero-grid">
        <div className="xov-hero-copy">
          <motion.p className="x-kick" {...up(0)}>Computer use, in a container</motion.p>
          <h1 id="xov-h1" className="xov-h1">{line('Hanzo', 0.05)}{line('Operative', 0.16)}</h1>
          <motion.p className="xov-lede" {...up(0.35)}>A container with a Linux desktop inside it, and a model driving that desktop by screenshot, mouse and keyboard.</motion.p>
          <motion.div className="xov-acts" {...up(0.48)}>
            <motion.a href="#get-started" className="x-btn solid" data-thumb="Get Started" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>Get Started</motion.a>
            <Go to="https://docs.hanzo.ai">View Docs</Go>
          </motion.div>
        </div>
        <div className="xov-box">
          <div className="xov-in">
            <Desk at={at} beat={beat} />
          </div>
          {/* the doors swing back once; nothing keeps moving inside a 3D layer */}
          <motion.div className="xov-door l" initial={calm ? false : { rotateY: 0 }} animate={{ rotateY: -104 }} transition={{ duration: 1.5, ease: [0.76, 0, 0.24, 1], delay: 0.5 }} aria-hidden="true" />
          <motion.div className="xov-door r" initial={calm ? false : { rotateY: 0 }} animate={{ rotateY: 104 }} transition={{ duration: 1.5, ease: [0.76, 0, 0.24, 1], delay: 0.5 }} aria-hidden="true" />
          <p className="xov-tagline x-mono" aria-hidden="true">ghcr.io/hanzoai/operative:latest</p>
        </div>
        <div className="xov-hands">
          <p className="xov-hands-k"><span>The container&apos;s hands</span><span className="x-mono">{String(at + 1).padStart(2, '0')} / 04</span></p>
          <ul>
            {HANDS.map((h, i) => (
              <li key={h}>
                <button type="button" aria-pressed={at === i} onClick={() => pick(i)}>
                  {at === i && <motion.span layoutId="xov-hand" className="xov-hand-bg" transition={{ type: 'spring', stiffness: 420, damping: 34 }} />}
                  <span className="x-mono">{String(i + 1).padStart(2, '0')}</span><b>{h}</b>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

const INSIDE = [
  ['A desktop in the image', 'Xvfb and X11 give the container a screen with no monitor attached, so a real window manager and real applications run inside it.', 'Xvfb · X11'],
  ['Watch it work', 'VNC on 5900 for a native client, noVNC on 6080 in a browser, and the control page on 8501. You see the cursor move as it moves.', '5900 · 6080 · 8501'],
  ['Say what you want', 'Type an objective and it plans, acts, looks at the result, and goes again. You can interrupt at any point.', 'objective'],
  ['Bash and a file editor too', 'Not only the screen. It can run a command or edit a file directly when that is the shorter path, instead of typing into a GUI text editor.', 'bash · edit'],
  ['Blast radius is the container', 'Stop it and everything it touched goes with it. Give it the narrowest privileges and an allowlist of domains, and keep credentials that matter out of the image.', 'allowlist'],
  ['Where the model comes from', 'The API directly, AWS Bedrock, or Google Vertex — chosen with an environment variable. The container is the same in all three cases.', 'API · Bedrock · Vertex'],
];

/* The image as a stack of layers: the one you choose lifts out of the stack and says what it is. */
function Inside() {
  const [ref, live] = useLive(0.12);
  const [at, choose] = useSteps(INSIDE.length, 3000, live);
  const [beat, setBeat] = useState(0);
  const pick = (i) => { choose(i); setBeat((b) => b + 1); };
  return (
    <section className="x-sec xov-inside" ref={ref} aria-labelledby="xov-in">
      <div className="x-wrap">
        <header className="xov-head">
          <h2 id="xov-in">What is in the container</h2>
          <p>A screen, a way to watch it, and the tools the model drives it with</p>
        </header>
        <div className="xov-inside-grid">
          <div className="xov-stack" aria-hidden="true">
            {INSIDE.map(([t, , k], i) => (
              <div key={t} className={'xov-slab' + (i === at ? ' on' : '') + (i < at ? ' past' : '')} style={{ '--i': i }}>
                <span className="x-mono">{k}</span><i key={i === at ? beat : 'x'} />
              </div>
            ))}
          </div>
          <ol className="xov-list">
            {INSIDE.map(([t, d], i) => (
              <li key={t} className={i === at ? 'on' : ''}>
                <button type="button" aria-pressed={i === at} onClick={() => pick(i)} onPointerEnter={(e) => e.pointerType === 'mouse' && i !== at && choose(i)}>
                  <span className="x-mono">{String(i + 1).padStart(2, '0')}</span>
                  <span><b>{t}</b><span>{d}</span></span>
                </button>
              </li>
            ))}
          </ol>
        </div>
        <p className="xov-oss">Open Source on <A to="https://github.com/hanzoai">GitHub</A></p>
      </div>
    </section>
  );
}

const PULL = 'docker pull ghcr.io/hanzoai/operative:latest';
const RUN = 'docker run -e ANTHROPIC_API_KEY -p 8501:8501 -p 6080:6080 -p 5900:5900 -p 8080:8080 -it ghcr.io/hanzoai/operative:latest';
const PORTS = [['8501', 'the control page'], ['6080', 'noVNC, in a browser'], ['5900', 'VNC, for a native client'], ['8080', '']];
const USAGE = [
  ['Watch it in a browser, no VNC client needed', 'open http://localhost:6080'],
  ['Send the model through Bedrock instead', 'docker run -e API_PROVIDER=bedrock -e AWS_PROFILE -e AWS_REGION=us-west-2 …'],
  ['Or through Vertex', 'docker run -e API_PROVIDER=vertex -e VERTEX_REGION -e VERTEX_PROJECT_ID …'],
  ['Keep the session between runs', 'docker run -v $HOME/.anthropic:/home/operative/.anthropic …'],
];

/* One docker run: the two commands type themselves into the terminal, then the ports come up one by one. */
function Run() {
  const [ref, live, calm] = useLive(0.35);
  const pull = useRef(null), run = useRef(null);
  const [lit, setLit] = useState(4);
  const [go, setGo] = useState(0);
  const done = useRef(-1); // types once per replay; leaving the screen half-way restores it and types again next time
  useEffect(() => {
    if (!live || calm || done.current === go) return;
    let i = 0, t = 0;
    const all = PULL.length + RUN.length;
    setLit(0);
    const draw = () => {
      if (!pull.current) return;
      pull.current.textContent = PULL.slice(0, i);
      run.current.textContent = i > PULL.length ? RUN.slice(0, i - PULL.length) : '';
    };
    const step = () => {
      const was = i;
      i = Math.min(all, i + 2);
      draw();
      if (i < all) t = setTimeout(step, was < PULL.length && i >= PULL.length ? 500 : 18); // a beat between pull and run
      else { let p = 0; const lightNext = () => { p += 1; setLit(p); if (p < 4) t = setTimeout(lightNext, 420); else done.current = go; }; t = setTimeout(lightNext, 300); }
    };
    draw();
    t = setTimeout(step, 400);
    return () => { clearTimeout(t); setLit(4); if (pull.current) { pull.current.textContent = PULL; run.current.textContent = RUN; } };
  }, [live, calm, go]);
  return (
    <section className="x-sec xov-run" id="get-started" ref={ref} aria-labelledby="xov-run">
      <div className="x-wrap">
        <header className="xov-head">
          <h2 id="xov-run">One docker run</h2>
          <p>Nothing is installed on your machine. The desktop, the tools and the agent are all inside the image</p>
        </header>
        <div className="xov-run-grid">
          <div className="xov-install">
            <div className="xov-install-h">
              <h3>Installation</h3>
              <button type="button" className="xov-replay" onClick={() => setGo((g) => g + 1)} aria-label="Replay the install">Replay</button>
            </div>
            <ol className="xov-steps">
              <li><span className="xov-n">1</span><p>Pull the image</p><code className="x-mono xov-type"><span className="xov-ghost" aria-hidden="true">$ {PULL}</span><span><span className="xov-p">$</span> <span ref={pull}>{PULL}</span></span></code></li>
              <li><span className="xov-n">2</span><p>Run it with your key and the four ports</p><code className="x-mono xov-type"><span className="xov-ghost" aria-hidden="true">$ {RUN}_</span><span><span className="xov-p">$</span> <span ref={run}>{RUN}</span><i className="xov-caret" /></span></code></li>
              <li><span className="xov-n">3</span><p>Open localhost:8501 and type an objective</p></li>
            </ol>
            <Copy text={PULL + '\n' + RUN} label="Copy Installation Commands" />
          </div>
          <Rise className="xov-ports" delay={0.1} aria-label="The four ports, lit as the container starts">
            <div className="xov-crate">
              <span className="x-mono">operative</span>
              {PORTS.map(([p, what], i) => (
                <div key={p} className={'xov-port' + (i < lit ? ' on' : '')}>
                  <i /><b className="x-mono">{p}</b>{what && <span>{what}</span>}
                </div>
              ))}
            </div>
          </Rise>
        </div>
        <div className="xov-run-more">
          <div className="xov-req">
            <h3>System Requirements</h3>
            <ul>
              {['Docker. Nothing else installed on the host', 'A key for the API, Bedrock, or Vertex', 'Four ports free: 8501, 6080, 5900, 8080', 'Give the container the fewest privileges that work'].map((r) => <li key={r}><span className="xov-chk" aria-hidden="true">✓</span><span>{r}</span></li>)}
            </ul>
          </div>
          <div className="xov-usage">
            <h3>Basic Usage</h3>
            <ul>
              {USAGE.map(([t, c]) => <li key={t}><p>{t}</p><code className="x-mono">{c}</code></li>)}
            </ul>
          </div>
        </div>
        <p className="xov-warn">Computer use is beta, and instructions written into a web page or an image can try to talk to the model as if they were you. Limit outbound traffic to domains you name, and ask for a human yes before anything with consequences outside the container.</p>
      </div>
    </section>
  );
}

const WAYS = [
  { k: 'Hanzo', by: 'The default', rec: true, pts: ['Runs through api.hanzo.ai', 'Every run shows up in the console with its cost', 'Bring a Hanzo key, or one you already have'], set: 'Pick the model in the sidebar', cmd: 'docker run -e HANZO_API_KEY …', why: 'Every run shows up in the console with its cost' },
  { k: 'Direct', by: 'Straight to the model vendor', pts: ['No Hanzo in the request path', 'Your existing key and your existing bill', 'Nothing here to log the run for you'], set: 'Set API_PROVIDER=anthropic', cmd: 'docker run -e API_PROVIDER=anthropic …', why: 'Your existing key and your existing bill' },
  { k: 'Bedrock', by: 'Inside your AWS account', pts: ['Reads your local AWS profile', 'Stays in the region you name', 'For when the model must not leave your account'], set: 'Set API_PROVIDER=bedrock', cmd: 'docker run -e API_PROVIDER=bedrock -e AWS_PROFILE …', why: 'For when the model must not leave your account' },
  { k: 'Vertex', by: 'Inside your Google Cloud project', pts: ['Application default credentials', 'Names a region and a project id', 'Same container, same desktop, same tools'], set: 'Set API_PROVIDER=vertex', cmd: 'docker run -e API_PROVIDER=vertex -e VERTEX_PROJECT_ID …', why: 'Inside your Google Cloud project' },
];

/* Which way in: the four providers around one container that never changes. */
function Ways() {
  const [ref, live] = useLive(0.12);
  const [at, choose] = useSteps(4, 3400, live);
  const w = WAYS[at];
  return (
    <section className="x-sec xov-ways" ref={ref} aria-labelledby="xov-ways">
      <div className="x-wrap">
        <header className="xov-head">
          <h2 id="xov-ways">Where the model comes from</h2>
          <p>One environment variable decides. The container, the desktop and the tools are identical in all four cases</p>
        </header>
        <div className="xov-ask">
          <p className="xov-ask-k">Which way in? What matters most</p>
          <div className="xov-ask-row" role="radiogroup" aria-label="What matters most">
            {WAYS.map((v, i) => <button key={v.k} type="button" role="radio" aria-checked={at === i} onClick={() => choose(i)}>{v.why}</button>)}
          </div>
          <div className="xov-ask-out" aria-live="polite">
            <span className="xov-ask-env x-mono"><AnimatePresence mode="popLayout" initial={false}><motion.span key={at} initial={{ y: 18, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -18, opacity: 0 }} transition={{ type: 'spring', stiffness: 380, damping: 30 }}>{w.k} · {w.set}</motion.span></AnimatePresence></span>
            <span className="xov-ask-box" aria-hidden="true"><i /><b className="x-mono">operative</b></span>
          </div>
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
              <code className="x-mono">{v.cmd}</code>
            </div>
          ))}
        </div>
        <p className="xov-note">Which model a provider offers changes; the container does not. The <A to="https://docs.hanzo.ai">documentation</A> lists what each one currently accepts.</p>
      </div>
    </section>
  );
}

const LOOP = ['plans', 'acts', 'looks at the result', 'goes again'];

/* Watching it in a browser: the loop runs until you interrupt it. */
function Action() {
  const [ref, live] = useLive(0.3);
  const [k, setK] = useState(0);
  const [held, setHeld] = useState(false);
  useEvery(1500, live && !held, () => setK((v) => (v + 1) % 8));
  const step = k % 4;
  return (
    <section className="x-sec xov-act" data-room="dark" ref={ref} aria-labelledby="xov-act">
      <div className="x-wrap xov-act-grid">
        <div>
          <h2 id="xov-act">See Operative in Action</h2>
          <p>Watch as Hanzo Operative uses multimodal AI to router interfaces, complete tasks, and solve problems autonomously.</p>
          <div className="xov-loop">
            {LOOP.map((l, i) => <span key={l} className={i === step ? 'on' : ''}>{l}</span>)}
          </div>
          <div className="xov-act-links">
            <button type="button" className="xov-hold" aria-pressed={held} onClick={() => setHeld((h) => !h)}>{held ? 'Resume' : 'Interrupt'}</button>
            <More to="https://docs.hanzo.ai">View more examples →</More>
          </div>
        </div>
        <Rise className="xov-browser" delay={0.1}>
          <div className="xov-browser-bar"><i /><i /><i /><span className="x-mono">localhost:6080</span><em>Demo Video</em></div>
          <div className={'xov-screen s' + step + (held ? ' held' : '')} aria-hidden="true">
            <img src="/models/iro.webp" alt="" />
            <div className="xov-plan">{['Open the browser', 'Find the field', 'Type the objective', 'Check the screen'].map((t, i) => <i key={t} className={i <= (k >> 1) % 4 ? 'done' : ''} />)}</div>
            <div className="xov-shot" />
            <motion.div className="xov-aim big" animate={{ x: AIM[(k >> 1) % 4][0] * 100 + '%', y: AIM[(k >> 1) % 4][1] * 100 + '%' }} transition={{ type: 'spring', stiffness: 70, damping: 15 }}>
              <svg viewBox="0 0 20 20" width="22" height="22"><path d="M3 2l12 7-5.2 1.3L7 16z" fill="#fff" stroke="#0a0a0a" strokeWidth="1.2" strokeLinejoin="round" /></svg>
            </motion.div>
            {held && <span className="xov-paused x-mono">interrupted</span>}
          </div>
        </Rise>
      </div>
    </section>
  );
}

const SOCIAL = [['Star on GitHub', 'https://github.com/hanzoai'], ['Join Discord Community', 'https://discord.gg/XthHQQj'], ['Read the Blog', 'https://hanzo.blog/blog/2025-04-20-hanzo-operative-launch/'], ['Follow Updates', 'https://twitter.com/hanzoai'], ['Contribute', 'https://github.com/hanzoai']];

function Watch() {
  return (
    <section className="x-sec xov-watch">
      {/* the page's own numbers, the four ports, shape this field */}
      <Sigil seed="operative" data={[8501, 6080, 5900, 8080]} className="xov-sigil" />
      <div className="x-wrap xov-watch-grid">
        <div>
          <h2>Run it and watch</h2>
          <p>The most useful hour you can spend with computer use is the first one, watching where it gets stuck.</p>
        </div>
        <ul className="xov-social">
          {SOCIAL.map(([t, to], i) => <li key={t}><A to={to} className="xov-soc"><span>{t}</span><i aria-hidden="true">↗</i></A></li>)}
        </ul>
      </div>
      <div className="x-wrap xov-read">
        <h2>Read before you run it</h2>
        <div className="xov-acts"><Go to="https://docs.hanzo.ai" solid>Read the docs</Go><Go to="https://github.com/hanzoai">View on GitHub</Go></div>
      </div>
    </section>
  );
}

export default function Operative() {
  return (
    <main className="xov">
      <Hero />
      <Inside />
      <Run />
      <Ways />
      <Action />
      <Watch />
      <Get name="Operative" tag="Computer-use harness"><p className="xov-get x-mono" aria-hidden="true">{PULL}<i /></p></Get>
    </main>
  );
}
