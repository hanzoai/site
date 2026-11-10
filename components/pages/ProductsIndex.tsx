'use client';
/* /products: Hanzo OS, the seven layers a company runs on. Persona: a founder or developer deciding where to begin.
   Goal: open one layer, or the platform. CTA: Open the platform (the first screen and the close), in Hanzo's words.
   Metric: cta_click on products.hero. Signature: the stack is the page: Hanzo OS drawn as a window of its own layers,
   the company on top and the machines at the foot, the Record beside them as the rail (dashed, as Hanzo draws it);
   a row lights under the pointer and carries you to that layer. Everything below it is quiet: the logos Hanzo shows
   (inverted to white marks in dark), the four pages of the OS at work, and the two closing actions.
   Every word, link and picture is Hanzo's (components/pages/productsIndexData.js reads it from the captured page). */
import { Rise } from '../ui';
import { A, Cta } from '../kit';
import './ProductsIndex.css';

function Layers({ title, layers }) {
  const rail = layers[layers.length - 1];
  const rows = layers.slice(0, -1);
  const row = (l, k) => (
    <A to={l.href} className={'xpi-row' + (k === 'rail' ? ' rail' : '')}>
      <b>{l.name}</b>
      <span>{l.line}</span>
    </A>
  );
  return (
    <figure className="xpi-win">
      <figcaption className="xpi-bar" aria-hidden="false">
        <span className="xpi-dots" aria-hidden="true"><i /><i /><i /></span>
        <span className="xpi-title">{title}</span>
      </figcaption>
      <nav className="xpi-stack" aria-label={title}>
        <ol>{rows.map((l) => <li key={l.href}>{row(l)}</li>)}</ol>
        {row(rail, 'rail')}
      </nav>
    </figure>
  );
}

export default function ProductsIndex({ d }) {
  return (
    <div className="xpi">
      <section className="xpi-hero">
        <div className="x-wrap xpi-grid">
          <div className="xpi-copy">
            <p className="x-kick">{d.kicker}</p>
            <h1>{d.title}</h1>
            <p className="xpi-lede">{d.lede}</p>
            <div className="xpi-acts">
              <Cta to={d.acts[0].href} size="lg" id="products.hero" thumb>{d.acts[0].label}</Cta>
              <Cta to={d.acts[1].href} kind="quiet" size="lg">{d.acts[1].label}</Cta>
            </div>
          </div>
          <Layers title={d.window} layers={d.layers} />
        </div>
      </section>

      <section className="xpi-sec">
        <div className="x-wrap">
          <Rise className="xpi-head">
            <h2>{d.backed.title}</h2>
            <p>{d.backed.lede}</p>
          </Rise>
          <Rise delay={0.1} className="xpi-by">
            <p className="x-kick">{d.backed.eyebrow}</p>
            <ul className="xpi-logos">
              {d.backed.logos.map((l) => (
                <li key={l.href}>
                  <A to={l.href} aria-label={l.alt.replace(/ logo$/, '')}>
                    <img src={l.src} alt={l.alt} height={l.h} loading="lazy" decoding="async" style={{ height: Math.min(l.h, 44) }} />
                  </A>
                </li>
              ))}
            </ul>
          </Rise>
        </div>
      </section>

      <section className="xpi-sec">
        <div className="x-wrap">
          <Rise className="xpi-head">
            <h2>{d.work.title}</h2>
            <p>{d.work.lede}</p>
          </Rise>
          <Rise delay={0.1} className="xpi-work">
            {d.work.links.map((l) => <A key={l.href} to={l.href} className="xpi-more">{l.label} →</A>)}
          </Rise>
        </div>
      </section>

      <section className="xpi-sec xpi-end">
        <div className="x-wrap xpi-acts">
          <Cta to={d.close[0].href} size="lg">{d.close[0].label}</Cta>
          <Cta to={d.close[1].href} kind="quiet" size="lg">{d.close[1].label}</Cta>
        </div>
      </section>
    </div>
  );
}
