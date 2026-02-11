/**
 * Session segment - displays session duration
 */

/**
 * Format duration in milliseconds to human readable
 * @param {number} ms - Duration in milliseconds
 * @returns {string}
 */
function formatDuration(ms) {
  if (!ms || ms < 0) {
    return '0s';
  }

  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  if (hours > 0) {
    return `${hours}h${String(minutes % 60).padStart(2, '0')}m`;
  }

  if (minutes > 0) {
    return `${minutes}m${String(seconds % 60).padStart(2, '0')}s`;
  }

  return `${seconds}s`;
}

/**
 * Get session duration
 * @param {Object} ctx - Context
 * @param {Object} ctx.cost - Cost info with duration
 * @returns {string|null}
 */
function getSessionDuration(ctx) {
  if (!ctx.cost || ctx.cost.total_duration_ms === undefined) {
    return null;
  }
  return formatDuration(ctx.cost.total_duration_ms);
}

module.exports = { getSessionDuration, formatDuration };
