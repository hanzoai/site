'use client';
/* Auto: the six live objects inside the property index (page-local, Auto only). Each one is built only from words already on
   the page (the editor's own nodes, GET /v1/pieces, POST trigger, /v1/runs, draft / published, Hanzo KMS / Hanzo IAM) and
   steps by a chain of timeouts while its row is open, on screen and not paused. Under reduced motion (`run` false, `calm`
   true) each shows its settled frame. */
import { useState } from 'react';
import { useTick } from '../../../v2/x-hamilton/Demo';

const FLOW = ['trigger', 'GitHub', 'Postgres', 'Slack', 'done'];

/* step through 0..len-1 every ms while run; calm pins the last frame */
function useSeq(len: number, ms: number, run, calm) {
  const [i, setI] = useState(0);
  useTick(ms, run, () => setI((v) => (v + 1) % len));
  return calm ? len - 1 : i;
}

interface CheckProps {
  on: boolean;
}
const Check = ({ on }: CheckProps) => (
  <svg className={'au2-ck' + (on ? ' on' : '')} viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
    <circle cx="8" cy="8" r="7" fill="none" stroke="currentColor" strokeWidth="1.2" />
    <path d="M4.8 8.3 7 10.4l4.2-4.6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/* 0 Durable execution: the record fills a tick per step, the pod is rescheduled, the ticks stay and the run goes on. */
const D0 = [0, 1, 2, 3, -3, -3, 4, 5, 5, 5];
function Durable({ run, calm }) {
  const s = D0[useSeq(D0.length, 700, run, calm)];
  const n = Math.abs(s);
  const cut = s < 0;
  return (
    <div className="au2-m0 l2-mono">
      <p className="au2-mk"><span>record</span><span>{n >= 5 ? 'done' : `step ${n + 1} / 5`}</span></p>
      <ol>
        {FLOW.map((f, k) => (
          <li key={f} className={k < n ? 'ok' : k === n && !cut ? 'now' : ''}><Check on={k < n} />{f}</li>
        ))}
      </ol>
      <p className={'au2-cut' + (cut ? ' on' : '')}><i /><span>pod rescheduled</span><i /></p>
    </div>
  );
}

/* 1 The catalog is in the binary: GET /v1/pieces answers from the build itself, line by line. */
const LIST = ['Slack', 'GitHub', 'Notion', 'Gmail', 'Stripe', 'Postgres'];
function Catalog({ run, calm }) {
  const s = useSeq(LIST.length + 4, 450, run, calm);
  const n = Math.min(LIST.length, s);
  return (
    <div className="au2-m1 l2-mono">
      <p className="au2-mk"><span>GET /v1/pieces</span><span>{n >= LIST.length ? 'offline' : '…'}</span></p>
      <pre><code>{'[\n'}{LIST.slice(0, n).map((p, k) => <span key={p} className="au2-ln">{`  "${p}"${k < LIST.length - 1 ? ',' : ''}\n`}</span>)}{n >= LIST.length ? ']' : <i className="au2-caret" />}</code></pre>
    </div>
  );
}

/* 2 Triggers: two ways in, one run object, one history. */
const SRC = ['POST trigger', '/v1/runs'];
function Triggers({ run, calm }) {
  const s = useSeq(8, 900, run, calm);
  const from = s % 2;
  const hist = Array.from({ length: Math.min(4, s + 1) }, (_, k) => s - k).filter((v) => v >= 0);
  return (
    <div className="au2-m2 l2-mono">
      <div className="au2-src">
        {SRC.map((t, k) => <span key={t} className={k === from ? 'on' : ''}>{t}<i /></span>)}
      </div>
      <div className="au2-run">
        <b>run</b>
        <ol>{hist.map((v) => <li key={v}><span>{String(v + 1).padStart(2, '0')}</span>{SRC[v % 2]}</li>)}</ol>
      </div>
    </div>
  );
}

/* 3 Watch it live: the run's own events arrive over the stream while the canvas follows. */
const EV = FLOW.flatMap((f) => [['step.started', f], ['step.done', f]]);
function Live({ run, calm }) {
  const s = useSeq(EV.length + 3, 520, run, calm);
  const n = Math.min(EV.length, s + 1);
  const at = Math.min(FLOW.length, Math.floor(n / 2));
  const lines = EV.slice(0, n).slice(-5);
  return (
    <div className="au2-m3 l2-mono">
      <p className="au2-mk"><span><i className="au2-live" />server-sent events</span><span>{at >= FLOW.length ? 'done' : FLOW[at]}</span></p>
      <div className="au2-strip" aria-hidden="true">
        {FLOW.map((f, k) => <i key={f} className={k < at ? 'ok' : k === at && n % 2 === 1 ? 'now' : ''} />)}
      </div>
      <ol>{lines.map(([e, f], k) => { const id = n - lines.length + k; return <li key={id}><span>{e}</span>{f}</li>; })}</ol>
    </div>
  );
}

/* 4 Draft, then publish: the draft gains a step; callers keep the published flow until it is published. */
const P4 = [0, 1, 1, 2, 3, 3, 3];
function Publish({ run, calm }) {
  const s = P4[useSeq(P4.length, 800, run, calm)];
  const draft = s >= 1 ? FLOW.slice(0, 4) : FLOW.slice(0, 3);
  const pub = s >= 3 ? FLOW.slice(0, 4) : FLOW.slice(0, 3);
  const col = (k: string, items: string[], cls: string) => (
    <div className={'au2-col ' + cls}>
      <p>{k}</p>
      <ol>{items.map((f, j) => <li key={f} className={j === 3 && cls === 'd' && s < 3 ? 'new' : j === 3 ? 'in' : ''}>{f}</li>)}</ol>
    </div>
  );
  return (
    <div className={'au2-m4 l2-mono' + (s === 2 ? ' go' : '')}>
      {col('draft', draft, 'd')}
      <span className="au2-arrow" aria-hidden="true"><svg viewBox="0 0 24 12" width="24" height="12"><path d="M1 6h20M16 1.5 21 6l-5 4.5" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
      {col('published', pub, 'p')}
    </div>
  );
}

/* 5 Connections, not pasted keys: the flow names a connection; Hanzo IAM says who may touch it, Hanzo KMS opens it. */
function Keys({ run, calm }) {
  const s = useSeq(6, 850, run, calm);
  return (
    <div className="au2-m5 l2-mono">
      <p className="au2-mk"><span>connection</span><span>GitHub</span></p>
      <div className="au2-key"><span className={s >= 3 ? 'open' : ''}>{s >= 3 ? 'GitHub' : '••••••••••••'}</span></div>
      <ol>
        <li className={s >= 1 ? 'ok' : ''}><Check on={s >= 1} />Hanzo IAM</li>
        <li className={s >= 2 ? 'ok' : ''}><Check on={s >= 2} />Hanzo KMS</li>
        <li className={s >= 3 ? 'ok' : ''}><Check on={s >= 3} />GitHub</li>
      </ol>
    </div>
  );
}

const ALL = [Durable, Catalog, Triggers, Live, Publish, Keys];
export default function Mini({ i, run, calm }) {
  const C = ALL[i];
  return <C run={run} calm={calm} />;
}
