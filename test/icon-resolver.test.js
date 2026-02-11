/**
 * Icon resolver tests
 */

const { test, describe } = require('node:test');
const assert = require('node:assert');
const { resolveIcon } = require('../lib/render/icon-resolver');

describe('icon-resolver', () => {
  describe('resolveIcon', () => {
    test('returns string icon as-is', () => {
      assert.strictEqual(resolveIcon('🤖', 'plain'), '🤖');
      assert.strictEqual(resolveIcon('🤖', 'nerd_font'), '🤖');
      assert.strictEqual(resolveIcon('custom', 'plain'), 'custom');
    });

    test('returns nerd_font icon when available', () => {
      const icon = { nerd_font: '', plain: '🤖' };
      assert.strictEqual(resolveIcon(icon, 'nerd_font'), '');
    });

    test('returns plain icon for plain mode', () => {
      const icon = { nerd_font: '', plain: '🤖' };
      assert.strictEqual(resolveIcon(icon, 'plain'), '🤖');
    });

    test('falls back to nerd_font if plain not available', () => {
      const icon = { nerd_font: '' };
      assert.strictEqual(resolveIcon(icon, 'plain'), '');
    });

    test('falls back to plain if nerd_font not available', () => {
      const icon = { plain: '🤖' };
      assert.strictEqual(resolveIcon(icon, 'nerd_font'), '🤖');
    });

    test('returns empty string for null/undefined', () => {
      assert.strictEqual(resolveIcon(null, 'plain'), '');
      assert.strictEqual(resolveIcon(undefined, 'plain'), '');
    });

    test('returns empty string for empty object', () => {
      assert.strictEqual(resolveIcon({}, 'plain'), '');
      assert.strictEqual(resolveIcon({}, 'nerd_font'), '');
    });
  });
});
