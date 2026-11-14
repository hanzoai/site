/* IDV's "Sign one, forge one": a real HMAC-SHA256 over the raw body with the browser's WebCrypto, compared without an
   early exit. Nothing leaves the page. */
const enc = new TextEncoder();
export async function hmac(secret: string, body: string) {
  const key = await crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(body));
  return [...new Uint8Array(sig)].map((b) => b.toString(16).padStart(2, '0')).join('');
}
// constant time over equal lengths: every character is compared, whatever the first difference
export const same = (a: string, b: string) => { if (a.length !== b.length) return false; let d = 0; for (let i = 0; i < a.length; i++) d |= a.charCodeAt(i) ^ b.charCodeAt(i); return d === 0; };
/* -> 'refused' (empty secret, never a skip) | 'accepted' | 'turned away' */
export async function verify(secret: string, body: string, header: string) {

  if (!secret) return 'refused';
  return same(await hmac(secret, body), header.trim().toLowerCase()) ? 'accepted' : 'turned away';
}
