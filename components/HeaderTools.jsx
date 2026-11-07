'use client';
/* The rest of Hanzo's header, working (mounted once by Chrome's Header; pages add nothing):
   - ⌘K / Ctrl+K or the header's search: every page, Hanzo's own groups, and Ask Hanzo. Asking (the "Ask AI" button, or
     Enter on the "Ask AI: …" row) answers in place: it streams from Hanzo's public chat (POST /v1/chat/public, model
     enso, the same request hanzo.ai/chat sends) with the page you are on as context, and if the chat cannot be reached
     it offers hanzo.ai/chat with your question. Any page can open it: dispatch a ⌘K keydown, as the phone thumb bar does.
   - the language menu with all of Hanzo's locales, the Log in choices, and Hanzo's cookie notice with its preferences.
   - On phones (≤ 700 px) search and the menus rise from the bottom as sheets; drag the grip down to close. */
import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence, useDragControls } from 'motion/react';
import { LOGIN, LANGS, SEARCH, COOKIES } from '../lib/header';

const EASE = [0.16, 1, 0.3, 1];
const UP = { API: 1, CLI: 1, DNS: 1, HSM: 1, IAM: 1, IDE: 1, KMS: 1, MCP: 1, MQ: 1, UI: 1, GUI: 1, S3: 1, ZAP: 1, IDV: 1, SDKS: 'SDKs', O11Y: 'O11y' };
const nameOf = (p) => {
  const w = p.split('/').pop().split('-').map((x) => x.toUpperCase());
  return w.map((x) => (UP[x] === 1 ? x : UP[x] || x[0] + x.slice(1).toLowerCase())).join(' ');
};
const go = (router, href) => { if (href.startsWith('/')) router.push(href); else window.open(href, href.startsWith('https://hanzo.ai') ? '_self' : '_blank', 'noopener'); };
const CHAT = 'https://api.hanzo.ai/v1/chat/public';
const chatLink = (q) => 'https://hanzo.ai/chat?q=' + encodeURIComponent(q);

// phones get bottom sheets that close when the grip is dragged down; read only after a tap opens one, never on the server
function useSheet(onClose) {
  const dc = useDragControls();
  const sheet = matchMedia('(max-width: 700px)').matches;
  if (!sheet) return { sheet, drag: {}, grip: null };
  const drag = { drag: 'y', dragControls: dc, dragListener: false, dragConstraints: { top: 0, bottom: 0 }, dragElastic: { top: 0, bottom: 0.7 }, onDragEnd: (_, i) => { if (i.offset.y > 90 || i.velocity.y > 600) onClose(); } };
  return { sheet, drag, grip: <span className="x-grip" onPointerDown={(e) => dc.start(e)} aria-hidden="true" /> };
}

// Ask Hanzo: one question about the page you are on; the answer is written into `out` as it arrives (text only)
async function askHanzo(q, out, signal, calm) {
  const desc = document.querySelector('meta[name="description"]')?.content || '';
  const page = `The visitor is reading https://hanzo.ai${location.pathname}, the page "${document.title}"${desc ? ': ' + desc : ''}. Answer as Hanzo, briefly.`;
  const res = await fetch(CHAT, { method: 'POST', headers: { 'Content-Type': 'application/json' }, signal, body: JSON.stringify({ model: 'enso', messages: [{ role: 'system', content: page }, { role: 'user', content: q }] }) });
  if (!res.ok || !res.body) throw new Error('chat ' + res.status);
  const sse = /event-stream/.test(res.headers.get('content-type') || '');
  const rd = res.body.getReader(), dec = new TextDecoder();
  let buf = '', text = '';
  const take = (lines) => { for (const l of lines) { const m = /^data:\s?(.*)/.exec(l.trim()); if (!m || m[1] === '[DONE]') continue; try { const c = JSON.parse(m[1]).choices?.[0]; text += c?.delta?.content ?? c?.message?.content ?? ''; } catch {} } };
  for (;;) {
    const { done, value } = await rd.read();
    if (done) break;
    buf += dec.decode(value, { stream: true });
    if (!sse) continue;
    const lines = buf.split('\n'); buf = lines.pop();
    take(lines); out(text);
  }
  if (sse) { take([buf]); out(text); return text; }
  text = JSON.parse(buf)?.choices?.[0]?.message?.content || ''; // a whole answer at once: still let it arrive a few letters a frame
  for (let i = calm ? text.length : 3; i < text.length && !signal.aborted; i += 3) { out(text.slice(0, i)); await new Promise((r) => requestAnimationFrame(r)); }
  out(text);
  return text;
}

function Palette({ onClose }) {
  const router = useRouter();
  const [q, setQ] = useState('');
  const [pages, setPages] = useState([]);
  const [at, setAt] = useState(0);
  const [ans, setAns] = useState(null); // { q, state: 'wait' | 'stream' | 'done' | 'error' }
  const input = useRef(null);
  const list = useRef(null);
  const out = useRef(null);
  const ctl = useRef(null);
  const { sheet, drag, grip } = useSheet(onClose);
  useEffect(() => {
    const back = document.activeElement; // focus returns here when search closes
    input.current?.focus(); import('../lib/search.json').then((m) => setPages(m.default));
    return () => { ctl.current?.abort(); if (back && back.isConnected) back.focus?.(); };
  }, []);
  const ask = async (question) => {
    const qq = question.trim().slice(0, 2000);
    if (!qq) return;
    ctl.current?.abort();
    const c = (ctl.current = new AbortController());
    const timer = setTimeout(() => c.abort(), 25000);
    setAns({ q: qq, state: 'wait' });
    const write = (t) => { if (out.current) out.current.textContent = t; if (t) setAns((a) => (a?.state === 'wait' ? { ...a, state: 'stream' } : a)); };
    write('');
    try {
      const text = await askHanzo(qq, write, c.signal, matchMedia('(prefers-reduced-motion: reduce)').matches);
      if (!text) throw new Error('empty');
      if (ctl.current === c) setAns({ q: qq, state: 'done' });
    } catch {
      if (ctl.current === c) setAns({ q: qq, state: 'error' });
    } finally { clearTimeout(timer); }
  };
  const groups = useMemo(() => {
    const s = q.trim().toLowerCase();
    const hit = (...xs) => !s || xs.some((x) => x && x.toLowerCase().includes(s));
    const g = SEARCH.map(([h, items]) => [h, items.filter(([l, sub]) => hit(l, sub)).map(([l, sub, href]) => ({ l, sub, href }))]);
    const ps = pages.filter(([p, t, d]) => p.split('/').length === 2 || s).filter(([p, t, d]) => hit(nameOf(p), t, d, p)).slice(0, s ? 30 : 400).map(([p, t]) => ({ l: nameOf(p), sub: t, href: p }));
    const out = [...g.slice(0, 2), ['Pages', ps], ...g.slice(2)].filter(([, it]) => it.length);
    if (s) out.push(['Ask AI', [{ l: 'Ask AI: ' + q.trim(), sub: 'Answers here', href: chatLink(q.trim()), ai: true }]]);
    return out;
  }, [q, pages]);
  const flat = groups.flatMap(([, it]) => it);
  useEffect(() => setAt(0), [q]);
  useEffect(() => { list.current?.querySelector('[data-on]')?.scrollIntoView({ block: 'nearest' }); }, [at]);
  const pick = (x) => { if (x.ai) { ask(q); return; } onClose(); go(router, x.href); };
  const key = (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setAt((a) => Math.min(flat.length - 1, a + 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setAt((a) => Math.max(0, a - 1)); }
    else if (e.key === 'Enter' && (e.metaKey || e.ctrlKey || ans)) { e.preventDefault(); if (!ans) ask(q); }
    else if (e.key === 'Enter' && flat[at]) { e.preventDefault(); pick(flat[at]); }
    else if (e.key === 'Escape') onClose();
  };
  let n = -1;
  return (
    <motion.div className="x-pal-wrap" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <motion.div className="x-pal" role="dialog" aria-modal="true" aria-label="Search Hanzo" onKeyDown={trap} {...(sheet ? { initial: { y: '100%' }, animate: { y: 0 }, exit: { y: '100%' }, transition: { type: 'spring', stiffness: 420, damping: 40 } } : { initial: { opacity: 0, y: -12, scale: 0.97 }, animate: { opacity: 1, y: 0, scale: 1 }, exit: { opacity: 0, y: -8, scale: 0.98 }, transition: { duration: 0.35, ease: EASE } })} {...drag}>
        {grip}
        <div className="x-pal-top">
          <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><circle cx="7" cy="7" r="5" fill="none" stroke="currentColor" strokeWidth="1.6" /><path d="M11 11l3.5 3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
          <input ref={input} value={q} onChange={(e) => { setQ(e.target.value); if (ans) { ctl.current?.abort(); setAns(null); } }} onKeyDown={key} placeholder="Search Hanzo" aria-label="Search Hanzo" role="combobox" aria-expanded="true" aria-controls="x-pal-list" aria-activedescendant={ans ? undefined : 'x-pal-' + at} />
          <button type="button" className="x-pal-ask" data-ask="" disabled={!q.trim()} onClick={() => ask(q)}>Ask AI</button>
          <kbd>ESC</kbd>
        </div>
        <div className="x-pal-answer" hidden={!ans} aria-live="polite" aria-busy={ans?.state === 'wait' || ans?.state === 'stream'}>
          <p className="x-pal-q">{ans?.q}</p>
          <p className="x-pal-ans" data-state={ans?.state}><span ref={out} />{ans?.state === 'wait' && <span className="x-pal-dots" role="img" aria-label="Thinking"><i /><i /><i /></span>}</p>
          {ans?.state === 'error' && <p className="x-pal-err">Hanzo Chat could not be reached from here.</p>}
          <a className="x-arrow" href={chatLink(ans?.q || q)} target="_blank" rel="noopener"><span>{ans?.state === 'error' ? 'Ask in Hanzo Chat' : 'Continue in Hanzo Chat'}</span><svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg></a>
        </div>
        <div className="x-pal-list" id="x-pal-list" role="listbox" ref={list} hidden={!!ans}>
          {groups.map(([h, items]) => (
            <div key={h} role="group" aria-label={h}>
              <p className="x-pal-h">{h}</p>
              {items.map((x) => {
                n += 1;
                const i = n;
                return (
                  <button key={h + x.href + x.l} id={'x-pal-' + i} type="button" role="option" aria-selected={i === at} data-on={i === at ? '' : undefined} className="x-pal-i" onMouseMove={() => setAt(i)} onClick={() => pick(x)}>
                    {i === at && <motion.span layoutId="x-pal-hi" className="x-pal-hi" transition={{ type: 'spring', stiffness: 600, damping: 40 }} />}
                    <span className="x-pal-l">{x.l}</span>
                    {x.sub && <span className="x-pal-s">{x.sub}</span>}
                    {i === at && <span className="x-pal-k">↵</span>}
                  </button>
                );
              })}
            </div>
          ))}
          {!flat.length && <p className="x-pal-none">No pages match.</p>}
        </div>
        <div className="x-pal-foot"><span><kbd>↑</kbd><kbd>↓</kbd> navigate</span><span><kbd>↵</kbd> select</span><span><kbd>⌘</kbd><kbd>↵</kbd> ask</span><span><kbd>⌘K</kbd></span></div>
      </motion.div>
    </motion.div>
  );
}

function Pop({ anchor, children, onClose, label }) {
  const [pos, setPos] = useState(null);
  const { sheet, drag, grip } = useSheet(onClose);
  useEffect(() => {
    const r = anchor.getBoundingClientRect();
    setPos({ top: r.bottom + 8, right: Math.max(12, innerWidth - r.right) });
    const off = (e) => { if (!e.target.closest('.x-pop') && !anchor.contains(e.target)) onClose(); };
    const esc = (e) => e.key === 'Escape' && (onClose(), anchor.focus());
    addEventListener('mousedown', off);
    addEventListener('keydown', esc);
    return () => { removeEventListener('mousedown', off); removeEventListener('keydown', esc); };
  }, [anchor, onClose]);
  if (!pos) return null;
  return (
    <motion.div className={'x-pop' + (sheet ? ' x-pop-sheet' : '')} role="menu" aria-label={label} style={sheet ? undefined : pos} {...(sheet ? { initial: { y: '100%' }, animate: { y: 0 }, exit: { y: '100%' }, transition: { type: 'spring', stiffness: 420, damping: 40 } } : { initial: { opacity: 0, y: -6, scale: 0.97 }, animate: { opacity: 1, y: 0, scale: 1 }, exit: { opacity: 0, y: -4, scale: 0.98 }, transition: { duration: 0.25, ease: EASE } })} {...drag}>
      {grip}
      {children}
    </motion.div>
  );
}

// keep Tab inside an open dialog; returns the keydown handler
const trap = (e) => {
  if (e.key !== 'Tab') return;
  const f = [...e.currentTarget.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])')].filter((x) => x.offsetParent !== null);
  if (!f.length) return;
  if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
  else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
};

/* Hanzo's cookie notice. "Reject all" sits beside "Accept all" at equal weight; a browser that sends Global Privacy
   Control is answered with "reject" and never asked. The preferences reopen from any link to #choices (Hanzo's
   footer "Privacy choices") or from dispatchEvent(new Event('hz-consent-open')). */
function Consent() {
  const [state, setState] = useState(null); // null: undecided, else the saved choice
  const [prefs, setPrefs] = useState(false);
  const [pick, setPick] = useState({ performance: false, marketing: false, sale: false });
  const back = useRef(null);
  const box = useRef(null);
  const save = (choice) => {
    const v = { necessary: true, performance: false, marketing: false, sale: false, ...choice, at: Date.now() };
    try { localStorage.setItem('hz-consent', JSON.stringify(v)); } catch {}
    document.cookie = 'hz-consent=' + encodeURIComponent(JSON.stringify(v)) + ';path=/;max-age=31536000;samesite=lax';
    window.dispatchEvent(new CustomEvent('hz-consent', { detail: v })); // analytics and ads read this before loading
    setState(v); setPrefs(false);
  };
  useEffect(() => {
    let v = null;
    try { v = JSON.parse(localStorage.getItem('hz-consent') || 'null'); } catch {}
    if (!v && navigator.globalPrivacyControl) { save({ gpc: true }); return; }
    setState(v || false);
    if (v) setPick({ performance: !!v.performance, marketing: !!v.marketing, sale: !!v.sale });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    const open = () => { back.current = document.activeElement; setPrefs(true); };
    const click = (e) => { const a = e.target.closest?.('a[href$="#choices"]'); if (a) { e.preventDefault(); open(); } };
    addEventListener('hz-consent-open', open);
    document.addEventListener('click', click, true);
    return () => { removeEventListener('hz-consent-open', open); document.removeEventListener('click', click, true); };
  }, []);
  useEffect(() => {
    if (!prefs) return;
    const t = setTimeout(() => box.current?.querySelector('.x-prefs-x')?.focus(), 40);
    const esc = (e) => { if (e.key === 'Escape') setPrefs(false); };
    addEventListener('keydown', esc);
    return () => { clearTimeout(t); removeEventListener('keydown', esc); back.current?.focus?.(); };
  }, [prefs]);
  if (state === null || (state && !prefs)) return null;
  return (
    <AnimatePresence>
      {!prefs ? (
        <motion.div key="note" className="x-cookie" role="region" aria-label="Cookies" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} transition={{ duration: 0.6, ease: EASE, delay: 1.2 }}>
          <p>{COOKIES.notice}</p>
          <div>
            <button type="button" className="x-btn sm x-cookie-more" onClick={() => { back.current = document.activeElement; setPrefs(true); }}>Manage preferences</button>
            <button type="button" className="x-btn sm" onClick={() => save({})}>Reject all</button>
            <button type="button" className="x-btn sm" onClick={() => save({ performance: true, marketing: true, sale: true })}>Accept all</button>
          </div>
        </motion.div>
      ) : (
        <motion.div key="prefs" className="x-pal-wrap" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={(e) => e.target === e.currentTarget && setPrefs(false)}>
          <motion.div ref={box} className="x-prefs" role="dialog" aria-modal="true" aria-label={COOKIES.title} onKeyDown={trap} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: EASE }}>
            <button type="button" className="x-prefs-x" aria-label="Close" onClick={() => setPrefs(false)}>✕</button>
            <h2>{COOKIES.title}</h2>
            <p>{COOKIES.body} Learn more in our <a href="https://hanzo.ai/cookies">Cookie Policy</a>, <a href="https://hanzo.ai/privacy">Privacy Policy</a>, and <a href="https://hanzo.ai/terms">Terms of Service</a>.</p>
            <ul>
              {COOKIES.kinds.map(([k, l]) => (
                <li key={k}>
                  <span>{l}</span>
                  {k === 'necessary' ? <em>Always Active</em> : (
                    <button type="button" role="switch" aria-checked={pick[k]} aria-label={l} className={'x-switch' + (pick[k] ? ' on' : '')} onClick={() => setPick((p) => ({ ...p, [k]: !p[k] }))}>
                      <motion.i layout transition={{ type: 'spring', stiffness: 600, damping: 35 }} />
                    </button>
                  )}
                </li>
              ))}
            </ul>
            <div className="x-prefs-acts">
              <button type="button" className="x-btn" onClick={() => save({})}>Reject all</button>
              <button type="button" className="x-btn" onClick={() => save({ performance: true, marketing: true, sale: true })}>Accept all</button>
              <button type="button" className="x-btn solid" onClick={() => save(pick)}>Save preferences</button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function HeaderTools({ headerRef }) {
  const [open, setOpen] = useState(null); // 'search' | 'lang' | 'login'
  const [lang, setLang] = useState('en-US');
  const anchors = useRef({});
  const router = useRouter();

  useEffect(() => {
    try { const l = localStorage.getItem('hz-lang'); if (l) setLang(l); } catch {}
  }, []);
  // the content is English, so <html lang="en" dir="ltr"> stays truthful whatever is chosen (PLAN 2.2): the choice is
  // remembered and shown on the button, and read by Hanzo's app when you go there
  useEffect(() => {
    document.documentElement.lang = 'en';
    document.documentElement.dir = 'ltr';
  }, [lang]);

  useEffect(() => {
    const h = headerRef.current?.querySelector('header');
    if (!h) return;
    const offs = [];
    const on = (el, ev, fn) => { el.addEventListener(ev, fn); offs.push(() => el.removeEventListener(ev, fn)); };
    h.querySelectorAll('button').forEach((b) => {
      const label = b.getAttribute('aria-label') || '';
      const text = b.textContent.trim();
      const kind = label.startsWith('Search') ? 'search' : label.startsWith('Language') ? 'lang' : text === 'Log in' ? 'login' : null;
      if (!kind) return;
      anchors.current[kind] = b;
      b.setAttribute('aria-haspopup', kind === 'search' ? 'dialog' : 'menu');
      on(b, 'click', (e) => { e.preventDefault(); setOpen((o) => (o === kind ? null : kind)); });
    });
    const k = (e) => { if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setOpen((o) => (o === 'search' ? null : 'search')); } };
    on(window, 'keydown', k);
    return () => offs.forEach((f) => f());
  }, [headerRef]);

  useEffect(() => {
    if (open !== 'search') return;
    window.__lenis?.stop();
    return () => window.__lenis?.start();
  }, [open]);

  const close = () => setOpen(null);
  const cur = LANGS.find((l) => l[3] === lang);
  // show the chosen language's short code on Hanzo's EN button
  useEffect(() => {
    const b = anchors.current.lang;
    const t = b && [...b.querySelectorAll('span, p')].find((x) => /^[A-Z]{2,3}$/.test(x.textContent.trim()));
    if (t) t.textContent = lang.split('-')[0].toUpperCase();
  }, [lang]);

  return (
    <>
      <AnimatePresence>{open === 'search' && <Palette onClose={close} />}</AnimatePresence>
      <AnimatePresence>
        {open === 'lang' && anchors.current.lang && (
          <Pop anchor={anchors.current.lang} onClose={close} label="Language">
            <div className="x-pop-langs">
              {LANGS.map(([flag, native, en, code]) => (
                <button key={code} type="button" role="menuitemradio" aria-checked={code === lang} className={'x-pop-i' + (code === lang ? ' on' : '')} lang={code} onClick={() => { setLang(code); try { localStorage.setItem('hz-lang', code); } catch {} close(); }}>
                  <span aria-hidden="true">{flag}</span><span>{native}{native !== en && <small> ({en})</small>}</span>
                </button>
              ))}
            </div>
          </Pop>
        )}
        {open === 'login' && anchors.current.login && (
          <Pop anchor={anchors.current.login} onClose={close} label="Log in">
            {LOGIN.map((l) => (
              <a key={l.label} role="menuitem" href={l.href} className="x-pop-i big" onClick={close}>
                <b>{l.label}</b><span>{l.sub}</span>
              </a>
            ))}
          </Pop>
        )}
      </AnimatePresence>
      <Consent />
      {cur && <span className="x-sr" aria-live="polite">Language: {cur[2]}</span>}
    </>
  );
}
