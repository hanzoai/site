'use client';
/* Registry. Signature: a push that asks IAM first. docker push meets a 401 that names Hanzo IAM, the client fetches a
   short-lived token, the registry checks its signature, and the layers go up one by one into the org's repository,
   with the cosign signature landing beside the image as an ordinary artifact. Below: the six facts as a column of
   handshake steps, the example console, and the two-line terminal. Every word and link is Hanzo's.
   Beyond: the secret swap. In the dark room, one press deletes the dockerconfigjson secret: a wipe replaces what you
   keep today with what IAM gives instead, row by row (where the credential lives, adding a teammate, someone leaving), each side in Hanzo's own contrasting phrases. */
import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { EASE, Rise } from '../../ui';
import { A } from '../../kit';
import { Hero, Paste, Related, Get, Console, Code, useLive } from './Frame';
import './Registry.css';

const LAYERS = [0.82, 0.55, 0.34, 0.12];

function Push() {
  const [ref, live, calm] = useLive(0.3);
  const [t, setT] = useState(0); // 0 push, 1 401, 2 token, 3 signature checked, 4 layers, 5 pushed, 6 signed
  useEffect(() => { if (calm) setT(6); }, [calm]); // reduced motion: the signed end state, set after hydration
  useEffect(() => {
    if (calm || !live) return;
    const id = setTimeout(() => setT((v) => (v >= 6 ? 0 : v + 1)), [700, 900, 900, 800, 1900, 900, 2400][t]);
    return () => clearTimeout(id);
  }, [t, live, calm]);
  const LOG = [
    ['$ docker push oci.hanzo.ai/acme/api:v1.2.3', ''],
    ['401 · token from Hanzo IAM', 'warn'],
    ['token minted by your IAM login', 'ok'],
    ['signature checked against its certificate', 'ok'],
  ];
  return (
    <div className="rg-push" ref={ref} aria-hidden="true">
      <div className="rg-term">
        {LOG.map(([l, k], i) => <motion.p key={l} className={k} initial={false} animate={{ opacity: t >= i ? 1 : 0, y: t >= i ? 0 : 6 }} transition={{ duration: 0.35, ease: EASE }}>{l}</motion.p>)}
        <div className="rg-layers">
          {LAYERS.map((w, i) => (
            <div key={i} className="rg-layer">
              <span>layer {i + 1}</span>
              <i><motion.b initial={false} animate={{ scaleX: t >= 4 ? 1 : 0 }} transition={{ duration: 0.9 + w, ease: [0.4, 0, 0.2, 1], delay: t >= 4 ? i * 0.18 : 0 }} /></i>
            </div>
          ))}
        </div>
      </div>
      <div className="rg-repo">
        <p className="rg-repo-k">oci.hanzo.ai</p>
        <p className="rg-repo-n">acme/api</p>
        <ul>
          <motion.li initial={false} animate={{ opacity: t >= 5 ? 1 : 0.18 }} className="new"><b>v1.2.3</b><span>image</span></motion.li>
          <motion.li initial={false} animate={{ opacity: t >= 6 ? 1 : 0.18 }} className="sig"><b>v1.2.3</b><span>cosign signature</span></motion.li>
          <li><b>v1.2.2</b><span>image</span></li>
        </ul>
        <p className="rg-org">a repository name begins with your org</p>
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
  ['The credential', 'a password living in a dockerconfigjson secret', 'a short-lived token minted by your Hanzo IAM login'],
  ['Adding a teammate', 'a secret copied into a second', 'one grant in one place'],
  ['Someone leaves', 'a separate registry account to remember when they leave', 'one place to revoke someone'],
];

function Swap() {
  const [gone, setGone] = useState(false);
  return (
    <div className={'rg-swap' + (gone ? ' on' : '')}>
      <button type="button" className="rg-swap-b" aria-pressed={gone} onClick={() => setGone((g) => !g)}>
        <span className="rg-swap-sw" aria-hidden="true"><i /></span>
        {gone ? 'Secret deleted · IAM token in its place' : 'Delete the dockerconfigjson secret'}
      </button>
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

export default function Registry() {
  return (
    <main className="rg">
      <Hero
        kick="Container Registry"
        title="Hanzo Registry"
        lede="A private registry for your container images at oci.hanzo.ai. It serves the OCI distribution API, so docker, podman, buildkit, skopeo and crane already know how to talk to it — and the credential is a short-lived token minted by your Hanzo IAM login, not a password living in a dockerconfigjson secret."
        acts={[['View Source', 'https://github.com/hanzoai']]}
      >
        <Push />
      </Hero>
      <section className="x-sec rg-iam">
        <div className="x-wrap rg-iam-grid">
          <div className="rg-iam-h">
            <Rise as="h2">Built on Hanzo IAM</Rise>
            <p>The credential expires on its own, so there is nothing to rotate and nothing to leak</p>
          </div>
          <ol className="rg-steps">
            {FACTS.map(([t, d], i) => (
              <Rise as="li" key={t} y={18} delay={(i % 2) * 0.06}>
                <span className="rg-n">{String(i + 1).padStart(2, '0')}</span>
                <h3>{t}</h3>
                <p>{d}</p>
              </Rise>
            ))}
          </ol>
        </div>
      </section>
      <section className="x-sec rg-del" data-room="dark">
        <div className="x-wrap rg-del-grid">
          <div>
            <h2>Delete the dockerconfigjson secret</h2>
            <p>Put a token IAM mints in its place, and let it expire on its own. There is nothing left to rotate.</p>
            <div className="rg-del-acts">
              <A to="https://docs.hanzo.ai/docs/openapi/registry/" className="x-btn solid" data-thumb="Quickstart">Quickstart</A>
              <A to="/iam" className="x-btn">About IAM</A>
            </div>
          </div>
          <Code title="Registry terminal" tabs={[{ k: 'terminal', code: '$ hanzo login oci.hanzo.ai\n# IAM mints a short-lived token\n$ docker push oci.hanzo.ai/acme/api:v1.2.3' }]} />
          <Swap />
        </div>
      </section>
      <section className="x-sec rg-con">
        <div className="x-wrap rg-con-grid">
          <div><Console light name="Registry" api="/v1/registry" cap="The service the session above is changing." side={[['Registry', '/registry'], ['Projects', '/cloud/projects'], ['Environments', '/cloud/environments'], ['Builds', '/cloud/builds'], ['Releases', '/cloud/releases'], ['Pipelines', '/cloud/pipelines']]} /></div>
          <div>
            <p className="rg-note">Example project. Every name in it is one you would give your own.</p>
            <Paste name="Registry" prompt="Read https://hanzo.ai/skill.md and use Hanzo Registry in my project. Start with: hanzo registry images" className="rg-paste" />
          </div>
        </div>
      </section>
      <section className="rg-start">
        <div className="x-wrap rg-start-in">
          <h2>Get started with Registry</h2>
          <A to="https://github.com/hanzoai" className="x-btn">View on GitHub</A>
        </div>
        <div className="x-wrap"><Related items={[['Projects', '/cloud/projects', 'The deploy unit'], ['Environments', '/cloud/environments', 'Dev, staging, prod — isolated'], ['Builds', '/cloud/builds', 'Source to signed image']]} /></div>
      </section>
      <Get name="Registry" tag="OCI image registry" />
    </main>
  );
}
