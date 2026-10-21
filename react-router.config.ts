import { copyFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import type { Config } from '@react-router/dev/config';
import { PROJECTS_DATA } from './src/data/projectsData';
import { SERVICES_DATA } from './src/data/servicesData';

const SITE_URL = 'https://ilyaarkov.com';

const prerenderPaths = [
  '/',
  '/techstack',
  '/portfolio',
  '/policy',
  ...Object.keys(PROJECTS_DATA).map((id) => `/portfolio/${id}`),
  ...Object.keys(SERVICES_DATA).map((id) => `/services/${id}`),
];

export default {
  appDirectory: 'src/app',
  ssr: true,
  prerender: [...prerenderPaths, '/404'],
  buildEnd: async ({ reactRouterConfig }) => {
    const client = path.join(reactRouterConfig.buildDirectory, 'client');

    await copyFile(path.join(client, '404', 'index.html'), path.join(client, '404.html'));

    const urls = prerenderPaths.map((route) => `  <url><loc>${SITE_URL}${route}</loc></url>`);
    await writeFile(path.join(client, 'sitemap.xml'), [
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
      ...urls,
      '</urlset>',
    ].join('\n'));
  },
} satisfies Config;
