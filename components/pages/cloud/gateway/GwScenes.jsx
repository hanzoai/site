'use client';
/* Gateway's six chapter scenes (page-local, prefix gws-). Each one acts its rule out once when its chapter arrives,
   then rests on its final frame, using only words already on the page. Motion is CSS: every element's resting style
   is its final state and the keyframes only say where it starts, so reduced motion (animation: none) shows the end. */
import './GwScenes.css';

const pad = (n) => String(n).padStart(2, '0');

/* 01: a JWT walks to the gate and is checked against JWKS; an API key walks on to the service that issued it */
function Jwks() {
  return (
    <div className="gws-lanes">
      <div className="gws-lane">
        <span className="gws-pill gws-go">JWT</span>
        <i className="gws-gate" />
        <span className="gws-wire gws-draw" />
        <span className="gws-stamp gws-pop">JWKS ✓</span>
      </div>
      <div className="gws-lane q">
        <span className="gws-pill gws-go d2">API key</span>
        <i className="gws-gate" />
        <span className="gws-wire gws-draw d2" />
        <span className="gws-end gws-pop d2">to its issuer</span>
      </div>
    </div>
  );
}

/* 02: every identity header is struck through, then written back from the verified claims */
const FORGED = ['X-User-Id', 'X-Org-Id', 'X-Roles', 'X-IAM-*'];
const WRITTEN = [['X-User-Id', 'sub'], ['X-Org-Id', 'owner'], ['X-Roles', 'roles']];
function Headers() {
  return (
    <div className="gws-two">
      <ul className="gws-col">
        {FORGED.map((h, i) => (
          <li key={h} className="gws-row struck" style={{ '--i': i }}><span>{h}: anything</span><b>stripped</b></li>
        ))}
      </ul>
      <i className="gws-gate v" />
      <ul className="gws-col">
        {WRITTEN.map(([h, c], i) => (
          <li key={h} className="gws-row set gws-in" style={{ '--i': i }}><span>{h}</span><em>← {c}</em></li>
        ))}
      </ul>
    </div>
  );
}

/* 03: one straight line from api.hanzo.ai/* through the gate to Hanzo Cloud, which owns the /v1 mount table;
   the table at the gate stays empty */
function Routes() {
  return (
    <div className="gws-route">
      <span className="gws-pill">api.hanzo.ai/*</span>
      <span className="gws-track"><i className="gws-dot" /></span>
      <div className="gws-empty" aria-hidden="true"><i /><i /><i /></div>
      <span className="gws-track"><i className="gws-dot b" /></span>
      <div className="gws-cloud">
        <b>Hanzo Cloud</b>
        <span>/v1 mount table</span>
        <i /><i /><i />
      </div>
    </div>
  );
}

/* 04: two token buckets, per caller and across the edge, drain one token per request; empty answers 429 */
function Bucket() {
  return (
    <div className="gws-buckets">
      {['client IP', 'the edge'].map((k, b) => (
        <div key={k} className="gws-bk" style={{ '--b': b }}>
          <div className="gws-bk-in">{[3, 2, 1, 0].map((i) => <i key={i} style={{ '--i': i }} />)}</div>
          <span>{k}</span>
        </div>
      ))}
      <p className="gws-429 gws-pop d4">429 · Retry-After</p>
    </div>
  );
}

/* 05: the health check pings the process and nothing behind it; backends wait to be dialed */
function Health() {
  return (
    <div className="gws-health">
      <span className="gws-pill">health</span>
      <span className="gws-ping"><i /><i /></span>
      <span className="gws-box on">process up</span>
      <span className="gws-cut" />
      <span className="gws-box off">backends <em>dialed lazily</em></span>
    </div>
  );
}

/* 06: the gateway as its own service in front of the API (one hop), then mounted inside the cloud binary (no hop) */
function Hop() {
  return (
    <div className="gws-hop">
      <div className="gws-hop-row">
        <span className="gws-pill">client</span>
        <span className="gws-track s" />
        <div className="gws-bin">
          <span className="gws-gw">Gateway</span>
          <b>Hanzo Cloud</b>
        </div>
      </div>
      <p className="gws-hop-k"><span className="a">own service · one hop</span><span className="b">inside the cloud binary · no hop</span></p>
    </div>
  );
}

const SCENES = [Jwks, Headers, Routes, Bucket, Health, Hop];

export default function GwScene({ at, total }) {
  const S = SCENES[at];
  return (
    <div className="gws v2-obj" aria-hidden="true">
      <div className="gws-bar"><span className="gws-dots"><i /><i /><i /></span><span>api.hanzo.ai</span><b>{pad(at + 1)} / {pad(total)}</b></div>
      <div className="gws-body" key={at}><S /></div>
    </div>
  );
}
