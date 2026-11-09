import LegalRoute, { legalMeta } from '../../components/pages/LegalRoute';

export const metadata = legalMeta('acceptable-use');

export default function Page() {
  return <LegalRoute slug="acceptable-use" />;
}
