'use client';
import { useEffect, useId, useRef, useState, type CSSProperties, type KeyboardEvent } from 'react';
import { motion, type HTMLMotionProps } from 'motion/react';
import AGENTS from '../content/agents';
import { SETUP, SETUP_FOOT, SETUP_PROMPT, setupHref } from '../lib/setup';
import { press } from '../lib/press';
import { track } from '../lib/track';

const SHOWN = 6; // icons on the button; the rest of the list is the count beside them
const MENU = SETUP.filter(([n]) => n !== 'Hanzo Dev');
const ICON = Object.fromEntries(AGENTS.map((a) => [a.name, a.icon]));
const ALIAS: Record<string, string> = { Gemini: 'Gemini CLI', Grok: 'Grok Build', 'Claude Duet': 'Claude' };
const docs = (p: string) => 'https://docs.hanzo.ai/docs/' + p;
const web = (h: string) => /^https?:/.test(h);
const copy = async () => { try { await navigator.clipboard.writeText(SETUP_PROMPT); return true; } catch { return false; } };

/* "Copy setup prompt": the button copies the prompt, the chevron opens every agent it can be handed to.
   All rows are in the page from the start (closed, they are inert); opening staggers them in.
   `where` names the band that counts its three moves (the copy half, the chevron, a link in the menu), as the app's
   Hanzo.Start does; the hero's menu has none and says nothing. */
export default function SetupMenu({ up = false, inline = false, where, ...rest }: HTMLMotionProps<'div'> & { up?: boolean; inline?: boolean; where?: string }) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [ok, setOk] = useState(false);
  const [q, setQ] = useState('');
  const root = useRef<HTMLDivElement>(null);
  const btn = useRef<HTMLButtonElement>(null);
  const inp = useRef<HTMLInputElement>(null);
  const menu = useRef<HTMLDivElement>(null);
  const t = useRef<ReturnType<typeof setTimeout>>(undefined);
  const none = q && !MENU.some(([n]) => n.toLowerCase().includes(q.toLowerCase()));

  useEffect(() => {
    if (!open) return;
    const away = (e: PointerEvent) => { if (!root.current!.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('pointerdown', away);
    return () => document.removeEventListener('pointerdown', away);
  }, [open]);

  // the three moves, read off the menu's own markup, as the app reads them (components/home/Install.tsx `Setup`)
  useEffect(() => {
    if (!where || !root.current) return;
    return press(root.current, (_, e) => {
      const at = e.target as Element;
      const link = at.closest('.x-menu a');
      if (link) return track('setup_agent_chosen', { agent: (link.textContent ?? '').trim().slice(0, 40), target: link.getAttribute('href') ?? '' });
      if (at.closest('.x-setup-main')) return track('setup_prompt_copied', { where });
      const chev = at.closest('[aria-haspopup]');
      if (chev) track('agent_menu_toggled', { open: chev.getAttribute('aria-expanded') !== 'true' });
    });
  }, [where]);

  const flash = () => { setOk(true); clearTimeout(t.current); t.current = setTimeout(() => setOk(false), 1800); };
  const items = () => [...menu.current!.querySelectorAll<HTMLElement>('input, a')].filter((el) => !el.closest('[hidden]'));
  const show = (focusLast: boolean) => {
    setOpen(true);
    // inert is lifted by the render; focus once the menu is live
    requestAnimationFrame(() => requestAnimationFrame(() => { const l = items(); (focusLast ? l[l.length - 1] : inp.current)?.focus(); }));
  };
  const onMenuKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Escape') { e.preventDefault(); setOpen(false); btn.current!.focus(); return; }
    const l = items(), i = l.indexOf(document.activeElement as HTMLElement);
    const go = (k: number) => { e.preventDefault(); l[(k + l.length) % l.length]?.focus(); };
    if (e.key === 'ArrowDown') go(i + 1);
    else if (e.key === 'ArrowUp') go(i - 1);
    else if (e.key === 'Home' && document.activeElement !== inp.current) go(0);
    else if (e.key === 'End' && document.activeElement !== inp.current) go(l.length - 1);
  };

  return (
    <motion.div className={'x-setup' + (inline ? ' inline' : '')} ref={root} onBlur={(e) => { if (open && !root.current!.contains(e.relatedTarget)) setOpen(false); }} {...rest}>
      <a
        href="https://hanzo.ai/skill.md"
        className="x-setup-main"
        aria-live="polite"
        onClick={async (e) => { if (e.metaKey || e.ctrlKey || e.shiftKey) return; e.preventDefault(); await copy(); flash(); }}
      >
        <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><rect x="5" y="5" width="8.5" height="8.5" rx="2" fill="none" stroke="currentColor" strokeWidth="1.4" /><path d="M10.5 3.2V3a.8.8 0 0 0-.8-.8H3a.8.8 0 0 0-.8.8v6.7c0 .44.36.8.8.8h.2" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>
        <span>{ok ? 'Copied' : 'Copy setup prompt'}</span>
        <span className="x-setup-ics">
          {AGENTS.slice(1, 1 + SHOWN).map((a) => <span key={a.name} className="x-setup-i" role="img" aria-label={a.name} title={a.name} dangerouslySetInnerHTML={{ __html: a.icon }} />)}
        </span>
        <b>+{MENU.length - SHOWN}</b>
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
        <div className="x-menu-in" data-lenis-prevent>
          {MENU.map((row, i) => {
            const [n, , url, d] = row;
            const href = setupHref(row);
            const bare = !row[1] && !web(url); // a deep link that cannot carry the prompt: copy it first
            return (
              <div className="x-menu-row" key={n} style={{ '--i': i } as CSSProperties} hidden={!!q && !n.toLowerCase().includes(q.toLowerCase())}>
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
              <a key={l} href={h} target="_blank" rel="noopener noreferrer" style={{ '--i': MENU.length + i } as CSSProperties} onClick={() => setOpen(false)}><span>{l}</span><span aria-hidden="true"> ↗</span></a>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
