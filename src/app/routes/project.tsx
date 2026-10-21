import { useNavigate, useParams } from 'react-router';
import { ProjectDetailPage } from '../../pages/ProjectDetailPage';
import { PROJECTS_DATA } from '../../data/projectsData';
import { NotFound } from '../NotFound';
import { notFoundMeta, seoMeta } from '../seo';

export function meta({ params }: { params: { project?: string } }) {
  const project = params.project ?? '';
  return PROJECTS_DATA[project] ? seoMeta(`/portfolio/${project}`) : notFoundMeta();
}

export default function ProjectRoute() {
  const { project = '' } = useParams();
  const navigate = useNavigate();

  if (!PROJECTS_DATA[project]) {
    return <NotFound />;
  }

  return (
    <ProjectDetailPage
      projectId={project}
      onNavigatePortfolio={() => navigate('/portfolio')}
      onNavigateHome={() => navigate('/')}
    />
  );
}
