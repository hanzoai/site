// node --test components/pages/Badge.links.test.ts: /badge copies the same snippets hanzo.ai copied before the redesign
// (each value below was read off the page's code at hanzoai/site@ce049c5), for the same selections.
import test from 'node:test';
import assert from 'node:assert/strict';
import { badge, type Selection } from './Badge.links.ts';

const at = (over: Partial<Selection> = {}) =>
  badge({ kind: 'profile', theme: 'dark', style: 'flat', finish: 'graphite', pillDeploy: false, fields: ['rank', 'points', 'tokens'], label: '', handle: 'zeekay', repo: 'hanzoai/hanzo', refCode: '', format: 'markdown', ...over });

const CASES: [Partial<Selection>, string, string, string][] = [
  [{}, '[![Hanzo @zeekay](https://hanzo.ai/badges/zeekay.svg)](https://hanzo.ai/leaderboard?ref=zeekay)', 'https://github.com/zeekay/zeekay/edit/main/README.md', '/badges/edit-on-hanzo.svg'],
  [{ theme: 'light', style: 'square', handle: '@ZooQueen' }, '[![Hanzo @ZooQueen](https://hanzo.ai/badges/zooqueen-square.svg)](https://hanzo.ai/leaderboard?ref=ZooQueen)', 'https://github.com/zooqueen/antjeworring.com/edit/main/README.md', '/badges/edit-on-hanzo-dark.svg'],
  [{ handle: 'some-one', fields: ['rank', 'level', 'badges'], label: 'Builder', finish: 'silver' }, '[![Hanzo @some-one](https://api.hanzo.ai/v1/reward/badge/some-one.svg?theme=light&style=flat&fields=level,badges&label=Builder)](https://hanzo.ai/leaderboard?ref=some-one)', 'https://github.com/some-one/some-one/edit/main/README.md', '/badges/edit-on-hanzo-dark.svg'],
  [{ style: 'strip', refCode: 'abc' }, '[![Hanzo @zeekay](https://api.hanzo.ai/v1/reward/badge/zeekay.svg?theme=dark&style=card&fields=points,tokens)](https://hanzo.ai/leaderboard?ref=abc)', 'https://github.com/zeekay/zeekay/edit/main/README.md', '/badges/edit-on-hanzo.svg'],
  [{ kind: 'rank', handle: 'valerypetrov' }, '[![Hanzo Leaderboard @valerypetrov](https://hanzo.ai/badges/valerypetrov.svg)](https://hanzo.ai/leaderboard?ref=valerypetrov)', 'https://github.com/valerypetrov/valerypetrov/edit/main/README.md', '/badges/edit-on-hanzo.svg'],
  [{ kind: 'rank', handle: 'x', label: 'Top' }, '[![Hanzo Leaderboard @x](https://api.hanzo.ai/v1/leaderboard/badge/x.svg?theme=dark&style=flat&label=Top)](https://hanzo.ai/leaderboard?ref=x)', 'https://github.com/x/x/edit/main/README.md', '/badges/edit-on-hanzo.svg'],
  [{ kind: 'deploy', repo: 'https://github.com/a/b.git', refCode: 'abc&x', format: 'html' }, '<a href="https://platform.hanzo.ai/deploy?repo=https%3A%2F%2Fgithub.com%2Fa%2Fb&ref=abc%26x"><img src="https://hanzo.ai/badges/deploy-to-hanzo.svg" alt="Deploy to Hanzo" /></a>', 'https://github.com/a/b/edit/main/README.md', '/badges/deploy-to-hanzo.svg'],
  [{ kind: 'deploy', pillDeploy: true, theme: 'light' }, '[![Deploy to Hanzo](https://hanzo.ai/deploy.svg)](https://platform.hanzo.ai/deploy?repo=https%3A%2F%2Fgithub.com%2Fhanzoai%2Fhanzo&ref=zeekay)', 'https://github.com/hanzoai/hanzo/edit/main/README.md', '/deploy.svg'],
  [{ kind: 'edit', repo: 'bad' }, '[![Edit on Hanzo](https://hanzo.ai/badges/edit-on-hanzo.svg)](https://hanzo.app/dev?ref=zeekay)', 'https://github.com/hanzoai/hanzo/edit/main/README.md', '/badges/edit-on-hanzo.svg'],
  [{ kind: 'built', refCode: 'zz' }, '[![Built with Hanzo](https://hanzo.ai/badges/built-with-hanzo.svg)](https://hanzo.ai/?ref=zz)', 'https://github.com/hanzoai/hanzo/edit/main/README.md', '/badges/built-with-hanzo.svg'],
];

test('each selection copies the snippet, README link and preview image it did before', () => {
  for (const [over, snippet, readme, preview] of CASES) {
    const b = at(over);
    assert.equal(b.activeSnippet, snippet);
    assert.equal(b.githubReadmeEditUrl, readme);
    assert.equal(b.previewSrc, preview);
  }
});

test('Markdown and HTML say the same image, link and alt text', () => {
  const b = at({ kind: 'deploy', refCode: 'abc&x' });
  assert.equal(b.markdownSnippet, `[![${b.altText}](${b.imgSrc})](${b.targetHref})`);
  assert.equal(b.htmlSnippet, `<a href="${b.targetHref}"><img src="${b.imgSrc}" alt="${b.altText}" /></a>`);
});

test('the ready-to-paste gallery carries its six snippets', () => {
  assert.deepEqual(at({ refCode: 'zz' }).quickPresets.map((p) => p.md), [
    '[![Hanzo @zeekay](https://hanzo.ai/badges/zeekay.svg)](https://hanzo.ai/leaderboard?ref=zeekay)',
    '[![Hanzo @zooqueen](https://hanzo.ai/badges/zooqueen.svg)](https://hanzo.ai/leaderboard?ref=zooqueen)',
    '[![Deploy to Hanzo](https://hanzo.ai/badges/deploy-to-hanzo.svg)](https://platform.hanzo.ai/deploy?repo=https%3A%2F%2Fgithub.com%2Fhanzoai%2Fhanzo&ref=zz)',
    '[![Edit on Hanzo](https://hanzo.ai/badges/edit-on-hanzo.svg)](https://hanzo.app/dev?repo=https%3A%2F%2Fgithub.com%2Fhanzoai%2Fhanzo&ref=zz)',
    '[![Built with Hanzo](https://hanzo.ai/badges/built-with-hanzo.svg)](https://hanzo.ai/?ref=zz)',
    '[![Hanzo Rank](https://hanzo.ai/badges/zeekay-rank.svg)](https://hanzo.ai/leaderboard?ref=zeekay)',
  ]);
});
