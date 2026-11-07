// Signature: a phone that shows what you are agreeing to: your number lands on its To line, the three kinds of text arrive, STOP and HELP sit on its keys.
// Beyond: the consent read in parts: what, how often, cost, how to stop, purchases; each lights its own words in the paragraph and on the phone.
import SmsOptIn from '../../components/pages/SmsOptIn';
import JsonLd from '../../components/JsonLd';

export const metadata = {
  title: 'Get Hanzo text messages — Hanzo AI',
  description: 'Opt in to receive two-factor authentication codes, account and security alerts, and transactional notifications by SMS.',
};

export default function Page() {
  return <><JsonLd route="/sms-opt-in" /><SmsOptIn /></>;
}
