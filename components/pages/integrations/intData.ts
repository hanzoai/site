/* Server side: the /integrations family (19 guides and their index) read from Hanzo's captured pages. Where hanzo.ai's
   script rewrote a phrase after load (e.g. "every model on the gateway" -> "400+ models"), the live wording is used. */
import fs from 'node:fs';
import path from 'node:path';
import { load, find, findAll, textOf, slot, tag, isN } from '../htmltree';
import type { Branch, Child, Meta } from '../htmltree';
import type { Card, Code, Crumb, Link, Sample } from './intData.types';
import { codeOf, PROVIDERS } from '../models/modelsData';

const ROOT = process.cwd();
let IDX: Record<string, Meta> | undefined;
const idx = () => (IDX ||= JSON.parse(fs.readFileSync(path.join(ROOT, 'content', 'pages.json'), 'utf8')));
export const metaOf = (route: string) => idx()[route];
export const SLUGS = () => Object.keys(idx()).filter((p) => /^\/integrations\/[^/]+$/.test(p)).map((p) => p.split('/')[2]);
const clean = (s?: string | null) => (s || '').replace(/\s+/g, ' ').trim();
const live = (rel: string): string | string[] => { const f = path.join(ROOT, 'content', 'live', rel + '.json'); return fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, 'utf8')).text : []; };
const link = (a: Branch): Link => ({ label: clean(textOf(a)), href: a.a!.href }); // every anchor given has an href (filtered where found)
function swap(n: Branch, from: string, to: string): Branch;
function swap(n: Child, from: string, to: string): Child;
function swap(n: Child, from: string, to: string): Child {
  return typeof n === 'string' ? n.split(from).join(to) : { ...n, c: n.c.map((k) => swap(k, from, to)) };
}
const MODEL = /^(zen[\w.-]*|enso[\w.-]*|[a-z0-9-]+\/[a-z0-9][\w.:-]*)$/i;

/* the models a guide's own code names, in order */
const modelsIn = (samples: Code[]) => {
  const makers = new Set([...PROVIDERS(), 'meta-llama']);
  const ok = (t: string) => MODEL.test(t) && (!t.includes('/') || makers.has(t.split('/')[0]));
  return [...new Set(samples.flatMap((s) => s.lines.flat().filter(([k, t]) => k === 'string' && ok(t.trim())).map(([, t]) => t.trim())))];
};

export function guideDoc(slug: string) {
  const rel = 'integrations/' + slug;
  const root = load(rel);
  const lt = live(rel);
  const many = lt.includes('400+ models') ? '400+ models' : null;
  const nav = find(root, tag('nav'));
  const h1 = find(root, tag('h1'));
  const ps = findAll(root, tag('p'));
  const pOf = (re: RegExp) => ps.find((p) => re.test(clean(textOf(p))));
  const fix = (p: Branch | undefined) => (p ? (many ? swap(p, 'every model on the gateway', many) : p).c : null);
  // the badge (emoji) and category sit beside the title
  const spans = findAll(root, (n) => n.t === 'span' && n.a && n.a['data-slot'] === 'text').map((s) => clean(textOf(s)));
  const ci = spans.indexOf(clean(textOf(nav ? nav.c.filter(isN).slice(-1)[0] : ''))) + 1;
  const sections: Sample[] = findAll(root, (n) => n.t === 'div' && n.c.some((k) => isN(k) && k.t === 'h2')).map((d) => {
    const h2 = d.c.find((k) => isN(k) && k.t === 'h2');
    const pre = find(d, tag('pre'));
    const lang = pre ? clean(textOf(findAll(d, (n) => n.t === 'span' && n.a && n.a['data-slot'] === 'text').find((s) => !find(s, tag('pre'))) || '')) : null;
    return { title: clean(textOf(h2)), lang, code: pre ? codeOf(pre) : null, nodes: d.c.filter((k) => k !== h2), links: findAll(d, (n) => n.t === 'a' && n.a && n.a.href).map(link), ps: findAll(d, tag('p')).map((p) => clean(textOf(p))) };
  });
  const band = sections.find((s) => /^Ready to/.test(s.title));
  const more = sections.find((s) => /^More integrations/.test(s.title));
  const samples = sections.filter((s) => s !== band && s !== more);
  // each sibling as a card: its badge and Hanzo's own line for it, read from the integrations index
  const cards: Record<string, Card> = Object.fromEntries(indexDoc().groups.flatMap((g) => g.cards).map((c) => [c.slug, c]));
  if (more) more.links = more.links.map((l) => { const c = cards[l.href.split('/').pop()!]; return c ? { ...l, emoji: c.emoji, desc: c.desc, tag: c.tag } : l; });
  const crumbs: Crumb[] = nav ? [...findAll(nav, tag('a')).map(link), { label: clean(textOf(nav.c.filter(isN).slice(-1)[0])) }] : [];
  return {
    slug, route: '/' + rel, i: SLUGS().indexOf(slug),
    crumbs,
    emoji: spans[ci] || '', category: spans[ci + 1] || '',
    title: clean(textOf(h1)), lede: clean(textOf(find(root, slot('lede')))),
    base: clean(textOf(find(pOf(/^Base URL:/) || { t: '', c: [] }, tag('code')))) || 'https://api.hanzo.ai/v1',
    keyLine: fix(pOf(/^API Key:/)), created: fix(pOf(/^Created by/)), license: fix(pOf(/^License:/)), thanks: clean(textOf(pOf(/deeply appreciate|We thank|thank/i))),
    samples, models: modelsIn(samples.filter((s): s is Sample & { code: Code } => !!s.code).map((s) => s.code)),
    band: band ? { title: band.title, lede: band.ps[0] || '', actions: band.links } : null,
    more: more ? { title: more.title, links: more.links } : null,
  };
}

export function indexDoc() {
  const root = load('integrations');
  const lt = live('integrations');
  const fold = find(root, (n) => n.t === 'section' && n.a && n.a['data-slot'] === 'fold');
  const lede = find(fold, slot('lede'));
  const tabs = findAll(fold, (n) => n.t === 'button' && n.a && n.a.role === undefined && /^tab-/.test(n.a.id || '')).map((b) => clean(textOf(b)));
  const groups = findAll(root, (n) => n.t === 'section' && find(n, tag('h2')) && find(n, slot('grid')) && find(n, (k) => k.a && k.a['data-slot'] === 'leaf')).map((sec) => ({
    title: clean(textOf(find(sec, tag('h2')))),
    cards: findAll(sec, (n) => n.a && n.a['data-slot'] === 'leaf').map((a) => {
      const sp = findAll(a, (n) => n.t === 'span').map((s) => clean(textOf(s)));
      return { href: a.a!.href, emoji: sp[0], name: clean(textOf(find(a, slot('lift')))), desc: clean(textOf(find(a, tag('p')))), tag: sp[sp.length - 1], slug: a.a!.href.split('/').pop()! };
    }),
  }));
  const paste = findAll(root, (n) => n.t === 'section').find((s) => /Paste and ship/.test(textOf(s)));
  const pre = paste ? find(paste, tag('pre')) : null;
  return {
    label: clean(textOf(find(fold, (n) => n.a && 'data-label' in n.a))),
    title: clean(textOf(find(fold, tag('h1')))),
    lede: lede ? lede.c : [],
    base: clean(textOf(find(lede || fold, tag('code')))),
    actions: findAll(fold, slot('action')).map(link),
    samples: findAll(fold, tag('pre')).map((p, i) => ({ lang: tabs[i] || ['Python', 'TypeScript', 'Go'][i], ...codeOf(p) })),
    groups,
    paste: paste ? { kicker: clean(textOf(find(paste, slot('eyebrow')))), lede: clean(textOf(find(paste, slot('lede')))), label: lt.includes('Agent prompt') ? 'Agent prompt' : 'Agent prompt', code: pre ? codeOf(pre).text : '' } : null,
  };
}
