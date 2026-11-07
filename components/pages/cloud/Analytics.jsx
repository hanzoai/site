'use client';
/* Analytics. Signature: a dashboard you can read without training, running. The example dashboard counts its three
   figures in, the live activity line draws itself hour by hour, and the realtime column lists who is on the site right
   now, which page and from where. The five reports are a switcher where each one draws its own picture (a live list, a
   journey tree, a funnel with its cliff, an event stream, an attribution split); the commerce board, the code, the AI
   panel (the page's dark room) and the privacy commitments follow.
   Beyond: "Ask it as a question". Pick the question you actually have (who is on the site right now, where the drop
   is, whether anyone came back…) and the report that answers it opens; each question is the report's own words.
   Every word, figure and link is Hanzo's; pages and referrers in the realtime list are examples. */
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { EASE, Rise, Count } from '../../ui';
import { A } from '../../kit';
import { Hero, Get, Code, Head, useLive, useEvery } from './Frame';
import './Analytics.css';

const HOURS = [12, 10, 8, 7, 9, 14, 22, 34, 48, 58, 64, 70, 76, 72, 80, 86, 78, 70, 62, 54, 46, 36, 26, 18];
const VISITS = [['/pricing', 'google'], ['/docs/start', 'github.com'], ['/', 'newsletter'], ['/blog/launch', 'x.com'], ['/signup', 'direct']];

function Board() {
  const [ref, live] = useLive(0.3);
  const [k, setK] = useState(0);
  useEvery(1600, live, () => setK((v) => v + 1));
  const area = 'M0 100 ' + HOURS.map((h, i) => `L${(i / 23) * 100} ${100 - h}`).join(' ') + ' L100 100 Z';
  const line = HOURS.map((h, i) => `${i ? 'L' : 'M'}${(i / 23) * 100} ${100 - h}`).join(' ');
  const rows = [0, 1, 2, 3].map((j) => VISITS[(k + j) % VISITS.length]);
  return (
    <div className="an-board" ref={ref}>
      <div className="an-bar"><i /><i /><i /><span>Hanzo Analytics Dashboard</span><em>example</em></div>
      <div className="an-kpis">
        {[['Users', 127543, 0, '', '+12.4% vs last week'], ['Conversion Rate', 4.87, 2, '%', '+0.8% vs last week'], ['Revenue', 45892, 0, '$', '+15.2% vs last week']].map(([t, v, d, u, ch]) => (
          <div key={t} className="an-kpi">
            <p>{t}</p>
            <b>{u === '$' ? <Count to={v} prefix="$" /> : <Count to={v} decimals={d} suffix={u} />}</b>
            <span>{ch}</span>
          </div>
        ))}
      </div>
      <div className="an-main">
        <div className="an-live">
          <div className="an-live-h"><p>Live User Activity</p><span>Pageviews</span><b>1,240</b><b className="dim">876</b><em>+24.5%</em></div>
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            <defs><linearGradient id="an-g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#30d158" stopOpacity=".35" /><stop offset="1" stopColor="#30d158" stopOpacity="0" /></linearGradient></defs>
            <motion.path d={area} fill="url(#an-g)" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1, duration: 0.8 }} />
            <motion.path d={line} className="an-line" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2.2, ease: EASE, delay: 0.3 }} />
          </svg>
          <div className="an-axis">{['00:00', '06:00', '12:00', '18:00', '24:00'].map((h) => <span key={h}>{h}</span>)}</div>
        </div>
        <div className="an-rt" aria-hidden="true">
          <p className="an-rt-h"><i />on the site now</p>
          <ul>
            <AnimatePresence initial={false}>
              {rows.map(([p, r], j) => <motion.li key={k + '-' + j} layout initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.35, ease: EASE }}><b>{p}</b><span>{r}</span></motion.li>)}
            </AnimatePresence>
          </ul>
        </div>
      </div>
    </div>
  );
}

const REPORTS = [
  ['Realtime', 'Who is on the site right now, which page they are on and how they got there. Useful the hour you ship something and the hour something breaks.'],
  ['Journeys', 'The route people actually took through the site, laid out as a tree. It rarely matches the one in the navigation, and that gap is the finding.'],
  ['Funnels, goals and retention', 'Define the steps and see where the drop is. Goals count the thing you care about, and retention answers the harder question of whether anyone came back.'],
  ['Events', 'Track a click or a signup with a name and a few properties. No schema to declare up front and nothing to migrate when you add one.'],
  ['Attribution and UTM', 'Which channel, campaign and referrer brought the session that converted — including the touch that started it, not only the one that closed it.'],
];

// Beyond: each question in its report's own words, and the report that answers it
const ASK = [['Who is on the site right now', 0], ['The route people actually took', 1], ['Where the drop is', 2], ['Whether anyone came back', 2], ['Track a click or a signup', 3], ['Which channel, campaign and referrer brought the session that converted', 4]];

function RepPic({ i }) {
  if (i === 0) return <div className="an-p0">{Array.from({ length: 18 }).map((_, k) => <i key={k} style={{ left: ((k * 37) % 92) + 4 + '%', top: ((k * 53) % 80) + 8 + '%', animationDelay: k * 0.05 + 's' }} />)}</div>;
  if (i === 1) return <svg className="an-p1" viewBox="0 0 200 120"><path d="M20 60 C60 60 60 25 100 25 M20 60 C60 60 60 95 100 95 M100 25 C140 25 140 15 180 15 M100 25 C140 25 140 45 180 45 M100 95 C140 95 140 95 180 95" /><circle cx="20" cy="60" r="6" /><circle cx="100" cy="25" r="6" /><circle cx="100" cy="95" r="6" /><circle cx="180" cy="15" r="5" /><circle cx="180" cy="45" r="5" /><circle cx="180" cy="95" r="5" className="hot" /></svg>;
  if (i === 2) return <div className="an-p2">{[100, 82, 76, 31, 27].map((w, k) => <span key={k}><motion.i initial={{ scaleX: 0 }} animate={{ scaleX: w / 100 }} transition={{ delay: k * 0.1, duration: 0.6, ease: EASE }} className={k === 3 ? 'cliff' : ''} /></span>)}</div>;
  if (i === 3) return <div className="an-p3">{['signup', 'click', 'signup', 'button_click'].map((e, k) => <motion.p key={k} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: k * 0.15 }}><b>{e}</b> {'{ … }'}</motion.p>)}</div>;
  return <div className="an-p4">{[['first touch', 34], ['campaign', 41], ['last touch', 25]].map(([l, w]) => <span key={l} style={{ flex: w }}><em>{l}</em></span>)}</div>;
}

function Reports() {
  const [at, choose] = useState(0); // you choose; only the dashboard above runs by itself
  const [q, setQ] = useState(-1);
  return (
    <section className="x-sec an-rep">
      <div className="x-wrap">
        <Head title="The reports" lede="Each one answers a question you would otherwise export a CSV to answer." />
        <div className="an-ask" role="group" aria-label="Ask it as a question">
          {ASK.map(([t, r], k) => <button key={t} type="button" aria-pressed={q === k} onClick={() => { setQ(k); choose(r); }}>{t}</button>)}
        </div>
        <div className="an-rep-grid">
          <ul className="an-rep-list" role="tablist" aria-label="Reports">
            {REPORTS.map(([t, d], i) => (
              <li key={t}>
                <button type="button" role="tab" aria-selected={at === i} onClick={() => { setQ(-1); choose(i); }} className={at === i ? 'on' : ''}><b>{t}</b><span>{d}</span></button>
              </li>
            ))}
          </ul>
          <div className="an-rep-pic" aria-hidden="true">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div key={at} className="an-rep-in" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, transition: { duration: 0.15 } }} transition={{ duration: 0.4, ease: EASE }}>
                <p className="an-rep-k">{REPORTS[at][0]}</p>
                <RepPic i={at} />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

const JS = `import { HanzoAnalytics } from 'hanzo-analytics';

// Initialize analytics with your project ID
const analytics = new HanzoAnalytics('YOUR_PROJECT_ID');

// Track page views automatically
analytics.trackPageViews();

// Track custom events
analytics.track('button_click', {
  buttonId: 'signup_button',
  page: '/home'
});`;

const FULL = `// Initialize Hanzo Analytics in your app
import { HanzoAnalytics } from 'hanzo-analytics';

// Configure your instance
const analytics = new HanzoAnalytics({
  projectId: 'YOUR_PROJECT_ID',
  options: {
    autoPageviews: true,
    trackClicks: true,
    debugMode: false
  }
});

// Track custom events
analytics.track('purchase_completed', {
  productId: 'prod_123',
  price: 89.99,
  currency: 'USD'
});

// Identify users
analytics.identify('user_123', {
  name: 'Jane Smith',
  email: 'jane@example.com',
  plan: 'premium'
});`;

function Numbered() {
  return (
    <div className="an-num">
      <div className="an-num-bar"><i /><i /><i /><span>analytics.js</span></div>
      <pre><code>{JS.split('\n').map((l, i) => <span key={i} className="an-ln"><em>{i + 1}</em>{l}{'\n'}</span>)}</code></pre>
    </div>
  );
}

function Apply() {
  const [done, setDone] = useState(false);
  return <button type="button" className={'x-btn sm an-apply' + (done ? ' done' : '')} aria-pressed={done} onClick={() => setDone((v) => !v)}><i aria-hidden="true">✓</i>Apply Recommendation</button>;
}

export default function Analytics() {
  const [lang, setLang] = useState('JavaScript');
  return (
    <main className="an">
      <Hero
        look="stack"
        kick="Web analytics you host yourself"
        title="Hanzo Analytics"
        lede="Traffic, sessions and revenue for the sites you run, in a dashboard you can read without training."
        acts={[['Try Hanzo', '/login'], ['Request Demo', '/contact-sales']]}
      >
        <Board />
      </Hero>
      <Reports />
      <section className="x-sec an-visit">
        <div className="x-wrap">
          <div className="an-visit-h">
            <h2>From a visit to a number</h2>
            <p>A pageview is not worth much on its own. It gets interesting once it is joined to the step someone stopped at, the campaign that sent them and the money that followed.</p>
          </div>
          <div className="an-three">
            {[['Where they stop', 'Build the funnel from steps you already track and read the drop between them. The step with the cliff is the one worth a week of work.', 'Funnels and goals'], ['Whether they return', 'Retention by the week someone arrived. Growth that comes only from new visitors looks identical to growth that lasts, until you look at this.', 'Retention and journeys'], ['What it was worth', 'Send the order value with the event and revenue shows up beside the traffic that produced it, split by channel and campaign.', 'Revenue and attribution']].map(([t, d, tag], i) => (
              <div key={t} className="an-v"><span className="an-v-n">{String(i + 1).padStart(2, '0')}</span><h3>{t}</h3><p>{d}</p><span className="an-tag">{tag}</span></div>
            ))}
          </div>
          <A to="https://docs.hanzo.ai/docs/projects/hanzoai/insights" className="x-arrow an-how"><span>Read how reports work</span><svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg></A>
        </div>
      </section>
      <section className="x-sec an-sell">
        <div className="x-wrap an-sell-grid">
          <div>
            <Head title="If you sell something" lede="Revenue is a report here, not an integration you buy on top." />
            <ul className="an-sell-list">
              {[['Revenue beside the traffic', 'Send an amount and a currency with the event and it lands in the same reports as everything else. Totals, order values and the sessions behind them.'], ['Which campaign paid for itself', 'Attribution splits revenue across the channels and campaigns that touched the session, so spend can be argued with numbers rather than instinct.'], ['The checkout, step by step', 'Cart to payment as a funnel, with the abandonment rate per step. Add a goal for the one step you would defend in a meeting.']].map(([t, d]) => <li key={t}><h3>{t}</h3><p>{d}</p></li>)}
            </ul>
          </div>
          <Rise className="an-com">
            <p className="an-com-h">Commerce Dashboard</p>
            <div className="an-com-k">
              <div><p>Sales Performance</p><b>4.78%</b><span>+0.6%</span></div>
              <div><p>Avg. Order Value</p><b>$87.32</b><span>+2.4%</span></div>
            </div>
            <p className="an-com-s">Product Recommendations</p>
            <ul>{[['Premium Headphones', 98], ['Wireless Keyboard', 85], ['Smart Watch', 79]].map(([p, v]) => <li key={p}><span>{p}</span><i><motion.b initial={{ scaleX: 0 }} whileInView={{ scaleX: v / 100 }} viewport={{ once: true }} transition={{ duration: 0.9, ease: EASE }} /></i><em>{v}</em></li>)}</ul>
          </Rise>
        </div>
      </section>
      <section className="x-sec an-oss">
        <div className="x-wrap an-oss-grid">
          <div>
            <h2>Open Source at Our Core</h2>
            <p>Hanzo Analytics is fully open-source, fostering innovation and collaboration among thousands of global developers.</p>
            <div className="an-acts"><A to="https://docs.hanzo.ai" className="x-btn solid">View Docs</A><A to="https://github.com/hanzoai" className="x-btn">View Repository</A></div>
          </div>
          <div><Numbered /></div>
        </div>
        <div className="x-wrap an-api">
          <div className="an-api-l">
            <Head title="A script, then an API" lede="The tag collects pageviews on its own. Everything past that is a function call." />
            <p className="an-sign">What you are signing up for</p>
            <ul className="an-sign-list">
              {[['Your database, your rows', 'It runs against Postgres, MySQL or MariaDB — one you already operate. The raw events stay somewhere you can query directly.'], ['Many sites, one install', 'Add a site, get a tracking id. Group people into teams, and share a board with someone who should not have an account.'], ['Open source, MIT', 'Read it, fork it, run it on a small server for as long as you like. The hosted version exists so you do not have to.']].map(([t, d]) => <li key={t}><b>{t}</b><span>{d}</span></li>)}
            </ul>
            <div className="an-links"><A to="https://docs.hanzo.ai/docs/analytics" className="x-btn">View Documentation</A><A to="https://docs.hanzo.ai/docs/openapi" className="x-btn">API Reference</A><A to="https://github.com/hanzoai/insights" className="x-btn">Example Projects</A></div>
          </div>
          <div>
            <div className="an-langs" role="tablist" aria-label="Language">
              {['JavaScript', 'Python', 'API'].map((l) => <button key={l} type="button" role="tab" aria-selected={lang === l} onClick={() => setLang(l)}>{l}</button>)}
            </div>
            {lang === 'JavaScript'
              ? <Code light title="Analytics" tabs={[{ k: 'JavaScript', code: FULL }]} />
              : <div className="an-other"><p className="an-other-k">{lang}</p><A to="https://docs.hanzo.ai/docs/openapi" className="x-btn solid">API Reference</A></div>}
            <div className="an-npm"><code>npm install hanzo-analytics</code></div>
            {/* the JavaScript sample stays in the page when another language is chosen */}
            {lang !== 'JavaScript' && <pre className="x-sr">{FULL}</pre>}
          </div>
        </div>
      </section>
      <section className="x-sec an-ai" data-room="dark">
        <div className="x-wrap an-ai-grid">
          <div>
            <Head dark title="AI-Powered Observability & Monitoring" lede="Proactively identify issues and opportunities with AI-powered insights and monitoring." />
            <ul className="an-ai-list">
              {[['Real-time anomaly detection', 'Automatically identify unusual patterns and potential issues before they impact your business.'], ['Predictive alerts and proactive monitoring', 'Get alerted about potential problems before they occur with AI-powered predictive monitoring.'], ['Deep integration with Hanzo Cloud and Base', 'Connect your analytics with your entire infrastructure for comprehensive visibility.']].map(([t, d]) => <li key={t}><b>{t}</b><span>{d}</span></li>)}
            </ul>
          </div>
          <Rise className="an-ai-panel">
            <p className="an-ai-h">AI Analysis in Action</p>
            <div className="an-anom">
              <div><b>Traffic Anomaly Detection</b><span className="an-flag">Anomaly Detected</span></div>
              <svg viewBox="0 0 100 40" preserveAspectRatio="none" aria-hidden="true"><path d="M0 30 L10 28 L20 29 L30 27 L40 28 L50 26 L58 8 L66 24 L76 27 L86 26 L100 27" /></svg>
              <p>Unusual traffic spike</p><p className="an-conf">Confidence: 98.7%</p>
            </div>
            <p className="an-ai-s">AI Insights</p>
            <ul className="an-ins">{[['Traffic Anomaly', 'Unusual spike detected at 14:32 UTC'], ['Conversion Opportunity', 'Checkout abandonment 23% higher on mobile'], ['Performance Alert', 'API latency increased by 150ms']].map(([a, b]) => <li key={a}><b>{a}</b><span>{b}</span></li>)}</ul>
            <div className="an-rec"><p className="an-ai-s">AI Recommendation</p><p>Based on the traffic pattern analysis, we recommend scaling your infrastructure in the US-West region for the next 3 hours.</p><Apply /></div>
          </Rise>
        </div>
      </section>
      <section className="x-sec an-sec">
        <div className="x-wrap">
          <Head title="Enterprise-Grade Security & Compliance" lede="Secure by design, ensuring your data meets stringent compliance standards." />
          <div className="an-sec-grid">
            <div className="an-feat"><p className="an-feat-h">Security Features</p><ul>{['End-to-end encryption', 'Data residency controls', 'Custom data retention policies', 'Role-based access control', 'Regular security audits', 'Privacy-focused data collection', 'Automated compliance monitoring'].map((f) => <li key={f}>{f}</li>)}</ul></div>
            <div className="an-assure">
              {[['Security and assurance', 'Continual internal audits', 'Report on request.'], ['Data protection', 'EU data handling, deletion, and export on request.', ''], ['Privacy by design', 'Collected because it is used, not because it can be.', '']].map(([t, a, b]) => <div key={t} className="an-as"><h3>{t}</h3><p>{a}</p>{b && <p>{b}</p>}</div>)}
              <div className="an-commit"><h3>Data Privacy Commitment</h3><p>Hanzo Analytics collects what a report uses and nothing else. You choose where the data lives, how long it is kept, and who on your team can read it, and you can export or delete it on request.</p><A to="/legal/privacy">Read our privacy policy →</A></div>
            </div>
          </div>
        </div>
      </section>
      <section className="x-sec an-com2">
        <div className="x-wrap">
          <Head title="Powered by Community, Improved by Collaboration" lede="Join thousands of developers building the future of analytics together." />
          <ul className="an-stats">{[['M+', 'Downloads'], ['K+', 'GitHub Stars'], ['', 'Contributors']].map(([a, b]) => <li key={b}><b>{a || '—'}</b><span>{b}</span></li>)}</ul>
          <div className="an-res-grid">
            <div className="an-os"><h3>Open Source</h3><p>Hanzo Analytics is fully open source, with a vibrant community of developers contributing from around the world. Join us on GitHub to collaborate on the future of analytics.</p><A to="https://github.com/hanzoai/insights" className="x-btn">GitHub Repo</A></div>
            <div>
              <h3 className="an-res-h">Resources</h3>
              <p className="an-res-p">Access comprehensive documentation, tutorials, and examples to help you make the most of Hanzo Analytics.</p>
              <div className="an-res">{[['Documentation', 'Comprehensive guides and API references', 'https://docs.hanzo.ai/docs/analytics'], ['Community Forum', 'Join discussions with developers and AI experts', 'https://discord.gg/XthHQQj'], ['Examples', 'Sample projects showcasing Hanzo Analytics', 'https://github.com/hanzoai/insights'], ['Support', 'Get help from our team and community', '/support']].map(([t, d, to]) => <A key={t} to={to} className="an-r" {...(to.startsWith('/') ? { 'data-morph': '' } : {})}><b>{t}</b><span>{d}</span></A>)}</div>
              <A to="https://docs.hanzo.ai/docs/analytics" className="x-arrow an-browse"><span>Browse All Resources</span></A>
            </div>
          </div>
        </div>
      </section>
      <section className="x-sec an-add">
        <div className="x-wrap">
          <div className="an-add-h">
            <h2>Add the script</h2>
            <p>One tag on the page and the dashboard fills in on its own. Host it yourself or let us run it — the software is the same either way.</p>
          </div>
          <div className="an-add-three">
            <div className="an-a"><h3>One tag</h3><p>Paste it into the head of your site. Pageviews start arriving before you have decided what to name anything.</p></div>
            <div className="an-a"><h3>Your data stays yours</h3><p>The events live in your own Postgres, MySQL or MariaDB. Nothing is sampled, and nothing is held back from an export.</p></div>
            <div className="an-a"><h3>Open source, MIT</h3><p>Run it on a small server for as long as you like. The hosted version is the same code with the operations taken care of.</p></div>
          </div>
          <div className="an-add-end">
            <div className="an-acts"><A to="/login" className="x-btn solid">Try Hanzo</A><A to="/contact-sales" className="x-btn">Request Demo</A></div>
            <p>No credit card required.</p>
          </div>
          <div className="an-start"><h2>Get started with Analytics</h2><div className="an-acts"><A to="https://docs.hanzo.ai/docs/projects/hanzoai/insights" className="x-btn solid">Read the docs</A><A to="https://github.com/hanzoai" className="x-btn">View on GitHub</A></div></div>
        </div>
      </section>
      <Get name="Analytics" tag="Product analytics on your data" />
      <i hidden data-thumb="Try Hanzo" data-href="/login" />
    </main>
  );
}
