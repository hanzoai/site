'use client';
/* /desktop signature (MOTION-MAP: `terminal`, Live terminal). The window's own job, run as a terminal: it types each
   command and streams its output, then waits on a blinking prompt; the visitor picks the next command from the row
   under it (or it moves on by itself after a few seconds). Every line is the page's own: the job and the two answers
   from the thread, the limit.go file and the test run the window shows.
   Server HTML and JS off: the whole transcript sits there, legible. Reduced motion: no typing; a pick prints its
   command and output at once. The loop stops off screen and behind the pause control. */
import { useEffect, useRef, useState } from 'react';
import { useInView, useReducedMotion } from 'motion/react';

type Run = { p: string; cmd: string; out: string[]; ok?: string; code?: boolean; short?: string };
type Line = { k: 'c' | 'ok' | 'o'; p?: string; t: string };

const KEEP = 15; // lines kept on screen; older ones scroll off the top

export default function Terminal({ runs, labelledBy }: { runs: Run[]; labelledBy?: string }) {
  const full = runs.flatMap((r): Line[] => [{ k: 'c', p: r.p, t: r.cmd }, ...r.out.map((t): Line => ({ k: r.ok === t ? 'ok' : 'o', t }))]);
  const [hist, setHist] = useState(full);
  const [typing, setTyping] = useState<{ p: string; t: string } | null>(null);
  const [cur, setCur] = useState(-1);
  const [held, setHeld] = useState(false);
  const [want, setWant] = useState<{ i: number; fresh: boolean; n: number } | null>(null);
  const box = useRef<HTMLDivElement>(null);
  const seen = useInView(box, { amount: 0.35 });
  const calm = useReducedMotion();
  const job = useRef(0);

  // coming on screen starts the session from the top; leaving or pausing stops it
  useEffect(() => {
    if (!seen || held || calm) { job.current++; setTyping(null); return; }
    setWant({ i: 0, fresh: true, n: Date.now() });
  }, [seen, held, calm]);

  useEffect(() => {
    if (!want) return;
    const id = ++job.current;
    let t: ReturnType<typeof setTimeout> | undefined;
    const alive = () => id === job.current;
    const wait = (ms: number) => new Promise<void>((r) => { t = setTimeout(r, ms); });
    const push = (l: Line) => setHist((h) => [...h, l].slice(-KEEP));
    const r = runs[want.i];
    (async () => {
      setCur(want.i);
      if (calm) {
        push({ k: 'c', p: r.p, t: r.cmd });
        r.out.forEach((o) => push({ k: r.ok === o ? 'ok' : 'o', t: o }));
        setCur(-1);
        return;
      }
      if (want.fresh) { setHist([]); await wait(300); }
      for (let c = 1; c <= r.cmd.length; c++) { if (!alive()) return; setTyping({ p: r.p, t: r.cmd.slice(0, c) }); await wait(r.p === '>' ? 26 : 42); }
      await wait(260); if (!alive()) return;
      setTyping(null); push({ k: 'c', p: r.p, t: r.cmd });
      for (const o of r.out) { await wait(r.code ? 110 : 520); if (!alive()) return; push({ k: r.ok === o ? 'ok' : 'o', t: o }); }
      setCur(-1);
      await wait(4200); if (!alive()) return;
      const n = (want.i + 1) % runs.length;
      setWant({ i: n, fresh: n === 0, n: Date.now() });
    })();
    return () => { clearTimeout(t); };
  }, [want]); // eslint-disable-line react-hooks/exhaustive-deps

  const pick = (i: number) => { setHeld(false); setWant({ i, fresh: false, n: Date.now() }); };

  return (
    <div className="dk-term" ref={box}>
      <div className="dk-term-bar">
        <span className="dk-lights" aria-hidden="true"><i /><i /><i /></span>
        <span className="dk-term-t x-mono">gateway</span>
        <button type="button" className="dk-term-hold" aria-pressed={held} aria-label={held ? 'Play' : 'Pause'} onClick={() => { setHeld((h) => !h); if (!held) setHist(full); }}>
          {held
            ? <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M5 3.5v9l7-4.5z" fill="currentColor" /></svg>
            : <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M5 3.5v9M11 3.5v9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>}
        </button>
      </div>
      <div className="dk-term-scr x-mono">
        {hist.map((l, i) => (
          <p key={hist.length - i} className={'dk-tl ' + l.k}>{l.k === 'c' && <b aria-hidden="true">{l.p}</b>}{l.t || ' '}</p>
        ))}
        <p className="dk-tl c now" aria-hidden="true"><b>{typing ? typing.p : '$'}</b>{typing ? typing.t : ''}<i className="dk-tcaret" /></p>
      </div>
      <div className="dk-term-pick" role="group" aria-labelledby={labelledBy}>
        {runs.map((r, i) => (
          <button key={r.cmd} type="button" className="x-mono" aria-pressed={cur === i} data-sound="tick" onClick={() => pick(i)}>
            <b aria-hidden="true">{r.p}</b>{r.short || r.cmd}
          </button>
        ))}
      </div>
    </div>
  );
}
