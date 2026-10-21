import { useNavigate } from 'react-router';
import { PortfolioPage } from '../../pages/PortfolioPage';
import { seoMeta } from '../seo';

export function meta() {
  return seoMeta('/portfolio');
}

export default function PortfolioRoute() {
  const navigate = useNavigate();

  return (
    <PortfolioPage
      onNavigateHome={() => navigate('/')}
      onNavigateProject={(id) => navigate(`/portfolio/${id}`)}
    />
  );
}
