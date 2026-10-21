import { NotFound } from '../NotFound';
import { notFoundMeta } from '../seo';

export function meta() {
  return notFoundMeta();
}

export default function NotFoundRoute() {
  return <NotFound />;
}
