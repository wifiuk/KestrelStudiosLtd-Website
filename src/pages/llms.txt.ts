import type { APIRoute } from 'astro';
import { services } from '../data/services';
import { siteDescription, siteName } from '../data/site';

export const GET: APIRoute = ({ site }) => {
  const siteUrl = site ?? new URL('https://www.kestrelstudios.uk');
  const url = (path: string) => new URL(path, siteUrl).href;

  const serviceLinks = services
    .map((service) => `- [${service.title}](${url(`/services/${service.slug}/`)}): ${service.shortDescription}`)
    .join('\n');

  const content = `# ${siteName}

${siteDescription}

## Core Pages

- [Home](${url('/')}): Overview of Kestrel Studios drone services, sectors served, process and quote route.
- [About](${url('/about/')}): Company approach, credentials, operating standards and service values.
- [Get a Quote](${url('/quote/')}): Quote request page for aerial photography, video, inspections, mapping and measurement work.

## Services

${serviceLinks}
`;

  return new Response(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
};
