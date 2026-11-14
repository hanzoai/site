'use client';
// Persona: an engineer moving secrets out of files and repos.
// Goal: see a secret sealed on the client, rotated deliberately and every read recorded.
// CTA: Open KMS (kms.hero, kms.mid, kms.close).
// Metric: cta_click kms.hero
// Signature: spotlight
// Beyond: Sealed on your machine: type into DATABASE_PASSWORD and real AES-256-GCM under an HKDF-SHA256 key seals it in the browser.
/* KMS (v2, archetype A Launch).
   Round 4 (7-8 Nov): the vault room, the five entrances and the light's masks are styled (they had shipped as markup
   only); the refused write takes v2's slot instead of covering it; the seal box seals on its own until the field is
   taken; the dark room's terminal types once; "Example project" reads as one caption; the hero ask's arrow slides in
   on hover with the button's width held.
   Motion map: spotlight — the pinned "What it holds" rule panel is gone; its six rules are six sealed secrets in
   a dark vault right under the hero: a light (the cursor, a tap on touch, Tab on a keyboard; left alone it glides cell
   to cell, pausable) unseals what is under it - the rule's title and its picture - and the readout beside it gives
   that rule in full. Sections enter five ways (kms/entrances.jsx): the hero vault's pieces gather like magnets, the
   vault opens through blinds, the seal box swings in on a pendulum, the dark room's tiles lift in a wave from the
   cursor, the tail arrives stretched by the scroll and relaxes. The h1 line cut-in, the vault's scroll settle, the
   dark room's scroll-opened card and its figure rise are removed (one entrance per section, nothing repeated).
   Earlier, Round 3: the tail is one KMS screen instead of three quiet white sections: on a quiet room the example
   console sits over the vault's own secret (DATABASE_PASSWORD v4 and its fingerprint) and the secret follows the
   console - hover, click or Enter on a project, or left alone it steps through the projects by pressing the console's
   own rows, with a hairline timing each step and a pause; the agent prompt sits beside it (wrapping, not clipped) and
   the related links are one hairline row under both; then one quiet Get KMS. The Beyond block uses only Hanzo's words
   (Sealed on your machine, the organization key line, DATABASE_PASSWORD as the field label; no IV, no prose of ours).
   Also: one 1152px container for every section; the pinned chapter h2 at 26px over 21px rule h3s; the phone pause
   clear of the production tag and the refused chip inside its box; 44px phone targets on the console and the close;
   a fade on the phone terminal's right edge; Documentation fills on hover and presses to .98.
   Round 2 (kept): the vault holds one height through its loop and tilts to a fine pointer.
   Hero object (kept): a secret, sealed and rotated. DATABASE_PASSWORD goes through Hanzo's chain (Argon2id, HKDF-SHA256,
   AES-256-GCM) and comes out as ciphertext; then it is rotated - each write names the version it replaces, so a second
   writer holding the old version is refused - and the read lands in the append-only record under the agent's name.
   Beyond: "Sealed on your machine" - type a value and your browser seals it with AES-256-GCM under a key derived with
   HKDF-SHA256 (WebCrypto), so you watch the ciphertext and the key never leaves the page; Argon2id, the passphrase step,
   is shown struck through because it is not run here.
   Greys only, from Hanzo's deck. Every word and link is Hanzo's. */
import { useCallback, useEffect, useRef, useState } from 'react';
import type { PointerEvent, ReactNode, SyntheticEvent } from 'react';
import { motion, AnimatePresence, useInView, useReducedMotion } from 'motion/react';
import { A, Cta, CodeBlock } from '../../kit';
import { Console, useLive } from './Frame';
import { useArrive, gather, Blinds, Pendulum, GridWave, Stretch } from './kms/entrances';
import GetIt from '../../v2/GetIt';
import LivePause, { usePause } from '../../v2/LivePause';
import '../../v2/v2scale.css';
import './Kms.css';

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
const CHAIN = ['Argon2id', 'HKDF-SHA256', 'AES-256-GCM'];
const HEX = '0123456789abcdef';
const noise = (n: number, s: number) => Array.from({ length: n }, (_, i) => HEX[(s * 31 + i * 17 + ((s + i) * (i + 3)) % 13) % 16]).join('');
const ROW = 60; // one version row (52px) plus its 8px gap

/* The version stack: three rows that slide by transform inside a fixed box, so the vault never changes height. */
function Versions({ v, top, stale }: { v: number; top: number; stale: boolean }) {
  // every version that can show stays mounted; each slides to its slot (above the box, 0, 1, 2, below the box)
  const rows = [top, top - 1, top - 2, top - 3];
  return (
    <div className="km-vers-in">
      {rows.map((n) => {
        const i = v - n;
        const shown = i >= 0 && i <= (stale ? 1 : 2); // a refused write takes the third slot, so v2 leaves for it
        return (
          <motion.div
            key={n}
            className={'km-ver' + (i === 0 ? ' cur' : '')}
            initial={false}
            animate={{ y: i * ROW, opacity: shown ? 1 - i * 0.3 : 0 }}
            transition={{ duration: 0.4, ease: EASE }}
          >
            <b>v{n}</b><span>{noise(10, n)}</span>{i === 0 && <em>current</em>}
          </motion.div>
        );
      })}
      <AnimatePresence>
        {stale && (
          <motion.div className="km-stale" style={{ y: 2 * ROW }} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.45, ease: EASE }}>
            <span>write replaces v{v - 1} · <b>refused</b></span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* The vault: seal, rotate, refuse a stale writer, record the read. */
function Vault() {
  const [ref, seen, calm] = useLive(0.3);
  const [paused, togglePause] = usePause();
  const live = seen && !paused;
  const [t, setT] = useState(0); // 0..3 sealing, 4 rotated, 5 stale writer refused, 6 read recorded
  const ver = 3;
  useEffect(() => { if (calm) setT(6); }, [calm]);
  useEffect(() => {
    if (calm || !live) return;
    const id = setTimeout(() => {
      if (t === 6) setT(0); else setT(t + 1);
    }, [1000, 900, 900, 1000, 1600, 1800, 2400][t]);
    return () => clearTimeout(id);
  }, [t, live, calm]);
  const sealed = t >= 3;
  const v = t >= 4 ? ver + 1 : ver;
  // pointer: the card leans up to 2.5 degrees toward a mouse (never on touch, never under reduced motion)
  const lean = (e: PointerEvent<HTMLDivElement>) => {
    if (calm || e.pointerType !== 'mouse') return;
    const r = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    e.currentTarget.style.setProperty('--km-ry', (px * 5).toFixed(2) + 'deg');
    e.currentTarget.style.setProperty('--km-rx', (-py * 5).toFixed(2) + 'deg');
  };
  const rest = (e: PointerEvent<HTMLDivElement>) => { e.currentTarget.style.setProperty('--km-ry', '0deg'); e.currentTarget.style.setProperty('--km-rx', '0deg'); };
  return (
    <div className="lp-host km-tilt" onPointerMove={lean} onPointerLeave={rest}>
    <LivePause paused={paused} onToggle={togglePause} className="km-pause" />
    <div className="km-vault" ref={ref} aria-hidden="true">
      <div className="km-secret km-mg" style={gather(2, 0.25)}>
        <p className="km-host">kms.hanzo.ai</p>
        <p className="km-path">DATABASE_PASSWORD <span>production</span></p>
        <p className={'km-val' + (sealed ? ' sealed' : '')}>{sealed ? noise(32, v) : '••••••••••••••••'}</p>
        <div className="km-chain">
          {CHAIN.map((c, i) => <span key={c} className={t > i ? 'on' : ''}><i />{c}</span>)}
        </div>
        <p className="km-client">the organization key stays on the client</p>
      </div>
      <div className="km-side">
        <div className="km-vers km-mg" style={gather(3, 0.25)}>
          <Versions v={v} top={ver + 1} stale={t === 5} />
        </div>
        <ul className="km-log km-mg" style={gather(4, 0.25)}>
          {t >= 6 && <li key={'r' + ver} className="in"><i className="a" />read · agent checkout-web</li>}
          {t >= 4 && <li key={'w' + ver} className="in"><i />rotate · v{v}</li>}
          <li><i />read · payments-api</li>
        </ul>
      </div>
    </div>
    </div>
  );
}

/* Beyond: seal one yourself (WebCrypto: HKDF-SHA256 then AES-256-GCM; the key is random and never leaves). */
const b64 = (u8: Uint8Array) => btoa(String.fromCharCode(...u8));
function Seal() {
  const [val, setVal] = useState('');
  const [out, setOut] = useState({ ct: '' });
  const [err, setErr] = useState('');
  const master = useRef<CryptoKey | null>(null);
  const [own, setOwn] = useState(false); // the visitor has the field: the idle sealing stops for good
  const [box, idle, calmSeal] = useLive(0.4);
  // left alone, the box seals on its own: dots type in at 80 ms each, the ciphertext rolls in under them, a rest, again
  useEffect(() => {
    if (own || calmSeal || !idle) return;
    const n = val.length;
    const id = setTimeout(() => setVal(n >= 8 ? '' : val + '•'), n >= 8 ? 2400 : n === 0 ? 900 : 80);
    return () => clearTimeout(id);
  }, [val, own, idle, calmSeal]);
  const take = () => { if (!own) { setOwn(true); setVal(''); } };
  useEffect(() => {
    let on = true;
    (async () => {
      try {
        const S = crypto.subtle;
        if (!master.current) master.current = await S.importKey('raw', crypto.getRandomValues(new Uint8Array(32)), 'HKDF', false, ['deriveKey']);
        const key = await S.deriveKey({ name: 'HKDF', hash: 'SHA-256', salt: new Uint8Array(16), info: new TextEncoder().encode('organization') }, master.current, { name: 'AES-GCM', length: 256 }, false, ['encrypt']);
        const iv = crypto.getRandomValues(new Uint8Array(12));
        const ct = new Uint8Array(await S.encrypt({ name: 'AES-GCM', iv }, key, new TextEncoder().encode(val)));
        if (on) setOut({ ct: b64(ct) });
      } catch { if (on) setErr('—'); } // no WebCrypto: an em dash, not a sentence of our own
    })();
    return () => { on = false; };
  }, [val]);
  return (
    <section className="v2-sec km-seal">
      <div className="v2-wrap v2-grid">
        <div className="km-seal-l">
          <h2 className="v2-headline">Sealed on your machine</h2>
          <p className="v2-body km-seal-d">The organization key stays on the client.</p>
        </div>
        <Pendulum className="km-seal-box v2-obj">
          <span ref={box} className="km-seal-anchor" aria-hidden="true" />
          <label className="km-seal-k" htmlFor="km-in">DATABASE_PASSWORD</label>
          <input id="km-in" value={val} onFocus={take} onChange={(e) => { setOwn(true); setVal(e.target.value); }} maxLength={200} placeholder="••••••••" spellCheck={false} autoComplete="off" suppressHydrationWarning />
          <div className="km-seal-chain" aria-hidden="true">
            <span className="off">Argon2id</span><i /><span>HKDF-SHA256</span><i /><span>AES-256-GCM</span>
          </div>
          <p className="km-ct" aria-live="polite">{err || out.ct}</p>
        </Pendulum>
      </div>
    </section>
  );
}

const RULES = [
  ['Sealed before it leaves you', "Argon2id turns a passphrase into a key, HKDF-SHA256 turns that into the organization's key, and AES-256-GCM seals the value. The organization key stays on the client. Sharing with a colleague wraps that same key to their public key using a hybrid post-quantum exchange, so nobody has to send anybody a secret to share one."],
  ['Into the process, not into a file', 'Run a command with the secrets already in its environment, export a dotenv when a tool insists on one, or let the Kubernetes operator keep a Secret in step with what KMS holds. The CLI also reads your repository and its git history looking for values that escaped.'],
  ['Replacing one is deliberate', 'Rotate is a command, and a write states the version it means to replace — so a second writer who read the old value is refused rather than quietly winning. Signing keys generate, sign and rotate through the same API, backed by threshold MPC.'],
  ['Who read it, when, and why', "Reads and writes land in an append-only record written by a single writer off the request path, so keeping it never slows a fetch. An AI agent's read is attributed to that agent by name, not to whichever human's key it borrowed."],
  ['One key, several languages', 'A CLI for a laptop and for CI. SDKs in Go, Node and Python over the same routes. In-cluster callers can take the binary ZAP transport instead of HTTP, and it enforces the identical token and role checks.'],
  ['Fail closed, or do not start', 'Every call carries a Hanzo IAM token verified against a cached JWKS; HMAC and alg none are refused outright. The organization comes from the verified token, never from a field the caller sets. Outside development the daemon will not boot without an issuer, an audience and a JWKS URL — there is no accidental open mode. A secret can be marked so that any agent read waits for a person to approve it, or is refused.'],
];

/* One rule as a picture, built from the vault's own parts and the rule's own words (spans: it sits inside a button). */
function Scene({ i }: { i: number }) {
  const L = (k: number, cls: string | undefined, body: ReactNode) => <span key={k} className={'km-sc-l ' + (cls || '')}>{body}</span>;
  const pages = [
    [
      <span key="c" className="km-sc-chain">{CHAIN.map((c) => <span key={c}><i />{c}</span>)}</span>,
      L(3, 'q', 'the organization key stays on the client'),
    ],
    [
      L(0, 'cmd', <><span className="km-sc-pr">$</span>kms run -- npm start</>),
      L(1, 'env', <>DATABASE_PASSWORD<b>=••••••••</b></>),
      L(2, 'q', 'kms export --format=dotenv'),
    ],
    [
      L(0, 'ver cur', <><b>v4</b>{noise(10, 4)}<em>current</em></>),
      L(1, 'ver', <><b>v3</b>{noise(10, 3)}</>),
      L(2, 'stale', <>write replaces v3 · <b>refused</b></>),
    ],
    [
      L(0, 'log', <><i />read · payments-api</>),
      L(1, 'log', <><i />rotate · v4</>),
      L(2, 'log on', <><i className="a" />read · agent checkout-web</>),
    ],
    [
      <span key="k" className="km-sc-chips">{['CLI', 'Go', 'Node', 'Python', 'ZAP'].map((c) => <span key={c}>{c}</span>)}</span>,
      L(5, 'q', 'kms.hanzo.ai'),
    ],
    [
      L(0, 'chk', <><i />issuer</>),
      L(1, 'chk', <><i />audience</>),
      L(2, 'chk', <><i />JWKS URL</>),
      L(3, 'stop', <>daemon · <b>will not boot</b></>),
    ],
  ];
  return <span className={'km-sc km-sc-' + i}>{pages[i]}</span>;
}

/* The signature: a dark vault of six sealed secrets, one per rule. A light (the cursor; a tap on touch; Tab on a
   keyboard; left alone it glides cell to cell, pausable) unseals whatever is under it: the cell's ciphertext gives way
   to the rule's title and its picture, and the readout beside the vault gives that rule in full. The light is two
   radial masks per cell (seal out, contents in) placed by CSS variables, so nothing reflows while it moves. */
function Holds() {
  const [sec, arrived] = useArrive(0.12);
  const box = useRef<HTMLDivElement>(null);
  const cells = useRef<(HTMLButtonElement | null)[]>([]);
  const geo = useRef<{ x: number; y: number; w: number; h: number }[]>([]);
  const calm = useReducedMotion();
  const seen = useInView(box, { amount: 0.2 });
  const [paused, togglePause] = usePause();
  const [at, setAt] = useState(0);
  const s = useRef({ x: 0, y: 0, tx: 0, ty: 0, at: 0, goal: 0, hand: false, next: 0, init: false });

  const paint = useCallback((x: number, y: number) => {
    const b = box.current;
    if (!b) return;
    b.style.setProperty('--lx', x.toFixed(1) + 'px');
    b.style.setProperty('--ly', y.toFixed(1) + 'px');
    let hit = -1, best = Infinity;
    geo.current.forEach((c, i) => {
      if (x >= c.x && x <= c.x + c.w && y >= c.y && y <= c.y + c.h) { hit = i; best = -1; return; }
      if (best < 0) return;
      const d = (x - c.x - c.w / 2) ** 2 + (y - c.y - c.h / 2) ** 2;
      if (d < best) { best = d; hit = i; }
    });
    if (hit >= 0 && hit !== s.current.at) { s.current.at = hit; setAt(hit); }
  }, []);
  const centre = (i: number): [number, number] => { const c = geo.current[i]; return c ? [c.x + c.w / 2, c.y + c.h / 2] : [0, 0]; };

  // measure the cells (their offsets place each cell's masks), and keep the light on its cell through a resize
  useEffect(() => {
    const b = box.current;
    if (!b) return;
    const measure = () => {
      geo.current = cells.current.map((c) => {
        if (!c) return { x: 0, y: 0, w: 0, h: 0 };
        c.style.setProperty('--cx', c.offsetLeft + 'px');
        c.style.setProperty('--cy', c.offsetTop + 'px');
        return { x: c.offsetLeft, y: c.offsetTop, w: c.offsetWidth, h: c.offsetHeight };
      });
      const st = s.current;
      if (!st.init || !st.hand) {
        const [x, y] = centre(st.init ? st.goal : 0);
        st.tx = x; st.ty = y;
        if (!st.init || calm) { st.x = x; st.y = y; }
        st.init = true;
      }
      paint(st.x, st.y);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(b);
    return () => ro.disconnect();
  }, [paint, calm]);

  // the light glides toward its target; left alone it visits the cells in turn and breathes a little on each
  useEffect(() => {
    if (calm || !seen) return;
    const st = s.current;
    let raf = 0, last = performance.now();
    if (!st.next) st.next = last + 2600;
    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (!st.hand && !paused) {
        if (now > st.next) { st.next = now + 3600; st.goal = (st.goal + 1) % RULES.length; }
        const [cx, cy] = centre(st.goal);
        st.tx = cx + Math.sin(now / 1300) * 14;
        st.ty = cy + Math.cos(now / 1700) * 10;
      }
      const k = 1 - Math.exp(-dt * (st.hand ? 10 : 3.2));
      const nx = st.x + (st.tx - st.x) * k, ny = st.y + (st.ty - st.y) * k;
      if (Math.abs(nx - st.x) + Math.abs(ny - st.y) > 0.05) { st.x = nx; st.y = ny; paint(nx, ny); }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [calm, seen, paused, paint]);

  // the hand takes the light for good: a mouse leads it, a tap or click places it, focus brings it to that cell
  const hand = (x: number, y: number) => {
    const st = s.current;
    st.hand = true; st.tx = x; st.ty = y;
    if (calm) { st.x = x; st.y = y; paint(x, y); }
  };
  const point = (e: { clientX: number; clientY: number }): [number, number] => {
    const r = box.current?.getBoundingClientRect();
    return r ? [e.clientX - r.left, e.clientY - r.top] : [0, 0];
  };

  return (
    <section ref={sec} className="km-holds v2-dark" data-room="dark">
      <Blinds on={arrived} />
      <div className="v2-wrap km-holds-g">
        <div className="km-holds-head">
          <h2 className="v2-headline km-holds-h">What it holds and how it holds it</h2>
          <p className="v2-body km-holds-lede">A secret is a value under a path, a name and an environment, inside one organization. That is the whole model.</p>
        </div>
        <div className="km-vaultroom">
          <LivePause paused={paused} onToggle={togglePause} dark inline className="km-field-pause" />
          <div
            ref={box}
            className="km-field"
            onPointerMove={(e) => e.pointerType !== 'touch' && hand(...point(e))}
            onClick={(e) => e.detail > 0 && hand(...point(e))}
          >
            {RULES.map(([t], i) => (
              <button
                key={t}
                type="button"
                ref={(el) => { cells.current[i] = el; }}
                className={'km-cell' + (at === i ? ' lit' : '')}
                aria-label={t}
                aria-describedby={'km-rd' + i}
                aria-pressed={at === i}
                onFocus={(e) => { if (e.currentTarget.matches(':focus-visible')) hand(...centre(i)); }}
              >
                <span className="km-cell-n">{String(i + 1).padStart(2, '0')}</span>
                <span className="km-cell-seal" aria-hidden="true">{[0, 1, 2, 3].map((k) => <span key={k}>{noise(22, i * 4 + k + 7)}</span>)}</span>
                <span className="km-cell-open" aria-hidden="true">
                  <span className="km-cell-t">{t}</span>
                  <Scene i={i} />
                </span>
              </button>
            ))}
          </div>
        </div>
        <div className="km-read">
          {RULES.map(([t, d], i) => (
            <div key={t} id={'km-rd' + i} className={'km-read-i' + (at === i ? ' on' : '')}>
              <p className="km-read-n"><b>{String(i + 1).padStart(2, '0')}</b> / 06</p>
              <h3 className="v2-title">{t}</h3>
              <p className="v2-body">{d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const FIGS: [string, string][] = [['AES-256', 'Sealed on your machine'], ['K8s', 'Secrets kept in step'], ['Every read recorded', ''], ['MIT', 'Run it yourself']];
const CLI = `# Sign in, then point this directory at a path
kms login
kms init
# Start the process with its secrets already in the environment
kms run -- npm start
# ...or write a dotenv, for a tool that insists on one
kms export --format=dotenv
# Replace a value
kms rotate DATABASE_PASSWORD
# Find the ones that already escaped, here and in git history
kms scan`;

/* The dark room: its tiles lift away in a wave from the cursor as it arrives (grid-wave). */
function Disk() {
  const [ref, on] = useArrive(0.2);
  const cli = useRef<HTMLDivElement>(null);
  const typing = useInView(cli, { once: true, amount: 0.4 });
  return (
    <section ref={ref} className="km-disk v2-dark" data-room="dark">
      <GridWave on={on} />
      <div className="v2-wrap">
        <ul className="km-figs">
          {FIGS.map(([a, b], i) => <li key={a} className={b ? '' : 'big'} style={{ '--d': i }}><b><span>{a}</span></b>{b && <span>{b}</span>}</li>)}
        </ul>
        <div className="km-disk-g">
          <div className="km-disk-l">
            <h2 className="v2-display s">Nothing lands on disk</h2>
            <h3 className="v2-title km-out-h">Take them out of the repo</h3>
            <p className="v2-body">Use it hosted, or run the same binary yourself. The source is MIT and the client is where the encryption happens either way.</p>
            <div className="v2-acts"><Cta to="https://kms.hanzo.ai" id="kms.mid">Open KMS</Cta><Cta to="https://github.com/hanzoai/kms" kind="link" id="kms.view-on-github">View on GitHub</Cta></div>
          </div>
          <div ref={cli} className={'km-cli-w' + (typing ? ' on' : '')}><CodeBlock code={CLI} label="terminal" className="km-cli" /></div>
        </div>
      </div>
    </section>
  );
}

/* The tail as one KMS screen: the example project's console on the left with the vault's own secret under it, the
   agent prompt on the right, the related links as one hairline row under both. The secret strip follows the console:
   hover, click or Enter on a project and the strip shows that service reading DATABASE_PASSWORD v4 (the same version
   and fingerprint the vault rotated to); left alone it steps through the projects by pressing the console's own rows. */
const SVC = ['gateway', 'payments-api', 'checkout-web', 'docs-site'];
const SIDE: [string, string][] = [['KMS', '/kms'], ['IAM', '/iam'], ['Authz', '/authz'], ['Secrets', '/cloud/secrets'], ['Audit', '/cloud/audit'], ['Zero Trust', '/cloud/zero-trust']];
const RELATED: [string, string, string][] = [['IAM', '/iam', 'OIDC identity & orgs'], ['Authz', '/authz', 'Fine-grained access'], ['Secrets', '/cloud/secrets', 'Store once, sync everywhere']];
const PROMPT = 'Read https://hanzo.ai/skill.md and use Hanzo KMS in my project. Start with: hanzo kms secrets create';
const arrow = <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>;

function Ship() {
  const wrap = useRef<HTMLDivElement>(null);
  const [ref, live, calm] = useLive(0.4);
  const [paused, togglePause] = usePause();
  const [at, setAt] = useState(0);
  const [mine, setMine] = useState(false); // once the hand has chosen a project, the strip stops stepping
  const [hold, setHold] = useState(false); // a mouse over the console holds the step
  const run = live && !paused && !mine && !hold;
  const follow = (e: SyntheticEvent<HTMLElement>, chose: boolean) => {
    const li = e.target instanceof Element ? e.target.closest('li[role="option"]') : null;
    if (!li || !wrap.current || !wrap.current.contains(li)) return;
    const i = SVC.indexOf(li.querySelector('.cf-name')?.textContent ?? '');
    if (i < 0) return;
    setAt(i);
    if (chose && e.nativeEvent.isTrusted) setMine(true);
  };
  useEffect(() => {
    if (!run) return;
    const id = setTimeout(() => {
      const n = (at + 1) % SVC.length;
      const rows = wrap.current ? wrap.current.querySelectorAll<HTMLElement>('li[role="option"]') : [];

      if (rows[n]) rows[n].click(); // the console's own row takes the highlight (an untrusted click: no sound)
      setAt(n);
    }, 2600);
    return () => clearTimeout(id);
  }, [at, run]);
  const svc = SVC[at];
  return (
    <section className="v2-sec km-ship">
      <Stretch className="v2-wrap km-ship-g">
        <div className="km-ship-c" ref={ref}>
          <div
            ref={wrap}
            className="km-ship-con"
            onMouseOver={(e) => follow(e, false)}
            onClick={(e) => follow(e, true)}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && follow(e, true)}
            onPointerEnter={(e) => e.pointerType === 'mouse' && setHold(true)}
            onPointerLeave={() => setHold(false)}
          >
            <Console light name="KMS" api="/v1/kms" cap="The service the session above is changing." side={SIDE} />
          </div>
          <div className="km-key">
            <LivePause paused={paused} onToggle={togglePause} dark inline className="km-key-pause" />
            <div className="km-key-in" aria-hidden="true">
              <span className="km-key-name">DATABASE_PASSWORD<em>production</em></span>
              <span className="km-key-v"><b>v4</b>{noise(10, 4)}</span>
              <span className="km-key-read">
                <i />
                <span className="km-roll km-key-roll">
                  <AnimatePresence mode="popLayout" initial={false}>
                    <motion.span key={svc} initial={{ y: '105%' }} animate={{ y: '0%' }} exit={{ y: '-105%' }} transition={{ duration: 0.4, ease: EASE }}>
                      {svc}
                    </motion.span>
                  </AnimatePresence>
                </span>
              </span>
            </div>
            {!calm && <i key={'run' + at + (run ? 'r' : 'h')} className={'km-key-run' + (run ? '' : ' held')} aria-hidden="true" />}
          </div>
          <div className="km-ship-cap">
            <p className="v2-body km-cap-s">Example project. Every name in it is one you would give your own.</p>
            <p className="v2-kick acc km-cap">Example project</p>
          </div>
        </div>
        <div className="km-ship-p">
          <h2 className="v2-headline km-ship-h">Paste and ship</h2>
          <p className="v2-body">Paste this into any agent. It reads the skill manifest and calls KMS from there.</p>
          <p className="km-api"><i>api</i>/v1/kms</p>
          <CodeBlock code={PROMPT} label="Agent prompt" className="km-prompt" />
        </div>
        <nav className="km-rel" aria-label="Related capabilities">
          <p className="v2-kick">Related capabilities</p>
          <ul>
            {RELATED.map(([t, to, d]) => (
              <li key={t}><A to={to} className="km-rel-a"><b>{t}</b><span>{d}</span>{arrow}</A></li>
            ))}
          </ul>
        </nav>
      </Stretch>
    </section>
  );
}

export default function Kms() {
  return (
    <main className="v2 km">
      <section className="km-hero">
        <div className="v2-wrap km-hero-t">
          <h1 className="v2-display km-h1" data-morph-target="">Hanzo KMS</h1>
          <div className="km-hero-row">
            <p className="v2-lede km-sub km-mg" style={gather(0)}>Secrets management</p>
            <div className="v2-acts km-mg" style={gather(1)}>
              <Cta to="https://kms.hanzo.ai" id="kms.hero" thumb>Open KMS</Cta>
              <Cta to="https://docs.hanzo.ai/docs/openapi/kms/" kind="quiet" id="kms.documentation">Documentation</Cta>
            </div>
          </div>
        </div>
        <div className="v2-wrap km-lift">
          <Vault />
        </div>
      </section>

      <Holds />

      <Seal />

      <Disk />

      <Ship />

      <GetIt className="km-get" name="KMS" tag="Secrets + key management" seed="kms" data={[256, 3, 6]} repo={['hanzoai/kms', 'https://github.com/hanzoai/kms']} stars="3 stars" ask={['Open KMS', 'https://kms.hanzo.ai', 'kms.close']} />
    </main>
  );
}
