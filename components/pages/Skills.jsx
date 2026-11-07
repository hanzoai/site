'use client';
/* Skills.
   V2: 8/10 an editorial paper page: the skill file is the hero and a word wakes its gateway, the trade drawn as one monolith against five small reads, the six points set like a printed essay with a highlighter that strikes as you read.
   Signature: say a word, a gateway wakes. The hero is a markdown skill file beside an agent's context tray. A prompt
   types a word on its own (Postgres, then comptime); the gateway that notices it (discover-database, discover-zig)
   lights, and its specific files fly into the tray while everything else stays on the shelf.
   Then the trade, scrubbed by scroll: one monolithic guide against five focused reads (relative lengths, never a
   token count). The six points are set like an essay (huge numerals, asymmetric columns), each with a yellow
   highlighter that strikes its key line once as it reaches the screen. The one dark room is the thread.
   Beyond: follow a thread, API design → rate limiting → Redis: three files read, one after another, linked rather
   than repeated. Accent: highlighter yellow. Every word and link is Hanzo's; file contents are drawn as blank lines. */
import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { Copy } from '../ui';
import { A, Go } from '../kit';
import A2Lines from '../v2/A2Lines';
import A2Paste from '../v2/A2Paste';
import '../v2/A2.css';
import './Skills.css';

const GH = 'https://github.com/hanzoai';
const WAKE = [['Postgres', 'discover-database'], ['comptime', 'discover-zig']];
const SHELF = ['discover-database', 'discover-zig', '', '', '']; // Hanzo names two gateways; the rest of the shelf is drawn blank

/* One clock: type the word, wake the gateway, pull the files, rest; then the next word. */
function useWake(ref) {
  const seen = useInView(ref, { amount: 0.3 });
  const calm = useReducedMotion();
  const typed = useRef(null);
  const [w, setW] = useState(0);
  const [phase, setPhase] = useState(3); // 0 typing, 1 awake, 2 pulled, 3 rest (the server shows the pulled state)
  useEffect(() => {
    if (!seen || calm) return;
    let alive = true, t = 0, i = 0;
    const word = WAKE[w][0];
    setPhase(0);
    const typing = () => {
      if (!alive) return;
      i += 1;
      if (typed.current) typed.current.textContent = word.slice(0, i);
      if (i < word.length) t = setTimeout(typing, 90);
      else t = setTimeout(() => { setPhase(1); t = setTimeout(() => { setPhase(2); t = setTimeout(() => { setPhase(3); t = setTimeout(() => setW((v) => (v + 1) % WAKE.length), 1400); }, 2200); }, 900); }, 300);
    };
    if (typed.current) typed.current.textContent = '';
    t = setTimeout(typing, 500);
    return () => { alive = false; clearTimeout(t); if (typed.current) typed.current.textContent = word; };
  }, [seen, calm, w]);
  return [typed, w, phase];
}

function Wake() {
  const ref = useRef(null);
  const [typed, w, phase] = useWake(ref);
  const gate = WAKE[w][1];
  return (
    <div className="xsk-wake" ref={ref} aria-hidden="true">
      <div className="xsk-file">
        <div className="xsk-file-top x-mono"><span>hanzo.md</span><span>markdown</span></div>
        <pre className="xsk-fm x-mono"><span className="d">---</span>{'\n'}<span className="k">name:</span> <i style={{ width: '9ch' }} />{'\n'}<span className="k">description:</span> <i style={{ width: '18ch' }} />{'\n'}<span className="d">---</span></pre>
        <div className="xsk-prose">{[92, 84, 96, 60, 0, 88, 72, 90, 40].map((v, i) => (v ? <i key={i} style={{ width: v + '%' }} /> : <br key={i} />))}</div>
        <div className="xsk-links x-mono">{['discover-database', 'discover-zig'].map((l) => <span key={l}>→ {l}</span>)}</div>
      </div>
      <div className="xsk-agent">
        <div className="xsk-say x-mono"><span className="xsk-caret-k">›</span><span ref={typed}>{WAKE[w][0]}</span><b className="xsk-caret" /></div>
        <ul className="xsk-shelf x-mono">
          {SHELF.map((s, i) => <li key={i} className={(s && s === gate && phase >= 1 ? 'on' : '') + (s ? '' : ' blank')}>{s || <i />}</li>)}
        </ul>
        <div className="xsk-tray">
          <span className="x-mono">context</span>
          <div className="xsk-tray-in">
            <b className="xsk-base" />
            {[0, 1].map((k) => <b key={w + '-' + k} className={'xsk-sheet' + (phase >= 2 ? ' in' : '')} style={{ transitionDelay: k * 0.14 + 's' }} />)}
          </div>
        </div>
      </div>
    </div>
  );
}

function Hero() {
  return (
    <section className="xsk-hero" aria-labelledby="xsk-h1">
      <div className="a2-wrap a2-grid xsk-hero-grid">
        <div className="xsk-hero-copy">
          <p className="a2-kick"><A to={GH} className="xsk-repo">hanzoai/skills</A></p>
          <A2Lines as="h1" id="xsk-h1" className="a2-display xsk-h1" lines={['Skills']} now />
          <p className="a2-lede">Development knowledge your coding agent loads <mark>only when it needs it</mark></p>
          <div className="a2-acts"><span data-thumb="View on GitHub" data-href={GH} style={{ display: 'contents' }}><Go to={GH} solid>View on GitHub</Go></span></div>
        </div>
        <motion.div className="xsk-hero-obj" initial={{ opacity: 0, y: 40, rotate: 1.5 }} animate={{ opacity: 1, y: 0, rotate: 0 }} transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}>
          <Wake />
        </motion.div>
      </div>
    </section>
  );
}

/* The trade, scrubbed: one monolithic guide, then five focused reads. Lengths are relative, never a count. */
function Trade() {
  const ref = useRef(null);
  const calm = useReducedMotion();
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ['start end', 'end center'] });
  const mono = useTransform(p, (v) => (calm ? 1 : Math.min(1, Math.max(0, (v - 0.2) / 0.3))));
  const five = useTransform(p, (v) => (calm ? 1 : Math.min(1, Math.max(0, (v - 0.45) / 0.35))));
  return (
    <section className="a2-sec xsk-trade" ref={ref} aria-labelledby="xsk-trade-h">
      <div className="a2-wrap">
        <A2Lines id="xsk-trade-h" className="a2-display m xsk-trade-h" lines={['Coverage costs context.', 'This is the trade.']} />
        <div className="xsk-bars" aria-hidden="true">
          <div className="xsk-bar-row"><span className="x-mono">one monolithic guide</span><motion.b className="xsk-mono" style={{ scaleX: mono }} /></div>
          <div className="xsk-bar-row"><span className="x-mono">five focused reads</span><motion.div className="xsk-five" style={{ '--f': five }}>{[0, 1, 2, 3, 4].map((k) => <b key={k} style={{ '--k': k }} />)}</motion.div></div>
        </div>
      </div>
    </section>
  );
}

/* The six points, set like an essay; the highlighter strikes once as each reaches the screen. */
const POINTS = [
  ['A skill is a markdown file', <>Frontmatter carries a name and a description. Below it is prose, code, and links to related skills. <Hl>Nothing to compile, nothing to run</Hl> — you can read one before you trust it.</>],
  ['Gateway skills do the finding', <>A gateway is a small skill whose whole job is to notice. Say Postgres and discover-database wakes up; say comptime and discover-zig does. <Hl>It pulls the specific files and gets out of the way.</Hl></>],
  ['Install it in one line', <><code>npx skills add https://hanzoskills.com/hanzo.md</code> adds the Hanzo skill to your agent, and <Hl>hanzoskills.com/llms.txt lists every other one as plain markdown.</Hl></>],
  ['Written small on purpose', <>One topic per file, a few hundred lines each. <Hl>Five focused reads cost less than one monolithic guide</Hl>, and you get the five that matter instead of the one that covers everything badly.</>],
  ['Cross-referenced, not duplicated', <>Skills link to the skills next to them, so an agent following a thread from API design into rate limiting into Redis <Hl>reads three files and never the same paragraph twice.</Hl></>],
  ['Add your own', <>Drop a markdown file in a category, give it a name and a description, and it joins discovery. <Hl>Your house conventions load the same way the public ones do.</Hl></>],
];

function Hl({ children }) {
  const ref = useRef(null);
  const seen = useInView(ref, { once: true, amount: 0.5, margin: '0px 0px -15% 0px' });
  return <mark ref={ref} className={'xsk-hl' + (seen ? ' on' : '')}>{children}</mark>;
}

function Essay() {
  return (
    <section className="a2-sec xsk-essay" aria-label="Six points">
      <div className="a2-wrap">
        <ol className="xsk-points">
          {POINTS.map(([t, d], i) => (
            <li key={t} className={'xsk-pt p' + i}>
              <span className="xsk-num a2-fig" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
              <div className="xsk-pt-copy">
                <span className="a2-kick">{String(i + 1).padStart(2, '0')} / 06</span>
                <h2 className="a2-headline">{t}</h2>
                <p className="a2-body">{d}</p>
                {i === 2 && <div className="xsk-cmd"><code className="x-mono">npx skills add https://hanzoskills.com/hanzo.md</code><Copy text="npx skills add https://hanzoskills.com/hanzo.md" /></div>}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* The one dark room: follow a thread, file to file. */
const THREAD = ['API design', 'rate limiting', 'Redis'];

function Thread() {
  const ref = useRef(null);
  const seen = useInView(ref, { amount: 0.4 });
  const calm = useReducedMotion();
  const [at, setAt] = useState(2);
  const [mine, setMine] = useState(false);
  useEffect(() => {
    if (!seen || calm || mine) return;
    setAt(0);
    const t = setInterval(() => setAt((v) => (v + 1) % 4), 1300);
    return () => clearInterval(t);
  }, [seen, calm, mine]);
  return (
    <section className="a2-sec a2-dark xsk-thread" data-room="dark" ref={ref} aria-labelledby="xsk-thread-h">
      <div className="a2-wrap a2-grid">
        <div className="xsk-thread-copy">
          <p className="a2-kick">Follow a thread</p>
          <h2 id="xsk-thread-h" className="a2-headline">Cross-referenced, not duplicated</h2>
          <div className="xsk-steps" role="group" aria-label="The thread">
            {THREAD.map((t, i) => <button key={t} type="button" aria-pressed={at >= i} onClick={() => { setMine(true); setAt(i); }}>{t}</button>)}
          </div>
        </div>
        <div className="xsk-files" aria-hidden="true">
          {THREAD.map((t, i) => (
            <div key={t} className={'xsk-f' + (at >= i ? ' on' : '')} style={{ '--i': i }}>
              <span className="x-mono">{t}</span>
              {[88, 70, 94, 52].map((v, k) => <i key={k} style={{ width: v + '%' }} />)}
              {i < 2 && <em className="x-mono">→ {THREAD[i + 1]}</em>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Get() {
  return (
    <section className="a2-sec xsk-get" aria-labelledby="xsk-get-h">
      <div className="a2-wrap a2-grid">
        <div className="xsk-get-copy"><A2Lines id="xsk-get-h" className="a2-display s" lines={['Get started', 'with Skills']} /></div>
        <div className="xsk-get-card">
          <h2>Get Skills</h2>
          <p>Reusable agent skills</p>
          <p className="xsk-get-meta x-mono"><span><span>License:</span> Apache-2.0</span><A to={GH}>hanzoai</A></p>
          <Go to="https://platform.hanzo.ai/deploy" solid>Deploy to Cloud</Go>
        </div>
      </div>
    </section>
  );
}

export default function Skills() {
  return (
    <main className="a2 xsk" style={{ '--acc': '#ffd60a' }}>
      <Hero />
      <Trade />
      <Essay />
      <Thread />
      <A2Paste name="Skills" text="Read https://hanzo.ai/skill.md and use Hanzo Skills in my project. Start with: hanzo tools skills list" />
      <Get />
    </main>
  );
}
