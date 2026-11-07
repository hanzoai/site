'use client';
/* A role as a chapter book (/careers/<role>, eight of them, one template), in the editorial manner of osply.co and
   grubogrubo.com: the role's name set at display size across eight columns, its one line answering it low on the right,
   and under them a contents plate (the role's own contour, seeded from its slug and counts, in its own accent) that
   starts close and settles as you scroll. Then the role reads one chapter a screen, Why Join Hanzo is set as an
   editorial list, and the application closes the page in its one dark room. All wording is Hanzo's.
   Signature: the chapter book. About the role, what you will do, what we look for and what is nice to have turn like
   pages: the chapter's words pin on the left while its page wipes up into place on the right, a row of marks shows
   where you are, and the contents plate opens any chapter. On a phone the chapters read straight down.
   Beyond: the fit meter, then a three-step application. Mark the requirements you already meet (each tick draws
   itself); every chapter keeps its count, the total waits beside the form, and the form asks for a few fields at a
   time, checking each step before the next. It still writes the email Hanzo's form writes; nothing is sent from here.
   V2: 8/10 rebuilt as an editorial chapter book: display-size title, contents plate as the Stage object, sticky
   chapters with page wipes, editorial Why Join list, dark apply room with a three-step form, sibling roles that open. */
import { useRef, useState } from 'react';
import { motion } from 'motion/react';
import { EASE } from '../ui';
import { A } from '../kit';
import Sigil from '../Sigil';
import FamLines from '../v2/FamLines';
import FamStage from '../v2/FamStage';
import FamChapters from '../v2/FamChapters';
import FamNext from '../v2/FamNext';
import { accentAt } from '../v2/famAccent';
import { useArrival } from './doorway';
import '../v2/fam.css';
import './CareerRole.css';

const nn = (i) => String(i).padStart(2, '0');

/* a tick that draws itself when you mark a line */
function Box({ on, soft }) {
  return (
    <svg className={'xcj-box' + (soft ? ' soft' : '')} viewBox="0 0 24 24" width="28" height="28" aria-hidden="true">
      <circle cx="12" cy="12" r="10.5" fill="none" strokeWidth="1.4" className="xcj-box-o" />
      <motion.circle cx="12" cy="12" r="10.5" fill="none" strokeWidth="1.6" className="xcj-box-r" initial={false} animate={{ pathLength: on ? 1 : 0, opacity: on ? 1 : 0 }} transition={{ duration: 0.45, ease: EASE }} />
      <motion.path d="M7.5 12.5l3 3 6-6.5" fill="none" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" className="xcj-box-t" initial={false} animate={{ pathLength: on ? 1 : 0, opacity: on ? 1 : 0 }} transition={{ duration: 0.3, ease: EASE, delay: on ? 0.22 : 0 }} />
    </svg>
  );
}

/* the application, three steps at a time; it writes the same email the form on hanzo.ai writes */
function Steps({ f, role }) {
  const form = useRef(null);
  const file = useRef(null);
  const [at, setAt] = useState(0);
  const [msg, setMsg] = useState('');
  const n = f.fields.length;
  const cut = f.file ? f.file.at : Math.max(2, n - 2);
  const groups = [[0, Math.min(2, cut)], [Math.min(2, cut), cut], [cut, n]];
  const steps = groups.map(([a, b]) => f.fields.slice(a, b).map((x, k) => [x, a + k]));
  const last = steps.length - 1;
  const inStep = (k) => [...form.current.querySelectorAll(`[data-step="${k}"] input, [data-step="${k}"] textarea`)];
  const check = (k) => { const bad = inStep(k).find((el) => !el.checkValidity()); if (bad) { bad.reportValidity(); return false; } return true; };
  const go = (k) => {
    setAt(k);
    setTimeout(() => { const el = inStep(k)[0]; el && el.focus({ preventScroll: true }); }, 380);
  };
  const submit = (e) => {
    e.preventDefault();
    if (at < last) { if (check(at)) go(at + 1); return; }
    for (let k = 0; k <= last; k++) if (inStep(k).some((el) => !el.checkValidity())) { setAt(k); setTimeout(() => check(k), 380); return; }
    const d = new FormData(form.current);
    const lines = f.fields.map((x, i) => `${x.label}: ${d.get('f' + i) || ''}`);
    const nm = f.file && file.current && file.current.files[0] && file.current.files[0].name;
    if (nm) lines.push(`${f.file.label}: ${nm}`);
    const subject = role.email.href.split('?')[1] || '';
    location.href = `mailto:${f.note.mail}?${subject}&body=${encodeURIComponent(lines.join('\n'))}`;
    setMsg(nm ? 'Your email is ready. Attach ' + nm + ' to it.' : 'Your email is ready to send.');
  };
  const field = ([x, i]) => (
    <label key={i} className={'xcj-fld' + (x.type === 'textarea' ? ' wide' : '')}>
      <span>{x.label}{x.req && <b aria-hidden="true"> *</b>}</span>
      {x.type === 'textarea'
        ? <textarea name={'f' + i} required={x.req} rows={5} placeholder={x.ph} />
        : <input name={'f' + i} type={x.type} required={x.req} placeholder={x.ph} />}
    </label>
  );
  return (
    <form ref={form} className="xcj-form" onSubmit={submit} noValidate>
      <div className="xcj-prog" aria-hidden="true">
        <span className="x-mono">{nn(at + 1)} / {nn(steps.length)}</span>
        <span className="xcj-prog-b">{steps.map((_, k) => <i key={k} className={k <= at ? 'on' : ''} />)}</span>
      </div>
      <div className="xcj-steps">
        {steps.map((s, k) => (
          <fieldset key={k} data-step={k} className="xcj-step" data-on={k === at ? '' : undefined} data-past={k < at ? '' : undefined} inert={k !== at} aria-hidden={k !== at}>
            <legend className="x-sr">{nn(k + 1)} / {nn(steps.length)}</legend>
            {s.map(field)}
            {k === 1 && f.file && (
              <div className="xcj-fld wide xcj-file">
                <span>{f.file.label}</span>
                <input ref={file} type="file" aria-label={f.file.label} accept={f.file.accept} />
                <small>{f.file.hint}</small>
                <label className="xcj-opt"><input type="checkbox" name="news" aria-label={f.check} /><span>{f.check}</span></label>
              </div>
            )}
          </fieldset>
        ))}
      </div>
      <div className="xcj-acts">
        {at > 0 && <button type="button" className="xcj-btn ghost" onClick={() => go(at - 1)}>Back</button>}
        {at < last && <button type="button" className="xcj-btn acc" onClick={() => { if (check(at)) go(at + 1); }}>Next</button>}
        <button type="submit" className="xcj-btn acc" hidden={at < last}>{f.submit}</button>
      </div>
      <p className="xcj-msg" role="status">{msg}</p>
    </form>
  );
}

export default function CareerRole({ role, peers = [] }) {
  useArrival();
  const acc = accentAt(Math.max(0, role.at || 0));
  const chapters = role.blocks.filter((b) => !b.cards.length);
  const why = role.blocks.find((b) => b.cards.length);
  const total = chapters.reduce((k, b) => k + b.items.length, 0);
  const [marks, setMarks] = useState(() => new Set());
  const [copied, setCopied] = useState(false);
  let off = 0;
  const offs = chapters.map((b) => { const o = off; off += b.items.length; return o; });
  const toggle = (k) => setMarks((s) => { const x = new Set(s); x.has(k) ? x.delete(k) : x.add(k); return x; });
  const share = async () => {
    try { await navigator.clipboard.writeText(location.href); } catch { /* blocked: the label still answers */ }
    setCopied(true); setTimeout(() => setCopied(false), 1800);
  };
  // the contents plate opens a chapter: on a desktop the chapter's place in the pinned scene, on a phone its heading
  const open = (k) => (e) => {
    e.preventDefault();
    const sec = document.getElementById('xcj-book');
    if (!sec) return;
    let top;
    if (matchMedia('(min-width: 901px)').matches) top = sec.getBoundingClientRect().top + scrollY + ((sec.offsetHeight - innerHeight) * (k + 0.5)) / chapters.length;
    else top = document.getElementById('xcj-ch-' + k).getBoundingClientRect().top + scrollY - 88;
    window.__lenis ? window.__lenis.scrollTo(top, { duration: 1.2 }) : scrollTo({ top, behavior: 'smooth' });
  };
  const toc = [...chapters.map((b) => b.title), ...(why ? [why.title] : []), role.form.title];
  const tocAt = (i) => (i < chapters.length ? open(i) : undefined);
  const items = chapters.map((b, ci) => {
    const isList = b.items.length > 0;
    const soft = b.title === 'Nice to Have';
    const mine = isList ? b.items.filter((_, i) => marks.has(offs[ci] + i)).length : 0;
    return {
      key: b.title,
      name: b.title,
      text: (
        <div className="xcj-ch-t" id={'xcj-ch-' + ci}>
          <p className="v2f-kick acc">{nn(ci + 1)} <span className="xcj-of">/ {nn(toc.length)}</span></p>
          <h2 className="v2f-head xcj-ch-h">{b.title}</h2>
          {b.paras[0] && <p className="v2f-lede xcj-ch-l">{b.paras[0]}</p>}
          {isList && (
            <p className="xcj-fit" aria-live="polite">
              <b className="v2f-num">{mine}</b><span className="x-mono">/ {b.items.length}</span>
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
  const sibs = peers.map((p) => ({ href: '/careers/' + p.slug, kicker: p.chips[0], title: p.title, meta: p.chips.slice(1).join(' · '), seed: '/careers/' + p.slug, acc: accentAt(p.at) }));
  return (
    <main className="v2f xcj" style={{ '--acc': acc }}>
      <section className="xcj-hero" aria-labelledby="xcj-h1">
        <div className="v2f-wrap">
          <div className="xcj-top">
            <A to="/careers" className="x-arrow xcj-back">
              <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M13 8H4M7.5 4.5 4 8l3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
              <span>{role.back}</span>
            </A>
            <button type="button" className="xcj-share" onClick={share}>{role.share}<em role="status">{copied ? ' · Copied' : ''}</em></button>
          </div>
          <ul className="xcj-chips v2f-kick">{role.chips.map((c) => <li key={c}>{c}</li>)}</ul>
          <div className="v2f-grid xcj-hero-g">
            <FamLines as="h1" id="xcj-h1" text={role.title} className="v2f-display xcj-h1" data-morph-target />
            <div className="xcj-hero-r">
              <p className="v2f-lede xcj-lede">{role.lede}</p>
              <div className="xcj-hero-a">
                <a className="v2f-btn acc" href="#apply" data-thumb={role.apply}>{role.apply}</a>
                <a className="v2f-btn" href={role.email.href}>{role.email.text}</a>
              </div>
            </div>
          </div>
        </div>
        <FamStage className="v2f-wrap xcj-stage" from={1.08}>
          <div className="xcj-plate">
            <Sigil seed={'/careers/' + role.slug} data={[total, role.blocks.length, role.form.fields.length]} className="xcj-plate-s" />
            <ol className="xcj-toc">
              {toc.map((t, i) => (
                <li key={t}>
                  <a href={i < chapters.length ? '#xcj-ch-' + i : i === toc.length - 1 ? '#apply' : '#xcj-why'} onClick={tocAt(i)}>
                    <span className="x-mono">{nn(i + 1)}</span><b>{t}</b>
                    {i < chapters.length && chapters[i].items.length > 0 && <em className="x-mono" aria-hidden="true">{chapters[i].items.length}</em>}
                  </a>
                </li>
              ))}
            </ol>
          </div>
        </FamStage>
      </section>

      <FamChapters id="xcj-book" label={role.title} items={items} className="xcj-book" />

      {why && (
        <section className="xcj-why v2f-sec" id="xcj-why" aria-labelledby="xcj-why-h">
          <div className="v2f-wrap v2f-grid">
            <div className="xcj-why-l">
              <p className="v2f-kick acc">{nn(chapters.length + 1)} <span className="xcj-of">/ {nn(toc.length)}</span></p>
              <FamLines as="h2" play="view" id="xcj-why-h" text={why.title} className="v2f-display small" />
            </div>
            <ol className="xcj-why-r">
              {why.cards.map(([t, d], i) => (
                <li key={t}>
                  <span className="x-mono">{nn(i + 1)}</span>
                  <b>{t}</b>
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
            <p className="v2f-kick">{nn(toc.length)} <span className="xcj-of">/ {nn(toc.length)}</span></p>
            <FamLines as="h2" play="view" id="xcj-apply-h" text={role.form.title} className="v2f-display small" />
            <p className="xcj-apply-i">{role.form.intro}</p>
            {total > 0 && (
              <p className="xcj-fit dark" aria-hidden="true">
                <b className="v2f-num">{marks.size}</b><span className="x-mono">/ {total}</span>
                <i><u style={{ transform: `scaleX(${marks.size / total})` }} /></i>
              </p>
            )}
            <p className="xcj-note">{role.form.note.text} <a href={role.form.note.href}>{role.form.note.mail}</a></p>
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
