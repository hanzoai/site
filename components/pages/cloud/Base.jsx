'use client';
/* Base.
   V2: 8/10 Signature zoom-map: the whole Base backend drawn as one map (admin, collection, Data, Auth, Files and the stream around the one binary and its SQLite file); scroll zooms into the collection, which fills the screen and declares itself with your typed name; pinned build-up, line masks on section heads and the hero settle removed; order hero, map, pillars, run, cards, close.
   Persona: a developer who needs an app backend (data, users, files, live updates) without wiring one together.
   Goal: see that one binary and one file is the whole backend, then sign in or read the docs.
   CTA: "Try Hanzo" → /login (solid, data-cta base.hero, data-thumb); "Read the docs" → docs.hanzo.ai/…/base (link,
        base.hero-2); "View on GitHub" → github.com/hanzoai/base (link, base.hero-3); "Deploy on Hanzo Cloud" →
        platform.hanzo.ai (solid in its own screen, base.run); "GitHub" (link, base.run-2); "Deploy to Cloud" →
        platform.hanzo.ai/deploy (solid in the close, base.close); "Self-host" (link, base.close-self).
   Metric: api_key_created (developers; the hero click is cta_click base.hero).
   Signature: zoom-map (MOTION-MAP "Zoom into the system"). The second screen is the whole system as one map: the
   single Go binary in the middle, its SQLite file under it, and around it the admin, Data (the records path), Auth is
   Hanzo IAM, Files and the one stream, and the collection. Hanzo's "Base is a single Go binary…" sentence stands beside
   it. Scrolling zooms the camera from the whole map into the collection (scale and position only, one transform),
   until the collection fills the screen and declares itself: "Declare a collection, get an API", the field where you
   name it, the fields, "exists" and the four things it does the moment it exists. Phones zoom the same map, portrait.
   The collection node is a button (and the name field scrolls the camera in when focused), so the zoom is reachable
   by keyboard. Reduced motion: no zoom; the map stands whole with the declared collection under it.
   Supporting: the hero admin (records land idle; a hovered row shows its record path), Data / Auth / Files as plain
   rows with their drawings, "Run the binary" (the same Base in four places), capability cards that open into a sheet
   with a shared-element morph and play their drawing once on arrival, and the closing dark room. One reveal style:
   only the hero h1 (and the shared close) cut in; section heads stand.
   Beyond: "Your collection": the name you type is the collection the map zooms into, its records path
   /v1/collections/{name}/records, the stream's rows, and the four places in "Run the binary".
   Entrances: split-merge (the map section: Hanzo's sentence from the left, the map from the right, meeting), snap-sections
   (Data / Auth / Files: each row snaps up one step into place), tile-flip ("Run the binary": the deploy window's parts
   flip in as tiles), pull-back ("What you get": starts zoomed in and pulls back to the whole grid), venetian-type (the
   close: each line of type slides in from alternating sides).
   Every word and link is Hanzo's; example rows are blank bars and ids, never invented data. */
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useScroll, useMotionValueEvent } from 'motion/react';
import useCalm from '../../v2/useCalm';
import { A, Cta } from '../../kit';
import { useLive } from './Frame';
import { scrollToY } from '../../../lib/scroll';
import KeynoteStage, { useStagePause } from '../../v2/KeynoteStage';
import KeynoteOpen from '../../v2/KeynoteOpen';
import KeynoteClose from '../../v2/KeynoteClose';
import { useWide } from '../../v2/KeynoteChapters';
import './Base.css';

const DOCS = 'https://docs.hanzo.ai/docs/projects/hanzoai/base';
const GH = 'https://github.com/hanzoai/base';
const FIELDS = [['title', 'text'], ['body', 'text'], ['author', 'relation'], ['published', 'bool']];
const hex = (n) => ((n * 2654435761) >>> 0).toString(16).padStart(8, '0').slice(0, 8);
const useIso = typeof window === 'undefined' ? useEffect : useLayoutEffect;

/* Entrances (MOTION-MAP rule 7): each main section arrives its own way, once, when it first comes into view. The
   server HTML is the final state; after mount a section below the fold is armed (data-arm: its start state, set in
   Base.css per entrance) and data-in plays it back to rest. Reduced motion and JS off: nothing is armed. */
function useEntrance() {
  const ref = useRef(null);
  const calm = useCalm();
  useEffect(() => {
    const el = ref.current;
    if (!el || calm || typeof IntersectionObserver === 'undefined') return;
    if (el.getBoundingClientRect().top < window.innerHeight * 0.85) return; // already on screen: stands
    el.setAttribute('data-arm', '');
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      el.setAttribute('data-in', '');
      io.disconnect();
    }, { threshold: 0, rootMargin: '0px 0px -18% 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, [calm]);
  return ref;
}

/* The hero object: the Base admin, a collection's records arriving live. Records / Schema switch the view. */
function Admin() {
  const [ref, live] = useLive(0.25);
  const paused = useStagePause();
  const [view, setView] = useState(0);
  const [n, setN] = useState(9);
  // pointer: the row under the cursor shows its own record path in the address pill
  const [hov, setHov] = useState(null);
  const run = live && view === 0 && !paused && hov === null;
  useEffect(() => {
    if (!run) return;
    const t = setTimeout(() => setN((v) => v + 1), n === 9 ? 600 : 2600); // the first record lands within a second
    return () => clearTimeout(t);
  }, [run, n]);
  return (
    <div className="kn-obj bs-adm" ref={ref}>
      <div className="bs-adm-bar">
        <i /><i /><i />
        <span className="bs-adm-t">base</span>
        <code className={'bs-adm-url' + (hov !== null ? ' one' : '')}><b>GET</b> /v1/collections/posts/records{hov !== null && <em>/{hex(hov)}</em>}</code>
      </div>
      <div className="bs-adm-b">
        <div className="bs-adm-side" aria-hidden="true">
          <p className="bs-adm-k">collections</p>
          {['posts', 'users', 'files'].map((c, i) => <span key={c} className={i === 0 ? 'on' : ''}><i />{c}</span>)}
          <p className="bs-adm-live"><i />live</p>
        </div>
        <div className="bs-adm-main">
          <div className="bs-adm-h">
            <b>posts</b>
            <div className="bs-adm-tabs" role="group" aria-label="Collection">
              {['Records', 'Schema'].map((t, i) => <button key={t} type="button" aria-pressed={view === i} onClick={() => setView(i)}>{t}</button>)}
            </div>
          </div>
          {view === 0 ? (
            <div className="bs-tbl" aria-hidden="true">
              <div className="bs-tr bs-th"><span>id</span>{FIELDS.slice(0, 1).concat(FIELDS.slice(2)).map(([f]) => <span key={f}>{f}</span>)}</div>
              <div className="bs-rows" key={n} onMouseLeave={() => setHov(null)}>
                {Array.from({ length: 8 }, (_, i) => n - i).map((id, i) => (
                  <div key={id} className={'bs-tr' + (i === 0 ? ' new' : '') + (hov === id ? ' hov' : '')} onMouseEnter={() => setHov(id)}>
                    <code>{hex(id)}</code>
                    <span><i style={{ width: 38 + ((id * 29) % 50) + '%' }} /></span>
                    <span className="bs-au"><b /><code>{hex(id * 7 + 3).slice(0, 4)}</code></span>
                    <span><em className={id % 3 ? 'on' : ''} /></span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <ul className="bs-sch">
              {FIELDS.map(([f, t]) => <li key={f}><code>{f}</code><em>{t}</em></li>)}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

const SERVES = ['your data', 'your users', 'your files', 'live updates', 'scheduled work'];
const PROMISES = ['answers over HTTP', 'carries an access rule', 'streams its changes', 'shows up in the admin'];
const PILLARS = [
  ['Data', 'Records answer at /v1/collections/{name}/records — list, read, create, update, delete, with paging, sorting and a filter language over every field you declared. Schema changes are migrations. SQLite is the default store; hand Base a Postgres DSN and the same API runs on that instead.'],
  ['Auth is Hanzo IAM', 'Base keeps no password and has no login form. It verifies the token IAM signed and reads the identity out of it — that is the whole of authentication. One account everywhere Hanzo runs, and no reset flow of your own to get wrong.'],
  ['Files and live updates', 'Uploads go to object storage and are served through the same rule that guards the record pointing at them. Clients open one stream and receive records as they change, so a page stays current without asking again every few seconds.'],
];

/* the map's layout, in its own units: [x, y, w, h] per part. Wide is landscape, narrow is portrait (phones). */
const MAP = {
  wide: { W: 1200, H: 700, n: { coll: [470, 20, 260, 214], admin: [30, 50, 330, 220], data: [840, 40, 330, 200], bin: [480, 290, 240, 160], iam: [30, 440, 330, 190], live: [840, 400, 330, 250], file: [470, 520, 260, 150] } },
  narrow: { W: 600, H: 1080, n: { coll: [160, 10, 280, 214], admin: [10, 270, 280, 200], data: [310, 270, 280, 200], bin: [180, 510, 240, 160], iam: [10, 710, 280, 180], live: [310, 710, 280, 230], file: [160, 950, 280, 120] } },
};
const at = (r) => ({ left: r[0], top: r[1], width: r[2], height: r[3] });
const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const clamp = (v) => Math.max(0, Math.min(1, v));

/* The signature: the whole system as one map; scroll zooms into the collection, which fills the screen and declares
   itself. One transform on the map (scale + translate), written straight to the DOM from the scroll position. */
function ZoomMap({ name, setName }) {
  const run = useRef(null);
  const stage = useRef(null);
  const map = useRef(null);
  const say0 = useRef(null);
  const say = useRef(null);
  const geo = useRef(null);
  const ent = useEntrance();
  const wide = useWide();
  const calm = useCalm();
  const coll = name || 'posts';
  const L = wide ? MAP.wide : MAP.narrow;
  const { scrollYProgress: p } = useScroll({ target: run, offset: ['start start', 'end end'] });

  const paint = useCallback((v) => {
    const g = geo.current;
    if (!g || !map.current) return;
    const t = calm ? 0 : ease(clamp(v / 0.6));
    const s = g.s0 * Math.pow(g.s1 / g.s0, t);
    const fx = g.f0[0] + (g.f1[0] - g.f0[0]) * t;
    const fy = g.f0[1] + (g.f1[1] - g.f0[1]) * t;
    map.current.style.transform = `translate3d(${fx - g.fc[0] * s}px, ${fy - g.fc[1] * s}px, 0) scale(${s})`;
    if (calm) return;
    const o = clamp((v - 0.6) / 0.1);
    if (say.current) { say.current.style.opacity = o; say.current.toggleAttribute('data-on', o > 0.5); }
    if (say0.current) say0.current.style.opacity = 1 - clamp(v / 0.2);
  }, [calm]);

  // measure the stage and work out the two cameras: the whole map, and the collection filling the screen
  useIso(() => {
    const el = stage.current;
    if (!el) return;
    const measure = () => {
      const sw = el.clientWidth, sh = el.clientHeight;
      const r = wide && !calm ? { x: sw * 0.44, y: 32, w: sw * 0.56 - 32, h: sh - 64 } : { x: 12, y: 16, w: sw - 24, h: sh - 32 };
      const s0 = Math.min(r.w / L.W, r.h / L.H);
      const ox = r.x + (r.w - L.W * s0) / 2, oy = r.y + (r.h - L.H * s0) / 2;
      const c = L.n.coll;
      const fc = [c[0] + c[2] / 2, c[1] + c[3] / 2];
      // wide: the card fills the stage (cover); phones: it fills the width and stays whole, so no word is cut mid-zoom
      geo.current = { s0, s1: wide ? Math.max(sw / c[2], sh / c[3]) * 1.04 : Math.min((sw - 24) / c[2], (sh - 32) / c[3]), fc, f0: [ox + fc[0] * s0, oy + fc[1] * s0], f1: [sw / 2, sh / 2] };
      paint(p.get());
      map.current?.setAttribute('data-ready', '');
    };
    measure();
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(measure) : null;
    ro?.observe(el);
    return () => ro?.disconnect();
  }, [wide, calm, paint, L]);
  useMotionValueEvent(p, 'change', paint);

  // the collection node and the name field take the camera in (keyboard and tap)
  const zoomIn = () => {
    const el = run.current;
    if (!el || calm) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    scrollToY(top + (el.offsetHeight - window.innerHeight) * 0.8, { duration: 1.4 });
  };
  const onFocusName = () => { if (!calm && p.get() < 0.6) zoomIn(); };

  const line = (k) => {
    const a = L.n.bin, b = L.n[k];
    return <line key={k} x1={a[0] + a[2] / 2} y1={a[1] + a[3] / 2} x2={b[0] + b[2] / 2} y2={b[1] + b[3] / 2} />;
  };
  return (
    <section className="bs-zm" data-calm={calm ? '' : undefined} ref={ent}>
      <div className="bs-zm-say0" ref={say0}>
        <div className="kn-wrap">
          <p className="kn-lede bs-zm-l0">Base is a single Go binary that serves your data, your users, your files, live updates and scheduled work over one HTTP API. The store is a SQLite file on disk, so deploying is copying a binary and backing up is copying a file.</p>
        </div>
      </div>
      <div ref={run} className="bs-zm-run">
        <div className="bs-zm-stage">
          <div className="bs-zm-half" ref={stage}>
          <div className="bs-zm-map" ref={map} style={{ width: L.W, height: L.H }}>
            <svg className="bs-zm-lines" width={L.W} height={L.H} viewBox={`0 0 ${L.W} ${L.H}`} aria-hidden="true">
              {['coll', 'admin', 'data', 'iam', 'live', 'file'].map(line)}
            </svg>
            <div className="bs-zn bs-zn-admin" style={at(L.n.admin)} aria-hidden="true">
              <p className="bs-k">admin</p>
              <div className="bs-zn-tbl">{[0, 1, 2, 3].map((i) => <div key={i}><code>{hex(i + 3)}</code><i style={{ width: 40 + i * 12 + '%' }} /></div>)}</div>
            </div>
            <div className="bs-zn bs-zn-data" style={at(L.n.data)} aria-hidden="true">
              <p className="bs-k">Data</p>
              <code className="bs-zn-path">/v1/<wbr />collections/<wbr /><b>{coll}</b>/<wbr />records</code>
              <p className="bs-verbs">{['list', 'read', 'create', 'update', 'delete'].map((v) => <span key={v}>{v}</span>)}</p>
            </div>
            <div className="bs-zn bs-zn-bin" style={at(L.n.bin)} aria-hidden="true">
              <p className="bs-k">single Go binary</p>
              <p className="bs-zn-n">base</p>
              <p className="bs-zn-api"><b>one</b> HTTP API</p>
            </div>
            <div className="bs-zn bs-zn-iam" style={at(L.n.iam)} aria-hidden="true">
              <p className="bs-k">Auth is Hanzo IAM</p>
              <div className="bs-iam"><span className="bs-chip">token IAM signed</span><i /><span className="bs-chip ink">identity</span></div>
            </div>
            <div className="bs-zn bs-zn-live" style={at(L.n.live)} aria-hidden="true">
              <p className="bs-k">one stream</p>
              <div className="bs-zn-stream">{[0, 1, 2].map((i) => <div key={i}><code>{coll}</code><i /></div>)}</div>
              <p className="bs-up"><span className="bs-chip">upload</span><i /><span>object storage</span></p>
            </div>
            <div className="bs-zn bs-zn-file" style={at(L.n.file)} aria-hidden="true">
              <span className="bs-chip file">SQLite file on disk</span>
              <ul>{SERVES.map((s) => <li key={s}>{s}</li>)}</ul>
            </div>
            <button type="button" className="bs-zn bs-zn-coll" style={at(L.n.coll)} onClick={zoomIn} aria-label={'collection ' + coll}>
              <span className="bs-k">collection</span>
              <span className="bs-zn-name">{coll}</span>
              <span className="bs-zn-fields">{FIELDS.map(([f]) => <code key={f}>{f}</code>)}</span>
            </button>
          </div>
          </div>

          <div className="bs-zm-say" ref={say}>
            <div className="kn-wrap kn-grid bs-zm-g">
              <div className="bs-zm-l">
                <div className="bs-dec-hd">
                  <h2 className="kn-headline bs-dec-h">Declare a collection, get an API</h2>
                  <p className="kn-kick">What is Hanzo Base</p>
                </div>
                <label className="bs-name">
                  <span>collection</span>
                  <input suppressHydrationWarning type="text" value={name} maxLength={24} spellCheck={false} autoComplete="off" enterKeyHint="done" placeholder="posts" onFocus={onFocusName} onChange={(e) => setName(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))} aria-label="Collection name" />
                </label>
                <p className="bs-zm-p">A collection is a real table with a schema you write down. The moment it exists it answers over HTTP, carries an access rule, streams its changes, and shows up in the admin. There is no code generation step and nothing to wire together.</p>
              </div>
              <div className="bs-zm-card" aria-hidden="true">
                <p className="bs-k">collection</p>
                <p className="bs-coll">{coll}</p>
                <ul className="bs-zm-fields">{FIELDS.map(([f, t]) => <li key={f}><code>{f}</code><em>{t}</em></li>)}</ul>
                <p className="bs-exists on">exists</p>
                <ul className="bs-zm-prom">{PROMISES.map((x) => <li key={x}><i />{x}</li>)}</ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* Data, Auth and Files: plain rows, each beside its own drawing (the old build-up's tiles, built) */
function PilRow({ children }) {
  const ent = useEntrance();
  return <div className="kn-grid bs-pil-r" ref={ent}>{children}</div>;
}
function Pillars({ coll }) {
  const [ref, live] = useLive(0.3);
  return (
    <section className="kn-sec bs-pil" ref={ref}>
      <div className="kn-wrap bs-pil-w">
        {PILLARS.map(([t, d], i) => (
          <PilRow key={t}>
            <div className="bs-pil-t">
              <h3 className="kn-title">{t}</h3>
              <p>{d}</p>
              <p className="bs-say-n kn-fig">{String(i + 1).padStart(2, '0')}</p>
            </div>
            <div className="bs-pil-v" aria-hidden="true">
              {i === 0 && (
                <div className="bs-tile on bs-t-api">
                  <p className="bs-k">Data</p>
                  <code className="bs-path">/v1/<wbr />collections/<wbr /><b>{coll}</b>/<wbr />records</code>
                  <p className="bs-verbs">{['list', 'read', 'create', 'update', 'delete'].map((v) => <span key={v}>{v}</span>)}</p>
                  <p className="bs-stores"><span>SQLite</span><span>Postgres DSN</span></p>
                </div>
              )}
              {i === 1 && (
                <div className="bs-tile on bs-t-iam">
                  <p className="bs-k">Auth is Hanzo IAM</p>
                  <div className="bs-iam"><span className="bs-chip">token IAM signed</span><i /><span className="bs-chip ink">identity</span></div>
                  <p className="bs-nos"><s>password</s><s>login form</s><s>reset flow</s></p>
                </div>
              )}
              {i === 2 && (
                <div className="bs-tile on bs-t-live">
                  <p className="bs-k">one stream</p>
                  <div className={'bs-stream' + (live ? ' run' : '')}>{[0, 1, 2, 3].map((k) => <div key={k} style={{ '--i': k }}><code>{coll}</code><i /></div>)}</div>
                  <p className="bs-up"><span className="bs-chip">upload</span><i /><span>object storage</span></p>
                </div>
              )}
            </div>
          </PilRow>
        ))}
      </div>
    </section>
  );
}

/* the capability cards' art: small, still drawings of each idea */
const Art = {
  schema: () => (
    <div className="bs-art a-schema"><div className="bs-art-card"><b>schema</b>{[60, 44, 52].map((w, i) => <i key={i} style={{ width: w + '%' }} />)}</div><span className="bs-art-arr" /><code>/records</code></div>
  ),
  stream: () => (
    <div className="bs-art a-stream"><div className="bs-art-line">{[0, 1, 2, 3, 4].map((i) => <i key={i} />)}</div><p><span className="bs-chip">short-lived grant</span></p><code><s>?token=</s></code></div>
  ),
  rules: () => (
    <div className="bs-art a-rules"><ul>{[1, 0, 1, 1, 0].map((ok, i) => <li key={i} className={ok ? '' : 'out'}><i /><b style={{ width: 30 + i * 9 + '%' }} /></li>)}</ul><p className="bs-chip ink">count</p></div>
  ),
  files: () => (
    <div className="bs-art a-files"><div className="bs-art-row"><div className="bs-art-file" /><span className="bs-art-arr" /><div className="bs-art-rec"><b>record</b><i /><i /></div></div><p><span className="bs-chip">token per request</span></p></div>
  ),
  tenant: () => (
    <div className="bs-art a-tenant"><div className="bs-art-dbs">{['org', 'org', 'org'].map((o, i) => <div key={i}><i /><span>{o}</span></div>)}</div><p className="bs-art-wal"><span>write-ahead log</span><i /><span>object storage</span></p></div>
  ),
  fn: () => (
    <div className="bs-art a-fn"><div className="bs-art-box"><b>function</b><span>read a record</span><span>read a list</span></div><p>{['network', 'filesystem', 'shell'].map((x) => <s key={x}>{x}</s>)}</p></div>
  ),
};
const CAPS = [
  ['schema', 'The schema is the API', 'Define a collection and its records are addressable the same second, with an admin UI to browse and edit them. Nothing is scaffolded into your repo, so there is nothing to regenerate when the schema moves.'],
  ['stream', 'One stream, no polling', 'Subscribe over server-sent events and records arrive as they change. A browser cannot put a header on that request, so the stream is opened with a short-lived grant minted on an ordinary authenticated call — your access token never travels in a URL.'],
  ['rules', 'Rules run before the count', 'An access rule is a predicate on the collection, folded into the query ahead of paging and ahead of the count — so a row you may not read is not counted either. With nobody signed in, a rule naming the caller matches nothing.'],
  ['files', 'Files behind the same rule', 'An upload is guarded by the rule on the record that references it, and reading one takes a token minted per request rather than a URL that works forever.'],
  ['tenant', 'A file per tenant', 'Each org gets its own SQLite file, opened under a key derived for that org — a different tenant is a different file, so no query can reach across two. Point Base at object storage and the write-ahead log streams there continuously, encrypted before it leaves the process, and you can restore to a moment.'],
  ['fn', 'Server-side logic, fenced in', 'A function is a record in a collection, so the collection’s rules decide who may run it. It runs in-process with two calls bound — read a record, read a list — and no network, no filesystem, no shell. Whatever the first version binds is supported forever, which is why that list is short.'],
];

function Caps() {
  const box = useRef(null);
  const ent = useEntrance();
  const calm = useCalm();
  // each card's drawing acts out its idea once as the card comes 60% into view, then rests (hover replays it)
  useEffect(() => {
    if (calm || !box.current || typeof IntersectionObserver === 'undefined') return;
    const timers = [];
    const io = new IntersectionObserver((es) => es.forEach((e) => {
      if (!e.isIntersecting) return;
      io.unobserve(e.target);
      const el = e.target;
      timers.push(setTimeout(() => { el.dataset.play = ''; }, 120));
      timers.push(setTimeout(() => { delete el.dataset.play; }, 1500));
    }), { threshold: 0.6 });
    box.current.querySelectorAll('.kno-card').forEach((c) => io.observe(c));
    return () => { io.disconnect(); timers.forEach(clearTimeout); };
  }, [calm]);
  return (
    <section className="kn-sec bs-caps" ref={ent}>
      <div className="kn-wrap" ref={box}>
        <div className="bs-caps-h">
          <h2 className="kn-headline">What you get</h2>
          <p className="kn-kick">Capabilities</p>
        </div>
        <KeynoteOpen cols={3} className="bs-open" items={CAPS.map(([id, t, d], i) => { const Pic = Art[id]; return { id, kick: String(i + 1).padStart(2, '0'), title: t, art: <Pic />, body: <p>{d}</p> }; })} />
      </div>
    </section>
  );
}

const PLACES = ['Hanzo Cloud', 'a laptop', 'a box', 'a cluster'];
const SIDE = [['Base', '/base'], ['Datastore', '/datastore'], ['Object Storage', '/s3'], ['Memory', '/cloud/memory']];
const PROJ = [['gateway', 'Ready'], ['payments-api', 'Ready'], ['checkout-web', 'Building'], ['docs-site', 'Ready']];

/* Run the binary's object: the same Base in four places. Pick (or hover) a place and its row answers the same records
   path, with the collection you named carried down; the example project's apps read it. */
function Deploy({ coll }) {
  const [ref, live] = useLive(0.4);
  const [on, setOn] = useState(0);
  const [hand, setHand] = useState(false);
  const [built, setBuilt] = useState(false);
  // idle: while seen and untouched, the request moves to the next place every 2.8 s; a touch hands it to the visitor
  useEffect(() => {
    if (!live || hand) return;
    const t = setTimeout(() => setOn((a) => (a + 1) % PLACES.length), 2800);
    return () => clearTimeout(t);
  }, [live, hand, on]);
  // the building app finishes its build once while seen, then rests
  useEffect(() => {
    if (!live || built) return;
    const t = setTimeout(() => setBuilt(true), 4200);
    return () => clearTimeout(t);
  }, [live, built]);
  const pick = (i) => { setHand(true); setOn(i); };
  const seed = on * 977 + coll.length * 31;
  return (
    <div className="bs-dep" ref={ref}>
      <div className="bs-dep-bar">
        <i /><i /><i />
        <A to="/home" className="bs-dep-t">Base — Hanzo</A>
      </div>
      <nav className="bs-dep-nav" aria-label="Products">
        {SIDE.map(([t, to], i) => <A key={t} to={to} aria-current={i === 0 ? 'page' : undefined}>{t}</A>)}
      </nav>
      <div className="bs-dep-b">
        <div className="bs-dep-places" role="group" aria-label="Places">
          {PLACES.map((pl, i) => (
            <button key={pl} type="button" aria-pressed={on === i} onClick={() => pick(i)} onMouseEnter={() => pick(i)} onFocus={() => pick(i)}>
              <span>{pl}</span>
              <code aria-hidden="true">/v1/collections/<b>{coll}</b>/records</code>
            </button>
          ))}
        </div>
        <div className="bs-dep-res" aria-hidden="true">
          <p className="bs-dep-req"><b>GET</b> /v1/<wbr />collections/<wbr />{coll}/<wbr />records</p>
          <div className="bs-dep-rows" key={on + coll}>
            {[0, 1, 2].map((i) => (
              <div key={i}><code>{hex(seed + i)}</code><i style={{ width: 36 + ((seed + i * 13) % 44) + '%' }} /></div>
            ))}
          </div>
        </div>
      </div>
      <ul className="bs-dep-proj" aria-label="Example project">
        {PROJ.map(([n, st]) => {
          const s = n === 'checkout-web' && built ? 'Ready' : st;
          return <li key={n}><i className={s === 'Building' ? 'b' : ''} aria-hidden="true" /><span>{n}</span><em>{s}</em></li>;
        })}
      </ul>
      <p className="bs-dep-cap">The service the session above is changing.</p>
      <div className="bs-dep-foot">
        <span>api.hanzo.ai<b>/v1/base</b></span>
        <A to="https://hanzo.team/" className="bs-dep-open">Open in the console ↗</A>
      </div>
    </div>
  );
}

function Run({ coll }) {
  const ent = useEntrance();
  return (
    <section className="kn-sec bs-run" ref={ent}>
      <div className="kn-wrap kn-grid bs-run-g">
        <div className="bs-run-l">
          <h2 className="kn-headline">Run the binary</h2>
          <p className="kn-body">Deploy Base managed on Hanzo Cloud, or run it yourself on a laptop, a box, or a cluster. Same API in all four places.</p>
          <div className="kn-acts bs-run-acts">
            <Cta to="https://platform.hanzo.ai" id="base.run">Deploy on Hanzo Cloud</Cta>
            <Cta to={GH} kind="link" id="base.run-2">GitHub</Cta>
          </div>
        </div>
        <div className="bs-run-r">
          <Deploy coll={coll} />
          <p className="bs-note">Example project. Every name in it is one you would give your own.</p>
        </div>
      </div>
    </section>
  );
}

/* One solid per screen: while a section's own ask (or the hero's, on phones) is on screen, the header's "Try Hanzo"
   steps back to its outline. A class on <html> that only this page sets, removed when the page leaves. */
function useOwnAsk() {
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return;
    const H = document.documentElement;
    const seen = new Set();
    const io = new IntersectionObserver((es) => {
      es.forEach((e) => (e.isIntersecting ? seen.add(e.target) : seen.delete(e.target)));
      H.classList.toggle('bs-own-ask', seen.size > 0);
    }, { rootMargin: '-60px 0px 0px 0px' });
    document.querySelectorAll('.bs [data-cta="base.hero"], .bs [data-cta="base.run"], .bs [data-cta="base.close"]').forEach((el) => io.observe(el));
    return () => { io.disconnect(); H.classList.remove('bs-own-ask'); };
  }, []);
}

const REL = [['Base docs →', DOCS], ['Datastore', '/datastore', 'Analytical columnar store'], ['Object Storage', '/s3', 'Object storage'], ['Memory', '/cloud/memory']];

export default function Base() {
  const [name, setName] = useState('posts');
  const coll = name || 'posts';
  const closeEnt = useEntrance();
  useOwnAsk();
  return (
    <main className="kn bs">
      <KeynoteStage
        look="side"
        kick="Hanzo Base · App backend"
        title={['An app backend', 'in one file']}
        lede="Open source (MIT). Runs as one binary — self-host or deploy managed on Hanzo Cloud."
        acts={[['Try Hanzo', '/login'], ['Read the docs', DOCS], ['View on GitHub', GH]]}
        cta="base.hero"
        from={1}
      >
        <Admin />
      </KeynoteStage>

      <ZoomMap name={name} setName={setName} />
      <Pillars coll={coll} />
      <Run coll={coll} />
      <Caps />

      <div className="bs-close" ref={closeEnt}>
      <KeynoteClose
        name="Base"
        tag="Embedded data backend with IAM-native auth"
        lead="hanzoai/base"
        license="MIT"
        repo={['hanzoai/base', GH]}
        stars="4 stars"
        self={DOCS}
        api="/v1/base"
        cta="base.close"
        prompt="Read https://hanzo.ai/skill.md and use Hanzo Base in my project. Start with: hanzo base bases list"
      >
        <div className="bs-rel">
          <p className="kn-kick">Related capabilities</p>
          <ul>{REL.map(([t, to, d]) => <li key={t}><A to={to}><b>{t}</b>{d && <span>{d}</span>}</A></li>)}</ul>
        </div>
      </KeynoteClose>
      </div>
    </main>
  );
}
