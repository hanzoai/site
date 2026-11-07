'use client';
/* Commerce. Signature: an order, start to end, riding a rail. One order card travels five stops (product and variant,
   cart, authorize, capture, refund or return) and changes shape at each, showing the real endpoint it calls there.
   It runs by itself; tap a stop to send it there.
   Beyond: "Find an endpoint". Type what you want to do (refund, cart, affiliate…) and every group's matching
   endpoints answer at once, instead of hunting tab by tab. Built only from Hanzo's own endpoint list.
   Also: the ten nouns as a type index with a live preview, and the processor as a setting you switch.
   Every word and link is Hanzo's. */
import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { EASE, Rise } from '../../ui';
import { A, Go, More } from '../../kit';
import { Get, useLive, useSteps } from '../cloud/Frame';
import './Commerce.css';

const DOCS = 'https://docs.hanzo.ai/docs/cli/commerce';
const up = (d) => ({ initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.9, ease: EASE, delay: d } });

const STOPS = [
  ['Product and variant', 'A product holds the description; a variant holds the size, the colour and the price.', '/variant/{id}'],
  ['Cart', 'A cart is a real object with its own id, so someone can leave and come back.', '/cart/{id}'],
  ['Authorize', 'Hold the money when the order is placed.', '/checkout/authorize'],
  ['Capture', 'Take it when the box ships.', '/order/{id}/capture'],
  ['Refund or return', 'A return is a first-class object rather than a note in a support ticket.', '/return/{id}'],
];

function Glyph({ at }) {
  if (at === 0) return <div className="cm-g-var">{['size', 'colour', 'price'].map((t, i) => <motion.span key={t} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + i * 0.08 }}>{t}</motion.span>)}</div>;
  if (at === 1) return <div className="cm-g-cart"><span className="x-mono">cart</span><b className="x-mono">{'{id}'}</b><em>1 item</em></div>;
  if (at === 2) return <div className="cm-g-hold"><svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><rect x="5" y="10.5" width="14" height="10" rx="2.4" fill="none" stroke="currentColor" strokeWidth="1.7" /><path d="M8.5 10.5V7.5a3.5 3.5 0 0 1 7 0v3" fill="none" stroke="currentColor" strokeWidth="1.7" /></svg><span>held</span></div>;
  if (at === 3) return <div className="cm-g-ship"><motion.i initial={{ x: -30 }} animate={{ x: 30 }} transition={{ duration: 1.6, ease: EASE }} /><span>captured</span></div>;
  return <div className="cm-g-ret"><motion.i initial={{ rotate: 0 }} animate={{ rotate: -180 }} transition={{ duration: 0.9, ease: EASE, delay: 0.2 }} /><span>return</span></div>;
}

function Hero() {
  const [ref, live] = useLive(0.3);
  const [at, choose, mine] = useSteps(5, 3200, live);
  return (
    <section className="cm-hero" ref={ref} aria-labelledby="cm-h1">
      <div className="x-wrap">
        <div className="cm-top">
          <motion.p className="cm-kick" {...up(0)}>Headless E-commerce Platform</motion.p>
          <h1 id="cm-h1" className="cm-h1"><span className="x-line"><motion.span className="x-line-in" initial={{ y: '105%' }} animate={{ y: 0 }} transition={{ duration: 1.1, ease: EASE, delay: 0.05 }}>Hanzo Commerce</motion.span></span></h1>
          <div className="cm-top-r">
            <motion.p className="cm-lede" {...up(0.3)}>Products, carts, checkout, orders and returns behind an API, with no storefront attached.</motion.p>
            <motion.div className="cm-acts" {...up(0.42)}>
              <motion.span className="x-go" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}><A to={DOCS} className="x-btn solid" data-thumb>Read the docs</A></motion.span>
              <Go to="https://platform.hanzo.ai">API Platform</Go>
            </motion.div>
          </div>
        </div>
        <motion.div className="cm-rail-wrap" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.1, ease: EASE, delay: 0.25 }}>
          <p className="cm-rail-k"><span>An order, start to end</span><span className="x-mono">{String(at + 1).padStart(2, '0')} / 05</span></p>
          <div className="cm-stage" data-cursor="Follow">
            <motion.div className="cm-rider" animate={{ x: `${at * 100}%` }} transition={{ type: 'spring', stiffness: 90, damping: 18, mass: 0.9 }}>
              <div className="cm-card">
                <img src="/models/zen.webp" alt="" />
                <div className="cm-card-b">
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.div key={at} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8, transition: { duration: 0.15 } }} transition={{ duration: 0.35, ease: EASE }}>
                      <Glyph at={at} />
                      <p className="cm-ep x-mono">{STOPS[at][2]}</p>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
              <i className="cm-stem" />
            </motion.div>
          </div>
          <ol className="cm-rail">
            <motion.i className="cm-rail-fill" animate={{ scaleX: at / 4 }} transition={{ type: 'spring', stiffness: 90, damping: 18 }} aria-hidden="true" />
            {STOPS.map(([t, d], i) => (
              <li key={t} className={(at === i ? 'on' : '') + (i < at ? ' past' : '')}>
                <button type="button" aria-pressed={at === i} onClick={() => choose(i)}>
                  <i className="cm-dot" />
                  <b>{t}</b>
                  <span>{d}</span>
                </button>
              </li>
            ))}
          </ol>
          {!mine && <p className="x-sr">02 / 05 03 / 05 04 / 05 05 / 05</p>}
        </motion.div>
      </div>
    </section>
  );
}

const NOUNS = [
  ['Carts', 'A cart is a real object with its own id, so someone can leave and come back, and you can look at what they left in it.'],
  ['Products and variants', 'A product holds the description; a variant holds the size, the colour and the price. Stock is tracked on the variant, which is the thing people actually buy.'],
  ['Authorize and capture', 'Two steps, not one. Hold the money when the order is placed and take it when the box ships, which is what your accountant and your customer both expect.'],
  ['Coupons and discounts', 'Applied to a cart or to an invoice, and recorded as their own line. The reason a total came out lower survives the transaction.'],
  ['Prices per store', 'One catalogue can answer differently for different stores. The product does not have to be duplicated to be priced twice.'],
  ['Subscriptions', 'Plans, prices and renewals sit in the same service as the orders, so a customer who buys once and subscribes once is one customer with one history.'],
  ['Orders, refunds and returns', 'The whole life of an order, including the parts nobody demos. A return is a first-class object rather than a note in a support ticket.'],
  ['Many stores, one install', 'Stores are scoped by organisation, so an agency or a marketplace runs several without running several copies of this.'],
  ['It never sees a card', 'Card numbers are tokenized in a separate service and this one only ever holds the token. That is a smaller thing to secure, and a much smaller thing to be audited on.'],
  ['Your data, per tenant', "Each organisation's records live in its own store. Isolation is a file boundary rather than a WHERE clause somebody has to remember to write."],
];

/* The ten nouns as a type index; the one you point at (or the one the index is reading) shows in the panel. */
function Nouns() {
  const [at, choose] = useSteps(NOUNS.length, 2600, false); // the order on the rail is the page's one idle motion; nouns turn by hand
  return (
    <section className="x-sec cm-nouns">
      <div className="x-wrap">
        <header className="cm-h">
          <h2>What it keeps track of</h2>
          <p>The nouns a shop is made of, each one addressable and none of them assuming what your site looks like.</p>
        </header>
        <div className="cm-nouns-grid">
          <ol className="cm-index">
            {NOUNS.map(([t], i) => (
              <li key={t}>
                <button type="button" className={at === i ? 'on' : ''} aria-pressed={at === i} onMouseEnter={() => choose(i)} onFocus={() => choose(i)} onClick={() => choose(i)}>
                  <span className="x-mono">{String(i + 1).padStart(2, '0')}</span>{t}
                </button>
              </li>
            ))}
          </ol>
          <div className="cm-panel" aria-live="polite">
            {NOUNS.map(([t, d], i) => (
              <motion.div key={t} className="cm-panel-i" initial={false} animate={at === i ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }} transition={{ duration: 0.45, ease: EASE }} aria-hidden={at !== i}>
                <span className="cm-panel-n x-mono">{String(i + 1).padStart(2, '0')} / 10</span>
                <h3>{t}</h3>
                <p>{d}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

const EP = {
  Commerce: [
    ["/cart", "List all carts for the current session/user"],
    ["/cart/{id}", "Get details for a specific cart"],
    ["/cart/{id}/set", "Update cart items and quantities"],
    ["/cart/{id}/discard", "Remove a cart"],
    ["/checkout/capture/{id}", "Capture payment for a previously authorized checkout"],
    ["/checkout/charge", "Process a direct checkout charge"],
    ["/checkout/authorize", "Authorize payment for later capture"],
    ["/collection/{id}", "Get a specific product collection"],
    ["/collection", "List all product collections"],
    ["/coupon", "List all available coupons"],
    ["/coupon/{id}", "Get details for a specific coupon"],
    ["/discount", "List all available discounts"],
    ["/discount/{id}", "Get details for a specific discount"],
    ["/order/{id}", "Get a specific order"],
    ["/order", "List all orders"],
    ["/order/{id}/refund", "Process a refund for an order"],
    ["/order/{id}/payments", "View payment details for an order"],
    ["/order/{id}/capture", "Capture payment for a previously authorized order"],
    ["/product", "List all products"],
    ["/product/{id}", "Get a specific product"],
    ["/return/{id}", "Get details for a specific return"],
    ["/return", "List all returns"],
    ["/review", "List all product reviews"],
    ["/review/{id}", "Get a specific product review"],
    ["/store/{id}", "Get a specific store"],
    ["/store", "List all stores"],
    ["/site/{siteid}/deploy", "Deploy a site/storefront"],
    ["/store/{id}/product/{key}", "Get a specific product in a store"],
    ["/store/{id}/variant/{key}", "Get a specific variant in a store"],
    ["/variant/{id}", "Get a specific product variant"],
    ["/variant", "List all product variants"]
  ],
  Identity: [
    ["/account/login", "User authentication endpoint"],
    ["/account", "Manage user account details"],
    ["/account/create", "Create a new user account"],
    ["/user/{id}", "Get or update a specific user"],
    ["/user", "List all users (admin)"]
  ],
  Marketing: [
    ["/affiliate/{id}", "Get a specific affiliate"],
    ["/affiliate/{id}/connect", "Connect an affiliate to an account"],
    ["/affiliate", "List all affiliates"],
    ["/affiliate/{id}/transactions", "View affiliate transactions"],
    ["/referral", "List all referrals"],
    ["/referral/{id}", "Get a specific referral"],
    ["/campaign/{id}", "Get a specific marketing campaign"],
    ["/campaign", "List all marketing campaigns"],
    ["/form/{id}", "Get a specific marketing form"],
    ["/form", "List all marketing forms"],
    ["/form/{id}/submit", "Submit data to a marketing form"],
    ["/referrer/{id}", "Get a specific referrer"],
    ["/referrer/{id}/referrals", "List referrals for a specific referrer"],
    ["/referrer", "List all referrers"],
    ["/referrer/{id}/transactions", "View referrer transactions"],
    ["/submission/{id}", "Get a specific form submission"],
    ["/submission", "List all form submissions"],
    ["/subscriber/{id}", "Get a specific subscriber"],
    ["/subscriber", "List all subscribers"],
    ["/transaction/{id}", "Get a specific marketing transaction"]
  ],
  Payments: [
    ["/invoice/{id}", "Get a specific invoice"],
    ["/invoice", "List all invoices"],
    ["/payment/{id}", "Get a specific payment"],
    ["/payment", "List all payments"],
    ["/payment/{id}/refund", "Process a refund for a payment"],
    ["/plan/{id}", "Get a specific subscription plan"],
    ["/plan", "List all subscription plans"],
    ["/plan/{id}/refund", "Process a refund for a subscription plan"],
    ["/subscription/{id}", "Get a specific subscription"],
    ["/subscription", "List all subscriptions"]
  ],
  Platform: [
    ["/media", "List all media assets"],
    ["/media/{id}", "Get a specific media asset"],
    ["/organization/{id}", "Get a specific organization"],
    ["/organization", "List all organizations"],
    ["/organization/{id}/integrations", "List all integrations for an organization"],
    ["/organization/{id}/integrations/{integrationId}", "Get a specific integration"],
    ["/webhook", "List all webhooks"],
    ["/webhook/{id}", "Get a specific webhook"]
  ]
};

const GROUPS = Object.keys(EP);

function Endpoints() {
  const [tab, setTab] = useState(0);
  const [q, setQ] = useState('');
  const hits = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return null;
    return GROUPS.flatMap((g) => EP[g].filter(([p, d]) => (p + ' ' + d).toLowerCase().includes(s)).map((e) => [g, ...e]));
  }, [q]);
  return (
    <section className="x-sec cm-ep-sec" data-room="dark">
      <div className="x-wrap">
        <header className="cm-h dark">
          <h2>The endpoints</h2>
          <p>Grouped by what they are about. Every one of them is scoped to your organisation by the token you call with, so multi-tenancy is not something you implement on top.</p>
        </header>
        <Rise className="cm-api">
          <div className="cm-api-bar">
            <div className="cm-tabs" role="tablist" aria-label="Endpoint groups">
              {GROUPS.map((g, i) => (
                <button key={g} type="button" role="tab" aria-selected={!hits && tab === i} onClick={() => { setTab(i); setQ(''); }}>
                  {!hits && tab === i && <motion.span layoutId="cm-tab" className="cm-tab-bg" transition={{ type: 'spring', stiffness: 420, damping: 34 }} />}
                  <span>{g}</span><em className="x-mono">{EP[g].length}</em>
                </button>
              ))}
            </div>
            <label className="cm-find">
              <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><circle cx="7" cy="7" r="4.5" fill="none" stroke="currentColor" strokeWidth="1.5" /><path d="M10.5 10.5 14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
              <span className="x-sr">Find an endpoint</span>
              <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Find an endpoint: refund, cart…" />
            </label>
          </div>
          {hits && (
            <div className="cm-hits" aria-live="polite">
              <p className="cm-hits-k x-mono">{hits.length} across {new Set(hits.map((h) => h[0])).size} groups</p>
              {hits.length ? (
                <ul className="cm-list">
                  {hits.map(([g, p, d]) => <li key={g + p}><code>{p}</code><span>{d}</span><em className="x-mono">{g}</em></li>)}
                </ul>
              ) : <p className="cm-none">Nothing matches “{q}”. Try a noun: order, product, store.</p>}
            </div>
          )}
          {GROUPS.map((g, i) => (
            <div key={g} role="tabpanel" hidden={!!hits || tab !== i} className="cm-panel-ep">
              <h3 className="cm-ep-h">Hanzo {g} API Endpoints</h3>
              <ul className="cm-list">
                {EP[g].map(([p, d], k) => (
                  <motion.li key={p} initial={false} animate={{ opacity: 1 }} transition={{ delay: k * 0.015 }}><code>{p}</code><span>{d}</span></motion.li>
                ))}
              </ul>
            </div>
          ))}
        </Rise>
      </div>
    </section>
  );
}

const SHAPES = [
  ['A storefront you designed', 'You have a front end you like and do not want a theme system telling you how it works. This gives you the catalogue, the cart and the checkout as calls, and stays out of the rendering.'],
  ['One catalogue, several stores', 'A brand with regional shops, or an agency running stores for clients. Stores are scoped by organisation and can price the same product differently.'],
  ['Selling a subscription and a thing', 'Hardware with a plan, or a course with a membership. Orders and subscriptions are in one service, so the customer has one history rather than two accounts.'],
  ['Taking payment inside your own product', 'You are not building a shop, you are charging for what you already made. Use the checkout, the invoices and the meters, and ignore the rest.'],
];

function Shapes() {
  return (
    <section className="x-sec cm-shapes">
      <div className="x-wrap">
        <header className="cm-h">
          <h2>When to reach for it</h2>
          <p>Four shapes that fit. If none of them is yours, a hosted shop is probably the easier answer.</p>
        </header>
        <ol className="cm-shape-list">
          {SHAPES.map(([t, d], i) => (
            <li key={t}>
              <span className="cm-shape-g" aria-hidden="true">{Array.from({ length: i + 1 }).map((_, k) => <i key={k} />)}</span>
              <h3>{t}</h3>
              <p>{d}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

const INTEG = [
  ['Payment Gateways', ['Stripe', 'PayPal', 'Adyen', 'Square', 'Braintree', 'Klarna', 'Affirm', 'Apple Pay']],
  ['Marketing & CRM', ['Mailchimp', 'Klaviyo', 'HubSpot', 'Salesforce', 'Segment', 'Meta Pixel', 'Google Analytics', 'Customer.io']],
  ['Shipping & Fulfillment', ['ShipStation', 'ShipBob', 'EasyPost', 'FedEx', 'UPS', 'USPS', 'DHL', 'AfterShip']],
  ['Accounting & ERP', ['QuickBooks', 'Xero', 'NetSuite', 'SAP', 'Avalara', 'TaxJar', 'Sage', 'Microsoft Dynamics']],
];

/* The processor is a setting: pick one, the checkout line underneath does not change. */
function Money() {
  const [pick, setPick] = useState(0);
  const g = INTEG[0][1];
  return (
    <section className="x-sec cm-money">
      <div className="x-wrap cm-money-grid">
        <div className="cm-money-l">
          <h2>Who takes the money</h2>
          <p>The processor is a setting, not an architecture. Each one gets its own webhook endpoint, so adding a second — or leaving the first — is a change here rather than a change in your checkout.</p>
          <div className="cm-set">
            <h3>Payment Gateways</h3>
            <div className="cm-gw" role="radiogroup" aria-label="Payment Gateways">
              {g.map((t, i) => (
                <button key={t} type="button" role="radio" aria-checked={pick === i} onClick={() => setPick(i)}>
                  {pick === i && <motion.span layoutId="cm-gw" className="cm-gw-bg" transition={{ type: 'spring', stiffness: 420, damping: 32 }} />}
                  <span>{t}</span>
                </button>
              ))}
            </div>
            <div className="cm-cfg x-mono" aria-hidden="true">
              <p><span className="k">processor</span>: <AnimatePresence mode="popLayout" initial={false}><motion.b key={pick} initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -12, opacity: 0 }} transition={{ duration: 0.3, ease: EASE }}>'{g[pick]}'</motion.b></AnimatePresence></p>
              <p className="same"><span className="k">checkout</span>: /checkout/charge <em>unchanged</em></p>
            </div>
          </div>
        </div>
        <div className="cm-cats">
          {INTEG.slice(1).map(([t, names], i) => (
            <div key={t} className="cm-cat">
              <h3>{t}</h3>
              <ul>{names.map((n) => <li key={n}>{n}</li>)}</ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const RUN = [
  ['One Go binary', 'A single container with no queue, no cache tier and no companion services to stand up beside it. Run it locally the same way it runs in production.'],
  ['A store per organisation', "Tenants are separated by where their data lives rather than by a column, so one tenant's query cannot reach another's rows."],
  ['Outside the card boundary', 'Card numbers are tokenized by a separate service. This one is connected to that boundary without being inside it, which is the whole point of drawing one.'],
  ['Identity from Hanzo IAM', 'Sign-in, organisations and tokens come from IAM. There is no second user table here to fall out of step with the first.'],
  ['Mounts into the cloud binary', 'It runs on its own or as a subsystem inside the unified Hanzo Cloud binary. Same code, same routes, one fewer process to operate.'],
  ['Open source', 'MIT or Apache-2.0, your choice. Read how your money is handled instead of taking our word for it.'],
];

function Running() {
  return (
    <section className="x-sec cm-run">
      <div className="x-wrap cm-run-grid">
        <div className="cm-run-h">
          <h2>What you are running</h2>
          <p>Worth knowing before you put your revenue behind it.</p>
        </div>
        <dl className="cm-sheet">
          {RUN.map(([t, d], i) => (
            <Rise key={t} className="cm-sheet-row" y={14} delay={i * 0.04}>
              <dt>{t}</dt><dd>{d}</dd>
            </Rise>
          ))}
        </dl>
      </div>
    </section>
  );
}

function Sell() {
  return (
    <section className="x-sec cm-sell">
      <div className="x-wrap">
        <header className="cm-h">
          <h2>Create a product, then sell it</h2>
          <p>The whole thing runs from one container. Point your front end at it and take an order.</p>
        </header>
        <div className="cm-sell-grid">
          {[['Start Selling', 'Launch your store with our easy-to-use platform', 'Try Hanzo', '/login'], ['Documentation', 'Explore our guides and API references', 'View Docs', DOCS], ['For Developers', 'Integrate our APIs into your applications', 'API Reference', 'https://docs.hanzo.ai/docs']].map(([t, d, a, to], i) => (
            <div key={t}>
              <A to={to} className="cm-sell-a"><span className="x-mono">{String(i + 1).padStart(2, '0')}</span><h3>{t}</h3><p>{d}</p><b>{a} →</b></A>
            </div>
          ))}
        </div>
        <div className="cm-sell-foot">
          <div className="cm-custom">
            <h3>Need a Custom Solution?</h3>
            <p>Our team of experts can help you design and implement a tailored e-commerce solution for your unique business needs.</p>
            <Go to="/contact-sales">Contact Sales</Go>
          </div>
          <div className="cm-gs">
            <h2>Get started with Commerce</h2>
            <div className="x-row-links tight"><More to={DOCS}>Read the docs</More><More to="https://github.com/hanzoai">View on GitHub</More></div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Commerce() {
  return (
    <main className="cm">
      <Hero />
      <Nouns />
      <Endpoints />
      <Shapes />
      <Money />
      <Running />
      <Sell />
      <Get name="Commerce" tag="Headless commerce + AI recommendations" />
    </main>
  );
}
