export interface ServiceInclude {
  title: string;
  description: string;
}

export interface ServiceAudience {
  name: string;
  detail: string;
}

export interface ServiceDeliverable {
  title: string;
  description: string;
  formats: string[];
}

export interface Service {
  title: string;
  slug: string;
  shortDescription: string;
  heroTitle: string;
  highlightWord: string;
  summary: string;
  icon: string;
  heroImage?: string;
  sectionImage?: string;
  includes: ServiceInclude[];
  audience: ServiceAudience[];
  deliverables: ServiceDeliverable[];
}

export const services: Service[] = [
  {
    title: 'Property Photography and Video',
    slug: 'property-photography-video',
    shortDescription: 'Aerial imagery and video for estate agents, developers and property marketing.',
    heroTitle: 'PROPERTY PHOTOGRAPHY AND VIDEO',
    highlightWord: 'PHOTOGRAPHY',
    summary: 'Aerial photography and video that helps estate agents, developers and property owners market listings, showcase developments and stand out from the competition.',
    icon: '<svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>',
    includes: [
      { title: 'Aerial Property Photos', description: 'High-resolution images from multiple angles showing the full property and its surroundings.' },
      { title: 'Listing Hero Shots', description: 'Standout lead images designed for use as the primary listing photo.' },
      { title: 'Exterior Showcase Video', description: 'Smooth, cinematic aerial video showcasing the property exterior and grounds.' },
      { title: 'Neighbourhood Context', description: 'Wider shots showing the surrounding area, access routes and local amenities.' },
      { title: 'Promotional Clips', description: 'Short-form video clips ready for use on listing sites, social media and websites.' },
      { title: 'Edited and Delivered', description: 'All imagery professionally processed and delivered in web and print-ready formats.' },
    ],
    audience: [
      { name: 'Estate Agents', detail: 'Elevate your listings with standout aerial imagery.' },
      { name: 'Property Developers', detail: 'Showcase developments from planning through to completion.' },
      { name: 'Holiday Lets and Airbnb', detail: 'Create visuals that drive bookings.' },
      { name: 'Homeowners', detail: 'Aerial visuals for selling or marketing your property.' },
      { name: 'Commercial Property', detail: 'Professional imagery for offices, retail and industrial units.' },
    ],
    deliverables: [
      { title: 'High-Resolution Aerial Stills', description: 'Multiple angles, professionally edited, ready for listings, brochures and web use.', formats: ['JPEG', 'PNG'] },
      { title: 'Showcase Video', description: 'Smooth cinematic aerial footage, edited with transitions and optional branding.', formats: ['MP4', '4K'] },
      { title: 'Social-Ready Clips', description: 'Short-form vertical and square cuts optimised for Instagram, TikTok and Facebook.', formats: ['Reel', 'Story'] },
      { title: 'Raw Files (Optional)', description: 'Unedited original files available on request for clients with in-house editing teams.', formats: ['DNG', 'MOV'] },
    ],
  },
  {
    title: 'Roof, Exterior and Storm Damage Inspections',
    slug: 'roof-exterior-storm-damage-inspections',
    shortDescription: 'Visual inspection and evidence capture for roofs, exteriors and storm damage.',
    heroTitle: 'ROOF, EXTERIOR AND STORM DAMAGE INSPECTIONS',
    highlightWord: 'INSPECTIONS',
    summary: 'High-resolution aerial imagery and video for visual roof inspections, exterior assessments and storm damage evidence capture — without scaffolding or ladders.',
    icon: '<svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>',
    heroImage: '/roof_1.png',
    sectionImage: '/roof_2.png',
    includes: [
      { title: 'Roof Imagery', description: 'Detailed aerial photos of roof surfaces, ridgelines and flashing from multiple angles.' },
      { title: 'Gutter and Chimney Checks', description: 'Close-up visual checks of gutters, downpipes and chimney condition.' },
      { title: 'Facade Visuals', description: 'Full exterior imagery showing walls, cladding and render condition.' },
      { title: 'Solar Panel Visual Checks', description: 'Aerial imagery of solar panel arrays to check for visible damage or debris.' },
      { title: 'Storm Damage Evidence', description: 'Comprehensive image and video evidence of storm damage for insurance and repair planning.' },
      { title: 'Detailed Reports Ready', description: 'All imagery organised, annotated where needed, and delivered for your records.' },
    ],
    audience: [
      { name: 'Roofers', detail: 'Assess roofs before quoting without the cost of scaffolding.' },
      { name: 'Landlords', detail: 'Visual checks across your portfolio without site visits to every roof.' },
      { name: 'Property Managers', detail: 'Document property condition for maintenance planning.' },
      { name: 'Insurance Claimants', detail: 'Visual evidence to support damage claims.' },
      { name: 'Building Maintenance', detail: 'Identify visible issues across large or hard-to-access buildings.' },
    ],
    deliverables: [
      { title: 'High-Resolution Inspection Photos', description: 'Close-up and wide-angle images showing roof and exterior condition.', formats: ['JPEG', 'PNG'] },
      { title: 'Video Flyover', description: 'Full exterior video walkthrough for documentation and evidence.', formats: ['MP4', '4K'] },
      { title: 'Annotated Images', description: 'Key images marked up with notes highlighting areas of interest.', formats: ['PDF', 'JPEG'] },
      { title: 'Evidence Pack', description: 'Organised folder of all imagery, ready for insurance or contractor use.', formats: ['ZIP', 'PDF'] },
    ],
  },
  {
    title: 'Construction Progress Updates',
    slug: 'construction-progress-updates',
    shortDescription: 'Recurring aerial updates for site documentation, milestones and marketing.',
    heroTitle: 'CONSTRUCTION PROGRESS UPDATES',
    highlightWord: 'PROGRESS',
    summary: 'Recurring aerial photography and video to document construction progress, capture milestones and create marketing content throughout your build.',
    icon: '<svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M2 20h20M5 20V8l5-5 5 5v12M10 12h4M10 16h4"/></svg>',
    heroImage: '/construction_1.png',
    includes: [
      { title: 'Recurring Photo Updates', description: 'Scheduled aerial photography at regular intervals throughout your project.' },
      { title: 'Recurring Video Updates', description: 'Aerial video captures at each visit showing site progress over time.' },
      { title: 'Milestone Captures', description: 'Key-stage documentation at foundations, frame, roof and completion.' },
      { title: 'Marketing Footage', description: 'Polished aerial content for completed phases, ready for marketing use.' },
      { title: 'Project Documentation', description: 'Consistent imagery from the same angles for clear before-and-after comparison.' },
      { title: 'Flexible Scheduling', description: 'Visit frequency tailored to your project timeline — weekly, fortnightly or monthly.' },
    ],
    audience: [
      { name: 'Builders', detail: 'Document progress and keep clients informed with aerial updates.' },
      { name: 'Contractors', detail: 'Visual records for project management and reporting.' },
      { name: 'Property Developers', detail: 'Marketing content and stakeholder updates throughout the build.' },
      { name: 'Project Managers', detail: 'Consistent aerial documentation for progress tracking.' },
      { name: 'Architects', detail: 'Visual records of the build matching your design intent.' },
    ],
    deliverables: [
      { title: 'Progress Photo Sets', description: 'Consistent aerial photos from the same vantage points at each visit.', formats: ['JPEG', 'PNG'] },
      { title: 'Progress Video', description: 'Aerial video overview of the site at each documented stage.', formats: ['MP4', '4K'] },
      { title: 'Time-Lapse Compilation', description: 'Combined footage showing the full build progression over time.', formats: ['MP4'] },
      { title: 'Completion Showcase', description: 'Final polished aerial content of the completed project.', formats: ['JPEG', 'MP4'] },
    ],
  },
  {
    title: 'Business and Social Media Content',
    slug: 'business-social-media-content',
    shortDescription: 'Short-form aerial clips, reels and promo visuals for local businesses.',
    heroTitle: 'BUSINESS AND SOCIAL MEDIA CONTENT',
    highlightWord: 'CONTENT',
    summary: 'Aerial photography and video content designed for social media, websites and business promotion — helping local businesses stand out with professional visuals.',
    icon: '<svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14"/><rect x="2" y="6" width="13" height="12" rx="2"/></svg>',
    includes: [
      { title: 'Short Promotional Clips', description: 'Punchy aerial video clips designed for social media and website use.' },
      { title: 'Social Media Reels', description: 'Vertical and square format cuts ready for Instagram, TikTok and Facebook.' },
      { title: 'Website Header Footage', description: 'Cinematic aerial video for use as website hero backgrounds or banners.' },
      { title: 'Branded Promo Visuals', description: 'Aerial content styled and edited to match your brand look and feel.' },
      { title: 'Location Reveals', description: 'Dramatic aerial reveals of your business location, venue or premises.' },
      { title: 'Multiple Formats', description: 'Content delivered in all the sizes and formats you need for your platforms.' },
    ],
    audience: [
      { name: 'Local Businesses', detail: 'Stand out on social media with professional aerial content.' },
      { name: 'Restaurants and Hospitality', detail: 'Showcase your venue and location from a unique perspective.' },
      { name: 'Retail and Leisure', detail: 'Eye-catching aerial visuals for marketing campaigns.' },
      { name: 'Event Venues', detail: 'Promote your venue with dramatic aerial location reveals.' },
      { name: 'Tourism and Travel', detail: 'Attract visitors with stunning aerial content of your destination.' },
    ],
    deliverables: [
      { title: 'Social Media Reels', description: 'Vertical format clips optimised for Instagram Reels and TikTok.', formats: ['MP4', '9:16'] },
      { title: 'Website Header Video', description: 'Landscape format aerial footage for website hero sections.', formats: ['MP4', 'WebM'] },
      { title: 'Aerial Still Photos', description: 'High-resolution aerial images for social posts and marketing materials.', formats: ['JPEG', 'PNG'] },
      { title: 'Raw Footage (Optional)', description: 'Unedited footage for your own editing team to work with.', formats: ['MOV', '4K'] },
    ],
  },
  {
    title: 'Land and Plot Overviews',
    slug: 'land-plot-overviews',
    shortDescription: 'Site overview imagery and access context for landowners and developers.',
    heroTitle: 'LAND AND PLOT OVERVIEWS',
    highlightWord: 'OVERVIEWS',
    summary: 'Aerial photography and video showing land plots, site boundaries, access routes and surrounding context — for sales, planning and development marketing.',
    icon: '<svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>',
    includes: [
      { title: 'Site Overview Imagery', description: 'Wide aerial photographs showing the full extent of the land or plot.' },
      { title: 'Plot Context', description: 'Images showing the site in relation to roads, neighbours and local features.' },
      { title: 'Access Route Visuals', description: 'Clear imagery showing access roads, entrances and approach routes.' },
      { title: 'Development Land Visuals', description: 'Aerial content highlighting development potential and site features.' },
      { title: 'Sales and Marketing Imagery', description: 'Polished aerial images and video ready for listings and brochures.' },
      { title: 'Multiple Angles', description: 'Coverage from different heights and directions to show the full picture.' },
    ],
    audience: [
      { name: 'Landowners', detail: 'Aerial visuals to support land sales or planning applications.' },
      { name: 'Developers', detail: 'Site context and overview imagery for feasibility and marketing.' },
      { name: 'Estate Agents', detail: 'Standout aerial content for land and plot listings.' },
      { name: 'Planning Consultants', detail: 'Visual context to support planning submissions.' },
      { name: 'Homeowners', detail: 'Aerial views of your land for personal records or sale preparation.' },
    ],
    deliverables: [
      { title: 'Aerial Overview Photos', description: 'Wide and mid-range aerial photos of the full site and surroundings.', formats: ['JPEG', 'PNG'] },
      { title: 'Site Flyover Video', description: 'Aerial video showing the plot, boundaries and access in context.', formats: ['MP4', '4K'] },
      { title: 'Annotated Site Images', description: 'Key images with labels showing boundaries, access and features.', formats: ['PDF', 'JPEG'] },
      { title: 'Marketing Pack', description: 'Edited selection of images and video ready for listings and brochures.', formats: ['JPEG', 'MP4'] },
    ],
  },
  {
    title: 'Agriculture and Rural Property Visuals',
    slug: 'agriculture-rural-property-visuals',
    shortDescription: 'Aerial farm overviews, estate visuals and rural property promotional content.',
    heroTitle: 'AGRICULTURE AND RURAL PROPERTY VISUALS',
    highlightWord: 'RURAL',
    summary: 'Aerial photography and video for farms, estates and rural properties — showcasing land, buildings and surroundings for marketing, documentation and management.',
    icon: '<svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M3 21h18M3 21V7l9-4 9 4v14"/><path d="M9 21v-6h6v6"/></svg>',
    includes: [
      { title: 'Aerial Farm Overviews', description: 'Wide aerial imagery showing the full extent of the farm or estate.' },
      { title: 'Estate Visuals', description: 'Polished aerial photography showcasing rural estates and country properties.' },
      { title: 'Field and Access Overviews', description: 'Imagery showing field layouts, boundaries, tracks and access routes.' },
      { title: 'Rural Property Promo', description: 'Marketing-ready aerial content for rural property listings and websites.' },
      { title: 'Building and Yard Coverage', description: 'Aerial views of farm buildings, yards and outbuildings.' },
      { title: 'Seasonal Coverage', description: 'Repeat visits to capture the property across different seasons if needed.' },
    ],
    audience: [
      { name: 'Farmers', detail: 'Aerial overview of your land, buildings and access routes.' },
      { name: 'Estate Owners', detail: 'Premium aerial visuals for marketing and documentation.' },
      { name: 'Rural Estate Agents', detail: 'Standout aerial content for country property listings.' },
      { name: 'Land Managers', detail: 'Visual records of land use, boundaries and infrastructure.' },
      { name: 'Rural Businesses', detail: 'Promotional aerial content for farm shops, glamping and tourism.' },
    ],
    deliverables: [
      { title: 'Aerial Overview Photos', description: 'Wide and detailed aerial images of the farm or estate.', formats: ['JPEG', 'PNG'] },
      { title: 'Estate Showcase Video', description: 'Cinematic aerial video tour of the property and grounds.', formats: ['MP4', '4K'] },
      { title: 'Field and Access Maps', description: 'Annotated aerial images showing field layouts and access.', formats: ['PDF', 'JPEG'] },
      { title: 'Marketing Materials', description: 'Edited aerial content ready for brochures, websites and social media.', formats: ['JPEG', 'MP4'] },
    ],
  },
  {
    title: '2D Mapping and Site Overviews',
    slug: '2d-mapping-site-overviews',
    shortDescription: 'Orthomosaic maps and aerial site overview outputs for planning and construction.',
    heroTitle: '2D MAPPING AND SITE OVERVIEWS',
    highlightWord: 'MAPPING',
    summary: 'Aerial orthomosaic maps and site overview outputs for construction, planning and property contexts — visual mapping from processed drone imagery.',
    icon: '<svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 3v18"/></svg>',
    includes: [
      { title: 'Orthomosaic Site Maps', description: 'Stitched aerial imagery creating a single, accurate overhead view of the entire site.' },
      { title: 'Aerial Site Overviews', description: 'High-resolution overhead imagery for site documentation and planning.' },
      { title: 'Progress Mapping', description: 'Repeat mapping visits to track changes on small and medium sites over time.' },
      { title: 'Visual Mapping Outputs', description: 'Processed outputs for planning, construction and property contexts.' },
      { title: 'Exportable Files', description: 'Mapping outputs delivered in standard formats for use in other software.' },
      { title: 'Consistent Coverage', description: 'Systematic aerial capture ensuring complete and even site coverage.' },
    ],
    audience: [
      { name: 'Construction Firms', detail: 'Site mapping for planning, progress tracking and documentation.' },
      { name: 'Developers', detail: 'Visual site maps for feasibility studies and stakeholder presentations.' },
      { name: 'Planning Consultants', detail: 'Overhead imagery to support planning applications.' },
      { name: 'Land Managers', detail: 'Visual mapping of land use, access and infrastructure.' },
      { name: 'Property Professionals', detail: 'Site overview outputs for reports and documentation.' },
    ],
    deliverables: [
      { title: 'Orthomosaic Map', description: 'Single stitched overhead image of the full site at high resolution.', formats: ['TIFF', 'JPEG'] },
      { title: 'Site Overview Images', description: 'Aerial overview photos from multiple heights for context.', formats: ['JPEG', 'PNG'] },
      { title: 'Progress Comparison', description: 'Side-by-side maps from different dates showing site changes.', formats: ['PDF', 'JPEG'] },
      { title: 'GIS-Ready Export', description: 'Georeferenced files for import into mapping and GIS software.', formats: ['GeoTIFF', 'KML'] },
    ],
  },
  {
    title: '3D Site Models and Measurements',
    slug: '3d-site-models-measurements',
    shortDescription: 'Visual 3D models with area, length and height measurements from processed imagery.',
    heroTitle: '3D SITE MODELS AND MEASUREMENTS',
    highlightWord: 'MODELS',
    summary: 'Visual 3D site models and processed aerial measurement outputs for construction, land and property clients — built from drone imagery.',
    icon: '<svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5M2 12l10 5 10-5"/></svg>',
    includes: [
      { title: '3D Visual Site Models', description: 'Detailed 3D models of buildings, terrain and site features built from aerial imagery.' },
      { title: 'Building and Site Models', description: 'Visual models of structures, showing form, scale and surroundings.' },
      { title: 'Area Measurements', description: 'Area measurements derived from processed aerial imagery.' },
      { title: 'Length and Height Measurements', description: 'Distance and elevation measurements from aerial data processing.' },
      { title: 'Visual Model Outputs', description: 'Exportable 3D models for planning presentations and stakeholder review.' },
      { title: 'Multiple Output Formats', description: 'Models delivered in formats suitable for viewing, sharing and further processing.' },
    ],
    audience: [
      { name: 'Construction Firms', detail: 'Visual site models for planning, progress and stakeholder presentations.' },
      { name: 'Architects', detail: '3D context models showing existing site conditions.' },
      { name: 'Developers', detail: 'Visual models for feasibility, marketing and planning submissions.' },
      { name: 'Land Professionals', detail: 'Terrain models and measurement outputs for land assessment.' },
      { name: 'Property Owners', detail: 'Visual models of your property for records or sale preparation.' },
    ],
    deliverables: [
      { title: '3D Site Model', description: 'Interactive 3D model of the site viewable in a web browser or 3D software.', formats: ['OBJ', 'GLB'] },
      { title: 'Measurement Report', description: 'Processed measurements including area, length and height data.', formats: ['PDF', 'CSV'] },
      { title: 'Textured Model', description: 'Photorealistic 3D model with aerial imagery mapped to surfaces.', formats: ['OBJ', 'PLY'] },
      { title: 'Model Screenshots', description: 'Key views of the 3D model exported as high-resolution images.', formats: ['JPEG', 'PNG'] },
    ],
  },
  {
    title: 'Stockpile Volume Estimates',
    slug: 'stockpile-volume-estimates',
    shortDescription: 'Volume estimates and progress comparisons for aggregates, earthworks and materials.',
    heroTitle: 'STOCKPILE VOLUME ESTIMATES',
    highlightWord: 'VOLUME',
    summary: 'Aerial volume estimates for stockpiles, earthworks and materials — helping you track quantities, monitor changes and plan logistics.',
    icon: '<svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M18 20V10M12 20V4M6 20v-6"/></svg>',
    includes: [
      { title: 'Stockpile Volume Estimates', description: 'Volume estimates derived from aerial imagery and photogrammetry processing.' },
      { title: 'Progress Comparisons', description: 'Volume change tracking across multiple visits to monitor usage or accumulation.' },
      { title: 'Material Monitoring', description: 'Ongoing aerial monitoring of stockpile quantities over time.' },
      { title: 'Visual Reports', description: 'Clear visual outputs showing stockpile extents, volumes and changes.' },
      { title: 'Multiple Stockpiles', description: 'Coverage of multiple stockpiles across a site in a single visit.' },
      { title: 'Repeat Visits', description: 'Scheduled return visits for ongoing volume tracking and comparison.' },
    ],
    audience: [
      { name: 'Construction Yards', detail: 'Track material quantities across your yard or depot.' },
      { name: 'Aggregates Suppliers', detail: 'Volume estimates for stock management and sales.' },
      { name: 'Earthworks Contractors', detail: 'Monitor cut and fill volumes during earthworks projects.' },
      { name: 'Waste Management', detail: 'Track waste stockpile volumes for compliance and reporting.' },
      { name: 'Quarry Operators', detail: 'Aerial volume estimates for extraction tracking.' },
    ],
    deliverables: [
      { title: 'Volume Estimate Report', description: 'Estimated volumes for each stockpile with supporting aerial imagery.', formats: ['PDF'] },
      { title: 'Comparison Report', description: 'Side-by-side volume comparisons from different dates.', formats: ['PDF'] },
      { title: 'Aerial Overview Photos', description: 'High-resolution overhead and angled photos of all stockpiles.', formats: ['JPEG', 'PNG'] },
      { title: '3D Stockpile Model', description: 'Visual 3D model of stockpile surfaces used for volume calculation.', formats: ['OBJ', 'PDF'] },
    ],
  },
];
