'use client';
/* One integration guide (/integrations/<tool>, 19 of them, one template), at v2: terminal-first, code as the hero.
   The first screen says the guide's promise at display size; under it the hero object is an editor window (it starts
   close and settles as you scroll) whose left pane types the guide's first sample by itself, Hanzo's own lines marked
   in the page's accent, and whose right pane is the connection: Hanzo's base URL to copy, the API key line, and the
   models this guide's code names. The other samples follow as sticky chapters: the words pin while each code card
   wipes in. Then the credit, the one dark room (get started), and the other integrations as cards that open.
   Signature: the typed session. The first sample writes itself into the editor, line by line with a caret, once;
   it is real code from the guide, ready to copy the moment it lands.
   Beyond: "Only the Hanzo lines". One switch, in the editor and beside every chapter, dims every line of every sample
   except the ones that point at Hanzo, with the count, so you can see how little of your code changes.
   Motion: one signature (typing) plus three: the Stage settle and chapter wipes (scroll), the title's masked word
   rise, and the open-card morph to a sibling guide. Nothing else moves.
   V2: 8/10 Display-size promise, a self-typing editor with the connection beside it as the Stage hero, samples as sticky code chapters, siblings as open cards, one accent per guide. */
import { useState } from 'react';
import { Copy } from '../../ui';
import { A } from '../../kit';
import { Loose } from '../models/parts';
import FamLines from '../../v2/FamLines';
import FamStage from '../../v2/FamStage';
import FamChapters from '../../v2/FamChapters';
import FamNext from '../../v2/FamNext';
import { accentAt } from '../../v2/famAccent';
import { Editor, CodeCard, Only } from './intParts';
import './guide.css';

export default function Guide({ doc, emojis }) {
  const [only, setOnly] = useState(false);
  const name = doc.crumbs.length ? doc.crumbs[doc.crumbs.length - 1].label : doc.title;
  const many = JSON.stringify(doc.keyLine || '').includes('400+ models') ? '400+ models' : null;
  const ends = doc.models.length ? doc.models : many ? [many] : [];
  const [first, ...rest] = doc.samples;
  const side = (
    <>
      <div className="xig-route" aria-label={`${name} sends its requests to ${doc.base}${ends.length ? ', naming ' + ends.join(', ') : ''}`}>
        <span className="xig-node"><span className="xig-emo" aria-hidden="true">{doc.emoji}</span>{name}</span>
        <span className="xig-node hub x-mono">{doc.base.replace(/^https:\/\//, '')}</span>
        {ends.length > 0 && <span className="xig-ends">{ends.map((m) => <span key={m} className="xig-node end x-mono">{m}</span>)}</span>}
      </div>
      <div className="xig-cfg">
        <p className="xig-base"><strong>Base URL:</strong> <code className="x-mono">{doc.base}</code><Copy text={doc.base} label="Copy base URL" /></p>
        {doc.keyLine && <p className="xig-key"><Loose nodes={doc.keyLine} /></p>}
      </div>
    </>
  );
  const chapters = rest.map((s, k) => ({
    key: s.title,
    name: s.title,
    text: (
      <div className="xig-ch-t">
        <p className="v2f-kick acc">{String(k + 2).padStart(2, '0')} / {String(doc.samples.length).padStart(2, '0')}</p>
        <h2 className="v2f-head">{s.title}</h2>
        {s.lang && <p className="xig-ch-l x-mono">{s.lang}</p>}
        {s.code && (
          <div className="xig-ch-acts">
            <Copy text={s.code.text} />
            <Only only={only} setOnly={setOnly} code={s.code} />
          </div>
        )}
      </div>
    ),
    visual: <CodeCard sample={s} only={only} Loose={Loose} name={name} />,
  }));
  const near = doc.more ? doc.more.links.map((l) => ({
    href: l.href,
    kicker: (l.emoji || emojis[l.href.split('/').pop()] || '') + (l.tag ? '  ' + l.tag : ''),
    title: l.label,
    meta: l.desc || '',
  })) : [];
  return (
    <main className="v2f xig" style={{ '--acc': accentAt(doc.i) }}>
      <section className="xig-hero" aria-labelledby="xig-h1">
        <div className="v2f-wrap">
          <nav className="xig-crumbs" aria-label="Breadcrumb">
            {doc.crumbs.map((c, i) => <span key={i}>{c.href ? <A to={c.href}>{c.label}</A> : <span aria-current="page">{c.label}</span>}</span>)}
          </nav>
          <p className="xig-badge"><span className="xig-emo" aria-hidden="true">{doc.emoji}</span><span className="v2f-kick acc">{doc.category}</span></p>
          <div className="v2f-grid xig-hero-g">
            <FamLines as="h1" id="xig-h1" text={doc.title} className="v2f-display mid xig-h1" data-morph-target />
            <p className="v2f-lede xig-lede">{doc.lede}</p>
          </div>
          {first && (
            <FamStage className="xig-stage" from={1.06}>
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

      {doc.band && (
        <section className="xig-band" data-room="dark">
          <div className="v2f-wrap v2f-grid xig-band-g">
            <div className="xig-band-t">
              <FamLines as="h2" play="view" text={doc.band.title} className="v2f-display small" />
              {doc.band.lede && <p className="v2f-lede">{doc.band.lede}</p>}
            </div>
            <div className="xig-acts">
              {doc.band.actions.map((a, i) => <A key={a.label} to={a.href} className={'v2f-btn' + (i ? '' : ' acc')} {...(i ? {} : { 'data-thumb': '' })}>{a.label}</A>)}
            </div>
          </div>
        </section>
      )}

      {doc.more && (
        <section className="v2f-sec tight xig-more" aria-labelledby="xig-more-h">
          <div className="v2f-wrap">
            <h2 id="xig-more-h" className="v2f-kick xig-more-h">{doc.more.title}</h2>
            <FamNext items={near} label={doc.more.title} className="xig-next" />
          </div>
        </section>
      )}
    </main>
  );
}
