'use client';
// Signature: One button that knows your OS sits at the centre of a four-quadrant dial, and every other build fans out of it onto the orbit, grouped by product; point at one and a ray runs from your button to it with its file and size
// Beyond: Your kit: the page already guessed your system and browser; confirm them and your editor, and it lists exactly your files, one per product, each with its own size and link (no Desktop on Windows, as Hanzo ships it)
/* Download Hanzo, v2 (Archetype E, utility: calm, precise, fast, one delight).
   V2: 8/10 a precise dial (one OS-aware button, sixteen builds fanned out by product, a ray to the one you point at); the four products are cards that open into their own pages (desktop, CLI, extension: the card's picture flies into that page's hero); your kit is the one dark room
   Motion: signature = the fan-out from the button (CSS, plays once) and the ray. Supporting: magnetic main button,
   segmented pickers that slide, line-masked headline (components/v2/AppLines). Accent: amber.
   Every word, size and link is Hanzo's. */
import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Copy, Magnetic } from '../ui';
import { A, Go } from '../kit';
import Lines from '../v2/AppLines';
import '../v2/AppType.css';
import './DownloadPage.css';

const GH = 'https://github.com/hanzoai/';
const PRODUCTS = [
  {
    k: 'desk', name: 'Desktop', v: 'v1.1.52', to: '/desktop',
    d: 'A native app with a global hotkey. Talk to Hanzo from any window, capture a region of the screen, and put the answer back where you were typing.',
    builds: [
      ['macOS', '600 MB', 'desktop/releases/download/v1.1.52/Hanzo.Desktop_1.1.52_universal.dmg'],
      ['Linux (AppImage)', '732 MB', 'desktop/releases/download/v1.1.52/Hanzo.Desktop_1.1.52_amd64.AppImage'],
      ['Linux (deb)', '568 MB', 'desktop/releases/download/v1.1.52/Hanzo.Desktop_1.1.52_amd64.deb'],
      ['Linux (arm64)', '701 MB', 'desktop/releases/download/v1.1.52/Hanzo.Desktop_1.1.52_aarch64.AppImage'],
    ],
  },
  {
    k: 'cli', name: 'Hanzo CLI', v: 'v8.5.910', to: '/cli',
    d: 'The coding agent, in your terminal. It reads the repo you are in, writes and runs code, and drives every product of the Hanzo cloud from one binary.',
    builds: [
      ['macOS (Apple Silicon)', '7 MB', 'cli/releases/download/v8.5.910/hanzo-darwin-arm64.tar.gz'],
      ['macOS (Intel)', '7 MB', 'cli/releases/download/v8.5.910/hanzo-darwin-amd64.tar.gz'],
      ['Windows', '8 MB', 'cli/releases/download/v8.5.910/hanzo-windows-amd64.tar.gz'],
      ['Linux (x86_64)', '6 MB', 'cli/releases/download/v8.5.910/hanzo-linux-amd64.tar.gz'],
      ['Linux (arm64)', '6 MB', 'cli/releases/download/v8.5.910/hanzo-linux-arm64.tar.gz'],
    ],
  },
  {
    k: 'ext', name: 'Browser extension', v: 'v1.9.31', to: '/extension',
    d: 'Ask Hanzo about the page you are on. It reads the tab for context, captures what you select, and runs agents from the toolbar.',
    builds: [
      ['Chrome', '976 KB', 'extension/releases/download/v1.9.31/hanzo-ai-chrome-v1.9.31.zip'],
      ['Firefox', '956 KB', 'extension/releases/download/v1.9.31/hanzo-ai-firefox-v1.9.31.zip'],
      ['Safari', '310 KB', 'extension/releases/download/v1.9.31/hanzo-ai-safari-v1.9.31.zip'],
      ['Edge', '976 KB', 'extension/releases/download/v1.9.31/hanzo-ai-edge-v1.9.31.zip'],
    ],
  },
  {
    k: 'ed', name: 'Editors', v: 'v1.9.31',
    d: 'Completions, chat and agentic edits where you already write code. One extension, every editor that takes one.',
    builds: [
      ['VS Code', '1 MB', 'extension/releases/download/v1.9.31/hanzo-ai-vscode-v1.9.31.vsix'],
      ['Cursor', '1 MB', 'extension/releases/download/v1.9.31/hanzo-ai-cursor-v1.9.31.vsix'],
      ['Windsurf', '1 MB', 'extension/releases/download/v1.9.31/hanzo-ai-windsurf-v1.9.31.vsix'],
      ['JetBrains', '3 MB', 'extension/releases/download/v1.9.31/hanzo-ai-jetbrains-v1.9.31.zip'],
    ],
  },
];
const FILE = (p) => p.split('/').pop();
const SPRING = { type: 'spring', stiffness: 300, damping: 30 };

/* Which build is yours. Desktop ships for macOS and Linux; on Windows the one native build is the CLI. */
function useSystem() {
  const [s, setS] = useState({ os: 'mac', br: 0 }); // the page ships with macOS, as hanzo.ai does
  useEffect(() => {
    const p = ((navigator.userAgentData && navigator.userAgentData.platform) || navigator.platform || navigator.userAgent || '').toLowerCase();
    const ua = navigator.userAgent;
    const l = ua.toLowerCase();
    const os = /win/.test(p) ? 'win' : /linux|x11/.test(p) && !/android/.test(l) ? (/aarch64|arm/.test(l) ? 'linuxarm' : 'linux') : 'mac';
    const br = /Edg\//.test(ua) ? 3 : /Firefox|FxiOS/.test(ua) ? 1 : /Safari/.test(ua) && !/Chrome|Chromium|CriOS|Edg/.test(ua) ? 2 : 0;
    setS({ os, br });
  }, []);
  return s;
}
// [label, product, build] of the one button; and which rows below are yours
const MAIN = { mac: ['macOS', 0, 0], linux: ['Linux', 0, 1], linuxarm: ['Linux', 0, 3], win: ['Windows', 1, 2] };
const MINE = { mac: { desk: [0], cli: [0, 1] }, linux: { desk: [1, 2], cli: [3] }, linuxarm: { desk: [3], cli: [4] }, win: { cli: [2] } };

const Glyph = ({ k }) => (
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
// bottom-right, editors bottom-left; spaced so no two chips touch at 1440 px whichever build is the main one
const ARC = [[182, 249], [271, 358], [17, 74], [103, 163]];
const RX = 44, RY = 41;
const r2 = (n) => Math.round(n * 100) / 100; // rounded: server and browser print the same style

function Dial({ os }) {
  const [label, mp, mb] = MAIN[os];
  const [out, setOut] = useState(false);
  const [hot, setHot] = useState(null);
  useEffect(() => { const t = setTimeout(() => setOut(true), 160); return () => clearTimeout(t); }, []);
  let n = 0;
  const groups = PRODUCTS.map((p, pi) => {
    const list = p.builds.map((b, bi) => ({ b, bi })).filter((x) => !(pi === mp && x.bi === mb));
    const [a0, a1] = ARC[pi];
    return list.map((x, j) => {
      const a = ((a0 + (list.length === 1 ? (a1 - a0) / 2 : (j * (a1 - a0)) / (list.length - 1))) * Math.PI) / 180;
      return { ...x, i: n++, x: r2(50 + Math.cos(a) * RX), y: r2(50 + Math.sin(a) * RY) };
    });
  });
  const main = PRODUCTS[mp].builds[mb];
  return (
    <div className={'dl-dial' + (out ? ' out' : '')}>
      <svg className="dl-orbit" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        <ellipse cx="50" cy="50" rx={RX} ry={RY} />
        <path d="M50 4v92M3 50h94" className="dl-axis" />
        {hot && <line key={hot.x + '-' + hot.y} x1="50" y1="50" x2={hot.x} y2={hot.y} className="dl-ray" />}
      </svg>
      {PRODUCTS.map((p, pi) => (
        <div key={p.k} className={'dl-grp q' + pi + ' k-' + p.k}>
          <p className="dl-grp-k"><span className="dl-grp-i"><Glyph k={p.k} /></span><b>{p.name}</b> <span className="x-mono">{p.v}</span></p>
          <ul>
            {groups[pi].map(({ b, i, x, y }) => (
              <li key={b[0]} className="dl-chip" style={{ left: x + '%', top: y + '%', '--dx': r2(50 - x) + 'cqw', '--dy': r2(50 - y) + 'cqh', '--i': i }}>
                <a href={GH + b[2]} onPointerEnter={() => setHot({ x, y })} onPointerLeave={() => setHot(null)} onFocus={() => setHot({ x, y })} onBlur={() => setHot(null)}>
                  <span className="dl-chip-i"><Glyph k={p.k} /></span><span className="dl-chip-t">{b[0]}</span>
                  <span className="dl-tip"><b>{p.name} · {b[0]}</b><span className="x-mono">{FILE(b[2])}</span><span className="x-mono">{p.v} · {b[1]}</span></span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      ))}
      <div className="dl-core">
        <Magnetic strength={0.18}>
          <a href={GH + main[2]} className="dl-main">
            <Down s={22} />
            <span>Download for {label}</span>
          </a>
        </Magnetic>
        <i hidden data-thumb={'Download for ' + label} data-href={GH + main[2]} />
        <p className="dl-main-s x-mono"><span>{mp === 0 ? 'Desktop' : PRODUCTS[mp].name}</span> · <span>{PRODUCTS[mp].v}</span> · <span>{main[1]}</span></p>
        <div className="dl-main-l">
          <A to="#builds">Every build</A>
          <A to="/chat">Or open Hanzo in your browser</A>
        </div>
      </div>
    </div>
  );
}

function Hero({ os }) {
  return (
    <section className="dl-hero" aria-labelledby="dl-h1">
      <div className="av-wrap">
        <div className="av-grid dl-top">
          <div className="dl-top-l">
            <p className="av-kick"><b>Download</b></p>
            <Lines as="h1" id="dl-h1" className="av-display m" lines={['Download Hanzo']} now delay={0.05} />
          </div>
          <p className="av-lede dl-top-r">The desktop app, the CLI, and the extension for your browser and editor. One account signs in to all of them.</p>
        </div>
        <Dial os={os} />
      </div>
    </section>
  );
}

/* ---------- every build: four cards; three of them open into their own page ---------- */
function Art({ k }) {
  if (k === 'desk') return (
    <div className="dl-m dl-m-win" aria-hidden="true">
      <span className="dl-mw-bar"><i /><i /><i /><b /></span>
      <span className="dl-mw-body">
        <span className="dl-mw-side"><b /><b /><b /><b /><b /></span>
        <span className="dl-mw-chat"><b className="you" /><b className="ai" /><b className="ai" /><b className="ai s" /><b className="you s" /><b className="ai" /><b className="ai s" /><b className="cmp"><i /></b></span>
      </span>
    </div>
  );
  if (k === 'cli') return (
    <div className="dl-m dl-m-term x-mono" aria-hidden="true">
      <span className="dl-mt-bar"><i /><i /><i /></span>
      <span className="dl-mt-l"><em>$</em> curl -fsSL hanzo.sh | sh</span>
      <span className="dl-mt-l dim"><b /><b className="s" /></span>
      <span className="dl-mt-l"><em>$</em> hanzo<i className="dl-mt-c" /></span>
    </div>
  );
  if (k === 'ext') return (
    <div className="dl-m dl-m-stack" aria-hidden="true">
      <span className="dl-ms b2" /><span className="dl-ms b1" />
      <span className="dl-ms b0"><span className="dl-ms-bar"><i /><b /></span><span className="dl-ms-page"><b /><b /><b className="s" /></span><span className="dl-ms-panel"><i /><b /><b /><b className="s" /><em /><b /><b className="s" /></span></span>
    </div>
  );
  return (
    <div className="dl-m dl-m-ed" aria-hidden="true">
      <span className="dl-me-tabs"><b /><b className="on" /></span>
      <span className="dl-me-code"><b style={{ width: '42%' }} /><b style={{ width: '64%', marginLeft: 18 }} /><b style={{ width: '52%', marginLeft: 18 }} /><b className="ghost" style={{ width: '58%', marginLeft: 36 }} /><b className="ghost" style={{ width: '34%', marginLeft: 36 }} /><b style={{ width: '20%', marginLeft: 18 }} /></span>
    </div>
  );
}

function Card({ p, os, br }) {
  const mine = p.k === 'ext' ? [br] : (MINE[os] || {})[p.k] || [];
  const head = (
    <>
      <span className="dl-vis" data-morph=""><Art k={p.k} /></span>
      <span className="dl-card-h">
        <span className="av-title">{p.name}</span>
        <span className="dl-v x-mono">{p.v}</span>
        {p.to && <span className="dl-open" aria-hidden="true"><svg viewBox="0 0 16 16" width="18" height="18"><path d="M4.5 11.5 11.5 4.5M5.5 4.5h6v6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg></span>}
      </span>
    </>
  );
  return (
    <article className={'dl-card k-' + p.k}>
      {p.to ? <A to={p.to} className="dl-card-a" data-cursor="Open" aria-label={p.name + ' ' + p.v}>{head}</A> : <div className="dl-card-a">{head}</div>}
      <p className="dl-card-d">{p.d}</p>
      {p.k === 'cli' && (
        <div className="dl-cmds">
          {['curl -fsSL hanzo.sh | sh', 'npm i -g hanzo'].map((c) => (
            <div key={c} className="dl-cmd"><code className="x-mono">{c}</code><Copy text={c} /></div>
          ))}
        </div>
      )}
      <ul className="dl-rows">
        {p.builds.map(([n, s, path], j) => (
          <li key={n}>
            <a href={GH + path} className={'dl-row' + (mine.includes(j) ? ' mine' : '')}>
              <span className="dl-row-n">{n}</span>
              <span className="dl-row-f x-mono">{FILE(path)}</span>
              <span className="dl-row-s x-mono av-num">{s}</span>
              <span className="dl-row-b"><Down s={15} /></span>
            </a>
          </li>
        ))}
      </ul>
      {p.k === 'cli' && <p className="dl-all"><A to="https://github.com/hanzoai/cli/releases/latest">All builds and checksums →</A></p>}
    </article>
  );
}

function Builds({ os, br }) {
  return (
    <section className="av-sec dl-builds" id="builds">
      <div className="av-wrap">
        <div className="av-grid dl-b-top">
          <h2 className="av-display s dl-b-h">Every build</h2>
        </div>
        <div className="dl-bento">{PRODUCTS.map((p) => <Card key={p.k} p={p} os={os} br={br} />)}</div>
      </div>
    </section>
  );
}

/* ---------- Your kit (Beyond), the dark room: say what you use, get exactly your files ---------- */
// [label, Desktop build index (-1: none on Windows), CLI build index]; Linux x86_64 gets the AppImage, the deb stays in Every build
const SYSTEMS = [['macOS · Apple Silicon', 0, 0], ['macOS · Intel', 0, 1], ['Windows', -1, 2], ['Linux · x86_64', 1, 3], ['Linux · arm64', 3, 4]];
const SYS_OF = { mac: 0, win: 2, linux: 3, linuxarm: 4 };

function Pick({ label, list, at, set, id }) {
  return (
    <fieldset className="dl-q">
      <legend className="av-kick">{label}</legend>
      <div role="radiogroup" aria-label={label}>
        {list.map((t, i) => (
          <button key={t} type="button" role="radio" aria-checked={at === i} onClick={() => set(i)}>
            {at === i && <motion.span layoutId={id} className="dl-q-bg" transition={SPRING} />}
            <span>{t}</span>
          </button>
        ))}
      </div>
    </fieldset>
  );
}

function Kit({ os, br }) {
  const [sys, setSys] = useState(0);
  const [b, setB] = useState(0);
  const [ed, setEd] = useState(0);
  useEffect(() => { setSys(SYS_OF[os] ?? 0); }, [os]);
  useEffect(() => { setB(br); }, [br]);
  const desk = SYSTEMS[sys][1];
  const rows = [
    desk >= 0 && [PRODUCTS[0], PRODUCTS[0].builds[desk]],
    [PRODUCTS[1], PRODUCTS[1].builds[SYSTEMS[sys][2]]],
    [PRODUCTS[2], PRODUCTS[2].builds[b]],
    [PRODUCTS[3], PRODUCTS[3].builds[ed]],
  ].filter(Boolean);
  return (
    <section className="av-sec av-dark dl-kit" data-room="dark" aria-labelledby="dl-kit-h">
      <div className="av-wrap av-grid">
        <div className="dl-kit-l">
          <p className="av-kick">Your kit</p>
          <Lines as="h2" id="dl-kit-h" className="av-display s" lines={['Just your files']} />
          <Pick label="System" list={SYSTEMS.map((s) => s[0])} at={sys} set={setSys} id="dl-sys" />
          <Pick label="Browser" list={PRODUCTS[2].builds.map((x) => x[0])} at={b} set={setB} id="dl-br" />
          <Pick label="Editor" list={PRODUCTS[3].builds.map((x) => x[0])} at={ed} set={setEd} id="dl-ed" />
        </div>
        <div className="dl-kit-r">
          <ol className="dl-kit-list" aria-live="polite">
            {sys === 2 && <li className="dl-kit-note">Desktop ships for macOS and Linux; on Windows the one native build is the CLI.</li>}
            {rows.map(([p, [o, size, path]], i) => (
              <li key={p.k}>
                <a href={GH + path} className="dl-kit-a">
                  <span className="dl-kit-i x-mono av-num">{String(i + 1).padStart(2, '0')}</span>
                  <span className="dl-kit-n"><b>{p.name}</b><span>{o} · {p.v}</span></span>
                  <span className="dl-kit-f x-mono">{FILE(path)}</span>
                  <span className="dl-kit-s x-mono av-num">{size}</span>
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

function End() {
  return (
    <section className="av-sec tight dl-end">
      <div className="av-wrap av-grid">
        <p className="av-display s dl-end-t">One account signs in to all of them.</p>
        <div className="dl-end-a"><Go to="/chat" solid>Or open Hanzo in your browser</Go></div>
      </div>
    </section>
  );
}

export default function DownloadPage() {
  const { os, br } = useSystem();
  return (
    <main className="av dl" style={{ '--ac': '#a3a3a3' }}>
      <Hero os={os} />
      <Builds os={os} br={br} />
      <Kit os={os} br={br} />
      <End />
    </main>
  );
}
