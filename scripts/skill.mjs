// /skill.md and /.well-known/agent-skills/index.json: the file an agent reads before its first call to Hanzo, and the
// Agent Skills Discovery index (v0.2.0) that names it. Ported from hanzo-inc/app's scripts/skill.mjs, which wrote both
// into hanzo.ai's export until hanzo.ai moved here (hanzo-inc/app#85).
//
// Two halves, and only one is written by hand. public/skill.md is the frame: the operating rules, the credential, the
// install and the MCP server. The "## Families" section after it is read out of the document api.hanzo.ai publishes
// about itself (https://api.hanzo.ai/v1/openapi.json): one line per tag, its sentence and its operation count, grouped
// by the catalog category content/live/_families.json holds for it (a family it places in none, or one new since,
// goes under Rest).
//
// Run after `next build` (package.json build). It FAILS LOUDLY like scripts/live.mjs: a document that does not answer,
// or declares under half the families the snapshot holds, stops the build instead of shipping a stale list. With
// HZ_LIVE_OFFLINE=1 nothing is read and the committed snapshot is used. A file that failed to write would otherwise be
// served as the HTML 404 page with no one noticing, so every file is read back.
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const FRAME = path.join(ROOT, 'public', 'skill.md');
const SNAPSHOT = path.join(ROOT, 'content', 'live', '_families.json');
const OUT = path.join(ROOT, 'out');
const DOCUMENT = 'https://api.hanzo.ai/v1/openapi.json';
const HEADING = '## Families';
const SKILL = 'hanzo-cloud-api';
const VERBS = new Set(['get', 'post', 'put', 'patch', 'delete', 'head', 'options']);
const FLOOR = 0.5;

const die = (why) => {
  console.error(`[skill] ${why}`);
  process.exit(1);
};

// A tag's description as one line about the family: the document writes Go package docs ("Package vector is …"), so
// the opening that names the package and every sentence after the first come off.
export const summarize = (description = '') => {
  const first = description.trim().split(/(?<=\.)\s+/)[0] ?? '';
  const body = first.replace(/^Package\s+\S+\s+(?:is\s+)?/, '');
  return body ? body[0].toUpperCase() + body.slice(1) : '';
};

// The families the document declares, each keeping the category the snapshot holds for it.
export const families = (document, held) => {
  const category = new Map(held.map((f) => [f.name, f.category ?? null]));
  const operations = new Map();
  for (const item of Object.values(document?.paths ?? {})) {
    for (const [method, op] of Object.entries(item ?? {})) {
      if (!VERBS.has(method)) continue;
      for (const tag of op?.tags ?? []) operations.set(tag, (operations.get(tag) ?? 0) + 1);
    }
  }
  return (document?.tags ?? []).map((t) => ({
    name: t.name,
    category: category.get(t.name) ?? null,
    operations: operations.get(t.name) ?? 0,
    summary: summarize(t.description),
  }));
};

export const render = (frame, { source, fetched_at, categories, families: list }) => {
  const groups = [...categories.map((c) => [c.id, c.label]), [null, 'Rest']];
  const count = (n) => `${n} ${n === 1 ? 'operation' : 'operations'}`;
  const line = (f) => `- \`/v1/${f.name}\`${f.summary ? ` — ${f.summary}` : ''} (${count(f.operations)})`;
  const known = new Set(categories.map((c) => c.id));
  const body = groups
    .map(([id, label]) => {
      const rows = list.filter((f) => (known.has(f.category) ? f.category : null) === id);
      return rows.length ? `### ${label}\n\n${rows.map(line).join('\n')}\n` : '';
    })
    .filter(Boolean)
    .join('\n');
  const operations = list.reduce((n, f) => n + f.operations, 0);
  return `${frame}

${HEADING}

The document tags every operation by the first segment after \`/v1/\`, and that
segment is the family. Each line below is a tag the document declares, the
sentence is its own, and the count is how many operations carry it. Headings are
the categories Hanzo's catalog places a family in; \`Rest\` holds every family the
catalog sells no product for, and they answer exactly the same way.

${list.length} families, ${count(operations)}, read from ${source} on ${String(fetched_at).slice(0, 10)}.

${body}`;
};

async function main() {
  if (!fs.existsSync(OUT)) die(`${OUT} is not there; run after next build`);
  const frame = fs.readFileSync(FRAME, 'utf8').trimEnd();
  // The one seam between the two halves: a heading typed into the frame would publish two of this section.
  if (frame.includes(HEADING)) die(`public/skill.md carries "${HEADING}"; that section is generated here`);

  const snapshot = JSON.parse(fs.readFileSync(SNAPSHOT, 'utf8'));
  if (!snapshot.families?.length || !snapshot.categories?.length) die('content/live/_families.json holds no families or categories');

  if (process.env.HZ_LIVE_OFFLINE === '1') console.log(`[skill] HZ_LIVE_OFFLINE=1: families from the snapshot of ${snapshot.fetched_at}`);
  else {
    let document;
    try {
      const r = await fetch(DOCUMENT, { headers: { 'user-agent': 'hanzo-site-live' }, signal: AbortSignal.timeout(60000) });
      if (!r.ok) throw new Error(`${r.status} from ${DOCUMENT}`);
      document = await r.json();
    } catch (e) {
      die(`${e.message}; the families were not read (HZ_LIVE_OFFLINE=1 builds from the snapshot)`);
    }
    const list = families(document, snapshot.families);
    if (list.length < snapshot.families.length * FLOOR) {
      die(`${DOCUMENT} declares ${list.length} families, under half of the ${snapshot.families.length} the snapshot holds`);
    }
    Object.assign(snapshot, { source: DOCUMENT, fetched_at: new Date().toISOString(), families: list });
    fs.writeFileSync(SNAPSHOT + '.tmp', JSON.stringify(snapshot, null, 2) + '\n');
    fs.renameSync(SNAPSHOT + '.tmp', SNAPSHOT);
  }

  const skill = path.join(OUT, 'skill.md');
  fs.writeFileSync(skill, render(frame, snapshot));
  const written = fs.readFileSync(skill, 'utf8');
  if (!written.includes(HEADING) || written.length <= frame.length) die(`${skill} did not survive the write`);
  const ops = snapshot.families.reduce((n, f) => n + f.operations, 0);
  console.log(`[skill] out/skill.md: ${snapshot.families.length} families, ${ops} operations, ${(written.length / 1024).toFixed(0)} KB`);

  // The same document as an Agent Skill, and the index naming it. Its description is the "> " summary the frame opens
  // with, and its digest is taken from the bytes written here, so the index cannot name a file that has moved on.
  // /skill.md stays as it is: it opens with "# Hanzo", which the copy-prompt flows read.
  const summary = frame.split('\n').filter((l) => l.startsWith('> ')).map((l) => l.slice(2).trim()).join(' ');
  if (!summary) die('public/skill.md opens with no "> " summary to describe the skill with');
  const dir = path.join(OUT, '.well-known', 'agent-skills');
  const artifact = path.join(dir, SKILL, 'SKILL.md');
  fs.mkdirSync(path.dirname(artifact), { recursive: true });
  fs.writeFileSync(artifact, `---\nname: ${SKILL}\ndescription: ${JSON.stringify(summary)}\n---\n\n${written}`);
  const digest = `sha256:${createHash('sha256').update(fs.readFileSync(artifact)).digest('hex')}`;
  const index = path.join(dir, 'index.json');
  fs.writeFileSync(
    index,
    JSON.stringify(
      {
        $schema: 'https://schemas.agentskills.io/discovery/0.2.0/schema.json',
        skills: [{ name: SKILL, type: 'skill-md', description: summary, url: `/.well-known/agent-skills/${SKILL}/SKILL.md`, digest }],
      },
      null,
      2
    ) + '\n'
  );
  if (JSON.parse(fs.readFileSync(index, 'utf8')).skills?.[0]?.digest !== digest) die(`${index} did not survive the write`);
  console.log(`[skill] out/.well-known/agent-skills/index.json and ${SKILL}/SKILL.md (${digest.slice(0, 19)}…)`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await main();
