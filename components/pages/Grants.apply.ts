/* A grant application, as hanzo.ai files it: one sales lead (POST /v1/marketing/leads), checked first. */
export const TRACKS: [key: string, label: string, role: string][] = [
  ['oss', 'Open Source Contributor Grant', 'Open Source Contributor Credit Grant'],
  ['academic', 'Academic / PhD Research Credits', 'Academic & PhD Research Grant'],
  ['internship', 'PhD / Research Internship', 'Academic & PhD Research Intern'],
];
const url = (v: string) => { const t = v.trim(); return !t || /^[a-z][a-z0-9+.-]*:/i.test(t) ? t : `https://${t}`; };

export interface Fields { name: string; email: string; affiliation: string; github: string; scholar: string; summary: string }

// (track, fields) -> { error } or { lead }
export function apply(track: string, f: Fields) {
  if (!f.name.trim() || !f.email.trim() || !f.summary.trim()) return { error: 'Please fill in your name, email, and project / research summary.' };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.trim())) return { error: 'Please enter a valid email address.' };
  const role = (TRACKS.find(([k]) => k === track) || TRACKS[0])[2];
  return { lead: {
    name: f.name.trim(), email: f.email.trim(), company: f.affiliation.trim() || 'Open Source / Academic', role,
    department: 'Open Source & Research Grants', country: 'Remote', source: `hanzo.ai/grants/${track}`,
    job: track === 'internship' ? 'academic-research-intern' : 'oss-grant', need: f.summary.trim(), links: [url(f.github), url(f.scholar)].filter(Boolean),
  } };
}
