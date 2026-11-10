import LegalRoute, { legalMeta } from '../../components/pages/LegalRoute';

export const metadata = legalMeta('privacy');

export default function Page() {
  return <LegalRoute slug="privacy" />;
}
