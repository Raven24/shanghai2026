import { defineConfig } from 'astro/config';
import remarkHashtags from './src/plugins/remark-hashtags.mjs';

export default defineConfig({
  // Site URL for RSS and canonical links
  site: 'https://example.com/',
  
  // Markdown configuration
  markdown: {
    remarkPlugins: [remarkHashtags],
  },
  
  // Image optimization
  image: {
    service: {
      entrypoint: 'astro/assets/services/sharp',
    },
  },
  
  // Internationalization
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },
});
