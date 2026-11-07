// Learn where each of Hanzo's forms sends its data, WITHOUT sending anything: every non-GET request is blocked in the
// browser before it leaves, and only its address, method and field names are recorded. Test values only.
// Usage: node scripts/forms.mjs /contact-sales /newsletter ...   ->  content/forms.json
import fs from 'node:fs';
import puppeteer from 'puppeteer-core';
import { lock } from './lock.mjs';
await lock();

const paths = process.argv.slice(2);
const out = fs.existsSync('content/forms.json') ? JSON.parse(fs.readFileSync('content/forms.json', 'utf8')) : {};
const b = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true });
for (const p of paths) {
  const page = await b.newPage();
  await page.setViewport({ width: 1470, height: 900 });
  await page.setRequestInterception(true);
  const seen = [];
  page.on('request', (r) => {
    if (r.method() !== 'GET' && r.method() !== 'OPTIONS' && r.method() !== 'HEAD') {
      let body = r.postData() || '';
      let fields = [];
      try { fields = Object.keys(JSON.parse(body)); } catch { fields = [...new URLSearchParams(body).keys()]; }
      if (!/google|analytics|posthog|segment|sentry|vitals|collect|insights|telemetry/i.test(r.url())) seen.push({ url: r.url(), method: r.method(), type: r.headers()['content-type'] || '', fields, body: body.slice(0, 600) }); // test values only
      r.abort(); // never let a form submission reach Hanzo
    } else r.continue();
  });
  try {
    await page.goto('https://hanzo.ai' + p, { waitUntil: 'networkidle2', timeout: 45000 });
    await page.evaluate(() => document.querySelectorAll('[role=dialog]').forEach((d) => /cookies/i.test(d.innerText) && d.remove()));
    const forms = await page.$$('main form');
    const info = [];
    for (const f of forms) {
      const fields = await f.evaluate((form) => [...form.elements].filter((e) => e.name || e.id).map((e) => ({ name: e.name || e.id, type: e.type || e.tagName.toLowerCase(), required: e.required, label: (e.labels && e.labels[0] ? e.labels[0].innerText : e.getAttribute('aria-label') || e.placeholder || '').trim().slice(0, 60), options: e.tagName === 'SELECT' ? [...e.options].map((o) => o.value) : undefined })));
      await f.evaluate((form) => {
        for (const e of form.elements) {
          if (!e.name || e.name === 'website') continue; // leave the honeypot empty
          if (e.tagName === 'SELECT') { e.value = e.options[e.options.length - 1].value; e.dispatchEvent(new Event('change', { bubbles: true })); }
          else if (e.type === 'checkbox') { if (!e.checked) e.click(); }
          else if (e.type === 'email') { const s = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set; s.call(e, 'test@example.com'); e.dispatchEvent(new Event('input', { bubbles: true })); }
          else if (e.type === 'tel') { const s = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set; s.call(e, '+15555550123'); e.dispatchEvent(new Event('input', { bubbles: true })); }
          else if (/text|url|search|textarea/.test(e.type) || e.tagName === 'TEXTAREA') { const proto = e.tagName === 'TEXTAREA' ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype; Object.getOwnPropertyDescriptor(proto, 'value').set.call(e, 'Test'); e.dispatchEvent(new Event('input', { bubbles: true })); }
        }
      });
      const before = seen.length;
      await f.evaluate((form) => { const s = form.querySelector('button[type=submit], button:not([type])'); if (s) s.click(); else form.requestSubmit(); });
      await new Promise((r) => setTimeout(r, 2500));
      info.push({ fields, sends: seen.slice(before) });
    }
    out[p] = info;
    console.log(p, JSON.stringify(info.map((x) => x.sends.map((s) => s.method + ' ' + s.url + ' [' + s.fields.join(',') + ']'))));
  } catch (e) {
    console.log(p, 'FAILED', e.message.slice(0, 100));
  } finally { await page.close(); }
}
await b.close();
fs.writeFileSync('content/forms.json', JSON.stringify(out, null, 1));
