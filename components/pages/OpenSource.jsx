'use client';
/* Open source. Its idea is the scale of it, made literal. Signature moment: the constellation — every original
   repository a point of light (2,247 of them), gathered into its organization's cluster and its ecosystem's galaxy
   (Hanzo, Lux, Zoo). It drifts on its own; drag it to pan, point at a cluster for its organization, click to open it.
   Then the year of commits per ecosystem (switch Hanzo, Lux, Zoo and the dashboard swaps), the projects Hanzo runs
   on rolling past like film credits, and the stewardship commitments as a charter that signs itself.
   Every figure is Hanzo's, as its build read GitHub and its forge. */
import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence, useInView, useReducedMotion } from 'motion/react';
import { EASE, Rise, Count } from '../ui';
import { A, SecHead, Band } from '../kit';
import { href } from '../../lib/route';
import { ECO, TOTAL, ORGS } from './openSourceData';
import './OpenSource.css';

const num = (s) => parseInt(String(s).replace(/,/g, ''), 10) || 0;

/* ---------- the constellation ---------- */
function build() {
  const centers = [[0, 0], [-380, -260], [330, 290]]; // Hanzo, Lux above-left of it, Zoo below-right
  const clusters = [], dots = [];
  ORGS.forEach((g, gi) => {
    const placed = [];
    [...g.orgs].sort((a, b) => num(b.repos) - num(a.repos)).forEach((o) => {
      const n = num(o.repos), r = Math.sqrt(n) * 5.2 + 7;
      let x = 0, y = 0;
      for (let k = 0; k < 6000; k++) {
        const a = k * 0.42, d = Math.sqrt(k) * 9;
        x = Math.cos(a) * d; y = Math.sin(a) * d * 0.82;
        if (placed.every((p) => Math.hypot(p.x - x, p.y - y) > p.r + r + 7)) break;
      }
      placed.push({ x, y, r });
      const cx = centers[gi][0] + x, cy = centers[gi][1] + y;
      const lit = Math.min(3, Math.floor(Math.log10(num(o.commits) + 1)));
      const c = { ...o, g: g.name, x: cx, y: cy, r, n };
      clusters.push(c);
      const sp = (r - 3) / Math.sqrt(n);
      for (let i = 0; i < n; i++) {
        const rr = sp * Math.sqrt(i + 0.5), th = i * 2.39996;
        dots.push([cx + Math.cos(th) * rr, cy + Math.sin(th) * rr, lit, (i * 7919) % 97, clusters.length - 1]);
      }
    });
  });
  const gal = ORGS.map((g, gi) => {
    const mine = clusters.filter((c) => c.g === g.name);
    const top = Math.min(...mine.map((c) => c.y - c.r));
    return { name: g.name, sub: g.sub, x: centers[gi][0], y: top - 26 };
  });
  return { clusters, dots, gal };
}

function Constellation() {
  const wrap = useRef(null);
  const cv = useRef(null);
  const labs = useRef([]);
  const world = useMemo(build, []);
  const live = useInView(wrap, { amount: 0.1 });
  const calm = useReducedMotion();
  const [hot, setHot] = useState(null);
  const st = useRef({ ox: 0, oy: 0, vx: 0, vy: 0, drag: null, moved: 0, hot: -1, s: 1, w: 0, h: 0, t: 0 });
  useEffect(() => {
    const c = cv.current, ctx = c.getContext('2d');
    const S = st.current;
    const fit = () => {
      const b = wrap.current.getBoundingClientRect(), dpr = Math.min(2, window.devicePixelRatio || 1);
      S.w = b.width; S.h = b.height;
      c.width = b.width * dpr; c.height = b.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // the three galaxies span about 1,500 x 900 world units
      const phone = b.width < 700;
      S.s = phone ? b.width / 1050 : Math.min(b.width / 1500, b.height / 880);
      S.cx = b.width * (phone ? 0.58 : 0.68); S.cy = b.height * (phone ? 0.55 : 0.56);
    };
    fit();
    const ro = new ResizeObserver(fit); ro.observe(wrap.current);
    const shades = ['rgba(245,245,247,.28)', 'rgba(245,245,247,.5)', 'rgba(245,245,247,.75)', 'rgba(255,255,255,.98)'];
    const draw = (t) => {
      S.t = t;
      if (!S.drag) { S.ox += S.vx; S.oy += S.vy; S.vx *= 0.93; S.vy *= 0.93; }
      const drift = calm ? 0 : Math.sin(t / 5200) * 14, s = S.s;
      const X = (x) => S.cx + (x + S.ox + drift) * s, Y = (y) => S.cy + (y + S.oy + Math.cos(t / 6100) * 8 * (calm ? 0 : 1)) * s;
      ctx.clearRect(0, 0, S.w, S.h);
      const sz = Math.max(1.2, 2.2 * s);
      for (let lv = 0; lv < 4; lv++) {
        ctx.fillStyle = shades[lv];
        for (const d of world.dots) {
          const tw = calm ? 0 : ((Math.floor(t / 900 + d[3]) % 9) === 0 ? 1 : 0);
          const on = S.hot === d[4] ? 3 : Math.min(3, d[2] + tw);
          if (on !== lv) continue;
          ctx.fillRect(X(d[0]) - sz / 2, Y(d[1]) - sz / 2, sz, sz);
        }
      }
      if (S.hot >= 0) {
        const h = world.clusters[S.hot];
        ctx.strokeStyle = 'rgba(255,255,255,.55)'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.arc(X(h.x), Y(h.y), h.r * s + 6, 0, Math.PI * 2); ctx.stroke();
      }
      world.gal.forEach((g, i) => { const el = labs.current[i]; if (el) el.style.transform = `translate(${X(g.x)}px, ${Y(g.y) - 30}px)`; });
      if (hotEl.current && S.hot >= 0) { const h = world.clusters[S.hot]; hotEl.current.style.transform = `translate(${X(h.x)}px, ${Y(h.y) - h.r * s - 14}px)`; }
    };
    let raf = 0;
    const loop = (t) => { draw(t); raf = requestAnimationFrame(loop); };
    if (live && !calm) raf = requestAnimationFrame(loop); else draw(0);
    S.redraw = () => draw(S.t);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, [live, calm, world]);
  const hotEl = useRef(null);
  const pick = (e) => {
    const S = st.current, b = cv.current.getBoundingClientRect();
    const drift = calm ? 0 : Math.sin(S.t / 5200) * 14;
    const wx = (e.clientX - b.left - S.cx) / S.s - S.ox - drift, wy = (e.clientY - b.top - S.cy) / S.s - S.oy;
    let best = -1, bd = 1e9;
    world.clusters.forEach((c, i) => { const d = Math.hypot(c.x - wx, c.y - wy); if (d < c.r + 10 && d < bd) { bd = d; best = i; } });
    return best;
  };
  const down = (e) => { const S = st.current; S.drag = { x: e.clientX, y: e.clientY }; S.moved = 0; S.vx = S.vy = 0; };
  const move = (e) => {
    const S = st.current;
    if (S.drag) {
      const dx = (e.clientX - S.drag.x) / S.s, dy = (e.clientY - S.drag.y) / S.s;
      S.ox += dx; S.oy += dy; S.vx = dx * 0.6; S.vy = dy * 0.6; S.moved += Math.abs(dx) + Math.abs(dy);
      S.drag = { x: e.clientX, y: e.clientY };
      if (S.moved > 3 && e.pointerType === 'mouse') e.currentTarget.setPointerCapture?.(e.pointerId);
      if (calm) S.redraw?.();
      return;
    }
    const i = pick(e);
    if (i !== S.hot) { S.hot = i; setHot(i >= 0 ? world.clusters[i] : null); if (calm) S.redraw?.(); }
  };
  const up = (e) => {
    const S = st.current, was = S.drag; S.drag = null;
    if (was && S.moved < 6) { const i = pick(e); if (i >= 0) window.location.assign(href('/oss/' + world.clusters[i].login)); }
  };
  return (
    <div className="xos-sky" ref={wrap}>
      <canvas ref={cv} onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerLeave={() => { st.current.drag = null; st.current.hot = -1; setHot(null); }}
        role="img" aria-label="Every original repository as a point of light: 2,247 of them, gathered by organization into the Hanzo, Lux and Zoo ecosystems" />
      {world.gal.map((g, i) => (
        <div key={g.name} className="xos-gal" ref={(el) => (labs.current[i] = el)} aria-hidden="true"><b>{g.name}</b><span>{g.sub}</span></div>
      ))}
      <div className={'xos-tip' + (hot ? ' on' : '')} ref={hotEl} aria-hidden="true">
        {hot && <><b>{hot.name}</b><span>{hot.login} · {hot.repos}{hot.commits ? ' · ' + hot.commits : ''}</span></>}
      </div>
      <p className="xos-hint" aria-hidden="true">Drag to pan · point at a cluster · click to open it</p>
    </div>
  );
}

/* ---------- hero ---------- */
const HERO_STATS = [['1,733', 'Original public repositories'], ['37', 'Organizations holding them'], ['732,288', 'Commits, past year'], ['5,125', 'GitHub stars']];
function Hero() {
  const line = (t, d) => <span className="x-line"><motion.span className="x-line-in" initial={{ y: '105%' }} animate={{ y: 0 }} transition={{ duration: 1.1, ease: EASE, delay: d }}>{t}</motion.span></span>;
  return (
    <section className="xos-hero" data-room="dark" aria-labelledby="xos-h1">
      <Constellation />
      <div className="x-wrap xos-hero-c">
        <motion.p className="xos-kick" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: EASE }}>Open Source First</motion.p>
        <h1 id="xos-h1" className="xos-h1">{line('Building in the', 0.05)}{line('open.', 0.16)}</h1>
        <motion.p className="xos-lede" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: EASE, delay: 0.35 }}>We publish what we build, fix the bugs we find upstream instead of patching them in private, and pay the projects we depend on. The commitments below are specific enough to hold us to.</motion.p>
        <motion.div className="xos-acts" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: EASE, delay: 0.5 }}>
          <A to="https://github.com/hanzoai" className="x-btn solid xos-btn-l">View on GitHub</A>
          <A to="https://github.com/hanzoai" className="x-btn xos-btn-d">Star Our Repos</A>
        </motion.div>
        <dl className="xos-hstats">
          {HERO_STATS.map(([v, k], i) => (
            <motion.div key={k} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: EASE, delay: 0.6 + i * 0.07 }}>
              <dd><Count to={num(v)} duration={1.8} delay={0.6 + i * 0.07} /></dd><dt>{k}</dt>
            </motion.div>
          ))}
        </dl>
      </div>
    </section>
  );
}

/* ---------- what Hanzo is built on: rolling credits ---------- */
const BUILT = [
  ['🐍', 'Python', 'https://github.com/python/cpython', 'Python Software Foundation', 'https://python.org', 'The language powering our ML/AI stack', 'PSF'],
  ['⚙️', 'Rust', 'https://github.com/rust-lang/rust', 'Rust Foundation', 'https://rust-lang.org', 'Systems language for our high-performance runtimes', 'MIT/Apache-2.0'],
  ['🐹', 'Go', 'https://github.com/golang/go', 'Go Authors / Google', 'https://go.dev', 'Powers our gateway, blockchain, and infra tooling', 'BSD-3-Clause'],
  ['🔷', 'TypeScript', 'https://github.com/microsoft/TypeScript', 'Microsoft', 'https://typescriptlang.org', 'The backbone of our developer SDKs and web apps', 'Apache-2.0'],
  ['⚛️', 'React', 'https://github.com/react/react', 'Meta Open Source', 'https://react.dev', 'Powering every UI we ship', 'MIT'],
  ['▲', 'Next.js', 'https://github.com/vercel/next.js', 'Vercel', 'https://nextjs.org', 'Every hanzo.ai product is built on Next.js', 'MIT'],
  ['🐘', 'PostgreSQL', 'https://github.com/postgres/postgres', 'PostgreSQL Global Development Group', 'https://postgresql.org', 'The database underlying all our stateful services', 'PostgreSQL License'],
  ['🔴', 'Redis', 'https://github.com/redis/redis', 'Redis Ltd. / Salvatore Sanfilippo', 'https://redis.io', 'Fast caching and pub/sub throughout our platform', 'BSD-3-Clause'],
  ['🔥', 'PyTorch', 'https://github.com/pytorch/pytorch', 'Meta AI Research', 'https://pytorch.org', 'Foundation of our ML training and inference', 'BSD-3-Clause'],
  ['☸️', 'Kubernetes', 'https://github.com/kubernetes/kubernetes', 'CNCF / Google', 'https://kubernetes.io', 'Orchestrates every workload in production', 'Apache-2.0'],
  ['🐳', 'Docker', 'https://github.com/moby/moby', 'Docker / Moby Project', 'https://docker.com', 'Containers make our MCP tools portable', 'Apache-2.0'],
  ['📊', 'OpenTelemetry', 'https://github.com/open-telemetry/opentelemetry-specification', 'CNCF', 'https://opentelemetry.io', 'Observability across every service', 'Apache-2.0'],
];

function Built() {
  return (
    <section className="x-sec xos-built">
      <div className="x-wrap xos-built-g">
        <div className="xos-sticky">
          <SecHead title="What Hanzo is built on" lede="The projects our platform actually runs on, each with its licence and the people who maintain it." />
        </div>
        <div className="xos-roll" tabIndex={-1}>
          <ul className="xos-credits">
            {BUILT.map(([ic, name, repo, who, site, what, lic], i) => (
              <Rise as="li" key={name} delay={(i % 3) * 0.05} y={18}>
                <span className="xos-ic" aria-hidden="true">{ic}</span>
                <span className="xos-cr">
                  <A to={repo} className="xos-cr-n">{name}</A>
                  <A to={site} className="xos-cr-w">{who}</A>
                  <span className="xos-cr-d">{what}</span>
                </span>
                <span className="xos-lic">{lic}</span>
              </Rise>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* ---------- the charter ---------- */
const CHARTER = [
  ['We ship open source first', "Every tool we build for ourselves gets published. If it's useful to us, it belongs to the community. No internal-only forks."],
  ['We contribute upstream', 'When we find bugs or missing features in projects we depend on, we fix them upstream — not in private patches.'],
  ['We never lock in what we open', 'Anything published under MIT or Apache-2.0 stays that way. We will never relicense open repos to extract commercial value.'],
  ['We credit our foundations', 'Our platform is built on hundreds of open-source projects. We acknowledge, link to, and financially support the communities and maintainers who make this possible.'],
  ['We fund what we depend on', 'Through GitHub Sponsors, Open Collective, and direct partnerships, we invest back into the projects that power Hanzo.'],
  ['We welcome all contributors', 'Good code can come from anywhere. We maintain a contributor-friendly CONTRIBUTING.md, respond to PRs within 48 hours on active repos, and recognize every contributor.'],
];
const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI'];

function Charter() {
  const end = useRef(null);
  const signed = useInView(end, { once: true, amount: 1 });
  return (
    <section className="x-sec xos-charter-s">
      <div className="x-wrap">
        <div className="xos-charter">
          <header className="xos-ch-h">
            <p className="xos-ch-k">Charter</p>
            <h2>Our Stewardship Commitments</h2>
            <p>We hold ourselves to explicit, public commitments — not vague marketing language.</p>
          </header>
          <ol className="xos-arts">
            {CHARTER.map(([t, d], i) => (
              <Rise as="li" key={t} y={20} amount={0.6}>
                <span className="xos-art-n">Article {ROMAN[i]}</span>
                <h3>{t}</h3>
                <p>{d}</p>
              </Rise>
            ))}
          </ol>
          <div className="xos-sign" ref={end} aria-hidden="true">
            <svg viewBox="0 0 320 90" width="320" height="90">
              <motion.path d="M10 62c18-30 34-44 44-40 9 4-8 40-2 44 6 4 22-36 34-34 10 2-4 30 4 32 9 2 20-26 30-24 8 2-2 22 6 22 10 0 18-18 30-18 9 0 4 16 14 16 14 0 34-20 52-22 16-2 40 6 84 4"
                fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
                initial={{ pathLength: 0 }} animate={{ pathLength: signed ? 1 : 0 }} transition={{ duration: 2.2, ease: [0.65, 0, 0.35, 1] }} />
            </svg>
            <span className="xos-sign-l" />
            <span className="xos-sign-m"><svg viewBox="0 0 67 67" width="18" height="18" fill="currentColor"><path d="M22.21 67V44.6369H0V67H22.21Z" /><path d="M66.7038 22.3184H22.2534L0.0878906 44.6367H44.4634L66.7038 22.3184Z" /><path d="M22.21 0H0V22.3184H22.21V0Z" /><path d="M66.7198 0H44.5098V22.3184H66.7198V0Z" /><path d="M66.7198 44.6369H44.5098V67H66.7198V44.6369Z" /></svg></span>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- what we publish: one dashboard per ecosystem ---------- */
const NAMES = ['Hanzo', 'Lux', 'Zoo'];
const MONTHS = ['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'];

function Heat({ e, on }) {
  const cols = Math.ceil(e.heat.length / 7);
  return (
    <figure className="xos-heat">
      <figcaption><span>Commits a day</span></figcaption>
      <div className="xos-heat-m" aria-hidden="true">{MONTHS.map((m, i) => <span key={i}>{m}</span>)}</div>
      <div className={'xos-heat-g' + (on ? ' on' : '')} role="img" aria-label={e.heatLabel} style={{ '--cols': cols }}>
        {[...e.heat].map((c, i) => <i key={i} className={c === '.' ? 'x' : 'l' + c} style={{ '--d': Math.floor(i / 7) * 14 + 'ms' }} />)}
      </div>
      <div className="xos-heat-f">
        <span>Commits a day, from Nov 7, 2025 to Nov 6, 2026</span>
        <span className="xos-leg">Less {[0, 1, 2, 3, 4].map((l) => <i key={l} className={'l' + l} />)} More</span>
      </div>
    </figure>
  );
}

const LANGC = ['#0a0a0a', '#3a3a3c', '#6e6e73', '#98989d', '#c7c7cc', '#e5e5ea'];
function Board({ e, i, on }) {
  const ref = useRef(null);
  const seen = useInView(ref, { once: true, amount: 0.15 });
  const go = on && seen;
  return (
    <div ref={ref} className="xos-board" role="tabpanel" id={'xos-p-' + i} aria-labelledby={'xos-t-' + i} hidden={!on}>
      <ul className="xos-stats">
        {e.stats.map(([k, v, s], j) => (
          <li key={j}><A to={e.statTo[j]}><span className="xos-st-k">{k}</span><b className="x-mono">{on ? <Count to={num(v)} run={go} duration={1.4} /> : v}</b><span className="xos-st-s">{s}</span></A></li>
        ))}
      </ul>
      <Heat e={e} on={go} />
      <div className="xos-two">
        <div>
          <h3 className="xos-h3">Latest commits</h3>
          <ol className="xos-commits">
            {e.commits.map(([repo, msg, when, to], j) => (
              <li key={to}><A to={to}><span className="xos-c-r">{repo}</span><span className="xos-c-m">{msg}</span><span className="xos-c-t x-mono">{when} <small>UTC</small></span></A></li>
            ))}
          </ol>
          <p className="xos-read"><span>{e.read}</span><A to={e.readTo}>Read the source →</A></p>
        </div>
        <div>
          <h3 className="xos-h3">What it is written in</h3>
          <div className="xos-lbar" aria-hidden="true">{e.langs.map(([l, p], j) => <motion.i key={l} style={{ background: LANGC[j] }} initial={{ width: 0 }} animate={{ width: go ? p + '%' : 0 }} transition={{ duration: 1.1, ease: EASE, delay: 0.1 + j * 0.06 }} />)}</div>
          <ul className="xos-langs">{e.langs.map(([l, p], j) => <li key={l}><i style={{ background: LANGC[j] }} />{l}<b className="x-mono">{p}<small>%</small></b></li>)}</ul>
          <p className="xos-cap">{e.langCap}</p>
        </div>
      </div>
      <ul className="xos-repos">
        {e.repos.map((r) => (
          <li key={r.name}>
            <A to={r.to} className="xos-repo">
              <span className="xos-repo-n">{r.name}</span>
              <span className="xos-repo-d">{r.desc}</span>
              <span className="xos-repo-m">
                <span className="xos-lang">{r.lang}</span>
                <span title="Stars">★ {r.stars}</span>
                <span title="Forks">⑂ {r.forks}</span>
                <span className="xos-av" aria-hidden="true">{[...r.av].map((a, k) => <i key={k}>{a}</i>)}{r.more && <i className="m">{r.more}</i>}</span>
              </span>
              <span className="xos-repo-f">{r.people} · {r.commits} · {r.pushed}</span>
            </A>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Publish() {
  const [at, setAt] = useState(0);
  return (
    <section className="x-sec xos-pub" id="publish">
      <div className="x-wrap">
        <div className="xos-pub-h">
          <SecHead title="What we publish" lede="Read from GitHub by every build: the year of commits, the languages and the repositories of each ecosystem, then every organization." />
          <div className="xos-eco" role="tablist" aria-label="Ecosystem">
            {NAMES.map((n, i) => (
              <button key={n} id={'xos-t-' + i} type="button" role="tab" aria-selected={at === i} aria-controls={'xos-p-' + i} onClick={() => setAt(i)}>
                {at === i && <motion.span layoutId="xos-eco" className="xos-eco-bg" transition={{ type: 'spring', stiffness: 420, damping: 34 }} />}
                <span>{n}</span><span className="x-mono">{ECO[i].stats[3][1]}</span>
              </button>
            ))}
          </div>
        </div>
        {ECO.map((e, i) => <Board key={i} e={e} i={i} on={at === i} />)}
      </div>
    </section>
  );
}

/* ---------- totals and every organization ---------- */
function Totals() {
  return (
    <section className="xos-total">
      <div className="x-wrap">
        <div className="xos-total-h">
          <h2>Total across Hanzo</h2>
          <p>Aggregate open-source activity counted from the forge and GitHub.</p>
        </div>
        <ul>{TOTAL.map(([v, k]) => <li key={k}><b><Count to={num(v)} duration={2} /></b><span>{k}</span></li>)}</ul>
        <p className="xos-grants"><A to="/grants">OSS &amp; research credit grants →</A></p>
      </div>
    </section>
  );
}

function Orgs() {
  return (
    <section className="x-sec xos-orgs">
      <div className="x-wrap">
        <SecHead title="Every organization" />
        <div className="xos-gals">
          {ORGS.map((g) => {
            const max = Math.max(...g.orgs.map((o) => num(o.repos)));
            return (
              <div key={g.name} className="xos-galx">
                <div className="xos-galx-h"><h3>{g.name}</h3><span>{g.sub}</span></div>
                <ol>
                  {g.orgs.map((o) => (
                    <li key={o.login}>
                      <A to={'/oss/' + o.login} className="xos-org">
                        <span className="xos-org-n"><b>{o.name}</b><small>{o.login}</small></span>
                        <span className="xos-org-bar" aria-hidden="true"><i style={{ width: Math.max(2, (num(o.repos) / max) * 100) + '%' }} /></span>
                        <span className="xos-org-v x-mono">{o.repos}</span>
                        <span className="xos-org-c x-mono">{o.commits || ''}</span>
                        <span className="xos-org-s x-mono" title="GitHub stars">★ {o.stars}</span>
                        {o.desc && <span className="xos-org-d">{o.desc}</span>}
                      </A>
                    </li>
                  ))}
                </ol>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default function OpenSource() {
  return (
    <main className="xos">
      <Hero />
      <Publish />
      <Built />
      <Charter />
      <Totals />
      <Orgs />
      <Band
        title="Contribute"
        lede="We welcome contributions of all kinds: code, documentation, bug reports and feature requests."
        action="Start Contributing"
        to="https://github.com/hanzoai"
        note={<p className="x-band-note">Join the Community · <A to="https://discord.gg/XthHQQj">Join Discord</A> · <A to="/founder">Founder Program</A></p>}
      />
    </main>
  );
}
