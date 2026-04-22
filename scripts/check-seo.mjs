/**
 * Checks generated production HTML for SEO and AI-search discovery basics.
 *
 * Usage:
 *   npm run build
 *   npm run check:seo
 */
import { existsSync, readdirSync, readFileSync } from 'node:fs';
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

const collectHtmlFiles = (dir, prefix = '') => {
  const entries = readdirSync(join(dist.pathname, dir), { withFileTypes: true });
  return entries.flatMap((entry) => {
    const relative = join(prefix, entry.name);
    const childDir = join(dir, entry.name);

    if (entry.isDirectory()) {
      return collectHtmlFiles(childDir, relative);
    }

    return entry.name.endsWith('.html') ? [relative] : [];
  });
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

const modelPage = read('services/3d-site-models-measurements/index.html');
if (modelPage.includes('TO-DO') || modelPage.includes('Interactive 3D model viewer')) {
  throw new Error('3D service page still contains the placeholder model section');
}

const servicePage = read('services/property-photography-video/index.html');
expectIncludes(servicePage, 'What could you receive', 'conditional service FAQ wording');
if (servicePage.includes('What do you receive')) {
  throw new Error('Service FAQ wording still implies fixed deliverables');
}

const largeLegacyImages = [
  '/property_image1.png',
  '/property_image2.png',
  '/roof_1.png',
  '/roof_2.png',
  '/construction_1.png',
  '/construction_2.png',
  '/business_social_media_hero.png',
  '/business_social_media_section.png',
  '/land_mapping_2.png',
  '/rural_1.png',
  '/rural_2.png',
  '/tourism_destination_hero.png',
  '/tourism_destination_section.jpg',
  '/3d_automated_mapping.jpg',
  '/3d_mapping_measurements.png',
  '/stockpile_volume_hero.png',
  '/stockpile_volume_section.png',
  '/dji-mini-5-pro-blueprint.png',
];

for (const path of collectHtmlFiles('.')) {
  const html = read(path);
  for (const image of largeLegacyImages) {
    if (html.includes(image)) {
      throw new Error(`${path} still references unoptimised image ${image}`);
    }
  }
}

console.log('SEO checks passed');
