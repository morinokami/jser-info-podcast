import rss from "@astrojs/rss";
import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import path from "node:path";

const podcast = {
	title: "JSer.info を語りたい",
	description:
		"「JSer.info を語りたい」は、JSer.info で紹介されている各情報について、NotebookLM を用いて深堀りして語るポッドキャスト番組です。",
	language: "ja-JP",
	category: "Technology",
	author: "morinokami",
	email: "shf0811@gmail.com",
} as const;

export const GET: APIRoute = async (context) => {
	const episodes = await getCollection("episodes");

	return rss({
		xmlns: {
			atom: "http://www.w3.org/2005/Atom",
			itunes: "http://www.itunes.com/dtds/podcast-1.0.dtd",
		},
		title: podcast.title,
		description: podcast.description,
		site: String(context.site),
		customData: `
			<language>${podcast.language}</language>
			<category>${podcast.category}</category>
			<image>
				<url>${path.join(String(context.site), "cover.png")}</url>
				<title>${podcast.title}</title>
				<link>${context.site}</link>
			</image>
			<atom:link href="${path.join(String(context.site), "rss.xml")}" rel="self" type="application/rss+xml"/>
			<itunes:author>${podcast.author}</itunes:author>
			<itunes:subtitle>${podcast.description}</itunes:subtitle>
			<itunes:image href="${path.join(String(context.site), "images/cover.png")}"/>
			<itunes:explicit>false</itunes:explicit>
			<itunes:owner>
				<itunes:name>${podcast.author}</itunes:name>
				<itunes:email>${podcast.email}</itunes:email>
			</itunes:owner>
			<itunes:category text="${podcast.category}"/>
		`,
		items: episodes.map((episode) => {
			const n = path.basename(episode.filePath ?? "").replace(".json", "");
			const pubDate = new Date(`${episode.data.created}T19:00:00.000+09:00`);
			const link = path.join(String(context.site), `episodes/${n}`);
			const audioUrl = path.join(
				String(context.site),
				`audio/${episode.data.created}.mp3`,
			);

			return {
				title: `${n}. ${episode.data.created} の JSer.info`,
				description: episode.data.description,
				pubDate: pubDate,
				link: link,
				enclosure: {
					url: audioUrl,
					length: episode.data.audio.size,
					type: "audio/mpeg",
				},
				customData: `
					<guid>${audioUrl}</guid>
					<itunes:author>${podcast.author}</itunes:author>
					<itunes:subtitle>${episode.data.created} の JSer.info について語ります。</itunes:subtitle>
					<itunes:duration>${episode.data.audio.duration}</itunes:duration>
					<itunes:explicit>false</itunes:explicit>
				`,
			};
		}),
	});
};
