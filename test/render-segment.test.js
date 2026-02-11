/**
 * Render segment tests
 */

const { test, describe } = require('node:test');
const assert = require('node:assert');
const { renderSegment, resolveStyleConfig } = require('../lib/render/render-segment');

describe('render-segment', () => {
  describe('resolveStyleConfig', () => {
    test('returns empty object for null/undefined', () => {
      assert.deepStrictEqual(resolveStyleConfig(null, {}), {});
      assert.deepStrictEqual(resolveStyleConfig(undefined, {}), {});
    });

    test('returns style function result', () => {
      const style = (ctx) => ({ fg: ctx.color });
      const ctx = { color: 'red' };
      assert.deepStrictEqual(resolveStyleConfig(style, ctx), { fg: 'red' });
    });

    test('returns empty object when style function throws', () => {
      const style = () => { throw new Error('test'); };
      assert.deepStrictEqual(resolveStyleConfig(style, {}), {});
    });

    test('resolves static style properties', () => {
      const style = { fg: 'red', bold: true };
      assert.deepStrictEqual(resolveStyleConfig(style, {}), { fg: 'red', bold: true });
    });

    test('resolves function properties in style', () => {
      const style = {
        fg: (ctx) => ctx.color,
        bold: (ctx) => ctx.bold,
        italic: true
      };
      const ctx = { color: 'blue', bold: true };
      assert.deepStrictEqual(resolveStyleConfig(style, ctx), {
        fg: 'blue',
        bold: true,
        italic: true
      });
    });

    test('handles errors in function properties', () => {
      const style = {
        fg: () => { throw new Error('test'); },
        bold: true
      };
      const result = resolveStyleConfig(style, {});
      assert.strictEqual(result.fg, undefined);
      assert.strictEqual(result.bold, true);
    });

    test('handles nested function calls with context', () => {
      const style = {
        fg: (ctx) => ctx.level > 5 ? 'red' : 'green'
      };
      assert.deepStrictEqual(resolveStyleConfig(style, { level: 10 }), { fg: 'red' });
      assert.deepStrictEqual(resolveStyleConfig(style, { level: 3 }), { fg: 'green' });
    });
  });

  describe('renderSegment', () => {
    test('returns empty string for null content', () => {
      const result = renderSegment({
        segment: {},
        content: null,
        mode: 'plain',
        ctx: {}
      });
      assert.strictEqual(result, '');
    });

    test('returns empty string for undefined content', () => {
      const result = renderSegment({
        segment: {},
        content: undefined,
        mode: 'plain',
        ctx: {}
      });
      assert.strictEqual(result, '');
    });

    test('returns empty string for empty string content', () => {
      const result = renderSegment({
        segment: {},
        content: '',
        mode: 'plain',
        ctx: {}
      });
      assert.strictEqual(result, '');
    });

    test('renders content with ANSI reset', () => {
      const result = renderSegment({
        segment: {},
        content: 'test',
        mode: 'plain',
        ctx: {}
      });
      assert.ok(result.includes('test'));
      assert.ok(result.includes('\x1b[0m')); // reset code
    });

    test('renders number content', () => {
      const result = renderSegment({
        segment: {},
        content: 42,
        mode: 'plain',
        ctx: {}
      });
      assert.ok(result.includes('42'));
    });

    test('renders with string icon', () => {
      const result = renderSegment({
        segment: { icon: '🤖' },
        content: 'test',
        mode: 'plain',
        ctx: {}
      });
      assert.ok(result.includes('🤖'));
      assert.ok(result.includes('test'));
    });

    test('renders with object icon (nerd_font mode)', () => {
      const result = renderSegment({
        segment: { icon: { plain: '🤖', nerd_font: '' } },
        content: 'test',
        mode: 'nerd_font',
        ctx: {}
      });
      assert.ok(result.includes(''));
      assert.ok(!result.includes('🤖'));
    });

    test('renders with object icon (plain mode)', () => {
      const result = renderSegment({
        segment: { icon: { plain: '🤖', nerd_font: '' } },
        content: 'test',
        mode: 'plain',
        ctx: {}
      });
      assert.ok(result.includes('🤖'));
      assert.ok(!result.includes(''));
    });

    test('applies foreground color', () => {
      const result = renderSegment({
        segment: { style: { fg: 'red' } },
        content: 'test',
        mode: 'plain',
        ctx: {}
      });
      assert.ok(result.includes('\x1b[31m')); // red foreground
      assert.ok(result.includes('test'));
    });

    test('applies background color', () => {
      const result = renderSegment({
        segment: { style: { bg: 'blue' } },
        content: 'test',
        mode: 'plain',
        ctx: {}
      });
      assert.ok(result.includes('\x1b[44m')); // blue background
    });

    test('applies bold attribute', () => {
      const result = renderSegment({
        segment: { style: { bold: true } },
        content: 'test',
        mode: 'plain',
        ctx: {}
      });
      assert.ok(result.includes('\x1b[1m'));
    });

    test('applies dynamic style from function', () => {
      const result = renderSegment({
        segment: {
          style: {
            fg: (ctx) => ctx.error ? 'red' : 'green'
          }
        },
        content: 'test',
        mode: 'plain',
        ctx: { error: true }
      });
      assert.ok(result.includes('\x1b[31m')); // red
    });

    test('applies dynamic style from context', () => {
      const result = renderSegment({
        segment: {
          style: {
            fg: (ctx) => ctx.error ? 'red' : 'green'
          }
        },
        content: 'test',
        mode: 'plain',
        ctx: { error: false }
      });
      assert.ok(result.includes('\x1b[32m')); // green
    });

    test('handles style function errors gracefully', () => {
      const result = renderSegment({
        segment: {
          style: {
            fg: () => { throw new Error('test'); }
          }
        },
        content: 'test',
        mode: 'plain',
        ctx: {}
      });
      // Should still render content even if style fails
      assert.ok(result.includes('test'));
      assert.ok(result.includes('\x1b[0m')); // has reset
    });

    test('combines icon, style and content', () => {
      const result = renderSegment({
        segment: {
          icon: '⚡',
          style: { fg: 'yellow', bold: true }
        },
        content: 'power',
        mode: 'plain',
        ctx: {}
      });
      assert.ok(result.includes('⚡'));
      assert.ok(result.includes('power'));
      assert.ok(result.includes('\x1b[')); // has ANSI codes
    });
  });
});
