'use client';
/* ENG 100, Agentic Coding Systems with Hanzo Dev & Zen 6 (/university/agentic-coding): the flagship course, with a page
   of its own (laboratory, syllabus, rubric, credential, faculty).
   Persona: an engineer who ships with agents and wants it proved. Goal: read the syllabus and rubric, take a seat.
   CTA: "Request a seat", or "Enroll in ENG 100" where the catalog sells it (universitySeat.js), thumb.
   Signature: the steps card beside the first screen walks the four weeks. Every word is Hanzo's, from hanzo-inc/app;
   no tuition is typed. */
import { A, Cta, Img } from '../kit';
import { Chip, Fold, Steps, Band } from './UniversityFold';
import Icon from './universityIcons';
import { ASK, seatFor } from './universitySeat';
import { CODING_WEEKS, FILM } from './universityData';
import './UniversityCourse.css';
import './UniversityCoding.css';

const BACK = '/university/agentic-coding';
const PORTAL = '/university/portal';

const SPECS = [
  ['Duration', '4 Weeks', 'Self-Paced Intensive'],
  ['Estimated effort', '8–10 Hours', 'Per Week (Lectures & Labs)'],
  ['Prerequisites', 'Python or Rust / Git', 'Systems Programming Assumed'],
  ['Evaluation method', 'SWE-bench Grader', 'Automated Cleanroom CI'],
];

const LAB = [
  ['shield', 'Hanzo Visor (`runsc`) User-Space Kernel Isolation', 'Every agent turn runs inside an unprivileged sandbox pod with virtualized syscalls, seccomp filtering, and read-only host mounts.'],
  ['zap', 'Zero-Copy ZAP IPC Protocol', 'Multi-agent communication traverses Cap’n Proto zero-copy serialization over Unix domain sockets, reducing message dispatch latency from 180ms to < 2ms.'],
  ['cpu', 'Zen 6 High-Throughput Model Serving', 'Access quantized GGUF/AWQ builds of Zen 6 (27.3B) and Zen 6 Flash with continuous token streaming, structured JSON tool schemas, and KV-cache reuse.'],
  ['scale', 'Micro-USD Financial Governance', 'Every test execution is bound to an exact integer micro-USD budget ceiling ($0.50 per defect). Exceeding the ceiling triggers in-band refusal and automatic grading failure.'],
];

const RUBRIC = [
  ['40%', 'Test Suite Pass Rate', '100% of pre-existing unit test suites and student-synthesized reproduction tests must pass with exit code 0.'],
  ['20%', 'AST & Type Cleanliness', 'Patches must pass strict AST verification, linters, and typecheckers without introducing formatting errors or dead imports.'],
  ['20%', 'Micro-USD Budget Ceilings', 'The agent must resolve each defect within a strict 500,000 micro-USD ($0.50) ceiling. Exceeding the ceiling triggers instant failure.'],
  ['20%', 'Telemetry & Audit Fidelity', 'Full Cap’n Proto trace records, tool invocation timestamps, and Kai state probabilities must be emitted to ClickHouse O11y.'],
];

const CREDENTIAL = [
  ['shield', 'W3C Verifiable Credential', 'Issued under the W3C Verifiable Credentials Data Model v2.0 standard, cryptographically signed by the Hanzo Trust Root (`did:hanzo:trust`).'],
  ['binary', 'Immutable On-Chain Proof', 'Every issued certificate is permanently anchored with an on-chain cryptographic commitment, preventing credential forgery or revocation tampering.'],
  ['branch', 'Dynamic GitHub SVG Badges', 'Embed a real-time verified SVG badge into your GitHub profile and READMEs. Click-throughs link directly to your passing CI benchmark runs.'],
];

const FACULTY = [
  ['cap', 'Systems Faculty', 'Curriculum designed by the core Hanzo AI systems architects who build Zen 6, Enso, and the ZAP RPC runtime.'],
  ['terminal', 'Automated Grader Fleet', '`hanzo-grader` pods run 24/7. Submit your repository at any hour and receive comprehensive test traces within 90 seconds.'],
  ['book', 'Developer Preceptorials', 'Join private Discord channels and weekly architecture reviews with fellow systems engineers and teaching assistants.'],
];

export default function UniversityCoding() {
  const seat = seatFor('course-eng-100', BACK);
  const way = seat?.href ?? ASK;
  const enroll = seat ? `Enroll in ENG 100 — ${seat.price} USD (+${seat.credit} Credit Rebate)` : 'Request a seat';
  return (
    <main className="xuv" data-ask-name="ENG 100">
      <Fold
        trail={[{ label: 'University', to: '/university' }, { label: 'ENG 100' }]}
        badge="Course ENG 100 · Units: 4.0 · Credential: HACE"
        title="Agentic Coding Systems with Hanzo Dev & Zen 6"
        lede="The definitive systems curriculum for autonomous software engineering. Learn to architect production-grade coding agents that inspect repositories, reproduce failing test cases, synthesize syntax-safe AST diffs, and self-heal in isolated Hanzo Visor sandboxes under strict micro-USD budget ceilings."
        actions={<>
          <Cta to={way} kind="solid" thumb id="university.seat">{enroll}</Cta>
          <Cta to={PORTAL} kind="quiet" id="university.portal-hero">Preview Enrolled Student Portal →</Cta>
          <Cta to="/university" kind="quiet" id="university.catalog">← Catalog</Cta>
        </>}
        preview={<Steps title="ENG 100" film={FILM['agentic-coding']} steps={CODING_WEEKS.map((w) => ({ title: w.title, body: w.summary }))} />}
      />

      <Band tone="sunk">
        <div className="xuv-grid c2">
          <div className="xuv-card xuv-spec">
            <div className="xuv-row">
              <span className="xuv-label">Academic specifications</span>
              <Chip>ENG 100 · 4.0 UNITS</Chip>
            </div>
            <dl className="xuv-cells two">
              {SPECS.map(([k, v, s]) => (
                <div key={k} className="xuv-cell"><dt>{k}</dt><dd className="big">{v}</dd><span className="xuv-sm">{s}</span></div>
              ))}
            </dl>
            <p className="xuv-sub">All laboratory coursework executes in ephemeral Hanzo Dev sandboxes running Zen 6 local serving, tree-sitter AST parsers, and automated cleanroom CI test runners.</p>
          </div>

          <div className="xuv-card xuv-spec">
            <div className="xuv-row">
              <span className="xuv-label">Course tuition &amp; fellowship</span>
              <Chip>Credential: HACE</Chip>
            </div>
            {seat && (
              <div className="xuv-tuition">
                <div className="xuv-row">
                  <div>
                    <span className="xuv-label">Total tuition</span>
                    <span className="xuv-price">{seat.price}<span className="xuv-sm">USD</span></span>
                  </div>
                  <Chip tone="ok">+{seat.credit} CREDITS (25% REBATE)</Chip>
                </div>
                <p className="xuv-sub">Guaranteed compute allocation deposited immediately on enrollment. Subsidizes Zen 6 inference and Hanzo Visor sandbox runtimes.</p>
              </div>
            )}
            <div className="xuv-ask">
              <Cta to={way} kind="solid" size="lg" id="university.seat-card">{seat ? `Enroll in ENG 100 — ${seat.price} USD →` : 'Request a seat'}</Cta>
              {seat && <p className="xuv-note">Have a coupon code or fellowship grant? Enter it during checkout.</p>}
            </div>
            <div className="xuv-rebate">
              <div className="xuv-rebate-h">
                <span><Icon name="coins" size={16} />Cloud Fellowship Credit Rebate:</span>
                <span className="xuv-mono xuv-b">{seat ? `+${seat.credit} USD (25%)` : '25%'}</span>
              </div>
              <p className="xuv-sub">25% of tuition (rounded up) is immediately deposited into your Hanzo Cloud compute balance on day one. Fully subsidizes your Hanzo Visor sandbox container leases and Zen 6 inference hours throughout the course.</p>
            </div>
            <div className="xuv-foot-line">
              <span>Already enrolled?</span>
              <A to={PORTAL} className="xuv-link">Enter Enrolled Student Portal →</A>
            </div>
          </div>
        </div>
      </Band>

      <Band kicker="Laboratory Infrastructure" title="The cleanroom execution environment" lede="Autonomous agents cannot be evaluated on unconstrained local machines. Every student is provisioned an isolated execution pod with strict kernel virtualization and zero-copy IPC.">
        <div className="xuv-lab-grid">
          <figure className="xuv-shot">
            <figcaption className="xuv-shot-h">LABORATORY TERMINAL · ISOLATED RUNSC BOUNDARY</figcaption>
            <Img src="/university/developer-terminal.jpg" w={1376} h={768} alt="Close-up of developer hands on mechanical keyboard in front of terminal debugger and autonomous agent test harness" />
            <p className="xuv-shot-f">Real-time terminal feedback: students inspect agent AST diffs, Cap’n Proto trace records, and micro-USD budget meters.</p>
          </figure>
          <div className="xuv-stack">
            {LAB.map(([icon, t, d]) => (
              <div key={t} className="xuv-card quiet xuv-spec-row">
                <Icon name={icon} size={20} />
                <div className="xuv-stack tight"><h3>{t}</h3><p>{d}</p></div>
              </div>
            ))}
          </div>
        </div>
      </Band>

      <Band tone="sunk" kicker="Academic Syllabus" title="Weekly Lecture & Laboratory Curriculum" lede="Modeled on elite graduate computer science systems curricula. Each week integrates foundational systems theory, primary literature readings, terminal laboratory assignments, and milestone grading.">
        <div className="xuv-grid stack">
          {CODING_WEEKS.map((w, i) => (
            <article key={w.code} className="xuv-card xuv-week big">
              <div className="xuv-row">
                <div className="xuv-wk-t"><Chip>{w.code}</Chip><span className="xuv-mono xuv-label">{w.week}</span></div>
                <span className="xuv-mono xuv-label">Module {i + 1} of {CODING_WEEKS.length}</span>
              </div>
              <div className="xuv-stack tight">
                <h3 className="xuv-wk-h">{w.title}</h3>
                <p className="xuv-wk-sum">{w.summary}</p>
              </div>
              <div className="xuv-stack tight">
                <span className="xuv-mono xuv-label">LECTURE TOPICS &amp; SYSTEMS PRINCIPLES:</span>
                <ul className="xuv-checks">{w.lectures.map((l) => <li key={l}><Icon name="check" size={14} /><span>{l}</span></li>)}</ul>
              </div>
              <div className="xuv-panel2">
                <span className="xuv-mono xuv-label">REQUIRED READING:</span>
                {w.readings.map((r) => <p key={r} className="xuv-read">• {r}</p>)}
              </div>
              <div className="xuv-lab">
                <Icon name="terminal" size={16} />
                <div className="xuv-stack tight"><span className="xuv-mono xuv-sub b xuv-b">GRADED LABORATORY ASSIGNMENT:</span><p>{w.lab}</p></div>
              </div>
            </article>
          ))}
        </div>
      </Band>

      <Band kicker="Evaluation Standards" title="Grading Rubric & Automated Evaluation Policy" lede="To earn the Hanzo Certified Agentic Coding Engineer (HACE) credential, candidates must satisfy rigorous machine-evaluated benchmarks. All grading is conducted via synthetic fault injection in isolated cleanrooms.">
        <div className="xuv-grid c4">
          {RUBRIC.map(([n, t, d]) => (
            <div key={t} className="xuv-card quiet">
              <div className="xuv-stack tight"><span className="xuv-fig">{n}</span><h3>{t}</h3><p>{d}</p></div>
            </div>
          ))}
        </div>
        <div className="xuv-card xuv-policy">
          <div className="xuv-policy-h"><Icon name="scale" size={20} /><h3>The Cleanroom Fault-Injection Policy</h3></div>
          <p>To prevent students from hardcoding solutions to known SWE-bench issue IDs, the Hanzo Grader Pod executes synthetic fault injections: renaming test assertions, injecting subtle dependency regressions, and scrambling directory paths during test execution. Passing requires a truly generalized autonomous reasoning and repair harness.</p>
        </div>
      </Band>

      <Band tone="sunk" kicker="Credential Verification" title="The HACE Professional Credential" lede="Unlike static PDF diplomas, the Hanzo Certified Agentic Coding Engineer credential is an immutable, machine-verifiable cryptographic proof.">
        <div className="xuv-grid c3">
          {CREDENTIAL.map(([icon, t, d]) => (
            <div key={t} className="xuv-card">
              <div className="xuv-stack"><Icon name={icon} size={22} /><h3>{t}</h3><p>{d}</p></div>
            </div>
          ))}
        </div>
      </Band>

      <Band kicker="Instruction & Support" title="Faculty, Preceptors & Grader Pods" lede="Continuous asynchronous grading backed by live developer preceptorials and active technical office hours.">
        <div className="xuv-grid c3">
          {FACULTY.map(([icon, t, d]) => (
            <div key={t} className="xuv-card quiet">
              <div className="xuv-stack tight"><Icon name={icon} size={20} /><h3>{t}</h3><p>{d}</p></div>
            </div>
          ))}
        </div>
      </Band>

      <Band tone="sunk" center narrow kicker="Enrollment Open · Term 2026" title="Enroll in ENG 100: Agentic Coding Systems" lede="Join the elite systems engineers mastering autonomous code generation. Claim your 25% usage credit rebate immediately upon registration to fund all laboratory sandboxes.">
        <div className="xuv-acts center">
          <Cta to={way} kind="solid" id="university.seat-final">{enroll}</Cta>
          <Cta to={PORTAL} kind="quiet" id="university.portal-final">Preview Student Portal →</Cta>
          <Cta to="/university" kind="quiet" id="university.catalog-final">Explore All 6 University Tracks</Cta>
        </div>
      </Band>
    </main>
  );
}
