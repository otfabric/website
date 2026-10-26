import type { APIRoute, GetStaticPaths } from 'astro';
import { protocolBundle } from '../../data/llms';
import { getStandards, type Standard } from '../../data/standards';

// /llms/<id>.txt: one protocol's or model's pages in one file, small enough for an LLM's context.
export const getStaticPaths = (async () =>
	(await getStandards()).map((standard) => ({ params: { protocol: standard.id }, props: { standard } }))) satisfies GetStaticPaths;

export const GET: APIRoute = async ({ props }) =>
	new Response(await protocolBundle((props as { standard: Standard }).standard), {
		headers: { 'Content-Type': 'text/plain; charset=utf-8' },
	});
