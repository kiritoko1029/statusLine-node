/**
 * Builtin segment registry
 */

const { getModel } = require('./model');
const { getDirectory } = require('./directory');
const { getGitBranch } = require('./git');
const { getContextWindow } = require('./context-window');
const { getCost } = require('./cost');
const { getSessionDuration } = require('./session');
const { getUsage } = require('./usage');
const { getOutputStyle } = require('./output-style');

/**
 * Create builtin segment registry
 * @returns {Object} Registry of segment handlers
 */
function createBuiltinRegistry() {
  return {
    model: getModel,
    directory: getDirectory,
    git: getGitBranch,
    context_window: getContextWindow,
    cost: getCost,
    session: getSessionDuration,
    usage: getUsage,
    output_style: getOutputStyle,
  };
}

module.exports = { createBuiltinRegistry };
