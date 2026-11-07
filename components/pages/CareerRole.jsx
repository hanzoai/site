'use client';
/* A role as a mission brief (/careers/<role>, one template). The name types itself in Zen Mono over a contour field
   seeded from the role's slug and its own counts, so no two roles share a picture. All wording is Hanzo's.
   Signature: the brief that ticks as you read. Each requirement checks itself once it passes the lower third of the
   screen, the meter fills, and an Apply dock follows you until the form is on screen.
   Beyond: the fit meter. Tap any requirement to mark it yourself; the count of the role's own requirements rides in
   the brief and in the dock, so you know where you stand before you apply. */
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useInView, useReducedMotion } from 'motion/react';
import { EASE, Rise, Words } from '../ui';
import { A } from '../kit';
import Sigil from '../Sigil';
import { useArrival } from './doorway';
import './Careers.css';

/* The role name, typed into a text node through a ref (no state per character). */
function Typed({ text }) {
  const ref = useRef(null);
  const calm = useReducedMotion();
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || calm) return;
    el.textContent = '';
    let i = 0;
    let id = 0;
    const t0 = setTimeout(function tick() {
      i += 1;
      el.textContent = text.slice(0, i);
      if (i < text.length) id = setTimeout(tick, 52 + Math.random() * 40);
    }, 450);
    return () => { clearTimeout(t0); clearTimeout(id); el.textContent = text; };
  }, [text, calm]);
  return (
    <h1 className="xcr-h1">
      <span className="x-sr">{text}</span>
      <span aria-hidden="true" ref={ref}>{text}</span>
      <i className="xcr-caret" aria-hidden="true" />
    </h1>
  );
}

function Box({ on, soft }) {
  return (
    <svg className={'xcr-box' + (soft ? ' soft' : '')} viewBox="0 0 24 24" width="26" height="26" aria-hidden="true">
      <circle cx="12" cy="12" r="10.5" fill="none" strokeWidth="1.5" />
      <motion.circle cx="12" cy="12" r="10.5" fill="none" strokeWidth="1.5" className="xcr-ring" initial={false} animate={{ pathLength: on ? 1 : 0 }} transition={{ duration: 0.5, ease: EASE }} />
      <motion.path d="M7.5 12.5l3 3 6-6.5" fill="none" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" initial={false} animate={{ pathLength: on ? 1 : 0 }} transition={{ duration: 0.35, ease: EASE, delay: on ? 0.25 : 0 }} />
    </svg>
  );
}

function Checklist({ b, offset, ticks, toggle, soft }) {
  return (
    <ul className="xcr-list">
      {b.items.map((t, i) => {
        const k = offset + i;
        const on = ticks.has(k);
        return (
          <motion.li key={k} data-ck={k} initial={{ opacity: 0, x: -14 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.5 }} transition={{ duration: 0.7, ease: EASE, delay: (i % 4) * 0.05 }} data-on={on || undefined}>
            <button type="button" role="checkbox" aria-checked={on} onClick={() => toggle(k)}>
              <Box on={on} soft={soft} />
              <span>{t}</span>
            </button>
          </motion.li>
        );
      })}
    </ul>
  );
}

function Form({ f, role }) {
  const [msg, setMsg] = useState('');
  const file = useRef(null);
  const subject = role.email.href.split('?')[1] || '';
  const submit = (e) => {
    e.preventDefault();
    const d = new FormData(e.currentTarget);
    const lines = f.fields.map((x, i) => `${x.label}: ${d.get('f' + i) || ''}`);
    if (f.file) { const nm = file.current && file.current.files[0] && file.current.files[0].name; if (nm) lines.push(`${f.file.label}: ${nm}`); }
    const body = lines.join('\n');
    location.href = `mailto:${f.note.mail}?${subject}&body=${encodeURIComponent(body)}`;
    setMsg(f.file && file.current && file.current.files[0] ? 'Your email is ready. Attach ' + file.current.files[0].name + ' to it.' : 'Your email is ready to send.');
  };
  const field = (x, i) => (
    <label key={i} className={'xcr-fld' + (x.type === 'textarea' ? ' wide' : '')}>
      <span>{x.label}{x.req && <b aria-hidden="true"> *</b>}</span>
      {x.type === 'textarea'
        ? <textarea name={'f' + i} required={x.req} rows={5} placeholder={x.ph} />
        : <input name={'f' + i} type={x.type} required={x.req} placeholder={x.ph} />}
    </label>
  );
  const head = f.fields.slice(0, f.file ? f.file.at : f.fields.length);
  const tail = f.file ? f.fields.slice(f.file.at) : [];
  return (
    <form className="xcr-form" onSubmit={submit}>
      {head.map((x, i) => field(x, i))}
      {f.file && (
        <div className="xcr-fld wide xcr-file">
          <span>{f.file.label}</span>
          <input ref={file} type="file" aria-label={f.file.label} accept={f.file.accept} />
          <small>{f.file.hint}</small>
          <label className="xcr-opt"><input type="checkbox" name="news" aria-label={f.check} /><span>{f.check}</span></label>
        </div>
      )}
      {tail.map((x, i) => field(x, head.length + i))}
      <div className="xcr-sub wide">
        <motion.button type="submit" className="xcr-submit" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>{f.submit}</motion.button>
        <p>{f.note.text} <a href={f.note.href}>{f.note.mail}</a></p>
      </div>
      <p className="xcr-msg" role="status">{msg}</p>
    </form>
  );
}

export default function CareerRole({ role }) {
  useArrival();
  const total = role.blocks.reduce((n, b) => n + b.items.length, 0);
  const [ticks, setTicks] = useState(() => new Set());
  const manual = useRef(new Set());
  const hero = useRef(null);
  const applyRef = useRef(null);
  const heroSeen = useInView(hero, { amount: 0.15, initial: true }); // no dock in the server HTML or on arrival
  const applySeen = useInView(applyRef, { amount: 0.15 });
  const [copied, setCopied] = useState(false);
  // items tick themselves once they pass the lower third of the screen
  useEffect(() => {
    const io = new IntersectionObserver((es) => {
      const add = es.filter((e) => (e.isIntersecting || e.boundingClientRect.top < 0) && !manual.current.has(+e.target.dataset.ck)).map((e) => +e.target.dataset.ck);
      if (add.length) setTicks((s) => new Set([...s, ...add]));
    }, { rootMargin: '0px 0px -38% 0px' });
    document.querySelectorAll('[data-ck]').forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, [role.slug]);
  const toggle = (k) => {
    manual.current.add(k);
    setTicks((s) => { const n = new Set(s); n.has(k) ? n.delete(k) : n.add(k); return n; });
  };
  let off = 0;
  const offs = role.blocks.map((b) => { const o = off; off += b.items.length; return o; });
  const [team, where, kind] = role.chips;
  const dock = !heroSeen && !applySeen;
  const share = async () => {
    try { await navigator.clipboard.writeText(location.href); } catch { /* blocked */ }
    setCopied(true); setTimeout(() => setCopied(false), 1800);
  };
  return (
    <main className="xcr xcr-role">
      <section ref={hero} className="xcr-brief-s">
        <div className="x-wrap">
          <div className="xcr-top">
            <A to="/careers" className="x-arrow xcr-back">
              <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M13 8H4M7.5 4.5 4 8l3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
              <span>{role.back}</span>
            </A>
            <button type="button" className="x-copy" onClick={share}>{role.share}{copied && <em className="xcr-copied" role="status"> · Copied</em>}</button>
          </div>
          <motion.div className="xcr-brief" initial={{ opacity: 0, y: 24, scale: 0.985 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 1, ease: EASE }}>
            <Sigil seed={'/careers/' + role.slug} data={[total, role.blocks.length, role.form.fields.length]} className="xcr-sigil" />
            <ul className="xcr-chips">
              {[team, where, kind].map((c) => <li key={c}>{c}</li>)}
            </ul>
            <Typed text={role.title} />
            <motion.p className="xcr-lede" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: EASE, delay: 0.5 }}>{role.lede}</motion.p>
            <motion.div className="xcr-acts" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: EASE, delay: 0.65 }}>
              <a className="xcr-btn solid" href="#apply" data-thumb={role.apply}>{role.apply}</a>
              <a className="xcr-btn" href={role.email.href}>{role.email.text}</a>
            </motion.div>
            <div className="xcr-meter" aria-hidden="true">
              <span className="x-mono"><b>{ticks.size}</b> / {total}</span>
              <i><motion.u animate={{ scaleX: total ? ticks.size / total : 0 }} transition={{ duration: 0.6, ease: EASE }} /></i>
            </div>
          </motion.div>
        </div>
      </section>

      {role.blocks.map((b, bi) => {
        const isAbout = b.paras.length > 0;
        const isWhy = b.cards.length > 0;
        return (
          <section key={b.title} className={'xcr-sec' + (isWhy ? ' why' : '')}>
            <div className="x-wrap xcr-split">
              <header className="xcr-sh">
                <p className="x-kick">{String(bi + 1).padStart(2, '0')}</p>
                <Words text={b.title} />
              </header>
              <div className="xcr-sb">
                {isAbout && b.paras.map((p, i) => <p key={i} className={i === 0 ? 'xcr-big' : 'xcr-small'}>{p}</p>)}
                {b.items.length > 0 && <Checklist b={b} offset={offs[bi]} ticks={ticks} toggle={toggle} soft={b.title === 'Nice to Have'} />}
                {isWhy && (
                  <ul className="xcr-why">
                    {b.cards.map(([t, d], i) => (
                      <Rise as="li" key={t} delay={i * 0.08} y={24}>
                        <span className="x-mono">{String(i + 1).padStart(2, '0')}</span>
                        <b>{t}</b>
                        <span>{d}</span>
                      </Rise>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </section>
        );
      })}

      <section className="xcr-sec xcr-apply" id="apply" ref={applyRef}>
        <div className="x-wrap xcr-split">
          <header className="xcr-sh">
            <p className="x-kick">{String(role.blocks.length + 1).padStart(2, '0')}</p>
            <Words text={role.form.title} />
            <p className="xcr-small">{role.form.intro}</p>
          </header>
          <Rise className="xcr-sb"><Form f={role.form} role={role} /></Rise>
        </div>
      </section>

      <AnimatePresence>
        {dock && (
          <motion.div className="xcr-dock" role="region" aria-label={role.title} initial={{ y: 90, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 90, opacity: 0 }} transition={{ duration: 0.6, ease: EASE }}>
            <span className="xcr-dock-t">{role.title}</span>
            <span className="xcr-dock-m x-mono" aria-hidden="true">{ticks.size}/{total}</span>
            <a className="xcr-btn solid sm" href="#apply">{role.apply}</a>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
