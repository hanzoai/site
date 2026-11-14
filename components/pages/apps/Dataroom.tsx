'use client';
/* Dataroom (v2, archetype A "Launch"; greys and ink only, JAMES.md 7).
   Persona: a founder raising, or a deal team running diligence, who sends documents to people outside
   Metric: signup_start
   Goal: see what a link can tell you and control after it has gone, then start sharing
   CTA: Try Hanzo -> /login (hero, the site's sticky ask bar at every width, close; data-thumb, data-cta)
   Signature: a link's views ticking in. Beside the title on the first screen, the room after the link has gone:
   Deck.pdf's ten pages in a row running off the right edge, each page's reading time filling as the visitor works
   through it, the camera following them, the page they came back to marked 2×, the visits arriving in a feed (verified
   email, came back) and the views figure ticking up with each one. It pauses on its own button (WCAG 2.2.2) and stops
   off screen.
   Beyond: "Share it ten ways". Switch a link's settings (password, verified email, NDA, expiry, downloads off,
   watermark), type your own email, and meet what the person opening it meets: the gates in order, which you clear one
   by one, then the page with your email printed across it.
   Motion: the reading room (idle, signature) + sticky chapters (scroll) + headlines cut into their line (arrival) +
   files that open into their page (state, BizOpen); the switches and gates answer the hand. Every word and link is Hanzo's.
V2: 8/10 deck scale (h1 52, headings 26, the views figure 64 as the one big thing), the live reading room beside the title at both sizes, five chapters, the folder tree whose files open into their page, one dark room to share it ten ways, plans as a ladder; deck greys, outline-or-raise, no springs, nothing floating, one ask (hero, the site's bar, close)
*/
import type React from 'react';
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { A, More, Cta } from '../../kit';
import { useLive } from '../cloud/Frame';
import { useCalm } from '../../ui';
import BizLines from '../../v2/BizLines';
import BizChapters from '../../v2/BizChapters';
import BizOpen from '../../v2/BizOpen';
import { EASE_OUT_EXPO as EASE } from '../../../lib/motion';
import './Dataroom.css';

const DOCS = 'https://docs.hanzo.ai/docs/cli/dataroom';
const REPO = 'https://github.com/hanzoai/dataroom';
const two = (n: number) => String(n).padStart(2, '0');

const Lock = () => <svg viewBox="0 0 16 16" width="13" height="13" aria-hidden="true"><rect x="3" y="7" width="10" height="7" rx="1.6" fill="none" stroke="currentColor" strokeWidth="1.5" /><path d="M5.5 7V5a2.5 2.5 0 0 1 5 0v2" fill="none" stroke="currentColor" strokeWidth="1.5" /></svg>;
const FileI = () => <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M3.5 1.5h6l3 3v10h-9z M9.5 1.5v3h3" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" /></svg>;
const FolderI = () => <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M1.5 3.5h4.5l1.5 1.5h7v8.5h-13z" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" /></svg>;

/* Deck.pdf, drawn: ten pages of a deck, shapes only (no invented words). Page 7, the chart, is the one read twice. */
const SL = [
  <><circle className="a" cx="18" cy="18" r="5" /><rect className="k" x="16" y="44" width="96" height="12" rx="2" /><rect className="l" x="16" y="62" width="62" height="6" rx="2" /></>,
  <><rect className="k" x="14" y="14" width="56" height="8" rx="2" /><rect className="l" x="14" y="34" width="62" height="5" rx="2" /><rect className="l" x="14" y="45" width="54" height="5" rx="2" /><rect className="l" x="14" y="56" width="58" height="5" rx="2" /><circle className="o" cx="118" cy="54" r="26" /><circle className="a" cx="118" cy="54" r="7" /></>,
  <><rect className="k" x="14" y="12" width="48" height="7" rx="2" /><rect className="f" x="14" y="28" width="132" height="60" rx="4" /><rect className="l" x="20" y="35" width="34" height="46" rx="2" /><rect className="w" x="60" y="35" width="80" height="20" rx="2" /><rect className="w" x="60" y="60" width="80" height="21" rx="2" /></>,
  <><rect className="k" x="14" y="12" width="44" height="7" rx="2" /><circle className="o" cx="50" cy="60" r="28" /><circle className="o" cx="50" cy="68" r="18" /><circle className="a" cx="50" cy="76" r="8" /><rect className="l" x="96" y="44" width="48" height="5" rx="2" /><rect className="l" x="96" y="56" width="38" height="5" rx="2" /><rect className="l" x="96" y="68" width="44" height="5" rx="2" /></>,
  <><rect className="k" x="14" y="12" width="52" height="7" rx="2" /><path className="g" d="M14 86H146" /><polyline className="p" points="14,80 38,76 60,70 84,60 106,46 128,30 146,18" /><circle className="a" cx="146" cy="18" r="4" /></>,
  <><rect className="k" x="14" y="12" width="40" height="7" rx="2" />{[0, 1, 2].map((i) => <g key={i}><rect className="f" x={14 + i * 46} y="30" width="40" height="56" rx="4" /><rect className={i === 1 ? 'a' : 'k'} x={20 + i * 46} y="38" width="20" height="5" rx="2" /><rect className="l" x={20 + i * 46} y="50" width="28" height="4" rx="2" /><rect className="l" x={20 + i * 46} y="58" width="24" height="4" rx="2" /></g>)}</>,
  <><rect className="k" x="14" y="12" width="50" height="7" rx="2" /><path className="g" d="M14 86H146" />{[16, 24, 30, 42, 54, 68].map((h, i) => <rect key={i} className={i === 5 ? 'a' : 'b'} x={20 + i * 21} y={86 - h} width="13" height={h} rx="1.5" />)}</>,
  <><rect className="k" x="14" y="12" width="36" height="7" rx="2" />{[0, 1, 2, 3].map((i) => <g key={i}><circle className="f2" cx={31 + i * 33} cy="46" r="11" /><rect className="l" x={21 + i * 33} y="64" width="20" height="4" rx="2" /><rect className="l" x={24 + i * 33} y="72" width="14" height="4" rx="2" /></g>)}</>,
  <><rect className="k" x="14" y="12" width="56" height="7" rx="2" /><path className="g" d="M80 28V92M30 60H130" /><circle className="l" cx="52" cy="76" r="4" /><circle className="l" cx="62" cy="44" r="4" /><circle className="l" cx="104" cy="78" r="4" /><circle className="a" cx="112" cy="40" r="6" /></>,
  <><rect className="k" x="14" y="12" width="30" height="7" rx="2" /><rect className="k" x="14" y="34" width="84" height="22" rx="3" /><rect className="l" x="14" y="66" width="70" height="5" rx="2" /><rect className="l" x="14" y="77" width="52" height="5" rx="2" /><circle className="a" cx="132" cy="46" r="12" /></>,
];
interface SlideProps {
  n: number;
  className?: string;
}
const Slide = ({ n, className = '' }: SlideProps) => <svg className={'dr-sl ' + className} viewBox="0 0 160 100" aria-hidden="true">{SL[n % 10]}</svg>;

/* The signature: one visit, start to finish, while the room is on screen. Step 0 opens the link, 1–10 read a page each,
   11 comes back to page 7, 12 holds; then the next visit, and the views keep ticking. */
const PAGES = 10;
const READ = [0.62, 0.4, 0.74, 0.52, 0.36, 0.84, 0.94, 0.46, 0.3, 0.2];
const BEAT = [1100, ...READ.map((r) => 560 + r * 900), 2000, 2800];
const BACK = 6;

interface PauseIProps {
  held: boolean;
}
const PauseI = ({ held }: PauseIProps) => (held
  ? <svg viewBox="0 0 12 12" width="12" height="12" aria-hidden="true"><path d="M3 1.5v9l7.5-4.5z" fill="currentColor" /></svg>
  : <svg viewBox="0 0 12 12" width="12" height="12" aria-hidden="true"><path d="M3 1.5h2v9H3zM7 1.5h2v9H7z" fill="currentColor" /></svg>);

interface FeedItem {
  id: string;
  b: string;
  t: string;
  hot?: boolean;
}
function Live() {
  const [ref, seen] = useLive<HTMLDivElement>(0.25);
  const calm = useCalm(); // hydration-safe: false on the server and first paint, then the visitor's setting
  const [held, setHeld] = useState(false);
  const live = seen && !held;
  const [s, setS] = useState(4);
  const [visit, setVisit] = useState(0);
  useEffect(() => { if (calm) setS(12); }, [calm]);
  useEffect(() => {
    if (!live) return;
    const t = setTimeout(() => { if (s >= 12) { setVisit((v) => v + 1); setS(0); } else setS(s + 1); }, BEAT[s]);
    return () => clearTimeout(t);
  }, [s, live]);
  const cur = s >= 1 && s <= PAGES ? s - 1 : s === 11 ? BACK : -1;
  const twice = s >= 11;
  const far = s === 0 ? 0 : Math.min(s, PAGES);
  const views = visit * (PAGES + 1) + far + (twice ? 1 : 0); // page views: one per page read, the re-read too
  const o = s === 0 ? 0 : Math.max(0, Math.min(7, (cur < 0 ? BACK : cur) - 1));
  const visits: (false | FeedItem)[] = [
    twice && { id: 'b' + visit, b: 'came back', t: 're-read page 7', hot: true },
    s >= 1 && { id: 'r' + visit, b: 'page ' + far, t: s <= PAGES ? 'reading now' : 'how far they got' },
    { id: 'o' + visit, b: 'verified email', t: 'opened the link' },
  ];
  const feed = visits.filter((e): e is FeedItem => !!e);
  return (
    <div className="dr-live bz-obj" ref={ref}>
      <div className="dr-live-bar">
        <span className="dr-lock"><Lock /></span>
        <span className="dr-live-url x-mono">dataroom link</span>
        <span className="dr-live-file">Deck.pdf</span>
        <span className="dr-chip"><i aria-hidden="true" />open</span>
        {!calm && <button type="button" className="dr-pause" onClick={() => setHeld(!held)} aria-pressed={held} aria-label={held ? 'Play the room' : 'Pause the room'}><PauseI held={held} /></button>}
      </div>
      <div className="dr-live-top">
        <div className="dr-views">
          <span className="bz-kick">views</span>
          <span className="dr-views-n" aria-live="off">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.b key={views} className="bz-fig" initial={{ y: '70%', opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: '-70%', opacity: 0 }} transition={{ duration: 0.3, ease: EASE }}>{views}</motion.b>
            </AnimatePresence>
          </span>
        </div>
        <ol className="dr-feed" aria-label="Visits">
          <AnimatePresence initial={false} mode="popLayout">
            {feed.map((e) => (
              <motion.li key={e.id} layout="position" className={e.hot ? 'hot' : ''} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, transition: { duration: 0.15 } }} transition={{ duration: 0.3, ease: EASE }}>
                <i aria-hidden="true" /><b>{e.b}</b><span>{e.t}</span>
              </motion.li>
            ))}
          </AnimatePresence>
        </ol>
      </div>
      <div className="dr-strip-k"><span className="bz-kick">Time spent on each page</span><span className="x-mono">how far they got · <b>{far}</b>/{PAGES}</span></div>
      <div className="dr-strip-win">
        <ol className="dr-strip" style={{ '--o': o }} aria-hidden="true">
          {READ.map((r, i) => {
            const fill = i === BACK && twice ? 1 : s >= i + 1 ? r : 0;
            return (
              <li key={i} className={'dr-pg' + (cur === i ? ' now' : '') + (s >= i + 1 ? ' seen' : '') + (i === BACK && twice ? ' twice' : '')}>
                <span className="dr-paper"><Slide n={i} /></span>
                <span className="dr-time"><i style={{ transform: `scaleX(${fill})`, transitionDuration: cur === i ? BEAT[s] + 'ms' : '700ms' }} /></span>
                <span className="dr-pg-n x-mono">{two(i + 1)}</span>
                {i === BACK && <em className="x-mono">2×</em>}
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}

/* Hanzo's picture on this page: the Zen film (its poster first; still under reduced motion). */
function ZenFilm() {
  const calm = useCalm();
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => { const v = ref.current; if (!v) return; if (calm) v.pause(); else v.play?.().catch(() => {}); }, [calm]);
  return (
    <span className="dr-film-m" aria-hidden="true">
      <img src="/models/zen.webp" alt="" width="1200" height="1500" decoding="async" loading="lazy" />
      <video ref={ref} muted loop playsInline preload="metadata" poster="/models/zen.webp" disablePictureInPicture><source src="/models/zen.webm" type="video/webm" /></video>
    </span>
  );
}

function Hero() {
  return (
    <section className="dr-hero" aria-labelledby="dr-h1">
      <div className="bz-wrap bz-grid dr-hero-grid">
        <div className="dr-hero-copy">
          <BizLines as="h1" id="dr-h1" className="bz-display" lines={['Hanzo', 'Dataroom']} now delay={0.05} />
          <p className="dr-tag x-mono">Secure Document Sharing</p>
          <p className="bz-lede">You send a link instead of an attachment, and the link keeps working for you after it leaves.</p>
          <div className="dr-acts">
            <Cta to="/login" id="dataroom.hero" thumb>Try Hanzo</Cta>
            <More to={DOCS}>Documentation</More>
          </div>
        </div>
        <div className="dr-hero-room">
          <Live />
        </div>
      </div>
    </section>
  );
}

/* The chapters: Hanzo's five steps, with the room pinned beside them. */
const STEPS = [
  ['Add the documents', 'A folder tree rather than a single file, shared as one link.'],
  ['Set who may open it', 'A password, a verified email, an NDA to accept, an expiry date, downloads off. Set them per link.'],
  ['Send the link', 'You send a link instead of an attachment, and the link keeps working for you after it leaves.'],
  ['See what they read', 'Time spent on each page, how far they got, and whether they came back.'],
  ['Change your mind', 'Access can change after the link has gone, which an emailed PDF never allowed.'],
];
const TREE: [string, number][] = [['Deck.pdf', 0], ['Financials', 1], ['Legal', 1], ['NDA.pdf', 0]];
const GATES = ['A password', 'A verified email', 'An NDA to accept', 'An expiry date', 'Downloads off'];

function Room({ at }: { at: number }) {
  const on = (i: number) => 'dr-sc' + (at === i ? ' on' : '');
  return (
    <div className="dr-room bz-obj">
      <div className="dr-room-bar">
        <span className="dr-lock"><Lock /></span>
        <span className="dr-room-url x-mono">dataroom link</span>
        <span className="dr-room-n x-mono">{two(at + 1)} / 05</span>
        <span className={'dr-chip' + (at === 4 ? ' off' : '')}><i aria-hidden="true" />{at === 4 ? 'access changed' : 'open'}</span>
      </div>
      <div className="dr-room-body">
        <ul className="dr-tree" aria-hidden="true">
          {TREE.map(([f, dir], i) => <li key={f} className={at === 3 && i === 0 ? 'on' : ''}>{dir ? <FolderI /> : <FileI />}<span>{f}</span></li>)}
        </ul>
        <div className="dr-room-main" aria-hidden="true">
          <div className={on(0) + ' dr-sc-add'}>
            <div className="dr-docs">
              {TREE.map(([f, dir], i) => (
                <span key={f} className="dr-doc" style={{ '--i': i }}>
                  <span className="dr-doc-p">{dir ? <FolderI /> : <Slide n={i ? 9 : 0} />}</span>
                  <em className="x-mono">{f}</em>
                </span>
              ))}
            </div>
            <span className="dr-join" />
            <p className="dr-one"><span className="dr-lock"><Lock /></span><b className="x-mono">dataroom link</b><em>shared as one link</em></p>
          </div>
          <div className={on(1) + ' dr-sc-set'}>
            <ul>{GATES.map((g, i) => <li key={g} style={{ '--i': i }}><span>{g}</span><i className="dr-sw" /></li>)}</ul>
            <p className="x-mono dr-sc-note">Set them per link</p>
          </div>
          <div className={on(2) + ' dr-sc-send'}>
            <p className="dr-att"><FileI /><span>Deck.pdf</span><em className="x-mono">attachment</em></p>
            <div className="dr-msg">
              <span className="dr-lock big"><Lock /></span>
              <span className="dr-msg-t"><b className="x-mono">dataroom link</b><span>Deck.pdf · Financials · Legal · NDA.pdf</span></span>
              <span className="dr-sent x-mono">sent</span>
            </div>
            <p className="x-mono dr-sc-note">a link instead of an attachment</p>
          </div>
          <div className={on(3) + ' dr-sc-read'}>
            <div className="dr-heat">
              {READ.map((r, i) => <span key={i} className={i === BACK ? 'twice' : i > 7 ? 'none' : ''} style={{ '--h': i > 7 ? 0.04 : r, '--i': i }}><i />{i === BACK && <em className="x-mono">2×</em>}<b className="x-mono">{i + 1}</b></span>)}
            </div>
            <div className="dr-heat-k x-mono"><span>how far they got · 8/10</span><span className="hot">came back</span></div>
          </div>
          <div className={on(4) + ' dr-sc-mind'}>
            <div className="dr-pdf"><FileI /><b>Deck.pdf</b><em className="x-mono">an emailed PDF</em></div>
            <div className="dr-link-set">
              <p className="x-mono">dataroom link</p>
              <ul>
                <li><span>An expiry date</span><i className="dr-sw" /></li>
                <li className="flip"><span>Downloads off</span><i className="dr-sw" /></li>
              </ul>
              <p className="dr-after x-mono">after the link has gone</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const FILES = [
  ['Page-by-page analytics', 'Time spent on each page, how far they got, and whether they came back. Which page an investor re-read twice tells you what the next call is about.'],
  ['Data rooms', 'A folder tree rather than a single file, shared as one link. Diligence is forty documents and a hundred questions, and both sides need to know what is in scope.'],
  ['Access controls', 'A password, a verified email, an NDA to accept, an expiry date, downloads off. Set them per link, so the same document can be open to one person and shut to another.'],
  ['Custom Branding', 'White-label with your logo, colors, and custom domain. Present a professional experience to investors.'],
  ['Watermarking', "The viewer's own email printed across every page. It does not make a screenshot impossible; it makes an anonymous one impossible, which is the part that changes behaviour."],
  ['Email verification', 'A code to the address before the document opens. Otherwise a forwarded link is a stranger, and your analytics are counting the wrong person.'],
  ['Custom Domains', 'Use your own domain for sharing links. Build trust with a branded URL.'],
  ['Webhooks', 'A view fires an event. Knowing someone opened the deck while you are still in the thread is worth more than knowing it on Monday.'],
  ['Team Management', 'Multi-tenant workspaces with role-based access. Manage sharing across your organization.'],
  ['SSO Authentication', 'Passkeys, Google, LinkedIn, SAML SSO, and Hanzo IAM single sign-on.'],
];
const SLIDE_OF = [6, 2, 1, 0, 9, 3, 5, 4, 7, 8];

/* The features as the room's own folder tree: every file opens into its page (BizOpen). */
function Files() {
  const items = FILES.map(([t, d], i) => ({
    id: 'dr-f' + i,
    label: t,
    card: (
      <>
        <span className="dr-file-i" aria-hidden="true"><FileI /></span>
        <span className="dr-file-t">{t}</span>
        <span className="dr-file-d">{d}</span>
        <span className="dr-file-n x-mono" aria-hidden="true">{two(i + 1)}</span>
      </>
    ),
    panel: (
      <article className="dr-open">
        <div className="dr-open-copy">
          <h3 className="bz-headline">{t}</h3>
          <p className="dr-tag x-mono">Hanzo Dataroom / {two(i + 1)}</p>
          <p className="bz-lede">{d}</p>
        </div>
        <div className="dr-open-page" aria-hidden="true">
          <Slide n={SLIDE_OF[i]} />
          <span className="dr-wm">{Array.from({ length: 12 }).map((_, k) => <b key={k}>you@example.com</b>)}</span>
        </div>
      </article>
    ),
  }));
  return (
    <section className="bz-sec dr-files" aria-labelledby="dr-files-h">
      <div className="bz-wrap bz-grid">
        <header className="dr-files-head">
          <BizLines id="dr-files-h" className="bz-headline" lines={['Diligence is forty documents', 'and a hundred questions']} />
          <p className="dr-tag x-mono">Data rooms · open a file</p>
        </header>
        <div className="dr-finder bz-obj">
          <div className="dr-finder-bar"><i /><i /><i /><span className="x-mono">Hanzo Dataroom</span><span className="dr-finder-n x-mono">10 files</span></div>
          <p className="dr-finder-root"><FolderI /><span>Hanzo Dataroom</span></p>
          <BizOpen items={items} label="Hanzo Dataroom features" className="dr-tree-list" cardClass="dr-file" />
        </div>
      </div>
    </section>
  );
}

/* Beyond, the one dark room: the link's settings, and what the person opening it meets. */
const SETS = [['password', 'A password'], ['email', 'A verified email'], ['nda', 'An NDA to accept'], ['expiry', 'An expiry date'], ['nodl', 'Downloads off'], ['wm', 'Watermark']];
const GATE: Record<string, [string, string]> = { password: ['Enter the password', 'Unlock'], email: ['Enter the code sent to your email', 'Verify'], nda: ['Accept the NDA', 'Accept'] };

interface GateProps {
  k: string;
  mail: string;
  i: number;
  go: () => void;
}
function Gate({ k, mail, i, go }: GateProps) {
  const [t, b] = GATE[k];
  return (
    <motion.div className={'dr-gate' + (i ? ' back' : '')} style={{ zIndex: 10 - i }} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: i * 14, scale: 1 - i * 0.045 }} exit={{ opacity: 0, x: 120, rotate: 5, transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] } }} transition={{ duration: 0.3, ease: EASE }}>
      <span className="dr-gate-n x-mono">{i + 1}</span>
      <p className="bz-title">{t}</p>
      {k === 'password' && <span className="dr-field x-mono" aria-hidden="true">••••••••••</span>}
      {k === 'email' && <><span className="dr-gate-mail x-mono">{mail}</span><span className="dr-code" aria-hidden="true">{[0, 1, 2, 3, 4, 5].map((c) => <i key={c} />)}</span></>}
      {k === 'nda' && <span className="dr-nda" aria-hidden="true"><i /><i /><i /><i /></span>}
      {i === 0 && <button type="button" className="dr-gate-go" onClick={go}>{b}</button>}
    </motion.div>
  );
}

function Ten() {
  const [on, setOn] = useState<Record<string, boolean>>({ email: true, nda: true, nodl: true, wm: true });
  const [mail, setMail] = useState('');
  const [past, setPast] = useState<string[]>([]);
  const me = mail.trim() || 'you@example.com';
  const flip = (k: string) => { setOn((o) => ({ ...o, [k]: !o[k] })); if (GATE[k]) setPast([]); };
  const gates = ['password', 'email', 'nda'].filter((k) => on[k] && !past.includes(k));
  const any = ['password', 'email', 'nda'].some((k) => on[k]);
  return (
    <section className="bz-sec dr-ten" data-room="dark" aria-labelledby="dr-ten-h">
      <div className="bz-wrap bz-grid">
        <div className="dr-ten-copy">
          <BizLines id="dr-ten-h" className="bz-headline" lines={['A link you still control']} />
          <p className="dr-tag x-mono">Share it ten ways</p>
          <p className="bz-lede">Every setting here is per link, so one document can be shared ten different ways.</p>
          <div className="dr-sets" role="group" aria-label="This link's settings">
            {SETS.map(([k, t]) => (
              <button key={k} type="button" role="switch" aria-checked={!!on[k]} onClick={() => flip(k)}><i aria-hidden="true" />{t}</button>
            ))}
          </div>
          <label className="dr-mail">
            <span className="bz-kick">Your email</span>
            <input type="email" value={mail} placeholder="you@example.com" onChange={(e) => setMail(e.target.value.slice(0, 40))} autoComplete="off" spellCheck="false" />
          </label>
        </div>
        <div className="dr-viewer bz-obj">
          <div className="dr-viewer-bar">
            <span className="dr-lock"><Lock /></span>
            <span className="x-mono">dataroom link</span>
            <span className="dr-viewer-k x-mono">what they meet when they open it</span>
          </div>
          <div className="dr-viewer-body">
            <div className={'dr-doc-page' + (gates.length ? ' shut' : '')}>
              <Slide n={6} />
              {on.wm && <span className="dr-wm" aria-hidden="true">{Array.from({ length: 14 }).map((_, k) => <b key={k}>{me}</b>)}</span>}
            </div>
            <AnimatePresence initial={false}>
              {gates.map((k, i) => <Gate key={k} k={k} i={i} mail={me} go={() => setPast((p) => [...p, k])} />)}
            </AnimatePresence>
          </div>
          <div className="dr-viewer-foot x-mono">
            <span>{!any ? 'Opens straight away' : gates.length ? `${gates.length} to clear before the page` : <button type="button" className="dr-again" onClick={() => setPast([])}>Open it again</button>}</span>
            <span className={on.expiry ? 'on' : ''}>{on.expiry ? 'expires on the date you set' : 'no expiry'}</span>
            <span className={'dr-dl' + (on.nodl ? ' off' : '')}>{on.nodl ? 'downloads off' : 'Download'}</span>
          </div>
        </div>
      </div>
    </section>
  );
}

/* a plan: name, price, blurb, [call to action, link], features */
type Plan = [string, string, string, [string, string], string[]];
const PLANS: Plan[] = [
  ['Free', '$0', 'Get started with document sharing and analytics.', ['Get on GitHub', 'https://github.com/hanzoai/'], ['1 team member', '50 links', '50 documents', 'Unlimited visitors', 'Page-by-page analytics', 'Community support']],
  ['Pro', '$25', 'For professionals who need branding and more capacity.', ['Contact Sales', '/contact-sales'], ['Unlimited links', '100 documents', 'Large file uploads', 'Custom branding', 'Video support', 'Folder organization']],
  ['Business', '$59', 'For teams that need custom domains and advanced access controls.', ['Contact Sales', '/contact-sales'], ['Everything in Pro', '3 team members', '1,000 documents', 'Custom domain', 'Email verification', 'Allow/block lists', 'Screenshot protection', 'Webhooks']],
  ['Data Rooms', '$99', 'Full data room capabilities for fundraising and due diligence.', ['Contact Sales', '/contact-sales'], ['Everything in Business', 'Unlimited data rooms', 'Data room analytics', 'NDA agreements', 'Dynamic watermark', 'Granular permissions', 'Custom data room domain', '24/7 email support']],
];

/* Plans as one panel that changes: the four rungs are tabs (name and price), the panel shows the chosen plan's words,
   its list and its door. In view it walks the ladder once by itself and rests on Most Popular; a hand takes over.
   Every plan's words stay in the page (inactive panels are hidden, not removed). Reduced motion: no walk. */
function Plans() {
  const [at, setAt] = useState(0);
  const mine = useRef(false);
  const [ref, live] = useLive<HTMLDivElement>(0.45);
  useEffect(() => {
    if (!live || mine.current) return undefined;
    const ts = [1, 2, 3, 2].map((k, i) => setTimeout(() => { if (!mine.current) setAt(k); }, 1400 + i * 1700));
    return () => ts.forEach(clearTimeout);
  }, [live]);
  const pick = (i: number) => { mine.current = true; setAt(i); };
  const key = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const d = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
    if (!d) return;
    e.preventDefault();
    const n = (at + d + PLANS.length) % PLANS.length;
    pick(n);
    document.getElementById('dr-plan-t' + n)?.focus();
  };
  return (
    <section className="bz-sec dr-plans" aria-labelledby="dr-plans-h">
      <div className="bz-wrap bz-grid dr-ladder">
        <header className="dr-plans-head">
          <h2 id="dr-plans-h" className="bz-headline">Simple, Transparent Pricing</h2>
          <p className="bz-body">Start free and scale as you grow. Self-host for free forever or let us handle the infrastructure.</p>
        </header>
        <div className="dr-plan bz-obj" ref={ref} onPointerDown={() => { mine.current = true; }}>
          <div className="dr-plan-tabs" role="tablist" aria-label="Plans" onKeyDown={key}>
            {PLANS.map(([t, p], i) => (
              <button key={t} id={'dr-plan-t' + i} type="button" role="tab" aria-selected={at === i} aria-controls={'dr-plan-p' + i} tabIndex={at === i ? 0 : -1} className={'dr-plan-tab' + (i === 2 ? ' pop' : '')} onClick={() => pick(i)} style={{ '--i': i }}>
                <span className="dr-plan-step" aria-hidden="true" />
                <span className="x-mono">{two(i + 1)}</span>
                <b>{t}</b>
                <em>{p}<span>/mo</span></em>
              </button>
            ))}
          </div>
          <div className="dr-plan-body">
            {PLANS.map(([t, p, d, [cta, to], li], i) => (
              <div key={t} id={'dr-plan-p' + i} role="tabpanel" aria-labelledby={'dr-plan-t' + i} hidden={at !== i} className="dr-plan-p">
                <p className="dr-rung-k">{i === 2 && <span className="dr-popular x-mono">Most Popular</span>}<span className="x-mono">{two(i + 1)} / 04</span></p>
                <h3 className="bz-title">{t}</h3>
                <p className="dr-price"><b className="bz-fig">{p}</b><span>/mo</span></p>
                <p className="dr-rung-d">{d}</p>
                <ul>{li.map((x, k) => <li key={x} style={{ '--k': k }}>{x}</li>)}</ul>
                <More to={to}>{cta}</More>
              </div>
            ))}
          </div>
        </div>
        <div className="dr-oss">
          <div className="dr-oss-copy">
            <h3 className="bz-title">Built on Open Source</h3>
            <p className="bz-body">Hanzo Dataroom is built on <A to="https://www.papermark.io">Papermark</A>, the open-source DocSend alternative. We contribute back to the community and extend it with Hanzo IAM integration, multi-tenant workspaces, and enterprise features.</p>
          </div>
          {/* the two repositories, upstream feeding ours and ours sending work back along the same line */}
          <div className="dr-repos">
            <A to="https://github.com/mfts/papermark" className="dr-repo up"><span className="dr-repo-i"><Gh /></span><span className="dr-repo-n x-mono">Upstream: mfts/papermark</span><Arrow /></A>
            <span className="dr-repo-line" aria-hidden="true"><i /><i /></span>
            <A to={REPO} className="dr-repo"><span className="dr-repo-i"><Gh /></span><span className="dr-repo-n x-mono">hanzoai/dataroom</span><Arrow /></A>
          </div>
        </div>
      </div>
    </section>
  );
}

const Gh = () => <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor" aria-hidden="true"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" /></svg>;

/* The close: one sentence at Display size, the same solid ask, and full-width text rows for every other door (the
   site's ask bar steps aside while this data-thumb button is on screen, so one solid button shows at a time). */
const Arrow = () => <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>;
const DOORS = [
  [DOCS, 'Documentation', 'Explore our guides and API references', 'View Docs'],
  [REPO, 'For Developers', 'Integrate document sharing into your apps', 'View on GitHub'],
  ['/contact-sales', 'Need a Custom Solution?', 'Our team can help you design a tailored data room setup for your fundraising or due diligence needs.', 'Contact Sales'],
];

/* The close, in Hanzo's order: the sentence and the one solid ask (Start Sharing), the three doors as rows, then how to
   start: the docs and the repository, and the repository itself, ready to deploy. */
function End() {
  return (
    <section className="bz-sec dr-end" aria-labelledby="dr-end-h">
      <div className="bz-wrap">
        <div className="dr-end-top">
          <div className="dr-end-main">
            <BizLines id="dr-end-h" className="bz-display md" lines={['Upload one document', 'and send the link']} />
            <p className="bz-lede">You will know whether it was read before you have to ask.</p>
          </div>
          <div className="dr-end-go">
            <h3 className="dr-end-k">Start Sharing</h3>
            <p className="dr-end-d">Share documents with real-time analytics</p>
            <Cta to="/login" id="dataroom.close" size="lg" thumb>Try Hanzo</Cta>
          </div>
        </div>
        <ul className="dr-rows">
          {DOORS.map(([to, t, d, a]) => (
            <li key={t}><A to={to} className="dr-row"><h3>{t}</h3><p>{d}</p><span className="dr-row-a">{a}</span><Arrow /></A></li>
          ))}
        </ul>
        <div className="dr-start">
          <div className="dr-start-l">
            <h2 className="bz-headline">Get started with Dataroom</h2>
            <div className="dr-start-links"><More to={DOCS}>Read the docs</More><More to={REPO}>View on GitHub</More></div>
          </div>
          <div className="dr-get bz-obj">
            <h2 className="dr-get-h">Get Dataroom</h2>
            <p className="dr-get-d">Secure data room</p>
            <p className="dr-get-meta"><span className="dr-lic x-mono"><span>License:</span> AGPL-3.0</span><A to={REPO} className="dr-get-repo x-mono"><Gh /><span>hanzoai/dataroom</span></A><span className="dr-stars">3 stars</span></p>
            <Cta to="https://platform.hanzo.ai/deploy" kind="quiet" id="dataroom.deploy" className="dr-deploy">Deploy to Cloud</Cta>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Dataroom() {
  return (
    <main className="bz dr">
      <span data-ask-name="Hanzo Dataroom" hidden />
      <Hero />
      <BizChapters label="A link, shared" className="dr-ch" items={STEPS.map(([t, d]) => ({ t, d }))} stage={(at) => <Room at={at} />}>
        <header className="bz-wrap dr-ch-head">
          <div className="dr-film">
            <BizLines className="bz-headline" lines={['A link, shared']} />
            <ZenFilm />
          </div>
        </header>
      </BizChapters>
      <Files />
      <Ten />
      <Plans />
      <End />
    </main>
  );
}
