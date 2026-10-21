import { useNavigate } from 'react-router';
import { TechStackPage } from '../../pages/TechStackPage';
import { seoMeta } from '../seo';

export function meta() {
  return seoMeta('/techstack');
}

export default function TechStackRoute() {
  const navigate = useNavigate();

  return <TechStackPage onNavigateHome={() => navigate('/')} />;
}
