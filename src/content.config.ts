import { defineCollection, z } from 'astro:content';
import { file, glob } from 'astro/loaders';
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';

const protocolIds = ['modbus', 'opc-ua', 'bacnet', 'iec-104', 'iec-61850', 's7', 'sunspec', 'openadr', 'ocpp', 'dnp3', 'ieee-2030-5', 'ethernet-ip'] as const;

// Standards and alliances directory (src/data/organizations.json). "Open" and "free"
// are split into separate questions, and every answer that states a fact must cite
// the page it came from. unknown = we could not establish it, notPublished = the
// organization does not publish it, notApplicable = the question does not apply.
const day = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Use YYYY-MM-DD');
const answer = z.enum(['yes', 'partial', 'no', 'unknown', 'notPublished', 'notApplicable']);
const claim = z
	.object({ answer, detail: z.string(), source: z.string().url().optional(), verifiedAt: day.optional() })
	.refine((c) => !['yes', 'partial', 'no'].includes(c.answer) || c.source, { message: 'A yes, partial or no answer needs a source' });
const fee = z.discriminatedUnion('kind', [
	z.object({
		kind: z.literal('amount'),
		amount: z.number().nonnegative(),
		max: z.number().positive().optional(),
		currency: z.enum(['USD', 'EUR', 'CHF']),
		// unstated: the organization does not say whether the fee recurs.
		period: z.enum(['year', 'calendar-year', 'unstated']),
	}),
	z.object({ kind: z.enum(['free', 'onRequest', 'notPublished', 'unknown']) }),
]);
const audience = z.enum(['anyone', 'individual', 'student', 'academic', 'company', 'startup', 'end-user', 'nonprofit', 'government', 'liaison']);
const link = z.object({ label: z.string(), url: z.string().url() });

export const collections = {
	// Documentation, rendered by Starlight under /docs/.
	docs: defineCollection({ loader: docsLoader(), schema: docsSchema() }),

	// Protocol landing pages at /protocols/<id>/.
	protocols: defineCollection({
		loader: glob({ pattern: '*.mdx', base: './src/content/protocols' }),
		schema: z.object({
			name: z.string(),
			standard: z.string(),
			summary: z.string(),
			order: z.number(),
			facts: z.array(z.object({ label: z.string(), value: z.string() })),
			icon: z.string().optional(),
			docs: z.string().optional(),
		}),
	}),

	// Projects (libraries, tools, suites, planned work) at /projects/.
	projects: defineCollection({
		loader: file('./src/data/projects.json'),
		schema: z.object({
			name: z.string(),
			category: z.enum(['library', 'cli', 'transport', 'discovery', 'interop', 'ui', 'mcp', 'gateway']),
			description: z.string(),
			protocols: z.array(z.enum(protocolIds)),
			status: z.enum(['available', 'planned']),
			repo: z.string().optional(),
			install: z.string().optional(),
			icon: z.string().optional(),
			// Short feature list shown on the project page.
			highlights: z.array(z.string()).optional(),
		}),
	}),

	// Standards bodies, alliances, user groups and open-source foundations at /ecosystem/organizations/.
	organizations: defineCollection({
		loader: file('./src/data/organizations.json'),
		schema: z.object({
			name: z.string(),
			acronym: z.string().optional(),
			kind: z.enum(['standards-body', 'industry-alliance', 'user-group', 'oss-foundation', 'professional-society']),
			summary: z.string().max(160),
			description: z.string(),
			website: z.string().url(),
			region: z.enum(['global', 'europe', 'north-america', 'asia-pacific']),
			domains: z.array(z.enum(['energy', 'industrial', 'buildings', 'ev-charging'])).min(1),
			protocols: z.array(z.enum(protocolIds)),
			standards: z.array(
				z.object({
					name: z.string(),
					role: z.enum(['publishes', 'maintains', 'certifies', 'tests', 'promotes', 'hosts-oss']),
					note: z.string().optional(),
				}),
			),
			// Each question is answered so that "yes" means open or free to an outsider.
			access: z.object({
				specifications: claim,
				community: claim,
				individualFree: claim,
				organizationFree: claim,
				workingGroups: claim,
				interopTesting: claim,
				certification: claim,
				openSource: claim,
			}),
			memberships: z.array(
				z.object({
					name: z.string(),
					audience,
					fee,
					eligibility: z.string().optional(),
					voting: answer.optional(),
					workingGroups: answer.optional(),
					note: z.string().optional(),
					source: z.string().url(),
				}),
			),
			programs: z.array(
				z.object({
					kind: z.enum(['certification', 'conformance-testing', 'test-tool', 'plugfest', 'interop-event']),
					name: z.string(),
					url: z.string().url().optional(),
					detail: z.string(),
					openToNonMembers: answer,
					source: z.string().url(),
				}),
			),
			// Open-source code the organization maintains or hosts; implementation links the ecosystem map entry.
			openSource: z.array(z.object({ name: z.string(), url: z.string().url(), implementation: z.string().optional() })),
			// Governance, IP and contribution documents.
			documents: z.array(link).default([]),
			relatedProjects: z.array(z.string()),
			related: z.array(z.object({ id: z.string(), relation: z.string() })),
			sources: z.array(link).min(1),
			verifiedAt: day,
			// Organizations with a page of their own at /ecosystem/organizations/<id>/.
			detail: z.boolean().default(false),
			// OT Fabric's own notes for the detail page, kept apart from the sourced facts.
			insights: z.array(z.string()).default([]),
		}),
	}),

	// Blog posts at /blog/<id>/.
	blog: defineCollection({
		loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
		schema: ({ image }) =>
			z.object({
				title: z.string(),
				description: z.string(),
				date: z.coerce.date(),
				updated: z.coerce.date().optional(),
				authors: z.array(z.string()).default(['OT Fabric']),
				tags: z.array(z.string()).default([]),
				cover: z.object({ image: image(), alt: z.string() }).optional(),
				featured: z.boolean().default(false),
				draft: z.boolean().default(false),
			}),
	}),
};
