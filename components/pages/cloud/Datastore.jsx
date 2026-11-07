'use client';
/* Datastore. Signature: a query that reads only the columns it names. Twelve column files stand side by side; press
   one and it joins the query, and the scan beam runs down only the files the query names while the counter reports
   "Reads N of 12 columns" (it plays by itself until you press one). Below: the six facts as an editorial page with
   run-in heads, the four reasons for the speed each with its own small diagram in the dark room, and the twelve
   industries as a typographic index. Beyond: "Which way in" - pick how you connect (HTTP, the native protocol, or the
   MySQL and PostgreSQL wire ports) and the port flips onto a split-flap board, with Hanzo's line on who connects that way.
   Every word and link is Hanzo's. */
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { EASE, Rise } from '../../ui';
import { Flap } from '../../kit';
import { Hero, Paste, Get, Head, useLive } from './Frame';
import './Datastore.css';

const COLS = ['ts', 'user_id', 'event', 'country', 'device', 'plan', 'revenue', 'duration_ms', 'referrer', 'path', 'session', 'version'];
const AUTO = [[], ['country'], ['country', 'device'], ['plan'], []];

function Columns() {
  const [ref, live, calm] = useLive(0.3);
  const [extra, setExtra] = useState([]);
  const [mine, setMine] = useState(false);
  const [k, setK] = useState(0);
  useEffect(() => {
    if (mine || !live || calm) return;
    const t = setTimeout(() => { const n = (k + 1) % AUTO.length; setK(n); setExtra(AUTO[n]); }, 2600);
    return () => clearTimeout(t);
  }, [k, mine, live, calm]);
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
    <div className="ds-cols" ref={ref}>
      <div className="ds-q">
        <span className="ds-tbl">events <em>example</em></span>
        <code aria-live="polite">{sql}</code>
        {/* the live page's query, kept whole for readers and search */}
        <span className="x-sr">SELECT count() FROM events WHERE event = 'signup'</span>
      </div>
      <div className="ds-files" role="group" aria-label="Columns">
        {COLS.map((c) => {
          const on = reads.includes(c);
          return (
            <button key={c} type="button" className={'ds-file' + (on ? ' on' : '') + (c === 'event' ? ' fixed' : '')} aria-pressed={on} onClick={() => toggle(c)}>
              <span className="ds-blocks" aria-hidden="true">{Array.from({ length: 9 }).map((_, i) => <i key={i} />)}</span>
              {on && <span className="ds-beam" aria-hidden="true" />}
              <span className="ds-name">{c}</span>
            </button>
          );
        })}
      </div>
      <div className="ds-foot">
        <p className="ds-reads">Reads <AnimatePresence mode="popLayout" initial={false}><motion.b key={reads.length} initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -12, opacity: 0 }} transition={{ type: 'spring', stiffness: 400, damping: 30 }}>{reads.length}</motion.b></AnimatePresence> of 12 columns</p>
        <p className="ds-hint">Press a column to add it to the query.</p>
      </div>
      <span className="x-sr">Reads 1 of 12 columns</span>
    </div>
  );
}

const DOES = [
  ['Columns, not rows', 'A table is stored one column at a time, so a query reads only the columns it names. Each column gets a codec suited to what it holds — deltas for a rising timestamp, dictionaries for a repeated label, general compression over the result.'],
  ['Shard it and it keeps up', 'Tables are partitioned and spread across nodes; add nodes and both the storage and the scan spread with them. Parts merge in the background, so ingest never stops for a compaction window.'],
  ['Replicas that agree', 'Replicated tables coordinate through a Raft quorum running inside the server itself — there is no separate coordination service to stand up beside the database. A replica that falls behind catches up part by part.'],
  ['Local disks, or object storage', "Run a shared-nothing cluster on local NVMe, or put the table's data on object storage and scale query nodes on their own. Old partitions expire on a TTL you write into the schema."],
  ['Events, metrics and logs are one shape', 'Append-heavy, partitioned by time, queried by range — the same engine serves all three. Materialized views keep rollups current as rows land, so the summary exists before anyone asks for it.'],
  ['SQL, on several protocols', 'Query over HTTP on 8123, on the native protocol on 9000, or through the MySQL and PostgreSQL wire ports — which is how BI tools and drivers that know nothing about it still connect. A CSV, a Parquet file or a JSON stream loads without a conversion step first.'],
];

const SPEED = [
  ['Read only what the query names', 'A row store reads the whole row to answer a question about two of its fields. A column store reads the two.', 'Fewer bytes off the disk, fewer bytes to decompress, and more of the working set fits in memory.'],
  ['One instruction, many values', 'Values from a single column sit next to each other in memory in the same representation, so a sum or a filter runs across a block of them with vector instructions instead of once per row.', 'That layout is also what keeps the CPU cache full rather than chasing pointers.'],
  ['Sorted, so a range is contiguous', "Rows are written in the order of the table's sorting key and grouped into parts by partition, so a query bounded by time reads a run of adjacent blocks instead of seeking around the disk.", 'Marks inside each part let the scan jump straight to the block that could hold the answer.'],
  ['Compression chosen per column', 'A rising timestamp compresses as deltas. A repeated label compresses as a dictionary. A general-purpose compressor runs over whatever is left.', 'Less data on disk is also less data on the wire once the query is spread across nodes.'],
];

function Mini({ i }) {
  if (i === 0) return <div className="ds-m0"><div>{Array.from({ length: 4 }).map((_, r) => <span key={r}>{Array.from({ length: 6 }).map((_, c) => <i key={c} />)}</span>)}</div><div className="col">{Array.from({ length: 4 }).map((_, r) => <span key={r}>{Array.from({ length: 6 }).map((_, c) => <i key={c} className={c === 1 || c === 4 ? 'on' : ''} />)}</span>)}</div></div>;
  if (i === 1) return <div className="ds-m1">{Array.from({ length: 8 }).map((_, k) => <i key={k} />)}<b /></div>;
  if (i === 2) return <div className="ds-m2">{Array.from({ length: 14 }).map((_, k) => <i key={k} className={k >= 5 && k <= 8 ? 'on' : ''} />)}</div>;
  return <div className="ds-m3"><span>Δ deltas</span><span>dictionary</span><span>general</span></div>;
}

const INDUSTRIES = ['Web and app analytics', 'E-commerce and finance', 'Time series', 'Advertising networks and RTB', 'Information security', 'Business intelligence', 'Telecommunications', 'Monitoring and telemetry', 'Online games', 'Internet of Things (IoT)', 'Observability', 'User behavior analytics'];

// the four ways in, as Hanzo lists them; the wire ports carry no number because Hanzo does not give one
const WAYS = [
  ['HTTP', '8123', 'Query over HTTP on 8123.'],
  ['Native', '9000', 'Query on the native protocol on 9000.'],
  ['MySQL', '', 'Through the MySQL wire port, which is how BI tools and drivers that know nothing about it still connect.'],
  ['PostgreSQL', '', 'Through the PostgreSQL wire port, which is how BI tools and drivers that know nothing about it still connect.'],
];

function Ways() {
  const [at, setAt] = useState(0);
  const [name, port, line] = WAYS[at];
  return (
    <section className="x-sec ds-ways">
      <div className="x-wrap ds-ways-grid">
        <div>
          <p className="x-kick">SQL, on several protocols</p>
          <h2>Which way in?</h2>
          <div className="ds-ways-pick" role="radiogroup" aria-label="Protocol">
            {WAYS.map(([n], i) => <button key={n} type="button" role="radio" aria-checked={at === i} onClick={() => setAt(i)}>{n}</button>)}
          </div>
        </div>
        <div className="ds-port" aria-live="polite">
          <p className="ds-port-k">{name}{port ? ' · port' : ' · wire port'}</p>
          {port ? <Flap value={port} className="ds-port-n" /> : <p className="ds-port-w">{name}</p>}
          <p className="ds-port-l">{line}</p>
          <p className="ds-port-f">A CSV, a Parquet file or a JSON stream loads without a conversion step first.</p>
        </div>
      </div>
    </section>
  );
}

export default function Datastore() {
  return (
    <main className="ds">
      <Hero
        look="stack"
        kick="Hanzo Datastore"
        title="A column store for analytical SQL"
        lede="Datastore keeps each column of a table in its own file, compressed on its own terms, so a query naming four columns out of a hundred reads four."
        acts={[['Try Hanzo', '/login'], ['Documentation', 'https://docs.hanzo.ai']]}
      >
        <Columns />
      </Hero>
      <section className="x-sec ds-does">
        <div className="x-wrap">
          <Head title="What it does" lede="Scan a great many rows. Return a small answer. Do it while the rows are still arriving." />
          <div className="ds-paper">
            {DOES.map(([t, d], i) => <Rise as="p" key={t} y={14} delay={(i % 3) * 0.05}><b>{t}.</b> {d}</Rise>)}
          </div>
        </div>
      </section>
      <section className="x-sec ds-speed" data-room="dark">
        <div className="x-wrap">
          <Head dark title="Where the speed comes from" lede="Nothing exotic. Read less, decompress less, and touch memory in the order the CPU wants it." />
          <div className="ds-four">
            {SPEED.map(([t, a, b], i) => (
              <Rise key={t} className="ds-sp" delay={(i % 2) * 0.08}>
                <div className="ds-mini" aria-hidden="true"><Mini i={i} /></div>
                <h3>{t}</h3>
                <p>{a}</p>
                <p className="ds-sub">{b}</p>
              </Rise>
            ))}
          </div>
        </div>
      </section>
      <section className="x-sec ds-who">
        <div className="x-wrap">
          <Head title="What people point it at" lede="Different industries, the same shape of problem: a great many rows in, a small answer out, asked again a second later." />
          <ol className="ds-index">{INDUSTRIES.map((t, i) => <li key={t}><span>{String(i + 1).padStart(2, '0')}</span>{t}</li>)}</ol>
        </div>
      </section>
      <Ways />
      <section className="x-sec ds-paste">
        <div className="x-wrap"><Paste name="Datastore" api="/v1/provisioning/datastore" prompt="Read https://hanzo.ai/skill.md and use Hanzo Datastore in my project. Start with: hanzo provisioning datastore create" /></div>
      </section>
      <Get name="Datastore" tag="Document datastore" repo={['hanzoai/datastore', 'https://github.com/hanzoai/datastore']} stars="4 stars" self="https://docs.hanzo.ai/docs/projects/hanzoai/datastore" />
    </main>
  );
}
