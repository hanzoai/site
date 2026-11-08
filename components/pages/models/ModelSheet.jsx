'use client';
// V2: 8/10 (own estimate; critic pending) no card leaves the site unannounced (rail = pages here, ≤6; the rest one-line rows, ↗ in a new tab); spec in 4.7's four groups with drawn rates; Kai's Limits drawn; field padded and labelled; maker shelf as 72px rows; Copy 44px + status; no hydration mismatch
// Persona: Developer picking a model. Goal: pick it and try it. CTA: the page's first action in Hanzo's words (usually "Get API key"). Metric: api_key_created.
// Signature: the open. The card you pressed on /models (or a sibling) lands as this page's name (morph), and the page answers with the model's own living contour field.
// Beyond: the bill comparer. Set a monthly volume, pick any sibling, see both bills and the context each gives, from Hanzo's own rates (rate × volume, nothing estimated).
/* One model in Hanzo's catalogue (470 pages, one template), read like a model launch (anthropic.com) and laid out as
   PLAN-COMPONENTS 5.5 asks: name and three numbers (context, in, out: the largest type on the screen), the CTA pair, the
   model's Sigil at 4:5 on the right with its ID; then the spec sheet, the quick start (the one dark room), Hanzo's
   "More from <maker>" as the related chapter (the sibling field, the bill comparer, the rail of siblings), and the close.
   No eyebrow over any headline, no UI hue, no headline that is not Hanzo's.
   Motion mix: arrival (the name cuts in, split-flap context), idle (the Sigil drifts; the field's light sweeps),
   pointer (the Sigil leans to the cursor; dots answer with their rates), state (bill sliders, sibling picks, code
   tabs), scroll (the Sigil eases up as you leave the first screen). Readable with animations and JavaScript off. */
import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { EASE, Copy } from '../../ui';
import { A, Cta } from '../../kit';
import MaskFig from '../../v2/MaskFig';
import Sigil from '../../Sigil';
import ModelFilm, { FilmPause, usePaused } from '../../v2/ModelFilm';
import SpecCard from '../../v2/SpecCard';
import { Field, Bill, Codes, Loose, RateBars, Reach, Also, CopyStatus, useCatalog, useShelf, rateFrom, rateText, money, isLocal } from './parts';
import './models.css';

const up = (d) => ({ initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.9, ease: EASE, delay: d } });
const size = (name) => (name.length <= 14 ? 's' : name.length <= 24 ? 'm' : 'l');
const FOLD = 1; // spec groups shown before the rest opens (the first, in MASTER 4.7's four groups when it is long)
const DASH = '—'; // a value Hanzo has not printed yet (PLAN-COMPONENTS 0.6: never "…")
const RAIL = 6; // sibling cards at most, every one a page of this site
const idParts = (id) => id.split('/').map((p, i) => <span key={i}>{i ? <>/<wbr /></> : null}{p}</span>);
// a "#section" ask stays on this page (the kit opens anything that is not a site path in a new tab)
const here = (h) => (h && h.startsWith('#') ? { target: undefined, rel: undefined } : {});

/* MASTER 4.7: a long spec reads in four groups, Identity, Limits, Price, Modalities (empty groups omitted) */
const PARTS = [
  ['Identity', () => true],
  ['Limits', (l) => /context|latency|output tokens|memory|limit|throughput|max/i.test(l)],
  ['Price', (l) => /price|cost/i.test(l)],
  ['Modalities', (l) => /^modalit|encoder/i.test(l)],
];
const parted = (facts) => {
  const at = (l) => PARTS.reduce((k, [, t], i) => (i && t(l) ? i : k), 0);
  return PARTS.map(([title], i) => [title, facts.filter((f) => at(f.label) === i)]).filter(([, f]) => f.length);
};

function Facts({ facts, price }) {
  return (
    <dl>
      {facts.map((f) => (
        <div key={f.label} className={f.label === 'Model ID' ? 'id' : undefined}>
          <dt>{f.label}</dt>
          <dd>{f.label === 'Price' ? price : f.value || DASH}{f.label === 'Model ID' && f.value && <Copy text={f.value} label="Copy model ID" />}</dd>
        </div>
      ))}
    </dl>
  );
}

function Spec({ g, price, rate, lead }) {
  const split = lead && g.facts.length > 6;
  return (
    <div className={'xmf-spec' + (lead ? ' lead' : '')}>
      <div className="xmf-spec-l">
        <h3 className="xmf-spec-h">{g.title || 'Specifications'}</h3>
        {/* the sheet's one object: the model's two rates drawn to scale */}
        {lead && <RateBars rate={rate} />}
      </div>
      <div className="xmf-spec-b">
        {g.notes.map((n) => <p key={n} className="xmf-note x-mono">{n}</p>)}
        {split
          ? parted(g.facts).map(([t, f]) => <div key={t} className="xmf-spec-p"><h4>{t}</h4><Facts facts={f} price={price} /></div>)
          : <Facts facts={g.facts} price={price} />}
      </div>
    </div>
  );
}

export default function ModelSheet({ doc }) {
  // the rate is read from api.hanzo.ai as hanzo.ai reads it (the captured rate is the first paint)
  const cat = useCatalog(true);
  // once the gateway has answered without this model, hanzo.ai prints "No published rate" (its own words), whatever
  // the capture once read
  const unpriced = !!cat && !cat[doc.id] && !cat[doc.id.replace(/^hanzo\//, '')];
  const rate = unpriced ? null : rateFrom(cat, doc.id, doc.rate);
  const price = unpriced ? 'No published rate' : (rate && (doc.rate || !doc.price) ? rateText(rate) : doc.price) || DASH;
  // the maker's other models as hanzo.ai lists them now (api.hanzo.ai/v1/models), the captured ones until it answers
  const shelf = useShelf(doc.provider.slug, doc.siblings);
  const live = shelf !== doc.siblings ? shelf.filter((s) => s.href !== doc.route) : null;
  const sibs = (live || doc.siblings).map((s) => ({ ...s, rate: rateFrom(cat, s.id, s.rate) }));
  // the hero figure is Hanzo's short form ("1M", "33K": the spec value, else the shelf card's); a sentence-long value
  // ("32,768 tokens (YaRN…)") stays whole in the spec sheet. Never a number Hanzo did not print.
  const ctxFig = doc.ctx && doc.ctx.length <= 6 ? doc.ctx : doc.cardCtx;
  const self = { name: doc.name, href: doc.route, rate, tokens: doc.tokens, ctx: ctxFig || doc.ctx };
  const field = [self, ...sibs];
  const plotted = field.filter((p) => p.tokens && p.rate).length;
  const groups = doc.facts;
  const [all, setAll] = useState(false);
  const first = doc.actions[0];
  const ctxLabel = doc.ctx ? (doc.facts.flatMap((g) => g.facts).find((f) => f.value === doc.ctx) || {}).label : null;
  const hero = useRef(null);
  const paused = usePaused();
  // the local nav's ask turns solid only once the hero's own ask has left the screen (one solid fill at a time)
  const [past, setPast] = useState(false);
  useEffect(() => {
    const el = hero.current && hero.current.querySelector('[data-cta="model.hero"]');
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setPast(!e.isIntersecting && e.boundingClientRect.top < 0));
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const { scrollYProgress: hp } = useScroll({ target: hero, offset: ['start start', 'end start'] });
  const artY = useTransform(hp, [0, 1], ['0%', '18%']);
  const moreTitle = (doc.more && doc.more.title) || doc.provider.name;
  const film = (/^\/models\/hanzo\/(enso|kai|koma|zen)/.exec(doc.route) || [])[1];
  // the sibling rail: only models with a page on this site (each opens by Morph), Hanzo's own "More from" picks first,
  // then the maker's nearest by context and output rate; six at most. Hanzo's other "More from" cards follow as one-line
  // links (Also), the ones without a page here opening hanzo.ai in a new tab and saying so.
  const near = (s) => Math.abs(Math.log10((s.tokens || 1) / (doc.tokens || 1))) + (s.rate && rate ? Math.abs(Math.log10((s.rate.out + 0.01) / (rate.out + 0.01))) : 3);
  const cap = doc.more ? doc.more.cards : [];
  // hanzo.ai's own More from (captured), in its order and words: its list is no longer the gateway's (8 Nov)
  const more = cap;
  const rail = [
    ...more.filter((c) => isLocal(c.href)),
    ...sibs.filter((s) => isLocal(s.href) && !more.some((c) => c.href === s.href)).sort((a, b) => near(a) - near(b)),
  ].slice(0, RAIL);
  const also = more.filter((c) => !rail.includes(c));
  return (
    <main className="xmf xmf-model">
      <CopyStatus />
      <section className="xmf-launch" ref={hero} aria-labelledby="xmf-h1">
        <div className="x-wrap xmf-launch-g">
          <div className="xmf-launch-t">
            <h1 id="xmf-h1" className={'xmf-name ' + size(doc.name)} data-morph-target>
              <span className="x-line"><motion.span className="x-line-in" initial={{ y: '108%' }} animate={{ y: 0 }} transition={{ duration: 1.1, ease: EASE, delay: 0.08 }}>{doc.name}</motion.span></span>
            </h1>
            {doc.lede && <motion.p className="xmf-lede" {...up(0.3)}>{doc.lede}</motion.p>}
            <motion.div className="xmf-acts" {...up(0.42)}>
              {first && <Cta to={first.href} id="model.hero" thumb {...here(first.href)}>{first.label}</Cta>}
              {doc.actions.slice(1).map((a) => <Cta key={a.label} to={a.href} kind="link" id="model.hero.2" {...here(a.href)}>{a.label}</Cta>)}
            </motion.div>
            {doc.links.length > 0 && (
              <motion.ul className="xmf-links" {...up(0.5)}>
                {doc.links.map((l) => <li key={l.href}><A to={l.href} className="x-arrow">{l.label}</A></li>)}
              </motion.ul>
            )}
          </div>
          {/* the three numbers, largest on the screen: what a launch page leads with (each rises once into its line) */}
          <dl className="xmf-figs" aria-label={price}>
            <div className="xmf-fig ctx">
              <dt>{ctxLabel || 'Context Window'}</dt>
              <dd><b>{ctxFig ? <MaskFig now delay={0.12} dur={0.55}>{ctxFig}</MaskFig> : (doc.ctx || DASH)}</b></dd>
            </div>
            <div className="xmf-fig">
              <dt>In</dt>
              <dd><b className="x-mono"><MaskFig now delay={0.18} dur={0.55}>{rate ? money(rate.in) : DASH}</MaskFig></b><span>per million tokens</span></dd>
            </div>
            <div className="xmf-fig">
              <dt>Out</dt>
              <dd><b className="x-mono"><MaskFig now delay={0.24} dur={0.55}>{rate ? money(rate.out) : DASH}</MaskFig></b><span>per million tokens</span></dd>
            </div>
          </dl>
          {/* the hero object: the model's own contour field at 4:5, where it sits in the catalogue (the breadcrumb, so
              nothing labels the headline from above), its maker label and its ID to copy */}
          <motion.figure className={'xmf-obj' + (film ? ' film' : '')} style={{ y: artY }} initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.1, ease: EASE, delay: 0.15 }}>
            {/* Hanzo's own models show their film (colour only through Hanzo's media); every other maker's model its Sigil */}
            {film
              ? <span className="xmf-obj-film" aria-hidden="true"><ModelFilm slug={film} /></span>
              : <Sigil seed={doc.route} data={[doc.tokens, rate && rate.in, rate && rate.out].filter((v) => v != null)} className="xmf-obj-sigil" still={paused} />}
            <div className="xmf-obj-top">
              <nav className="xmf-crumbs" aria-label="Breadcrumb">
                {doc.crumbs.map((c, i) => (
                  <span key={i}>{c.href ? <A to={c.href}>{c.label}</A> : <span className="x-mono" aria-current="page">{c.label}</span>}</span>
                ))}
              </nav>
              <FilmPause className="xmf-obj-pause" />
            </div>
            {doc.label && <p className="x-mono xmf-obj-l">{doc.label}</p>}
            <figcaption className="xmf-obj-id">
              <span className="x-mono">Model ID</span>
              <code className="x-mono">{idParts(doc.id)}</code>
              <Copy text={doc.id} label="Copy model ID" />
            </figcaption>
          </motion.figure>
        </div>
      </section>

      {/* the sticky local nav: the page's own section names and its ask (MASTER.md 4.7) */}
      <nav className="xmf-local" aria-label={doc.name}>
        <div className="x-wrap xmf-local-in">
          <span className="xmf-local-n">{doc.name}</span>
          <span className="xmf-local-l">
            {groups.length > 0 && <a href="#specs">{groups[0].title || 'Specifications'}</a>}
            {doc.quick && <a href="#quickstart">{doc.quick.title}</a>}
            {(doc.more || (rate && plotted > 1)) && <a href="#more">{moreTitle}</a>}
          </span>
          {first && <Cta to={first.href} kind={past ? 'solid' : 'quiet'} size="sm" id="model.local" {...here(first.href)}>{first.label}</Cta>}
        </div>
      </nav>

      {doc.family && (
        <nav className="xmf-fam" aria-label={doc.family.title}>
          <div className="x-wrap xmf-fam-in">
            {/* a caption, not a heading: "More from <maker>" is the h2 of the related chapter further down */}
            <p className="xmf-h3">{doc.family.title}</p>
            <ul data-swipe-own data-cursor="">{doc.family.links.map((l) => {
              const inner = <><span>{l.label}</span>{l.note && <i className="x-mono">{l.note}</i>}</>;
              return <li key={l.label}>{l.href ? <A to={l.href}>{inner}</A> : <span className="xmf-fam-here" aria-current="page">{inner}</span>}</li>;
            })}</ul>
          </div>
        </nav>
      )}

      {groups.length > 0 && (
        <section className="xmf-sec xmf-specs" id="specs" aria-label="Specifications">
          <div className="x-wrap">
            {groups.map((g, k) => (k < FOLD || all ? <Spec key={k} g={g} price={price} rate={rate} lead={k === 0} /> : <div key={k} hidden><Spec g={g} price={price} /></div>))}
            {groups.length > FOLD && (
              <button type="button" className="xmf-more-spec" aria-expanded={all} aria-label={all ? `Show ${FOLD}` : `Show all (${groups.length})`} onClick={() => setAll((v) => !v)}>
                <i aria-hidden="true" className={all ? 'on' : ''} />
              </button>
            )}
          </div>
        </section>
      )}

      {doc.quick && (
        <section className="xmf-sec xmf-quick" id="quickstart" data-room="dark">
          <div className="x-wrap xmf-quick-g">
            <header className="xmf-sh dark">
              <h2>{doc.quick.title}</h2>
              <p className="x-mono xmf-quick-id"><i className="xmf-live" aria-hidden="true" />{doc.id}</p>
              {/* the rate as hanzo.ai prints it under its samples, with any words that follow it (one line) */}
              {doc.quick.price && <p className="xmf-quick-price">{price === DASH ? DASH : price + doc.quick.note}</p>}
            </header>
            <Codes samples={doc.quick.samples} keyLink={doc.quick.key} title={doc.quick.title} />
          </div>
        </section>
      )}

      {doc.extra.map((e, i) => {
        // "Limits" gets its object: the context the model reaches, drawn against what it was trained on
        const reach = /^Limits$/i.test(e.title) && doc.tokens ? <Reach value={doc.ctx} tokens={doc.tokens} /> : null;
        return (
          <section className={'xmf-sec xmf-loose' + (reach ? ' drawn' : '')} key={i}>
            <div className="x-wrap xmf-loose-g">
              <div className="xmf-loose-t"><Loose nodes={e.nodes} /></div>
              {reach}
            </div>
          </section>
        );
      })}

      {/* related: Hanzo's "More from <maker>" heads the whole chapter: where this model sits, what it costs beside a
          sibling, and the siblings themselves, each opening into its page */}
      {(doc.more || (rate && plotted > 1)) && (
        <section className="xmf-sec xmf-rel" id="more" aria-labelledby="xmf-more-h">
          <div className="x-wrap">
            <div className="xmf-more-h">
              <h2 id="xmf-more-h">{moreTitle}</h2>
              {doc.more && doc.more.all && <A to={doc.more.all.href} className="x-arrow">{doc.more.all.label}</A>}
            </div>
            {rate && plotted > 1 && <Field points={field} here={doc.route} label={`${doc.provider.name} models by context window and output rate`} />}
            {rate && <div className="xmf-cost"><Bill self={self} others={sibs} /></div>}
            {rail.length > 0 && (
              <ul className={'xmf-rail' + (rail.length < 4 ? ' few' : '')} data-swipe-own data-cursor="">
                {rail.map((c) => {
                  const sib = sibs.find((x) => x.href === c.href);
                  return (
                    <li key={c.href}>
                      <SpecCard to={c.href} title={c.name} meta={<span className="xmf-id">{c.mid || c.id || (sib && sib.id)}</span>} desc={c.desc} tags={[...(c.ctx ? [c.ctx] : []), ...(sib && sib.rate ? [`${money(sib.rate.in)} → ${money(sib.rate.out)}`] : [])]} />
                    </li>
                  );
                })}
              </ul>
            )}
            <Also cards={also} />
          </div>
        </section>
      )}

      {doc.band && (
        <section className="xmf-end">
          <Sigil seed={doc.route + '#end'} data={[doc.siblings.length + 1, doc.tokens].filter(Boolean)} className="xmf-end-sigil" still={paused} />
          <div className="x-wrap">
            <div className="xmf-band">
              <h2>{doc.band.title}</h2>
              {doc.band.lede && <p>{doc.band.lede}</p>}
              {doc.band.nodes && <Loose nodes={doc.band.nodes.filter((n) => !(n && n.t === 'h2'))} />}
              <div className="xmf-acts">
                {doc.band.actions.map((a, i) => <Cta key={a.label} to={a.href} kind={i ? 'link' : 'solid'} id={i ? 'model.band.2' : 'model.band'} {...here(a.href)}>{a.label}</Cta>)}
              </div>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
