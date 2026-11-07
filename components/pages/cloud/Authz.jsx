'use client';
/* Authz. Signature: one question, asked of a path. A location tree (acme, acme/prod, acme/prod/web) holds grants at
   prefixes; requests arrive one after another and the check walks up from the target to the grant that covers it,
   then asks whether the role admits the verb: allowed, refused, an invite-only project with no ancestor above it, an
   agent holding a narrower delegated grant. The six rules are a numbered column beside the example console.
   Beyond: "Ask it yourself". Put your grant anywhere in the tree, point at any target, and the path half of Hanzo's one
   rule answers true or false, with what that means for delegating it. Built only from the tree and the rules above.
   Every word and link is Hanzo's. */
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { EASE, Rise } from '../../ui';
import { Hero, Paste, Related, Get, Console, useLive, useSteps } from './Frame';
import './Authz.css';

const NODES = [['acme', 0], ['acme/prod', 1], ['acme/prod/web', 2], ['acme/dev', 1], ['the app or site under that', 3]];
// [who, grant held at, verb, target, decision, why]
const ASKS = [
  ['org-wide member', 'acme', 'read', 'acme/prod/web', true, 'a grant at acme prefixes the target'],
  ['workspace member', 'acme/prod', 'read', 'acme/dev', false, 'acme/prod does not prefix acme/dev'],
  ['agent, delegated', 'acme/prod/web', 'read', 'acme/prod/web', true, 'a narrower grant, with an expiry'],
  ['workspace member', 'acme/prod', 'delete', 'acme/prod/web', false, 'the role does not admit the verb'],
];

function Check() {
  const [ref, live] = useLive(0.3);
  const [at, choose] = useSteps(ASKS.length, 3400, live);
  const [who, grant, verb, target, ok, why] = ASKS[at];
  return (
    <div className="az-check" ref={ref}>
      <div className="az-tree" aria-hidden="true">
        {NODES.map(([n, d]) => {
          const isGrant = n === grant, isTarget = n === target;
          const covered = ok && target.startsWith(n) && n.length >= grant.length;
          return (
            <motion.div key={n} className={'az-node' + (isGrant ? ' grant' : '') + (isTarget ? ' target' : '') + (covered ? ' path' : '')} style={{ marginLeft: d * 28 + 'px' }} layout transition={{ duration: 0.3 }}>
              <span>{n}</span>
              {isGrant && <motion.em key={'g' + at} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 380, damping: 22 }}>grant</motion.em>}
              {isTarget && <motion.em key={'t' + at} className="t" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 380, damping: 22, delay: 0.1 }}>target</motion.em>}
            </motion.div>
          );
        })}
      </div>
      <div className="az-q">
        <p className="az-q-k">can</p>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={at} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8, transition: { duration: 0.15 } }} transition={{ duration: 0.35, ease: EASE }}>
            <p className="az-q-line"><span>{who}</span> <b>{verb}</b> <span>{target}</span></p>
            <motion.p className={'az-dec' + (ok ? ' ok' : ' no')} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.9, type: 'spring', stiffness: 320, damping: 22 }}>{ok ? 'true' : 'false'}</motion.p>
            <motion.p className="az-why" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }}>{why}</motion.p>
          </motion.div>
        </AnimatePresence>
        <div className="az-dots" role="tablist" aria-label="Requests">
          {ASKS.map((a, i) => <button key={i} type="button" role="tab" aria-selected={at === i} aria-label={a[0] + ' ' + a[2] + ' ' + a[3]} onClick={() => choose(i)} />)}
        </div>
      </div>
    </div>
  );
}

/* Beyond: the path half of the rule, asked by you. The last node stands for anything under acme/prod/web. */
const PATHS = NODES.map(([n], i) => (i === NODES.length - 1 ? 'acme/prod/web/~' : n));
const covers = (g, t) => t === g || t.startsWith(g + '/');

function Ask() {
  const [g, setG] = useState(1);
  const [t, setT] = useState(2);
  const ok = covers(PATHS[g], PATHS[t]);
  const pick = (label, at, set) => (
    <div className="az-ask-row" role="radiogroup" aria-label={label}>
      <p>{label}</p>
      {NODES.map(([n], i) => <button key={n} type="button" role="radio" aria-checked={at === i} onClick={() => set(i)}>{n}</button>)}
    </div>
  );
  return (
    <section className="x-sec az-ask" aria-labelledby="az-ask-h">
      <div className="x-wrap az-ask-grid">
        <div>
          <h2 id="az-ask-h">Ask it yourself</h2>
          <p>Can is true when some grant the caller holds prefixes the target and its role admits the verb.</p>
        </div>
        <div className="az-ask-box">
          {pick('grant', g, setG)}
          {pick('target', t, setT)}
          <div className="az-ask-a" aria-live="polite">
            <motion.b key={g + '-' + t} className={ok ? 'ok' : 'no'} initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 380, damping: 24 }}>{ok ? 'true' : 'false'}</motion.b>
            <span>{NODES[g][0]} {ok ? 'prefixes' : 'does not prefix'} {NODES[t][0]}</span>
            <em>{ok ? 'Delegation is a narrower grant' : 'Nothing can be delegated that the delegator does not already hold.'}</em>
          </div>
        </div>
      </div>
    </section>
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

export default function Authz() {
  return (
    <main className="az">
      <Hero
        look="split"
        title="Hanzo Authz"
        lede="Hanzo Authz reads a token and answers whether the caller may do the thing. It verifies the JWT that IAM signed, then asks one question: does a grant this caller holds cover this path, and does its role admit this verb. It is a library, not a service — no store, no configuration, no network call on any path — so every Hanzo service asks that question the same way and gets the same answer."
        acts={[['Read the docs', 'https://docs.hanzo.ai/docs/projects/hanzoai/authz'], ['View on GitHub', 'https://github.com/hanzoai/authz']]}
      >
        <Check />
      </Hero>
      <Ask />
      <section className="x-sec az-rules" data-room="dark">
        <div className="x-wrap az-rules-grid">
          <div className="az-side">
            <Rise><Console name="Authz" api="/v1/authz" side={[['Authz', '/authz'], ['IAM', '/iam'], ['KMS', '/kms'], ['Secrets', '/cloud/secrets'], ['Audit', '/cloud/audit'], ['Zero Trust', '/cloud/zero-trust']]} /></Rise>
            <p className="az-note">Example project. Every name in it is one you would give your own.</p>
          </div>
          <ol className="az-list">
            {RULES.map(([t, d], i) => (
              <Rise as="li" key={t} y={18}>
                <span>{String(i + 1).padStart(2, '0')}</span>
                <h3>{t}</h3>
                <p>{d}</p>
              </Rise>
            ))}
          </ol>
        </div>
      </section>
      <section className="x-sec az-paste">
        <div className="x-wrap">
          <Paste name="Authz" prompt="Read https://hanzo.ai/skill.md and use Hanzo Authz in my project. Start with: hanzo authz check" />
          <Related className="az-rel" items={[['Authz docs →', 'https://docs.hanzo.ai/docs/projects/hanzoai/authz'], ['IAM', '/iam', 'OIDC identity & orgs'], ['KMS', '/kms', 'Managed keys'], ['Secrets', '/cloud/secrets', 'Store once, sync everywhere']]} />
        </div>
      </section>
      <Get name="Authz" tag="Fine-grained authorization" repo={['hanzoai/authz', 'https://github.com/hanzoai/authz']} stars="4 stars" self="https://docs.hanzo.ai/docs/projects/hanzoai/authz" />
      <i hidden data-thumb="Read the docs" data-href="https://docs.hanzo.ai/docs/projects/hanzoai/authz" />
    </main>
  );
}
