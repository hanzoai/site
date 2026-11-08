'use client';
/* Pieces every creative model's first screen is built from: its head (kind, version, line, actions), the studio
   window its demo lives in (studio.hanzo.ai / <model>), the three spec rows, and the live glyph each model's lists
   wear (a tiny loop in that model's medium). Each model arranges them its own way. */
import { A } from '../../kit';
import { C } from './creativeData';

export function CHead({ slug, dark, split, className = '' }) {
  const d = C[slug];
  const top = (
    <>
      <p className="mb-kick cr-kind">{d.kind}</p>
      <p className="cr-ver">{d.ver}</p>
      <h2 className="mb-h cr-h">{d.head}</h2>
    </>
  );
  const rest = (
    <>
      <p className="mb-lede">{d.desc}</p>
      <div className="mb-acts">
        <A to={'/research-access?models=' + slug} className="x-btn solid" data-thumb="Request access">Request access</A>
        <A to="/design" className="x-btn">Try it in Design</A>
      </div>
    </>
  );
  return (
    <div className={'cr-head' + (dark ? ' dark' : '') + (split ? ' split' : '') + ' ' + className}>
      {split ? <><div className="cr-head-a">{top}</div><div className="cr-head-b">{rest}</div></> : <>{top}{rest}</>}
    </div>
  );
}

export function Studio({ slug, children, specs, engine, className = '' }) {
  return (
    <figure className={'cr-studio ' + className}>
      <div className="mb-panel">
        <div className="mb-bar"><i /><i /><i /><b><span style={{ color: 'inherit' }}>studio.hanzo.ai /</span> <span>{C[slug].code}</span></b><em>{slug}</em><em>example</em></div>
        {children}
        {engine && <p className="cr-engine mb-mono">{engine}</p>}
        {specs && <Specs rows={specs} />}
      </div>
      <figcaption className="mb-cap">An example of the canvas in Hanzo Design. Generation runs on Hanzo Cloud.</figcaption>
    </figure>
  );
}

export function Specs({ rows }) {
  return (
    <dl className="mb-specs">
      {rows.map(([dt, v, w]) => <div key={dt}><dt>{dt}</dt><dd>{v}</dd><dd>{w}</dd></div>)}
    </dl>
  );
}

export function Glyph({ k, i = 0 }) {
  return <span className={'cr-g cr-g-' + k} style={{ '--i': i }} aria-hidden="true"><i /><i /><i /><i /><i /></span>;
}
