import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const root = new URL('../', import.meta.url);
async function request(type, model, options = {}) {
  const source = await readFile(new URL(type === 'chat' ? 'chat-widget.js' : 'starfield.js', root), 'utf8');
  const name = type === 'chat' ? 'requestCompletion' : 'callLLM';
  const start = source.indexOf(`  async function ${name}(`);
  const end = source.indexOf(type === 'chat' ? '\n  // ---------- 界面' : '\n  function extractJsonObject', start);
  assert(start >= 0 && end > start);
  let payload;
  const settings = { endpoint: 'https://fixture.invalid/v1', model, apiKey: '' };
  const context = vm.createContext({
    settings, controller: null, AbortController, AbortSignal,
    loadSettings: () => settings, generationModel: () => model,
    fetch: async (url, init) => {
      assert.equal(url, 'https://fixture.invalid/v1/chat/completions');
      payload = JSON.parse(init.body);
      // Model contract reported by Moonshot: omitted/default or 1, never 0.4/0.55/0.7.
      const accepted = payload.temperature === undefined || payload.temperature === 1;
      return { ok: accepted, status: accepted ? 200 : 400,
        headers: { get: () => 'application/json' },
        text: async () => 'invalid temperature: only 1 is allowed for this model',
        json: async () => ({ choices: [{ message: { content: 'fixture answer' } }] }),
      };
    },
  });
  vm.runInContext(source.slice(start, end), context);
  let answer = '';
  const onDelta = value => { answer += value; };
  const messages = [{ role: 'user', content: 'fixture question' }];
  if (type === 'chat') await context[name](messages, onDelta);
  else await context[name](messages, { ...options, onDelta });
  assert.equal(answer, 'fixture answer');
  assert.equal(payload.model, model);
  assert.equal(payload.stream, true);
  return payload;
}

for (const model of ['kimi-k2.6', 'kimi-k3', 'kimi-k2.7-code', 'kimi-k2.7-code-highspeed']) {
  test(`${model}: chat, graph generation, and expansion satisfy the provider contract`, async () => {
    await request('chat', model);
    await request('starfield', model, { temperature: 0.55 });
    await request('starfield', model, { temperature: 0.7 });
  });
}
test('Qwen graph requests retain non-thinking mode', async () => {
  assert.equal((await request('starfield', 'qwen3.7-plus')).enable_thinking, false);
});
test('model access errors are distinguished from missing endpoints', async () => {
  const source = await readFile(new URL('chat-widget.js', root), 'utf8');
  const start = source.indexOf('  function describeError(');
  const context = vm.createContext({ TypeError });
  vm.runInContext(source.slice(start, source.indexOf('  async function requestCompletion(', start)), context);
  assert.match(context.describeError({ message: 'HTTP 404 — Not found the model kimi-k2.5 or Permission denied' }), /^模型不可用或无访问权限/);
  assert.match(context.describeError({ message: 'HTTP 404 — Not Found' }), /^请求的 API 路径不存在/);
  assert.match(context.describeError({ message: 'HTTP 401 — Unauthorized' }), /^请求被拒绝/);
});
