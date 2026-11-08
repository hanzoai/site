'use client';
// Persona: Developer comparing one lab's models. Goal: find the right model from this maker and open it. CTA: the hero's first action in Hanzo's words ("Get API Access"). Metric: api_key_created.
/* A model maker's shelf in Hanzo's catalogue (73 makers, one template). The first screen leads with the maker's own
   count and a contour field seeded from its name and its models' numbers, beside the guest-key terminal.
   The shelf is one list of 72px rows (name, rate, pills); a row's description arrives on hover or focus in place of
   its rate, and is in the HTML throughout. Rows of models this site has no page for open hanzo.ai in a new tab (↗).
   Signature: the sibling field at full size: every model the maker has on Hanzo, placed by context window and output
   rate, a light sweeping across; each dot opens its model.
   Beyond: the shelf re-sorts by context window or by rate (and filters by modality), so the cheapest or the
   longest-context model is one press away. */
import { useMemo, useState } from 'react';
import { motion, LayoutGroup } from 'motion/react';
import { EASE, Copy } from '../../ui';
import MaskFig from '../../v2/MaskFig';
import { A, Cta } from '../../kit';
import Sigil from '../../Sigil';
import { FilmPause, usePaused } from '../../v2/ModelFilm';
import SpecCard from '../../v2/SpecCard';
import { Field, CopyStatus, useCatalog, useShelf, rateFrom, money } from './parts';
import './models.css';

const up = (d) => ({ initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.9, ease: EASE, delay: d } });
const FILM = /^\/models\/hanzo\/(enso|kai|koma|zen|iro|oto|koe|uta|mori)\/?$/;
const SORTS = [['shelf', 'As listed'], ['ctx', 'Context window'], ['rate', 'Output rate']];

export default function ProviderShelf({ doc }) {
  const cat = useCatalog(true);
  // the shelf as hanzo.ai lists it now (api.hanzo.ai/v1/models), the captured one until the gateway answers
  const list = useShelf(doc.slug, doc.cards);
  const cards = list.map((c, i) => ({ ...c, n: i, rate: rateFrom(cat, c.id, c.rate) }));
  const [sort, setSort] = useState('shelf');
  const [mod, setMod] = useState('all');
  const mods = useMemo(() => [...new Set(list.flatMap((c) => c.tags))], [list]);
  const shown = cards.filter((c) => mod === 'all' || c.tags.includes(mod)).sort((a, b) => {
    if (sort === 'ctx') return (b.tokens || 0) - (a.tokens || 0) || a.n - b.n;
    if (sort === 'rate') return (a.rate ? a.rate.out : Infinity) - (b.rate ? b.rate.out : Infinity) || a.n - b.n;
    return a.n - b.n;
  });
  const hidden = new Set(cards.filter((c) => !shown.includes(c)).map((c) => c.href));
  // Hanzo's count and lede follow its list ("{n} models available"; "Access all {n} {name} models…", "model" for one)
  const n0 = parseInt(doc.count, 10);
  const n = list === doc.cards || !Number.isFinite(n0) ? n0 : list.length;
  const word = doc.count.replace(/^\d+\s*/, '');
  const lede = n === n0 ? doc.lede : doc.lede.replace(/^Access all \d+ (.+?) models? through /, (m, who) => `Access all ${n} ${who} ${n === 1 ? 'model' : 'models'} through `);
  const tokens = cards.map((c) => c.tokens).filter(Boolean);
  const outs = cards.map((c) => c.rate && c.rate.out).filter((v) => v != null);
  const plotted = cards.filter((c) => c.tokens && c.rate).length;
  const paused = usePaused();
  // Hanzo's own models that have a film (public/models/<slug>.webm) lead the shelf as Hanzo's black cards, Enso first
  const films = cards.map((c) => ({ ...c, film: (FILM.exec(c.href || '') || [])[1] })).filter((c) => c.film).slice(0, 4);
  const [hot, setHot] = useState(null);
  const anim = cards.length <= 60; // re-flow by layout only where it stays smooth
  return (
    <main className="xmf xmf-prov">
      <CopyStatus />
      <section className="xmf-launch xmf-maker" aria-labelledby="xmf-h1">
        <div className="xmf-art" aria-hidden="true">
          <Sigil seed={doc.route} data={[n, Math.max(0, ...tokens), outs.length ? Math.min(...outs) : 0, outs.length ? Math.max(...outs) : 0]} className="xmf-sigil" still={paused} />
        </div>
        <div className="x-wrap xmf-launch-in">
          <div className="xmf-maker-g">
            <div className="xmf-launch-t">
              <h1 id="xmf-h1" className={'xmf-name ' + (doc.h1.length <= 24 ? 'm' : 'l')} data-morph-target>
                <span className="x-line"><motion.span className="x-line-in" initial={{ y: '108%' }} animate={{ y: 0 }} transition={{ duration: 1.1, ease: EASE, delay: 0.08 }}>{doc.h1}</motion.span></span>
              </h1>
              {lede && <motion.p className="xmf-lede" {...up(0.3)}>{lede}</motion.p>}
              <motion.div className="xmf-acts" {...up(0.42)}>
                {doc.actions.map((a, i) => <Cta key={a.label} to={a.href} kind={i ? 'link' : 'solid'} id={i ? 'maker.hero.2' : 'maker.hero'} thumb={!i}>{a.label}</Cta>)}
              </motion.div>
            </div>
            {/* the maker's count is the hero figure */}
            <div className="xmf-maker-top">
              <nav className="xmf-crumbs" aria-label="Breadcrumb">
                <span><A to="/models">Models</A></span><span><span className="x-mono" aria-current="page">{doc.name}</span></span>
              </nav>
              <FilmPause />
            </div>
            <motion.p className="xmf-maker-n" {...up(0.2)}>
              <b>{Number.isFinite(n) ? <MaskFig>{n}</MaskFig> : null}</b>
              <span className="x-mono">{Number.isFinite(n) ? word : doc.count}</span>
            </motion.p>
          </div>
          {doc.guest.code && (
            <motion.div className="xmf-guest" {...up(0.5)}>
              <div className="xmf-guest-h">
                {/* spans, not <b>/<code>: each of Hanzo's lines is one plain leaf of text */}
                {doc.guest.title && <span className="xmf-guest-t">{doc.guest.title}</span>}
                {doc.guest.key && <span className="x-mono xmf-guest-k">{doc.guest.key}</span>}
                {doc.guest.note && <span>{doc.guest.note}</span>}
                {doc.guest.prompt && <p>{doc.guest.prompt}</p>}
              </div>
              <div className="xmf-term">
                <div className="xmf-term-h"><span className="x-mono"><i aria-hidden="true" /><span>{doc.guest.label}</span></span><Copy text={doc.guest.code} /></div>
                <pre tabIndex={0}><code>{doc.guest.code.split('\n').map((l, i) => <span key={i} className="xmf-term-l">{l || ' '}{'\n'}</span>)}</code></pre>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {films.length >= 3 && (
        <section className="xmf-films" aria-label={doc.name}>
          <div className="x-wrap">
            <ul data-swipe-own data-cursor="" onPointerLeave={() => setHot(null)}>
              {films.map((c, i) => (
                <li key={c.href} onPointerEnter={() => setHot(c.film)}>
                  <SpecCard to={c.href} slug={c.film} big={!i} play={!i || hot === c.film || (!hot && i === 1)} title={c.name} desc={c.desc} tags={c.ctx ? [c.ctx] : c.tags.slice(0, 1)} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {plotted > 1 && (
        <section className="xmf-sec xmf-among" aria-labelledby="xmf-among-h">
          <div className="x-wrap">
            <header className="xmf-sh">
              <h2 id="xmf-among-h">{doc.name}</h2>
            </header>
            <Field points={cards} here={null} label={`${doc.name} models by context window and output rate`} />
          </div>
        </section>
      )}

      <section className="xmf-sec xmf-shelf" id="shelf">
        <div className="x-wrap">
          <div className="xmf-shelf-bar">
            <div className="xmf-seg" role="group" aria-label="Sort">
              {SORTS.map(([k, t]) => (
                <button key={k} type="button" aria-pressed={sort === k} onClick={() => setSort(k)}>
                  {sort === k && <motion.span layoutId="xmf-seg" className="xmf-seg-bg" transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }} />}
                  <span>{t}</span>
                </button>
              ))}
            </div>
            {mods.length > 1 && (
              <div className="xmf-seg" role="group" aria-label="Modality">
                {['all', ...mods].map((k) => (
                  <button key={k} type="button" aria-pressed={mod === k} onClick={() => setMod(k)}>
                    {mod === k && <motion.span layoutId="xmf-mod" className="xmf-seg-bg" transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }} />}
                    <span>{k === 'all' ? 'All' : k}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
          <LayoutGroup>
            <ul className="xmf-grid">
              {[...shown, ...cards.filter((c) => hidden.has(c.href))].map((c) => (
                <motion.li key={c.href} layout={anim ? 'position' : false} transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }} hidden={hidden.has(c.href)}>
                  <SpecCard className="xmf-row" to={c.href} title={c.name} desc={c.desc} tags={[...(c.ctx ? [c.ctx] : []), ...c.tags]} meta={<><span className="xmf-id">{c.mid || c.id}</span>{c.rate ? <b>{`${money(c.rate.in)} → ${money(c.rate.out)}`}</b> : null}</>} />
                </motion.li>
              ))}
            </ul>
          </LayoutGroup>
        </div>
      </section>

      {doc.band && (
        <section className="xmf-end">
          <Sigil seed={doc.route + '#end'} data={[n, cards.length]} className="xmf-end-sigil" still={paused} />
          <div className="x-wrap">
            <div className="xmf-band">
              <h2>{doc.band.title}</h2>
              {doc.band.lede && <p>{doc.band.lede}</p>}
              <div className="xmf-acts">
                {doc.band.actions.map((a, i) => <Cta key={a.label} to={a.href} kind={i ? 'link' : 'solid'} id={i ? 'maker.band.2' : 'maker.band'}>{a.label}</Cta>)}
              </div>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
