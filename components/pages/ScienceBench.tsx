'use client';
/* The Science workbench: a three-pane window (the project, the work, the evidence). Four sessions (the figure, the
   literature review, the scRNA-seq sweep, physics and PDEs); the right pane is the auditable artifact (code, log,
   messages, environment, review), the compiled manuscript, or the live notebook the agent and the researcher share.
   What works: switch session (the project menu or the list), open Customize and Files, expand to the whole screen (Esc
   leaves), pin a note on the figure and send it (v2 becomes v3), step the figure's versions, download its script, open
   the Reviewer's finding, run and add notebook cells, change the kernel language, evaluate an expression, ask in the
   composer. Every session and every right pane stays in the HTML (hidden, not removed). No sign-in is asked here, so the
   composer answers with Hanzo's own fallback line. Words, scripts and figures are Hanzo's (scienceData.js). */
import { useEffect, useState } from 'react';
import { Tabs, TabPanel } from '../kit';
import { Umap, UmapSite, UmapCell, Cascade, Citations } from './ScienceDiagrams';
import { BENCH as B, SAMOSA_CODE_V2, SAMOSA_CODE_V3, NOTEBOOK_CELLS, SCVI_ARMS, PHYSICS_MODES, SCIENCE_SKILLS, WORKSPACE_FILES } from './scienceData';
import './ScienceBench.css';

const P = {
  plus: 'M8 3v10M3 8h10', x: 'M3.5 3.5l9 9M12.5 3.5l-9 9', chevR: 'M6 3.5 10.5 8 6 12.5', chevL: 'M10 3.5 5.5 8 10 12.5', chevD: 'M3.5 6 8 10.5 12.5 6',
  check: 'M3.5 8.5l3 3 6-6.5', dl: 'M8 2.5v8M4.5 7 8 10.5 11.5 7M3 13.5h10', file: 'M4 2h5l3 3v9H4zM9 2v3h3', play: 'M5 3.2v9.6L12.5 8z',
  layers: 'M8 2 2 5.2l6 3.2 6-3.2L8 2ZM2 8.3 8 11.5l6-3.2M2 11.1 8 14.3l6-3.2', folder: 'M2 4.5h4l1.5 1.5H14V13H2z',
  gear: 'M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5ZM8 1.8v1.6M8 12.6v1.6M1.8 8h1.6M12.6 8h1.6M3.6 3.6l1.1 1.1M11.3 11.3l1.1 1.1M3.6 12.4l1.1-1.1M11.3 4.7l1.1-1.1',
  max: 'M9.5 2.5h4v4M6.5 13.5h-4v-4M13.5 2.5 9 7M2.5 13.5 7 9', min: 'M13.5 6.5h-4v-4M2.5 9.5h4v4M9.5 6.5 14 2M6.5 9.5 2 14',
  zap: 'M9 2 3.5 9H8l-1 5L12.5 7H8z', book: 'M2.5 3.5h4.5a1 1 0 0 1 1 1V13a1 1 0 0 0-1-1H2.5zM13.5 3.5H9a1 1 0 0 0-1 1V13a1 1 0 0 1 1-1h4.5z',
  term: 'M2.5 3.5h11v9h-11zM5 6.5l2 1.5-2 1.5M8.5 10h2.5', mic: 'M8 2.5a2 2 0 0 1 2 2V8a2 2 0 0 1-4 0V4.5a2 2 0 0 1 2-2ZM4 7.5a4 4 0 0 0 8 0M8 11.5v2',
  arrow: 'M3 8h9M8.5 4.5 12 8l-3.5 3.5', alert: 'M8 2 14 13H2zM8 6.5v3M8 11.2v.1',
  wrench: 'M10.5 3a3 3 0 0 0-2.6 4.3L3 12.2 3.8 13l4.9-4.9A3 3 0 0 0 13 5.5L11 7.5 9.5 6 11.5 4Z',
};
const Ic = ({ n, s = 14 }: { n: keyof typeof P; s?: number }) => <svg viewBox="0 0 16 16" width={s} height={s} aria-hidden="true" className="xsb-ic"><path d={P[n]} fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" /></svg>;

const KERNELS = ['python', 'julia', 'r', 'sql'];
const ACTIVE = B.active as [string, string, string | null][]; // scienceData.ts lists [session, title, count or null]
const label = (s: string) => B.projects.find((p) => p[0] === s)?.[1];
/* what the composer and the REPL hand their handlers: an event, or nothing (the Send button) */
type Ev = { preventDefault?: () => void } | undefined;
const pad = (e?: Ev) => { e?.preventDefault?.(); };

/* the composer: a field and a send; Enter sends too */
function Composer({ ph, label: aria, value, set, send, more }: { ph: string; label: string; value: string; set: (v: string) => void; send: (e?: Ev) => void; more?: boolean }) {
  return (
    <div className="xsb-comp">
      <Ic n="plus" s={15} />
      <input value={value} placeholder={ph} aria-label={aria} onChange={(e) => set(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') send(e); }} />
      {more && <Ic n="mic" s={15} />}
      <button type="button" aria-label={more ? 'Send prompt' : 'Submit physics query'} onClick={() => send()}><Ic n="arrow" /></button>
    </div>
  );
}

export default function Bench({ id, session: first = 'samosa', right: firstRight, url = false }: { id: string; session?: string; right?: string; url?: boolean }) {
  const [session, setSession] = useState(first);
  const [rightMode, setRightMode] = useState(firstRight || (first === 'scrna' || first === 'physics' ? 'notebook' : 'artifact'));
  const [tab, setTab] = useState(0);
  const [ver, setVer] = useState(2);
  const [pinOpen, setPinOpen] = useState(true);
  const [pinNote, setPinNote] = useState(B.figure.pin);
  const [history, setHistory] = useState([B.figure.history]);
  const [remoteOpen, setRemoteOpen] = useState(true);
  const [reviewerOpen, setReviewerOpen] = useState(true);
  const [full, setFull] = useState(false);
  const [modal, setModal] = useState<'customize' | 'files' | null>(null);
  const [menu, setMenu] = useState(false);
  const [lang, setLang] = useState('python');
  const [cells, setCells] = useState(NOTEBOOK_CELLS);
  const [expr, setExpr] = useState('');
  const [repl, setRepl] = useState([{ expr: 'clean.shape', out: '(40000, 2000)' }, { expr: 'list(clean.obs.columns[:4])', out: "['sample_id', 'donor_id', 'Site', 'initial_clustering']" }]);
  const [prompt, setPrompt] = useState('');
  const [turns, setTurns] = useState<Record<string, { role: string; text: string; meta?: string }[]>>({ samosa: [], literature: [], scrna: [], physics: [] });
  const kernel = B.kernel;

  // Hanzo's deep links on the first workbench: ?workbench=1 opens it large, ?session=scrna|literature|physics (or ?view=notebook) picks the session
  useEffect(() => {
    if (!url) return;
    const q = new URLSearchParams(location.search);
    if (q.get('workbench') === '1' || q.get('beta') === '1') setFull(true);
    if (q.get('view') === 'notebook' || q.get('session') === 'scrna') { setSession('scrna'); setRightMode('notebook'); }
    else if (q.get('session') === 'literature') { setSession('literature'); setRightMode('artifact'); }
    else if (q.get('session') === 'physics') { setSession('physics'); setRightMode('notebook'); }
  }, [url]);
  // the large view: the page behind it holds still, Esc leaves
  useEffect(() => {
    if (!full) return;
    document.documentElement.classList.add('x-lock');
    const k = (e: KeyboardEvent) => { if (e.key === 'Escape') setFull(false); };
    addEventListener('keydown', k);
    return () => { document.documentElement.classList.remove('x-lock'); removeEventListener('keydown', k); };
  }, [full]);

  const pick = (s: string) => { setSession(s); setMenu(false); setRightMode(s === 'scrna' || s === 'physics' ? 'notebook' : 'artifact'); };
  const sendPin = () => {
    const note = pinNote.trim();
    if (!note) return;
    const next = ver < 3 ? 3 : ver + 1;
    setVer(next);
    setHistory((h) => [...h, `v${ver} → v${next}: Applied pin #1 ("${note}") — stroke halo widened to 3.4pt and label contrast boosted.`]);
    setPinOpen(false);
  };
  const run = (cid: number) => setCells((cs) => cs.map((c) => (c.id !== cid ? c : {
    ...c,
    output: c.id === 28
      ? "loaded: (40000, 2000) uns keys: ['_scvi_manager_uuid', '_scvi_uuid', 'batch_Condition_colors']\nrewritten: 184.6 MB\nwrote covid_pbmc_40k_hvg.h5ad"
      : `Executed (${c.lang}) in 0.18s · shared state updated in ${kernel} kernel`,
  })));
  const addCell = () => {
    const nid = cells.length ? Math.max(...cells.map((c) => c.id)) + 1 : 1;
    setCells((cs) => [...cs, {
      id: nid,
      lang,
      code: lang === 'r'
        ? `# Reproducible targets + crew Slurm DAG & Bayesian MMRM\nlibrary(targets); library(crew.cluster); library(brms.mmrm); library(admiral)\ntar_option_set(controller = crew_controller_slurm(workers = 16, slurm_GPUs_per_node = 1))\nfit <- brm_mmrm(CHG ~ AVISIT * TRT01P + BASE, data = adlb, chains = 4)\nprint("brms.mmrm Rhat = 1.001 | Week 72 Δ = -16.4% (95% CrI: -18.1, -14.7)")`
        : session === 'physics'
          ? `# Ab-initio phonon band & spectral PDE conservation check\nimport numpy as np\nk_grid = np.linspace(0, np.pi, 128)\nomega_acoustic = 14.8 * np.abs(np.sin(k_grid / 2))\nprint(f"Max acoustic branch: {omega_acoustic.max():.2f} THz | Imaginary modes: 0")`
          : `# Shared agent-researcher cell in ${kernel}\nsc.tl.umap(clean)\nprint("UMAP coordinates:", clean.obsm["X_umap"].shape)`,
      output: lang === 'r' ? 'brms.mmrm Rhat = 1.001 | Week 72 Δ = -16.4% (95% CrI: -18.1, -14.7)' : session === 'physics' ? 'Max acoustic branch: 14.80 THz | Imaginary modes: 0' : 'UMAP coordinates: (40000, 2)',
    }]);
  };
  const evalExpr = (e?: Ev) => {
    pad(e);
    const x = expr.trim();
    if (!x) return;
    let out: string;
    if (x.includes('shape')) out = '(40000, 2000)';
    else if (x.includes('obs')) out = "Index(['sample_id', 'donor_id', 'Site', 'author_cell_type', 'disease', 'Status', 'cell_type'], dtype='object')";
    else if (x.includes('12') || x.includes('0.12')) out = '0.03 (3.0 percentage points; 25.0% relative reduction)';
    else if (x.includes('scvi') || x.includes('latent')) out = 'scVI 8-arm sweep active on lab_cluster A100s (best validation ELBO: -412.8 at n_latent=30, n_layers=2)';
    else if (x.includes('iwdemerit') || x.includes('lillymol') || x.includes('trxn')) out = 'LillyMol iwdemerit (275 rules): 58/64 leads pass with 0 structural demerits · trxn enumerated 1,240 analogs';
    else if (x.includes('targets') || x.includes('crew') || x.includes('mmrm') || x.includes('rfacts')) out = 'targets + crew (16 Slurm workers): brms.mmrm Rhat=1.001 · rfacts power=0.942 · admiral ADLB TLF verified';
    else if (x.includes('wdl') || x.includes('proteomics')) out = 'pytest-wdl: 14/14 WDL tasks green · 2,940 longitudinal proteins quantified (FDR < 0.01)';
    else out = `Out[${repl.length + 29}]: evaluated '${x}' in ${kernel} (${lang} live kernel)`;
    setRepl((r) => [...r, { expr: x, out }]);
    setExpr('');
  };
  const ask = (e?: Ev) => {
    pad(e);
    const q = prompt.trim();
    if (!q) return;
    setPrompt('');
    setTurns((t) => ({ ...t, [session]: [...t[session], { role: 'user', text: q }, { role: 'agent', text: B.reply.text, meta: B.reply.meta }] }));
  };
  const download = () => {
    const a = document.createElement('a');
    const blob = new Blob([ver >= 3 ? SAMOSA_CODE_V3 : SAMOSA_CODE_V2], { type: 'text/x-python' });
    a.href = URL.createObjectURL(blob);
    a.download = `samosa_fig1a_v${ver}.py`;
    a.click();
    URL.revokeObjectURL(a.href);
  };
  const chat = (s: string) => turns[s].map((t, i) => (
    <div key={i} className={'xsb-turn ' + t.role}><p>{t.text}</p>{t.meta && <span>{t.meta}</span>}</div>
  ));
  const showNotebook = rightMode === 'notebook' || session === 'scrna' || session === 'physics';
  const pane = showNotebook ? 'notebook' : session === 'literature' ? 'pdf' : 'artifact';
  const on = (s: string) => session !== s;

  return (
    <div className="xsb" data-slot="science-workbench" data-workbench-session={session} data-full={full ? '' : undefined}>
      <div className="xsb-win">
        {/* project */}
        <aside className="xsb-side">
          <div className="xsb-brand"><span data-b>{B.brand}</span><span>{B.beta}</span></div>
          <div className="xsb-proj">
            <button type="button" aria-expanded={menu} onClick={() => setMenu((v) => !v)}><span><Ic n="chevL" />{label(session)}</span><Ic n="chevD" /></button>
            <ul hidden={!menu}>{B.projects.map(([s, l]) => <li key={s}><button type="button" data-on={session === s ? '' : undefined} onClick={() => pick(s)}>{l}</button></li>)}</ul>
          </div>
          <div className="xsb-acts">
            <button type="button" onClick={() => { addCell(); setRightMode('notebook'); }}><Ic n="plus" s={15} />New</button>
            <button type="button" aria-pressed={modal === 'customize'} onClick={() => setModal(modal === 'customize' ? null : 'customize')}><Ic n="layers" s={15} />Customize</button>
            <button type="button" aria-pressed={modal === 'files'} onClick={() => setModal(modal === 'files' ? null : 'files')}><Ic n="folder" s={15} />Files</button>
          </div>
          <div className="xsb-list">
            <p>{session === 'samosa' ? 'Today' : 'Active'}</p>
            <ul hidden={session !== 'samosa'}>{B.today.map(([t, s], i) => <li key={t}><button type="button" data-session={s} data-on={i === 0 ? '' : undefined} onClick={() => pick(s)}><span aria-hidden="true">◦</span><span>{t}</span></button></li>)}</ul>
            <ul hidden={session === 'samosa'}>{ACTIVE.map(([s, t, n]) => <li key={s}><button type="button" data-session={s} data-on={session === s ? '' : undefined} onClick={() => pick(s)}><span aria-hidden="true">◦</span><span>{t}</span>{n && <span data-em>{n}</span>}</button></li>)}</ul>
          </div>
          <div className="xsb-acct" data-slot="science-account-badge">
            <span className="x-mono"><Ic n="gear" s={15} />{B.account}</span>
            <button type="button" aria-label={full ? 'Standard view' : 'Expand workbench'} onClick={() => setFull((v) => !v)}><Ic n={full ? 'min' : 'max'} s={13} /></button>
          </div>
        </aside>

        {/* the work */}
        <section className="xsb-mid">
          <div className="xsb-pane" hidden={on('samosa')}>
            <div className="xsb-strip"><Ic n="file" s={13} /><span className="x-mono">{B.figure.file}</span></div>
            <div className="xsb-body">
              <div className="xsb-fh"><span data-b className="x-mono">{B.figure.file}</span><button type="button" aria-label="Download figure script" onClick={download}><Ic n="dl" /></button></div>
              <div className="xsb-fig">
                <div className="xsb-fcap"><span data-b>a</span><span>{B.figure.caption}</span><span className="x-mono">v{ver}</span></div>
                <div className="xsb-plot">
                  <Umap figVersion={ver} />
                  <button type="button" className="xsb-pin" aria-label="Inspect annotation pin 1" onClick={() => setPinOpen((v) => !v)}>1</button>
                  <div className="xsb-pop" data-slot="science-pin-popover" hidden={!pinOpen}>
                    <div><i>1</i><input value={pinNote} aria-label="Visual review note" onChange={(e) => setPinNote(e.target.value)} /></div>
                    <button type="button" data-slot="science-pin-send" onClick={sendPin}>Send</button>
                  </div>
                </div>
                <p className="xsb-legend"><span>cell-type family</span>{B.figure.legend.map((f) => <span key={f}><i aria-hidden="true">●</i><span>{f}</span></span>)}</p>
                <div className="xsb-insets">
                  {B.figure.insets.map((n) => (
                    <div key={n.tag}><span data-b>{n.tag}</span><span>{n.meta}</span>{n.items.map((x) => <span key={x}>• {x}</span>)}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="xsb-pane" hidden={on('literature')}>
            <div className="xsb-body">
              <h4>{B.literature.title}</h4>
              <p className="xsb-ask">{B.literature.ask}</p>
              <p className="xsb-step"><span><Ic n="chevR" />{B.literature.steps[0]}</span><span className="x-mono">{B.literature.steps[1]}</span></p>
              <p>{B.literature.dispatch}</p>
              <p className="xsb-step"><span><Ic n="check" />{B.literature.agents[0]}</span><span className="x-mono">{B.literature.agents[1]}</span></p>
              <div className="xsb-rev" data-slot="science-reviewer-card">
                <button type="button" aria-expanded={reviewerOpen} onClick={() => setReviewerOpen((v) => !v)}><span><Ic n="alert" />{B.literature.reviewer.title}</span><Ic n="chevD" /></button>
                <div hidden={!reviewerOpen}>
                  <p><span data-em>{B.literature.reviewer.chip}</span><span data-b>{B.literature.reviewer.head}</span></p>
                  <p>{B.literature.reviewer.body}</p>
                  <p className="xsb-fine">{B.literature.reviewer.fine}</p>
                </div>
              </div>
              <div className="xsb-rec"><span data-b className="x-mono">{B.literature.record.head}</span><p>{B.literature.record.body}</p></div>
              {chat('literature')}
            </div>
            <div className="xsb-foot">
              <p className="xsb-fine">{B.literature.status.map((s) => <span key={s}>{s}</span>)}</p>
              <Composer ph={B.literature.prompt} label="Ask Hanzo Science" value={prompt} set={setPrompt} send={ask} more />
            </div>
          </div>

          <div className="xsb-pane" hidden={on('scrna')}>
            <div className="xsb-body">
              <h4>{B.scrna.title}</h4>
              <p className="xsb-ask">{B.scrna.text}</p>
              <div className="xsb-env x-mono"><p>{B.scrna.env[0]}</p><p>{B.scrna.env[1]}</p></div>
              <table className="xsb-arms">
                <thead><tr>{B.scrna.head.map((h) => <th key={h} scope="col">{h}</th>)}</tr></thead>
                <tbody>{SCVI_ARMS.map((r) => <tr key={r.arm}><td>{r.arm}</td><td>{r.latent}</td><td>{r.layers}</td><td>{r.label}</td></tr>)}</tbody>
              </table>
              <div className="xsb-umaps">
                <span data-b>{B.scrna.umap}</span>
                <div><div><span>{B.scrna.umaps[0]}</span><UmapSite /></div><div><span>{B.scrna.umaps[1]}</span><UmapCell /></div></div>
                <div className="xsb-remote" data-slot="science-remote-popover" hidden={!remoteOpen}>
                  <span data-b>{B.scrna.remote}</span>
                  {SCVI_ARMS.slice(0, 6).map((j) => <p key={j.arm}><span className="x-mono"><Ic n="zap" s={11} />lab_cluster · {j.label.slice(0, 18)}...</span><span className="x-mono">{j.elapsed}</span></p>)}
                </div>
              </div>
              {chat('scrna')}
            </div>
            <div className="xsb-foot">
              <button type="button" className="xsb-run" aria-expanded={remoteOpen} onClick={() => setRemoteOpen((v) => !v)}><Ic n="zap" s={12} />{B.scrna.running}</button>
              <Composer ph={B.scrna.prompt} label="Ask Hanzo Science" value={prompt} set={setPrompt} send={ask} more />
            </div>
          </div>

          <div className="xsb-pane" hidden={on('physics')}>
            <div className="xsb-body">
              <div className="xsb-ph"><div><h4>{B.physics.title}</h4><p>{B.physics.sub}</p></div><span className="xsb-chip">{B.physics.chip}</span></div>
              <div className="xsb-fig">
                <div className="xsb-fcap"><span data-b>{B.physics.plot}</span><span className="x-mono">{B.physics.path}</span></div>
                <div className="xsb-cas"><Cascade /></div>
              </div>
              <ul className="xsb-modes">{PHYSICS_MODES.map((m) => <li key={m.id}><p><span data-b>{m.branch}</span><span className="x-mono">{m.freq} · {m.symmetry}</span></p><span>{m.status}</span></li>)}</ul>
              {chat('physics')}
            </div>
            <div className="xsb-foot"><Composer ph={B.physics.prompt} label="Ask physics and PDE workbench" value={prompt} set={setPrompt} send={ask} /></div>
          </div>
        </section>

        {/* the evidence */}
        <section className="xsb-end">
          <div className="xsb-pane" data-slot="hanzo-notebook-pane" hidden={pane !== 'notebook'}>
            <div className="xsb-body">
              <div className="xsb-nh">
                <span><Ic n="book" s={15} /><span data-b>{B.notebook.title}</span><span data-em>{kernel}</span><span>{B.notebook.shared}</span></span>
                <span>
                  <button type="button" onClick={() => setLang((l) => KERNELS[(KERNELS.indexOf(l) + 1) % 4])}>● Live · {lang}<Ic n="chevD" s={12} /></button>
                  <button type="button" onClick={addCell}><Ic n="plus" s={12} />{B.notebook.cell}</button>
                </span>
              </div>
              {cells.map((c) => (
                <div key={c.id} className="xsb-cell">
                  <p><span className="x-mono">[{c.id}] <span data-em>{c.lang}</span></span><button type="button" onClick={() => run(c.id)}><Ic n="play" s={11} />{B.notebook.run}</button></p>
                  <pre tabIndex={0}><code><span>{c.code}</span></code></pre>
                  <span className="x-mono">{B.notebook.out}</span>
                  <pre className="out"><code><span>{c.output}</span></code></pre>
                </div>
              ))}
            </div>
            <div className="xsb-repl" data-slot="hanzo-notebook-repl">
              <p className="x-mono"><span data-b>Python — {kernel} kernel</span><span>{B.notebook.foot}</span></p>
              <div className="x-mono">{repl.slice(-2).map((r, i) => <p key={i}><span>{'>>>'} {r.expr}</span><span>{r.out}</span></p>)}</div>
              <form onSubmit={evalExpr}>
                <input value={expr} placeholder={B.notebook.prompt} aria-label="Live kernel expression" onChange={(e) => setExpr(e.target.value)} />
                <button type="submit" data-slot="hanzo-notebook-eval">Eval</button>
              </form>
            </div>
          </div>

          <div className="xsb-pane" data-slot="science-pdf-pane" hidden={pane !== 'pdf'}>
            <div className="xsb-body">
              <div className="xsb-fh"><span data-b className="x-mono"><Ic n="file" s={15} />{B.literature.pdf.file}</span><button type="button" onClick={() => setRightMode('notebook')}>Open Hanzo Notebook</button></div>
              <div className="xsb-paper">
                <h4>{B.literature.pdf.title}</h4>
                <p className="xsb-fine">{B.literature.pdf.sub}</p>
                <dl>{B.literature.pdf.metrics.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>
                <div className="xsb-cols">
                  <div>
                    <figure><div className="xsb-cit"><Citations /></div><figcaption>{B.literature.pdf.figure}</figcaption></figure>
                    {B.literature.pdf.left.map(([k, t]) => (k === 'h' ? <h5 key={t}>{t}</h5> : <p key={t}>{t}</p>))}
                  </div>
                  <div>
                    <div className="xsb-eq x-mono">{B.literature.pdf.equations.map((q) => <p key={q}>{q}</p>)}</div>
                    {B.literature.pdf.right.map(([k, t]) => (k === 'h' ? <h5 key={t}>{t}</h5> : <p key={t}>{t}</p>))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="xsb-pane" data-slot="science-artifact-inspector" hidden={pane !== 'artifact'}>
            <div className="xsb-body">
              <div className="xsb-fh">
                <span className="xsb-ver">
                  <span data-b className="x-mono">{B.figure.file}</span>
                  <button type="button" aria-label="Previous version" onClick={() => setVer((v) => Math.max(1, v - 1))}><Ic n="chevL" /></button>
                  <span data-em>v{ver}</span>
                  <button type="button" aria-label="Next version" onClick={() => setVer((v) => Math.min(3, v + 1))}><Ic n="chevR" /></button>
                </span>
                <button type="button" onClick={() => setRightMode('notebook')}><Ic n="term" s={12} />Open Hanzo Notebook</button>
              </div>
              <Tabs id={id + '-insp'} label="Artifact" tabs={B.figure.tabs} value={tab} onChange={setTab} className="xsb-tabs" />
              <p className="xsb-dl"><button type="button" onClick={download}><Ic n="dl" s={13} />Download script</button></p>
              <p className="xsb-inputs"><span>Inputs</span>{B.figure.inputs.map((f) => <span data-em key={f}>{f}</span>)}</p>
              <div className="xsb-tab">
                <TabPanel id={id + '-insp'} i={0} value={tab}>
                  <pre tabIndex={-1} hidden={ver >= 3}><code><span>{SAMOSA_CODE_V2}</span></code></pre>
                  <pre tabIndex={-1} hidden={ver < 3}><code><span>{SAMOSA_CODE_V3}</span></code></pre>
                </TabPanel>
                <TabPanel id={id + '-insp'} i={1} value={tab}>
                  {B.figure.log.map((l) => <p key={l} className="x-mono">{l}</p>)}
                  {history.map((h, i) => <p key={i} className="x-mono dim">[revision] {h}</p>)}
                </TabPanel>
                <TabPanel id={id + '-insp'} i={2} value={tab}>
                  <p>Researcher pin #1 on muscle cluster: “{pinNote}”</p>
                  <p className="dim">{B.figure.agent}</p>
                </TabPanel>
                <TabPanel id={id + '-insp'} i={3} value={tab}>
                  <p className="x-mono">{B.figure.env[0]}</p>
                  <p className="x-mono dim">{B.figure.env[1]}</p>
                </TabPanel>
                <TabPanel id={id + '-insp'} i={4} value={tab}>
                  <p><span data-b>{B.figure.review[0]}</span></p>
                  <p className="dim">{B.figure.review[1]}</p>
                  <p className="dim">{B.figure.review[2]}</p>
                </TabPanel>
              </div>
            </div>
          </div>
        </section>

        {/* Customize and Files */}
        {(['customize', 'files'] as const).map((m) => (
          <div key={m} className="xsb-drawer" data-slot={`science-${m}-drawer`} hidden={modal !== m}>
            <div className="xsb-dh"><span data-b><Ic n={m === 'customize' ? 'wrench' : 'folder'} s={16} />{B[m]}</span><button type="button" aria-label="Close panel" onClick={() => setModal(null)}><Ic n="x" s={16} /></button></div>
            {m === 'customize' ? (
              <ul>{SCIENCE_SKILLS.map((k) => <li key={k.name}><p><span data-b>{k.name}</span><span data-em>{k.category}</span></p><span>{k.desc}</span></li>)}</ul>
            ) : (
              <ul className="files">{WORKSPACE_FILES.map((f) => (
                <li key={f.name}><button type="button" onClick={() => { pick(f.session); if (f.kind === 'notebook') setRightMode('notebook'); setModal(null); }}><span className="x-mono"><Ic n="file" s={15} />{f.name}</span><span className="x-mono">{f.size}</span></button></li>
              ))}</ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
