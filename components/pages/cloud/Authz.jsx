'use client';
/* Authz.
   V2: 8/10 Signature is now the map's `spotlight`: the six rules sit in a dark room right under the hero and a light (cursor, tap or focus) reveals each rule's text and decision; the pinned chapter stage is gone; order hero → spotlight → spec → delegate → related → close.
   Persona: a developer adding authorization to a service (Hanzo's own words: "a library, not a service").
   Goal: understand the one rule in one look, then read the docs or take the library.
   CTA: "Read the docs" → https://docs.hanzo.ai/docs/projects/hanzoai/authz (solid, data-cta authz.hero, data-thumb);
        "View on GitHub" → https://github.com/hanzoai/authz (link, authz.hero-2); "Deploy to Cloud" →
        https://platform.hanzo.ai/deploy (solid in the close, authz.close); "Self-host" → the docs (link, authz.close-self).
   Metric: api_key_created (developers).
   Signature: `spotlight` (docs/MOTION-MAP.md). The second screen is a dark room holding Hanzo's statement and the six
   rules; in the dark only each rule's number and title show. A light follows the cursor (touch: tap to place it;
   keyboard: focus a rule), and the rule under it shows whole: its text and its decision as chips (the path, the
   verdict, the accepted and rejected algorithms). Unattended it walks the rules once (phones: it rests on the rule
   nearest mid-screen). Built in ./authz/Spotlight.jsx.
   Entrances (MOTION-MAP rule 7, in order; ./authz/Entrances.jsx): curtain-rise → the spotlight room; vertical-ticker →
   tech specs; slot-roll → delegate it yourself; inertia-drag → related + console (thrown in, can be thrown again by
   its grip); spiral-in → the close. The hero arrives by the kit's own first-paint cut-in.
   Supporting: the hero check, answered live (a request lights the path from caller through grant down the tree, then
   true or false), the spec's count-ups, the delegation picker's glide, and the closing dark room.
   Beyond: "Delegate it yourself": choose where your grant sits and where you write the agent's, and see whether it can
   be delegated, with Hanzo's own sentence on why. Built only from the path rule on this page.
   Every word and link is Hanzo's; the demo's labels (caller, location, can, grant, target) are UI. */
import { useLayoutEffect, useRef, useState } from 'react';
import { motion, useDragControls, useReducedMotion } from 'motion/react';
import { Count } from '../../ui';
import { useLive, useSteps } from './Frame';
import KeynoteStage, { useStagePause } from '../../v2/KeynoteStage';
import KeynoteSpec, { Fig } from '../../v2/KeynoteSpec';
import KeynoteClose from '../../v2/KeynoteClose';
import { A } from '../../kit';
import ExampleConsole from './ExampleConsole';
import Spotlight from './authz/Spotlight';
import Enter from './authz/Entrances';
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

const RULES = [
  ['Where a thing is, and who may touch it', "A location is a path — acme, acme/prod, acme/prod/web, and the app or site under that. Access is a grant at a prefix of one. Keeping them apart is the whole design: containment names a resource, it does not hand every ancestor's members the child."],
  ['Nothing on the decision path does I/O', 'No store, no config, no init, no network call. Authz is a leaf package a service imports, so the check is a function call and a request that reaches your handler has already been decided.'],
  ['One rule covers every arrangement', 'Can is true when some grant the caller holds prefixes the target and its role admits the verb. An org-wide member holds a grant at the org; a workspace member holds one a level down; an invite-only project is a grant with no ancestor above it. There is no second mechanism.'],
  ['Delegation is a narrower grant', 'Handing an agent or a short-lived credential part of your authority means writing a grant deeper in the path than your own, with an expiry if you want one. Nothing can be delegated that the delegator does not already hold.'],
  ['The decision travels, the grant set stays', 'The edge resolves the requested scope once and writes the resolved path and role into the token, so the token stays the same size no matter how many grants a person has, and no service behind the edge asks IAM anything.'],
  ['Only what IAM signs', "Verification accepts the algorithms IAM's signer actually produces — RSA, EC, and ML-DSA-65 for a post-quantum certificate. HMAC and alg none are rejected. Key material is an argument, so the leaf never fetches a JWKS and a caller that supplies no keys verifies nothing."],
];

/* what the light shows under each rule: its decision, as chips (UI built from the rule's own words) */
const DEC = [
  [['acme/prod', 'g'], ['→', 'arrow'], ['acme/prod/web'], ['true', 'a']],
  [['request'], ['→', 'arrow'], ['authz', 'a'], ['→', 'arrow'], ['your handler']],
  [['org-wide member'], ['workspace member'], ['invite-only project'], ['no second mechanism', 'a']],
  [['acme/prod', 'g'], ['→', 'arrow'], ['acme/prod/web'], ['expiry', 'a']],
  [['grants'], ['→', 'arrow'], ['edge'], ['→', 'arrow'], ['token', 'a']],
  [['RSA', 'a'], ['EC', 'a'], ['ML-DSA-65', 'a'], ['HMAC', 'x'], ['alg none', 'x']],
];
const SEG = ['acme', 'prod', 'web', 'app or site'];

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
    <Enter as="section" kind="slot" className="kn-sec az-dg">
      <div className="kn-wrap kn-grid az-dg-g">
        <div className="az-dg-l">
          <div className="az-dg-h">
            <h2 className="kn-headline az-dg-t"><span className="az-roll">Delegate it</span> <span className="az-roll">yourself</span></h2>
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
    </Enter>
  );
}

const SIDE = [['Authz', '/authz'], ['IAM', '/iam'], ['KMS', '/kms'], ['Secrets', '/cloud/secrets'], ['Audit', '/cloud/audit'], ['Zero Trust', '/cloud/zero-trust']];
const REL = [['Authz docs →', DOCS], ['IAM', '/iam', 'OIDC identity & orgs'], ['KMS', '/kms', 'Managed keys'], ['Secrets', '/cloud/secrets', 'Store once, sync everywhere']];

function Family() {
  const grab = useDragControls();
  const calm = useReducedMotion();
  return (
    <Enter as="section" kind="throw" className="kn-sec az-fam">
      <div className="kn-wrap kn-grid az-fam-g">
        <div className="az-fam-l">
          <h2 className="kn-headline">Related capabilities</h2>
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
          {/* thrown in on arrival; grab its bar to throw it again: it slides with inertia and settles back */}
          <div className="az-throw">
            <motion.div className="az-drag" drag={!calm} dragControls={grab} dragListener={false} dragSnapToOrigin dragElastic={0.5} dragTransition={{ power: 0.25, timeConstant: 220 }}>
              <span className="az-grip" aria-hidden="true" onPointerDown={(e) => grab.start(e)}><i /></span>
              <ExampleConsole name="Authz" api="/v1/authz" side={SIDE} />
            </motion.div>
          </div>
          <p className="az-note">Example project. Every name in it is one you would give your own.</p>
        </div>
      </div>
    </Enter>
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

      {/* the signature: the statement and the six rules in a dark room, read by a light */}
      <Enter as="section" kind="curtain" className="az-room" data-room="dark" amount={0.15}>
        <div className="kn-wrap">
          <Spotlight rules={RULES} decisions={DEC}>
            <div className="kn-grid az-say">
              <h2 className="kn-headline az-say-h">Hanzo Authz reads a token and answers whether the caller may do the thing.</h2>
              <p className="kn-body az-say-p">It verifies the JWT that IAM signed, then asks one question: does a grant this caller holds cover this path, and does its role admit this verb. It is a library, not a service — no store, no configuration, no network call on any path — so every Hanzo service asks that question the same way and gets the same answer.</p>
            </div>
          </Spotlight>
        </div>
      </Enter>

      <Enter kind="ticker">
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
      </Enter>

      <Delegate />

      <Family />

      <Enter kind="spiral" amount={0.1}>
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
      </Enter>
    </main>
  );
}
