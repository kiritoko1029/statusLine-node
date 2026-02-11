/**
 * Config validation tests
 */

const { test, describe } = require('node:test');
const assert = require('node:assert');
const { validateConfig } = require('../lib/config/validate-config');
const { ConfigError } = require('../lib/errors');

describe('validate-config', () => {
  describe('basic validation', () => {
    test('accepts valid config', () => {
      const config = {
        settings: {
          mode: 'nerd_font',
          separator: ' | '
        },
        segments: [
          {
            id: 'test',
            enabled: true,
            content: 'test',
            style: { fg: 'red', bold: true }
          }
        ]
      };
      assert.doesNotThrow(() => validateConfig(config));
    });

    test('accepts minimal config', () => {
      assert.doesNotThrow(() => validateConfig({}));
      assert.doesNotThrow(() => validateConfig({ segments: [] }));
    });

    test('throws for non-object config', () => {
      assert.throws(() => validateConfig(null), ConfigError);
      assert.throws(() => validateConfig('string'), ConfigError);
      assert.throws(() => validateConfig(123), ConfigError);
    });

    test('throws for array config', () => {
      assert.throws(() => validateConfig([]), ConfigError);
    });
  });

  describe('settings validation', () => {
    test('accepts valid mode', () => {
      assert.doesNotThrow(() => validateConfig({ settings: { mode: 'plain' } }));
      assert.doesNotThrow(() => validateConfig({ settings: { mode: 'nerd_font' } }));
    });

    test('throws for invalid mode', () => {
      assert.throws(
        () => validateConfig({ settings: { mode: 'invalid' } }),
        /settings\.mode must be "plain" or "nerd_font"/
      );
    });

    test('accepts valid separator', () => {
      assert.doesNotThrow(() => validateConfig({ settings: { separator: ' | ' } }));
      assert.doesNotThrow(() => validateConfig({ settings: { separator: '' } }));
    });

    test('throws for non-string separator', () => {
      assert.throws(
        () => validateConfig({ settings: { separator: 123 } }),
        /settings\.separator must be a string/
      );
    });
  });

  describe('segment validation', () => {
    test('accepts valid segment', () => {
      const config = {
        segments: [{ id: 'test', enabled: true, content: 'test' }]
      };
      assert.doesNotThrow(() => validateConfig(config));
    });

    test('throws for segment without id', () => {
      const config = {
        segments: [{ enabled: true }]
      };
      assert.throws(() => validateConfig(config), /missing required field: id/);
    });

    test('throws for non-string id', () => {
      const config = {
        segments: [{ id: 123 }]
      };
      assert.throws(() => validateConfig(config), /id must be a string/);
    });

    test('accepts function for enabled', () => {
      const config = {
        segments: [{ id: 'test', enabled: () => true }]
      };
      assert.doesNotThrow(() => validateConfig(config));
    });

    test('accepts function for content', () => {
      const config = {
        segments: [{ id: 'test', content: () => 'test' }]
      };
      assert.doesNotThrow(() => validateConfig(config));
    });

    test('throws for invalid enabled type', () => {
      const config = {
        segments: [{ id: 'test', enabled: 'yes' }]
      };
      assert.throws(() => validateConfig(config), /enabled must be a boolean or function/);
    });
  });

  describe('style validation', () => {
    test('accepts valid colors', () => {
      const config = {
        segments: [
          { id: 'test1', style: { fg: 'red' } },
          { id: 'test2', style: { fg: 208 } },
          { id: 'test3', style: { fg: '#ff0000' } },
          { id: 'test4', style: { fg: { r: 255, g: 0, b: 0 } } }
        ]
      };
      assert.doesNotThrow(() => validateConfig(config));
    });

    test('accepts function for style properties', () => {
      const config = {
        segments: [{
          id: 'test',
          style: {
            fg: (ctx) => 'red',
            bg: (ctx) => 208,
            bold: (ctx) => true
          }
        }]
      };
      assert.doesNotThrow(() => validateConfig(config));
    });

    test('throws for invalid color string', () => {
      const config = {
        segments: [{ id: 'test', style: { fg: 'invalid-color' } }]
      };
      assert.throws(() => validateConfig(config), /invalid color/);
    });

    test('throws for out of range 256 color', () => {
      const config = {
        segments: [{ id: 'test', style: { fg: 256 } }]
      };
      assert.throws(() => validateConfig(config), /256-color must be integer 0-255/);
    });

    test('throws for invalid RGB object', () => {
      const config = {
        segments: [{ id: 'test', style: { fg: { r: 300, g: 0, b: 0 } } }]
      };
      assert.throws(() => validateConfig(config), /RGB color must have r, g, b values/);
    });

    test('accepts valid text attributes', () => {
      const config = {
        segments: [{
          id: 'test',
          style: {
            bold: true,
            italic: false,
            underline: true,
            dim: false
          }
        }]
      };
      assert.doesNotThrow(() => validateConfig(config));
    });

    test('throws for invalid text attributes', () => {
      const config = {
        segments: [{ id: 'test', style: { bold: 'yes' } }]
      };
      assert.throws(() => validateConfig(config), /style\.bold must be a boolean or function/);
    });
  });

  describe('icon validation', () => {
    test('accepts string icon', () => {
      const config = {
        segments: [{ id: 'test', icon: '🤖' }]
      };
      assert.doesNotThrow(() => validateConfig(config));
    });

    test('accepts object icon', () => {
      const config = {
        segments: [{
          id: 'test',
          icon: { plain: '🤖', nerd_font: '' }
        }]
      };
      assert.doesNotThrow(() => validateConfig(config));
    });

    test('throws for invalid icon', () => {
      const config = {
        segments: [{ id: 'test', icon: 123 }]
      };
      assert.throws(() => validateConfig(config), /icon must be a string or object/);
    });
  });
});
