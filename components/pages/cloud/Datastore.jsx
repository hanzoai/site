'use client';
/* Datastore.
   V2: 8/10 The query console is the hero (press a column and the scan reads only that file); six pinned facts; a table pulled apart into its layers as you scroll; the industries as an index; a port board that settles, never flaps; one dark close. Deck greys, deck scale, no springs, no foreign digits.
   Persona: a developer or data engineer choosing a store for events, metrics and logs.
   Goal: see in one look why a column store answers fast, then sign in or read the documentation.
   CTA: "Try Hanzo" → /login (solid, data-cta datastore.hero, data-thumb); "Documentation" → https://docs.hanzo.ai (link,
        datastore.hero-2); "Deploy to Cloud" → https://platform.hanzo.ai/deploy (solid in the close, datastore.close);
        "Self-host" → docs.hanzo.ai/…/datastore (link, datastore.close-self).
   Metric: api_key_created (developers; the hero click is cta_click datastore.hero).
   Signature: the exploded table. "Where the speed comes from" pins a table of eight columns and pulls it apart as you
   scroll: the rows come apart into column files (read only what the query names), one column's values line up for a
   vector instruction, each column splits into its sorted parts with a contiguous run in ink, and every column shrinks
   by its own codec (deltas, dictionary, general). Phones play the same four states once by themselves, or by tap.
   Supporting: the Stage hero (the query console settles as you scroll, scanning by itself), six pinned facts that scale
   in (words left), and the closing dark room.
   Beyond: "Which way in?": pick how you connect (HTTP, the native protocol, or the MySQL and PostgreSQL wire ports) and
   the port settles onto a board, digit by digit from behind a mask (only the true digits ever show), with Hanzo's
   line on who connects that way.
   Every word and link is Hanzo's; the example table's cells carry no values. */
import { useEffect, useRef, useState } from 'react';
import { useScroll, useMotionValueEvent, useInView } from 'motion/react';
import { useLive } from './Frame';
import { useCalm } from '../../ui';
import { scrollToY } from '../../../lib/scroll';
import KeynoteStage, { useStagePause } from './SafeStage';
import KeynoteChapters, { useWide } from '../../v2/KeynoteChapters';
import KeynoteLines from '../../v2/KeynoteLines';
import KeynoteClose from '../../v2/KeynoteClose';
import './Datastore.css';

const COLS = ['ts', 'user_id', 'event', 'country', 'device', 'plan', 'revenue', 'duration_ms', 'referrer', 'path', 'session', 'version'];
const AUTO = [[], ['country'], ['country', 'device'], ['plan'], []];
const shade = (a, b) => Math.abs(Math.sin(a * 12.9898 + b * 78.233) * 43758.5453) % 1;

/* The hero object: the query console. Press a column and it joins the query; the scan runs down only the named files. */
function Query() {
  const [ref, live, calm] = useLive(0.3);
  const paused = useStagePause();
  const [extra, setExtra] = useState([]);
  const [mine, setMine] = useState(false);
  const [k, setK] = useState(0);
  useEffect(() => {
    if (mine || !live || calm || paused) return;
    const t = setTimeout(() => { const n = (k + 1) % AUTO.length; setK(n); setExtra(AUTO[n]); }, 2600);
    return () => clearTimeout(t);
  }, [k, mine, live, calm, paused]);
  const toggle = (c) => {
    if (c === 'event') return;
    setMine(true);
    setExtra((e) => (e.includes(c) ? e.filter((x) => x !== c) : [...e, c]));
  };
  const reads = ['event', ...extra];
  const sql = extra.length
    ? `SELECT ${extra.join(', ')}, count() FROM events WHERE event = 'signup' GROUP BY ${extra.join(', ')}`
    : "SELECT count() FROM events WHERE event = 'signup'";
  return (
    <div className="kn-obj ds-q" ref={ref}>
      <div className="ds-q-bar">
        <i /><i /><i />
        <span className="ds-q-t">events <em>example</em></span>
        <p className="ds-q-reads">Reads <span className="ds-q-n"><b key={reads.length}>{reads.length}</b></span> of 12 columns</p>
      </div>
      <div className="ds-q-sql">
        <code aria-live="polite">{sql}</code>
        <span className="x-sr">SELECT count() FROM events WHERE event = 'signup'</span>
      </div>
      <div className="ds-files" role="group" aria-label="Columns">
        {COLS.map((c, ci) => {
          const on = reads.includes(c);
          return (
            <button key={c} type="button" className={'ds-file' + (on ? ' on' : '') + (c === 'event' ? ' fixed' : '')} aria-pressed={on} aria-disabled={c === 'event' || undefined} onClick={() => toggle(c)}>
              <span className="ds-name">{c.split('_').map((w, j) => (j ? <span key={j}>_<wbr />{w}</span> : w))}</span>
              <span className="ds-blocks" aria-hidden="true">{Array.from({ length: 10 }).map((_, i) => <i key={i} style={{ opacity: (0.25 + shade(ci, i) * 0.6).toFixed(2) }} />)}</span>
              {on && <span className="ds-beam" aria-hidden="true" />}
            </button>
          );
        })}
      </div>
      <div className="ds-q-foot">
        <p>Press a column to add it to the query.</p>
        <span className="x-sr">Reads 1 of 12 columns</span>
      </div>
    </div>
  );
}

/* which of n steps a chapter is on: from the scroll through it on desktop (p); on phones it steps once through by
   itself while seen, then rests (a step a second at most, so it ends inside 5 s) */
function useStepOf(p, n, on) {
  const [k, setK] = useState(0);
  const calm = useCalm();
  useEffect(() => {
    if (!p) return;
    const f = (v) => setK(Math.min(n - 1, Math.max(0, Math.floor(v * n))));
    f(p.get());
    return p.on('change', f);
  }, [p, n]);
  useEffect(() => {
    if (p) return;
    if (calm) { setK(n - 1); return; }
    if (!on || k >= n - 1) return;
    const t = setTimeout(() => setK((x) => Math.min(n - 1, x + 1)), Math.min(1000, 4500 / n));
    return () => clearTimeout(t);
  }, [p, n, on, calm, k]);
  return k;
}

const DOES = [
  ['Columns, not rows', 'A table is stored one column at a time, so a query reads only the columns it names. Each column gets a codec suited to what it holds — deltas for a rising timestamp, dictionaries for a repeated label, general compression over the result.'],
  ['Shard it and it keeps up', 'Tables are partitioned and spread across nodes; add nodes and both the storage and the scan spread with them. Parts merge in the background, so ingest never stops for a compaction window.'],
  ['Replicas that agree', 'Replicated tables coordinate through a Raft quorum running inside the server itself — there is no separate coordination service to stand up beside the database. A replica that falls behind catches up part by part.'],
  ['Local disks, or object storage', "Run a shared-nothing cluster on local NVMe, or put the table's data on object storage and scale query nodes on their own. Old partitions expire on a TTL you write into the schema."],
  ['Events, metrics and logs are one shape', 'Append-heavy, partitioned by time, queried by range — the same engine serves all three. Materialized views keep rollups current as rows land, so the summary exists before anyone asks for it.'],
  ['SQL, on several protocols', 'Query over HTTP on 8123, on the native protocol on 9000, or through the MySQL and PostgreSQL wire ports — which is how BI tools and drivers that know nothing about it still connect. A CSV, a Parquet file or a JSON stream loads without a conversion step first.'],
];

/* 01: each column its own file, its own codec */
function ColScene() {
  const F = [['ts', 'deltas'], ['event', 'dictionaries'], ['country', 'dictionaries'], ['revenue', 'general']];
  return (
    <div className="kn-obj ds-sc ds-s-cols">
      {F.map(([c, k], i) => (
        <div key={c} className="ds-s-file" style={{ '--i': i }}>
          <b>{c}</b>
          <span>{Array.from({ length: 9 }).map((_, j) => <i key={j} style={{ opacity: (0.2 + shade(i + 3, j) * 0.7).toFixed(2) }} />)}</span>
          <em>{k}</em>
        </div>
      ))}
    </div>
  );
}

/* 02: add a node and the parts spread; small parts merge in the background */
function ShardScene({ p, on }) {
  const k = useStepOf(p, 3, on);
  const nodes = k === 0 ? 2 : 3;
  const per = k === 0 ? 6 : 4;
  return (
    <div className="kn-obj ds-sc ds-s-shard">
      <div className="ds-nodes" style={{ '--n': nodes }}>
        {Array.from({ length: 3 }).map((_, n) => (
          <div key={n} className={'ds-node' + (n < nodes ? ' in' : '')}>
            <p className="ds-k">node</p>
            <div className="ds-parts">
              {Array.from({ length: per }).map((_, j) => <i key={j} className={k === 2 && j === 0 ? 'merged' : k === 2 && j === 1 ? 'gone' : ''} />)}
            </div>
          </div>
        ))}
      </div>
      <p className="ds-s-cap">{k === 0 ? 'partitioned and spread across nodes' : k === 1 ? 'add nodes' : 'parts merge in the background'}</p>
    </div>
  );
}

/* 03: a Raft quorum inside the server; a replica that fell behind catches up part by part */
function RaftScene({ p, on }) {
  const k = useStepOf(p, 5, on);
  return (
    <div className="kn-obj ds-sc ds-s-raft">
      <div className="ds-raft">
        <svg viewBox="0 0 300 260" aria-hidden="true"><path d="M150 40 L40 210 L260 210 Z" /></svg>
        <p className="ds-raft-q">Raft quorum</p>
        {['replica', 'replica', 'replica'].map((r, i) => (
          <div key={i} className={'ds-rep r' + i + (i === 2 ? ' behind' : '')}>
            <b>{r}</b>
            <span>{Array.from({ length: 5 }).map((_, j) => <i key={j} className={i < 2 || j <= k ? 'on' : ''} />)}</span>
          </div>
        ))}
      </div>
      <p className="ds-s-cap">catches up part by part</p>
    </div>
  );
}

/* 04: local NVMe, or object storage under query nodes; an old partition expiring */
function DiskScene({ p, on }) {
  const k = useStepOf(p, 2, on);
  return (
    <div className="kn-obj ds-sc ds-s-disk">
      <div className="ds-disk-tabs" aria-hidden="true"><span className={k === 0 ? 'on' : ''}>local NVMe</span><span className={k === 1 ? 'on' : ''}>object storage</span></div>
      <div className={'ds-disk ' + (k === 0 ? 'local' : 'obj')}>
        {[0, 1, 2].map((n) => <div key={n} className="ds-dn"><b>node</b><i /></div>)}
        <div className="ds-bucket">object storage</div>
      </div>
      <div className="ds-ttl"><span className="old">partition</span><span>partition</span><span>partition</span><span>partition</span><em>TTL</em></div>
    </div>
  );
}

/* 05: three streams, one shape, a rollup already there */
function ShapeScene() {
  return (
    <div className="kn-obj ds-sc ds-s-shape">
      <div className="ds-streams">{['Events', 'metrics', 'logs'].map((s, i) => <p key={s} style={{ '--i': i }}><b>{s}</b><i /></p>)}</div>
      <div className="ds-time"><p className="ds-k">partitioned by time</p><span>{Array.from({ length: 8 }).map((_, j) => <i key={j} style={{ '--j': j }} />)}</span></div>
      <div className="ds-mv"><p className="ds-k">Materialized views</p><span>{[0.5, 0.75, 0.62, 0.9, 0.7].map((h, j) => <i key={j} style={{ '--h': h, '--j': j }} />)}</span></div>
    </div>
  );
}

/* 06: the ways in, and the formats that load as they are */
function ProtoScene() {
  return (
    <div className="kn-obj ds-sc ds-s-proto">
      <ul className="ds-ports">
        {[['HTTP', '8123'], ['native protocol', '9000'], ['MySQL', 'wire port'], ['PostgreSQL', 'wire port']].map(([n, v]) => <li key={n}><b>{n}</b><span className={/\d/.test(v) ? 'kn-fig num' : ''}>{v}</span></li>)}
      </ul>
      <p className="ds-loads">{['CSV', 'Parquet', 'JSON stream'].map((f) => <span key={f}>{f}</span>)}</p>
    </div>
  );
}

const SCENES = [ColScene, ShardScene, RaftScene, DiskScene, ShapeScene, ProtoScene];

/* The signature: a table pulled apart into its layers as you scroll. */
const XC = [['ts', 'deltas', 0.3], ['user_id', 'general', 0.52], ['event', 'dictionary', 0.34], ['country', 'dictionary', 0.4], ['device', 'dictionary', 0.32], ['plan', 'dictionary', 0.28], ['revenue', 'general', 0.5], ['duration_ms', 'general', 0.48]];
const PARTS = 4, PER = 4;
const SPEED = [
  ['Read only what the query names', 'A row store reads the whole row to answer a question about two of its fields. A column store reads the two.', 'Fewer bytes off the disk, fewer bytes to decompress, and more of the working set fits in memory.'],
  ['One instruction, many values', 'Values from a single column sit next to each other in memory in the same representation, so a sum or a filter runs across a block of them with vector instructions instead of once per row.', 'That layout is also what keeps the CPU cache full rather than chasing pointers.'],
  ['Sorted, so a range is contiguous', "Rows are written in the order of the table's sorting key and grouped into parts by partition, so a query bounded by time reads a run of adjacent blocks instead of seeking around the disk.", 'Marks inside each part let the scan jump straight to the block that could hold the answer.'],
  ['Compression chosen per column', 'A rising timestamp compresses as deltas. A repeated label compresses as a dictionary. A general-purpose compressor runs over whatever is left.', 'Less data on disk is also less data on the wire once the query is spread across nodes.'],
];
const AT = [0.2, 0.4, 0.66, 1];
const clamp01 = (v) => Math.min(1, Math.max(0, v));

function Explode() {
  const run = useRef(null);
  const obj = useRef(null);
  const wide = useWide();
  const calm = useCalm();
  const seen = useInView(run, { amount: 0.2 });
  const [st, setSt] = useState(0);
  const [hand, setHand] = useState(false);
  const scrub = wide && !calm;
  const { scrollYProgress: p } = useScroll({ target: run, offset: ['start start', 'end end'] });
  const apply = (s) => {
    const el = obj.current;
    if (!el) return;
    const ex = clamp01((s - 0.05) / 0.13);
    el.style.setProperty('--ex', ex.toFixed(3));
    el.style.setProperty('--sp', clamp01((s - 0.52) / 0.1).toFixed(3));
    el.style.setProperty('--cz', clamp01((s - 0.77) / 0.1).toFixed(3));
    el.toggleAttribute('data-apart', ex > 0.5);
  };
  useMotionValueEvent(p, 'change', (v) => { if (!scrub) return; apply(v); setSt(Math.min(3, Math.floor(v * 4 * 0.9999))); });
  const shown = calm && !hand ? 3 : st;
  useEffect(() => { scrub ? apply(p.get()) : apply(AT[shown]); }, [scrub, shown, p]);
  // phones: the four states play once by themselves while seen, then rest on the last
  useEffect(() => {
    if (scrub || calm || hand || !seen || st >= 3) return;
    const t = setTimeout(() => setSt((x) => Math.min(3, x + 1)), 1100);
    return () => clearTimeout(t);
  }, [scrub, calm, hand, seen, st]);
  const go = (i) => {
    if (!scrub) { setSt(i); setHand(true); return; }
    const el = run.current;
    const top = el.getBoundingClientRect().top + window.scrollY;
    scrollToY(top + ((el.offsetHeight - window.innerHeight) * (i + 0.6)) / 4);
  };
  return (
    <section className="ds-x" aria-labelledby="ds-x-h">
      <div ref={run} className="ds-x-run">
        <div className="ds-x-pin">
          <div className="kn-wrap kn-grid ds-x-top">
            <KeynoteLines id="ds-x-h" className="kn-headline ds-x-h" lines={['Where the speed', 'comes from']} />
            <p className="kn-lede ds-x-lede">Nothing exotic. Read less, decompress less, and touch memory in the order the CPU wants it.</p>
          </div>
          <div className="ds-x-stage" aria-hidden="true">
            <div className={'ds-x-obj s' + shown} ref={obj}>
              {XC.map(([c, codec, r], i) => (
                <div key={c} className={'ds-x-col' + (c === 'event' || c === 'country' ? ' read' : '') + (c === 'revenue' ? ' vec' : '')} style={{ '--ci': i - (XC.length - 1) / 2, '--r': r }}>
                  <p className="ds-x-name">{c}</p>
                  <p className="ds-x-codec">{codec}</p>
                  <div className="ds-x-parts">
                    {Array.from({ length: PARTS }).map((_, k) => (
                      <div key={k} className={'ds-x-part' + (k === 1 || k === 2 ? ' run' : '')} style={{ '--pi': k }}>
                        {Array.from({ length: PER }).map((_, j) => <i key={j} style={{ '--v': (0.18 + shade(i, k * PER + j) * 0.55).toFixed(2) }} />)}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              <span className="ds-x-row" />
            </div>
          </div>
          <div className="kn-wrap kn-grid ds-x-bot">
            <div className="ds-x-says">
              {SPEED.map(([t, a, b], i) => (
                <div key={t} className="ds-x-say" data-on={shown === i ? '' : undefined}>
                  <h3 className="kn-title">{t}</h3>
                  <p className="ds-x-p">{a}</p>
                  <p className="ds-x-p sub">{b}</p>
                  <p className="ds-x-k kn-fig">{String(i + 1).padStart(2, '0')}</p>
                </div>
              ))}
            </div>
            <nav className="ds-x-rail" aria-label="Where the speed comes from">
              {SPEED.map(([t], i) => (
                <button key={t} type="button" aria-current={shown === i ? 'step' : undefined} aria-label={t} onClick={() => go(i)}><span className="kn-fig">{String(i + 1).padStart(2, '0')}</span></button>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </section>
  );
}

const INDUSTRIES = ['Web and app analytics', 'E-commerce and finance', 'Time series', 'Advertising networks and RTB', 'Information security', 'Business intelligence', 'Telecommunications', 'Monitoring and telemetry', 'Online games', 'Internet of Things (IoT)', 'Observability', 'User behavior analytics'];

function Who() {
  return (
    <section className="kn-sec ds-who">
      <div className="kn-wrap kn-grid ds-who-g">
        <div className="ds-who-h">
          <KeynoteLines className="kn-headline" lines={['What people', 'point it at']} />
          <p className="kn-body">Different industries, the same shape of problem: a great many rows in, a small answer out, asked again a second later.</p>
        </div>
        <ol className="ds-index">{INDUSTRIES.map((t, i) => <li key={t}><span className="kn-fig">{String(i + 1).padStart(2, '0')}</span>{t}</li>)}</ol>
      </div>
    </section>
  );
}

// the four ways in, as Hanzo lists them; the wire ports carry no number because Hanzo does not give one
const WAYS = [
  ['HTTP', '8123', 'Query over HTTP on 8123.'],
  ['Native', '9000', 'Query on the native protocol on 9000.'],
  ['MySQL', '', 'Through the MySQL wire port, which is how BI tools and drivers that know nothing about it still connect.'],
  ['PostgreSQL', '', 'Through the PostgreSQL wire port, which is how BI tools and drivers that know nothing about it still connect.'],
];

/* the port board: one tile per character; on a change each true digit drops in from behind its tile's mask, 60 ms
   apart. No other digit is ever drawn (the value is in the HTML; the motion is a clip, not a count). */
function Board({ value }) {
  return (
    <p className="ds-board">
      <span className="x-sr">{value}</span>
      {[...value].map((c, i) => (
        <span key={i} className="ds-tile" aria-hidden="true"><b key={value + i} style={{ '--i': i }}>{c}</b></span>
      ))}
    </p>
  );
}

function Ways() {
  const [at, setAt] = useState(0);
  const [name, port, line] = WAYS[at];
  return (
    <section className="kn-sec ds-ways">
      <div className="kn-wrap kn-grid ds-ways-g">
        <div className="ds-ways-l">
          <div className="ds-ways-h">
            <KeynoteLines className="kn-headline" lines="Which way in?" />
            <p className="kn-kick">SQL, on several protocols</p>
          </div>
          <div className="ds-ways-pick" role="radiogroup" aria-label="Protocol">
            {WAYS.map(([n], i) => <button key={n} type="button" role="radio" aria-checked={at === i} onClick={() => setAt(i)}>{n}</button>)}
          </div>
        </div>
        <div className="ds-port" aria-live="polite">
          <p className="ds-port-k">{name}{port ? ' · port' : ' · wire port'}</p>
          {port ? <Board value={port} /> : <p className="ds-port-w"><span key={name}>{name}</span></p>}
          <p className="ds-port-l">{line}</p>
          <p className="ds-port-f">A CSV, a Parquet file or a JSON stream loads without a conversion step first.</p>
        </div>
      </div>
    </section>
  );
}

export default function Datastore() {
  return (
    <main className="kn ds">
      <KeynoteStage
        kick="Hanzo Datastore"
        title={['A column store', 'for analytical SQL']}
        lede="Datastore keeps each column of a table in its own file, compressed on its own terms, so a query naming four columns out of a hundred reads four."
        acts={[['Try Hanzo', '/login'], ['Documentation', 'https://docs.hanzo.ai']]}
        cta="datastore.hero"
        from={1.08}
      >
        <Query />
      </KeynoteStage>

      <KeynoteChapters
        className="ds-ch"
        side="left"
        swap="scale"
        count
        tall={85}
        head={
          <div className="kn-grid ds-ch-head">
            <KeynoteLines className="kn-headline ds-ch-h" lines="What it does" />
            <p className="kn-lede ds-ch-l">Scan a great many rows. Return a small answer. Do it while the rows are still arriving.</p>
          </div>
        }
        items={DOES.map(([t, d]) => ({ title: t, body: <p>{d}</p> }))}
        visual={(i, on, p) => { const S = SCENES[i]; return <S on={on} p={p} />; }}
      />

      <Explode />
      <Who />
      <Ways />

      <KeynoteClose
        name="Datastore"
        tag="Document datastore"
        lead="hanzoai/datastore"
        repo={['hanzoai/datastore', 'https://github.com/hanzoai/datastore']}
        stars="4 stars"
        self="https://docs.hanzo.ai/docs/projects/hanzoai/datastore"
        api="/v1/provisioning/datastore"
        cta="datastore.close"
        prompt="Read https://hanzo.ai/skill.md and use Hanzo Datastore in my project. Start with: hanzo provisioning datastore create"
      />
    </main>
  );
}
