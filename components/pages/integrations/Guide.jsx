'use client';
/* One integration guide (/integrations/<tool>, 19 of them, one template): code as the hero (Developer type).
   The first screen says the guide's promise with Hanzo's lede, its breadcrumb (the guide's category inside it) and the
   one ask; then the guide's first sample in a window, whole from the first paint, where only Hanzo's own lines type
   themselves in, beside the route to Hanzo's base URL over the guide's own still contour. The window's face follows
   the tool's category, so a swipe to a neighbour lands somewhere new: a light editor for SDKs and frameworks, the same
   editor mirrored for languages, a graphite editor for platforms and editors, and for infrastructure a graphite
   terminal beside the title. The other samples follow as one pinned window whose tab and code change with each
   heading; then the credit, the nearest guides (same category first) as cards that open, and a black close.
   Persona: Developer (MASTER.md 1). Goal: connect this tool to Hanzo with one paste.
   CTA: the guide's own first action (e.g. "Get API key — Free"), in the hero and in the close; data-thumb, so the
   site's ask carries it as soon as the hero's ask has gone. Metric: api_key_created (leading: install_copy).
   Signature: the typed lines. Into an otherwise complete sample, only the lines that point at Hanzo type themselves
   in, once, so you see exactly what changes; stop finishes it, replay types it again.
   Beyond: "Only the Hanzo lines". One switch, in the window and beside every chapter, dims every line of every sample
   except the ones that point at Hanzo, with the count (shown only where it means something).
   Motion, by kind (scroll is two of them): time, the typed lines; idle, a request travelling the route to Hanzo once
   typing is done, and the guide's contour drifting in the close; state, the switch dimming every window at once, the
   window turning to its next tab, the card that opens into a sibling guide; pointer, the magnetic ask and the sibling
   rail that drags with inertia; arrival, the promise's masked rise; scroll, the window settling and the chapters.
   Colour: none of our own (MASTER.md 3.1); the tool's mark is set in type (two letters of its name), never an emoji.
   V2: 8/10 v5: only Hanzo's lines type (no blink, by time not frames), one pinned window that changes tab with the heading, a face per category (light, mirrored, graphite editor, terminal beside the title), ask bar from the moment the hero ask leaves, siblings ranked by category, JSON comments as a caption so Copy parses, phone lines wrap, 44px links, live hanzo.ai type sizes. */
import { useMemo, useState } from 'react';
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
import Logo from './logos';
import './guide.css';

const FACES = { Infrastructure: 'term', 'Platforms & Editors': 'ide', Languages: 'mirror' };

export default function Guide({ doc, emojis }) {
  const [only, setOnly] = useState(false);
  const name = doc.crumbs.length ? doc.crumbs[doc.crumbs.length - 1].label : doc.title;
  const many = JSON.stringify(doc.keyLine || '').includes('400+ models') ? '400+ models' : null;
  const ends = doc.models.length ? doc.models : many ? [many] : [];
  const [first, ...rest] = doc.samples;
  const ask = doc.band && doc.band.actions[0];
  const face = FACES[doc.category] || 'editor';
  const seedData = [doc.samples.length, ends.length, doc.i];
  const side = (
    <>
      <Sigil seed={doc.route} data={seedData} className="xig-sigil" still />
      <div className="xig-route" aria-hidden="true">
        <i className="xig-pulse" />
        <span className="xig-node">{name}</span>
        <span className="xig-node hub x-mono">{doc.base.replace(/^https:\/\//, '')}</span>
        {ends.length > 0 && <span className="xig-ends">{ends.map((m) => <span key={m} className="xig-node end x-mono">{m}</span>)}</span>}
      </div>
      <div className="xig-cfg">
        <p className="xig-base"><strong>Base URL:</strong> <span className="xig-base-u"><code className="x-mono">{doc.base}</code><Copy text={doc.base} label={ui('int_copy_base')} /></span></p>
        {doc.keyLine && <p className="xig-key"><Loose nodes={doc.keyLine} /></p>}
      </div>
    </>
  );
  const tabs = rest.map((s) => s.title);
  const chapters = rest.map((s, k) => ({
    key: s.title,
    name: s.title,
    text: (
      <div className="xig-ch-t">
        <p className="xig-ch-n x-mono" aria-hidden="true"><b>{String(k + 1).padStart(2, '0')}</b> / {String(rest.length).padStart(2, '0')}</p>
        <h2 className="v2f-head">{s.title}</h2>
        {s.lang && <p className="xig-ch-l x-mono">{s.lang}</p>}
        {s.code && <div className="xig-ch-acts"><Only only={only} setOnly={setOnly} code={s.code} /></div>}
      </div>
    ),
    visual: <CodeCard sample={s} only={only} Loose={Loose} name={name} tabs={tabs} at={k} />,
  }));
  // the nearest guides: the same category first, in Hanzo's order
  const near = useMemo(() => {
    if (!doc.more) return [];
    const all = doc.more.links.map((l, k) => {
      const slug = l.href.split('/').pop();
      return { k, href: l.href, title: l.label, preview: l.desc || '', meta: l.tag || '', seed: '/integrations/' + slug, emoji: l.emoji || emojis[slug] || '', same: (l.tag || '').toLowerCase() === (doc.category || '').toLowerCase() };
    });
    return [...all.filter((x) => x.same), ...all.filter((x) => !x.same)];
  }, [doc, emojis]);
  const words = (
    <div className="xig-words">
      <FamLines as="h1" id="xig-h1" text={doc.title} className="v2f-display xig-h1" data-morph-target />
      <div className="xig-hero-r">
        <p className="v2f-lede xig-lede">{doc.lede}</p>
        <nav className="xig-crumbs" aria-label="Breadcrumb">
          {doc.crumbs.map((c, i) => <span key={i}>{c.href ? <A to={c.href}>{c.label}</A> : <span aria-current="page">{c.label}</span>}</span>)}
          {doc.category && <span className="xig-cat">{doc.category}</span>}
        </nav>
        {ask && <Magnetic strength={0.2}><A to={ask.href} className="v2f-btn solid xig-ask" data-thumb="" data-cta="integrations.hero">{ask.label}</A></Magnetic>}
      </div>
    </div>
  );
  const editor = first && <Editor sample={first} only={only} setOnly={setOnly} aside={face === 'term' ? null : side} name={name} face={face} />;
  return (
    <main className={'v2f xig face-' + face}>
      {face === 'term' ? (
        <section className="xig-hero xig-hero-t" aria-labelledby="xig-h1">
          <div className="v2f-wrap v2f-grid xig-hero-tg">
            {words}
            {first && <FamStage className="xig-stage" from={1.04} span={420}>{editor}</FamStage>}
          </div>
          <div className="v2f-wrap xig-term-cfg">{side}</div>
        </section>
      ) : (
        <>
          <section className="xig-hero" aria-labelledby="xig-h1">
            <div className="v2f-wrap">{words}</div>
          </section>
          {first && (
            <section className="xig-stage-s" aria-label={first.title}>
              <div className="v2f-wrap"><FamStage className="xig-stage" from={1.04} span={420}>{editor}</FamStage></div>
            </section>
          )}
        </>
      )}

      {chapters.length > 0 && <FamChapters label={doc.title} items={chapters} className="xig-ch" id="guide" />}

      <section className="v2f-sec tight xig-credit">
        <div className="v2f-wrap v2f-grid xig-credit-g">
          <div className="xig-credit-l">
            <span className="xig-credit-e" aria-hidden="true"><Sigil seed={doc.route + '#credit'} data={seedData} className="xig-credit-s" still /><b><Logo slug={doc.slug} name={name} /></b></span>
            <div>
              {doc.created && <p className="xig-by"><Loose nodes={doc.created} /></p>}
              {doc.license && <p className="xig-lic"><Loose nodes={doc.license} /></p>}
            </div>
          </div>
          {doc.thanks && <p className="v2f-lede xig-thanks">{doc.thanks}</p>}
        </div>
      </section>

      {doc.more && (
        <section className="v2f-sec tight xig-more" aria-labelledby="xig-more-h" data-no-morph>
          <div className="v2f-wrap">
            <FamLines as="h2" id="xig-more-h" play="view" text={doc.more.title} className="v2f-head xig-more-h" />
            <FamNext items={near.slice(0, 6)} label={doc.more.title} className="xig-next" />
            {near.length > 6 && (
              <ul className="xig-rest" aria-label={doc.more.title}>
                {near.slice(6).map((l) => <li key={l.href}><A to={l.href} className="xig-rest-a"><span className="xig-rest-n">{l.title}</span><span className="xig-rest-m" aria-hidden="true">{l.meta}</span><span className="x-sr">{l.emoji}</span></A></li>)}
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
