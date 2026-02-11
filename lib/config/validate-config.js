/**
 * Validate configuration schema
 */

const { ConfigError } = require('../errors');

/**
 * Validate config object
 * @param {Object} config - Config to validate
 * @throws {ConfigError} On validation failure
 */
function validateConfig(config) {
  if (!config || typeof config !== 'object' || Array.isArray(config)) {
    throw new ConfigError('Config must be an object');
  }

  // Validate settings if present
  if (config.settings !== undefined) {
    validateSettings(config.settings);
  }

  // Validate segments if present
  if (config.segments !== undefined) {
    if (!Array.isArray(config.segments)) {
      throw new ConfigError('segments must be an array');
    }
    config.segments.forEach((seg, index) => validateSegment(seg, index));
  }
}

/**
 * Validate settings object
 * @param {Object} settings
 */
function validateSettings(settings) {
  if (typeof settings !== 'object') {
    throw new ConfigError('settings must be an object');
  }

  if (settings.mode !== undefined) {
    if (!['plain', 'nerd_font'].includes(settings.mode)) {
      throw new ConfigError('settings.mode must be "plain" or "nerd_font"');
    }
  }

  if (settings.separator !== undefined && typeof settings.separator !== 'string') {
    throw new ConfigError('settings.separator must be a string');
  }
}

/**
 * Validate segment object
 * @param {Object} seg - Segment config
 * @param {number} index - Segment index
 */
function validateSegment(seg, index) {
  if (!seg || typeof seg !== 'object') {
    throw new ConfigError(`Segment at index ${index} must be an object`);
  }

  // id is required
  if (seg.id === undefined) {
    throw new ConfigError(`Segment at index ${index} missing required field: id`);
  }
  if (typeof seg.id !== 'string') {
    throw new ConfigError(`Segment at index ${index}: id must be a string`);
  }

  // Validate enabled if present (can be boolean or function)
  if (seg.enabled !== undefined &&
      typeof seg.enabled !== 'boolean' &&
      typeof seg.enabled !== 'function') {
    throw new ConfigError(`Segment "${seg.id}": enabled must be a boolean or function`);
  }

  // Validate content if present (can be string or function)
  if (seg.content !== undefined &&
      typeof seg.content !== 'string' &&
      typeof seg.content !== 'function') {
    throw new ConfigError(`Segment "${seg.id}": content must be a string or function`);
  }

  // Validate icon if present
  if (seg.icon !== undefined) {
    validateIcon(seg.icon, seg.id);
  }

  // Validate style if present
  if (seg.style !== undefined) {
    validateStyle(seg.style, seg.id);
  }
}

/**
 * Validate icon configuration
 * @param {*} icon
 * @param {string} segId
 */
function validateIcon(icon, segId) {
  if (typeof icon === 'string') {
    return; // Simple string icon is valid
  }
  if (typeof icon === 'object') {
    // Can have plain and/or nerd_font
    if (icon.plain !== undefined && typeof icon.plain !== 'string') {
      throw new ConfigError(`Segment "${segId}": icon.plain must be a string`);
    }
    if (icon.nerd_font !== undefined && typeof icon.nerd_font !== 'string') {
      throw new ConfigError(`Segment "${segId}": icon.nerd_font must be a string`);
    }
    return;
  }
  throw new ConfigError(`Segment "${segId}": icon must be a string or object`);
}

/**
 * Validate style configuration
 * @param {*} style
 * @param {string} segId
 */
function validateStyle(style, segId) {
  // style can be a function that returns style object
  if (typeof style === 'function') {
    return;
  }

  if (typeof style !== 'object') {
    throw new ConfigError(`Segment "${segId}": style must be an object or function`);
  }

  // Validate color fields (can be function or color value)
  if (style.fg !== undefined) {
    if (typeof style.fg !== 'function') {
      validateColor(style.fg, `Segment "${segId}": style.fg`);
    }
  }
  if (style.bg !== undefined) {
    if (typeof style.bg !== 'function') {
      validateColor(style.bg, `Segment "${segId}": style.bg`);
    }
  }

  // Validate text attributes (can be boolean or function)
  if (style.bold !== undefined && typeof style.bold !== 'boolean' && typeof style.bold !== 'function') {
    throw new ConfigError(`Segment "${segId}": style.bold must be a boolean or function`);
  }
  if (style.italic !== undefined && typeof style.italic !== 'boolean' && typeof style.italic !== 'function') {
    throw new ConfigError(`Segment "${segId}": style.italic must be a boolean or function`);
  }
  if (style.underline !== undefined && typeof style.underline !== 'boolean' && typeof style.underline !== 'function') {
    throw new ConfigError(`Segment "${segId}": style.underline must be a boolean or function`);
  }
  if (style.dim !== undefined && typeof style.dim !== 'boolean' && typeof style.dim !== 'function') {
    throw new ConfigError(`Segment "${segId}": style.dim must be a boolean or function`);
  }
}

/**
 * Validate color value
 * @param {*} color
 * @param {string} context
 */
function validateColor(color, context) {
  if (color === null || color === undefined) {
    return;
  }

  // String: hex color or color name
  if (typeof color === 'string') {
    // Hex color (#RGB or #RRGGBB)
    if (/^#[0-9a-fA-F]{3}$|^#[0-9a-fA-F]{6}$/.test(color)) {
      return;
    }
    // Named colors
    const namedColors = [
      'black', 'red', 'green', 'yellow', 'blue', 'magenta', 'cyan', 'white',
      'bright-black', 'bright-red', 'bright-green', 'bright-yellow',
      'bright-blue', 'bright-magenta', 'bright-cyan', 'bright-white'
    ];
    if (namedColors.includes(color)) {
      return;
    }
    throw new ConfigError(`${context}: invalid color "${color}"`);
  }

  // Number: 256-color code (0-255)
  if (typeof color === 'number') {
    if (color >= 0 && color <= 255 && Number.isInteger(color)) {
      return;
    }
    throw new ConfigError(`${context}: 256-color must be integer 0-255`);
  }

  // Object: RGB color { r, g, b }
  if (typeof color === 'object' && color !== null) {
    if (
      typeof color.r === 'number' &&
      typeof color.g === 'number' &&
      typeof color.b === 'number'
    ) {
      if (
        color.r >= 0 && color.r <= 255 &&
        color.g >= 0 && color.g <= 255 &&
        color.b >= 0 && color.b <= 255
      ) {
        return;
      }
    }
    throw new ConfigError(`${context}: RGB color must have r, g, b values (0-255)`);
  }

  throw new ConfigError(`${context}: color must be string, number, or RGB object`);
}

module.exports = { validateConfig };
