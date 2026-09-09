import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, cp, mkdir, readFile, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { validateDraft } from '../scripts/draft-candidates.mjs';
import { periodFromdate } from '../scripts/inbox-lib.mjs';
import { readTimeline, validateTimeline } from '../scripts/validate-data.mjs';

const url = 'https://example.org/Paper';
const fixture = () => ({ id: 'new-research', date: '2026-09-09', lane: 'tech', importance: 'normal', status: 'watching', title: '研究', short: '摘要', what: '事实', why: '意义', changed: '变化', topics: ['world-model'], concepts: [], orgs: [], sources: [{ title: 'Paper', publisher: 'Lab', type: 'paper', url }] });
const validate = draft => validateDraft(draft, new Set(), new Set([url]), new Set(), new Set(['world-model'])).errors;

test('valid source-backed draft uses canonical status and importance', () => assert.deepEqual(validate(fixture()), []));
test('rejects invented full-text links and case-altered source paths', () => {
  const draft = fixture(); draft.sources[0].fullText = 'https://invented.example/fake.pdf';
  assert(validate(draft).some(error => error.includes('fullText')));
  delete draft.sources[0].fullText; draft.sources[0].url = url.toLowerCase();
  assert(validate(draft).some(error => error.includes('候选给出的链接')));
});
test('rejects null, invalid dates, taxonomy and source metadata', () => {
  assert(validate(null).length);
  for (const patch of [{ date: '2026-02-30' }, { date: '2026-13-01' }, { topics: ['invented'] }, { importance: 'watching' }, { sources: [{ url }] }]) {
    assert(validate({ ...fixture(), ...patch }).length, JSON.stringify(patch));
  }
  assert.equal(periodFromdate('2024-02-29'), '2024-H1');
  assert.equal(periodFromdate('2025-02-29'), null);
});
test('timeline validator catches incorrect draft lifecycle and period before publishing', async () => {
  const timeline = await readTimeline();
  timeline.events.push({ ...fixture(), period: '2026-H1', importance: 'watching' });
  const errors = validateTimeline(timeline);
  assert(errors.some(error => error.includes('importance')));
  assert(errors.some(error => error.includes('period must match')));
});
test('empty collection cannot replay cached candidates or drafts', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'worldline-pipeline-test-'));
  try {
    await cp(new URL('../scripts/', import.meta.url), join(dir, 'scripts'), { recursive: true });
    await mkdir(join(dir, 'data/inbox'), { recursive: true });
    const timeline = await readFile(new URL('../data/timeline.json', import.meta.url), 'utf8');
    await writeFile(join(dir, 'data/timeline.json'), timeline);
    const day = new Date().toISOString().slice(0, 10);
    const json = (path, data) => writeFile(join(dir, path), JSON.stringify(data));
    await json('scripts/watchlist.json', { feeds: [{ id: 'test-feed', type: 'rss', url: 'https://fixture.invalid/rss' }], keywords: [], majorOrgs: [], limitPerRun: 10 });
    await json('data/inbox/state.json', { feeds: { 'test-feed': { seen: [url.toLowerCase()] } } });
    await json(`data/inbox/candidates-${day}.json`, [{ title: 'stale', url }]);
    await json(`data/inbox/draft-events-${day}.json`, { events: [fixture()] });
    await writeFile(join(dir, 'fixture.mjs'), `globalThis.fetch = async () => ({ ok: true, text: async () => '<rss><item><title>Paper</title><link>${url}</link><pubDate>invalid date</pubDate></item></rss>' });`);
    for (const script of ['collect-sources.mjs', 'dedupe-candidates.mjs', 'draft-candidates.mjs', 'build-candidate-branch.mjs']) {
      const result = spawnSync(process.execPath, ['--import', './fixture.mjs', `scripts/${script}`], { cwd: dir, encoding: 'utf8', env: { ...process.env, LLM_API_KEY: '' } });
      assert.equal(result.status, 0, result.stderr || result.stdout);
    }
    assert.deepEqual(JSON.parse(await readFile(join(dir, `data/inbox/candidates-${day}.json`))), []);
    assert.deepEqual(JSON.parse(await readFile(join(dir, `data/inbox/draft-events-${day}.json`))).events, []);
    assert.equal(await readFile(join(dir, 'data/timeline.json'), 'utf8'), timeline);
  } finally { await rm(dir, { recursive: true, force: true }); }
});
