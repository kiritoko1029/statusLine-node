/**
 * Render a single segment
 */

const { resolveIcon } = require('./icon-resolver');
const { resolveStyle } = require('./color-resolver');
const ansi = require('./ansi');

/**
 * Resolve style (supports function or object)
 * @param {Object|Function} style - Style config or function
 * @param {Object} ctx - Context
 * @returns {Object} Resolved style object
 */
function resolveStyleConfig(style, ctx) {
  if (!style) {
    return {};
  }

  if (typeof style === 'function') {
    try {
      return style(ctx) || {};
    } catch (err) {
      return {};
    }
  }

  // Resolve each property that might be a function
  const resolved = {};
  for (const [key, value] of Object.entries(style)) {
    if (typeof value === 'function') {
      try {
        resolved[key] = value(ctx);
      } catch (err) {
        resolved[key] = undefined;
      }
    } else {
      resolved[key] = value;
    }
  }

  return resolved;
}

/**
 * Render a single segment
 * @param {Object} options
 * @param {Object} options.segment - Segment configuration
 * @param {string} options.content - Segment content text
 * @param {string} options.mode - Icon mode ('plain' or 'nerd_font')
 * @param {Object} options.ctx - Context for dynamic styling
 * @returns {string} Rendered segment with ANSI codes
 */
function renderSegment({ segment, content, mode, ctx }) {
  if (!content && content !== 0) {
    return '';
  }

  const contentStr = String(content);
  if (contentStr === '') {
    return '';
  }

  let output = '';

  // Resolve style (supports function properties)
  const style = resolveStyleConfig(segment.style, ctx);

  // Apply style (includes foreground color and text attributes)
  const styleCodes = resolveStyle(style);
  if (styleCodes) {
    output += styleCodes;
  }

  // Add icon if present
  const icon = resolveIcon(segment.icon, mode);
  if (icon) {
    output += icon + ' ';
  }

  // Add content
  output += contentStr;

  // Reset at end
  output += ansi.reset();

  return output;
}

module.exports = { renderSegment, resolveStyleConfig };
