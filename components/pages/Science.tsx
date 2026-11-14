/* Hanzo Science (/science): the universal research operating system, in six numbered bands. Persona: a researcher or an R&D
   lead deciding whether one platform can carry their work. Goal: see how their field runs on it, then partner or start.
   CTA: Explore Hanzo Science (the first screen), Partner with us (/contact-sales). Metric: cta_click on science.hero.
   Signature: the page is the product at work: the first screen's workspace switches between five research fields and the
   same product re-draws itself (program, models, tools, measures, artifacts, verification); band 01 and 04 carry the three
   workbenches (figure, notebook, literature) and the walkthroughs, each a real window you can use. Everything else is
   static and quiet: the loop, the lab, the graph, the verification, the research document, getting started.
   Every word and figure is Hanzo's (components/pages/scienceData.js); the interactive parts are ScienceWorkspace,
   ScienceBench and ScienceDemos. No price is typed: the commercial editions are named, never priced. */
import type { ReactNode } from 'react';
import { Rise } from '../ui';
import { A, Cta } from '../kit';
import Workspace from './ScienceWorkspace';
import Bench from './ScienceBench';
import { Walkthroughs, Connectors } from './ScienceDemos';
import {
  HERO, BANDS, BENCHES, SECTIONS, UNIVERSAL_LOOP_STAGES, RESEARCH_MODES, THREE_MARKETS, TWENTY_DISCIPLINES, AI_MODEL_LIFECYCLE,
  HANZO_LAB_WORKLOADS, KAI_LATENCY_WALKTHROUGH, HANZO_STACK_MAPPING, SCIENCE_PRODUCT_PILLARS, SPECIALIST_AGENT_ROSTER,
  RESEARCH_PROGRAM_TS_INTERFACE, SCIENCE_API_ENDPOINTS, VERIFICATION_DIMENSIONS, AUTONOMY_MODES, ROLLOUT_PHASES,
  PRODUCTIVITY_METRICS, COMMERCIAL_TIERS, CASE_STUDIES, DOCUMENT, START,
} from './scienceData';
import './Science.css';

const DOC = DOCUMENT as [string, string | string[], string?][]; // scienceData.ts lists [kind, text, link] rows
const Check = () => <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M3.5 8.5l3 3 6-6.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>;

/* a numbered band: the number, the line, one sentence */
interface BandHead {
  id: string;
  num: string;
  title: string;
  lede?: string;
}
function Band({ b, children }: { b: BandHead; children: ReactNode }) {
  return (
    <section id={b.id} className="xsc-band">
      <div className="x-wrap">
        <Rise as="header" className="xsc-bh">
          <span className="x-mono">{b.num}</span>
          <h2>{b.title}</h2>
          {b.lede && <p>{b.lede}</p>}
        </Rise>
        {children}
      </div>
    </section>
  );
}

/* a titled group inside a band: a line, and beside it the small mono note Hanzo sets under it */
function Group({ title, note, lede, id, children }: { title: string; note?: string; lede?: string; id?: string; children: ReactNode }) {
  return (
    <Rise className="xsc-group" id={id}>
      <div className="xsc-gh">
        <h3>{title}</h3>
        {note && <span className="x-mono">{note}</span>}
      </div>
      {lede && <p className="xsc-gl">{lede}</p>}
      {children}
    </Rise>
  );
}

const Code = ({ children, label }: { children: ReactNode; label: string }) => <pre className="xsc-pre" tabIndex={0} aria-label={label}><code><span>{children}</span></code></pre>;

export default function Science() {
  return (
    <div className="xsc">
      <section className="xsc-hero">
        <div className="x-wrap xsc-hg">
          <div className="xsc-hc">
            <p className="x-kick">{HERO.kicker}</p>
            <h1>{HERO.title}</h1>
            <p className="xsc-claim">{HERO.claim}</p>
            <p className="xsc-lede">{HERO.lede}</p>
            <ul className="xsc-pts">{HERO.points.map((p) => <li key={p}><i aria-hidden="true" /><span>{p}</span></li>)}</ul>
            <div className="xsc-acts">
              <Cta to={HERO.acts[0][1]} size="lg" id="science.hero" thumb>{HERO.acts[0][0]}</Cta>
              <Cta to={HERO.acts[1][1]} kind="quiet" size="lg">{HERO.acts[1][0]}</Cta>
              <Cta to={HERO.acts[2][1]} kind="link">{HERO.acts[2][0]}</Cta>
            </div>
          </div>
          <Workspace />
        </div>
        <nav className="x-wrap xsc-nav" aria-label="Hanzo Science">
          {SECTIONS.map((s) => <a key={s.id} href={'#' + s.id}><span className="x-mono">{s.num}</span><span>{s.label}</span></a>)}
        </nav>
      </section>

      {/* 01 */}
      <Band b={BANDS.loop}>
        <Group title="The 6-stage universal research loop — backed by a branching Research Graph" note="Branch competing hypotheses · Run in parallel · Preserve negative results">
          <ol className="xsc-grid c3">
            {UNIVERSAL_LOOP_STAGES.map((s) => (
              <li key={s.step} className="xsc-card"><span className="x-mono xsc-tag">{s.step}</span><h4>{s.title}</h4><p>{s.detail}</p></li>
            ))}
          </ol>
        </Group>
        <Group title="Supports both fundamental discovery and applied R&D">
          <ul className="xsc-grid c2">
            {RESEARCH_MODES.map((m) => (
              <li key={m.title} className="xsc-card">
                <span className="x-mono xsc-tag on">{m.tag}</span><h4>{m.title}</h4><p>{m.summary}</p>
                <p className="x-mono xsc-eg">{m.example}</p><p className="xsc-fine">{m.methods}</p>
              </li>
            ))}
          </ul>
        </Group>
        <Group title="Three markets served simultaneously — one research engine, every scale of discovery">
          <ul className="xsc-grid c3">
            {THREE_MARKETS.map((m) => (
              <li key={m.id} className="xsc-card"><span className="x-mono xsc-tag">{m.id}</span><h4>{m.title}</h4><p className="xsc-strong">{m.buyers}</p><p>{m.value}</p></li>
            ))}
          </ul>
        </Group>
        <Group title="One platform for the full spectrum of research across 20 disciplines" note="Basic science · Applied research · Product engineering · Commercial R&D">
          <ul className="xsc-grid c4 xsc-dense">
            {TWENTY_DISCIPLINES.map((d) => <li key={d.discipline} className="xsc-card"><span data-b>{d.discipline}</span><p>{d.activities}</p></li>)}
          </ul>
        </Group>
        <Group title={BENCHES.figure.title} lede={BENCHES.figure.lede}>
          <Bench id="sc-figure" session="samosa" url />
        </Group>
      </Band>

      {/* 02 */}
      <Band b={BANDS.lab}>
        <Group title="First-class AI model research lifecycle — integrated with MLflow, Ray Tune & Hanzo ML" note="Branch, compare, rerun, or return to any earlier research stage">
          <ol className="xsc-grid c4 xsc-dense xsc-life">
            {AI_MODEL_LIFECYCLE.map((s) => <li key={s.stage} className="xsc-card"><span className="x-mono xsc-tag on">{s.stage}</span><p>{s.focus}</p></li>)}
          </ol>
        </Group>
        <Group title="12 AI research workloads coordinated across the Hanzo laboratory" note="Where Hanzo invents, trains, optimizes & qualifies its own technology">
          <ul className="xsc-grid c4 xsc-dense">
            {HANZO_LAB_WORKLOADS.map((w) => <li key={w.area} className="xsc-card"><span data-b>{w.area}</span><p>{w.support}</p></li>)}
          </ul>
        </Group>
        <Rise className="xsc-two">
          <div className="xsc-card xsc-walk">
            <span className="x-mono xsc-tag">Walkthrough · Science improves Hanzo's own inference architecture</span>
            <h4>Objective: Reduce Kai's high-cardinality multiple-choice inference latency while preserving numerical equivalence, accuracy, and stability</h4>
            <ol>{KAI_LATENCY_WALKTHROUGH.map((w) => <li key={w.step}><span data-b>{w.step}</span><p>{w.detail}</p></li>)}</ol>
            <p className="x-mono xsc-eg">Final artifacts: Experiment report · Benchmark dataset · Source-code diff · Execution logs · Reproducible container · Release recommendation</p>
          </div>
          <div className="xsc-card xsc-map">
            <h4>Mapped directly to Hanzo's existing stack</h4>
            <p>Hanzo Science is the common research orchestration and evidence layer connecting training, code harnesses, inference engines, and team approvals.</p>
            <dl>{HANZO_STACK_MAPPING.map((m) => <div key={m.layer}><dt className="x-mono">{m.layer}</dt><dd>{m.app}</dd></div>)}</dl>
          </div>
        </Rise>
      </Band>

      {/* 03 */}
      <Band b={BANDS.graph}>
        <Rise as="ul" className="xsc-grid c4">
          {SCIENCE_PRODUCT_PILLARS.map((p) => <li key={p.name} className="xsc-card"><h4>{p.name}</h4><p className="x-mono xsc-eg">{p.focus}</p><p>{p.detail}</p></li>)}
        </Rise>
        <Rise className="xsc-two">
          <div className="xsc-card">
            <div className="xsc-gh"><h4>Universal Research Graph — Canonical ResearchProgram Model</h4><span className="x-mono">RO-Crate · CWL · W3C PROV-O</span></div>
            <p>A finding is traceable to a specific analysis, run, dataset, method, environment, and hypothesis. Later results can contradict earlier findings without erasing historical provenance.</p>
            <Code label="ResearchProgram">{RESEARCH_PROGRAM_TS_INTERFACE}</Code>
          </div>
          <div className="xsc-card">
            <h4>Deep integration with the Hanzo agentic harness</h4>
            <dl className="xsc-roster">{SPECIALIST_AGENT_ROSTER.map((a) => <div key={a.agent}><dt className="x-mono">@{a.agent}</dt><dd>{a.role}</dd></div>)}</dl>
            <div className="xsc-gh"><h4>Unified Research Command Interface (Control Plane API)</h4><span className="x-mono">REST & MCP</span></div>
            <Code label="Control Plane API">{SCIENCE_API_ENDPOINTS}</Code>
          </div>
        </Rise>
      </Band>

      {/* 04 */}
      <Band b={BANDS.how}>
        <Walkthroughs />
        <Group title={BENCHES.notebook.title} lede={BENCHES.notebook.lede}>
          <Bench id="sc-notebook" session="scrna" right="notebook" />
        </Group>
        <Group title={BENCHES.literature.title} lede={BENCHES.literature.lede}>
          <Bench id="sc-literature" session="literature" right="artifact" />
          <Connectors />
        </Group>
      </Band>

      {/* 05 */}
      <Band b={BANDS.verify}>
        <Group title="7-dimension scientific verification — never a single unexamined green checkmark">
          <ol className="xsc-grid c4 xsc-dense">
            {VERIFICATION_DIMENSIONS.map((v) => <li key={v.id} className="xsc-card"><span className="x-mono xsc-tag on">{v.id}</span><span data-b>{v.question}</span><p>{v.check}</p></li>)}
          </ol>
        </Group>
        <Group title="4 graduated autonomy modes governed by Kai policy gates">
          <ol className="xsc-grid c4">
            {AUTONOMY_MODES.map((m) => <li key={m.mode} className="xsc-card"><span className="x-mono xsc-tag on">{m.mode}</span><span data-b>{m.summary}</span><p>{m.detail}</p></li>)}
          </ol>
        </Group>
        <Rise className="xsc-two">
          <div className="xsc-card">
            <h4>Phased architecture rollout — validated in Hanzo AI Lab first</h4>
            <ol className="xsc-phases">{ROLLOUT_PHASES.map((p) => <li key={p.phase}><span className="x-mono xsc-tag on">{p.phase}</span><span data-b>{p.capability}</span><p>{p.validation}</p></li>)}</ol>
          </div>
          <div className="xsc-card">
            <h4>Measure research productivity, not raw AI activity</h4>
            <p>The goal is to increase the rate at which researchers generate reliable, validated knowledge—including well-designed negative results that rule out dead ends.</p>
            <ul className="xsc-checks">{PRODUCTIVITY_METRICS.map((m) => <li key={m}><Check /><span>{m}</span></li>)}</ul>
          </div>
        </Rise>
        <Group title="Commercial editions — priced for lower cost per validated scientific result">
          <ul className="xsc-grid c4">
            {COMMERCIAL_TIERS.map((c) => <li key={c.tier} className="xsc-card"><h4>{c.tier}</h4><p className="x-mono xsc-eg">{c.audience}</p><p>{c.includes}</p></li>)}
          </ul>
        </Group>
        <Group id="what-scientists-are-doing" title="Four flagship domain workloads running on Hanzo Science">
          <ul className="xsc-grid c2 xsc-cases">
            {CASE_STUDIES.map((s) => (
              <li key={s.title} className="xsc-card"><span className="x-mono xsc-tag">{s.tag}</span><h4>{s.title}</h4><p>{s.body}</p><p className="x-mono xsc-metric"><Check />{s.metric}</p></li>
            ))}
          </ul>
        </Group>
      </Band>

      {/* the research document */}
      <section className="xsc-band xsc-doc">
        <div className="x-wrap xsc-prose">
          {DOC.map(([k, t, to], i) => {
            if (k === 'h2') return <Rise as="h2" key={i}>{t}</Rise>;
            if (k === 'em') return <p key={i}>{t[0]}<em>{t[1]}</em>{t[2]}</p>;
            if (k === 'a') return <p key={i}><A to={to ?? ''} className="x-arrow">{t}</A></p>;
            return <p key={i}>{t}</p>;
          })}
        </div>
      </section>

      {/* 06 */}
      <Band b={BANDS.start}>
        <Rise as="ul" className="xsc-grid c3 xsc-start">
          {START.map((s) => (
            <li key={s.title} className="xsc-card"><h4>{s.title}</h4><p>{s.text}</p>{s.mono && <p className="x-mono xsc-cmd">{s.mono}</p>}</li>
          ))}
        </Rise>
      </Band>
    </div>
  );
}
