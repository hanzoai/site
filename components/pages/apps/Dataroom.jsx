'use client';
/* Dataroom. Signature: a link's views ticking in. The hero is the room after the link has gone: a deck's pages in a
   row, each one's reading time filling as a visitor works through it, the page someone re-read twice marked, and the
   visits arriving in the feed (verified, came back). Hanzo's five steps sit above it and hold on tap.
   Beyond: "Share it ten ways". Switch a link's settings (password, verified email, NDA, expiry, downloads off,
   watermark) and see what the person opening it will meet, including their own email printed across the page.
   Also: the features as a data room's folder tree you open file by file, and plans as a ladder.
   Every word and link is Hanzo's. */
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { EASE, Rise } from '../../ui';
import { A, Go, More } from '../../kit';
import { Get, useLive, useEvery, useSteps } from '../cloud/Frame';
import './Dataroom.css';

const DOCS = 'https://docs.hanzo.ai/docs/cli/dataroom';
const REPO = 'https://github.com/hanzoai/dataroom';
const up = (d) => ({ initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.9, ease: EASE, delay: d } });
const STEPS = [
  ['Add the documents', 'A folder tree rather than a single file, shared as one link.'],
  ['Set who may open it', 'A password, a verified email, an NDA to accept, an expiry date, downloads off. Set them per link.'],
  ['Send the link', ''],
  ['See what they read', 'Time spent on each page, how far they got, and whether they came back.'],
  ['Change your mind', 'Access can change after the link has gone, which an emailed PDF never allowed.'],
];
const PAGES = 10;
// how long the demo reader lingers on each page (relative), page 7 is the one read twice
const DWELL = [0.5, 0.35, 0.6, 0.45, 0.3, 0.7, 1, 0.4, 0.25, 0.2];

function Room({ at, live }) {
  const [p, setP] = useState(7);
  useEvery(650, live, () => setP((v) => (v >= PAGES + 4 ? 0 : v + 1)));
  const read = Math.min(p, PAGES);
  const back = p > PAGES + 1;
  const off = at === 4;
  return (
    <div className="dr-room" data-cursor="Watch">
      <div className="dr-bar">
        <span className="dr-lock" aria-hidden="true"><svg viewBox="0 0 16 16" width="13" height="13"><rect x="3" y="7" width="10" height="7" rx="1.6" fill="none" stroke="currentColor" strokeWidth="1.5" /><path d="M5.5 7V5a2.5 2.5 0 0 1 5 0v2" fill="none" stroke="currentColor" strokeWidth="1.5" /></svg></span>
        <span className="dr-url x-mono">dataroom link</span>
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span key={off ? 'off' : 'on'} className={'dr-state' + (off ? ' off' : '')} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3 }}>{off ? 'access changed' : 'open'}</motion.span>
        </AnimatePresence>
      </div>
      <div className="dr-body">
        <ul className="dr-tree" aria-hidden="true">
          {['Deck.pdf', 'Financials', 'Legal', 'NDA.pdf'].map((f, i) => (
            <motion.li key={f} initial={false} animate={{ opacity: at >= 0 ? 1 : 0, x: 0 }} className={i === 0 ? 'on' : ''}><i className={i === 1 || i === 2 ? 'dir' : ''} />{f}</motion.li>
          ))}
        </ul>
        <div className="dr-pages">
          <p className="dr-k x-mono"><span>Deck.pdf</span><span>time on each page</span></p>
          <div className="dr-strip">
            {Array.from({ length: PAGES }).map((_, i) => (
              <div key={i} className={'dr-pg' + (i < read ? ' seen' : '') + (i === read - 1 && !back ? ' now' : '')}>
                <span className="dr-thumb" aria-hidden="true"><i /><i /><i /></span>
                <i className="dr-heat"><motion.b initial={false} animate={{ scaleY: i < read ? DWELL[i] : 0 }} transition={{ type: 'spring', stiffness: 120, damping: 20 }} /></i>
                <span className="dr-n x-mono">{i + 1}</span>
                {i === 6 && back && <motion.em className="x-mono" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 500, damping: 20 }}>2×</motion.em>}
              </div>
            ))}
          </div>
          <div className="dr-prog"><motion.i animate={{ scaleX: read / PAGES }} transition={{ type: 'spring', stiffness: 120, damping: 22 }} /><span className="x-mono">how far they got · {read}/{PAGES}</span></div>
        </div>
        <ol className="dr-feed" aria-hidden="true">
          <li><b>verified email</b><span>opened the link</span></li>
          {read > 3 && <motion.li initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}><b>page {Math.min(read, PAGES)}</b><span>reading now</span></motion.li>}
          {back && <motion.li className="hot" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}><b>came back</b><span>re-read page 7</span></motion.li>}
          {off && <motion.li className="off" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}><b>downloads off</b><span>after the link had gone</span></motion.li>}
        </ol>
      </div>
    </div>
  );
}

function Hero() {
  const [ref, live] = useLive(0.3);
  const [at, choose] = useSteps(5, 3600, live);
  return (
    <section className="dr-hero" ref={ref} aria-labelledby="dr-h1">
      <div className="x-wrap">
        <div className="dr-top">
          <motion.p className="dr-kick" {...up(0)}>Secure Document Sharing</motion.p>
          <h1 id="dr-h1" className="dr-h1"><span className="x-line"><motion.span className="x-line-in" initial={{ y: '105%' }} animate={{ y: 0 }} transition={{ duration: 1.1, ease: EASE, delay: 0.05 }}>Hanzo Dataroom</motion.span></span></h1>
          <motion.p className="dr-lede" {...up(0.3)}>You send a link instead of an attachment, and the link keeps working for you after it leaves.</motion.p>
          <motion.div className="dr-acts" {...up(0.42)}>
            <motion.span className="x-go" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}><A to="/login" className="x-btn solid" data-thumb>Try Hanzo</A></motion.span>
            <Go to={DOCS}>Documentation</Go>
          </motion.div>
        </div>
        <motion.div className="dr-stage" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.1, ease: EASE, delay: 0.25 }}>
          <div className="dr-steps">
            <p className="dr-steps-k"><span>A link, shared</span><span className="x-mono">{String(at + 1).padStart(2, '0')} / 05</span></p>
            <div className="dr-tabs" role="tablist" aria-label="A link, shared">
              {STEPS.map(([t], i) => (
                <button key={t} type="button" role="tab" aria-selected={at === i} onClick={() => choose(i)}>
                  {at === i && <motion.span layoutId="dr-step" className="dr-step-bg" transition={{ type: 'spring', stiffness: 420, damping: 34 }} />}
                  <span>{t}</span>
                </button>
              ))}
            </div>
            <div className="dr-step-d">
              {STEPS.map(([t, d], i) => d && <motion.p key={t} initial={false} animate={at === i ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }} transition={{ duration: 0.35, ease: EASE }} aria-hidden={at !== i}>{d}</motion.p>)}
            </div>
            <p className="x-sr">02 / 05 03 / 05 04 / 05 05 / 05</p>
          </div>
          <Room at={at} live={live} />
        </motion.div>
      </div>
    </section>
  );
}

const FILES = [
  ['Page-by-page analytics', 'Time spent on each page, how far they got, and whether they came back. Which page an investor re-read twice tells you what the next call is about.'],
  ['Data rooms', 'A folder tree rather than a single file, shared as one link. Diligence is forty documents and a hundred questions, and both sides need to know what is in scope.'],
  ['Access controls', 'A password, a verified email, an NDA to accept, an expiry date, downloads off. Set them per link, so the same document can be open to one person and shut to another.'],
  ['Custom Branding', 'White-label with your logo, colors, and custom domain. Present a professional experience to investors.'],
  ['Watermarking', "The viewer's own email printed across every page. It does not make a screenshot impossible; it makes an anonymous one impossible, which is the part that changes behaviour."],
  ['Email verification', 'A code to the address before the document opens. Otherwise a forwarded link is a stranger, and your analytics are counting the wrong person.'],
  ['Custom Domains', 'Use your own domain for sharing links. Build trust with a branded URL.'],
  ['Webhooks', 'A view fires an event. Knowing someone opened the deck while you are still in the thread is worth more than knowing it on Monday.'],
  ['Team Management', 'Multi-tenant workspaces with role-based access. Manage sharing across your organization.'],
  ['SSO Authentication', 'Passkeys, Google, LinkedIn, SAML SSO, and Hanzo IAM single sign-on.'],
];

/* The features as a data room's own folder tree: open a file, read it in the preview. */
function Files() {
  const [ref, live] = useLive(0.3);
  const [at, choose] = useSteps(FILES.length, 2800, live);
  return (
    <section className="x-sec dr-files" ref={ref}>
      <div className="x-wrap">
        <header className="dr-h">
          <h2>A link you still control</h2>
          <p>Every setting here is per link, so one document can be shared ten different ways.</p>
        </header>
        <div className="dr-finder">
          <div className="dr-finder-bar"><i /><i /><i /><span className="x-mono">Hanzo Dataroom / features</span></div>
          <div className="dr-finder-body">
            <ul className="dr-list">
              {FILES.map(([t], i) => (
                <li key={t}>
                  <button type="button" className={at === i ? 'on' : ''} aria-pressed={at === i} onClick={() => choose(i)} onMouseEnter={() => choose(i)}>
                    <svg viewBox="0 0 16 16" width="15" height="15" aria-hidden="true"><path d="M3.5 1.5h6l3 3v10h-9z M9.5 1.5v3h3" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" /></svg>
                    <span>{t}</span>
                    <em className="x-mono">{String(i + 1).padStart(2, '0')}</em>
                  </button>
                </li>
              ))}
            </ul>
            <div className="dr-preview">
              {FILES.map(([t, d], i) => (
                <motion.article key={t} initial={false} animate={at === i ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }} transition={{ duration: 0.4, ease: EASE }} aria-hidden={at !== i} className="dr-doc">
                  <span className="dr-doc-wm" aria-hidden="true">viewer email · viewer email · viewer email</span>
                  <h3>{t}</h3>
                  <p>{d}</p>
                </motion.article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* Beyond: the link's settings, and what the person opening it meets. */
const SETS = [['password', 'A password'], ['email', 'A verified email'], ['nda', 'An NDA to accept'], ['expiry', 'An expiry date'], ['nodl', 'Downloads off'], ['wm', 'Watermark']];
function Builder() {
  const [on, setOn] = useState({ email: true, wm: true });
  const flip = (k) => setOn((o) => ({ ...o, [k]: !o[k] }));
  const gates = [on.password && 'Enter the password', on.email && 'Enter the code sent to your email', on.nda && 'Accept the NDA'].filter(Boolean);
  return (
    <section className="x-sec dr-build" data-room="dark">
      <div className="x-wrap dr-build-grid">
        <div>
          <p className="x-kick">Access controls</p>
          <h2 className="dr-build-h">The same document, open to one person and shut to another</h2>
          <div className="dr-sets">
            {SETS.map(([k, t]) => (
              <button key={k} type="button" role="switch" aria-checked={!!on[k]} onClick={() => flip(k)}><i />{t}</button>
            ))}
          </div>
        </div>
        <div className="dr-viewer">
          <p className="dr-viewer-k x-mono">what they meet when they open it</p>
          <ol className="dr-gates">
            <AnimatePresence initial={false}>
              {gates.map((g, i) => <motion.li key={g} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.35, ease: EASE }}><span className="x-mono">{i + 1}</span>{g}</motion.li>)}
            </AnimatePresence>
            {!gates.length && <li className="none">Opens straight away</li>}
          </ol>
          <div className={'dr-sheet' + (on.wm ? ' wm' : '')}>
            {on.wm && <span className="dr-sheet-wm" aria-hidden="true">{Array.from({ length: 6 }).map((_, i) => <b key={i}>your email</b>)}</span>}
            <i /><i /><i /><i />
          </div>
          <p className="dr-foot x-mono">
            <span className={on.expiry ? 'on' : ''}>{on.expiry ? 'expires on the date you set' : 'no expiry'}</span>
            <span className={on.nodl ? 'on' : ''}>{on.nodl ? 'downloads off' : 'download allowed'}</span>
          </p>
        </div>
      </div>
    </section>
  );
}

const PLANS = [
  ['Free', '$0', 'Get started with document sharing and analytics.', ['Get on GitHub', 'https://github.com/hanzoai/'], ['1 team member', '50 links', '50 documents', 'Unlimited visitors', 'Community support']],
  ['Pro', '$25', 'For professionals who need branding and more capacity.', ['Contact Sales', '/contact-sales'], ['Unlimited links', '100 documents', 'Large file uploads', 'Custom branding', 'Video support', 'Folder organization']],
  ['Business', '$59', 'For teams that need custom domains and advanced access controls.', ['Contact Sales', '/contact-sales'], ['Everything in Pro', '3 team members', '1,000 documents', 'Custom domain', 'Allow/block lists', 'Screenshot protection']],
  ['Data Rooms', '$99', 'Full data room capabilities for fundraising and due diligence.', ['Contact Sales', '/contact-sales'], ['Everything in Business', 'Unlimited data rooms', 'Data room analytics', 'NDA agreements', 'Dynamic watermark', 'Granular permissions', 'Custom data room domain', '24/7 email support']],
];

function Pricing() {
  return (
    <section className="x-sec dr-price">
      <div className="x-wrap">
        <header className="dr-h">
          <h2>Simple, Transparent Pricing</h2>
          <p>Start free and scale as you grow. Self-host for free forever or let us handle the infrastructure.</p>
        </header>
        <ol className="dr-ladder">
          {PLANS.map(([t, p, d, [cta, to], li], i) => (
            <Rise as="li" key={t} className={i === 2 ? 'pop' : ''} delay={i * 0.06} y={18}>
              <div className="dr-pl-h">
                <h3>{t}{i === 2 && <span className="dr-popular">Most Popular</span>}</h3>
                <p className="dr-pl-p"><b>{p}</b><span>/mo</span></p>
              </div>
              <p className="dr-pl-d">{d}</p>
              <ul>{li.map((x) => <li key={x}>{x}</li>)}</ul>
              <A to={to} className={'x-btn sm' + (i === 2 ? ' solid' : '')}>{cta}</A>
            </Rise>
          ))}
        </ol>
        <div className="dr-oss">
          <h3>Built on Open Source</h3>
          <p>Hanzo Dataroom is built on <A to="https://www.papermark.io">Papermark</A>, the open-source DocSend alternative. We contribute back to the community and extend it with Hanzo IAM integration, multi-tenant workspaces, and enterprise features.</p>
          <div className="x-row-links tight"><More to={REPO}>hanzoai/dataroom</More><More to="https://github.com/mfts/papermark">Upstream: mfts/papermark</More></div>
        </div>
      </div>
    </section>
  );
}

function Send() {
  return (
    <section className="x-sec dr-send">
      <div className="x-wrap">
        <div className="dr-send-top">
          <h2>Upload one document and send the link</h2>
          <p>You will know whether it was read before you have to ask.</p>
        </div>
        <div className="dr-send-grid">
          {[['Start Sharing', 'Share documents with real-time analytics', 'Try Hanzo', '/login'], ['Documentation', 'Explore our guides and API references', 'View Docs', DOCS], ['For Developers', 'Integrate document sharing into your apps', 'View on GitHub', REPO]].map(([t, d, a, to], i) => (
            <Rise key={t} delay={i * 0.06}><A to={to} className="dr-send-a"><span className="x-mono">{String(i + 1).padStart(2, '0')}</span><h3>{t}</h3><p>{d}</p><b>{a} →</b></A></Rise>
          ))}
          <div className="dr-custom">
            <h3>Need a Custom Solution?</h3>
            <p>Our team can help you design a tailored data room setup for your fundraising or due diligence needs.</p>
            <A to="/contact-sales" className="x-btn sm">Contact Sales</A>
          </div>
        </div>
        <div className="dr-gs">
          <h2>Get started with Dataroom</h2>
          <div className="x-row-links tight"><More to={DOCS}>Read the docs</More><More to={REPO}>View on GitHub</More></div>
        </div>
      </div>
    </section>
  );
}

export default function Dataroom() {
  return (
    <main className="dr">
      <Hero />
      <Files />
      <Builder />
      <Pricing />
      <Send />
      <Get name="Dataroom" tag="Secure data room" license="AGPL-3.0" repo={['hanzoai/dataroom', REPO]} stars="3 stars" />
    </main>
  );
}
