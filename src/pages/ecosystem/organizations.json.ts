import { getOrganizations, REVIEW_DAYS } from '../../data/organizations';
import { site } from '../../data/site';

// The standards and alliances directory as one JSON document, so tools, researchers
// and AI agents can reuse it without scraping the page.
export async function GET() {
	const orgs = await getOrganizations();
	const body = {
		title: 'Industrial protocol standards and alliances',
		url: `${site.url}/ecosystem/organizations/`,
		source: 'https://github.com/otfabric/website/blob/main/src/data/organizations.json',
		license: 'MIT',
		notes: [
			'Listing an organization does not imply membership, endorsement or any relationship with OT Fabric.',
			'Each access answer reads so that "yes" means open or free to someone who is not a member.',
			'unknown: we could not establish it. notPublished: the organization does not publish it. notApplicable: the question does not apply.',
			`Fees are published examples, checked by hand at the source on verifiedAt and due for a re-check after ${REVIEW_DAYS} days.`,
		],
		organizations: orgs.map((o) => ({ id: o.id, ...o.data })),
	};
	return new Response(JSON.stringify(body, null, '\t'), { headers: { 'Content-Type': 'application/json; charset=utf-8' } });
}
