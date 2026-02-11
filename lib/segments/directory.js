/**
 * Directory segment - displays current directory name
 */

const path = require('path');

/**
 * Get current directory name
 * @param {Object} ctx - Context
 * @param {Object} ctx.workspace - Workspace info
 * @param {string} ctx.cwd - Current working directory
 * @returns {string|null}
 */
function getDirectory(ctx) {
  const dir = ctx.workspace?.current_dir || ctx.cwd;
  if (!dir) {
    return null;
  }
  return path.basename(dir) || dir;
}

module.exports = { getDirectory };
