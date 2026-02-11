/**
 * Claude Code Statusline Configuration
 *
 * This is a JavaScript module that exports your statusline configuration.
 * You can customize segments, add your own with functions, and style them.
 */

module.exports = {
  // Global settings
  settings: {
    mode: 'nerd_font',      // 'nerd_font' or 'plain'
    separator: ' | ',
  },

  // Segment definitions - displayed in order
  segments: [
    // AI Model name
    {
      id: 'model',
      enabled: true,
      icon: {
        plain: '🤖',
        nerd_font: ''
      },
      content: (ctx) => ctx.model?.display_name || 'Claude',
      style: {
        fg: 208,      // Orange (256-color)
        bold: true
      }
    },

    // Current directory
    {
      id: 'directory',
      enabled: true,
      icon: {
        plain: '📁',
        nerd_font: '󰉋'
      },
      content: (ctx) => {
        const dir = ctx.workspace?.current_dir || ctx.cwd || '';
        const parts = dir.split('/');
        return parts[parts.length - 1] || dir;
      },
      style: {
        fg: 142,      // Green
        bold: true
      }
    },

    // Git branch
    {
      id: 'git',
      enabled: (ctx) => {
        // Only show if we have git info in context
        // In real usage, you'd detect git presence
        return ctx.workspace?.git_branch !== undefined;
      },
      icon: {
        plain: '🌿',
        nerd_font: '󰊢'
      },
      content: (ctx) => ctx.workspace?.git_branch,
      style: {
        fg: 109,      // Blue
        bold: true
      }
    },

    // Context window usage
    {
      id: 'context_window',
      enabled: true,
      icon: {
        plain: '⚡️',
        nerd_font: ''
      },
      content: (ctx) => {
        const cw = ctx.context_window;
        if (!cw?.current_usage) return '0%';

        const usage = cw.current_usage;
        const total = (usage.input_tokens || 0) +
                     (usage.cache_creation_input_tokens || 0) +
                     (usage.cache_read_input_tokens || 0);
        const size = cw.context_window_size || 200000;
        return `${(total/1000).toFixed(2)}k ${Math.round((total / size) * 100)}%`;
      },
      style: {
        fg: (ctx) => {
          // Dynamic color based on usage
          const cw = ctx.context_window;
          if (!cw?.current_usage) return 5;

          const usage = cw.current_usage;
          const total = (usage.input_tokens || 0) +
                       (usage.cache_creation_input_tokens || 0) +
                       (usage.cache_read_input_tokens || 0);
          const size = cw.context_window_size || 200000;
          const percent = (total / size) * 100;

          if (percent > 80) return 196;  // Red for high usage
          if (percent > 50) return 214;  // Orange for medium
          return 5;                       // Cyan for low
        },
        bold: true
      }
    },

    // Cost
    {
      id: 'cost',
      enabled: (ctx) => ctx.cost?.total_cost_usd !== undefined,
      icon: {
        plain: '💰',
        nerd_font: ''
      },
      content: (ctx) => {
        const cost = ctx.cost?.total_cost_usd || 0;
        return `$${cost.toFixed(2)}`;
      },
      style: {
        fg: 214,      // Yellow
        bold: true
      }
    },

    // Session duration
    {
      id: 'session',
      enabled: (ctx) => ctx.cost?.total_duration_ms !== undefined,
      icon: {
        plain: '⏱️',
        nerd_font: '󱦻'
      },
      content: (ctx) => {
        const ms = ctx.cost?.total_duration_ms || 0;
        const seconds = Math.floor(ms / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);

        if (hours > 0) {
          return `${hours}h${String(minutes % 60).padStart(2, '0')}m`;
        }
        if (minutes > 0) {
          return `${minutes}m${String(seconds % 60).padStart(2, '0')}s`;
        }
        return `${seconds}s`;
      },
      style: {
        fg: 142,      // Green
        bold: true
      }
    },

    // Output style
    {
      id: 'output_style',
      enabled: (ctx) => ctx.output_style?.name !== undefined,
      icon: {
        plain: '🎯',
        nerd_font: '󱋵'
      },
      content: (ctx) => ctx.output_style?.name,
      style: {
        fg: 109,      // Blue
        bold: true
      }
    },

    // Token usage (optional, disabled by default)
    {
      id: 'usage',
      enabled: false,  // Enable if you want to see token counts
      icon: {
        plain: '📊',
        nerd_font: '󰪞'
      },
      content: (ctx) => {
        const cw = ctx.context_window;
        if (!cw) return null;

        const input = cw.total_input_tokens || 0;
        const output = cw.total_output_tokens || 0;

        const fmt = (n) => {
          if (n >= 1000000) return `${(n/1000000).toFixed(1)}M`;
          if (n >= 1000) return `${(n/1000).toFixed(1)}K`;
          return String(n);
        };

        return `I:${fmt(input)} O:${fmt(output)}`;
      },
      style: {
        fg: 14        // Cyan
      }
    }
  ]
};
