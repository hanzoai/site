'use client';
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useInView, useMotionValue, useReducedMotion, useSpring, useTransform } from 'motion/react';
import { EASE, Head, Arrow, Copy, Mark, Rise, fine } from './ui';
import C from '../content';

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
      <motion.a ref={ref} href={a.href} className="x-ico" style={{ scale, y: lift }} data-name={a.name} aria-label={a.name + ' docs'}>
        <span dangerouslySetInnerHTML={{ __html: a.icon }} />
      </motion.a>
    </motion.li>
  );
}

function Cmd({ bin, rest, copy }) {
  return (
    <div className="x-cmd x-mono">
      <span className="x-dim">$</span>
      <span className="x-cmd-t"><b>{bin}</b> {rest}</span>
      <Copy text={copy} />
    </div>
  );
}

const STEPS = [
  ['Sign up with a wallet', 'POST hanzo.id/v1/iam/web3/verify'],
  ['Get an API key', 'POST /v1/account/keys'],
  ['Use AI', 'POST /v1/chat/completions'],
  ['Top up in USDC or Card', 'POST /v1/billing/crypto/deposit · hanzo.ai/pay'],
];

function Steps() {
  const ref = useRef(null);
  const seen = useInView(ref, { amount: 0.5 });
  const calm = useReducedMotion();
  const [on, setOn] = useState(0);
  const [mine, setMine] = useState(false);
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
      <div className="x-panel-h"><Mark size={14} /> <b>Hanzo.Agents</b></div>
      <p className="x-panel-k">No human required</p>
      <ol className="x-steps">
        <i className="x-steps-line" aria-hidden="true"><motion.b style={{ scaleY: fill }} /></i>
        {STEPS.map(([t, e], i) => (
          <li key={t}>
            <button type="button" aria-pressed={on === i} onClick={() => { setMine(true); setOn(i); }}>
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
      <div className="x-panel-f">
        <Copy text={STEPS[on][1]} label="Copy this step" />
        <Copy text={STEPS.map((s) => s[1]).join('\n')} label="Copy the whole script" />
      </div>
      <div className="x-panel-links">
        <a className="x-btn sm solid" href="/agents#headless">Start as an agent</a>
        <a className="x-btn sm" href="https://hanzo.ai/llms.txt">Read llms.txt</a>
      </div>
    </div>
  );
}

export default function Agents() {
  const mx = useMotionValue(Infinity);
  const my = useMotionValue(Infinity);
  return (
    <section className="x-sec x-agents" id="compatible" aria-labelledby="compatible-h">
      <div className="x-wrap">
        <Head title="Works with every agent, bot and CLI tool." lede="Claude Code, Codex, Cursor and the rest, every model behind one key. Or let your agent sign itself up." />
        <ul
          className="x-dock"
          onPointerMove={(e) => { if (fine(e)) { mx.set(e.clientX); my.set(e.clientY); } }}
          onPointerLeave={() => { mx.set(Infinity); my.set(Infinity); }}
        >
          {C.agents.map((a, i) => <Ico key={a.name} a={a} i={i} mx={mx} my={my} />)}
        </ul>
        <div className="x-panels">
          <Rise className="x-panel">
            <div className="x-panel-h"><Mark size={14} /> <b>Hanzo.Start</b></div>
            <p className="x-panel-k">Install the Hanzo CLI</p>
            <Cmd bin="curl" rest="-fsSL https://hanzo.sh | sh" copy="curl -fsSL https://hanzo.sh | sh" />
            <div className="x-or small"><span>or</span></div>
            <Cmd bin="npm" rest="i -g hanzo" copy="npm i -g hanzo" />
            <p className="x-panel-k">Accelerate Claude Code with Hanzo</p>
            <Cmd bin="hanzo" rest="dev --claude" copy="hanzo dev --claude" />
            <p className="x-panel-k">Set up Codex, Cursor and more</p>
            <motion.a href="https://hanzo.ai/skill.md" className="x-setup inline" whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}>
              Copy setup prompt
              <span className="x-setup-ics">{C.agents.slice(1, 7).map((a) => <span key={a.name} className="x-setup-i" dangerouslySetInnerHTML={{ __html: a.icon }} />)}</span>
              <b>+26</b>
            </motion.a>
          </Rise>
          <Rise delay={0.12} className="x-panel-wrap"><Steps /></Rise>
        </div>
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
