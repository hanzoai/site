'use client';
/* /calculator: True Savings, an operating-cost model, not a TAM calculator. Every number on the page is worked out from
   a control a visitor can see and change; nothing is typed into the headline. The model (rows, vendors, defaults,
   formulas) is Calculator.data.js, and its default totals reproduce the analyst's $613k software total exactly
   (Calculator.test.mjs). Under the title stands the token calculator, "Your AI bill three ways, read from the price
   list" (calculator/Savings.jsx): every rate in it is read from api.hanzo.ai when the page opens.
   Persona: a finance or platform lead pricing what consolidating a vendor stack would save.
   Goal: a run-rate figure they can defend, with the three deductions named until entered.
   Copy: every label, note and disclaimer is hanzo.ai's own, word for word. */
import { useState } from 'react';
import Savings from './calculator/Savings';
import { useModels } from './calculator/use';
import {
  AI_CONTROLS, AI_ROW, COV_LABEL, EV_LABEL, FTE, REF_E, ROWS, SECOND_ORDER, SEAMS, VENDORS, WEIGHT,
  dollars, initial, model, money, nextCov,
} from './Calculator.data';
import './Calculator.css';

/* Sentences with a part in full ink. */
const B = ({ mono, children }) => <b className={mono ? 'xc-b mono' : 'xc-b'}>{children}</b>;
const Note = ({ children }) => <p className="xc-note">{children}</p>;
const Label = ({ children }) => <p className="xc-label">{children}</p>;
const H2 = ({ children }) => <h2 className="xc-h2">{children}</h2>;
const Card = ({ accent, as: Tag = 'div', children }) => <Tag className={'xc-card' + (accent ? ' accent' : '')}>{children}</Tag>;
const Controls = ({ children }) => <div className="xc-controls">{children}</div>;

/** A control's caption, in small caps; `shows` is its value at the right. */
function Caption({ id, shows, children }) {
  return (
    <label className="xc-cap" htmlFor={id}>
      <span>{children}</span>
      {shows !== undefined ? <output htmlFor={id}>{shows}</output> : null}
    </label>
  );
}

/** A slider in a card, its caption above it. */
function Range({ id, label, shows, min, max, step, value, onChange }) {
  return (
    <Card>
      <Caption id={id} shows={shows}>{label}</Caption>
      <input id={id} className="xc-range" type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(+e.target.value)} />
    </Card>
  );
}

/** A number field; `narrow` for a price cell in the table. */
function Field({ id, label, min, step, value, placeholder, narrow, onChange }) {
  return (
    <input
      id={id}
      className={'xc-field' + (narrow ? ' narrow' : '')}
      type="number"
      aria-label={label}
      min={min}
      step={step}
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(Math.max(Number(e.target.value) || 0, 0))}
    />
  );
}

/** One of the four tiers; `lead` is the headline, on the saving tint. */
const Tier = ({ label, note, lead, children }) => (
  <div className={'xc-tier' + (lead ? ' lead' : '')}>
    <span className="xc-tier-k">{label}</span>
    {children}
    <small>{note}</small>
  </div>
);
const Big = ({ children }) => <span className="xc-big">{children}</span>;

/** One part of the run-rate, ruled across its top in the saving hue, or the cost hue for what Hanzo costs. */
const Part = ({ label, cost, children }) => (
  <div className={'xc-part' + (cost ? ' cost' : '')}>
    <small>{label}</small>
    <span>{children}</span>
  </div>
);

/** A vendor, or a small action set the same way; pressed reads in the saving hue on its tint. */
const Toggle = ({ pressed, onPress, children }) => (
  <button type="button" className="xc-toggle" aria-pressed={pressed} onClick={onPress}>{children}</button>
);

/** A grade: a word in an outline, in its grade's ink; a button where the grade can be changed. */
const COV_INK = { full: 'save', partial: 'warn', experimental: 'cost', roadmap: 'grey' };
const EV_INK = { verified: 'save', gap: 'cost', internal: 'grey', repo: 'grey', attested: 'warn' };
function Chip({ ink, title, onPress, children }) {
  const cls = 'xc-chip ' + ink;
  return onPress
    ? <button type="button" className={cls} title={title} onClick={onPress}>{children}</button>
    : <span className={cls}>{children}</span>;
}

const Td = ({ off, right, svc, children }) => (
  <td className={(off ? 'off ' : '') + (right ? 'r ' : '') + (svc ? 'svc' : '')}>{children}</td>
);

// the default deployment's software total in $k and per employee, worked out by the model itself (Calculator.test.mjs asserts $613k and $6,130)
const BASE = model(initial()).software;

export default function Calculator() {
  const [s, setS] = useState(initial);
  const up = (patch) => setS((x) => ({ ...x, ...patch }));
  const [aiOpen, setAiOpen] = useState(false);
  const models = useModels();
  const m = model(s);
  const { E, Dp, cloud, infraPct, glueFte, opsFte, retained, fee, migration, migYears } = s;
  const { D, on, value, software, infra, glue, ops, gross, runRate, adjusted, hasDeductions, vendorCount, saving } = m;

  const cycleCov = (i) => up({ cov: s.cov.map((c, k) => (k === i ? nextCov(c) : c)) });
  const toggleRow = (i, checked) => up({ von: s.von.map((v, k) => (VENDORS[k][1] === i ? checked : v)) });
  const setAllVendors = (v) => up({ von: VENDORS.map(() => v) });
  const reset = () => { const i = initial(); up({ cov: i.cov, price: i.price, von: i.von, aiOn: i.aiOn }); };
  const num = (id, v, key) => <Field id={id} min={0} step={1000} value={v || ''} placeholder="0" onChange={(n) => up({ [key]: n })} />;

  return (
    <main className="xc">
      <section className="xc-hero">
        <div className="x-wrap">
          <p className="xc-top"><span className="x-badge">Hanzo True Savings</span></p>
          <h1 className="xc-h1">Price the assembly tax.</h1>
          <p className="xc-lede">It models operating expenses a company can eliminate, reduce, or reclaim.</p>
          {/* Your AI bill three ways, read from the price list when the page opens: the first thing to use, under the words */}
          <Savings />
        </div>
      </section>

      <div className="xc-body">
        <Card as="section" accent>
          <H2>Reference deployment — Hanzo runs on Hanzo</H2>
          <Note>
            Fully off GCP · Hanzo-managed infrastructure · AI, cloud, identity, observability, deploy, storage and business-ops native · eligible AI routed through Enso and self-hosted Zen · <B>107 vendor and managed-service dependencies consolidated into one plane</B> · ~90% lower compute and eligible-inference costs in selected workloads.
          </Note>
          <Label>Founder-attested.</Label>
        </Card>

        <section>
          <H2>Your deployment</H2>
          <Controls>
            <Range id="ts-e" label="Employees" shows={E} min={10} max={2000} step={10} value={E} onChange={(n) => up({ E: n })} />
            <Range id="ts-d" label="Engineers" shows={`${Dp}% (${D})`} min={10} max={60} step={5} value={Dp} onChange={(n) => up({ Dp: n })} />
            <Range id="ts-c" label="Cloud bill / month" shows={`$${cloud}k`} min={0} max={250} step={5} value={cloud} onChange={(n) => up({ cloud: n })} />
            <Range id="ts-g" label="Integration-glue FTEs" shows={glueFte} min={0} max={20} step={0.5} value={glueFte} onChange={(n) => up({ glueFte: n })} />
            <Range id="ts-o" label="Platform-ops FTEs (running Hanzo)" shows={opsFte} min={0} max={6} step={0.5} value={opsFte} onChange={(n) => up({ opsFte: n })} />
            <Range id="ts-i" label="Infrastructure delta" shows={`${infraPct}%`} min={0} max={90} step={5} value={infraPct} onChange={(n) => up({ infraPct: n })} />
          </Controls>
        </section>

        <section>
          <H2>Deductions — not included until entered</H2>
          <Controls>
            <Card>
              <Caption id="ts-r">Retained vendor spending ($/yr)</Caption>
              {num('ts-r', retained, 'retained')}
            </Card>
            <Card>
              <Caption id="ts-f">Hanzo managed / support fee ($/yr)</Caption>
              {num('ts-f', fee, 'fee')}
            </Card>
            <Card>
              <Caption id="ts-m">One-time migration cost ($)</Caption>
              {num('ts-m', migration, 'migration')}
            </Card>
            <Range id="ts-y" label="Amortized over" shows={`${migYears} yr`} min={1} max={5} step={1} value={migYears} onChange={(n) => up({ migYears: n })} />
          </Controls>
        </section>

        <section>
          <H2>Results</H2>
          <div className="xc-tiers">
            <Tier label="1 · Gross addressable savings" note="Software + infrastructure + glue, before any deduction."><Big>{money(gross)}</Big></Tier>
            <Tier lead label="2 · Annual run-rate savings" note="Gross − Hanzo operating labor. This is the headline."><Big>{money(runRate)}</Big></Tier>
            <Tier label="3 · Fully adjusted annual savings" note="Run-rate − retained vendors − Hanzo fees − amortized migration.">
              {hasDeductions ? <Big>{money(adjusted)}</Big> : <span className="xc-need">Customer input required</span>}
            </Tier>
            <Tier label="4 · Three-year economic value" note="Fully adjusted × 3, with migration amortized across the horizon."><Big>{money(adjusted * 3)}</Big></Tier>
          </div>

          <div className="xc-parts">
            <Part label="Software replaced (selected rows)">{money(software)}</Part>
            <Part label="Infrastructure delta">{money(infra)}</Part>
            <Part label="Glue engineering reclaimed">{money(glue)}</Part>
            <Part label="Cost of operating Hanzo" cost>−{money(ops)}</Part>
            <Part label="Per employee / yr (run-rate)">{dollars(runRate / Math.max(E, 1))}</Part>
            <Part label="≈ senior engineers funded">{(runRate / FTE).toFixed(1)}</Part>
            <Part label="Vendors collapsed">{vendorCount} → 1</Part>
          </div>

          <p className="xc-formula">
            <code>gross = software + infra + glue</code> · <code>run-rate = gross − ops</code> · <code>adjusted = run-rate − retained − fees − migration ÷ years</code>
          </p>
          <p className="xc-warn">Do not present {money(runRate)} as fully net until the final three deductions are entered.</p>
          <p className="xc-fine">Hanzo True Savings is an interactive operating-cost model, not a quote, guarantee, audit, or promise of results. Default prices are editable estimates based on representative technology stacks. Actual savings depend on existing contracts, usage, architecture, migration requirements, retained vendors, staffing, workload eligibility, and Hanzo deployment choices. Hanzo’s internal case-study figures are management-attested unless explicitly marked independently verified.</p>
        </section>

        <section>
          <H2>Click everything you pay for</H2>
          <Note>
            Every vendor maps to a line in the table. Tap the ones on your bill — the totals and the <B>vendors → 1</B> counter follow.{' '}
            <Toggle onPress={() => setAllVendors(true)}>select all</Toggle>{' '}
            <Toggle onPress={() => setAllVendors(false)}>clear</Toggle>
          </Note>
          <div className="xc-vendors">
            {VENDORS.map(([name], k) => (
              <Toggle key={name + k} pressed={s.von[k]} onPress={() => up({ von: s.von.map((v, j) => (j === k ? !v : v)) })}>{name}</Toggle>
            ))}
          </div>
        </section>

        <section>
          <H2>Category by category</H2>
          <Note>
            Two axes, kept separate. <B>Coverage</B> carries weight and is clickable — full 100%, partial 50%, experimental 25%, roadmap 0%. <B>Evidence</B> carries no weight. A service can have full coverage while still management-attested. Separating the axes prevents an attestation from being presented as verification.
          </Note>
          <Note>
            Prices are the analyst defaults at the reference deployment (100 employees, 30% engineers) and are editable — type over any of them. Untouched rows scale on their billing basis: per-seat with employees, per-engineer with engineers, platform fees not at all.{' '}
            <Toggle onPress={reset}>Reset to analyst defaults</Toggle>
          </Note>
          <div className="xc-table" role="region" aria-label="Category by category" tabIndex={0}>
            <table>
              <thead>
                <tr>
                  <th aria-label="Include" />
                  <th>Category</th>
                  <th>Replaces (typical)</th>
                  <th>Hanzo services</th>
                  <th>Coverage</th>
                  <th>Evidence</th>
                  <th className="r">$k / yr</th>
                </tr>
              </thead>
              <tbody>
                {ROWS.map((r, i) => {
                  const off = !on[i];
                  return (
                    <tr key={r.name}>
                      <Td off={off}>
                        <input type="checkbox" className="xc-check" checked={on[i]} aria-label={`Include ${r.name}`} onChange={(e) => toggleRow(i, e.target.checked)} />
                      </Td>
                      <Td off={off}>
                        {r.name}
                        {i === AI_ROW && (
                          <>
                            {' '}
                            <button type="button" className="xc-sub" aria-expanded={aiOpen} onClick={() => setAiOpen((o) => !o)}>{aiOpen ? 'hide' : 'sub-calculator'}</button>
                          </>
                        )}
                      </Td>
                      <Td off={off}>{r.replaces}</Td>
                      <Td off={off} svc>{r.hanzo}</Td>
                      <Td off={off}><Chip ink={COV_INK[s.cov[i]]} title="Click to regrade coverage" onPress={() => cycleCov(i)}>{COV_LABEL[s.cov[i]]}</Chip></Td>
                      <Td off={off}><Chip ink={EV_INK[r.ev]}>{EV_LABEL[r.ev]}</Chip></Td>
                      <Td off={off} right>
                        <Field id={`ts-price-${i}`} label={`Annual estimate for ${r.name} in thousands`} min={0} value={Math.round(value[i] / 1000)} narrow onChange={(n) => up({ price: { ...s.price, [i]: n } })} />
                        {WEIGHT[s.cov[i]] < 1 && <span className="xc-weight">×{WEIGHT[s.cov[i]]}</span>}
                      </Td>
                    </tr>
                  );
                })}
                {aiOpen && (
                  <tr>
                    <td colSpan={7} className="xc-ai">
                      <h3>AI sub-calculator</h3>
                      <Note>
                        Hanzo’s current deployment reports reductions approaching 90% for selected workloads routed to lower-cost or self-hosted models. Enter your own eligible workload percentage rather than applying 90% to the entire AI bill. Hanzo routes {models}, but model count is not the economic claim — the control plane is.
                      </Note>
                      <div className="xc-controls tight">
                        {AI_CONTROLS.map(([key, label, min, max, step]) => (
                          <Range key={key} id={`ts-ai-${key}`} label={label} shows={s.ai[key]} min={min} max={max} step={step} value={s.ai[key]} onChange={(n) => up({ ai: { ...s.ai, [key]: n } })} />
                        ))}
                      </div>
                      <Note>
                        Computed eligible saving <B mono>{money(saving)}</B> / yr against an analyst default of <B mono>{money(ROWS[AI_ROW].k * 1000)}</B>. Frontier pass-through is never counted as a saving.{' '}
                        <Toggle pressed={s.aiOn} onPress={() => up({ aiOn: !s.aiOn })}>{s.aiOn ? 'using computed figure' : 'use computed figure'}</Toggle>
                      </Note>
                    </td>
                  </tr>
                )}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={6} className="foot">Weighted total — replaced software</td>
                  <td className="foot r">{money(software)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </section>

        <section>
          <H2>Infrastructure delta</H2>
          <Note>
            The {infraPct}% delta above is a simplified default and a <B>user-controlled assumption, not a universal benchmark</B>. The egress anchor is real — DigitalOcean at $0.01/GiB against an AWS example at $0.09/GB — but it supports an egress comparison; it does not prove {infraPct}% for every workload. A full model would price provider, compute, GPU, database, storage, egress, observability, support, existing commitments, target Hanzo cost and migration overlap separately.
          </Note>
        </section>

        <section>
          <H2>Glue engineering</H2>
          <Note>{`The seams a vendor stack requires someone to own: ${SEAMS.join(', ')}. The default of 1.5 FTE at $${(FTE / 1000).toFixed(0)}k fully loaded is conservative for a 30+ vendor estate, and 0.5 FTE of platform operations is subtracted on the other side.`}</Note>
          <Label>Do not say Hanzo eliminates engineering. Hanzo redirects it from vendor seams to product.</Label>
        </section>

        <section>
          <H2>The bill is the cheap half</H2>
          <Note>
            Everything above prices what you stop <B>paying</B>. It ignores what you would have to <B>build</B> to own the whole thing yourself. Public anchors: Auth0 acquired for ~$6.5B · Datadog ~$1.55B of 2025 R&amp;D · Zapier 800+ people and 9,000+ integrations. These are not additive valuations; they show each category is a substantial engineering domain. A replacement-cost study of the full repository estate is <B>under analysis</B> — no number will appear here until that report lands.
          </Note>
        </section>

        <section>
          <H2>Exclusions — what this model never counts</H2>
          <Note>Card interchange and network fees (the payment row counts PSP markup only) · frontier model pass-through, unless the workload is routed, distilled or self-hosted · deep vertical software (clinical, CAD, EDA, airline operations, industrial control, scientific instruments, jurisdiction-specific record systems) · migration coexistence, where both stacks run at once · retained vendors, since every row is independently deselectable.</Note>
        </section>

        <section>
          <H2>Market context</H2>
          <Note>{`Okta 2026: 98 applications on average, 259 at companies with 2,000+ employees, 72 below that. Zylo 2026 SaaS Management Index: a median of $9,455 of SaaS spend per employee, with 36% of licenses unused. The $${Math.round(BASE / 1000)}k software default at the reference deployment works out to ${dollars(BASE / REF_E)} per employee — below Zylo’s enterprise-skewed median, so the model is conservative relative to the benchmark. None of this implies all SaaS spend is recoverable.`}</Note>
        </section>

        <section>
          <H2>Second-order benefits — real, unpriced</H2>
          <Note>{SECOND_ORDER.join(' · ')}.</Note>
          <Label>Material, but outside the headline until a defensible measurement exists.</Label>
        </section>

        <Card as="section" accent>
          <H2>Replace the stack, not the capability.</H2>
          <Note>{`100+ capabilities · ${models} · one identity · one API · one platform · self-host or managed.`}</Note>
          <p className="xc-lead">Select your current stack and price the assembly tax.</p>
        </Card>
      </div>
    </main>
  );
}
