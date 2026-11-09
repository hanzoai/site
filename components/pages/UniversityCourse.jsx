'use client';
/* One Hanzo University course (/university/<slug>: RL 101, SYS 103, MKT 102, PRA 104, ARC 105; ENG 100 has its own page).
   Persona: an engineer deciding whether the course is worth a seat. Goal: read the syllabus and take a seat.
   CTA: "Request a seat", or "Enroll in <code>" where the catalog sells the course (universitySeat.js), thumb.
   Signature: the steps card beside the first screen walks the course week by week. Every word is the course's own,
   from hanzo-inc/app's courses data. No tuition is typed. */
import { A, Cta } from '../kit';
import { Chip, Fold, Steps, Band } from './UniversityFold';
import Icon from './universityIcons';
import { ASK, seatFor } from './universitySeat';
import { FILM, UNIVERSITY_COURSES } from './universityData';
import './UniversityCourse.css';

const PORTAL = '/university/portal';

/* a course in the list of tracks: its code and credential, title, summary, and where it is read */
function Track({ c, here }) {
  const seat = seatFor(c.planId, '/university/' + c.slug);
  return (
    <article className="xuv-card xuv-track" aria-current={here ? 'page' : undefined}>
      <div className="xuv-track-body">
        <div className="xuv-row">
          <span className="xuv-mono xuv-label">{c.code}</span>
          <Chip>{c.credential}</Chip>
        </div>
        <h3>{c.title}</h3>
        <p>{c.summary}</p>
      </div>
      <div className="xuv-row xuv-track-foot">
        <span className="xuv-b">{seat ? `${seat.price} USD` : ''}</span>
        <A to={'/university/' + c.slug} className="xuv-link">View Course →</A>
      </div>
    </article>
  );
}

export default function UniversityCourse({ course: c }) {
  const seat = seatFor(c.planId, '/university/' + c.slug);
  const way = seat?.href ?? ASK;
  return (
    <main className="xuv" data-ask-name={c.code}>
      <Fold
        trail={[{ label: 'University', to: '/university' }, { label: c.code }]}
        badge={`Course ${c.code} · Units: ${c.units}.0 · Credential: ${c.credential}`}
        title={c.title}
        lede={c.summary}
        actions={<>
          <Cta to={way} kind="solid" thumb id="university.seat">{seat ? `Enroll in ${c.code} — ${seat.price} USD (+${seat.credit} Credit Rebate)` : 'Request a seat'}</Cta>
          <Cta to={PORTAL} kind="quiet" id="university.portal-hero">Preview Enrolled Student Portal →</Cta>
        </>}
        preview={<Steps title={c.code} film={FILM[c.slug]} steps={c.syllabus.map((w) => ({ title: w.title, body: w.summary }))} />}
      />

      <Band tone="sunk">
        <div className="xuv-grid c2">
          <div className="xuv-card xuv-spec">
            <div className="xuv-row">
              <span className="xuv-label">Academic specifications</span>
              <Chip>{c.code} · {c.units}.0 UNITS</Chip>
            </div>
            <dl className="xuv-cells">
              <div className="xuv-cell"><dt>Duration</dt><dd>{c.duration}</dd></div>
              <div className="xuv-cell"><dt>LEVEL</dt><dd>{c.level}</dd></div>
              <div className="xuv-cell"><dt>Credential</dt><dd>{c.credential}</dd></div>
              <div className="xuv-cell"><dt>Credential format</dt><dd>W3C Verifiable Credential</dd></div>
            </dl>
            <div className="xuv-stack tight">
              <span className="xuv-sub b xuv-b">Lead Faculty &amp; Academic Direction</span>
              <div className="xuv-fac">
                <span className="xuv-avatar"><Icon name="cap" size={18} /></span>
                <span className="xuv-fac-t"><span className="xuv-b">{c.instructor.name}</span><span>{c.instructor.role}</span></span>
              </div>
            </div>
            <div className="xuv-stack tight">
              <span className="xuv-sub b xuv-b">Prerequisites</span>
              <p className="xuv-sub">{c.prerequisites}</p>
            </div>
          </div>

          <div className="xuv-card xuv-spec">
            <div className="xuv-row">
              <span className="xuv-label">Tuition &amp; compute rebate</span>
              <Chip tone="ok">Open enrollment</Chip>
            </div>
            {seat && (
              <div className="xuv-tuition">
                <div className="xuv-row">
                  <div>
                    <span className="xuv-label">Total tuition</span>
                    <span className="xuv-price">{seat.price}<small>USD</small></span>
                  </div>
                  <Chip tone="ok">+{seat.credit} CREDITS (25% REBATE)</Chip>
                </div>
                <p className="xuv-sub">Guaranteed compute allocation deposited immediately on enrollment. Subsidizes Zen 6 inference and Hanzo Visor sandbox runtimes.</p>
              </div>
            )}
            <div className="xuv-ask">
              <Cta to={way} kind="solid" size="lg" id="university.seat-card">{seat ? `Enroll in ${c.code} — ${seat.price} USD →` : 'Request a seat'}</Cta>
              {seat && <p className="xuv-note">Have a coupon code or fellowship grant? Enter it during checkout.</p>}
            </div>
            <div className="xuv-rebate">
              <div className="xuv-rebate-h"><span><Icon name="coins" size={16} />Automatic 25% Compute Credit Rebate</span></div>
              <p className="xuv-sub">25% of tuition (rounded up) is immediately deposited into your Hanzo Cloud compute balance on day one. Fully subsidizes your Hanzo Visor sandbox container leases and model inference throughout the course.</p>
            </div>
            <div className="xuv-foot-line">
              <span>Already purchased?</span>
              <A to={PORTAL} className="xuv-link">Enter Enrolled Student Portal →</A>
            </div>
          </div>
        </div>
      </Band>

      <Band kicker="Competency Framework" title={`What you master in ${c.code}`} lede="Engineered for software practitioners building resilient autonomous production systems.">
        <div className="xuv-grid c4">
          {c.competencies.map((k) => (
            <div key={k} className="xuv-card xuv-comp"><Icon name="checkCircle" size={18} /><span className="xuv-b">{k}</span></div>
          ))}
        </div>
      </Band>

      <Band tone="sunk" kicker="Comprehensive Syllabus" title="Curriculum & Laboratory Breakdown" lede="Every module combines systems architecture lectures with hands-on containerized lab defense.">
        <div className="xuv-grid stack">
          {c.syllabus.map((w) => (
            <article key={w.code} className="xuv-card xuv-week">
              <div className="xuv-row">
                <div className="xuv-wk-t"><Chip>{w.code}</Chip><h3>{w.title}</h3></div>
                <span className="xuv-mono xuv-label">{w.week}</span>
              </div>
              <p className="xuv-wk-sum">{w.summary}</p>
              <div className="xuv-grid c2">
                <div className="xuv-panel2">
                  <span className="xuv-sub b xuv-b">Key Topics &amp; Lectures:</span>
                  <ul className="xuv-checks">{w.lectures.map((l) => <li key={l}><Icon name="check" size={13} /><span>{l}</span></li>)}</ul>
                </div>
                <div className="xuv-panel2">
                  <span className="xuv-sub b xuv-b">Assigned Readings:</span>
                  <ul className="xuv-checks">{w.readings.map((r) => <li key={r}><Icon name="book" size={13} /><span>{r}</span></li>)}</ul>
                </div>
              </div>
              <div className="xuv-lab"><Icon name="code" size={16} /><p>{w.lab}</p></div>
            </article>
          ))}
        </div>
      </Band>

      <Band narrow>
        <div className="xuv-card xuv-final">
          <div className="xuv-final-t">
            <span className="xuv-kick">Final Examination</span>
            <h2>Capstone Defense &amp; Credential Issuance</h2>
            <p>{c.capstone} Upon automated grading verification, your {c.credential} W3C Verifiable Credential is cryptographically signed and issued to your Hanzo DID.</p>
          </div>
          <div className="xuv-final-a">
            <Cta to={way} kind="solid" id="university.seat-final">{seat ? `Enroll in ${c.code} — ${seat.price}` : 'Request a seat'}</Cta>
            <Cta to={PORTAL} kind="quiet" id="university.portal-final">Preview Student Portal</Cta>
          </div>
        </div>
      </Band>

      <Band tone="sunk" kicker="Hanzo University Tracks" title="Explore the Complete Curriculum" lede="Six specialized engineering credentials designed for the frontier of autonomous intelligence.">
        <div className="xuv-grid c3">
          {UNIVERSITY_COURSES.map((t) => <Track key={t.slug} c={t} here={t.slug === c.slug} />)}
        </div>
      </Band>
    </main>
  );
}
