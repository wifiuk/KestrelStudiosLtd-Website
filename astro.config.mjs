import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

const site = process.env.SITE_URL || process.env.PUBLIC_SITE_URL || 'https://www.kestrelstudios.uk';

export default defineConfig({
  site,
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
  output: 'static',
});
