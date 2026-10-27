// Helpers around the `standards` content collection (src/content/standards/).
// A standard is a communication protocol, an information model or an application profile;
// each kind has its own URL section, and projects refer to standards by id.
import { getCollection, getEntry, type CollectionEntry } from 'astro:content';

export type Standard = CollectionEntry<'standards'>;
export type StandardKind = Standard['data']['kind'];

// `example` names a well-known standard of the kind, for when OT Fabric has none of it yet.
export const kinds: { id: StandardKind; label: string; plural: string; section: string; description: string; example?: string }[] = [
	{
		id: 'protocol',
		label: 'Communication protocol',
		plural: 'Communication protocols',
		section: 'protocols',
		description: 'Define how devices exchange data: messages, services, addressing, sessions and transport behaviour on the wire.',
	},
	{
		id: 'information-model',
		label: 'Information model',
		plural: 'Information models',
		section: 'models',
		description: 'Define what the data means: standard devices, measurements, controls and their structure, apart from the protocol that carries them.',
	},
	{
		id: 'application-profile',
		label: 'Application profile',
		plural: 'Application and messaging profiles',
		section: 'profiles',
		description: 'Define how a protocol is used for one interoperable application: topics, payloads, message flows, lifecycle and state.',
	},
];

export const kindOf = (kind: StandardKind) => kinds.find((k) => k.id === kind)!;

/** The page of a standard: /protocols/modbus/, /models/sunspec/. */
export const standardPath = (s: Standard) => `/${kindOf(s.data.kind).section}/${s.data.urlSlug ?? s.id}/`;

/** The label for badges and filters. */
export const shortName = (s: Standard) => s.data.short ?? s.data.name;

/** Every standard: protocols first, then information models and profiles, each in page order. */
export async function getStandards(kind?: StandardKind) {
	const order = kinds.map((k) => k.id);
	return (await getCollection('standards', (s) => !kind || s.data.kind === kind)).sort(
		(a, b) => order.indexOf(a.data.kind) - order.indexOf(b.data.kind) || a.data.order - b.data.order,
	);
}

export const getProtocols = () => getStandards('protocol');

/** Everything that carries a standard, linked where it has a page: [{ name, href? }]. */
export async function carriers(s: Standard) {
	const all = await getStandards();
	return [
		...all.filter((x) => s.data.carriedBy.includes(x.id as never)).map((x) => ({ name: x.data.name, short: shortName(x), href: standardPath(x) as string | undefined })),
		...s.data.carriedByOther.map((name) => ({ name, short: name, href: undefined as string | undefined })),
	];
}

/** Standards that name this one in `carriedBy`: the models and profiles on top of a protocol. */
export async function carriedOver(id: string) {
	return (await getStandards()).filter((s) => s.data.carriedBy.includes(id as never));
}

/** The standard a docs page belongs to, from the standard's `docs` path: docs/models/sunspec/cli -> SunSpec Modbus. */
export async function standardForDoc(docId: string) {
	return (await getStandards()).find((s) => s.data.docs && `/${docId}/`.startsWith(s.data.docs));
}

/** Whether a standard's detailed docs exist yet. */
export const hasDocs = async (s: Standard) => Boolean(s.data.docs && (await getEntry('docs', s.data.docs.replace(/^\/|\/$/g, ''))));
