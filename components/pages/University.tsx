'use client';
/* Hanzo University (/university): the catalog of six courses and their credentials.
   Persona: a software engineer who wants a credential that proves production work. Goal: pick a course and take a seat.
   CTA: "Explore Courses & Enroll" (the catalog, #curriculum). Metric: cta_click on a course's seat.
   Signature: the lab pod. A grader pod's log writes itself line by line, ending in the credential it issues; the steps
   card beside the first screen walks the six courses in turn. Every word is Hanzo's; no tuition is typed (a course is
   priced only where the catalog sells it: universitySeat.js). */
import { useRef, useState } from 'react';
import { useInView } from 'motion/react';
import { Cta, Faq, Tabs, TabPanel } from '../kit';
import { Chip, Fold, Steps, Band } from './UniversityFold';
import Icon from './universityIcons';
import { ASK, seatFor } from './universitySeat';
import { COMPARISON_ROWS, FAQ, LISTED, TRACKS } from './universityData';
import './University.css';

const COURSES = LISTED.map((c) => ({ ...c, seat: seatFor(c.planId, c.href) }));

/* the log of one grading run: [time, tone, text] */
const LOG = [
  ['[04:12:08]', 'mid', 'INITIALIZING EPHEMERAL GRADER CONTAINER POD_8921B (runsc sandbox, seccomp=strict)'],
  ['[04:12:09]', 'dim', 'Cloning candidate repo git@github.com:candidate/eng-100-capstone.git [ref: release/v1.4]'],
  ['[04:12:10]', 'dim', 'Leased ZAP Zero-Copy Cap’n Proto socket at /tmp/hanzo-zap-8921b.sock (latency: 1.4ms)'],
  ['[04:12:11]', 'hi', '$ hanzo evals run --suite swe-bench-lite --model zen6 --budget 500000'],
  ['[04:12:12]', 'mid', '[+] Turn 1: AST parsed src/engine/core.rs via tree-sitter. Injected failing reproduction test.'],
  ['[04:12:14]', 'mid', '[+] Turn 2: Synthesized AST diff. Kai verification heuristic: done=0.96, verified=0.98 → PASS'],
  ['[04:12:15]', 'bold', '[✓] Cleanroom test suite passed exit code 0. Total execution spend: 184,200 micro-USD ($0.184)'],
  ['[04:12:16]', 'bold', '[✓] W3C Verifiable Credential issued: did:hanzo:trust:cert_88194 (Signed on-chain)'],
];

function Pod() {
  const box = useRef(null);
  const seen = useInView(box, { once: true, amount: 0.1 });
  return (
    <section className="xuv-sec tight">
      <div className="xuv-wrap">
        <div ref={box} className={'xuv-term' + (seen ? ' on' : '')} data-room="dark">
          <div className="xuv-term-bar">
            <div className="xuv-term-id">
              <i aria-hidden="true" />
              <span className="xuv-b">hanzo-lab-pod-8921b</span>
              <span>· Hanzo Visor Sandbox Runtime · Zen 6 Local Serving (27.3B)</span>
            </div>
            <Chip>SWE-BENCH GRADE: 100% · PASS</Chip>
          </div>
          <div className="xuv-term-log" role="log" aria-label="hanzo-lab-pod-8921b">
            {LOG.map(([t, tone, text], i) => (
              <div key={t} className="xuv-tl" style={{ '--i': i }}>
                <span className="xuv-tt">{t}</span>
                <span className={'xuv-tx ' + tone}>{text}</span>
              </div>
            ))}
          </div>
          <div className="xuv-term-foot">
            <span className="xuv-term-cap"><Icon name="terminal" size={15} /><span>Capstone Verification: Multi-File AST Refactoring &amp; Autonomous PR Generation</span></span>
            <span className="xuv-term-meta">
              <span>Latency: <span className="xuv-b">1.4ms</span></span>
              <span>Budget Ceiling: <span className="xuv-b">500k µUSD</span></span>
              <span>Telemetry: <span className="xuv-b">Verified</span></span>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

/* Zero Lab Tax: the rebate, and for each course the catalog sells, its tuition and the credit it deposits */
function Rebate() {
  const sold = COURSES.filter((c) => c.seat);
  return (
    <section className="xuv-sec tight">
      <div className="xuv-wrap narrow">
        <div className="xuv-card xuv-rb">
          <div className="xuv-row">
            <div className="xuv-rb-h">
              <Icon name="coins" size={28} />
              <div>
                <h2>Zero Lab Tax: 25% Usage Credit Rebate (Rounded Up)</h2>
                <p>We don’t just sell coursework—we subsidize the compute you need to build it.</p>
              </div>
            </div>
            <Chip className="big">100% Skin in the Game</Chip>
          </div>
          <p className="xuv-rb-p">Every enrollment immediately deposits 25% of tuition (rounded up to the nearest dollar) directly into your Hanzo Cloud account. Use your credits across Zen 6, Enso reasoning models, Kai finite-state decision loops, and Hanzo Visor sandbox container leases.</p>
          {sold.length > 0 && (
            <div className="xuv-tiers">
              {sold.map((c) => (
                <div key={c.code} className="xuv-tier">
                  <span className="xuv-mono xuv-label">{c.code}</span>
                  <span className="xuv-b">{c.seat.price} Tuition</span>
                  <span className="xuv-mono">+{c.seat.credit} USD Credits</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function Compare() {
  return (
    <Band
      id="comparison"
      tone="sunk"
      kicker="Market Comparison & Career Value"
      title="How Hanzo certification separates you from the market"
      lede="Most AI certificates test superficial prompt recall. Hanzo certifications prove you can architect, evaluate, and budget production-grade multi-agent software."
    >
      <div className="xuv-card xuv-tablewrap" role="region" aria-label="How Hanzo certification separates you from the market" tabIndex={0}>
        <table className="xuv-tbl">
          <thead>
            <tr>
              <th scope="col">Capability &amp; Dimension</th>
              <th scope="col">Legacy AI Certifications (Coursera / AWS / Azure)</th>
              <th scope="col" className="us">Hanzo Certified Systems Engineer (HACE / HARLE)</th>
            </tr>
          </thead>
          <tbody>
            {COMPARISON_ROWS.map((r) => (
              <tr key={r.dimension}>
                <th scope="row">{r.dimension}<span className="xuv-adv">{r.advantage}</span></th>
                <td><span className="xuv-cmp"><Icon name="xCircle" size={14} className="no" /><span>{r.legacy}</span></span></td>
                <td className="us"><span className="xuv-cmp"><Icon name="checkCircle" size={14} /><span>{r.hanzo}</span></span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="xuv-grid c3 xuv-gap-top">
        <div className="xuv-card quiet">
          <div className="xuv-stack"><Icon name="briefcase" size={22} /><h3>Senior Software Engineer → AI Systems Engineer</h3><p>Move past frontend wrappers into core systems engineering. Master tree-sitter AST parsing, zero-copy ZAP IPC, and isolated Hanzo Visor execution pods to command top-tier compensation ($180k–$240k).</p></div>
        </div>
        <div className="xuv-card quiet">
          <div className="xuv-stack"><Icon name="trend" size={22} /><h3>Full-Stack Engineer → Autonomous Agent Architect</h3><p>Lead enterprise agent initiatives. Learn to architect multi-agent coordinator-executor swarms that resolve complex GitHub defects within strict micro-USD financial ceilings ($220k–$310k).</p></div>
        </div>
        <div className="xuv-card quiet">
          <div className="xuv-stack"><Icon name="shield" size={22} /><h3>Engineering Founder → CTO of AI-Native Venture</h3><p>Deploy production-grade agentic products with zero runaway inference bills. Use native Gymnasium reinforcement learning and finite-state Kai decision loops to eliminate hallucinations.</p></div>
        </div>
      </div>
    </Band>
  );
}

const PILLARS = [
  ['scale', 'Automated CI Grading', 'Zero human subjectivity. Submissions are graded by isolated CI runners that clone your repository, inject breaking changes, and evaluate repair velocity and test pass rates.'],
  ['coins', 'Integer Micro-USD Ceilings', 'Prevent runaway cloud bills. Learn to configure pre-call price quoting, in-band budget refusals, and sub-cent financial caps directly in your agent loop.'],
  ['cpu', 'Zero-Token Decision Loops', 'Generate text only when generation is strictly required. Master finite-state control with Kai, evaluating tool calls and routing without paying for generation tokens.'],
  ['zap', 'Zero-Copy ZAP Protocols', 'Replace 200ms JSON-RPC hops with Cap’n Proto zero-copy serialization. Connect multi-agent swarms with microsecond inter-process latency and post-quantum encryption.'],
  ['box', 'Native Gymnasium Environments', 'Model agent interactions as formal Markov Decision Processes (MDP). Train custom policy routers, write multi-objective reward functions, and run Zoo Gym fine-tuning.'],
  ['shield', 'W3C Cryptographic Proof', 'Earn verifiable credentials signed by Hanzo Trust with immutable on-chain records and real-time verifiable GitHub SVG badges linking directly to your passing benchmark run.'],
];

function Pillars() {
  return (
    <Band kicker="Pedagogical Architecture" title="Engineered for software engineers. Not prompt hobbyists." lede="Every concept is grounded in systems engineering: zero-copy RPC, bounded memory state machines, reinforcement learning environments, and cryptographic credentials.">
      <div className="xuv-grid c3">
        {PILLARS.map(([icon, t, d]) => (
          <div key={t} className="xuv-card">
            <div className="xuv-stack"><Icon name={icon} size={22} /><h3>{t}</h3><p>{d}</p></div>
          </div>
        ))}
      </div>
    </Band>
  );
}

/* one course in the catalog: its words, and its syllabus and seat at the foot */
function CourseCard({ c, shown }) {
  const { seat } = c;
  return (
    <article className="xuv-card xuv-course" hidden={!shown}>
      <div className="xuv-course-body">
        <div className="xuv-row">
          <span className="xuv-mono xuv-label">{c.code} · {c.level}</span>
          <Chip>{c.credential}</Chip>
        </div>
        <h3>{c.title}</h3>
        <p>{c.summary}</p>
        <div className="xuv-capstone">
          <span className="xuv-mono xuv-label">Verified Capstone:</span>
          <p>{c.capstone}</p>
        </div>
        <div className="xuv-stack tight">
          <span className="xuv-mono xuv-label">Technical Competencies:</span>
          <ul className="xuv-checks">
            {c.competencies.map((k) => <li key={k}><Icon name="check" size={14} /><span>{k}</span></li>)}
          </ul>
        </div>
      </div>
      <div className="xuv-course-foot">
        {seat && (
          <div className="xuv-row">
            <span className="xuv-price">{seat.price}<small>USD</small></span>
            <Chip>+{seat.credit} Credits (25%)</Chip>
          </div>
        )}
        <div className="xuv-course-acts">
          <Cta to={c.href} kind="quiet" id="university.syllabus">Syllabus →</Cta>
          <Cta to={seat?.href ?? ASK} kind="solid" id="university.seat">{seat ? `Enroll — ${seat.price}` : 'Request a seat'}</Cta>
        </div>
      </div>
    </article>
  );
}

function Catalog() {
  const [i, setI] = useState(0);
  const keep = TRACKS[i][1];
  return (
    <Band id="curriculum" tone="sunk" kicker="Curriculum Catalog" title="Courses & Professional Certifications" lede="Select an engineering track to inspect syllabi, lab architectures, and enrollment packages.">
      <div className="xuv-tabs">
        <Tabs id="uvt" label="Engineering tracks" tabs={TRACKS.map(([l]) => l.replace('{n}', COURSES.length))} value={i} onChange={setI} />
      </div>
      <TabPanel id="uvt" i={i} value={i} className="xuv-panel">
        <div className="xuv-grid c3 stack">
          {COURSES.map((c) => <CourseCard key={c.code} c={c} shown={keep === null || c.track === keep} />)}
        </div>
      </TabPanel>
    </Band>
  );
}

function Questions() {
  return (
    <Band kicker="Frequently Asked Questions" title="Everything you need to know about Hanzo University" lede="Clear answers regarding our 25% compute rebate, automated cleanroom grading, hardware specifications, and credential verification." narrow>
      <Faq items={FAQ} />
    </Band>
  );
}

function Enroll() {
  return (
    <Band tone="sunk" center kicker="Open Enrollment" title="Ready to build systems that scale?" lede="Enroll today to claim your 25% usage credit rebate and gain instant access to browser-based Hanzo Dev sandboxes." narrow>
      <div className="xuv-acts center">
        <a href="#curriculum" className="x-btn solid" data-cta="university.enroll">Enroll in a Course</a>
        <Cta to="/university/portal" kind="quiet" id="university.portal">Preview Student Portal →</Cta>
        <Cta to="/university/agentic-coding" kind="quiet" id="university.syllabus-eng">View ENG 100 Syllabus</Cta>
      </div>
    </Band>
  );
}

export default function University() {
  return (
    <main className="xuv" data-ask-name="University">
      <Fold
        trail={[{ label: 'University' }]}
        badge="hanzo.university · Open Enrollment · 25% Usage Credit Rebate"
        title="Stop prompting. Start engineering."
        lede="Toy AI tutorials won’t survive production. Hanzo University trains software engineers to architect, evaluate, and budget autonomous multi-agent systems with zero-copy protocols, Hanzo Visor sandboxing, and reinforcement learning. Every course includes 25% compute credits ($25–$125) deposited into your account on day one."
        actions={<>
          <a href="#curriculum" className="x-btn solid" data-cta="university.explore" data-thumb="Explore Courses & Enroll">Explore Courses &amp; Enroll</a>
          <Cta to="/university/portal" kind="quiet" id="university.portal-hero">Preview Enrolled Student Portal →</Cta>
          <Cta to="/university/agentic-coding" kind="quiet" id="university.eng100-hero">ENG 100 Syllabus →</Cta>
        </>}
        preview={<Steps title="hanzo.university" film="zen" steps={COURSES.map((c) => ({ title: c.title, body: c.summary }))} />}
      />
      <Pod />
      <Rebate />
      <Compare />
      <Pillars />
      <Catalog />
      <Questions />
      <Enroll />
    </main>
  );
}
