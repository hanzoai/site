'use client';
/* /bot signature, `live-chat`: a live conversation. The visitor picks one of Hanzo's own ten questions and the bot
   answers it on screen in real time, word by word (scripted from the page's FAQ answers; no live call).
   - Server HTML: the first question and its whole answer, plus every question as a button, so JS off reads fine.
   - In the browser, if the window is still below the fold on mount, it empties itself (unseen) and asks the first
     question once it comes into view; after that the visitor drives it. A newer question cancels the answer in flight.
   - Reduced motion: answers appear whole. Keyboard: the questions are buttons, Tab and Enter/Space. */
import type React from 'react';
import { useEffect, useRef, useState } from 'react';
import { useInView } from 'motion/react';
import useCalm from '../../v2/useCalm';
import type { FaceProps } from './types';
import { play } from '../../../lib/sound';
import './Chat.css';

const WORD_MS = 34;
const THINK_MS = 650;

interface ChatProps {
  qa: string[][];
  Face: ({ k, size, id }: FaceProps) => React.JSX.Element;
  bot?: string;
}
export default function Chat({ qa, Face, bot = 'su' }: ChatProps) {
  const box = useRef<HTMLDivElement>(null), log = useRef<HTMLDivElement>(null);
  const seen = useInView(box, { amount: 0.35 });
  const calm = useCalm();
  // turns: [{ q, n }] where n = words of the answer shown so far (Infinity = whole)
  const [turns, setTurns] = useState([{ q: 0, n: Infinity }]);
  const [armed, setArmed] = useState(false); // emptied on mount, waiting to be seen
  const live = turns.length ? turns[turns.length - 1] : null;
  const words = live ? qa[live.q][1].split(' ') : [];
  const busy = live && live.n < words.length;

  useEffect(() => {
    const el = box.current;
    if (!el || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (el.getBoundingClientRect().top > innerHeight * 0.9) { setTurns([]); setArmed(true); }
  }, []);
  useEffect(() => { if (armed && seen) { setArmed(false); ask(0); } }, [armed, seen]); // eslint-disable-line react-hooks/exhaustive-deps

  // stream the newest answer, a word at a time; the first word waits while the bot "thinks"
  useEffect(() => {
    if (!live || !busy) return;
    if (calm) { setTurns((t) => t.map((x, i) => (i === t.length - 1 ? { ...x, n: Infinity } : x))); return; }
    const t = setTimeout(() => {
      setTurns((ts) => ts.map((x, i) => (i === ts.length - 1 ? { ...x, n: x.n + 1 } : x)));
      if (live.n + 1 >= words.length) play('done');
    }, live.n === 0 ? THINK_MS : WORD_MS);
    return () => clearTimeout(t);
  }, [live, busy, calm, words.length]);

  // keep the newest line in view inside the window (never scrolls the page)
  useEffect(() => { const l = log.current; if (l) l.scrollTop = l.scrollHeight; }, [turns]);

  function ask(q: number) {
    setTurns((ts) => {
      const done = ts.map((x) => ({ ...x, n: Infinity }));
      return [...done.filter((x) => x.q !== q), { q, n: calm ? Infinity : 0 }].slice(-3);
    });
  }

  const asked = new Set(turns.map((t) => t.q));
  return (
    <div className="btc" ref={box}>
      <div className="btc-bar">
        <Face k="p" size={28} id={bot} />
        <b>Hanzo Bot</b>
        <span className={'btc-live' + (busy ? ' on' : '')} aria-hidden="true"><i /><i /><i /></span>
      </div>
      <div className="btc-log" ref={log} aria-live="polite">
        {turns.map((t, i) => {
          const w = qa[t.q][1].split(' ');
          const shown = t.n === Infinity ? w : w.slice(0, t.n);
          const last = i === turns.length - 1;
          return (
            <div key={t.q + '-' + i} className="btc-turn">
              <p className="btc-you">{qa[t.q][0]}</p>
              <div className="btc-bot">
                <Face k="p" size={30} id={bot} />
                {shown.length === 0
                  ? <span className="btc-dots" aria-label="Hanzo Bot is answering"><i /><i /><i /></span>
                  : <p className="btc-a">{shown.join(' ')}{last && busy ? <i className="btc-caret" aria-hidden="true" /> : null}</p>}
              </div>
            </div>
          );
        })}
      </div>
      <div className="btc-pick" role="group" aria-label="Ask Hanzo Bot">
        {qa.map(([q], i) => (
          <button key={q} type="button" className={asked.has(i) ? 'was' : ''} aria-pressed={live ? live.q === i : false} onClick={() => ask(i)}>{q}</button>
        ))}
      </div>
    </div>
  );
}
