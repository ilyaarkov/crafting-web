import { useNavigate } from 'react-router';
import { PrivacyPolicyPage } from '../../pages/PrivacyPolicyPage';
import { seoMeta } from '../seo';

// Route metadata is an intentional React Router export.
// oxlint-disable-next-line react/only-export-components
export function meta() {
  return seoMeta('/consent');
}

export default function ConsentRoute() {
  const navigate = useNavigate();
  return <PrivacyPolicyPage document="consent" onNavigateHome={() => navigate('/#contact')} />;
}
