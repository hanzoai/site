'use client';
import { useEffect, useId, useRef, useState } from 'react';
import { motion } from 'motion/react';
import C from '../content';
import { SETUP, SETUP_FOOT, SETUP_PROMPT, setupHref } from '../lib/setup';

const ICON = Object.fromEntries(C.agents.map((a) => [a.name, a.icon]));
const ALIAS = { Gemini: 'Gemini CLI', Grok: 'Grok Build', 'Grok Bot': 'Grok Build', 'Claude Duet': 'Claude Code' };
const docs = (p) => 'https://docs.hanzo.ai/docs/' + p;
const web = (h) => /^https?:/.test(h);
const copy = async () => { try { await navigator.clipboard.writeText(SETUP_PROMPT); return true; } catch { return false; } };

/* "Copy setup prompt": the button copies the prompt, the chevron opens every agent it can be handed to.
   All rows are in the page from the start (closed, they are inert); opening staggers them in. */
export default function SetupMenu({ up = false, inline = false, ...rest }) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [ok, setOk] = useState(false);
  const [q, setQ] = useState('');
  const root = useRef(null);
  const btn = useRef(null);
  const inp = useRef(null);
  const menu = useRef(null);
  const t = useRef(0);
  const none = q && !SETUP.some(([n]) => n.toLowerCase().includes(q.toLowerCase()));

  useEffect(() => {
    if (!open) return;
    const away = (e) => { if (!root.current.contains(e.target)) setOpen(false); };
    document.addEventListener('pointerdown', away);
    return () => document.removeEventListener('pointerdown', away);
  }, [open]);

  const flash = () => { setOk(true); clearTimeout(t.current); t.current = setTimeout(() => setOk(false), 1800); };
  const items = () => [...menu.current.querySelectorAll('input, a')].filter((el) => !el.closest('[hidden]'));
  const show = (focusLast) => {
    setOpen(true);
    // inert is lifted by the render; focus once the menu is live
    requestAnimationFrame(() => requestAnimationFrame(() => { const l = items(); (focusLast ? l[l.length - 1] : inp.current)?.focus(); }));
  };
  const onMenuKey = (e) => {
    if (e.key === 'Escape') { e.preventDefault(); setOpen(false); btn.current.focus(); return; }
    const l = items(), i = l.indexOf(document.activeElement);
    const go = (k) => { e.preventDefault(); l[(k + l.length) % l.length]?.focus(); };
    if (e.key === 'ArrowDown') go(i + 1);
    else if (e.key === 'ArrowUp') go(i - 1);
    else if (e.key === 'Home' && document.activeElement !== inp.current) go(0);
    else if (e.key === 'End' && document.activeElement !== inp.current) go(l.length - 1);
  };

  return (
    <motion.div className={'x-setup' + (inline ? ' inline' : '')} ref={root} onBlur={(e) => { if (open && !root.current.contains(e.relatedTarget)) setOpen(false); }} {...rest}>
      <a
        href="https://hanzo.ai/skill.md"
        className="x-setup-main"
        aria-live="polite"
        onClick={async (e) => { if (e.metaKey || e.ctrlKey || e.shiftKey) return; e.preventDefault(); await copy(); flash(); }}
      >
        <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><rect x="5" y="5" width="8.5" height="8.5" rx="2" fill="none" stroke="currentColor" strokeWidth="1.4" /><path d="M10.5 3.2V3a.8.8 0 0 0-.8-.8H3a.8.8 0 0 0-.8.8v6.7c0 .44.36.8.8.8h.2" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>
        <span>{ok ? 'Copied' : 'Copy setup prompt'}</span>
        <span className="x-setup-ics">
          {C.agents.slice(1, 7).map((a) => <span key={a.name} className="x-setup-i" dangerouslySetInnerHTML={{ __html: a.icon }} />)}
        </span>
        <b>+26</b>
      </a>
      <button
        ref={btn}
        type="button"
        className="x-setup-chev"
        aria-label="Open the setup prompt in an agent"
        aria-haspopup="true"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => (open ? setOpen(false) : show(false))}
        onKeyDown={(e) => { if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); show(e.key === 'ArrowUp'); } }}
      >
        <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M4 6.5 8 10.5 12 6.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </button>
      <div id={id} ref={menu} className={'x-menu' + (up ? ' up' : '')} data-open={open} role="group" aria-label="Open the setup prompt in" inert={!open} onKeyDown={onMenuKey}>
        <label className="x-menu-filter">
          <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><circle cx="7" cy="7" r="4.5" fill="none" stroke="currentColor" strokeWidth="1.5" /><path d="m10.5 10.5 3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
          <input ref={inp} type="text" placeholder="Filter agents..." aria-label="Filter agents" value={q} onChange={(e) => setQ(e.target.value)} autoComplete="off" spellCheck={false} />
        </label>
        <div className="x-menu-in">
          {SETUP.map((row, i) => {
            const [n, , url, d] = row;
            const href = setupHref(row);
            const bare = !row[1] && !web(url); // a deep link that cannot carry the prompt: copy it first
            return (
              <div className="x-menu-row" key={n} style={{ '--i': i }} hidden={!!q && !n.toLowerCase().includes(q.toLowerCase())}>
                <a
                  className="x-menu-open"
                  href={href}
                  {...(web(href) ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  onClick={async () => { if (bare) { await copy(); flash(); } setOpen(false); }}
                >
                  <span className="x-menu-i" dangerouslySetInnerHTML={{ __html: ICON[ALIAS[n] || n] || `<b>${n[0]}</b>` }} />
                  <span>Open in {n}</span>
                </a>
                <a className="x-menu-docs" href={docs(d)} target="_blank" rel="noopener noreferrer" title={`${n} docs & migration guide`} onClick={() => setOpen(false)}>
                  <svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true"><path d="M3.5 2.5h6l3 3v8h-9z M9.5 2.5v3h3" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" /></svg>
                  <span>Docs</span>
                </a>
              </div>
            );
          })}
          {none && <p className="x-menu-none">No agent matches</p>}
          <div className="x-menu-foot">
            {SETUP_FOOT.map(([l, h], i) => (
              <a key={l} href={h} target="_blank" rel="noopener noreferrer" style={{ '--i': SETUP.length + i }} onClick={() => setOpen(false)}><span>{l}</span><span aria-hidden="true"> ↗</span></a>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
