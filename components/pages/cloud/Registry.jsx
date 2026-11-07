'use client';
/* Registry, v2 launch page (Cloud 3).
   V2: 8/10 one outlined window where a docker push asks IAM first, runs once (~9 s) and rests on the signed image with a
   blinking prompt and Replay; the dark room follows the hero straight off its last words (the secret); then a short
   pin (about 3 screens) whose object is the image itself, a big inked stack of layers each fact visibly acts on and
   labels (a password struck off as the token seats, the org inks the top, signature and attestation dock, a layer
   slides out as storage shrinks, people fold into one directory), one caption under it, no lists; every control answers.
   Signature: a push that asks IAM first. docker push meets a 401 that names Hanzo IAM, a short-lived token travels from
   IAM to the client, the registry checks its signature, the layers go up, and the image lands in the org's repository
   with its cosign signature beside it as an ordinary artifact.
   Beyond: the secret swap. In the dark room, one press deletes the dockerconfigjson secret and wipes in what IAM gives
   instead, row by row (where the credential lives, adding a teammate, someone leaving), in Hanzo's own phrases.
   Persona: Developer. Goal: read the source, then push a first image with an IAM token.
   CTA: "View Source" → https://github.com/hanzoai (data-cta registry.hero, registry.close; the site's sticky ask bar
   carries the same words from data-thumb). Metric: api_key_created.
   Motion: idle = the push (once), the resting caret, the stack's slow float, the building console; pointer = hovering
   (or tapping, on a phone) a step of the push shows that moment, the magnetic ask; state = the secret switch, its rows
   and the struck heading, pause and replay; arrival = the cut-in title, the timed wipe into the dark room; scroll = the
   Stage settle and the pinned layer stack (where the intro's token runs out on its own).
   Every word and link is Hanzo's; repository and people names are examples. */
import { useEffect, useState } from 'react';
import { Paste, Code, useLive } from './Frame';
import SettleStage from '../../v2/SettleStage';
import PinnedChapters from '../../v2/PinnedChapters';
import ClipWipe from '../../v2/ClipWipe';
import LaunchClose, { Arr } from '../../v2/LaunchClose';
import LineMask from '../../v2/LineMask';
import LaunchConsole from '../../v2/LaunchConsole';
import LivePause, { usePause } from '../../v2/LivePause';
import RelatedCards from '../../v2/RelatedCards';
import { A } from '../../kit';
import './Registry.css';

const GH = 'https://github.com/hanzoai';

/* ---------- the hero object: the push ---------- */
const LAYERS = [0.82, 0.55, 0.34, 0.12];
const LOG = [
  ['$ docker push oci.hanzo.ai/acme/api:v1.2.3', ''],
  ['401 · token from Hanzo IAM', 'warn'],
  ['token minted by your IAM login', 'ok'],
  ['signature checked against its certificate', 'ok'],
];
const WAIT = [800, 1000, 1300, 900, 2000, 900, 2600];

function Push() {
  const [ref, live, calm] = useLive(0.3);
  const [paused, pause] = usePause();
  const [t, setT] = useState(0); // 0 push, 1 401, 2 token, 3 signature checked, 4 layers, 5 pushed, 6 signed
  const [hov, setHov] = useState(null); // a step under a fine pointer (or a tap on a phone) shows that moment
  useEffect(() => { if (calm) setT(6); }, [calm]);
  // the push runs once (about 9 s), then rests on the signed image; Replay runs it again
  useEffect(() => {
    if (calm || !live || paused || hov !== null || t >= 6) return;
    const id = setTimeout(() => setT((v) => v + 1), WAIT[t]);
    return () => clearTimeout(id);
  }, [t, live, calm, paused, hov]);
  const s = hov ?? t;
  const peek = (i) => ({
    'data-step': i,
    onPointerEnter: (e) => e.pointerType === 'mouse' && setHov(i),
    onClick: () => setHov((h) => (h === i ? null : i)),
  });
  const st = (i) => (s >= i ? ' in' : '') + (s === i ? ' now' : '');
  const done = t >= 6 && !calm;
  return (
    <div className={'rg-push' + (done ? ' done' : '')} ref={ref} data-t={s} onPointerLeave={(e) => e.pointerType === 'mouse' && setHov(null)}>
      {done
        ? <button type="button" className="lx-pause rg-pause rg-replay" aria-label="Replay" onClick={() => { setHov(null); setT(0); }}>
            <svg viewBox="0 0 16 16" width="15" height="15" aria-hidden="true"><path d="M3.2 8a4.8 4.8 0 1 0 1.5-3.5M3 2.5v3h3" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
        : <LivePause paused={paused} onToggle={pause} className="rg-pause" />}
      <div className="rg-term" aria-hidden="true">
        <div className="rg-term-bar"><i /><i /><i /><span>terminal</span></div>
        <div className="rg-term-body">
          {LOG.map(([l, k], i) => <p key={l} className={k + st(i)} {...peek(i)}>{l}</p>)}
          <div className={'rg-layers' + st(4)} {...peek(4)}>
            {LAYERS.map((w, i) => (
              <div key={i} className="rg-layer"><span>layer {i + 1}</span><i><b style={{ transitionDuration: (0.9 + w) + 's', transitionDelay: s >= 4 && hov === null ? i * 0.18 + 's' : '0s' }} /></i></div>
            ))}
          </div>
          <p className={'rg-caret' + (s >= 6 ? ' in' : '')}>$ <i /></p>
        </div>
        <div className="rg-iamchip"><span className="rg-iam-k">Hanzo IAM</span><b className="rg-token">token</b></div>
      </div>
      <div className="rg-repo">
        <div className="rg-repo-bar"><span>Container Registry</span></div>
        <div className="rg-repo-in" aria-hidden="true">
          <p className="rg-repo-k">oci.hanzo.ai</p>
          <p className="rg-repo-n"><b>acme</b>/api</p>
          <ul>
            <li className={'new' + st(5)} {...peek(5)}><b>v1.2.3</b><span>image</span></li>
            <li className={'sig' + st(6)} {...peek(6)}><b>v1.2.3</b><span>cosign signature</span></li>
            <li className="in"><b>v1.2.2</b><span>image</span></li>
          </ul>
          <p className="rg-org">a repository name begins with your org</p>
        </div>
      </div>
    </div>
  );
}

/* ---------- the chapters' object: the image itself, one big stack of layers that each fact acts on ---------- */
const CLIENTS = ['docker', 'podman', 'buildkit', 'skopeo', 'crane'];
const PEOPLE = [['ana', 'push'], ['kai', 'push'], ['lee', 'pull'], ['sam', 'revoked']];

/* The image drawn as its layers, a stack of inked plates seen from above, large enough to be each screen's one object.
   Every chapter does one visible thing to it, labelled on the object itself:
   intro: an IAM token hovers over it while its time runs out; 01: a password is struck off and falls away while the
   token seats on the stack; 02: the org claims the top plate (it turns ink, "acme/* · push"); 03: the signature and the
   attestation dock beside the image; 04: the stack squares up for /v2/; 05: a tag slides out and storage shrinks;
   06: four people fold into one directory, one of them revoked. One short caption sits under it. */
function Repo({ step, intro }) {
  const on = (i) => (!intro && step === i) || undefined;
  return (
    <div className="rg-rv" data-step={intro ? 'intro' : step}>
      <div className="rg-iso" aria-hidden="true">
        <div className="rg-iso-s">
          {[0, 1, 2, 3].map((i) => <i key={i} className="rg-pl" style={{ '--z': i }} />)}
          <i className="rg-pl rg-pl-top" style={{ '--z': 4 }} />
          <i className="rg-pl rg-pl-sig" style={{ '--z': 4 }} />
          <i className="rg-pl rg-pl-att" style={{ '--z': 3 }} />
          <i className="rg-pl rg-pl-tok" style={{ '--z': 7 }} />
        </div>
        <span className="rg-t rg-t-tok" data-on={intro || undefined}><b>Hanzo IAM · token</b><span className="rg-ttl-bar"><i /></span></span>
        <span className="rg-t rg-t-pw" data-on={on(0)}>password</span>
        <span className="rg-t rg-t-seat" data-on={on(0)}>✓ token · signature checked</span>
        <span className="rg-t rg-t-org" data-on={on(1)}><b>acme</b>/* · push</span>
        <span className="rg-t rg-t-sig" data-on={on(2)}>cosign signature</span>
        <span className="rg-t rg-t-att" data-on={on(2)}>in-toto attestation</span>
        <span className="rg-t rg-t-del" data-on={on(4)}>v1.2.3-oops</span>
        <span className="rg-ppl" data-on={on(5)}>{PEOPLE.map(([n, r], i) => <i key={n} className={r === 'revoked' ? 'off' : ''} style={{ '--i': i }}>{n[0]}</i>)}</span>
        <p className="rg-iso-n">oci.hanzo.ai / <b>acme</b> / api</p>
      </div>
      <div className="rg-rv-panes" aria-hidden="true">
        <p className="rg-rv-pane" data-on={on(0)}>no password stored at either end</p>
        <p className="rg-rv-pane" data-on={on(1)}>one grant in one place</p>
        <p className="rg-rv-pane" data-on={on(2)}>same repository as the image they describe</p>
        <div className="rg-rv-pane rg-v2" data-on={on(3)}><span className="lx-num">/v2/</span><span className="rg-clients">{CLIENTS.join(' · ')}</span></div>
        <div className="rg-rv-pane rg-store" data-on={on(4)}><i /><span>deleted · blobs reclaimed</span></div>
        <p className="rg-rv-pane" data-on={on(5)}>one directory of people · Hanzo Cloud</p>
      </div>
    </div>
  );
}

const FACTS = [
  ['IAM Token Auth', 'An unauthenticated pull gets a 401 naming Hanzo IAM. Your client fetches a token there, the registry checks its signature against a certificate it holds, and the push goes through. No password is stored at either end.'],
  ['Org-Scoped Repos', 'A repository name begins with your org, and what a token may do with it is decided by IAM at the moment the token is minted. Adding a teammate is one grant in one place, not a secret copied into a second.'],
  ['Cosign + Attestation', 'cosign signatures and in-toto attestations are ordinary OCI artifacts, so they push and pull to the same repository as the image they describe. Verification happens where the image runs, against exactly what the registry stored.'],
  ['OCI Compliant', 'The registry HTTP API v2 at /v2/, and nothing bespoke on top of it. Every client, scanner and admission controller that reads an image already speaks it, which is the whole point of not inventing one.'],
  ['Tags come off cleanly', 'Deletes are enabled, so a tag you pushed by mistake goes away and the blobs behind it are reclaimed. A registry you can only add to is one that only grows.'],
  ['The same account as everything else', 'Whoever signs into Hanzo Cloud is who pushes an image. One directory of people, one place to revoke someone — and no separate registry account to remember when they leave.'],
];

// [row, the dockerconfigjson way, the IAM way]: both sides are Hanzo's phrases from this page
const SWAP = [
  ['Adding a teammate', 'a secret copied into a second', 'one grant in one place'],
  ['Someone leaves', 'a separate registry account to remember when they leave', 'one place to revoke someone'],
];

function Swap({ gone }) {
  return (
    <div className={'rg-swap' + (gone ? ' on' : '')}>
      <dl className="rg-swap-t">
        {SWAP.map(([k, a, b]) => (
          <div key={k} className="rg-swap-r">
            <dt>{k}</dt>
            <dd className="was" aria-hidden={gone}>{a}</dd>
            <dd className="now" aria-hidden={!gone}>{b}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

/* the dark room: the heading is the instruction and the switch carries it out (the switch is named by the heading,
   so the words are said once); pressed, the heading strikes through and IAM's way wipes in row by row */
function DelRoom() {
  const [gone, setGone] = useState(false);
  return (
    <div className={'lx-wrap rg-del-grid' + (gone ? ' on' : '')}>
      <div className="rg-del-l">
        <h2 className="lx-headline rg-del-h" id="rg-del-h">Delete the dockerconfigjson secret</h2>
        <button type="button" className="rg-swap-b" aria-pressed={gone} aria-labelledby="rg-del-h" onClick={() => setGone((g) => !g)}>
          <span className="rg-swap-sw" aria-hidden="true"><i /></span>
        </button>
        <p className="lx-lede">Put a token IAM mints in its place, and let it expire on its own. There is nothing left to rotate.</p>
        <div className="rg-del-acts">
          <A to="https://docs.hanzo.ai/docs/openapi/registry/" className="lx-ghost">Quickstart<Arr /></A>
          <A to="/iam" className="lx-text">About IAM</A>
        </div>
      </div>
      <Code title="Registry terminal" tabs={[{ k: 'terminal', code: '$ hanzo login oci.hanzo.ai\n# IAM mints a short-lived token\n$ docker push oci.hanzo.ai/acme/api:v1.2.3' }]} className="rg-code" />
      <Swap gone={gone} />
    </div>
  );
}

const SIDE = [['Registry', '/registry'], ['Projects', '/cloud/projects'], ['Environments', '/cloud/environments'], ['Builds', '/cloud/builds'], ['Releases', '/cloud/releases'], ['Pipelines', '/cloud/pipelines']];
const REL = [['Projects', '/cloud/projects', 'The deploy unit'], ['Environments', '/cloud/environments', 'Dev, staging, prod — isolated'], ['Builds', '/cloud/builds', 'Source to signed image']];

export default function Registry() {
  return (
    <main className="lx rg">
      <section className="rg-hero" data-morph-target data-ask-name="Hanzo Registry">
        <div className="lx-wrap rg-hero-grid">
          <SettleStage from={1.06} className="rg-stage"><Push /></SettleStage>
          <div className="rg-hero-copy">
            <LineMask as="h1" className="lx-display m rg-h1" lines={['Hanzo', 'Registry']} />
            <p className="lx-body rg-lede">A private registry for your container images at oci.hanzo.ai. It serves the OCI distribution API, so docker, podman, buildkit, skopeo and crane already know how to talk to it — and the credential is a short-lived token minted by your Hanzo IAM login, not a password living in a dockerconfigjson secret.</p>
            <A to={GH} className="lx-cta rg-cta" data-thumb="View Source" data-cta="registry.hero">View Source<Arr /></A>
          </div>
        </div>
      </section>

      <ClipWipe dark className="rg-del">
        <DelRoom />
      </ClipWipe>

      <PinnedChapters
        label="Built on Hanzo IAM"
        per={46}
        intro={{ title: ['Built on', 'Hanzo IAM'], lede: 'The credential expires on its own, so there is nothing to rotate and nothing to leak' }}
        steps={FACTS.map(([t, d], i) => ({ t, d, k: String(i + 1).padStart(2, '0') }))}
        visual={(at, intro) => <Repo step={at} intro={intro} />}
      />

      <section className="lx-sec rg-con">
        <div className="lx-wrap rg-con-grid">
          <div>
            <LaunchConsole light name="Registry" api="/v1/registry" cap="The service the session above is changing." side={SIDE} />
            <p className="rg-note">Example project. Every name in it is one you would give your own.</p>
          </div>
          <Paste name="Registry" prompt="Read https://hanzo.ai/skill.md and use Hanzo Registry in my project. Start with: hanzo registry images" className="lx-paste" />
        </div>
      </section>

      <RelatedCards className="rg-rel" items={REL}>
        <div className="rg-start">
          <h2 className="lx-title">Get started with Registry</h2>
          <A to={GH} className="lx-ghost">View on GitHub<Arr /></A>
        </div>
      </RelatedCards>

      <LaunchClose name="Registry" tag="OCI image registry" seed="registry" data={[401, 2, 6]} ask={['View Source', GH]} cta="registry.close" />
    </main>
  );
}
