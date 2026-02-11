/**
 * Nord Theme for Claude Code Statusline
 * A polar-inspired color palette
 */

module.exports = {
  settings: {
    mode: 'nerd_font',
    separator: '',  // No separator for powerline effect
  },

  segments: [
    {
      id: 'model',
      enabled: true,
      icon: { nerd_font: '', plain: '🤖' },
      content: (ctx) => ctx.model?.display_name || 'Claude',
      style: {
        fg: { r: 46, g: 52, b: 64 },    // Dark text
        bg: { r: 136, g: 192, b: 208 }, // Frost blue background
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
        fg: { r: 46, g: 52, b: 64 },
        bg: { r: 163, g: 190, b: 140 }, // Aurora green
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
        fg: { r: 46, g: 52, b: 64 },
        bg: { r: 180, g: 142, b: 173 }, // Aurora purple
      }
    }
  ]
};
