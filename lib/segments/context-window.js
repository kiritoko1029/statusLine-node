/**
 * Context window segment - displays context window usage percentage
 */

/**
 * Get context window usage percentage
 * @param {Object} ctx - Context
 * @param {Object} ctx.context_window - Context window info
 * @returns {string}
 */
function getContextWindow(ctx) {
  const cw = ctx.context_window;
  if (!cw) {
    return '0%';
  }

  const size = cw.context_window_size || 200000;
  const usage = cw.current_usage;

  if (!usage) {
    return '0%';
  }

  const input = usage.input_tokens || 0;
  const cacheCreate = usage.cache_creation_input_tokens || 0;
  const cacheRead = usage.cache_read_input_tokens || 0;

  const total = input + cacheCreate + cacheRead;
  const percent = Math.round((total / size) * 100);

  return `${percent}%`;
}

module.exports = { getContextWindow };
