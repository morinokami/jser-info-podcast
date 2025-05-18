// @ts-check
import cloudflare from "@astrojs/cloudflare";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

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
	vite: {
		// @ts-ignore
		plugins: [tailwindcss()],
	},
});
