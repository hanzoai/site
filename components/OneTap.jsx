'use client';
/* Google One Tap for a visitor on hanzo.ai (hanzo-inc/app components/auth/tap.ts: the same client, the same rules).

   Google offers the accounts this browser is signed in to Google as; a tap hands this page a signed credential, which
   it neither reads nor trusts. The credential and the nonce Google bound it to go to this origin's sessionStorage
   (`TAP`), never into an address, and the visitor goes to hanzo.ai's sign-in page. There hanzo.app starts its own
   authorize request, and the app's panel finishes it with the credential as IAM's id_token_hint (`carried`), so IAM
   verifies it and the session is hanzo.app's, its PKCE verifier never having left it.

   Offered only on hanzo.ai (the origin the Google client allows), only where the visitor's consent lets a third
   party be told which site is open (readConsent().marketing: nothing under GPC or Do Not Track, nothing in the EU
   until accepted, and nothing until cloud's policy says which rule applies), never to a browser driven by a script,
   and never to a visitor in Google's cooldown after dismissing it: prompt() keeps that. The sign-in pages are the
   app's, which offer their own. */
import { useEffect } from 'react';
import { CONSENT_EVENT, POLICY_EVENT, readConsent } from '@hanzo/event';
import { SIGNIN } from '../lib/app';

/** IAM's provider-google client. Public: it is in the authorize address IAM sends a browser to. */
export const CLIENT = '113591532635-s8pvqrebprkbndluhftddmdap4htvu1p.apps.googleusercontent.com';
const SCRIPT = 'https://accounts.google.com/gsi/client';
/** Where the tap waits for the sign-in page (hanzo-inc/app components/auth/tap.ts `carried`). */
export const TAP = 'hanzo:tap';
/** Where a tap signs in: hanzo.ai's sign-in page, going on to the chat. */
const ENTRY = `${SIGNIN}/login?next=${encodeURIComponent('/chat')}`;

const offered = () =>
  (location.hostname === 'hanzo.ai' || location.hostname === 'www.hanzo.ai') && navigator.webdriver !== true && readConsent().marketing;

/** Hands a tap to the sign-in page: kept for it in this tab, then the page. */
export function hand(credential, nonce) {
  if (!credential) return;
  try {
    sessionStorage.setItem(TAP, JSON.stringify({ credential, nonce, at: Date.now() }));
  } catch {
    return;
  }
  location.assign(ENTRY);
}

export default function OneTap() {
  useEffect(() => {
    let asked = false;
    const prompt = (id) => {
      const nonce = crypto.randomUUID();
      id.initialize({
        client_id: CLIENT,
        color_scheme: document.documentElement.classList.contains('light') ? 'light' : 'dark',
        nonce,
        callback: ({ credential }) => hand(credential, nonce),
        auto_select: false,
        cancel_on_tap_outside: true,
        use_fedcm_for_prompt: true,
        itp_support: true,
        context: 'signin',
      });
      id.prompt();
    };
    const ask = () => {
      if (asked || !offered()) return;
      asked = true;
      if (window.google?.accounts?.id) return prompt(window.google.accounts.id);
      const s = document.createElement('script');
      s.src = SCRIPT;
      s.async = true;
      s.onload = () => window.google?.accounts?.id && prompt(window.google.accounts.id);
      s.onerror = () => {
        asked = false;
        s.remove();
      };
      document.head.appendChild(s);
    };
    ask();
    addEventListener(POLICY_EVENT, ask);
    addEventListener(CONSENT_EVENT, ask);
    return () => {
      removeEventListener(POLICY_EVENT, ask);
      removeEventListener(CONSENT_EVENT, ask);
      window.google?.accounts?.id?.cancel();
    };
  }, []);
  return null;
}
