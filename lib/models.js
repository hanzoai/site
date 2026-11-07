// Hanzo's nine flagship models, in their words. Media lives at /models/<slug>.webp|.webm as on hanzo.ai.
export const MODELS = [
  { slug: 'enso', name: 'Enso', kicker: 'Flagship model', desc: 'Orchestrates every model for higher intelligence, faster and at lower cost.', tags: ['Routing', 'Agents', 'Multi-modal'] },
  { slug: 'kai', name: 'Kai', desc: 'Precise decisions and structured reasoning.', tags: ['Logic'] },
  { slug: 'zen', name: 'Zen', desc: 'Deep reasoning for complex problems.', tags: ['Reasoning'] },
  { slug: 'iro', name: 'Iro', desc: 'Image generation and visual understanding.', tags: ['Images'] },
  { slug: 'koma', name: 'Koma', desc: 'Video generation and world simulation.', tags: ['Video'] },
  { slug: 'oto', name: 'Oto', desc: 'Sound generation and audio understanding.', tags: ['Audio'] },
  { slug: 'koe', name: 'Koe', desc: 'Voice synthesis and speech understanding.', tags: ['Voice'] },
  { slug: 'uta', name: 'Uta', desc: 'Music generation and composition.', tags: ['Music'] },
  { slug: 'mori', name: 'Mori', desc: '3D generation and spatial understanding.', tags: ['3D'] },
];
export const bySlug = Object.fromEntries(MODELS.map((m) => [m.slug, m]));
export const media = (slug, ext) => `/models/${slug}.${ext}`;
