/* What hanzo.ai sends when someone files a beta application (hanzo-inc/app components/beta/portal.tsx `file`): the
   answers as a response to the program's own form, hanzo.<program>-apply, on the gateway. The lead and the beta record
   are filed only for a signed-in applicant, who is not on this site; a visitor's answers are the form response. */
export const API = 'https://api.hanzo.ai';

/* an answer as a line: a list of choices reads as one, a missing answer as nothing */
export const said = (v) => (Array.isArray(v) ? v.join(', ') : (v ?? '').trim());

/* the POST for a program's answers: its address and body, or null where nothing was answered (nothing is sent) */
export function filing(program: string, asks, got, now = Date.now()) {
  const answers = asks.filter((a) => said(got[a.id])).map((a) => ({ field: a.id, text: said(got[a.id]).slice(0, 2000) }));
  if (!answers.length) return null;
  return {
    url: `${API}/v1/form/public/hanzo.${program}-apply/responses`,
    body: { token: 'b_' + String(now).replace(/[^A-Za-z0-9]/g, '').slice(0, 30), answers, hidden: { program, source: 'hanzo.ai/beta' } },
  };
}
