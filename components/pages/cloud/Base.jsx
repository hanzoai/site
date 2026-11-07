'use client';
/* Base. Signature: "declare a collection, get an API", played out. Fields are written into a collection on the left;
   the moment it exists the four things Hanzo promises light up on the right, in Hanzo's own order (it answers over
   HTTP, carries an access rule, streams its changes, shows up in the admin) while records start arriving. The hero is
   the one file: a single binary serving five kinds of work over one HTTP API, with the deploy-is-a-copy and the
   backup-is-a-copy happening in turn. The three pillars open like drawers; the four places to run it all print the
   same API.
   Beyond: "Your collection". Type the name of a collection you would declare and the demo declares that one: its
   records answer at /v1/collections/{name}/records the same second, Hanzo's own path, with your name in it.
   Every word, figure and link is Hanzo's. */
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { EASE, Rise } from '../../ui';
import { A } from '../../kit';
import { Hero, Paste, Related, Get, Console, Head, useLive, useSteps } from './Frame';
import './Base.css';

const SERVES = ['your data', 'your users', 'your files', 'live updates', 'scheduled work'];

/* One binary, five kinds of work, one HTTP API; then the copy that deploys it and the copy that backs it up. */
function OneFile() {
  const [ref, live] = useLive(0.3);
  const [at] = useSteps(2, 3400, live);
  return (
    <div className="bs-one" ref={ref} aria-hidden="true">
      <div className="bs-bin">
        <p className="bs-bin-k">single Go binary</p>
        <p className="bs-bin-n">base</p>
        <ul>{SERVES.map((s, i) => <li key={s} style={{ '--i': i }}><i />{s}</li>)}</ul>
      </div>
      <div className="bs-wires">{SERVES.map((s, i) => <i key={s} style={{ '--i': i, top: 18 + i * 16 + '%' }}><b /></i>)}</div>
      <div className="bs-api"><span>one</span>HTTP API</div>
      <div className="bs-db">
        <svg viewBox="0 0 24 28" width="22" height="26"><path d="M3 2h12l6 6v18H3z M15 2v6h6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" /></svg>
        <span>SQLite file on disk</span>
      </div>
      <div className="bs-copies">
        <AnimatePresence mode="wait">
          <motion.p key={at} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.4, ease: EASE }}>
            {at === 0 ? <><b>deploying</b> is copying a binary</> : <><b>backing up</b> is copying a file</>}
          </motion.p>
        </AnimatePresence>
        <motion.span key={'g' + at} className={'bs-ghost ' + (at === 0 ? 'bin' : 'file')} initial={{ x: 0, opacity: 0.9 }} animate={{ x: 120, opacity: 0 }} transition={{ duration: 1.6, ease: EASE, delay: 0.3 }}>{at === 0 ? 'base' : 'data.db'}</motion.span>
      </div>
    </div>
  );
}

const FIELDS = [['title', 'text'], ['body', 'text'], ['author', 'relation'], ['published', 'bool']];
const GETS = ['answers over HTTP', 'carries an access rule', 'streams its changes', 'shows up in the admin'];

function Declare() {
  const [ref, live, calm] = useLive(0.35);
  const [name, setName] = useState('posts');
  const coll = name || 'posts';
  const [t, setT] = useState(calm ? 99 : 0);
  useEffect(() => {
    if (calm) { setT(99); return; }
    if (!live) return;
    const id = setTimeout(() => setT((v) => (v >= 16 ? 0 : v + 1)), t === 16 ? 2600 : 520);
    return () => clearTimeout(id);
  }, [t, live, calm]);
  const nf = Math.min(FIELDS.length, t);
  const exists = t >= 5;
  const lit = exists ? Math.min(GETS.length, t - 5) : 0;
  const recs = Math.max(0, Math.min(4, t - 9));
  return (
    <section className="x-sec bs-dec" ref={ref}>
      <div className="x-wrap">
        <Head kick="What is Hanzo Base" title="Declare a collection, get an API" lede="A collection is a real table with a schema you write down. The moment it exists it answers over HTTP, carries an access rule, streams its changes, and shows up in the admin. There is no code generation step and nothing to wire together." />
        <label className="bs-name">
          <span>collection</span>
          <input type="text" value={name} maxLength={24} spellCheck={false} autoComplete="off" placeholder="posts" onChange={(e) => setName(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))} aria-label="Collection name" />
        </label>
        <div className="bs-dec-grid" aria-hidden="true">
          <div className="bs-schema">
            <p className="bs-pane-k">collection</p>
            <p className="bs-coll">{coll}</p>
            <ul>
              {FIELDS.map(([f, ty], i) => (
                <motion.li key={f} initial={false} animate={{ opacity: i < nf ? 1 : 0.15, x: i < nf ? 0 : -8 }} transition={{ duration: 0.4, ease: EASE }}><span>{f}</span><em>{ty}</em></motion.li>
              ))}
            </ul>
            <motion.p className="bs-exists" initial={false} animate={{ opacity: exists ? 1 : 0, scale: exists ? 1 : 0.9 }}>exists</motion.p>
          </div>
          <div className="bs-arrow"><motion.i initial={false} animate={{ scaleX: exists ? 1 : 0 }} transition={{ duration: 0.6, ease: EASE }} /></div>
          <div className="bs-gets">
            <p className="bs-pane-k">the same second</p>
            <ol>
              {GETS.map((g, i) => (
                <li key={g} className={i < lit ? 'on' : ''}>
                  <svg viewBox="0 0 24 24" width="22" height="22"><circle cx="12" cy="12" r="10.5" /><path d="M7.5 12.5l3 3 6-6.5" /></svg>
                  <span>{g}</span>
                </li>
              ))}
            </ol>
            <div className="bs-url"><b>GET</b> /v1/collections/{coll}/records</div>
            <div className="bs-recs">
              {[0, 1, 2, 3].map((i) => (
                <motion.div key={i} className="bs-rec" initial={false} animate={{ opacity: i < recs ? 1 : 0, y: i < recs ? 0 : -10 }} transition={{ duration: 0.4, ease: EASE }}>
                  <i /><span style={{ width: 40 + ((i * 23) % 40) + '%' }} /><em>{['text', 'text', 'relation', 'bool'][i]}</em>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const PILLARS = [
  ['Data', 'Records answer at /v1/collections/{name}/records — list, read, create, update, delete, with paging, sorting and a filter language over every field you declared. Schema changes are migrations. SQLite is the default store; hand Base a Postgres DSN and the same API runs on that instead.'],
  ['Auth is Hanzo IAM', 'Base keeps no password and has no login form. It verifies the token IAM signed and reads the identity out of it — that is the whole of authentication. One account everywhere Hanzo runs, and no reset flow of your own to get wrong.'],
  ['Files and live updates', 'Uploads go to object storage and are served through the same rule that guards the record pointing at them. Clients open one stream and receive records as they change, so a page stays current without asking again every few seconds.'],
];

/* Three drawers: the open one is wide, the others stand narrow with their number; you open the next. */
function Pillars() {
  const [at, choose] = useState(0);
  return (
    <section className="bs-pil">
      <div className="x-wrap bs-drawers">
        {PILLARS.map(([t, d], i) => (
          <motion.button key={t} type="button" layout className={'bs-drawer' + (at === i ? ' open' : '')} onClick={() => choose(i)} aria-expanded={at === i} transition={{ type: 'spring', stiffness: 200, damping: 30 }}>
            <span className="bs-drawer-n">{String(i + 1).padStart(2, '0')}</span>
            <span className="bs-drawer-t">{t}</span>
            <motion.span className="bs-drawer-d" initial={false} animate={{ opacity: at === i ? 1 : 0 }} transition={{ duration: 0.4, delay: at === i ? 0.25 : 0 }}>{d}</motion.span>
          </motion.button>
        ))}
      </div>
    </section>
  );
}

const CAPS = [
  ['The schema is the API', 'Define a collection and its records are addressable the same second, with an admin UI to browse and edit them. Nothing is scaffolded into your repo, so there is nothing to regenerate when the schema moves.'],
  ['One stream, no polling', 'Subscribe over server-sent events and records arrive as they change. A browser cannot put a header on that request, so the stream is opened with a short-lived grant minted on an ordinary authenticated call — your access token never travels in a URL.'],
  ['Rules run before the count', 'An access rule is a predicate on the collection, folded into the query ahead of paging and ahead of the count — so a row you may not read is not counted either. With nobody signed in, a rule naming the caller matches nothing.'],
  ['Files behind the same rule', 'An upload is guarded by the rule on the record that references it, and reading one takes a token minted per request rather than a URL that works forever.'],
  ['A file per tenant', 'Each org gets its own SQLite file, opened under a key derived for that org — a different tenant is a different file, so no query can reach across two. Point Base at object storage and the write-ahead log streams there continuously, encrypted before it leaves the process, and you can restore to a moment.'],
  ['Server-side logic, fenced in', 'A function is a record in a collection, so the collection’s rules decide who may run it. It runs in-process with two calls bound — read a record, read a list — and no network, no filesystem, no shell. Whatever the first version binds is supported forever, which is why that list is short.'],
];

/* Capabilities as an index: hover or tap a title and its paragraph takes the big panel. */
function Caps() {
  const [at, setAt] = useState(0);
  return (
    <section className="x-sec bs-caps">
      <div className="x-wrap">
        <header className="bs-caps-h"><p className="x-kick">Capabilities</p><h2>What you get</h2></header>
        <div className="bs-caps-grid">
          <ul className="bs-idx" role="tablist" aria-label="Capabilities" aria-orientation="vertical">
            {CAPS.map(([t], i) => (
              <li key={t}>
                <button type="button" role="tab" aria-selected={at === i} id={'bs-cap-' + i} aria-controls={'bs-capp-' + i} onClick={() => setAt(i)} onMouseEnter={() => setAt(i)} onFocus={() => setAt(i)}>
                  <span>{String(i + 1).padStart(2, '0')}</span>{t}
                  {at === i && <motion.i layoutId="bs-idx" className="bs-idx-bar" transition={{ type: 'spring', stiffness: 420, damping: 34 }} />}
                </button>
              </li>
            ))}
          </ul>
          <div className="bs-panel">
            {CAPS.map(([t, d], i) => (
              <div key={t} role="tabpanel" id={'bs-capp-' + i} aria-labelledby={'bs-cap-' + i} hidden={at !== i}>
                <motion.h3 key={'h' + (at === i)} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease: EASE }}>{t}</motion.h3>
                <motion.p key={'p' + (at === i)} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease: EASE, delay: 0.06 }}>{d}</motion.p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

const PLACES = ['Hanzo Cloud', 'a laptop', 'a box', 'a cluster'];

function Run() {
  return (
    <section className="x-sec bs-run" data-room="dark">
      <div className="x-wrap">
        <div className="bs-run-top">
          <div>
            <Head dark title="Run the binary" lede="Deploy Base managed on Hanzo Cloud, or run it yourself on a laptop, a box, or a cluster. Same API in all four places." />
            <div className="bs-run-acts">
              <A to="https://platform.hanzo.ai" className="x-btn solid">Deploy on Hanzo Cloud</A>
              <A to="https://github.com/hanzoai/base" className="x-btn">GitHub</A>
            </div>
          </div>
          <div><Console name="Base" api="/v1/base" side={[['Base', '/base'], ['Datastore', '/datastore'], ['Object Storage', '/s3'], ['Memory', '/cloud/memory']]} /></div>
        </div>
        <p className="bs-run-note">Example project. Every name in it is one you would give your own.</p>
        <ul className="bs-places" aria-hidden="true">
          {PLACES.map((p, i) => (
            <Rise as="li" key={p} delay={i * 0.06}>
              <span className="bs-place-k">{p}</span>
              <code>/v1/collections/{'{name}'}/records</code>
              <i style={{ animationDelay: i * 0.35 + 's' }} />
            </Rise>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default function Base() {
  return (
    <main className="bs">
      <Hero
        look="flip"
        kick="Hanzo Base · App backend"
        title="An app backend in one file"
        lede="Base is a single Go binary that serves your data, your users, your files, live updates and scheduled work over one HTTP API. The store is a SQLite file on disk, so deploying is copying a binary and backing up is copying a file."
        acts={[['Try Hanzo', '/login'], ['Read the docs', 'https://docs.hanzo.ai/docs/projects/hanzoai/base'], ['View on GitHub', 'https://github.com/hanzoai/base']]}
        note={<p className="bs-note">Open source (MIT). Runs as one binary — self-host or deploy managed on Hanzo Cloud.</p>}
      >
        <OneFile />
      </Hero>
      <Declare />
      <Pillars />
      <Caps />
      <Run />
      <section className="x-sec bs-paste">
        <div className="x-wrap">
          <Paste name="Base" api="/v1/base" prompt="Read https://hanzo.ai/skill.md and use Hanzo Base in my project. Start with: hanzo base bases list" />
          <Related className="bs-rel" items={[['Base docs →', 'https://docs.hanzo.ai/docs/projects/hanzoai/base'], ['Datastore', '/datastore', 'Analytical columnar store'], ['Object Storage', '/s3', 'Object storage'], ['Memory', '/cloud/memory']]} />
        </div>
      </section>
      <Get name="Base" tag="Embedded data backend with IAM-native auth" license="MIT" repo={['hanzoai/base', 'https://github.com/hanzoai/base']} stars="4 stars" self="https://docs.hanzo.ai/docs/projects/hanzoai/base" />
      <i hidden data-thumb="Try Hanzo" data-href="/login" />
    </main>
  );
}
