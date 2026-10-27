// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import { readFileSync, readdirSync } from 'node:fs';

const site = 'https://otfabric.io';

// Last-modified dates for the sitemap, where the content records one: blog posts
// (updated, else date), the ecosystem map (the registry's verification date) and the organizations directory.
const lastmod = new Map();
for (const file of readdirSync('./src/content/blog')) {
  const frontmatter = readFileSync(`./src/content/blog/${file}`, 'utf8').split('\n---')[0];
  const date = (frontmatter.match(/^updated:\s*(\S+)/m) ?? frontmatter.match(/^date:\s*(\S+)/m))?.[1];
  if (date) lastmod.set(`${site}/blog/${file.replace(/\.mdx?$/, '')}/`, date);
}
lastmod.set(`${site}/ecosystem/implementations/`, JSON.parse(readFileSync('./src/data/ecosystem.json', 'utf8')).verified);
// The standards and alliances directory: each profile's verification date, and the newest for the list.
const organizations = JSON.parse(readFileSync('./src/data/organizations.json', 'utf8'));
for (const org of organizations.filter((o) => o.detail)) lastmod.set(`${site}/ecosystem/organizations/${org.id}/`, org.verifiedAt);
lastmod.set(`${site}/ecosystem/organizations/`, organizations.map((o) => o.verifiedAt).sort().at(-1));
const description =
  'Open-source protocol libraries and tools that break down OT data silos, built by people and AI agents together.';

// Pages that moved when SunSpec became an information model rather than a protocol. Cloudflare
// answers these with a 301 from public/_redirects; these entries only keep `astro dev` and
// `astro preview` working, as meta-refresh pages with a canonical link.
const moved = {
  '/protocols/sunspec': '/models/sunspec/',
  '/docs/protocols/sunspec': '/docs/models/sunspec/',
  '/docs/protocols/sunspec/library': '/docs/models/sunspec/library/',
  '/docs/protocols/sunspec/cli': '/docs/models/sunspec/cli/',
  '/docs/protocols/sunspec/testing': '/docs/models/sunspec/testing/',
};

export default defineConfig({
  site,
  redirects: moved,

  integrations: [
    starlight({
      title: 'OT Fabric',
      description,
      // Same mark as the website header (src/components/site/Logo.astro).
      logo: {
        light: './src/assets/logo-light.svg',
        dark: './src/assets/logo-dark.svg',
      },
      favicon: '/favicon.svg',
      head: [
        { tag: 'meta', attrs: { name: 'theme-color', content: '#17212B' } },
      ],
      social: [
        {
          icon: 'github',
          label: 'GitHub',
          href: 'https://github.com/otfabric',
        },
        {
          icon: 'linkedin',
          label: 'LinkedIn',
          href: 'https://www.linkedin.com/company/otfabric',
        },
      ],
      editLink: {
        baseUrl: 'https://github.com/otfabric/website/edit/main/',
      },
      components: {
        Head: './src/components/overrides/Head.astro',
        Header: './src/components/overrides/Header.astro',
        MobileMenuFooter: './src/components/overrides/MobileMenuFooter.astro',
      },
      sidebar: [
        {
          label: 'Start here',
          items: [
            { label: 'Documentation', slug: 'docs' },
            { label: 'Getting started', slug: 'docs/getting-started' },
          ],
        },
        {
          label: 'Protocols',
          items: [
            { label: 'Overview', slug: 'docs/protocols' },
            { label: 'Modbus', collapsed: true, items: [{ autogenerate: { directory: 'docs/protocols/modbus' } }] },
            { label: 'OPC UA', collapsed: true, items: [{ autogenerate: { directory: 'docs/protocols/opc-ua' } }] },
            { label: 'BACnet/IP', collapsed: true, items: [{ autogenerate: { directory: 'docs/protocols/bacnet' } }] },
            { label: 'IEC 60870-5-104', collapsed: true, items: [{ autogenerate: { directory: 'docs/protocols/iec-104' } }] },
            { label: 'IEC 61850 / MMS', collapsed: true, items: [{ autogenerate: { directory: 'docs/protocols/iec-61850' } }] },
            { label: 'Siemens S7', collapsed: true, items: [{ autogenerate: { directory: 'docs/protocols/s7' } }] },
            { label: 'OpenADR', collapsed: true, items: [{ autogenerate: { directory: 'docs/protocols/openadr' } }] },
            { label: 'OCPP', collapsed: true, items: [{ autogenerate: { directory: 'docs/protocols/ocpp' } }] },
            { label: 'DNP3', collapsed: true, items: [{ autogenerate: { directory: 'docs/protocols/dnp3' } }] },
            { label: 'IEEE 2030.5', collapsed: true, items: [{ autogenerate: { directory: 'docs/protocols/ieee-2030-5' } }] },
            { label: 'EtherNet/IP', collapsed: true, items: [{ autogenerate: { directory: 'docs/protocols/ethernet-ip' } }] },
          ],
        },
        {
          label: 'Information models',
          items: [
            { label: 'Overview', slug: 'docs/models' },
            { label: 'SunSpec Modbus', collapsed: true, items: [{ autogenerate: { directory: 'docs/models/sunspec' } }] },
            { label: 'IEC 61850 information model', collapsed: true, items: [{ autogenerate: { directory: 'docs/models/iec-61850' } }] },
          ],
        },
        {
          label: 'Application profiles',
          items: [
            { label: 'Overview', slug: 'docs/profiles' },
            { label: 'Sparkplug B', collapsed: true, items: [{ autogenerate: { directory: 'docs/profiles/sparkplugb' } }] },
          ],
        },
        {
          label: 'Contributing',
          items: [
            { label: 'How to contribute', slug: 'docs/contributing' },
            { label: 'Writing blog posts', slug: 'docs/contributing/blog-posts' },
          ],
        },
      ],
      expressiveCode: {
        themes: ['github-dark', 'github-light'],
        styleOverrides: {
          codeFontFamily: "'IBM Plex Mono', ui-monospace, Menlo, Consolas, monospace",
          borderRadius: '0.25rem',
        },
      },
      customCss: ['./src/styles/global.css'],
    }),

    sitemap({
      // /ecosystem/ only forwards to /ecosystem/implementations/.
      filter: (page) => page !== `${site}/ecosystem/`,
      serialize(item) {
        const date = lastmod.get(item.url);
        return date ? { ...item, lastmod: new Date(date).toISOString() } : item;
      },
    }),
  ],

  vite: {
    plugins: [tailwindcss()],
  },
});
