'use client';
/* Grants & Research. Its idea is the stack of ways in: contribute, research, intern.
   Persona: an open-source contributor, PhD researcher or research intern (PLAN-COMPONENTS 1.1 researcher row). Goal:
   apply for credits or an internship. CTA: "Apply for a Grant" (the form on this page). Metric: lead_submit.
   V2: motion map (7 Nov): the pinned sheet stack is gone; the three ways now stamp down as plain sheets, and each section enters its own way.
   Signature: stamp: the three ways' sheets land with weight (a short drop, a squash, a settle, the number pressed in
   after, an impression ring); a click or tap stamps a sheet again from that point; each answer is pressed onto the
   filing card as it is typed.
   Entrances: grid-wave (hero art: tiles clear by distance from the pointer, and ripple again where pointed or tapped),
   stack-drop (How grants work), pixel-resolve (What recipients receive), cover-slide (Three ways: the dark room slides
   up over the ledger), shrink-to-card (the application folds into a card as you leave it). Built in grants/enter.*.
   Beyond: your application, as it will be sent. Beside the form a card writes itself as you type, under the form's
   own labels: the track and exactly the fields that will be sent.
   Motion: stamp (signature) + the five entrances + the timeline drawing across + ticks drawn on the ledger
   + the track chip gliding.
   0 UI hues. The form sends what hanzo.ai sends. Every word is Hanzo's. */
import { useEffect, useRef, useState } from 'react';
import type { ChangeEvent, FormEvent, KeyboardEvent } from 'react';
import { motion, AnimatePresence, useInView, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { A, Cta, Field, Tick } from '../kit';
import Sigil from '../Sigil';
import LineReveal, { NoJs } from '../v2/LineReveal';
import { TRACKS, apply } from './Grants.apply';
import type { Fields } from './Grants.apply';
import { track as fire } from '../../lib/track';
import '../v2/ProgramScale.css';
import usePhoneAsk from './usePhoneAsk';
import useEnter from './grants/enter';
import './Grants.css';
import './grants/enter.css';

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
const STEPS = [
  ['Apply or Contribute', 'Share your open-source PRs, repository, or academic research topic'],
  ['Fast-Track Review', 'Our engineering and research leads review applications weekly'],
  ['Credits & Team Access', 'Receive free API & GPU credits plus full access to Hanzo Team'],
  ['Ship in the Open', 'Publish open code, models, and papers under your own name'],
];
const pad = (n: number) => String(n).padStart(2, '0');
const TILES = Array.from({ length: 42 }, (_, i) => i);
/* pixel-resolve blocks, each with a fixed scattered delay (same on server and client) */
const blocks = (n: number, span: number) => Array.from({ length: n }, (_, i) => <span key={i} style={{ '--d': Math.round(((i * 7) % n) * (span / n)) + 'ms' }} />);

/* the sigil reads its ink once when drawn: a theme flip (the html class) draws it again in the new ink */
function useTheme() {
  const [t, setT] = useState(0);
  useEffect(() => {
    const html = document.documentElement;
    let light = html.classList.contains('light');
    const mo = new MutationObserver(() => { const l = html.classList.contains('light'); if (l !== light) { light = l; setT((n) => n + 1); } });
    mo.observe(html, { attributes: true, attributeFilter: ['class'] });
    return () => mo.disconnect();
  }, []);
  return t;
}

function Hero() {
  const [paused, setPaused] = useState(false);
  const theme = useTheme();
  return (
    <section className="xgr-hero" data-enter="grid-wave" aria-labelledby="xgr-h1">
      <div className="xp-wrap xp-grid">
        <div className="xgr-copy">
          <LineReveal as="h1" id="xgr-h1" className="xp-display md" lines={['Open Source & Research', 'Credit Grants']} />
          <div className="xgr-rise">{/* CSS rise from the server HTML: never waits for JS, never starts invisible */}
            <p className="xp-lede xgr-lede">Free API credits, GPU compute, and Hanzo Team access for open-source contributors, academic PhD researchers, and research interns.</p>
            <div className="xgr-acts">
              <Cta to="/grants#apply" id="grants.hero" thumb className="xp-cta">Apply for a Grant</Cta>
              <A to="/careers#internships" className="xgr-link">Academic Internships</A>
            </div>
          </div>
        </div>
        <div className="xgr-art xgr-rise late">
          <svg className="xgr-static" viewBox="0 0 400 400" preserveAspectRatio="xMidYMid slice" aria-hidden="true">{[40, 72, 104, 136, 168, 200, 232].map((r) => <ellipse key={r} cx="230" cy="210" rx={r * 1.15} ry={r * 0.85} fill="none" stroke="currentColor" strokeOpacity=".22" />)}</svg>
          <Sigil key={(paused ? 'still' : 'live') + theme} seed="grants" data={[2137, 122, 4]} className="xgr-sigil" still={paused} />
          <div className="xgr-grid" aria-hidden="true">{TILES.map((i) => <span key={i} />)}</div>
          <span className="xgr-art-k x-mono">Grants &amp; Research</span>
          <button type="button" className="xgr-pause" aria-pressed={paused} aria-label={paused ? 'Play' : 'Pause'} onClick={() => setPaused((v) => !v)}>
            {paused ? <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M5 3.5v9l7-4.5z" fill="currentColor" /></svg> : <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M5 3.5v9M11 3.5v9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>}
          </button>
        </div>
      </div>
    </section>
  );
}

/* The four steps as one line your scroll draws across; each step lights as the line reaches it. */
function How() {
  const ref = useRef(null);
  const calm = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 85%', 'end 45%'] });
  // nothing here branches on the preference while rendering (it would differ from the server): the effect lights every
  // step after mount, and CSS draws the full line under reduced motion
  const line = useTransform(scrollYProgress, (v) => Math.min(1, Math.max(0, v)));
  const [at, setAt] = useState(-1);
  useMotionValueEvent(line, 'change', (v) => setAt(v < 0.02 ? -1 : Math.min(3, Math.floor(v * 4)))); // step i sits at i/4 of the line
  useEffect(() => { if (calm) setAt(3); }, [calm]);
  return (
    <section ref={ref} className="xp-sec tight xgr-how" data-enter="stack-drop" aria-labelledby="xgr-how-h">
      <div className="xp-wrap">
        <h2 id="xgr-how-h" className="xp-head xgr-how-h">How grants work</h2>
        <div className="xgr-line" aria-hidden="true"><motion.i style={{ scaleX: line }} /></div>
        <ol className="xgr-steps">
          {STEPS.map(([t, d], i) => (
            <li key={t} className={at >= i ? 'on' : ''}>
              <span className="xgr-dot" aria-hidden="true" />
              <h3 className="xp-title">{t}</h3>
              <p className="xp-body">{d}</p>
              <span className="xgr-n x-mono">{pad(i + 1)} / 04</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

const GETS = [
  ['Free API & Compute Credits', 'Receive free Hanzo Cloud, LLM API, and GPU compute credits for your open-source project, university lab, or dissertation research.'],
  ['Full Hanzo Team Access', 'Get complimentary Hanzo Team workspaces, Hanzo Dev coding agents, and direct collaboration channels with our core research and systems engineers.'],
  ['Open Weights & Papers', 'Everything you research or contribute ships in the open under your own name — open-source repositories, checkpoints, and peer-reviewed papers.'],
  ['Frontier Checkpoints & Infra', 'Early access to Zen foundation models, Kai decision models, Enso routing policies, and distributed training / evaluation clusters.'],
];

/* one row of the ledger: it lights, and its tick draws, as it scrolls into view */
function Get({ t, d, i, lit }: { t: string; d: string; i: number; lit: (k: number) => void }) {
  const ref = useRef(null);
  const on = useInView(ref, { once: true, amount: 0.6 });
  useEffect(() => { if (on) lit(i + 1); }, [on]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <li ref={ref} className={on ? 'on' : ''}>
      <span className="xgr-gets-n x-mono">{pad(i + 1)}</span>
      <h3 className="xp-title">{t}</h3>
      <p className="xp-body">{d}</p>
      <span className="xgr-gets-t"><Tick /></span>
    </li>
  );
}

function Gets() {
  // the head stays beside the ledger and counts the rows as they light: 01 / 04 up to 04 / 04
  const [n, setN] = useState(0);
  const lit = (k: number) => setN((v) => Math.max(v, k));
  return (
    <section className="xp-sec tight xgr-gets" data-enter="pixel-resolve" aria-labelledby="xgr-gets-h">
      <div className="xp-wrap xp-grid">
        <div className="xgr-gets-l">
          <h2 id="xgr-gets-h" className="xp-head">What Grant Recipients &amp; Interns Receive</h2>
          <p className="xp-lede">Compute, models, and workspaces to ship open research and open-source software.</p>
          <p className="xgr-gets-fig" aria-hidden="true">
            <span className="xgr-gets-roll">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span key={n} initial={{ y: '70%', opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: '-70%', opacity: 0 }} transition={{ duration: 0.3, ease: EASE }}>{pad(Math.max(1, n))}</motion.span>
              </AnimatePresence>
            </span>
            <small className="x-mono">/ 04</small>
          </p>
        </div>
        <div className="xgr-pix">
          <ul className="xgr-gets-g xgr-sheetlist">
            {GETS.map(([t, d], i) => <Get key={t} t={t} d={d} i={i} lit={lit} />)}
          </ul>
          <div className="xgr-pix-b f" aria-hidden="true">{blocks(48, 300)}</div>
          <div className="xgr-pix-b c" aria-hidden="true">{blocks(12, 240)}</div>
        </div>
      </div>
    </section>
  );
}

// a way in: key, title, facts line, description, ask, and its own link (label, address)
type Way = [key: string, title: string, meta: string, text: string, ask: string, more: [label: string, to: string]];
const WAYS: Way[] = [
  ['oss', 'Open Source Contributor Grants', '1700+ repositories · 38 organizations', 'We always welcome and accept open-source contributors across our repositories on GitHub and git.hanzo.ai. Ship pull requests, maintain SDKs or MCP servers, or build open-source tools powered by Hanzo to receive recurring API, Cloud, and Dev credit grants.', 'Apply as OSS Contributor', ['Explore Repositories', '/open-source']],
  ['academic', 'Academic & PhD Research Grants', 'PhD students · University labs · Independent researchers', 'Investigating foundation models, RLHF/post-training, ML compilers, post-quantum cryptography, or agentic systems? Approved academic researchers receive free API & compute credits and full access to Hanzo Team for their research.', 'Apply for Research Credits', ['Research Access Questionnaire', '/beta/research']],
  ['internship', 'Academic & PhD Research Internships', 'Remote / SF · Year-round cohorts', 'Looking to intern with our research and systems teams during your PhD or graduate studies? Work directly on Zen, Kai, Enso, Hanzo Engine, and Hanzo Dev — with free compute credits, Hanzo Team access, and co-authored publications.', 'Apply for Internship', ['View Internship Role', '/careers/academic-research-intern']],
];

/* One sheet of the stack: it pins, and settles back while the next one slides over it. The list's own progress
   drives it (sheet i over i/n to (i+1)/n), since a pinned sheet's own progress stands still. */
/* Each way's own facts (its meta line, Hanzo's words) as the sheet's object: the first as a figure, the rest as chips. */
function Facts({ meta }: { meta: string }) {
  const [first, ...rest] = meta.split(' · ');
  const num = /^[\d,]+/.test(first);
  return (
    <div className="xgr-facts">
      <p className="xgr-way-m x-mono x-sr">{meta}</p>
      <span className={'xgr-fact-big' + (num ? ' num' : '')} aria-hidden="true">{num ? <><span className="xgr-count">{first.split(' ')[0]}</span><small>{first.split(' ').slice(1).join(' ')}</small></> : first}</span>
      <span className="xgr-fact-chips" aria-hidden="true">{rest.map((r) => <em key={r}>{r}</em>)}</span>
    </div>
  );
}

/* One sheet: it stamps down once in view, and again wherever it is clicked or tapped (grants/enter.js). */
function Sheet({ way, i, pick }: { way: Way; i: number; pick: (k: string) => void }) {
  const [k, t, meta, d, cta, [more, to]] = way;
  return (
    <li className="xgr-sheet-li" data-stamp="">
      <article className={'xgr-sheet s' + i} data-room={i === 1 ? undefined : 'light'}>
        <div className="xgr-sheet-o">
          <span className="xgr-sheet-n xp-fig" aria-hidden="true">{pad(i + 1)}</span>
          <Facts meta={meta} />
        </div>
        <div className="xgr-sheet-b">
          <h3 className="xp-display sm xgr-way-t">{t}</h3>
          <p className="xp-lede xgr-way-d">{d}</p>
          <div className="xgr-way-a">
            <Cta to="/grants#apply" kind="quiet" id={'grants.' + k} onClick={() => pick(k)} className="xp-ghost">{cta}</Cta>
            <A to={to} className="xgr-link">{more}</A>
          </div>
        </div>
        <i className="xgr-ink" aria-hidden="true" />
      </article>
    </li>
  );
}

function Ways({ pick }: { pick: (k: string) => void }) {
  return (
    <section className="xp-sec xp-dark xgr-ways" data-room="dark" data-enter="cover-slide" aria-labelledby="xgr-ways-h">
      <div className="xp-wrap">
        <div className="xp-grid xgr-ways-head">
          <h2 id="xgr-ways-h" className="xp-head">Three Ways to Build &amp; Research with Us</h2>
          <p className="xp-lede">Whether you are contributing PRs to our open-source repos, running PhD experiments, or applying for a research internship.</p>
        </div>
        <ol className="xgr-stack">
          {WAYS.map((w, i) => <Sheet key={w[0]} way={w} i={i} pick={pick} />)}
        </ol>
      </div>
    </section>
  );
}

const FIELDS: [key: keyof Fields, label: string, placeholder: string, type: string, required: boolean][] = [
  ['name', 'Full Name', 'Ada Lovelace', 'text', true],
  ['email', 'Email (.edu or work/personal)', 'ada@university.edu', 'email', true],
  ['affiliation', 'University / Lab / Open Source Project', 'e.g. Stanford AI Lab, MIT CSAIL, or hanzoai/engine', 'text', false],
  ['github', 'GitHub / Forge Profile or PR Links', 'https://github.com/...', 'text', false],
  ['scholar', 'Google Scholar / ArXiv / Personal Website (optional)', 'https://scholar.google.com/...', 'text', false],
];
const EMPTY: Fields = { name: '', email: '', affiliation: '', github: '', scholar: '', summary: '' };

// the arrows move between the program tracks
const STEP: Record<string, number> = { ArrowRight: 1, ArrowLeft: -1 };

function Apply({ track, setTrack }: { track: string; setTrack: (k: string) => void }) {
  const [f, setF] = useState<Fields>(EMPTY);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [bad, setBad] = useState<Partial<Record<keyof Fields, boolean>>>({});
  const [offline, setOffline] = useState(false);
  useEffect(() => {
    const f = () => setOffline(!navigator.onLine);
    f(); addEventListener('online', f); addEventListener('offline', f);
    return () => { removeEventListener('online', f); removeEventListener('offline', f); };
  }, []);
  const form = useRef<HTMLFormElement>(null);
  const on = (k: keyof Fields) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setF((o) => ({ ...o, [k]: e.target.value }));
  const role = TRACKS.find(([k]) => k === track)![2]; // track is always one of TRACKS' keys
  const send = async (e: FormEvent) => {
    e.preventDefault();
    if (busy) return;
    const r = apply(track, f);
    if (r.error) {
      const b = { name: !f.name.trim(), email: !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.trim()), summary: !f.summary.trim() };
      setBad(b); setErr(r.error);
      const first = (['name', 'email', 'summary'] as const).find((k) => b[k]);
      form.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    setBad({}); setErr(null); setBusy(true);
    try {
      const res = await fetch('https://api.hanzo.ai/v1/marketing/leads', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(r.lead) });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      fire('grant_application_submitted', { track, role });
      setDone(true);
    } catch (e) { fire('grant_application_submitted', { track, role, error: String(e) }); setErr('Your application did not reach us. Please try again, or email grants@hanzo.ai.'); } finally { setBusy(false); }
  };
  const keys = (e: KeyboardEvent) => {
    const d = STEP[e.key];
    if (!d) return;
    e.preventDefault();
    const i = (TRACKS.findIndex(([k]) => k === track) + d + 3) % 3;
    setTrack(TRACKS[i][0]); document.getElementById('xgr-t-' + i)?.focus();
  };
  const label = TRACKS.find(([k]) => k === track)![1];
  const shown = [['Program Track', label], ['Full Name', f.name], ['Email (.edu or work/personal)', f.email], ['University / Lab / Open Source Project', f.affiliation], ['GitHub / Forge Profile or PR Links', f.github], ['Google Scholar / ArXiv / Personal Website (optional)', f.scholar], ['Research Proposal, OSS Contributions, or Internship Goals', f.summary]];
  return (
    <section className="xp-sec xgr-apply" id="apply" data-enter="shrink-to-card" aria-labelledby="xgr-apply-h">
      <div className="xp-wrap xgr-apply-in">
        <div className="xgr-apply-l">
          <h2 id="xgr-apply-h" className="xp-head xgr-apply-h">Apply for Credits or a Research Internship</h2>
          <p className="xp-lede xgr-apply-p">Tell us about your open-source contributions, academic research, or internship goals. We review submissions every week.</p>
          <div className={'xgr-file' + (Object.values(f).some((v) => v.trim()) ? ' some' : '')} aria-label="Apply for Credits or a Research Internship">
            <dl>
              {shown.map(([k, v]) => (
                <div key={k} className={v && v.trim() ? 'on' : ''}><dt>{k}</dt><dd>{v && v.trim() ? v : '—'}</dd></div>
              ))}
            </dl>
          </div>
          <p className="xgr-mail"><span>Or email us directly at</span> <a href="mailto:careers@hanzo.ai">careers@hanzo.ai</a></p>
        </div>
        <AnimatePresence mode="wait" initial={false}>
          {done ? (
            <motion.div key="ok" className="xgr-ok" role="status" tabIndex={-1} ref={(el) => el?.focus()} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: EASE }}>
              <span className="xgr-ok-i" aria-hidden="true">✓</span>
              <h3>Application Received</h3>
              <p>Thank you for applying! Our research and open-source team will review your submission and follow up at <b>{f.email}</b> with your credit grant and Hanzo Team access details.</p>
              <Cta kind="quiet" id="grants.again" className="xp-ghost" onClick={() => { setDone(false); setF(EMPTY); }}>Submit Another Application</Cta>
            </motion.div>
          ) : (
            <motion.form key="form" ref={form} className="xgr-form" onSubmit={send} noValidate exit={{ opacity: 0, y: -10, transition: { duration: 0.15 } }}>
              <div className="xgr-tracks-w">
                <p className="xgr-lab" id="xgr-track-l">Program Track</p>
                <div className="xgr-tracks" role="radiogroup" aria-labelledby="xgr-track-l" onKeyDown={keys}>
                  {TRACKS.map(([k, label], i) => (
                    <button key={k} id={'xgr-t-' + i} type="button" data-sound="tick" role="radio" aria-checked={track === k} tabIndex={track === k ? 0 : -1} onClick={() => setTrack(k)}>
                      {track === k && <motion.span layoutId="xgr-track" className="xgr-track-bg" transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }} />}
                      <span>{label}</span>
                    </button>
                  ))}
                </div>
              </div>
              {FIELDS.map(([k, label, ph, type, req]) => (
                <Field key={k} className={'xgr-f ' + k} label={label} name={k} type="text" inputMode={type === 'email' ? 'email' : undefined} placeholder={ph} aria-required={req || undefined} aria-invalid={bad[k] ? 'true' : undefined} value={f[k]} onChange={on(k)} autoComplete={k === 'name' ? 'name' : k === 'email' ? 'email' : 'off'} />
              ))}
              <Field as="textarea" className="xgr-f summary" label="Research Proposal, OSS Contributions, or Internship Goals" name="summary" rows={4} aria-required="true" aria-invalid={bad.summary ? 'true' : undefined} placeholder="Describe the open-source repositories you contribute to, your PhD / academic research topic, and how you plan to use Hanzo API credits, GPU compute, and Hanzo Team." value={f.summary} onChange={on('summary')} />
              {(err || offline) && <p className="xgr-err" role="alert">{offline || err?.includes('grants@hanzo.ai') ? <>Your application did not reach us. Please try again, or email <a href="mailto:grants@hanzo.ai">grants@hanzo.ai</a>.</> : err}</p>}
              <div className="xgr-send-row">
                <Cta type="submit" id="grants.apply" busy={busy} disabled={offline} className="xp-cta xgr-send">Submit Grant Application</Cta>
                <A to="https://hanzo.ai/privacy" className="xgr-priv">Privacy Policy</A>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

export default function Grants() {
  usePhoneAsk();
  const root = useRef<HTMLElement>(null);
  useEnter(root);
  const [track, setTrack] = useState('oss');
  return (
    <main className="xp xgr" ref={root}>
      <NoJs />
      <Hero />
      <How />
      <Gets />
      <Ways pick={setTrack} />
      <Apply track={track} setTrack={setTrack} />
      {/* a quiet end in the page's own words: the scale behind the grants */}
      <section className="xgr-proof" aria-label="Open Source Contributor Grants">
        <div className="xp-wrap xgr-proof-in"><p><span className="xgr-proof-big">1700+</span><span className="x-mono">repositories · 38 organizations</span></p><A to="/open-source" className="xgr-link">Explore Repositories</A></div>
      </section>
    </main>
  );
}
