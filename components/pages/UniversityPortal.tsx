'use client';
/* The Hanzo University student portal (/university/portal): a preview of what an enrolled student works in.
   Persona: an engineer who has taken a seat, or is about to. Goal: see the lab, the modules and the credential before
   paying. CTA: "Run Autograder →". Signature: a working lab. The shell runs the quick commands and the autograder (as
   hanzo-inc/app's portal does), the Shell, AST Diff, Autograder and Spend tabs each hold their words, and the module
   list, banner and credential follow the course picked; every course's words are in the page, the ones not shown are
   hidden. The student, the pod and the balances are the portal's sample, as the app prints them; the credit a course
   deposits is a quarter of the tuition the catalog states, where it sells the course (universitySeat.js). */
import { useEffect, useRef, useState } from 'react';
import { A, Tabs, TabPanel } from '../kit';
import { Chip } from './UniversityFold';
import Icon from './universityIcons';
import { seatFor } from './universitySeat';
import { UNIVERSITY_COURSES } from './universityData';
import './UniversityPortal.css';

const PROMPT = 'alex@hanzo-sandbox:~/swe-bench-agent$ ';
const START = [
  PROMPT + 'hanzo dev status',
  '[OK] gVisor runsc sandbox lease active (id: pod-gvs-uswest2-01)',
  '[OK] Zen 6 (27.3B) inference endpoint connected via ZAP RPC (latency: 1.4ms)',
  '[OK] Compute credit balance: $37.55 USD remaining of $50.00 deposit',
  PROMPT + 'pytest -v tests/test_agent.py',
  '============================= test session starts =============================',
  'platform linux -- Python 3.12.3, pytest-8.1.1, pluggy-1.4.0',
  'tests/test_agent.py::test_ast_symbol_resolution PASSED                   [ 25%]',
  'tests/test_agent.py::test_zap_zerocopy_serialization PASSED             [ 50%]',
  'tests/test_agent.py::test_gvisor_sandboxed_reproduction PASSED           [ 75%]',
  'tests/test_agent.py::test_kai_zerotoken_decision_checkpoint PASSED       [100%]',
  '============================== 4 passed in 0.42s ===============================',
  PROMPT + '_',
];
const AUTOGRADE = 'zen eval --benchmark swe-bench';
const OUT = {
  [AUTOGRADE]: [
    '[HANZO EVAL] Running SWE-bench Lite benchmark evaluation harness...',
    '  [1/5] django/django-14999: AST diff generated (cost: $0.038) -> TEST PASSED [100%]',
    '  [2/5] sympy/sympy-18057: Symbol extraction verified (cost: $0.041) -> TEST PASSED [100%]',
    '  [3/5] scikit-learn/scikit-learn-14092: Reproducing bug in gVisor -> TEST PASSED [100%]',
    '  [4/5] pytest-dev/pytest-7432: Zero syntax regressions -> TEST PASSED [100%]',
    '  [5/5] astropy/astropy-12907: Synthesizing patch -> TEST PASSED [100%]',
    '--------------------------------------------------------------------------------',
    '[SUMMARY] 5 of 5 SWE-bench benchmark issues resolved autonomously.',
    '[ECONOMICS] Average compute cost per patch: $0.042 USD (Budget cap: $0.50).',
    '[STATUS] 100% Test Pass Rate. Verification verified by Kai Decision Model.',
  ],
  'hanzo dev diff': [
    '--- a/src/agent/synthesizer.py',
    '+++ b/src/agent/synthesizer.py',
    '@@ -42,7 +42,7 @@ class CodePatchSynthesizer:',
    '-    def repair_ast(self, tree: ast.AST) -> str:',
    '+    def repair_ast(self, tree: ast.AST, budget_usd: float = 0.05) -> ast.AST:',
    '         """Generates syntax-safe diff with zero syntax regressions."""',
    '+        kai_check = self.evaluator.verify_state(tree, ceiling=budget_usd)',
    '+        assert kai_check.safe_to_execute, "Refusing execution: budget violation"',
  ],
};
const DONE = ['[COMMAND EXECUTED] Task processed in ephemeral gVisor container (exit code 0).'];
const QUICK = ['pytest -v tests/test_agent.py', AUTOGRADE, 'hanzo dev diff'];
const GRADER = [
  ['django/django-14999', '$0.038', '1.2s'],
  ['sympy/sympy-18057', '$0.041', '1.4s'],
  ['scikit-learn/scikit-learn-14092', '$0.044', '1.8s'],
  ['pytest-dev/pytest-7432', '$0.029', '0.9s'],
  ['astropy/astropy-12907', '$0.052', '2.1s'],
];
const SPEND = [
  ['Zen 6 (27.3B) Inference (142k tokens)', '$7.10'],
  ['gVisor Pod Execution (18.4 runtime hrs)', '$4.60'],
  ['ZAP Zero-Copy RPC Channels', '$0.75'],
];
const TABS = ['Shell', 'AST Diff', 'Autograder', 'Spend'];
const COPIED = 'W3C JSON-LD Credential copied to clipboard!';

/* the credential as a W3C Verifiable Credential, for the sample student the portal shows */
const credentialLD = (c) => JSON.stringify({
  '@context': ['https://www.w3.org/ns/credentials/v2'],
  type: ['VerifiableCredential'],
  issuer: 'did:hanzo:university:accreditation',
  credentialSubject: { id: 'did:hanzo:user:hz-stu-9821a', name: 'Alex Chen', achievement: `${c.credentialFull} (${c.credential})` },
  proof: { type: 'Ed25519Signature2020', proofValue: '0x7f4a8b1c...99e2e89b' },
}, null, 2);

const tone = (line) => (line.startsWith('alex@') ? 'p' : line.includes('PASSED') || line.includes('[OK]') ? 'hi' : '');

/* every course's variant of a piece, the one not picked hidden */
function Per({ sel, as: Tag = 'span', children }) {
  return UNIVERSITY_COURSES.map((c, i) => <Tag key={c.slug} className="xuv-per" hidden={i !== sel}>{children(c, i)}</Tag>);
}

export default function UniversityPortal() {
  const [sel, setSel] = useState(0);
  const [tab, setTab] = useState(0);
  const [week, setWeek] = useState(2); // week 3 in progress
  const [log, setLog] = useState(START);
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState('');
  const dlg = useRef(null);
  const pane = useRef(null);
  const timer = useRef(0);
  const seen = useRef(START.length);
  const seats = UNIVERSITY_COURSES.map((c) => seatFor(c.planId, '/university/portal'));
  const active = UNIVERSITY_COURSES[sel];

  useEffect(() => () => clearTimeout(timer.current), []);
  useEffect(() => {
    if (log.length === seen.current) return; // the log starts at its top; it follows only what is run
    seen.current = log.length;
    pane.current?.scrollTo({ top: pane.current.scrollHeight });
  }, [log]);

  const run = (cmd) => {
    if (busy) return;
    setBusy(true);
    setLog((l) => [...l, PROMPT + cmd]);
    timer.current = setTimeout(() => {
      setLog((l) => [...l, ...(OUT[cmd] || DONE), PROMPT + '_']);
      setBusy(false);
    }, 600);
  };
  const openCert = () => {
    setCopied('');
    window.__lenis?.stop();
    document.documentElement.classList.add('x-lock');
    dlg.current?.showModal();
  };
  const shut = () => dlg.current?.close();
  const gone = () => { window.__lenis?.start(); document.documentElement.classList.remove('x-lock'); };
  const copy = async () => {
    try { await navigator.clipboard.writeText(credentialLD(active)); setCopied(COPIED); } catch { setCopied(''); }
  };

  return (
    <main className="xuv xuv-portal" data-ask-name="Student portal">
      <div className="xuv-pbar">
        <div className="xuv-wrap wide xuv-pbar-in">
          <div className="xuv-pbar-l">
            <A to="/university" className="xuv-brand"><span className="xuv-b">hanzo.university</span><Chip tone="ok">Student portal</Chip></A>
            <span className="xuv-faint" aria-hidden="true">/</span>
            <h1 className="xuv-ptitle"><Per sel={sel}>{(c) => <>{c.code}: {c.title}</>}</Per></h1>
          </div>
          <div className="xuv-pbar-r">
            <span className="xuv-pstat"><Icon name="coins" size={14} /><span>Compute Credits:</span><span className="xuv-mono xuv-b"><Per sel={sel}>{(c, i) => (seats[i] ? `${seats[i].credit} Active` : 'Active')}</Per></span></span>
            <span className="xuv-pstat"><Icon name="shield" size={14} /><span>Student ID:</span><span className="xuv-mono xuv-b">hz-stu-9821a</span></span>
            <button type="button" className="x-btn sm solid" onClick={openCert}><Icon name="award" size={14} /><span>View Credential</span></button>
          </div>
        </div>
      </div>

      <div className="xuv-strip">
        <div className="xuv-wrap wide xuv-strip-in">
          <span className="xuv-mono xuv-faint">COURSES:</span>
          {UNIVERSITY_COURSES.map((c, i) => (
            <button key={c.slug} type="button" className="xuv-pick" aria-pressed={sel === i} onClick={() => setSel(i)}>{c.code} · {c.credential}</button>
          ))}
        </div>
      </div>

      <section className="xuv-sec tight">
        <div className="xuv-wrap wide">
          <div className="xuv-welcome">
            <div className="xuv-welcome-l">
              <span className="xuv-welcome-ico"><Icon name="checkCircle" size={20} /></span>
              <div className="xuv-stack tight">
                <div className="xuv-row xuv-row-l">
                  <span className="xuv-b"><Per sel={sel}>{(c) => <>Enrolled &amp; Active: {c.code} — {c.title}</>}</Per></span>
                  <Chip tone="ok">Day 1 deposit active</Chip>
                </div>
                <p className="xuv-sub">Your 25% compute credit rebate was deposited into your Hanzo Cloud account. All laboratory sandboxes are provisioned and accessible below.</p>
              </div>
            </div>
            <div className="xuv-welcome-r">
              <Per sel={sel}>{(c) => <A to={'/university/' + c.slug} className="x-btn sm"><Icon name="book" size={13} />Course Syllabus</A>}</Per>
              <button type="button" className="x-btn sm solid" disabled={busy} onClick={() => run(AUTOGRADE)} data-cta="university.autograder">Run Autograder →</button>
            </div>
          </div>

          <div className="xuv-grid c2 xuv-work">
            <div className="xuv-col">
              <div className="xuv-card xuv-pod" data-room="dark">
                <div className="xuv-pod-h">
                  <div className="xuv-pod-id">
                    <span className="xuv-dots3" aria-hidden="true"><i /><i /><i /></span>
                    <span className="xuv-mono xuv-b">gVisor Sandbox: pod-gvs-uswest2-01</span>
                    <Chip>Online</Chip>
                  </div>
                  <Tabs id="uvp" label="Workspace" tabs={TABS} value={tab} onChange={setTab} />
                </div>
                <TabPanel id="uvp" i={0} value={tab} className="xuv-pane">
                  <div className="xuv-log" ref={pane} role="log" aria-label="Shell">
                    {log.map((line, i) => <span key={i} className={'xuv-ln ' + tone(line)}>{line}</span>)}
                  </div>
                  <div className="xuv-quick">
                    <span className="xuv-mono xuv-faint">Quick Run:</span>
                    {QUICK.map((cmd) => <button key={cmd} type="button" className="xuv-cmd" disabled={busy} onClick={() => run(cmd)}>{cmd}</button>)}
                  </div>
                </TabPanel>
                <TabPanel id="uvp" i={1} value={tab} className="xuv-pane">
                  <p className="xuv-mono xuv-faint xuv-pane-h">AST Diff Inspector: Verified zero syntax regressions &amp; budget bounds</p>
                  <pre className="xuv-diff">
                    <span className="del">- def repair_ast(self, tree: ast.AST) -&gt; str:</span>
                    <span className="add">+ def repair_ast(self, tree: ast.AST, budget_usd: float = 0.05) -&gt; ast.AST:</span>
                    <span className="ctx">{'      """Generates syntax-safe diff with zero syntax regressions."""'}</span>
                    <span className="add">+     kai_check = self.evaluator.verify_state(tree, ceiling=budget_usd)</span>
                    <span className="add">{'+     assert kai_check.safe_to_execute, "Refusing execution: budget violation"'}</span>
                  </pre>
                  <p className="xuv-diff-ok"><Icon name="checkCircle" size={14} /><span>AST Tree-Sitter validation: 0 errors · 0 unused symbols · Exit Code 0</span></p>
                </TabPanel>
                <TabPanel id="uvp" i={2} value={tab} className="xuv-pane">
                  <span className="xuv-pane-t xuv-b">SWE-bench Automated Evaluation Harness</span>
                  {GRADER.map(([task, cost, time]) => (
                    <div key={task} className="xuv-gr">
                      <span className="xuv-gr-t"><Icon name="checkCircle" size={14} /><span className="xuv-mono">{task}</span></span>
                      <span className="xuv-gr-m"><span className="xuv-mono xuv-faint">{time} · {cost}</span><Chip>PASS</Chip></span>
                    </div>
                  ))}
                </TabPanel>
                <TabPanel id="uvp" i={3} value={tab} className="xuv-pane">
                  <span className="xuv-pane-t xuv-b">Compute Credit Rebate Metering</span>
                  <div className="xuv-grid c2 xuv-meter">
                    <div className="xuv-mcell"><span>Day 1 Deposit</span><span className="xuv-b"><Per sel={sel}>{(c, i) => (seats[i] ? `${seats[i].credit} USD` : '25% of tuition')}</Per></span></div>
                    <div className="xuv-mcell"><span>Balance Remaining</span><span className="xuv-b">$37.55 USD</span></div>
                  </div>
                  <div className="xuv-stack tight">
                    <span className="xuv-faint">Resource Usage Breakdown:</span>
                    {SPEND.map(([k, v]) => <div key={k} className="xuv-row xuv-spend"><span>{k}</span><span className="xuv-mono xuv-faint">{v}</span></div>)}
                  </div>
                </TabPanel>
              </div>

              <div className="xuv-card quiet xuv-hw">
                <div className="xuv-hw-t">
                  <Icon name="cpu" size={16} />
                  <div className="xuv-stack tight">
                    <span className="xuv-b">Hardware Leases: 4 vCPU · 16 GB RAM · Apple Silicon Metal / CUDA L4</span>
                    <span className="xuv-sub">Sandboxed under Google gVisor runsc kernel virtualization in region us-west-2</span>
                  </div>
                </div>
                <button type="button" className="x-btn sm" disabled={busy} onClick={() => run('hanzo dev restart')}>Restart Pod</button>
              </div>
            </div>

            <div className="xuv-col">
              <div className="xuv-card quiet xuv-mods">
                <div className="xuv-row">
                  <div className="xuv-stack tight">
                    <h2>Course Modules &amp; Progress</h2>
                    <span className="xuv-sub">Complete all 4 laboratory modules to qualify for HACE Credential Defense</span>
                  </div>
                  <Chip tone="ok">75% COMPLETED</Chip>
                </div>
                <div className="xuv-bar" aria-hidden="true"><i /></div>
                <Per sel={sel} as="div">
                  {(c) => (
                    <div className="xuv-modlist">
                      {c.syllabus.map((w, idx) => {
                        const done = idx < 2;
                        const now = idx === 2;
                        return (
                          <div key={w.code} className={'xuv-mod' + (now ? ' now' : '') + (done ? ' done' : '')}>
                            <button type="button" className="xuv-mod-h" aria-expanded={week === idx} onClick={() => setWeek(idx)}>
                              <span className="xuv-mod-n">{done ? <Icon name="check" size={13} /> : idx + 1}</span>
                              <span className="xuv-mod-t">
                                <span className="xuv-mod-l"><span className="xuv-mono xuv-faint">{w.code}</span><span className="xuv-b">{w.title}</span></span>
                                <span className="xuv-mod-lab">{w.lab}</span>
                              </span>
                              <Chip>{done ? 'COMPLETED' : now ? 'IN PROGRESS' : 'UP NEXT'}</Chip>
                            </button>
                            <div className="xuv-mod-d" hidden={week !== idx}>
                              <p className="xuv-wk-sum">{w.summary}</p>
                              <div className="xuv-stack tight">
                                <span className="xuv-sub b xuv-b">Lectures &amp; Topics:</span>
                                <ul className="xuv-checks">{w.lectures.map((l) => <li key={l}><Icon name="play" size={10} /><span>{l}</span></li>)}</ul>
                              </div>
                              <div className="xuv-row">
                                <span className="xuv-sub b xuv-b">Lab Assignment: Active in terminal above</span>
                                <button type="button" className="x-btn sm solid" disabled={busy} onClick={() => run(QUICK[0])}>Submit Lab →</button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </Per>
              </div>

              <div className="xuv-card xuv-cap">
                <Per sel={sel} as="div">
                  {(c) => (
                    <div className="xuv-stack">
                      <div className="xuv-row">
                        <span className="xuv-cap-t xuv-b"><Icon name="award" size={18} />Capstone Defense: {c.credential}</span>
                        <Chip tone="ok">Ready for defense</Chip>
                      </div>
                      <p className="xuv-sub">{c.capstone} Submit your repository for automated gVisor autograder verification.</p>
                      <div><button type="button" className="x-btn solid" onClick={openCert}>Claim &amp; Preview {c.credential} Credential →</button></div>
                    </div>
                  )}
                </Per>
              </div>
            </div>
          </div>
        </div>
      </section>

      <dialog ref={dlg} className="xuv-dlg" aria-labelledby="xuv-dlg-t" onClose={gone} onClick={(e) => { if (e.target === e.currentTarget) shut(); }}>
        <div className="xuv-dlg-in">
          <div className="xuv-row">
            <h2 id="xuv-dlg-t"><Icon name="award" size={20} />W3C Verifiable Credential Issued</h2>
            <button type="button" className="xuv-x" onClick={shut} aria-label="Close">✕</button>
          </div>
          <Per sel={sel} as="div">
            {(c) => (
              <div className="xuv-cert">
                <div className="xuv-row">
                  <span className="xuv-mono xuv-faint">HANZO UNIVERSITY · RESEARCH FOUNDATION</span>
                  <Chip tone="ok">Verified on-chain</Chip>
                </div>
                <div className="xuv-cert-who">
                  <span className="xuv-sub">This certifies that</span>
                  <span className="xuv-cert-name xuv-b">Alex Chen</span>
                  <span className="xuv-sub">HAS SUCCESSFULLY MASTERED ALL Academic specifications &amp; DEFENDED THE CAPSTONE FOR</span>
                  <span className="xuv-cert-cred xuv-b">{c.credentialFull} ({c.credential})</span>
                  <span className="xuv-sub">Course: {c.code} · Academic Units: {c.units}.0 · Level: {c.level}</span>
                </div>
                <dl className="xuv-sig">
                  <div><dt>DID Subject:</dt><dd>did:hanzo:user:hz-stu-9821a</dd></div>
                  <div><dt>Issuer DID:</dt><dd>did:hanzo:university:accreditation</dd></div>
                  <div><dt>Ed25519 Proof:</dt><dd>0x7f4a8b1c...99e2e89b (Verified)</dd></div>
                </dl>
                <div className="xuv-row xuv-cert-foot">
                  <div className="xuv-stack tight"><span className="xuv-sub">Accreditation Officer</span><span className="xuv-b">{c.instructor.name}</span><span className="xuv-sub">{c.instructor.role}</span></div>
                  <div className="xuv-stack tight xuv-right"><span className="xuv-sub">Issue Date</span><span className="xuv-b">October 2026</span><span className="xuv-sub">Tamper-Proof Proof v2.0</span></div>
                </div>
              </div>
            )}
          </Per>
          <p className="xuv-copied" role="status">{copied}</p>
          <div className="xuv-row">
            <div className="xuv-row xuv-row-l">
              <button type="button" className="x-btn sm" onClick={copy}><Icon name="copy" size={13} />Copy JSON-LD</button>
              <button type="button" className="x-btn sm" onClick={() => window.print()}><Icon name="download" size={13} />Download PDF</button>
            </div>
            <button type="button" className="x-btn solid" onClick={shut}>Close &amp; Return to Lab</button>
          </div>
        </div>
      </dialog>
    </main>
  );
}
