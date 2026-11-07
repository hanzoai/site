'use client';
/* Authz.
   V2: 8/10 First screen tightened so the true/false answer is above the fold (phones get a compact answer line); the statement gets a drawn token → question → true line; spec figures count up with hairlines drawing; related rows point the console; phone rules become a snap swipe rail; request marks name themselves on hover.
   Persona: a developer adding authorization to a service (Hanzo's own words: "a library, not a service").
   Goal: understand the one rule in one look, then read the docs or take the library.
   CTA: "Read the docs" → https://docs.hanzo.ai/docs/projects/hanzoai/authz (solid, data-cta authz.hero, data-thumb);
        "View on GitHub" → https://github.com/hanzoai/authz (link, authz.hero-2); "Deploy to Cloud" →
        https://platform.hanzo.ai/deploy (solid in the close, authz.close); "Self-host" → the docs (link, authz.close-self).
   Metric: api_key_created (developers).
   Signature: the check, answered live. A relationship graph of callers and locations (acme, acme/prod, acme/prod/web,
   the app or site under that): a request arrives and the path from the caller through its grant down the tree fills
   in ink hop by hop, then the answer cuts in, true or false, with the step that decided it. It runs by itself (pause
   beside the asks); pick any caller and any location and it asks again.
   Supporting: the Stage hero (the graph settles as you scroll), six pinned rules that fade one into the next, and the
   closing dark room that opens out to full width.
   Beyond: "Delegate it yourself": choose where your grant sits and where you write the agent's, and see whether it can
   be delegated, with Hanzo's own sentence on why. Built only from the path rule on this page.
   Every word and link is Hanzo's; the demo's labels (caller, location, can, grant, target) are UI. */
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { motion, useInView, useReducedMotion } from 'motion/react';
import { Count } from '../../ui';
import { useLive, useSteps } from './Frame';
import KeynoteStage, { useStagePause } from '../../v2/KeynoteStage';
import KeynoteChapters from '../../v2/KeynoteChapters';
import KeynoteSpec, { Fig } from '../../v2/KeynoteSpec';
import KeynoteClose from '../../v2/KeynoteClose';
import KeynoteLines from '../../v2/KeynoteLines';
import { A } from '../../kit';
import ExampleConsole from './ExampleConsole';
import './Authz.css';

const DOCS = 'https://docs.hanzo.ai/docs/projects/hanzoai/authz';
const GH = 'https://github.com/hanzoai/authz';
const MOVE = [0.4, 0, 0.2, 1];

/* Hanzo's example path, one level per row: each location prefixes the ones under it */
const LOC = ['acme', 'acme/prod', 'acme/prod/web', 'the app or site under that'];
/* callers, and the location their grant sits at */
const WHO = [['org-wide member', 0], ['workspace member', 1], ['agent, delegated', 2], ['invite-only project', 3]];
/* the requests that arrive by themselves: [caller, target] */
const SCRIPT = [[1, 2], [1, 0], [0, 3], [2, 1], [3, 3], [2, 2]];
const EVERY = 4600; // ms per request; the CSS fill in the request bar runs the same time
const HOP = 0.4;
const covers = (g, t) => t >= g;

/* where each node sits inside the graph, from layout (offsets ignore the Stage's scale) */
function useGeo(box) {
  const [geo, setGeo] = useState(null);
  useLayoutEffect(() => {
    const el = box.current;
    if (!el) return;
    const pos = (n) => { let x = 0, y = 0, e = n; while (e && e !== el) { x += e.offsetLeft; y += e.offsetTop; e = e.offsetParent; } return { x, y, w: n.offsetWidth, h: n.offsetHeight }; };
    const read = () => setGeo({ W: el.offsetWidth, H: el.offsetHeight, who: [...el.querySelectorAll('[data-who]')].map(pos), loc: [...el.querySelectorAll('[data-loc]')].map(pos) });
    read();
    const ro = new ResizeObserver(read);
    ro.observe(el);
    document.fonts?.ready.then(read);
    return () => ro.disconnect();
  }, [box]);
  return geo;
}
const whoPath = (G, i, g) => {
  const a = G.who[i], b = G.loc[g];
  if (!a || !b) return '';
  const ax = a.x + a.w, ay = a.y + a.h / 2, bx = b.x, by = b.y + b.h / 2, dx = (bx - ax) / 2;
  return `M${ax} ${ay} C${ax + dx} ${ay} ${bx - dx} ${by} ${bx} ${by}`;
};
const treePath = (G, i, j) => {
  const a = G.loc[i], b = G.loc[j];
  if (!a || !b) return '';
  const x = a.x + Math.max(8, Math.min(24, b.x - a.x - 14));
  return `M${x} ${a.y + a.h} V${b.y + b.h / 2 - 10} Q${x} ${b.y + b.h / 2} ${x + 10} ${b.y + b.h / 2} H${b.x}`;
};

const STEPS = ['verifies the JWT that IAM signed', 'does a grant this caller holds cover this path', 'does its role admit this verb'];

/* The hero object and the signature: the check, asked of a graph. */
function Check() {
  const [ref, live, calm] = useLive(0.3);
  const paused = useStagePause();
  const [mine, setMine] = useState(null);
  const [step] = useSteps(SCRIPT.length, EVERY, live && !mine && !paused);
  const [w, t] = mine || SCRIPT[step];
  const g = WHO[w][1];
  const ok = covers(g, t);
  const walk = ok ? t - g : 0;
  const key = w + '-' + t;
  const box = useRef(null);
  const G = useGeo(box);
  const d = (i) => (calm ? 0 : i * HOP);
  const land = d(3 + walk);
  const lit = (i) => ok && i >= g && i <= t;
  const pick = (nw, nt) => setMine([nw, nt]);
  /* hovering a request mark names it in the bar (pointer only; the bar's own label returns on leave) */
  const [peek, setPeek] = useState(null);
  return (
    <div className="kn-obj az-obj" ref={ref}>
      <div className={'az-bar' + (mine ? ' held' : '')}>
        <i /><i /><i />
        <span className={'az-bar-t' + (peek !== null ? ' peek' : '')}>
          <span className="az-bar-n">hanzoai/authz</span>
          <span className="az-bar-p" aria-hidden="true">{peek !== null ? WHO[SCRIPT[peek][0]][0] + ' → ' + LOC[SCRIPT[peek][1]] : ''}</span>
        </span>
        <div className="az-reqs" role="group" aria-label="Requests" onPointerLeave={() => setPeek(null)}>
          {SCRIPT.map(([a, b], i) => {
            const on = mine ? mine[0] === a && mine[1] === b : step === i;
            return <button key={i} type="button" aria-pressed={on} aria-label={WHO[a][0] + ', ' + LOC[b]} onPointerEnter={(e) => e.pointerType === 'mouse' && setPeek(i)} onClick={() => pick(a, b)}><i /></button>;
          })}
          {mine && <button type="button" className="az-resume" onClick={() => setMine(null)}>Replay</button>}
        </div>
        <code className="az-bar-c"><b aria-hidden="true">$</b>hanzo authz check</code>
      </div>
      <div className="az-graph" ref={box}>
        {/* phones: the answer and its question in one line, on the first screen (the full panel stays below) */}
        <p className="az-mini" aria-hidden="true">
          <span className={'az-mini-a ' + (ok ? 'ok' : 'no')}><span key={'m' + key} className="az-a-t" style={{ animationDelay: land + 's' }}>{ok ? 'true' : 'false'}</span></span>
          <span className="az-mini-q"><b>{WHO[w][0]}</b><span>{LOC[t]}</span></span>
        </p>
        {G && (
          <svg className="az-edges" width={G.W} height={G.H} aria-hidden="true">
            {WHO.map(([, gi], i) => <path key={'b' + i} className="az-e who" d={whoPath(G, i, gi)} />)}
            {LOC.slice(1).map((_, i) => <path key={'s' + i} className="az-e" d={treePath(G, i, i + 1)} />)}
            <motion.path key={'w' + key} className="az-e lit who" d={whoPath(G, w, g)} initial={{ pathLength: calm ? 1 : 0 }} animate={{ pathLength: 1 }} transition={{ duration: HOP, ease: MOVE, delay: d(1) }} />
            {ok && Array.from({ length: walk }).map((_, j) => (
              <motion.path key={key + '-' + j} className="az-e lit" d={treePath(G, g + j, g + j + 1)} initial={{ pathLength: calm ? 1 : 0 }} animate={{ pathLength: 1 }} transition={{ duration: HOP, ease: MOVE, delay: d(2 + j) }} />
            ))}
            {!ok && Array.from({ length: g - t }).map((_, j) => (
              <path key={key + '-m' + j} className="az-e miss" d={treePath(G, t + j, t + j + 1)} style={{ animationDelay: d(2) + 's' }} />
            ))}
          </svg>
        )}

        <div className="az-col az-who" role="radiogroup" aria-label="Caller">
          <p className="az-k">caller</p>
          {WHO.map(([n], i) => (
            <button key={n} type="button" role="radio" aria-checked={w === i} data-who="" className={'az-who-b' + (w === i ? ' on' : '')} onClick={() => pick(i, t)}>
              <i aria-hidden="true" />{n}
            </button>
          ))}
        </div>

        <div className="az-col az-tree" role="radiogroup" aria-label="Location to check">
          <p className="az-k">location</p>
          {LOC.map((l, i) => (
            <button
              key={l} type="button" role="radio" aria-checked={t === i} data-loc=""
              className={'az-loc' + (lit(i) ? ' lit' : '') + (i === g ? ' grant' : '') + (i === t ? ' target' : '') + (i === t && !ok ? ' no' : '') + (i === LOC.length - 1 ? ' prose' : '')}
              style={{ '--lv': i, transitionDelay: lit(i) ? d(2 + (i - g)) + 's' : '0s' }}
              onClick={() => pick(w, i)}
            >
              <span className="az-loc-n">{l}</span>
              <span className="az-tags" aria-hidden="true">
                {i === g && <em key={'g' + key} className="az-tag g">grant</em>}
                {i === t && <em key={'t' + key} className="az-tag t">target</em>}
              </span>
            </button>
          ))}
        </div>

        <div className="az-col az-dec" aria-live="polite">
          <p className="az-k">can</p>
          <p className="az-q"><b>{WHO[w][0]}</b><span>{LOC[t]}</span></p>
          <p className={'az-a ' + (ok ? 'ok' : 'no')}>
            <span key={'a' + key} className="az-a-t" style={{ animationDelay: land + 's' }}>{ok ? 'true' : 'false'}</span>
          </p>
          <ol className="az-steps">
            {STEPS.map((s, i) => {
              const st = i === 0 ? 'ok' : i === 1 ? (ok ? 'ok' : 'no') : ok ? 'ok' : 'skip';
              return (
                <li key={s + key} className={'az-st ' + st} style={{ animationDelay: (i === 0 ? d(0.6) : land) + 's' }}>
                  <i aria-hidden="true" />{s}
                </li>
              );
            })}
          </ol>
          <p className="az-why" key={'y' + key} style={{ animationDelay: land + 's' }}>{LOC[g]} {ok ? 'prefixes' : 'does not prefix'} {LOC[t]}</p>
        </div>
      </div>
    </div>
  );
}

/* The statement's object: a token in, one question, the answer out, drawn once as it is seen (about 1.4 s): the
   token, a hairline, the question, a hairline, then true cuts in. Reduced motion: drawn. */
function SayLine() {
  const ref = useRef(null);
  const seen = useInView(ref, { once: true, amount: 0.6 });
  const calm = useReducedMotion();
  return (
    <div className="az-line" ref={ref} data-go={seen || calm ? '' : undefined} aria-hidden="true">
      <div className="az-line-n tok">
        <span className="az-line-k">JWT</span>
        <span className="az-jwt"><i /><i /><i /></span>
      </div>
      <span className="az-line-l" style={{ '--d': '.2s' }}><i /></span>
      <div className="az-line-n q">
        <span className="az-line-k">one question</span>
        <span className="az-line-t">{STEPS[1]}</span>
        <span className="az-line-t">{STEPS[2]}</span>
      </div>
      <span className="az-line-l" style={{ '--d': '.75s' }}><i /></span>
      <div className="az-line-n a">
        <span className="az-line-k">can</span>
        <span className="az-line-w"><span className="az-a-t">true</span></span>
      </div>
    </div>
  );
}

/* which of n steps a chapter is on: from the scroll through it on desktop (p); on phones it steps once through by
   itself while seen (a step a second, so it ends at rest well inside 5 s) */
function useStepOf(p, n, on) {
  const [k, setK] = useState(0);
  const calm = useReducedMotion();
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

const RULES = [
  ['Where a thing is, and who may touch it', "A location is a path — acme, acme/prod, acme/prod/web, and the app or site under that. Access is a grant at a prefix of one. Keeping them apart is the whole design: containment names a resource, it does not hand every ancestor's members the child."],
  ['Nothing on the decision path does I/O', 'No store, no config, no init, no network call. Authz is a leaf package a service imports, so the check is a function call and a request that reaches your handler has already been decided.'],
  ['One rule covers every arrangement', 'Can is true when some grant the caller holds prefixes the target and its role admits the verb. An org-wide member holds a grant at the org; a workspace member holds one a level down; an invite-only project is a grant with no ancestor above it. There is no second mechanism.'],
  ['Delegation is a narrower grant', 'Handing an agent or a short-lived credential part of your authority means writing a grant deeper in the path than your own, with an expiry if you want one. Nothing can be delegated that the delegator does not already hold.'],
  ['The decision travels, the grant set stays', 'The edge resolves the requested scope once and writes the resolved path and role into the token, so the token stays the same size no matter how many grants a person has, and no service behind the edge asks IAM anything.'],
  ['Only what IAM signs', "Verification accepts the algorithms IAM's signer actually produces — RSA, EC, and ML-DSA-65 for a post-quantum certificate. HMAC and alg none are rejected. Key material is an argument, so the leaf never fetches a JWKS and a caller that supplies no keys verifies nothing."],
];

/* 01: the locations, and a grant at a prefix of one covering everything under it */
function WhereScene({ p, on }) {
  const k = useStepOf(p, 2, on);
  return (
    <div className="kn-obj az-sc az-where" style={{ '--k': k }}>
      <div className="az-where-l">
        <p className="az-sc-k">location</p>
        <div className="az-where-list">
          <ul>{LOC.map((l, i) => <li key={l} className={(i >= k ? 'in' : '') + (i === LOC.length - 1 ? ' prose' : '')} style={{ '--lv': i }}>{l}</li>)}</ul>
          <span className="az-bracket" aria-hidden="true" />
        </div>
      </div>
      <div className="az-where-r">
        <p className="az-sc-k">grant</p>
        <b>at {LOC[k]}</b>
      </div>
    </div>
  );
}

/* 02: request, a function call, your handler; nothing else on the path */
function LeafScene() {
  return (
    <div className="kn-obj az-sc az-leaf">
      <div className="az-flow">
        <span className="az-fl">request</span>
        <span className="az-fl-l" aria-hidden="true"><i /></span>
        <span className="az-fl fn"><b>authz</b><em>a function call</em></span>
        <span className="az-fl-l" aria-hidden="true"><i /></span>
        <span className="az-fl">your handler</span>
      </div>
      <ul className="az-noio">{['store', 'config', 'init', 'network call'].map((x, i) => <li key={x} style={{ '--i': i }}><span>{x}</span></li>)}</ul>
      <p className="az-sc-k">a leaf package a service imports</p>
    </div>
  );
}

/* 03: three arrangements, one rule: where the grant sits on the path */
const ARR = [['org-wide member', 0], ['workspace member', 1], ['invite-only project', 3]];
const SEG = ['acme', 'prod', 'web', 'app or site'];
function RuleScene({ p, on }) {
  const k = useStepOf(p, 3, on);
  return (
    <div className="kn-obj az-sc az-rule">
      {ARR.map(([n, g], i) => (
        <div key={n} className={'az-ar' + (k === i ? ' on' : '')}>
          <p className="az-ar-n">{n}</p>
          <p className="az-ar-p">{SEG.map((s, j) => <i key={s} className={j >= g ? 'in' : ''}>{j === g && <b aria-hidden="true" />}{s}</i>)}</p>
        </div>
      ))}
      <p className="az-sc-k">no second mechanism</p>
    </div>
  );
}

/* 04: a narrower grant inside your own, each with an expiry that runs down once */
function DelegateScene() {
  return (
    <div className="kn-obj az-sc az-del">
      <div className="az-del-o">
        <p className="az-del-h"><b>your grant</b><span>acme/prod</span></p>
        <div className="az-del-in">
          <div className="az-del-i">
            <p className="az-del-h"><b>agent</b><span>acme/prod/web</span></p>
            <p className="az-exp"><svg viewBox="0 0 36 36" aria-hidden="true"><circle cx="18" cy="18" r="15" /><circle className="run" cx="18" cy="18" r="15" pathLength="100" /></svg>expiry</p>
          </div>
          <div className="az-del-i b">
            <p className="az-del-h"><b>short-lived credential</b><span>the app or site under that</span></p>
            <p className="az-exp"><svg viewBox="0 0 36 36" aria-hidden="true"><circle cx="18" cy="18" r="15" /><circle className="run" cx="18" cy="18" r="15" pathLength="100" /></svg>expiry</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* 05: more grants, the same token */
function TokenScene({ p, on }) {
  const k = useStepOf(p, LOC.length, on);
  return (
    <div className="kn-obj az-sc az-tok">
      <div className="az-tok-g">
        <p className="az-sc-k">grants</p>
        <ul>{LOC.map((l, i) => <li key={l} className={i <= k ? 'on' : ''}>{l}</li>)}</ul>
      </div>
      <div className="az-tok-e" aria-hidden="true"><span>edge</span></div>
      <div className="az-tok-t">
        <p className="az-sc-k">token</p>
        <div className="az-jwt" aria-hidden="true"><i /><i /><i /></div>
        <dl>
          <div><dt>path</dt><dd>{LOC[Math.min(k, 2)]}</dd></div>
          <div><dt>role</dt><dd><i aria-hidden="true" /></dd></div>
        </dl>
      </div>
    </div>
  );
}

/* 06: what IAM's signer produces is accepted; the rest is not */
const ALG = [['RSA', 1], ['EC', 1], ['ML-DSA-65', 1, 'post-quantum'], ['HMAC', 0], ['alg none', 0]];
function SignScene({ p, on }) {
  const k = useStepOf(p, ALG.length, on);
  return (
    <div className="kn-obj az-sc az-sign">
      <ul>
        {ALG.map(([a, ok, n], i) => (
          <li key={a} className={(ok ? 'ok' : 'no') + (i === k ? ' on' : '')}>
            <b>{a}</b>{n && <em>{n}</em>}<span>{ok ? 'accepted' : 'rejected'}</span>
          </li>
        ))}
      </ul>
      <p className="az-jwks"><s>JWKS</s><span>key material is an argument</span></p>
    </div>
  );
}

const SCENES = [WhereScene, LeafScene, RuleScene, DelegateScene, TokenScene, SignScene];

/* Beyond: write a delegation yourself. Allowed when the agent's grant sits at or under yours. */
function Pick({ label, at, set, id }) {
  const calm = useReducedMotion();
  return (
    <div className="az-pk" role="radiogroup" aria-label={label}>
      <p className="az-pk-k">{label}</p>
      <div className="az-pk-row">
        {LOC.map((l, i) => (
          <button key={l} type="button" role="radio" aria-checked={at === i} onClick={() => set(i)}>
            {at === i && <motion.span layoutId={'az-pk-' + id} className="az-pk-bg" transition={calm ? { duration: 0 } : { duration: 0.3, ease: MOVE }} />}
            <span>{l}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function Delegate() {
  const [mine, setMine] = useState(1);
  const [give, setGive] = useState(2);
  const [exp, setExp] = useState(true);
  const ok = covers(mine, give);
  return (
    <section className="kn-sec az-dg">
      <div className="kn-wrap kn-grid az-dg-g">
        <div className="az-dg-l">
          <div className="az-dg-h">
            <KeynoteLines className="kn-headline" lines={['Delegate it', 'yourself']} />
            <p className="kn-kick">Delegation is a narrower grant</p>
          </div>
          <Pick label="your grant" at={mine} set={setMine} id="m" />
          <Pick label="the agent's grant" at={give} set={setGive} id="g" />
          <button type="button" role="switch" aria-checked={exp} className="az-dg-x" onClick={() => setExp(!exp)}>
            <span className="az-sw" aria-hidden="true"><i /></span>with an expiry
          </button>
        </div>
        <div className={'az-dg-out ' + (ok ? 'ok' : 'no')} aria-live="polite">
          <div className="az-dg-path" aria-hidden="true">
            {SEG.map((s, j) => (
              <div key={s} className="az-dg-seg">
                <span>{s}</span>
                <i className={j >= mine ? 'm' : ''} />
                <i className={j >= give ? 'g' : ''} />
              </div>
            ))}
          </div>
          <div className="az-dg-legend" aria-hidden="true"><span className="m">your grant</span><span className="g">agent</span></div>
          <p className="az-dg-a"><span key={ok ? 'y' : 'n'} className="az-a-t">{ok ? 'true' : 'false'}</span></p>
          <p className="az-dg-w"><code>grant at {LOC[give]}</code>{ok && exp && <em>expiry</em>}</p>
          <p className="az-dg-say">{ok ? (exp ? 'Delegation is a narrower grant, with an expiry if you want one.' : 'Delegation is a narrower grant.') : 'Nothing can be delegated that the delegator does not already hold.'}</p>
        </div>
      </div>
    </section>
  );
}

const SIDE = [['Authz', '/authz'], ['IAM', '/iam'], ['KMS', '/kms'], ['Secrets', '/cloud/secrets'], ['Audit', '/cloud/audit'], ['Zero Trust', '/cloud/zero-trust']];
const REL = [['Authz docs →', DOCS], ['IAM', '/iam', 'OIDC identity & orgs'], ['KMS', '/kms', 'Managed keys'], ['Secrets', '/cloud/secrets', 'Store once, sync everywhere']];

function Family() {
  return (
    <section className="kn-sec az-fam">
      <div className="kn-wrap kn-grid az-fam-g">
        <div className="az-fam-l">
          <KeynoteLines className="kn-headline" lines="Related capabilities" />
          <ul className="az-rel">
            {REL.map(([t, to, d]) => (
              <li key={t}>
                <A to={to} className="az-rel-a">
                  <b>{t}</b>{d && <span>{d}</span>}
                  {!t.endsWith('→') && <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                </A>
              </li>
            ))}
          </ul>
        </div>
        <div className="az-fam-r">
          <ExampleConsole name="Authz" api="/v1/authz" side={SIDE} />
          <p className="az-note">Example project. Every name in it is one you would give your own.</p>
        </div>
      </div>
    </section>
  );
}

export default function Authz() {
  return (
    <main className="kn az">
      <KeynoteStage
        kick="hanzoai/authz"
        title={['Hanzo Authz']}
        lede="Fine-grained authorization"
        acts={[['Read the docs', DOCS], ['View on GitHub', GH]]}
        meta={<span>Apache-2.0 · a library, not a service</span>}
        cta="authz.hero"
        from={1.05}
      >
        <Check />
      </KeynoteStage>

      <KeynoteChapters
        className="az-ch"
        side="right"
        swap="fade"
        count
        head={
          <div className="kn-grid az-say">
            <KeynoteLines className="kn-headline az-say-h" lines="Hanzo Authz reads a token and answers whether the caller may do the thing." />
            <p className="kn-body az-say-p">It verifies the JWT that IAM signed, then asks one question: does a grant this caller holds cover this path, and does its role admit this verb. It is a library, not a service — no store, no configuration, no network call on any path — so every Hanzo service asks that question the same way and gets the same answer.</p>
            <SayLine />
          </div>
        }
        items={RULES.map(([t, d]) => ({ title: t, body: <p>{d}</p> }))}
        visual={(i, on, p) => { const S = SCENES[i]; return <S on={on} p={p} />; }}
      />

      <Delegate />

      <KeynoteSpec
        className="az-spec"
        kick="Hanzo Authz"
        title="Tech specs"
        rows={[
          ['The question', <><Fig n={<Count to={1} duration={0.9} />} u="rule" /><p>Does a grant this caller holds cover this path, and does its role admit this verb.</p></>],
          ['On the path', <p>No store, no config, no init, no network call. A leaf package a service imports; the check is a function call.</p>],
          ['Delegation', <p>A grant deeper in the path than your own, with an expiry if you want one.</p>],
          ['Token', <p>The resolved path and role, the same size no matter how many grants a person has.</p>],
          ['Verification', <><Fig n={<Count to={3} duration={1.2} />} u="RSA, EC, ML-DSA-65" /><p>HMAC and alg none are rejected. Key material is an argument.</p></>],
          ['License', <p><b>Apache-2.0</b></p>],
        ]}
      />

      <Family />

      <KeynoteClose
        name="Authz"
        tag="Fine-grained authorization"
        lead="hanzoai/authz"
        repo={['hanzoai/authz', GH]}
        stars="4 stars"
        self={DOCS}
        api="/v1/authz"
        cta="authz.close"
        prompt="Read https://hanzo.ai/skill.md and use Hanzo Authz in my project. Start with: hanzo authz check"
      />
    </main>
  );
}
