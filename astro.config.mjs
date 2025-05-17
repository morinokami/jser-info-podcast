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
	// TODO: 本番環境の URL を設定
	site: "https://example.com",
	integrations: [mcp({ editor: "cursor" })],
});
