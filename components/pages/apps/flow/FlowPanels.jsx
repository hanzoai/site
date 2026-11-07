'use client';
/* FlowPanels (page-local to /flow): the pinned chapters' objects, one per chapter, each built only from that chapter's
   own sentence, so the six steps never reprint the hero's pipeline. Every word here is a fragment of Hanzo's copy.
   01 The library: the palette of component kinds Hanzo lists, joining in turn; the one you write joins last, solid.
   02 Open any node: a node opened to its Python class; the parameter you need is added and it is live on the next run.
   03 Step through it: a chain of ports run one at a time, and the node that caused it opened: received whole, returned
      drawn broken (a strange answer). Not the six-step list: the hero and the playground already tell that.
   04 Multi-agent: several agents on one canvas, conversation state travelling between them, retrieval underneath.
   05 Publish it three ways: a flow, three outputs drawn out of it; the last becomes a tool your coding agent can call.
   06 Keys stay out of the flow: the graph references a variable by name; what you export carries the wiring, not the secrets.
   Each panel plays once when its chapter arrives (keyed, CSS only) and rests on its final frame; reduced motion shows it. */

const LIB = ['Models', 'vector stores', 'document loaders', 'text splitters', 'output parsers', 'memory', 'retrievers', 'toolkits'];
const two = (n) => String(n).padStart(2, '0');

function Library() {
  return (
    <div className="flp flp-lib">
      <ul>
        {LIB.map((t, i) => <li key={t} style={{ '--i': i }}><i aria-hidden="true" /><span>{t}</span></li>)}
        <li className="mine" style={{ '--i': LIB.length }}><i aria-hidden="true" /><span>anything you write yourself</span></li>
      </ul>
    </div>
  );
}

function OpenNode() {
  return (
    <div className="flp flp-open">
      <div className="flp-open-node"><span className="x-mono">02</span><b>text splitters</b></div>
      <i className="flp-open-wire" aria-hidden="true" />
      <div className="flp-open-class">
        <p className="flp-open-h x-mono">Python class</p>
        <p className="flp-open-row"><span>Edit it in the browser</span><em className="flp-caret" aria-hidden="true" /></p>
        <p className="flp-open-row add"><span>the parameter you need</span></p>
        <p className="flp-open-live"><svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M3 8.5 6.5 12 13 4.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>live on the next run</p>
      </div>
    </div>
  );
}

/* 03: not the six-step list again (the hero and the playground tell that). A chain runs one node at a time as unnamed
   ports; one of them is opened as a card, ringed: the node that caused it, with what it received (whole) and what it
   returned (a strange answer, drawn broken) */
function Steps() {
  return (
    <div className="flp flp-steps">
      <div className="flp-chain" aria-hidden="true">
        {[0, 1, 2, 3].map((k) => <i key={k} style={{ '--i': k }} className={k === 3 ? 'at' : ''} />)}
      </div>
      <div className="flp-cause">
        <p className="flp-cause-h"><i aria-hidden="true" />the node that caused it</p>
        <p className="flp-cause-row x-mono"><span>received</span><b className="ok" aria-hidden="true" /></p>
        <p className="flp-cause-row x-mono"><span>returned</span><b className="bad" aria-hidden="true"><i /><i /><i /></b></p>
        <p className="flp-cause-k">a strange answer</p>
      </div>
    </div>
  );
}

function Agents() {
  return (
    <div className="flp flp-agents">
      <div className="flp-agents-row" aria-hidden="true">
        <span className="flp-agent a" /><span className="flp-agent b" /><span className="flp-agent c" />
        <i className="flp-msg m1" /><i className="flp-msg m2" />
      </div>
      <p className="flp-agents-k x-mono">conversation state between them</p>
      <div className="flp-agents-ret"><i aria-hidden="true" /><i aria-hidden="true" /><i aria-hidden="true" /><span className="x-mono">retrieval underneath</span></div>
    </div>
  );
}

function Publish() {
  return (
    <div className="flp flp-pub">
      <div className="flp-pub-src"><b>a flow</b></div>
      <ul>
        <li style={{ '--i': 0 }}><i aria-hidden="true" /><b className="x-mono">REST endpoint</b></li>
        <li style={{ '--i': 1 }}><i aria-hidden="true" /><b className="x-mono">JSON</b></li>
        <li style={{ '--i': 2 }}><i aria-hidden="true" /><b className="x-mono">MCP server</b><span>a tool your coding agent can call</span></li>
      </ul>
    </div>
  );
}

function Keys() {
  return (
    <div className="flp flp-keys">
      <div className="flp-keys-graph">
        {[1, 2, 3].map((k) => <span key={k} className="flp-keys-n x-mono" aria-hidden="true"><i />{two(k)}</span>)}
        <p className="flp-keys-ref x-mono">references by name</p>
      </div>
      <i className="flp-keys-arrow" aria-hidden="true" />
      <div className="flp-keys-out">
        <p className="flp-keys-h x-mono">a flow you export or share</p>
        <p className="flp-keys-row ok"><svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M3 8.5 6.5 12 13 4.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>the wiring</p>
        <p className="flp-keys-row no"><span className="flp-dots" aria-hidden="true">••••••••</span>not the secrets</p>
      </div>
    </div>
  );
}

const PANELS = [Library, OpenNode, Steps, Agents, Publish, Keys];

export default function FlowPanel({ at, compact = false }) {
  const P = PANELS[at] || Library;
  // keyed by chapter, so each panel plays once as its chapter arrives
  return <div key={at} className={'flp-board' + (compact ? ' compact' : '')}><P /></div>;
}
