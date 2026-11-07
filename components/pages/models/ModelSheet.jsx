'use client';
/* One model in Hanzo's catalogue (470 of them, one template). The first screen is the model's own datasheet: its
   context window and rates on a readout drawn over a contour field seeded from its name and numbers, so no two
   model pages share a picture.
   Signature: the sibling field. Every model from the same maker placed by context window and output rate; a light
   sweeps across and each model answers as it passes; this one rings; every dot opens its page.
   Beyond: the bill comparer. Set a monthly volume, pick any sibling, see both bills, the ratio and the context each
   gives, from Hanzo's own rates (rate × volume, nothing estimated). */
import { motion } from 'motion/react';
import { EASE, Copy } from '../../ui';
import { A, Flap } from '../../kit';
import Sigil from '../../Sigil';
import { Field, Bill, Codes, Loose, useCatalog, rateFrom, rateText, money } from './parts';
import './models.css';

const up = (d) => ({ initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.9, ease: EASE, delay: d } });

function Facts({ groups, price }) {
  return groups.map((g, k) => (
    <div className="xmf-facts" key={k}>
      {g.title && <h2 className="xmf-h3">{g.title}</h2>}
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
  ));
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
  const simple = groups.length === 1 && groups[0].facts.length <= 5;
  const first = doc.actions[0];
  return (
    <main className="xmf xmf-model">
      <section className="xmf-hero" aria-labelledby="xmf-h1">
        <div className="x-wrap xmf-hero-g">
          <div className="xmf-hero-t">
            <motion.nav className="xmf-crumbs" aria-label="Breadcrumb" {...up(0)}>
              {doc.crumbs.map((c, i) => (
                <span key={i}>{c.href ? <A to={c.href}>{c.label}</A> : <span className="x-mono" aria-current="page">{c.label}</span>}</span>
              ))}
            </motion.nav>
            {doc.label && <motion.p className="xmf-pill x-mono" {...up(0.05)}>{doc.label}</motion.p>}
            <h1 id="xmf-h1" className="xmf-h1" data-morph-target>
              <span className="x-line"><motion.span className="x-line-in" initial={{ y: '105%' }} animate={{ y: 0 }} transition={{ duration: 1.1, ease: EASE, delay: 0.08 }}>{doc.name}</motion.span></span>
            </h1>
            {doc.lede && <motion.p className="xmf-lede" {...up(0.3)}>{doc.lede}</motion.p>}
            <motion.div className="xmf-acts" {...up(0.42)}>
              {first && <A to={first.href} className="x-btn solid" data-thumb="">{first.label}</A>}
              {doc.actions.slice(1).map((a) => <A key={a.label} to={a.href} className="x-btn">{a.label}</A>)}
            </motion.div>
            {doc.links.length > 0 && (
              <motion.ul className="xmf-links" {...up(0.5)}>
                {doc.links.map((l) => <li key={l.href}><A to={l.href} className="x-arrow">{l.label}</A></li>)}
              </motion.ul>
            )}
          </div>
          <motion.div className="xmf-read" initial={{ opacity: 0, y: 24, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 1.1, ease: EASE, delay: 0.2 }}>
            <div className="xmf-read-art">
              <Sigil seed={doc.route} data={[doc.tokens, rate && rate.in, rate && rate.out].filter((v) => v != null)} className="xmf-sigil" />
              <div className="xmf-read-big">
                <span className="xmf-k x-mono">{doc.ctx ? (doc.facts.flatMap((g) => g.facts).find((f) => f.value === doc.ctx) || {}).label : 'Model ID'}</span>
                <b>{doc.ctx ? <Flap value={doc.ctx} /> : <span className="xmf-read-id">{doc.id}</span>}</b>
              </div>
              <div className="xmf-read-rate" aria-label={price}>
                <span><i className="x-mono">In</i><b className="x-mono">{rate ? money(rate.in) : '…'}</b></span>
                <span><i className="x-mono">Out</i><b className="x-mono">{rate ? money(rate.out) : '…'}</b></span>
                <em className="x-mono">per million tokens</em>
              </div>
            </div>
            {simple ? <Facts groups={groups} price={price} /> : (
              <dl className="xmf-mini">
                <div><dt>Model ID</dt><dd>{doc.id}<Copy text={doc.id} label="Copy model ID" /></dd></div>
                {doc.modalities && <div><dt>Modality</dt><dd>{doc.modalities}</dd></div>}
              </dl>
            )}
          </motion.div>
        </div>
      </section>

      {doc.family && (
        <section className="xmf-fam" aria-label={doc.family.title}>
          <div className="x-wrap xmf-fam-in">
            <h2 className="xmf-h3">{doc.family.title}</h2>
            <ul>{doc.family.links.map((l) => {
              const inner = <><span>{l.label}</span>{l.note && <i className="x-mono">{l.note}</i>}</>;
              return <li key={l.label}>{l.href ? <A to={l.href}>{inner}</A> : <span className="xmf-fam-here" aria-current="page">{inner}</span>}</li>;
            })}</ul>
          </div>
        </section>
      )}

      {!simple && (
        <section className="x-sec xmf-specs" id="specs">
          <div className="x-wrap xmf-specs-g"><Facts groups={groups} price={price} /></div>
        </section>
      )}

      {rate && (
        <section className="x-sec xmf-among" id="among">
          <div className="x-wrap">
            <header className="xmf-sh">
              <p className="x-kick">{doc.provider.name}</p>
              <h2>{plotted > 1 ? `${doc.name} among ${plotted - 1} sibling${plotted > 2 ? 's' : ''}` : `What ${doc.name} costs at your volume`}</h2>
            </header>
            <div className={'xmf-among-g' + (plotted > 1 ? '' : ' solo')}>
              {plotted > 1 && <Field points={field} here={doc.route} label={`${doc.provider.name} models by context window and output rate`} />}
              <Bill self={self} others={sibs} />
            </div>
          </div>
        </section>
      )}

      {doc.quick && (
        <section className="x-sec xmf-quick" id="quickstart" data-room="dark">
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
        <section className="x-sec xmf-loose" key={i}>
          <div className="x-wrap"><Loose nodes={e.nodes} /></div>
        </section>
      ))}

      <section className="xmf-end">
        <Sigil seed={doc.route + '#end'} data={[doc.siblings.length + 1, doc.tokens].filter(Boolean)} className="xmf-end-sigil" />
        <div className="x-wrap">
          {doc.more && (
            <div className="xmf-more">
              <div className="xmf-more-h">
                <h2 className="xmf-h3">{doc.more.title}</h2>
                {doc.more.all && <A to={doc.more.all.href} className="x-arrow">{doc.more.all.label}</A>}
              </div>
              <ul className="xmf-rail" data-swipe-own>
                {doc.more.cards.map((c) => {
                  const s = sibs.find((x) => x.href === c.href);
                  return (
                    <li key={c.href}>
                      <A to={c.href} className="xmf-card">
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
                {doc.band.actions.map((a, i) => <A key={a.label} to={a.href} className={'x-btn' + (i ? '' : ' solid')}>{a.label}</A>)}
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
