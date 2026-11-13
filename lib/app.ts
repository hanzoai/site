// The app's origin: chat and the rooms live there; this site is the signed-out hanzo.ai.
export const APP = 'https://hanzo.app';
// A question asked of Hanzo: Chat, at hanzo.app's root, answers it at once, signed in or not.
export const ask = (q: string) => `${APP}/?q=${encodeURIComponent(q)}`;
// Where Hanzo signs in and checks out: hanzo.ai's own pages (the app's sign-in pages and /pay, served here by the edge).
export const SIGNIN = 'https://hanzo.ai';
