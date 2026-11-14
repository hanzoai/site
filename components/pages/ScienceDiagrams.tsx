/* The figures of the workbench and of the walkthroughs, drawn in the current ink (currentColor) so they read in light and
   dark. Each is Hanzo's own drawing; the walkthrough's lattice, wave and vorticity move with its progress (0 to 100). */

/** The walkthrough's picture for a discipline id; `progress` moves the parts that move. */
export function Demo({ id, progress }: { id: string; progress: number }) {
  switch (id) {
    case 'ai':
      return (
        <svg viewBox="0 0 520 180" width="100%" height="100%" aria-label="Kai decision latency Pareto frontier and Enso routing">
          <rect x="20" y="24" width="136" height="34" rx="6" fill="none" stroke="currentColor" strokeWidth="1.6" />
          <text x="32" y="45" fontSize="9" fill="currentColor">Enso Orchestrator</text>
          <line x1="88" y1="58" x2="88" y2="86" stroke="currentColor" />
          <rect x="20" y="86" width="136" height="34" rx="6" fill="none" stroke="currentColor" strokeWidth="1.6" />
          <text x="32" y="107" fontSize="9" fill="currentColor">Kai Policy · FP8 KV</text>
          <text x="24" y="152" fontSize="9" fill="currentColor">8× H100 · ECE 0.011</text>
          <line x1="195" y1="20" x2="195" y2="145" stroke="currentColor" opacity="0.45" />
          <line x1="195" y1="145" x2="495" y2="145" stroke="currentColor" opacity="0.45" />
          <path d="M 210 38 Q 285 96, 360 118 T 485 132" fill="none" stroke="currentColor" strokeWidth="2.4" />
          <circle cx="360" cy="118" r="5" fill="currentColor" />
          <text x="315" y="98" fontSize="9" fill="currentColor">Arm #9: p99 -38.4%</text>
          <text x="210" y="162" fontSize="9" fill="currentColor">Latency vs Calibration Pareto Frontier</text>
        </svg>
      );
    case 'semiconductors':
      return (
        <svg viewBox="0 0 520 180" width="100%" height="100%" aria-label="NoC router microarchitecture PPA and SVA verification">
          <rect x="24" y="24" width="132" height="112" rx="6" fill="none" stroke="currentColor" strokeWidth="1.6" />
          <line x1="68" y1="24" x2="68" y2="136" stroke="currentColor" opacity="0.4" />
          <line x1="112" y1="24" x2="112" y2="136" stroke="currentColor" opacity="0.4" />
          <line x1="24" y1="62" x2="156" y2="62" stroke="currentColor" opacity="0.4" />
          <line x1="24" y1="98" x2="156" y2="98" stroke="currentColor" opacity="0.4" />
          <circle cx="68" cy="62" r="5" fill="currentColor" />
          <circle cx="112" cy="98" r="5" fill="currentColor" />
          <text x="28" y="154" fontSize="9" fill="currentColor">2nm NoC Router Tile</text>
          <line x1="195" y1="20" x2="195" y2="145" stroke="currentColor" opacity="0.45" />
          <line x1="195" y1="145" x2="495" y2="145" stroke="currentColor" opacity="0.45" />
          <path d="M 210 128 L 280 86 L 355 58 L 470 42" fill="none" stroke="currentColor" strokeWidth="2.2" />
          <text x="220" y="42" fontSize="9" fill="currentColor">OpenROAD STA · WNS +18 ps</text>
          <text x="220" y="162" fontSize="9" fill="currentColor">SymbiYosys SVA: 0 deadlock counterexamples</text>
        </svg>
      );
    case 'materials':
      return (
        <svg viewBox="0 0 520 180" width="100%" height="100%" aria-label="Phonon dispersion and crystal lattice">
          <rect x="20" y="20" width="140" height="140" rx="8" fill="none" stroke="currentColor" opacity="0.3" />
          <line x1="45" y1="45" x2="135" y2="45" stroke="currentColor" opacity="0.4" />
          <line x1="45" y1="135" x2="135" y2="135" stroke="currentColor" opacity="0.4" />
          <line x1="45" y1="45" x2="45" y2="135" stroke="currentColor" opacity="0.4" />
          <line x1="135" y1="45" x2="135" y2="135" stroke="currentColor" opacity="0.4" />
          <circle cx={45 + (progress % 10) * 0.4} cy="45" r="6" fill="currentColor" />
          <circle cx="135" cy={45 + (progress % 10) * 0.4} r="6" fill="currentColor" />
          <circle cx="90" cy={90 - (progress % 10) * 0.5} r="8" fill="currentColor" opacity="0.8" />
          <circle cx="45" cy="135" r="6" fill="currentColor" />
          <circle cx="135" cy="135" r="6" fill="currentColor" />
          <text x="34" y="152" fontSize="9" fill="currentColor">
            2×2×2 supercell
          </text>
          <line x1="195" y1="20" x2="195" y2="145" stroke="currentColor" opacity="0.45" />
          <line x1="195" y1="145" x2="495" y2="145" stroke="currentColor" opacity="0.45" />
          <path
            d="M 195 145 Q 255 82, 305 74 T 410 62 T 495 145"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
          />
          <path
            d="M 195 48 Q 260 64, 305 42 T 410 52 T 495 48"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeDasharray="4 2"
          />
          <line
            x1={195 + progress * 3}
            y1="20"
            x2={195 + progress * 3}
            y2="145"
            stroke="currentColor"
            strokeDasharray="2 2"
          />
          <text x="195" y="162" fontSize="9" fill="currentColor">Γ</text>
          <text x="295" y="162" fontSize="9" fill="currentColor">X</text>
          <text x="395" y="162" fontSize="9" fill="currentColor">M</text>
          <text x="488" y="162" fontSize="9" fill="currentColor">Γ</text>
        </svg>
      );
    case 'fluid':
      return (
        <svg viewBox="0 0 520 180" width="100%" height="100%" aria-label="Spectral Navier-Stokes vorticity and Kolmogorov cascade">
          <circle cx="95" cy="90" r={22 + (progress % 16) * 0.4} fill="none" stroke="currentColor" strokeWidth="1.8" opacity="0.8" />
          <circle cx="95" cy="90" r={38 + (progress % 12) * 0.4} fill="none" stroke="currentColor" strokeDasharray="5 3" opacity="0.55" />
          <circle cx="135" cy="70" r="16" fill="none" stroke="currentColor" opacity="0.7" />
          <text x="35" y="162" fontSize="9" fill="currentColor">
            ω = ∇ × u (512³ grid)
          </text>
          <line x1="210" y1="20" x2="210" y2="145" stroke="currentColor" opacity="0.45" />
          <line x1="210" y1="145" x2="495" y2="145" stroke="currentColor" opacity="0.45" />
          <path d="M 220 35 L 395 108 Q 450 132, 485 142" fill="none" stroke="currentColor" strokeWidth="2.4" />
          <line x1="225" y1="30" x2="425" y2="112" stroke="currentColor" strokeDasharray="4 3" opacity="0.6" />
          <text x="335" y="64" fontSize="10" fill="currentColor">
            E(k) ∝ k⁻⁵/³
          </text>
        </svg>
      );
    case 'chemistry':
      return (
        <svg viewBox="0 0 520 180" width="100%" height="100%" aria-label="Ligand co-folding and alchemical FEP network">
          <polygon points="60,65 95,45 130,65 130,105 95,125 60,105" fill="none" stroke="currentColor" strokeWidth="2" />
          <line x1="130" y1="65" x2="168" y2="52" stroke="currentColor" strokeWidth="2" />
          <circle cx="168" cy="52" r="5" fill="currentColor" />
          <line x1="168" y1="52" x2="205" y2="38" stroke="currentColor" strokeDasharray="3 3" />
          <text x="172" y="34" fontSize="9" fill="currentColor">His163 · 2.8 Å</text>
          <text x="42" y="160" fontSize="9" fill="currentColor">pLDDT 91.4 · ΔΔG = -2.4 kcal/mol</text>
          <circle cx="310" cy="50" r="14" fill="none" stroke="currentColor" strokeWidth="2" />
          <circle cx="430" cy="50" r="14" fill="none" stroke="currentColor" strokeWidth="2" />
          <circle cx="310" cy="130" r="14" fill="none" stroke="currentColor" strokeWidth="2" />
          <circle cx="430" cy="130" r="14" fill="none" stroke="currentColor" strokeWidth="2" />
          <line x1="324" y1="50" x2="416" y2="50" stroke="currentColor" />
          <line x1="324" y1="130" x2="416" y2="130" stroke="currentColor" />
          <line x1="310" y1="64" x2="310" y2="116" stroke="currentColor" />
          <line x1="430" y1="64" x2="430" y2="116" stroke="currentColor" />
          <text x="330" y="94" fontSize="9" fill="currentColor">Hysteresis 0.28 kcal/mol</text>
        </svg>
      );
    case 'mathematics':
      return (
        <svg viewBox="0 0 520 180" width="100%" height="100%" aria-label="Lean 4 formal proof tree">
          <rect x="195" y="16" width="130" height="28" rx="6" fill="none" stroke="currentColor" strokeWidth="1.8" />
          <text x="212" y="34" fontSize="9" fill="currentColor">Theorem: Hˢ regularity</text>
          <line x1="260" y1="44" x2="130" y2="76" stroke="currentColor" />
          <line x1="260" y1="44" x2="260" y2="76" stroke="currentColor" />
          <line x1="260" y1="44" x2="390" y2="76" stroke="currentColor" />
          <rect x="65" y="76" width="130" height="28" rx="6" fill="none" stroke="currentColor" />
          <text x="80" y="94" fontSize="9" fill="currentColor">Lemma 1: Energy bound ✓</text>
          <rect x="205" y="76" width="110" height="28" rx="6" fill="none" stroke="currentColor" />
          <text x="216" y="94" fontSize="9" fill="currentColor">Lemma 2: Commutator ✓</text>
          <rect x="330" y="76" width="135" height="28" rx="6" fill="none" stroke="currentColor" />
          <text x="342" y="94" fontSize="9" fill="currentColor">Lemma 3: Grönwall ✓</text>
          <text x="165" y="148" fontSize="10" fill="currentColor">Lean 4 kernel verified · 0 sorry</text>
        </svg>
      );
    case 'clinical':
      return (
        <svg viewBox="0 0 520 180" width="100%" height="100%" aria-label="targets crew DAG and longitudinal MMRM trajectory">
          <rect x="24" y="28" width="96" height="28" rx="6" fill="none" stroke="currentColor" strokeWidth="1.6" />
          <text x="34" y="46" fontSize="9" fill="currentColor">pytest-wdl ✓</text>
          <line x1="120" y1="42" x2="152" y2="42" stroke="currentColor" />
          <rect x="152" y="28" width="108" height="28" rx="6" fill="none" stroke="currentColor" strokeWidth="1.6" />
          <text x="162" y="46" fontSize="9" fill="currentColor">targets + crew (16)</text>
          <line x1="206" y1="56" x2="206" y2="92" stroke="currentColor" />
          <rect x="152" y="92" width="108" height="28" rx="6" fill="none" stroke="currentColor" strokeWidth="1.6" />
          <text x="162" y="110" fontSize="9" fill="currentColor">admiral + rtables</text>
          <line x1="295" y1="24" x2="295" y2="142" stroke="currentColor" opacity="0.45" />
          <line x1="295" y1="142" x2="495" y2="142" stroke="currentColor" opacity="0.45" />
          <path d="M 300 42 Q 360 78, 415 104 T 490 124" fill="none" stroke="currentColor" strokeWidth="2.2" />
          <path d="M 300 42 Q 360 48, 415 52 T 490 56" fill="none" stroke="currentColor" strokeDasharray="4 3" opacity="0.6" />
          <text x="312" y="160" fontSize="9" fill="currentColor">
            brms.mmrm · rfacts · TSDT · BioRels
          </text>
        </svg>
      );
    case 'biology':
      return (
        <svg viewBox="0 0 520 180" width="100%" height="100%" aria-label="Cross-species UMAP manifold">
          <g fill="currentColor" opacity="0.75">
            <circle cx="95" cy="65" r="4" />
            <circle cx="110" cy="74" r="3.5" />
            <circle cx="125" cy="58" r="4" />
            <circle cx="165" cy="115" r="4" />
            <circle cx="182" cy="108" r="3.5" />
            <circle cx="195" cy="122" r="4" />
            <circle cx="265" cy="68" r="4" />
            <circle cx="282" cy="78" r="3.5" />
            <circle cx="355" cy="96" r="4" />
            <circle cx="372" cy="88" r="4" />
          </g>
          <rect x="152" y="94" width="60" height="42" fill="none" stroke="currentColor" strokeDasharray="3 3" />
          <text x="75" y="160" fontSize="10" fill="currentColor">
            138 species · 5,672 cell types · Shared live kernel
          </text>
        </svg>
      );
    default:
      return null;
  }
}

/** The first figure of the workbench: the cross-species embedding; from v3 the labels are larger. */
export function Umap({ figVersion }: { figVersion: number }) {
  return (
    <svg viewBox="0 0 520 260" width="100%" height="100%" role="img" aria-label="Cross-species UMAP embedding">
      {/* Dense multi-cluster point cloud */}
      <g fill="currentColor" opacity="0.45">
        <circle cx="178" cy="58" r="2.5" />
        <circle cx="190" cy="70" r="3" />
        <circle cx="205" cy="78" r="2.5" />
        <circle cx="215" cy="64" r="3" />
        <circle cx="182" cy="88" r="2.5" />
        <circle cx="198" cy="95" r="3" />
        <circle cx="222" cy="86" r="2.5" />
        <circle cx="174" cy="108" r="3" />
        <circle cx="192" cy="112" r="2.5" />
        <circle cx="238" cy="74" r="2" />
        <circle cx="246" cy="92" r="2.5" />
      </g>
      {/* Neuron cluster (lower left) */}
      <g fill="currentColor" opacity="0.8">
        <circle cx="96" cy="148" r="2.5" />
        <circle cx="110" cy="160" r="3" />
        <circle cx="122" cy="172" r="3.5" />
        <circle cx="135" cy="155" r="2.5" />
        <circle cx="145" cy="182" r="3" />
        <circle cx="128" cy="195" r="3" />
        <circle cx="155" cy="168" r="2.5" />
        <circle cx="162" cy="190" r="3" />
        <circle cx="115" cy="188" r="2.5" />
        <circle cx="140" cy="204" r="3" />
        <circle cx="104" cy="176" r="2.5" />
        <circle cx="152" cy="212" r="2.5" />
      </g>
      {/* Ciliated cluster (box i) */}
      <rect
        x="185"
        y="118"
        width="68"
        height="52"
        fill="none"
        stroke="currentColor"
        strokeDasharray="3 3"
        opacity="0.6"
      />
      <text x="188" y="114" fontSize="9" fill="currentColor">
        i
      </text>
      <g fill="currentColor" opacity="0.7">
        <circle cx="206" cy="138" r="3" />
        <circle cx="218" cy="146" r="2.5" />
        <circle cx="228" cy="136" r="3" />
        <circle cx="214" cy="154" r="2.5" />
        <circle cx="236" cy="148" r="2.5" />
      </g>
      {/* Striated muscle cluster (box ii) */}
      <rect
        x="228"
        y="165"
        width="92"
        height="76"
        fill="none"
        stroke="currentColor"
        strokeDasharray="3 3"
        opacity="0.6"
      />
      <text x="231" y="161" fontSize="9" fill="currentColor">
        ii
      </text>
      <g fill="currentColor" opacity="0.75">
        <circle cx="255" cy="195" r="3" />
        <circle cx="268" cy="204" r="3" />
        <circle cx="280" cy="192" r="2.5" />
        <circle cx="272" cy="215" r="3" />
        <circle cx="290" cy="208" r="2.5" />
        <circle cx="262" cy="224" r="2.5" />
      </g>
      {/* Immune cluster (box iii) */}
      <rect
        x="325"
        y="64"
        width="94"
        height="68"
        fill="none"
        stroke="currentColor"
        strokeDasharray="3 3"
        opacity="0.6"
      />
      <text x="328" y="60" fontSize="9" fill="currentColor">
        iii
      </text>
      <g fill="currentColor" opacity="0.85">
        <circle cx="355" cy="92" r="3" />
        <circle cx="372" cy="86" r="3" />
        <circle cx="384" cy="98" r="2.5" />
        <circle cx="366" cy="106" r="3" />
        <circle cx="395" cy="88" r="3" />
        <circle cx="348" cy="112" r="2.5" />
      </g>
      {/* Cluster Labels */}
      <text x="180" y="76" fontSize={figVersion >= 3 ? '11' : '9'} fontWeight="600" fill="currentColor">
        stem/progenitor
      </text>
      <text x="185" y="102" fontSize={figVersion >= 3 ? '11' : '9'} fontWeight="600" fill="currentColor">
        germline
      </text>
      <text x="122" y="176" fontSize={figVersion >= 3 ? '11' : '9'} fontWeight="600" fill="currentColor">
        neuron
      </text>
      <text x="202" y="145" fontSize={figVersion >= 3 ? '11' : '9'} fontWeight="600" fill="currentColor">
        ciliated
      </text>
      <text x="248" y="212" fontSize={figVersion >= 3 ? '12' : '9'} fontWeight="700" fill="currentColor">
        muscle
      </text>
      <text x="358" y="95" fontSize={figVersion >= 3 ? '11' : '9'} fontWeight="600" fill="currentColor">
        immune
      </text>
    </svg>
  );
}

export function UmapSite() {
  return (
    <svg viewBox="0 0 200 100" width="100%" height="100%" aria-label="UMAP by sequencing site">
      <g fill="currentColor" opacity="0.55">
        <circle cx="65" cy="40" r="14" />
        <circle cx="85" cy="52" r="18" />
        <circle cx="120" cy="36" r="12" />
        <circle cx="135" cy="66" r="15" />
      </g>
    </svg>
  );
}

export function UmapCell() {
  return (
    <svg viewBox="0 0 200 100" width="100%" height="100%" aria-label="UMAP by author cell type">
      <g fill="currentColor" opacity="0.8">
        <circle cx="60" cy="42" r="15" />
        <circle cx="92" cy="54" r="17" />
        <circle cx="125" cy="34" r="11" />
        <circle cx="140" cy="68" r="14" />
      </g>
    </svg>
  );
}

export function Cascade() {
  return (
    <svg viewBox="0 0 460 140" width="100%" height="100%" aria-label="Phonon dispersion and spectral energy cascade">
      <line x1="30" y1="15" x2="30" y2="120" stroke="currentColor" opacity="0.35" />
      <line x1="30" y1="120" x2="435" y2="120" stroke="currentColor" opacity="0.35" />
      <line x1="150" y1="15" x2="150" y2="120" stroke="currentColor" strokeDasharray="3 3" opacity="0.25" />
      <line x1="290" y1="15" x2="290" y2="120" stroke="currentColor" strokeDasharray="3 3" opacity="0.25" />
      {/* Acoustic phonon branch */}
      <path
        d="M 30 120 Q 90 65, 150 58 T 290 48 T 430 120"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
      />
      {/* Optical phonon branch */}
      <path
        d="M 30 34 Q 95 42, 150 30 T 290 36 T 430 34"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeDasharray="4 2"
        opacity="0.75"
      />
      <text x="28" y="132" fontSize="9" fill="currentColor">
        Γ
      </text>
      <text x="146" y="132" fontSize="9" fill="currentColor">
        X
      </text>
      <text x="286" y="132" fontSize="9" fill="currentColor">
        M
      </text>
      <text x="426" y="132" fontSize="9" fill="currentColor">
        Γ
      </text>
    </svg>
  );
}

export function Citations() {
  return (
    <svg viewBox="0 0 240 120" width="100%" height="100%" aria-label="Figure 1 OpenAlex citations log scale">
      <line x1="30" y1="10" x2="30" y2="95" stroke="currentColor" opacity="0.4" />
      <line x1="30" y1="95" x2="225" y2="95" stroke="currentColor" opacity="0.4" />
      <circle cx="65" cy="24" r="4" fill="currentColor" />
      <text x="72" y="26" fontSize="8" fill="currentColor">
        Seurat v3
      </text>
      <circle cx="68" cy="36" r="4" fill="currentColor" opacity="0.7" />
      <text x="75" y="38" fontSize="8" fill="currentColor">
        Harmony
      </text>
      <circle cx="48" cy="48" r="3.5" fill="currentColor" opacity="0.6" />
      <text x="54" y="50" fontSize="8" fill="currentColor">
        scVI
      </text>
      <circle cx="122" cy="68" r="4" fill="currentColor" />
      <text x="110" y="80" fontSize="8" fill="currentColor">
        SAMap
      </text>
      <circle cx="182" cy="66" r="4" fill="currentColor" />
      <text x="175" y="58" fontSize="8" fill="currentColor">
        Saturn / Uce
      </text>
    </svg>
  );
}
