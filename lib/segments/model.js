/**
 * Model segment - displays AI model name
 */

/**
 * Get model display name
 * @param {Object} ctx - Context
 * @param {Object} ctx.model - Model info
 * @returns {string|null}
 */
function getModel(ctx) {
  if (!ctx.model) {
    return null;
  }
  return ctx.model.display_name || ctx.model.id || null;
}

module.exports = { getModel };
