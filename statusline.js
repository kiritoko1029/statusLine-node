#!/usr/bin/env node
/**
 * Claude Code Statusline - Node.js Version
 * Reads JSON from stdin, outputs formatted statusline to stdout
 */

const { readStdin } = require('./lib/io/read-stdin');
const { writeLine, writeError } = require('./lib/io/write-output');
const { resolveConfigPath } = require('./lib/config/resolve-config-path');
const { loadConfig } = require('./lib/config/load-config');
const { validateConfig } = require('./lib/config/validate-config');
const { renderStatusline } = require('./lib/render/render-statusline');
const { createBuiltinRegistry } = require('./lib/segments/builtins');
const { ConfigError, InputError } = require('./lib/errors');

/**
 * Main entry point
 * @param {Object} deps - Dependencies for testability
 * @returns {Promise<number>} Exit code
 */
async function main(deps = {
  stdin: process.stdin,
  stdout: process.stdout,
  stderr: process.stderr,
  env: process.env,
  cwd: process.cwd(),
}) {
  try {
    // 1. Read and parse stdin JSON
    const input = await readStdin(deps.stdin);
    let ctx;
    try {
      ctx = JSON.parse(input);
    } catch (err) {
      throw new InputError(`Invalid JSON input: ${err.message}`);
    }

    // 2. Resolve and load config
    const configDir = deps.cwd;
    const theme = ctx.theme;
    const configPath = resolveConfigPath({ configDir, theme });

    const config = loadConfig({ configPath, hotReload: false });

    // 3. Validate config (throws ConfigError on invalid)
    validateConfig(config);

    // 4. Create builtin segment registry
    const builtins = createBuiltinRegistry();

    // 5. Render statusline
    const statusline = renderStatusline({ ctx, config, builtins });

    // 6. Output result
    writeLine(deps.stdout, statusline);
    return 0;

  } catch (err) {
    if (err instanceof ConfigError || err instanceof InputError) {
      writeError(deps.stderr, `Error: ${err.message}`);
      return err instanceof InputError ? 2 : 3;
    }

    // Unexpected error
    writeError(deps.stderr, `Unexpected error: ${err.message}`);
    if (deps.env.DEBUG) {
      writeError(deps.stderr, err.stack);
    }
    return 4;
  }
}

// Run if executed directly
if (require.main === module) {
  main().then(code => process.exit(code)).catch(err => {
    console.error(err);
    process.exit(4);
  });
}

module.exports = { main };
