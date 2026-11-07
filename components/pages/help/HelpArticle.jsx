'use client';
/* A help article (/help/<topic>/<question>, one template). Calm, precise and fast: the question set large, the answer as
   a numbered index, then the document at 62ch. Beside it, the setting the article explains, drawn as Hanzo's own
   settings panel: a cursor walks the article's steps by itself (avatar, Settings, Privacy, the switch), and the step it
   is on lights in the text. Choose web and desktop or mobile, press any step to see it, or flip the switch yourself.
   Every word is Hanzo's; the panel's grey bars are placeholders, not invented items. No UI hue: ink, greys and white;
   nothing sits above the question (the topic line sits under it). Motion is time and state, not scroll: the hand
   walks by itself, screens slide as it presses, the switch slides (300ms ease-emphasis), a tick draws when it saves.
   Signature: the setting, walked. A live settings panel where a cursor glides (ease-emphasis, no spring) through Hanzo's own steps
   for the chosen platform, screens opening as it goes, the matching step lit in the text and a drawn tick when it saves.
   Beyond: try the choice. Flip the switch and the panel answers with what that choice means, in the article's own
   words: on, what Hanzo may use; off, what turning it off changes.
   V2: 8/10 round 4 (critic 7): one section counter on the panel (the walk's steps are its dots), 01 has its own scene (the setting, turning on), 04 turns the switch off and lights the row being read, the panel keeps the section just read and stops 56px above the closing band, platform labels on one line at every width, phone demo card at 56% of the screen with the contents inside 1.25 screens, phone 01 and 05 carry small objects, contents rows show an arrow and press 1px, every hairline on the text edge, the question visible from first paint (CSS cut-in), Hanzo's own "Help Center" and no invented labels. Round 3: the demo agrees with itself (both switches mirror; every walk starts on and ends off; 03 and 04 show it off), tabs fit at 320, placeholder bars stay inside both windows, a tap mark on touch and the hand rests inside the window, two caption lines reserved, phone 03 and 04 carry their own inline stage, phone demo shorter, breadcrumb separators trail (no lone slash), "More" at 26px with a Help center next step, a real breadcrumb hover, no white gap before the footer on phones. Round 2: the panel now follows the reading (01-02 the walk, 03 a drawn line where the switch turns off and later chats go hollow, 04 the other settings lit row by row in step with its rows), the switch answers with the tick and saved line instead of repeating 03, panel capped to the viewport, 62ch column, flat step tiles that become tabs on phones, full breadcrumb, real hovers on index rows and links, hairlines that draw in, the last section closes as a quiet room into the footer */
// Signature: the setting, walked: a live settings panel where a gliding cursor presses through the article's own steps, the matching step lit in the text
// Beyond: try the choice: flip the switch and the panel answers with what that choice means, in the article's own words
// Persona: a Hanzo Chat or Dev user deciding whether their chats and coding sessions may train Hanzo's models
// Goal: find and change "Help improve Hanzo's models" and know what each choice means; metric: none in PLAN-COMPONENTS 1.1 (support page)
// CTA: none of Hanzo's on this page (the action is the setting in the app); text links to Terms of Service, Privacy Policy and privacy@hanzo.ai
// Metric: none assigned (support page); the switch tryout is a demo and sends nothing
import { useEffect, useRef, useState } from 'react';
import { animate, motion, useInView, useMotionValue, useReducedMotion } from 'motion/react';
import { EASE } from '../../ui';
import { A, Tick } from '../../kit';
import './HelpArticle.css';

const GLIDE = { duration: 0.5, ease: EASE }; // the hand travels on the deck's ease-emphasis: no spring, no overshoot
// with scripts off, the question and lede show at once and the hand (which needs scripts to walk) is hidden
const NOJS = '.xhp .x-line-in,.xhp-lede{transform:none!important;opacity:1!important}.xhp-hand{display:none!important}.xhp-flow ol{display:block!important}.xhp-ul li::after{transform:none!important}.xhp-page{opacity:1!important;transform:none!important}.xhp-page *{stroke-dashoffset:0!important}';
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
function useWalk(setting, live, mode, row, onStep) {
  const calm = useReducedMotion();
  const n0 = setting.flows[0].steps.reduce((m, s) => m + s.targets.length, 0);
  const [plat, setPlat] = useState(0);
  // the first paint (server and client alike) is the walk's finished state: the switch off and saved. With motion
  // allowed, the walk starts from the top once the page is live; with reduced motion it simply stays there.
  const [level, setLevel] = useState(n0);
  const [aimAt, setAimAt] = useState(n0 - 1); // the target the hand is on: its step is the one lit
  const [on, setOn] = useState(false);
  const stepping = useRef(false); // a step was pressed in the text: the walk must not restart over it
  const [auto, setAuto] = useState(true);
  const [hold, setHold] = useState(false);
  const [press, setPress] = useState(0);
  const [saved, setSaved] = useState(0);
  const [want, setWant] = useState(null);
  const [lit, setLit] = useState(0); // section 04: which of its rows the panel lights
  const [litHold, setLitHold] = useState(false);
  const [touch, setTouch] = useState(false); // a touch screen shows a tap mark, not an arrow
  const [placed, setPlaced] = useState(false); // the hand shows only once it rests inside the window
  const stage = useRef(null);
  const x = useMotionValue(0), y = useMotionValue(0);
  const flow = setting.flows[plat];
  const targets = flow.steps.flatMap((s, i) => s.targets.map((t) => ({ t, step: i })));
  const n = targets.length;
  // the hand rests inside the drawn window (the phone is narrower than the stage), never half outside it
  const rest = () => {
    const s = stage.current, app = s && s.querySelector('.xhp-app');
    if (!app) return;
    const a = s.getBoundingClientRect(), b = app.getBoundingClientRect();
    x.set(b.left - a.left + b.width * 0.7); y.set(b.top - a.top + b.height * 0.72); setPlaced(true);
  };
  const aim = (k) => {
    setAimAt(k);
    const s = stage.current, el = s && s.querySelector(`[data-t="${k}"]`);
    if (!el) return;
    const a = s.getBoundingClientRect(), b = el.getBoundingClientRect();
    animate(x, b.left - a.left + Math.min(b.width * 0.5, 40), GLIDE); animate(y, b.top - a.top + b.height * 0.55, GLIDE);
  };
  const hit = (k) => {
    setPress((p) => p + 1);
    if (targets[k] && targets[k].t === 'switch') { setOn(false); setSaved((v) => v + 1); } // the walk always turns it off
    setLevel(k + 1);
  };
  // on a phone, start with the phone's own steps (when the article has them); a touch screen gets the tap mark
  useEffect(() => {
    setTouch(matchMedia('(pointer: coarse)').matches);
    if (setting.flows.length > 1 && matchMedia('(max-width: 900px)').matches) setPlat(setting.flows.findIndex((f) => /mobile/i.test(f.label)) > 0 ? setting.flows.findIndex((f) => /mobile/i.test(f.label)) : 0);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { const t = setTimeout(rest, 40); return () => clearTimeout(t); }, [plat]); // eslint-disable-line react-hooks/exhaustive-deps
  // reduced motion: the finished state, the switch already off
  useEffect(() => { if (calm) { setAuto(false); setLevel(n); setAimAt(n - 1); setOn(false); } }, [calm]); // eslint-disable-line react-hooks/exhaustive-deps
  // each part of the document sets the switch, and both switches (in the picture and under it) agree:
  // 01 shows the setting itself (it turns on once), 03 shows it off, 04 turns it off once while its rows stay put,
  // and coming back to the walk starts it again from the top, switched on
  useEffect(() => {
    if (mode === 'walk') {
      if (calm) { setLevel(n); setAimAt(n - 1); setOn(false); return undefined; } // reduced motion: the walk's finished state
      if (stepping.current) { stepping.current = false; return undefined; } // a pressed step already set the walk
      setLevel(0); setAimAt(0); setOn(true); setTimeout(rest, 30); return undefined;
    }
    if (calm || mode === 'after') { setOn(mode === 'what'); return undefined; }
    setOn(mode !== 'what');
    const t = setTimeout(() => setOn(mode === 'what'), 600);
    return () => clearTimeout(t);
  }, [mode, calm]); // eslint-disable-line react-hooks/exhaustive-deps
  // the hand plays by itself while the panel is on screen, nobody is pointing at it and nobody has taken over
  useEffect(() => {
    if (!auto || !live || hold || calm || mode !== 'walk') return;
    if (level >= n) { const t = setTimeout(() => { setLevel(0); setAimAt(0); setOn(true); rest(); }, 3400); return () => clearTimeout(t); } // each walk starts on and ends off
    const t1 = setTimeout(() => aim(level), level ? 650 : 550);
    const t2 = setTimeout(() => hit(level), level ? 1450 : 1350);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [auto, live, hold, calm, plat, level, mode]); // eslint-disable-line react-hooks/exhaustive-deps
  // section 04 in view: the panel lights the setting for the row being read (what this switch leaves alone); a pointer
  // on a row takes over
  const shown = litHold ? lit : row == null ? 0 : row;
  // a step pressed in the text: show the screen just before it, move the hand there, press
  useEffect(() => {
    if (want === null || want !== level) return;
    const t1 = setTimeout(() => aim(want), 60);
    const t2 = setTimeout(() => { hit(want); setWant(null); }, calm ? 0 : 760);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [want, level, plat]); // eslint-disable-line react-hooks/exhaustive-deps
  // the lit step is the one the hand is on (or has just pressed), so pressing step 01 lights 01
  const active = targets[Math.max(0, Math.min(aimAt, n - 1))].step;
  return {
    plat, level, on, auto, press, saved, stage, x, y, flow, targets, active, n, mode, lit: shown, touch, placed,
    hold: setHold,
    light: (k) => { if (k === null) { setLitHold(false); return; } setLit(k); setLitHold(true); },
    paused: !auto,
    pause: () => setAuto((v) => !v), // the walk's own pause control (it loops), first in the panel
    platform: (p) => { if (p === plat) return; setPlat(p); setLevel(0); setAimAt(0); setWant(null); setTimeout(rest, 30); },
    // a pressed step: autoplay stops, the panel switches to the walk (whatever section is in view) and shows that step
    step: (p, i) => {
      setAuto(false); setPlat(p);
      const k = setting.flows[p].steps.slice(0, i).reduce((m, s) => m + s.targets.length, 0);
      if (mode !== 'walk') stepping.current = true;
      if (onStep) onStep();
      setAimAt(k); setOn(true); setLevel(k); setWant(k);
    },
    flip: () => { setAuto(false); setOn((o) => !o); setSaved((v) => v + 1); setLevel(n); setAimAt(n - 1); setWant(null); },
  };
}

function Screen({ w, setting }) {
  const walk = w.mode === 'walk';
  const lv = walk ? Math.min(w.level, 3) : 3;
  const label = (k) => (w.targets[k] ? w.targets[k].t : '');
  return (
    <div className="xhp-screen" data-device={w.plat ? 'phone' : 'desk'} data-level={lv} data-mode={w.mode} aria-hidden="true">
      <div className="xhp-app">
        <div className="xhp-top">
          <span className="xhp-dots"><i /><i /><i /></span>
          <span className="xhp-avatar" data-t="0"><svg viewBox="0 0 24 24" width="16" height="16"><circle cx="12" cy="9" r="4" fill="currentColor" /><path d="M4.5 20c1.2-3.6 4.2-5.4 7.5-5.4s6.3 1.8 7.5 5.4" fill="currentColor" /></svg></span>
        </div>
        <div className="xhp-chat"><i /><i className="me" /><i /><i /></div>
        <div className="xhp-menu"><i /><span className="xhp-item" data-t="1">{label(1)}</span><i /><i /></div>
      </div>
      <div className="xhp-set">
        <p className="xhp-set-h">{label(1)}</p>
        <div className="xhp-nav"><i /><span className="xhp-item" data-t="2" data-on={lv >= 3 || undefined}>{label(2)}</span><i /><i /></div>
        <div className="xhp-pane">
          <p className="xhp-pane-h">{label(2)}</p>
          <div className="xhp-row" data-on={w.mode === 'what' || undefined}>
            <span className="xhp-row-t">{setting.name}</span>
            <span className="xhp-sw" data-t="3" data-on={w.on || undefined} onClick={w.flip}><i /></span>
          </div>
          {[0, 1, 2, 3].map((k) => <span key={k} className="xhp-skel" data-on={(w.mode === 'still' && w.lit === k) || undefined}><i /><i /></span>)}
        </div>
      </div>
    </div>
  );
}

/* section 03 in view: conversations along a line; the switch turns off at the marker. Those before it stay filled (training
   already begun is not undone), those after it are hollow (not used to train). Drawn, no words: the section says it. */
function After({ calm }) {
  const T = (d) => (calm ? { duration: 0 } : { duration: 0.4, ease: EASE, delay: d });
  return (
    <svg className="xhp-after" viewBox="0 0 400 220" aria-hidden="true">
      <motion.path d="M24 132H376" stroke="currentColor" strokeWidth="1" fill="none" initial={{ pathLength: calm ? 1 : 0 }} animate={{ pathLength: 1 }} transition={calm ? { duration: 0 } : { duration: 0.9, ease: [0.4, 0, 0.2, 1] }} />
      <motion.path d="M200 84V180" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 4" fill="none" initial={{ pathLength: calm ? 1 : 0 }} animate={{ pathLength: 1 }} transition={T(0.5)} />
      <g transform="translate(178 44)">
        <motion.rect width="44" height="26" rx="13" initial={{ fill: calm ? '#d4d4d4' : '#0a0a0a' }} animate={{ fill: '#d4d4d4' }} transition={T(0.9)} />
        <motion.circle cy="13" r="10" fill="#fff" initial={{ cx: calm ? 13 : 31 }} animate={{ cx: 13 }} transition={T(0.9)} />
      </g>
      {[0, 1, 2, 3, 4, 5, 6, 7].map((k) => {
        const cx = 48 + k * 44 + (k > 3 ? 8 : -8);
        return <motion.circle key={k} cx={cx} cy="132" r="9" strokeWidth="1.5" stroke="#0a0a0a" fill={k < 4 ? '#0a0a0a' : '#fff'}
          initial={{ scale: calm ? 1 : 0, opacity: calm ? 1 : 0 }} animate={{ scale: 1, opacity: 1 }} transition={T(k < 4 ? 0.2 + k * 0.06 : 1.2 + (k - 4) * 0.12)} style={{ transformOrigin: `${cx}px 132px` }} />;
      })}
    </svg>
  );
}

function Panel({ setting, w, doc, cur }) {
  const box = useRef(null);
  const calm = useReducedMotion();
  const total = w.flow.steps.length;
  const walk = w.mode === 'walk';
  const si = doc.sections.findIndex((s) => s.id === cur);
  // one counter, always the document's sections: the walk is the steps section, its steps are the dots
  const stepsIdx = doc.sections.findIndex((s) => s.blocks.some((b) => b.k === 'h3' && setting.flows.some((f) => f.label === b.text)));
  const at = walk ? Math.max(stepsIdx, 0) : Math.max(si, 0);
  // one counter at a time: during the walk its own steps (with the dashes), otherwise the document's sections
  const pad = (v) => String(v).padStart(2, '0');
  const count = walk ? pad(w.active + 1) + ' / ' + pad(total) : pad(at + 1) + ' / ' + pad(doc.sections.length);
  return (
    <div className="xhp-panel" ref={box} role="group" aria-label={setting.name}>
      <div className="xhp-panel-bar">
        <button type="button" className="xhp-pause" aria-pressed={w.paused} aria-label="Pause" onClick={w.pause}>
          {w.paused
            ? <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M5 3.5v9l7-4.5z" fill="currentColor" /></svg>
            : <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M5 3.5v9M11 3.5v9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>}
        </button>
        <div className="xhp-seg" role="radiogroup" aria-label={setting.flows.map((f) => f.label).join(' / ')}>
          {setting.flows.map((f, i) => (
            <button key={f.label} type="button" role="radio" aria-checked={w.plat === i} onClick={() => w.platform(i)}>
              {f.label}
            </button>
          ))}
        </div>
      </div>
      <div className="xhp-stage" data-mode={w.mode} ref={w.stage} onPointerEnter={(e) => e.pointerType === 'mouse' && w.hold(true)} onPointerLeave={() => w.hold(false)}>
        <Screen w={w} setting={setting} />
        {w.mode === 'after' && <After key="after" calm={calm} />}
        <motion.span className="xhp-hand" data-touch={w.touch || undefined} data-placed={w.placed || undefined} style={{ x: w.x, y: w.y }} aria-hidden="true">
          {w.press > 0 && <motion.i key={w.press} className="xhp-ring" initial={{ scale: 0.2, opacity: 0.55 }} animate={{ scale: 1.6, opacity: 0 }} transition={{ duration: 0.4, ease: EASE }} />}
          {w.touch
            ? <i className="xhp-tap" />
            : <svg viewBox="0 0 20 24" width="20" height="24"><path d="M2 1.5v17.2l4.6-4.3 3 6.9 3.2-1.4-3-6.8 6.3-.3L2 1.5z" fill="#0a0a0a" stroke="#fff" strokeWidth="1.4" strokeLinejoin="round" /></svg>}
        </motion.span>
      </div>
      <div className="xhp-cap" aria-hidden="true">
        <span className="xhp-cap-n x-mono">{count}</span>
        {walk
          ? <span className="xhp-cap-t" key={w.plat + '-' + w.active}>{say(w.flow.steps[w.active].inl)}</span>
          : <span className="xhp-cap-t" key={'s-' + at}>{doc.sections[at].title}</span>}
        <span className="xhp-cap-dots" data-walk={walk || undefined}>{Array.from({ length: total }, (_, i) => <i key={i} data-on={(walk && i <= w.active) || undefined} />)}</span>
      </div>
      <div className="xhp-try">
        <button type="button" role="switch" aria-checked={w.on} className="xhp-try-b" onClick={w.flip}>
          <span className="xhp-sw" data-on={w.on || undefined} aria-hidden="true"><i /></span>
          <span>{setting.name}</span>
        </button>
        <div className="xhp-means" aria-live="polite">
          {w.on
            ? (setting.on && <p className="xhp-means-on" key="on">{setting.on}</p>)
            : (setting.saved && <p className="xhp-saved" key={'off-' + w.saved}><Tick key={w.saved} size={18} /><span>{setting.saved}</span></p>)}
        </div>
      </div>
    </div>
  );
}

/* on a phone the panel is not beside the text, so sections 03 and 04 carry their own small stage inline: 03 the line where
   the switch turns off, 04 the Privacy pane with the switch off and the other settings lit in step with its rows */
function Mini({ kind, setting, w }) {
  const calm = useReducedMotion();
  const here = w.mode === kind;
  if (kind === 'after') {
    return <div className="xhp-mini" aria-hidden="true"><After key={here ? 'play' : 'rest'} calm={calm || !here} /></div>;
  }
  // 01: the setting itself, turning on once as the section is read; 04: the switch off, the settings it leaves alone lit
  const what = kind === 'what';
  const sw = what ? (here ? w.on : true) : here ? w.on : false;
  return (
    <div className={'xhp-mini xhp-mini-pane' + (what ? ' xhp-mini-what' : '')} aria-hidden="true">
      <p className="xhp-pane-h">{w.targets[2] ? w.targets[2].t : ''}</p>
      <div className="xhp-row" data-on={what || undefined}><span className="xhp-row-t">{setting.name}</span><span className="xhp-sw" data-on={sw || undefined}><i /></span></div>
      {(what ? [0, 1] : [0, 1, 2, 3]).map((k) => <span key={k} className="xhp-skel" data-on={(!what && here && w.lit === k) || undefined}><i /><i /></span>)}
    </div>
  );
}

/* 05 on a phone: the documents the last section points to, as named rows (the link's own words and the section it
   names, both Hanzo's), each one laying down its hairline in turn as the section arrives. The links stay in the text;
   these rows repeat them for the eye only. */
function Docs({ s }) {
  const rows = [];
  s.blocks.forEach((b) => (b.inl || []).forEach((k, j, all) => {
    // the documents only: the protected address stays as Hanzo's page has it, in the text
    if (typeof k === 'string' || !k.a || k.cf || /^(#|mailto:)/.test(k.a)) return;
    const after = typeof all[j + 1] === 'string' ? all[j + 1].match(/^\s*(\([^)]*\))/) : null;
    rows.push({ t: k.t, to: k.a, sec: after ? after[1] : null });
  }));
  if (!rows.length) return null;
  return (
    <ul className="xhp-docs" aria-hidden="true">
      {rows.map((r, i) => (
        <li key={r.t} className="xhp-page" style={{ '--i': i }}>
          <A to={r.to} tabIndex={-1}><span>{r.t}</span>{r.sec && <span className="x-mono">{r.sec}</span>}<Arrow /></A>
        </li>
      ))}
    </ul>
  );
}
const Arrow = () => <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>;

function Section({ s, i, setting, w, still, after, what, end }) {
  const flows = setting ? setting.flows : [];
  const out = [], cards = [];
  for (let k = 0; k < s.blocks.length; k++) {
    const b = s.blocks[k];
    const f = b.k === 'h3' && s.blocks[k + 1] && s.blocks[k + 1].k === 'ol' && w ? flows.findIndex((x) => x.label === b.text) : -1;
    if (f >= 0) { // a platform's steps: a card whose steps drive the panel; on a phone the two headings are its tabs
      if (!cards.length) out.push('cards');
      cards.push(
        <div key={k} className="xhp-flow" data-on={w.plat === f || undefined}>
          <h3 className="xhp-h3 x-mono"><button type="button" className="xhp-flow-tab" aria-pressed={w.plat === f} onClick={() => w.platform(f)}>{b.text}</button></h3>
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
    else if (b.k === 'ul') {
      const lights = still && w && b.items.some((it) => it.lead);
      out.push(
        <ul key={k} className={'xhp-ul' + (b.items.some((it) => it.lead) ? ' leads' : '')}>
          {b.items.map((it, j) => (
            <li key={j} style={{ '--i': j }} data-row={lights ? j : undefined} data-on={(lights && w.mode === 'still' && w.lit === j) || undefined}
              onPointerEnter={lights ? (e) => e.pointerType === 'mouse' && w.light(j) : undefined} onPointerLeave={lights ? () => w.light(null) : undefined}>
              {it.lead && <strong className="xhp-lead">{it.lead}</strong>}<span><Inline inl={it.inl} /></span>
            </li>
          ))}
        </ul>,
      );
    }
  }
  return (
    <section id={s.id} className={end ? 'xhp-sec xhp-end' : 'xhp-sec'} aria-labelledby={s.id + '-h'} tabIndex={-1}>
      <h2 id={s.id + '-h'} className="xhp-h2"><span className="xhp-sec-n x-mono" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>{s.title}</h2>
      {w && (after || still || what) && <Mini kind={after ? 'after' : still ? 'still' : 'what'} setting={setting} w={w} />}
      {end && <Docs s={s} />}
      {out.map((x) => (x === 'cards' ? <div key="cards" className="xhp-flows">{cards}</div> : x))}
      {end && (
        <A to="/support" className="xhp-next">
          <span>Help Center</span>
          <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </A>
      )}
    </section>
  );
}

/* which part of the document is being read: 03 and 04 get their own panel state */
function useModes(doc) {
  const [cur, setCur] = useState(null);
  const [row, setRow] = useState(null);
  const off = doc.setting ? doc.sections.findIndex((s) => s.title === doc.setting.offTitle) : -1;
  const next = off >= 0 ? doc.sections[off + 1] : null;
  const stillId = next && next.blocks.some((b) => b.k === 'ul' && b.items.some((it) => it.lead)) ? next.id : null;
  // 01 gets its own scene (the setting itself) when the walk belongs to a later section
  const whatId = off > 1 ? doc.sections[0].id : null;
  useEffect(() => {
    const els = doc.sections.map((s) => document.getElementById(s.id)).filter(Boolean);
    const on = new Set();
    const io = new IntersectionObserver((es) => {
      es.forEach((e) => (e.isIntersecting ? on.add(e.target.id) : on.delete(e.target.id)));
      const ids = doc.sections.map((s) => s.id).filter((id) => on.has(id));
      // between two sections the panel keeps the one just read; it returns to the walk only above the first section
      const first = els[0] && els[0].getBoundingClientRect().top > innerHeight * 0.55;
      setCur((prev) => (ids.length ? ids[ids.length - 1] : first ? null : prev));
    }, { rootMargin: '-40% 0px -45% 0px' });
    // each list's hairlines draw in once, as its section arrives
    const seen = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.setAttribute('data-seen', ''); seen.unobserve(e.target); } }), { threshold: 0.25 });
    els.forEach((el) => { io.observe(el); seen.observe(el); });
    // 04: the row being read is the setting the panel lights
    const rows = stillId ? [...document.querySelectorAll('#' + stillId + ' [data-row]')] : [];
    const ro = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) setRow(Number(e.target.getAttribute('data-row'))); }), { rootMargin: '-38% 0px -50% 0px' });
    rows.forEach((r) => ro.observe(r));
    return () => { io.disconnect(); seen.disconnect(); ro.disconnect(); };
  }, [doc, stillId]);
  const ci = doc.sections.findIndex((s) => s.id === cur);
  const si = stillId ? doc.sections.findIndex((s) => s.id === stillId) : -1;
  const mode = off >= 0 && ci === off ? 'after' : si >= 0 && ci >= si ? 'still' : whatId && cur === whatId ? 'what' : 'walk';
  return { cur, mode, row, stillId, whatId, offId: off >= 0 ? doc.sections[off].id : null };
}

function Layout({ doc, w, aside, cur, stillId, offId, whatId }) {
  const body = doc.sections.length > 1 ? doc.sections.slice(0, -1) : doc.sections;
  const last = doc.sections.length > 1 ? doc.sections[doc.sections.length - 1] : null;
  return (
    <main className="xhp">
      <noscript><style>{NOJS}</style></noscript>
      <div className="xhp-g">
        <header className="xhp-hero">
          <nav className="xhp-crumb">
            <ol>
              <li><A to="/support">Help Center</A></li>
              {doc.kicker.split(' · ').slice(1).map((t) => <li key={t}>{t}</li>)}
              <li aria-current="page"><span>{doc.title}</span></li>
            </ol>
          </nav>
          <h1 className="xhp-h1" data-morph-target>
            {/* the cut-in is CSS, so it runs from the first paint; it starts with the line already mostly in its mask, never an empty slot */}
            <span className="x-line"><span className="x-line-in xhp-h1-in">{doc.title}</span></span>
          </h1>
          <p className="xhp-lede">{doc.lede}</p>
          <p className="xhp-kick x-mono">{doc.kicker}</p>
          <nav className="xhp-toc" aria-label={doc.contents.label}>
            <h2 className="xhp-toc-h x-mono">{doc.contents.label}</h2>
            <ol>
              {doc.contents.items.map((c, i) => (
                <li key={c.id}><a href={'#' + c.id}><span className="x-mono">{String(i + 1).padStart(2, '0')}</span><span>{c.text}</span><svg className="xhp-toc-go" viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M8 3v10M4 9l4 4 4-4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg></a></li>
              ))}
            </ol>
          </nav>
        </header>

        <aside className="xhp-aside" ref={aside}>
          {w && <Panel setting={doc.setting} w={w} doc={doc} cur={cur} />}
        </aside>

        <article className="xhp-doc">
          {body.map((s, i) => <Section key={s.id} s={s} i={i} setting={doc.setting} w={w} still={s.id === stillId} after={s.id === offId} what={s.id === whatId} />)}
        </article>
      </div>
      {last && (
        <div className="xhp-close">
          <Section s={last} i={doc.sections.length - 1} setting={doc.setting} w={w} end />
        </div>
      )}
    </main>
  );
}

function Walked({ doc }) {
  const aside = useRef(null);
  const live = useInView(aside, { amount: 0.35 });
  const { cur, mode: read, row, stillId, offId, whatId } = useModes(doc);
  // a step pressed in the text puts the panel on the walk until the reader moves on to another section
  const [force, setForce] = useState(false);
  useEffect(() => { setForce(false); }, [cur]);
  const mode = force ? 'walk' : read;
  const w = useWalk(doc.setting, live, mode, row, () => setForce(true));
  return <Layout doc={doc} w={w} aside={aside} cur={cur} stillId={stillId} offId={offId} whatId={whatId} />;
}

function Plain({ doc }) {
  const { cur } = useModes(doc);
  return <Layout doc={doc} w={null} cur={cur} />;
}

export default function HelpArticle({ doc }) {
  return doc.setting ? <Walked doc={doc} /> : <Plain doc={doc} />;
}
