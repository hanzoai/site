// lib/mcp.js is what each client takes, as that client's own docs say. These hold the file to the shape the picker and the
// docs page draw: every way names the doc page it was checked against, a snippet is the syntax it claims to be, and a
// client with no way available is not listed.
import test from 'node:test';
import assert from 'node:assert/strict';
import C from '../content.ts';
import { CLIENTS, WAYS, SIGN_IN, MCP_URL, ways, clients, entry } from '../lib/mcp.ts';
import { SETUP } from '../lib/setup.ts';

const IDS = WAYS.map((w) => w.id);
// `npx -y hanzo mcp` however the client spells it: a command line, a JSON or YAML array, or OpenClaw's repeated --arg
const flat = (s) => s.replace(/\b(command|args)\b"?\s*[:=]\s*/g, ' ').replace(/--arg |--command /g, ' ').replace(/["',[\]{}]/g, ' ').replace(/\s+/g, ' ');
const runsLocal = (s) => /npx -y hanzo mcp/.test(flat(s)) || /command = "hanzo-mcp"/.test(s);
const all = () => CLIENTS.flatMap((c) => IDS.filter((id) => entry(c, id)).map((id) => [c, id, entry(c, id)]));

test('the sign-in way is off until Hanzo can sign a client in', () => {
  assert.equal(SIGN_IN, false);
  assert.deepEqual(ways().map((w) => w.id), ['key', 'local']);
});

test('every client has one name, one icon in the dock, and every way names the doc page it was checked against', () => {
  const dock = new Set(C.agents.map((a) => a.name));
  assert.equal(new Set(CLIENTS.map((c) => c.id)).size, CLIENTS.length);
  assert.equal(new Set(CLIENTS.map((c) => c.name)).size, CLIENTS.length);
  for (const c of CLIENTS) assert.ok(dock.has(c.icon), `${c.name}: no ${c.icon} icon in the dock`);
  for (const [c, id, e] of all()) {
    assert.match(e.from, /^https:\/\//, `${c.name} ${id}: from`);
    assert.ok(e.hint.trim() && e.code.trim(), `${c.name} ${id}: hint and code`);
  }
});

test('a client that lacks a way says why, in its own words', () => {
  for (const c of CLIENTS) for (const id of IDS) if (!entry(c, id)) assert.ok(c.none?.[id], `${c.name} ${id}: no reason`);
});

test('a snippet in JSON is JSON, and every one points at the right server', () => {
  for (const [c, id, e] of all()) {
    if (e.code.trim().startsWith('{')) JSON.parse(e.code);
    if (id === 'local') assert.ok(runsLocal(e.code), `${c.name} local: runs hanzo mcp`);
    else if (c.id !== 'claude') assert.ok(e.code.includes(MCP_URL), `${c.name} ${id}: the hosted door`);
    if (id === 'key') assert.ok(/Bearer (sk-\.\.\.|\$\{input:hanzo-key\})/.test(e.code), `${c.name} key: sends the key as a bearer`);
    if (id === 'signin') assert.ok(!/Bearer|sk-/.test(e.code), `${c.name} signin: no key`);
  }
});

test('no key is in the page: the placeholder only', () => {
  for (const [, , e] of all()) assert.ok(!/sk-[A-Za-z0-9]{8,}/.test(e.code));
});

test('a client with no available way is not listed, and each way shows its clients', () => {
  assert.ok(!clients().some((c) => c.id === 'chatgpt'), 'ChatGPT connects with sign-in only');
  assert.ok(clients(WAYS).some((c) => c.id === 'chatgpt'));
  for (const c of clients()) assert.ok(ways().some((w) => entry(c, w.id)));
  for (const c of clients(WAYS)) assert.ok(IDS.some((id) => entry(c, id)));
});

test('turning sign-in on lists it and breaks nothing', () => {
  const on = clients(WAYS);
  assert.ok(on.length >= clients().length);
  for (const c of on) assert.ok(IDS.some((id) => entry(c, id)));
});

test('the setup list and the dock say the same clients', () => {
  const dock = new Set(C.agents.map((a) => a.name));
  for (const c of CLIENTS) if (c.page) assert.ok(C.agents.find((a) => a.name === c.icon).href.includes('docs.hanzo.ai'), `${c.name}: dock link`);
  for (const [name] of SETUP) assert.equal(SETUP.filter(([n]) => n === name).length, 1, `${name} is listed once`);
  assert.ok(dock.size === C.agents.length, 'one tile per agent');
});
