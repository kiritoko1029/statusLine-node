/**
 * Icon resolver - selects icon based on mode
 */

/**
 * Resolve icon based on mode
 * @param {string|Object} iconConfig - Icon configuration
 * @param {string} mode - 'plain' or 'nerd_font'
 * @returns {string} Selected icon
 */
function resolveIcon(iconConfig, mode) {
  if (!iconConfig) {
    return '';
  }

  // Simple string icon
  if (typeof iconConfig === 'string') {
    return iconConfig;
  }

  // Object with mode-specific icons
  if (typeof iconConfig === 'object') {
    if (mode === 'nerd_font' && iconConfig.nerd_font !== undefined) {
      return iconConfig.nerd_font;
    }
    if (iconConfig.plain !== undefined) {
      return iconConfig.plain;
    }
    // Fallback to nerd_font if plain not available
    if (iconConfig.nerd_font !== undefined) {
      return iconConfig.nerd_font;
    }
  }

  return '';
}

module.exports = { resolveIcon };
