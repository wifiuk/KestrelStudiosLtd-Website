/**
 * Checks generated production HTML for SEO and AI-search discovery basics.
 *
 * Usage:
 *   npm run build
 *   npm run check:seo
 */
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const dist = new URL('../dist/', import.meta.url);

const read = (path) => {
  const filePath = join(dist.pathname, path);
  if (!existsSync(filePath)) {
    throw new Error(`Expected generated file: dist/${path}`);
  }
  return readFileSync(filePath, 'utf8');
};

const expectIncludes = (content, needle, label) => {
  if (!content.includes(needle)) {
    throw new Error(`Missing ${label}: ${needle}`);
  }
};

const pages = [
  ['index.html', 'home page'],
  ['about/index.html', 'about page'],
  ['quote/index.html', 'quote page'],
  ['services/property-photography-video/index.html', 'service page'],
];

for (const [path, label] of pages) {
  const html = read(path);
  expectIncludes(html, '<link rel="canonical"', `${label} canonical URL`);
  expectIncludes(html, '<meta property="og:title"', `${label} Open Graph title`);
  expectIncludes(html, '<meta name="twitter:card"', `${label} Twitter card`);
  expectIncludes(html, 'application/ld+json', `${label} JSON-LD`);
}

const robots = read('robots.txt');
expectIncludes(robots, 'User-agent: OAI-SearchBot', 'OpenAI search crawler rule');
expectIncludes(robots, 'Sitemap:', 'sitemap declaration');

read('sitemap-index.xml');

const about = read('about/index.html');
expectIncludes(about, '/dji-mini-5-pro-blueprint.png', 'about page blueprint image');

const modelPage = read('services/3d-site-models-measurements/index.html');
if (modelPage.includes('TO-DO') || modelPage.includes('Interactive 3D model viewer')) {
  throw new Error('3D service page still contains the placeholder model section');
}

console.log('SEO checks passed');
