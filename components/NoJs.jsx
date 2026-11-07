/* <NoJs css="…" />: styles for visitors without JavaScript, with no <noscript>.
   A <noscript> inside a client component cannot hydrate (React reads it as text in the browser), which puts Next's red
   error badge on the page. This writes the same rules as a plain <style>, every selector scoped under html:not(.js);
   app/layout.jsx sets html.js before first paint whenever JavaScript runs, so the rules apply only when it does not.
   Server and client render the same string, so nothing mismatches. Works in server and client components.
   Usage: <NoJs css=".my-step{opacity:1!important}" /> (plain CSS; @media blocks and keyframes are kept as they are). */
export function scopeNoJs(css) {
  const src = String(css).replace(/<\/?style[^>]*>/g, '');
  let out = '', i = 0;
  while (i < src.length) {
    const open = src.indexOf('{', i), close = src.indexOf('}', i);
    if (open === -1) { out += src.slice(i); break; }
    if (close !== -1 && close < open) { out += src.slice(i, close + 1); i = close + 1; continue; }
    const head = src.slice(i, open), t = head.trim();
    out += t.startsWith('@') || /^(from|to|\d+(\.\d+)?%)\b/.test(t) ? head + '{' : t.split(',').map((s) => 'html:not(.js) ' + s.trim()).join(',') + '{';
    i = open + 1;
  }
  return out;
}

export default function NoJs({ css }) {
  return <style dangerouslySetInnerHTML={{ __html: scopeNoJs(css) }} />;
}
