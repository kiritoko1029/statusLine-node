/**
 * Write output to streams
 */

/**
 * Write a line to stdout
 * @param {WritableStream} stream - stdout stream
 * @param {string} line - Line to write
 */
function writeLine(stream, line) {
  stream.write(line + '\n');
}

/**
 * Write error message to stderr
 * @param {WritableStream} stream - stderr stream
 * @param {string} message - Error message
 */
function writeError(stream, message) {
  stream.write(message + '\n');
}

module.exports = { writeLine, writeError };
