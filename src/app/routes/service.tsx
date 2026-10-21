import { useNavigate, useParams } from 'react-router';
import { ServiceDetailPage } from '../../pages/ServiceDetailPage';
import { SERVICES_DATA } from '../../data/servicesData';
import { NotFound } from '../NotFound';
import { notFoundMeta, seoMeta } from '../seo';

export function meta({ params }: { params: { service?: string } }) {
  const service = params.service ?? '';
  return SERVICES_DATA[service] ? seoMeta(`/services/${service}`) : notFoundMeta();
}

export default function ServiceRoute() {
  const { service = '' } = useParams();
  const navigate = useNavigate();

  if (!SERVICES_DATA[service]) {
    return <NotFound />;
  }

  return <ServiceDetailPage serviceId={service} onNavigateHome={() => navigate('/')} />;
}
