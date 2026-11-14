'use client';
/* Hanzo's telemetry, as hanzo-inc/app runs it (app/providers.tsx), on the same packages.

   One @hanzo/event client posts to api.hanzo.ai/v1/event, the stream every Hanzo dashboard reads. It is first-party and
   records every visitor. Consent gates the third parties alone: startTags loads GA4 and the Meta pixels from this host's
   tag set (GET /v1/project/tags, which also says which consent rule binds the visitor), as their region and choice allow.
   Around it:
   - a pageview per route change (the provider counts the first), and `product_viewed` on a product or model page,
     read off the page's own structured data;
   - interaction capture (@hanzo/observe: clicks, inputs with values redacted, scroll, rage clicks, `$view` for
     `[data-hz-view]` bands);
   - unhandled errors that are this site's;
   - session replay, for a visitor who allowed analytics;
   - the funnel's moments: a click to checkout (`checkout_started`) or to book a call (`sales_contacted`);
   - the visitor carried across a link to another Hanzo host (hanzo.app above all), so the journey is one visitor with its
     first touch. */
import { useEffect } from 'react';
import type { ReplayHandle } from '@hanzo/replay';
import { usePathname } from 'next/navigation';
import dynamic from 'next/dynamic';
import { AnalyticsProvider, useAnalytics, usePageview } from '@hanzo/event/react';
import { CONSENT_EVENT, readConsent, siteKey, startTags } from '@hanzo/event';
import { attach, track } from '../lib/track';

const API = 'https://api.hanzo.ai';

/* Interaction capture rides the provider's client through context. Its engine listens on the document and starts in an
   effect, so it is its own chunk, asked for as this module runs (beside hydration, so bands scrolled past early are
   counted). Routes are counted by Wiring, so it leaves history alone. */
const observe = typeof window === 'undefined' ? null : import('@hanzo/observe/react');
const Observe = dynamic(() => (observe ?? import('@hanzo/observe/react')).then(({ ObserveProvider }) => function Observe() { return <ObserveProvider nav={false}>{null}</ObserveProvider>; }), { ssr: false });

/** The sites one visit can cross; GA4 keeps it one session across them (@hanzo/app lib/tags). */
const DOMAINS = ['hanzo.ai', 'hanzo.app', 'hanzo.chat', 'pay.hanzo.ai', 'hanzo.id', 'hanzo.build', 'docs.hanzo.ai', 'platform.hanzo.ai', 'cal.hanzo.ai'];

/** The funnel moment a click to one of these is: a host, or a host and the path it is mounted at. */
const INTENT: Record<string, string> = { 'hanzo.app/pay': 'checkout_started', 'hanzo.ai/pay': 'checkout_started', 'billing.hanzo.ai': 'checkout_started', 'cal.com/hanzo': 'sales_contacted' };

const intent = (href: string) => {
  const u = new URL(href, location.href);
  const at = u.host + u.pathname;
  const key = Object.keys(INTENT).find((k) => at === k || at.startsWith(k + '/'));
  return key && INTENT[key];
};

/** Errors that are not this site's to fix: a scanner's, an extension's, another origin's (app lib/analytics/noise). */
const NOISE = [
  /^Object Not Found Matching Id:\d+, MethodName:\w+, ParamCount:\d+/,
  /^Script error\.?$/,
  /\bwindow\.ethereum\b/,
  /^ResizeObserver loop (completed with undelivered notifications|limit exceeded)/,
];
const noise = (err: unknown) => {
  const said = typeof err === 'string' ? err : err && typeof err === 'object' && 'message' in err ? String(err.message) : '';
  return NOISE.some((re) => re.test(said));
};

/** What the page is about, from its JSON-LD: a product (`@id` ending `#product`) or a model page (app lib/analytics/viewed). */
function viewed(path: string) {
  const nodes = [];
  for (const s of document.querySelectorAll('script[type="application/ld+json"]')) {
    try {
      const j = JSON.parse(s.textContent || '');
      nodes.push(j, ...(Array.isArray(j['@graph']) ? j['@graph'] : []));
    } catch { /* a block that is not JSON states nothing */ }
  }
  const clean = path.replace(/\/$/, '') || '/';
  const model = /^\/models\/([^/]+\/[^/]+)$/.exec(clean);
  for (const n of nodes) {
    if (n['@type'] !== 'SoftwareApplication' || !n.name) continue;
    if (n['@id']?.endsWith('#product')) return { content_type: 'product', item_id: clean.split('/').filter(Boolean).pop() || clean, item_name: n.name };
    if (model && n.url?.replace(/\/$/, '').endsWith(clean)) return { content_type: 'model', item_id: model[1], item_name: n.name };
  }
  const cloud = /^\/cloud\/([^/]+)$/.exec(clean);
  const h1 = cloud && document.querySelector('h1')?.textContent?.trim();
  return cloud && h1 ? { content_type: 'product', item_id: cloud[1], item_name: h1 } : undefined;
}

function Wiring() {
  const client = useAnalytics();
  const path = usePathname();
  usePageview(path);
  useEffect(() => attach(client), [client]);

  useEffect(() => {
    const v = viewed(path);
    if (v) track('product_viewed', { ...v, items: [{ item_id: v.item_id, item_name: v.item_name }] });
  }, [client, path]);

  // The tag manager: this host's tag set from cloud, loaded as consent allows. Nobody is signed in here, so it asks as nobody.
  useEffect(() => startTags({ domains: [location.hostname, ...DOMAINS] }), []);

  // A link to another Hanzo host carries the visitor, however it is opened: decorated before a click, a middle click or a copy.
  useEffect(() => {
    const carry = (e: Event) => {
      const a = (e.target as Element | null)?.closest?.('a[href]');
      if (!a) return;
      const href = new URL(a.getAttribute('href') || '', document.baseURI).href;
      const to = client.link(href);
      if (to !== href) a.setAttribute('href', to);
    };
    const on = ['pointerdown', 'click', 'contextmenu', 'keydown'];
    on.forEach((t) => document.addEventListener(t, carry, { capture: true }));
    return () => on.forEach((t) => document.removeEventListener(t, carry, { capture: true }));
  }, [client]);

  // The funnel's moments; a link marked data-ga sends its own.
  useEffect(() => {
    const click = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.('a[href]');
      if (!a || a.hasAttribute('data-ga')) return;
      const href = new URL(a.getAttribute('href') || '', document.baseURI).href;
      const name = intent(href);
      if (name) track(name, { link_url: href, page_path: location.pathname, cta: a.getAttribute('data-cta') || undefined });
    };
    document.addEventListener('click', click, { capture: true });
    return () => document.removeEventListener('click', click, { capture: true });
  }, [client]);

  // Unhandled errors and rejections that are this site's.
  useEffect(() => {
    const report = (err: unknown) => { if (!noise(err)) client.captureError(err, { handled: false }); };
    const error = (e: ErrorEvent) => report(e.error ?? e.message);
    const rejection = (e: PromiseRejectionEvent) => report(e.reason);
    addEventListener('error', error);
    addEventListener('unhandledrejection', rejection);
    return () => { removeEventListener('error', error); removeEventListener('unhandledrejection', rejection); };
  }, [client]);

  // Session replay, for a visitor who has allowed analytics; asked again on every route and every consent change.
  useEffect(() => {
    let handle: ReplayHandle | null = null;
    let gone = false;
    const refuse = () => !!document.querySelector('meta[name="robots"][content*="noindex"]');
    const go = () => {
      if (!readConsent().analytics || handle?.recording || refuse()) return;
      const ingestKey = siteKey(location.hostname);
      if (!ingestKey) return;
      import('@hanzo/replay')
        .then(({ record }) => record({ ingestKey, endpoint: API, refuse }))
        .then((h) => { if (gone) h?.stop(); else handle = h; })
        .catch(() => {});
    };
    go();
    addEventListener(CONSENT_EVENT, go);
    return () => { gone = true; removeEventListener(CONSENT_EVENT, go); handle?.stop(); };
  }, [path]);

  return null;
}

export default function Telemetry() {
  return (
    <AnalyticsProvider config={{ product: 'site', host: API, captureErrors: false }}>
      <Observe />
      <Wiring />
    </AnalyticsProvider>
  );
}
