// node components/pages/Grants.apply.test.mjs — a grant application checks its fields and files as hanzo.ai files it
import assert from 'node:assert';
import { apply } from './Grants.apply.ts';
const f = { name: ' Ada ', email: 'test@example.com', affiliation: '', github: 'github.com/ada', scholar: '', summary: 'Test' };
assert.deepEqual(apply('internship', f).lead, { name: 'Ada', email: 'test@example.com', company: 'Open Source / Academic', role: 'Academic & PhD Research Intern', department: 'Open Source & Research Grants', country: 'Remote', source: 'hanzo.ai/grants/internship', job: 'academic-research-intern', need: 'Test', links: ['https://github.com/ada'] });
assert.equal(apply('oss', f).lead.job, 'oss-grant');
assert.equal(apply('oss', { ...f, summary: ' ' }).error, 'Please fill in your name, email, and project / research summary.');
assert.equal(apply('oss', { ...f, email: 'x@y' }).error, 'Please enter a valid email address.');
console.log('grants apply ok');
