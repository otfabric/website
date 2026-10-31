import { getPosts } from './blog';

// The "Software architecture for OT" series: one cornerstone guide and eight deep dives.
// Posts are published in waves. A post that is still a draft is listed but not linked,
// so the hub and its siblings never point at a page that does not exist yet.
export const protocolSeries = {
	title: '14 industrial protocols, 5 communication patterns',
	hub: 'industrial-protocols-software-architecture',
	parts: [
		{ id: 'industrial-protocols-software-architecture', short: 'The guide: 14 protocols, 5 patterns' },
		{ id: 'industrial-protocol-read-patterns', short: 'Reading: polling, subscriptions, events, cyclic I/O' },
		{ id: 'industrial-protocol-write-control-semantics', short: 'Writing: acknowledged is not executed' },
		{ id: 'industrial-events-alarms-reliability', short: 'Events and alarms: delivery and recovery' },
		{ id: 'industrial-client-server-pubsub-roles', short: 'Roles: who is the client?' },
		{ id: 'industrial-real-time-ethernet-fieldbus', short: 'Real time: not just faster TCP' },
		{ id: 'industrial-protocol-session-recovery', short: 'Reconnecting is not recovering' },
		{ id: 'industrial-data-time-freshness-ordering', short: 'Time, freshness and ordering' },
		{ id: 'industrial-multiprotocol-gateway-architecture', short: 'Designing a multi-protocol gateway' },
	],
} as const;

export type SeriesPartId = (typeof protocolSeries.parts)[number]['id'];

/** Ids of the series posts that are built in this environment (drafts only in `astro dev`). */
export async function publishedSeriesIds(): Promise<Set<string>> {
	const ids = new Set((await getPosts()).map((p) => p.id));
	return new Set(protocolSeries.parts.map((p) => p.id).filter((id) => ids.has(id)));
}
