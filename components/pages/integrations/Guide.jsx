'use client';
/* One integration guide (/integrations/<tool>, 19 of them, one template). The first screen is this tool's own
   connection: its badge, Hanzo's base URL and the models its own code names, wired together over a contour field
   seeded from its name and its samples' sizes.
   Signature: the connection draws itself. Your tool, then api.hanzo.ai/v1, then each model the guide's code calls;
   the wires draw in order and requests keep travelling them while the diagram is on screen.
   Beyond: "Only the Hanzo lines". One switch dims every line of a sample except the ones that point at Hanzo, with
   the count, so you can see how little of your code changes. */
import { motion } from 'motion/react';
import { EASE, Copy } from '../../ui';
import { A } from '../../kit';
import Sigil from '../../Sigil';
import { Loose } from '../models/parts';
import { Connection, Viewer } from './intParts';
import './integrations.css';

const up = (d) => ({ initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.9, ease: EASE, delay: d } });

export default function Guide({ doc, emojis }) {
  const name = doc.crumbs.length ? doc.crumbs[doc.crumbs.length - 1].label : doc.title;
  const many = JSON.stringify(doc.keyLine || '').includes('400+ models') ? '400+ models' : null;
  const ends = doc.models.length ? doc.models : many ? [many] : [];
  const sizes = doc.samples.filter((s) => s.code).map((s) => s.code.lines.length);
  return (
    <main className="xin xin-guide">
      <section className="xin-hero" aria-labelledby="xin-h1">
        <Sigil seed={doc.route} data={[...sizes, ends.length]} className="xin-sigil" />
        <div className="x-wrap xin-hero-g">
          <div>
            <motion.nav className="xin-crumbs" aria-label="Breadcrumb" {...up(0)}>
              {doc.crumbs.map((c, i) => <span key={i}>{c.href ? <A to={c.href}>{c.label}</A> : <span aria-current="page">{c.label}</span>}</span>)}
            </motion.nav>
            <motion.p className="xin-badge" {...up(0.05)}><span className="xin-emo" aria-hidden="true">{doc.emoji}</span><span className="x-mono">{doc.category}</span></motion.p>
            <h1 id="xin-h1" className="xin-h1" data-morph-target>
              <span className="x-line"><motion.span className="x-line-in" initial={{ y: '105%' }} animate={{ y: 0 }} transition={{ duration: 1.1, ease: EASE, delay: 0.08 }}>{doc.title}</motion.span></span>
            </h1>
            <motion.p className="xin-lede" {...up(0.28)}>{doc.lede}</motion.p>
            <motion.div className="xin-cfg" {...up(0.4)}>
              <p className="xin-base"><strong>Base URL:</strong> <code className="x-mono">{doc.base}</code><Copy text={doc.base} label="Copy base URL" /></p>
              {doc.keyLine && <p className="xin-key"><Loose nodes={doc.keyLine} /></p>}
            </motion.div>
          </div>
          <motion.div className="xin-hero-d" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: EASE, delay: 0.15 }}>
            <Connection emoji={doc.emoji} name={name} base={doc.base} models={ends} />
          </motion.div>
        </div>
      </section>

      <section className="xin-credit">
        <div className="x-wrap xin-credit-g">
          <span className="xin-credit-e" aria-hidden="true">{doc.emoji}</span>
          <div>
            {doc.created && <p className="xin-by"><Loose nodes={doc.created} /></p>}
            {doc.license && <p className="xin-lic"><Loose nodes={doc.license} /></p>}
          </div>
          {doc.thanks && <p className="xin-thanks">{doc.thanks}</p>}
        </div>
      </section>

      <section className="x-sec xin-code" id="guide">
        <div className="x-wrap"><Viewer samples={doc.samples} Loose={Loose} /></div>
      </section>

      {doc.band && (
        <section className="xin-band" data-room="dark">
          <div className="x-wrap xin-band-g">
            <div>
              <h2>{doc.band.title}</h2>
              {doc.band.lede && <p>{doc.band.lede}</p>}
            </div>
            <div className="xin-acts">
              {doc.band.actions.map((a, i) => <A key={a.label} to={a.href} className={'x-btn' + (i ? '' : ' solid')} {...(i ? {} : { 'data-thumb': '' })}>{a.label}</A>)}
            </div>
          </div>
        </section>
      )}

      {doc.more && (
        <section className="xin-more">
          <div className="x-wrap">
            <h2 className="xin-h3">{doc.more.title}</h2>
            <ul>
              {doc.more.links.map((l) => (
                <li key={l.href}><A to={l.href}><span className="xin-emo" aria-hidden="true">{emojis[l.href.split('/').pop()] || '·'}</span><span data-morph>{l.label}</span></A></li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </main>
  );
}
