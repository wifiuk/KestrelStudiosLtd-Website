export const siteName = 'Kestrel Studios';
export const defaultSiteUrl = 'https://www.kestrelstudios.uk';

export const siteDescription =
  'Professional drone photography, video, inspections, mapping and visual measurement services across Kent and beyond.';

export const serviceArea = [
  'Kent',
  'Sevenoaks',
  'Maidstone',
  'Tunbridge Wells',
  'Dartford',
  'Medway',
  'Canterbury',
  'The South East',
];

export const businessProfile = {
  '@type': 'ProfessionalService',
  '@id': `${defaultSiteUrl}/#business`,
  name: siteName,
  url: defaultSiteUrl,
  logo: `${defaultSiteUrl}/favicon.png`,
  image: `${defaultSiteUrl}/property_image1.webp`,
  description: siteDescription,
  areaServed: serviceArea.map((name) => ({
    '@type': 'Place',
    name,
  })),
  knowsAbout: [
    'Drone photography',
    'Aerial video',
    'Roof inspections',
    'Construction progress photography',
    'Aerial mapping',
    '3D site models',
    'Stockpile volume estimates',
  ],
};
