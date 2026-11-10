'use client';
/* The workspace of the first screen: one product, five research fields. Pick a field and the same ResearchProgram card
   re-draws itself (its program, objective, models, tools, measures, provenance-linked artifacts, verification). Tabs and
   panels are the kit's: every field stays in the HTML, the hidden ones hidden. Words and figures are Hanzo's. */
import { useState } from 'react';
import { Tabs, TabPanel } from '../kit';
import { HERO, FLAGSHIP_DOMAINS, GLOBAL_WORKSPACE_NAV } from './scienceData';
import './ScienceWorkspace.css';

export default function Workspace() {
  const [at, setAt] = useState(0);
  const cur = FLAGSHIP_DOMAINS[at];
  return (
    <div className="xsw" data-slot="science-adaptive-workspace-hero">
      <div className="xsw-top">
        <span className="x-mono xsw-title"><svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M8 2 2 5.2l6 3.2 6-3.2L8 2Zm-6 6.3L8 11.5l6-3.2M2 11.1 8 14.3l6-3.2" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" /></svg>{HERO.workspace}</span>
        <span className="x-mono xsw-id">{cur.programId}</span>
      </div>
      <Tabs id="xsw" label="Research field" tabs={FLAGSHIP_DOMAINS.map((d) => d.label)} value={at} onChange={setAt} className="xsw-tabs" />
      <p className="xsw-nav">{GLOBAL_WORKSPACE_NAV.map((n, i) => <span key={n}>{i > 0 ? `· ${n}` : n}</span>)}</p>
      {FLAGSHIP_DOMAINS.map((d, i) => (
        <TabPanel key={d.id} id="xsw" i={i} value={at} className="xsw-card">
          <div className="xsw-row"><span className="xsw-chip">{d.domainBadge}</span><span className="x-mono xsw-stage">{d.loopStage}</span></div>
          <p className="xsw-obj">{d.objective}</p>
          <p className="x-mono xsw-models">{d.models}</p>
          <ul className="xsw-tools">{d.packTools.map((t) => <li key={t} className="x-mono">{t}</li>)}</ul>
          <dl className="xsw-metrics">{d.metrics.map((m) => <div key={m.label}><dt>{m.label}</dt><dd className="x-mono">{m.value}</dd></div>)}</dl>
          <ul className="xsw-arts">{d.artifacts.map((a) => <li key={a.name}><span className="x-mono">{a.name}</span><span className="x-mono">{a.kind} · {a.hash}</span></li>)}</ul>
          <p className="x-mono xsw-ok"><svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><circle cx="8" cy="8" r="6.2" fill="none" stroke="currentColor" strokeWidth="1.3" /><path d="M5.2 8.3l2 2 3.6-4" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>{d.verificationNote}</p>
        </TabPanel>
      ))}
    </div>
  );
}
