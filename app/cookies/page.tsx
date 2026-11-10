import LegalRoute, { legalMeta } from '../../components/pages/LegalRoute';

export const metadata = legalMeta('cookies');

export default function Page() {
  return <LegalRoute slug="cookies" />;
}
