/**
 * Builtin segment tests
 */

const { test, describe } = require('node:test');
const assert = require('node:assert');
const { getModel } = require('../lib/segments/model');
const { getDirectory } = require('../lib/segments/directory');
const { getContextWindow } = require('../lib/segments/context-window');
const { getCost, formatCost } = require('../lib/segments/cost');
const { getSessionDuration, formatDuration } = require('../lib/segments/session');
const { getUsage, formatNumber } = require('../lib/segments/usage');
const { getOutputStyle } = require('../lib/segments/output-style');
const { createBuiltinRegistry } = require('../lib/segments/builtins');

describe('builtins', () => {
  describe('getModel', () => {
    test('returns display_name when available', () => {
      const ctx = { model: { display_name: 'Opus', id: 'claude-opus' } };
      assert.strictEqual(getModel(ctx), 'Opus');
    });

    test('returns id when display_name not available', () => {
      const ctx = { model: { id: 'claude-sonnet' } };
      assert.strictEqual(getModel(ctx), 'claude-sonnet');
    });

    test('returns null when model missing', () => {
      assert.strictEqual(getModel({}), null);
      assert.strictEqual(getModel({ model: {} }), null);
    });
  });

  describe('getDirectory', () => {
    test('returns directory name from workspace', () => {
      const ctx = { workspace: { current_dir: '/home/user/projects/myapp' } };
      assert.strictEqual(getDirectory(ctx), 'myapp');
    });

    test('falls back to cwd', () => {
      const ctx = { cwd: '/home/user/projects/myapp' };
      assert.strictEqual(getDirectory(ctx), 'myapp');
    });

    test('returns null when no directory', () => {
      assert.strictEqual(getDirectory({}), null);
    });
  });

  describe('getContextWindow', () => {
    test('calculates percentage correctly', () => {
      const ctx = {
        context_window: {
          context_window_size: 200000,
          current_usage: {
            input_tokens: 50000,
            cache_creation_input_tokens: 10000,
            cache_read_input_tokens: 5000
          }
        }
      };
      // (50000 + 10000 + 5000) / 200000 = 32.5% -> 33%
      assert.strictEqual(getContextWindow(ctx), '33%');
    });

    test('returns 0% when no usage data', () => {
      const ctx = { context_window: { context_window_size: 200000 } };
      assert.strictEqual(getContextWindow(ctx), '0%');
    });

    test('returns 0% when no context_window', () => {
      assert.strictEqual(getContextWindow({}), '0%');
    });
  });

  describe('formatCost', () => {
    test('formats cost with 4 decimal places', () => {
      assert.strictEqual(formatCost(0.01234), '$0.0123');
      assert.strictEqual(formatCost(1.5), '$1.5000');
      assert.strictEqual(formatCost(0), '$0.0000');
    });

    test('handles null/undefined', () => {
      assert.strictEqual(formatCost(null), '$0.0000');
      assert.strictEqual(formatCost(undefined), '$0.0000');
    });
  });

  describe('getCost', () => {
    test('returns formatted cost', () => {
      const ctx = { cost: { total_cost_usd: 0.01234 } };
      assert.strictEqual(getCost(ctx), '$0.0123');
    });

    test('returns null when cost missing', () => {
      assert.strictEqual(getCost({}), null);
      assert.strictEqual(getCost({ cost: {} }), null);
    });
  });

  describe('formatDuration', () => {
    test('formats seconds', () => {
      assert.strictEqual(formatDuration(5000), '5s');
      assert.strictEqual(formatDuration(59000), '59s');
    });

    test('formats minutes and seconds', () => {
      assert.strictEqual(formatDuration(65000), '1m05s');
      assert.strictEqual(formatDuration(125000), '2m05s');
    });

    test('formats hours and minutes', () => {
      assert.strictEqual(formatDuration(3661000), '1h01m');
    });

    test('handles zero/negative', () => {
      assert.strictEqual(formatDuration(0), '0s');
      assert.strictEqual(formatDuration(-100), '0s');
    });
  });

  describe('formatNumber', () => {
    test('formats small numbers', () => {
      assert.strictEqual(formatNumber(0), '0');
      assert.strictEqual(formatNumber(500), '500');
      assert.strictEqual(formatNumber(999), '999');
    });

    test('formats thousands with K', () => {
      assert.strictEqual(formatNumber(1000), '1.0K');
      assert.strictEqual(formatNumber(1500), '1.5K');
      assert.strictEqual(formatNumber(999999), '1000.0K');
    });

    test('formats millions with M', () => {
      assert.strictEqual(formatNumber(1000000), '1.0M');
      assert.strictEqual(formatNumber(2500000), '2.5M');
    });
  });

  describe('getUsage', () => {
    test('returns formatted usage', () => {
      const ctx = {
        context_window: {
          total_input_tokens: 15000,
          total_output_tokens: 5000
        }
      };
      assert.strictEqual(getUsage(ctx), 'I:15.0K O:5.0K');
    });

    test('returns null when no tokens', () => {
      const ctx = { context_window: { total_input_tokens: 0, total_output_tokens: 0 } };
      assert.strictEqual(getUsage(ctx), null);
    });
  });

  describe('getOutputStyle', () => {
    test('returns style name', () => {
      const ctx = { output_style: { name: 'default' } };
      assert.strictEqual(getOutputStyle(ctx), 'default');
    });

    test('returns null when missing', () => {
      assert.strictEqual(getOutputStyle({}), null);
    });
  });

  describe('createBuiltinRegistry', () => {
    test('creates registry with all 8 builtins', () => {
      const registry = createBuiltinRegistry();
      assert.strictEqual(typeof registry.model, 'function');
      assert.strictEqual(typeof registry.directory, 'function');
      assert.strictEqual(typeof registry.git, 'function');
      assert.strictEqual(typeof registry.context_window, 'function');
      assert.strictEqual(typeof registry.usage, 'function');
      assert.strictEqual(typeof registry.cost, 'function');
      assert.strictEqual(typeof registry.session, 'function');
      assert.strictEqual(typeof registry.output_style, 'function');
    });
  });
});
