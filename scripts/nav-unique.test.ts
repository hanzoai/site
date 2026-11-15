// Proves every single option across all 6 header dropdown menus (lib/nav.ts) resolves to its own globally
// unique animation (zero shared .webm films, zero static screenshots, zero static stills), and that every
// referenced poster & video file exists in public/.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { NAV } from '../lib/nav.ts';
import {
  resolveNavPreview,
  navAnimationKey,
  CINEMA_SCENE_IDS,
  LIVE_SCENE_IDS,
} from '../lib/visuals.ts';

const PUBLIC_DIR = path.resolve(import.meta.dirname, '..', 'public');
const GL_SET = new Set<string>(CINEMA_SCENE_IDS);
const LIVE_SET = new Set<string>(LIVE_SCENE_IDS);

interface Entry {
  path: string;
  href: string;
  key: string;
  poster: string;
  video?: string;
  gl?: string;
  live?: string;
}

const entries: Entry[] = [];
for (const [menu, cols] of Object.entries(NAV)) {
  for (const col of cols) {
    for (const link of col.links) {
      const spec = resolveNavPreview(menu, col.head, link);
      entries.push({
        path: `${menu} → ${col.head} → ${link.label}`,
        href: link.href,
        key: navAnimationKey(spec),
        poster: spec.poster,
        video: spec.video,
        gl: spec.gl,
        live: spec.live,
      });
    }
  }
}

test('all header dropdown menu options have globally unique animations (0 duplicates, 0 static items)', () => {
  assert.ok(entries.length >= 108, `expected at least 108 nav options, got ${entries.length}`);

  const byKey = new Map<string, string[]>();
  const byVideo = new Map<string, string[]>();

  for (const e of entries) {
    assert.ok(
      e.key.startsWith('GL:') || e.key.startsWith('LIVE:') || e.key.startsWith('VID:'),
      `${e.path} resolved to non-animated ${e.key}`,
    );

    if (e.gl) assert.ok(GL_SET.has(e.gl), `${e.path} uses unknown GL scene "${e.gl}"`);
    if (e.live) assert.ok(LIVE_SET.has(e.live), `${e.path} uses unknown LIVE scene "${e.live}"`);

    const list = byKey.get(e.key) || [];
    list.push(e.path);
    byKey.set(e.key, list);

    if (e.video) {
      const vlist = byVideo.get(e.video) || [];
      vlist.push(e.path);
      byVideo.set(e.video, vlist);
    }
  }

  const dupKeys = [...byKey.entries()].filter(([, list]) => list.length > 1);
  assert.deepEqual(
    dupKeys,
    [],
    `duplicate dropdown animations found:\n${dupKeys.map(([k, l]) => `  ${k}: ${l.join(' | ')}`).join('\n')}`,
  );

  const dupVideos = [...byVideosEntries(byVideo)];
  assert.deepEqual(
    dupVideos,
    [],
    `duplicate .webm videos found:\n${dupVideos.map(([v, l]) => `  ${v}: ${l.join(' | ')}`).join('\n')}`,
  );
});

function* byVideosEntries(byVideo: Map<string, string[]>) {
  for (const pair of byVideo.entries()) {
    if (pair[1].length > 1) yield pair;
  }
}

test('every poster and video asset referenced by dropdown previews exists in public/', () => {
  for (const e of entries) {
    const posterPath = path.join(PUBLIC_DIR, e.poster.replace(/^\//, ''));
    assert.ok(fs.existsSync(posterPath), `missing poster ${e.poster} for ${e.path}`);
    if (e.video) {
      const webmPath = path.join(PUBLIC_DIR, e.video.replace(/^\//, ''));
      const mp4Path = webmPath.replace(/\.webm$/, '.mp4');
      assert.ok(fs.existsSync(webmPath), `missing webm ${e.video} for ${e.path}`);
      assert.ok(fs.existsSync(mp4Path), `missing mp4 fallback for ${e.video} (${e.path})`);
    }
  }
});
