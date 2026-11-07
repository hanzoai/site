// The cloud template must read each product page as Hanzo wrote it. Usage: node components/pages/cloudfam/cloudData.test.mjs
import assert from 'node:assert/strict';
import { registerHooks } from 'node:module';
registerHooks({ resolve: (s, c, next) => { try { return next(s, c); } catch (e) { if (s.startsWith('.')) return next(s + '.js', c); throw e; } } });
const { MEMBERS, cloudDoc, googlePairs, previewsOf } = await import('./cloudData.js');

assert.equal(MEMBERS().length, 42);
const g = cloudDoc('gpus');
assert.deepEqual(g.window.rows.map((r) => r.state), ['Ready', 'Ready', 'Building', 'Ready']);
assert.deepEqual(g.window.host, ['api.hanzo.ai', '/v1/compute/gpus']);
assert.equal(g.window.siblings.find((s) => s.current).href, '/cloud/gpus');
assert.deepEqual(g.liveLinks, ['https://hanzo.team/']);                    // where hanzo.ai's console button goes today
assert.deepEqual(cloudDoc('logs').window.lines.map((l) => l.g), ['$', '>', '·', '✓']);
assert.equal(cloudDoc('prompts').window.turns.length, 3);
assert.deepEqual(cloudDoc('api-keys').live, ['The service the session above is changing.']); // drawn only in the browser
assert.equal(cloudDoc('local').boot.lines[0].text, 'curl -fsSL https://hanzo.sh | sh');
assert.deepEqual(cloudDoc('chat').related.more, [{ href: 'https://docs.hanzo.ai/docs/chat', label: 'Chat docs →' }]);
assert.equal(googlePairs().length, 18);
assert.ok(googlePairs().every((p) => p.google && p.api.startsWith('/v1/')));
// a neighbour's hover preview is that product's own words, and only /cloud/* products have one
assert.deepEqual(previewsOf(cloudDoc('kubernetes'))['/cloud/gpus'], { name: 'GPUs', label: 'Generally available', lede: 'On-demand accelerators, by the second.', api: '/v1/compute/gpus', google: 'Compute Engine GPUs' });
assert.equal(previewsOf(cloudDoc('kubernetes'))['/machines'], undefined);
assert.deepEqual(previewsOf(cloudDoc('local')), {});
console.log('cloud data: OK');
