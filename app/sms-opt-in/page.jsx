// Persona: a Hanzo user who wants codes and alerts by text
// Goal: opt in to Hanzo SMS
// CTA: Yes, sign me up! (kit Cta sms-opt-in.submit; the header carries it after the hero)
// Metric: lead_submit
// Signature: a phone that shows what you are agreeing to: your number lands on its To line, the three kinds of text arrive, STOP and HELP sit on its keys.
// Beyond: the consent read in parts: what, how often, cost, how to stop, purchases; each lights its own words in the paragraph and on the phone.
// V2: 8/10 MASTER scale: 52px headline with SMS Notifications as its caption below; the phone receives the three texts once and rests; every consent part lights the phone; the dark room shows one bubble big at a time; success only on a 2xx, the number kept and marked otherwise; kit Field and Cta
import SmsOptIn from '../../components/pages/SmsOptIn';
import JsonLd from '../../components/JsonLd';

export const metadata = {
  title: 'Get Hanzo text messages — Hanzo AI',
  description: 'Opt in to receive two-factor authentication codes, account and security alerts, and transactional notifications by SMS.',
};

export default function Page() {
  return <><JsonLd route="/sms-opt-in" /><SmsOptIn /></>;
}
