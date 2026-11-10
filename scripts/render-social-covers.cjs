// Social cards (1200x630 PNG) for blog posts whose cover is an SVG diagram. LinkedIn, X and
// Slack cannot show an SVG, so without these the posts would share the generic site image.
// Run after adding or changing an SVG cover:  node scripts/render-social-covers.cjs
// Writes src/assets/blog/social/<cover>.png; reference it as `cover.social` in the post.
const { chromium } = require('playwright');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const blog = path.join(root, 'src/content/blog');
const out = path.join(root, 'src/assets/blog/social');
const font = (pkg, file) =>
	`data:font/woff2;base64,${fs.readFileSync(path.join(root, 'node_modules/@fontsource', pkg, 'files', file)).toString('base64')}`;
const faces = [
	['IBM Plex Sans', 400, font('ibm-plex-sans', 'ibm-plex-sans-latin-400-normal.woff2')],
	['IBM Plex Sans', 600, font('ibm-plex-sans', 'ibm-plex-sans-latin-600-normal.woff2')],
	['IBM Plex Sans', 700, font('ibm-plex-sans', 'ibm-plex-sans-latin-700-normal.woff2')],
	['IBM Plex Mono', 400, font('ibm-plex-mono', 'ibm-plex-mono-latin-400-normal.woff2')],
	['IBM Plex Mono', 500, font('ibm-plex-mono', 'ibm-plex-mono-latin-500-normal.woff2')],
]
	.map(([family, weight, url]) => `@font-face{font-family:'${family}';font-weight:${weight};src:url(${url}) format('woff2')}`)
	.join('');

const covers = new Set();
for (const file of fs.readdirSync(blog)) {
	const match = fs.readFileSync(path.join(blog, file), 'utf8').match(/^\s+image:\s*(\S+\.svg)\s*$/m);
	if (match) covers.add(path.resolve(blog, match[1]));
}

(async () => {
	fs.mkdirSync(out, { recursive: true });
	const browser = await chromium.launch();
	const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
	for (const svg of covers) {
		// The diagrams are drawn on #F4F6F8; centre them on a card of the same colour.
		const html = `<!doctype html><html><head><meta charset="utf-8"><style>${faces}
			*{margin:0;padding:0;box-sizing:border-box}
			body{width:1200px;height:630px;background:#F4F6F8;display:flex;align-items:center;justify-content:center;padding:32px}
			svg{max-width:100%;max-height:100%;width:100%;height:100%}
		</style></head><body>${fs.readFileSync(svg, 'utf8')}</body></html>`;
		await page.setContent(html, { waitUntil: 'load' });
		await page.evaluate(() => document.fonts.ready);
		const loaded = await page.evaluate(() => [...document.fonts].filter((f) => f.status === 'loaded').length);
		if (loaded < 2) throw new Error(`IBM Plex did not load for ${svg}`);
		const target = path.join(out, path.basename(svg, '.svg') + '.png');
		await page.screenshot({ path: target });
		console.log(path.relative(root, target));
	}
	await browser.close();
})();
