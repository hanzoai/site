/* /science: Hanzo Science's own copy, read from its page (hanzo-inc/app components/science). Every string here is Hanzo's.
   The constants below the first screen's words are the data of the interactive parts: the walkthroughs, the connectors, the
   five fields of the first screen, and the workbench's sessions. */

export const HERO = {
  kicker: 'Hanzo Science · Universal Research Operating System',
  title: 'Make science agentic.',
  claim: 'The AI platform for research, discovery, and engineering.',
  lede: 'Turn questions into investigations, ideas into experiments, and experimental results into the next breakthrough. Hanzo Science brings AI agents, scientific models, data, computation, and research tools together in one environment.',
  points: [
    'Design new AI architectures · Discover materials · Investigate biology · Simulate physical systems · Explore the universe',
    "One platform. Every discipline. Research without boundaries—from individual researchers to the world's largest R&D organizations.",
  ],
  acts: [
    ['Explore Hanzo Science', '#introducing-hanzo-science'],
    ['See research workflows', '#how-it-works'],
    ['Partner with us', '/contact-sales'],
  ],
  workspace: 'Hanzo Science Workspace · Select a research field to see how the same product adapts',
};

/** The heads of the numbered bands. */
export const BANDS = {
  loop: { num: '01', id: 'introducing-hanzo-science', title: 'One scientific execution engine across every research-driven industry', lede: 'Scientific and engineering breakthroughs are slowed by the gaps between literature, data, code, simulators, instruments, compute clusters, and peer review. Hanzo Science unifies the six-stage research loop so every hypothesis, simulation, figure, and decision stays linked to the exact code, container digest, and evidence that produced it.' },
  lab: { num: '02', id: 'hanzo-ai-lab', title: 'Built inside a real AI research lab — Hanzo AI runs on Hanzo Science', lede: 'Hanzo AI is the first full-scale research organization operating on Hanzo Science. Our teams use the same ResearchProgram graph, evaluation harnesses, and 7-dimension verification engine to design architectures, curate pretraining mixtures, quantize KV caches, optimize Kai decision latency, and qualify Enso and Zen model releases.' },
  graph: { num: '03', id: 'control-plane', title: 'Universal Research Graph, Control Plane & Open Standards', lede: 'Instead of building separate silos for each discipline, Hanzo Science represents every investigation as a typed ResearchProgram / ScienceWorkload object orchestrated by Enso, reasoned over by Zen, and governed by Kai—with native export to CWL, RO-Crate, and W3C PROV-O.' },
  how: { num: '04', id: 'how-it-works', title: 'How it works across disciplines', lede: 'Step through multi-discipline simulation and formal verification pipelines, dispatch GPU parameter sweeps alongside a shared live Hanzo Notebook kernel, and audit primary literature against NCBI E-utilities and Crossref before compiling LaTeX manuscripts.' },
  verify: { num: '05', id: 'verification-governance', title: 'Scientific verification, graduated autonomy & flagship workloads', lede: 'High-consequence R&D cannot rely on opaque summaries. Hanzo Science evaluates every workload across seven independent verification dimensions and four graduated autonomy modes.' },
  start: { num: '06', id: 'getting-started', title: 'Getting started with Hanzo Science' },
};

/** The three workbenches on the page: what each is, and the state it opens in. */
export const BENCHES = {
  figure: { title: 'Interactive Figure, Manuscript & Code Workbench', lede: 'Inspect figures, click directly on plot annotations to refine the underlying Python/R script, switch between physics, fluid PDE, chemistry, Lean 4 proof, and clinical R&D artifacts, and audit the execution log.' },
  notebook: { title: 'Manages cluster compute and shares a live Hanzo Notebook kernel', lede: 'Dispatch multi-arm GPU sweeps with full software version, hardware, seed, and baseline tracking while inspecting live variables in memory.' },
  literature: { title: 'Independent database retrieval & assertion-level citation review', lede: 'Rather than trusting unverified model prose, the Reviewer agent queries NCBI E-utilities, Crossref, OpenAlex, and arXiv directly and verifies claim-level table support before compiling the PDF.' },
};

export const CONNECTOR_TABS = [
  { id: 'all', label: 'All' },
  { id: 'ai', label: 'AI & ML' },
  { id: 'semiconductors', label: 'Semiconductors' },
  { id: 'physics', label: 'Physics & Materials' },
  { id: 'climate', label: 'Earth & Climate' },
  { id: 'chemistry', label: 'Chemistry' },
  { id: 'mathematics', label: 'Mathematics' },
  { id: 'biology', label: 'Biology & Clinical' },
  { id: 'compute', label: 'Compute & Standards' },
];

/** The research document before the last band: [kind, text, link] where kind is p, h2 or a (a paragraph may carry an emphasised word). */
export const DOCUMENT = [
  ['p', 'Scientific review often turns on a small detail. Suppose a veterinary study reports that missed appointments fell from 12% to 9% after clinics introduced reminders. That’s a drop of three percentage points, or 25% relative to the original rate. Both figures are correct. Whether reminders caused the decline is a separate question, and the answer depends on how the study was designed.'],
  ['p', 'Hanzo Science helps researchers keep those distinctions visible as they work.'],
  ['h2', 'Read across the literature and your own records'],
  ['p', 'Start with a question, a collection of papers, or an existing dataset. Hanzo searches the public web alongside the articles, notes, and datasets your team adds. It can find an exact phrase or related work that uses different terminology, then cite the material behind its answer.'],
  ['em', ['For a team studying appointment reminders, that could mean finding papers that describe missed visits as ', 'nonattendance', ', pulling out how each study defined a missed visit, and identifying which studies used a comparison group. A colleague can open the cited source and check whether the studies belong in the same analysis.']],
  ['h2', 'Run the analysis and keep the evidence'],
  ['p', 'Use a Hanzo sandbox to run a calculation, or a GPU machine for work that needs more compute. Keep the output alongside the question it answers. If two clinics counted cancellations differently, a researcher can rerun the comparison using a common definition and see how much the finding changes.'],
  ['p', 'Hanzo also records when evidence entered the research record. When a new paper changes the team’s conclusion, researchers can revisit what they knew at the time of the original decision and identify the evidence that changed their minds.'],
  ['h2', 'Test the research method itself'],
  ['p', 'Teams can use Hanzo Evals to compare prompts or models against the same set of expert-reviewed questions. A lab might score three things separately: whether the system found the right paper, whether the cited passage supports the claim, and whether the calculation is correct. That makes it easier to see exactly where a revised method improves the work and where it still needs expert judgment.'],
  ['h2', 'Get started'],
  ['p', 'Bring a question your team has already answered, the sources you trusted, and the result you accepted. Run that question through Hanzo Science and have a colleague review the evidence. A useful first test is whether that colleague can explain how the team reached its conclusion and reproduce the calculation behind it.'],
  ['a', 'Explore Hanzo for research', '/solutions/research'],
];

/** The three cards of "Getting started". */
export const START = [
  { title: 'macOS, Linux, Web & SSH / Slurm', text: 'Available in beta across Individual, Team, Enterprise, and Private deployments. Run locally or attach to your own Linux workstation, Kubernetes cluster, or HPC login node over SSH.', mono: '$ hanzo science attach --ssh lab_cluster --program prog_ai_kai_latency_v4' },
  { title: 'Academic, National Lab & Open Science Grants', text: 'Discounted Team seats for universities, research hospitals, and nonprofit institutes, plus up to $30,000 in model credits and $2,000 in on-demand GPU compute for 50 open research programs.' },
  { title: 'Agentic R&D Operations on hanzo.team', text: 'Coordinate @Sci, @Dev, @Data, @QA, @Cyber, @Doc, and @Mana in shared channels with live notebooks, targets + crew Slurm DAGs, RO-Crate provenance, and 7-dimension Reviewer sign-off.', mono: 'hanzo.team · #research · Enso + Zen + Kai + 7/7 Verified ✓' },
];

/* The eight walkthroughs of "How it works": a discipline, its title and length, and its chapters (a step, a time, a line, its detail, its script, its measure). */
export const VIDEO_DEMOS = [
  {
    id: 'ai',
    discipline: 'AI & ML Systems',
    title: 'Kai decision latency & Enso routing ablations',
    duration: '01:15',
    summary: 'Run Hanzo AI Lab quantization, KV-cache routing, and calibration sweeps on Hanzo Science while auditing ECE and tail latency.',
    chapters: [
      {
        step: '01',
        time: '00:00',
        label: 'Define workload',
        detail: 'Register prog_ai_kai_latency objective, baseline weights, and policy evaluation harness.',
        code: `program = ScienceWorkload.load("prog_ai_kai_latency.yaml")
harness = EvaluationHarness(dataset="kai_policy_eval_120k.parquet", seed=2026)`,
        metric: '120k policy traces · seed=2026',
      },
      {
        step: '02',
        time: '00:26',
        label: 'Dispatch 12-arm sweep',
        detail: 'Evaluate FP8 KV-cache, speculative tree depth, and Enso router thresholds across 8× H100 GPUs.',
        code: `runs = enso.dispatch_sweep(
    model="kai-1.1",
    arms={"kv_dtype": ["fp8_e4m3", "bf16"], "tree_depth": [2, 3, 4]},
    gpus=8,
)`,
        metric: 'p99 latency -38.4%',
      },
      {
        step: '03',
        time: '00:52',
        label: 'Verify ECE & qualify',
        detail: 'Confirm expected calibration error stays below 0.012 and export RO-Crate release bundle.',
        code: `assert runs.best.ece <= 0.012 and runs.best.policy_f1 >= baseline.policy_f1
runs.best.export_ro_crate("kai_1_1_release_qualification.ro-crate.json")`,
        metric: 'ECE 0.011 · Qualified ✓',
      },
    ],
  },
  {
    id: 'materials',
    discipline: 'Physics & Materials',
    title: 'Crystal relaxation & DFPT phonon stability',
    duration: '01:20',
    summary: 'Screen candidate solid-state materials, evaluate forces on an 8×8×8 q-mesh, and verify acoustic sum rule (ASR) stability before synthesis.',
    chapters: [
      {
        step: '01',
        time: '00:00',
        label: 'Build supercells',
        detail: 'Load candidate crystal structures and generate finite-displacement 2×2×2 supercells.',
        code: `atoms = read("candidate_lattice.cif")
phonon = Phonopy(atoms, supercell_matrix=[[2,0,0],[0,2,0],[0,0,2]])
phonon.generate_displacements(distance=0.01)`,
        metric: '48 symmetries · 0.01 Å',
      },
      {
        step: '02',
        time: '00:28',
        label: '8×8×8 q-mesh & ASR',
        detail: 'Evaluate atomic forces on GPU, enforce translational acoustic sum rule at Γ, and solve dynamical matrix.',
        code: `forces = evaluate_forces(phonon.supercells_with_displacements, device="cuda")
phonon.produce_force_constants(forces=forces)
phonon.symmetrize_force_constants(use_asr=True)
phonon.run_mesh([8, 8, 8])`,
        metric: 'max |F| < 1e-4 eV/Å · 8×8×8 q-mesh',
      },
      {
        step: '03',
        time: '00:56',
        label: 'Verify DFPT tolerance',
        detail: 'Reviewer confirms zero imaginary modes beyond acoustic sum rule tolerance at Γ and locks the figure.',
        code: `qpoints, weights, freqs, _ = phonon.get_mesh_dict().values()
assert np.min(freqs) >= -0.03  # ASR tolerance at Gamma
export_figure("phonon_dispersion_8x8x8.pdf", freqs, dpi=300)`,
        metric: '|ω_ASR(Γ)| < 0.03 THz · 0 imaginary modes',
      },
    ],
  },
  {
    id: 'semiconductors',
    discipline: 'Semiconductors & EDA',
    title: 'RTL microarchitecture PPA & formal liveness',
    duration: '01:18',
    summary: 'Explore accelerator NoC router microarchitectures, run OpenROAD synthesis timing closure, and verify deadlock freedom.',
    chapters: [
      {
        step: '01',
        time: '00:00',
        label: 'Parameterize RTL',
        detail: 'Generate SystemVerilog router variants across virtual-channel depth and crossbar radix.',
        code: `grid = {"vc_depth": [2, 4, 8], "flit_width": [256, 512], "arbiter": ["matrix", "rr"]}
rtl_builds = verilator.elaborate_sweep("noc_router.sv", grid)`,
        metric: '12 RTL configurations',
      },
      {
        step: '02',
        time: '00:28',
        label: 'OpenROAD STA & power',
        detail: 'Run synthesis and static timing analysis at SS 0.72V 125°C corner to rank PPA Pareto frontier.',
        code: `ppa = openroad.run_sta_and_power(rtl_builds, corner="ss_0p72v_125c")
frontier = ppa.pareto_front(minimize=["area_um2", "power_mw"], maximize=["fmax_ghz"])`,
        metric: 'Area -11.2% · WNS +18 ps',
      },
      {
        step: '03',
        time: '00:54',
        label: 'Formal SVA proof',
        detail: 'Verify credit-return invariants and deadlock freedom across all virtual channels.',
        code: `proof = sby.verify_properties("noc_credit_liveness.sby", engine="smtbmc")
assert proof.status == "PASS" and proof.counterexamples == 0`,
        metric: '0 counterexamples · Verified ✓',
      },
    ],
  },
  {
    id: 'fluid',
    discipline: 'Earth & Fluid PDEs',
    title: '3D Navier-Stokes & climate rollout',
    duration: '01:30',
    summary: 'Run spectral PDE and neural operator rollouts over multi-terabyte climate and fluid grids while auditing energy conservation.',
    chapters: [
      {
        step: '01',
        time: '00:00',
        label: 'Attach Zarr dataset',
        detail: 'Mount reanalysis tensors in the shared Hanzo Notebook kernel without copying files.',
        code: `ds = xr.open_zarr("cluster://vorticity_512cube.zarr")
omega_0 = torch.as_tensor(ds["vorticity"].isel(time=0).values, device="cuda")`,
        metric: '∇·u = 1.4e-7 L2',
      },
      {
        step: '02',
        time: '00:32',
        label: 'Scale GPU sweep',
        detail: 'Dispatch Reynolds-number rollouts across cluster GPUs and stream spectra live.',
        code: `sweep = dispatch_cluster_sweep(
    script="spectral_rollout.py",
    params={"reynolds": [1e4, 5e4, 1e5]},
    gpus=8,
)`,
        metric: 'E(k) ∝ k^(-5/3)',
      },
      {
        step: '03',
        time: '01:04',
        label: 'Annotate spectrum',
        detail: 'Pin a note on the dissipation tail to overlay theoretical bounds and re-render.',
        code: `ax.loglog(k_bins, E_k, lw=2.2, label="512³ rollout")
ax.loglog(k_ref, 1.58 * k_ref**(-5/3), "--", label="k^(-5/3)")`,
        metric: 'ΔE/E₀ < 8.3e-5',
      },
    ],
  },
  {
    id: 'chemistry',
    discipline: 'Chemistry & MedChem',
    title: 'LillyMol iwdemerit, 3D co-folding & ΔΔG',
    duration: '01:15',
    summary: 'Enumerate analogs with trxn, screen 275 MedChem rules with LillyMol iwdemerit, co-fold 3D poses, and rank leads by OpenMM ΔΔG.',
    chapters: [
      {
        step: '01',
        time: '00:00',
        label: 'LillyMol iwdemerit & trxn',
        detail: 'Enumerate congeneric library via trxn and filter 275 medicinal chemistry rules with iwdemerit.',
        code: `analogs = lillymol.trxn_enumerate(scaffold_rxn, building_blocks)
clean_series = [m for m in analogs if lillymol.iwdemerit(m) == 0]`,
        metric: '58 / 64 zero-demerit leads',
      },
      {
        step: '02',
        time: '00:26',
        label: 'Co-fold complex',
        detail: 'Generate 3D pocket coordinates and measure key catalytic contact distances.',
        code: `pose = cofold_complex(target_fasta, clean_series[0], seed=42)
contacts = interaction_fingerprint(pose, cutoff=3.8)`,
        metric: 'pLDDT 91.4 · 0.68 Å',
      },
      {
        step: '03',
        time: '00:52',
        label: 'Audit ΔΔG cycle',
        detail: 'Run OpenMM free-energy perturbation edges and verify cycle closure hysteresis.',
        code: `fep = run_fep_network(clean_series[:12], n_lambda=16)
assert fep.max_cycle_hysteresis_kcal < 0.45`,
        metric: 'Hysteresis 0.28 kcal/mol',
      },
    ],
  },
  {
    id: 'mathematics',
    discipline: 'Mathematics',
    title: 'Lean 4 formal proof & symbolic check',
    duration: '01:10',
    summary: 'Decompose theorems into sub-lemmas, test symbolic bounds in SymPy, and verify every proof step in the Lean 4 kernel.',
    chapters: [
      {
        step: '01',
        time: '00:00',
        label: 'Symbolic check',
        detail: 'Test interpolation exponents in the notebook before formalizing.',
        code: `s, d, p, q = sp.symbols("s d p q", positive=True)
theta = sp.simplify((1/q - 1/p) / (s/d + 1/q - 1/2))`,
        metric: '14 subgoals defined',
      },
      {
        step: '02',
        time: '00:24',
        label: 'Reviewer catch',
        detail: 'Reviewer catches a missing boundary trace hypothesis and supplies a counterexample.',
        code: `lemma energy_bound (u : SobolevH1Zero Ω) (h : div u = 0) :
    ‖∇ u‖_L2 ^ 2 ≤ C * ‖Δ u‖_HMinus1 * ‖u‖_H1 := by
  exact poincare_trace_zero u h`,
        metric: '1 boundary fix applied',
      },
      {
        step: '03',
        time: '00:48',
        label: 'Kernel check',
        detail: 'Verify zero sorry axioms in Lean 4 and compile the paired LaTeX proof.',
        code: `#guard_msgs in
#print axioms global_regularity_bound
-- Standard axioms only · 0 sorry`,
        metric: '0 sorry · Verified',
      },
    ],
  },
  {
    id: 'biology',
    discipline: 'Genomics & Single-Cell',
    title: 'Cross-species atlas & scVI sweep',
    duration: '01:35',
    summary: 'Integrate 5,672 cell types across 138 species in a shared live kernel and refine publication figures in-line.',
    chapters: [
      {
        step: '01',
        time: '00:00',
        label: 'Load atlas h5ad',
        detail: 'Stream sparse count matrices into the shared `liver-pipeline` kernel.',
        code: `adata = sc.read_h5ad("cross_species_atlas_138sp.h5ad", backed="r")
print(adata.shape, adata.obs["species"].nunique())`,
        metric: '138 species · 5,672 types',
      },
      {
        step: '02',
        time: '00:34',
        label: '8-arm GPU sweep',
        detail: 'Train latent dimension and layer sweeps across 8× A100-80GB GPUs vs PCA/Harmony baseline.',
        code: `scvi.model.SCVI.setup_anndata(clean, layer="counts", batch_key="sample_id")
model = scvi.model.SCVI(clean, n_latent=30, n_layers=2)`,
        metric: 'cLISI 0.94 · iLISI 0.88 (2.08 GPU-hrs)',
      },
      {
        step: '03',
        time: '01:08',
        label: 'Refine figure v3',
        detail: 'Click directly on overlapping labels to widen stroke halos and re-render.',
        code: `halo = [pe.withStroke(linewidth=3.4, foreground="white")]
ax.text(tx, ty, label, fontsize=9.5, weight="bold", path_effects=halo)`,
        metric: 'v3 locked · Reviewer ✓',
      },
    ],
  },
  {
    id: 'clinical',
    discipline: 'Clinical & Proteomics R&D',
    title: 'targets + crew DAGs, Bayesian MMRM & WDL proteomics',
    duration: '01:25',
    summary: 'Verify WDL proteomics pipelines with pytest-wdl, dispatch targets + crew Slurm DAGs for brms.mmrm & rfacts, and compile admiral CDISC tables.',
    chapters: [
      {
        step: '01',
        time: '00:00',
        label: 'pytest-wdl & surfaceome',
        detail: 'Validate WDL proteomics workflows and map transmembrane topology with surfaltr & BioRels.',
        code: `pytest_wdl.run_workflow("longitudinal_proteomics.wdl", inputs="cohort_w72.json")
topo = surfaltr.compare_topologies(uniprot_ids, db="biorels")`,
        metric: '14/14 WDL green · 2,940 proteins',
      },
      {
        step: '02',
        time: '00:30',
        label: 'targets + crew & brms.mmrm',
        detail: 'Scale Bayesian longitudinal MMRM, rfacts trial simulation, and TSDT subgroups across Slurm workers.',
        code: `tar_option_set(controller = crew_controller_slurm(workers = 16))
fit <- brm_mmrm(CHG ~ AVISIT * TRT01P + BASE, data = adlb, chains = 4)`,
        metric: 'Rhat 1.001 · Power 94.2%',
      },
      {
        step: '03',
        time: '00:58',
        label: 'admiral & rtables TLF',
        detail: 'Derive CDISC ADaM datasets and publish Reviewer-audited regulatory tables to hanzo.team.',
        code: `adlb <- derive_param_computed(adlb_raw, by_vars = exprs(USUBJID, AVISIT))
tlf <- build_table(lyt_mmrm, df = adlb) # synced to #clinical-biostats`,
        metric: 'ADLB + TLF verified ✓',
      },
    ],
  },
];

/* Domain packs, scientific databases, simulators and compute connectors. */
export const CONNECTORS = [
  {
    name: 'Hanzo Enso, Zen, Kai & ML',
    domain: 'ai',
    kind: 'AI & ML Systems',
    status: 'Implemented',
    detail: 'Multi-agent orchestration (Enso), scientific reasoning (Zen), typed decision latency sweeps (Kai), and distributed PyTorch/vLLM harnesses.',
  },
  {
    name: 'OpenROAD, Verilator & SymbiYosys',
    domain: 'semiconductors',
    kind: 'Semiconductors & EDA',
    status: 'Tested',
    detail: 'SystemVerilog RTL elaboration, static timing analysis (STA), PPA Pareto sweeps, SPICE waveforms, and formal SVA verification.',
  },
  {
    name: 'Materials Project, Phonopy & MACE',
    domain: 'physics',
    kind: 'Physics & Materials',
    status: 'Implemented',
    detail: 'Crystal structures, DFT formation energies, 8×8×8 q-mesh DFPT phonon dispersion with ASR enforcement, and machine-learned force fields.',
  },
  {
    name: 'CERN Open Data & INSPIRE',
    domain: 'physics',
    kind: 'Physics & Materials',
    status: 'Tested',
    detail: 'High-energy physics datasets, ROOT trees, kinematics histograms, and particle physics literature synthesis.',
  },
  {
    name: 'ERA5, CMIP6 & EarthData',
    domain: 'climate',
    kind: 'Earth & Climate',
    status: 'Implemented',
    detail: 'Global atmospheric reanalysis Zarr tensors, ocean circulation grids, and spectral PDE conservation audits.',
  },
  {
    name: 'LillyMol, RDKit & OpenMM',
    domain: 'chemistry',
    kind: 'Chemistry & MedChem',
    status: 'Implemented',
    detail: 'iwdemerit 275-rule MedChem demerit filter, tsubstructure SMARTS, trxn reaction enumeration, dicer cleavage, and OpenMM ΔΔG.',
  },
  {
    name: 'Lean 4, Mathlib & SymPy',
    domain: 'mathematics',
    kind: 'Mathematics',
    status: 'Implemented',
    detail: 'Formal theorem verification in Lean 4 kernel, tactic search, symbolic algebra, and counterexample checks.',
  },
  {
    name: 'CELLxGENE, Scanpy & scVI',
    domain: 'biology',
    kind: 'Genomics & Single-Cell',
    status: 'Implemented',
    detail: 'Multi-species cell atlases, AnnData h5ad slices, and variational manifold alignment benchmarked against PCA/Harmony.',
  },
  {
    name: 'mmrm, brms.mmrm, rfacts & TSDT',
    domain: 'biology',
    kind: 'Clinical Biostatistics',
    status: 'Implemented',
    detail: 'Frequentist & Bayesian longitudinal MMRM, adaptive clinical trial simulation (rfacts), and subgroup detection trees (TSDT).',
  },
  {
    name: 'pharmaverse (admiral, rtables, Tplyr)',
    domain: 'biology',
    kind: 'CDISC & Regulatory',
    status: 'Implemented',
    detail: 'Automated CDISC SDTM/ADaM dataset derivation (ADSL, ADAE, ADLB, ADTTE) and regulatory TLF tables.',
  },
  {
    name: 'BioRels, surfaltr & Proteomics',
    domain: 'biology',
    kind: 'Proteomics & Targets',
    status: 'Tested',
    detail: 'Longitudinal clinical proteomics differential abundance, transmembrane surfaceome topology (surfaltr), and BioRels schemas.',
  },
  {
    name: 'UniProt, RCSB PDB & Ensembl',
    domain: 'biology',
    kind: 'Structure & Sequence',
    status: 'Implemented',
    detail: 'Experimental 3D structures, co-folding confidence maps, and variant annotations.',
  },
  {
    name: 'targets, crew & pytest-wdl',
    domain: 'compute',
    kind: 'Pipelines & WDL',
    status: 'Implemented',
    detail: 'Reproducible R/Python targets pipeline DAGs, crew distributed Slurm/K8s workers, and pytest-wdl workflow verification.',
  },
  {
    name: 'CWL, RO-Crate & W3C PROV-O',
    domain: 'compute',
    kind: 'Provenance & Standards',
    status: 'Implemented',
    detail: 'Portable Common Workflow Language pipelines, Research Object Crates (RO-Crate), and W3C PROV-O lineage export.',
  },
  {
    name: 'arXiv, OpenAlex, Crossref & PubMed',
    domain: 'compute',
    kind: 'Literature & Citations',
    status: 'Implemented',
    detail: 'Direct NCBI E-utilities, Crossref, OpenAlex, and arXiv retrieval with independent assertion-level citation verification.',
  },
  {
    name: 'Hanzo Notebook & SSH / Slurm Clusters',
    domain: 'compute',
    kind: 'Live Compute',
    status: 'Implemented',
    detail: 'Shared Python/Julia/R/SQL kernel + scaling from local workstation to Slurm, Kubernetes, and cloud GPU nodes.',
  },
];

/* The four flagship workloads. */
export const CASE_STUDIES = [
  {
    tag: '01 · AI & Machine Learning',
    title: 'Model architecture, quantization & Kai latency qualification',
    metric: 'Enso + Zen + Kai · Reproducible evaluation harnesses',
    body: 'Research teams coordinate pretraining ablations, KV-cache quantization, and speculative decoding sweeps while auditing calibration error, regressions, and release criteria.',
  },
  {
    tag: '02 · Life Sciences & Pharma',
    title: 'Target discovery, LillyMol SAR & longitudinal clinical biostatistics',
    metric: 'LillyMol + OpenMM + targets/crew + brms.mmrm',
    body: 'Medicinal chemistry and biostatistics groups connect 275-rule iwdemerit filtering and alchemical ΔΔG cycles with WDL proteomics and CDISC ADaM regulatory tables.',
  },
  {
    tag: '03 · Semiconductors & Engineering',
    title: 'Microarchitecture PPA exploration & formal SVA verification',
    metric: 'Verilator + OpenROAD STA + SymbiYosys proofs',
    body: 'Hardware architects evaluate RTL parameter sweeps across process-voltage-temperature corners and verify credit-return liveness before physical synthesis.',
  },
  {
    tag: '04 · Materials & Energy',
    title: 'Solid-state electrolyte screening & DFPT phonon stability',
    metric: '8×8×8 q-mesh + ASR at Γ + NEB diffusion barriers',
    body: 'Materials laboratories rank candidate lattices against formation energy, ionic migration barriers, and acoustic sum rule dynamical stability prior to synthesis.',
  },
];

/* The five fields the first screen switches between. */
export const FLAGSHIP_DOMAINS = [
  {
    id: 'ai',
    label: 'AI & Machine Learning',
    programId: 'prog_ai_kai_latency_v4',
    domainBadge: 'AI & Machine Learning',
    objective: 'Reduce high-cardinality multiple-choice inference latency in Kai by 35% while preserving numerical equivalence, calibration (ECE <= 0.012), and stability.',
    models: 'Enso (orchestration) · Zen (reasoning) · Kai (policy gate)',
    packTools: ['Hanzo ML / Engine', 'Ray Tune', 'MLflow Registry', 'Calibration Harness'],
    loopStage: '04 · Evaluate → 05 · Optimize',
    metrics: [
      { label: 'p99 latency', value: '-38.4% (14.2 ms)' },
      { label: 'Calibration ECE', value: '0.011 (target <= 0.012)' },
      { label: 'Hardware & seed', value: '8× H100 · seed=2026' },
    ],
    artifacts: [
      { name: 'kai_routing_sweep.parquet', kind: 'Dataset', hash: 'sha256:9a4c…e102' },
      { name: 'latency_frontier_fig2.pdf', kind: 'Figure v3', hash: 'sha256:3d18…88b4' },
      { name: 'kai_release_qual.ro-crate.json', kind: 'RO-Crate', hash: 'sha256:7f01…c419' },
    ],
    verificationNote: '7/7 verification dimensions passed · Approved by @QA + Systems Lead',
  },
  {
    id: 'lifesci',
    label: 'Biology & Drug Discovery',
    programId: 'prog_bio_metabolic_sar_v2',
    domainBadge: 'Biology & Drug Discovery',
    objective: 'Prioritize selective metabolic target modulators with zero LillyMol demerits and quantify Week-72 longitudinal efficacy across biomarker subgroups.',
    models: 'Enso (orchestration) · Zen (synthesis) · Kai (clinical gate)',
    packTools: ['LillyMol iwdemerit/trxn', 'OpenMM FEP', 'targets + crew', 'brms.mmrm + admiral'],
    loopStage: '03 · Execute → 04 · Evaluate',
    metrics: [
      { label: 'MedChem screen', value: '58/64 zero-demerit leads' },
      { label: '16-λ FEP cycle', value: 'Hysteresis 0.28 kcal/mol' },
      { label: 'Bayesian MMRM', value: 'Rhat 1.001 · Power 94.2%' },
    ],
    artifacts: [
      { name: 'series_fep_ddg.csv', kind: 'Assay table', hash: 'sha256:4b21…a903' },
      { name: 'adlb_mmrm_w72.rds', kind: 'CDISC ADaM', hash: 'sha256:6c89…11f0' },
      { name: 'tlf_efficacy_w72.pdf', kind: 'rtables TLF', hash: 'sha256:1e77…d208' },
    ],
    verificationNote: '7/7 verification dimensions passed · Biostatistician sign-off recorded',
  },
  {
    id: 'aerospace',
    label: 'Aerospace & Astrophysics',
    programId: 'prog_aero_openmdao_nozzle_v3',
    domainBadge: 'Aerospace & Astrophysics',
    objective: 'Couple OpenMDAO aerothermal-structural optimization across regeneratively cooled nozzle channels while bounding wall heat flux and modal flutter.',
    models: 'Enso (MDO DAG) · Zen (PDE critique) · Kai (safety margin gate)',
    packTools: ['OpenMDAO', 'SU2 / Spectral CFD', 'CalculiX FEA', 'Astropy / MCMC'],
    loopStage: '03 · Execute → 05 · Optimize',
    metrics: [
      { label: 'Specific impulse', value: '+4.2 s vacuum Isp' },
      { label: 'Throat thermal margin', value: 'T_wall <= 890 K (SF 1.38)' },
      { label: 'Mass reduction', value: '-9.4% chamber liner mass' },
    ],
    artifacts: [
      { name: 'openmdao_n2_coupled.html', kind: 'MDO graph', hash: 'sha256:7a12…3c08' },
      { name: 'nozzle_heatflux_mach.vtk', kind: 'CFD field', hash: 'sha256:5e40…b119' },
      { name: 'structural_margin.ro-crate.json', kind: 'RO-Crate', hash: 'sha256:2f91…e407' },
    ],
    verificationNote: '7/7 verification dimensions passed · Energy & mass conservation verified',
  },
  {
    id: 'materials',
    label: 'Materials & Energy',
    programId: 'prog_mat_solid_electrolyte_v5',
    domainBadge: 'Materials & Energy',
    objective: 'Compare candidate solid-state materials under defined performance constraints: Li+ migration barrier <= 0.25 eV and dynamical stability across an 8×8×8 phonon q-mesh.',
    models: 'Enso (campaign) · Zen (physics critique) · Kai (synthesis gate)',
    packTools: ['Structures · Phonopy DFPT', 'Properties · MACE-MP-0', 'Simulation · VASP', 'Screening & Review'],
    loopStage: '03 · Execute → 05 · Optimize',
    metrics: [
      { label: 'Stability (8×8×8 q-mesh)', value: 'ASR at Γ |ω| < 0.03 THz' },
      { label: 'Conductivity & Barrier', value: 'Ea = 0.24 ± 0.02 eV' },
      { label: 'Resource Cost & Uncertainty', value: '1.4 GPU-hrs · 0 imaginary modes' },
    ],
    artifacts: [
      { name: 'crystal_structures_relaxed.cif', kind: 'Crystal structures', hash: 'sha256:9c14…55d0' },
      { name: 'phonon_bands_8x8x8.json', kind: 'Simulation outputs', hash: 'sha256:0f33…7e12' },
      { name: 'candidate_rankings_v2.md', kind: 'Candidate rankings & report', hash: 'sha256:4a80…19c3' },
    ],
    verificationNote: '7/7 verification dimensions passed · 0 imaginary modes beyond ASR tolerance',
  },
  {
    id: 'semiconductors',
    label: 'Semiconductors & EDA',
    programId: 'prog_semi_ppa_noc_v3',
    domainBadge: 'Semiconductors & Hardware',
    objective: 'Optimize 2nm accelerator NoC router microarchitecture for area and static timing slack at SS 0.72V 125°C with zero credit-return deadlocks.',
    models: 'Enso (sweep) · Zen (RTL analysis) · Kai (tapeout gate)',
    packTools: ['Verilator', 'OpenROAD STA', 'ngspice', 'SymbiYosys SVA'],
    loopStage: '04 · Evaluate → 06 · Communicate',
    metrics: [
      { label: 'Tile Silicon Area', value: '-11.2% vs baseline' },
      { label: 'Worst Negative Slack', value: '+18 ps (SS 0.72V 125°C)' },
      { label: 'Formal Liveness', value: '0 SVA counterexamples' },
    ],
    artifacts: [
      { name: 'noc_tile_ppa.parquet', kind: 'PPA sweep', hash: 'sha256:5d92…00a1' },
      { name: 'sta_corner_ss_0p72v.rpt', kind: 'STA report', hash: 'sha256:8a11…f342' },
      { name: 'credit_liveness.sby', kind: 'Formal proof', hash: 'sha256:2c04…9b71' },
    ],
    verificationNote: '7/7 verification dimensions passed · Formal verification + Lead Architect sign-off',
  },
];

export const GLOBAL_WORKSPACE_NAV = [
  'Home',
  'Programs & Graph',
  'Experiments',
  'Evidence & Data',
  'Optimization',
  'Review',
  'Compute',
  'Governance',
];

/* The six numbered bands, and what the strip under the first screen calls each. */
export const SECTIONS = [
  { num: '01', id: 'introducing-hanzo-science', label: 'Universal R&D Loop' },
  { num: '02', id: 'hanzo-ai-lab', label: 'Hanzo AI Lab' },
  { num: '03', id: 'control-plane', label: 'Research Graph & Control Plane' },
  { num: '04', id: 'how-it-works', label: 'Interactive Workbenches' },
  { num: '05', id: 'verification-governance', label: '7-Dimension Verification' },
  { num: '06', id: 'getting-started', label: 'Commercial Tiers & Access' },
];

export const UNIVERSAL_LOOP_STAGES = [
  {
    step: '01 · Discover',
    title: 'Review knowledge, identify gaps & generate ideas',
    detail: 'Ingest papers, patents, ELN/LIMS entries, astronomical catalogs, and prior negative findings with direct DOI/PMID/arXiv provenance.',
  },
  {
    step: '02 · Design',
    title: 'Form competing hypotheses, select methods & plan',
    detail: 'Branch competing hypotheses in a research graph, define baselines, controls, simulation matrices, and pre-registered acceptance thresholds.',
  },
  {
    step: '03 · Execute',
    title: 'Run code, train models, simulate, test or measure',
    detail: 'Dispatch reproducible containers, live Hanzo Notebook kernels, OpenMDAO / Phonopy solvers, targets + crew DAGs, and Slurm/cloud GPU sweeps.',
  },
  {
    step: '04 · Evaluate',
    title: 'Analyze evidence, uncertainty, failures & results',
    detail: 'Audit statistical validity, conservation laws, numerical equivalence, cycle hysteresis, calibration error, and assertion-level source support.',
  },
  {
    step: '05 · Optimize',
    title: 'Compare alternatives, refine methods & allocate budget',
    detail: 'Maximize validated information gained per unit of compute using Bayesian optimization, active learning, and Pareto frontier search.',
  },
  {
    step: '06 · Communicate',
    title: 'Reproduce findings, review, publish or transfer',
    detail: 'Compile LaTeX manuscripts, CDISC ADaM/rtables TLFs, qualified model cards, and RO-Crate / W3C PROV-O lineage bundles.',
  },
];

export const RESEARCH_MODES = [
  {
    tag: 'Fundamental Discovery',
    title: 'Exploratory research',
    summary: 'Generate new questions, develop theories, investigate unexpected observations, and branch into competing explanations when there is no predetermined optimization target.',
    example: 'Example: What new attention or state-space architectures might overcome long-context efficiency limitations, or which cellular mechanisms drive resistance in a cohort?',
    methods: 'First-class support for mathematical proofs (Lean 4), theoretical modeling, systematic literature synthesis, observational studies, and exploratory simulations.',
  },
  {
    tag: 'Applied R&D & Engineering',
    title: 'Goal-directed research',
    summary: 'Optimize a defined outcome, compare candidate designs, test a specific hypothesis, and solve a concrete engineering or clinical problem under resource bounds.',
    example: 'Example: Reduce Kai high-cardinality inference latency by 35% while preserving numerical equivalence and calibration, or maximize rocket nozzle Isp within wall thermal limits.',
    methods: 'First-class support for controlled ablations, multi-objective Pareto sweeps, OpenMDAO multidisciplinary design optimization, and release qualification gates.',
  },
];

export const THREE_MARKETS = [
  {
    id: '01 · Enterprise R&D',
    title: 'Enterprise R&D Organizations',
    buyers: 'AI laboratories, pharmaceutical, semiconductor, aerospace, energy, materials, automotive, and industrial companies.',
    value: 'Unify fragmented tools, private data lakes, HPC clusters, and cross-functional review gates under one governed research operating system.',
  },
  {
    id: '02 · Research Institutions',
    title: 'Universities, National Labs & Hospitals',
    buyers: 'Academic laboratories, national user facilities, observatories, research hospitals, and government science agencies.',
    value: 'Connect shared supercomputers, telescope/beamline pipelines, multi-institution datasets, and FAIR / RO-Crate reproducibility.',
  },
  {
    id: '03 · Individual Scientists & Startups',
    title: 'Independent Researchers & Deep-Tech Startups',
    buyers: 'Principal investigators, computational scientists, startup founders, and small R&D teams.',
    value: 'Spin up specialist scientific agents, live notebooks, domain simulators, and elastic GPU compute without enterprise DevOps overhead.',
  },
];

export const TWENTY_DISCIPLINES = [
  {
    discipline: 'Artificial intelligence',
    activities: 'New model architectures, training methods, agent systems, scaling laws, evaluations',
  },
  {
    discipline: 'Computer science',
    activities: 'Algorithms, compilers, distributed systems, programming languages, formal verification',
  },
  {
    discipline: 'Mathematics',
    activities: 'Conjectures, Lean 4 formal proofs, symbolic computation, numerical analysis',
  },
  {
    discipline: 'Theoretical physics',
    activities: 'Mathematical modeling, lattice/field simulations, theory comparison, conservation checks',
  },
  {
    discipline: 'Astrophysics & cosmology',
    activities: 'Astronomical data analysis, stellar modeling, cosmological N-body rollouts, Bayesian inference',
  },
  {
    discipline: 'Aerospace & astronautics',
    activities: 'Aerodynamics, orbital analysis, thermal modeling, structural FEA, OpenMDAO design optimization',
  },
  {
    discipline: 'Mechanical engineering',
    activities: 'Computational fluid dynamics (CFD), finite-element analysis, thermal systems, structural design',
  },
  {
    discipline: 'Electrical engineering',
    activities: 'Circuit design, SPICE simulation, RF/signal processing, feedback control systems',
  },
  {
    discipline: 'Semiconductors',
    activities: 'RTL microarchitecture exploration, device TCAD simulation, OpenROAD STA, formal SVA verification',
  },
  {
    discipline: 'Robotics',
    activities: 'Embodied AI, physics simulation, sensor fusion, trajectory control, reinforcement learning',
  },
  {
    discipline: 'Materials science',
    activities: 'Crystal structures, electronic properties, 8×8×8 q-mesh DFPT phonon stability, candidate screening',
  },
  {
    discipline: 'Chemistry',
    activities: 'Molecular properties, reaction modeling, homogeneous/heterogeneous catalysts, quantum chemistry',
  },
  {
    discipline: 'Biology',
    activities: 'Genomics, proteomics, single-cell atlases (Scanpy/scVI), cellular systems, computational evolution',
  },
  {
    discipline: 'Drug discovery',
    activities: 'Target investigation, LillyMol iwdemerit/trxn SAR screening, OpenMM ΔΔG, experimental planning',
  },
  {
    discipline: 'Medicine & clinical research',
    activities: 'Longitudinal MMRM (mmrm/brms.mmrm), trial simulation (rfacts), CDISC ADaM (admiral/rtables)',
  },
  {
    discipline: 'Neuroscience',
    activities: 'Neural spike/field recordings, connectome modeling, computational neuroscience, biological networks',
  },
  {
    discipline: 'Energy',
    activities: 'Solid-state batteries, fusion plasma equilibrium, photovoltaic materials, power-grid optimization',
  },
  {
    discipline: 'Earth & planetary sciences',
    activities: 'Geophysics, planetary geology, atmospheric dynamics, ERA5/CMIP6 spectral climate models',
  },
  {
    discipline: 'Agriculture',
    activities: 'Plant biology, quantitative genetics, crop trait selection, agro-environmental modeling',
  },
  {
    discipline: 'Industrial R&D',
    activities: 'Manufacturing processes, reliability engineering, physics-informed digital twins, design of experiments',
  },
];

export const HANZO_LAB_WORKLOADS = [
  {
    area: 'Model architectures',
    support: 'Investigate attention mechanisms, model layers, routing structures, memory, multimodal architectures, and alternative designs.',
  },
  {
    area: 'Pretraining',
    support: 'Dataset preparation, tokenization, scaling experiments, distributed training, checkpoints, and convergence analysis.',
  },
  {
    area: 'Fine-tuning',
    support: 'SFT, LoRA/QLoRA, preference optimization, distillation, reinforcement learning, and hyperparameter searches.',
  },
  {
    area: 'Model optimization',
    support: 'Quantization, pruning, sparsity, speculative decoding, compilation, and model compression.',
  },
  {
    area: 'Inference engines',
    support: 'Kernel benchmarking, KV-cache optimization, batching, scheduling, graph execution, and serving performance.',
  },
  {
    area: 'Agentic harnesses',
    support: 'Tool use, planning, memory, context management, sandbox execution, task completion, recovery, and multi-agent coordination.',
  },
  {
    area: 'ML frameworks',
    support: 'Training runtimes, tensor operations, device backends, distributed execution, and numerical correctness.',
  },
  {
    area: 'Model evaluation',
    support: 'Accuracy, reasoning, calibration, stability, safety, regression, latency, throughput, and cost.',
  },
  {
    area: 'Data research',
    support: 'Corpus discovery, quality filtering, synthetic data, labeling, contamination checks, and dataset versioning.',
  },
  {
    area: 'System optimization',
    support: 'GPU/CPU profiling, allocation, networking, storage, compiler performance, and infrastructure economics.',
  },
  {
    area: 'Automated research',
    support: 'Hypothesis generation, controlled experiments, ablations, statistical comparisons, and next-experiment recommendations.',
  },
  {
    area: 'Release qualification',
    support: 'Benchmark evidence, reproducibility, release gates, regression analysis, model cards, and rollback readiness.',
  },
];

export const HANZO_STACK_MAPPING = [
  { layer: 'ML framework', app: 'New operators, training algorithms, optimizers, kernels, device support' },
  { layer: 'Engine', app: 'Model execution, inference scheduling, batching, memory, performance' },
  { layer: 'Node / compute', app: 'Distributed workloads, hardware topology, accelerators, profiling' },
  { layer: 'Cloud', app: 'Resource scheduling, GPU allocation, cost, cluster experiments' },
  { layer: 'Sandbox', app: 'Isolated builds, test environments, scientific code execution' },
  { layer: 'Agents / Dev harness', app: 'Autonomous experiments, code changes, test runs, recovery' },
  { layer: 'Enso', app: 'Model routing research, selection policies, orchestration' },
  { layer: 'Kai', app: 'Structured decision research, policy evaluation, qualification' },
  { layer: 'Zen', app: 'Generative-model research, fine-tuning, reasoning evaluations' },
  { layer: 'Gateway / serving', app: 'API performance, routing quality, latency, production regression' },
  { layer: 'Hanzo Team', app: 'Collaboration, scientific approvals, research program coordination' },
];

export const AI_MODEL_LIFECYCLE = [
  { stage: '01 · Design', focus: 'Architecture' },
  { stage: '02 · Data', focus: 'Datasets' },
  { stage: '03 · Train', focus: 'Optimization' },
  { stage: '04 · Tune', focus: 'Adaptation' },
  { stage: '05 · Evaluate', focus: 'Benchmarks' },
  { stage: '06 · Profile', focus: 'Efficiency' },
  { stage: '07 · Qualify', focus: 'Release gates' },
  { stage: '08 · Deploy', focus: 'Controlled rollout' },
];

export const KAI_LATENCY_WALKTHROUGH = [
  {
    step: '1. Investigate the bottleneck',
    detail: 'Read profiling traces, relevant source code, existing benchmarks, hardware characteristics, and previous experimental findings.',
  },
  {
    step: '2. Form competing hypotheses',
    detail: 'Evaluate microbatching, caching, vectorization, memory-layout changes, FP8 KV-cache quantization, and speculative tree routing.',
  },
  {
    step: '3. Generate experiments',
    detail: 'Create isolated branches, test implementations, reference comparisons, and reproducible benchmark configurations.',
  },
  {
    step: '4. Execute and measure',
    detail: 'Use the coding harness and available GPU compute to build, test, profile, and measure candidate changes under equivalent conditions.',
  },
  {
    step: '5. Evaluate statistically & numerically',
    detail: 'Compare p50/p95/p99 latency distributions, throughput, memory usage, numerical equivalence, calibration (ECE), and regressions.',
  },
  {
    step: '6. Recommend a qualified change',
    detail: 'Present the best supported result, code diff, test results, risks, and release requirements. Request approval before merging or deploying.',
  },
];

export const SCIENCE_PRODUCT_PILLARS = [
  {
    name: 'Science Discovery',
    focus: 'Ideas, evidence, literature & hypotheses',
    detail: 'Ingest primary literature, patents, datasets, and anomalies; formulate branching questions and competing hypotheses.',
  },
  {
    name: 'Science Experiments',
    focus: 'Training, simulation, computation & tests',
    detail: 'Execute controlled experiments across Hanzo ML, Engine, Sandboxes, OpenMDAO, Phonopy, LillyMol, OpenMM, and Lean 4.',
  },
  {
    name: 'Science Optimization',
    focus: 'Search, comparisons & resource allocation',
    detail: 'Maximize Research Value = (validated information or progress gained) / (resources consumed) via Bayesian and Pareto search.',
  },
  {
    name: 'Science Knowledge',
    focus: 'Findings, artifacts, provenance & collaboration',
    detail: 'Link every finding (including negative results) to its exact run, dataset, environment, and RO-Crate / W3C PROV-O record.',
  },
];

export const SPECIALIST_AGENT_ROSTER = [
  { agent: 'Sci', role: 'Research planning, scientific investigation, hypothesis tracking' },
  { agent: 'Dev', role: 'Source-code changes, instrumented test programs, computational pipelines' },
  { agent: 'Data', role: 'Dataset preparation, data analysis, statistics, lineage' },
  { agent: 'QA', role: 'Verification, regression testing, reproducibility checks' },
  { agent: 'Cyber', role: 'Environment isolation, credential boundaries, tool security' },
  { agent: 'Doc', role: 'Research documentation, manuscripts, and technical reports' },
  { agent: 'Mana', role: 'Project coordination, compute budgets, milestones, and review queues' },
];

export const RESEARCH_PROGRAM_TS_INTERFACE = `interface ResearchProgram {
  id: string;
  organization_id: string;
  domain: string;
  title: string;

  questions: ResearchQuestion[];
  hypotheses: Hypothesis[];
  methods: ResearchMethod[];

  evidence: EvidenceRecord[];
  experiments: Experiment[];
  runs: ExecutionRun[];

  observations: Observation[];
  findings: ResearchFinding[];
  decisions: ResearchDecision[];

  artifacts: ArtifactReference[];
  provenance: ProvenanceGraph; // RO-Crate + W3C PROV-O

  compute_budget: ResourceBudget;
  approval_policy: ApprovalPolicy;
  collaborators: ResearchCollaborator[];

  status: ResearchStatus;
}`;

export const SCIENCE_API_ENDPOINTS = `POST /v1/science/programs
POST /v1/science/questions
POST /v1/science/hypotheses
POST /v1/science/experiments
POST /v1/science/experiments/{id}/runs
GET  /v1/science/runs/{id}/metrics
POST /v1/science/experiments/{id}/compare
POST /v1/science/decisions
GET  /v1/science/artifacts/{id}/provenance
POST /v1/science/reviews`;

export const VERIFICATION_DIMENSIONS = [
  {
    id: '01 · Source integrity',
    question: 'Does the cited source exist and resolve?',
    check: 'Independent NCBI E-utilities, Crossref, OpenAlex, arXiv, and patent registry lookup verifying DOI, PMID, publication year, and retraction status.',
  },
  {
    id: '02 · Claim support',
    question: 'Does the cited passage or table actually support the assertion?',
    check: 'Assertion-level extraction comparing the manuscript sentence against the primary source table, sample size, and experimental conditions.',
  },
  {
    id: '03 · Computational integrity',
    question: 'Did the code execute cleanly and produce the reported numbers?',
    check: 'Direct kernel execution check confirming zero silent NaNs, non-zero exit codes, or mismatches between figure annotations and output tensors.',
  },
  {
    id: '04 · Reproducibility',
    question: 'Can another scientist re-run the exact computation?',
    check: 'Records OCI container digest, conda/lockfile hashes, random seeds, input dataset SHA-256, hardware topology, and RO-Crate bundle.',
  },
  {
    id: '05 · Method validity',
    question: 'Are controls, baselines, units, and physical laws respected?',
    check: 'Domain-specific checks: acoustic sum rule (ASR) at Γ for phonons, cycle closure hysteresis for FEP, PCA/Harmony baselines for scVI, and STA corners for RTL.',
  },
  {
    id: '06 · Scientific uncertainty',
    question: 'Are error bars, sensitivity bounds, and alternative hypotheses reported?',
    check: 'Requires confidence/credible intervals, convergence diagnostics (Rhat, ESS), and sensitivity sweeps across key hyperparameters.',
  },
  {
    id: '07 · Domain review',
    question: 'Which decisions require accountable human sign-off?',
    check: 'Routes synthesis nominations, clinical TLF locks, silicon tapeout checklists, and model releases to named human reviewers via Kai policy gates.',
  },
];

export const AUTONOMY_MODES = [
  {
    mode: 'Mode 1 · Observe',
    summary: 'Passive monitoring & provenance capture',
    detail: 'Indexes literature, notebooks, cluster jobs, and instrument outputs; flags anomalies or citation mismatches without mutating files.',
  },
  {
    mode: 'Mode 2 · Recommend',
    summary: 'Human-gated experimental proposals',
    detail: 'Drafts code patches, figure refinements, next parameter arms, and synthesis candidates; waits for explicit scientist approval.',
  },
  {
    mode: 'Mode 3 · Execute approved',
    summary: 'Bounded execution within pre-approved envelopes',
    detail: 'Runs approved CWL/WDL/targets workflows and GPU sweeps within strict compute budgets, connector allowlists, and container sandboxes.',
  },
  {
    mode: 'Mode 4 · Supervised automation',
    summary: 'Closed-loop active learning with human checkpoints',
    detail: 'Iterates design-execute-evaluate cycles autonomously across simulation or assay rounds, pausing at Kai policy gates for material decisions.',
  },
];

export const ROLLOUT_PHASES = [
  {
    phase: 'P0 · Foundation & AI Lab',
    capability: 'Unified research programs, Hanzo AI Lab integration, reproducible comparisons & checkpoint lineage',
    validation: 'Research survives session restarts; runs real model, inference-engine, and harness experiments traced to exact inputs and versions.',
  },
  {
    phase: 'P1 · Domain Packs & Optimization',
    capability: 'Agentic experiment planning, Biology/Materials/Physics/Engineering domain packs & publication reviews',
    validation: 'Generates competing hypotheses, executes the same workload lifecycle across domain solvers (OpenMDAO, Phonopy, LillyMol), and produces defensible reports.',
  },
  {
    phase: 'P2 · Continuous & Cross-Org R&D',
    capability: 'Event-driven continuous research & federated multi-institution R&D coordination',
    validation: 'Re-evaluates approved investigations when new evidence arrives and coordinates governed collaboration across laboratories and institutions.',
  },
];

export const PRODUCTIVITY_METRICS = [
  'Time from research hypothesis to a reproducible experiment',
  'Valid experiments completed per unit of compute and researcher effort',
  'Model or engineering improvements that survive independent held-out evaluation',
  'Efficiency gains in latency, throughput, memory, and infrastructure cost',
  'Experiment reproducibility rate, regression detection, and preserved negative results',
  'Time from accepted research finding to qualified release or protocol transfer',
];

export const COMMERCIAL_TIERS = [
  {
    tier: 'Science Individual',
    audience: 'Independent researchers, postdocs & students',
    includes: 'Full Science Workbench, shared Hanzo Notebook kernel, literature & citation verifier, RO-Crate export, and local/SSH compute attach.',
  },
  {
    tier: 'Science Team',
    audience: 'Academic labs, biotech/hardware startups & R&D groups',
    includes: 'Shared ResearchProgram graphs, hanzo.team multi-agent channels (@Sci, @Data, @Dev), Slurm/Kubernetes crew dispatch, and 7-dimension review.',
  },
  {
    tier: 'Science Enterprise',
    audience: 'Global pharmaceutical, semiconductor, aerospace, materials & industrial R&D',
    includes: 'SSO/SAML, RBAC, connector allowlists, Kai governance gates, audit logs, GxP/CDISC, OpenMDAO & EDA domain packs, and dedicated cluster integration.',
  },
  {
    tier: 'Science Private',
    audience: 'National labs, defense, sovereign & air-gapped facilities',
    includes: 'Customer-managed VPC or on-premise supercomputer deployment, zero external data egress, local Zen/Enso/Kai weights, and custom data residency.',
  },
];

// ---- the workbench ----

export const SAMOSA_CODE_V2 = `54
55  apply_nature_style()
56  mpl.rcParams['savefig.bbox'] = None
57  mpl.rcParams['font.sans-serif'] = ['Arial']
58  mpl.rcParams['font.family'] = 'sans-serif'
59
60  centroids = pd.read_csv("fig4_atlas_centroids_m138ea.csv")
61  boxes_df  = pd.read_csv("fig4_atlas_inset_boxes.csv")
62  callouts  = pd.read_csv("fig4_atlas_callouts.csv")
63
64  HERO = {"neuron":"steelblue","muscle":"olive","immune":"forestgreen",
65          "ciliated":"darkturquoise","germline":"orchid","stem/progenitor":"peru"}
66  PHYL_PAL2 = {"Ctenophora":"saddlebrown","Porifera":"slateblue","Placozoa":"darkslategray",
67               "Xenacoelomorpha":"cadetblue","Chaetognatha":"darkslateblue",
68               "Ambulacraria":"teal","Cephalochordata":"dimgray"}
69  TAG_ROMAN = {'a':'i','b':'ii','c':'iii'}
70  INSET_NAMES = {'a':'ciliated cells','b':'striated muscle','c':'immune'}
71  ITALIC_SPLIT = {'Xenoturbella ciliated':('Xenoturbella',' ciliated'),
72                  'C. elegans body-wall muscle':('C. elegans',' body-wall muscle')}
73  TAG_COL = 'black'
74  halo = [pe.withStroke(linewidth=2.2, foreground='white')]
75  halo_thin = [pe.withStroke(linewidth=2.0, foreground='white')]
76
77  inset_info = {}
78  for _, row in boxes_df.iterrows():
79      tag = row.tag; fam = row.family; x0, y0, w, h = row.x0, row.y0, row.w, row.h
80      inbox = centroids[(centroids.umap_x >= x0) & (centroids.umap_x <= x0 + w)]
81      target = inbox[inbox.family == fam]
82      tx0, tx1 = target.umap_x.min(), target.umap_x.max(); ty0, ty1 = target.umap_y.min(), target.umap_y.max()
83      mx, my = 0.05 * (tx1 - tx0), 0.05 * (ty1 - ty0)
84      inset_info[tag] = dict(fam=fam, xlim=(tx0 - mx, tx1 + mx), ylim=(ty0 - my, ty1 + my),
85                             n_types=row.n_types, n_species=row.n_species)`;

export const SAMOSA_CODE_V3 = `54
55  apply_nature_style(despine=True, grid=False)
56  mpl.rcParams['savefig.bbox'] = 'tight'
57  mpl.rcParams['font.sans-serif'] = ['Arial']
58  mpl.rcParams['font.family'] = 'sans-serif'
59
60  centroids = pd.read_csv("fig4_atlas_centroids_m138ea.csv")
61  boxes_df  = pd.read_csv("fig4_atlas_inset_boxes.csv")
62  callouts  = pd.read_csv("fig4_atlas_callouts.csv")
63
64  # v3 revision: increased label contrast & stroke halo per pin #1 feedback
65  halo = [pe.withStroke(linewidth=3.4, foreground='white')]
66  halo_thin = [pe.withStroke(linewidth=2.8, foreground='white')]
67  label_fontsize = 9.5
68
69  TAG_ROMAN = {'a':'i','b':'ii','c':'iii'}
70  INSET_NAMES = {'a':'ciliated cells','b':'striated muscle','c':'immune'}
71  for _, row in boxes_df.iterrows():
72      tag = row.tag; fam = row.family; x0, y0, w, h = row.x0, row.y0, row.w, row.h
73      inbox = centroids[(centroids.umap_x >= x0) & (centroids.umap_x <= x0 + w)]
74      target = inbox[inbox.family == fam]
75      ax.text(target.umap_x.mean(), target.umap_y.mean(), fam,
76              fontsize=label_fontsize, weight='bold', path_effects=halo)`;

export const NOTEBOOK_CELLS = [
  {
    id: 28,
    lang: 'python',
    code: `import pandas as pd
pd.set_option('mode.string_storage', 'python')
import numpy as np, scanpy as sc, anndata as ad, scipy.sparse as sp

a = sc.read_h5ad("covid_pbmc_40k_hvg.h5ad")
print("loaded:", a.shape, "uns keys:", list(a.uns.keys()))

# minimal, version-portable object: counts + obs + var only
keep_obs = ["sample_id", "donor_id", "Site", "initial_clustering",
            "author_cell_type", "disease", "Status",
            "Status_on_day_collection_summary", "cell_type"]
keep_obs = [c for c in keep_obs if c in a.obs.columns]
obs = a.obs[keep_obs].copy()
for c in obs.columns:
    obs[c] = pd.Index(np.asarray(obs[c], dtype=object))
obs.index = pd.Index(np.asarray(obs.index, dtype=object))
var = pd.DataFrame(index=pd.Index(np.asarray(a.var_names, dtype=object)))

clean = ad.AnnData(
    X=sp.csr_matrix(a.layers["counts"]),
    obs=obs, var=var,
)
clean.layers["counts"] = clean.X.copy()
clean.write_h5ad("covid_pbmc_40k_hvg.h5ad")
print(f"rewritten: {os.path.getsize('covid_pbmc_40k_hvg.h5ad')/1e6:.1f} MB")`,
    output: 'wrote covid_pbmc_40k_hvg.h5ad',
  },
];

export const SCVI_ARMS = [
  { arm: 1, latent: 10, layers: 1, label: 'd=10 L=1 · scVI COVID-PBMC (1/8)', elapsed: '16m 2s' },
  { arm: 2, latent: 10, layers: 2, label: 'd=10 L=2 · scVI COVID-PBMC (2/8)', elapsed: '15m 42s' },
  { arm: 3, latent: 20, layers: 1, label: 'd=20 L=1 · scVI COVID-PBMC (3/8)', elapsed: '15m 19s' },
  { arm: 4, latent: 20, layers: 2, label: 'd=20 L=2 · scVI COVID-PBMC (4/8)', elapsed: '14m 58s' },
  { arm: 5, latent: 30, layers: 1, label: 'd=30 L=1 · scVI COVID-PBMC (5/8)', elapsed: '14m 36s' },
  { arm: 6, latent: 30, layers: 2, label: 'd=30 L=2 · scVI COVID-PBMC (6/8)', elapsed: '14m 16s' },
  { arm: 7, latent: 50, layers: 1, label: 'd=50 L=1 · scVI COVID-PBMC (7/8)', elapsed: '13m 54s' },
  { arm: 8, latent: 50, layers: 2, label: 'd=50 L=2 · scVI COVID-PBMC (8/8)', elapsed: '13m 31s' },
];

export const PHYSICS_MODES = [
  {
    id: 'phonon',
    branch: 'Γ → X → M → Γ (8×8×8 q-mesh)',
    freq: '14.8 THz',
    symmetry: 'Fd-3m (Si · 2×2×2 supercell)',
    status: 'ASR enforced at Γ (|ω_ASR| < 0.03 THz) · 0 imaginary modes within DFPT tolerance',
  },
  {
    id: 'fluid',
    branch: 'Spectral FNO-3D · Re = 10⁵',
    freq: 'k⁻⁵/³ inertial range',
    symmetry: 'Triply periodic T³ (512³)',
    status: 'Energy conservation ΔE/E₀ < 1.2e-4',
  },
  {
    id: 'lean',
    branch: 'Sobolev Hˢ regularity lemma',
    freq: '18 tactic goals closed',
    symmetry: 'Lean 4 · Mathlib4',
    status: 'Verified by kernel typechecker (0 sorry)',
  },
];

export const SCIENCE_SKILLS = [
  {
    name: 'arXiv, OpenAlex & Crossref',
    category: 'Literature',
    active: true,
    desc: 'Citation graphs, DOI resolution, and full-text LaTeX/PDF ingestion across physics, math, CS, and biology.',
  },
  {
    name: 'Materials Project & Phonopy',
    category: 'Physics & Materials',
    active: true,
    desc: 'Crystal lattices, DFT formation energies, elastic tensors, and ab-initio phonon dispersion bands.',
  },
  {
    name: 'Spectral PDE & FNO Suite',
    category: 'Fluid & Climate',
    active: true,
    desc: 'Navier-Stokes, magnetohydrodynamics, and ERA5 global climate vorticity rollouts on GPU.',
  },
  {
    name: 'Lean 4 & SymPy Proof Engine',
    category: 'Mathematics',
    active: true,
    desc: 'Formal theorem proving, symbolic tensor calculus, and SMT counterexample search.',
  },
  {
    name: 'LillyMol, RDKit & OpenMM',
    category: 'Chemistry & MedChem',
    active: true,
    desc: 'iwdemerit 275-rule MedChem demerit screening, tsubstructure SMARTS, trxn reaction enumeration, dicer cleavage, and OpenMM ΔΔG.',
  },
  {
    name: 'targets, crew & pytest-wdl',
    category: 'Pipelines & WDL',
    active: true,
    desc: 'Reproducible R/Python targets pipeline DAGs, crew distributed Slurm/SSH workers, and pytest-wdl genomics/proteomics workflow testing.',
  },
  {
    name: 'Clinical Biostatistics (mmrm, brms.mmrm, rfacts, TSDT)',
    category: 'Clinical & Bayesian',
    active: true,
    desc: 'Frequentist & Bayesian longitudinal MMRM, adaptive clinical trial simulation (rfacts), and treatment-specific subgroup detection trees (TSDT).',
  },
  {
    name: 'pharmaverse CDISC (admiral, rtables, Tplyr)',
    category: 'Regulatory & ADaM',
    active: true,
    desc: 'Automated CDISC SDTM/ADaM dataset derivation (ADSL, ADAE, ADLB, ADTTE) and regulatory Table, Listing & Figure (TLF) generation.',
  },
  {
    name: 'Proteomics & Surfaceome (Olink, BioRels, surfaltr)',
    category: 'Proteomics',
    active: true,
    desc: 'High-throughput longitudinal clinical proteomics differential abundance, transmembrane surfaceome topology (surfaltr), and BioRels schemas.',
  },
  {
    name: 'PubMed & bioRxiv',
    category: 'Life Sciences',
    active: true,
    desc: 'Primary biomedical literature, preprint servers, and clinical study metadata.',
  },
  {
    name: 'CELLxGENE & Scanpy',
    category: 'Single-Cell',
    active: true,
    desc: 'Multi-species single-cell RNA-seq census, AnnData h5ad slices, and scVI variational manifolds.',
  },
  {
    name: 'RCSB PDB & Biomolecular 3D',
    category: 'Structure',
    active: true,
    desc: 'Experimental mmCIF coordinates, co-folding confidence maps, and active-site contact geometry.',
  },
  {
    name: 'Lab Cluster GPUs (SSH / Slurm)',
    category: 'Compute',
    active: true,
    desc: 'Remote SSH and Slurm array job dispatch with human approval gates and live telemetry.',
  },
  {
    name: 'Hanzo Notebook Live Kernel',
    category: 'Compute',
    active: true,
    desc: 'Shared persistent Python 3.11, Julia 1.11, R 4.4, and DuckDB in-memory kernel.',
  },
];

export const WORKSPACE_FILES = [
  { name: 'fig4_atlas_callouts.csv', size: '48 KB', kind: 'dataset', session: 'samosa' },
  { name: 'fig4_atlas_centroids_m138ea.csv', size: '14.2 MB', kind: 'dataset', session: 'samosa' },
  { name: 'fig4_atlas_inset_boxes.csv', size: '4 KB', kind: 'dataset', session: 'samosa' },
  { name: 'samosa_fig1a.png', size: '2.8 MB', kind: 'figure', session: 'samosa' },
  { name: 'series_iwdemerit_sar.sdf', size: '6.4 MB', kind: 'dataset', session: 'samosa' },
  { name: 'review.pdf', size: '612 KB', kind: 'manuscript', session: 'literature' },
  { name: 'review.tex', size: '38 KB', kind: 'code', session: 'literature' },
  { name: 'adlb_mmrm_tlf.rtf', size: '142 KB', kind: 'manuscript', session: 'literature' },
  { name: 'covid_pbmc_40k_hvg.h5ad', size: '184.6 MB', kind: 'dataset', session: 'scrna' },
  { name: 'liver-pipeline.ipynb', size: '96 KB', kind: 'notebook', session: 'scrna' },
  { name: '_targets.R', size: '18 KB', kind: 'code', session: 'scrna' },
  { name: 'phonon_bands_mp149.json', size: '1.9 MB', kind: 'dataset', session: 'physics' },
  { name: 'navier_stokes_re1e5.nc', size: '412.0 MB', kind: 'dataset', session: 'physics' },
];

// ---- the workbench's own words (what its panes say, beside the data above) ----
export const BENCH = {
  brand: 'Hanzo Science',
  beta: 'Beta',
  account: 'hanzo/z',
  kernel: 'liver-pipeline',
  projects: [['samosa', 'Cross-species Samosa'], ['literature', 'Literature review'], ['scrna', 'scRNA-seq'], ['physics', 'Physics & PDEs']],
  today: [['Samosa Manuscript', 'samosa'], ['Samosa Editorial Review', 'literature'], ['Samosa Model Training', 'scrna'], ['Samosa Benchmarking', 'physics']],
  active: [['samosa', 'Samosa Manuscript', null], ['literature', 'Cross-species scRNA-s...', null], ['scrna', 'SCVI Hyperparameter S...', '8'], ['physics', 'Phonon & PDE Solver', '3']],
  customize: 'Scientific skills, databases & compute connectors (60+ pre-loaded)',
  files: 'Workspace files, datasets & compiled artifacts',
  figure: {
    file: 'samosa_fig1a.png',
    caption: '138 species · 5,672 cell types · one shared embedding',
    pin: 'these labels are hard to see',
    history: 'v1 → v2: Removed background gridlines and converted axis to log scale.',
    legend: ['neuron', 'muscle', 'immune', 'ciliated', 'germline', 'stem/progenitor'],
    insets: [
      { tag: 'i ciliated cells', meta: '27 types · 18 species · 6 phyla', items: ['Ctenophore comb-plate cells', 'Sponge choanoblasts', 'Human airway multiciliated', 'Schistosome flame cells', 'Xenoturbella ciliated'] },
      { tag: 'ii striated muscle', meta: '116 types · 40 species · 7 phyla', items: ['Acoel muscle', 'C. elegans body-wall muscle', 'Ctenophore striated muscle', 'Cnidarian muscle', 'Zebrafish fast muscle'] },
      { tag: 'iii immune', meta: '84 types · 34 species · 6 phyla', items: ['Arrow worm hemocytes', 'Cow myeloid', 'Oyster hemocytes', 'Filarial nematode coelomocyte'] },
    ],
    inputs: ['fig4_atlas_callouts.csv', 'fig4_atlas_centroids_m138ea.csv'],
    tabs: ['Code', 'Execution Log', 'Messages', 'Environment', 'Review ✓'],
    log: [
      '[20:10:02] Loaded fig4_atlas_centroids_m138ea.csv (5,672 cell-type centroids across 138 species)',
      '[20:10:03] Loaded fig4_atlas_callouts.csv (14 highlighted lineages) & fig4_atlas_inset_boxes.csv (3 bounding regions)',
      '[20:10:04] Rendered main UMAP + 3 inset panels (i ciliated cells, ii striated muscle, iii immune) → samosa_fig1a.png (300 DPI)',
    ],
    agent: 'Agent response: Updated `halo` stroke width from 2.2pt to 3.4pt, despined inset axes, and regenerated `samosa_fig1a.png` cleanly from the underlying CSV inputs.',
    env: ['python==3.11.9 · matplotlib==3.9.2 · pandas==2.2.3 · scanpy==1.10.3 · anndata==0.10.9', 'Container digest: sha256:8f4e2c91a0d3... · Reproducible seed: 0 · Connected to Hanzo Notebook (`liver-pipeline`)'],
    review: ['✓ Reviewer audit passed (0 discrepancies)', '• All 5,672 points in `samosa_fig1a.png` trace directly to `fig4_atlas_centroids_m138ea.csv` without manual coordinates.', '• Inset bounding boxes `i`, `ii`, `iii` match `fig4_atlas_inset_boxes.csv` limits with 5% padding (`mx, my = 0.05 * (tx1 - tx0)`).'],
  },
  literature: {
    title: 'Cross-species scRNA-seq Integration...',
    ask: 'Write a literature review on cross-species single-cell RNA-seq integration. Pull the primary methods papers and recent benchmarks. Output the report as a LaTeX doc and a compiled PDF.',
    steps: ['Ran 4 searches, loaded 2 skills, managed environments, +2 more', '10 steps'],
    dispatch: 'Dispatching five parallel literature-retrieval tracks — PubMed primary methods, bioRxiv preprints, OpenAlex citation counts, CELLxGENE multi-species atlas inventory, and orthology-free embedding methods.',
    agents: ['Dispatching PubMed bioRxiv OpenAlex CELLxGENE sub-agents', '142 lines of output'],
    reviewer: { title: 'Reviewer · 1 finding', chip: 'Warn', head: 'PMID 31178118 assigned to both LIGER and Seurat v3 integration in the plan', body: 'In the generate_plan PubMed delegation step the agent writes “LIGER (31178118), Seurat v3 integration (31178118)” — the same PMID for two distinct primary methods papers. The same plan’s OpenAlex step assigns them different DOIs (Seurat v3 10.1016/j.cell.2019.05.031, LIGER 10.1016/j.cell.2019.05.006), so the plan is internally inconsistent and at least one PMID is wrong. None of the PMIDs or DOIs in msg[10] trace to any in-window tool output — no PubMed/CrossRef/OpenAlex lookup has run (exec-log rows 04449b53, 57baea0a, 254f1378 are the two skill kernel.py auto-loads and the env-filter bash; msg[4] tool_results are skill-catalog listings only).', fine: 'The agent reads these findings and self-corrects in its next message.' },
    record: { head: 'exec-log 8f91c204 · Independent NCBI E-utilities & Crossref verification', body: 'Retrieved primary records and verified assertion-level support before LaTeX compilation: Stuart et al. (Seurat v3) matched to PMID 31178118 / DOI 10.1016/j.cell.2019.05.031; Welch et al. (LIGER) matched to PMID 31178122 / DOI 10.1016/j.cell.2019.05.006.' },
    status: ['⇄ all 5 agents done', '✓ Reviewing'],
    prompt: 'Ask anything',
    pdf: {
      file: 'review.pdf',
      title: 'Cross-species single-cell RNA-seq integration: from one-to-one orthologs to protein-language-model embeddings',
      sub: 'Literature synthesis compiled from PubMed, bioRxiv, OpenAlex and CELLxGENE Discover',
      metrics: [['Papers', '24'], ['Years', '2018–2025'], ['Methods', '15'], ['Species pairs', '6 benchmarked'], ['Top-cited', 'Seurat v3 (16,859 cit.)'], ['Most recent', 'TranscriptFormer (2025)']],
      figure: 'Figure 1: Fifteen integration methods (2018–2024) coloured by orthology strategy; OpenAlex citation counts on log scale.',
      left: [['h', '1 Problem statement'], ['p', 'Comparative single-cell transcriptomics asks whether a cell type in one species has a homolog in another, and how its expression program has been conserved or rewired. The technical obstacle is that any two species’ transcriptomes live in different gene coordinate systems.']],
      equations: ['L(θ, φ) = E_q[log p_θ(x | z, s)] - D_KL(q_φ(z | x, s) || p(z))   (1)', 'M_ij = ⟨x_i, H y_j⟩ / (||x_i|| ||H y_j||)   (2)'],
      right: [['p', 'SAMap [10] replaced the hard ortholog filter with a soft, BLAST-derived gene-homology weight matrix H and iteratively refined it against cell-level manifold alignment. SATURN [11] and UCE [12] replace H entirely with ESM2 protein-language-model embeddings in a shared 1,280-dimensional protein space.'], ['h', '2 Ortholog-subsetting methods'], ['p', 'Seurat v3 [1] (PMID 31178118) finds canonical-correlation vectors u, v maximising corr(u^T X, v^T Y) over shared-ortholog matrices, while LIGER [2] (PMID 31178122) factorises each dataset via integrative NMF X_k ≈ (W + V_k) H_k.']],
    },
  },
  scrna: {
    title: 'Scvi hyperparameter screen',
    text: 'Dispatching the 8-arm scVI sweep to lab_cluster A100s — n_latent ∈ {10, 20, 30, 50} × n_layers ∈ {1, 2}, 40k cells × 2,000 HVGs, batch_key="sample_id", 50 epochs, seed 0.',
    env: ['Env: scvi-tools 1.1.2 · scanpy 1.10.1 · PyTorch 2.3.0+cu121 · 8× A100-80GB (2.08 GPU-hrs)', 'Baseline (unintegrated PCA / Harmony): cLISI 0.89, iLISI 0.61 → Arm #6 (d=30, L=2): ELBO -412.8, cLISI 0.94, iLISI 0.88'],
    head: ['arm', 'n_latent', 'n_layers', 'label'],
    umap: 'Stephenson 2021 COVID PBMC — 40k cells, 2,000 batch-aware HVGs, no integration',
    umaps: ['By sequencing site', 'By author cell type'],
    remote: 'Remote · 8',
    running: '8 running · 16m 2s',
    prompt: 'Ask anything',
  },
  physics: {
    title: 'Ab-initio phonon dispersion & 3D spectral PDE solver',
    sub: 'Crystal lattice vibrational modes, turbulent vorticity rollout, and Lean 4 regularity bounds',
    chip: '3 / 3 verified',
    plot: 'Brillouin zone phonon dispersion ω(k) & turbulent energy cascade E(k)',
    path: 'Γ → X → M → Γ · Re = 10⁵',
    prompt: 'Query crystal structures, run PDE sweeps, or verify a Lean 4 lemma...',
  },
  notebook: {
    title: 'Notebook', shared: 'Shared with the agent', cell: 'Cell', run: 'Run', out: '> output', foot: 'Shared state active',
    prompt: "Connected to the agent's live kernel — variables and state are shared. Type an expression and press Enter.",
  },
  reply: { text: 'Synthesized across arXiv, OpenAlex, PubMed, and the live `liver-pipeline` notebook kernel. All citations and intermediate tensors are recorded in the execution log.', meta: 'Verified by Reviewer · Shared with Hanzo Notebook' },
};
