// Hanzo's six creative models, in their own words (hanzo.ai/<slug>, captured 7 Nov 2026)
export const ORDER = ['iro', 'koma', 'oto', 'koe', 'uta', 'mori'];
export const C = {
  iro: {
    kind: 'Image', ver: 'Iro 1', name: 'Iro', head: 'Imagine without limits.', code: 'iro-1',
    desc: 'High-fidelity image generation, creative direction, editing, character design and consistent visual assets.',
    caps: [
      ['Photorealistic and stylized direction', 'Micro-surface textures, ray-traced global illumination and lettering in any period’s style.'],
      ['Iterative semantic inpainting', 'Perform granular region-based edits and relighting without altering unmasked background or introducing stylistic seam lines.'],
      ['Multi-perspective character sheets', 'Create multi-angle turnarounds, expression sheets, and costume variations for fictional or branded characters.'],
      ['16-bit wide-gamut output', 'Native wide-gamut RGB pipeline supporting Rec. 2020, Adobe RGB, and CMYK proofing workflows.'],
    ],
    fits: [
      ['Brand and marketing', 'Omnichannel campaign assets', 'Produce high-resolution campaign assets adapted for billboard, mobile, social, and print mediums simultaneously.'],
      ['Concept art and design', 'Rapid worldbuilding and props', 'Accelerate visual development phases for entertainment franchises and industrial product packaging.'],
      ['Publishing', 'Custom hero cover artwork', 'Synthesize stylistically coherent editorial illustrations with complex conceptual metaphors.'],
    ],
  },
  koma: {
    kind: 'Video', ver: 'Koma 1', name: 'Koma', head: 'Every frame tells a story.', code: 'koma-1',
    desc: 'Cinematic video generation, character continuity, motion, animation, and shot-level creative control.',
    caps: [
      ['Temporal character continuity', 'Maintains identity, costume attributes, facial geometry, and lighting coherence across multi-cut cinematic sequences.'],
      ['Shot-level director control', 'Parametric camera choreography: focal length, pan/tilt rate, crane elevation, and dynamic optical depth-of-field.'],
      ['High-fidelity motion synthesis', 'Continuous flow-matching spatial-temporal diffusion eliminating morphing, temporal flicker, and anatomy degeneration.'],
      ['Keyframe-guided scene trajectories', 'Interpolates smoothly between user-defined storyboard keyframes with physics-aware object kinematics.'],
    ],
    fits: [
      ['Film and episodic VFX', 'Previsualization and virtual production', 'Turn treatment scripts and concept art into dynamic camera animatics before principal photography begins.'],
      ['Advertising', 'High-velocity spot iteration', 'Generate product-centric commercial variants with exact brand asset placement and lighting continuity.'],
      ['Game development', 'In-game cinematics and storyboards', 'Rapidly construct dynamic narrative cutscenes matching game engine art direction.'],
    ],
  },
  oto: {
    kind: 'Foley', ver: 'Oto 1', name: 'Oto', head: 'Give every moment its sound.', code: 'oto-1',
    desc: 'Film Foley, immersive sound effects, environmental audio and synchronized scene sound.',
    caps: [
      ['Timeline-synchronized Foley', 'Aligns transient sound impacts, footsteps, collisions, and cloth rustle to video frames down to millisecond precision.'],
      ['Acoustic room impulse modeling', 'Automatically matches early reflections, reverberation decay, and high-frequency absorption to physical scene geometry.'],
      ['Layered multi-stem ambience', 'Generates isolated multichannel bed tracks: wind, urban traffic, foliage movement, room tone, and distant atmospheric cues.'],
      ['Dynamic mechanical and impact sound', 'Produces complex physical audio: vehicle engine load, firearm transients, glass stress fractures, and metallic resonance.'],
    ],
    fits: [
      ['Post-production', 'Automated Foley track generation', 'Eliminate tedious manual spot-effects editing by synthesizing frame-aligned footsteps, props, and cloth movements.'],
      ['Game audio', 'Procedural audio asset banks', 'Generate endless non-repeating variations of impact sounds, footsteps on varying surfaces, and weapon transients.'],
      ['Virtual worlds', 'Spatial 3D audio environments', 'Bake realistic acoustic audio stems into virtual venues, architectural walkthroughs, and simulations.'],
    ],
  },
  koe: {
    kind: 'Voice', ver: 'Koe 1', name: 'Koe', head: 'Performance in every word.', code: 'koe-1',
    desc: 'Directable speech synthesis, character performances, dubbing and multilingual dialogue.',
    caps: [
      ['Director-grade emotional modulation', 'Direct nuances in tone: breath control, hesitation, whispers, intense delivery, irony, and pitch contour through natural language instructions.'],
      ['Cross-lingual voice cloning', 'Preserves vocal identity, formant fingerprint and emotional timbre across languages and regional dialects.'],
      ['Viseme-synchronized dubbing', 'Phoneme timing alignment matched to video mouth shapes and facial cadence for localization.'],
      ['Actor likeness rights', 'Every synthesized voice carries an imperceptible cryptographic watermark, and its provenance is logged.'],
    ],
    fits: [
      ['Localization', 'Actor-preserving film dubbing', 'Dub episodic television and movies into international languages while retaining the original actor’s voice characteristics.'],
      ['Game dialogue', 'Real-time branching character speech', 'Deliver thousands of hours of high-performance character dialogue in video games without recording bottlenecks.'],
      ['Audiobooks and podcasts', 'Multi-voice dramatic performances', 'Cast an entire ensemble of distinct characters from a single manuscript with consistent chapter-to-chapter character voices.'],
    ],
  },
  uta: {
    kind: 'Music', ver: 'Uta 1', name: 'Uta', head: 'Compose beyond imagination.', code: 'uta-1',
    desc: 'Soundtracks, original songs, musical ideas, cue-driven scoring and creative music production.',
    caps: [
      ['Multi-movement song and score generation', 'Composes full multi-movement compositions with cohesive motifs, verse-chorus-bridge progressions, and orchestral codas.'],
      ['Dynamic video cue scoring', 'Automated tempo ramps, harmonic tension builds, and dynamic hits synchronized to scene cuts and dramatic beats.'],
      ['Multitrack stem separation', 'Generates separate mixable stems: lead vocal, backing vocal, drums, bass, rhythm guitars, synthesizers, and orchestral strings.'],
      ['Precise music theory controls', 'Explicit direction over key signatures, modes (Dorian, Mixolydian, etc.), time signatures, BPM tempos, and arrangement density.'],
    ],
    fits: [
      ['Film and trailer scoring', 'Adaptive cinematic soundtracks', 'Draft, test, and orchestrate hybrid orchestral and electronic scores tailored directly to picture edits.'],
      ['Game music', 'Dynamic non-linear music systems', 'Compose layered stems that dynamically fade in, intensify, or resolve based on in-game combat states.'],
      ['Advertising', 'Bespoke commercial brand anthems', 'Produce original, broadcast-cleared signature themes and underscores without production music library compromises.'],
    ],
  },
  mori: {
    kind: '3D', ver: 'Mori 1', name: 'Mori', head: 'Build worlds, not just images.', code: 'mori-1',
    desc: '3D assets, geometry, materials, environments and spatially consistent scenes.',
    caps: [
      ['Production quad and tri topologies', 'Generates clean, water-tight, manifold meshes with optimized edge flow ready for rigging, animation, and real-time engine shaders.'],
      ['Complete PBR material synthesis', 'Delivers full Physically Based Rendering material stacks: albedo, normal, roughness, metallic, ambient occlusion, and emissive maps.'],
      ['Spatially coherent environments', 'Construct full 3D interior and exterior scene geometry aligned to absolute real-world metric scale and coordinate grids.'],
      ['Universal engine export', 'Exports USDZ, glTF and GLB, FBX and OBJ, and 3D Gaussian splats.'],
    ],
    fits: [
      ['Spatial computing', 'AR asset pipeline', 'Generate photorealistic interactive 3D models for AR commerce and spatial apps.'],
      ['Game development', 'Real-time environment and prop kitbashing', 'Populate vast open worlds with hundreds of unique, textured 3D props matching target polycount budgets.'],
      ['Architecture and industrial design', 'Rapid spatial prototyping', 'Translate conceptual sketches and CAD schematics into fully realized 3D spatial volumes.'],
    ],
  },
};
// The studio map groups each model's own "Where it fits" fields under a plain heading (the grouping is ours, the words are Hanzo's)
export const FIELDS = [
  ['Film', [['koma', 0], ['oto', 0], ['koe', 0], ['uta', 0]]],
  ['Games', [['koma', 2], ['oto', 1], ['koe', 1], ['uta', 1], ['mori', 1]]],
  ['Advertising', [['iro', 0], ['koma', 1], ['uta', 2]]],
  ['Publishing', [['iro', 2], ['koe', 2]]],
  ['Design and space', [['iro', 1], ['mori', 0], ['mori', 2], ['oto', 2]]],
];
