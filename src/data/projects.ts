// Helpers around the `projects` content collection (src/data/projects.json).
// Standards pages (protocols, information models, profiles) are in ./standards.ts.
import { getCollection, type CollectionEntry } from 'astro:content';

export type Project = CollectionEntry<'projects'>;
export type Category = Project['data']['category'];

export const categories: { id: Category; label: string; description: string }[] = [
	{ id: 'protocol', label: 'Protocol libraries', description: 'Pure Go clients and servers for communication protocols. No cgo.' },
	{
		id: 'information-model',
		label: 'Information-model libraries',
		description: 'Standard device and data models, and their mapping onto a protocol: discovery, decoding, validation and serving.',
	},
	{
		id: 'application-profile',
		label: 'Application-profile libraries',
		description: 'How a protocol is used for one interoperable application: topic namespaces, payloads and session state.',
	},
	{ id: 'cli', label: 'CLI tools', description: 'Command-line tools to discover, read, write and diagnose devices.' },
	{ id: 'transport', label: 'Building blocks', description: 'Transport layers shared by the protocol libraries.' },
	{ id: 'discovery', label: 'Discovery', description: 'Find out what is actually running on a network, and what changed on it.' },
	{ id: 'interop', label: 'Interop suites', description: 'Dockerized reference stacks that test implementations against each other.' },
	{ id: 'ui', label: 'UI apps', description: 'Graphical applications built on the libraries.' },
	{ id: 'mcp', label: 'MCP servers', description: 'Let AI agents work with industrial devices through the Model Context Protocol.' },
	{ id: 'gateway', label: 'Gateways and connectors', description: 'Move OT data into IT, cloud and analytics systems.' },
];

/** Libraries, whatever kind of standard they implement. */
export const isLibrary = (p: Project) => ['protocol', 'information-model', 'application-profile'].includes(p.data.category);

export const repoUrl = (repo: string) => `https://github.com/otfabric/${repo}`;

export async function getProjects() {
	const order = categories.map((c) => c.id);
	const all = await getCollection('projects');
	return all.sort((a, b) => order.indexOf(a.data.category) - order.indexOf(b.data.category));
}

/** Available projects that implement this standard, then those that only work with it, in catalog order. */
export async function projectsFor(standard: string) {
	const available = (await getProjects()).filter((p) => p.data.status === 'available');
	return [
		...available.filter((p) => p.data.standards.includes(standard as never)),
		...available.filter((p) => p.data.related.includes(standard as never)),
	];
}
