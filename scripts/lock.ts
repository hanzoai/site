// One headless browser at a time on this 8 GB Mac: every browser script takes this lock first and waits its turn.
// HZ_PRIORITY=1 (the conductor's checks) goes next in line: ordinary jobs step back while a priority job is waiting.
import fs from 'node:fs';
const L = '/tmp/hz-browser.lock', P = '/tmp/hz-browser.priority';
const alive = (f) => { try { return process.kill(+fs.readFileSync(f, 'utf8'), 0); } catch { return false; } };
export async function lock() {
  const pri = process.env.HZ_PRIORITY === '1';
  if (pri) fs.writeFileSync(P, String(process.pid));
  for (let i = 0; ; i++) {
    const yieldTo = !pri && fs.existsSync(P) && alive(P);
    if (!yieldTo) {
      try { fs.mkdirSync(L); fs.writeFileSync(L + '/pid', String(process.pid)); break; }
      catch {
        let stale = false;
        try { stale = Date.now() - fs.statSync(L).mtimeMs > 12 * 60e3 || !alive(L + '/pid'); } catch { stale = true; }
        if (stale) { fs.rmSync(L, { recursive: true, force: true }); continue; }
      }
    }
    if (i % 20 === 0) console.log('waiting for another browser job to finish…');
    await new Promise((r) => setTimeout(r, pri ? 1000 : 3000));
  }
  if (pri) fs.rmSync(P, { force: true });
  const free = () => fs.rmSync(L, { recursive: true, force: true });
  process.on('exit', free); process.on('SIGINT', () => process.exit(130)); process.on('SIGTERM', () => process.exit(143));
}
