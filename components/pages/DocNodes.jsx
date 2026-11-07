'use client';
/* Draws a captured HTML tree (see htmltree.js) in the new design: Hanzo's words as they were, our elements. */
import { useRef, useState } from 'react';
import { A } from '../kit';

const PLAIN = new Set(['p', 'ul', 'ol', 'li', 'strong', 'em', 'b', 'i', 'code', 'blockquote', 'thead', 'tbody', 'tr', 'h4', 'sup', 'sub', 'span', 'small']);

export function CopyLink({ id }) {
  const [ok, setOk] = useState(false);
  const t = useRef(0);
  return (
    <button
      type="button"
      className="xlg-cl"
      aria-label="Copy link to this section"
      onClick={async () => {
        const url = location.origin + location.pathname + '#' + id;
        try { await navigator.clipboard.writeText(url); } catch { /* blocked: the mark still confirms the press */ }
        history.replaceState(null, '', '#' + id);
        setOk(true);
        clearTimeout(t.current);
        t.current = setTimeout(() => setOk(false), 1600);
      }}
    >
      {ok ? (
        <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M3 8.5l3 3 7-7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
      ) : (
        <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M6.8 9.2a2.6 2.6 0 0 0 3.7 0l2-2a2.6 2.6 0 0 0-3.7-3.7l-.6.6M9.2 6.8a2.6 2.6 0 0 0-3.7 0l-2 2a2.6 2.6 0 0 0 3.7 3.7l.6-.6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
      )}
      <span className="xlg-tip" aria-live="polite">{ok ? 'Link copied' : ''}</span>
    </button>
  );
}

const NUM = /^(\d+)\.\s+(.*)$/s;
export function Heading({ n, children, Tag }) {
  const id = n.a && n.a.id;
  return (
    <Tag id={id} className="xlg-hd">
      {children}
      {id && <CopyLink id={id} />}
    </Tag>
  );
}

function Table({ n }) {
  const head = n.c.find((k) => k.t === 'thead');
  const label = head ? head.c.flatMap((r) => r.c).map((h) => (typeof h === 'string' ? h : h.c.join(''))).join(', ') : 'Table';
  return (
    <div className="xlg-tw" tabIndex={0} role="region" aria-label={'Table: ' + label} data-lenis-prevent>
      <table>{n.c.map((k, i) => <Node key={i} n={k} />)}</table>
    </div>
  );
}

export function Node({ n }) {
  if (typeof n === 'string') return n;
  const kids = n.c.map((k, i) => <Node key={i} n={k} />);
  const t = n.t;
  if (t === 'a') {
    const h = n.a && n.a.href;
    if (!h) return <span>{kids}</span>;
    if (h.startsWith('mailto:') || h.startsWith('#') || h.startsWith('tel:')) return <a href={h}>{kids}</a>;
    return <A to={h}>{kids}</A>;
  }
  if (t === 'br') return <br />;
  if (t === 'table') return <Table n={n} />;
  if (t === 'h2' || t === 'h3') return <Heading n={n} Tag={t}>{kids}</Heading>;
  if (t === 'th' || t === 'td') {
    const T = t;
    return <T colSpan={n.a && n.a.colspan ? +n.a.colspan : undefined} scope={t === 'th' ? 'col' : undefined}>{kids}</T>;
  }
  if (PLAIN.has(t)) { const T = t; return <T id={n.a && n.a.id}>{kids}</T>; }
  return <>{kids}</>;
}

export const Nodes = ({ nodes }) => nodes.map((n, i) => <Node key={i} n={n} />);
export const split = (text) => { const m = NUM.exec(text); return m ? [m[1] + '.', m[2]] : [null, text]; };
