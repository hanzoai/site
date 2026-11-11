'use client';
// The home page's race, cost and frontier figures, read again when the page opens, the way hanzo.ai's own home reads
// them: the same api.hanzo.ai endpoints (lib/liveSources.mjs), worked out the same way (figures.js). Until the read
// lands, and whenever it fails, the build's snapshot stands (content/live, refreshed by scripts/live.mjs before every
// build), so the first paint and a failed read show the same figures.
// The three endpoints answer any origin (access-control-allow-origin: *), so the read runs wherever the page is served:
// hanzo.ai, a preview or localhost.
import { createContext, createElement, useContext, useEffect, useState } from 'react';
import { figuresOf } from './figures';
import { readResearch, readModels } from '../../lib/liveSources.ts';

let once = null; // one read per page load, shared by the three cards
const get = async (url) => {
  const r = await fetch(url, { credentials: 'omit', signal: AbortSignal.timeout(8000) });
  if (!r.ok) throw new Error(`${r.status} from ${url}`);
  return r.json();
};
const read = () => (once ??= Promise.all([readResearch(get), readModels(get)]).then(([R, M]) => figuresOf(R, M)));

// the build's snapshot, worked out on the server (snapshot.js) and provided by the home page
export const Figures = createContext(null);
// the snapshot handed down from the server page (a server component cannot render a context itself)
export const FiguresProvider = ({ value, children }) => createElement(Figures.Provider, { value }, children);

export default function useFigures() {
  const [f, setF] = useState(useContext(Figures));
  useEffect(() => {
    let on = true;
    read().then((x) => on && setF(x), () => {}); // a failed read keeps the snapshot
    return () => { on = false; };
  }, []);
  return f;
}
