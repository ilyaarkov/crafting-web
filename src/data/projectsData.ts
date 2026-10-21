export interface ProjectMeta {
  id: string;
  previewImage: string;
  screens: string[];
  mockupDomain: string;
}

export const PROJECTS_DATA: Record<string, ProjectMeta> = {
  'specialist-portfolio': {
    id: 'specialist-portfolio',
    previewImage: '/projects/portfolio.webp',
    screens: [
      '/projects/portfolio.webp',
      '/projects/portfolio-1.webp',
      '/projects/portfolio-2.webp',
      '/projects/portfolio-3.webp',
      '/projects/portfolio-4.webp',
    ],
    mockupDomain: 'portfolio.expert.ru',
  },
  'nonprofit-redesign': {
    id: 'nonprofit-redesign',
    previewImage: '/projects/nonprofit.webp',
    screens: [
      '/projects/nonprofit.webp',
      '/projects/nonprofit-1.webp',
      '/projects/nonprofit-2.webp',
      '/projects/nonprofit-3.webp',
    ],
    mockupDomain: 'charity-foundation.org',
  },
  'wine-coop': {
    id: 'wine-coop',
    previewImage: '/projects/intuitivo.webp',
    screens: [
      '/projects/intuitivo.webp',
      '/projects/intuitivo-1.webp',
      '/projects/intuitivo-2.webp',
      '/projects/intuitivo-3.webp',
      '/projects/intuitivo-4.webp',
      '/projects/intuitivo-5.webp',
    ],
    mockupDomain: 'intuitivo-wine.com',
  },
  'driving-center': {
    id: 'driving-center',
    previewImage: '/projects/driftet.webp',
    screens: [
      '/projects/driftet.webp',
      '/projects/driftet-1.webp',
      '/projects/driftet-2.webp',
      '/projects/driftet-3.webp',
      '/projects/driftet-4.webp',
      '/projects/driftet-5.webp',
    ],
    mockupDomain: 'driftet-safety.pro',
  },
};