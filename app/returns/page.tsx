import LegalRoute, { legalMeta } from '../../components/pages/LegalRoute';

export const metadata = legalMeta('refunds');

export default function Page() {
  return <LegalRoute slug="refunds" />;
}
