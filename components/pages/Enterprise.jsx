'use client';
/* Enterprise. Its idea is the boundary: where Hanzo runs, from our cloud to sealed inside yours. The hero is a set of
   walls around the model that close in as you choose where it runs; the deployment section walks those four places
   sideways as you scroll; the GPU room lets you pick a prompt size and watch the prefill; results land on a split-flap
   board. Only the walls move by themselves; the rest holds still and reads (DESIGN.md motion budget: walls spring, scroll
   walk, split-flap, sliding pickers). Beyond: "Which wall is yours" - say what your data needs (fully offline, your own
   data center, your own cloud account) and the tightest wall that holds all of it is drawn, with its line and the way
   to start. Every word and figure is Hanzo's. */
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useInView, useReducedMotion, useScroll, useSpring, useTransform } from 'motion/react';
import { EASE } from '../ui';
import { A, Go, More, SecHead, Faq, Flap, Band } from '../kit';
import './Enterprise.css';

// the kit's Tick, drawn still: this page's motion budget goes to its signature
const Check = ({ size = 22 }) => <svg className="x-tick" viewBox="0 0 24 24" width={size} height={size} aria-hidden="true"><circle cx="12" cy="12" r="10.5" fill="none" strokeWidth="1.5" /><path d="M7.5 12.5l3 3 6-6.5" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>;

const PLACES = [
  ['Hanzo Cloud', 'We run it for you', "Start today. On Hanzo Base, your organization's data is its own database."],
  ['Your cloud', 'Inside your VPC', 'Hanzo runs in your own cloud account, on your network.'],
  ['Your servers', 'On premises', 'On hardware in your data center, beside the systems you already run.'],
  ['Air-gapped', 'Fully offline', 'Sealed inside your network, with models served on machines you control.'],
];

/* The walls: four rings around the model. Choosing a place draws its wall solid and lets the outer ones go. */
function Walls({ at, setAt, mine }) {
  const ref = useRef(null);
  const rx = useSpring(0, { stiffness: 80, damping: 18 });
  const ry = useSpring(0, { stiffness: 80, damping: 18 });
  const move = (e) => {
    if (e.pointerType !== 'mouse') return;
    const r = ref.current.getBoundingClientRect();
    ry.set(((e.clientX - r.left) / r.width - 0.5) * 14);
    rx.set(-((e.clientY - r.top) / r.height - 0.5) * 10);
  };
  return (
    <div className="xe-walls" ref={ref} onPointerMove={move} onPointerLeave={() => { rx.set(0); ry.set(0); }}>
      <motion.div className="xe-walls-3d" style={{ rotateX: rx, rotateY: ry }}>
        {PLACES.map((p, i) => {
          const inset = 2 + i * 8; // % from the edge: Hanzo Cloud is the widest wall, air-gapped the tightest
          const on = i === at, gone = i < at;
          return (
            <motion.button
              type="button"
              key={p[0]}
              className={'xe-wall' + (on ? ' on' : '')}
              style={{ inset: inset + '%', zIndex: 10 + i }}
              animate={{ opacity: gone ? 0.12 : 1, scale: gone ? 1.04 : 1, z: on ? 30 : i * 6 }}
              transition={{ duration: 0.8, ease: EASE }}
              onClick={() => setAt(i, true)}
              aria-pressed={on}
              aria-label={p[0] + ': ' + p[1]}
            >
              <span className="xe-wall-l">{p[0]}</span>
            </motion.button>
          );
        })}
        <div className="xe-core" style={{ inset: '33%' }}>
          <img src="/models/oto.webp" alt="" />
          <video src="/models/oto.webm" autoPlay muted loop playsInline aria-hidden="true" />
        </div>
      </motion.div>
      {!mine && <span className="xe-walls-hint" aria-hidden="true">Choose where it runs</span>}
    </div>
  );
}

function Hero() {
  const [at, setAtState] = useState(0);
  const [mine, setMine] = useState(false);
  const calm = useReducedMotion();
  const box = useRef(null);
  const seen = useInView(box, { amount: 0.4 });
  const setAt = (i, byHand) => { setAtState(i); if (byHand) setMine(true); };
  useEffect(() => {
    if (mine || calm || !seen) return;
    const t = setTimeout(() => setAtState((v) => (v + 1) % 4), 3400);
    return () => clearTimeout(t);
  }, [at, mine, calm, seen]);
  const line = (t, d) => (
    <span className="x-line"><motion.span className="x-line-in" initial={{ y: '105%' }} animate={{ y: 0 }} transition={{ duration: 1.1, ease: EASE, delay: d }}>{t}</motion.span></span>
  );
  return (
    <section className="xe-hero" ref={box} aria-labelledby="xe-h1">
      <div className="x-wrap xe-hero-grid">
        <div>
          <motion.p className="x-kick" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: EASE }}>Hanzo Enterprise</motion.p>
          <h1 id="xe-h1" className="xe-h1">{line('Give every team AI.', 0.05)}{line('Run it where you choose.', 0.18)}</h1>
          <motion.p className="xe-lede" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: EASE, delay: 0.4 }}>
            Models, agents and one shared workspace for everyone in your company, in your cloud, on your servers or fully offline.
          </motion.p>
          <motion.div className="xe-acts" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: EASE, delay: 0.55 }}>
            <span data-thumb="Get Enterprise plan" data-href="/enterprise/start" style={{ display: 'contents' }}><Go to="/enterprise/start" solid>Get Enterprise plan</Go></span>
            <Go to="https://platform.hanzo.ai">Build on Hanzo Platform</Go>
          </motion.div>
          <motion.ul className="xe-pills" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.7 }}>
            {['Unlimited members', '24/7 engineering support', 'Runs fully offline'].map((t) => <li key={t}><Check size={16} />{t}</li>)}
          </motion.ul>
          <p className="xe-where"><span>Where it runs</span><span className="x-mono">{String(at + 1).padStart(2, '0')} / 04</span></p>
          <div className="xe-places" role="tablist" aria-label="Where Hanzo runs">
            {PLACES.map((p, i) => (
              <button key={p[0]} type="button" role="tab" aria-selected={at === i} onClick={() => setAt(i, true)}>
                {at === i && <motion.span layoutId="xe-place" className="xe-place-bg" transition={{ type: 'spring', stiffness: 420, damping: 34 }} />}
                <span>{p[0]}</span>
              </button>
            ))}
          </div>
          {/* all four captions are in the page; the chosen one is shown */}
          <div className="xe-caption" aria-live="polite">
            {PLACES.map((pl, i) => (
              <motion.p key={pl[0]} initial={false} animate={i === at ? { opacity: 1, y: 0, filter: 'blur(0px)' } : { opacity: 0, y: i < at ? -8 : 10, filter: 'blur(6px)' }} transition={{ duration: 0.45, ease: EASE }} aria-hidden={i !== at}>
                <b>{pl[1]}.</b> {pl[2]}
              </motion.p>
            ))}
          </div>
        </div>
        <motion.div initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.3, ease: EASE, delay: 0.2 }}>
          <Walls at={at} setAt={setAt} mine={mine} />
        </motion.div>
      </div>
    </section>
  );
}

const INCLUDES = [
  ['Your infrastructure', 'Run Hanzo in your cloud, on your own servers, or fully offline.'],
  ['Dedicated compute', 'Compute set aside for your organization alone.'],
  ['Your own models', 'Train and host your own models, on your own data.'],
  ['Commitments in writing', 'An uptime guarantee and a security review, both in your contract.'],
  ['24/7 engineering support', 'Engineering support around the clock, and hands-on onboarding to get your teams started.'],
  ['Your whole company', 'Unlimited members, single sign-on, roles and an audit log.'],
];

/* The six inclusions read like a list being checked: the row at the reading line is lit, the rest wait. */
function Row({ i, t, d }) {
  const ref = useRef(null);
  const lit = useInView(ref, { margin: '-45% 0px -45% 0px' });
  return (
    <motion.li ref={ref} className={'xe-row' + (lit ? ' lit' : '')} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.5 }} transition={{ duration: 0.8, ease: EASE }}>
      <span className="xe-row-n">{String(i + 1).padStart(2, '0')}</span>
      <span><b>{t}</b><span>{d}</span></span>
    </motion.li>
  );
}

function Includes() {
  return (
    <section className="x-sec">
      <div className="x-wrap xe-split">
        <div className="xe-sticky">
          <SecHead kicker="What you get" title="What Enterprise includes." lede="Your own infrastructure, dedicated compute, and engineering support around the clock." />
        </div>
        <ol className="xe-rows">{INCLUDES.map(([t, d], i) => <Row key={t} i={i} t={t} d={d} />)}</ol>
      </div>
    </section>
  );
}

/* Four places, walked sideways: the page holds while you scroll through them, one wall more each step. */
function Journey() {
  const ref = useRef(null);
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const x = useTransform(p, [0.05, 0.95], ['0%', '-75%']);
  const bar = useSpring(p, { stiffness: 200, damping: 30 });
  return (
    <section className="xe-journey" ref={ref} aria-labelledby="xe-run">
      <div className="xe-pin">
        <div className="x-wrap">
          <SecHead kicker="Deployment" title="Run it where your data lives." lede="One platform, four places to run it. Choose one, or start in our cloud and move when you are ready." />
        </div>
        <motion.div className="xe-track" style={{ x }}>
          {PLACES.map((pl, i) => (
            <article key={pl[0]} className="xe-panel">
              <div className="xe-glyph" aria-hidden="true">
                {Array.from({ length: i + 1 }).map((_, k) => <i key={k} style={{ inset: k * 14 + 'px' }} />)}
                <b />
              </div>
              <p className="xe-panel-k">{pl[1]}</p>
              <h3>{pl[0]}</h3>
              <p>{pl[2]}</p>
            </article>
          ))}
        </motion.div>
        <div className="x-wrap xe-scale"><span>Fastest start</span><i className="xe-bar"><motion.b style={{ scaleX: bar }} /></i><span>Most control</span></div>
      </div>
    </section>
  );
}

// each need is a place's own line; the place index is the wall it needs (higher is tighter)
const NEEDS = [['In your own cloud account, on your network', 1], ['On hardware in your data center', 2], ['Fully offline, sealed inside your network', 3]];

/* Which wall is yours: the tightest wall your needs call for. */
function Fit() {
  const [on, setOn] = useState([]);
  const at = Math.max(0, ...on.map((i) => NEEDS[i][1]));
  const [name, kind, line] = PLACES[at];
  return (
    <section className="x-sec xe-fit">
      <div className="x-wrap xe-split">
        <div>
          <SecHead kicker="Which wall is yours" title="Say what your data needs." lede="Choose none and you start today, in our cloud." />
          <div className="xe-fit-q" role="group" aria-label="What your data needs">
            {NEEDS.map(([t], i) => <button key={t} type="button" aria-pressed={on.includes(i)} onClick={() => setOn((v) => (v.includes(i) ? v.filter((x) => x !== i) : [...v, i]))}>{t}</button>)}
          </div>
        </div>
        <div className="xe-fit-a" aria-live="polite">
          <div className="xe-glyph" aria-hidden="true">
            {PLACES.map((_, k) => <i key={k} className={k <= at ? 'on' : ''} style={{ inset: k * 14 + 'px' }} />)}
            <b />
          </div>
          <p className="xe-panel-k">{kind}</p>
          <h3>{name}</h3>
          <p>{line}</p>
          <A to={at ? '/contact-sales' : '/enterprise/start'} className="x-btn solid">{at ? 'Talk to sales' : 'Get Enterprise plan'}</A>
        </div>
      </div>
    </section>
  );
}

const PREFILL = [['512 tokens', 1.9, 270], ['2,048 tokens', 0.8, 2658], ['8,192 tokens', 4.5, 1835], ['16,384 tokens', 9.6, 1701], ['32,768 tokens', 23.2, 1414]];

/* Pick a prompt size; the prefill time and rate for it settle in, on the bar of the fastest. */
function Prefill() {
  const [k, setK] = useState(1);
  const [, , rate] = PREFILL[k];
  return (
    <div className="xe-spark">
      <p className="xe-spark-k">Zen 6 on one DGX Spark, as Hanzo measured it</p>
      <div className="xe-sizes" role="tablist" aria-label="Prompt size">
        {PREFILL.map(([s], i) => (
          <button key={s} type="button" role="tab" aria-selected={k === i} onClick={() => setK(i)}>
            {k === i && <motion.span layoutId="xe-size" className="xe-size-bg" transition={{ type: 'spring', stiffness: 420, damping: 34 }} />}
            <span>{s}</span>
          </button>
        ))}
      </div>
      <div className="xe-read">
        <div><span>Prefill time</span><AnimatePresence mode="popLayout" initial={false}><motion.b key={k} initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -30, opacity: 0 }} transition={{ type: 'spring', stiffness: 380, damping: 30 }}>{PREFILL[k][1]} s</motion.b></AnimatePresence></div>
        <div><span>Prefill rate</span><AnimatePresence mode="popLayout" initial={false}><motion.b key={k} initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -30, opacity: 0 }} transition={{ type: 'spring', stiffness: 380, damping: 30, delay: 0.05 }}>{rate.toLocaleString('en-US')} tokens a second</motion.b></AnimatePresence></div>
      </div>
      <i className="xe-rate"><motion.b animate={{ width: (rate / 2658) * 100 + '%' }} transition={{ type: 'spring', stiffness: 120, damping: 20 }} /></i>
      <table className="x-sr">
        <thead><tr><th>Prompt</th><th>Prefill time</th><th>Prefill rate</th></tr></thead>
        <tbody>{PREFILL.map(([s, t, r]) => <tr key={s}><td>{s}</td><td>{t} s</td><td>{r.toLocaleString('en-US')} tokens a second</td></tr>)}</tbody>
      </table>
      <p className="xe-note">A cold prompt of about that many tokens on a quiet box, measured Sep 20, 2026: NVIDIA DGX Spark (GB10), 121 GiB unified memory, shared with the benchmark&apos;s other jobs; zen6, NVFP4 with FP8 attention, weights 21.6 GiB (serve-spark-zen6.sh).</p>
      <div className="x-row-links tight">
        <More to="https://www.nvidia.com/en-us/products/workstations/dgx-spark/">NVIDIA DGX Spark: GB10, 273 GB/s memory bandwidth</More>
        <More to="/benchmarks/zen-6">Zen 6 on three machines</More>
        <More to="/zen/zen6-max">Zen 6 Max</More>
      </div>
    </div>
  );
}

/* Four servers of eight GPUs each, lighting up as the rack comes into view. */
function Racks({ name, total, guide, to, specs }) {
  const ref = useRef(null);
  const seen = useInView(ref, { once: true, amount: 0.5 });
  return (
    <div className="xe-rack" ref={ref}>
      <h3>{name}</h3>
      <div className="xe-gpus" aria-hidden="true">
        {Array.from({ length: 32 }).map((_, i) => (
          <motion.i key={i} initial={{ opacity: 0.12 }} animate={seen ? { opacity: 1 } : {}} transition={{ duration: 0.3, delay: 0.2 + i * 0.035 }} />
        ))}
      </div>
      <p className="xe-rack-n">{total.toLocaleString('en-US')} GB</p>
      <p className="xe-rack-s">of GPU memory across four servers</p>
      <dl className="xe-specs2">{specs.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>
      <More to={to}>{guide}</More>
    </div>
  );
}

function Gpus() {
  return (
    <section className="x-sec xe-dark" data-room="dark">
      <div className="x-wrap">
        <SecHead dark kicker="Your own GPUs" title="Run the models on machines you own." lede="Zen 6 runs on one DGX Spark. Zen 6 Max wants a rack of Blackwell servers. What we measured, and what a rack is made of." />
        <Prefill />
        <p className="xe-say">We recommend at least four 8-GPU NVIDIA Blackwell servers, B300 or B200, for Zen 6 Max on your own premises. Routing cuts the average inference work a request needs. It does not cut the memory needed to keep every specialist ready.</p>
        <div className="xe-racks">
          <Racks name="DGX B300" total={9216} specs={[['GPUs', '8 x B300'], ['GPU memory', '8 x 288 GB, 2,304 GB'], ['Cluster network', '8 x 800 Gb/s InfiniBand or Ethernet'], ['Data cache', '8 x 3.84 TB']]} guide="NVIDIA DGX B300 user guide: 8 x 288 GB GPU memory" to="https://docs.nvidia.com/dgx/dgxb300-user-guide/introduction-to-dgxb300.html" />
          <Racks name="DGX B200" total={5760} specs={[['GPUs', '8 x B200'], ['GPU memory', '1,440 GB'], ['Cluster network', '8 x ConnectX-7, up to 400 Gb/s'], ['Data cache', '8 x 3.84 TB']]} guide="NVIDIA DGX B200 user guide: 1,440 GB total GPU memory" to="https://docs.nvidia.com/dgx/dgxb200-user-guide/introduction-to-dgxb200.html" />
        </div>
        <p className="xe-note">Four B300 servers hold 9,216 GB of GPU memory; four B200 servers hold 5,760 GB.</p>
        <div className="xe-plan">
          <div>
            <h3>Planning range</h3>
            <ol className="xe-steps">
              {[['Qualification', 'Four 8-GPU servers is where a qualification starts.'], ['Isolated production pools', 'One pool for each specialist, so a busy class of work never takes memory from another.'], ['Redundant pools', 'Two independent replicas of those pools across failure domains.']].map(([t, d], i) => (
                <li key={t}><span className="xe-step-n">{i + 1}</span><b>{t}.</b> {d}</li>
              ))}
            </ol>
          </div>
          <div>
            <h3>Around the servers</h3>
            <ul className="xe-specs">
              {['NVLink and NVSwitch inside each server.', '400 or 800 Gb/s RDMA wherever a specialist spans servers.', 'About 31 TB of NVMe in each server (8 x 3.84 TB).', 'Separate sandbox workers for coding agents.', 'A high-availability control cluster.'].map((s, i) => <li key={s}>{s}</li>)}
            </ul>
          </div>
        </div>
        <p className="xe-note">Final capacity and performance commitments come from qualifying your workload: context length, concurrency, routing mix, latency, and failover.</p>
      </div>
    </section>
  );
}

const PROOF = [
  ['$8.4M', 'in bikes sold in 30 days', 'Damon Motorcycles · CES launch and preorders', '/customers/damon-motorcycles', '/logos/customers/damon-motorcycles.svg'],
  ['$7M+', 'raised in preorders', 'KANOA · Crowdfunding and preorders', '/customers/kanoa', '/logos/customers/kanoa.png'],
  ['169M', 'people watched TrillerFest', 'Triller · Growth marketing', '/customers#trillerfest', '/logos/customers/trillerfest.png'],
  ['$2.5M', 'raised on Indiegogo', 'SKULLY · Crowdfunding', '/customers#skully', '/logos/customers/skully.png'],
  ['$650M', 'CSPR peak market value', 'Casper Labs · Network launch', '/customers#casper-blockchain', '/logos/customers/casper-blockchain.svg'],
  ['250,000', 'email signups', 'Bellabeat · Preorders', '/customers#bellabeat', '/logos/customers/bellabeat.svg'],
];

function Proof() {
  return (
    <section className="x-sec">
      <div className="x-wrap">
        <SecHead kicker="Proof" title="Results on the record." lede="Our models' scores come from research runs anyone can open. Customer results come from the case studies of launches Hanzo ran." />
        <div>
          <A to="/benchmarks#decision-suite" className="xe-research">
            <Flap value="16 of 16" />
            <span className="xe-what">Decision Suite tasks won · Kai vs Jev</span>
            <span className="xe-research-d">Every task of the suite, its row linking its runs and how to re-run it.</span>
            <span className="xe-offer-go">See the runs →</span>
          </A>
        </div>
        <div className="xe-board">
          {PROOF.map(([n, what, who, to, logo], i) => (
            <div key={who}>
              <A to={to} className="xe-flapcard">
                <Flap value={n} />
                <span className="xe-what">{what}</span>
                <span className="xe-who"><img src={logo} alt="" />{who}</span>
              </A>
            </div>
          ))}
        </div>
        <div className="x-row-links"><More to="/customers">All customer stories</More></div>
      </div>
    </section>
  );
}

function Offer({ title, text, price, cta, to, i }) {
  return (
    <div>
      <A to={to} className="xe-offer">
        <h3>{title}</h3>
        <p>{text}</p>
        {price && <p className="xe-price">{price}</p>}
        <span className="xe-offer-go">{cta} →</span>
      </A>
    </div>
  );
}

function Partners() {
  return (
    <section className="x-sec xe-partners">
      <div className="x-wrap">
        <SecHead kicker="Partners" title="Work with Hanzo." lede="Refer customers, resell Hanzo under your own brand, or have Hanzo’s agency build it with you." />
        <div className="xe-offers">
          <Offer i={0} title="Refer customers" text="Apply to refer organizations to Hanzo. The terms are agreed with each affiliate we approve." cta="The affiliate programme" to="/affiliate" />
          <Offer i={1} title="White-label: resell under your brand" text="Your own AI agency, under your brand, on your domain." price="$999 a month" cta="Ask about White-label" to="/contact-sales" />
          <Offer i={2} title="Have Hanzo build it" text="Agency, Forward Deployed, Embedded Pod: Hanzo’s agency ships the work with you, from one workstream to an embedded team." price="From $4,999 a month" cta="Hanzo Agency" to="https://hanzo.agency" />
        </div>
        <p className="xe-clouds-k">Hanzo runs in your cloud and on these. They are the clouds and the silicon Hanzo deploys on, not partners or customers.</p>
        <div className="xe-clouds">
          {['amazon', 'digitalocean', 'google', 'microsoft', 'nvidia', 'nebius'].map((l, i) => (
            <motion.img key={l} src={`/logos/partners/${l}.svg`} alt={l} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, ease: EASE, delay: i * 0.06 }} />
          ))}
        </div>
      </div>
    </section>
  );
}

const SEC = [
  ['Single sign-on', 'Sign in through your own OpenID Connect provider. SCIM 2.0 creates, updates and removes accounts from your directory.'],
  ['Your data, apart', "On Hanzo Base, each organization's data is its own database file, kept apart from every other organization. Identity comes only from a verified token."],
  ['Audit log', 'Every request is recorded: who acted, from where, what they called and the status it returned.'],
  ['Roles and second factors', 'Grant access by organization, workspace and project. Every account can add an authenticator app, or a code by SMS or email.'],
];

/* The security review, as a checklist. */
function Security() {
  return (
    <section className="x-sec xe-sec">
      <div className="x-wrap xe-split">
        <div className="xe-sticky">
          <SecHead kicker="Security" title="Ready for your security review." lede="A security review is part of every Enterprise contract. We answer your questionnaire against the code, and the engineers who wrote it walk your reviewers through it." />
          <div className="x-row-links tight"><More to="/security">How Hanzo is secured</More><More to="/trust">Trust center</More></div>
        </div>
        <ul className="xe-checks">
          {SEC.map(([t, d], i) => (
            <li key={t}>
              <Check size={26} />
              <span><b>{t}</b><span>{d}</span></span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

const QA = [
  ['How is Enterprise priced?', <>Each contract is priced for your organization: where Hanzo runs and the compute you need. Members are unlimited. <A to="/contact-sales">Talk to sales</A> for a quote.</>],
  ['Where do the savings figures come from?', 'Every rate is read from our price list and our plan list when the page opens; the volumes, the people and the GPUs are yours. The figure for your own GPUs counts them on all month at an hourly rate and leaves out the Enterprise agreement, which our team prices with you.'],
  ['Can Hanzo run fully offline?', 'Yes. Hanzo runs air-gapped on your own servers, with models served on machines you control.'],
  ['How is our data used?', <>Your data is used to run your service. Training Hanzo models on it takes your administrator&apos;s choice or a written agreement. <A to="/privacy">Read the Privacy Policy</A>.</>],
  ['Which identity providers work?', 'Your own OpenID Connect provider, for single sign-on. SCIM 2.0 creates, updates and removes accounts as your directory changes.'],
  ['Can we start on Team and move up?', <>Yes. Team covers 2 to 100 people today, with single sign-on, roles and an audit log. Move to Enterprise when you want your own infrastructure, dedicated compute or more people. <A to="/pricing">Compare plans</A>.</>],
];

export default function Enterprise() {
  return (
    <main className="xe">
      <Hero />
      <Includes />
      <Journey />
      <Fit />
      <Gpus />
      <Proof />
      <Partners />
      <Security />
      <section className="x-sec">
        <div className="x-wrap xe-split">
          <div className="xe-sticky"><SecHead title="Questions" /></div>
          <Faq items={QA} />
        </div>
      </section>
      <Band
        title="Tell us what you want to build."
        lede="Share a few details about your company. We come back with a plan: where Hanzo runs, what it costs and how you start."
        action="Talk to sales"
        to="/contact-sales"
        note={<p className="x-band-note">Or email <a href="mailto:enterprise@hanzo.ai">enterprise@hanzo.ai</a></p>}
      />
    </main>
  );
}
