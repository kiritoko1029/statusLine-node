/**
 * Load configuration from file
 */

const fs = require('fs');

/**
 * Load config from file
 * @param {Object} options
 * @param {string} options.configPath - Path to config file
 * @param {boolean} options.hotReload - Whether to clear require cache
 * @returns {Object} Config object
 */
function loadConfig({ configPath, hotReload }) {
  // Check if file exists
  if (!fs.existsSync(configPath)) {
    // Return default config if no config file exists
    return getDefaultConfig();
  }

  // Clear cache if hot reload is enabled
  if (hotReload) {
    delete require.cache[require.resolve(configPath)];
  }

  try {
    const config = require(configPath);
    return config;
  } catch (err) {
    throw new Error(`Failed to load config from ${configPath}: ${err.message}`);
  }
}

/**
 * Get default configuration
 * @returns {Object} Default config
 */
function getDefaultConfig() {
  return {
    settings: {
      mode: 'plain',
      separator: ' | ',
    },
    segments: [
      {
        id: 'model',
        enabled: true,
        icon: { plain: '🤖', nerd_font: '' },
        content: (ctx) => ctx.model?.display_name || 'Unknown',
        style: { fg: 14, bold: true },
      },
      {
        id: 'directory',
        enabled: true,
        icon: { plain: '📁', nerd_font: '󰉋' },
        content: (ctx) => {
          const dir = ctx.workspace?.current_dir || ctx.cwd || '';
          return dir.split('/').pop() || dir;
        },
        style: { fg: 10, bold: true },
      },
    ],
  };
}

module.exports = { loadConfig, getDefaultConfig };
