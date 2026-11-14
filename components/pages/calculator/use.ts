'use client';
// The token calculator's reads, in the browser: each source in sources.mjs, once per page load (every part that asks gets
// the same promise), with a reply that does not start in 15 seconds counted as no reply. Each renders `loading` first,
// which is the state the export prerenders, then `ready` or `unreachable`.
import { useEffect, useState } from 'react';
import { readPricing, readSummary, readServed } from './sources.ts';
import type { Get } from './sources.ts';
import type { Reading } from './types.ts';

const PATIENCE = 15000;
const get = async (url: string | URL | Request) => {
  const r = await fetch(url, { credentials: 'omit', headers: { accept: 'application/json' }, signal: AbortSignal.timeout(PATIENCE) });
  if (!r.ok) throw new Error(`${r.status} from ${url}`);
  return r.json();
};
type Reader<T> = (get: Get) => Promise<T>;
// one promise per reader, each reader's own kind
const pending = new Map<Reader<unknown>, Promise<unknown>>();
const once = <T,>(reader: Reader<T>): Promise<T> => {
  let got = pending.get(reader) as Promise<T> | undefined;
  if (!got) pending.set(reader, (got = reader(get)));
  return got;
};

/** Where a read stands: { state: 'loading' }, { state: 'ready', data } or { state: 'unreachable', error }. */
function useReading<T>(reader: Reader<T>): Reading<T> {
  const [now, setNow] = useState<Reading<T>>({ state: 'loading' });
  useEffect(() => {
    let open = true;
    once(reader).then((data) => open && setNow({ state: 'ready', data }), (error) => open && setNow({ state: 'unreachable', error }));
    return () => { open = false; };
  }, [reader]);
  return now;
}

export const usePricing = () => useReading(readPricing);
export const useSummary = () => useReading(readSummary);
export const useServed = () => useReading(readServed);

/** "400+ models", or "every model on the gateway" until the price list's count is read and whenever it cannot be: no count is typed here. */
export function useModels() {
  const r = useSummary();
  const n = r.state === 'ready' ? r.data.totalModels : 0;
  const floor = Math.floor(n / 100) * 100; // floored to the hundred, so copy says 400+ for 438 and keeps saying it at 499
  return n ? `${floor || n}+ models` : 'every model on the gateway';
}
