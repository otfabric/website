// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightBlog from 'starlight-blog';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

const site = 'https://otfabric.io';
const description =
  'Open-source protocol libraries and tools that break down OT data silos, built by people and AI agents together.';

export default defineConfig({
  site,

  integrations: [
    starlight({
      title: 'OT Fabric',
      description,
      // Placeholder mark until the brand basics thread delivers the final logo.
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
      ],
      editLink: {
        baseUrl: 'https://github.com/otfabric/website/edit/main/',
      },
      components: {
        ThemeSelect: './src/components/overrides/ThemeSelect.astro',
      },
      plugins: [
        starlightBlog({
          title: 'Blog',
          prefix: 'blog',
          navigation: 'none',
          postCount: 10,
          recentPostCount: 5,
          metrics: { readingTime: true },
          authors: {
            otfabric: {
              name: 'OT Fabric',
              title: 'Maintainers',
              url: 'https://github.com/otfabric',
            },
          },
        }),
      ],
      sidebar: [
        {
          label: 'Getting started',
          items: [
            { label: 'Overview', slug: 'getting-started' },
            { label: 'About OT Fabric', slug: 'about' },
          ],
        },
        {
          label: 'Protocols',
          items: [
            { label: 'All protocols', slug: 'protocols' },
            { label: 'Modbus', slug: 'protocols/modbus' },
            { label: 'OPC UA', slug: 'protocols/opc-ua' },
            { label: 'BACnet/IP', slug: 'protocols/bacnet' },
            { label: 'IEC 60870-5-104', slug: 'protocols/iec-104' },
          ],
        },
        {
          label: 'Projects',
          items: [{ label: 'Project catalog', slug: 'projects' }],
        },
        {
          label: 'Community',
          items: [
            { label: 'Blog', link: '/blog/' },
            { label: 'Contributing', slug: 'contributing' },
            { label: 'Writing blog posts', slug: 'contributing/blog-posts' },
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

    sitemap(),
  ],

  vite: {
    plugins: [tailwindcss()],
  },
});
