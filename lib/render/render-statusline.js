/**
 * Render full statusline from segments
 */

const { renderSegment } = require('./render-segment');
const ansi = require('./ansi');

/**
 * Resolve segment content from inline function or builtin
 * @param {Object} options
 * @param {Object} options.segment - Segment config
 * @param {Object} options.ctx - Context data
 * @param {Object} options.builtins - Builtin segment registry
 * @returns {string|null} Resolved content or null if disabled/empty
 */
function resolveSegmentContent({ segment, ctx, builtins }) {
  try {
    // Check if enabled
    let enabled = true;
    if (segment.enabled !== undefined) {
      enabled = typeof segment.enabled === 'function'
        ? segment.enabled(ctx)
        : segment.enabled;
    }
    if (!enabled) {
      return null;
    }

    // Get content
    let content = null;
    if (segment.content !== undefined) {
      // Inline content function or string
      content = typeof segment.content === 'function'
        ? segment.content(ctx)
        : segment.content;
    } else if (builtins[segment.id]) {
      // Use builtin handler
      content = builtins[segment.id](ctx);
    }

    // Check for empty content
    if (content === null || content === undefined || content === '') {
      return null;
    }

    return String(content);
  } catch (err) {
    // Segment error - show error marker
    return '❌';
  }
}

/**
 * Render full statusline
 * @param {Object} options
 * @param {Object} options.ctx - Context data from stdin JSON
 * @param {Object} options.config - Configuration object
 * @param {Object} options.builtins - Builtin segment registry
 * @returns {string} Full rendered statusline
 */
function renderStatusline({ ctx, config, builtins }) {
  const settings = config.settings || {};
  const mode = settings.mode || 'plain';
  const separator = settings.separator || ' | ';
  const segments = config.segments || [];

  const renderedSegments = [];

  for (const segment of segments) {
    const content = resolveSegmentContent({ segment, ctx, builtins });
    if (content !== null) {
      const rendered = renderSegment({ segment, content, mode, ctx });
      if (rendered) {
        renderedSegments.push(rendered);
      }
    }
  }

  if (renderedSegments.length === 0) {
    return '';
  }

  // Join segments with separator
  // Each segment already has reset at the end, so separator is unstyled
  return renderedSegments.join(separator);
}

module.exports = { renderStatusline, resolveSegmentContent };
