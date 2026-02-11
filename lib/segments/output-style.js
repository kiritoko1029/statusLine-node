/**
 * Output style segment - displays output style name
 */

/**
 * Get output style name
 * @param {Object} ctx - Context
 * @param {Object} ctx.output_style - Output style info
 * @returns {string|null}
 */
function getOutputStyle(ctx) {
  if (!ctx.output_style || !ctx.output_style.name) {
    return null;
  }
  return ctx.output_style.name;
}

module.exports = { getOutputStyle };
