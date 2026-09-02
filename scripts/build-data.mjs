import { writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { readTimeline, validateTimeline } from "./validate-data.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const outputPath = resolve(root, "timeline-data.js");
const data = await readTimeline();
const errors = validateTimeline(data);

if (errors.length) {
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

const banner = `/*\n * GENERATED FILE — do not edit directly.\n * Edit data/timeline.json, then run: npm run build:data\n */`;
const output = `${banner}\n\nwindow.AI_WORLDLINE_DATA = ${JSON.stringify(data, null, 2)};\n`;

await writeFile(outputPath, output, "utf8");
console.log(`Generated timeline-data.js from data/timeline.json (${data.events.length} events).`);
