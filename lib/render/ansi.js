/**
 * ANSI escape code generators
 */

const ESC = '\x1b[';

/**
 * Reset all attributes
 * @returns {string}
 */
function reset() {
  return `${ESC}0m`;
}

// Foreground colors

/**
 * 16-color foreground
 * @param {number} code - Color code 0-15
 * @param {boolean} bold - Bold attribute
 * @returns {string}
 */
function fg16(code, bold = false) {
  // Standard colors: 30-37, Bright: 90-97
  const base = code < 8 ? 30 + code : 90 + (code - 8);
  if (bold) {
    return `${ESC}1;${base}m`;
  }
  return `${ESC}${base}m`;
}

/**
 * 256-color foreground
 * @param {number} code - Color code 0-255
 * @param {boolean} bold - Bold attribute
 * @returns {string}
 */
function fg256(code, bold = false) {
  if (bold) {
    return `${ESC}1;38;5;${code}m`;
  }
  return `${ESC}38;5;${code}m`;
}

/**
 * RGB foreground
 * @param {number} r - Red 0-255
 * @param {number} g - Green 0-255
 * @param {number} b - Blue 0-255
 * @param {boolean} bold - Bold attribute
 * @returns {string}
 */
function fgRgb(r, g, b, bold = false) {
  if (bold) {
    return `${ESC}1;38;2;${r};${g};${b}m`;
  }
  return `${ESC}38;2;${r};${g};${b}m`;
}

// Background colors

/**
 * 16-color background
 * @param {number} code - Color code 0-15
 * @returns {string}
 */
function bg16(code) {
  // Standard colors: 40-47, Bright: 100-107
  const base = code < 8 ? 40 + code : 100 + (code - 8);
  return `${ESC}${base}m`;
}

/**
 * 256-color background
 * @param {number} code - Color code 0-255
 * @returns {string}
 */
function bg256(code) {
  return `${ESC}48;5;${code}m`;
}

/**
 * RGB background
 * @param {number} r - Red 0-255
 * @param {number} g - Green 0-255
 * @param {number} b - Blue 0-255
 * @returns {string}
 */
function bgRgb(r, g, b) {
  return `${ESC}48;2;${r};${g};${b}m`;
}

// Text attributes

/**
 * Bold attribute
 * @returns {string}
 */
function bold() {
  return `${ESC}1m`;
}

/**
 * Italic attribute
 * @returns {string}
 */
function italic() {
  return `${ESC}3m`;
}

/**
 * Underline attribute
 * @returns {string}
 */
function underline() {
  return `${ESC}4m`;
}

/**
 * Dim attribute
 * @returns {string}
 */
function dim() {
  return `${ESC}2m`;
}

module.exports = {
  reset,
  fg16,
  fg256,
  fgRgb,
  bg16,
  bg256,
  bgRgb,
  bold,
  italic,
  underline,
  dim,
};
