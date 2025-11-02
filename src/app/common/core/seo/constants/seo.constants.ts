import { MetaTags } from "../interfaces";

export const DEFAULT_META_TAGS: MetaTags = {
  title: 'تلبينة | Talbinah',
  description: 'Explore the best features of our project. Plan your journey today.',
  keywords: 'project, Angular, SEO, tourism',
  image: 'images/icons/logo-2.png',
  url: 'https://example.com',
  robots: 'index, follow',
  locale: 'en_US',
  canonical: 'https://example.com',
};

export const PAGE_SPECIFIC_META_TAGS = {
  home: {
    title: 'Home Page Title',
    description: 'Description for the home page.',
    keywords: 'home, angular, seo',
    url: 'https://example.com/home',
    canonical: 'https://example.com/home',
  },
  about: {
    title: 'About Us Title',
    description: 'Description for the about us page.',
    keywords: 'about, angular, seo',
    url: 'https://example.com/about',
    canonical: 'https://example.com/about',
  },
};
