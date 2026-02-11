/**
 * Usage segment - displays token usage statistics
 */

/**
 * Format number with K/M suffix
 * @param {number} num
 * @returns {string}
 */
function formatNumber(num) {
  if (!num) return '0';
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return String(num);
}

/**
 * Get usage statistics
 * @param {Object} ctx - Context
 * @param {Object} ctx.context_window - Context window info
 * @returns {string|null}
 */
function getUsage(ctx) {
  const cw = ctx.context_window;
  if (!cw) {
    return null;
  }

  const input = cw.total_input_tokens || 0;
  const output = cw.total_output_tokens || 0;

  if (input === 0 && output === 0) {
    return null;
  }

  return `I:${formatNumber(input)} O:${formatNumber(output)}`;
}

module.exports = { getUsage, formatNumber };
