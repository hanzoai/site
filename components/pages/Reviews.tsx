'use client';
/* /reviews: Hanzo Reviews, nine first-party reviews, a filter by product, and a form to write one.
   Persona: a team lead or engineer deciding whether builders like them trust Hanzo.
   Goal: read the reviews that match their product; write their own.
   CTA: "Write a review" opens the form; "Join Beta & Fan Club (50% Off)" goes to /beta.
   Copy: every line is hanzo.ai's own, word for word (Reviews.data.js holds the reviews).
   The form sends what hanzo.ai sends: the review as a sales lead (POST /v1/marketing/leads) and as a response to the
   hanzo.review-submit form (POST /v1/form/public/hanzo.review-submit/responses), both on api.hanzo.ai. The thanks says
   what happened: it appears only once Hanzo has taken the review, which is also kept in this browser (localStorage, the
   key hanzo.ai uses) and shown first; a review Hanzo did not take stays in the form with the reason. */
import { useEffect, useRef, useState } from 'react';
import type { ChangeEvent, FormEvent, ReactNode, SVGProps } from 'react';
import { Cta, Field } from '../kit';
import { API, CATEGORIES, PRODUCTS, STORAGE_KEY, entry, kept, lead, response, visible } from './Reviews.data';
import type { Draft, Review } from './Reviews.data';
import './Reviews.css';

const Icon = ({ d, size = 16, fill, ...rest }: Omit<SVGProps<SVGSVGElement>, 'd'> & { d: string | string[]; size?: number }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill={fill || 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...rest}>
    {(Array.isArray(d) ? d : [d]).map((p) => <path key={p} d={p} />)}
  </svg>
);
const SHIELD = ['M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z', 'm9 12 2 2 4-4'];
const WRITE = ['M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z', 'M12 7v6', 'M9 10h6'];
const CHECK = 'M20 6 9 17l-5-5';
const STAR = 'M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z';

function Stars({ count, size = 15 }: { count: number; size?: number }) {
  return (
    <span className="xrv-stars" role="img" aria-label={`${count} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => <Icon key={i} d={STAR} size={size} className={i <= count ? 'on' : ''} fill={i <= count ? 'currentColor' : 'none'} />)}
    </span>
  );
}

const Pill = ({ on, onClick, children }: { on: boolean; onClick: () => void; children?: ReactNode }) => (
  <button type="button" className="xrv-pill" aria-pressed={on} onClick={onClick}>{children}</button>
);

export default function Reviews() {
  const [category, setCategory] = useState('All');
  const [mine, setMine] = useState<Review[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Draft>({ name: '', role: '', company: '', product: 'Hanzo Dev', rating: 5, title: '', body: '' });
  const [said, setSaid] = useState<{ ok: boolean; text: string } | null>(null); // the thanks, or what is missing: { ok, text }
  const [sending, setSending] = useState(false);
  const box = useRef<HTMLFormElement>(null);
  const field = (k: 'name' | 'role' | 'company' | 'title' | 'body') => ({ value: form[k], onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm((f) => ({ ...f, [k]: e.target.value })) });

  useEffect(() => {
    try { setMine(kept(window.localStorage.getItem(STORAGE_KEY))); } catch {}
  }, []);
  useEffect(() => {
    if (!said) return;
    const t = setTimeout(() => setSaid(null), 6000);
    return () => clearTimeout(t);
  }, [said]);
  // the form opens where the reader can use it: in view, on its first field
  useEffect(() => {
    if (!open) return;
    box.current?.scrollIntoView({ block: 'center', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    box.current?.querySelector('input')?.focus({ preventScroll: true });
  }, [open]);

  const post = (path: string, body: unknown) => fetch(API + path, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }).then((r) => r.ok, () => false);
  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (sending) return;
    const made = entry(form);
    if (!made) { setSaid({ ok: false, text: 'Please fill in your name, headline, and review.' }); return; }
    setSending(true);
    // the lead and the form response go together, as on hanzo.ai; a review counts as sent when Hanzo took either
    const [filed, recorded] = await Promise.all([post('/v1/marketing/leads', lead(made)), post('/v1/form/public/hanzo.review-submit/responses', response(made))]);
    setSending(false);
    if (!filed && !recorded) { setSaid({ ok: false, text: 'Your review did not reach Hanzo. Please try again.' }); return; }
    const next = [made, ...mine];
    setMine(next);
    try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch {}
    setForm((f) => ({ ...f, name: '', role: '', company: '', title: '', body: '' }));
    setOpen(false);
    setSaid({ ok: true, text: 'Thank you! Your review reached Hanzo. It shows first in this browser.' });
  };

  return (
    <main className="xrv">
      <section className="xrv-hero">
        <div className="x-wrap">
          <p className="xrv-top"><span className="x-badge"><Icon d={SHIELD} size={14} />Hanzo Reviews · hanzo.reviews</span></p>
          <h1 className="xrv-h1">Trusted by builders and enterprise teams worldwide.</h1>
          <p className="xrv-lede">Verified reviews from engineers, founders, and creative teams building on Hanzo Dev, Enso, Kai, Studio, and Hanzo Cloud.</p>
          <div className="xrv-acts">
            <Cta kind="solid" size="lg" onClick={() => setOpen((v) => !v)} aria-expanded={open}><Icon d={WRITE} /><span>{open ? 'Close review form' : 'Write a review'}</span></Cta>
            <Cta kind="quiet" size="lg" to="/beta">Join Beta &amp; Fan Club (50% Off)</Cta>
          </div>
        </div>
      </section>

      <section className="xrv-body">
        <div className="x-wrap">
          <div className="xrv-sum">
            <div className="xrv-sum-in">
              <div className="xrv-score">
                <p><span className="xrv-big">4.9</span><span className="xrv-of">/ 5.0</span></p>
                <Stars count={5} />
              </div>
              <div className="xrv-proof">
                <p className="xrv-verified"><Icon d={SHIELD} /><span>100% Verified First-Party Reviews</span></p>
                <p className="xrv-sub">Hosted natively on hanzo.reviews — verified against active Hanzo IAM organizations and production workloads.</p>
              </div>
            </div>
            <button type="button" className="x-btn sm" onClick={() => setOpen(true)}>Share your experience</button>
          </div>

          {open && (
            <form className="xrv-form" ref={box} onSubmit={submit}>
              <div className="xrv-form-h">
                <div>
                  <h2>Submit a Review to Hanzo Reviews</h2>
                  <p>Your review helps fellow engineers and teams evaluate Hanzo.</p>
                </div>
                <div className="xrv-rate">
                  <span>Rating:</span>
                  {[1, 2, 3, 4, 5].map((r) => (
                    <button key={r} type="button" aria-label={`Rate ${r} stars`} aria-pressed={form.rating === r} onClick={() => setForm((f) => ({ ...f, rating: r }))}>
                      <Icon d={STAR} size={20} className={r <= form.rating ? 'on' : ''} fill={r <= form.rating ? 'currentColor' : 'none'} />
                    </button>
                  ))}
                </div>
              </div>

              <div className="xrv-three">
                <Field label="Your Name" name="name" required autoComplete="name" placeholder="Ada Lovelace" {...field('name')} />
                <Field label="Role / Title" name="role" autoComplete="organization-title" placeholder="Principal Engineer" {...field('role')} />
                <Field label="Company / Team" name="company" autoComplete="organization" placeholder="Acme Corp" {...field('company')} />
              </div>

              <div className="xrv-product">
                <span className="xrv-label" id="xrv-product">Product</span>
                <div className="xrv-pills" role="group" aria-labelledby="xrv-product">
                  {PRODUCTS.map((p) => <Pill key={p} on={form.product === p} onClick={() => setForm((f) => ({ ...f, product: p }))}>{p}</Pill>)}
                </div>
              </div>

              <Field label="Review Headline" name="title" required placeholder="What stood out most about building with Hanzo?" {...field('title')} />
              <Field label="Your Review" name="review" as="textarea" rows={4} required placeholder="Share your experience with speed, cost savings, developer workflow, or reliability..." {...field('body')} />

              <div className="xrv-form-f">
                <button type="button" className="x-btn" onClick={() => setOpen(false)}>Cancel</button>
                <button type="submit" className="x-btn solid" disabled={sending}>{sending ? 'Publishing…' : 'Publish Review'}</button>
              </div>
            </form>
          )}

          <div className="xrv-pills filter" role="group" aria-label="Product">
            {CATEGORIES.map((c) => <Pill key={c} on={category === c} onClick={() => setCategory(c)}>{c}</Pill>)}
          </div>

          <ul className="xrv-grid">
            {visible(mine, category).map((rev) => (
              <li key={rev.id} className="xrv-card">
                <div className="xrv-card-main">
                  <div className="xrv-card-top">
                    <Stars count={rev.rating} />
                    <span className="xrv-tag">{rev.product}</span>
                  </div>
                  <h3>{rev.title}</h3>
                  <p className="xrv-quote">{`“${rev.body}”`}</p>
                </div>
                <div className="xrv-card-foot">
                  <div>
                    <p className="xrv-who">
                      <span className="xrv-name">{rev.author}</span>
                      {rev.verified ? <span className="xrv-ver"><Icon d={CHECK} size={12} />Verified</span> : null}
                    </p>
                    <p className="xrv-role">{`${rev.role} · ${rev.company}`}</p>
                  </div>
                  <span className="xrv-date">{rev.date}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="xrv-end">
        <div className="x-wrap">
          <Cta kind="solid" size="lg" to="/beta">Join Beta &amp; Fan Club</Cta>
        </div>
      </section>

      {said && <p className={'xrv-toast' + (said.ok ? '' : ' bad')} role={said.ok ? 'status' : 'alert'}>{said.text}</p>}
    </main>
  );
}
