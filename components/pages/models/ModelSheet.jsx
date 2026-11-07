'use client';
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
import { useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { EASE, Copy } from '../../ui';
import { A, Flap } from '../../kit';
import Sigil from '../../Sigil';
import { FilmPause, usePaused } from '../../v2/ModelFilm';
import SpecCard from '../../v2/SpecCard';
import { Field, Bill, Codes, Loose, useCatalog, rateFrom, rateText, money } from './parts';
import './models.css';

const up = (d) => ({ initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.9, ease: EASE, delay: d } });
const short = (t) => (t >= 1e6 ? +(t / 1e6).toFixed(1) + 'M' : Math.round(t / 1000) + 'K');
const size = (name) => (name.length <= 14 ? 's' : name.length <= 24 ? 'm' : 'l');
const FOLD = 2; // spec groups shown before the rest opens
const DASH = '—'; // a value Hanzo has not printed yet (PLAN-COMPONENTS 0.6: never "…")
const idParts = (id) => id.split('/').map((p, i) => <span key={i}>{i ? <>/<wbr /></> : null}{p}</span>);

function Spec({ g, price }) {
  return (
    <div className="xmf-spec">
      <h3 className="xmf-spec-h">{g.title || 'Specifications'}</h3>
      <div className="xmf-spec-b">
        {g.notes.map((n) => <p key={n} className="xmf-note x-mono">{n}</p>)}
        <dl>
          {g.facts.map((f) => (
            <div key={f.label} className={f.label === 'Model ID' ? 'id' : undefined}>
              <dt>{f.label}</dt>
              <dd>{f.label === 'Price' ? price : f.value || DASH}{f.label === 'Model ID' && f.value && <Copy text={f.value} label="Copy model ID" />}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}

export default function ModelSheet({ doc }) {
  const need = !doc.rate || doc.siblings.some((s) => !s.rate);
  const cat = useCatalog(need);
  const rate = rateFrom(cat, doc.id, doc.rate);
  const price = doc.price || (rate ? rateText(rate) : DASH);
  const sibs = doc.siblings.map((s) => ({ ...s, rate: rateFrom(cat, s.id, s.rate) }));
  const self = { name: doc.name, href: doc.route, rate, tokens: doc.tokens, ctx: doc.ctx };
  const field = [self, ...sibs];
  const plotted = field.filter((p) => p.tokens && p.rate).length;
  const groups = doc.facts;
  const [all, setAll] = useState(false);
  const first = doc.actions[0];
  // the hero figure is the short form ("1M", "33K"); a long printed value ("32,768 tokens (YaRN…)") stays whole in the spec sheet
  const ctxFig = doc.ctx && doc.ctx.length <= 6 ? doc.ctx : doc.tokens ? short(doc.tokens) : null;
  const ctxLabel = doc.ctx ? (doc.facts.flatMap((g) => g.facts).find((f) => f.value === doc.ctx) || {}).label : null;
  const hero = useRef(null);
  const paused = usePaused();
  const { scrollYProgress: hp } = useScroll({ target: hero, offset: ['start start', 'end start'] });
  const artY = useTransform(hp, [0, 1], ['0%', '18%']);
  const moreTitle = (doc.more && doc.more.title) || doc.provider.name;
  return (
    <main className="xmf xmf-model">
      <section className="xmf-launch" ref={hero} aria-labelledby="xmf-h1">
        <div className="x-wrap xmf-launch-g">
          <div className="xmf-launch-t">
            <motion.nav className="xmf-crumbs" aria-label="Breadcrumb" {...up(0)}>
              {doc.crumbs.map((c, i) => (
                <span key={i}>{c.href ? <A to={c.href}>{c.label}</A> : <span className="x-mono" aria-current="page">{c.label}</span>}</span>
              ))}
            </motion.nav>
            <h1 id="xmf-h1" className={'xmf-name ' + size(doc.name)} data-morph-target>
              <span className="x-line"><motion.span className="x-line-in" initial={{ y: '108%' }} animate={{ y: 0 }} transition={{ duration: 1.1, ease: EASE, delay: 0.08 }}>{doc.name}</motion.span></span>
            </h1>
            {doc.lede && <motion.p className="xmf-lede" {...up(0.3)}>{doc.lede}</motion.p>}
            <motion.div className="xmf-acts" {...up(0.42)}>
              {first && <A to={first.href} className="x-btn solid xmf-btn" data-thumb="" data-cta="model.hero">{first.label}</A>}
              {doc.actions.slice(1).map((a) => <A key={a.label} to={a.href} className="x-btn xmf-btn">{a.label}</A>)}
            </motion.div>
            {doc.links.length > 0 && (
              <motion.ul className="xmf-links" {...up(0.5)}>
                {doc.links.map((l) => <li key={l.href}><A to={l.href} className="x-arrow">{l.label}</A></li>)}
              </motion.ul>
            )}
            {/* the three numbers, largest on the screen: what a launch page leads with */}
            <motion.dl className="xmf-figs" {...up(0.55)} aria-label={price}>
              <div className="xmf-fig ctx">
                <dt>{ctxLabel || 'Context Window'}</dt>
                <dd><b>{ctxFig ? <Flap value={ctxFig} /> : DASH}</b></dd>
              </div>
              <div className="xmf-fig">
                <dt>In</dt>
                <dd><b className="x-mono">{rate ? money(rate.in) : DASH}</b><span>per million tokens</span></dd>
              </div>
              <div className="xmf-fig">
                <dt>Out</dt>
                <dd><b className="x-mono">{rate ? money(rate.out) : DASH}</b><span>per million tokens</span></dd>
              </div>
            </motion.dl>
          </div>
          {/* the hero object: the model's own contour field at 4:5, its maker label and its ID to copy */}
          <motion.figure className="xmf-obj" style={{ y: artY }} initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.1, ease: EASE, delay: 0.15 }}>
            <Sigil seed={doc.route} data={[doc.tokens, rate && rate.in, rate && rate.out].filter((v) => v != null)} className="xmf-obj-sigil" still={paused} />
            <FilmPause className="xmf-obj-pause" />
            {doc.label && <p className="xmf-obj-l x-mono">{doc.label}</p>}
            <figcaption className="xmf-obj-id">
              <span className="x-mono">Model ID</span>
              <code className="x-mono">{idParts(doc.id)}</code>
              <Copy text={doc.id} label="Copy model ID" />
            </figcaption>
          </motion.figure>
        </div>
      </section>

      {doc.family && (
        <nav className="xmf-fam" aria-label={doc.family.title}>
          <div className="x-wrap xmf-fam-in">
            <h2 className="xmf-h3">{doc.family.title}</h2>
            <ul data-swipe-own>{doc.family.links.map((l) => {
              const inner = <><span>{l.label}</span>{l.note && <i className="x-mono">{l.note}</i>}</>;
              return <li key={l.label}>{l.href ? <A to={l.href}>{inner}</A> : <span className="xmf-fam-here" aria-current="page">{inner}</span>}</li>;
            })}</ul>
          </div>
        </nav>
      )}

      {groups.length > 0 && (
        <section className="xmf-sec xmf-specs" id="specs" aria-label="Specifications">
          <div className="x-wrap">
            {groups.map((g, k) => (k < FOLD || all ? <Spec key={k} g={g} price={price} /> : <div key={k} hidden><Spec g={g} price={price} /></div>))}
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
              <p className="x-mono xmf-quick-id">{doc.id}</p>
            </header>
            <Codes samples={doc.quick.samples} keyLink={doc.quick.key} title={doc.quick.title} />
          </div>
        </section>
      )}

      {doc.extra.map((e, i) => (
        <section className="xmf-sec xmf-loose" key={i}>
          <div className="x-wrap"><Loose nodes={e.nodes} /></div>
        </section>
      ))}

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
            {doc.more && (
              <ul className="xmf-rail" data-swipe-own>
                {doc.more.cards.map((c) => {
                  const sib = sibs.find((x) => x.href === c.href);
                  return (
                    <li key={c.href}>
                      <SpecCard to={c.href} title={c.name} desc={c.desc} tags={c.ctx ? [c.ctx] : []} meta={sib && sib.rate ? <b>{`${money(sib.rate.in)} → ${money(sib.rate.out)}`}</b> : null} />
                    </li>
                  );
                })}
              </ul>
            )}
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
                {doc.band.actions.map((a, i) => <A key={a.label} to={a.href} className={'x-btn xmf-btn' + (i ? '' : ' solid')} {...(i ? {} : { 'data-cta': 'model.band' })}>{a.label}</A>)}
              </div>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
