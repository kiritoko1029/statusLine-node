/**
 * Custom error classes for statusline
 */

class ConfigError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ConfigError';
  }
}

class InputError extends Error {
  constructor(message) {
    super(message);
    this.name = 'InputError';
  }
}

module.exports = { ConfigError, InputError };
