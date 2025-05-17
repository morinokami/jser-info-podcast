import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const episodes = defineCollection({
	loader: glob({
		pattern: "**/*.json",
		base: "./src/episodes",
	}),
	schema: z.object({
		id: z.number(),
		description: z.string(),
		created: z.string(),
		source: z.string(),
		audio: z.object({
			size: z.number(),
			duration: z.number(),
		}),
	}),
});

export const collections = {
	episodes,
};
