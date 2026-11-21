// The head's WebMCP script (lib/webmcp.ts), run as a browser runs it: in a context with a modelContext, a location, a
// fetch and timers, and in one with none of them.
import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import SEARCH from './search.json' with { type: 'json' };
import { TOOLS, WEBMCP, KEYS, INDEX } from './webmcp.ts';

// what the script built lives in its own realm; compare it as data
const plain = (v: unknown) => JSON.parse(JSON.stringify(v));

type Said = { content: { type: string; text: string }[] };
type Registered = { name: string; description: string; inputSchema: unknown; annotations?: unknown; execute: (i?: unknown) => Promise<Said> };

function page(where: 'document' | 'navigator' | 'none', api: 'registerTool' | 'provideContext' = 'registerTool', index: unknown = SEARCH) {
  const tools: Registered[] = [];
  const went: string[] = [];
  const fetched: string[] = [];
  const context =
    api === 'registerTool'
      ? { registerTool: (t: Registered) => { tools.push(t); return Promise.resolve(); } }
      : { provideContext: ({ tools: l }: { tools: Registered[] }) => { tools.push(...l); } };
  const sandbox = {
    document: where === 'document' ? { modelContext: context } : {},
    navigator: where === 'navigator' ? { modelContext: context } : {},
    location: { origin: 'https://hanzo.ai', assign: (u: string) => went.push(u) },
    URL,
    Promise,
    setTimeout: (f: () => void) => f(),
    fetch: (u: string) => {
      fetched.push(u);
      return Promise.resolve(index === null ? { ok: false, status: 404 } : { ok: true, json: () => Promise.resolve(index) });
    },
  };
  vm.runInNewContext(WEBMCP, sandbox);
  const tool = (name: string) => tools.find((t) => t.name === name)!;
  return { tools, went, fetched, tool };
}

test('the head registers the four tools on document.modelContext, each as described', () => {
  const { tools } = page('document');
  assert.deepEqual(tools.map((t) => t.name), TOOLS.map((t) => t.name));
  for (const t of tools) {
    const d = TOOLS.find((x) => x.name === t.name)!;
    assert.equal(t.description, d.description);
    assert.deepEqual(plain(t.inputSchema), d.inputSchema);
    assert.equal(typeof t.execute, 'function');
  }
  assert.deepEqual(plain(tools.find((t) => t.name === 'search_hanzo')!.annotations), { readOnlyHint: true });
});

test("a first shim's navigator.modelContext gets them too, and provideContext is used where registerTool is not", () => {
  assert.equal(page('navigator').tools.length, 4);
  assert.equal(page('document', 'provideContext').tools.length, 4);
});

test('a browser with no modelContext is left alone and nothing is fetched', () => {
  const { tools, fetched } = page('none');
  assert.equal(tools.length, 0);
  assert.deepEqual(fetched, []);
});

test('nothing is fetched until the first search, and search finds pricing with its address on this host', async () => {
  const p = page('document');
  assert.deepEqual(p.fetched, []);
  const out = await p.tool('search_hanzo').execute({ query: 'pricing' });
  assert.deepEqual(p.fetched, [INDEX]);
  const text = out.content[0].text;
  assert.match(text, /^Pages on hanzo\.ai for "pricing":/);
  assert.match(text, /: https:\/\/hanzo\.ai\/pricing\n/);
  assert.match(text, /docs\.hanzo\.ai\/llms\.txt/);
  await p.tool('search_hanzo').execute({ query: 'api keys', limit: 3 });
  assert.equal(p.fetched.length, 1, 'the index is fetched once');
});

test('search honours the limit, refuses an empty query, and says so when the index is missing', async () => {
  const p = page('document');
  const three = (await p.tool('search_hanzo').execute({ query: 'models', limit: 3 })).content[0].text;
  assert.equal(three.split('\n').filter((l) => l.startsWith('- ')).length, 3);
  assert.match((await p.tool('search_hanzo').execute({ query: '  ' })).content[0].text, /^Say what to look for/);
  assert.match((await p.tool('search_hanzo').execute({})).content[0].text, /^Say what to look for/);
  const none = page('document', 'registerTool', null);
  assert.match((await none.tool('search_hanzo').execute({ query: 'pricing' })).content[0].text, /did not load/);
});

test('open_pricing, start_chat and create_api_key answer first and then go where a person would', async () => {
  const p = page('document');
  assert.equal((await p.tool('open_pricing').execute()).content[0].text, 'Opened https://hanzo.ai/pricing.');
  const chat = (await p.tool('start_chat').execute({ prompt: 'what is Enso?' })).content[0].text;
  assert.match(chat, /^Opened Hanzo Chat at https:\/\/hanzo\.app\/\?q=what%20is%20Enso%3F/);
  const key = (await p.tool('create_api_key').execute()).content[0].text;
  assert.match(key, /never|creates the key there/);
  assert.deepEqual(p.went, ['/pricing', 'https://hanzo.app/?q=what%20is%20Enso%3F', KEYS]);
});

test('the inlined script cannot close its own <script> element', () => {
  assert.equal(WEBMCP.includes('</'), false);
});
