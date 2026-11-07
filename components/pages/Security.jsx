'use client';
// Persona: a security reviewer or the buyer who has to sign off (arrives from /trust, /enterprise, the footer or a questionnaire link)
// Goal: see an honest status, which mechanism protects what, check each control, and reach Hanzo's security team
// CTA: Talk to Security Team -> /contact (hero; the shared ask bar after it; the closing band) · data-cta="security.hero" / "security.band"
// Metric: contact_sales_submit (enterprise buyers, MASTER §1) via cta_click on security.hero and security.band
// Signature: none by design (MASTER §4.2, an honest status) — the six layers check themselves once as the page arrives, then the controls read as a calm document you select from
// Beyond: "Reviewer's worksheet" — tick each control as you check it; the count stays in this browser, and at six of six the page hands over Hanzo's own next step, Schedule Security Review
/* Security, brought to MASTER §4.2: an honest status, easy to verify. The first screen is the headline, the ask, the
   status in Hanzo's words ("Continual internal audits, with the report on request") and the six layers from the edge to
   the organization's own file, which check themselves once in a 0.4 s-step pass and then rest. Below it the controls
   read as a calm document: pick a layer and its mechanism and words come up beside it, with the reviewer's worksheet.
   Then what runs underneath, the option of none of it, and one black room with the sign-off, the address for what you
   find, and the closing band with the same ask. Hanzo's deck only: ink and greys, colour only from Hanzo's koma image.
   Scale has rhythm (ProofRhythm): h1 52, headings 26, figures 64; one big thing per screen (the map, the plate's figure,
   the rack, the statement, the closing line at 84).
   Motion (no springs): the line-mask cut-in (arrival), the one-time status pass (time), the gliding layer pill and the
   plate crossfade (state), pointer answers on every control, and the black room's entry (the one scroll-linked move).
   Conflict noted on the card: MASTER §4.2 also lists DPA, subprocessors and security.txt for /security; on hanzo.ai those
   live on /trust, and the split is not ours to merge, so /security links /trust for them and adds no copy.
   V2: 8/10 calm honest-status rebuild in ink: status pass in the hero, the controls as a selectable document with the worksheet, quiet proof, one black room ending on the same ask. */
import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useReducedMotion } from 'motion/react';
import { Copy } from '../ui';
import { A, More } from '../kit';
import MaskLines from '../v2/MaskLines';
import SceneWipe from '../v2/SceneWipe';
import Sheet from './security/Sheet';
import NoJs from '../NoJs';
import '../v2/ProofScale.css';
import '../v2/ProofRhythm.css';
import './Security.css';

const EMPH = [0.16, 1, 0.3, 1]; // deck ease-emphasis
const CONTROLS = [
  ['Encryption at Rest and in Transit', 'At rest, each organization is its own file on Hanzo Base, and where a master key is configured each file opens under its own key, derived through HKDF-SHA256. In transit the edge speaks TLS 1.3 and offers hybrid ML-KEM-768 key exchange to clients that support it, so their traffic captured today cannot be read by a quantum computer later.'],
  ['Second Factors', 'An authenticator app, or a code by SMS or email, with recovery codes. Enrolment hands out the material and demands it back before it writes anything, and adding or dropping a factor signs the account out of every other browser — a stolen session that outlives the change is the same as not having the factor.'],
  ['Keys and Tokens', 'A key is told apart from a token by its prefix, so nothing has to guess what it was handed. Tokens are refused outright if they carry an HMAC signature or no algorithm at all, and a refresh token is single-use — presenting a spent one revokes its whole family rather than the one token.'],
  ['Who May Reach What', 'Access is a grant at a place: an organization, a workspace under it, a project under that. A check asks whether some grant the caller holds covers the path and admits the verb. One rule, no special cases, and the decision is a function call rather than a service that can be down.'],
  ['The Edge Throws Identity Away', 'Anything that arrives claiming to be an org, a user or an email is deleted at the gateway before a single handler reads it. Identity is written back only from a verified token. Inside the cluster, services reach each other over a binary protocol rather than the public internet.'],
  ['Where It Sits', 'An organization is a tenancy boundary, and on Hanzo Base it is a physical one — a different organization is a different database file, so no query can reach across two. Dedicated and self-hosted deployments pin that file to a region you choose.'],
];
/* the mechanism each layer shows: Hanzo's own terms, lifted from the control's words */
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
const Check = ({ s = 16 }) => <svg viewBox="0 0 16 16" width={s} height={s} aria-hidden="true"><path d="M3.5 8.5l3 3 6-6.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>;

/* ---------- hero: the status, checked once as the page arrives ---------- */
function Map({ pick }) {
  const ref = useRef(null);
  const live = useInView(ref, { amount: 0.3, once: true });
  const calm = useReducedMotion();
  const [n, setN] = useState(0); // 0 = waiting at the edge, 1..6 = layers checked; it stops at 6
  useEffect(() => {
    if (calm) { setN(6); return; }
    if (!live || n >= 6) return;
    const t = setTimeout(() => setN((v) => v + 1), n === 0 ? 400 : 300);
    return () => clearTimeout(t);
  }, [n, calm, live]);
  return (
    <div className="xsc-map" ref={ref}>
      <p className="xsc-map-h">
        <span>The controls, named</span>
        <span className="pf-mono" aria-hidden="true">{pad(Math.max(0, n - 1))} / 06</span>
      </p>
      <ol className="xsc-map-st">
        {CONTROLS.map(([t], i) => (
          <li key={t} style={{ '--i': i }} className={(i < n ? 'ok' : '') + (i === n - 1 && n < 6 ? ' now' : '') + (i === 5 ? ' core' : '')}>
            <span className="xsc-mp" aria-hidden="true">{i === 5 && <img src="/models/koma.webp" alt="" width="172" height="120" />}</span>
            <button type="button" className="xsc-ml" onClick={() => pick(i)}>
              <span className="pf-mono">{pad(i)}</span>
              <span className="xsc-ml-t">{t}<span className="xsc-ml-m pf-mono" aria-hidden="true">{MECH[i].items.map((m) => (Array.isArray(m) ? m[0] : m)).join(' · ')}</span></span>
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
          <MaskLines as="h1" id="xsc-h1" className="pf-display" lines={['What protects', 'your data,', 'and how.']} />
          <p className="pf-kick xsc-cap">Security Architecture</p>
          <p className="pf-lede">Clear security mechanisms: which key encrypts your data, where tenancy boundaries are enforced, and how every request is verified.</p>
          <div className="xsc-acts">
            <A to="/contact" className="pf-btn solid" data-thumb="Talk to Security Team" data-cta="security.hero">Talk to Security Team</A>
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

/* ---------- the controls, a calm document you select from ---------- */
function Mech({ m }) {
  if (m.kind === 'chips') return <ul className="xsc-chips">{m.items.map((c) => <li key={c}>{c}</li>)}</ul>;
  if (m.kind === 'rules') return <ul className="xsc-rules">{m.items.map(([a, b]) => <li key={a}><span>{a}</span><b>{b}</b></li>)}</ul>;
  if (m.kind === 'path') return <ol className="xsc-path">{m.items.map((c) => <li key={c}>{c}</li>)}</ol>;
  return <div className="xsc-strike"><ul>{m.items.map((c) => <li key={c}><s>{c}</s></li>)}</ul><p><span aria-hidden="true">→</span> {m.foot}</p></div>;
}

function Layers({ at, setAt }) {
  const [ok, setOk] = useState([]); // the reviewer's ticks, kept in this browser only
  useEffect(() => { try { const v = JSON.parse(localStorage.getItem(KEY) || '[]'); if (Array.isArray(v)) setOk(v.filter((i) => i >= 0 && i < 6)); } catch {} }, []);
  const tick = (i) => setOk((o) => {
    const v = o.includes(i) ? o.filter((k) => k !== i) : [...o, i];
    try { localStorage.setItem(KEY, JSON.stringify(v)); } catch {}
    return v;
  });
  const keys = (e) => {
    const k = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key];
    if (!k) return;
    e.preventDefault();
    const n = (at + k + 6) % 6;
    setAt(n);
    document.getElementById('xsc-tab-' + n)?.focus();
  };
  return (
    <section className="pf-sec xsc-layers" id="controls" aria-labelledby="xsc-layers-h">
      <div className="pf-wrap xsc-layers-g">
        <div className="xsc-layers-l">
          <h2 id="xsc-layers-h" className="pf-head">The controls, named</h2>
          <div className="xsc-tabs" role="tablist" aria-label="The controls" aria-orientation="vertical" onKeyDown={keys}>
            {CONTROLS.map(([t], i) => (
              <button
                key={t} id={'xsc-tab-' + i} type="button" role="tab" aria-selected={at === i} aria-controls={'xsc-p-' + i} tabIndex={at === i ? 0 : -1}
                className={ok.includes(i) ? 'ok' : ''}
                onClick={() => setAt(i)}
              >
                {at === i && <motion.span layoutId="xsc-pill" className="xsc-pill" transition={{ duration: 0.3, ease: EMPH }} />}
                <span className="pf-mono">{pad(i)}</span>
                <span className="xsc-tab-t">{t}</span>
                <span className="xsc-tab-ok"><Check s={14} /></span>
              </button>
            ))}
          </div>
          <p className="xsc-ws-n pf-mono" aria-live="polite">{ok.length} / 6 checked</p>
          {ok.length === 6 && <More to="/contact-sales">Schedule Security Review</More>}
        </div>
        <div className="xsc-layers-r">
          {/* the hero's six layers, carried down: the chosen one lifts out of the stack and its mechanism sits beside it */}
          <div className="xsc-stk" aria-hidden="true">
            <ol className="xsc-stk-s">
              {CONTROLS.map(([t], i) => (
                <li key={t} style={{ '--i': i }} className={(i === 5 ? 'core' : '') + (ok.includes(i) ? ' ok' : '')} data-on={at === i} onClick={() => setAt(i)}>
                  <span className="xsc-mp">{i === 5 && <img src="/models/koma.webp" alt="" width="172" height="120" />}</span>
                </li>
              ))}
            </ol>
            <div className="xsc-stk-m">
              {CONTROLS.map(([t], i) => (
                <div key={t} data-on={at === i}>
                  <span className="pf-mono xsc-stk-n">{pad(i)} / 06</span>
                  <b className="pf-title">{t}</b>
                  <Mech m={MECH[i]} />
                </div>
              ))}
            </div>
          </div>
          <div className="xsc-panels">
            {CONTROLS.map(([t, d], i) => (
              <div key={t} id={'xsc-p-' + i} role="tabpanel" aria-labelledby={'xsc-tab-' + i} className="xsc-panel" data-on={at === i} inert={at !== i}>
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
  const ref = useRef(null);
  const live = useInView(ref, { amount: 0.5, once: true });
  const calm = useReducedMotion();
  const [up, setUp] = useState(0); // units powered on, 0..4; it stops at 4
  useEffect(() => {
    if (calm) { setUp(4); return; }
    if (!live || up >= 4) return;
    const t = setTimeout(() => setUp((v) => v + 1), up === 0 ? 150 : 400);
    return () => clearTimeout(t);
  }, [live, up, calm]);
  return (
    <section className="pf-sec xsc-infra" aria-labelledby="xsc-infra-h">
      <div className="pf-wrap xsc-infra-g">
        <div>
          <MaskLines id="xsc-infra-h" className="pf-head" lines={['What runs underneath']} />
          <p className="pf-kick xsc-cap">Infrastructure</p>
          <p className="pf-body">Workloads sit in hardware-virtualised machines on managed Kubernetes, in data centres with physical access control and redundant power. Secrets never reach a manifest — they are fetched from Hanzo KMS at boot, and outside development a service refuses to start without a verified issuer, audience and key set rather than falling back to running open.</p>
        </div>
        <ol className="xsc-rack" ref={ref}>
          {RACK.map((t, i) => (
            <li key={t} style={{ '--on': i < up ? 1 : 0 }} data-up={i < up}>
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

const PLACES = ['Our cloud', 'your cluster', 'your rack']; // Hanzo's own words, from "Our cloud, your cluster, your rack"
function Where() {
  const ref = useRef(null);
  const live = useInView(ref, { amount: 0.6, once: true });
  const calm = useReducedMotion();
  const [at, setAt] = useState(0);
  const [own, setOwn] = useState(false); // once pressed, the visitor drives it
  useEffect(() => {
    if (calm) { setAt(2); return; }
    if (!live || own || at >= 2) return;
    const t = setTimeout(() => setAt((v) => v + 1), 900);
    return () => clearTimeout(t);
  }, [live, at, own, calm]);
  return (
    <div className="xsc-where" ref={ref} style={{ '--at': at }}>
      <div className="xsc-where-s" aria-hidden="true">{[0, 1, 2, 3, 4, 5].map((i) => <i key={i} style={{ '--i': i }} className={i === 5 ? 'core' : ''} />)}</div>
      <div className="xsc-where-b" role="group" aria-label={OPTIONS[0][0]}>
        {PLACES.map((p, i) => (
          <button key={p} type="button" aria-pressed={at === i} onClick={() => { setOwn(true); setAt(i); }}>
            <span className="xsc-where-pad" aria-hidden="true" />
            <span className="pf-mono">{p}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function None() {
  return (
    <section className="pf-sec xsc-none" aria-labelledby="xsc-none-h">
      <div className="pf-wrap xsc-none-g">
        <div>
          <h2 id="xsc-none-h" className="xsc-none-h">Or none of our infrastructure at all</h2>
          <p className="pf-lede">Every piece named on this page is a binary you can run yourself. The strongest answer to a question about our infrastructure is that you do not have to use it.</p>
          <Where />
        </div>
        <ol className="xsc-opts">
          {OPTIONS.map(([t, d], i) => (
            <li key={t}><span className="xsc-opt-n pf-mono" aria-hidden="true">{pad(i)}</span><b className="pf-title">{t}</b><span>{d}</span></li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ---------- the one black room: the sign-off, the address, the closing band ---------- */
const COMES = ['Single sign-on through Hanzo IAM', 'Federation to your own OpenID Connect issuer', 'SCIM 2.0 provisioning from your directory', 'A named engineer who knows your deployment', 'Priority incident response', 'Retention set by you, not by us', 'Audit records exported where you want them', 'Security questionnaire support'];

function Dark() {
  return (
    <SceneWipe className="xsc-dark" label="Enterprise">
      <div className="pf-sec">
        <div className="pf-wrap xsc-ent-g">
          <div>
            <MaskLines className="pf-head" lines={['If you are the one', 'who has to sign off']} />
            <p className="pf-kick xsc-cap">Enterprise</p>
          </div>
          <div>
            <p className="xsc-big">Bring the control you are required to demonstrate and we will show you the code that implements it, or tell you plainly that it does not exist yet. A control we cannot point at is one you should not put your name to.</p>
            <p className="pf-body">Where a requirement is not met, the honest options are usually self-hosting, a dedicated deployment, or waiting. Our engineers will say which one applies rather than selling you the gap.</p>
            <div className="xsc-comes">
              <Sheet label="What comes with Enterprise" title="What comes with Enterprise">
                <p>An engineer who has read your deployment, retention you set rather than inherit, and somebody to answer the questionnaire your procurement team is about to send.</p>
                <ul className="xsc-comes-l">
                  {COMES.map((t) => <li key={t}><Check /><span>{t}</span></li>)}
                </ul>
                <More to="/contact-sales">Contact Sales</More>
              </Sheet>
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
          <MaskLines className="pf-moment" lines={['Ask us the', 'hard question']} />
          <div className="xsc-ask-r">
            <p className="pf-lede">Bring the requirement you cannot get past, and we will show you the code or tell you it is not built. Both answers are more useful than a brochure.</p>
            <div className="xsc-ask-acts">
              <A to="/contact" className="pf-btn solid xsc-light" data-cta="security.band">Talk to Security Team</A>
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
  // a layer named in the hero: bring the controls up with that layer chosen
  const pick = (i) => {
    setAt(i);
    const el = document.getElementById('controls');
    if (!el) return;
    const y = el.getBoundingClientRect().top + scrollY - 40;
    window.__lenis ? window.__lenis.scrollTo(y, { duration: 0.5 }) : scrollTo({ top: y, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    setTimeout(() => document.getElementById('xsc-tab-' + i)?.focus({ preventScroll: true }), 520);
  };
  return (
    <main className="xsc pf-r">
      {/* JS off: every control's words and plate stand stacked, and the black room is simply there */}
      <NoJs css=".xsc-panel,.xsc-stk-m>div{opacity:1!important;transform:none!important;grid-area:auto!important;pointer-events:auto!important;margin-top:24px}.pf-wipe>div[aria-hidden]{clip-path:none!important}.xsc-rack li{--on:1}" />
      <Hero pick={pick} />
      <Layers at={at} setAt={setAt} />
      <Infra />
      <None />
      <Dark />
    </main>
  );
}
