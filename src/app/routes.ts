import { index, route, type RouteConfig } from '@react-router/dev/routes';

export default [
  index('routes/home.tsx'),
  route('techstack', 'routes/techstack.tsx'),
  route('tech-stack', 'routes/techstack.tsx', { id: 'tech-stack' }),
  route('portfolio', 'routes/portfolio.tsx'),
  route('portfolio/:project', 'routes/project.tsx'),
  route('project/:project', 'routes/project.tsx', { id: 'project-alias' }),
  route('services/:service', 'routes/service.tsx'),
  route('service/:service', 'routes/service.tsx', { id: 'service-alias' }),
  route('policy', 'routes/policy.tsx'),
  route('*', 'routes/not-found.tsx'),
] satisfies RouteConfig;
