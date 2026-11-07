'use client';
/* IAM (v2, archetype A Launch).
   V2: 8/10 Object-first hero where a refresh-token family grows link by link and dies at once when a spent token is replayed; the eight facts as a rail of big cards that slides sideways as you scroll; try-to-steal-one as the dark room.
   Signature: the refresh-token family, live. A sign-in at hanzo.id runs the PKCE exchange (S256) and mints the first
   token; each refresh spends the last one and issues the next; then a spent one is presented again and the whole
   family turns over to revoked at once.
   Supporting: kinetic title lines; the eight facts as a scroll-scrubbed sideways rail (ScrubRail), each card led by the
   one term the fact turns on; the family settles from huge on scroll (Stage).
   Beyond: "Try to steal one" - you hold the live refresh token; copy it as the thief, then refresh as either of you, in
   any order. Whoever comes second presents a spent token and the whole family is revoked.
   Accent: indigo, from hanzo.id. Every word and link is Hanzo's. */
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { A } from '../../kit';
import { useLive } from './Frame';
import { Lines, Lift } from '../../v2/LiftStage';
import ScrubRail from '../../v2/ScrubRail';
import ShipPrompt from '../../v2/ShipPrompt';
import GetIt from '../../v2/GetIt';
import '../../v2/v2scale.css';
import './Iam.css';

const EASE = [0.16, 1, 0.3, 1];

/* hero: 0 authorize (PKCE S256), 1 code, 2 rt1, 3 rt2, 4 rt3, 5 rt1 presented again, 6 family revoked, 7 hold */
function Family() {
  const [ref, live, calm] = useLive(0.3);
  const [t, setT] = useState(0);
  useEffect(() => { if (calm) setT(6); }, [calm]);
  useEffect(() => {
    if (!live) return;
    const id = setTimeout(() => setT((v) => (v >= 7 ? 0 : v + 1)), [1100, 900, 1000, 1000, 1000, 1500, 2600, 600][t]);
    return () => clearTimeout(id);
  }, [t, live]);
  const n = Math.max(0, Math.min(3, t - 1));
  const dead = t >= 6;
  return (
    <div className={'ia-fam' + (dead ? ' dead' : '')} ref={ref} aria-hidden="true">
      <div className="ia-fam-top">
        <p className="ia-host"><i />hanzo.id</p>
        <p className={'ia-step' + (t >= 0 ? ' on' : '')}>authorize <b>PKCE · S256</b></p>
        <p className={'ia-step' + (t >= 1 ? ' on' : '')}>code → token</p>
      </div>
      <ol className="ia-chain">
        {[1, 2, 3].map((k) => (
          <AnimatePresence key={k}>
            {k <= n && (
              <motion.li
                className={dead ? 'dead' : k < n ? 'spent' : 'live'}
                initial={{ opacity: 0, x: -24, scale: 0.94 }}
                animate={{ opacity: 1, x: 0, scale: 1, rotateX: dead ? 180 : 0 }}
                exit={{ opacity: 0, transition: { duration: 0.2 } }}
                transition={{ duration: 0.7, ease: EASE, rotateX: { duration: 0.8, ease: EASE, delay: (k - 1) * 0.09 } }}
              >
                <span className="ia-tok">rt{k}</span>
                <span className="ia-st">{k < n ? 'spent' : 'live'}</span>
                <span className="ia-back">revoked</span>
              </motion.li>
            )}
          </AnimatePresence>
        ))}
      </ol>
      <div className="ia-fam-foot">
        <p className="ia-k">refresh tokens <span>single-use · kept as a hash</span></p>
        <AnimatePresence mode="wait" initial={false}>
          {t >= 5 && (
            <motion.p key={dead ? 'd' : 'r'} className={'ia-replay' + (dead ? ' dead' : '')} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.45, ease: EASE }}>
              {dead ? 'a spent one was presented · the whole family is revoked' : 'rt1 presented again'}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

const FACTS = [
  ['PKCE', 'Authorization code with PKCE, always S256.', 'S256'],
  ['Passwords', 'The passwords that do exist are argon2id digests, and a scheme IAM does not recognize fails closed.', 'argon2id'],
  ['Refresh tokens', 'Refresh tokens are single-use and kept only as a hash. Presenting a spent one revokes the whole family, so a stolen token cannot outlive its session.', 'single-use'],
  ['A second factor', 'A second factor is an authenticator app, a code by SMS or email, or a passkey. Adding or dropping one signs the account out of every other browser.', 'passkey'],
  ['Federation', 'Sign-in arrives from Google, from GitHub or from any OIDC issuer you name, and SCIM 2.0 keeps a directory in step.', 'SCIM 2.0'],
  ['Signing keys', 'Tokens are signed RS256, with ML-DSA-65 available per certificate and published in the same JWKS.', 'RS256'],
  ['Organizations', 'Every organization is a tenancy boundary, and membership travels in the token.', 'tenancy boundary'],
  ['Authorization', 'What you may reach once signed in is Authz’s to decide, reading the same token.', 'Authz'],
];

/* Beyond: try to steal one. Two holders, one family; a spent token presented by anyone revokes the family. */
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
    <section className="ia-steal v2-dark" data-room="dark">
      <div className="v2-wrap v2-grid ia-steal-grid">
        <div className="ia-steal-copy">
          <p className="v2-kick acc">Refresh tokens</p>
          <h2 className="v2-display s">Try to steal one</h2>
          <p className="v2-body">Refresh tokens are single-use and kept only as a hash. Presenting a spent one revokes the whole family.</p>
          <div className="ia-steal-acts">
            <button type="button" className="v2-btn" onClick={() => setS((v) => ({ ...v, thief: v.you }))} disabled={!!dead || !!thief}>Copy it as the thief</button>
            <button type="button" className="v2-btn solid" onClick={() => use('you')} disabled={!!dead}>Refresh as you</button>
            <button type="button" className="v2-btn" onClick={() => use('thief')} disabled={!!dead || !thief}>Refresh as the thief</button>
            <button type="button" className="ia-steal-x" onClick={() => setS({ n: 1, you: 1, thief: 0, dead: '' })}>Start again</button>
          </div>
        </div>
        <div className={'ia-steal-box' + (dead ? ' dead' : '')}>
          <ol className="ia-steal-chain">
            <AnimatePresence initial={false}>
              {Array.from({ length: n }, (_, i) => i + 1).map((k) => (
                <motion.li key={k} className={dead ? 'dead' : k < n ? 'spent' : 'live'} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ type: 'spring', stiffness: 300, damping: 30 }}>
                  <b>rt{k}</b><span>{dead ? 'revoked' : k < n ? 'spent' : 'live'}</span>
                  <em>{you === k && 'you'}{you === k && thief === k && ' · '}{thief === k && 'thief'}</em>
                </motion.li>
              ))}
            </AnimatePresence>
          </ol>
          <p className="ia-steal-say" aria-live="polite">{say}</p>
        </div>
      </div>
    </section>
  );
}

export default function Iam() {
  return (
    <main className="v2 ia">
      <section className="ia-hero">
        <Lift className="v2-wrap ia-lift" from={1.12} y={24} origin="50% 100%" offset={['start end', 'start 0.1']}>
          <Family />
        </Lift>
        <div className="v2-wrap v2-grid ia-hero-t">
          <div className="ia-hero-l">
            <p className="v2-kick acc">Identity</p>
            <Lines as="h1" className="v2-display ia-h1" lines={['Hanzo IAM']} data-morph-target="" />
          </div>
          <div className="ia-hero-r">
            <motion.p className="v2-lede ia-sub" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: EASE, delay: 0.35 }}>The sign-in behind every Hanzo service.</motion.p>
            <div className="v2-acts">
              <A to="https://docs.hanzo.ai/docs/openapi/iam" className="v2-btn solid">API reference</A>
              <A to="https://hanzo.id/.well-known/openid-configuration" className="v2-btn">Discovery document</A>
              <A to="https://github.com/hanzoai/iam" className="v2-link ia-src">Source →</A>
            </div>
          </div>
        </div>
      </section>

      <ScrubRail
        className="ia-rail"
        label="How hanzo.id signs you in"
        head={<div className="ia-rail-h"><h2 className="v2-headline">hanzo.id</h2><p className="v2-kick">01 / 08 — 08 / 08</p></div>}
        items={FACTS}
        card={([t, d, big], i) => (
          <article className="ia-card">
            <p className="ia-card-n">{String(i + 1).padStart(2, '0')} / 08</p>
            <p className="ia-card-big" aria-hidden="true">{big}</p>
            <div>
              <h3 className="v2-title">{t}</h3>
              <p className="ia-card-d">{d}</p>
            </div>
          </article>
        )}
      />

      <Steal />

      <ShipPrompt
        name="IAM"
        api="/v1/iam"
        prompt="Read https://hanzo.ai/skill.md and use Hanzo IAM in my project. Start with: hanzo iam whoami"
        related={[['Authz', '/authz', 'Fine-grained access'], ['KMS', '/kms', 'Managed keys'], ['Secrets', '/cloud/secrets', 'Store once, sync everywhere']]}
        flip
      />

      <GetIt name="IAM" tag="Identity + access (hanzo.id)" seed="iam" data={[256, 65, 3]} repo={['hanzoai/iam', 'https://github.com/hanzoai/iam']} stars="3 stars" />
    </main>
  );
}
