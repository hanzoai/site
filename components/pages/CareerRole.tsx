'use client';
/* A role as a chapter book (/careers/<role>, eight of them, one template), in the editorial manner of osply.co and
   grubogrubo.com. The hero is the same white sheet you clicked on /careers (synchronized.studio): same title type,
   same giant numeral from the deck, the same tags and line, so the click reads as one continuous open (the sheet is the
   Morph target). Inside it the role's own contour (Sigil seeded with its slug) drifts behind the numeral, and its
   contents open any chapter; a role whose words name Hanzo's own models (the research internship: Enso, Kai, Zen)
   wears their renders there instead, one of them playing. Then the role reads one chapter a screen, Why Join Hanzo is set as an editorial list, and
   the application closes the page in its one dark room. Ink, greys and white only. All wording is Hanzo's.
   Persona: an engineer, designer or researcher deciding whether to apply
   Goal: apply for this role
   CTA: "Apply for this position" (Hanzo's words), the hero's one solid; careers pages carry no sticky ask (MASTER
   part 4), so the ask bar is off (data-ask="off")
   Metric: one contact click (the application email)
   Signature: the chapter book. About the role, what you will do, what we look for and what is nice to have turn like
   pages: the chapter's words pin on the left while its page wipes up into place on the right, a row of marks shows
   where you are, and the contents on the sheet open any chapter. On a phone the chapters read straight down.
   Beyond: the fit meter, then a three-step application. Mark the requirements you already meet (each tick draws
   itself); every chapter keeps its count, the total waits beside the form, and the form asks for a few fields at a
   time, checking each step before the next. It files what Hanzo's form files (components/pages/Careers.apply.js): the
   resume file up to Hanzo's careers bucket, then one candidate lead, both on api.hanzo.ai.
   Motion (not only scroll): arrival (the title cut in), idle (the contour drifts in the sheet), state (ticks draw,
   meters fill, the form slides step to step, share answers with a tick), pointer (magnetic ask, sibling rail drags
   with inertia), scroll (the chapter wipes).
   Ledger: deleted the orange accent, the kicker over the h1 and the counters over every headline, the separate
   contents plate (folded into the hero sheet), and the invented "Back" / "Next" / "· Copied" / "Your email is ready"
   strings (icons and register names now).
   Scale (MASTER 3.1): h1 52 (40 phone), section heads 26, ledes 20, body 16–17, figures 64 (the deck numeral, the
   fit counts); the total beside the form grows past 64 only while it crosses the middle (FamGrow). The sheet is
   outlined, never outlined and shadowed; the one dark room is the application.
   Arrival from /careers: the clicked sheet's title and numeral fly onto this h1 and numeral (careers/door.js).
   Idle on the first screen: the contour drifts, the contents' hairlines draw in once and their counts fill once.
   Hanzo object per team: only roles whose words name Hanzo's models get renders (no Engine render exists in public/).
   V2: 8/10 grey deck for every member (no hue); tags under the title; hero sheet with the contents plate fully in the
   first screen at 1470×801, alive on arrival; chapters read with JS off (html.js scoped); the why and apply rooms each
   hold a drifting contour; three-step apply in the dark room; sibling roles drag and open. No sticky ask (careers). */
import type React from 'react';
import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { EASE, Magnetic } from '../ui';
import { A, Img, Film } from '../kit';
import Sigil from '../Sigil';
import FamLines from '../v2/FamLines';
import FamChapters from '../v2/FamChapters';
import FamNext from '../v2/FamNext';
import FamGrow from '../v2/FamGrow';
import { ui } from '../v2/famUi';
import { useSheetLanding } from './careers/door';
import { track } from '../../lib/track';
import { answers, problem, send } from './Careers.apply';
import type { Role } from './careersData';
import '../v2/fam.css';
import './CareerRole.css';

const nn = (i: number) => String(i).padStart(2, '0');
interface ArrowProps {
  back?: boolean;
}
const Arrow = ({ back }: ArrowProps) => <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true" style={back ? { transform: 'scaleX(-1)' } : undefined}><path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>;

/* a tick that draws itself when you mark a line */
interface BoxProps {
  on: boolean;
  soft: boolean;
}
function Box({ on, soft }: BoxProps) {
  return (
    <svg className={'xcj-box' + (soft ? ' soft' : '')} viewBox="0 0 24 24" width="28" height="28" aria-hidden="true">
      <circle cx="12" cy="12" r="10.5" fill="none" strokeWidth="1.4" className="xcj-box-o" />
      <motion.circle cx="12" cy="12" r="10.5" fill="none" strokeWidth="1.6" className="xcj-box-r" initial={false} animate={{ pathLength: on ? 1 : 0, opacity: on ? 1 : 0 }} transition={{ duration: 0.45, ease: EASE }} />
      <motion.path d="M7.5 12.5l3 3 6-6.5" fill="none" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" className="xcj-box-t" initial={false} animate={{ pathLength: on ? 1 : 0, opacity: on ? 1 : 0 }} transition={{ duration: 0.3, ease: EASE, delay: on ? 0.22 : 0 }} />
    </svg>
  );
}

/* the application, three steps at a time; it files what the form on hanzo.ai files: the resume, then the lead */
type Form = Role['form'];
type Field = Form['fields'][number];
interface StepsProps {
  f: Form;
  role: Role;
}
function Steps({ f, role }: StepsProps) {
  const form = useRef<HTMLFormElement>(null);
  const file = useRef<HTMLInputElement>(null);
  const [at, setAt] = useState(0);
  const [state, setState] = useState('idle'); // idle | sending | sent
  const [err, setErr] = useState('');
  const [mail, setMail] = useState(''); // the address the application was filed under
  const [live, setLive] = useState(false);
  useEffect(() => setLive(true), []);
  const n = f.fields.length;
  const cut = f.file ? f.file.at : Math.max(2, n - 2);
  const groups: [number, number][] = [[0, Math.min(2, cut)], [Math.min(2, cut), cut], [cut, n]];
  const steps = groups.map(([a, b]) => f.fields.slice(a, b).map((x, k): [Field, number] => [x, a + k]));
  const last = steps.length - 1;
  const inStep = (k: number) => [...form.current!.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>(`[data-step="${k}"] input, [data-step="${k}"] textarea`)];
  const check = (k: number) => { const bad = inStep(k).find((el) => !el.checkValidity()); if (bad) { bad.reportValidity(); return false; } return true; };
  const go = (k: number) => {
    setAt(k);
    setTimeout(() => { const el = inStep(k)[0]; el && el.focus({ preventScroll: true }); }, 380);
  };
  const submit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (state === 'sending') return;
    if (at < last) { if (check(at)) go(at + 1); return; }
    for (let k = 0; k <= last; k++) if (inStep(k).some((el) => !el.checkValidity())) { setAt(k); setTimeout(() => check(k), 380); return; }
    const d = new FormData(form.current!);
    const a = answers(f.fields.map((x, i) => [x.label.replace(/\s*\*$/, ''), String(d.get('f' + i) || '')]));
    const upload = (file.current && file.current.files && file.current.files[0]) || null;
    const wrong = problem(a, upload);
    if (wrong) { setErr(wrong); return; }
    setErr('');
    setState('sending');
    const r = await send({ title: role.title, department: role.chips[0], location: role.chips[1], slug: role.slug }, a, upload, d.get('news') === 'on');
    track('career_application_submitted', { role: role.title, department: role.chips[0], slug: role.slug, ...(r.ok ? {} : { error: r.cause || r.error }) });
    if (r.ok) { setState('sent'); setMail((a.email || '').trim()); } else { setState('idle'); setErr(r.error || ''); }
  };
  const field = ([x, i]: [Field, number]) => (
    <label key={i} className={'xcj-fld' + (x.type === 'textarea' ? ' wide' : '')}>
      <span>{x.label}{x.req && <b aria-hidden="true"> *</b>}</span>
      {x.type === 'textarea'
        ? <textarea name={'f' + i} required={x.req} rows={5} placeholder={x.ph} />
        : <input name={'f' + i} type={x.type} required={x.req} placeholder={x.ph} />}
    </label>
  );
  return (
    <form ref={form} className="xcj-form" onSubmit={submit} noValidate data-live={live ? '' : undefined}>
      <div className="xcj-prog" aria-hidden="true">
        <span className="x-mono">{nn(at + 1)} / {nn(steps.length)}</span>
        <span className="xcj-prog-b">{steps.map((_, k) => <i key={k} className={k <= at ? 'on' : ''} />)}</span>
      </div>
      <div className="xcj-steps">
        {steps.map((s, k) => (
          <fieldset key={k} data-step={k} className="xcj-step" data-on={k === at ? '' : undefined} data-past={k < at ? '' : undefined} inert={live && k !== at} aria-hidden={live && k !== at ? true : undefined}>
            <legend className="x-sr">{nn(k + 1)} / {nn(steps.length)}</legend>
            {s.map(field)}
            {k === 1 && f.file && (
              <div className="xcj-fld wide xcj-file">
                <span>{f.file.label}</span>
                <input ref={file} type="file" aria-label={f.file.label} accept={f.file.accept} />
                <small><span>{f.file.hint}</span></small>
                <label className="xcj-opt"><input type="checkbox" name="news" aria-label={f.check ?? undefined} /><span>{f.check}</span></label>
              </div>
            )}
          </fieldset>
        ))}
      </div>
      <div className="xcj-acts">
        {at > 0 && <button type="button" className="xcj-btn ghost round" aria-label={ui('previous')} onClick={() => go(at - 1)}><Arrow back /></button>}
        {at < last && <button type="button" className="xcj-btn solid round" aria-label={ui('next')} onClick={() => { if (check(at)) go(at + 1); }}><Arrow /></button>}
        <button type="submit" className="xcj-btn solid" hidden={live && at < last} disabled={state === 'sending'}>{state === 'sending' ? 'Submitting Application…' : f.submit}</button>
      </div>
      <p className="xcj-msg" role="status">{state === 'sent' && <><svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M3 8.5l3 3 7-7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg><span>Application Received! Thank you for applying for {role.title}. Our team reviews submissions promptly and will contact you at {mail}.</span></>}</p>
      {err && <p className="xcj-err" role="alert">{err}</p>}
    </form>
  );
}

/* the contents' counts fill once on arrival (0 up to the chapter's count, staggered), then rest at the true value;
   the server HTML and reduced motion carry the true value */
interface CountProps {
  n: number;
  i: number;
}
function Count({ n, i }: CountProps) {
  const [v, setV] = useState(n);
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let k = 0, t: ReturnType<typeof setTimeout> | undefined;
    setV(0);
    const step = () => { k += 1; setV(Math.min(n, k)); if (k < n) t = setTimeout(step, 150); };
    t = setTimeout(step, 700 + i * 120);
    return () => clearTimeout(t);
  }, [n, i]);
  return <em className="x-mono" aria-hidden="true" data-fill={v === n ? '' : undefined}>{v}</em>;
}

interface CareerRoleProps {
  role: Role;
  no: string | null;
  peers?: Pick<Role, 'slug' | 'at' | 'title' | 'chips' | 'lede'>[];
}
export default function CareerRole({ role, no, peers = [] }: CareerRoleProps) {
  useSheetLanding();
  const chapters = role.blocks.filter((b) => !b.cards.length);
  const why = role.blocks.find((b) => b.cards.length);
  const total = chapters.reduce((k, b) => k + b.items.length, 0);
  const [marks, setMarks] = useState<Set<number>>(() => new Set());
  const [copied, setCopied] = useState(false);
  let off = 0;
  const offs = chapters.map((b) => { const o = off; off += b.items.length; return o; });
  const toggle = (k: number) => setMarks((s) => { const x = new Set(s); x.has(k) ? x.delete(k) : x.add(k); return x; });
  const share = async () => {
    try { await navigator.clipboard.writeText(location.href); } catch { /* blocked: the label still answers */ }
    setCopied(true); setTimeout(() => setCopied(false), 1800);
  };
  // the contents plate opens a chapter: on a desktop the chapter's place in the pinned scene, on a phone its heading
  const open = (k: number) => (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    const sec = document.getElementById('xcj-book');
    if (!sec) return;
    let top: number;
    if (matchMedia('(min-width: 901px)').matches) top = sec.getBoundingClientRect().top + scrollY + ((sec.offsetHeight - innerHeight) * (k + 0.5)) / chapters.length;
    else top = document.getElementById('xcj-ch-' + k)!.getBoundingClientRect().top + scrollY - 88; // the chapter's heading, drawn by FamChapters
    window.__lenis ? window.__lenis.scrollTo(top, { duration: 1.2 }) : scrollTo({ top, behavior: 'smooth' });
  };
  const toc = [...chapters.map((b) => b.title), ...(why ? [why.title] : []), role.form.title];
  const tocAt = (i: number) => (i < chapters.length ? open(i) : undefined);
  const items = chapters.map((b, ci) => {
    const isList = b.items.length > 0;
    const soft = b.title === 'Nice to Have';
    const mine = isList ? b.items.filter((_, i) => marks.has(offs[ci] + i)).length : 0;
    return {
      key: b.title,
      name: b.title,
      text: (
        <div className="xcj-ch-t" id={'xcj-ch-' + ci}>
          <h2 className="v2f-head xcj-ch-h">{b.title}</h2>
          {b.paras[0] && <p className="v2f-lede xcj-ch-l">{b.paras[0]}</p>}
          {isList && (
            <p className="xcj-fit" aria-live="polite">
              <b className="v2f-num v2f-fig">{mine}</b><span className="x-mono">/ {b.items.length}</span>
              <i aria-hidden="true"><u style={{ transform: `scaleX(${b.items.length ? mine / b.items.length : 0})` }} /></i>
            </p>
          )}
        </div>
      ),
      visual: (
        <div className={'xcj-pg' + (isList ? '' : ' prose')}>
          {isList ? (
            <ol className="xcj-list">
              {b.items.map((t, i) => {
                const k = offs[ci] + i, on = marks.has(k);
                return (
                  <li key={k} data-on={on || undefined}>
                    <button type="button" role="checkbox" aria-checked={on} onClick={() => toggle(k)}>
                      <span className="xcj-n x-mono" aria-hidden="true">{nn(i + 1)}</span>
                      <span className="xcj-it">{t}</span>
                      <Box on={on} soft={soft} />
                    </button>
                  </li>
                );
              })}
            </ol>
          ) : (
            <>
              <Sigil seed={'/careers/' + role.slug + '/' + ci} data={[b.paras.join(' ').length, total]} className="xcj-pg-s" still />
              <div className="xcj-pg-p">{b.paras.slice(1).map((p, i) => <p key={i}>{p}</p>)}</div>
            </>
          )}
        </div>
      ),
    };
  });
  // a role that names Hanzo's own models wears their renders in its sheet (colour only from Hanzo's media)
  const media = !!(role.models && role.models.length);
  const sibs = peers.map((p) => ({ href: '/careers/' + p.slug, title: p.title, preview: p.lede, meta: p.chips.join(' · '), seed: '/careers/' + p.slug }));
  return (
    <main className="v2f xcj" data-ask="off">
      <section className="xcj-hero" aria-labelledby="xcj-h1" data-ask-name={role.title}>
        <div className="v2f-wrap">
          <div className="xcj-top">
            <A to="/careers" className="x-arrow xcj-back">
              <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M13 8H4M7.5 4.5 4 8l3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
              <span>{role.back}</span>
            </A>
            <button type="button" className="xcj-share" data-on={copied ? '' : undefined} onClick={share}>
              <span className="xcj-share-i" aria-hidden="true">
                {copied
                  ? <svg viewBox="0 0 16 16" width="15" height="15"><path d="M3 8.5l3 3 7-7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  : <svg viewBox="0 0 16 16" width="15" height="15"><path d="M6.8 9.2a2.6 2.6 0 0 0 3.7 0l2-2a2.6 2.6 0 0 0-3.7-3.7l-.6.6M9.2 6.8a2.6 2.6 0 0 0-3.7 0l-2 2a2.6 2.6 0 0 0 3.7 3.7l.6-.6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>}
              </span>
              <span>{role.share}</span>
              <span className="x-sr" role="status">{copied ? ui('copied') : ''}</span>
            </button>
          </div>
          {/* the deck's own sheet, opened: the Morph target for the sheet you clicked on /careers */}
          <article className="xcj-sheet" data-morph-target>
            <Sigil seed={'/careers/' + role.slug} data={[total, role.blocks.length, role.form.fields.length]} className="xcj-sheet-s" still={media} />
            <div className="xcj-sheet-l">
              <FamLines as="h1" id="xcj-h1" text={role.title} className="xcj-h1" />
              <ul className="xcj-tags">{role.chips.map((c) => <li key={c}>{c}</li>)}</ul>
              <p className="v2f-lede xcj-lede">{role.lede}</p>
              <div className="xcj-hero-a">
                <Magnetic strength={0.22}><a className="v2f-btn solid" href="#apply" data-thumb={role.apply} data-cta="careers.hero">{role.apply}</a></Magnetic>
                <a className="v2f-btn" href={role.email.href}>{role.email.text}</a>
              </div>
            </div>
            <div className="xcj-sheet-r">
              {no && <span className="xcj-no v2f-num v2f-fig" aria-hidden="true">{no}</span>}
              {media && (
                <ul className="xcj-media">
                  {role.models.slice(0, 3).map(([m, name], i) => (
                    <li key={m}>
                      {i === 0
                        ? <Film src={'/models/' + m + '.webm'} poster={'/models/' + m + '.webp'} w={1200} h={1500} label={name} />
                        : <Img src={'/models/' + m + '.webp'} alt={name} w={1200} h={1500} />}
                      <span className="x-mono" aria-hidden="true">{name}</span>
                    </li>
                  ))}
                </ul>
              )}
              <ol className={'xcj-toc' + (media ? ' slim' : '')}>
                {toc.map((t, i) => (
                  <li key={t}>
                    <a href={i < chapters.length ? '#xcj-ch-' + i : i === toc.length - 1 ? '#apply' : '#xcj-why'} onClick={tocAt(i)}>
                      <span className="x-mono">{nn(i + 1)}</span><b>{t}</b>
                      {i < chapters.length && chapters[i].items.length > 0 && <Count n={chapters[i].items.length} i={i} />}
                    </a>
                  </li>
                ))}
              </ol>
            </div>
          </article>
        </div>
      </section>

      <FamChapters id="xcj-book" label={role.title} items={items} className="xcj-book" />

      {why && (
        <section className="xcj-why v2f-sec" id="xcj-why" aria-labelledby="xcj-why-h">
          <div className="v2f-wrap v2f-grid">
            <div className="xcj-why-l">
              <FamLines as="h2" play="view" id="xcj-why-h" text={why.title} className="v2f-head" />
              {/* the section's object: the role's contour, drifting by itself (one idle mover on this screen) */}
              <div className="xcj-why-s" aria-hidden="true"><Sigil seed={'/careers/' + role.slug + '/why'} data={[why.cards.length, total]} /></div>
            </div>
            <ol className="xcj-why-r">
              {why.cards.map(([t, d], i) => (
                <li key={t}>
                  <span className="x-mono">{nn(i + 1)}</span>
                  <b><span>{t}</span></b>
                  <span>{d}</span>
                </li>
              ))}
            </ol>
          </div>
        </section>
      )}

      <section className="xcj-apply" id="apply" data-room="dark" aria-labelledby="xcj-apply-h">
        <div className="v2f-wrap v2f-grid">
          <div className="xcj-apply-l">
            <FamLines as="h2" play="view" id="xcj-apply-h" text={role.form.title} className="v2f-head" />
            <p className="xcj-apply-i">{role.form.intro}</p>
            {total > 0 && (
              <p className="xcj-fit dark" aria-hidden="true">
                <FamGrow to={1.75}><b className="v2f-num v2f-fig">{marks.size}</b></FamGrow><span className="x-mono">/ {total}</span>
                <i><u style={{ transform: `scaleX(${marks.size / total})` }} /></i>
              </p>
            )}
            {role.form.note && <p className="xcj-note">{role.form.note.text} <a href={role.form.note.href}>{role.form.note.mail}</a></p>}
            <div className="xcj-apply-s" aria-hidden="true"><Sigil seed={'/careers/' + role.slug + '/apply'} data={[role.form.fields.length, total]} /></div>
          </div>
          <div className="xcj-apply-r"><Steps f={role.form} role={role} /></div>
        </div>
      </section>

      {sibs.length > 0 && (
        <section className="xcj-next v2f-sec tight">
          <div className="v2f-wrap">
            <p className="xcj-next-h"><A to="/careers" className="x-arrow"><span>{role.back}</span></A></p>
            <FamNext items={sibs} label={role.back} />
          </div>
        </section>
      )}
    </main>
  );
}
