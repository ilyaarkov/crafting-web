export interface ServiceDetail {
  id: string;
  category: 'web' | 'automation';
  badge: { ru: string; en: string };
  title: { ru: string; en: string };
  subtitle: { ru: string; en: string };
  duration: { ru: string; en: string };
  fullDescription: { ru: string[]; en: string[] };
  targetAudience: { ru: string[]; en: string[] };
  scope: { ru: string[]; en: string[] };
  advantages: { ru: string[]; en: string[] };
  technologies: string[];
  casesPlaceholder: {
    title: { ru: string; en: string };
    description: { ru: string; en: string };
  };
}

export const SERVICES_DATA: Record<string, ServiceDetail> = {
  'landing-page': {
    id: 'landing-page',
    category: 'web',
    badge: {
      ru: 'Веб-разработка · Одностраничные сайты',
      en: 'Web Development · Landing Pages',
    },
    title: {
      ru: 'Landing page под ключ',
      en: 'High-Converting Landing Pages',
    },
    subtitle: {
      ru: 'Конверсионный одностраничный сайт для презентации одного продукта, услуги, эксперта или запуска маркетинговой кампании.',
      en: 'Conversion-focused single page websites designed to showcase a single product, service, expert, or campaign.',
    },
    duration: {
      ru: 'от 5 до 8 рабочих дней',
      en: 'from 5 to 8 business days',
    },
    fullDescription: {
      ru: [
        'Landing page (лендинг) – это точечный инструмент интернет-маркетинга. В отличие от многостраничных порталов, лендинг ведет посетителя по строго выверенному сценарию: от первого интереса до целевого действия (заявки, звонка или покупки).',
        'Я разрабатываю посадочные страницы без использования тяжелых конструкторов, перегружающих браузер. Чистый код на React / Next.js гарантирует моментальную загрузку, идеальное отображение на смартфонах и высокую конверсию рекламного трафика.',
      ],
      en: [
        'A landing page is a precision marketing tool. Unlike cluttered multi-page websites, it guides visitors along a focused path from initial curiosity to conversion.',
        'I build landing pages with clean, modern code rather than bloated website builders. This ensures sub-second load times, flawless mobile responsiveness, and higher ad conversion rates.',
      ],
    },
    targetAudience: {
      ru: [
        'Эксперты, тренеры, консультанты и юристы для презентации своих услуг',
        'Малый и средний бизнес при запуске нового продукта или спецпредложения',
        'Стартапы для быстрого тестирования спроса и сбора первых лидов',
        'Организаторы мероприятий, курсов, мастер-классов и вебинаров',
      ],
      en: [
        'Specialists, consultants, and coaches promoting specific services',
        'Small businesses launching new offers or seasonal promotions',
        'Startups validating market interest and capturing initial pre-orders',
        'Event hosts, course creators, and webinar organizers',
      ],
    },
    scope: {
      ru: [
        'Проработка структуры, продающей логики и текстовых блоков',
        'Адаптивный дизайн для мобильных, планшетов и широкоформатных экранов',
        'Чистая верстка с плавной микроанимацией и интерактивными элементами',
        'Формы захвата с моментальной отправкой заявок в Telegram, CRM или на почту',
        'Базовая SEO-оптимизация, настройка OpenGraph для красивого шаринга в соцсетях',
        'Подключение систем аналитики (Яндекс.Метрика, Google Analytics)',
      ],
      en: [
        'Strategic conversion structure and messaging architecture',
        'Responsive layout tuned for smartphones, tablets, and desktops',
        'Clean, performant frontend code with tasteful micro-interactions',
        'Lead capture forms connected directly to Telegram, CRM, or email',
        'Foundational SEO and OpenGraph metadata for social sharing cards',
        'Integration of web analytics (Google Analytics, Yandex Metrika)',
      ],
    },
    advantages: {
      ru: [
        'Быстрый запуск без затягивания сроков',
        'Максимальная скорость загрузки (95+ баллов в Google PageSpeed)',
        'Отсутствие лишних посредников – прямое общение с разработчиком',
        'Полная независимость от абонентской платы конструкторов сайтов',
      ],
      en: [
        'Fast turnaround without unnecessary agency delays',
        'Maximum loading speed (95+ score on Google PageSpeed Insights)',
        'Direct communication with the engineer without account managers',
        'Zero recurring platform fees compared to website builders',
      ],
    },
    technologies: ['React', 'TypeScript', 'Tailwind CSS', 'Vite', 'Framer Motion', 'Telegram API'],
    casesPlaceholder: {
      title: {
        ru: 'Примеры реализованных лендингов',
        en: 'Landing Page Case Studies',
      },
      description: {
        ru: 'Раздел находится в подготовке. В ближайшее время здесь появятся подробные кейсы с метриками и интерактивными макетами. Напишите мне в личные сообщения, и я с радостью отправлю подборку релевантных работ под вашу нишу.',
        en: 'Case studies for this category are being prepared with detailed metrics and screen mockups. Contact me directly and I will gladly share relevant examples tailored to your industry.',
      },
    },
  },

  corporate: {
    id: 'corporate',
    category: 'web',
    badge: {
      ru: 'Веб-разработка · Бизнес и компании',
      en: 'Web Development · Corporate Sites',
    },
    title: {
      ru: 'Корпоративные сайты',
      en: 'Corporate & Company Websites',
    },
    subtitle: {
      ru: 'Многостраничные представительские ресурсы для формирования доверия, подробного раскрытия услуг и укрепления позиций бренда.',
      en: 'Multi-page representative digital portals designed to build trust, showcase services, and elevate brand authority.',
    },
    duration: {
      ru: 'от 10 до 18 рабочих дней',
      en: 'from 10 to 18 business days',
    },
    fullDescription: {
      ru: [
        'Корпоративный сайт – это цифровое лицо компании. Он решает одновременно несколько задач: формирует репутацию надежного партнера, дает исчерпывающую информацию о направлениях работы, прайс-листах, команде и лицензиях, а также привлекает органический поисковый трафик.',
        'Я проектирую архитектуру корпоративных сайтов с учетом масштабируемости: вы сможете легко добавлять новые разделы, публикации в блог или карточки услуг в будущем.',
      ],
      en: [
        'A corporate website serves as your digital headquarters. It establishes brand credibility, delivers in-depth service information, and captures long-term organic search traffic.',
        'I build scalable architectures that let your website grow alongside your business, enabling easy addition of new service branches, team members, or articles.',
      ],
    },
    targetAudience: {
      ru: [
        'Производственные, торговые и сервисные предприятия',
        'Юридические, консалтинговые и финансовые агентства',
        'Медицинские центры, клиники и архитектурные бюро',
        'Компании, переросшие простой одностраничник и нуждающиеся в глубокой презентации',
      ],
      en: [
        'B2B firms, industrial suppliers, and service organizations',
        'Legal practices, financial advisors, and consulting agencies',
        'Medical clinics, educational institutes, and architectural studios',
        'Growing businesses looking to replace simple landing pages with structured portals',
      ],
    },
    scope: {
      ru: [
        'Проработка структуры разделов (О компании, Услуги, Портфолио/Кейсы, Блог, Контакты)',
        'Единый дизайн-код, подчеркивающий фирменный стиль и статус бизнеса',
        'Интерактивные элементы: фильтры услуг, калькуляторы стоимости, FAQ-аккордеоны',
        'Полная внутренняя SEO-оптимизация (метатеги, семантический HTML5, карта сайта)',
        'Удобная интеграция с корпоративной почтой, CRM и телефонией',
      ],
      en: [
        'Comprehensive multi-page architecture (About, Services, Case Studies, Contacts)',
        'Cohesive visual identity reflecting corporate values and industry standing',
        'Interactive widgets: service filters, cost estimators, and expandable FAQ modules',
        'Complete on-page SEO setup (meta tags, semantic markup, XML sitemap)',
        'Seamless integration with corporate mail servers, telephony, and CRM',
      ],
    },
    advantages: {
      ru: [
        'Повышение доверия крупных клиентов и корпоративных заказчиков',
        'Основа для долгосрочного органического продвижения в Яндекс и Google',
        'Высокая отказоустойчивость и безопасность',
        'Возможность расширения функционала под любые корпоративные нужды',
      ],
      en: [
        'Strengthened authority with high-value clients and enterprise partners',
        'Solid foundation for sustainable long-term organic search visibility',
        'Robust stability, enterprise-grade security, and fast CDN delivery',
        'Modular flexibility ready for future integrations and expansions',
      ],
    },
    technologies: ['React', 'TypeScript', 'Tailwind CSS', 'Vite', 'Node.js', 'PostgreSQL / Supabase'],
    casesPlaceholder: {
      title: {
        ru: 'Кейсы корпоративных сайтов',
        en: 'Corporate Website Projects',
      },
      description: {
        ru: 'В настоящее время оформляется подборка завершенных проектов для компаний. Если вам требуется оценить качество верстки и архитектуры на реальных примерах, напишите мне – пришлю ссылки на действующие ресурсы.',
        en: 'A showcase of delivered corporate projects is being prepared. If you would like to evaluate live examples, feel free to reach out directly.',
      },
    },
  },

  ecommerce: {
    id: 'ecommerce',
    category: 'web',
    badge: {
      ru: 'Веб-разработка · Электронная коммерция',
      en: 'Web Development · E-Commerce',
    },
    title: {
      ru: 'Интернет-магазины и каталоги',
      en: 'Online Stores & Catalogs',
    },
    subtitle: {
      ru: 'Удобные современные витрины товаров с продуманной фильтрацией, корзиной, приемом оплат и синхронизацией остатков.',
      en: 'Modern digital storefronts with intuitive product filters, shopping carts, checkout, and inventory tracking.',
    },
    duration: {
      ru: 'от 12 до 25 рабочих дней',
      en: 'from 12 to 25 business days',
    },
    fullDescription: {
      ru: [
        'Современный интернет-магазин должен быть простым для покупателя и удобным для владельца. Никаких медленно открывающихся страниц, запутанных шагов оформления заказа или сбоев при оплате.',
        'Я создаю быстрые витрины и каталоги продукции, оптимизированные под мобильные устройства, где покупатель за пару кликов находит нужную позицию, добавляет в корзину и моментально оплачивает.',
      ],
      en: [
        'An online storefront must be effortless for customers and simple to operate for owners. Sub-second browsing and a zero-friction checkout flow are essential.',
        'I develop streamlined e-commerce solutions focused on mobile shoppers, enabling users to discover products, filter by attributes, and complete purchases in seconds.',
      ],
    },
    targetAudience: {
      ru: [
        'Локальные бренды одежды, косметики, мебели и аксессуаров',
        'Мастерские, производители авторской продукции и крафтовые проекты',
        'Оптовые поставщики и дистрибьюторы с необходимостью онлайн-каталога',
        'Розничные магазины, выходящие в интернет без переплаты за тяжелые CMS',
      ],
      en: [
        'Direct-to-consumer lifestyle brands, apparel, and home goods',
        'Artisans, craft workshops, and boutique manufacturers',
        'B2B suppliers and wholesalers needing an organized digital catalog',
        'Retail shops expanding online without heavy, expensive enterprise platforms',
      ],
    },
    scope: {
      ru: [
        'Каталог с умной фильтрацией по категориям, ценам и характеристикам',
        'Информативные карточки товаров с галереей фото, описанием и модификациями',
        'Плавная корзина с сохранением позиций при перезагрузке страницы',
        'Быстрое оформление заказа в 1 шаг без обязательной сложной регистрации',
        'Подключение интернет-эквайринга (банковские карты, СБП, электронные чеки)',
        'Уведомления о новых заказах администратору в Telegram и на почту',
      ],
      en: [
        'Product catalog with dynamic filtering by category, price, and specs',
        'Rich product detail views with multi-photo carousels and attribute selectors',
        'Persistent cart that remembers items across sessions',
        'Streamlined 1-step checkout without forced account registration',
        'Online payment integration (Credit cards, Apple Pay / Google Pay, instant receipts)',
        'Instant order notifications sent straight to your phone via Telegram and email',
      ],
    },
    advantages: {
      ru: [
        'Моментальный отклик интерфейса без задержек при смене фильтров',
        'Высокая мобильная конверсия благодаря продуманному UX корзины',
        'Простая панель управления или синхронизация через Google Таблицы / МойСклад',
        'Надежная безопасность персональных данных и платежей',
      ],
      en: [
        'Instant filter and search response without full page reloads',
        'High mobile checkout completion rates thanks to frictionless UX',
        'Straightforward product management via admin UI or Google Sheets sync',
        'Bank-grade security standards for customer data and payments',
      ],
    },
    technologies: ['React', 'TypeScript', 'Tailwind CSS', 'Vite', 'Stripe / CloudPayments / ЮKassa', 'Supabase'],
    casesPlaceholder: {
      title: {
        ru: 'Кейсы интернет-магазинов и каталогов',
        en: 'E-Commerce Storefront Examples',
      },
      description: {
        ru: 'Примеры интернет-магазинов готовятся к публикации. Если вы планируете запуск каталога или продажи товаров, напишите мне – обсудим вашу товарную матрицу и покажем прототип интерфейса.',
        en: 'Case studies for e-commerce websites are in preparation. Get in touch to discuss your catalog needs and explore interactive interface prototypes.',
      },
    },
  },

  mvp: {
    id: 'mvp',
    category: 'web',
    badge: {
      ru: 'Веб-разработка · Стартапы и быстрый старт',
      en: 'Web Development · MVP & Validation',
    },
    title: {
      ru: 'Доступные MVP-проекты',
      en: 'Affordable MVP Projects',
    },
    subtitle: {
      ru: 'Быстрый и бюджетный запуск первой рабочей версии сайта или веб-сервиса для проверки гипотез и привлечения первых клиентов.',
      en: 'Fast and budget-friendly launch of a functioning minimum viable product to test market ideas and capture first paying users.',
    },
    duration: {
      ru: 'от 4 до 7 рабочих дней',
      en: 'from 4 to 7 business days',
    },
    fullDescription: {
      ru: [
        'Главная ошибка начинающих предпринимателей – тратить месяцы и сотни тысяч рублей на разработку идеального продукта до того, как проверен реальный спрос.',
        'MVP (Minimum Viable Product) решает эту проблему: мы собираем ключевой функционал, достаточный для презентации ценности, привлечения первой аудитории и проверки бизнес-гипотез с минимальными вложениями.',
      ],
      en: [
        'Spending months and thousands of dollars perfecting an untested product before real customer feedback is a common pitfall.',
        'An MVP addresses this directly: we build the core functionality needed to demonstrate value, capture early adopters, and validate unit economics with minimal budget.',
      ],
    },
    targetAudience: {
      ru: [
        'Основатели стартапов, готовящиеся к демонстрации инвесторам или акселераторам',
        'Предприниматели, тестирующие новую бизнес-нишу или продукт',
        'Авторы цифровых продуктов, курсов или сервисов по подписке',
      ],
      en: [
        'Early-stage startup founders preparing prototypes for investor pitches',
        'Entrepreneurs testing a new niche or service offering',
        'Creators building micro-SaaS, newsletters, or digital subscription models',
      ],
    },
    scope: {
      ru: [
        'Выделение ключевой ценности и отсечение вторичных функций для экономии бюджета',
        'Лаконичный, современный веб-интерфейс с упором на сбор обратной связи и лидов',
        'Интеграция ключевых сервисов: сбор контактов, демонстрация демо, форма оплаты',
        'Быстрый деплой и подключение собственного домена',
      ],
      en: [
        'Feature scoping focused exclusively on high-impact user actions',
        'Sleek, modern web interface optimized for feedback and pre-orders',
        'Core integrations: email collection, interactive demo, and checkout flow',
        'Instant deployment to fast CDN with custom domain setup',
      ],
    },
    advantages: {
      ru: [
        'Запуск за считанные дни вместо месяцев ожидания',
        'Минимальный финансовый риск при проверке гипотезы',
        'Чистая архитектура, готовая к масштабированию в полноценный сервис',
      ],
      en: [
        'Launch in a matter of days instead of endless development cycles',
        'Minimal upfront financial exposure',
        'Clean, robust codebase ready to scale into a mature application',
      ],
    },
    technologies: ['React', 'TypeScript', 'Tailwind CSS', 'Vite', 'Firebase / Supabase', 'Telegram Bot API'],
    casesPlaceholder: {
      title: {
        ru: 'Кейсы MVP-проектов',
        en: 'MVP Launch Projects',
      },
      description: {
        ru: 'Кейсы по запуску MVP оформляются для открытого доступа. Если у вас есть идея стартапа или сервиса – напишите мне, мы оценим реалистичные сроки и подберем самый экономный стек для проверки гипотезы.',
        en: 'MVP launch case studies will be posted shortly. Share your idea today to evaluate timelines and determine the leanest path to market validation.',
      },
    },
  },

  expert: {
    id: 'expert',
    category: 'web',
    badge: {
      ru: 'Веб-разработка · Личный бренд',
      en: 'Web Development · Personal Brands',
    },
    title: {
      ru: 'Сайты для экспертов и мастеров',
      en: 'Websites for Experts & Craftsmen',
    },
    subtitle: {
      ru: 'Персональные сайты специалистов с портфолио, прайс-листом, кейсами, отзывами и удобной записью на консультации.',
      en: 'Bespoke personal brand websites showcasing services, past projects, transparent pricing, and direct booking.',
    },
    duration: {
      ru: 'от 5 до 10 рабочих дней',
      en: 'from 5 to 10 business days',
    },
    fullDescription: {
      ru: [
        'Вместо того чтобы отправлять клиентам длинные текстовые сообщения в мессенджерах, PDF-файлы или ссылки на разрозненные соцсети, отправьте одну стильную ссылку на ваш персональный сайт.',
        'Персональный сайт позиционирует вас как востребованного профессионала, снимает возражения клиентов еще до созвона, наглядно показывает ваши кейсы и позволяет записаться в один клик.',
      ],
      en: [
        'Instead of sending prospective clients lengthy chat messages, PDF attachments, or fragmented social links, you can simply share one polished personal URL.',
        'A dedicated personal website establishes you as a sought-after authority, answers common questions upfront, and makes booking effortless.',
      ],
    },
    targetAudience: {
      ru: [
        'Частные специалисты: психологи, юристы, дизайнеры, фотографы, репетиторы',
        'Мастера своего дела и ремесленники с уникальными услугами',
        'Бизнес-консультанты, менторы, коучи и спикеры',
        'Разработчики, маркетологи и копирайтеры, строящие сильный личный бренд',
      ],
      en: [
        'Independent professionals: therapists, legal consultants, designers, photographers',
        'Artisans, craftsmen, and specialty service providers',
        'Business advisors, executive coaches, and public speakers',
        'Tech specialists and creatives seeking premium client projects',
      ],
    },
    scope: {
      ru: [
        'Сильный первый экран с позиционированием и акцентом на вашу уникальность',
        'Блок "Обо мне" с историей, подходом к работе и подтверждением квалификации',
        'Наглядное интерактивное портфолио с фотографиями и описанием выполненных работ',
        'Прозрачный прайс-лист с понятными тарифами и ответами на частые вопросы',
        'Кнопки моментальной связи через Telegram, WhatsApp или форму заявки',
      ],
      en: [
        'Impactful hero fold highlighting your unique value proposition',
        'Story-driven "About" section establishing authentic credibility',
        'Interactive portfolio gallery detailing results and client testimonials',
        'Transparent service packages with clear scope and FAQ breakdown',
        'Instant direct booking buttons for Telegram, WhatsApp, or contact forms',
      ],
    },
    advantages: {
      ru: [
        'Рост среднего чека за счет презентабельного позиционирования',
        'Экономия времени на консультациях и ответах на типовые вопросы',
        'Полная независимость от блокировок и алгоритмов соцсетей',
      ],
      en: [
        'Command higher rates through elevated positioning and polished craft',
        'Save hours each week answering repetitive preliminary questions',
        'Own your audience independently of third-party social algorithms',
      ],
    },
    technologies: ['React', 'TypeScript', 'Tailwind CSS', 'Vite', 'Lucide Icons', 'Telegram API'],
    casesPlaceholder: {
      title: {
        ru: 'Кейсы сайтов для специалистов',
        en: 'Expert Portfolio Examples',
      },
      description: {
        ru: 'Раздел находится в подготовке. Вскоре здесь появятся реальные сайты экспертов с отзывами и результатами внедрения. Свяжитесь со мной – покажу примеры и обсудим структуру под вашу специфику.',
        en: 'Examples in this category are being prepared for public display. Contact me to view live specialist websites and discuss tailored layouts for your craft.',
      },
    },
  },

  leads: {
    id: 'leads',
    category: 'automation',
    badge: {
      ru: 'Автоматизация · Лидогенерация',
      en: 'Automation · Lead Routing',
    },
    title: {
      ru: 'Приём заявок в любые каналы',
      en: 'Multi-Channel Lead Capture & Routing',
    },
    subtitle: {
      ru: 'Моментальная доставка данных из форм сайта в Telegram, WhatsApp, CRM-системы, Google Таблицы или на почту.',
      en: 'Instant routing of incoming website inquiries to Telegram, CRM pipelines, Google Sheets, or email without dropped leads.',
    },
    duration: {
      ru: 'от 1 до 3 рабочих дней',
      en: 'from 1 to 3 business days',
    },
    fullDescription: {
      ru: [
        'Каждая секунда задержки после того, как клиент заполнил форму на сайте, снижает вероятность успешной сделки. Если заявка теряется в спаме почты или пылится в админке, бизнес теряет деньги.',
        'Я настраиваю надежные, безотказные шлюзы: как только клиент нажимает "Отправить", вам в Telegram или CRM моментально прилетает красиво оформленное уведомление со всеми данными.',
      ],
      en: [
        'Every minute of delay after a potential customer submits a form cuts conversion probabilities drastically. Lost or delayed inquiries mean lost revenue.',
        'I build bulletproof integrations: the second a client hits submit, a cleanly formatted alert lands instantly on your smartphone in Telegram or straight into your CRM.',
      ],
    },
    targetAudience: {
      ru: [
        'Любой бизнес, получающий заявки через сайт или лендинг',
        'Команды продаж, которым критически важно реагировать на лид в течение 2 минут',
        'Индивидуальные предприниматели, управляющие заказами с телефона',
      ],
      en: [
        'Any business collecting inquiries through landing pages or web forms',
        'Sales teams requiring sub-5-minute lead response times',
        'Solo practitioners who manage operations directly from their smartphone',
      ],
    },
    scope: {
      ru: [
        'Интеграция с Telegram Bot API: структурированные карточки заявок со ссылками на клиента',
        'Запись каждой заявки в Google Таблицы в качестве резервной базы клиентов',
        'Подключение к CRM (amoCRM, Bitrix24, Notion, HubSpot)',
        'Защита форм от спама и ботов без раздражающей капчи',
        'Автоматические подтверждения клиенту по Email или в мессенджер',
      ],
      en: [
        'Telegram Bot API integration with rich formatted messages and direct contact links',
        'Automated real-time logging into Google Sheets as a redundant backup ledger',
        'Bi-directional sync with CRM systems (amoCRM, Bitrix24, HubSpot, Notion)',
        'Invisible anti-spam and bot protection without intrusive CAPTCHAs',
        'Automated confirmation email or SMS sent back to the customer',
      ],
    },
    advantages: {
      ru: [
        'Ни одна заявка не потеряется даже при сбое одного из сервисов',
        'Моментальная реакция на входящий интерес клиента',
        'Полная прозрачность и удобная аналитика источников лидов',
      ],
      en: [
        'Zero dropped leads thanks to fallback queues and redundant endpoints',
        'Sub-minute response capabilities directly from mobile notifications',
        'Clear tracking of source UTM parameters and customer context',
      ],
    },
    technologies: ['Telegram Bot API', 'Node.js', 'Google Sheets API', 'Webhooks', 'REST API'],
    casesPlaceholder: {
      title: {
        ru: 'Кейсы интеграции приёма заявок',
        en: 'Lead Integration Case Studies',
      },
      description: {
        ru: 'Раздел с разборами интеграций наполняется материалами. Хотите автоматизировать сбор заявок в вашем проекте уже сегодня? Напишите мне, и мы настроим связку за 1-2 дня.',
        en: 'Case notes for lead routing solutions are being organized. Want to streamline your lead capture workflow today? Reach out and we can set it up in 1-2 days.',
      },
    },
  },

  automation: {
    id: 'automation',
    category: 'automation',
    badge: {
      ru: 'Автоматизация · Бизнес-процессы',
      en: 'Automation · Workflow Systems',
    },
    title: {
      ru: 'Автоматизация бизнес-процессов',
      en: 'Business Workflow Automation',
    },
    subtitle: {
      ru: 'Связка сайта с базами данных, сервисами рассылок, складскими программами и таблицами для избавления от рутины.',
      en: 'Connecting web platforms with databases, email engines, inventory tools, and spreadsheets to eliminate manual busywork.',
    },
    duration: {
      ru: 'от 3 до 10 рабочих дней',
      en: 'from 3 to 10 business days',
    },
    fullDescription: {
      ru: [
        'Ручной перенос данных из одного сервиса в другой, отправка однотипных писем, ручная выгрузка отчетов – все это отнимает часы рабочего времени и приводит к неизбежным человеческим ошибкам.',
        'Я создаю незаметную, но мощную цифровую инфраструктуру: ваши программы и сервисы начинают обмениваться данными автоматически по заданным правилам без участия человека.',
      ],
      en: [
        'Manually retyping customer records between apps, drafting identical emails, or compiling recurring reports drains valuable company time and invites human error.',
        'I build automated background pipelines that keep your tools, databases, and third-party SaaS applications in continuous, reliable sync without human intervention.',
      ],
    },
    targetAudience: {
      ru: [
        'Сервисные компании с повторяющимися цепочками действий при заказе',
        'Онлайн-школы и авторы курсов (выдача доступов, напоминания, продления)',
        'Интернет-магазины с потребностью в синхронизации цен и складских остатков',
      ],
      en: [
        'Service companies managing multi-step customer onboarding sequences',
        'Online academies handling course enrollment, access keys, and reminders',
        'E-commerce businesses synchronizing catalog pricing and stock levels',
      ],
    },
    scope: {
      ru: [
        'Анализ текущих узких мест и рутинных операций в вашем бизнесе',
        'Настройка надежных интеграций через Webhook и REST API',
        'Автоматическая генерация счетов, актов и договоров в формате PDF',
        'Синхронизация баз данных клиентов и истории взаимодействий',
      ],
      en: [
        'Detailed audit of operational bottlenecks and repetitive workflows',
        'Engineering dependable webhook event triggers and custom API connectors',
        'Automated generation of PDF invoices, service agreements, and receipts',
        'Centralized data synchronization across operational tools',
      ],
    },
    advantages: {
      ru: [
        'Экономия до 20+ часов рабочего времени в неделю',
        'Полное исключение ошибок человеческого фактора',
        'Система работает круглосуточно 24/7 без отпусков и больничных',
      ],
      en: [
        'Reclaim 20+ hours of team productivity each week',
        'Eradicate transcription and copy-paste errors across systems',
        'Runs reliably 24/7/365 in the background with automated health alerts',
      ],
    },
    technologies: ['Node.js', 'Express', 'Webhooks', 'Make / n8n', 'PostgreSQL', 'Google Cloud'],
    casesPlaceholder: {
      title: {
        ru: 'Кейсы автоматизации процессов',
        en: 'Workflow Automation Cases',
      },
      description: {
        ru: 'Раздел находится в подготовке. Мы готовим наглядные схемы и результаты внедрения автоматизаций для действующих клиентов. Опишите вашу рутинную задачу, и я предложу готовый алгоритм решения.',
        en: 'Visual diagrams and efficiency metrics from recent workflow automations are being prepared. Describe your manual routine and I will provide an automated solution blueprint.',
      },
    },
  },

  payments: {
    id: 'payments',
    category: 'automation',
    badge: {
      ru: 'Автоматизация · Эквайринг и финансы',
      en: 'Automation · Online Payments',
    },
    title: {
      ru: 'Подключение онлайн-оплаты',
      en: 'Payment Gateway Integration',
    },
    subtitle: {
      ru: 'Интеграция платёжных систем, банковского интернет-эквайринга, СБП и автоматической фискализации чеков (54-ФЗ).',
      en: 'Integration of modern payment providers, credit card processing, digital wallets, and automated receipts compliance.',
    },
    duration: {
      ru: 'от 2 до 5 рабочих дней',
      en: 'from 2 to 5 business days',
    },
    fullDescription: {
      ru: [
        'Возможность оплатить услугу или товар прямо на сайте в момент принятия решения увеличивает конверсию в разы. Никаких переводов по номеру карты с ожиданием подтверждения.',
        'Я подключаю официальный интернет-эквайринг ведущих банков и платежных агрегаторов: клиенты оплачивают картами любых банков, через Систему быстрых платежей (СБП) или QR-код, а вам поступают средства с автоматическим формированием электронного чека.',
      ],
      en: [
        'Giving customers the ability to pay instantly at the peak of buying interest multiplies conversion rates. Manual wire transfers and confirmations cause abandoned sales.',
        'I integrate certified payment gateways enabling payments via credit cards, Apple Pay, Google Pay, or direct instant transfers, paired with automated legal receipt dispatch.',
      ],
    },
    targetAudience: {
      ru: [
        'Эксперты и консультанты, продающие консультации и цифровые продукты',
        'Интернет-магазины и сервисы доставки',
        'Платные сообщества и сервисы с регулярными рекуррентными платежами',
      ],
      en: [
        'Independent professionals selling consultations and digital products',
        'E-commerce brands and local delivery services',
        'Subscription-based memberships requiring reliable recurring billing',
      ],
    },
    scope: {
      ru: [
        'Помощь в выборе оптимального банка/агрегатора с минимальной комиссией',
        'Интеграция платёжного шлюза (ЮKassa, Тинькофф Эквайринг, Robokassa, Stripe)',
        'Поддержка оплаты через СБП по QR-коду и банковские карты',
        'Настройка фискализации и интеграции с онлайн-кассой (Атол Онлайн, МойСклад)',
        'Безопасная обработка вебхуков о статусе оплаты (успех, отмена, возврат)',
      ],
      en: [
        'Guidance on selecting the optimal payment provider with competitive processing fees',
        'Direct gateway API integration (Stripe, CloudPayments, Tinkoff, Robokassa)',
        'Support for instant QR payments, digital wallets, and international cards',
        'Setup of automated legal fiscal receipts and customer notification dispatches',
        'Secure server-side webhook handlers with idempotency and refund logging',
      ],
    },
    advantages: {
      ru: [
        'Деньги поступают прямо на ваш расчетный счет',
        'Полное соответствие законодательству и автоматическая фискализация чеков',
        'Мгновенный доступ клиента к продукту после успешного списания',
      ],
      en: [
        'Funds deposit straight into your corporate account with transparent fees',
        'Full regulatory compliance and automated receipt delivery',
        'Instant fulfillment and access unlocking upon confirmed transaction',
      ],
    },
    technologies: ['Stripe API', 'ЮKassa API', 'Tinkoff Acquiring', 'Webhooks', 'HMAC Signatures'],
    casesPlaceholder: {
      title: {
        ru: 'Кейсы интеграции эквайринга',
        en: 'Payment Integration Examples',
      },
      description: {
        ru: 'Кейсы по подключению платежных шлюзов оформляются. Если вам требуется быстро подключить эквайринг к вашему сайту или боту – напишите мне, помогу выбрать выгодный тариф и настрою всё под ключ.',
        en: 'Payment integration project breakdowns are being finalized. Need to add checkout to your site or Telegram bot? Contact me to get it configured cleanly.',
      },
    },
  },

  'ai-assistants': {
    id: 'ai-assistants',
    category: 'automation',
    badge: {
      ru: 'Автоматизация · Искусственный интеллект',
      en: 'Automation · AI Assistants',
    },
    title: {
      ru: 'AI-чатботы и ассистенты',
      en: 'AI Chatbots & Intelligent Assistants',
    },
    subtitle: {
      ru: 'Умные ассистенты на базе современных LLM для консультации клиентов, квалификации лидов и круглосуточных ответов по вашей базе знаний.',
      en: 'Intelligent assistants powered by state-of-the-art LLMs to answer inquiries, qualify leads, and assist clients 24/7.',
    },
    duration: {
      ru: 'от 5 до 12 рабочих дней',
      en: 'from 5 to 12 business days',
    },
    fullDescription: {
      ru: [
        'Обычные кнопочные чат-боты часто раздражают клиентов своей ограниченностью. AI-ассистенты нового поколения понимают живой язык, умеют вежливо и точно отвечать на сложные вопросы, используя исключительно материалы вашей компании.',
        'Ассистент работает 24/7: помогает посетителю выбрать нужную услугу, рассчитывает предварительную стоимость, отвечает на частые вопросы и передает горячего клиента в руки менеджера.',
      ],
      en: [
        'Rigid button-based chatbots often frustrate potential customers with dead ends. Modern AI assistants comprehend natural language and deliver articulate answers based strictly on your verified knowledge base.',
        'The assistant operates 24/7 without breaks: guiding prospects toward the right solution, estimating preliminary budgets, and passing qualified leads directly to you.',
      ],
    },
    targetAudience: {
      ru: [
        'Компании с большим потоком однотипных первичных вопросов от клиентов',
        'Интернет-магазины с обширным каталогом, где требуется помощь с подбором',
        'Службы клиентской поддержки и сервисные центры',
        'Эксперты и школы, желающие автоматизировать первую линию общения',
      ],
      en: [
        'Businesses receiving a high volume of repetitive pre-sale inquiries',
        'E-commerce catalogs where customers need personalized product recommendations',
        'Customer support desks seeking to resolve 70%+ of tickets automatically',
        'Coaches and academies looking to automate first-contact student questions',
      ],
    },
    scope: {
      ru: [
        'Формирование и загрузка структурированной базы знаний о вашей компании и услугах',
        'Разработка строгого системного промпта: бот не фантазирует и говорит строго по делу',
        'Встраивание виджета на сайт или создание отдельного Telegram-бота',
        'Автоматический сбор контактов клиента и передача менеджеру в Telegram / CRM',
        'Логирование диалогов для постоянного улучшения качества ответов',
      ],
      en: [
        'Curating and indexing your custom company knowledge base and pricing guides',
        'Engineering strict system prompts to prevent hallucinations and maintain tone',
        'Embedding an elegant web widget or deploying a high-speed Telegram bot',
        'Automated lead qualification and immediate handover to your sales team',
        'Session analytics to continuously monitor and refine response quality',
      ],
    },
    advantages: {
      ru: [
        'Круглосуточная обработка заявок даже ночью и в выходные дни',
        'Снижение нагрузки на сотрудников до 60-80%',
        'Вежливое, быстрое и точное обслуживание каждого клиента',
      ],
      en: [
        'Instant answers 24/7 including weekends and holidays',
        'Reduces routine support workload by 60% to 80%',
        'Polite, instant, and context-aware interactions for every visitor',
      ],
    },
    technologies: ['Gemini / OpenAI API', 'Node.js', 'Vector Embeddings', 'Telegram Bot API', 'React'],
    casesPlaceholder: {
      title: {
        ru: 'Кейсы внедрения AI-ассистентов',
        en: 'AI Assistant Case Studies',
      },
      description: {
        ru: 'Кейсы внедрения умных ассистентов готовятся к публикации. Хотите протестировать, как AI-консультант справится с вопросами ваших клиентов? Напишите мне, и мы соберем рабочий прототип под вашу базу знаний.',
        en: 'AI assistant implementation case studies are being prepared. Interested in testing how a custom assistant handles your business inquiries? Contact me for a proof-of-concept demonstration.',
      },
    },
  },
};
