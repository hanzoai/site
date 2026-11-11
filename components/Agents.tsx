'use client';
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useInView, useMotionValue, useReducedMotion, useSpring, useTransform } from 'motion/react';
import { EASE, Head, Arrow, Copy, Mark, fine } from './ui';
import C from '../content';
import { SCRIPT } from '../lib/script';
import SetupMenu from './SetupMenu';
import McpPicker from './McpPicker';
import { capture, track } from '../lib/track';

/* Every agent Hanzo works with, as a field that swells toward the pointer, like a dock. */
function Ico({ a, mx, my, i }) {
  const ref = useRef(null);
  const d = useTransform(() => {
    const x = mx.get(), y = my.get(), el = ref.current;
    if (x === Infinity || !el) return 999;
    const r = el.getBoundingClientRect();
    return Math.hypot(x - (r.left + r.width / 2), y - (r.top + r.height / 2));
  });
  const scale = useSpring(useTransform(d, [0, 70, 160], [1.65, 1.25, 1]), { stiffness: 320, damping: 22, mass: 0.35 });
  const lift = useSpring(useTransform(d, [0, 160], [-8, 0]), { stiffness: 320, damping: 22, mass: 0.35 });
  return (
    <motion.li initial={{ opacity: 0, y: 20, scale: 0.6 }} whileInView={{ opacity: 1, y: 0, scale: 1 }} viewport={{ once: true }} transition={{ type: 'spring', stiffness: 300, damping: 22, delay: 0.02 * i }}>
      <motion.a ref={ref} href={a.href} className="x-ico" style={{ scale, y: lift }} data-name={a.name} aria-label={a.name}>
        <span dangerouslySetInnerHTML={{ __html: a.icon }} />
      </motion.a>
    </motion.li>
  );
}

function Cmd({ bin, rest, copy, onCopy }) {
  return (
    <div className="x-cmd x-mono">
      <span className="x-dim">$</span>
      <span className="x-cmd-t"><b>{bin}</b> <span>{rest}</span></span>
      <Copy text={copy} onCopy={onCopy} />
    </div>
  );
}

/* Hanzo's own rotation (hanzo.ai home): the agent the CLI accelerates changes every few seconds and its flag types in.
   Every name stays in the page (the others hidden), so readers and search see the whole list. */
const ACCEL = [['Claude Code', 'dev --claude'], ['Codex', 'dev --codex'], ['Cursor', 'dev --cursor'], ['Antigravity', 'dev --agy'], ['Gemini CLI', 'dev --gemini']];
function Accel() {
  const [at, setAt] = useState(0);
  const [n, setN] = useState(ACCEL[0][1].length);
  const box = useRef(null);
  const seen = useInView(box, { amount: 0.5 });
  const calm = useReducedMotion();
  useEffect(() => {
    if (!seen || calm) return;
    let t, i = at, k = ACCEL[at][1].length;
    const next = () => { i = (i + 1) % ACCEL.length; k = 4; setAt(i); setN(k); t = setTimeout(type, 260); };
    const type = () => { k += 1; setN(k); if (k < ACCEL[i][1].length) t = setTimeout(type, 70); else t = setTimeout(next, 2600); };
    t = setTimeout(next, 2600);
    return () => clearTimeout(t);
  }, [seen, calm]); // eslint-disable-line react-hooks/exhaustive-deps
  const [, flag] = ACCEL[at];
  return (
    <div ref={box}>
      <p className="x-panel-k xa-acc">
        {ACCEL.map(([name], i) => <span key={name} className={i === at ? 'on' : ''} aria-hidden={i === at ? undefined : true}>Accelerate {name} with Hanzo</span>)}
      </p>
      <div className="x-cmd x-mono">
        <span className="x-dim">$</span>
        <span className="x-cmd-t"><b>hanzo</b> <span>{flag.slice(0, n)}</span><span className="x-sr" aria-hidden="true">{ACCEL.filter((_, i) => i !== at).map(([, f]) => f).join(' ')}</span></span>
        <Copy text={'hanzo ' + flag} onCopy={() => capture('home_copied', { block: 'tour', command: 'hanzo ' + flag })} />
      </div>
    </div>
  );
}

const STEPS = [
  ['Sign up with a wallet', 'POST hanzo.id/v1/iam/web3/verify'],
  ['Get an API key', 'POST /v1/account/keys'],
  ['Use AI', 'POST /v1/chat/completions'],
  ['Top up in USDC or Card', 'POST /v1/billing/crypto/deposit · hanzo.ai/pay'],
];

// a few colours for the script, in the page's own words: comments, strings, keywords
const TOK = /(\/\/.*|`[^`]*`|'[^']*'|\b(?:const|await|new)\b)/;
function Code({ text }) {
  return text.split('\n').map((ln, i) => (
    <span className="x-code-l" key={i} style={{ '--i': i }}>
      {ln.split(TOK).map((t, k) => (k % 2 ? <span key={k} className={t[0] === '/' ? 'c' : /^[`']/.test(t) ? 's' : 'k'}>{t}</span> : t))}
    </span>
  ));
}

function Steps() {
  const ref = useRef(null);
  const seen = useInView(ref, { amount: 0.5 });
  const calm = useReducedMotion();
  const [on, setOn] = useState(0);
  const [mine, setMine] = useState(false);
  const [code, setCode] = useState(false);
  const typed = useRef(null);
  // the active endpoint types itself, straight into its text node; left alone, the agent walks all four steps
  useEffect(() => {
    const full = STEPS[on][1], el = typed.current;
    if (!el) return;
    if (calm) { el.textContent = full; return; }
    let i = 0;
    el.textContent = '';
    const t = setInterval(() => { i++; el.textContent = full.slice(0, i); if (i >= full.length) clearInterval(t); }, 24);
    return () => clearInterval(t);
  }, [on, calm]);
  useEffect(() => {
    if (mine || !seen || calm) return;
    const t = setTimeout(() => setOn((v) => (v + 1) % 4), 3200);
    return () => clearTimeout(t);
  }, [on, mine, seen, calm]);
  const fill = useSpring(0, { stiffness: 120, damping: 20 });
  useEffect(() => { fill.set(on / 3); }, [on, fill]);
  return (
    <div className="x-panel" ref={ref}>
      <div className="x-panel-h"><Mark size={14} /> <b><span>Hanzo.Agents</span></b></div>
      <p className="x-panel-k">No human required</p>
      <ol className="x-steps">
        <i className="x-steps-line" aria-hidden="true"><motion.b style={{ scaleY: fill }} /></i>
        {STEPS.map(([t, e], i) => (
          <li key={t}>
            <button type="button" aria-pressed={on === i} onClick={() => { setMine(true); setOn(i); track('agent_step_opened', { step: i + 1 }); }}>
              {on === i && <motion.span layoutId="step-bg" className="x-step-bg" transition={{ type: 'spring', stiffness: 420, damping: 36 }} />}
              <span className={'x-step-n' + (i <= on ? ' done' : '')}>{i + 1}</span>
              <span className="x-step-t"><b>{t}</b><span className="x-mono">{e}</span></span>
            </button>
          </li>
        ))}
      </ol>
      <div className="x-script x-mono" aria-live="polite">
        <span className="x-dim">step {on + 1}/4 ›</span> <span ref={typed} /><span className="x-caret" aria-hidden="true" />
      </div>
      <button type="button" className="x-code-t" aria-expanded={code} aria-controls="agent-script" onClick={() => { setMine(true); setCode((c) => !c); if (!code) track('agent_script_shown', { step: on + 1 }); }}>
        <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M5.5 4 2 8l3.5 4M10.5 4 14 8l-3.5 4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
        <span className="x-code-lbl">
          <span aria-hidden={code} data-on={!code}>{`Show step ${on + 1} of the script`}</span>
          <span aria-hidden={!code} data-on={code}>{`Hide step ${on + 1} of the script`}</span>
        </span>
      </button>
      {/* every step's script is in the page; the open one types in line by line */}
      <div className="x-code" id="agent-script" data-open={code} inert={!code}>
        <div className="x-code-in">
          {SCRIPT.map((c, i) => (
            <pre className="x-code-blk x-mono" key={i} hidden={on !== i} tabIndex={0} aria-label={`Script for step ${i + 1}`}><code><Code text={c} /></code></pre>
          ))}
        </div>
      </div>
      <div className="x-panel-f">
        <Copy text={SCRIPT[on]} label="Copy this step" onCopy={() => track('agent_step_copied', { step: on + 1 })} />
        <Copy text={SCRIPT.join('\n\n')} label="Copy the whole script" onCopy={() => track('agent_script_copied', { from: 'landing' })} />
      </div>
    </div>
  );
}

export default function Agents() {
  const mx = useMotionValue(Infinity);
  const my = useMotionValue(Infinity);
  return (
    <section className="x-sec x-agents" id="compatible" data-hz-view="compatible" aria-labelledby="compatible-h">
      <div className="x-wrap">
        <Head title="Works with every agent, bot and CLI tool." lede="Claude Code, Codex, Cursor and the rest, every model behind one key. Or let your agent sign itself up." />
        <ul
          className="x-dock"
          data-hz-view="works-with"
          onPointerMove={(e) => { if (fine(e)) { mx.set(e.clientX); my.set(e.clientY); } }}
          onPointerLeave={() => { mx.set(Infinity); my.set(Infinity); }}
        >
          {C.agents.filter((a) => a.name !== 'Hanzo Dev').map((a, i) => <Ico key={a.name} a={a} i={i} mx={mx} my={my} />)}
        </ul>
        <div className="x-panels">
          <div className="x-panel">
            <div className="x-panel-h"><Mark size={14} /> <b>Hanzo.CLI</b></div>
            <p className="x-panel-k">Install the Hanzo CLI</p>
            <Cmd bin="curl" rest="-fsSL https://hanzo.sh | sh" copy="curl -fsSL https://hanzo.sh | sh" onCopy={() => capture('home_copied', { block: 'install' })} />
            <div className="x-or small"><span>or</span></div>
            <Cmd bin="npm" rest="i -g hanzo" copy="npm i -g hanzo" onCopy={() => capture('home_copied', { block: 'install', command: 'npm i -g hanzo' })} />
            <Accel />
            <p className="x-panel-k">Set up Codex, Cursor and more</p>
            <SetupMenu inline where="compatible" />
          </div>
          <div className="x-panel-wrap"><Steps /></div>
        </div>
        <McpPicker />
        <div className="x-row-links">
          <Arrow href="https://docs.hanzo.ai/docs/guides/coding">Integration guides</Arrow>
          <Arrow href="https://docs.hanzo.ai/docs/guides/migrate/coding-agents">Migrate &amp; conventions map</Arrow>
          <Arrow href="https://docs.hanzo.ai/docs/mcp">Hanzo MCP</Arrow>
          <Arrow href="https://github.com/hanzoai">Hanzo OSS</Arrow>
        </div>
      </div>
    </section>
  );
}
