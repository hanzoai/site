'use client';
/* "Your AI bill three ways, read from the price list": the savings calculator under the title of /calculator. What the
   tokens a team uses today cost at the labs' list prices, on Hanzo Cloud, and on GPUs of its own.
   EVERY RATE IS READ WHEN THE PAGE OPENS and none is typed: the labs' rates and ours from the price list
   (GET /v1/pricing), a GPU hour from the same list's on-demand rates, and what Hanzo bills a lab's model at from the
   model list (GET /v1/models). A Team member's month is the plan list's (GET /v1/billing/plans), which the build reads
   into content/live/_pricing.json before every build, as every plan price on this site is. The volumes, the people and the GPUs are the reader's; the ones the page opens with are
   an example and say so. The Enterprise agreement is priced with Hanzo's team, so no total here includes it, and the
   GPU column says so beside its figure. Until the price list answers the page says it is reading; if it does not
   answer, the page says so and shows nothing in its place (an older number would only be somebody else's).
   Arithmetic: ./savings.js. Sources: ./sources.mjs, ./use.js. */
import { useState } from 'react';
import { Skeleton, Problem } from '../../kit';
import LIVE from '../../../content/live/_pricing.json' with { type: 'json' };
import { usePricing, useServed } from './use';
import { HOURS, amount, at, day, labs, millions, ours, percent, rate, saves, totals, usd } from './savings';
import './Savings.css';

const ROWS = 3; // the most models a reader adds

// The Team seat, from the plan list the build read: the plan of the team category billed per member (slug `team`).
const SEAT = LIVE.plans.team;
const TEAM = SEAT ? { name: SEAT.name, priceMonthly: SEAT.price, maxMembers: SEAT.maxMembers } : null;

/** What a section draws until api.hanzo.ai answers: the two cards' boxes, held, and one line saying what is being read. */
function Reading({ what }) {
  return (
    <div className="xcs" data-slot="savings" data-api="loading">
      <div className="xcs-card" aria-live="polite">
        <p className="xcs-reading">{`Reading ${what} from api.hanzo.ai`}</p>
        <Skeleton lines={7} label={`Reading ${what}`} />
      </div>
      <div className="xcs-card"><Skeleton lines={9} label="Reading the costs" /></div>
    </div>
  );
}

/** The backend did not answer: said plainly, with nothing standing in for the numbers. */
function Unreachable({ what }) {
  return (
    <div className="xcs-gone" data-api="unreachable">
      <Problem
        center
        title="api.hanzo.ai is unreachable"
        detail={`This reads ${what} live from the backend, and it did not answer. Nothing older is shown instead. Reload to try again.`}
      />
    </div>
  );
}

export default function Savings() {
  const pricing = usePricing();
  const served = useServed();
  if (pricing.state === 'loading') return <Reading what="the price list and the plans" />;
  if (pricing.state === 'unreachable') return <Unreachable what="the price list" />;
  return <Calculator doc={pricing.data} served={served.state === 'ready' ? served.data : null} />;
}

function Field({ id, label, children }) {
  return (
    <div className="xcs-field">
      <label htmlFor={id}>{label}</label>
      {children}
    </div>
  );
}

/** A native select with its chevron, which the platform no longer draws. */
function Choice({ id, value, onChange, children }) {
  return (
    <span className="xcs-choice">
      <select id={id} value={value} onChange={(e) => onChange(e.target.value)}>{children}</select>
      <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M4 6.5 8 10.5 12 6.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
    </span>
  );
}

function Amount({ id, value, onChange, step = 1 }) {
  return <input id={id} className="xcs-in" type="number" inputMode="decimal" min={0} step={step} value={String(value)} onChange={(e) => onChange(amount(e.target.value))} />;
}

/** One of the three totals: its name, its figure, what it saves against list, and what it assumes. */
function Total({ slot, name, figure, unit, saving, children }) {
  return (
    <div className="xcs-total" data-figure={slot}>
      <div className="xcs-total-h">
        <h3>{name}</h3>
        {saving != null && (
          <span className="xcs-pill" data-saving={slot}>
            {saving >= 0 ? `${percent(saving)} less than list` : `${percent(-saving)} more than list`}
          </span>
        )}
      </div>
      <p className="xcs-fig">{figure}<span className="xcs-unit">{` ${unit}`}</span></p>
      <p className="xcs-note">{children}</p>
    </div>
  );
}

function Calculator({ doc, served }) {
  const offered = labs(doc);
  const choices = offered.all;
  const skus = ours(doc);
  const racks = doc.gpu;

  // The example the page opens with: the dearest featured model, half a billion tokens in and a tenth of that out.
  const [mode, setMode] = useState('tokens');
  const [rows, setRows] = useState(() => (choices[0] ? [{ model: choices[0].id, mTokIn: 500, mTokOut: 50, spend: 5000, share: 10 }] : []));
  const [people, setPeople] = useState(50);
  const [sku, setSku] = useState(() => skus.find((m) => m.name === 'enso-auto')?.name ?? skus[0]?.name ?? '');
  const [rack, setRack] = useState(() => racks[0]?.gpu ?? '');
  const [count, setCount] = useState(1);
  const config = racks.find((g) => g.gpu === rack) ?? racks[0];
  const [hourly, setHourly] = useState(null);
  const hour = hourly ?? config?.price ?? 0;

  if (!choices.length || !skus.length) return <Unreachable what="the models the price list prices" />;

  const mine = skus.find((m) => m.name === sku) ?? skus[0];
  const set = (i, patch) => setRows((rs) => rs.map((r, k) => (k === i ? { ...r, ...patch } : r)));
  const { usage, total, listed, onCloud, seats, cloud, fleet, point, kept } = totals({ rows, mode, choices, mine, team: TEAM, people, count, hour, served });

  // The Hanzo Cloud column's first sentence, which runs on into the seats where Team prices them.
  const same = `The same ${millions(total.input)} tokens in and ${millions(total.output)} out on ${mine.fullName ?? mine.name} at ${rate(at(mine).input)} in and ${rate(at(mine).output)} out per million: ${usd(onCloud)}`;
  const seated = (n, plan, seat, all) => `${same}, plus ${n.toLocaleString('en-US')} ${n === 1 ? 'member' : 'members'} on ${plan} at ${seat} a member a month: ${all}.`;
  const alone = `${same}.`;
  const gpu = config?.gpu ?? 'GPU';

  const cloudNote =
    (seats !== null && TEAM
      ? `${seated(people, TEAM.name, usd(TEAM.priceMonthly), usd(seats))} ${TEAM.name} includes usage for each member; every token is priced here anyway.`
      : TEAM && TEAM.maxMembers != null && people > Number(TEAM.maxMembers)
        ? `${alone} ${TEAM.name} is for up to ${TEAM.maxMembers} members; past that, members are part of Enterprise.`
        : alone) +
    (kept !== null ? ` Keeping the same models through Hanzo bills them at the rates our model list states: ${usd(kept)} a month.` : '');

  const gpuNote =
    `${hourly === null
      ? `${count} × ${gpu} on all month (${HOURS} hours) at ${usd(hour)} an hour, our price list’s on-demand rate; put in what an hour of your own costs.`
      : `${count} × ${gpu} on all month (${HOURS} hours) at ${usd(hour)} an hour.`} No per-token charge, and members are unlimited. The agreement itself is priced with our team and is not in this figure.` +
    (point
      ? ` These GPUs cost what list prices do at ${millions(point.millions)} tokens a month at your mix, about ${Math.round(point.perSecond).toLocaleString('en-US')} tokens a second around the clock. Whether they serve that is sized with you, against your models and your load.`
      : '');

  const listNote = `${usage.map((u) => `${u.m.name} at ${rate(u.m.pricing.input)} in and ${rate(u.m.pricing.output)} out per million tokens`).join('; ')}, the provider's rate as our price list carries it. Seats on a provider's own plans are not priced here.`;

  const option = (m) => <option key={m.id} value={m.id}>{m.name}</option>;

  return (
    <div className="xcs" data-slot="savings" data-api="ready">
      <div className="xcs-card">
        <div className="xcs-top">
          <h3>What you use a month</h3>
          <div className="xcs-seg" role="group" aria-label="State use by">
            <button type="button" aria-pressed={mode === 'tokens'} onClick={() => setMode('tokens')}>Tokens</button>
            <button type="button" aria-pressed={mode === 'spend'} onClick={() => setMode('spend')}>Spend</button>
          </div>
        </div>

        {rows.map((r, i) => (
          <div className="xcs-row" key={i} data-row={i}>
            <Field id={`xcs-model-${i}`} label={i ? `Model ${i + 1}` : 'Model you use today'}>
              <Choice id={`xcs-model-${i}`} value={r.model} onChange={(v) => set(i, { model: v })}>
                {offered.featured.length ? <optgroup label="Featured">{offered.featured.map(option)}</optgroup> : null}
                {offered.byLab.map(([lab, ms]) => <optgroup key={lab} label={lab}>{ms.map(option)}</optgroup>)}
              </Choice>
            </Field>
            <div className="xcs-pair">
              {mode === 'tokens' ? (
                <>
                  <Field id={`xcs-in-${i}`} label="Input tokens, millions"><Amount id={`xcs-in-${i}`} value={r.mTokIn} onChange={(v) => set(i, { mTokIn: v })} /></Field>
                  <Field id={`xcs-out-${i}`} label="Output tokens, millions"><Amount id={`xcs-out-${i}`} value={r.mTokOut} onChange={(v) => set(i, { mTokOut: v })} /></Field>
                </>
              ) : (
                <>
                  <Field id={`xcs-spend-${i}`} label="Spend, dollars"><Amount id={`xcs-spend-${i}`} value={r.spend} onChange={(v) => set(i, { spend: v })} step={100} /></Field>
                  <Field id={`xcs-share-${i}`} label="Output share of tokens, %"><Amount id={`xcs-share-${i}`} value={r.share} onChange={(v) => set(i, { share: Math.min(100, v) })} /></Field>
                </>
              )}
            </div>
            {rows.length > 1 ? (
              <button type="button" className="xcs-ghost" aria-label={`Remove ${usage[i].m.name}`} onClick={() => setRows((rs) => rs.filter((_, k) => k !== i))}>
                <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M3.5 8h9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
                <span>Remove</span>
              </button>
            ) : null}
          </div>
        ))}
        {rows.length < ROWS ? (
          <button type="button" className="xcs-add" onClick={() => setRows((rs) => [...rs, { model: choices[Math.min(rs.length, choices.length - 1)].id, mTokIn: 100, mTokOut: 10, spend: 1000, share: 10 }])}>
            <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M8 3.5v9M3.5 8h9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
            <span>Add a model</span>
          </button>
        ) : null}

        <div className="xcs-more">
          <div className="xcs-pair">
            <Field id="xcs-people" label="People"><Amount id="xcs-people" value={people} onChange={(v) => setPeople(Math.floor(v))} /></Field>
            <Field id="xcs-sku" label="On Hanzo Cloud, moved to">
              <Choice id="xcs-sku" value={mine.name} onChange={setSku}>
                {skus.map((m) => <option key={m.name} value={m.name}>{m.fullName ?? m.name}</option>)}
              </Choice>
            </Field>
          </div>
          {racks.length ? (
            <div className="xcs-trio">
              <Field id="xcs-rack" label="Your GPUs">
                <Choice id="xcs-rack" value={config?.gpu ?? ''} onChange={(v) => { setRack(v); setHourly(null); }}>
                  {racks.map((g) => <option key={g.gpu} value={g.gpu}>{`${g.gpu}, ${g.vram}`}</option>)}
                </Choice>
              </Field>
              <Field id="xcs-count" label="How many"><Amount id="xcs-count" value={count} onChange={(v) => setCount(Math.max(1, Math.floor(v)))} /></Field>
              <Field id="xcs-hour" label="An hour of it, dollars"><Amount id="xcs-hour" value={hour} onChange={setHourly} step={0.01} /></Field>
            </div>
          ) : null}
          <p className="xcs-fine">
            {doc.updated
              ? `The page opens with an example. Put in your own volumes, people and GPUs; every rate is our price list's, as it stood on ${day(doc.updated)}.`
              : "The page opens with an example. Put in your own volumes, people and GPUs; every rate is our price list's."}
          </p>
        </div>
      </div>

      <div className="xcs-card" aria-live="polite">
        <h3 className="xcs-costs-h">What it costs a month</h3>
        <Total slot="list" name="At list prices" figure={usd(listed)} unit="a month">{listNote}</Total>
        <Total slot="cloud" name="Hanzo Cloud" figure={usd(cloud)} unit="a month" saving={saves(cloud, listed)}>{cloudNote}</Total>
        <Total slot="gpus" name="Enterprise, on your GPUs" figure={usd(fleet)} unit="a month, plus the agreement" saving={saves(fleet, listed)}>{gpuNote}</Total>
      </div>
    </div>
  );
}
