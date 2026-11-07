'use client';
/* A help article (/help/<topic>/<question>, one template). Calm, precise and fast: the question set large, the answer as
   a numbered index, then the document at 64ch. Beside it, the setting the article explains, drawn as Hanzo's own
   settings panel: a cursor walks the article's steps by itself (avatar, Settings, Privacy, the switch), and the step it
   is on lights in the text. Choose web and desktop or mobile, press any step to see it, or flip the switch yourself.
   Every word is Hanzo's; the panel's grey bars are placeholders, not invented items. No UI hue: ink, greys and white;
   nothing sits above the question (the topic line sits under it). Motion is time and state, not scroll: the hand
   walks by itself, screens slide as it presses, the switch springs, a tick draws when it saves.
   Signature: the setting, walked. A live settings panel where a spring-driven cursor presses through Hanzo's own steps
   for the chosen platform, screens opening as it goes, the matching step lit in the text and a drawn tick when it saves.
   Beyond: try the choice. Flip the switch and the panel answers with what that choice means, in the article's own
   words: on, what Hanzo may use; off, what turning it off changes.
   V2: 8/10 rebuilt from the ported page: large question, numbered answer index, 64ch document, and a self-walking settings panel you can drive; no UI hues */
// Signature: the setting, walked: a live settings panel where a spring cursor presses through the article's own steps, the matching step lit in the text
// Beyond: try the choice: flip the switch and the panel answers with what that choice means, in the article's own words
// Persona: a Hanzo Chat or Dev user deciding whether their chats and coding sessions may train Hanzo's models
// Goal: find and change "Help improve Hanzo's models" and know what each choice means; metric: none in PLAN-COMPONENTS 1.1 (support page)
// CTA: none of Hanzo's on this page (the action is the setting in the app); text links to Terms of Service, Privacy Policy and privacy@hanzo.ai
import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useReducedMotion, useSpring } from 'motion/react';
import { EASE } from '../../ui';
import { A, Tick } from '../../kit';
import './HelpArticle.css';

const SPRING = { stiffness: 300, damping: 30, mass: 1.3 };
// with scripts off, the question and lede show at once and the hand (which needs scripts to walk) is hidden
const NOJS = '.xhp .x-line-in,.xhp-lede{transform:none!important;opacity:1!important}.xhp-hand{display:none!important}';
const say = (inl) => inl.map((x) => (typeof x === 'string' ? x : x.b || x.t)).join('').replace(/\s+/g, ' ').trim();

/* an address Hanzo's page protects: its own link stays in the HTML, and in the browser it becomes a direct mailto */
function Mail({ k }) {
  const ref = useRef(null);
  useEffect(() => { if (ref.current) ref.current.setAttribute('href', k.a); }, [k.a]);
  return <a ref={ref} href={k.cf} className="xhp-a">{k.t}</a>;
}

function Inline({ inl }) {
  return inl.map((k, i) => {
    if (typeof k === 'string') return k;
    if (k.b) return <strong key={i}>{k.b}</strong>;
    if (k.cf) return <Mail key={i} k={k} />;
    if (k.a && /^(mailto:|#)/.test(k.a)) return <a key={i} href={k.a} className="xhp-a">{k.t}</a>;
    if (k.a) return <A key={i} to={k.a} className="xhp-a">{k.t}</A>;
    return null;
  });
}

/* the walk: which platform, how far the hand has pressed, the switch, and whether it plays by itself */
function useWalk(setting, live) {
  const calm = useReducedMotion();
  const [plat, setPlat] = useState(0);
  const [level, setLevel] = useState(0);
  const [on, setOn] = useState(true);
  const [auto, setAuto] = useState(true);
  const [hold, setHold] = useState(false);
  const [press, setPress] = useState(0);
  const [saved, setSaved] = useState(0);
  const [want, setWant] = useState(null);
  const stage = useRef(null);
  const x = useSpring(0, SPRING), y = useSpring(0, SPRING);
  const flow = setting.flows[plat];
  const targets = flow.steps.flatMap((s, i) => s.targets.map((t) => ({ t, step: i })));
  const n = targets.length;
  const rest = () => { const r = stage.current?.getBoundingClientRect(); if (r) { x.set(r.width * 0.78); y.set(r.height * 0.84); } };
  const aim = (k) => {
    const s = stage.current, el = s && s.querySelector(`[data-t="${k}"]`);
    if (!el) return;
    const a = s.getBoundingClientRect(), b = el.getBoundingClientRect();
    x.set(b.left - a.left + Math.min(b.width * 0.5, 40)); y.set(b.top - a.top + b.height * 0.55);
  };
  const hit = (k) => {
    setPress((p) => p + 1);
    if (targets[k] && targets[k].t === 'switch') { setOn((o) => !o); setSaved((v) => v + 1); }
    setLevel(k + 1);
  };
  // on a phone, start with the phone's own steps (when the article has them)
  useEffect(() => { if (setting.flows.length > 1 && matchMedia('(max-width: 900px)').matches) setPlat(setting.flows.findIndex((f) => /mobile/i.test(f.label)) > 0 ? setting.flows.findIndex((f) => /mobile/i.test(f.label)) : 0); }, []); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { if (calm) { setAuto(false); setLevel(n - 1); } else rest(); }, [calm]); // eslint-disable-line react-hooks/exhaustive-deps
  // the hand plays by itself while the panel is on screen, nobody is pointing at it and nobody has taken over
  useEffect(() => {
    if (!auto || !live || hold || calm) return;
    if (level >= n) { const t = setTimeout(() => { setLevel(0); rest(); }, 3400); return () => clearTimeout(t); }
    const t1 = setTimeout(() => aim(level), level ? 650 : 1000);
    const t2 = setTimeout(() => hit(level), level ? 1450 : 1800);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [auto, live, hold, calm, plat, level]); // eslint-disable-line react-hooks/exhaustive-deps
  // a step pressed in the text: show the screen just before it, move the hand there, press
  useEffect(() => {
    if (want === null || want !== level) return;
    const t1 = setTimeout(() => aim(want), 60);
    const t2 = setTimeout(() => { hit(want); setWant(null); }, calm ? 0 : 760);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [want, level, plat]); // eslint-disable-line react-hooks/exhaustive-deps
  const active = targets[Math.min(level, n - 1)].step;
  return {
    plat, level, on, auto, press, saved, stage, x, y, flow, targets, active, n,
    hold: setHold,
    platform: (p) => { if (p === plat) return; setPlat(p); setLevel(0); setWant(null); setTimeout(rest, 30); },
    step: (p, i) => { setAuto(false); setPlat(p); const k = setting.flows[p].steps.slice(0, i).reduce((m, s) => m + s.targets.length, 0); setLevel(k); setWant(k); },
    flip: () => { setAuto(false); setOn((o) => !o); setSaved((v) => v + 1); setLevel(n); setWant(null); },
  };
}

function Screen({ w, setting }) {
  const lv = Math.min(w.level, 3);
  const label = (k) => (w.targets[k] ? w.targets[k].t : '');
  return (
    <div className="xhp-screen" data-device={w.plat ? 'phone' : 'desk'} data-level={lv} aria-hidden="true">
      <div className="xhp-app">
        <div className="xhp-top">
          <span className="xhp-dots"><i /><i /><i /></span>
          <span className="xhp-avatar" data-t="0"><svg viewBox="0 0 24 24" width="16" height="16"><circle cx="12" cy="9" r="4" fill="currentColor" /><path d="M4.5 20c1.2-3.6 4.2-5.4 7.5-5.4s6.3 1.8 7.5 5.4" fill="currentColor" /></svg></span>
        </div>
        <div className="xhp-chat"><i style={{ '--w': '62%' }} /><i style={{ '--w': '44%' }} className="me" /><i style={{ '--w': '78%' }} /><i style={{ '--w': '56%' }} /></div>
        <div className="xhp-menu"><i /><span className="xhp-item" data-t="1">{label(1)}</span><i /><i /></div>
      </div>
      <div className="xhp-set">
        <p className="xhp-set-h">{label(1)}</p>
        <div className="xhp-nav"><i /><span className="xhp-item" data-t="2" data-on={lv >= 3 || undefined}>{label(2)}</span><i /><i /></div>
        <div className="xhp-pane">
          <p className="xhp-pane-h">{label(2)}</p>
          <div className="xhp-row">
            <span className="xhp-row-t">{setting.name}</span>
            <button type="button" tabIndex={-1} className="xhp-sw" data-t="3" data-on={w.on || undefined} onClick={w.flip}><i /></button>
          </div>
          <span className="xhp-skel"><i /><i /></span>
          <span className="xhp-skel"><i /><i /></span>
        </div>
      </div>
    </div>
  );
}

function Panel({ setting, w }) {
  const box = useRef(null);
  const total = w.flow.steps.length;
  return (
    <div className="xhp-panel" ref={box} role="group" aria-label={setting.name}>
      <div className="xhp-panel-bar">
        <div className="xhp-seg" role="radiogroup" aria-label={setting.flows.map((f) => f.label).join(' / ')}>
          {setting.flows.map((f, i) => (
            <button key={f.label} type="button" role="radio" aria-checked={w.plat === i} onClick={() => w.platform(i)}>
              {f.label.replace(/^On (the )?/i, '').replace(/^./, (c) => c.toUpperCase())}
            </button>
          ))}
        </div>
      </div>
      <div className="xhp-stage" ref={w.stage} onPointerEnter={(e) => e.pointerType === 'mouse' && w.hold(true)} onPointerLeave={() => w.hold(false)}>
        <Screen w={w} setting={setting} />
        <motion.span className="xhp-hand" style={{ x: w.x, y: w.y }} aria-hidden="true">
          {w.press > 0 && <motion.i key={w.press} className="xhp-ring" initial={{ scale: 0.2, opacity: 0.55 }} animate={{ scale: 1.6, opacity: 0 }} transition={{ duration: 0.6, ease: EASE }} />}
          <svg viewBox="0 0 20 24" width="20" height="24"><path d="M2 1.5v17.2l4.6-4.3 3 6.9 3.2-1.4-3-6.8 6.3-.3L2 1.5z" fill="#0a0a0a" stroke="#fff" strokeWidth="1.4" strokeLinejoin="round" /></svg>
        </motion.span>
      </div>
      <div className="xhp-cap" aria-hidden="true">
        <span className="xhp-cap-n x-mono">{String(w.active + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}</span>
        <span className="xhp-cap-t" key={w.plat + '-' + w.active}>{say(w.flow.steps[w.active].inl)}</span>
        <span className="xhp-cap-dots">{w.flow.steps.map((s, i) => <i key={i} data-on={i <= w.active || undefined} />)}</span>
      </div>
      <div className="xhp-try">
        <button type="button" role="switch" aria-checked={w.on} className="xhp-try-b" onClick={w.flip}>
          <span className="xhp-sw" data-on={w.on || undefined} aria-hidden="true"><i /></span>
          <span>{setting.name}</span>
        </button>
        <div className="xhp-means" aria-live="polite">
          {w.saved > 0 && setting.saved && w.level >= w.n && <p className="xhp-saved"><Tick key={w.saved} size={18} /><span>{setting.saved}</span></p>}
          {w.on ? (setting.on && <p className="xhp-means-on">{setting.on}</p>) : (
            <>
              {setting.offTitle && <p className="xhp-means-k x-mono">{setting.offTitle}</p>}
              <ul>{setting.off.map((t) => <li key={t}>{t}</li>)}</ul>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function Section({ s, i, setting, w }) {
  const flows = setting ? setting.flows : [];
  const out = [], cards = [];
  for (let k = 0; k < s.blocks.length; k++) {
    const b = s.blocks[k];
    const f = b.k === 'h3' && s.blocks[k + 1] && s.blocks[k + 1].k === 'ol' && w ? flows.findIndex((x) => x.label === b.text) : -1;
    if (f >= 0) { // a platform's steps: a card whose steps drive the panel
      if (!cards.length) out.push('cards');
      cards.push(
        <div key={k} className="xhp-flow" data-on={w.plat === f || undefined}>
          <h3 className="xhp-h3 x-mono">{b.text}</h3>
          <ol>{s.blocks[k + 1].items.map((it, j) => (
            <li key={j} data-on={(w.plat === f && w.active === j) || undefined}>
              <button type="button" onClick={() => w.step(f, j)}><span className="xhp-step-n x-mono">{String(j + 1).padStart(2, '0')}</span><span><Inline inl={it.inl} /></span></button>
            </li>
          ))}</ol>
        </div>,
      );
      k++;
    } else if (b.k === 'h3') out.push(<h3 key={k} className="xhp-h3 x-mono">{b.text}</h3>);
    else if (b.k === 'p') out.push(<p key={k} className="xhp-p"><Inline inl={b.inl} /></p>);
    else if (b.k === 'ol') out.push(<ol key={k} className="xhp-ol">{b.items.map((it, j) => <li key={j}><Inline inl={it.inl} /></li>)}</ol>);
    else if (b.k === 'ul') out.push(
      <ul key={k} className={'xhp-ul' + (b.items.some((it) => it.lead) ? ' leads' : '')}>
        {b.items.map((it, j) => <li key={j}>{it.lead && <strong className="xhp-lead">{it.lead}</strong>}<span><Inline inl={it.inl} /></span></li>)}
      </ul>,
    );
  }
  return (
    <section id={s.id} className="xhp-sec" aria-labelledby={s.id + '-h'} tabIndex={-1}>
      <h2 id={s.id + '-h'} className="xhp-h2"><span className="xhp-sec-n x-mono" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>{s.title}</h2>
      {out.map((x) => (x === 'cards' ? <div key="cards" className="xhp-flows">{cards}</div> : x))}
    </section>
  );
}

function Layout({ doc, w, aside }) {
  return (
    <main className="xhp">
      <noscript><style>{NOJS}</style></noscript>
      <div className="xhp-g">
        <header className="xhp-hero">
          <h1 className="xhp-h1" data-morph-target>
            <span className="x-line"><motion.span className="x-line-in" initial={{ y: '106%' }} animate={{ y: 0 }} transition={{ duration: 1, ease: EASE, delay: 0.08 }}>{doc.title}</motion.span></span>
          </h1>
          <motion.p className="xhp-lede" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: EASE, delay: 0.3 }}>{doc.lede}</motion.p>
          <p className="xhp-kick x-mono">{doc.kicker}</p>
          <nav className="xhp-toc" aria-label={doc.contents.label}>
            <h2 className="xhp-toc-h x-mono">{doc.contents.label}</h2>
            <ol>
              {doc.contents.items.map((c, i) => (
                <li key={c.id}><a href={'#' + c.id}><span className="x-mono">{String(i + 1).padStart(2, '0')}</span><span>{c.text}</span></a></li>
              ))}
            </ol>
          </nav>
        </header>

        <aside className="xhp-aside" ref={aside}>
          {w && <Panel setting={doc.setting} w={w} />}
        </aside>

        <article className="xhp-doc">
          {doc.sections.map((s, i) => <Section key={s.id} s={s} i={i} setting={doc.setting} w={w} />)}
        </article>
      </div>
    </main>
  );
}

function Walked({ doc }) {
  const aside = useRef(null);
  const live = useInView(aside, { amount: 0.35 });
  const w = useWalk(doc.setting, live);
  return <Layout doc={doc} w={w} aside={aside} />;
}

export default function HelpArticle({ doc }) {
  return doc.setting ? <Walked doc={doc} /> : <Layout doc={doc} w={null} />;
}
