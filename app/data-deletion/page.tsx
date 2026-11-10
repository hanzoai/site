import LegalRoute, { legalMeta } from '../../components/pages/LegalRoute';

export const metadata = legalMeta('data-deletion');

export default function Page() {
  return <LegalRoute slug="data-deletion" />;
}
