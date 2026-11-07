'use client';
/* Sentinel. Signature: ten thousand events become one issue. Exceptions rain into the board and collapse into a single
   issue whose count climbs; its top frame starts minified and resolves through the source map; the breadcrumbs of what
   the person did line up under it. The six facts zigzag down the page, each with a small working picture of its own.
   Every word and link is Hanzo's; the error and its frames are made-up examples. */
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { EASE, Rise } from '../../ui';
import { Hero, Paste, Get, useLive, useEvery } from './Frame';
import './Sentinel.css';

const rnd = (i) => { const x = Math.sin(i * 51.7) * 9301.3; return x - Math.floor(x); };

function Collapse() {
  const [ref, live, calm] = useLive(0.3);
  const [n, setN] = useState(calm ? 9999 : 0);
  const [drops, setDrops] = useState(0);
  useEvery(90, live, () => { setN((v) => (v >= 9999 ? 1 : v + 37 + Math.floor(rnd(v) * 60))); setDrops((d) => d + 1); });
  const resolved = n > 2400 || calm;
  return (
    <div className="sn-board" ref={ref} aria-hidden="true">
      <div className="sn-rain">
        {Array.from({ length: 16 }).map((_, i) => <i key={i} style={{ left: 4 + rnd(i) * 92 + '%', animationDelay: -rnd(i + 7) * 1.4 + 's', animationDuration: 1 + rnd(i + 3) * 0.8 + 's' }} />)}
      </div>
      <div className="sn-issue">
        <div className="sn-issue-top">
          <span className="sn-tag">TypeError</span>
          <span className="sn-count"><b>{Math.min(n, 9999).toLocaleString('en-US')}</b> events · 1 issue</span>
        </div>
        <p className="sn-msg">Cannot read properties of undefined</p>
        <div className="sn-frame">
          <AnimatePresence mode="wait" initial={false}>
            {resolved
              ? <motion.code key="r" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>checkout/cart.ts:42 · applyDiscount()</motion.code>
              : <motion.code key="m" className="min" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -6 }}>main.3f9a.js:1:88213 · t.a()</motion.code>}
          </AnimatePresence>
          <span className={'sn-map' + (resolved ? ' on' : '')}>source map</span>
        </div>
        <ol className="sn-crumbs">
          {['navigation /cart', 'click “Apply code”', 'fetch POST /discount', 'exception'].map((c, i) => (
            <motion.li key={c} initial={false} animate={{ opacity: drops > 4 + i * 4 || calm ? 1 : 0.2, x: drops > 4 + i * 4 || calm ? 0 : -6 }} transition={{ duration: 0.4, ease: EASE }} className={i === 3 ? 'ex' : ''}><i />{c}</motion.li>
          ))}
        </ol>
        <p className="sn-first">first seen · breadcrumbs</p>
      </div>
    </div>
  );
}

function Pic({ i }) {
  if (i === 0) return <div className="sn-p0">{Array.from({ length: 24 }).map((_, k) => <i key={k} style={{ animationDelay: k * 0.08 + 's' }} />)}<b>1</b></div>;
  if (i === 1) return <div className="sn-p1">{[[0, 92], [6, 30], [10, 70], [14, 22], [40, 38], [44, 26]].map(([l, w], k) => <i key={k} className={k === 2 ? 'slow' : ''} style={{ marginLeft: l + '%', width: w + '%', animationDelay: k * 0.12 + 's' }} />)}</div>;
  if (i === 2) return <div className="sn-p2">{[99, 99, 98, 99, 91, 99].map((v, k) => <i key={k} className={v < 95 ? 'bad' : ''} style={{ height: v - 60 + '%', animationDelay: k * 0.1 + 's' }} />)}</div>;
  if (i === 3) return <div className="sn-p3">{['account', 'account', 'account'].map((a, k) => <span key={k}><i />{a} {k + 1}<em>env</em></span>)}</div>;
  if (i === 4) return <div className="sn-p4">{['Slack', 'PagerDuty', 'Opsgenie', 'Discord', 'Microsoft Teams', 'email', 'webhook', 'GitHub', 'GitLab', 'Jira', 'Bitbucket'].map((s, k) => <span key={s} style={{ animationDelay: k * 0.18 + 's' }}>{s}</span>)}</div>;
  return <div className="sn-p5"><span>Sentry</span><i>fork</i><span className="me">Sentinel</span></div>;
}

const FACTS = [
  ['One issue, not ten thousand events', 'Identical exceptions collapse into a single issue with a count and a first-seen date. Minified frontend frames are resolved through your source maps, and the breadcrumbs leading up to the throw come with it, so you read what the person did rather than guessing.'],
  ['Traces, and profiles under them', "A request that crosses four services is one trace, and the span that took the time is visible in it. Profiles go a level down to the function. Session replay shows the same failure from the browser's side."],
  ['Did this release make it worse', 'Crash-free sessions per release, so a regression shows up in the first hour of a rollout rather than in a support queue on Monday. Cron monitors catch the opposite failure — the job that stopped running and threw nothing at all.'],
  ['Which customers are hitting it', 'Events carry the identity and the environment they came from, so an issue can be read as a list of affected accounts. That turns triage from a guess about severity into a decision about who to call.'],
  ['Where the alert goes', 'New issues, regressions and spikes route to Slack, PagerDuty, Opsgenie, Discord, Microsoft Teams, email, or a webhook of your own. It can also open the ticket — GitHub, GitLab, Jira and Bitbucket are wired both ways.'],
  ['A fork, and it says so', 'Sentinel is a fork of Sentry, used under the Functional Source License with attribution kept current. Sentry is a trademark of Functional Software, Inc., and Sentinel is neither affiliated with nor endorsed by them. Naming what you forked is not the same as branding yourself with it.'],
];

export default function Sentinel() {
  return (
    <main className="sn">
      <Hero
        look="split"
        kick="sentry.hanzo.ai"
        title="Hanzo Sentinel"
        sub="Error tracking and performance monitoring"
        acts={[['Read the docs', 'https://docs.hanzo.ai/docs/guides/migrate/sentry'], ['View on GitHub', 'https://github.com/hanzoai']]}
      >
        <Collapse />
      </Hero>
      <section className="x-sec sn-zz">
        <div className="x-wrap">
          <div className="sn-zz-h"><Rise as="h2">Enough context to fix it without asking</Rise><span className="x-mono">01 / 06 — 06 / 06</span></div>
          {FACTS.map(([t, d], i) => (
            <Rise key={t} className={'sn-row' + (i % 2 ? ' r' : '')} y={26}>
              <div className="sn-pic" aria-hidden="true"><Pic i={i} /></div>
              <div className="sn-txt">
                <span className="sn-n">{String(i + 1).padStart(2, '0')} / 06</span>
                <h3>{t}</h3>
                <p>{d}</p>
              </div>
            </Rise>
          ))}
        </div>
      </section>
      <section className="x-sec sn-paste" data-room="dark">
        <div className="x-wrap">
          <Rise as="h2" className="sn-start">Get started with Hanzo Sentinel</Rise>
          <Paste dark name="Sentinel" prompt="Read https://hanzo.ai/skill.md and use Hanzo Sentinel in my project." />
        </div>
      </section>
      <Get name="Sentinel" tag="Error tracking" license="BSL-1.1" />
    </main>
  );
}
