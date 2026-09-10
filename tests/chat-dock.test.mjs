import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const source = await readFile(new URL('../chat-widget.js', import.meta.url), 'utf8');
const start = source.indexOf('  const DOCK_KEY =');
const end = source.indexOf('  // ---------- 选中文本', start);
const key = 'ai-worldline-chat-dock';

function harness(saved = new Map()) {
  const listeners = new Map(), fabListeners = new Map();
  const classes = () => {
    const values = new Set();
    return {
      toggle: (name, enabled) => enabled ? values.add(name) : values.delete(name),
      add: name => values.add(name), remove: name => values.delete(name),
      contains: name => values.has(name),
    };
  };
  const fab = { style: {}, offsetWidth: 56, classList: classes(),
    addEventListener: (type, fn) => fabListeners.set(type, fn),
    getBoundingClientRect: () => ({ left: parseFloat(fab.style.left), top: parseFloat(fab.style.top) }),
  };
  const panel = { style: {}, classList: classes(), setAttribute() {} };
  const window = { innerWidth: 1200, innerHeight: 800,
    addEventListener: (type, fn) => listeners.set(type, fn),
    removeEventListener: (type, fn) => { if (listeners.get(type) === fn) listeners.delete(type); },
  };
  const context = vm.createContext({ fab, panel, root: { classList: classes() }, window,
    localStorage: { getItem: key => saved.get(key), setItem: (key, value) => saved.set(key, value) },
    settingsForm: {}, refreshContextChip() {}, input: { focus() {} }, autosize() {},
  });
  vm.runInContext(source.slice(start, end), context);
  context.applyPosition();
  const event = (x, y) => ({ pointerId: 1, pointerType: 'mouse', button: 0, clientX: x, clientY: y, preventDefault() {} });
  return { context, fab, panel, window, listeners, saved, event,
    point: () => [parseFloat(fab.style.left), parseFloat(fab.style.top)],
    begin(offsetX = 17, offsetY = 11) {
      const rect = fab.getBoundingClientRect();
      fabListeners.get('pointerdown')(event(rect.left + offsetX, rect.top + offsetY));
    },
    drag(left, top) {
      this.begin();
      context.onDragMove(event(left + 17, top + 11));
      context.onDragEnd(event(left + 17, top + 11));
    },
  };
}

test('release stays at the actual drop position, preserving the grab offset without edge snapping', () => {
  const h = harness();
  for (const point of [[640, 470], [1020, 610], [310, 250], [40, 620]]) {
    h.drag(...point);
    assert.deepEqual(h.point(), point);
    assert.equal(h.fab.style.right, 'auto');
    assert.equal(h.fab.style.bottom, 'auto');
    assert.equal(h.panel.classList.contains('is-open'), false);
  }
});

test('final pointerup coordinates are applied even without a final pointermove', () => {
  const h = harness(); h.begin();
  h.context.onDragEnd(h.event(777 + 17, 555 + 11));
  assert.deepEqual(h.point(), [777, 555]);
});

test('free position survives reload and opening/closing the conversation', () => {
  const before = harness(); before.drag(760, 530);
  const h = harness(before.saved);
  assert.deepEqual(h.point(), [760, 530]);
  h.context.open(); h.context.close();
  assert.deepEqual(h.point(), [760, 530]);
  assert.equal(JSON.parse(h.saved.get(key)).version, 2);
});

test('viewport resizing retains relative placement and recovers the original position', () => {
  const h = harness(); h.drag(858, 558);
  h.window.innerWidth = 400; h.window.innerHeight = 500; h.fab.offsetWidth = 50;
  h.listeners.get('resize')();
  assert.deepEqual(h.point(), [263, 338]);
  h.window.innerWidth = 1200; h.window.innerHeight = 800; h.fab.offsetWidth = 56;
  h.listeners.get('resize')();
  assert.deepEqual(h.point(), [858, 558]);
});

test('screen boundaries constrain the whole avatar without a forced docking edge', () => {
  const h = harness(); h.drag(-500, -500);
  assert.deepEqual(h.point(), [12, 12]);
  h.drag(2000, 2000);
  assert.deepEqual(h.point(), [1132, 732]);
});

test('legacy bottom docking is restored at its previous height and can then be moved freely', () => {
  const h = harness(new Map([[key, JSON.stringify({ edge: 'bottom', ratio: .9 })]]));
  assert.deepEqual(h.point(), [1052, 724]);
  h.drag(600, 400);
  assert.deepEqual(h.point(), [600, 400]);
});

test('cancelled drag restores the last saved position; clicking still opens the assistant', () => {
  const h = harness(); h.drag(650, 450); h.begin();
  h.context.onDragMove(h.event(200, 200)); h.context.onDragCancel();
  assert.deepEqual(h.point(), [650, 450]);
  h.begin(); h.context.onDragEnd(h.event(667, 461));
  assert.equal(h.panel.classList.contains('is-open'), true);
  assert.deepEqual(h.point(), [650, 450]);
});

test('invalid saved coordinates fall back to a visible position', () => {
  const h = harness(new Map([[key, '{"version":2,"x":null,"y":"bad"}']]));
  assert(h.point().every(Number.isFinite));
  assert.deepEqual(h.point(), [1124, 696]);
});
