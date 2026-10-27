// Plain-text views of the site for LLMs and AI search (https://llmstxt.org/):
// /llms.txt is the index, /llms-full.txt carries the full text of every page.
import { getCollection } from 'astro:content';
import { getPosts } from './blog';
import { categories, getProjects, projectsFor, repoUrl, type Project } from './projects';
import { getStandards, kindOf, kinds, standardPath, type Standard } from './standards';
import { longDescription } from './seo';
import { site } from './site';
import { byProtocol, ecosystem, typeLabels } from './ecosystem';
import { formatFee, getOrganizations, kindLabels, organizationsFor, orgPath, questions, answerLabels, type Organization } from './organizations';

/** The registry rows for one protocol as a Markdown table, standing in for <LandscapeTable />. */
function landscapeTable(protocol: string) {
	const rows = byProtocol(protocol)
		.filter((i) => i.type !== 'commercial')
		.map((i) => `| [${i.name}](${i.url}) | ${i.languages.join(', ')} | ${i.license}${i.commercialLicense ? ' or commercial' : ''} | ${i.release ? `${i.release.version} (${i.release.source})` : 'untagged'} | ${typeLabels[i.type]} |`);
	return ['| Implementation | Language | Licence | Latest release | Type |', '|---|---|---|---|---|', ...rows].join('\n');
}

const attr = (tag: string, name: string) => tag.match(new RegExp(`${name}="([^"]*)"`))?.[1];

/** Turn MDX into readable Markdown: drop imports, unwrap components, make links absolute. */
export function mdxToMarkdown(source: string) {
	const body = source.replace(/^---\n[\s\S]*?\n---\n/, '');
	// Leave fenced code untouched; only rewrite the prose between fences.
	return body
		.split(/(^```[\s\S]*?^```)/m)
		.map((part, i) => (i % 2 ? part : rewriteProse(part)))
		.join('')
		.replace(/\n{3,}/g, '\n\n')
		.trim();
}

function rewriteProse(text: string) {
	return text
		.replace(/^(import|export) .*$/gm, '')
		.replace(/<LinkCard\b[^>]*\/>/g, (tag) => `- [${attr(tag, 'title')}](${attr(tag, 'href')}): ${attr(tag, 'description') ?? ''}`)
		.replace(/<Badge\b[^>]*\/>/g, (tag) => `(${attr(tag, 'text')})`)
		.replace(/<(Aside|Callout)\b[^>]*>/g, (tag) => `**${attr(tag, 'title') ?? capitalize(attr(tag, 'type') ?? 'note')}:**`)
		.replace(/<TabItem\b[^>]*>/g, (tag) => `**${attr(tag, 'label')}**`)
		.replace(/<(YouTube|Video)\b[^>]*\/>/g, '')
		.replace(/<LandscapeTable\b[^>]*\/>/g, (tag) => landscapeTable(attr(tag, 'protocol')!))
		.replace(/<MapLink\b[^>]*\/>/g, (tag) => `[${attr(tag, 'title') ?? 'Explore the interactive ecosystem map'}](/ecosystem/implementations/${attr(tag, 'protocol') ? `?protocol=${attr(tag, 'protocol')}` : ''})`)
		.replace(/<\/?(Aside|Callout|Tabs|TabItem|Steps|CardGrid)\b[^>]*>/g, '')
		.replace(/^[ \t]+(?=\S)/gm, (indent) => indent.replace(/\t/g, '  '))
		.replace(/\]\((\/[^)]*)\)/g, (_, path) => `](${site.url}${path})`);
}

const capitalize = (s: string) => s[0].toUpperCase() + s.slice(1);

export const docsUrl = (id: string) => `${site.url}/${id}/`;

type Doc = Awaited<ReturnType<typeof getDocs>>[number];

/** Protocol and model subpages share short titles ("Go library"), so name the standard too: "Modbus: Go library". */
export function docTitle(doc: Doc, docs: Doc[]) {
	if (!/^docs\/(protocols|models)\/[^/]+\/[^/]+$/.test(doc.id)) return doc.data.title;
	const parent = docs.find((d) => d.id === doc.id.split('/').slice(0, 3).join('/'));
	return parent && !doc.data.title.includes(parent.data.title) ? `${parent.data.title}: ${doc.data.title}` : doc.data.title;
}

/** One page of llms-full.txt or a protocol bundle, headed by its title and canonical URL. */
const section = (title: string, url: string, description: string | undefined, body: string) =>
	[`# ${title}`, `URL: ${url}`, description ? `> ${description}` : '', body].filter(Boolean).join('\n\n');

export async function protocolSection(p: Standard) {
	const facts = p.data.facts.map((f) => `- ${f.label}: ${f.value}`).join('\n');
	const projects = (await projectsFor(p.id)).map((x) => `- ${x.data.name}: ${x.data.description} (${repoUrl(x.data.repo!)})`).join('\n');
	const all = await getStandards();
	const carriers = [...all.filter((s) => p.data.carriedBy.includes(s.id as never)).map((s) => `${s.data.name} (${site.url}${standardPath(s)})`), ...p.data.carriedByOther];
	const kind = [`Kind: ${kindOf(p.data.kind).label}`, carriers.length && `${p.data.kind === 'application-profile' ? 'built on' : 'carried over'} ${carriers.join(', ')}`].filter(Boolean).join(', ');
	const body = [`${kind}. Standard: ${p.data.standard}`, facts, mdxToMarkdown(p.body ?? ''), `## OT Fabric projects for ${p.data.name}`, projects].join('\n\n');
	return section(p.data.name, `${site.url}${standardPath(p)}`, p.data.summary, body);
}

export const docSection = (d: Doc, docs: Doc[]) => section(docTitle(d, docs), docsUrl(d.id), d.data.description, mdxToMarkdown(d.body ?? ''));

export const postSection = (p: Awaited<ReturnType<typeof getPosts>>[number]) =>
	section(p.data.title, `${site.url}/blog/${p.id}/`, p.data.description, `Published: ${p.data.date.toISOString().slice(0, 10)}\n\n${mdxToMarkdown(p.body ?? '')}`);

/** A project page as Markdown: what it is, what it does, how to get it. */
export function projectSection(p: Project) {
	const category = categories.find((c) => c.id === p.data.category)!;
	const body = [
		`Category: ${category.label}. Source: ${repoUrl(p.data.repo!)}`,
		p.data.highlights?.map((h) => `- ${h}`).join('\n'),
		p.data.install && `Install:\n\n\`\`\`\n${p.data.install}\n\`\`\``,
	];
	return section(p.data.name, `${site.url}/projects/${p.id}/`, p.data.description, body.filter(Boolean).join('\n\n'));
}

/** One organization as Markdown: what it does, the access answers with sources, and its tiers. */
export function organizationSection(o: Organization) {
	const d = o.data;
	const body = [
		`Type: ${kindLabels[d.kind]}. Official website: ${d.website}. Verified: ${d.verifiedAt}. OT Fabric is not affiliated with ${d.name}; this is an independent summary of its published pages.`,
		d.description,
		'## Taking part',
		questions.map((q) => { const c = d.access[q.key]; return `- ${q.label} ${answerLabels[c.answer]}. ${c.detail}${c.source ? ` (${c.source})` : ''}`; }).join('\n'),
		'## Membership tiers',
		d.memberships.map((t) => `- ${t.name}: ${formatFee(t.fee)}.${t.eligibility ? ` ${t.eligibility}` : ''}${t.note ? ` ${t.note}` : ''} (${t.source})`).join('\n'),
		...(d.programs.length ? ['## Certification and interoperability', d.programs.map((p) => `- ${p.name}: ${p.detail} (${p.source})`).join('\n')] : []),
		...(d.insights.length ? ["## OT Fabric's notes", d.insights.join('\n\n')] : []),
	];
	return section(d.name, `${site.url}${orgPath(o)}`, d.summary, body.join('\n\n'));
}

/** Everything about one protocol or model in one file: overview, docs, projects, other implementations and posts. */
export async function protocolBundle(p: Standard) {
	const docs = await getDocs();
	const own = p.data.docs ? docs.filter((d) => `/${d.id}/`.startsWith(p.data.docs!)) : [];
	const projects = await projectsFor(p.id);
	const posts = (await getPosts()).filter((post) => post.data.tags.includes(p.id));
	const landscape = byProtocol(p.id).length
		? [section(`Other ${p.data.name} implementations`, `${site.url}/ecosystem/implementations/?protocol=${p.id}`, `Open-source ${p.data.name} stacks from the OT Fabric ecosystem map, verified at their publishing source.`, landscapeTable(p.id))]
		: [];
	const organizations = await organizationsFor(p.id);
	const orgs = organizations.length
		? [section(`Organizations behind ${p.data.name}`, `${site.url}/ecosystem/organizations/?protocol=${p.id}`, `Standards bodies, alliances, user groups and foundations for ${p.data.name}. Listed for reference; OT Fabric is not affiliated with them.`, organizations.map((o) => `- [${o.data.name}](${site.url}${orgPath(o)}): ${o.data.summary}`).join('\n'))]
		: [];
	return [
		`# ${p.data.name} with OT Fabric\n\n> Everything otfabric.io says about ${p.data.name}: the ${kindOf(p.data.kind).label.toLowerCase()} overview, the documentation, the OT Fabric projects and the wider ecosystem. Index of the whole site: ${site.url}/llms.txt`,
		await protocolSection(p),
		...own.map((d) => docSection(d, docs)),
		...projects.map(projectSection),
		...landscape,
		...orgs,
		...posts.map(postSection),
	].join('\n\n---\n\n') + '\n';
}

/** Docs pages in sidebar-friendly order: overview pages before their children. */
export async function getDocs() {
	const docs = await getCollection('docs', (doc) => doc.id !== '404');
	const rank = (id: string) => ['library', 'cli', 'testing'].indexOf(id.split('/').at(-1)!) + 1;
	return docs.sort((a, b) => {
		const pa = a.id.split('/').slice(0, 3).join('/');
		const pb = b.id.split('/').slice(0, 3).join('/');
		return pa === pb ? rank(a.id) - rank(b.id) : a.id.localeCompare(b.id);
	});
}

export async function llmsIndex() {
	const [standards, projects, docs, posts, organizations] = await Promise.all([getStandards(), getProjects(), getDocs(), getPosts(), getOrganizations()]);
	const available = projects.filter((p) => p.data.status === 'available');
	const planned = projects.filter((p) => p.data.status === 'planned');
	const line = (title: string, url: string, description?: string) =>
		`- [${title}](${url})${description ? `: ${description}` : ''}`;

	return [
		`# ${site.name}`,
		`> ${longDescription}`,
		[
			'OT Fabric is an open-source organization on GitHub (https://github.com/otfabric). For each operational technology (OT) communication protocol it publishes a library with client and server support, a command-line tool where field work needs one, and a Dockerized interoperability suite that tests the implementation against independent stacks. For standard information models, which define what device data means and are carried over a protocol (SunSpec Modbus over Modbus, the IEC 61850 information model), it publishes model libraries and tools on top of the protocol libraries. For application and messaging profiles, which define how applications use a transport (Sparkplug B over MQTT), it publishes the same library, CLI and interop suite. Everything is MIT-licensed unless a repository says otherwise.',
			'The roadmap covers every relevant OT protocol, IT-to-OT gateways and data connectors, and MCP servers so AI agents can work with industrial devices safely. The project is built by people and AI agents together: engineers set direction and own every decision, and public tests and interop suites hold every change to the same bar.',
		].join('\n\n'),
		...kinds
			.map((k) => ({ k, items: standards.filter((s) => s.data.kind === k.id) }))
			.filter(({ items }) => items.length)
			.flatMap(({ k, items }) => [
				`## ${k.plural}`,
				k.description,
				items.map((p) => line(p.data.standard.startsWith(p.data.name) ? p.data.name : `${p.data.name} (${p.data.standard})`, `${site.url}${standardPath(p)}`, p.data.summary)).join('\n'),
			]),
		'## Protocol, model and profile bundles',
		'One plain-text file per protocol, information model or application profile with its overview, every documentation page, the OT Fabric projects and the other open-source implementations.',
		standards.map((p) => line(`${p.data.name} bundle`, `${site.url}/llms/${p.id}.txt`)).join('\n'),
		'## Documentation',
		docs.map((d) => line(docTitle(d, docs), docsUrl(d.id), d.data.description)).join('\n'),
		'## Projects',
		categories
			.map((c) => ({ c, items: available.filter((p) => p.data.category === c.id) }))
			.filter(({ items }) => items.length)
			.map(({ c, items }) => `### ${c.label}\n\n${items.map((p) => line(p.data.name, `${site.url}/projects/${p.id}/`, `${p.data.description} Source: ${repoUrl(p.data.repo!)}`)).join('\n')}`)
			.join('\n\n'),
		...(posts.length
			? ['## Blog', posts.map((p) => line(p.data.title, `${site.url}/blog/${p.id}/`, p.data.description)).join('\n')]
			: []),
		'## Ecosystem map',
		line(ecosystem.title, `${site.url}/ecosystem/implementations/`, `Interactive map of ${ecosystem.implementations.length} open-source and commercial implementations of the protocols and profiles above, with language, licence, roles and latest release. Data: https://github.com/otfabric/website/blob/main/src/data/ecosystem.json`),
		'## Standards and alliances',
		[
			line('Industrial protocol standards and alliances', `${site.url}/ecosystem/organizations/`, `Independent directory of ${organizations.length} standards bodies, alliances, user groups and open-source foundations, with membership tiers, published fees, free routes in and interoperability programs. Every fact cites its official source. Listing does not imply affiliation.`),
			...organizations.map((o) => line(o.data.name, `${site.url}${orgPath(o)}`, o.data.summary)),
		].join('\n'),
		'## Data',
		[
			line('Ecosystem registry (JSON)', `${site.url}/ecosystem.json`, 'The data behind the ecosystem map: every implementation with protocol, type, languages, licence, roles, capabilities, maintenance, latest release, sources and verification date.'),
			line('Standards and alliances dataset (JSON)', `${site.url}/ecosystem/organizations.json`, 'The data behind the directory: every organization with access answers, membership tiers, fees, programs, sources and verification dates.'),
			line('SunSpec device file schema', `${site.url}/schemas/sunspec/devicefile-1.schema.json`, 'JSON Schema for SunSpec device files, as served by sunspecctl and exported by SunSpec Explorer.'),
			line('Blog RSS feed', `${site.url}/blog/rss.xml`),
		].join('\n'),
		'## Optional',
		[
			line('About OT Fabric', `${site.url}/about/`, 'Why OT Fabric exists, how it is built, and where it is heading.'),
			line('Contact', `${site.url}/contact/`, `Email ${site.email}, or reach the team on LinkedIn and GitHub.`),
			line('Full text for LLMs', `${site.url}/llms-full.txt`, 'Every protocol, information-model and profile page, documentation page, project and blog post in one Markdown file.'),
			...planned.map((p) => line(`${p.data.name} (planned)`, `${site.url}/projects/`, p.data.description)),
		].join('\n'),
	].join('\n\n') + '\n';
}
