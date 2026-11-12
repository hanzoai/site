'use client';
import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'motion/react';
import { Mark } from '../ui';

const BOT_CASES = [
  {
    id: 'dev',
    bot: 'Dev',
    role: 'Software',
    ch: 'bugfix',
    human: 'Zoe',
    ask: '@Dev Fix Mobile Safari checkout sheet & add WebKit regression spec.',
    steps: [
      'Reproduced in WebKit iOS 18',
      'Patched PaySheet.tsx (+18 −4)',
      'Verified by @Qa · PR #418 merged',
    ],
    mobileTitle: 'PR #418 · PaySheet',
    mobileSub: '42/42 WebKit + Chromium green',
    badge: 'Verified ✓',
    verifier: 'sci',
  },
  {
    id: 'cyber',
    bot: 'Cyber',
    role: 'Security',
    ch: 'security',
    human: 'Alex',
    ask: '@Cyber Audit bearer auth across edge routes & rotate staging keys.',
    steps: [
      'Scanned 14 API gateway routes',
      'Enforced strict JWT audience check',
      'Verified by @Dev · 0 findings',
    ],
    mobileTitle: 'Edge Auth Audit',
    mobileSub: '14 routes hardened · keys rotated',
    badge: '0 vulns ✓',
    verifier: 'dev',
  },
  {
    id: 'mark',
    bot: 'Mark',
    role: 'Growth',
    ch: 'launch',
    human: 'Maya',
    ask: '@Mark Publish Q4 Pareto release notes & sync GA4 funnel metrics.',
    steps: [
      'Drafted release post + changelog',
      'Pulled 28-day checkout conversion',
      'Verified by @Des · live on blog',
    ],
    mobileTitle: 'Pareto Launch',
    mobileSub: 'Blog + changelog live · +38% CTR',
    badge: 'Published ✓',
    verifier: 'des',
  },
];

const BOT_CREW = [
  ['dev', 'Dev'],
  ['cyber', 'Cyber'],
  ['sci', 'Qa'],
  ['mark', 'Mark'],
] as const;

const TEAM_CASES = [
  {
    ch: 'bugfix',
    mode: 'thread' as const,
    msgs: [
      { av: 'vi', who: 'Zoe', time: '9:41', at: '@Dev', text: 'Hero demo clips on Mobile Safari.' },
      { av: 'dev', who: 'Dev', time: '9:42', at: '', text: 'Moved stage to 360px 1:1 & opened PR #424.' },
      { av: 'sci', who: 'Qa', time: '9:43', at: '@Zoe', text: 'Verified on iPhone + Desktop — all green.' },
    ],
    mobileCard: 'CRM-24 · Mobile Safari',
    mobilePct: 100,
    mobileOwner: '@dev',
    mobileNote: 'Web + iOS synced · PR #424 ready',
  },
  {
    ch: 'tracker',
    mode: 'board' as const,
    tasks: [
      { id: 'CRM-15', title: 'Enterprise deal desk & SSO', pct: 92, own: 'sal', face: 'mark' },
      { id: 'CRM-16', title: 'Unified Desktop + Duo sync', pct: 100, own: 'dev', face: 'dev' },
      { id: 'CRM-19', title: 'Security SOC2 evidence run', pct: 85, own: 'cyber', face: 'cyber' },
    ],
    mobileCard: 'CRM-16 · Desktop + Duo',
    mobilePct: 100,
    mobileOwner: '@dev',
    mobileNote: '3 agents active · 83% sprint done',
  },
  {
    ch: 'launch',
    mode: 'thread' as const,
    msgs: [
      { av: 'opera', who: 'Kai', time: '10:04', at: '@Mark', text: 'Kick off hanzo.bot + hanzo.team launch.' },
      { av: 'des', who: 'Des', time: '10:05', at: '', text: 'Exported Desktop + iPhone preview reels.' },
      { av: 'mark', who: 'Mark', time: '10:06', at: '@Kai', text: 'Docs, announcement & social queue live.' },
    ],
    mobileCard: 'CRM-31 · Launch Room',
    mobilePct: 96,
    mobileOwner: '@mark',
    mobileNote: 'Synced live across 4 channels',
  },
];

function useCardCycle(total: number, stepCount: number, intervalMs = 1150) {
  const ref = useRef<HTMLDivElement | null>(null);
  const calm = useReducedMotion();
  const [inView, setInView] = useState(true);
  const [tick, setTick] = useState(stepCount - 1);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(
      ([entry]) => setInView(Boolean(entry?.isIntersecting)),
      { threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (calm || !inView) return;
    const id = setInterval(() => {
      setTick((t) => (t + 1) % (total * stepCount));
    }, intervalMs);
    return () => clearInterval(id);
  }, [calm, inView, total, stepCount, intervalMs]);

  const idx = calm ? 0 : Math.floor(tick / stepCount) % total;
  const sub = calm ? stepCount - 1 : tick % stepCount;
  return { ref, idx, sub };
}

const CheckIcon = () => (
  <svg viewBox="0 0 16 16" width="9" height="9" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M3.2 8.4 6.5 11.6 12.8 4.8" />
  </svg>
);

const StatusIcons = () => (
  <span className="xpp-sys" aria-hidden="true">
    <svg viewBox="0 0 16 12" width="10" height="8" fill="currentColor">
      <rect x="1" y="7.5" width="2.2" height="3.5" rx=".7" />
      <rect x="4.6" y="5.5" width="2.2" height="5.5" rx=".7" />
      <rect x="8.2" y="3.2" width="2.2" height="7.8" rx=".7" />
      <rect x="11.8" y="1" width="2.2" height="10" rx=".7" />
    </svg>
    <svg viewBox="0 0 18 12" width="12" height="8" fill="none">
      <rect x="1" y="1.5" width="13.5" height="9" rx="2.2" stroke="currentColor" strokeWidth="1.3" />
      <rect x="2.8" y="3.3" width="9.9" height="5.4" rx="1" fill="currentColor" />
      <path d="M16 4.5v3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  </span>
);

export function BotCardPreview() {
  const { ref, idx, sub } = useCardCycle(BOT_CASES.length, 4, 1050);
  const cur = BOT_CASES[idx];
  const shownSteps = Math.min(3, sub + 1);

  return (
    <div ref={ref} className="xp-vis xpp-stage" data-on="">
      {/* Desktop hanzo.bot window */}
      <div className="xpp-desk" aria-label="Hanzo Bot desktop workspace preview">
        <div className="xpp-bar">
          <span className="xpp-dots" aria-hidden="true"><i /><i /><i /></span>
          <span className="xpp-brand"><Mark size={10} /><b>hanzo.bot</b></span>
          <span className="xpp-ch x-mono">#{cur.ch}</span>
          <span className="xpp-live x-mono"><i />24/7</span>
        </div>
        <div className="xpp-body">
          <div className="xpp-rail" aria-hidden="true">
            {BOT_CREW.map(([id, label]) => {
              const active = id === cur.id;
              return (
                <div key={id} className={'xpp-mate' + (active ? ' on' : '')}>
                  <img src={`/memoji/${id}.svg`} alt="" width={16} height={16} loading="lazy" decoding="async" />
                  <span>{label}</span>
                  {active && <i />}
                </div>
              );
            })}
          </div>
          <div className="xpp-pane">
            <div className="xpp-ask">
              <span className="xpp-who"><b>{cur.human}</b><small className="x-mono">now</small></span>
              <span className="xpp-ask-t">{cur.ask}</span>
            </div>
            <div className="xpp-bot-card">
              <div className="xpp-bot-h">
                <img src={`/memoji/${cur.id}.svg`} alt="" width={18} height={18} loading="lazy" decoding="async" />
                <b>{cur.bot}</b>
                <span className="xpp-role">{cur.role}</span>
              </div>
              <div className="xpp-steps">
                {cur.steps.map((s, i) => (
                  <div key={s} className={'xpp-step' + (i < shownSteps ? ' on' : '')}>
                    <span className="xpp-chk"><CheckIcon /></span>
                    <span>{s}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Synced iPhone hanzo.bot mobile handset */}
      <div className="xpp-phone" aria-label="Hanzo Bot mobile iPhone preview">
        <div className="xpp-ph-screen">
          <div className="xpp-ph-status" aria-hidden="true">
            <b>9:41</b>
            <span className="xpp-island" />
            <StatusIcons />
          </div>
          <div className="xpp-ph-head">
            <span className="x-mono">hanzo.bot</span>
            <span className="xpp-sync"><i />Synced</span>
          </div>
          <div className="xpp-ph-main">
            <div className="xpp-ph-bot">
              <img src={`/memoji/${cur.id}.svg`} alt="" width={22} height={22} loading="lazy" decoding="async" />
              <div>
                <b>{cur.bot} · #{cur.ch}</b>
                <span>Autonomous teammate</span>
              </div>
            </div>
            <div className="xpp-ph-box">
              <b>{cur.mobileTitle}</b>
              <span>{cur.mobileSub}</span>
              <div className="xpp-ph-ver">
                <img src={`/memoji/${cur.verifier}.svg`} alt="" width={14} height={14} loading="lazy" decoding="async" />
                <span className="x-mono">{cur.badge}</span>
              </div>
            </div>
          </div>
          <div className="xpp-ph-pill" aria-hidden="true">
            <span>Message @{cur.bot}…</span>
            <i>↑</i>
          </div>
          <i className="xpp-home" aria-hidden="true" />
        </div>
      </div>
    </div>
  );
}

export function TeamCardPreview() {
  const { ref, idx, sub } = useCardCycle(TEAM_CASES.length, 4, 1100);
  const cur = TEAM_CASES[idx];
  const shown = Math.min(3, sub + 1);

  return (
    <div ref={ref} className="xp-vis xpp-stage" data-on="">
      {/* Desktop hanzo.team window */}
      <div className="xpp-desk" aria-label="Hanzo Team desktop workspace preview">
        <div className="xpp-bar">
          <span className="xpp-dots" aria-hidden="true"><i /><i /><i /></span>
          <span className="xpp-brand"><Mark size={10} /><b>hanzo.team</b></span>
          <span className="xpp-ch x-mono">#{cur.ch}</span>
          <span className="xpp-faces" aria-hidden="true">
            {['vi', 'dev', 'sci'].map((f) => (
              <img key={f} src={`/memoji/${f}.svg`} alt="" width={14} height={14} loading="lazy" decoding="async" />
            ))}
          </span>
        </div>
        <div className="xpp-body">
          <div className="xpp-rail" aria-hidden="true">
            {(['bugfix', 'tracker', 'launch', 'ops'] as const).map((ch) => (
              <div key={ch} className={'xpp-chan' + (ch === cur.ch ? ' on' : '')}>
                <span className="x-mono">#</span>
                <span>{ch}</span>
              </div>
            ))}
          </div>
          <div className="xpp-pane">
            {cur.mode === 'board' ? (
              <div className="xpp-tasks">
                {cur.tasks.map((t, i) => {
                  const pct = i < shown ? t.pct : Math.max(35, t.pct - 28);
                  return (
                    <div key={t.id} className={'xpp-task' + (i === shown - 1 ? ' hot' : '')}>
                      <div className="xpp-task-top">
                        <span className="x-mono">{t.id}</span>
                        <span className="xpp-own x-mono">@{t.own} · {pct}%</span>
                      </div>
                      <b>{t.title}</b>
                      <div className="xpp-prog"><i style={{ width: `${pct}%` }} /></div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="xpp-thread">
                {cur.msgs.map((m, i) => (
                  <div key={m.who + m.time} className={'xpp-msg' + (i < shown ? ' on' : '')}>
                    <img src={`/memoji/${m.av}.svg`} alt="" width={18} height={18} loading="lazy" decoding="async" />
                    <div className="xpp-msg-b">
                      <span className="xpp-who"><b>{m.who}</b><small className="x-mono">{m.time}</small></span>
                      <span className="xpp-msg-t">
                        {m.at && <b>{m.at} </b>}
                        {m.text}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Synced iPhone hanzo.team mobile handset */}
      <div className="xpp-phone" aria-label="Hanzo Team mobile iPhone preview">
        <div className="xpp-ph-screen">
          <div className="xpp-ph-status" aria-hidden="true">
            <b>9:41</b>
            <span className="xpp-island" />
            <StatusIcons />
          </div>
          <div className="xpp-ph-head">
            <span className="x-mono">hanzo.team</span>
            <span className="xpp-sync"><i />Live</span>
          </div>
          <div className="xpp-ph-main">
            <div className="xpp-ph-box">
              <div className="xpp-ph-row">
                <span className="x-mono">{cur.mobileOwner}</span>
                <b className="x-mono">{cur.mobilePct}%</b>
              </div>
              <b>{cur.mobileCard}</b>
              <div className="xpp-prog"><i style={{ width: `${cur.mobilePct}%` }} /></div>
              <span>{cur.mobileNote}</span>
            </div>
            <div className="xpp-ph-crew" aria-hidden="true">
              {['dev', 'mark', 'cyber', 'sci'].map((f) => (
                <img key={f} src={`/memoji/${f}.svg`} alt="" width={18} height={18} loading="lazy" decoding="async" />
              ))}
              <span className="x-mono">+19</span>
            </div>
          </div>
          <div className="xpp-ph-pill" aria-hidden="true">
            <span>Reply in #{cur.ch}…</span>
            <i>↑</i>
          </div>
          <i className="xpp-home" aria-hidden="true" />
        </div>
      </div>
    </div>
  );
}
