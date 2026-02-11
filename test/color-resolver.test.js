/**
 * Color resolver tests
 */

const { test, describe } = require('node:test');
const assert = require('node:assert');
const { resolveColor, resolveStyle, NAMED_COLORS } = require('../lib/render/color-resolver');

describe('color-resolver', () => {
  describe('resolveColor', () => {
    describe('named colors', () => {
      test('resolves basic color names', () => {
        assert.strictEqual(resolveColor('red'), '\x1b[31m');
        assert.strictEqual(resolveColor('green'), '\x1b[32m');
        assert.strictEqual(resolveColor('blue'), '\x1b[34m');
      });

      test('resolves bright colors', () => {
        assert.strictEqual(resolveColor('bright-red'), '\x1b[91m');
        assert.strictEqual(resolveColor('bright-green'), '\x1b[92m');
      });

      test('is case insensitive', () => {
        assert.strictEqual(resolveColor('RED'), '\x1b[31m');
        assert.strictEqual(resolveColor('Red'), '\x1b[31m');
      });
    });

    describe('256 colors', () => {
      test('resolves 256-color codes', () => {
        assert.strictEqual(resolveColor(208), '\x1b[38;5;208m');
        assert.strictEqual(resolveColor(0), '\x1b[38;5;0m');
        assert.strictEqual(resolveColor(255), '\x1b[38;5;255m');
      });

      test('handles float numbers', () => {
        assert.strictEqual(resolveColor(208.7), '\x1b[38;5;208m');
      });
    });

    describe('hex colors', () => {
      test('resolves 6-digit hex', () => {
        assert.strictEqual(resolveColor('#ff0000'), '\x1b[38;2;255;0;0m');
        assert.strictEqual(resolveColor('#00ff00'), '\x1b[38;2;0;255;0m');
        assert.strictEqual(resolveColor('#0000ff'), '\x1b[38;2;0;0;255m');
      });

      test('resolves 3-digit hex', () => {
        assert.strictEqual(resolveColor('#f00'), '\x1b[38;2;255;0;0m');
        assert.strictEqual(resolveColor('#0f0'), '\x1b[38;2;0;255;0m');
      });
    });

    describe('RGB objects', () => {
      test('resolves RGB objects', () => {
        assert.strictEqual(resolveColor({ r: 255, g: 0, b: 0 }), '\x1b[38;2;255;0;0m');
        assert.strictEqual(resolveColor({ r: 0, g: 128, b: 255 }), '\x1b[38;2;0;128;255m');
      });

      test('handles float values', () => {
        assert.strictEqual(resolveColor({ r: 255.5, g: 0, b: 0 }), '\x1b[38;2;255;0;0m');
      });
    });

    describe('background colors', () => {
      test('resolves named background colors', () => {
        assert.strictEqual(resolveColor('red', { isBackground: true }), '\x1b[41m');
      });

      test('resolves 256 background colors', () => {
        assert.strictEqual(resolveColor(208, { isBackground: true }), '\x1b[48;5;208m');
      });

      test('resolves hex background colors', () => {
        assert.strictEqual(resolveColor('#ff0000', { isBackground: true }), '\x1b[48;2;255;0;0m');
      });
    });

    describe('bold attribute', () => {
      test('adds bold to named colors', () => {
        assert.strictEqual(resolveColor('red', { bold: true }), '\x1b[1;31m');
      });

      test('adds bold to 256 colors', () => {
        assert.strictEqual(resolveColor(208, { bold: true }), '\x1b[1;38;5;208m');
      });

      test('adds bold to hex colors', () => {
        assert.strictEqual(resolveColor('#ff0000', { bold: true }), '\x1b[1;38;2;255;0;0m');
      });
    });

    describe('edge cases', () => {
      test('returns empty string for null/undefined', () => {
        assert.strictEqual(resolveColor(null), '');
        assert.strictEqual(resolveColor(undefined), '');
      });

      test('returns empty string for invalid colors', () => {
        assert.strictEqual(resolveColor('invalid-color'), '');
        assert.strictEqual(resolveColor('#gggggg'), '');
      });

      test('returns empty string for out of range 256 colors', () => {
        assert.strictEqual(resolveColor(256), '');
        assert.strictEqual(resolveColor(-1), '');
      });
    });
  });

  describe('resolveStyle', () => {
    test('resolves foreground color', () => {
      assert.strictEqual(resolveStyle({ fg: 'red' }), '\x1b[31m');
    });

    test('resolves foreground with bold', () => {
      assert.strictEqual(resolveStyle({ fg: 'red', bold: true }), '\x1b[1;31m');
    });

    test('resolves background color', () => {
      assert.strictEqual(resolveStyle({ bg: 'blue' }), '\x1b[44m');
    });

    test('resolves foreground and background', () => {
      const result = resolveStyle({ fg: 'white', bg: 'blue' });
      assert.ok(result.includes('\x1b[37m'));
      assert.ok(result.includes('\x1b[44m'));
    });

    test('resolves text attributes', () => {
      assert.ok(resolveStyle({ italic: true }).includes('\x1b[3m'));
      assert.ok(resolveStyle({ underline: true }).includes('\x1b[4m'));
      assert.ok(resolveStyle({ dim: true }).includes('\x1b[2m'));
    });

    test('handles bold without color', () => {
      assert.strictEqual(resolveStyle({ bold: true }), '\x1b[1m');
    });

    test('returns empty string for empty style', () => {
      assert.strictEqual(resolveStyle({}), '');
      assert.strictEqual(resolveStyle(null), '');
      assert.strictEqual(resolveStyle(undefined), '');
    });
  });

  describe('NAMED_COLORS', () => {
    test('contains all 16 ANSI colors', () => {
      assert.strictEqual(Object.keys(NAMED_COLORS).length, 16);
      assert.strictEqual(NAMED_COLORS['black'], 0);
      assert.strictEqual(NAMED_COLORS['white'], 7);
      assert.strictEqual(NAMED_COLORS['bright-black'], 8);
      assert.strictEqual(NAMED_COLORS['bright-white'], 15);
    });
  });
});
