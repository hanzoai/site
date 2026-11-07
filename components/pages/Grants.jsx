'use client';
/* Grants & Research. Its idea is the weekly review an application goes round.
   Signature: the four steps of a grant sit round a dial and a hand sweeps them, the step it points at opening in the
   centre, as the review Hanzo runs every week comes round; tap a step and the hand goes to it.
   Beyond: your application, as Hanzo files it. Beside the form a filing card writes itself as you type: the track,
   the role and the department it is filed under, and exactly the fields that will be sent.
   The form sends what hanzo.ai sends. Every word is Hanzo's. */
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useInView, useReducedMotion } from 'motion/react';
import { EASE, Rise } from '../ui';
import { A, Go, More, SecHead } from '../kit';
import Sigil from '../Sigil';
import { TRACKS, apply } from './Grants.apply';
import './Grants.css';

const STEPS = [
  ['Apply or Contribute', 'Share your open-source PRs, repository, or academic research topic'],
  ['Fast-Track Review', 'Our engineering and research leads review applications weekly'],
  ['Credits & Team Access', 'Receive free API & GPU credits plus full access to Hanzo Team'],
  ['Ship in the Open', 'Publish open code, models, and papers under your own name'],
];
const pad = (n) => String(n).padStart(2, '0');

function Dial() {
  const [at, setAt] = useState(0);
  const [turns, setTurns] = useState(0); // the hand only ever goes forward
  const [mine, setMine] = useState(false);
  const box = useRef(null);
  const seen = useInView(box, { amount: 0.4 });
  const calm = useReducedMotion();
  const go = (i) => { setTurns((t) => t + ((i - at + 4) % 4 || 0)); setAt(i); };
  useEffect(() => {
    if (mine || calm || !seen) return;
    const t = setTimeout(() => go((at + 1) % 4), 3000);
    return () => clearTimeout(t);
  }, [at, mine, calm, seen]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <div className="xgr-dial" ref={box}>
      <p className="xgr-dial-k"><span>How grants work</span><span className="x-mono" aria-live="polite">{pad(at + 1)} / 04</span></p>
      <div className="xgr-face">
        <svg viewBox="0 0 200 200" className="xgr-ring" aria-hidden="true">
          <circle cx="100" cy="100" r="92" fill="none" stroke="currentColor" strokeOpacity=".12" strokeWidth="1" />
          {Array.from({ length: 52 }, (_, i) => { const a = (i / 52) * Math.PI * 2, r = i % 13 ? 89 : 80, f = (v) => v.toFixed(2); return <line key={i} x1={f(100 + Math.sin(a) * 86)} y1={f(100 - Math.cos(a) * 86)} x2={f(100 + Math.sin(a) * r)} y2={f(100 - Math.cos(a) * r)} stroke="currentColor" strokeOpacity={i % 13 ? 0.18 : 0.6} strokeWidth="1" />; })}
        </svg>
        <motion.i className="xgr-hand" aria-hidden="true" animate={{ rotate: turns * 90 }} transition={calm ? { duration: 0 } : { type: 'spring', stiffness: 60, damping: 14 }} />
        {STEPS.map(([t], i) => (
          <button key={t} type="button" className={'xgr-node n' + i + (at === i ? ' on' : '')} onClick={() => { setMine(true); go(i); }} aria-pressed={at === i} aria-label={`${pad(i + 1)}: ${t}`}>
            <span className="x-mono">{pad(i + 1)}</span>
          </button>
        ))}
        <div className="xgr-center">
          {STEPS.map(([t, d], i) => (
            <motion.div key={t} className="xgr-step" initial={false} animate={i === at ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.94 }} transition={{ duration: 0.45, ease: EASE }} aria-hidden={i !== at}>
              <h3>{t}</h3>
              <p>{d}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Hero() {
  const line = (t, d) => <span className="x-line"><motion.span className="x-line-in" initial={{ y: '105%' }} animate={{ y: 0 }} transition={{ duration: 1.1, ease: EASE, delay: d }}>{t}</motion.span></span>;
  return (
    <section className="xgr-hero" aria-labelledby="xgr-h1">
      <div className="x-wrap xgr-grid">
        <div>
          <motion.p className="x-kick" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: EASE }}>Grants &amp; Research</motion.p>
          <h1 id="xgr-h1" className="xgr-h1">{line('Open Source & Research', 0.05)}{line('Credit Grants', 0.17)}</h1>
          <motion.p className="xgr-lede" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: EASE, delay: 0.35 }}>Free API credits, GPU compute, and Hanzo Team access for open-source contributors, academic PhD researchers, and research interns.</motion.p>
          <motion.div className="xgr-acts" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: EASE, delay: 0.5 }}>
            <motion.a href="#apply" className="x-btn solid" data-thumb="Apply for a Grant" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>Apply for a Grant</motion.a>
            <Go to="/careers#internships">Academic Internships</Go>
          </motion.div>
        </div>
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.2, ease: EASE, delay: 0.15 }}>
          <Dial />
        </motion.div>
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

function Gets() {
  return (
    <section className="x-sec xgr-gets">
      <div className="x-wrap xgr-gets-in">
        <div className="xgr-gets-l">
          <SecHead title="What Grant Recipients & Interns Receive" lede="Compute, models, and workspaces to ship open research and open-source software." />
          <Sigil seed="grants" data={[2137, 122, 4]} className="xgr-sigil" />
        </div>
        <ul className="xgr-gets-g">
          {GETS.map(([t, d], i) => (
            <Rise as="li" key={t} delay={(i % 2) * 0.08} y={22}>
              <span className="xgr-gets-n x-mono">{pad(i + 1)}</span>
              <h3>{t}</h3>
              <p>{d}</p>
            </Rise>
          ))}
        </ul>
      </div>
    </section>
  );
}

const WAYS = [
  ['oss', 'Open Source Contributor Grants', '2,137+ repositories · 122 organizations', 'We always welcome and accept open-source contributors across our repositories on GitHub and git.hanzo.ai. Ship pull requests, maintain SDKs or MCP servers, or build open-source tools powered by Hanzo to receive recurring API, Cloud, and Dev credit grants.', 'Apply as OSS Contributor', ['Explore Repositories', '/open-source']],
  ['academic', 'Academic & PhD Research Grants', 'PhD students · University labs · Independent researchers', 'Investigating foundation models, RLHF/post-training, ML compilers, post-quantum cryptography, or agentic systems? Approved academic researchers receive free API & compute credits and full access to Hanzo Team for their research.', 'Apply for Research Credits', ['Research Access Questionnaire', '/beta/research']],
  ['internship', 'Academic & PhD Research Internships', 'Remote / SF · Year-round cohorts', 'Looking to intern with our research and systems teams during your PhD or graduate studies? Work directly on Zen, Kai, Enso, Hanzo Engine, and Hanzo Dev — with free compute credits, Hanzo Team access, and co-authored publications.', 'Apply for Internship', ['View Internship Role', '/careers/academic-research-intern']],
];

function Ways({ pick }) {
  return (
    <section className="x-sec xgr-ways" data-room="dark">
      <div className="x-wrap">
        <SecHead dark title="Three Ways to Build & Research with Us" lede="Whether you are contributing PRs to our open-source repos, running PhD experiments, or applying for a research internship." />
        <div className="xgr-ways-g">
          {WAYS.map(([k, t, meta, d, cta, [more, to]], i) => (
            <Rise key={k} className="xgr-way" delay={i * 0.1}>
              <span className="xgr-way-n x-mono">{pad(i + 1)}</span>
              <h3>{t}</h3>
              <p className="xgr-way-m x-mono">{meta}</p>
              <p className="xgr-way-d">{d}</p>
              <div className="xgr-way-a">
                <a href="#apply" className="x-btn solid" onClick={() => pick(k)}>{cta}</a>
                <More to={to}>{more}</More>
              </div>
            </Rise>
          ))}
        </div>
      </div>
    </section>
  );
}

const FIELDS = [
  ['name', 'Full Name', 'Ada Lovelace', 'text', true],
  ['email', 'Email (.edu or work/personal)', 'ada@university.edu', 'email', true],
  ['affiliation', 'University / Lab / Open Source Project', 'e.g. Stanford AI Lab, MIT CSAIL, or hanzoai/engine', 'text', false],
  ['github', 'GitHub / Forge Profile or PR Links', 'https://github.com/...', 'text', false],
  ['scholar', 'Google Scholar / ArXiv / Personal Website (optional)', 'https://scholar.google.com/...', 'text', false],
];
const EMPTY = { name: '', email: '', affiliation: '', github: '', scholar: '', summary: '' };

function Apply({ track, setTrack }) {
  const [f, setF] = useState(EMPTY);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [err, setErr] = useState(null);
  const on = (k) => (e) => setF((o) => ({ ...o, [k]: e.target.value }));
  const role = TRACKS.find(([k]) => k === track)[2];
  const send = async (e) => {
    e.preventDefault();
    if (busy) return;
    const r = apply(track, f);
    if (r.error) { setErr(r.error); return; }
    setErr(null); setBusy(true);
    try {
      const res = await fetch('https://api.hanzo.ai/v1/marketing/leads', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(r.lead) });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setDone(true);
    } catch { setErr('Your application did not reach us. Please try again, or email grants@hanzo.ai.'); } finally { setBusy(false); }
  };
  const keys = (e) => {
    const d = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
    if (!d) return;
    e.preventDefault();
    const i = (TRACKS.findIndex(([k]) => k === track) + d + 3) % 3;
    setTrack(TRACKS[i][0]); document.getElementById('xgr-t-' + i)?.focus();
  };
  const shown = [['Track', role], ['Department', 'Open Source & Research Grants'], ['Name', f.name], ['Email', f.email], ['Affiliation', f.affiliation || 'Open Source / Academic'], ['Links', [f.github, f.scholar].filter((x) => x.trim()).join('  ·  ')], ['Summary', f.summary]];
  return (
    <section className="x-sec xgr-apply" id="apply" aria-labelledby="xgr-apply-h">
      <div className="x-wrap xgr-apply-in">
        <div className="xgr-apply-l">
          <h2 id="xgr-apply-h" className="xgr-apply-h">Apply for Credits or a Research Internship</h2>
          <p className="xgr-apply-p">Tell us about your open-source contributions, academic research, or internship goals. We review submissions every week.</p>
          <div className="xgr-file" aria-label="What is sent">
            <p className="xgr-file-k x-mono">Filed as</p>
            <dl>
              {shown.map(([k, v]) => (
                <div key={k} className={v && v.trim() ? 'on' : ''}><dt>{k}</dt><dd>{v && v.trim() ? v : '—'}</dd></div>
              ))}
            </dl>
          </div>
          <p className="xgr-mail">Or email us directly at <a href="mailto:careers@hanzo.ai">careers@hanzo.ai</a></p>
        </div>
        <AnimatePresence mode="wait" initial={false}>
          {done ? (
            <motion.div key="ok" className="xgr-ok" role="status" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.45, ease: EASE }}>
              <span className="xgr-ok-i" aria-hidden="true">✓</span>
              <h3>Application Received</h3>
              <p>Thank you for applying! Our research and open-source team will review your submission and follow up at <b>{f.email}</b> with your credit grant and Hanzo Team access details.</p>
              <button type="button" className="x-btn solid" onClick={() => { setDone(false); setF(EMPTY); }}>Submit Another Application</button>
            </motion.div>
          ) : (
            <motion.form key="form" className="xgr-form" onSubmit={send} noValidate exit={{ opacity: 0, y: -10 }}>
              <div className="xgr-tracks-w">
                <p className="xgr-lab" id="xgr-track-l">Program Track</p>
                <div className="xgr-tracks" role="radiogroup" aria-labelledby="xgr-track-l" onKeyDown={keys}>
                  {TRACKS.map(([k, label], i) => (
                    <button key={k} id={'xgr-t-' + i} type="button" role="radio" aria-checked={track === k} tabIndex={track === k ? 0 : -1} onClick={() => setTrack(k)}>
                      {track === k && <motion.span layoutId="xgr-track" className="xgr-track-bg" transition={{ type: 'spring', stiffness: 420, damping: 34 }} />}
                      <span>{label}</span>
                    </button>
                  ))}
                </div>
              </div>
              {FIELDS.map(([k, label, ph, type, req]) => (
                <label key={k} className={'xgr-f ' + k}><span className="xgr-lab">{label}</span><input type={type} placeholder={ph} required={req} value={f[k]} onChange={on(k)} autoComplete={k === 'name' ? 'name' : k === 'email' ? 'email' : 'off'} /></label>
              ))}
              <label className="xgr-f summary"><span className="xgr-lab">Research Proposal, OSS Contributions, or Internship Goals</span><textarea rows={4} required placeholder="Describe the open-source repositories you contribute to, your PhD / academic research topic, and how you plan to use Hanzo API credits, GPU compute, and Hanzo Team." value={f.summary} onChange={on('summary')} /></label>
              {err && <p className="xgr-err" role="alert">{err.includes('grants@hanzo.ai') ? <>Your application did not reach us. Please try again, or email <a href="mailto:grants@hanzo.ai">grants@hanzo.ai</a>.</> : err}</p>}
              <motion.button type="submit" className="x-btn solid xgr-send" disabled={busy} whileTap={{ scale: 0.97 }}>{busy ? 'Sending…' : 'Submit Grant Application'}</motion.button>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

export default function Grants() {
  const [track, setTrack] = useState('oss');
  return (
    <main className="xgr">
      <Hero />
      <Gets />
      <Ways pick={setTrack} />
      <Apply track={track} setTrack={setTrack} />
    </main>
  );
}
