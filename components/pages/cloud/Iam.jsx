'use client';
/* IAM. Signature: a refresh-token family. A sign-in at hanzo.id runs the PKCE exchange and mints a token whose payload
   carries the organization; each refresh spends the last token and issues the next, until a spent one is presented
   again and the whole family is revoked at once. The eight facts are a grid of tiles: choose one and it opens wide
   while the others step aside. Beyond: "Try to steal one" - you hold the live refresh token; copy it as the thief,
   then refresh as either of you, in any order. Whoever comes second presents a spent token and the whole family is
   revoked, so the theft dies with the session. Every word and link is Hanzo's. */
import { useEffect, useState } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'motion/react';
import { EASE, Rise } from '../../ui';
import { Hero, Paste, Related, Get, useLive } from './Frame';
import './Iam.css';

const STEPS = ['authorize · PKCE S256', 'code', 'token'];

function Family() {
  const [ref, live, calm] = useLive(0.3);
  const [t, setT] = useState(0); // 0-2 exchange, 3-5 refresh chain grows, 6 replay, 7 family revoked
  useEffect(() => {
    if (calm) { setT(6); return; } // reduced motion: the end state, set after hydration so server and client HTML agree
    if (!live) return;
    const id = setTimeout(() => setT((v) => (v >= 7 ? 0 : v + 1)), [800, 800, 1000, 900, 900, 1100, 1300, 2600][t]);
    return () => clearTimeout(id);
  }, [t, live, calm]);
  const n = Math.max(1, Math.min(4, t - 1));
  const revoked = t >= 7;
  return (
    <div className="ia-fam" ref={ref} aria-hidden="true">
      <div className="ia-sign">
        <p className="ia-host">hanzo.id</p>
        <ol className="ia-steps">{STEPS.map((s, i) => <li key={s} className={t >= i ? 'on' : ''}><i />{s}</li>)}</ol>
        <div className={'ia-jwt' + (t >= 2 ? ' on' : '')}>
          <span className="h">alg: RS256 · ML-DSA-65</span>
          <span className="p">sub · owner · roles</span>
          <span className="s">signature</span>
        </div>
      </div>
      <div className="ia-chain">
        <p className="ia-chain-k">refresh tokens <span>single-use · kept as a hash</span></p>
        <div className="ia-tokens">
          <LayoutGroup>
            <AnimatePresence initial={false}>
              {Array.from({ length: t >= 3 ? n : 0 }).map((_, i) => (
                <motion.div key={i} layout className={'ia-rt' + (i < n - 1 ? ' spent' : ' live') + (revoked ? ' dead' : '')} initial={{ opacity: 0, x: -20, scale: 0.9 }} animate={{ opacity: 1, x: 0, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.45, ease: EASE, delay: revoked ? i * 0.08 : 0 }}>
                  <b>rt{i + 1}</b><span>{revoked ? 'revoked' : i < n - 1 ? 'spent' : 'live'}</span>
                </motion.div>
              ))}
            </AnimatePresence>
          </LayoutGroup>
        </div>
        <AnimatePresence>
          {t >= 6 && (
            <motion.p className={'ia-replay' + (revoked ? ' hit' : '')} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
              {revoked ? 'a spent one was presented · the whole family is revoked' : 'rt1 presented again'}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

const FACTS = [
  ['PKCE', 'Authorization code with PKCE, always S256.'],
  ['Passwords', 'The passwords that do exist are argon2id digests, and a scheme IAM does not recognize fails closed.'],
  ['Refresh tokens', 'Refresh tokens are single-use and kept only as a hash. Presenting a spent one revokes the whole family, so a stolen token cannot outlive its session.'],
  ['A second factor', 'A second factor is an authenticator app, a code by SMS or email, or a passkey. Adding or dropping one signs the account out of every other browser.'],
  ['Federation', 'Sign-in arrives from Google, from GitHub or from any OIDC issuer you name, and SCIM 2.0 keeps a directory in step.'],
  ['Signing keys', 'Tokens are signed RS256, with ML-DSA-65 available per certificate and published in the same JWKS.'],
  ['Organizations', 'Every organization is a tenancy boundary, and membership travels in the token.'],
  ['Authorization', 'What you may reach once signed in is Authz’s to decide, reading the same token.'],
];

function Tiles() {
  const [at, setAt] = useState(0);
  return (
    <section className="x-sec ia-tiles">
      <div className="x-wrap">
        <div className="ia-tiles-h">
          <Rise as="h2">hanzo.id</Rise>
          <span className="x-mono">{String(at + 1).padStart(2, '0')} / 08</span>
        </div>
        <LayoutGroup>
          <ul className="ia-grid">
            {FACTS.map(([t, d], i) => (
              <motion.li key={t} layout className={'ia-tile' + (at === i ? ' open' : '')} transition={{ type: 'spring', stiffness: 260, damping: 32 }}>
                <button type="button" onClick={() => setAt(i)} onFocus={() => setAt(i)} aria-expanded={at === i}>
                  <motion.span layout="position" className="ia-tile-n">{String(i + 1).padStart(2, '0')} / 08</motion.span>
                  <motion.span layout="position" className="ia-tile-t">{t}</motion.span>
                  <span className="ia-tile-d">{d}</span>
                </button>
              </motion.li>
            ))}
          </ul>
        </LayoutGroup>
      </div>
    </section>
  );
}

/* Try to steal one: two holders, one family. A spent token presented by anyone revokes the family. */
function Steal() {
  const [s, setS] = useState({ n: 1, you: 1, thief: 0, dead: '' });
  const use = (who) => setS((v) => {
    if (v.dead) return v;
    const tok = v[who];
    if (tok < v.n) return { ...v, dead: who };
    return { ...v, n: v.n + 1, [who]: v.n + 1 };
  });
  const { n, you, thief, dead } = s;
  const say = dead
    ? `${dead === 'you' ? 'You' : 'The thief'} presented spent rt${s[dead]}: the whole family is revoked, so a stolen token cannot outlive its session.`
    : thief ? `The thief holds rt${thief}. Refresh as either of you.` : `You hold rt${you}. Copy it as the thief.`;
  return (
    <section className="x-sec ia-steal">
      <div className="x-wrap ia-steal-grid">
        <div>
          <p className="x-kick">Refresh tokens</p>
          <h2>Try to steal one</h2>
          <p className="ia-steal-l">Refresh tokens are single-use and kept only as a hash. Presenting a spent one revokes the whole family.</p>
          <div className="ia-steal-acts">
            <button type="button" onClick={() => setS((v) => ({ ...v, thief: v.you }))} disabled={!!dead || !!thief}>Copy it as the thief</button>
            <button type="button" onClick={() => use('you')} disabled={!!dead}>Refresh as you</button>
            <button type="button" onClick={() => use('thief')} disabled={!!dead || !thief}>Refresh as the thief</button>
            <button type="button" className="ia-steal-x" onClick={() => setS({ n: 1, you: 1, thief: 0, dead: '' })}>Start again</button>
          </div>
        </div>
        <div className={'ia-steal-box' + (dead ? ' dead' : '')}>
          <ol className="ia-steal-chain">
            {Array.from({ length: n }, (_, i) => i + 1).map((k) => (
              <li key={k} className={dead ? 'dead' : k < n ? 'spent' : 'live'}>
                <b>rt{k}</b><span>{dead ? 'revoked' : k < n ? 'spent' : 'live'}</span>
                <em>{you === k && 'you'}{you === k && thief === k && ' · '}{thief === k && 'thief'}</em>
              </li>
            ))}
          </ol>
          <p className="ia-steal-say" aria-live="polite">{say}</p>
        </div>
      </div>
    </section>
  );
}

export default function Iam() {
  return (
    <main className="ia">
      <Hero
        look="stack"
        kick="Identity"
        title="Hanzo IAM"
        sub="The sign-in behind every Hanzo service."
        acts={[['API reference', 'https://docs.hanzo.ai/docs/openapi/iam'], ['Discovery document', 'https://hanzo.id/.well-known/openid-configuration'], ['Source', 'https://github.com/hanzoai/iam']]}
      >
        <Family />
      </Hero>
      <Tiles />
      <Steal />
      <section className="x-sec ia-paste" data-room="dark">
        <div className="x-wrap">
          <Paste dark name="IAM" api="/v1/iam" prompt="Read https://hanzo.ai/skill.md and use Hanzo IAM in my project. Start with: hanzo iam whoami" />
        </div>
      </section>
      <section className="ia-rel">
        <div className="x-wrap"><Related items={[['Authz', '/authz', 'Fine-grained access'], ['KMS', '/kms', 'Managed keys'], ['Secrets', '/cloud/secrets', 'Store once, sync everywhere']]} /></div>
      </section>
      <Get name="IAM" tag="Identity + access (hanzo.id)" repo={['hanzoai/iam', 'https://github.com/hanzoai/iam']} stars="3 stars" />
    </main>
  );
}
