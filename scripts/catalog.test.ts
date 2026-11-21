// /.well-known/ard.json and /.well-known/ai-catalog.json (its earlier name, which scanners still read): one manifest of
// the agentic resources hanzo.ai publishes, in the shape ARD's schemas require (ards-project/ard-spec spec/schemas).
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const WELL_KNOWN = path.resolve(import.meta.dirname, '..', 'public', '.well-known');
const read = (f: string) => fs.readFileSync(path.join(WELL_KNOWN, f), 'utf8');

test('ard.json and ai-catalog.json are the same manifest', () => {
  assert.equal(read('ard.json'), read('ai-catalog.json'));
});

test('the manifest names its spec version, its host and at least one entry', () => {
  const m = JSON.parse(read('ard.json'));
  assert.equal(m.specVersion, '1.0');
  assert.equal(typeof m.host.displayName, 'string');
  assert.ok(Array.isArray(m.entries) && m.entries.length > 0);
  assert.deepEqual(Object.keys(m).sort(), ['entries', 'host', 'specVersion']);
});

test('every entry is an ARD entry: a hanzo.ai URN, a name, a media type, exactly one of url or data, 2-5 queries', () => {
  const { entries } = JSON.parse(read('ard.json'));
  const ids = new Set<string>();
  for (const e of entries) {
    assert.match(e.identifier, /^urn:air:hanzo\.ai(:[a-zA-Z0-9._-]+)+$/, e.identifier);
    assert.ok(!ids.has(e.identifier), `${e.identifier} appears once`);
    ids.add(e.identifier);
    assert.equal(typeof e.displayName, 'string');
    assert.match(e.type, /^[a-z]+\/[a-z0-9.+-]+$/, `${e.identifier} type`);
    assert.equal(('url' in e) !== ('data' in e), true, `${e.identifier}: exactly one of url or data`);
    if ('url' in e) assert.match(e.url, /^https:\/\//);
    assert.ok(e.representativeQueries.length >= 2 && e.representativeQueries.length <= 5, `${e.identifier} queries`);
  }
});
