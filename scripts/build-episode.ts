// `node scripts/build-episode.js -n 1 -i 2025-05-11` という感じで使う

import { execSync } from "node:child_process";
import fs from "node:fs";

import { parseArgs } from "node:util";

const options = {
	number: {
		type: "string",
		short: "n",
	},
	input: {
		type: "string",
		short: "i",
	},
} as const;

const {
	values: { number, input },
} = parseArgs({ options });

if (!number || !input) {
	throw new Error("number and input are required");
}

const audioPath = `./public/audio/${input}.mp3`;
// 四捨五入
const duration = Math.round(
	Number(
		execSync(
			`ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 ${audioPath}`,
		)
			.toString()
			.trim(),
	),
);
const size = fs.statSync(audioPath).size;

const episode = {
	number,
	created: input,
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
