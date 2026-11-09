'use client';
import { useId, useRef, useState } from 'react';
import C from '../content';
import { Copy, Mark } from './ui';
import { MCP_URL, KEY_URL, DOCS, ways, clients, entry } from '../lib/mcp';
import { capture } from '../lib/track';

const ICON = Object.fromEntries(C.agents.map((a) => [a.name, a.icon]));

/* `like this` in a sentence is code */
const Rich = ({ text }) => text.split('`').map((t, i) => (i % 2 ? <code key={i} className="x-mono">{t}</code> : t));

/* A radio group: one stop in the tab order, the arrows move the choice. */
function Choice({ label, items, value, onPick, className = '' }) {
  const id = useId();
  const box = useRef(null);
  const key = (e) => {
    const k = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
    if (!k) return;
    e.preventDefault();
    const i = items.findIndex((it) => it.id === value);
    const next = items[(i + k + items.length) % items.length];
    onPick(next.id);
    requestAnimationFrame(() => box.current.querySelector('[aria-checked=true]')?.focus());
  };
  return (
    <div className="x-mcp-row">
      <div className="x-mcp-k" id={id}>{label}</div>
      <div className={'x-mcp-seg ' + className} role="radiogroup" aria-labelledby={id} ref={box} onKeyDown={key}>
        {items.map((it) => (
          <button
            key={it.id}
            type="button"
            role="radio"
            aria-checked={it.id === value}
            tabIndex={it.id === value ? 0 : -1}
            className="x-mcp-chip"
            onClick={() => onPick(it.id)}
          >
            {it.icon && <span className="x-mcp-i" aria-hidden="true" dangerouslySetInnerHTML={{ __html: it.icon }} />}
            <span>{it.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

/* "Connect your client": the way to connect, the client, then the exact file or command with a Copy button.
   What each client takes lives in lib/mcp.js; a client whose way is not available says so and offers the way that is. */
export default function McpPicker() {
  const how = ways();
  const [way, setWay] = useState(how.find((w) => w.id === 'key')?.id ?? how[0].id);
  const list = clients(how).filter((c) => c.id !== 'dev');
  const [pick, setPick] = useState('claude-code');
  const client = list.find((c) => c.id === pick) ?? list[0];
  const mine = entry(client, way);
  const other = how.find((w) => entry(client, w.id));


  return (
    <div className="x-panel x-mcp" id="mcp" data-hz-view="mcp-clients">
      <div className="x-panel-h"><Mark size={14} /> <b>Hanzo.MCP</b></div>
      <p className="x-mcp-lede">
        Connect your client to <code className="x-mono">{MCP_URL.replace('https://', '')}</code>. Pick how to connect, then your client.
      </p>
      <Choice label="Connect with" items={how.map((w) => ({ id: w.id, name: w.name }))} value={way} onPick={setWay} />
      <Choice label="Client" items={list.map((c) => ({ id: c.id, name: c.name, icon: ICON[c.icon] }))} value={client.id} onPick={setPick} className="clients" />
      <div className="x-mcp-out" role="group" aria-live="polite" aria-label={`${client.name}: ${how.find((w) => w.id === way).name}`}>
        {mine ? (
          <>
            <p className="x-mcp-hint"><Rich text={mine.hint} /></p>
            <div className="x-mcp-code">
              <pre className="x-mono" tabIndex={0}><code>{mine.code}</code></pre>
              <Copy text={mine.code} label="Copy" onCopy={() => capture('home_copied', { block: 'mcp', client: client.id, way })} />
            </div>
            <div className="x-mcp-foot">
              {way === 'key' && <a href={KEY_URL} target="_blank" rel="noopener noreferrer">Get a key at hanzo.app ↗</a>}
              {way === 'local' && <span className="x-dim">Run <code className="x-mono">hanzo login</code> once. The server uses that sign-in.</span>}
              <a href={mine.from} target="_blank" rel="noopener noreferrer">{client.name} docs ↗</a>
              {client.page && <a href={DOCS + client.page} target="_blank" rel="noopener noreferrer">Hanzo guide ↗</a>}
            </div>
          </>
        ) : (
          <p className="x-mcp-hint">
            <Rich text={`${client.name} ${client.none?.[way] ?? 'does not take this way'}.`} />{' '}
            {other && <button type="button" className="x-mcp-link" onClick={() => setWay(other.id)}>Use {other.name} instead</button>}
          </p>
        )}
      </div>
    </div>
  );
}
