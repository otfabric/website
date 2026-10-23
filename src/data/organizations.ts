// The standards and alliances directory (src/data/organizations.json): who publishes,
// tests and promotes the protocols OT Fabric covers, what taking part costs, and the
// page each fact came from. Listing an organization never implies a relationship.
import { getCollection, type CollectionEntry } from 'astro:content';
import { ecosystem } from './ecosystem';

export type Organization = CollectionEntry<'organizations'>;
export type Answer = Organization['data']['access']['specifications']['answer'];
export type Fee = Organization['data']['memberships'][number]['fee'];

export const kindLabels: Record<Organization['data']['kind'], string> = {
	'standards-body': 'Standards body',
	'industry-alliance': 'Industry alliance',
	'user-group': 'User group',
	'oss-foundation': 'Open-source foundation',
	'professional-society': 'Professional society',
};

export const domainLabels: Record<Organization['data']['domains'][number], string> = {
	energy: 'Energy and DER',
	industrial: 'Industrial',
	buildings: 'Buildings',
	'ev-charging': 'EV charging',
};

export const roleLabels: Record<Organization['data']['standards'][number]['role'], string> = {
	publishes: 'Publishes',
	maintains: 'Maintains',
	certifies: 'Certifies',
	tests: 'Tests',
	promotes: 'Promotes',
	'hosts-oss': 'Hosts open source',
};

export const programLabels: Record<Organization['data']['programs'][number]['kind'], string> = {
	certification: 'Certification',
	'conformance-testing': 'Conformance testing',
	'test-tool': 'Test tool',
	plugfest: 'Plugfest',
	'interop-event': 'Interop event',
};

export const regionLabels: Record<Organization['data']['region'], string> = {
	global: 'Global',
	europe: 'Europe',
	'north-america': 'North America',
	'asia-pacific': 'Asia-Pacific',
};

/** The access questions, in display order. "Yes" always means open or free to an outsider. */
export const questions: { key: keyof Organization['data']['access']; label: string; short: string }[] = [
	{ key: 'specifications', label: 'Can anyone read the specifications for free?', short: 'Free specs' },
	{ key: 'community', label: 'Can anyone take part in the community?', short: 'Open community' },
	{ key: 'individualFree', label: 'Can an individual take part for free?', short: 'Free for individuals' },
	{ key: 'organizationFree', label: 'Can an organization join for free?', short: 'Free for organizations' },
	{ key: 'workingGroups', label: 'Are technical working groups open to non-members?', short: 'Open working groups' },
	{ key: 'interopTesting', label: 'Can non-members take part in interoperability testing?', short: 'Open interop testing' },
	{ key: 'certification', label: 'Can a non-member certify a product?', short: 'Certify without joining' },
	{ key: 'openSource', label: 'Does it maintain or host open-source implementations?', short: 'Open source' },
];

export const answerLabels: Record<Answer, string> = {
	yes: 'Yes',
	partial: 'Partly',
	no: 'No',
	unknown: 'Unknown',
	notPublished: 'Not published',
	notApplicable: 'Not applicable',
};

export const answerSymbols: Record<Answer, string> = {
	yes: '✓',
	partial: '◐',
	no: '✕',
	unknown: '?',
	notPublished: '–',
	notApplicable: 'n/a',
};

/** How long a verified fee or fact stays trusted before it is due for a re-check. */
export const REVIEW_DAYS = 180;

const money = (amount: number, currency: string) =>
	new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount);

const periods = { year: ' a year', 'calendar-year': ' per calendar year', unstated: '' };

export function formatFee(fee: Fee) {
	switch (fee.kind) {
		case 'amount':
			if (fee.amount === 0 && !fee.max) return 'Free';
			return `${fee.max ? `${money(fee.amount, fee.currency)} to ${money(fee.max, fee.currency)}` : money(fee.amount, fee.currency)}${periods[fee.period]}`;
		case 'free':
			return 'Free';
		case 'onRequest':
			return 'On request';
		case 'notPublished':
			return 'Not published';
		default:
			return 'Unknown';
	}
}

/** One line on the cheapest way in: a free route if there is one, and the lowest published fee. */
export function entryPoint(org: Organization) {
	const tiers = org.data.memberships;
	const free = tiers.find((t) => t.fee.kind === 'free' || (t.fee.kind === 'amount' && t.fee.amount === 0 && !t.fee.max));
	const paid = tiers
		.filter((t) => t.fee.kind === 'amount' && t.fee.amount > 0)
		.sort((a, b) => (a.fee.kind === 'amount' && b.fee.kind === 'amount' ? a.fee.amount - b.fee.amount : 0))[0];
	const from = paid?.fee.kind === 'amount' ? `from ${money(paid.fee.amount, paid.fee.currency)} (${paid.name})` : undefined;
	if (free) return from ? `Free: ${free.name} · paid ${from}` : `Free: ${free.name}`;
	if (from) return `From ${from.slice(5)}`;
	return tiers.some((t) => t.fee.kind === 'onRequest') ? 'Fees on request' : 'Fees not published';
}

export const formatDay = (d: string) =>
	new Date(`${d}T00:00:00Z`).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });

export const reviewBy = (d: string) => new Date(Date.parse(`${d}T00:00:00Z`) + REVIEW_DAYS * 864e5).toISOString().slice(0, 10);

export const orgPath = (org: Organization) => (org.data.detail ? `/ecosystem/organizations/${org.id}/` : `/ecosystem/organizations/#org-${org.id}`);

export const host = (url: string) => new URL(url).hostname.replace(/^www\./, '');

let cache: Organization[] | undefined;

/** Every organization, sorted by name, after checking the links between records. */
export async function getOrganizations() {
	if (cache) return cache;
	const orgs = (await getCollection('organizations')).sort((a, b) => a.data.name.localeCompare(b.data.name));
	const projects = new Set((await getCollection('projects')).map((p) => p.id));
	const ids = new Set(orgs.map((o) => o.id));
	const stacks = new Set(ecosystem.implementations.map((i) => i.id));
	const problems: string[] = [];
	const today = new Date().toISOString().slice(0, 10);
	for (const o of orgs) {
		for (const r of o.data.related) if (!ids.has(r.id)) problems.push(`${o.id}: related organization "${r.id}" does not exist`);
		for (const p of o.data.relatedProjects) if (!projects.has(p)) problems.push(`${o.id}: project "${p}" is not in src/data/projects.json`);
		for (const s of o.data.openSource) {
			if (s.implementation && !stacks.has(s.implementation)) problems.push(`${o.id}: "${s.implementation}" is not on the ecosystem map`);
		}
		if (o.data.detail && !o.data.insights.length) problems.push(`${o.id}: a detail page needs insights`);
		if (reviewBy(o.data.verifiedAt) < today) console.warn(`[organizations] ${o.id} was verified on ${o.data.verifiedAt} and is due for a re-check.`);
	}
	if (problems.length) throw new Error(`src/data/organizations.json:\n- ${problems.join('\n- ')}`);
	cache = orgs;
	return orgs;
}

export async function organizationsFor(protocol: string) {
	return (await getOrganizations()).filter((o) => o.data.protocols.includes(protocol as never));
}

/** The newest verification date in the directory. */
export const lastVerified = (orgs: Organization[]) => orgs.map((o) => o.data.verifiedAt).sort().at(-1)!;
