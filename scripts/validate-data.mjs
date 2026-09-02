import { readFile } from "node:fs/promises";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, resolve } from "node:path";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dataPath = resolve(root, "data/timeline.json");

function isRecord(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function requireText(value, path, errors) {
  if (typeof value !== "string" || !value.trim()) errors.push(`${path} must be a non-empty string`);
}

function checkUrl(value, path, errors) {
  if (!value) return;
  try {
    const parsed = new URL(value);
    if (!['http:', 'https:'].includes(parsed.protocol)) errors.push(`${path} must use http or https`);
  } catch {
    errors.push(`${path} is not a valid URL`);
  }
}

export function validateTimeline(data) {
  const errors = [];
  if (!isRecord(data)) return ["root must be an object"];

  if (!isRecord(data.meta)) errors.push("meta must be an object");
  else {
    requireText(data.meta.title, "meta.title", errors);
    requireText(data.meta.version, "meta.version", errors);
    requireText(data.meta.updatedAt, "meta.updatedAt", errors);
    requireText(data.meta.currentPeriod, "meta.currentPeriod", errors);
  }

  const laneIds = new Set(Object.keys(data.lanes || {}));
  const topicIds = new Set(Object.keys(data.topics || {}));
  if (!laneIds.size) errors.push("lanes must contain at least one lane");

  const periods = Array.isArray(data.periods) ? data.periods : [];
  const periodIds = new Set();
  periods.forEach((period, index) => {
    const path = `periods[${index}]`;
    requireText(period?.id, `${path}.id`, errors);
    requireText(period?.label, `${path}.label`, errors);
    if (periodIds.has(period?.id)) errors.push(`${path}.id duplicates ${period.id}`);
    periodIds.add(period?.id);
    if (period?.id && !/^\d{4}-H[12]$/.test(period.id)) errors.push(`${path}.id must match YYYY-H1 or YYYY-H2`);
  });

  if (data.meta?.currentPeriod && !periodIds.has(data.meta.currentPeriod)) {
    errors.push(`meta.currentPeriod references unknown period ${data.meta.currentPeriod}`);
  }

  const events = Array.isArray(data.events) ? data.events : [];
  const eventIds = new Set();
  events.forEach((event, index) => {
    const path = `events[${index}]`;
    ["id", "period", "date", "lane", "title", "short", "what", "why", "changed"].forEach((key) => {
      requireText(event?.[key], `${path}.${key}`, errors);
    });

    if (eventIds.has(event?.id)) errors.push(`${path}.id duplicates ${event.id}`);
    eventIds.add(event?.id);
    if (event?.id && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(event.id)) errors.push(`${path}.id must be kebab-case`);
    if (event?.period && !periodIds.has(event.period)) errors.push(`${path}.period references unknown period ${event.period}`);
    if (event?.lane && !laneIds.has(event.lane)) errors.push(`${path}.lane references unknown lane ${event.lane}`);
    if (event?.topic && !topicIds.has(event.topic)) errors.push(`${path}.topic references unknown topic ${event.topic}`);
    if (event?.date && !/^\d{4}-\d{2}-\d{2}$/.test(event.date)) errors.push(`${path}.date must match YYYY-MM-DD`);

    if (!Array.isArray(event?.concepts)) errors.push(`${path}.concepts must be an array`);
    if (!Array.isArray(event?.orgs)) errors.push(`${path}.orgs must be an array`);

    if (!Array.isArray(event?.sources) || !event.sources.length) {
      errors.push(`${path}.sources must contain at least one source`);
      return;
    }

    event.sources.forEach((source, sourceIndex) => {
      const sourcePath = `${path}.sources[${sourceIndex}]`;
      requireText(source?.title, `${sourcePath}.title`, errors);
      requireText(source?.publisher, `${sourcePath}.publisher`, errors);
      requireText(source?.type, `${sourcePath}.type`, errors);
      if (!source?.url && !source?.fullText) errors.push(`${sourcePath} must include url or fullText`);
      checkUrl(source?.url, `${sourcePath}.url`, errors);
      checkUrl(source?.fullText, `${sourcePath}.fullText`, errors);
    });
  });

  return errors;
}

export async function readTimeline() {
  return JSON.parse(await readFile(dataPath, "utf8"));
}

async function main() {
  const data = await readTimeline();
  const errors = validateTimeline(data);
  if (errors.length) {
    console.error(`Timeline validation failed with ${errors.length} error(s):`);
    errors.forEach((error) => console.error(`- ${error}`));
    process.exitCode = 1;
    return;
  }

  const sourceUrls = new Set(data.events.flatMap((event) => event.sources.map((source) => source.url || source.fullText)));
  const worldModels = data.events.filter((event) => event.topic === "world-model");
  console.log(`Validated ${data.events.length} events, ${sourceUrls.size} sources, ${worldModels.length} world-model entries.`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) await main();
