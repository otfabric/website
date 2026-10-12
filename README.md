# otfabric.io

Source for [otfabric.io](https://otfabric.io), the website of [OT Fabric](https://github.com/otfabric): open-source protocol libraries and tools for industrial data, built by people and AI agents together.

Built with [Astro](https://astro.build) and [Starlight](https://starlight.astro.build), styled with Tailwind CSS, and deployed to Cloudflare as static assets.

## Develop

```sh
npm install
npm run dev       # http://localhost:4321
npm run build     # static site in ./dist
npm run preview   # serve ./dist locally
```

## Where things live

| Path | What |
|---|---|
| `src/content/docs/index.mdx` | Homepage |
| `src/content/docs/protocols/` | Protocol guides (Modbus, OPC UA, BACnet/IP, IEC 104) |
| `src/content/docs/projects/` | Project catalog page |
| `src/data/projects.ts` | Catalog data: every public repo, plus planned items |
| `src/content/docs/blog/` | Blog posts (starlight-blog). See `/contributing/blog-posts/` |
| `src/components/` | Catalog, protocol matrix, homepage sections, YouTube and Video embeds |
| `src/components/overrides/ThemeSelect.astro` | Header navigation |
| `src/styles/global.css` | Brand colours and fonts |
| `src/assets/logo-*.svg`, `public/favicon.svg`, `public/icons/` | Brand mark and library icons |

## Adding a project

Add an entry to `src/data/projects.ts`. Only public repositories in github.com/otfabric go in as `available`; roadmap items are `planned` and have no `repo`.

## License

MIT
