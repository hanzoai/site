import LegalRoute, { legalMeta } from '../../components/pages/LegalRoute';

export const metadata = legalMeta('terms');

export default function Page() {
  return <LegalRoute slug="terms" />;
}
