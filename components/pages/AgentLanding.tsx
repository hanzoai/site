'use client';
/* /agent: the signed-out Hanzo Agent landing (the signed-in door stays in the app). Persona: a developer or a founder
   who wants an agent of their own. Goal: create one, or install the SDK. CTA: Create Agent (hero, in Hanzo's words),
   again in "Create your first agent". Metric: cta_click on agent.hero and agent.close.
   Signature: a console that plays the first request once, by itself: Hanzo's three turns light one after another
   (the ask, what the agent read, what it wrote), then rest on the last; a turn you press takes the console over and
   holds it where you put it. Below it: the prompt to paste into any agent, how Hanzo Agent works in three steps, the six
   capabilities, the SDK example, the close, the crew (one tile per agent, each a door into a room with that agent)
   and where to get it. The create and sign-in doors are the app's: A sends them to hanzo.app.
   Every word, link and picture is Hanzo's (components/pages/agentLandingData.js reads it from the captured page). */
import { useEffect, useRef, useState } from 'react';
import { useInView } from 'motion/react';
import { Rise } from '../ui';
import { A, Cta, CodeBlock } from '../kit';
import './AgentLanding.css';

const READ = 3200; // how long each turn holds the light, ms

function Console({ c }) {
  const box = useRef(null);
  const seen = useInView(box, { amount: 0.5 });
  const [step, setStep] = useState(0);
  const [held, setHeld] = useState(false);
  useEffect(() => { // once, by itself: turn 1, 2, 3, then it rests there
    if (!seen || held || step >= c.turns.length - 1) return;
    const t = setTimeout(() => setStep((s) => s + 1), READ);
    return () => clearTimeout(t);
  }, [seen, held, step, c.turns.length]);
  return (
    <figure className="xal-con" ref={box}>
      <div className="xal-win">
        <div className="xal-bar"><span className="xal-dots" aria-hidden="true"><i /><i /><i /></span><span className="xal-wt">{c.title}</span></div>
        <div className="xal-body">
          <nav aria-label={c.title}>
            {c.nav.map((n) => <A key={n.href} to={n.href} aria-current={n.current ? 'page' : undefined}><em>{n.label}</em></A>)}
          </nav>
          <ol className="xal-turns">
            {c.turns.map((t, i) => (
              <li key={i} className={i === 0 ? 'you' : 'agent'}>
                <button type="button" data-on={i === step ? '' : undefined} data-past={i < step ? '' : undefined} onClick={() => { setHeld(true); setStep(i); }}>{t}</button>
              </li>
            ))}
          </ol>
        </div>
        <div className="xal-foot">
          <code className="x-mono">{c.endpoint}</code>
          <A to={c.open.href} className="xal-open"><span>{c.open.label}</span> <i aria-hidden="true">↗</i></A>
        </div>
      </div>
      <figcaption>{c.caption}</figcaption>
    </figure>
  );
}

function Head({ h, level = 2 }) {
  const H = 'h' + level;
  return (
    <Rise className="xal-head">
      {h.eyebrow && <p className="x-kick">{h.eyebrow}</p>}
      <H>{h.title}</H>
      {h.lede && <p className="xal-hl">{h.lede}</p>}
    </Rise>
  );
}

export default function AgentLanding({ d }) {
  const { fold, paste, how, caps, sdk, close, crew, get } = d;
  return (
    <div className="xal">
      <section className="xal-hero">
        <div className="x-wrap xal-grid">
          <div className="xal-copy">
            <p className="x-kick">{fold.label}</p>
            <h1>{fold.h1}</h1>
            <p className="xal-lede">{fold.lede[0]}{fold.lede[1] && <span> {fold.lede[1]}</span>}</p>
            <div className="xal-acts">
              <Cta to={fold.actions[0].href} size="lg" id="agent.hero" thumb>{fold.actions[0].label}</Cta>
              <Cta to={fold.actions[1].href} kind="quiet" size="lg">{fold.actions[1].label}</Cta>
            </div>
            <p className="xal-note">{fold.note}</p>
            <div className="xal-through">
              <span className="x-kick">{fold.through[0]}</span>
              {fold.through.slice(1).map((t) => <span key={t} className="xal-chip">{t}</span>)}
            </div>
          </div>
          <Console c={fold.console} />
        </div>
      </section>

      <section className="xal-sec">
        <div className="x-wrap xal-paste">
          <Rise className="xal-head">
            <p className="x-kick">{paste.eyebrow}</p>
            <p className="xal-hl">{paste.lede}</p>
          </Rise>
          <Rise delay={0.1}><CodeBlock code={paste.prompt} label={paste.label} /></Rise>
        </div>
      </section>

      <section className="xal-sec">
        <div className="x-wrap">
          <Head h={how} />
          <ol className="xal-steps">
            {how.cards.map((c, i) => (
              <Rise as="li" key={c.n} delay={i * 0.08}>
                <span className="xal-n x-mono">{c.n}</span>
                <h3>{c.title}</h3>
                <p>{c.text}</p>
              </Rise>
            ))}
          </ol>
        </div>
      </section>

      <section className="xal-sec">
        <div className="x-wrap">
          <Head h={caps} />
          <ul className="xal-caps">
            {caps.cards.map((c, i) => (
              <Rise as="li" key={c.title} delay={(i % 3) * 0.08}>
                <h3>{c.title}</h3>
                <p>{c.text}</p>
              </Rise>
            ))}
          </ul>
        </div>
      </section>

      <section className="xal-sec">
        <div className="x-wrap xal-sdk">
          <Head h={sdk} />
          <Rise delay={0.1}><CodeBlock code={sdk.code} label={sdk.lang} /></Rise>
          <div className="xal-acts">
            <Cta to={sdk.actions[0].href} size="lg">{sdk.actions[0].label}</Cta>
            <Cta to={sdk.actions[1].href} kind="quiet" size="lg">{sdk.actions[1].label}</Cta>
          </div>
        </div>
      </section>

      <section className="xal-close" data-room="dark">
        <div className="x-wrap">
          <Rise>
            <h2>{close.title}</h2>
            <p>{close.lede}</p>
            <div className="xal-acts">
              <Cta to={close.actions[0].href} size="lg" id="agent.close">{close.actions[0].label}</Cta>
              <Cta to={close.actions[1].href} kind="quiet" size="lg">{close.actions[1].label}</Cta>
            </div>
          </Rise>
        </div>
      </section>

      <section id="crew" className="xal-sec">
        <div className="x-wrap">
          <Head h={crew} />
          <ul className="xal-crew">
            {crew.people.map((p) => (
              <li key={p.name}>
                <A to={p.href}>
                  <span className="xal-disc"><img src={p.img.src} alt="" width="64" height="64" loading="lazy" decoding="async" /></span>
                  <span className="xal-who"><span>{p.name}</span>{p.role && <span>{p.role}</span>}</span>
                </A>
              </li>
            ))}
          </ul>
          <p className="xal-more"><A to={crew.more.href} className="x-arrow">{crew.more.label}</A></p>
        </div>
      </section>

      <section className="xal-sec xal-get">
        <div className="x-wrap">
          <Rise className="xal-head">
            <h2>{get.title}</h2>
            <p className="xal-hl">{get.lede}</p>
          </Rise>
          <Rise delay={0.1} className="xal-gets">
            <span className="xal-chip"><span>{get.license[0]}</span> {get.license[1]}</span>
            <A to={get.github.href} className="xal-chip">{get.github.label}</A>
            <Cta to={get.actions[0].href} size="lg">{get.actions[0].label}</Cta>
          </Rise>
        </div>
      </section>
    </div>
  );
}
