// Maintenance report for the standards and alliances directory (src/data/organizations.json).
// The build already rejects records that break the schema; this lists what needs a human:
// records due for re-verification, questions still unanswered, and (with --links) source
// URLs that no longer resolve. It never changes the data: fees are re-checked by hand.
//
//   node scripts/check-organizations.mjs           # staleness and open questions
//   node scripts/check-organizations.mjs --links   # also request every source URL
import { readFileSync } from 'node:fs';

const REVIEW_DAYS = 180; // keep in step with src/data/organizations.ts
const orgs = JSON.parse(readFileSync(new URL('../src/data/organizations.json', import.meta.url), 'utf8'));
const today = new Date().toISOString().slice(0, 10);
const due = (d) => new Date(Date.parse(`${d}T00:00:00Z`) + REVIEW_DAYS * 864e5).toISOString().slice(0, 10);
let failures = 0;

console.log(`Checking ${orgs.length} organizations on ${today}\n`);
for (const o of orgs) {
	const notes = [];
	if (due(o.verifiedAt) < today) notes.push(`verified ${o.verifiedAt}, re-check was due ${due(o.verifiedAt)}`);
	const open = Object.entries(o.access).filter(([, c]) => c.answer === 'unknown').map(([k]) => k);
	if (open.length) notes.push(`unknown: ${open.join(', ')}`);
	const unpriced = o.memberships.filter((t) => t.fee.kind === 'unknown').map((t) => t.name);
	if (unpriced.length) notes.push(`fee unknown: ${unpriced.join(', ')}`);
	if (notes.length) console.log(`${o.id}\n  ${notes.join('\n  ')}`);
	if (due(o.verifiedAt) < today) failures++;
}

if (process.argv.includes('--links')) {
	const urls = new Set();
	for (const o of orgs) {
		urls.add(o.website);
		for (const s of [...o.sources, ...(o.documents ?? []), ...o.openSource]) urls.add(s.url);
		for (const c of Object.values(o.access)) if (c.source) urls.add(c.source);
		for (const t of [...o.memberships, ...o.programs]) urls.add(t.source);
	}
	console.log(`\nRequesting ${urls.size} source URLs`);
	for (const url of urls) {
		try {
			const res = await fetch(url, { redirect: 'follow', signal: AbortSignal.timeout(20000), headers: { 'User-Agent': 'otfabric.io directory link check' } });
			if (!res.ok) {
				failures++;
				console.log(`  ${res.status} ${url}`);
			}
		} catch (e) {
			failures++;
			console.log(`  ERR ${url} (${e.cause?.code ?? e.message})`);
		}
	}
}

console.log(failures ? `\n${failures} item(s) need attention.` : '\nAll records are within their review window.');
process.exitCode = failures ? 1 : 0;
