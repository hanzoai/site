'use client';
/* /beta/apply (Beta access) and /beta/research (Research access): Hanzo's application, one question at a time.
   Persona: a builder (Beta access) or a researcher (Research access) who wants Hanzo's releases before they ship.
   Goal: answer enough to apply. CTA: Continue, then "Submit application" (data-cta beta.<program>.next / .submit).
   Metric: beta_submitted (sent as an hz-event, the name hanzo.ai uses).
   Signature: the pass fills in. The pass you chose on /beta stands beside the questions with its own film (Enso for
   Beta access, Zen for Research access); every answer lands on it as a line, the film giving up room as the lines
   gather, and a tap on a line takes you back to that question.
   Copy: every question, option, hint, button and screen is hanzo.ai's own (its PROGRAMS, ABOUT and the Portal form),
   word for word, nothing added. The flow is hanzo.ai's too: Math.ceil(questions / 3) answers are needed ("Answer {n}
   more to apply."); Skip only while the rest can still reach that; choosing a single answer moves on after 260 ms;
   letter keys pick, Enter continues, Esc goes back; Exit at the first question; progress = (step + 1, or + 0.5 while
   the question is unanswered) / questions; once enough are answered, "Open App" is offered before the last question.
   Submission never leaves this browser: hanzo.ai would POST the answers to api.hanzo.ai (/v1/form/public/
   hanzo.<program>-apply/responses), which this rebuild never calls (scripts/forms.mjs blocks every non-GET request
   the same way). The answers are kept in this browser and the visitor gets hanzo.ai's own next step for a signed-out
   visitor: "Log in or create an account to save your application.", Create free account, Sign in, Edit answers.
   Motion: the question cuts into its line and the answers slide forward or back with the step (state change); the
   film plays on the pass (idle); lines land on the pass and the film shrinks for them (layout); option and key
   presses answer at once. Reduced motion: no slides, the film holds its poster. */
import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { Cta, Film, Img } from '../kit';
import '../v2/ProgramScale.css';
import './BetaApply.css';

/* hanzo.ai's own definitions, word for word */
const SPEND = ['$0–$20', '$21–$100', '$101–$200', '$201–$1,000', '$1,001+'];
const ABOUT = [
  { id: 'company', q: 'Where do you work?', kind: 'line', to: 'company' },
  { id: 'role', q: 'What is your role?', kind: 'line', to: 'role' },
];
const PROGRAMS = {
  beta: {
    name: 'Beta access', gets: 'New releases before they ship.', film: 'enso',
    asks: [
      { id: 'builds', q: 'What do you build?', kind: 'many', options: ['Web apps', 'Backends and infrastructure', 'AI agents', 'Data and ML', 'Mobile apps', 'Games and creative work', 'Something else'] },
      { id: 'first', q: 'What do you want to try first?', kind: 'many', options: ['Dev, our coding agent', 'Studio, for images, video and sound', 'Enso, the router', 'Kai, decisions', 'Zen models', 'Hanzo Cloud'] },
      { id: 'agents', q: 'Which coding agents do you use today?', kind: 'many', options: ['Claude Code', 'Cursor', 'Codex', 'Hanzo Dev', 'GitHub Copilot', 'None yet', 'Another'] },
      { id: 'cadence', q: 'How often do you use AI?', kind: 'one', options: ['Every day', 'Several times a week', 'Once a week', 'Just getting started'] },
      { id: 'spend', q: 'What do you spend on AI tools a month?', kind: 'one', options: SPEND },
      { id: 'blurb', q: 'Tell us about what you’re working on and why you want to use Hanzo', kind: 'long' },
    ],
  },
  research: {
    name: 'Research access', gets: 'Research models and checkpoints to evaluate before release.', film: 'zen',
    asks: [
      { id: 'want', q: 'Which research do you want to evaluate?', kind: 'many', options: ['Kai multimodal decisions', 'The next Zen', 'Enso routing policies', 'Creative models: video, image, 3D, sound', 'Something else'] },
      { id: 'where', q: 'Where would you run it?', kind: 'one', options: ['Hanzo Cloud, by API', 'Your own cloud', 'On premises or air-gapped', 'Not sure yet'] },
      { id: 'who', q: 'Who are you evaluating for?', kind: 'one', options: ['A company', 'A university or lab', 'Myself'] },
      { id: 'publish', q: 'Will you publish what you find?', kind: 'one', options: ['Yes, publicly', 'Inside my organization', 'Not sure'] },
      { id: 'task', q: 'What will you evaluate it on?', kind: 'long' },
      { id: 'blurb', q: 'Tell us about your research goals and why you want model access', kind: 'long' },
      { id: 'links', q: 'Anything we should read?', kind: 'line' },
    ],
  },
};
const KEYS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const STORE = 'hz-beta-apply'; // this browser only: { program, step, got, filed }
const EASE = [0.16, 1, 0.3, 1];
const said = (v) => (Array.isArray(v) ? v.join(', ') : (v ?? '').trim());
const answered = (a, v) => (a.kind === 'many' ? Array.isArray(v) && v.length > 0 : said(v) !== '');
const read = () => { try { return JSON.parse(localStorage.getItem(STORE) || 'null'); } catch { return null; } };
const keep = (v) => { try { localStorage.setItem(STORE, JSON.stringify(v)); } catch { /* private window: the form still works */ } };
const event = (name, detail) => dispatchEvent(new CustomEvent('hz-event', { detail: { name, ...detail, path: location.pathname } }));

const ArrowR = ({ s = 15 }) => <svg viewBox="0 0 16 16" width={s} height={s} aria-hidden="true"><path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>;
const ArrowL = () => <svg viewBox="0 0 16 16" width="15" height="15" aria-hidden="true"><path d="M13 8H4M7.5 4.5 4 8l3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>;
const Check = () => <svg className="xba-check" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M6 12.5l4 4 8-9" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>;

/* calls on(parent element) once, when its step mounts (the focus that follows a step) */
function Mount({ on }) {
  const ref = useRef(null);
  useEffect(() => { on(ref.current?.parentElement); }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return <span ref={ref} hidden />;
}

/* hanzo.ai's progress: three bars filling in turn */
function Bars({ done, total }) {
  const a = 3 * Math.min(1, done / total);
  return (
    <div className="xba-bars" role="progressbar" aria-label="Application progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round((done / total) * 100)}>
      {[0, 1, 2].map((r) => <span key={r} aria-hidden="true"><i style={{ transform: `scaleX(${Math.max(0, Math.min(1, a - r))})` }} /></span>)}
    </div>
  );
}

/* The pass: the film, the pass's name and promise, and a line for every answer (a tap goes back to its question). */
function Pass({ p, asks, got, at, go, open }) {
  const lines = asks.map((a, i) => [a, i]).filter(([a]) => answered(a, got[a.id]));
  return (
    <aside className="xba-pass" data-room="dark" aria-label={p.name}>
      <motion.div layout="position" className="xba-pass-m" transition={{ duration: 0.45, ease: EASE }}>
        <Film src={`/models/${p.film}.webm`} poster={`/models/${p.film}.webp`} w={1200} h={1500} className={'xba-film ' + p.film} />
      </motion.div>
      <motion.div layout="position" className="xba-pass-b" transition={{ duration: 0.45, ease: EASE }}>
        <p className="xba-pass-t">{p.name}</p>
        <p className="xba-pass-d">{p.gets}</p>
      </motion.div>
      <ol className="xba-lines">
        <AnimatePresence initial={false}>
          {lines.map(([a, i]) => {
            const v = got[a.id];
            const keys = a.options && (Array.isArray(v) ? v : [v]).map((o) => KEYS[a.options.indexOf(o)]).filter(Boolean).join(' ');
            return (
              <motion.li key={a.id} layout="position" initial={{ opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -14 }} transition={{ duration: 0.35, ease: EASE }}>
                <button type="button" className={'xba-line' + (i === at && open ? ' on' : '')} aria-label={a.q} onClick={() => go(i)} data-sound="tick">
                  {keys && <span className="xba-line-k x-mono" aria-hidden="true">{keys}</span>}
                  <span className="xba-line-v">{said(v)}</span>
                </button>
              </motion.li>
            );
          })}
        </AnimatePresence>
      </ol>
    </aside>
  );
}

function Apply({ program }) {
  const p = PROGRAMS[program];
  const asks = useMemo(() => [...p.asks, ...ABOUT], [p]);
  const n = asks.length;
  const router = useRouter();
  const calm = useReducedMotion();
  const [step, setStep] = useState(0);
  const [got, setGot] = useState({});
  const [dir, setDir] = useState(1);
  const [gate, setGate] = useState(false); // hanzo.ai's signed-out next step, after "Submit application"
  const [filed, setFiled] = useState(false);
  const [busy, setBusy] = useState(false);
  const [trap, setTrap] = useState(''); // the honeypot ("Leave this empty")
  const [ready, setReady] = useState(false);
  const timer = useRef(0);
  const gateH = useRef(null);

  // resume this browser's application to the same programme (a filed one opens at its first question, as on hanzo.ai)
  useEffect(() => {
    const d = read();
    if (d && d.program === program && d.got && typeof d.got === 'object') {
      setGot(d.got);
      setFiled(!!d.filed);
      setStep(d.filed ? 0 : Math.min(Math.max(0, d.step | 0), n - 1));
    }
    setReady(true);
  }, [program, n]);
  useEffect(() => { if (ready) keep({ program, step, got, filed }); }, [ready, program, step, got, filed]);

  const ask = gate ? null : asks[step];
  const last = step === n - 1;
  const has = !!ask && answered(ask, got[ask.id]);
  const need = Math.ceil(n / 3);
  const count = asks.filter((a) => answered(a, got[a.id])).length;
  const enough = count >= need;
  const canSkip = count + (n - step - 1) >= need;

  // each step: back to the top, and focus on the answer (hanzo.ai's #beta-answer) once the new step has mounted
  const moved = useRef(false); // arriving: no ring on the first option before anyone acts
  useEffect(() => { if (moved.current) window.scrollTo({ top: 0 }); }, [step, gate]);
  const land = (el) => { if (el && moved.current) setTimeout(() => (gate ? gateH.current : el.querySelector('#beta-answer'))?.focus({ preventScroll: true }), 30); };
  useEffect(() => () => clearTimeout(timer.current), []);

  const to = (i) => { clearTimeout(timer.current); moved.current = true; setDir(i >= step ? 1 : -1); setStep(i); };
  const set = (id, v) => setGot((g) => ({ ...g, [id]: v }));
  const exit = () => {
    const nav = performance.getEntriesByType?.('navigation')[0];
    const landed = nav ? new URL(nav.name).pathname.replace(/\/$/, '') : '';
    const here = location.pathname.replace(/\/$/, '');
    let ref = false;
    try { ref = !!document.referrer && new URL(document.referrer).origin === location.origin; } catch { /* no referrer */ }
    if ((ref || landed !== here) && history.length > 1) history.back();
    else router.push('/beta');
  };
  const back = () => (step > 0 ? to(step - 1) : exit());
  const submit = () => {
    if (!enough || busy) return;
    setBusy(true);
    // hanzo.ai sends the answers to api.hanzo.ai here; this rebuild sends nothing and keeps them in this browser
    setTimeout(() => {
      setFiled(true);
      setBusy(false);
      if (!trap) event('beta_submitted', { program });
      setDir(1);
      moved.current = true;
      setGate(true);
    }, 420);
  };
  const next = () => (last ? submit() : to(step + 1));
  const pick = (a, o) => {
    if (a.kind === 'one') {
      set(a.id, o);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => { moved.current = true; setDir(1); setStep((s) => (s === asks.indexOf(a) && s < n - 1 ? s + 1 : s)); }, 260);
      return;
    }
    const cur = Array.isArray(got[a.id]) ? got[a.id] : [];
    set(a.id, cur.includes(o) ? cur.filter((x) => x !== o) : [...cur, o]);
  };
  const edit = () => { moved.current = true; setGate(false); setFiled(false); setDir(-1); setStep(n - 1); };

  // one solid at a time: while the form's own solid (Continue, Submit application, Create free account) shows, the
  // header's Try Hanzo reads as an outline (the html[data-ask=quiet] the shell uses), after the shell's own first pass
  const solid = gate || has;
  useEffect(() => {
    const H = document.documentElement;
    const apply = () => { if (solid) H.dataset.ask = 'quiet'; else if (H.dataset.ask === 'quiet') delete H.dataset.ask; };
    apply();
    const ts = [300, 1400].map((ms) => setTimeout(apply, ms));
    return () => { ts.forEach(clearTimeout); if (H.dataset.ask === 'quiet') delete H.dataset.ask; };
  }, [solid]);

  // the keys hanzo.ai answers: Esc back, Enter on, a letter picks
  useEffect(() => {
    const on = (e) => {
      if (gate || e.defaultPrevented) return;
      const inField = e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement;
      if (e.key === 'Escape') { e.preventDefault(); back(); return; }
      if (e.key === 'Enter') {
        if (ask?.kind === 'long' && e.shiftKey) return; // a new line
        const ctl = e.target.closest?.('a, button');
        if (ctl && !ctl.classList.contains('xba-opt')) return; // a focused Back, Skip, Open App or link does its own thing
        e.preventDefault();
        if (has || (last && enough)) next();
        return;
      }
      if (ask?.options && !inField && e.key.length === 1 && !e.metaKey && !e.ctrlKey && !e.altKey) {
        const i = KEYS.indexOf(e.key.toUpperCase());
        if (i >= 0 && i < ask.options.length) { e.preventDefault(); pick(ask, ask.options[i]); }
      }
    };
    addEventListener('keydown', on);
    return () => removeEventListener('keydown', on);
  });

  const done = step + (has ? 1 : 0.5);
  const pct = Math.round((done / n) * 100);
  // the same targets with or without reduced motion (so the server's HTML matches); reduced motion only drops the travel
  const slide = { initial: { opacity: 0, y: calm ? 0 : dir * 28 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: calm ? 0 : dir * -20 }, transition: { duration: calm ? 0 : 0.32, ease: EASE } };
  const cut = { initial: { y: calm ? 0 : dir > 0 ? '104%' : '-104%' }, animate: { y: 0 }, transition: { duration: calm ? 0 : 0.5, ease: EASE } };

  return (
    <main className={'xp xba ' + program}>
      <div className="xp-wrap xba-in">
        <Pass p={p} asks={asks} got={got} at={step} open={!gate} go={(i) => { setGate(false); to(i); }} />
        <section className="xba-form" aria-label="Apply to the Hanzo beta">
          {gate ? (
            <motion.div key="gate" className="xba-gate" {...slide}><Mount on={land} />
              <h1 ref={gateH} tabIndex={-1} className="xba-q">Log in or create an account to save your application.</h1>
              <p className="xba-gate-p">A Pro plan is not required — you can continue free. Log in or create a free account to save your application and see your place in line.</p>
              <div className="xba-gate-a">
                <Cta to={`/signup?next=${encodeURIComponent('/beta')}`} id={`beta.${program}.signup`}>Create free account<ArrowR s={16} /></Cta>
                <Cta to={`/login?next=${encodeURIComponent('/beta')}`} kind="quiet" id={`beta.${program}.login`}>Sign in</Cta>
                <button type="button" className="xba-quiet" onClick={edit}>Edit answers</button>
              </div>
            </motion.div>
          ) : (
            <>
              <div className="xba-top">
                <div className="xba-top-r">
                  <span className="xba-top-n x-mono"><Img src={`/models/${p.film}.webp`} w={1200} h={1500} alt="" className={'xba-thumb ' + p.film} />{p.name}</span>
                  <span className="xba-top-p x-mono">{pct}%</span>
                </div>
                <Bars done={done} total={n} />
              </div>
              <AnimatePresence mode="wait" initial={false}>
                <motion.div key={program + '-' + ask.id} className="xba-step" {...slide}><Mount on={land} />
                  <div className="xba-head">
                    <h1 className="xba-q"><span className="xba-cut"><motion.span {...cut}>{ask.q}</motion.span></span></h1>
                    {ask.kind === 'many' ? <p className="xba-hint">Choose as many as fit.</p> : null}
                  </div>
                  {ask.options ? (
                    <div className={'xba-opts' + (ask.options.length > 4 ? ' two' : '')} role={ask.kind === 'one' ? 'radiogroup' : 'group'} aria-label={ask.q}>
                      {ask.options.map((o, i) => {
                        const v = got[ask.id];
                        const on = Array.isArray(v) ? v.includes(o) : v === o;
                        return (
                          <button key={o} id={i === 0 ? 'beta-answer' : undefined} type="button" className={'xba-opt' + (on ? ' on' : '')} role={ask.kind === 'one' ? 'radio' : 'checkbox'} aria-checked={on} onClick={() => pick(ask, o)} data-sound="tick">
                            <span className="xba-key x-mono" aria-hidden="true">{KEYS[i]}</span>
                            <span className="xba-opt-t">{o}</span>
                            <Check />
                          </button>
                        );
                      })}
                    </div>
                  ) : ask.kind === 'long' ? (
                    <textarea id="beta-answer" className="xba-field long" rows={5} placeholder="Type your answer…" aria-label={ask.q} value={got[ask.id] ?? ''} onChange={(e) => set(ask.id, e.target.value)} />
                  ) : (
                    <input id="beta-answer" className="xba-field" type="text" placeholder="Type your answer…" aria-label={ask.q} autoComplete={ask.to === 'company' ? 'organization' : ask.to === 'role' ? 'organization-title' : 'off'} value={got[ask.id] ?? ''} onChange={(e) => set(ask.id, e.target.value)} />
                  )}
                </motion.div>
              </AnimatePresence>
              <div className="xba-acts">
                {step === 0
                  ? <Cta kind="quiet" onClick={exit} id={`beta.${program}.exit`}>Exit</Cta>
                  : <Cta kind="quiet" onClick={back} id={`beta.${program}.back`}><ArrowL />Back</Cta>}
                {enough ? null : <p className="xba-left" aria-live="polite">Answer {need - count} more to apply.</p>}
                <div className="xba-acts-r">
                  {enough && !last && <Cta to="/chat?skip=login" kind="quiet" id={`beta.${program}.open-app`} className="xba-app" onClick={() => keep({ program, step, got, filed: true })}>Open App<ArrowR s={14} /></Cta>}
                  {has
                    ? <Cta onClick={next} disabled={busy} id={`beta.${program}.${last ? 'submit' : 'next'}`}>{last ? (busy ? 'Submitting…' : 'Submit application') : 'Continue'}{!last && <ArrowR />}</Cta>
                    : <Cta kind="quiet" disabled={busy || !canSkip} onClick={() => (last ? enough && submit() : to(step + 1))} id={`beta.${program}.skip`}>Skip</Cta>}
                </div>
              </div>
              <label className="xba-trap" aria-hidden="true">
                <span>Leave this empty</span>
                <input tabIndex={-1} autoComplete="off" name="website" value={trap} onChange={(e) => setTrap(e.target.value)} />
              </label>
            </>
          )}
        </section>
      </div>
    </main>
  );
}

export function BetaAccess() { return <Apply program="beta" />; }
export function ResearchAccess() { return <Apply program="research" />; }
