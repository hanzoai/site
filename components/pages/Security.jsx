'use client';
// Persona: a security reviewer or the buyer who has to sign off (arrives from /trust, /enterprise, the footer or a questionnaire link)
// Goal: see which mechanism protects what, check each control, and reach Hanzo's security team
// CTA: Talk to Security Team -> /contact (hero, sticky AskBar and thumb bar, close) · metric cta_click (data-cta="talk-to-security-team")
/* Security. Its idea: a map you travel. The whole of it first — six layers, from the edge down to the organization's
   own file, stacked as one exploded object while a request passes through them and each layer checks itself. Then the
   camera goes into one layer at a time: it lifts out of the stack, turns to face you and shows its mechanism, while
   its control's words sit beside it — by itself every few seconds, or at your hand. Then what runs underneath, the
   option of none of it, and in the one dark room the sign-off, the address for what you find, and the hard question.
   Every word is Hanzo's. Structure follows BRIEF-v3 §5.2 (System): hero with the ask > the layers > the checklist
   with its detail > proof > closing ask. No accent hue: hierarchy from ink alone; colour only from Hanzo's own media.
   Signature: zoom into the layer — the six-layer stack stays on screen as the map while each layer in turn lifts out, turns face-on and shows its mechanism, advancing by itself or at your hand.
   Beyond: "Reviewer's worksheet". Tick each control as you check it; the count stays in this browser, and when all
   six are ticked the page hands you the next step, Hanzo's own security review.
   Motion: signature (layer zoom: idle auto-advance, springs, a gliding tab pill) + MaskLines headline cut-in (arrival)
   + the hero request pulse (idle) + the SceneWipe dark room (the one scroll-linked effect).
   V2: 8/10 System rebuild in ink only: unboxed hero layer map with a live request pulse, a self-advancing layer zoom with the worksheet beside it, calm proof, one wiped-in dark room with the sign-off sheet, one ask (Talk to Security Team) in the hero, sticky after it and at the close; JS off shows every control. */
import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useReducedMotion } from 'motion/react';
import { Copy } from '../ui';
import { A, More } from '../kit';
import MaskLines from '../v2/MaskLines';
import SceneWipe from '../v2/SceneWipe';
import DetailSheet from '../v2/DetailSheet';
import AskBar from '../v2/AskBar';
import '../v2/ProofScale.css';
import './Security.css';

const CONTROLS = [
  ['Encryption at Rest and in Transit', 'At rest, each organization is its own file on Hanzo Base, and where a master key is configured each file opens under its own key, derived through HKDF-SHA256. In transit the edge speaks TLS 1.3 and offers hybrid ML-KEM-768 key exchange to clients that support it, so their traffic captured today cannot be read by a quantum computer later.'],
  ['Second Factors', 'An authenticator app, or a code by SMS or email, with recovery codes. Enrolment hands out the material and demands it back before it writes anything, and adding or dropping a factor signs the account out of every other browser — a stolen session that outlives the change is the same as not having the factor.'],
  ['Keys and Tokens', 'A key is told apart from a token by its prefix, so nothing has to guess what it was handed. Tokens are refused outright if they carry an HMAC signature or no algorithm at all, and a refresh token is single-use — presenting a spent one revokes its whole family rather than the one token.'],
  ['Who May Reach What', 'Access is a grant at a place: an organization, a workspace under it, a project under that. A check asks whether some grant the caller holds covers the path and admits the verb. One rule, no special cases, and the decision is a function call rather than a service that can be down.'],
  ['The Edge Throws Identity Away', 'Anything that arrives claiming to be an org, a user or an email is deleted at the gateway before a single handler reads it. Identity is written back only from a verified token. Inside the cluster, services reach each other over a binary protocol rather than the public internet.'],
  ['Where It Sits', 'An organization is a tenancy boundary, and on Hanzo Base it is a physical one — a different organization is a different database file, so no query can reach across two. Dedicated and self-hosted deployments pin that file to a region you choose.'],
];
/* the mechanism each layer shows when it faces you: Hanzo's own terms, lifted from the control's words */
const MECH = [
  { kind: 'chips', items: ['HKDF-SHA256', 'TLS 1.3', 'ML-KEM-768', 'Hanzo Base'] },
  { kind: 'chips', items: ['Authenticator app', 'SMS', 'Email', 'Recovery codes'] },
  { kind: 'rules', items: [['HMAC signature', 'refused'], ['no algorithm', 'refused'], ['refresh token', 'single-use']] },
  { kind: 'path', items: ['organization', 'workspace', 'project'] },
  { kind: 'strike', items: ['org', 'user', 'email'], foot: 'verified token' },
  { kind: 'chips', items: ['Dedicated', 'Self-hosted', 'a region you choose'] },
];
const pad = (i) => String(i + 1).padStart(2, '0');
const KEY = 'hz-security-checked';
const DWELL = 5000; // ms each layer faces you when nobody is choosing
const Check = ({ s = 16 }) => <svg viewBox="0 0 16 16" width={s} height={s} aria-hidden="true"><path d="M3.5 8.5l3 3 6-6.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>;

/* ---------- hero: the whole map, a request passing through every layer ---------- */
function Map({ pick }) {
  const ref = useRef(null);
  const live = useInView(ref, { amount: 0.3 });
  const calm = useReducedMotion();
  const [n, setN] = useState(0); // 0 = waiting at the edge, 1..6 = layers passed, 7 = hold
  useEffect(() => {
    if (calm || !live) return;
    const t = setTimeout(() => setN((v) => (v + 1) % 8), n === 7 ? 2600 : n === 0 ? 500 : 820);
    return () => clearTimeout(t);
  }, [n, calm, live]);
  useEffect(() => { if (calm) setN(6); }, [calm]); // final state after hydration, never a different first render
  const done = Math.min(n, 6);
  return (
    <div className="xsc-map" ref={ref}>
      <p className="xsc-map-h">
        <span>The controls, named</span>
        <span className="pf-mono" aria-hidden="true">{pad(Math.max(0, done - 1))} / 06</span>
      </p>
      <ol className="xsc-map-st">
        {CONTROLS.map(([t], i) => (
          <li key={t} style={{ '--i': i }} className={(i < done ? 'ok' : '') + (i === done - 1 ? ' now' : '') + (i === 5 ? ' core' : '')}>
            <span className="xsc-mp" aria-hidden="true">{i === 5 && <img src="/models/koma.webp" alt="" width="172" height="120" />}</span>
            <button type="button" className="xsc-ml" onClick={() => pick(i)}>
              <span className="pf-mono">{pad(i)}</span>
              <span className="xsc-ml-t">{t}</span>
              <Check />
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}

function Hero({ pick }) {
  return (
    <section className="xsc-hero" aria-labelledby="xsc-h1">
      <div className="pf-wrap xsc-hero-g">
        <div className="xsc-hero-c">
          <MaskLines as="h1" id="xsc-h1" className="pf-display m" lines={['What protects', 'your data,', 'and how.']} />
          <p className="pf-kick xsc-cap">Security Architecture</p>
          <p className="pf-lede">Clear security mechanisms: which key encrypts your data, where tenancy boundaries are enforced, and how every request is verified.</p>
          <div className="xsc-acts">
            <A to="/contact" className="pf-btn solid" data-thumb="Talk to Security Team" data-cta="talk-to-security-team">Talk to Security Team</A>
            <More to="https://docs.hanzo.ai/docs/cli/security">Security Documentation</More>
          </div>
          <p className="xsc-audit">
            <i className="xsc-audit-dot" aria-hidden="true" />
            <span className="xsc-audit-t">Continual internal audits, with the report on request.</span>
            <More to="/trust">The controls, and how to check them</More>
          </p>
        </div>
        <div className="xsc-hero-v">
          <Map pick={pick} />
        </div>
      </div>
    </section>
  );
}

/* ---------- signature: the camera goes into one layer at a time ---------- */
function Mech({ m }) {
  if (m.kind === 'chips') return <ul className="xsc-chips">{m.items.map((c) => <li key={c}>{c}</li>)}</ul>;
  if (m.kind === 'rules') return <ul className="xsc-rules">{m.items.map(([a, b]) => <li key={a}><span>{a}</span><b>{b}</b></li>)}</ul>;
  if (m.kind === 'path') return <ol className="xsc-path">{m.items.map((c) => <li key={c}>{c}</li>)}</ol>;
  return <div className="xsc-strike"><ul>{m.items.map((c) => <li key={c}><s>{c}</s></li>)}</ul><p><span aria-hidden="true">→</span> {m.foot}</p></div>;
}

function Zoom({ at }) {
  return (
    <div className="xsc-zoom" aria-hidden="true">
      {CONTROLS.map(([t], i) => {
        const on = i === at;
        return (
          <motion.div
            key={t}
            className={'xsc-zp' + (on ? ' on' : '') + (i < at ? ' past' : '') + (i === 5 ? ' core' : '')}
            initial={false}
            animate={on
              ? { x: 80, y: 0, scale: 1, rotateX: 0, rotateZ: 0 }
              : { x: -280, y: -150 + i * 60, scale: 0.4, rotateX: 58, rotateZ: -42 }}
            transition={{ type: 'spring', stiffness: 120, damping: 20, mass: 0.9 }}
            style={{ zIndex: on ? 20 : 10 - i, transformPerspective: 1600 }}
          >
            {i === 5 && <img src="/models/koma.webp" alt="" width="480" height="330" />}
            <div className="xsc-zp-in">
              <span className="xsc-zp-n">{pad(i)}</span>
              <b className="xsc-zp-t">{t}</b>
              <Mech m={MECH[i]} />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

function Layers({ at, setAt, held, hold }) {
  const ref = useRef(null);
  const live = useInView(ref, { amount: 0.45 });
  const calm = useReducedMotion();
  const [ok, setOk] = useState([]); // the reviewer's ticks, kept in this browser only
  useEffect(() => { try { const v = JSON.parse(localStorage.getItem(KEY) || '[]'); if (Array.isArray(v)) setOk(v.filter((i) => i >= 0 && i < 6)); } catch {} }, []);
  const tick = (i) => setOk((o) => {
    const v = o.includes(i) ? o.filter((k) => k !== i) : [...o, i];
    try { localStorage.setItem(KEY, JSON.stringify(v)); } catch {}
    return v;
  });
  // by itself: the next layer every DWELL ms while the stage is on screen and nobody is choosing
  const auto = live && !held && !calm;
  useEffect(() => {
    if (!auto) return;
    const t = setTimeout(() => setAt((v) => (v + 1) % 6), DWELL);
    return () => clearTimeout(t);
  }, [auto, at, setAt]);
  const keys = (e) => {
    const k = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key];
    if (!k) return;
    e.preventDefault();
    const n = (at + k + 6) % 6;
    hold(); setAt(n);
    document.getElementById('xsc-tab-' + n)?.focus();
  };
  return (
    <section className="pf-sec tight xsc-layers" id="controls" ref={ref} aria-labelledby="xsc-layers-h">
      <div className="pf-wrap xsc-layers-g">
        <div className="xsc-layers-l">
          <MaskLines id="xsc-layers-h" className="pf-head" lines={['The controls,', 'named']} />
          <div className="xsc-tabs" role="tablist" aria-label="The controls" aria-orientation="vertical" onKeyDown={keys}>
            {CONTROLS.map(([t], i) => (
              <button
                key={t} id={'xsc-tab-' + i} type="button" role="tab" aria-selected={at === i} aria-controls={'xsc-p-' + i} tabIndex={at === i ? 0 : -1}
                className={ok.includes(i) ? 'ok' : ''}
                onClick={() => { hold(); setAt(i); }}
              >
                {at === i && <motion.span layoutId="xsc-pill" className="xsc-pill" transition={{ type: 'spring', stiffness: 500, damping: 35 }} />}
                <span className="pf-mono">{pad(i)}</span>
                <span className="xsc-tab-t">{t}</span>
                <span className="xsc-tab-ok"><Check s={14} /></span>
                {at === i && auto && <i className="xsc-dwell" key={'d' + at} style={{ animationDuration: DWELL + 'ms' }} aria-hidden="true" />}
              </button>
            ))}
          </div>
          <p className="xsc-ws-n pf-mono" aria-live="polite">{ok.length} / 6 checked</p>
          {ok.length === 6 && <More to="/contact-sales">Schedule Security Review</More>}
        </div>
        <div className="xsc-layers-r">
          <Zoom at={at} />
          <div className="xsc-panels">
            {CONTROLS.map(([t, d], i) => (
              <div key={t} id={'xsc-p-' + i} role="tabpanel" aria-labelledby={'xsc-tab-' + i} className="xsc-panel" data-on={at === i} inert={at !== i}>
                <p className="pf-kick xsc-panel-n">{pad(i)} / 06</p>
                <p className="pf-body">{d}</p>
                <button type="button" className={'xsc-tick' + (ok.includes(i) ? ' on' : '')} aria-pressed={ok.includes(i)} onClick={() => tick(i)}>
                  <Check s={14} />
                  {ok.includes(i) ? 'Checked' : 'Mark as checked'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- proof: what runs underneath ---------- */
const RACK = ['Hardware-virtualised machines, one tenant to a boundary', 'Errors, traces and release health watched around the clock', 'Replicated, with failover that does not need a person', 'Every image pinned to a version, every deploy reconciled'];
const OPTIONS = [['Run it where you like', 'Our cloud, your cluster, your rack'], ['Scales to nothing', 'Idle should cost what idle is worth'], ['Your region', 'Pin the data and keep it there']];

function Infra() {
  return (
    <section className="pf-sec xsc-infra" aria-labelledby="xsc-infra-h">
      <div className="pf-wrap xsc-infra-g">
        <div>
          <MaskLines id="xsc-infra-h" className="pf-head" lines={['What runs', 'underneath']} />
          <p className="pf-kick xsc-cap">Infrastructure</p>
          <p className="pf-body">Workloads sit in hardware-virtualised machines on managed Kubernetes, in data centres with physical access control and redundant power. Secrets never reach a manifest — they are fetched from Hanzo KMS at boot, and outside development a service refuses to start without a verified issuer, audience and key set rather than falling back to running open.</p>
        </div>
        <ol className="xsc-rack">
          {RACK.map((t, i) => (
            <li key={t}>
              <span className="xsc-u pf-mono" aria-hidden="true">U{i + 1}</span>
              <span className="xsc-rack-t">{t}</span>
              <span className="xsc-bay" aria-hidden="true"><i /><i /><i /></span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function None() {
  return (
    <section className="pf-sec xsc-none" aria-labelledby="xsc-none-h">
      <div className="pf-wrap xsc-none-g">
        <h2 id="xsc-none-h" className="pf-display s">Or none of our infrastructure at all</h2>
        <p className="pf-lede">Every piece named on this page is a binary you can run yourself. The strongest answer to a question about our infrastructure is that you do not have to use it.</p>
        <ol className="xsc-opts">
          {OPTIONS.map(([t, d], i) => (
            <li key={t}><span className="xsc-opt-n" aria-hidden="true">{pad(i)}</span><b className="pf-title">{t}</b><span>{d}</span></li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ---------- the one dark room: the sign-off, the address, the hard question ---------- */
const COMES = ['Single sign-on through Hanzo IAM', 'Federation to your own OpenID Connect issuer', 'SCIM 2.0 provisioning from your directory', 'A named engineer who knows your deployment', 'Priority incident response', 'Retention set by you, not by us', 'Audit records exported where you want them', 'Security questionnaire support'];

function Dark() {
  return (
    <SceneWipe className="xsc-dark" label="Enterprise">
      <div className="pf-sec">
        <div className="pf-wrap xsc-ent-g">
          <div>
            <MaskLines className="pf-display s" lines={['If you are the one', 'who has to sign off']} />
            <p className="pf-kick xsc-cap">Enterprise</p>
          </div>
          <div>
            <p className="xsc-big">Bring the control you are required to demonstrate and we will show you the code that implements it, or tell you plainly that it does not exist yet. A control we cannot point at is one you should not put your name to.</p>
            <p className="pf-body">Where a requirement is not met, the honest options are usually self-hosting, a dedicated deployment, or waiting. Our engineers will say which one applies rather than selling you the gap.</p>
            <div className="xsc-comes">
              <DetailSheet label="What comes with Enterprise" title="What comes with Enterprise">
                <p>An engineer who has read your deployment, retention you set rather than inherit, and somebody to answer the questionnaire your procurement team is about to send.</p>
                <ul className="xsc-comes-l">
                  {COMES.map((t) => <li key={t}><Check /><span>{t}</span></li>)}
                </ul>
                <More to="/contact-sales">Contact Sales</More>
              </DetailSheet>
            </div>
          </div>
        </div>

        <div className="pf-wrap xsc-found">
          <div>
            <h2 className="pf-head">Found something</h2>
            <p className="pf-body">Email us rather than opening a public issue, and include a reproduction if you have one. A real report from a stranger is worth more than an internal review, and we answer quickly.</p>
          </div>
          <div className="xsc-mail">
            <a href="mailto:security@hanzo.ai">security@hanzo.ai</a>
            <Copy text="security@hanzo.ai" label="Copy address" />
          </div>
        </div>

        <div className="pf-wrap xsc-ask">
          <MaskLines className="pf-display m" lines={['Ask us the', 'hard question']} />
          <div className="xsc-ask-r">
            <p className="pf-lede">Bring the requirement you cannot get past, and we will show you the code or tell you it is not built. Both answers are more useful than a brochure.</p>
            <div className="xsc-ask-acts">
              <A to="/contact" className="pf-btn solid xsc-light" data-cta="talk-to-security-team">Talk to Security Team</A>
              <More to="/contact-sales">Schedule Security Review</More>
            </div>
            <p className="xsc-note"><A to="/login">Try Hanzo</A> · <A to="https://docs.hanzo.ai/docs/cli/security">Read the security documentation</A></p>
          </div>
        </div>
      </div>
    </SceneWipe>
  );
}

export default function Security() {
  const [at, setAt] = useState(0);
  const [held, setHeld] = useState(false);
  const hold = () => setHeld(true);
  // a layer named in the hero map: bring its stage up with that layer facing you
  const pick = (i) => {
    hold(); setAt(i);
    const el = document.getElementById('controls');
    if (!el) return;
    const y = el.getBoundingClientRect().top + scrollY - 40;
    window.__lenis ? window.__lenis.scrollTo(y, { duration: 1.2 }) : scrollTo({ top: y, behavior: 'smooth' });
  };
  return (
    <main className="xsc">
      {/* JS off: every control's words stand stacked, and the dark room is simply there */}
      <noscript dangerouslySetInnerHTML={{ __html: '<style>.xsc-panel{opacity:1!important;transform:none!important;grid-area:auto!important;pointer-events:auto!important;margin-top:24px}.pf-wipe>div[aria-hidden]{clip-path:none!important}</style>' }} />
      <Hero pick={pick} />
      <Layers at={at} setAt={setAt} held={held} hold={hold} />
      <Infra />
      <None />
      <Dark />
      <AskBar title="Security" label="Talk to Security Team" to="/contact" cta="talk-to-security-team" />
    </main>
  );
}
