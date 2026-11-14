'use client';
/* Commerce (v2, archetype A "Launch" for a headless API; Hanzo's deck only: greys and ink, MASTER §3).
   Persona: a developer with a front end of their own who needs carts, checkout, orders and returns behind an API
   Goal: follow one order through its five stops and the endpoints it calls, then open the docs
   CTA: Read the docs -> https://docs.hanzo.ai/docs/cli/commerce (solid kit Cta in the hero, with thumb, and the close; the header carries the site's ask; data-cta commerce.hero / commerce.close)
   Metric: docs_click
   Signature: MOTION-MAP `flip-board`, an orders board on the second screen. Four orders sit at different stops (product
   and variant, cart, authorize, capture, refund or return); every 2.4s one moves on and its status ("variant", "cart",
   "held", "captured", "return") and real endpoint flip tile by tile like a departure board. Tap or press Enter on a
   row to move that order yourself; the processor tile at the top re-flips when "Who takes the money" switches it;
   under the board the stop the last order reached explains itself with its endpoints. Pause button (WCAG 2.2.2),
   stops off screen, reduced motion: no auto-run, tiles change at once, rows still work.
   Beyond: "Find an endpoint". Type what you want to do (refund, cart, affiliate…) and every group's matching endpoints
   answer at once, in five columns, instead of hunting tab by tab. Built only from Hanzo's own endpoint list.
   Motion: the flip board (time + input, signature) + the order riding the hero rail (idle; first move at 700ms) + the
   ten nouns as a type index of cards that open into their endpoints (state, BizOpen) + the h1 cut into its line (the
   only reveal); the processor switch glides (state), the endpoints answer as you type (time), the spec sheet opens a
   row at a time and lights its part of the install drawing (state). No pinned or scroll-scrubbed scene. Tweens only.
   Entrances (./commerce/Entrances.js, once each, in the map's order): scroll-tilt = the board, word-shuffle = Who takes
   the money, ripple = the black finder, cover-slide = What it keeps track of, vertical-ticker = What you are running.
   Every word and link is Hanzo's; each endpoint list sits inside an open card or a sheet.
V2: 8/10 flip-board: an orders board whose statuses and endpoints flip tile by tile (auto, tap, processor switch) replaces the pinned journey; five entrances; sections reordered
*/
import type React from 'react';
import { cloneElement, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Flap from './commerce/Flap';
import { useEnter } from './commerce/Entrances';
import { EASE_OUT_EXPO as EASE, type Bezier } from '../../../lib/motion';
import { A, More, Cta } from '../../kit';
import { useLive } from '../cloud/Frame';
import BizLines from '../../v2/BizLines';
import BizSheet from '../../v2/BizSheet';
import BizOpen from '../../v2/BizOpen';
import './Commerce.css';

const DOCS = 'https://docs.hanzo.ai/docs/cli/commerce';
const GH = 'https://github.com/hanzoai';
const DEPLOY = 'https://platform.hanzo.ai/deploy';
const two = (n: number) => String(n).padStart(2, '0');

const STOPS: [string, string, string][] = [
  ['Product and variant', 'A product holds the description; a variant holds the size, the colour and the price.', '/variant/{id}'],
  ['Cart', 'A cart is a real object with its own id, so someone can leave and come back.', '/cart/{id}'],
  ['Authorize', 'Hold the money when the order is placed.', '/checkout/authorize'],
  ['Capture', 'Take it when the box ships.', '/order/{id}/capture'],
  ['Refund or return', 'A return is a first-class object rather than a note in a support ticket.', '/return/{id}'],
];

/* an endpoint: path, what it does */
type Endpoint = [string, string];
const EP: Record<string, Endpoint[]> = {
  Commerce: [
    ['/cart', 'List all carts for the current session/user'],
    ['/cart/{id}', 'Get details for a specific cart'],
    ['/cart/{id}/set', 'Update cart items and quantities'],
    ['/cart/{id}/discard', 'Remove a cart'],
    ['/checkout/capture/{id}', 'Capture payment for a previously authorized checkout'],
    ['/checkout/charge', 'Process a direct checkout charge'],
    ['/checkout/authorize', 'Authorize payment for later capture'],
    ['/collection/{id}', 'Get a specific product collection'],
    ['/collection', 'List all product collections'],
    ['/coupon', 'List all available coupons'],
    ['/coupon/{id}', 'Get details for a specific coupon'],
    ['/discount', 'List all available discounts'],
    ['/discount/{id}', 'Get details for a specific discount'],
    ['/order/{id}', 'Get a specific order'],
    ['/order', 'List all orders'],
    ['/order/{id}/refund', 'Process a refund for an order'],
    ['/order/{id}/payments', 'View payment details for an order'],
    ['/order/{id}/capture', 'Capture payment for a previously authorized order'],
    ['/product', 'List all products'],
    ['/product/{id}', 'Get a specific product'],
    ['/return/{id}', 'Get details for a specific return'],
    ['/return', 'List all returns'],
    ['/review', 'List all product reviews'],
    ['/review/{id}', 'Get a specific product review'],
    ['/store/{id}', 'Get a specific store'],
    ['/store', 'List all stores'],
    ['/site/{siteid}/deploy', 'Deploy a site/storefront'],
    ['/store/{id}/product/{key}', 'Get a specific product in a store'],
    ['/store/{id}/variant/{key}', 'Get a specific variant in a store'],
    ['/variant/{id}', 'Get a specific product variant'],
    ['/variant', 'List all product variants'],
  ],
  Identity: [
    ['/account/login', 'User authentication endpoint'],
    ['/account', 'Manage user account details'],
    ['/account/create', 'Create a new user account'],
    ['/user/{id}', 'Get or update a specific user'],
    ['/user', 'List all users (admin)'],
  ],
  Marketing: [
    ['/affiliate/{id}', 'Get a specific affiliate'],
    ['/affiliate/{id}/connect', 'Connect an affiliate to an account'],
    ['/affiliate', 'List all affiliates'],
    ['/affiliate/{id}/transactions', 'View affiliate transactions'],
    ['/referral', 'List all referrals'],
    ['/referral/{id}', 'Get a specific referral'],
    ['/campaign/{id}', 'Get a specific marketing campaign'],
    ['/campaign', 'List all marketing campaigns'],
    ['/form/{id}', 'Get a specific marketing form'],
    ['/form', 'List all marketing forms'],
    ['/form/{id}/submit', 'Submit data to a marketing form'],
    ['/referrer/{id}', 'Get a specific referrer'],
    ['/referrer/{id}/referrals', 'List referrals for a specific referrer'],
    ['/referrer', 'List all referrers'],
    ['/referrer/{id}/transactions', 'View referrer transactions'],
    ['/submission/{id}', 'Get a specific form submission'],
    ['/submission', 'List all form submissions'],
    ['/subscriber/{id}', 'Get a specific subscriber'],
    ['/subscriber', 'List all subscribers'],
    ['/transaction/{id}', 'Get a specific marketing transaction'],
  ],
  Payments: [
    ['/invoice/{id}', 'Get a specific invoice'],
    ['/invoice', 'List all invoices'],
    ['/payment/{id}', 'Get a specific payment'],
    ['/payment', 'List all payments'],
    ['/payment/{id}/refund', 'Process a refund for a payment'],
    ['/plan/{id}', 'Get a specific subscription plan'],
    ['/plan', 'List all subscription plans'],
    ['/plan/{id}/refund', 'Process a refund for a subscription plan'],
    ['/subscription/{id}', 'Get a specific subscription'],
    ['/subscription', 'List all subscriptions'],
  ],
  Platform: [
    ['/media', 'List all media assets'],
    ['/media/{id}', 'Get a specific media asset'],
    ['/organization/{id}', 'Get a specific organization'],
    ['/organization', 'List all organizations'],
    ['/organization/{id}/integrations', 'List all integrations for an organization'],
    ['/organization/{id}/integrations/{integrationId}', 'Get a specific integration'],
    ['/webhook', 'List all webhooks'],
    ['/webhook/{id}', 'Get a specific webhook'],
  ],
};
const GROUPS = Object.keys(EP);
/* an endpoint with the group it belongs to: group, path, what it does */
type Found = [string, string, string];
const FIND: Record<string, Found> = Object.fromEntries(GROUPS.flatMap((g) => EP[g].map(([p, d]): [string, Found] => [p, [g, p, d]])));
const eps = (paths: string[]) => paths.map((p) => FIND[p]);
/* a path may only break after a slash, never inside a word ("/order/{id}/capture") */
const brk = (s: string, k = '') => s.split(/(?<=\/)/).flatMap((x, i) => (i ? [<wbr key={k + 'w' + i} />, x] : [x]));
// an endpoint is one run of text (copy checks read it whole); CSS lets it wrap anywhere on narrow screens
const P = ({ p }: { p: string }) => <span>{p}</span>;

/* What the order card shows at each stop: the shape changes, the endpoint is the real one. */
const Lock = () => <svg viewBox="0 0 24 24" width="1.4em" height="1.4em" aria-hidden="true"><rect x="5" y="10.5" width="14" height="10" rx="2.4" fill="none" stroke="currentColor" strokeWidth="1.7" /><path d="M8.5 10.5V7.5a3.5 3.5 0 0 1 7 0v3" fill="none" stroke="currentColor" strokeWidth="1.7" /></svg>;
const Box = () => <svg viewBox="0 0 24 24" width="1.4em" height="1.4em" aria-hidden="true"><path d="M3.5 7.5 12 3l8.5 4.5v9L12 21l-8.5-4.5z M3.5 7.5 12 12l8.5-4.5 M12 12v9" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" /></svg>;
const Back = () => <svg viewBox="0 0 24 24" width="1.4em" height="1.4em" aria-hidden="true"><path d="M9 6 4 11l5 5 M4.5 11H14a5.5 5.5 0 0 1 0 11h-2" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>;
interface GlyphProps {
  at: number;
}
function Glyph({ at }: GlyphProps) {
  if (at === 0) return <div className="cm-g-var">{['size', 'colour', 'price'].map((t) => <span key={t}>{t}</span>)}</div>;
  if (at === 1) return <div className="cm-g-cart"><span className="x-mono">cart</span><b className="x-mono">{'{id}'}</b></div>;
  if (at === 2) return <div className="cm-g-st"><Lock /><span>held</span></div>;
  if (at === 3) return <div className="cm-g-st"><Box /><span>captured</span></div>;
  return <div className="cm-g-st"><Back /><span>return</span></div>;
}
interface OrderProps {
  at: number;
}
function Order({ at }: OrderProps) {
  return (
    <div className={'cm-order s' + at}>
      <img src="/models/zen.webp" alt="" width="104" height="104" />
      <div className="cm-order-b">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={at} className="cm-order-s" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8, transition: { duration: 0.15 } }} transition={{ duration: 0.35, ease: EASE }}>
            <Glyph at={at} />
            <code className="cm-ep"><P p={STOPS[at][2]} /></code>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

interface PauseIconProps {
  on: boolean;
}
const PauseIcon = ({ on }: PauseIconProps) => (on
  ? <svg viewBox="0 0 12 12" width="12" height="12" aria-hidden="true"><path d="M3 1.5v9l7.5-4.5z" fill="currentColor" /></svg>
  : <svg viewBox="0 0 12 12" width="12" height="12" aria-hidden="true"><path d="M3 1.5h2v9H3zM7 1.5h2v9H7z" fill="currentColor" /></svg>);

/* The signature: the order rides the rail by itself while it is on screen. */
function Rail() {
  const [ref, live, calm] = useLive<HTMLDivElement>(0.3);
  const [at, setAt] = useState(0);
  const [held, setHeld] = useState(false);
  const [paused, setPaused] = useState(false);
  const first = useRef(true);
  useEffect(() => {
    if (!live || paused) return;
    /* the first move comes at 700ms so the screen is alive within a second; then a stop every 3.2s */
    const wait = held ? 9000 : first.current ? 700 : 3200;
    const t = setTimeout(() => { first.current = false; if (held) setHeld(false); else setAt((a) => (a + 1) % 5); }, wait);
    return () => clearTimeout(t);
  }, [at, live, held, paused]);
  const glide: { duration: number; ease: Bezier } = { duration: 0.5, ease: [0.4, 0, 0.2, 1] };
  return (
    <div className="cm-band" ref={ref}>
      <div className="bz-wrap cm-band-in">
        <div className="cm-band-k">
          <p className="x-mono"><span>An order, start to end</span><span className="cm-band-n">{two(at + 1)} / 05</span></p>
          {!calm && <button type="button" className="cm-pause" onClick={() => setPaused(!paused)} aria-pressed={paused} aria-label={paused ? 'Play' : 'Pause'}><PauseIcon on={paused} /></button>}
        </div>
        <div className="cm-track">
          {/* the card rides a lane one card narrower than the rail, so it starts on the gutter and ends on it;
              the tick is its own piece and always stands over the active stop */}
          <div className="cm-ride">
            <div className="cm-lane">
              <motion.div className="cm-rider" initial={false} animate={{ x: `${at * 25}%` }} transition={glide}>
                <Order at={at} />
              </motion.div>
            </div>
            <motion.i className="cm-stem" aria-hidden="true" initial={false} animate={{ x: `${at * 100}%` }} transition={glide} />
          </div>
          <ol className="cm-stops">
            <li className="cm-line" aria-hidden="true"><motion.b initial={false} animate={{ scaleX: at / 4 }} transition={glide} /></li>
            {STOPS.map(([t], i) => (
              <li key={t} className={(at === i ? 'on' : '') + (i < at ? ' past' : '')}>
                <button type="button" aria-pressed={at === i} onClick={() => { setAt(i); setHeld(true); }}>
                  <i className="cm-dot" aria-hidden="true" />
                  <span className="x-mono">{two(i + 1)}</span>
                  <b>{t}</b>
                </button>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}

function Hero() {
  return (
    <section className="cm-hero" aria-labelledby="cm-h1">
      <div className="bz-wrap bz-grid cm-head">
        <BizLines as="h1" id="cm-h1" className="bz-display cm-h1" lines={['Hanzo Commerce']} now />
        <div className="cm-intro">
          <p className="cm-kind x-mono">Headless E-commerce Platform</p>
          <p className="bz-lede">Products, carts, checkout, orders and returns behind an API, with no storefront attached.</p>
          <div className="cm-acts">
            <Cta to={DOCS} id="commerce.hero" thumb>Read the docs</Cta>
            <Cta kind="link" to="https://platform.hanzo.ai" id="commerce.platform">API Platform</Cta>
          </div>
        </div>
      </div>
      <Rail />
    </section>
  );
}

/* Each stop's endpoints, shown under the board for the stop the last order reached. */
const STOP_EP = [
  ['/product/{id}', '/variant/{id}', '/store/{id}/variant/{key}'],
  ['/cart/{id}', '/cart/{id}/set', '/cart/{id}/discard'],
  ['/checkout/authorize', '/checkout/charge'],
  ['/order/{id}/capture', '/checkout/capture/{id}'],
  ['/order/{id}/refund', '/return/{id}', '/return'],
];

/* The signature, MOTION-MAP `flip-board`: an orders board. Four orders sit at different stops; every 2.4s one of
   them moves on and its status and endpoint flip, tile by tile, like a departure board. Tap a row to move that order
   yourself. The processor at the top re-flips when "Who takes the money" switches it. Under the board, the stop the
   last order reached explains itself with its endpoints. Flips are page-local (./commerce/Flap). */
const STATUS = ['variant', 'cart', 'held', 'captured', 'return'];
const Arrow = () => <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>;

interface BoardProps {
  proc: string;
}
function Board({ proc }: BoardProps) {
  const [ref, live, calm] = useLive<HTMLElement>(0.3);
  const tilt = useEnter<HTMLDivElement>('tilt');
  const [rows, setRows] = useState([0, 1, 2, 3]);
  const [last, setLast] = useState(2);
  const [paused, setPaused] = useState(false);
  const [held, setHeld] = useState(false);
  const move = (r: number) => { setRows((o) => o.map((s, j) => (j === r ? (s + 1) % 5 : s))); setLast(r); };
  useEffect(() => {
    if (!live || paused) return;
    const t = setTimeout(() => { if (held) setHeld(false); else move((last + 1) % 4); }, held ? 6000 : 2400);
    return () => clearTimeout(t);
  }, [live, paused, held, last, rows]);
  const cur = rows[last];
  return (
    <section ref={ref} className="bz-sec cm-bd-sec" aria-labelledby="cm-jr-h">
      <div className="bz-wrap cm-bd-wrap" ref={tilt}>
        <div className="cm-bd-top">
          <h2 id="cm-jr-h" className="bz-headline">An order, start to end</h2>
          <div className="cm-bd-k">
            <p className="cm-proc"><span className="x-mono">processor</span><Flap text={proc} len={9} calm={calm} /></p>
            {!calm && <button type="button" className="cm-pause" onClick={() => setPaused(!paused)} aria-pressed={paused} aria-label={paused ? 'Play' : 'Pause'}><PauseIcon on={paused} /></button>}
          </div>
        </div>
        <div className="cm-board">
          {rows.map((s, r) => (
            <button key={r} type="button" className={'cm-bd-row' + (last === r ? ' on' : '')} onClick={() => { move(r); setHeld(true); }}>
              <span className="cm-bd-t"><span className="x-mono">{two(s + 1)} / 05</span><b>{STOPS[s][0]}</b></span>
              <Flap text={STATUS[s]} len={8} calm={calm} className="cm-bd-st" />
              <Flap text={STOPS[s][2]} len={19} calm={calm} className="cm-bd-ep" />
              <span className="cm-bd-go"><Arrow /></span>
            </button>
          ))}
        </div>
        <div className="cm-bd-detail">
          {STOPS.map(([t, d], i) => (
            <div key={t} className="cm-bd-d" hidden={i !== cur}>
              <div className="cm-bd-dl">
                <p className="bz-fig cm-jr-n">{two(i + 1)}</p>
                <div><p className="bz-title">{t}</p><p className="bz-body">{d}</p></div>
              </div>
              <ul className="cm-pane-ep">
                {eps(STOP_EP[i]).map(([, p, desc]) => <li key={p}><code><P p={p} /></code><span>{desc}</span></li>)}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const NOUNS: [string, string, string[]][] = [
  ['Carts', 'A cart is a real object with its own id, so someone can leave and come back, and you can look at what they left in it.', ['/cart', '/cart/{id}', '/cart/{id}/set', '/cart/{id}/discard']],
  ['Products and variants', 'A product holds the description; a variant holds the size, the colour and the price. Stock is tracked on the variant, which is the thing people actually buy.', ['/product', '/product/{id}', '/variant', '/variant/{id}', '/collection', '/collection/{id}', '/review', '/review/{id}']],
  ['Authorize and capture', 'Two steps, not one. Hold the money when the order is placed and take it when the box ships, which is what your accountant and your customer both expect.', ['/checkout/authorize', '/checkout/capture/{id}', '/checkout/charge', '/order/{id}/capture']],
  ['Coupons and discounts', 'Applied to a cart or to an invoice, and recorded as their own line. The reason a total came out lower survives the transaction.', ['/coupon', '/coupon/{id}', '/discount', '/discount/{id}']],
  ['Prices per store', 'One catalogue can answer differently for different stores. The product does not have to be duplicated to be priced twice.', ['/store', '/store/{id}', '/store/{id}/product/{key}', '/store/{id}/variant/{key}']],
  ['Subscriptions', 'Plans, prices and renewals sit in the same service as the orders, so a customer who buys once and subscribes once is one customer with one history.', ['/plan', '/plan/{id}', '/subscription', '/subscription/{id}', '/plan/{id}/refund']],
  ['Orders, refunds and returns', 'The whole life of an order, including the parts nobody demos. A return is a first-class object rather than a note in a support ticket.', ['/order', '/order/{id}', '/order/{id}/payments', '/order/{id}/refund', '/return', '/return/{id}']],
  ['Many stores, one install', 'Stores are scoped by organisation, so an agency or a marketplace runs several without running several copies of this.', ['/organization', '/organization/{id}', '/store', '/site/{siteid}/deploy']],
  ['It never sees a card', 'Card numbers are tokenized in a separate service and this one only ever holds the token. That is a smaller thing to secure, and a much smaller thing to be audited on.', ['/payment', '/payment/{id}', '/payment/{id}/refund', '/invoice/{id}']],
  ['Your data, per tenant', "Each organisation's records live in its own store. Isolation is a file boundary rather than a WHERE clause somebody has to remember to write.", ['/organization/{id}', '/organization/{id}/integrations', '/user/{id}', '/account']],
];

const EpList = ({ list, group }: { list: Found[]; group?: boolean }) => (
  <ul className="cm-eps">
    {/* the group is named once where a run of it starts, not on every row */}
    {list.map(([g, p, d], i) => <li key={g + p}><code><P p={p} /></code><span>{d}</span>{group && <em className="x-mono">{i && list[i - 1][0] === g ? '' : g}</em>}</li>)}
  </ul>
);

/* The ten nouns as a type index: point at one and its detail previews; open it and it becomes its endpoints. */
function Nouns() {
  const [pv, setPv] = useState(0);
  const over = (e: React.SyntheticEvent<HTMLDivElement>) => { const li = (e.target as Element).closest?.('li'); if (li?.parentElement?.classList.contains('cm-index')) setPv([...li.parentElement.children].indexOf(li)); };
  const [t, d, p] = NOUNS[pv];
  return (
    <section ref={useEnter('cover')} className="bz-sec cm-nouns" aria-labelledby="cm-nouns-h">
      <div className="bz-wrap bz-grid">
        <div className="cm-nouns-l">
          <h2 id="cm-nouns-h" className="bz-headline">What it keeps track of</h2>
          <p className="bz-body">The nouns a shop is made of, each one addressable and none of them assuming what your site looks like.</p>
          <div className="cm-pv" aria-hidden="true">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div key={pv} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, transition: { duration: 0.12 } }} transition={{ duration: 0.35, ease: EASE }}>
                <p className="cm-pv-k x-mono"><span>{two(pv + 1)} / 10</span><span>{t}</span></p>
                <p className="cm-pv-d">{d}</p>
                <p className="cm-pv-ep">{p.slice(0, 4).map((x) => <code key={x}>{x}</code>)}{p.length > 4 && <code>+{p.length - 4}</code>}</p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
        <div className="cm-nouns-r" onMouseOver={over} onFocus={over}>
          <BizOpen
            label="What it keeps track of"
            className="cm-index"
            cardClass="cm-row"
            items={NOUNS.map(([nt, nd, np], i) => ({
              id: 'noun' + i,
              label: nt,
              className: pv === i ? 'pv' : '',
              card: <><span className="cm-row-n x-mono">{two(i + 1)}</span><span className="cm-row-t">{nt}</span><span className="cm-row-c x-mono">{np.length}</span></>,
              panel: (
                <div className="cm-np">
                  <h3 className="bz-headline">{nt}</h3>
                  <p className="cm-np-k x-mono">{two(i + 1)} / 10</p>
                  <p className="bz-lede">{nd}</p>
                  <EpList list={eps(np)} group />
                </div>
              ),
            }))}
          />
        </div>
      </div>
    </section>
  );
}

/* Beyond, the one dark room: type, and every group's matching endpoints answer at once. */
function Mark({ text, q }: { text: string; q: string }) {
  const i = q ? text.toLowerCase().indexOf(q) : -1;
  if (i < 0) return brk(text);
  return <>{brk(text.slice(0, i), 'a')}<mark>{brk(text.slice(i, i + q.length), 'b')}</mark>{brk(text.slice(i + q.length), 'c')}</>;
}
const TRY = ['refund', 'cart', 'affiliate', 'store'];

function Find() {
  const [q, setQ] = useState('refund');
  const s = q.trim().toLowerCase();
  const res = GROUPS.map((g): [string, Endpoint[]] => [g, s ? EP[g].filter(([p, d]) => (p + ' ' + d).toLowerCase().includes(s)) : EP[g]]);
  const n = res.reduce((a, [, l]) => a + l.length, 0);
  return (
    <section ref={useEnter('ripple')} className="bz-sec cm-find" data-room="dark" aria-labelledby="cm-find-h">
      <div className="bz-wrap">
        <div className="bz-grid cm-find-top">
          <h2 id="cm-find-h" className="bz-headline">The endpoints</h2>
          <p className="bz-body">Grouped by what they are about. Every one of them is scoped to your organisation by the token you call with, so multi-tenancy is not something you implement on top.</p>
        </div>
        <div className="cm-q">
          <svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="7" cy="7" r="4.5" fill="none" stroke="currentColor" strokeWidth="1.3" /><path d="M10.5 10.5 14 14" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /></svg>
          <label htmlFor="cm-q-in" className="x-sr">Find an endpoint</label>
          <input id="cm-q-in" type="search" value={q} onChange={(e) => setQ(e.target.value.slice(0, 40))} placeholder="Find an endpoint: refund, cart…" autoComplete="off" spellCheck={false} />
          {q && <button type="button" className="cm-q-x" aria-label="Clear" onClick={() => setQ('')}><svg viewBox="0 0 14 14" width="14" height="14" aria-hidden="true"><path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg></button>}
        </div>
        <div className="cm-q-row">
          <div className="cm-q-try">{TRY.map((w) => <button key={w} type="button" className="x-mono" aria-pressed={s === w} onClick={() => setQ(w)}>{w}</button>)}</div>
          <p className="cm-q-k x-mono" aria-live="polite">{s ? `${n} across ${res.filter(([, l]) => l.length).length} groups` : ''}</p>
        </div>
        <div className="cm-groups">
          {res.map(([g, l]) => (
            <div key={g} className={'cm-grp' + (s && !l.length ? ' none' : '')}>
              <div className="cm-grp-h">
                <b className="bz-fig">{l.length}</b>
                <BizSheet label={g} title={`Hanzo ${g} API Endpoints`} btnClass="cm-grp-btn">
                  <EpList list={EP[g].map(([p, d]): Found => [g, p, d])} />
                </BizSheet>
              </div>
              {s && l.length > 0 && (
                <ul className="cm-hits">
                  {l.map(([p, d]) => <li key={p}><code><Mark text={p} q={s} /></code><span><Mark text={d} q={s} /></span></li>)}
                </ul>
              )}
              {s && !l.length && <p className="cm-hits-none" aria-hidden="true">—</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const INTEG: [string, string[]][] = [
  ['Payment Gateways', ['Stripe', 'PayPal', 'Adyen', 'Square', 'Braintree', 'Klarna', 'Affirm', 'Apple Pay']],
  ['Marketing & CRM', ['Mailchimp', 'Klaviyo', 'HubSpot', 'Salesforce', 'Segment', 'Meta Pixel', 'Google Analytics', 'Customer.io']],
  ['Shipping & Fulfillment', ['ShipStation', 'ShipBob', 'EasyPost', 'FedEx', 'UPS', 'USPS', 'DHL', 'AfterShip']],
  ['Accounting & ERP', ['QuickBooks', 'Xero', 'NetSuite', 'SAP', 'Avalara', 'TaxJar', 'Sage', 'Microsoft Dynamics']],
];

/* The processor is a setting: switch it, and the checkout call underneath does not change. */
interface MoneyProps {
  pick: number;
  setPick: React.Dispatch<React.SetStateAction<number>>;
}
function Money({ pick, setPick }: MoneyProps) {
  const g = INTEG[0][1];
  const key = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const d = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 0;
    if (!d) return;
    e.preventDefault();
    const n = (pick + d + g.length) % g.length;
    setPick(n);
    e.currentTarget.querySelectorAll('button')[n]?.focus();
  };
  return (
    <section ref={useEnter('shuffle')} className="bz-sec cm-money" aria-labelledby="cm-money-h">
      <div className="bz-wrap bz-grid">
        <div className="cm-money-l">
          {/* word-shuffle: each word starts where another one ends up, then swaps into place */}
          <h2 id="cm-money-h" className="bz-headline cm-shuf">{([['Who', 2], ['takes', 3], ['the', 0], ['money', 1]] as const).map(([w, to], i) => <span key={w} style={{ '--dx': (to - i) * 2.6 + 'em', '--i': i }}>{w}{i < 3 ? ' ' : ''}</span>)}</h2>
          <p className="bz-body">The processor is a setting, not an architecture. Each one gets its own webhook endpoint, so adding a second — or leaving the first — is a change here rather than a change in your checkout.</p>
        </div>
        <div className="cm-set bz-obj">
          <h3 className="cm-set-h x-mono">Payment Gateways</h3>
          <div className="cm-gw" role="radiogroup" aria-label="Payment Gateways" onKeyDown={key}>
            {g.map((t, i) => (
              <button key={t} type="button" role="radio" aria-checked={pick === i} tabIndex={pick === i ? 0 : -1} onClick={() => setPick(i)}>
                {pick === i && <motion.span layoutId="cm-gw" className="cm-gw-bg" transition={{ duration: 0.3, ease: EASE }} />}
                <span>{t}</span>
              </button>
            ))}
          </div>
          <div className="cm-cfg x-mono" aria-hidden="true">
            <p><span>processor</span><b className="cm-cfg-v"><AnimatePresence mode="popLayout" initial={false}><motion.i key={pick} initial={{ y: 14, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -14, opacity: 0 }} transition={{ duration: 0.3, ease: EASE }}>&apos;{g[pick]}&apos;</motion.i></AnimatePresence></b></p>
            <p><span>checkout</span><b>/checkout/charge</b><em>unchanged</em></p>
          </div>
        </div>
        <div className="cm-cats">
          {INTEG.slice(1).map(([t, names]) => (
            <div key={t} className="cm-cat">
              <h3 className="cm-cat-h x-mono">{t}</h3>
              <ul>{names.map((x) => <li key={x}>{x}</li>)}</ul>
            </div>
          ))}
        </div>
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
/* line drawings, one per shape */
const SHAPE_ART = [
  <svg key="0" viewBox="0 0 240 150" aria-hidden="true"><rect x="20" y="14" width="200" height="122" rx="12" /><path d="M20 38h200" /><circle cx="36" cy="26" r="3" /><circle cx="48" cy="26" r="3" /><rect x="38" y="54" width="70" height="64" rx="8" className="f" /><path d="M126 60h76M126 76h56M126 92h66" /><rect x="126" y="104" width="44" height="14" rx="7" /></svg>,
  <svg key="1" viewBox="0 0 240 150" aria-hidden="true"><rect x="96" y="14" width="48" height="40" rx="8" className="f" /><path d="M120 54v22M48 76h144M48 76v14M120 76v14M192 76v14" /><rect x="24" y="90" width="48" height="40" rx="8" /><rect x="96" y="90" width="48" height="40" rx="8" /><rect x="168" y="90" width="48" height="40" rx="8" /></svg>,
  <svg key="2" viewBox="0 0 240 150" aria-hidden="true"><path d="M40 52 78 34l38 18v42l-38 18-38-18z M40 52l38 18 38-18 M78 70v42" /><circle cx="172" cy="74" r="38" /><path d="M172 46v28l18 12" /><path d="M210 66l-2 10-9-5" /></svg>,
  <svg key="3" viewBox="0 0 240 150" aria-hidden="true"><rect x="20" y="14" width="200" height="122" rx="12" /><path d="M20 38h200M40 58h100M40 74h80M40 90h90" /><rect x="150" y="96" width="56" height="26" rx="13" className="f" /></svg>,
];

function Shapes() {
  return (
    <section className="bz-sec cm-shapes" aria-labelledby="cm-shapes-h">
      <div className="bz-wrap">
        <div className="bz-grid cm-shapes-top">
          <h2 id="cm-shapes-h" className="bz-headline">When to reach for it</h2>
          <p className="bz-lede">Four shapes that fit. If none of them is yours, a hosted shop is probably the easier answer.</p>
        </div>
        <ol className="cm-tiles">
          {SHAPES.map(([t, d], i) => (
            <li key={t} className={'cm-tile t' + i}>
              <div className="cm-tile-art">{SHAPE_ART[i]}</div>
              <h3 className="bz-title">{t}</h3>
              <p>{d}</p>
            </li>
          ))}
        </ol>
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

/* What you are running: one drawing of the install beside a spec sheet that opens one row at a time. The row you
   open lights its part of the drawing: the container, the stores inside it, the card boundary outside it, IAM, the
   cloud binary around it, the open source. */
const RUN_ART = [
  <rect key="0" x="70" y="40" width="120" height="96" rx="12" />,
  <g key="1"><rect x="86" y="84" width="24" height="36" rx="5" /><rect x="118" y="84" width="24" height="36" rx="5" /><rect x="150" y="84" width="24" height="36" rx="5" /></g>,
  <g key="2"><rect x="214" y="58" width="74" height="60" rx="10" strokeDasharray="5 5" /><path d="M190 88h24" /><rect x="232" y="78" width="38" height="20" rx="4" /></g>,
  <g key="3"><circle cx="34" cy="62" r="13" /><path d="M14 104a20 20 0 0 1 40 0" /><path d="M54 76h16" /></g>,
  <rect key="4" x="60" y="14" width="140" height="138" rx="18" strokeDasharray="2 6" />,
  <path key="5" d="M108 54l-12 10 12 10 M152 54l12 10-12 10 M136 50l-12 28" />,
];

function Running() {
  const [open, setOpen] = useState(0);
  return (
    <section ref={useEnter('ticker')} className="bz-sec cm-run" aria-labelledby="cm-run-h">
      <div className="bz-wrap bz-grid">
        <div className="cm-run-h">
          <h2 id="cm-run-h" className="bz-headline">What you are running</h2>
          <p className="bz-body">Worth knowing before you put your revenue behind it.</p>
          <div className="cm-run-art" aria-hidden="true">
            <svg viewBox="0 0 300 166">{RUN_ART.map((el, i) => cloneElement(el, { className: open === i ? 'on' : undefined }))}</svg>
            <p className="x-mono"><span>{two(open + 1)} / 06</span></p>
          </div>
        </div>
        <dl className="cm-spec">
          {RUN.map(([t, d], i) => (
            <div key={t} className={'cm-spec-row' + (open === i ? ' open' : '')}>
              <dt>
                <button type="button" id={'cm-run-b' + i} aria-expanded={open === i} aria-controls={'cm-run-d' + i} onClick={() => setOpen(i)}>
                  <span className="x-mono">{two(i + 1)}</span><span className="cm-spec-t">{t}</span><i className="cm-spec-pm" aria-hidden="true" />
                </button>
              </dt>
              <dd id={'cm-run-d' + i} role="region" aria-labelledby={'cm-run-b' + i}><div><p>{d}</p></div></dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

const Gh = () => <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor" aria-hidden="true"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" /></svg>;

/* The ways in and the Get block: quiet rows before the close. */
function Ways() {
  return (
    <section className="bz-sec cm-ways" aria-labelledby="cm-ways-h">
      <div className="bz-wrap bz-grid">
        <h2 id="cm-ways-h" className="x-sr">Get Commerce</h2>
        <ul className="cm-way-list">
          {[['Start Selling', 'Launch your store with our easy-to-use platform', 'Try Hanzo', '/login'], ['Documentation', 'Explore our guides and API references', 'View Docs', DOCS], ['For Developers', 'Integrate our APIs into your applications', 'API Reference', 'https://docs.hanzo.ai/docs'], ['Need a Custom Solution?', 'Our team of experts can help you design and implement a tailored e-commerce solution for your unique business needs.', 'Contact Sales', '/contact-sales']].map(([t, d, a, to]) => (
            <li key={t}><A to={to} className="cm-way"><span className="cm-way-t">{t}</span><span>{d}</span><span className="cm-way-go">{a} →</span></A></li>
          ))}
        </ul>
        <div className="cm-get">
          <h3 className="cm-get-h">Get Commerce</h3>
          <p>Headless commerce + AI recommendations</p>
          <div className="cm-chips">
            <span className="cm-chip"><span>License:</span> Apache-2.0</span>
            <A to={GH} className="cm-chip"><Gh />hanzoai</A>
          </div>
          <More to={DEPLOY}>Deploy to Cloud</More>
        </div>
      </div>
    </section>
  );
}

/* The close: one sentence at Display size, the same ask, one full-width text row. */
function End() {
  return (
    <section className="bz-sec cm-end" aria-labelledby="cm-end-h">
      <div className="bz-wrap">
        <h2 id="cm-end-h" className="bz-display md"><span className="cm-end-l">Create a product,</span> <span className="cm-end-l">then sell it</span></h2>
        <div className="bz-grid cm-end-row">
          <p className="bz-lede">The whole thing runs from one container. Point your front end at it and take an order.</p>
          <div className="cm-end-go"><Cta to={DOCS} id="commerce.close">Read the docs</Cta></div>
        </div>
        <A to={GH} className="cm-endrow"><span>Get started with Commerce</span><span className="cm-endrow-go">View on GitHub<svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg></span></A>
      </div>
    </section>
  );
}

/* Order: the hero's rail, then the board (the signature) with the processor switch right under it, so switching
   re-flips the board a scroll above; then the black finder, the nouns, the spec sheet, the shapes, the ways, the close. */
/* one solid fill at the close: while the close's solid "Read the docs" is on screen the header's ask goes quiet
   (html[data-ask=quiet], the shell's own switch), said again after the shell's scroll pass */
function useQuietAtClose() {
  useEffect(() => {
    const H = document.documentElement;
    const el = document.querySelector('[data-cta="commerce.close"]');
    if (!el) return;
    let on = false, mine = false, t: ReturnType<typeof setTimeout> | undefined;
    const apply = () => { if (on) { H.dataset.ask = 'quiet'; mine = true; } else if (mine) { delete H.dataset.ask; mine = false; } };
    const io = new IntersectionObserver(([e]) => { on = e.isIntersecting; apply(); });
    io.observe(el);
    const onScroll = () => { clearTimeout(t); if (on) t = setTimeout(apply, 160); };
    addEventListener('scroll', onScroll, { passive: true });
    return () => { io.disconnect(); clearTimeout(t); removeEventListener('scroll', onScroll); if (mine) delete H.dataset.ask; };
  }, []);
}

export default function Commerce() {
  const [pick, setPick] = useState(0);
  useQuietAtClose();
  return (
    <main className="bz cm">
      <span data-ask-name="Hanzo Commerce" hidden />
      <Hero />
      <Board proc={INTEG[0][1][pick]} />
      <Money pick={pick} setPick={setPick} />
      <Find />
      <Nouns />
      <Running />
      <Shapes />
      <Ways />
      <End />
    </main>
  );
}
