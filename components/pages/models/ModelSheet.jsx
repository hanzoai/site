'use client';
/* One model in Hanzo's catalogue (470 pages, one template), v2: it reads like a model launch (the anthropic.com
   reference). The first screen is the name, huge, over the model's own contour field, with its figures as heroes along
   the bottom: context window on split-flaps, the rates per million tokens, the model ID to copy. Then one idea per
   screen: where it sits among its maker's models, what it costs at your volume, the spec sheet (the long one opens on
   request), the quick start in the page's one dark room, its siblings on a rail, and one closing call.
   Signature: the sibling field. Every model from the same maker placed by context window and output rate; a light
   sweeps across and each model answers as it passes; this one rings; every dot opens its page.
   Beyond: the bill comparer. Set a monthly volume, pick any sibling, see both bills, the ratio and the context each
   gives, from Hanzo's own rates (rate × volume, nothing estimated).
   Motion: kinetic name (once), the field drifting behind the first screen and easing away on scroll, split-flap figures. */
import { useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { EASE, Copy } from '../../ui';
import { A, Flap } from '../../kit';
import Sigil from '../../Sigil';
import { Field, Bill, Codes, Loose, useCatalog, rateFrom, rateText, money } from './parts';
import './models.css';

const up = (d) => ({ initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.9, ease: EASE, delay: d } });
const short = (t) => (t >= 1e6 ? +(t / 1e6).toFixed(1) + 'M' : Math.round(t / 1000) + 'K');
const size = (name) => (name.length <= 14 ? 's' : name.length <= 24 ? 'm' : 'l');
const FOLD = 2; // spec groups shown before "See the full spec"

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
              <dd>{f.label === 'Price' ? price : f.value}{f.label === 'Model ID' && f.value && <Copy text={f.value} label="Copy model ID" />}</dd>
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
  const price = doc.price || (cat ? rateText(rate) : '…');
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
  const { scrollYProgress: hp } = useScroll({ target: hero, offset: ['start start', 'end start'] });
  const artY = useTransform(hp, [0, 1], ['0%', '24%']);
  const artO = useTransform(hp, [0, 0.85], [1, 0]);
  return (
    <main className="xmf xmf-model">
      <section className="xmf-launch" ref={hero} aria-labelledby="xmf-h1">
        <motion.div className="xmf-art" style={{ y: artY, opacity: artO }} aria-hidden="true">
          <Sigil seed={doc.route} data={[doc.tokens, rate && rate.in, rate && rate.out].filter((v) => v != null)} className="xmf-sigil" />
        </motion.div>
        <div className="x-wrap xmf-launch-in">
          <div className="xmf-launch-t">
            <motion.nav className="xmf-crumbs" aria-label="Breadcrumb" {...up(0)}>
              {doc.crumbs.map((c, i) => (
                <span key={i}>{c.href ? <A to={c.href}>{c.label}</A> : <span className="x-mono" aria-current="page">{c.label}</span>}</span>
              ))}
            </motion.nav>
            {doc.label && <motion.p className="xmf-pill x-mono" {...up(0.05)}>{doc.label}</motion.p>}
            <h1 id="xmf-h1" className={'xmf-name ' + size(doc.name)} data-morph-target>
              <span className="x-line"><motion.span className="x-line-in" initial={{ y: '108%' }} animate={{ y: 0 }} transition={{ duration: 1.1, ease: EASE, delay: 0.08 }}>{doc.name}</motion.span></span>
            </h1>
            {doc.lede && <motion.p className="xmf-lede" {...up(0.3)}>{doc.lede}</motion.p>}
            <motion.div className="xmf-acts" {...up(0.42)}>
              {first && <A to={first.href} className="x-btn solid xmf-btn" data-thumb="">{first.label}</A>}
              {doc.actions.slice(1).map((a) => <A key={a.label} to={a.href} className="x-btn xmf-btn">{a.label}</A>)}
            </motion.div>
            {doc.links.length > 0 && (
              <motion.ul className="xmf-links" {...up(0.5)}>
                {doc.links.map((l) => <li key={l.href}><A to={l.href} className="x-arrow">{l.label}</A></li>)}
              </motion.ul>
            )}
          </div>
          {/* the figures, as heroes: what a launch page leads with */}
          <motion.dl className="xmf-figs" {...up(0.55)} aria-label={price}>
            {ctxFig && (
              <div className="xmf-fig ctx">
                <dt>{ctxLabel || 'Context Window'}</dt>
                <dd><b><Flap value={ctxFig} /></b></dd>
              </div>
            )}
            <div className="xmf-fig">
              <dt>In</dt>
              <dd><b className="x-mono">{rate ? money(rate.in) : '…'}</b><span>per million tokens</span></dd>
            </div>
            <div className="xmf-fig">
              <dt>Out</dt>
              <dd><b className="x-mono">{rate ? money(rate.out) : '…'}</b><span>per million tokens</span></dd>
            </div>
            <div className="xmf-fig id">
              <dt>Model ID</dt>
              <dd><code className="x-mono">{doc.id.split('/').map((p, i) => <span key={i}>{i ? <>/<wbr /></> : null}{p}</span>)}</code><Copy text={doc.id} label="Copy model ID" /></dd>
            </div>
          </motion.dl>
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

      {rate && plotted > 1 && (
        <section className="xmf-sec xmf-among" id="among" aria-labelledby="xmf-among-h">
          <div className="x-wrap">
            <header className="xmf-sh">
              <p className="xmf-kick">{doc.provider.name}</p>
              <h2 id="xmf-among-h">{`${doc.name} among ${plotted - 1} sibling${plotted > 2 ? 's' : ''}`}</h2>
            </header>
            <Field points={field} here={doc.route} label={`${doc.provider.name} models by context window and output rate`} />
          </div>
        </section>
      )}

      {rate && (
        <section className={'xmf-sec xmf-cost' + (plotted > 1 ? ' after' : '')} id="cost" aria-labelledby="xmf-cost-h">
          <div className="x-wrap">
            <header className="xmf-sh">
              <p className="xmf-kick">{plotted > 1 ? 'Bill a month' : doc.provider.name}</p>
              <h2 id="xmf-cost-h">{`What ${doc.name} costs at your volume`}</h2>
            </header>
            <Bill self={self} others={sibs} />
          </div>
        </section>
      )}

      {groups.length > 0 && (
        <section className="xmf-sec xmf-specs" id="specs" aria-label="Specifications">
          <div className="x-wrap">
            {groups.map((g, k) => (k < FOLD || all ? <Spec key={k} g={g} price={price} /> : <div key={k} hidden><Spec g={g} price={price} /></div>))}
            {groups.length > FOLD && (
              <button type="button" className="xmf-more-spec" aria-expanded={all} onClick={() => setAll((v) => !v)}>
                <span>{all ? 'Show less' : 'See the full spec'}</span><i aria-hidden="true">{all ? '−' : '+'}</i>
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

      <section className="xmf-end">
        <Sigil seed={doc.route + '#end'} data={[doc.siblings.length + 1, doc.tokens].filter(Boolean)} className="xmf-end-sigil" />
        <div className="x-wrap">
          {doc.more && (
            <div className="xmf-more">
              <div className="xmf-more-h">
                <h2>{doc.more.title}</h2>
                {doc.more.all && <A to={doc.more.all.href} className="x-arrow">{doc.more.all.label}</A>}
              </div>
              <ul className="xmf-rail" data-swipe-own>
                {doc.more.cards.map((c) => {
                  const s = sibs.find((x) => x.href === c.href);
                  return (
                    <li key={c.href}>
                      <A to={c.href} className="xmf-card" data-cursor="Open">
                        <span className="xmf-card-t"><b data-morph>{c.name}</b>{c.ctx && <i className="x-mono">{c.ctx}</i>}</span>
                        <span className="xmf-card-d">{c.desc}</span>
                        <span className="xmf-card-f x-mono">{s && s.rate ? `${money(s.rate.in)} → ${money(s.rate.out)}` : ' '}</span>
                      </A>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
          {doc.band && (
            <div className="xmf-band">
              <h2>{doc.band.title}</h2>
              {doc.band.lede && <p>{doc.band.lede}</p>}
              {doc.band.nodes && <Loose nodes={doc.band.nodes.filter((n) => !(n && n.t === 'h2'))} />}
              <div className="xmf-acts">
                {doc.band.actions.map((a, i) => <A key={a.label} to={a.href} className={'x-btn xmf-btn' + (i ? '' : ' solid')}>{a.label}</A>)}
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
