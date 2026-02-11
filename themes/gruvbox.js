/**
 * Gruvbox Theme for Claude Code Statusline
 * Retro groove color scheme
 */

module.exports = {
  settings: {
    mode: 'nerd_font',
    separator: ' | ',
  },

  segments: [
    {
      id: 'model',
      enabled: true,
      icon: { nerd_font: '', plain: '🤖' },
      content: (ctx) => ctx.model?.display_name || 'Claude',
      style: {
        fg: 208,  // Orange
        bold: true
      }
    },
    {
      id: 'directory',
      enabled: true,
      icon: { nerd_font: '󰉋', plain: '📁' },
      content: (ctx) => {
        const dir = ctx.workspace?.current_dir || ctx.cwd || '';
        return dir.split('/').pop() || dir;
      },
      style: {
        fg: 142,  // Green
        bold: true
      }
    },
    {
      id: 'git',
      enabled: (ctx) => !!ctx.workspace?.git_branch,
      icon: { nerd_font: '󰊢', plain: '🌿' },
      content: (ctx) => ctx.workspace?.git_branch,
      style: {
        fg: 109,  // Blue
        bold: true
      }
    },
    {
      id: 'context_window',
      enabled: true,
      icon: { nerd_font: '', plain: '⚡️' },
      content: (ctx) => {
        const cw = ctx.context_window;
        if (!cw?.current_usage) return '0%';
        const usage = cw.current_usage;
        const total = (usage.input_tokens || 0) +
                     (usage.cache_creation_input_tokens || 0) +
                     (usage.cache_read_input_tokens || 0);
        return `${Math.round((total / (cw.context_window_size || 200000)) * 100)}%`;
      },
      style: {
        fg: 5,    // Cyan/Purple
        bold: true
      }
    },
    {
      id: 'cost',
      enabled: (ctx) => ctx.cost?.total_cost_usd !== undefined,
      icon: { nerd_font: '', plain: '💰' },
      content: (ctx) => `$${(ctx.cost?.total_cost_usd || 0).toFixed(4)}`,
      style: {
        fg: 214,  // Yellow
        bold: true
      }
    }
  ]
};
