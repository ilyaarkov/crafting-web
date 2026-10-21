import type { MetaDescriptor } from 'react-router';

export const SITE_URL = 'https://ilyaarkov.com';
const DEFAULT_IMAGE = '/images/og-preview.png';
const DEFAULT_DESCRIPTION = 'Современные сайты для экспертов, малого бизнеса и организаций. Напрямую с разработчиком.';

export const ROUTE_SEO: Record<string, { title: string; description: string; ogImage?: string }> = {
  '/': {
    title: 'Илья Арьков – Разработка сайтов для экспертов и бизнеса',
    description: DEFAULT_DESCRIPTION,
  },
  '/techstack': {
    title: 'Стек технологий – Илья Арьков',
    description: 'Технологии и инструменты, которые я использую для разработки современных сайтов.',
  },
  '/portfolio': {
    title: 'Проекты – Илья Арьков',
    description: 'Реализованные сайты и подробные описания проектов в портфолио Ильи Арькова.',
  },
  '/policy': {
    title: 'Политика конфиденциальности – Илья Арьков',
    description: 'Политика обработки персональных данных на сайте Ильи Арькова.',
  },
  '/portfolio/specialist-portfolio': {
    title: 'Сайт-портфолио специалиста – Илья Арьков',
    description: 'Персональный сайт-портфолио: услуги, опыт, проекты и контакты в одном месте.',

  },
  '/portfolio/nonprofit-redesign': {
    title: 'Редизайн сайта некоммерческой организации – Илья Арьков',
    description: 'Редизайн сайта некоммерческой организации с ясной структурой и удобной навигацией.',
    ogImage: '/projects/nonprofit.webp',
  },
  '/portfolio/wine-coop': {
    title: 'Платформа винного кооператива – Илья Арьков',
    description: 'Каталог вин с панелью управления, фильтрами и интеграцией базы данных.',
    ogImage: '/projects/intuitivo.webp',
  },
  '/portfolio/driving-center': {
    title: 'Платформа центра безопасного вождения – Илья Арьков',
    description: 'Концепт сайта учебного центра с программами курсов, расписанием и записью.',
    ogImage: '/projects/driftet.webp',
  },
  '/services/landing-page': {
    title: 'Landing page под ключ – Илья Арьков',
    description: 'Конверсионный одностраничный сайт для продукта, услуги, эксперта или кампании.',
  },
  '/services/corporate': {
    title: 'Корпоративные сайты – Илья Арьков',
    description: 'Многостраничные сайты для компаний: услуги, структура бизнеса и укрепление бренда.',
  },
  '/services/ecommerce': {
    title: 'Интернет-магазины и каталоги – Илья Арьков',
    description: 'Современные интернет-магазины с каталогом, фильтрами, оплатой и синхронизацией остатков.',
  },
  '/services/mvp': {
    title: 'Разработка MVP – Илья Арьков',
    description: 'Быстрый запуск рабочей версии сайта или веб-сервиса для проверки бизнес-гипотез.',
  },
  '/services/expert': {
    title: 'Сайты для экспертов и мастеров – Илья Арьков',
    description: 'Персональные сайты с портфолио, ценами, кейсами и записью на консультации.',
  },
  '/services/leads': {
    title: 'Приём заявок в любые каналы – Илья Арьков',
    description: 'Автоматическая доставка заявок с сайта в Telegram, CRM, Google Таблицы или на почту.',
  },
  '/services/automation': {
    title: 'Автоматизация бизнес-процессов – Илья Арьков',
    description: 'Интеграция сайта с базами данных, рассылками и бизнес-сервисами для сокращения рутины.',
  },
  '/services/payments': {
    title: 'Подключение онлайн-оплаты – Илья Арьков',
    description: 'Интеграция платёжных систем, интернет-эквайринга, СБП и автоматической фискализации.',
  },
  '/services/ai-assistants': {
    title: 'AI-чатботы и ассистенты – Илья Арьков',
    description: 'Умные ассистенты для консультации клиентов, обработки заявок и ответов по базе знаний.',
  },
};

export function seoMeta(path: string): MetaDescriptor[] {
  const seo = ROUTE_SEO[path] ?? ROUTE_SEO['/'];
  const url = `${SITE_URL}${path}`;
  const image = `${SITE_URL}${seo.ogImage ?? DEFAULT_IMAGE}`;

  return [
    { title: seo.title },
    { name: 'description', content: seo.description },
    { property: 'og:title', content: seo.title },
    { property: 'og:description', content: seo.description },
    { property: 'og:url', content: url },
    { property: 'og:image', content: image },
    { property: 'og:image:alt', content: seo.title },
    { property: 'og:image:type', content: seo.ogImage ? 'image/webp' : 'image/png' },
    ...(seo.ogImage ? [] : [
      { property: 'og:image:width', content: '1249' },
      { property: 'og:image:height', content: '768' },
    ]),
    { name: 'twitter:title', content: seo.title },
    { name: 'twitter:description', content: seo.description },
    { name: 'twitter:image', content: image },
    { tagName: 'link', rel: 'canonical', href: url },
  ];
}

export function notFoundMeta(): MetaDescriptor[] {
  return [
    { title: 'Страница не найдена – Илья Арьков' },
    { name: 'description', content: 'Запрошенная страница не найдена.' },
    { name: 'robots', content: 'noindex, nofollow' },
  ];
}
