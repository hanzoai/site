'use client';
/* Base.
   V2: 8/10 Apple-style launch: the Base admin is the hero object, records landing in it live; "declare a collection, get an API" is its own pinned scene that builds the backend as you scroll; six capabilities are cards that open in place; one dark close.
   Signature: the build-up. A pinned scene where a collection is declared field by field as you scroll, and the
   backend assembles around it in Hanzo's order: the four things it does the moment it exists, then Data (the records
   path and its verbs), Auth is Hanzo IAM (a token in, an identity out) and Files and live updates (one stream, records
   arriving). Phones play it by itself when it is seen.
   Supporting: the Stage hero (the admin starts big and settles to the right as you scroll), capability cards that open
   into a sheet with a shared-element morph (synchronized.studio), and the closing dark room.
   Beyond: "Your collection" - name the collection you would declare and the whole scene declares that one, with its
   records path /v1/collections/{name}/records written out the same second.
   Accent: Base orange. Every word and link is Hanzo's; example rows are blank bars, never invented data. */
import { useEffect, useRef, useState } from 'react';
import { useScroll, useMotionValueEvent, useInView, useReducedMotion } from 'motion/react';
import { A } from '../../kit';
import { Console, useLive, useEvery } from './Frame';
import KeynoteStage from '../../v2/KeynoteStage';
import KeynoteLines from '../../v2/KeynoteLines';
import KeynoteOpen from '../../v2/KeynoteOpen';
import KeynoteClose from '../../v2/KeynoteClose';
import { useWide } from '../../v2/KeynoteChapters';
import './Base.css';

const DOCS = 'https://docs.hanzo.ai/docs/projects/hanzoai/base';
const GH = 'https://github.com/hanzoai/base';
const FIELDS = [['title', 'text'], ['body', 'text'], ['author', 'relation'], ['published', 'bool']];
const hex = (n) => ((n * 2654435761) >>> 0).toString(16).padStart(8, '0').slice(0, 8);

/* The hero object: the Base admin, a collection's records arriving live. Records / Schema are real tabs. */
function Admin() {
  const [ref, live] = useLive(0.25);
  const [tab, setTab] = useState(0);
  const [n, setN] = useState(9);
  useEvery(2600, live && tab === 0, () => setN((v) => v + 1));
  return (
    <div className="kn-obj bs-adm" ref={ref}>
      <div className="bs-adm-bar">
        <i /><i /><i />
        <span className="bs-adm-t">base</span>
        <code className="bs-adm-url"><b>GET</b> /v1/collections/posts/records</code>
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
            <div className="bs-adm-tabs" role="tablist" aria-label="Collection">
              {['Records', 'Schema'].map((t, i) => <button key={t} type="button" role="tab" aria-selected={tab === i} onClick={() => setTab(i)}>{t}</button>)}
            </div>
          </div>
          {tab === 0 ? (
            <div className="bs-tbl" aria-hidden="true">
              <div className="bs-tr bs-th"><span>id</span>{FIELDS.slice(0, 1).concat(FIELDS.slice(2)).map(([f]) => <span key={f}>{f}</span>)}</div>
              <div className="bs-rows" key={n}>
                {Array.from({ length: 8 }, (_, i) => n - i).map((id, i) => (
                  <div key={id} className={'bs-tr' + (i === 0 ? ' new' : '')}>
                    <code>{hex(id)}</code>
                    <span><i style={{ width: 38 + ((id * 29) % 50) + '%' }} /></span>
                    <span className="bs-au"><b /><i style={{ width: 30 + ((id * 17) % 40) + '%' }} /></span>
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

/* the one file: what it serves, and the two copies */
const SERVES = ['your data', 'your users', 'your files', 'live updates', 'scheduled work'];
function OneFile() {
  return (
    <section className="kn-sec bs-one">
      <div className="kn-wrap kn-grid bs-one-g">
        <p className="bs-one-say">Base is a single Go binary that serves your data, your users, your files, live updates and scheduled work over one HTTP API. The store is a SQLite file on disk, so deploying is copying a binary and backing up is copying a file.</p>
        <div className="bs-one-v" aria-hidden="true">
          <div className="bs-one-bin">
            <p className="bs-k">single Go binary</p>
            <p className="bs-one-n">base</p>
            <ul>{SERVES.map((s) => <li key={s}>{s}</li>)}</ul>
            <p className="bs-one-api"><b>one</b> HTTP API</p>
          </div>
          <div className="bs-one-copies">
            <p><span className="bs-chip">base</span><i />deploying is copying a binary</p>
            <p><span className="bs-chip file">SQLite file on disk</span><i />backing up is copying a file</p>
          </div>
        </div>
      </div>
    </section>
  );
}

const PROMISES = ['answers over HTTP', 'carries an access rule', 'streams its changes', 'shows up in the admin'];
const PILLARS = [
  ['Data', 'Records answer at /v1/collections/{name}/records — list, read, create, update, delete, with paging, sorting and a filter language over every field you declared. Schema changes are migrations. SQLite is the default store; hand Base a Postgres DSN and the same API runs on that instead.'],
  ['Auth is Hanzo IAM', 'Base keeps no password and has no login form. It verifies the token IAM signed and reads the identity out of it — that is the whole of authentication. One account everywhere Hanzo runs, and no reset flow of your own to get wrong.'],
  ['Files and live updates', 'Uploads go to object storage and are served through the same rule that guards the record pointing at them. Clients open one stream and receive records as they change, so a page stays current without asking again every few seconds.'],
];
const STAGES = ['declare', 'it exists', '01', '02', '03'];

/* The signature: the collection is declared as you scroll and the backend assembles around it. */
function Declare() {
  const run = useRef(null);
  const wide = useWide();
  const calm = useReducedMotion();
  const seen = useInView(run, { amount: 0.25 });
  const [name, setName] = useState('posts');
  const coll = name || 'posts';
  const { scrollYProgress: p } = useScroll({ target: run, offset: ['start start', 'end end'] });
  const [s, setS] = useState(0);
  useMotionValueEvent(p, 'change', (v) => setS(v));
  const [auto, setAuto] = useState(1);
  const [hand, setHand] = useState(false);
  useEffect(() => {
    if (wide || !seen || calm || hand) return;
    const id = setInterval(() => setAuto((a) => (a >= 4 ? 1 : a + 1)), 2200);
    return () => clearInterval(id);
  }, [wide, seen, calm, hand]);
  const st = wide && !calm ? Math.min(4, Math.floor(s * 5 * 0.9999)) : calm && !hand ? 4 : auto;
  const nf = wide && !calm ? Math.min(4, Math.floor(s * 26)) : 4;
  const txt = st <= 1 ? 0 : st - 1;
  const go = (i) => {
    if (!wide) { setAuto(i); setHand(true); return; }
    const el = run.current;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const y = top + ((el.offsetHeight - window.innerHeight) * (i + 0.5)) / 5;
    window.__lenis ? window.__lenis.scrollTo(y, { duration: 1.1 }) : window.scrollTo({ top: y, behavior: 'smooth' });
  };
  const cls = (k) => 'bs-tile' + (st >= k ? ' on' : '') + (st === k ? ' now' : '');
  const live = seen && !calm && (wide ? st === 4 : true);
  return (
    <section className="bs-dec">
      <div ref={run} className="bs-dec-run">
        <div className="bs-dec-pin">
          <div className="kn-wrap kn-grid bs-dec-g">
            <div className="bs-dec-l">
              <p className="kn-kick ac">What is Hanzo Base</p>
              <KeynoteLines className="kn-headline bs-dec-h" lines={['Declare a collection,', 'get an API']} />
              <label className="bs-name">
                <span>collection</span>
                <input type="text" value={name} maxLength={24} spellCheck={false} autoComplete="off" placeholder="posts" onChange={(e) => setName(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))} aria-label="Collection name" />
              </label>
              <div className="bs-says">
                <div className="bs-say" data-on={txt === 0 ? '' : undefined}>
                  <p>A collection is a real table with a schema you write down. The moment it exists it answers over HTTP, carries an access rule, streams its changes, and shows up in the admin. There is no code generation step and nothing to wire together.</p>
                </div>
                {PILLARS.map(([t, d], i) => (
                  <div key={t} className="bs-say" data-on={txt === i + 1 ? '' : undefined}>
                    <p className="bs-say-n kn-fig">{String(i + 1).padStart(2, '0')}</p>
                    <h3 className="kn-title">{t}</h3>
                    <p>{d}</p>
                  </div>
                ))}
              </div>
              <div className="bs-steps" role="tablist" aria-label="Steps">
                {STAGES.map((t, i) => <button key={t} type="button" role="tab" aria-selected={st === i} onClick={() => go(i)}>{t}</button>)}
              </div>
            </div>

            <div className="bs-dec-v" aria-hidden="true">
              <div className={cls(0) + ' bs-t-schema'}>
                <p className="bs-k">collection</p>
                <p className="bs-coll">{coll}</p>
                <ul>{FIELDS.map(([f, t], i) => <li key={f} className={i < nf ? 'in' : ''}><code>{f}</code><em>{t}</em></li>)}</ul>
                <p className={'bs-exists' + (nf >= 4 && st >= 1 ? ' on' : '')}>exists</p>
              </div>
              <div className={cls(1) + ' bs-t-prom'}>
                <p className="bs-k">the moment it exists</p>
                <ul>{PROMISES.map((x, i) => <li key={x} style={{ '--i': i }}><i />{x}</li>)}</ul>
              </div>
              <div className={cls(2) + ' bs-t-api'}>
                <p className="bs-k">Data</p>
                <code className="bs-path">/v1/collections/<b>{coll}</b>/records</code>
                <p className="bs-verbs">{['list', 'read', 'create', 'update', 'delete'].map((v) => <span key={v}>{v}</span>)}</p>
                <p className="bs-stores"><span>SQLite</span><span>Postgres DSN</span></p>
              </div>
              <div className={cls(3) + ' bs-t-iam'}>
                <p className="bs-k">Auth is Hanzo IAM</p>
                <div className="bs-iam"><span className="bs-chip">token IAM signed</span><i /><span className="bs-chip ink">identity</span></div>
                <p className="bs-nos"><s>password</s><s>login form</s><s>reset flow</s></p>
              </div>
              <div className={cls(4) + ' bs-t-live'}>
                <p className="bs-k">one stream</p>
                <div className={'bs-stream' + (live ? ' run' : '')}>{[0, 1, 2, 3].map((i) => <div key={i} style={{ '--i': i }}><code>{coll}</code><i /></div>)}</div>
                <p className="bs-up"><span className="bs-chip">upload</span><i /><span>object storage</span></p>
              </div>
            </div>
          </div>
        </div>
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
  return (
    <section className="kn-sec bs-caps">
      <div className="kn-wrap">
        <div className="kn-grid bs-caps-h">
          <div className="bs-caps-ht">
            <p className="kn-kick ac">Capabilities</p>
            <KeynoteLines className="kn-display sm" lines="What you get" />
          </div>
        </div>
        <KeynoteOpen cols={3} className="bs-open" items={CAPS.map(([id, t, d], i) => { const Pic = Art[id]; return { id, kick: String(i + 1).padStart(2, '0'), title: t, art: <Pic />, body: <p>{d}</p> }; })} />
      </div>
    </section>
  );
}

const PLACES = ['Hanzo Cloud', 'a laptop', 'a box', 'a cluster'];
function Run() {
  return (
    <section className="kn-sec bs-run">
      <div className="kn-wrap kn-grid bs-run-g">
        <div className="bs-run-l">
          <KeynoteLines className="kn-headline" lines="Run the binary" />
          <p className="kn-body">Deploy Base managed on Hanzo Cloud, or run it yourself on a laptop, a box, or a cluster. Same API in all four places.</p>
          <ul className="bs-places" aria-hidden="true">
            {PLACES.map((p) => <li key={p}><span>{p}</span><code>/v1/collections/{'{name}'}/records</code></li>)}
          </ul>
          <div className="kn-acts">
            <A to="https://platform.hanzo.ai" className="kn-btn solid">Deploy on Hanzo Cloud</A>
            <A to={GH} className="kn-btn">GitHub</A>
          </div>
        </div>
        <div className="bs-run-r">
          <Console name="Base" api="/v1/base" light side={[['Base', '/base'], ['Datastore', '/datastore'], ['Object Storage', '/s3'], ['Memory', '/cloud/memory']]} />
          <p className="bs-note">Example project. Every name in it is one you would give your own.</p>
        </div>
      </div>
    </section>
  );
}

const REL = [['Base docs →', DOCS], ['Datastore', '/datastore', 'Analytical columnar store'], ['Object Storage', '/s3', 'Object storage'], ['Memory', '/cloud/memory']];

export default function Base() {
  return (
    <main className="kn bs" style={{ '--ac': '#ff9500' }}>
      <KeynoteStage
        look="side"
        kick="Hanzo Base · App backend"
        title={['An app backend', 'in one file']}
        lede="Open source (MIT). Runs as one binary — self-host or deploy managed on Hanzo Cloud."
        acts={[['Try Hanzo', '/login'], ['Read the docs', DOCS], ['View on GitHub', GH]]}
        from={1.15}
      >
        <Admin />
      </KeynoteStage>

      <OneFile />
      <Declare />
      <Caps />
      <Run />

      <KeynoteClose
        name="Base"
        tag="Embedded data backend with IAM-native auth"
        lead="hanzoai/base"
        license="MIT"
        repo={['hanzoai/base', GH]}
        stars="4 stars"
        self={DOCS}
        api="/v1/base"
        prompt="Read https://hanzo.ai/skill.md and use Hanzo Base in my project. Start with: hanzo base bases list"
      >
        <div className="bs-rel">
          <p className="kn-kick">Related capabilities</p>
          <ul>{REL.map(([t, to, d]) => <li key={t}><A to={to}><b>{t}</b>{d && <span>{d}</span>}</A></li>)}</ul>
        </div>
      </KeynoteClose>
    </main>
  );
}
