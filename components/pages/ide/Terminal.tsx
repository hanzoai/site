'use client';
/* The /ide live terminal (map signature `terminal`). It runs Hanzo's own start script from this page, command by
   command, and prints what each tool really prints (git's clone line, npm's script echo, Tauri's BeforeDevCommand and
   Vite's address from hanzoai/ide's package.json and tauri.conf.json; nothing invented, no counts). The visitor picks
   the next command from the choices under the prompt (pointer, touch or keyboard); left alone it picks them itself.
   Server HTML and the first client paint are the finished session; once it is on screen it clears and runs live.
   Reduced motion keeps the finished session and a pick prints at once. The transcript sits in fixed rows that never
   move (no layout shift): text only appears in them. */
import { useEffect, useRef, useState } from 'react';
import { useInView } from 'motion/react';
import A2Pause from '../../v2/A2Pause';

const STEPS = [
  { note: '# Open it in the browser', cmd: 'open https://ide.hanzo.ai', out: [] },
  { note: '# Or build the desktop app from source', cmd: 'git clone https://github.com/hanzoai/ide.git', out: ["Cloning into 'ide'..."] },
  { cmd: 'cd ide', out: [], cwd: '~/ide' },
  { cmd: 'npm install', out: [], wait: 1700 },
  { cmd: 'npm run tauri:dev', out: ['> tauri dev', 'Running BeforeDevCommand (`npm run dev`)', 'Local:   http://localhost:5180/'], after: '# First launch: pick a provider, paste a key, choose a model.' },
];
const ALL = [0, 1, 2, 3, 4];
const ROWS = 13;
const next = (ran) => {
  if (!ran.length) return [0, 1];
  const l = ran[ran.length - 1];
  return l === 4 ? ['clear'] : [l + 1];
};
const cwdAfter = (ran) => (ran.some((i) => STEPS[i].cwd) ? '~/ide' : '~');

function rows(ran, cur) {
  const out = [];
  const push = (ran2, i, typed, o, live) => {
    const s = STEPS[i];
    if (s.note) out.push({ k: 'c', t: s.note });
    out.push({ k: 'p', cwd: cwdAfter(ran2), t: typed, spin: live && typed === s.cmd && o < 0 && s.wait });
    s.out.slice(0, o < 0 ? 0 : o).forEach((t) => out.push({ k: 'o', t }));
    if (s.after && o >= s.out.length) out.push({ k: 'c', t: s.after });
  };
  ran.forEach((i, n) => push(ran.slice(0, n), i, STEPS[i].cmd, STEPS[i].out.length, false));
  if (cur) push(ran, cur.i, STEPS[cur.i].cmd.slice(0, cur.c), cur.o, true);
  else out.push({ k: 'p', cwd: cwdAfter(ran), t: '', caret: true });
  if (cur) out[out.length - 1].caret = cur.o < 0;
  return out;
}

export default function Terminal({ tools }) {
  const box = useRef(null);
  const scroller = useRef(null);
  const seen = useInView(box, { amount: 0.35 });
  const [ran, setRan] = useState(ALL); // the finished session is the server picture
  const [cur, setCur] = useState(null);
  const [paused, setPaused] = useState(false);
  const [auto, setAuto] = useState(false);
  const calm = useRef(false);
  const touched = useRef(0);
  const started = useRef(false);

  useEffect(() => { calm.current = matchMedia('(prefers-reduced-motion: reduce)').matches; }, []);
  // first time on screen: clear and run it live (reduced motion keeps the finished session)
  useEffect(() => {
    if (!seen || started.current || calm.current) return;
    started.current = true;
    setRan([]); setAuto(true);
  }, [seen]);

  // the running step: type the command, wait for it, stream its output
  useEffect(() => {
    if (!cur || paused) return undefined;
    const s = STEPS[cur.i];
    let h;
    if (cur.c < s.cmd.length) h = setTimeout(() => setCur({ ...cur, c: cur.c + 1 }), 30 + ((cur.c * 7) % 5) * 9);
    else if (cur.o < 0) h = setTimeout(() => setCur({ ...cur, o: 0 }), s.wait || 280);
    else if (cur.o < s.out.length) h = setTimeout(() => setCur({ ...cur, o: cur.o + 1 }), 200);
    else h = setTimeout(() => { setRan((r) => [...r, cur.i]); setCur(null); }, 160);
    return () => clearTimeout(h);
  }, [cur, paused]);

  const pick = (x) => {
    if (x === 'clear') { setRan([]); setCur(null); return; }
    if (calm.current) { setRan((r) => [...r, x]); return; }
    setCur({ i: x, c: 0, o: -1 });
  };
  const choose = (x) => { touched.current = Date.now(); started.current = true; setAuto(true); pick(x); };

  // left alone, it picks the first choice itself (longer after the visitor chose, so the choice stays theirs)
  useEffect(() => {
    if (!auto || cur || paused || !seen || calm.current) return undefined;
    const c = next(ran)[0];
    const wait = c === 'clear' ? 5200 : Date.now() - touched.current < 6000 ? 3600 : ran.length ? 1300 : 700;
    const h = setTimeout(() => pick(c), wait);
    return () => clearTimeout(h);
  }, [auto, cur, paused, seen, ran]);

  // keep the newest row in view when the session is taller than the window (phones)
  useEffect(() => {
    const s = scroller.current;
    if (s && s.scrollHeight > s.clientHeight) s.scrollTop = s.scrollHeight;
  }, [ran, cur]);

  const list = rows(ran, cur);
  const choices = cur ? next([...ran, cur.i]) : next(ran);
  const slots = [choices[0], choices[1]];
  return (
    <div className={'ide-term' + (paused ? ' a2-paused' : '')} ref={box}>
      <div className="ide-term-bar">
        <span className="x-mono">bash</span>
        <span className="ide-term-tools"><A2Pause paused={paused} onChange={setPaused} label="Pause" className="ide-term-pause" />{tools}</span>
      </div>
      <div className="ide-term-out" ref={scroller}>
        <pre className="x-mono">{Array.from({ length: Math.max(ROWS, list.length) }).map((_, n) => {
          const r = list[n];
          if (!r) return <span key={n} className="ide-tl"> </span>;
          if (r.k === 'c') return <span key={n} className="ide-tl c">{r.t}</span>;
          if (r.k === 'o') return <span key={n} className="ide-tl o">{r.t}</span>;
          return <span key={n} className="ide-tl p"><span className="ide-cwd">{r.cwd} $</span> {r.t}{r.spin ? <i className="ide-spin" aria-hidden="true" /> : null}{r.caret ? <i className="ide-caret" aria-hidden="true" /> : null}</span>;
        })}</pre>
      </div>
      <div className="ide-term-next" role="group" aria-label="Next command">
        {slots.map((x, n) => (
          <button key={n} type="button" className={'ide-pick x-mono' + (x === undefined ? ' gone' : '')} disabled={x === undefined || !!cur} tabIndex={x === undefined ? -1 : undefined} aria-hidden={x === undefined ? true : undefined} onClick={() => x !== undefined && choose(x)}>
            <span aria-hidden="true">$</span> {x === undefined ? STEPS[0].cmd : x === 'clear' ? 'clear' : STEPS[x].cmd}
          </button>
        ))}
      </div>
    </div>
  );
}
