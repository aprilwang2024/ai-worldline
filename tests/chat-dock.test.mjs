import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const source = await readFile(new URL('../chat-widget.js', import.meta.url), 'utf8');
const styles = await readFile(new URL('../styles.css', import.meta.url), 'utf8');
const baseline = styles.match(/\.ai-chat-fab\s*\{([^}]+)\}/)[1];
const cssTop = baseline.match(/\btop:\s*([^;]+)/)[1];
const cssRight = baseline.match(/\bright:\s*([^;]+)/)[1];
const start = source.indexOf('  const DOCK_KEY =');
const end = source.indexOf('  // ---------- 选中文本', start);

function harness(saved = new Map()) {
  const listeners = new Map();
  const classes = () => {
    const values = new Set();
    return {
      toggle: (name, enabled) => enabled ? values.add(name) : values.delete(name),
      add: name => values.add(name), remove: name => values.delete(name),
      contains: name => values.has(name),
    };
  };
  const fab = { style: {}, offsetWidth: 56, classList: classes(), addEventListener() {} };
  const panel = { style: {}, classList: classes(), setAttribute() {} };
  const window = { innerWidth: 1200, innerHeight: 800, setTimeout() {},
    addEventListener: (type, fn) => listeners.set(type, fn), removeEventListener() {} };
  const context = vm.createContext({ fab, panel, root: { classList: classes() }, window,
    localStorage: { getItem: key => saved.get(key), setItem: (key, value) => saved.set(key, value) },
    settingsForm: {}, refreshContextChip() {}, input: { focus() {} }, autosize() {},
  });
  vm.runInContext(source.slice(start, end), context);
  context.applyDock();
  return { context, fab, window, listeners, saved,
    drag(x, y) {
      vm.runInContext('dragState = { pointerId: 1, moved: true };', context);
      context.onDragEnd({ pointerId: 1, clientX: x, clientY: y });
    },
    // Resolves the fixed-size element's vertical position against the real CSS fallback.
    // When top and bottom are both specified, top wins: the original regression.
    top() {
      const top = fab.style.top || cssTop;
      if (top !== 'auto') return top.endsWith('%') ? parseFloat(top) * window.innerHeight / 100 : parseFloat(top);
      return window.innerHeight - fab.offsetWidth - parseFloat(fab.style.bottom);
    },
  };
}

test('dragging toward the bottom-right keeps the avatar at the bottom, not CSS top:60%', () => {
  const h = harness();
  h.drag(1100, 780);
  assert.equal(h.top(), 724);
  assert.equal(h.fab.style.top, 'auto');
  assert.equal(h.fab.style.right, 'auto');
  assert.equal(h.fab.style.bottom, '20px');
  assert.notEqual(h.top(), 480);
});

test('bottom docking survives refresh, chat open/close, and viewport resize', () => {
  const before = harness(); before.drag(1100, 780);
  const h = harness(before.saved);
  assert.equal(h.top(), 724);
  h.context.open(); h.context.close();
  assert.equal(h.top(), 724);
  h.window.innerHeight = 600; h.listeners.get('resize')();
  assert.equal(h.top(), 524);
});

test('switching among all four edges cancels the opposite anchors', () => {
  const h = harness();
  for (const [x, y, edge, opposite] of [
    [1100, 780, 'bottom', 'top'], [20, 300, 'left', 'right'],
    [600, 20, 'top', 'bottom'], [1180, 700, 'right', 'left'],
  ]) {
    h.drag(x, y);
    assert.equal(h.fab.style[edge], '20px');
    assert.equal(h.fab.style[opposite], 'auto');
  }
  assert.equal(cssRight, '20px');
});
