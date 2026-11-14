// One shared watcher for "the page's DOM changed" (new route, a section mounted, an overlay opened), instead of each
// layer polling with setInterval. Debounced to one call per 200 ms; callbacks get no arguments.
// HOW TO USE (client only): import { onDomChange } from '../lib/domwatch';  useEffect(() => onDomChange(fn), []);
const subs = new Set<() => void>();
let mo: MutationObserver | null = null, t: ReturnType<typeof setTimeout> | 0 = 0;
const fire = () => { t = 0; subs.forEach((f) => { try { f(); } catch {} }); };
export function onDomChange(fn: () => void) {
  subs.add(fn);
  if (!mo && typeof MutationObserver !== 'undefined') {
    mo = new MutationObserver(() => { if (!t) t = setTimeout(fire, 200); });
    mo.observe(document.body, { childList: true, subtree: true });
  }
  return () => { subs.delete(fn); if (!subs.size && mo) { mo.disconnect(); mo = null; clearTimeout(t); t = 0; } };
}
