// Signature: none by design (MASTER §4.2, an honest status) — the six layers check themselves once as the page arrives, then the controls read as a calm document you select from
// Beyond: reviewer's worksheet — tick each control as you check it, the count stays in this browser, and at six of six the page hands over Hanzo's own next step, Schedule Security Review
import Security from '../../components/pages/Security';
import JsonLd from '../../components/JsonLd';

export const metadata = {
  title: 'What protects your data, and how. — Hanzo AI',
  description: 'Enterprise security architecture: sovereign tenant isolation, edge identity verification, post-quantum cryptography, and immutable audit logs.',
};

export default function Page() {
  return <><JsonLd route="/security" /><Security /></>;
}
