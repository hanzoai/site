'use client';
// The home page's race, cost and frontier figures, read again when the page opens, the way hanzo.ai's own home reads
// them: the same api.hanzo.ai endpoints (lib/liveSources.mjs), worked out the same way (figures.js). Until the read
// lands, and whenever it fails, the build's snapshot stands (content/live, refreshed by scripts/live.mjs before every
// build), so the first paint and a failed read show the same figures.
// api.hanzo.ai answers browsers only on https://hanzo.ai (its CORS allow-origin), so elsewhere (a preview, localhost)
// the page keeps the snapshot rather than log a refused request. localStorage 'hz-live' = '1' forces the read for testing.
import { useEffect, useState } from 'react';
import { SNAPSHOT, figuresOf } from './figures';
import { readResearch, readModels } from '../../lib/liveSources.mjs';

let once = null; // one read per page load, shared by the three cards
const get = async (url) => {
  const r = await fetch(url, { credentials: 'omit', signal: AbortSignal.timeout(8000) });
  if (!r.ok) throw new Error(`${r.status} from ${url}`);
  return r.json();
};
const allowed = () => {
  try { if (localStorage.getItem('hz-live') === '1') return true; } catch {}
  return location.origin === 'https://hanzo.ai';
};
const read = () => (once ??= allowed()
  ? Promise.all([readResearch(get), readModels(get)]).then(([R, M]) => figuresOf(R, M))
  : Promise.reject(new Error('api.hanzo.ai answers hanzo.ai only')));

export default function useFigures() {
  const [f, setF] = useState(SNAPSHOT);
  useEffect(() => {
    let on = true;
    read().then((x) => on && setF(x), () => {}); // a failed read keeps the snapshot
    return () => { on = false; };
  }, []);
  return f;
}
