/* A job application, as hanzo.ai files it (hanzo-inc/app careers/[slug]/JobView.tsx and careers/apply.tsx): a resume file
   goes up first, straight to Hanzo's careers bucket through a form cloud signs for that one file (POST
   /v1/marketing/leads/resume), and the application then names its key; the application is one candidate lead (POST
   /v1/marketing/leads). Both are on the gateway, api.hanzo.ai. */
export const API = 'https://api.hanzo.ai';

/* the form's questions, by the label Hanzo prints, and the part of the lead each one is */
const FIELDS = {
  'Full Name': 'name', 'Email Address': 'email', 'GitHub / Portfolio URL': 'github', 'LinkedIn / Personal Site': 'linkedin',
  'Resume link': 'resume', 'Location / Timezone': 'location', 'Background & Notes': 'notes',
};
const TYPES = {
  pdf: 'application/pdf',
  doc: 'application/msword',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
};
const typeOf = (f) => TYPES[f.name.split('.').pop()?.toLowerCase() ?? ''];
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/* an address as https: one typed without a scheme gets https://, and cloud drops any other */
const https = (u) => {
  const t = u.trim();
  return !t || /^[a-z][a-z0-9+.-]*:/i.test(t) ? t : `https://${t}`;
};

/* why a file cannot be a resume, or '' when it can */
export function resumeProblem(f) {
  if (!typeOf(f)) return 'A resume is a PDF, DOC or DOCX file.';
  if (f.size > 10 * 1024 * 1024) return 'A resume is at most 10 MB.';
  return '';
}

/* the answers by part (name, email, ...) from the form's fields: [label, value] pairs in the order the form asks them */
export const answers = (pairs) => Object.fromEntries(pairs.filter(([label]) => FIELDS[label]).map(([label, v]) => [FIELDS[label], String(v ?? '')]));

/* what is wrong with the answers, in Hanzo's sentence, or '' */
export function problem(a, file) {
  if (!(a.name || '').trim() || !(a.email || '').trim() || !(a.notes || '').trim()) return 'Please fill in your name, email, and background note.';
  if (!EMAIL.test(a.email.trim())) return 'Please enter a valid email address.';
  return file ? resumeProblem(file) : '';
}

/* the candidate lead: what the person wrote, their resume and their links, for the role (title, department, location, slug) */
export function lead(role, a, { resumeFile = '', consent = false } = {}) {
  const get = (k) => (a[k] || '').trim();
  return {
    name: get('name'),
    email: get('email'),
    role: role.title,
    department: role.department,
    country: get('location') || role.location,
    source: `hanzo.ai/careers/${role.slug}`,
    job: role.slug,
    need: get('notes'),
    resume: https(a.resume || ''),
    links: [https(a.github || ''), https(a.linkedin || '')].filter(Boolean),
    resume_file: resumeFile,
    consent,
  };
}

/* upload the resume and answer the key the application names */
export async function uploadResume(f) {
  const type = typeOf(f);
  const r = await fetch(`${API}/v1/marketing/leads/resume`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: f.name, type, size: f.size }) });
  if (!r.ok) throw new Error(`resume form HTTP ${r.status}`);
  const form = await r.json();
  const body = new FormData();
  for (const [k, v] of Object.entries(form.fields)) body.append(k, v);
  body.append('file', new Blob([f], { type }), f.name);
  const up = await fetch(form.url, { method: 'POST', body });
  if (!up.ok) throw new Error(`resume upload HTTP ${up.status}`);
  return form.key;
}

/* file the application: its resume first, then the lead. Resolves { ok } or { error } in Hanzo's sentence. */
export async function send(role, a, file, consent) {
  let resumeFile = '';
  try {
    if (file) resumeFile = await uploadResume(file);
  } catch {
    return { error: 'Your resume did not upload. Please try again, or give a link instead.' };
  }
  try {
    const r = await fetch(`${API}/v1/marketing/leads`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(lead(role, a, { resumeFile, consent })) });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    return { ok: true };
  } catch (e) {
    return { error: 'Your application did not reach us. Please try again, or email it to careers@hanzo.ai.', cause: String(e) };
  }
}
