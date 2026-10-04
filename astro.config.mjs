import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  // Placeholder origin. Change this to the real domain before the site goes live:
  // canonical, Open Graph and sitemap URLs are all built from it.
  site: 'https://sandbox.example.com',
  integrations: [sitemap()],
});
