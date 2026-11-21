'use client';
// Signature: One button that knows your OS sits at the centre of a four-quadrant dial, and every other build fans out of it onto the orbit, grouped by product; point at one and a ray runs from your button to it while the centre reads its file and size
// Beyond: Your kit: the page already guessed your system and browser; confirm them and your editor, and it lists exactly your files across Desktop, CLI, Dev, Bot, Team, IDE, browser, and editor
// Persona: someone who already chose Hanzo and wants the right file for their machine, fast
// Goal: get the build for this system in one click, or any other build in two
// CTA: "Download for <your system>": the hero's one solid with data-thumb, repeated by the closing band
// Metric: build_download (data-cta download-main, download-main-end)
/* Download Hanzo (Utility: calm, precise, fast; one delight, the fan-out).
   V2: 8/10 round 2: deck scale (h1 52); no labels over headlines; h1, lede, the one ask and the whole dial fit 1470×801; the centre reads the build you point at instead of a floating tooltip; product cards show Hanzo's own lines instead of placeholder bars; one solid per screen, one closing band; no springs, no glow loop; the black room opens from a card; JS-off legible; 44px phone targets
   Motion: the one delight = the fan-out from the button (CSS, plays once) and the ray. Supporting: segmented pickers
   that glide (layoutId), magnetic ask, line-masked headline (components/v2/x-edison/AppLines).
   Greys only. Every word, size and link is Hanzo's. */
import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import type { Dispatch, ElementType, RefObject, SetStateAction } from 'react';
import { motion, useInView, useReducedMotion } from 'motion/react';
import type { Transition } from 'motion/react';
import { Copy, Magnetic, Mark } from '../ui';
import { A, Cta, Img } from '../kit';
import { DESKTOP_API, DESKTOP_FALLBACK, fromRelease } from '../../lib/desktop';
import type { Build, Desktop } from '../../lib/desktop';
import '../v2/AppType.css';
import './DownloadPage.css';

const GH = 'https://github.com/hanzoai/';
// a Build's path is under github.com/hanzoai/. `term`: it runs in a terminal, so it sits under For developers (issue 318)
interface Product { k: string; name: string; v: string; to?: string; d: string; cmds?: string[]; all?: string; term?: boolean; builds: Build[] }
type Os = 'mac' | 'linux' | 'linuxarm' | 'win';
/* a build the dial points at (the tour or the pointer), with where its chip sits */
interface Spot { x: number; y: number; p: Product; b: Build; tour?: boolean }

const PRODUCTS: Product[] = [
  {
    k: 'desk', name: 'Hanzo Desktop', v: DESKTOP_FALLBACK.v, to: '/desktop',
    d: 'The Hanzo app on your computer: Chat, Dev, Studio and your agents in one window, and a hotkey that brings Hanzo to whatever you are doing. Install it like any other app, open it, and sign in. No terminal. Start here if you are not sure which one you need.',
    all: GH + 'desktop/releases/latest',
    builds: DESKTOP_FALLBACK.builds, // replaced by the latest release, at build time and again in the browser
  },
  {
    k: 'cli', name: 'Hanzo CLI', v: 'v8.5.930', to: '/cli', term: true,
    d: 'For developers. The hanzo command for your terminal. Run it in a project and it opens Hanzo Dev, the coding agent (hanzo and hanzo dev are the same session); hanzo auth login, hanzo billing and the rest drive your account and every Hanzo cloud product from scripts. Desktop does not need it.',
    cmds: ['curl -fsSL hanzo.sh | sh', 'irm hanzo.sh/install.ps1 | iex', 'npm i -g hanzo'],
    all: GH + 'cli/releases/latest',
    builds: [
      ['macOS (Apple Silicon)', '7.4 MB', 'cli/releases/latest/download/hanzo-darwin-arm64.tar.gz'],
      ['macOS (Intel)', '7.7 MB', 'cli/releases/latest/download/hanzo-darwin-amd64.tar.gz'],
      ['Windows', '7.1 MB', 'cli/releases/latest/download/hanzo-windows-amd64.tar.gz'],
      ['Linux (x86_64)', '7.3 MB', 'cli/releases/latest/download/hanzo-linux-amd64.tar.gz'],
      ['Linux (arm64)', '6.9 MB', 'cli/releases/latest/download/hanzo-linux-arm64.tar.gz'],
    ],
  },
  {
    k: 'ext', name: 'Browser extension', v: 'v1.9.31', to: '/extension',
    d: 'Ask Hanzo about the page you are on. It reads the tab for context, captures what you select, and runs agents from the toolbar. It installs in your browser; no terminal.',
    all: GH + 'extension/releases/latest',
    builds: [
      ['Chrome', '976 KB', 'extension/releases/download/v1.9.31/hanzo-ai-chrome-v1.9.31.zip'],
      ['Firefox', '956 KB', 'extension/releases/download/v1.9.31/hanzo-ai-firefox-v1.9.31.zip'],
      ['Safari', '310 KB', 'extension/releases/download/v1.9.31/hanzo-ai-safari-v1.9.31.zip'],
      ['Edge', '976 KB', 'extension/releases/download/v1.9.31/hanzo-ai-edge-v1.9.31.zip'],
    ],
  },
  {
    k: 'ed', name: 'Editors', v: 'v1.9.31',
    d: 'Completions, chat and agentic edits where you already write code. One extension, every editor that takes one: install the file from your editor’s extensions menu.',
    all: GH + 'extension/releases/latest',
    builds: [
      ['VS Code', '1.5 MB', 'extension/releases/download/v1.9.31/hanzo-ai-vscode-v1.9.31.vsix'],
      ['Cursor', '1.5 MB', 'extension/releases/download/v1.9.31/hanzo-ai-cursor-v1.9.31.vsix'],
      ['Windsurf', '1.5 MB', 'extension/releases/download/v1.9.31/hanzo-ai-windsurf-v1.9.31.vsix'],
      ['Antigravity', '1.5 MB', 'extension/releases/download/v1.9.31/hanzo-ai-antigravity-v1.9.31.vsix'],
      ['JetBrains', '3.1 MB', 'extension/releases/download/v1.9.31/hanzo-ai-jetbrains-v1.9.31.zip'],
    ],
  },
  {
    k: 'ide', name: 'Hanzo IDE', v: 'v0.1.0', to: '/ide',
    d: 'The native AI-first workspace built around repositories, agent diffs, inline reviews, and integrated terminal tools.',
    all: GH + 'ide/releases/latest',
    builds: [
      ['Windows', '35 MB', 'ide/releases/download/v0.1.0/Hanzo_IDE_0.1.0_x64-setup.exe'],
    ],
  },
  {
    k: 'dev', name: 'Hanzo Dev', v: 'v0.7.23', to: '/dev', term: true,
    d: 'For developers. Hanzo Dev, the coding agent, on its own: the dev command (hanzo-dev is the same file). It is the agent hanzo dev starts, so with the Hanzo CLI you already have it. Without installing anything, Dev is a tab in the Hanzo app.',
    cmds: ['curl -fsSL hanzo.sh | sh', 'npm i -g @hanzo/dev'],
    all: GH + 'dev/releases/latest',
    builds: [
      ['macOS (Apple Silicon)', '106 MB', 'dev/releases/latest/download/dev-darwin-arm64.tar.gz'],
      ['macOS (Intel)', '112 MB', 'dev/releases/latest/download/dev-darwin-amd64.tar.gz'],
      ['Windows', '122 MB', 'dev/releases/latest/download/dev-windows-amd64.tar.gz'],
      ['Linux (x86_64)', '118 MB', 'dev/releases/latest/download/dev-linux-amd64.tar.gz'],
      ['Linux (arm64)', '112 MB', 'dev/releases/latest/download/dev-linux-arm64.tar.gz'],
    ],
  },
  {
    k: 'bot', name: 'Hanzo Bot', v: 'v2026.6.7', to: '/bot', term: true,
    d: 'For developers. A gateway you run yourself that puts Hanzo agents in Slack, Discord, Telegram and WhatsApp. To use bots without installing anything, open hanzo.bot.',
    cmds: ['npm i -g @hanzo/bot'],
    all: GH + 'bot/releases/latest',
    builds: [
      ['Windows', '3.5 MB', 'bot/releases/download/v2026.6.7/Hanzo_Bot_2026.6.7_x64-setup.exe'],
    ],
  },
  {
    k: 'team', name: 'Hanzo Team', v: 'v1.0.0', to: '/team',
    d: 'A shared workspace where your team and its agents coordinate tasks, repositories, approvals and live status. This is the Windows app; on any system it is at hanzo.team in your browser.',
    all: GH + 'team/releases/latest',
    builds: [
      ['Windows', '17 MB', 'team/releases/download/v1.0.0/Hanzo_Team_1.0.0_x64-setup.exe'],
    ],
  },
  {
    k: 'forge', name: 'Hanzo Forge', v: 'v1.0.0', to: 'https://hanzo.codes', term: true,
    d: 'For developers. The self-hostable Git forge, code review, CI pipelines and package registry behind hanzo.codes. You only need it to run your own.',
    all: GH + 'forge/releases/latest',
    builds: [
      ['Windows (Archive)', '70 MB', 'forge/releases/download/v1.0.0/forge-windows-amd64.tar.gz'],
      ['Windows (Binary)', '160 MB', 'forge/releases/download/v1.0.0/hanzo-forge.exe'],
    ],
  },
  {
    k: 'node', name: 'Hanzo Node', v: 'v0.2.5', to: '/node', term: true,
    d: 'For operators. hanzod, the network daemon: it connects your GPUs, inference and agent identity to the Hanzo network.',
    all: GH + 'node/releases/latest',
    builds: [
      ['macOS (Apple Silicon)', '2.7 MB', 'node/releases/latest/download/hanzod-darwin-arm64.tar.gz'],
      ['macOS (Intel)', '2.8 MB', 'node/releases/latest/download/hanzod-darwin-amd64.tar.gz'],
      ['Windows', '2.7 MB', 'node/releases/latest/download/hanzod-windows-amd64.tar.gz'],
      ['Linux (x86_64)', '2.8 MB', 'node/releases/latest/download/hanzod-linux-amd64.tar.gz'],
      ['Linux (arm64)', '2.8 MB', 'node/releases/latest/download/hanzod-linux-arm64.tar.gz'],
    ],
  },
];
const FILE = (p: string) => p.split('/').pop();
const BY = (ps: Product[], k: string) => ps.find((p) => p.k === k)!;
// The page's products, with Desktop's builds from its latest release and the tools' latest tags (DownloadPage)
const Products = createContext<Product[]>(PRODUCTS);
const useProducts = () => useContext(Products);
const GLIDE: Transition = { duration: 0.3, ease: [0.16, 1, 0.3, 1] };

/* Which build is yours. Desktop ships natively for macOS, Windows, and Linux. */
function useSystem() {
  const [s, setS] = useState<{ os: Os; br: number; phone: boolean }>({ os: 'mac', br: 0, phone: false }); // the page ships with macOS, as hanzo.ai does
  useEffect(() => {
    const nav: Navigator & { userAgentData?: { platform?: string; mobile?: boolean } } = navigator; // userAgentData is in no DOM typing yet
    const p = ((nav.userAgentData
 && nav.userAgentData.platform) || navigator.platform || navigator.userAgent || '').toLowerCase();
    const ua = navigator.userAgent;
    const l = ua.toLowerCase();
    const os: Os = /win/.test(p) ? 'win' : /linux|x11/.test(p) && !/android/.test(l) ? (/aarch64|arm/.test(l) ? 'linuxarm' : 'linux') : 'mac';
    const br = /Edg\//.test(ua) ? 3 : /Firefox|FxiOS/.test(ua) ? 1 : /Safari/.test(ua) && !/Chrome|Chromium|CriOS|Edg/.test(ua) ? 2 : 0;
    // a phone has no Desktop build: the button opens the app in the browser instead (hanzo.app/app said so, and
    // sends its visitors here now, hanzo-inc/app#320)
    const phone = !!(nav.userAgentData && nav.userAgentData.mobile) || /android|iphone|ipod|mobile/.test(l);
    setS({ os, br, phone });
  }, []);
  return s;
}
// [label, product, build] of the one button; and which rows below are yours
const MAIN: Record<Os, [string, number, number]> = { mac: ['macOS', 0, 0], linux: ['Linux', 0, 2], linuxarm: ['Linux', 0, 4], win: ['Windows', 0, 1] };
const MINE: Record<Os, Partial<Record<string, number[]>>> = {
  mac: { desk: [0], cli: [0, 1], dev: [0, 1], node: [0, 1] },
  linux: { desk: [2, 3], cli: [3], dev: [3], node: [3] },
  linuxarm: { desk: [4], cli: [4], dev: [4], node: [4] },
  win: { desk: [1, 5], cli: [2], ide: [0], dev: [2], bot: [0], team: [0], forge: [0, 1], node: [2] },
};

const Glyph = ({ k }: { k: string }) => (
  <svg viewBox="0 0 16 16" width="15" height="15" aria-hidden="true">
    {k === 'desk' && <><rect x="1.5" y="2.5" width="13" height="9" rx="1.6" fill="none" stroke="currentColor" strokeWidth="1.3" /><path d="M5.5 14h5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /></>}
    {k === 'cli' && <><rect x="1.5" y="2.5" width="13" height="11" rx="1.6" fill="none" stroke="currentColor" strokeWidth="1.3" /><path d="m4.5 6.5 2 1.5-2 1.5M8 10h3.5" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" /></>}
    {k === 'ext' && <path d="M6 2.5h4v2a1.2 1.2 0 1 0 2.4 0v-.5h1.1v4h-.5a1.2 1.2 0 1 0 0 2.4h.5v3.1H2.5V3.5H6z" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />}
    {k === 'ed' && <path d="m5.5 4.5-3.5 3.5 3.5 3.5M10.5 4.5 14 8l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />}
  </svg>
);
const Down = ({ s = 16 }) => <svg viewBox="0 0 16 16" width={s} height={s} aria-hidden="true"><path d="M8 2.5v8M4.5 7 8 10.5 11.5 7M3 13.5h10" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>;

/* ---------- the dial: the one button, and every other build fanned out around it by product ---------- */
// the arc each product's builds sit on (degrees, clockwise from 3 o'clock): Desktop top-left, CLI top-right, extension
// bottom-right, editors bottom-left; spaced so no two chips touch in the 1152 px container whichever build is the main one
const DIAL = 4; // the first four products sit on the dial
const ARC = [[182, 249], [271, 358], [17, 74], [103, 163]];
const RX = 44, RY = 41;
const r2 = (n: number) => Math.round(n * 100) / 100; // rounded: server and browser print the same style

/* Headline lines rise out of their own masks. The server and the first render show the lines in place (JS off and
   reduced motion keep them there, and nothing differs at hydration); the hero plays from first paint in CSS (.js), the
   rest when half in view. */
function Lines({ lines, as: Tag = 'h2', className = '', now = false, delay = 0, id }: { lines: string[]; as?: ElementType; className?: string; now?: boolean; delay?: number; id?: string }) {
  const ref = useRef<HTMLElement>(null);
  const calm = useReducedMotion();
  useEffect(() => {
    const el = ref.current;
    if (!el || calm || now) return;
    if (el.getBoundingClientRect().top < innerHeight * 0.8) return;
    el.dataset.rise = 'pre';
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { io.disconnect(); el.dataset.rise = 'go'; } }, { threshold: 0.5 });
    io.observe(el);
    return () => io.disconnect();
  }, [calm, now]);
  return (
    <Tag ref={ref} id={id} className={className} style={{ '--d': delay + 's' }} data-now={now ? '' : undefined}>
      {lines.map((l, i) => <span key={i} className="dl-ln"><span style={{ '--i': i }}>{l}{i < lines.length - 1 ? ' ' : ''}</span></span>)}
    </Tag>
  );
}

/* At rest the centre reads through the builds by itself (the ray sweeping to each in turn, as pointing does), so the
   first screen stays alive and shows what pointing does. It rests while the pointer is over the dial, and never runs
   off screen, below 1200 px (no orbit there) or under reduced motion. */
function useTour(box: RefObject<HTMLElement | null>, out: boolean, list: Spot[], setHot: Dispatch<SetStateAction<Spot | null>>) {
  const seen = useInView(box, { amount: 0.4 });
  const calm = useReducedMotion();
  const [over, setOver] = useState(false);
  const live = out && seen && !calm && !over && list.length > 0;
  useEffect(() => {
    if (!live || !matchMedia('(min-width: 1200px)').matches) return;
    let k = 0, t: ReturnType<typeof setTimeout>;
    const next = () => { setHot({ ...list[k % list.length], tour: true }); k += 3; t = setTimeout(rest, 1700); };
    const rest = () => { setHot(null); t = setTimeout(next, 900); };
    t = setTimeout(next, 1200);
    return () => { clearTimeout(t); setHot((h) => (h && h.tour ? null : h)); };
  }, [live, list, setHot]);
  return setOver;
}

/* Below 1200 px each product's builds are a rail you swipe. When a rail first comes into view it slides a chip's width
   and back, once, so it reads as a rail and not as chips falling off the edge. (Rendered as an empty marker before
   the rail; it drives the rail that follows it.) */
function Peek({ i }: { i: number }) {
  const ref = useRef<HTMLElement>(null);
  const calm = useReducedMotion();
  useEffect(() => {
    const ul = ref.current?.parentElement?.querySelector('ul');
    if (!ul || calm || matchMedia('(min-width: 1200px)').matches) return;
    let t: ReturnType<typeof setTimeout> | undefined;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting || ul.scrollWidth <= ul.clientWidth + 4) return;
      io.disconnect();
      t = setTimeout(() => {
        ul.scrollTo({ left: 72, behavior: 'smooth' });
        t = setTimeout(() => ul.scrollTo({ left: 0, behavior: 'smooth' }), 650);
      }, 900 + i * 260);
    }, { threshold: 1 });
    io.observe(ul);
    const stop = () => { clearTimeout(t); io.disconnect(); };
    ul.addEventListener('pointerdown', stop, { once: true });
    return () => { stop(); ul.removeEventListener('pointerdown', stop); };
  }, [calm, i]);
  return <i ref={ref} hidden />;
}

const WEB = 'https://hanzo.app'; // the app in a browser: Chat, Dev and the rest, nothing to install

function Dial({ os, phone }: { os: Os; phone: boolean }) {
  const PRODUCTS = useProducts();
  const DIAL_PRODUCTS = PRODUCTS.slice(0, DIAL);
  const [label, mp, mb] = MAIN[os];
  const [out, setOut] = useState(false);
  const [hot, setHot] = useState<Spot | null>(null);
  const box = useRef<HTMLDivElement>(null);
  useEffect(() => { const t = setTimeout(() => setOut(true), 160); return () => clearTimeout(t); }, []);
  let n = 0;
  const groups = DIAL_PRODUCTS.map((p, pi) => {
    const list = p.builds.map((b, bi) => ({ b, bi })).filter((x) => !(pi === mp && x.bi === mb) && !(pi === 0 && x.bi === 5));
    const [a0, a1] = ARC[pi];
    return list.map((x, j) => {
      const a = ((a0 + (list.length === 1 ? (a1 - a0) / 2 : (j * (a1 - a0)) / (list.length - 1))) * Math.PI) / 180;
      return { ...x, i: n++, x: r2(50 + Math.cos(a) * RX), y: r2(50 + Math.sin(a) * RY) };
    });
  });
  const main = PRODUCTS[mp].builds[mb];
  const shown = hot || { p: PRODUCTS[mp], b: main };
  const [flat, setFlat] = useState<Spot[]>([]);
  useEffect(() => { setFlat(groups.flatMap((g, pi) => g.map(({ b, x, y }) => ({ x, y, b, p: DIAL_PRODUCTS[pi] })))); }, [os, PRODUCTS]); // eslint-disable-line react-hooks/exhaustive-deps
  const rest = useTour(box, out, flat, setHot);
  return (
    <div ref={box} className={'dl-dial' + (out ? ' out' : '')} onPointerEnter={(e) => { if (e.pointerType === 'mouse') rest(true); }} onPointerLeave={() => rest(false)}>
      <svg className="dl-orbit" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        <ellipse cx="50" cy="50" rx={RX} ry={RY} />
        <path d="M50 4v92M3 50h94" className="dl-axis" />
        {hot && <line key={hot.x + '-' + hot.y} x1="50" y1="50" x2={hot.x} y2={hot.y} className="dl-ray" />}
      </svg>
      <div className="dl-core">
        <Magnetic strength={0.18}>
          {phone
            ? <Cta to={WEB} id="download-main" thumb size="lg" className="dl-main"><span>Open Hanzo in your browser</span></Cta>
            : <Cta to={GH + main[2]} id="download-main" thumb size="lg" className="dl-main"><Down s={22} /><span>Download for {label}</span></Cta>}
        </Magnetic>
        {phone && !hot ? (
          <p className="dl-read x-mono">
            <span className="dl-read-a">No install on a phone: Hanzo runs in the browser</span>
            <span className="dl-read-f">Hanzo Desktop is for macOS, Windows and Linux</span>
          </p>
        ) : (
          <p className="dl-read x-mono">
            <span className="dl-read-a"><span>{shown.p.name}</span>{hot && <> · <span>{shown.b[0]}</span></>} · <span>{shown.p.v}</span>{shown.b[1] && <> · <span>{shown.b[1]}</span></>}</span>
            <span className="dl-read-f">{FILE(shown.b[2])}</span>
          </p>
        )}
        <div className="dl-main-l">
          <A to="#builds" data-cta="download-every-build">Every build</A>
          {!phone && <A to={WEB} data-cta="download-browser">Or open Hanzo in your browser</A>}
        </div>
      </div>
      {DIAL_PRODUCTS.map((p, pi) => (
        <div key={p.k} className={'dl-grp q' + pi + ' k-' + p.k}>
          <Peek i={pi} />
          <p className="dl-grp-k"><span className="dl-grp-i"><Glyph k={p.k} /></span><b>{p.name}</b> <span className="x-mono">{p.v}</span>{p.term && <span className="dl-term">Terminal</span>}</p>
          <ul>
            {groups[pi].map(({ b, i, x, y }) => (
              <li key={b[0]} className={'dl-chip' + (hot && hot.tour && hot.b === b ? ' hot' : '')} style={{ left: x + '%', top: y + '%', '--dx': r2(50 - x) + 'cqw', '--dy': r2(50 - y) + 'cqh', '--i': i }}>
                <a href={GH + b[2]} aria-label={p.name + ', ' + b[0] + ', ' + p.v + ', ' + b[1]} onPointerEnter={() => setHot({ x, y, p, b })} onPointerLeave={() => setHot(null)} onFocus={() => setHot({ x, y, p, b })} onBlur={() => setHot(null)}>
                  <span className="dl-chip-i"><Glyph k={p.k} /></span><span className="dl-chip-t">{b[0]}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

function Hero({ os, phone }: { os: Os; phone: boolean }) {
  return (
    <section className="dl-hero" aria-labelledby="dl-h1">
      <div className="av-wrap">
        <div className="av-grid dl-top">
          <Lines as="h1" id="dl-h1" className="av-display dl-top-l" lines={['Download Hanzo']} now delay={0.05} />
          <p className="av-lede dl-top-r">Hanzo Desktop is the Hanzo app for your computer. Download it, open it, sign in: no terminal needed. Tools for developers are further down.</p>
        </div>
        <Dial os={os} phone={phone} />
      </div>
    </section>
  );
}

/* ---------- every build ---------- */
function Art({ k }: { k: string }) {
  if (k === 'desk') return (
    <div className="dl-m dl-m-win" aria-hidden="true">
      <span className="dl-mw-bar"><i /><i /><i /><span className="dl-mw-t"><b>Desktop</b> — Hanzo</span></span>
      <span className="dl-mw-body">
        <span className="dl-mw-side x-mono"><span>gateway</span><span className="on">limit.go</span><span>payments</span></span>
        <span className="dl-mw-chat"><span className="you">Add rate limiting to the payments API.</span><span className="ai"><Mark size={10} />Read 14 files.</span><span className="ai"><Mark size={10} />Tests pass.</span></span>
      </span>
    </div>
  );
  if (k === 'cli') return (
    <div className="dl-m dl-m-term x-mono" aria-hidden="true">
      <span className="dl-mt-bar"><i /><i /><i /></span>
      <span className="dl-mt-l"><em>$</em> curl -fsSL hanzo.sh | sh</span>
      <span className="dl-mt-l"><em>&gt;</em> irm hanzo.sh/install.ps1 | iex</span>
      <span className="dl-mt-l"><em>$</em> npm i -g hanzo</span>
      <span className="dl-mt-l"><em>$</em> hanzo<i className="dl-mt-c" /></span>
    </div>
  );
  if (k === 'ext') return (
    <div className="dl-m dl-m-stack" aria-hidden="true">
      <span className="dl-ms b2" /><span className="dl-ms b1" />
      <span className="dl-ms b0">
        <span className="dl-ms-bar"><i /><span className="dl-ms-url x-mono">hanzo.ai/extension</span></span>
        <span className="dl-ms-page"><Img src="/models/uta.webp" w={1200} h={1500} alt="" /></span>
        <span className="dl-ms-panel"><span className="dl-ms-h"><Mark size={10} />Hanzo Extension</span><span className="dl-ms-p">It uses your session</span></span>
      </span>
    </div>
  );
  if (k === 'ide') return (
    <div className="dl-m dl-m-win" aria-hidden="true">
      <span className="dl-mw-bar"><i /><i /><i /><span className="dl-mw-t"><b>IDE</b> — Hanzo</span></span>
      <span className="dl-mw-body">
        <span className="dl-mw-side x-mono"><span>src</span><span className="on">main.ts</span><span>tests</span></span>
        <span className="dl-mw-chat"><span className="you">Review diff across 4 files.</span><span className="ai"><Mark size={10} />Indexed repository.</span><span className="ai"><Mark size={10} />Build ready.</span></span>
      </span>
    </div>
  );
  if (k === 'dev') return (
    <div className="dl-m dl-m-term x-mono" aria-hidden="true">
      <span className="dl-mt-bar"><i /><i /><i /></span>
      <span className="dl-mt-l"><em>$</em> curl -fsSL hanzo.sh | sh</span>
      <span className="dl-mt-l"><em>$</em> npm i -g @hanzo/dev</span>
      <span className="dl-mt-l"><em>$</em> dev<i className="dl-mt-c" /></span>
    </div>
  );
  if (k === 'bot') return (
    <div className="dl-m dl-m-term x-mono" aria-hidden="true">
      <span className="dl-mt-bar"><i /><i /><i /></span>
      <span className="dl-mt-l"><em>$</em> npm i -g @hanzo/bot</span>
      <span className="dl-mt-l"><em>$</em> hanzo bot start</span>
      <span className="dl-mt-l"><em>$</em> gateway :18789 ready<i className="dl-mt-c" /></span>
    </div>
  );
  if (k === 'team') return (
    <div className="dl-m dl-m-win" aria-hidden="true">
      <span className="dl-mw-bar"><i /><i /><i /><span className="dl-mw-t"><b>Team</b> — Hanzo</span></span>
      <span className="dl-mw-body">
        <span className="dl-mw-side x-mono"><span>triage</span><span className="on">release</span><span>docs</span></span>
        <span className="dl-mw-chat"><span className="you">Ship Desktop v1.1.55 across OSes.</span><span className="ai"><Mark size={10} />3 agents assigned.</span><span className="ai"><Mark size={10} />All checks green.</span></span>
      </span>
    </div>
  );
  if (k === 'forge') return (
    <div className="dl-m dl-m-ed" aria-hidden="true">
      <span className="dl-me-tabs x-mono"><span className="on">hanzo.codes</span><span>Pulls</span><span>Actions</span></span>
      <span className="dl-me-list"><span><Mark size={10} />Git hosting &amp; code review</span><span><Mark size={10} />CI runners</span><span><Mark size={10} />Release registry</span></span>
    </div>
  );
  if (k === 'node') return (
    <div className="dl-m dl-m-term x-mono" aria-hidden="true">
      <span className="dl-mt-bar"><i /><i /><i /></span>
      <span className="dl-mt-l"><em>$</em> hanzod start</span>
      <span className="dl-mt-l"><em>$</em> hanzod status</span>
      <span className="dl-mt-l"><em>$</em> network synced<i className="dl-mt-c" /></span>
    </div>
  );
  return (
    <div className="dl-m dl-m-ed" aria-hidden="true">
      <span className="dl-me-tabs x-mono"><span className="on">VS Code</span><span>Cursor</span><span>Antigravity</span></span>
      <span className="dl-me-list"><span><Mark size={10} />Completions</span><span><Mark size={10} />chat</span><span><Mark size={10} />agentic edits</span></span>
    </div>
  );
}

/* The build list arrives as its card comes into view: your system's rows first, then the rest. The server and JS-off
   show the finished list; the start state is set after mount, only for a card still below the fold. */
function useArrive() {
  const ref = useRef<HTMLElement>(null);
  const calm = useReducedMotion();
  useEffect(() => {
    const el = ref.current;
    if (!el || calm || el.getBoundingClientRect().top < innerHeight * 0.9) return;
    el.dataset.in = 'pre';
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { io.disconnect(); el.dataset.in = 'go'; } }, { rootMargin: '0px 0px -20% 0px' });
    io.observe(el);
    return () => { io.disconnect(); delete el.dataset.in; };
  }, [calm]);
  return ref;
}

function Card({ p, os, br }: { p: Product; os: Os; br: number }) {
  const mine = p.k === 'ext' ? [br] : (MINE[os] || {})[p.k] || [];
  const arrive = useArrive();
  const order = [...mine, ...p.builds.map((_, j) => j).filter((j) => !mine.includes(j))];
  const head = (
    <>
      <span className="dl-vis" data-morph=""><Art k={p.k} /></span>
      <span className="dl-card-h">
        <h3 className="av-title">{p.name}</h3>
        <span className="dl-v x-mono">{p.v}</span>
        {p.term && <span className="dl-term">Terminal</span>}
        {p.to && <span className="dl-open" aria-hidden="true"><svg viewBox="0 0 16 16" width="18" height="18"><path d="M4.5 11.5 11.5 4.5M5.5 4.5h6v6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg></span>}
      </span>
    </>
  );
  return (
    <article ref={arrive} className={'dl-card k-' + p.k}>
      {p.to ? <A to={p.to} className="dl-card-a" data-cta={'download-open-' + p.k}>{head}</A> : <div className="dl-card-a">{head}</div>}
      <p className="dl-card-d">{p.d}</p>
      {p.cmds && (
        <div className="dl-cmds">
          {p.cmds.map((c) => (
            <div key={c} className="dl-cmd"><code className="x-mono">{c}</code><Copy text={c} /></div>
          ))}
        </div>
      )}
      <ul className="dl-rows">
        {p.builds.map(([n, s, path], j) => (
          <li key={n}>
            <a href={GH + path} className={'dl-row' + (mine.includes(j) ? ' mine' : '')} style={{ '--r': order.indexOf(j) }}>
              <span className="dl-row-n">{n}</span>
              <span className="dl-row-f x-mono">{FILE(path)}</span>
              <span className="dl-row-s x-mono av-num">{s}</span>
              <span className="dl-row-b"><Down s={15} /></span>
            </a>
          </li>
        ))}
      </ul>
      {p.all && <p className="dl-all"><A to={p.all} data-cta={'download-' + p.k + '-all'}>All builds and checksums →</A></p>}
    </article>
  );
}

function Builds({ os, br }: { os: Os; br: number }) {
  const PRODUCTS = useProducts();
  return (
    <>
      <section className="av-sec dl-builds" id="builds" aria-labelledby="dl-apps-h">
        <div className="av-wrap">
          <div className="av-grid dl-b-top">
            <h2 className="av-head dl-b-h" id="dl-apps-h">Apps</h2>
            <p className="av-body dl-b-d">Download, open, sign in. Nothing here needs a terminal.</p>
          </div>
          <div className="dl-bento">{PRODUCTS.filter((p) => !p.term).map((p) => <Card key={p.k} p={p} os={os} br={br} />)}</div>
        </div>
      </section>
      <section className="av-sec dl-builds dl-devs" id="developers" aria-labelledby="dl-devs-h">
        <div className="av-wrap">
          <div className="av-grid dl-b-top">
            <h2 className="av-head dl-b-h" id="dl-devs-h">For developers</h2>
            <p className="av-body dl-b-d">These run in a terminal. You do not need any of them to use Hanzo Desktop or hanzo.app.</p>
          </div>
          <div className="dl-bento">{PRODUCTS.filter((p) => p.term).map((p) => <Card key={p.k} p={p} os={os} br={br} />)}</div>
        </div>
      </section>
    </>
  );
}

/* ---------- which one: what each product is for, in a line, and whether it needs a terminal (issue 319) ---------- */
function Which({ os }: { os: Os }) {
  const PRODUCTS = useProducts();
  const [, mp, mb] = MAIN[os];
  const rows: [want: string, name: string, cmd: string, to: string, term: boolean][] = [
    ['Use Hanzo on your computer: Chat, Dev, Studio and your agents in one window', 'Hanzo Desktop', '', GH + PRODUCTS[mp].builds[mb][2], false],
    ['Use Hanzo without installing anything', 'hanzo.app', 'in your browser', 'https://hanzo.app', false],
    ['Ask Hanzo about the page you are reading', 'Browser extension', '', '/extension', false],
    ['AI help inside VS Code, Cursor or JetBrains', 'Editor extension', '', '#builds', false],
    ['A coding agent in your terminal, and Hanzo from scripts', 'Hanzo CLI', 'hanzo', '/cli', true],
    ['Only the coding agent, without the rest of the CLI', 'Hanzo Dev', 'dev', '/dev', true],
    ['Run a node on the Hanzo network', 'Hanzo Node', 'hanzod', '/node', true],
  ];
  return (
    <section className="av-sec dl-which" aria-labelledby="dl-which-h">
      <div className="av-wrap">
        <div className="av-grid dl-b-top">
          <h2 className="av-head dl-b-h" id="dl-which-h">Which one do I need?</h2>
          <p className="av-body dl-b-d">If you are not sure, Hanzo Desktop. One Hanzo account signs in to all of them.</p>
        </div>
        <ul className="dl-which-l">
          {rows.map(([want, name, cmd, to, term]) => (
            <li key={name}>
              <A to={to} className="dl-which-a" data-cta={'download-which-' + name.toLowerCase().replace(/[^a-z]+/g, '-')}>
                <span className="dl-which-q">{want}</span>
                <span className="dl-which-p"><b>{name}</b>{cmd && <code className="x-mono">{cmd}</code>}</span>
                <span className={'dl-which-t' + (term ? ' term' : '')}>{term ? 'Terminal · developers' : 'No terminal'}</span>
              </A>
            </li>
          ))}
        </ul>
        <p className="av-body dl-which-n">
          <b>One agent, several doors.</b> Hanzo Dev is the coding agent. In the Hanzo app it is the Dev tab. In a terminal
          it is <code className="x-mono">hanzo dev</code> (plain <code className="x-mono">hanzo</code> opens the same session),
          or <code className="x-mono">dev</code> when installed on its own (<code className="x-mono">hanzo-dev</code> is the same
          file). No Hanzo tool is called <code className="x-mono">hz</code>.
        </p>
      </div>
    </section>
  );
}

/* ---------- Your kit (Beyond), the dark room: say what you use, get exactly your files ---------- */
// [label, Desktop build index, CLI/Dev build index]; Linux x86_64 gets the AppImage, the deb stays in Every build
const SYSTEMS: [string, number, number][] = [['macOS · Apple Silicon', 0, 0], ['macOS · Intel', 0, 1], ['Windows', 1, 2], ['Linux · x86_64', 2, 3], ['Linux · arm64', 4, 4]];
const SYS_OF: Record<Os, number> = { mac: 0, win: 2, linux: 3, linuxarm: 4 };

function Pick({ label, list, at, set, id }: { label: string; list: string[]; at: number; set: (i: number) => void; id: string }) {
  return (
    <fieldset className="dl-q">
      <legend className="av-kick">{label}</legend>
      <div role="radiogroup" aria-label={label}>
        {list.map((t, i) => (
          <button key={t} type="button" role="radio" aria-checked={at === i} data-sound="tick" onClick={() => set(i)}>
            {at === i && <motion.span layoutId={id} className="dl-q-bg" transition={GLIDE} />}
            <span>{t}</span>
          </button>
        ))}
      </div>
    </fieldset>
  );
}

function Kit({ os, br }: { os: Os; br: number }) {
  const PRODUCTS = useProducts();
  const [sys, setSys] = useState(0);
  const [b, setB] = useState(0);
  const [ed, setEd] = useState(0);
  useEffect(() => { setSys(SYS_OF[os] ?? 0); }, [os]);
  useEffect(() => { setB(br); }, [br]);
  const [, desk, cliIdx] = SYSTEMS[sys];
  const P = (k: string) => BY(PRODUCTS, k);
  // the apps first, then the tools that run in a terminal (marked), as the page lists them
  const rows: [Product, Build][] = [[P('desk'), P('desk').builds[desk]], [P('ext'), P('ext').builds[b]], [P('ed'), P('ed').builds[ed]]];
  if (sys === 2) rows.push([P('ide'), P('ide').builds[0]], [P('team'), P('team').builds[0]]);
  rows.push([P('cli'), P('cli').builds[cliIdx]], [P('dev'), P('dev').builds[cliIdx]]);
  if (sys === 2) rows.push([P('bot'), P('bot').builds[0]]);
  return (
    <section className="av-sec av-dark dl-kit" data-room="dark" aria-labelledby="dl-kit-h">
      <div className="av-wrap av-grid">
        <div className="dl-kit-l">
          <Lines as="h2" id="dl-kit-h" className="av-display s" lines={['Just your files']} />
          <Pick label="System" list={SYSTEMS.map((s) => s[0])} at={sys} set={setSys} id="dl-sys" />
          <Pick label="Browser" list={PRODUCTS[2].builds.map((x) => x[0])} at={b} set={setB} id="dl-br" />
          <Pick label="Editor" list={PRODUCTS[3].builds.map((x) => x[0])} at={ed} set={setEd} id="dl-ed" />
        </div>
        <div className="dl-kit-r">
          <ol className="dl-kit-list" aria-live="polite">
            {rows.map(([p, [o, size, path]], i) => (
              <li key={p.k}>
                <a href={GH + path} className="dl-kit-a">
                  <span className="dl-kit-i x-mono av-num">{String(i + 1).padStart(2, '0')}</span>
                  <span className="dl-kit-n"><b>{p.name}</b><span>{o} · {p.v}{p.term ? ' · terminal, for developers' : ''}</span></span>
                  <span className="dl-kit-f x-mono"><span>{FILE(path)}</span></span>
                  <span className="dl-kit-s x-mono av-num">{size || '—'}</span>
                  <span className="dl-kit-d"><Down s={16} /></span>
                </a>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

/* ---------- the one closing band: the hero's ask again ---------- */
function End({ os, phone }: { os: Os; phone: boolean }) {
  const PRODUCTS = useProducts();
  const [label, mp, mb] = MAIN[os];
  return (
    <section className="x-band dl-band" aria-labelledby="dl-end-h">
      <div className="av-wrap dl-band-in">
        <h2 id="dl-end-h" className="av-display m dl-end-t">One account signs in to all of them.</h2>
        <div className="dl-band-acts">
          {phone
            ? <Cta to={WEB} id="download-main-end" size="lg">Open Hanzo in your browser</Cta>
            : <>
                <Cta to={GH + PRODUCTS[mp].builds[mb][2]} id="download-main-end" size="lg">Download for {label}</Cta>
                <Cta to={WEB} id="download-browser-end" kind="link">Or open Hanzo in your browser</Cta>
              </>}
        </div>
      </div>
    </section>
  );
}

/* Desktop's latest release: the build's (page.tsx), then GitHub's answer in the browser, so a release published since
   the page was built is the one offered. Kept for the tab's session; a failure (offline, rate-limited) keeps the build's. */
const LATEST_KEY = 'hz:desktop-latest';
function useLatestDesktop(built?: Desktop) {
  const [desk, setDesk] = useState<Desktop>(built || DESKTOP_FALLBACK);
  useEffect(() => {
    let live = true;
    const use = (d: Desktop | null) => { if (live && d) setDesk(d); };
    try {
      const kept = sessionStorage.getItem(LATEST_KEY);
      if (kept) { use(fromRelease(JSON.parse(kept))); return () => { live = false; }; }
    } catch {}
    fetch(DESKTOP_API, { headers: { Accept: 'application/vnd.github+json' } })
      .then((r) => (r.ok ? r.json() : null))
      .then((j) => {
        const d = fromRelease(j);
        if (!d) return;
        try { sessionStorage.setItem(LATEST_KEY, JSON.stringify({ tag_name: j.tag_name, assets: j.assets.map((a: { name: string; size: number }) => ({ name: a.name, size: a.size })) })); } catch {}
        use(d);
      })
      .catch(() => {});
    return () => { live = false; };
  }, []);
  return desk;
}

type Tags = Partial<Record<'cli' | 'dev' | 'node', string>>;

export default function DownloadPage({ desktop, tags = {} }: { desktop?: Desktop; tags?: Tags }) {
  const { os, br, phone } = useSystem();
  const desk = useLatestDesktop(desktop);
  const products = useMemo(() => PRODUCTS.map((p) => {
    if (p.k === 'desk') return { ...p, v: desk.v, builds: desk.builds };
    const tag = tags[p.k as keyof Tags];
    return tag ? { ...p, v: tag } : p;
  }), [desk, tags.cli, tags.dev, tags.node]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <Products.Provider value={products}>
      <main className="av dl" style={{ '--ac': '#a3a3a3' }}>
        <Hero os={os} phone={phone} />
        <Which os={os} />
        <Builds os={os} br={br} />
        <Kit os={os} br={br} />
        <End os={os} phone={phone} />
      </main>
    </Products.Provider>
  );
}
