/**
 * Resolve config file path based on theme or default
 */

const path = require('path');

const DEFAULT_CONFIG = 'config.js';

/**
 * Validate theme name (prevent path traversal)
 * @param {string} theme - Theme name
 * @returns {boolean}
 */
function isValidThemeName(theme) {
  return /^[a-z0-9_-]+$/i.test(theme);
}

/**
 * Resolve config path
 * @param {Object} options
 * @param {string} options.configDir - Configuration directory
 * @param {string} [options.theme] - Optional theme name
 * @returns {string} Absolute path to config file
 */
function resolveConfigPath({ configDir, theme }) {
  if (theme) {
    if (!isValidThemeName(theme)) {
      throw new Error(`Invalid theme name: ${theme}`);
    }
    // Theme file in themes/ directory
    return path.join(configDir, 'themes', `${theme}.js`);
  }

  // Default config
  return path.join(configDir, DEFAULT_CONFIG);
}

module.exports = { resolveConfigPath, isValidThemeName };
