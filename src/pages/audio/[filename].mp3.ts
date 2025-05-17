export const prerender = false;

import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ params, request, locals }) => {
	const { env } = locals.runtime;
	const { filename } = params;
	if (!filename) {
		return new Response("Not found 1", { status: 404 });
	}

	console.log(await env.AUDIO.list());
	const headObj = await env.AUDIO.head(`${filename}.mp3`);
	if (!headObj) {
		return new Response("Not found 2", { status: 404 });
	}
	const totalSize = headObj.size;

	const range = parseHttpRange(request.headers.get("Range"), totalSize);
	const obj = await env.AUDIO.get(`${filename}.mp3`, {
		range: range.r2Range,
	});
	if (!obj) {
		return new Response("Not found 3", { status: 404 });
	}

	const headers = new Headers();
	obj.writeHttpMetadata(headers);
	headers.set("Content-Type", "audio/mpeg");
	headers.set("Accept-Ranges", "bytes");
	if (range.r2Range) {
		headers.set(
			"Content-Range",
			`bytes ${range.start}-${range.end}/${totalSize}`,
		);
		headers.set("Content-Length", range.length.toString());
	} else {
		headers.set("Content-Length", totalSize.toString());
	}

	return new Response(obj.body, { status: range.r2Range ? 206 : 200, headers });
};

function parseHttpRange(
	h: string | null,
	size: number,
): {
	r2Range: R2Range | undefined;
	start?: number;
	end?: number;
	length: number;
} {
	if (!h || !h.startsWith("bytes="))
		return { r2Range: undefined, length: size };

	// bytes=0-999 / bytes=0- / bytes=-500
	const [startStr, endStr] = h.substring(6).split("-");
	const start = startStr ? Number(startStr) : undefined;
	const end = endStr ? Number(endStr) : undefined;

	if (start !== undefined && end !== undefined) {
		const length = end - start + 1;
		return { r2Range: { offset: start, length }, start, end, length };
	}
	if (start !== undefined) {
		// bytes=100-
		const length = size - start;
		return { r2Range: { offset: start }, start, end: size - 1, length };
	}
	if (end !== undefined) {
		// bytes=-500
		const length = end;
		return {
			r2Range: { suffix: end },
			start: size - end,
			end: size - 1,
			length,
		};
	}
	return { r2Range: undefined, length: size };
}
