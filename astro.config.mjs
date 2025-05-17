// @ts-check
import { defineConfig } from "astro/config";

import cloudflare from "@astrojs/cloudflare";

import mcp from "astro-mcp";

// https://astro.build/config
export default defineConfig({
	adapter: cloudflare({
		platformProxy: {
			enabled: true,
		},
	}),
	site: "https://jser-info-podcast.org",
	integrations: [mcp({ editor: "cursor" })],
});
