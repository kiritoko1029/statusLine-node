/**
 * Read data from stdin stream
 * @param {ReadableStream} stream - stdin stream
 * @param {Object} options - Options
 * @param {number} options.maxBytes - Maximum bytes to read (default: 1MB)
 * @returns {Promise<string>} Raw input string
 */
function readStdin(stream, options = { maxBytes: 1024 * 1024 }) {
  return new Promise((resolve, reject) => {
    let data = '';
    let byteCount = 0;

    stream.setEncoding('utf8');

    stream.on('data', chunk => {
      byteCount += Buffer.byteLength(chunk, 'utf8');
      if (byteCount > options.maxBytes) {
        reject(new Error(`Input exceeds maximum size of ${options.maxBytes} bytes`));
        stream.destroy();
        return;
      }
      data += chunk;
    });

    stream.on('end', () => {
      resolve(data);
    });

    stream.on('error', err => {
      reject(err);
    });
  });
}

module.exports = { readStdin };
