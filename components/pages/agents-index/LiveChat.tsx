'use client';
/* /agents signature (docs/MOTION-MAP.md `live-chat`): the page's own questions as a choice to ask, and Hanzo answering
   on screen in real time, word by word, in the page's own words. Scripted: no request leaves the page.
   It asks the first question itself when it arrives; a chip asks the next (a tap on phones). The server HTML, JS off and
   reduced motion hold the whole conversation, every question answered; a chip then shows its answer. */
import type React from 'react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useCalm } from '../../ui';
import './LiveChat.css';

const top = (box: never, el: Element) => el.getBoundingClientRect().top - box.getBoundingClientRect().top + box.scrollTop; // el's offset inside the log
const STOP = Symbol('stop');
const still = () => typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;

interface LiveChatProps {
  items: string[][];
  head: React.JSX.Element;
}
export default function LiveChat({ items, head }: LiveChatProps) {
  const calm = useCalm();
  const all = useMemo(() => items.map((_, q) => ({ id: 'all' + q, q })), [items]);
  const [thread, setThread] = useState(all);
  const [cur, setCur] = useState(-1);
  const [live, setLive] = useState(false);
  const [done, setDone] = useState(() => new Set()); // the questions asked so far (their chips settle)
  const log = useRef<HTMLDivElement>(null);
  const win = useRef<HTMLDivElement>(null);
  const tok = useRef(0);
  const started = useRef(false);

  // the whole conversation is always there (every question answered, as on Hanzo's page); a moving browser types an
  // answer again, in place, when its question is asked
  useEffect(() => { if (!still()) setLive(true); }, []);
  useEffect(() => { if (calm && live) { tok.current++; setLive(false); setThread(all); } }, [calm, live, all]);

  const ask = useCallback(async (q: number) => {
    setCur(q);
    const box = log.current;
    if (!live) {
      const el = box?.querySelector(`[data-q="${q}"]`);
      if (box && el) box.scrollTo({ top: top(box, el) - 12 });
      return;
    }
    started.current = true;
    setDone((d) => new Set(d).add(q));
    const id = ++tok.current;
    const key = 'all' + q;
    const a = items[q][1];
    const set = (f: { wait: boolean; } | { n: number; } | { n: undefined; }) => setThread((t) => t.map((m) => (m.id === key ? { ...m, ...f } : m)));
    // the answer in hand finishes at once; the window brings the asked question up, Hanzo types, then answers
    setThread((t) => t.map((m) => (m.id === key ? { ...m, n: 0, wait: true } : m.n !== undefined || m.wait ? { ...m, n: undefined, wait: false } : m)));
    requestAnimationFrame(() => { const el = box?.querySelector(`[data-q="${q}"]`); if (box && el) box.scrollTo({ top: top(box, el) - 12, behavior: calm ? 'auto' : 'smooth' }); });
    const sleep = (ms: number) => new Promise((ok, no) => setTimeout(() => (tok.current === id ? ok() : no(STOP)), ms));
    try {
      await sleep(700);
      set({ wait: false });
      const re = /\S+\s*/g;
      let m;
      while ((m = re.exec(a))) {
        set({ n: m.index + m[0].length });
        await sleep(/[.:?]\s*$/.test(m[0]) ? 150 : /,\s*$/.test(m[0]) ? 70 : 36);
      }
      set({ n: undefined });
    } catch (e) { if (e !== STOP) throw e; }
  }, [items, live, calm]);

  // it asks the first question itself once the window is on screen (after its landing)
  useEffect(() => {
    const el = win.current;
    if (!el || !live) return;
    let t = 0;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting || started.current) return;
      io.disconnect();
      t = setTimeout(() => { if (!started.current) ask(0); }, 1000);
    }, { threshold: 0.35 });
    io.observe(el);
    return () => { io.disconnect(); clearTimeout(t); };
  }, [live, ask]);
  useEffect(() => () => { tok.current++; }, []);

  // the window follows the answer as it streams (its own box only, never the page)
  useEffect(() => {
    const box = log.current;
    const m = thread.find((x) => x.n !== undefined);
    const el = m && box?.querySelector(`[data-q="${m.q}"]`);
    if (box && el && live) { const end = top(box, el) + el.offsetHeight - box.clientHeight + 12; if (end > box.scrollTop) box.scrollTop = end; }
  }, [thread, live]);

  // phones: the chosen chip slides into the row's view (the row scrolls, never the page)
  const chips = useRef<HTMLUListElement>(null);
  useEffect(() => {
    const ul = chips.current, li = ul?.children[cur];
    if (!ul || !li || ul.scrollWidth <= ul.clientWidth) return;
    ul.scrollTo({ left: Math.max(0, li.offsetLeft - 16), behavior: calm ? 'auto' : 'smooth' });
  }, [cur, calm]);

  return (
    <div className="v2a-wrap v2a-grid agc">
      <div className="agc-l">
        {head}
        <ul className="agc-chips" ref={chips}>
          {items.map(([qq], q) => (
            <li key={qq} className={'agx-land' + (cur === q ? ' on' : '') + (done.has(q) && live ? ' done' : '')} style={{ '--i': q + 1 }}>
              <button type="button" aria-pressed={cur === q} aria-controls="agc-log" onClick={() => ask(q)}>
                <span className="agc-chip-t">{qq}</span>
                <svg className="agc-chip-i" viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="agc-win agx-land" ref={win} style={{ '--i': 0 }}>
        <div className="agc-bar" aria-hidden="true">
          <span className="agc-dots3"><i /><i /><i /></span>
          <span className="agc-bar-k x-mono">For agents</span>
        </div>
        <div className="agc-log" id="agc-log" ref={log} role="log" aria-labelledby="agt-qa-h" tabIndex={0} data-lenis-prevent>
          {thread.map((m) => {
            const [qq, a] = items[m.q];
            const going = m.n !== undefined;
            return (
              <div key={m.id} className="agc-ex" data-q={m.q}>
                <p className="agc-q"><span>{qq}</span></p>
                <div className={'agc-a' + (m.wait ? ' wait' : '')}>
                  {m.wait ? (
                    <span className="agc-typing" aria-hidden="true"><i /><i /><i /></span>
                  ) : going ? (
                    <p><span className="x-sr">{a}</span><span aria-hidden="true">{a.slice(0, m.n)}<i className="agc-caret" /></span></p>
                  ) : (
                    <p>{a}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
