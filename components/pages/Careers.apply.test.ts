// node --test components/pages/Careers.apply.test.mjs: an application is filed as hanzo.ai files it (JobView.tsx, apply.tsx).
import test from 'node:test';
import assert from 'node:assert/strict';
import { answers, lead, problem, resumeProblem, send } from './Careers.apply.ts';

const role = { title: 'Compiler Engineer', department: 'Engineering', location: 'Remote', slug: 'compiler-engineer' };
const pairs = [['Full Name', ' Ada Lovelace '], ['Email Address', ' ada@example.com '], ['GitHub / Portfolio URL', 'github.com/ada'], ['LinkedIn / Personal Site', 'mailto:x'], ['Resume link', ''], ['Location / Timezone', ''], ['Background & Notes', ' I built a compiler. '], ['Something else', 'ignored']];

test('the answers by part, and the sentence for what is missing', () => {
  const a = answers(pairs);
  assert.deepEqual(Object.keys(a), ['name', 'email', 'github', 'linkedin', 'resume', 'location', 'notes']);
  assert.equal(problem(a), '');
  assert.equal(problem({ ...a, notes: ' ' }), 'Please fill in your name, email, and background note.');
  assert.equal(problem({ ...a, email: 'ada@' }), 'Please enter a valid email address.');
});

test('a resume is a PDF, DOC or DOCX of at most 10 MB', () => {
  assert.equal(resumeProblem({ name: 'cv.PDF', size: 10 }), '');
  assert.equal(resumeProblem({ name: 'cv.docx', size: 10 * 1024 * 1024 }), '');
  assert.equal(resumeProblem({ name: 'cv.txt', size: 10 }), 'A resume is a PDF, DOC or DOCX file.');
  assert.equal(resumeProblem({ name: 'cv.pdf', size: 10 * 1024 * 1024 + 1 }), 'A resume is at most 10 MB.');
});

test('the candidate lead: the role, the person, an https link for each address and the opt-in only if ticked', () => {
  assert.deepEqual(lead(role, answers(pairs), { resumeFile: 'k/cv.pdf', consent: true }), {
    name: 'Ada Lovelace', email: 'ada@example.com', role: 'Compiler Engineer', department: 'Engineering', country: 'Remote',
    source: 'hanzo.ai/careers/compiler-engineer', job: 'compiler-engineer', need: 'I built a compiler.', resume: '',
    links: ['https://github.com/ada', 'mailto:x'], resume_file: 'k/cv.pdf', consent: true,
  });
  assert.equal(lead(role, answers(pairs)).consent, false);
  assert.equal(lead(role, answers([...pairs, ['Location / Timezone', ' Berlin ']])).country, 'Berlin');
});

test('the application goes to the gateway; a refusal is Hanzo\'s sentence', async () => {
  const seen = [];
  globalThis.fetch = async (url, init) => { seen.push([url, init.method, JSON.parse(init.body).source]); return { ok: false, status: 503 }; };
  const r = await send(role, answers(pairs), null, false);
  assert.deepEqual(seen, [['https://api.hanzo.ai/v1/marketing/leads', 'POST', 'hanzo.ai/careers/compiler-engineer']]);
  assert.equal(r.error, 'Your application did not reach us. Please try again, or email it to careers@hanzo.ai.');
});
