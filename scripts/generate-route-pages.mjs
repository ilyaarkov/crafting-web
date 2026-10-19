import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { createServer } from 'vite';

const site = 'https://ilyaarkov.com';
const defaultDescription = 'Современные сайты для экспертов, малого бизнеса и организаций. Напрямую с разработчиком.';
const routes = [
  {
    path: '/',
    title: 'Илья Арьков – Разработка сайтов для экспертов и бизнеса',
    description: defaultDescription,
  },
  {
    path: '/techstack',
    title: 'Стек технологий – Илья Арьков',
    description: 'Технологии и инструменты, которые я использую для разработки современных сайтов.',
  },
  {
    path: '/portfolio',
    title: 'Проекты – Илья Арьков',
    description: 'Реализованные сайты и подробные описания проектов в портфолио Ильи Арькова.',
  },
  {
    path: '/policy',
    title: 'Политика конфиденциальности – Илья Арьков',
    description: 'Политика обработки персональных данных на сайте Ильи Арькова.',
  },
  {
    path: '/portfolio/specialist-portfolio',
    title: 'Сайт-портфолио специалиста – Илья Арьков',
    description: 'Персональный сайт-портфолио: услуги, опыт, проекты и контакты в одном месте.',
    image: '/projects/portfolio.webp',
  },
  {
    path: '/portfolio/nonprofit-redesign',
    title: 'Редизайн сайта некоммерческой организации – Илья Арьков',
    description: 'Редизайн сайта некоммерческой организации с ясной структурой и удобной навигацией.',
    image: '/projects/nonprofit.webp',
  },
  {
    path: '/portfolio/wine-coop',
    title: 'Платформа винного кооператива – Илья Арьков',
    description: 'Каталог вин с панелью управления, фильтрами и интеграцией базы данных.',
    image: '/projects/intuitivo.webp',
  },
  {
    path: '/portfolio/driving-center',
    title: 'Платформа центра безопасного вождения – Илья Арьков',
    description: 'Концепт сайта учебного центра с программами курсов, расписанием и записью.',
    image: '/projects/driftet.webp',
  },
  {
    path: '/services/landing-page',
    title: 'Landing page под ключ – Илья Арьков',
    description: 'Конверсионный одностраничный сайт для продукта, услуги, эксперта или кампании.',
  },
  {
    path: '/services/corporate',
    title: 'Корпоративные сайты – Илья Арьков',
    description: 'Многостраничные сайты для компаний: услуги, структура бизнеса и укрепление бренда.',
  },
  {
    path: '/services/ecommerce',
    title: 'Интернет-магазины и каталоги – Илья Арьков',
    description: 'Современные интернет-магазины с каталогом, фильтрами, оплатой и синхронизацией остатков.',
  },
  {
    path: '/services/mvp',
    title: 'Разработка MVP – Илья Арьков',
    description: 'Быстрый запуск рабочей версии сайта или веб-сервиса для проверки бизнес-гипотез.',
  },
  {
    path: '/services/expert',
    title: 'Сайты для экспертов и мастеров – Илья Арьков',
    description: 'Персональные сайты с портфолио, ценами, кейсами и записью на консультации.',
  },
  {
    path: '/services/leads',
    title: 'Приём заявок в любые каналы – Илья Арьков',
    description: 'Автоматическая доставка заявок с сайта в Telegram, CRM, Google Таблицы или на почту.',
  },
  {
    path: '/services/automation',
    title: 'Автоматизация бизнес-процессов – Илья Арьков',
    description: 'Интеграция сайта с базами данных, рассылками и бизнес-сервисами для сокращения рутины.',
  },
  {
    path: '/services/payments',
    title: 'Подключение онлайн-оплаты – Илья Арьков',
    description: 'Интеграция платёжных систем, интернет-эквайринга, СБП и автоматической фискализации.',
  },
  {
    path: '/services/ai-assistants',
    title: 'AI-чатботы и ассистенты – Илья Арьков',
    description: 'Умные ассистенты для консультации клиентов, обработки заявок и ответов по базе знаний.',
  },
];

const escapeHtml = (value) => value
  .replaceAll('&', '&amp;')
  .replaceAll('"', '&quot;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;');

const setMeta = (html, attribute, key, value) => {
  const selector = new RegExp(`<meta\\s+${attribute}="${key}"[^>]*>`);
  const tag = `<meta ${attribute}="${key}" content="${escapeHtml(value)}" />`;
  return html.replace(selector, tag);
};

const dist = path.resolve('dist');
const shell = await readFile(path.join(dist, 'index.html'), 'utf8');
const sitemap = [];
globalThis.window = { location: { pathname: '/' }, innerWidth: 1024 };
globalThis.localStorage = { getItem: () => null, setItem: () => {} };
const vite = await createServer({
  configFile: path.resolve('vite.config.ts'),
  server: { middlewareMode: true },
  appType: 'custom',
  logLevel: 'error',
});
const { default: App } = await vite.ssrLoadModule('/src/App.tsx');

try {
  for (const route of routes) {
    const canonical = `${site}${route.path}`;
    const image = route.image ? `${site}${route.image}` : `${site}/images/og-preview.png`;
    globalThis.window.location.pathname = route.path;
    const renderedApp = renderToString(React.createElement(App));
    let html = shell.replace('<div id="root"></div>', `<div id="root">${renderedApp}</div>`);
    html = html.replace(/<title>[^<]*<\/title>/, `<title>${escapeHtml(route.title)}</title>`);
    html = setMeta(html, 'name', 'description', route.description || defaultDescription);
    html = setMeta(html, 'property', 'og:title', route.title);
    html = setMeta(html, 'property', 'og:description', route.description || defaultDescription);
    html = setMeta(html, 'property', 'og:url', canonical);
    html = setMeta(html, 'property', 'og:image', image);
    html = setMeta(html, 'property', 'og:image:alt', route.title);
    html = setMeta(html, 'name', 'twitter:title', route.title);
    html = setMeta(html, 'name', 'twitter:description', route.description || defaultDescription);
    html = setMeta(html, 'name', 'twitter:image', image);
    if (route.image) {
      html = setMeta(html, 'property', 'og:image:type', 'image/webp');
      html = html.replace(/\s*<meta property="og:image:(?:width|height)"[^>]*>/g, '');
    }
    html = html.replace(/<link rel="canonical" href="[^"]*"\s*\/>/, `<link rel="canonical" href="${canonical}" />`);

    const output = route.path === '/'
      ? path.join(dist, 'index.html')
      : path.join(dist, route.path.slice(1), 'index.html');
    await mkdir(path.dirname(output), { recursive: true });
    await writeFile(output, html);
    sitemap.push(`  <url><loc>${canonical}</loc></url>`);
  }

  globalThis.window.location.pathname = '/not-found';
  const notFoundApp = renderToString(React.createElement(App));
  let notFoundHtml = shell.replace('<div id="root"></div>', `<div id="root">${notFoundApp}</div>`);
  notFoundHtml = notFoundHtml.replace(/<title>[^<]*<\/title>/, '<title>Страница не найдена – Илья Арьков</title>');
  notFoundHtml = setMeta(notFoundHtml, 'name', 'description', 'Запрошенная страница не найдена.');
  notFoundHtml = setMeta(notFoundHtml, 'name', 'robots', 'noindex, nofollow');
  notFoundHtml = notFoundHtml.replace(/\s*<link rel="canonical" href="[^"]*"\s*\/>/, '');
  await writeFile(path.join(dist, '404.html'), notFoundHtml);
} finally {
  await vite.close();
}

await writeFile(path.join(dist, 'sitemap.xml'), [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...sitemap,
  '</urlset>',
].join('\n'));
