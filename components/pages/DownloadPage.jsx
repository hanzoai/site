'use client';
/* Download Hanzo. Signature: one button that knows your OS. It reads your system and offers its build; every other
   download fans out around it on an orbit, each one telling you its product, version and size when you point at it.
   Below, every build sits in a release sheet you can scan, with the CLI's install lines ready to copy. Beyond: "Your
   kit" - say which system, browser and editor you use and the page lays out exactly your files, one per product, each
   with its own size and link (no Desktop on Windows, as Hanzo ships it). Every word, size and link is Hanzo's. */
import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'motion/react';
import { EASE, Rise, Copy, Magnetic } from '../ui';
import { A, Go, SecHead } from '../kit';
import './DownloadPage.css';

const GH = 'https://github.com/hanzoai/';
const PRODUCTS = [
  {
    k: 'desk', name: 'Desktop', v: 'v1.1.52',
    d: 'A native app with a global hotkey. Talk to Hanzo from any window, capture a region of the screen, and put the answer back where you were typing.',
    builds: [
      ['macOS', '600 MB', 'desktop/releases/download/v1.1.52/Hanzo.Desktop_1.1.52_universal.dmg'],
      ['Linux (AppImage)', '732 MB', 'desktop/releases/download/v1.1.52/Hanzo.Desktop_1.1.52_amd64.AppImage'],
      ['Linux (deb)', '568 MB', 'desktop/releases/download/v1.1.52/Hanzo.Desktop_1.1.52_amd64.deb'],
      ['Linux (arm64)', '701 MB', 'desktop/releases/download/v1.1.52/Hanzo.Desktop_1.1.52_aarch64.AppImage'],
    ],
  },
  {
    k: 'cli', name: 'Hanzo CLI', v: 'v8.5.910',
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
    k: 'ext', name: 'Browser extension', v: 'v1.9.31',
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

/* Which build is yours. Desktop ships for macOS and Linux; on Windows the one native build is the CLI. */
function useOs() {
  const [os, setOs] = useState('mac'); // the page ships with macOS, as hanzo.ai does
  useEffect(() => {
    const p = ((navigator.userAgentData && navigator.userAgentData.platform) || navigator.platform || navigator.userAgent || '').toLowerCase();
    const ua = navigator.userAgent.toLowerCase();
    if (/win/.test(p)) setOs('win');
    else if (/linux|x11/.test(p) && !/android/.test(ua)) setOs(/aarch64|arm/.test(ua) ? 'linuxarm' : 'linux');
  }, []);
  return os;
}
const MAIN = {
  mac: ['macOS', 0, 0], linux: ['Linux', 0, 1], linuxarm: ['Linux', 0, 3], win: ['Windows', 1, 2],
};

const Glyph = ({ k }) => (
  <svg viewBox="0 0 16 16" width="15" height="15" aria-hidden="true">
    {k === 'desk' && <><rect x="1.5" y="2.5" width="13" height="9" rx="1.6" fill="none" stroke="currentColor" strokeWidth="1.3" /><path d="M5.5 14h5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /></>}
    {k === 'cli' && <><rect x="1.5" y="2.5" width="13" height="11" rx="1.6" fill="none" stroke="currentColor" strokeWidth="1.3" /><path d="m4.5 6.5 2 1.5-2 1.5M8 10h3.5" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" /></>}
    {k === 'ext' && <path d="M6 2.5h4v2a1.2 1.2 0 1 0 2.4 0v-.5h1.1v4h-.5a1.2 1.2 0 1 0 0 2.4h.5v3.1H2.5V3.5H6z" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />}
    {k === 'ed' && <path d="m5.5 4.5-3.5 3.5 3.5 3.5M10.5 4.5 14 8l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />}
  </svg>
);

/* The orbit: every other build, fanned out around the one button. */
function Fan({ os }) {
  const [, mp, mb] = MAIN[os];
  const ring = PRODUCTS.flatMap((p, pi) => p.builds.map((b, bi) => ({ p, b, pi, bi }))).filter((x) => !(x.pi === mp && x.bi === mb));
  const ref = useRef(null);
  const seen = useInView(ref, { once: true, amount: 0.3 });
  const [hot, setHot] = useState(-1);
  const N = ring.length;
  const main = PRODUCTS[mp].builds[mb];
  return (
    <div className="dl-fan" ref={ref}>
      <svg className="dl-orbit" viewBox="0 0 1000 520" preserveAspectRatio="none" aria-hidden="true">
        <ellipse cx="500" cy="260" rx="470" ry="228" />
        <ellipse className="run" cx="500" cy="260" rx="470" ry="228" />
      </svg>
      <ul className="dl-ring">
        {ring.map(({ p, b }, i) => {
          const a = (i / N) * Math.PI * 2 - Math.PI / 2;
          const x = Math.round(Math.cos(a) * 4700) / 100, y = Math.round(Math.sin(a) * 4400) / 100; // % of the stage, on the orbit (rounded: server and browser print the same style)
          return (
            <motion.li
              key={p.k + b[0]}
              className={'dl-chip k-' + p.k + (hot === i ? ' hot' : '')}
              style={{ left: 50 + x + '%', top: 50 + y + '%' }}
              initial={{ opacity: 0, x: Math.round(-x * 9), y: Math.round(-y * 5), scale: 0.4 }}
              animate={seen ? { opacity: 1, x: 0, y: 0, scale: 1 } : {}}
              transition={{ type: 'spring', stiffness: 140, damping: 18, delay: 0.25 + i * 0.035 }}
            >
              <a href={GH + b[2]} onPointerEnter={() => setHot(i)} onPointerLeave={() => setHot(-1)} onFocus={() => setHot(i)} onBlur={() => setHot(-1)} style={{ animationDelay: -i * 0.7 + 's' }}>
                <span className="dl-chip-i"><Glyph k={p.k} /></span>
                <span className="dl-chip-t">{b[0]}</span>
                <span className="dl-tip"><b>{p.name}</b><span className="x-mono">{p.v} · {b[1]}</span></span>
              </a>
            </motion.li>
          );
        })}
      </ul>
      <motion.div className="dl-core" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.9, ease: EASE, delay: 0.2 }}>
        <Magnetic strength={0.18}>
          <motion.a href={GH + main[2]} className="dl-main" data-thumb={'Download for ' + MAIN[os][0]} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <svg viewBox="0 0 16 16" width="22" height="22" aria-hidden="true"><path d="M8 2.5v8M4.5 7 8 10.5 11.5 7M3 13.5h10" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>
            <span>Download for {MAIN[os][0]}</span>
          </motion.a>
        </Magnetic>
        <p className="dl-main-s x-mono"><span>{mp === 0 ? 'Desktop' : PRODUCTS[mp].name}</span> · <span>{PRODUCTS[mp].v}</span> · <span>{main[1]}</span></p>
        <div className="dl-main-l">
          <A to="#builds">Every build</A>
          <A to="/chat">Or open Hanzo in your browser</A>
        </div>
      </motion.div>
    </div>
  );
}

function Hero() {
  const os = useOs();
  return (
    <section className="dl-hero" aria-labelledby="dl-h1">
      <div className="x-wrap">
        <div className="dl-head">
          <motion.p className="x-kick" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: EASE }}>Download</motion.p>
          <h1 id="dl-h1" className="dl-h1"><span className="x-line"><motion.span className="x-line-in" initial={{ y: '105%' }} animate={{ y: 0 }} transition={{ duration: 1.1, ease: EASE, delay: 0.05 }}>Download Hanzo</motion.span></span></h1>
          <motion.p className="dl-lede" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: EASE, delay: 0.3 }}>The desktop app, the CLI, and the extension for your browser and editor. One account signs in to all of them.</motion.p>
        </div>
        <Fan os={os} />
      </div>
    </section>
  );
}

/* Each product's moving picture in the release sheet. */
function Art({ k }) {
  if (k === 'desk') return <div className="dl-art dl-art-desk" aria-hidden="true"><span className="dl-kbd"><i /><i /></span><i className="dl-pop"><b /><b /></i></div>;
  if (k === 'cli') return <div className="dl-art dl-art-cli x-mono" aria-hidden="true"><span>$ hanzo</span><i /></div>;
  if (k === 'ext') return <div className="dl-art dl-art-ext" aria-hidden="true"><span className="dl-bar"><i /><b /></span><span className="dl-panel"><b /><b /><b /></span></div>;
  return <div className="dl-art dl-art-ed" aria-hidden="true"><b /><b className="ghost" /><b /><b className="short" /></div>;
}

function Product({ p, i }) {
  return (
    <Rise className={'dl-prod k-' + p.k} delay={0.05}>
      <div className="dl-prod-l">
        <Art k={p.k} />
        <div className="dl-prod-h">
          <h2>{p.name}</h2>
          <span className="dl-v x-mono">{p.v}</span>
        </div>
        <p>{p.d}</p>
        {p.k === 'cli' && (
          <div className="dl-cmds">
            {['curl -fsSL hanzo.sh | sh', 'npm i -g hanzo'].map((c) => (
              <div key={c} className="dl-cmd"><code className="x-mono">{c}</code><Copy text={c} /></div>
            ))}
          </div>
        )}
      </div>
      <ul className="dl-rows">
        {p.builds.map(([n, s, path], j) => (
          <motion.li key={n + j} initial={{ opacity: 0, x: 16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.6 }} transition={{ duration: 0.6, ease: EASE, delay: j * 0.05 }}>
            <a href={GH + path} className="dl-row">
              <span className="dl-row-n">{n}</span>
              <span className="dl-row-f x-mono">{FILE(path)}</span>
              <span className="dl-row-s x-mono">{s}</span>
              <span className="dl-row-b">Download<svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M8 3v7.5M4.8 7.5 8 10.7l3.2-3.2M3.5 13h9" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
            </a>
          </motion.li>
        ))}
        {p.k === 'cli' && <li className="dl-all"><A to="https://github.com/hanzoai/cli/releases/latest">All builds and checksums →</A></li>}
      </ul>
    </Rise>
  );
}

// [label, Desktop build index (-1: none on Windows), CLI build index] into PRODUCTS[0].builds and PRODUCTS[1].builds;
// Linux x86_64 gets the AppImage, and the deb stays beside it in Every build
const SYSTEMS = [['macOS · Apple Silicon', 0, 0], ['macOS · Intel', 0, 1], ['Windows', -1, 2], ['Linux · x86_64', 1, 3], ['Linux · arm64', 3, 4]];

function Kit() {
  const [sys, setSys] = useState(0);
  const [br, setBr] = useState(0);
  const [ed, setEd] = useState(0);
  const desk = SYSTEMS[sys][1];
  const rows = [
    desk >= 0 && [PRODUCTS[0], PRODUCTS[0].builds[desk]],
    [PRODUCTS[1], PRODUCTS[1].builds[SYSTEMS[sys][2]]],
    [PRODUCTS[2], PRODUCTS[2].builds[br]],
    [PRODUCTS[3], PRODUCTS[3].builds[ed]],
  ].filter(Boolean);
  const pick = (label, list, at, set) => (
    <fieldset className="dl-kit-q">
      <legend>{label}</legend>
      <div role="radiogroup" aria-label={label}>{list.map((t, i) => <button key={t} type="button" role="radio" aria-checked={at === i} onClick={() => set(i)}>{t}</button>)}</div>
    </fieldset>
  );
  return (
    <section className="x-sec dl-kit">
      <div className="x-wrap dl-kit-grid">
        <div>
          <p className="x-kick">Your kit</p>
          <h2>Just your files</h2>
          {pick('System', SYSTEMS.map((s) => s[0]), sys, setSys)}
          {pick('Browser', PRODUCTS[2].builds.map((b) => b[0]), br, setBr)}
          {pick('Editor', PRODUCTS[3].builds.map((b) => b[0]), ed, setEd)}
        </div>
        <ul className="dl-kit-list" aria-live="polite">
          {sys === 2 && <li className="dl-kit-note">Desktop ships for macOS and Linux; on Windows the one native build is the CLI.</li>}
          {rows.map(([p, [os, size, path]]) => (
            <li key={p.k}>
              <a href={GH + path} className="dl-kit-a">
                <span className="dl-kit-n"><b>{p.name}</b><span>{os} · {p.v}</span></span>
                <span className="dl-kit-f x-mono">{FILE(path)}</span>
                <span className="dl-kit-s x-mono">{size}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default function DownloadPage() {
  return (
    <main className="dl">
      <Hero />
      <Kit />
      <section className="x-sec dl-builds" id="builds">
        <div className="x-wrap">
          <SecHead title="Every build" />
          <div className="dl-prods">{PRODUCTS.map((p, i) => <Product key={p.k} p={p} i={i} />)}</div>
        </div>
      </section>
      <section className="dl-end">
        <div className="x-wrap dl-end-in">
          <p className="dl-end-t">One account signs in to all of them.</p>
          <div className="dl-end-a"><Go to="/chat" solid>Or open Hanzo in your browser</Go></div>
        </div>
      </section>
    </main>
  );
}
