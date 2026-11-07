'use client';
/* Grants & Research. Its idea is the stack of ways in: contribute, research, intern.
   Persona: an open-source contributor, PhD researcher or research intern (PLAN-COMPONENTS 1.1 researcher row). Goal:
   apply for credits or an internship. CTA: "Apply for a Grant" (the form on this page). Metric: GitHub/weights click row
   (the application sends a marketing lead).
   V2: 8/10 grey deck, no eyebrow; rebuilt: a display hero beside the page's own living contour field; the four steps as one timeline that draws across; what recipients receive as an editorial list; the three ways in as sheets that stack over each other in the dark room; the application with its filing card.
   Signature: stacked sheets: in the dark room the three ways to build and research arrive as full sheets, each one
   pinning while the next slides over it and the one beneath settles back.
   Beyond: your application, as it will be sent. Beside the form a card writes itself as you type, under the form's
   own labels: the track and exactly the fields that will be sent.
   Motion: stacked sheets (signature) + line-masked hero type + the timeline drawing across + the track chip spring.
   0 UI hues. The form sends what hanzo.ai sends. Every word is Hanzo's. */
import { useRef, useState } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { A } from '../kit';
import Sigil from '../Sigil';
import LineReveal, { NoJs } from '../v2/LineReveal';
import { TRACKS, apply } from './Grants.apply';
import '../v2/ProgramScale.css';
import './Grants.css';

const EASE = [0.16, 1, 0.3, 1];
const STEPS = [
  ['Apply or Contribute', 'Share your open-source PRs, repository, or academic research topic'],
  ['Fast-Track Review', 'Our engineering and research leads review applications weekly'],
  ['Credits & Team Access', 'Receive free API & GPU credits plus full access to Hanzo Team'],
  ['Ship in the Open', 'Publish open code, models, and papers under your own name'],
];
const pad = (n) => String(n).padStart(2, '0');

function Hero() {
  return (
    <section className="xgr-hero" aria-labelledby="xgr-h1">
      <div className="xp-wrap xp-grid">
        <div className="xgr-copy">
          <LineReveal as="h1" id="xgr-h1" className="xp-display md" lines={['Open Source & Research', 'Credit Grants']} />
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: EASE, delay: 0.4 }}>
            <p className="xp-lede xgr-lede">Free API credits, GPU compute, and Hanzo Team access for open-source contributors, academic PhD researchers, and research interns.</p>
            <div className="xgr-acts">
              <a href="#apply" className="x-btn solid xp-cta" data-thumb="Apply for a Grant" data-cta="grants.hero">Apply for a Grant<i aria-hidden="true">↓</i></a>
              <A to="/careers#internships" className="xgr-link">Academic Internships</A>
            </div>
          </motion.div>
        </div>
        <motion.div className="xgr-art" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.4, ease: EASE, delay: 0.2 }}>
          <Sigil seed="grants" data={[2137, 122, 4]} className="xgr-sigil" />
          <span className="xgr-art-k x-mono">Grants &amp; Research</span>
        </motion.div>
      </div>
    </section>
  );
}

/* The four steps as one line that draws across once it is reached. */
function How() {
  return (
    <section className="xp-sec tight xgr-how" aria-labelledby="xgr-how-h">
      <div className="xp-wrap">
        <h2 id="xgr-how-h" className="xp-head xgr-how-h">How grants work</h2>
        <div className="xgr-line" aria-hidden="true"><motion.i initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true, amount: 1 }} transition={{ duration: 1.6, ease: EASE }} /></div>
        <ol className="xgr-steps">
          {STEPS.map(([t, d], i) => (
            <li key={t}>
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

function Gets() {
  return (
    <section className="xp-sec xgr-gets" aria-labelledby="xgr-gets-h">
      <div className="xp-wrap xp-grid">
        <div className="xgr-gets-l">
          <h2 id="xgr-gets-h" className="xp-head">What Grant Recipients &amp; Interns Receive</h2>
          <p className="xp-lede">Compute, models, and workspaces to ship open research and open-source software.</p>
        </div>
        <ul className="xgr-gets-g">
          {GETS.map(([t, d], i) => (
            <li key={t}>
              <span className="xgr-gets-n x-mono">{pad(i + 1)}</span>
              <h3 className="xp-title">{t}</h3>
              <p className="xp-body">{d}</p>
            </li>
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

/* One sheet of the stack: it pins, and settles back as the next one slides over it. */
function Sheet({ way, i, n, pick }) {
  const ref = useRef(null);
  const [k, t, meta, d, cta, [more, to]] = way;
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const last = i === n - 1;
  const scale = useTransform(scrollYProgress, [0, 1], [1, last ? 1 : 0.92]);
  const dim = useTransform(scrollYProgress, [0, 1], [0, last ? 0 : 0.55]);
  return (
    <li ref={ref} className="xgr-sheet-li" style={{ '--i': i }}>
      <motion.article className={'xgr-sheet s' + i} data-room={i === 1 ? undefined : 'light'} style={{ scale }}>
        <span className="xgr-sheet-n xp-fig" aria-hidden="true">{pad(i + 1)}</span>
        <div className="xgr-sheet-b">
          <h3 className="xp-display sm xgr-way-t">{t}</h3>
          <p className="xgr-way-m x-mono">{meta}</p>
          <p className="xp-lede xgr-way-d">{d}</p>
          <div className="xgr-way-a">
            <a href="#apply" className="x-btn solid xp-cta" data-cta={'grants.' + k} onClick={() => pick(k)}>{cta}<i aria-hidden="true">↓</i></a>
            <A to={to} className="xgr-link">{more}</A>
          </div>
        </div>
        <motion.i className="xgr-sheet-dim" style={{ opacity: dim }} aria-hidden="true" />
      </motion.article>
    </li>
  );
}

function Ways({ pick }) {
  return (
    <section className="xp-sec xp-dark xgr-ways" data-room="dark" aria-labelledby="xgr-ways-h">
      <div className="xp-wrap">
        <div className="xp-grid xgr-ways-head">
          <h2 id="xgr-ways-h" className="xp-head">Three Ways to Build &amp; Research with Us</h2>
          <p className="xp-lede">Whether you are contributing PRs to our open-source repos, running PhD experiments, or applying for a research internship.</p>
        </div>
        <ol className="xgr-stack">
          {WAYS.map((w, i) => <Sheet key={w[0]} way={w} i={i} n={WAYS.length} pick={pick} />)}
        </ol>
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
  const label = TRACKS.find(([k]) => k === track)[1];
  const shown = [['Program Track', label], ['Full Name', f.name], ['Email (.edu or work/personal)', f.email], ['University / Lab / Open Source Project', f.affiliation], ['GitHub / Forge Profile or PR Links', f.github], ['Google Scholar / ArXiv / Personal Website (optional)', f.scholar], ['Research Proposal, OSS Contributions, or Internship Goals', f.summary]];
  return (
    <section className="xp-sec xgr-apply" id="apply" aria-labelledby="xgr-apply-h">
      <div className="xp-wrap xgr-apply-in">
        <div className="xgr-apply-l">
          <h2 id="xgr-apply-h" className="xp-head xgr-apply-h">Apply for Credits or a Research Internship</h2>
          <p className="xp-lede xgr-apply-p">Tell us about your open-source contributions, academic research, or internship goals. We review submissions every week.</p>
          <div className="xgr-file" aria-label="Apply for Credits or a Research Internship">
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
              <button type="button" className="x-btn xp-ghost" onClick={() => { setDone(false); setF(EMPTY); }}>Submit Another Application</button>
            </motion.div>
          ) : (
            <motion.form key="form" className="xgr-form" onSubmit={send} noValidate exit={{ opacity: 0, y: -10 }}>
              <div className="xgr-tracks-w">
                <p className="xgr-lab" id="xgr-track-l">Program Track</p>
                <div className="xgr-tracks" role="radiogroup" aria-labelledby="xgr-track-l" onKeyDown={keys}>
                  {TRACKS.map(([k, label], i) => (
                    <button key={k} id={'xgr-t-' + i} type="button" role="radio" aria-checked={track === k} tabIndex={track === k ? 0 : -1} onClick={() => setTrack(k)}>
                      {track === k && <motion.span layoutId="xgr-track" className="xgr-track-bg" transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }} />}
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
              <button type="submit" className="x-btn solid xp-cta xgr-send" data-cta="grants.apply" disabled={busy}>{busy ? 'Sending…' : 'Submit Grant Application'}</button>
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
    <main className="xp xgr">
      <NoJs />
      <Hero />
      <How />
      <Gets />
      <Ways pick={setTrack} />
      <Apply track={track} setTrack={setTrack} />
    </main>
  );
}
