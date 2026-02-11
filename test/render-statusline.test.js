/**
 * Render statusline tests
 */

const { test, describe } = require('node:test');
const assert = require('node:assert');
const { renderStatusline, resolveSegmentContent } = require('../lib/render/render-statusline');

describe('render-statusline', () => {
  describe('resolveSegmentContent', () => {
    const builtins = {
      model: () => 'claude-opus',
      directory: () => 'my-project'
    };

    test('resolves string content', () => {
      const segment = { id: 'test', content: 'hello' };
      const result = resolveSegmentContent({ segment, ctx: {}, builtins });
      assert.strictEqual(result, 'hello');
    });

    test('resolves function content', () => {
      const segment = { id: 'test', content: (ctx) => `Hello ${ctx.name}` };
      const result = resolveSegmentContent({ segment, ctx: { name: 'World' }, builtins });
      assert.strictEqual(result, 'Hello World');
    });

    test('resolves builtin content', () => {
      const segment = { id: 'model' };
      const result = resolveSegmentContent({ segment, ctx: {}, builtins });
      assert.strictEqual(result, 'claude-opus');
    });

    test('content function takes priority over builtin', () => {
      const segment = { id: 'model', content: 'custom-model' };
      const result = resolveSegmentContent({ segment, ctx: {}, builtins });
      assert.strictEqual(result, 'custom-model');
    });

    test('returns null when disabled (static)', () => {
      const segment = { id: 'test', enabled: false, content: 'hello' };
      const result = resolveSegmentContent({ segment, ctx: {}, builtins });
      assert.strictEqual(result, null);
    });

    test('returns null when disabled (function)', () => {
      const segment = {
        id: 'test',
        enabled: (ctx) => ctx.show,
        content: 'hello'
      };
      const result = resolveSegmentContent({ segment, ctx: { show: false }, builtins });
      assert.strictEqual(result, null);
    });

    test('returns content when enabled (function)', () => {
      const segment = {
        id: 'test',
        enabled: (ctx) => ctx.show,
        content: 'hello'
      };
      const result = resolveSegmentContent({ segment, ctx: { show: true }, builtins });
      assert.strictEqual(result, 'hello');
    });

    test('returns null for empty content', () => {
      const segment = { id: 'test', content: '' };
      const result = resolveSegmentContent({ segment, ctx: {}, builtins });
      assert.strictEqual(result, null);
    });

    test('returns null for null content', () => {
      const segment = { id: 'test', content: null };
      const result = resolveSegmentContent({ segment, ctx: {}, builtins });
      assert.strictEqual(result, null);
    });

    test('returns null for undefined content and no builtin', () => {
      const segment = { id: 'unknown' };
      const result = resolveSegmentContent({ segment, ctx: {}, builtins });
      assert.strictEqual(result, null);
    });

    test('returns error marker when content function throws', () => {
      const segment = {
        id: 'test',
        content: () => { throw new Error('test error'); }
      };
      const result = resolveSegmentContent({ segment, ctx: {}, builtins });
      assert.strictEqual(result, '❌');
    });

    test('returns error marker when enabled function throws', () => {
      const segment = {
        id: 'test',
        enabled: () => { throw new Error('test error'); },
        content: 'hello'
      };
      const result = resolveSegmentContent({ segment, ctx: {}, builtins });
      assert.strictEqual(result, '❌');
    });

    test('returns string for number content', () => {
      const segment = { id: 'test', content: 42 };
      const result = resolveSegmentContent({ segment, ctx: {}, builtins });
      assert.strictEqual(result, '42');
    });

    test('returns string for zero', () => {
      const segment = { id: 'test', content: 0 };
      const result = resolveSegmentContent({ segment, ctx: {}, builtins });
      assert.strictEqual(result, '0');
    });
  });

  describe('renderStatusline', () => {
    test('returns empty string for empty config', () => {
      const result = renderStatusline({
        ctx: {},
        config: {},
        builtins: {}
      });
      assert.strictEqual(result, '');
    });

    test('returns empty string for empty segments', () => {
      const result = renderStatusline({
        ctx: {},
        config: { segments: [] },
        builtins: {}
      });
      assert.strictEqual(result, '');
    });

    test('renders single segment', () => {
      const result = renderStatusline({
        ctx: {},
        config: {
          segments: [{ id: 'test', content: 'hello' }]
        },
        builtins: {}
      });
      assert.ok(result.includes('hello'));
    });

    test('renders multiple segments with separator', () => {
      const result = renderStatusline({
        ctx: {},
        config: {
          settings: { separator: ' | ' },
          segments: [
            { id: 'a', content: 'first' },
            { id: 'b', content: 'second' }
          ]
        },
        builtins: {}
      });
      assert.ok(result.includes('first'));
      assert.ok(result.includes('second'));
      assert.ok(result.includes(' | '));
    });

    test('uses default separator', () => {
      const result = renderStatusline({
        ctx: {},
        config: {
          segments: [
            { id: 'a', content: 'first' },
            { id: 'b', content: 'second' }
          ]
        },
        builtins: {}
      });
      assert.ok(result.includes(' | '));
    });

    test('skips disabled segments', () => {
      const result = renderStatusline({
        ctx: {},
        config: {
          settings: { separator: ' | ' },
          segments: [
            { id: 'a', content: 'first' },
            { id: 'b', enabled: false, content: 'hidden' },
            { id: 'c', content: 'last' }
          ]
        },
        builtins: {}
      });
      assert.ok(result.includes('first'));
      assert.ok(!result.includes('hidden'));
      assert.ok(result.includes('last'));
    });

    test('skips segments with empty content', () => {
      const result = renderStatusline({
        ctx: {},
        config: {
          settings: { separator: ' | ' },
          segments: [
            { id: 'a', content: 'first' },
            { id: 'b', content: '' },
            { id: 'c', content: 'last' }
          ]
        },
        builtins: {}
      });
      assert.ok(result.includes('first'));
      assert.ok(result.includes('last'));
      // Should only have one separator between first and last
      const matches = result.match(/ \| /g);
      assert.strictEqual(matches.length, 1);
    });

    test('uses builtin for segment without content', () => {
      const builtins = {
        model: () => 'claude-opus'
      };
      const result = renderStatusline({
        ctx: {},
        config: {
          segments: [{ id: 'model' }]
        },
        builtins
      });
      assert.ok(result.includes('claude-opus'));
    });

    test('applies mode for icon resolution', () => {
      const result = renderStatusline({
        ctx: {},
        config: {
          settings: { mode: 'nerd_font' },
          segments: [{
            id: 'test',
            icon: { plain: '🤖', nerd_font: '' },
            content: 'test'
          }]
        },
        builtins: {}
      });
      assert.ok(result.includes(''));
    });

    test('applies styles to segments', () => {
      const result = renderStatusline({
        ctx: {},
        config: {
          segments: [{
            id: 'test',
            content: 'styled',
            style: { fg: 'red' }
          }]
        },
        builtins: {}
      });
      assert.ok(result.includes('\x1b[31m')); // red color code
      assert.ok(result.includes('styled'));
    });

    test('handles segment rendering errors gracefully', () => {
      const result = renderStatusline({
        ctx: {},
        config: {
          settings: { separator: ' | ' },
          segments: [
            { id: 'a', content: 'first' },
            {
              id: 'b',
              content: () => { throw new Error('test'); }
            },
            { id: 'c', content: 'last' }
          ]
        },
        builtins: {}
      });
      assert.ok(result.includes('first'));
      assert.ok(result.includes('❌'));
      assert.ok(result.includes('last'));
    });

    test('complex statusline with multiple features', () => {
      const builtins = {
        model: (ctx) => ctx.model
      };
      const result = renderStatusline({
        ctx: { model: 'claude-sonnet' },
        config: {
          settings: { mode: 'plain', separator: '  ' },
          segments: [
            {
              id: 'model',
              icon: '🤖',
              style: { fg: 'cyan', bold: true }
            },
            {
              id: 'dir',
              content: 'my-project',
              style: { fg: 'blue' }
            },
            { id: 'empty', content: '' },
            {
              id: 'git',
              enabled: (ctx) => ctx.hasGit,
              content: 'main'
            }
          ]
        },
        builtins
      });
      assert.ok(result.includes('🤖'));
      assert.ok(result.includes('claude-sonnet'));
      assert.ok(result.includes('my-project'));
      assert.ok(!result.includes('main')); // disabled because hasGit is undefined
    });
  });
});
