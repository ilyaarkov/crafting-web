import { useNavigate } from 'react-router';
import { PrivacyPolicyPage } from '../../pages/PrivacyPolicyPage';
import { seoMeta } from '../seo';

export function meta() {
  return seoMeta('/policy');
}

export default function PolicyRoute() {
  const navigate = useNavigate();

  return <PrivacyPolicyPage onNavigateHome={() => navigate('/')} />;
}
