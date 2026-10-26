import { getPosts } from '../data/blog';
import { docSection, getDocs, mdxToMarkdown, organizationSection, postSection, projectSection, protocolSection } from '../data/llms';
import { getOrganizations } from '../data/organizations';
import { getProjects } from '../data/projects';
import { getStandards } from '../data/standards';
import { longDescription } from '../data/seo';
import { site } from '../data/site';
import about from './about.mdx?raw';

// Every page's text in one file, each section headed by its title and canonical URL.
export async function GET() {
	const protocols = await Promise.all((await getStandards()).map(protocolSection));
	const docs = await getDocs();
	const projects = (await getProjects()).filter((p) => p.data.status === 'available').map(projectSection);
	const posts = (await getPosts()).map(postSection);
	const organizations = (await getOrganizations()).filter((o) => o.data.detail).map(organizationSection);
	const aboutPage = [`# About OT Fabric`, `URL: ${site.url}/about/`, mdxToMarkdown(about)].join('\n\n');

	const text =
		[`# ${site.name}\n\n> ${longDescription}`, aboutPage, ...protocols, ...docs.map((d) => docSection(d, docs)), ...projects, ...organizations, ...posts].join('\n\n---\n\n') + '\n';
	return new Response(text, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
