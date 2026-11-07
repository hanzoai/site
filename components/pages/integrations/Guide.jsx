'use client';
/* One integration guide (/integrations/<tool>, 19 of them, one template): terminal-first, code as the hero
   (Developer archetype). The first screen says the guide's promise at display size, with Hanzo's lede, the tool's badge
   and the one ask beside it; under it the hero object is an editor window, whole on the first screen, whose left pane
   types the guide's first sample by itself (Hanzo's own lines marked in the gutter) and whose right pane is the
   connection: the route to Hanzo's base URL over the guide's own still contour, the base URL to copy and the API key
   line. The other samples follow as sticky code chapters; then the credit, the other integrations as cards that open,
   and a dark close with the guide's contour drifting behind Hanzo's "Ready to …" and its one ask.
   Persona: Developer (PLAN-COMPONENTS 1.1). Goal: connect this tool to Hanzo with one paste.
   CTA: the guide's own first action (e.g. "Get API Key"), in the hero and in the close; data-thumb, so the site's ask
   bar carries it after the hero. Metric: api_key_created (leading: install_copy).
   Signature: the typed session. The first sample writes itself into the editor, line by line with a caret, once;
   it is real code from the guide, ready to copy the moment it lands.
   Beyond: "Only the Hanzo lines". One switch, in the editor and beside every chapter, dims every line of every sample
   except the ones that point at Hanzo, with the count, so you can see how little of your code changes.
   Motion, by kind (scroll is two of them): time, the typing; state, the switch dimming every window at once and the
   card that opens into a sibling guide; pointer, the magnetic ask and the sibling rail that drags with inertia (a
   hovered card shows Hanzo's own line for it); idle, the guide's contour drifting in the close; arrival, the promise's
   masked rise; scroll, the editor settling and the chapters wiping.
   Colour: none of our own (JAMES.md 7): code by weight and grey step; the tools' own badges are their only colour.
   V2: 8/10 v3: editor whole on the first screen with the ask beside the promise, no labels above headings (badge and crumbs under the lede), 0 hues in code and UI, icon controls named from the register, own Sigil per guide, siblings before a dark close. */
import { useState } from 'react';
import { Copy, Magnetic } from '../../ui';
import { A } from '../../kit';
import Sigil from '../../Sigil';
import { Loose } from '../models/parts';
import FamLines from '../../v2/FamLines';
import FamStage from '../../v2/FamStage';
import FamChapters from '../../v2/FamChapters';
import FamNext from '../../v2/FamNext';
import { ui } from '../../v2/famUi';
import { Editor, CodeCard, Only } from './intParts';
import './guide.css';

export default function Guide({ doc, emojis }) {
  const [only, setOnly] = useState(false);
  const name = doc.crumbs.length ? doc.crumbs[doc.crumbs.length - 1].label : doc.title;
  const many = JSON.stringify(doc.keyLine || '').includes('400+ models') ? '400+ models' : null;
  const ends = doc.models.length ? doc.models : many ? [many] : [];
  const [first, ...rest] = doc.samples;
  const ask = doc.band && doc.band.actions[0];
  const seedData = [doc.samples.length, ends.length, doc.i];
  const side = (
    <>
      <Sigil seed={doc.route} data={seedData} className="xig-sigil" still />
      <div className="xig-route" aria-hidden="true">
        <span className="xig-node"><span className="xig-emo">{doc.emoji}</span>{name}</span>
        <span className="xig-node hub x-mono">{doc.base.replace(/^https:\/\//, '')}</span>
        {ends.length > 0 && <span className="xig-ends">{ends.map((m) => <span key={m} className="xig-node end x-mono">{m}</span>)}</span>}
      </div>
      <div className="xig-cfg">
        <p className="xig-base"><strong>Base URL:</strong> <code className="x-mono">{doc.base}</code><Copy text={doc.base} label={ui('int_copy_base')} /></p>
        {doc.keyLine && <p className="xig-key"><Loose nodes={doc.keyLine} /></p>}
      </div>
    </>
  );
  const chapters = rest.map((s) => ({
    key: s.title,
    name: s.title,
    text: (
      <div className="xig-ch-t">
        <h2 className="v2f-head">{s.title}</h2>
        {s.lang && <p className="xig-ch-l x-mono">{s.lang}</p>}
        {s.code && <div className="xig-ch-acts"><Only only={only} setOnly={setOnly} code={s.code} /></div>}
      </div>
    ),
    visual: <CodeCard sample={s} only={only} Loose={Loose} name={name} />,
  }));
  const near = doc.more ? doc.more.links.map((l) => {
    const slug = l.href.split('/').pop();
    return { href: l.href, title: l.label, preview: l.desc || '', meta: [l.emoji || emojis[slug] || '', l.tag].filter(Boolean).join('  '), seed: '/integrations/' + slug };
  }) : [];
  return (
    <main className="v2f xig">
      <section className="xig-hero" aria-labelledby="xig-h1">
        <div className="v2f-wrap">
          <div className="v2f-grid xig-hero-g">
            <FamLines as="h1" id="xig-h1" text={doc.title} className="v2f-display mid xig-h1" data-morph-target />
            <div className="xig-hero-r">
              <p className="v2f-lede xig-lede">{doc.lede}</p>
              <div className="xig-meta">
                <span className="xig-badge"><span className="xig-emo" aria-hidden="true">{doc.emoji}</span><span className="v2f-kick">{doc.category}</span></span>
                <nav className="xig-crumbs" aria-label="Breadcrumb">
                  {doc.crumbs.map((c, i) => <span key={i}>{c.href ? <A to={c.href}>{c.label}</A> : <span aria-current="page">{c.label}</span>}</span>)}
                </nav>
              </div>
              {ask && <Magnetic strength={0.2}><A to={ask.href} className="v2f-btn solid xig-ask" data-thumb="" data-cta="integrations.hero">{ask.label}</A></Magnetic>}
            </div>
          </div>
          {first && (
            <FamStage className="xig-stage" from={1.05} span={460}>
              <Editor sample={first} only={only} setOnly={setOnly} aside={side} name={name} />
            </FamStage>
          )}
        </div>
      </section>

      {chapters.length > 0 && <FamChapters label={doc.title} items={chapters} className="xig-ch" id="guide" />}

      <section className="v2f-sec tight xig-credit">
        <div className="v2f-wrap v2f-grid xig-credit-g">
          <div className="xig-credit-l">
            <span className="xig-credit-e" aria-hidden="true">{doc.emoji}</span>
            <div>
              {doc.created && <p className="xig-by"><Loose nodes={doc.created} /></p>}
              {doc.license && <p className="xig-lic"><Loose nodes={doc.license} /></p>}
            </div>
          </div>
          {doc.thanks && <p className="v2f-lede xig-thanks">{doc.thanks}</p>}
        </div>
      </section>

      {doc.more && (
        <section className="v2f-sec tight xig-more" aria-labelledby="xig-more-h">
          <div className="v2f-wrap">
            <FamLines as="h2" id="xig-more-h" play="view" text={doc.more.title} className="v2f-head xig-more-h" />
            <FamNext items={near.slice(0, 6)} label={doc.more.title} className="xig-next" />
            {near.length > 6 && (
              <ul className="xig-rest" aria-label={doc.more.title}>
                {near.slice(6).map((l) => <li key={l.href}><A to={l.href} className="xig-rest-a"><span className="xig-rest-n">{l.title}</span><span className="xig-rest-m" aria-hidden="true">{l.meta}</span></A></li>)}
              </ul>
            )}
          </div>
        </section>
      )}

      {doc.band && (
        <section className="x-band xig-band" data-room="dark" aria-labelledby="xig-band-h">
          <Sigil seed={doc.route + '#close'} data={seedData} className="xig-band-s" />
          <div className="v2f-wrap v2f-grid xig-band-g">
            <div className="xig-band-t">
              <FamLines as="h2" id="xig-band-h" play="view" text={doc.band.title} className="v2f-display small" />
              {doc.band.lede && <p className="v2f-lede">{doc.band.lede}</p>}
            </div>
            <div className="xig-acts">
              {doc.band.actions.map((a, i) => <A key={a.label} to={a.href} className={'v2f-btn' + (i ? ' ghost' : ' light')} {...(i ? {} : { 'data-cta': 'integrations.close' })}>{a.label}</A>)}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
