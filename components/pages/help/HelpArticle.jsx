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
   V2: 8 Nov round 7 (critic 7): the panel shows and the text says (no repeated pair, one switch per screen, phone 04 rows are the checklist, section label is its number), phone mock clipped in its bezel, demo switch hover and press, the close bottom-aligned. Round 6: the walk starts at its step 01 on the server and on the first client paint (no finished state, no rewind); reduced motion shows the walk's last screen through CSS alone, so nothing flips at hydration; phones show "On mobile" from the first paint (both platforms are in the HTML and a media query picks one until a choice is made); screens slide in opaque at 300ms, never cross-fade; 04 has its own object (the four things the switch leaves alone, as a ledger beside the switch off) on the desktop panel and on phones; phones show the settings mock once (01 is the switch alone); presses scale to .98; the 320 tabs share one row; the lower card shows Hanzo's whole "When it is on… When it is off…" pair at a fixed height, so a step tap never moves the page; "More" lists its documents once. Round 5 (critic 7): the handset is tall enough that its switch shows whole when it flips; a pressed step lights that same step and stops autoplay; pressing a step in 02 puts the panel on the walk; one counter at a time; Hanzo's own tab labels; the phone breadcrumb ends on its topic; no box inside a box; the topic line sits under the lede. Round 4: one section counter, 01 its own scene, 04 lit row by row, panel stops above the close, contents rows answer, hairlines on the text edge, the question visible from first paint, no invented labels. Round 3: both switches agree, tabs fit at 320, bars inside both windows, a tap mark on touch, captions reserve two lines, phone 03/04 inline stages. Round 2: the panel follows the reading, the switch answers with the tick and saved line, panel capped to the viewport, 62ch column, real hovers, hairlines that draw in, a quiet closing room */
// Signature: the setting, walked: a live settings panel where a gliding cursor presses through the article's own steps, the matching step lit in the text
// Beyond: try the choice: flip the switch and the panel answers with what that choice means, in the article's own words
// Persona: a Hanzo Chat or Dev user deciding whether their chats and coding sessions may train Hanzo's models
// Goal: find and change "Help improve Hanzo's models" and know what each choice means; metric: none in PLAN-COMPONENTS 1.1 (support page)
// CTA: none of Hanzo's on this page (the action is the setting in the app); text links to Terms of Service, Privacy Policy and privacy@hanzo.ai
// Metric: none assigned (support page); the switch tryout is a demo and sends nothing
import { useEffect, useRef, useState } from 'react';
import { animate, motion, useInView, useMotionValue, useReducedMotion } from 'motion/react';
import { EASE } from '../../ui';
import { A } from '../../kit';
import './HelpArticle.css';

const GLIDE = { duration: 0.5, ease: EASE }; // the hand travels on the deck's ease-emphasis: no spring, no overshoot
// with scripts off, the question and lede show at once and the hand (which needs scripts to walk) is hidden
const NOJS = '.xhp .x-line-in,.xhp-lede{transform:none!important;opacity:1!important}.xhp-hand{display:none!important}.xhp-flow ol{display:block!important}.xhp-ul li::after{transform:none!important}';
const say = (inl) => inl.map((x) => (typeof x === 'string' ? x : x.b || x.t)).join('').replace(/\s+/g, ' ').trim();
const targetsOf = (flow) => flow.steps.flatMap((s, i) => s.targets.map((t) => ({ t, step: i })));
const pad = (v) => String(v).padStart(2, '0');

/* an address Hanzo's page protects: its own link stays in the HTML, and in the browser it becomes a direct mailto */
function Mail({ k }) {
  const ref = useRef(null);
  useEffect(() => { if (ref.current) ref.current.setAttribute('href', k.a); }, [k.a]);
  return <a ref={ref} href={k.cf} className="xhp-a">{k.t}</a>;
}

function Inline({ inl }) {
  return inl.map((k, i) => {
    if (typeof k === 'string') return <span key={i}>{k}</span>; // its own element, so each run of Hanzo's words stands as one line
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
  const mi = setting.flows.findIndex((f) => /mobile/i.test(f.label)); // the phone's own steps, when the article has them
  const [plat, setPlat] = useState(0);
  // the server and the first client paint are both the walk at its step 01 (the switch on), so nothing rewinds; until the
  // page is live both platforms are in the HTML and a media query shows the phone's own on phones (no tab flip)
  const [ready, setReady] = useState(false);
  const [level, setLevel] = useState(0);
  const [aimAt, setAimAt] = useState(0); // the target the hand is on: its step is the one lit
  const [on, setOn] = useState(true);
  const [touched, setTouched] = useState(false); // the reader has pressed, chosen or flipped something
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
  const targets = targetsOf(flow);
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
  // live: on a phone the phone's own steps (already the ones on screen), a touch screen gets the tap mark
  useEffect(() => {
    setTouch(matchMedia('(pointer: coarse)').matches);
    if (mi > 0 && matchMedia('(max-width: 899px)').matches) setPlat(mi);
    setReady(true);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { const t = setTimeout(rest, 40); return () => clearTimeout(t); }, [plat]); // eslint-disable-line react-hooks/exhaustive-deps
  // each part of the document sets the switch, and both switches (in the picture and under it) agree:
  // 01 shows the setting itself (it turns on once), 03 shows it off, 04 turns it off once while its rows stay put,
  // and coming back to the walk starts it again from the top, switched on (with reduced motion it rests there)
  useEffect(() => {
    if (mode === 'walk') {
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
    plat, level, on, auto, press, saved, stage, x, y, flow, targets, active, n, mode, lit: shown, touch, placed, mi,
    pre: !ready && mi > 0, // both platforms in the HTML, a media query picks one (until the page is live)
    rest: mode === 'walk' && level === 0 && !touched, // reduced motion shows the walk's last screen here, by CSS alone
    hold: setHold,
    light: (k) => { if (k === null) { setLitHold(false); return; } setLit(k); setLitHold(true); },
    paused: !auto,
    pause: () => setAuto((v) => !v), // the walk's own pause control (it loops), first in the panel
    platform: (p) => { setTouched(true); if (p === plat) return; setPlat(p); setLevel(0); setAimAt(0); setWant(null); setTimeout(rest, 30); },
    // a pressed step: autoplay stops, the panel switches to the walk (whatever section is in view) and shows that step
    step: (p, i) => {
      setTouched(true); setAuto(false); setPlat(p);
      const k = setting.flows[p].steps.slice(0, i).reduce((m, s) => m + s.targets.length, 0);
      if (mode !== 'walk') stepping.current = true;
      if (onStep) onStep();
      setAimAt(k); setOn(true); setLevel(k); setWant(k);
    },
    flip: () => { setTouched(true); setAuto(false); setOn((o) => !o); setSaved((v) => v + 1); setLevel(n); setAimAt(n - 1); setWant(null); },
  };
}

/* which platform a pre-rendered piece belongs to, while both are in the HTML */
const pfOf = (w, p) => (w.pre ? (p === w.mi ? 'mobile' : 'other') : undefined);

function Screen({ w, setting, p }) {
  const targets = targetsOf(setting.flows[p]);
  const walk = w.mode === 'walk';
  const lv = walk ? Math.min(w.level, 3) : 3;
  const label = (k) => (targets[k] ? targets[k].t : '');
  return (
    <div className="xhp-screen" data-pf={pfOf(w, p)} data-device={p ? 'phone' : 'desk'} data-level={lv} data-mode={w.mode} aria-hidden="true">
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
          {[0, 1, 2, 3].map((k) => <span key={k} className="xhp-skel"><i /><i /></span>)}
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

/* section 04: what the switch leaves alone. The switch, off, above the four things it does not change (Hanzo's own leads),
   each with a mark that it stays as it was; the row being read is lit. Its own object, not the settings screen again. */
function Ledger({ setting, leads, lit, mini }) {
  return (
    <div className={mini ? 'xhp-ledger xhp-ledger-mini' : 'xhp-ledger'} aria-hidden="true">
      <div className="xhp-ledger-h"><span className="xhp-row-t">{setting.name}</span><span className="xhp-sw"><i /></span></div>
      <ul>
        {leads.map((t, k) => (
          <li key={t} data-on={lit === k || undefined}>
            <span>{t}</span>
            <svg viewBox="0 0 16 16" width="16" height="16"><path d="M3 8.5l3.2 3L13 4.5" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Panel({ setting, w, doc, cur, leads }) {
  const calm = useReducedMotion();
  const walk = w.mode === 'walk';
  const si = doc.sections.findIndex((s) => s.id === cur);
  const stepsIdx = doc.sections.findIndex((s) => s.blocks.some((b) => b.k === 'h3' && setting.flows.some((f) => f.label === b.text)));
  const at = walk ? Math.max(stepsIdx, 0) : Math.max(si, 0);
  // until the page is live both platforms are drawn; a media query shows the right one
  const plats = w.pre ? [0, w.mi] : [w.plat];
  const away = w.mode === 'what' || w.mode === 'still'; // 01's scene and 04's ledger draw their own switch: one at a time
  return (
    <div className="xhp-panel" role="group" aria-label={setting.name} data-rest={w.rest || undefined}>
      <div className="xhp-panel-bar">
        <button type="button" className="xhp-pause" aria-pressed={w.paused} aria-label="Pause" onClick={w.pause}>
          {w.paused
            ? <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M5 3.5v9l7-4.5z" fill="currentColor" /></svg>
            : <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M5 3.5v9M11 3.5v9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>}
        </button>
        <div className="xhp-seg" role="radiogroup" aria-label={setting.flows.map((f) => f.label).join(' / ')}>
          {setting.flows.map((f, i) => (
            <button key={f.label} type="button" role="radio" data-pf={pfOf(w, i)} aria-checked={w.plat === i} onClick={() => w.platform(i)}>
              {f.label}
            </button>
          ))}
        </div>
      </div>
      <div className="xhp-stage" data-mode={w.mode} ref={w.stage} onPointerEnter={(e) => e.pointerType === 'mouse' && w.hold(true)} onPointerLeave={() => w.hold(false)}>
        {plats.map((p) => <Screen key={p} w={w} setting={setting} p={p} />)}
        {w.mode === 'after' && <After key="after" calm={calm} />}
        {w.mode === 'still' && leads.length > 0 && <Ledger setting={setting} leads={leads} lit={w.lit} />}
        <motion.span className="xhp-hand" data-touch={w.touch || undefined} data-placed={w.placed || undefined} style={{ x: w.x, y: w.y }} aria-hidden="true">
          {w.press > 0 && <motion.i key={w.press} className="xhp-ring" initial={{ scale: 0.2, opacity: 0.55 }} animate={{ scale: 1.6, opacity: 0 }} transition={{ duration: 0.4, ease: EASE }} />}
          {w.touch
            ? <i className="xhp-tap" />
            : <svg viewBox="0 0 20 24" width="20" height="24"><path d="M2 1.5v17.2l4.6-4.3 3 6.9 3.2-1.4-3-6.8 6.3-.3L2 1.5z" fill="#0a0a0a" stroke="#fff" strokeWidth="1.4" strokeLinejoin="round" /></svg>}
        </motion.span>
      </div>
      {walk
        ? plats.map((p) => {
          const fl = setting.flows[p], total = fl.steps.length, act = p === w.plat ? w.active : 0;
          return (
            <div className="xhp-cap" data-pf={pfOf(w, p)} aria-hidden="true" key={p}>
              {/* the step the hand is on; with reduced motion at rest, the walk's last step (CSS shows one or the other) */}
              <span className="xhp-cap-n x-mono xhp-cap-now">{pad(act + 1) + ' / ' + pad(total)}</span>
              <span className="xhp-cap-t xhp-cap-now" key={p + '-' + act}>{say(fl.steps[act].inl)}</span>
              <span className="xhp-cap-n x-mono xhp-cap-last">{pad(total) + ' / ' + pad(total)}</span>
              <span className="xhp-cap-t xhp-cap-last">{say(fl.steps[total - 1].inl)}</span>
              <span className="xhp-cap-dots" data-walk>{Array.from({ length: total }, (_, i) => <i key={i} data-on={i <= act || undefined} />)}</span>
            </div>
          );
        })
        : (
          <div className="xhp-cap" aria-hidden="true">
            {/* a section: its contents number alone (x / 04 is kept for the walk's steps) */}
            <span className="xhp-cap-n x-mono">{pad(at + 1)}</span>
            <span className="xhp-cap-t" key={'s-' + at}>{doc.sections[at].title}</span>
          </div>
        )}
      {/* the switch and its name only: the text beside the panel says what each choice means (it is not said twice);
          while 01's scene or 04's ledger shows its own switch, this one steps aside so one switch shows at a time */}
      <div className="xhp-try" data-away={away || undefined}>
        <button type="button" role="switch" aria-checked={w.on} className="xhp-try-b" onClick={w.flip} tabIndex={away ? -1 : undefined}>
          <span className="xhp-sw" data-on={w.on || undefined} aria-hidden="true"><i /></span>
          <span>{setting.name}</span>
        </button>
      </div>
    </div>
  );
}

/* on a phone the panel is not beside the text, so 01, 03 and 04 carry their own small object inline: 01 the switch alone,
   turning on once; 03 the line where the switch turns off; 04 the ledger of what it leaves alone. The settings screen
   itself appears once, in the demo at the top. */
function Mini({ kind, setting, w, leads }) {
  const calm = useReducedMotion();
  const here = w.mode === kind;
  if (kind === 'after') return <div className="xhp-mini" aria-hidden="true"><After key={here ? 'play' : 'rest'} calm={calm || !here} /></div>;
  if (kind === 'still') return <div className="xhp-mini xhp-mini-auto" aria-hidden="true"><Ledger setting={setting} leads={leads} lit={here ? w.lit : null} mini /></div>;
  return (
    <div className="xhp-mini xhp-mini-auto" aria-hidden="true">
      <div className="xhp-chip"><span className="xhp-row-t">{setting.name}</span><span className="xhp-sw" data-on={(here ? w.on : true) || undefined}><i /></span></div>
    </div>
  );
}

function Section({ s, i, setting, w, still, after, what, end, leads }) {
  const flows = setting ? setting.flows : [];
  const out = [], cards = [];
  for (let k = 0; k < s.blocks.length; k++) {
    const b = s.blocks[k];
    const f = b.k === 'h3' && s.blocks[k + 1] && s.blocks[k + 1].k === 'ol' && w ? flows.findIndex((x) => x.label === b.text) : -1;
    if (f >= 0) { // a platform's steps: a card whose steps drive the panel; on a phone the two headings are its tabs
      if (!cards.length) out.push('cards');
      cards.push(
        <div key={k} className="xhp-flow" data-pf={pfOf(w, f)} data-on={w.plat === f || undefined}>
          <h3 className="xhp-h3 x-mono"><button type="button" className="xhp-flow-tab" aria-pressed={w.plat === f} onClick={() => w.platform(f)}>{b.text}</button></h3>
          <ol>{s.blocks[k + 1].items.map((it, j) => (
            <li key={j} data-on={(w.plat === f && w.active === j) || undefined}>
              <button type="button" onClick={() => w.step(f, j)}><span className="xhp-step-n x-mono">{pad(j + 1)}</span><span><Inline inl={it.inl} /></span></button>
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
              {lights && <svg className="xhp-row-tick" viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M3 8.5l3.2 3L13 4.5" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>}
            </li>
          ))}
        </ul>,
      );
    }
  }
  return (
    <section id={s.id} className={end ? 'xhp-sec xhp-end' : 'xhp-sec'} aria-labelledby={s.id + '-h'} tabIndex={-1}>
      <h2 id={s.id + '-h'} className="xhp-h2"><span className="xhp-sec-n x-mono" aria-hidden="true">{pad(i + 1)}</span>{s.title}</h2>
      {w && after && <Mini kind="after" setting={setting} w={w} leads={leads} />}
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

function Layout({ doc, w, aside, cur, stillId, offId, whatId, leads }) {
  const body = doc.sections.length > 1 ? doc.sections.slice(0, -1) : doc.sections;
  const last = doc.sections.length > 1 ? doc.sections[doc.sections.length - 1] : null;
  return (
    <main className="xhp" data-pre={(w && w.pre) || undefined}>
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
                <li key={c.id}><a href={'#' + c.id}><span className="x-mono">{pad(i + 1)}</span><span>{c.text}</span><svg className="xhp-toc-go" viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M8 3v10M4 9l4 4 4-4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg></a></li>
              ))}
            </ol>
          </nav>
        </header>

        <aside className="xhp-aside" ref={aside}>
          {w && <Panel setting={doc.setting} w={w} doc={doc} cur={cur} leads={leads} />}
        </aside>

        <article className="xhp-doc">
          {body.map((s, i) => <Section key={s.id} s={s} i={i} setting={doc.setting} w={w} leads={leads} still={s.id === stillId} after={s.id === offId} what={s.id === whatId} />)}
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
  // 04's ledger: Hanzo's own leads for the things the switch leaves alone
  const stillSec = doc.sections.find((s) => s.id === stillId);
  const ul = stillSec && stillSec.blocks.find((b) => b.k === 'ul' && b.items.some((it) => it.lead));
  const leads = ul ? ul.items.map((it) => it.lead).filter(Boolean) : [];
  return <Layout doc={doc} w={w} aside={aside} cur={cur} stillId={stillId} offId={offId} whatId={whatId} leads={leads} />;
}

function Plain({ doc }) {
  const { cur } = useModes(doc);
  return <Layout doc={doc} w={null} cur={cur} />;
}

export default function HelpArticle({ doc }) {
  return doc.setting ? <Walked doc={doc} /> : <Plain doc={doc} />;
}
