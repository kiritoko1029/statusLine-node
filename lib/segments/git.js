/**
 * Git segment - displays git branch
 */

const fs = require('fs');
const path = require('path');

/**
 * Read git branch from .git/HEAD
 * @param {string} gitDir - Path to .git directory
 * @returns {string|null}
 */
function readGitHead(gitDir) {
  try {
    const headPath = path.join(gitDir, 'HEAD');
    const content = fs.readFileSync(headPath, 'utf8').trim();

    // refs/heads/branch-name
    if (content.startsWith('ref: refs/heads/')) {
      return content.slice('ref: refs/heads/'.length);
    }

    // Detached HEAD - return short SHA
    if (content.length >= 7) {
      return content.slice(0, 7);
    }

    return content;
  } catch (err) {
    return null;
  }
}

/**
 * Find .git directory (handles worktrees)
 * @param {string} startDir - Starting directory
 * @returns {string|null}
 */
function findGitDir(startDir) {
  let current = startDir;

  while (current !== path.dirname(current)) {
    const gitDir = path.join(current, '.git');

    try {
      const stat = fs.statSync(gitDir);
      if (stat.isDirectory()) {
        return gitDir;
      }

      // .git file (worktree)
      if (stat.isFile()) {
        const content = fs.readFileSync(gitDir, 'utf8').trim();
        const match = content.match(/^gitdir:\s*(.+)$/);
        if (match) {
          return path.resolve(current, match[1]);
        }
      }
    } catch (err) {
      // Directory doesn't exist, continue
    }

    current = path.dirname(current);
  }

  return null;
}

/**
 * Get git branch
 * @param {Object} ctx - Context
 * @param {Object} ctx.workspace - Workspace info
 * @param {string} ctx.cwd - Current working directory
 * @returns {string|null}
 */
function getGitBranch(ctx) {
  const dir = ctx.workspace?.current_dir || ctx.cwd;
  if (!dir) {
    return null;
  }

  const gitDir = findGitDir(dir);
  if (!gitDir) {
    return null;
  }

  return readGitHead(gitDir);
}

module.exports = { getGitBranch, findGitDir, readGitHead };
