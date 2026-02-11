/**
 * Color resolver - converts color specs to ANSI codes
 */

const ansi = require('./ansi');

// Named 16-color mapping
const NAMED_COLORS = {
  'black': 0,
  'red': 1,
  'green': 2,
  'yellow': 3,
  'blue': 4,
  'magenta': 5,
  'cyan': 6,
  'white': 7,
  'bright-black': 8,
  'bright-red': 9,
  'bright-green': 10,
  'bright-yellow': 11,
  'bright-blue': 12,
  'bright-magenta': 13,
  'bright-cyan': 14,
  'bright-white': 15,
};

/**
 * Parse hex color to RGB
 * @param {string} hex - Hex color (#RGB or #RRGGBB)
 * @returns {[number, number, number]} RGB values
 */
function hexToRgb(hex) {
  hex = hex.slice(1); // Remove #

  if (hex.length === 3) {
    // Short form #RGB
    const r = parseInt(hex[0] + hex[0], 16);
    const g = parseInt(hex[1] + hex[1], 16);
    const b = parseInt(hex[2] + hex[2], 16);
    if (isNaN(r) || isNaN(g) || isNaN(b)) {
      throw new Error('Invalid hex color');
    }
    return [r, g, b];
  }

  // Long form #RRGGBB
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  if (isNaN(r) || isNaN(g) || isNaN(b)) {
    throw new Error('Invalid hex color');
  }
  return [r, g, b];
}

/**
 * Resolve color spec to ANSI code
 * Priority: RGB hex > 256-color > 16-color names
 *
 * @param {string|number|null|undefined} colorSpec
 * @param {Object} options
 * @param {boolean} options.bold - Include bold attribute
 * @param {boolean} options.isBackground - Generate background color
 * @returns {string} ANSI escape code
 */
function resolveColor(colorSpec, options = {}) {
  const { bold = false, isBackground = false } = options;

  if (colorSpec === null || colorSpec === undefined) {
    return '';
  }

  // String: hex or named color
  if (typeof colorSpec === 'string') {
    // Hex color
    if (colorSpec.startsWith('#')) {
      try {
        const [r, g, b] = hexToRgb(colorSpec);
        return isBackground ? ansi.bgRgb(r, g, b) : ansi.fgRgb(r, g, b, bold);
      } catch (err) {
        return '';
      }
    }

    // Named color
    const code = NAMED_COLORS[colorSpec.toLowerCase()];
    if (code !== undefined) {
      return isBackground ? ansi.bg16(code) : ansi.fg16(code, bold);
    }

    return '';
  }

  // Number: 256-color
  if (typeof colorSpec === 'number') {
    const code = Math.floor(colorSpec);
    if (code >= 0 && code <= 255) {
      return isBackground ? ansi.bg256(code) : ansi.fg256(code, bold);
    }
    return '';
  }

  // Object: RGB color { r, g, b }
  if (typeof colorSpec === 'object' && colorSpec !== null) {
    const r = colorSpec.r;
    const g = colorSpec.g;
    const b = colorSpec.b;
    if (
      typeof r === 'number' && typeof g === 'number' && typeof b === 'number' &&
      r >= 0 && r < 256 && g >= 0 && g < 256 && b >= 0 && b < 256
    ) {
      return isBackground
        ? ansi.bgRgb(Math.floor(r), Math.floor(g), Math.floor(b))
        : ansi.fgRgb(Math.floor(r), Math.floor(g), Math.floor(b), bold);
    }
    return '';
  }

  return '';
}

/**
 * Resolve style object to ANSI codes
 * @param {Object} style
 * @returns {string} Combined ANSI codes
 */
function resolveStyle(style) {
  if (!style || typeof style !== 'object') {
    return '';
  }

  let codes = '';

  // Foreground color (with bold if specified)
  if (style.fg !== undefined) {
    codes += resolveColor(style.fg, { bold: style.bold });
  } else if (style.bold) {
    // Bold without color change
    codes += ansi.bold();
  }

  // Background color
  if (style.bg !== undefined) {
    codes += resolveColor(style.bg, { isBackground: true });
  }

  // Other attributes
  if (style.italic) {
    codes += ansi.italic();
  }
  if (style.underline) {
    codes += ansi.underline();
  }
  if (style.dim) {
    codes += ansi.dim();
  }

  return codes;
}

module.exports = { resolveColor, resolveStyle, NAMED_COLORS };
