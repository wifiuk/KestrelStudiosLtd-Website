import type { APIRoute } from 'astro';

const getRobotsTxt = (site: URL) => `User-agent: *
Allow: /

User-agent: OAI-SearchBot
Allow: /

User-agent: ChatGPT-User
Allow: /

Sitemap: ${new URL('sitemap-index.xml', site).href}
`;

export const GET: APIRoute = ({ site }) => {
  const siteUrl = site ?? new URL('https://www.kestrelstudios.uk');

  return new Response(getRobotsTxt(siteUrl), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
};
