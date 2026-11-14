// The mark a lab wears on its points in the Pareto plot: one drawing per brand. A lab with a tile in the agents dock
// (content/agents.ts) wears that tile's own drawing and colours; Z.ai has none there, so its mark is hanzoai/icons'
// (24 units, as hanzo-inc/app draws it), in the colour Z.ai publishes. Enso's tiers wear Hanzo's H, the Hanzo Dev tile.
// A model of any other lab wears nothing, as in the app.
import AGENTS from '../content/agents.ts';

// a flat mark is an svg body (box, optional fill rule, inner markup); a gradient mark is an image file (src)
export type Mark =
  | { src: string; box?: undefined; rule?: undefined; inner?: undefined }
  | { src?: undefined; box: string; rule?: 'nonzero' | 'evenodd' | 'inherit'; inner: string };

const ZAI: Mark = { box: '0 0 24 24', rule: 'evenodd', inner: '<path fill="#3859FF" d="M12.105 2L9.927 4.953H.653L2.83 2h9.276zM23.254 19.048L21.078 22h-9.242l2.174-2.952h9.244zM24 2L9.264 22H0L14.736 2H24z"></path>' };

// a dock tile's icon, as markup: a flat mark is an inline svg, a gradient mark a file
const tile = (name: string): Mark => {
  const html = AGENTS.find((a) => a.name === name)?.icon;
  if (!html) throw new Error(`lab: the agents dock has no tile named ${name}`);
  const src = /<img[^>]*\ssrc="([^"]+)"/.exec(html)?.[1];
  if (src) return { src };
  const root = html.slice(0, html.indexOf('>'));
  return { box: /viewbox="([^"]+)"/i.exec(root)![1], rule: /fill-rule="([^"]+)"/.exec(root)?.[1] as Mark['rule'], inner: html.slice(html.indexOf('>') + 1, html.lastIndexOf('</svg>')) };
};

const OF: [RegExp, () => Mark][] = [
  [/^Claude\b/, () => tile('Claude')],
  [/^(GPT|o\d)/, () => tile('ChatGPT')],
  [/^Gemini\b/, () => tile('Gemini CLI')],
  [/^Grok\b/, () => tile('Grok Build')],
  [/^DeepSeek\b/, () => tile('DeepSeek')],
  [/^Kimi\b/, () => tile('Kimi')],
  [/^GLM\b/, () => ZAI],
  [/^Muse\b/, () => tile('Muse')],
];

// the mark of a point: an Enso tier's is Hanzo's H; null where the lab has none
export const lab = (name: string, ours: boolean): Mark | null => (ours ? tile('Hanzo Dev') : (OF.find(([re]) => re.test(name))?.[1]() ?? null));
