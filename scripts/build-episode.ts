// `node scripts/build-episode.js -n 1 -i 2025-05-11` という感じで使う

import { execSync } from "node:child_process";
import fs from "node:fs";

import { parseArgs } from "node:util";

const options = {
	number: {
		type: "string",
		short: "n",
	},
	audio: {
		type: "string",
		short: "i",
	},
} as const;

const {
	values: { number, audio },
} = parseArgs({ options });

if (!number || !audio) {
	throw new Error("number and audio are required");
}

const created = audio.split("/").pop()?.split(".")[0];
if (!created) {
	throw new Error("filename is not valid");
}

// 四捨五入
const duration = Math.round(
	Number(
		execSync(
			`ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 ${audio}`,
		)
			.toString()
			.trim(),
	),
);
const size = fs.statSync(audio).size;

const episode = {
	id: Number(number),
	created,
	source: "TODO:",
	description: "TODO:",
	audio: {
		size,
		duration,
	},
};

fs.writeFileSync(
	`./src/episodes/${number}.json`,
	JSON.stringify(episode, null, 2),
);
