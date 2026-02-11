# Claude Code Statusline

[![Node.js Version](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen)](https://nodejs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE.md)

为 [Claude Code](https://claude.ai/code) 打造的高性能、可自定义状态栏工具。

> **灵感来源**: [CCometixLine](https://github.com/Haleclipse/CCometixLine)

![Statusline Preview](https://github.com/kiritoko1029/picx-images-hosting/raw/master/statusline-preview.png.2yyvl9kss9.webp)

## 功能特性

- **🎨 多主题支持** - 内置 `default`、`minimal`、`gruvbox`、`nord`、`powerline-*` 等多种主题
- **🔧 灵活配置** - 支持 TOML 和 JavaScript 两种配置格式
- **⚡ 高性能** - Node.js 原生实现，毫秒级渲染
- **🎯 内置组件** - 模型显示、当前目录、Git 分支、Token 用量、成本统计、会话时长等
- **🔤 Nerd Font 支持** - 自动检测并适配 Nerd Font 图标
- **🌈 ANSI 真彩色** - 支持 256 色和真彩色输出

## 安装

### 前置要求

- Node.js >= 16.0.0
- Claude Code >= 1.0.80

### 快速安装

```bash
# 克隆仓库
git clone https://github.com/yourusername/claude-code-statusline.git ~/.claude/statusLine-node
cd ~/.claude/statusLine-node

# 安装依赖
npm install

# 使脚本可执行
chmod +x statusline.js
```

### Claude Code 配置

编辑 `~/.claude/settings.json`：

```json
{
  "statusLine": {
    "type": "command",
    "command": "node ~/.claude/statusLine-node/statusline.js",
    "padding": 0
  }
}
```

## 使用指南

### 选择主题

```bash
# 使用内置主题
export CLAUDE_STATUSLINE_THEME=gruvbox

# 或在 Claude Code 配置中指定
{
  "statusLine": {
    "type": "command",
    "command": "node ~/.claude/statusLine-node/statusline.js",
    "env": {
      "CLAUDE_STATUSLINE_THEME": "nord"
    }
  }
}
```

### 可用主题

| 主题 | 描述 |
|------|------|
| `default` | 默认主题，使用基础色彩 |
| `minimal` | 极简风格，无图标 |
| `gruvbox` | 经典 Gruvbox 配色 |
| `nord` | Nord 冷色调主题 |
| `powerline-dark` | 深色 Powerline 风格 |
| `powerline-light` | 浅色 Powerline 风格 |
| `powerline-rose-pine` | Rose Pine 配色 |
| `powerline-tokyo-night` | Tokyo Night 配色 |
| `cometix` | 自定义 Cometix 主题 |

### 自定义配置

创建 `~/.claude/statusline.config.js`：

```javascript
module.exports = {
  settings: {
    mode: 'nerd_font',      // 'nerd_font' 或 'plain'
    separator: ' | ',
  },
  segments: [
    {
      id: 'model',
      enabled: true,
      icon: { plain: '🤖', nerd_font: '' },
      style: { fg: 208, bold: true }
    },
    {
      id: 'directory',
      enabled: true,
      icon: { plain: '📁', nerd_font: '󰉋' },
      style: { fg: 142, bold: true }
    },
    // 更多组件...
  ]
};
```

或使用 TOML 格式 (`~/.claude/statusline.config.toml`)：

```toml
theme = "default"

[style]
mode = "plain"
separator = " | "

[[segments]]
id = "model"
enabled = true

[segments.icon]
plain = "🤖"
nerd_font = ""

[segments.colors.text]
c16 = 14
```

### 内置组件

| 组件 ID | 描述 | 默认启用 |
|---------|------|----------|
| `model` | 显示当前 AI 模型名称 | ✅ |
| `directory` | 显示当前工作目录 | ✅ |
| `git` | 显示 Git 分支 | ✅ |
| `context_window` | 显示上下文窗口使用率 | ✅ |
| `cost` | 显示会话成本 | ❌ |
| `session` | 显示会话时长 | ❌ |
| `usage` | 显示 Token 用量 | ❌ |
| `output_style` | 显示输出样式模式 | ❌ |

## 项目结构

```
statusLine-node/
├── statusline.js          # 主入口文件
├── config.js              # JavaScript 配置示例
├── statusline.md          # 详细文档
├── lib/
│   ├── config/            # 配置加载与验证
│   ├── io/                # 输入输出处理
│   ├── render/            # 渲染引擎
│   └── segments/          # 内置组件实现
├── themes/                # 主题文件
│   ├── default.toml
│   ├── gruvbox.toml
│   ├── nord.toml
│   └── ...
└── test/                  # 测试文件
```

## 开发

```bash
# 运行测试
npm test

# 代码检查
npm run lint

# 调试模式
DEBUG=1 node statusline.js
```

### 测试输入

```bash
# 模拟 Claude Code 输入
echo '{
  "model": {"display_name": "Opus"},
  "workspace": {"current_dir": "/home/user/project"},
  "cost": {"total_cost_usd": 0.0123},
  "context_window": {
    "context_window_size": 200000,
    "current_usage": {
      "input_tokens": 5000,
      "cache_read_input_tokens": 2000
    }
  }
}' | node statusline.js
```

## JSON 输入格式

Claude Code 通过 stdin 传递以下 JSON 结构：

```json
{
  "hook_event_name": "Status",
  "session_id": "abc123...",
  "transcript_path": "/path/to/transcript.json",
  "cwd": "/current/working/directory",
  "model": {
    "id": "claude-opus-4-1",
    "display_name": "Opus"
  },
  "workspace": {
    "current_dir": "/current/working/directory",
    "project_dir": "/original/project/directory"
  },
  "version": "1.0.80",
  "output_style": { "name": "default" },
  "cost": {
    "total_cost_usd": 0.01234,
    "total_duration_ms": 45000,
    "total_lines_added": 156,
    "total_lines_removed": 23
  },
  "context_window": {
    "total_input_tokens": 15234,
    "total_output_tokens": 4521,
    "context_window_size": 200000,
    "current_usage": {
      "input_tokens": 8500,
      "output_tokens": 1200,
      "cache_creation_input_tokens": 5000,
      "cache_read_input_tokens": 2000
    }
  }
}
```

## 故障排除

| 问题 | 解决方案 |
|------|----------|
| 状态行不显示 | 检查脚本是否可执行 (`chmod +x statusline.js`) |
| 图标显示为方框 | 安装 [Nerd Font](https://www.nerdfonts.com/) 或切换到 `plain` 模式 |
| JSON 解析错误 | 检查 Claude Code 版本是否 >= 1.0.80 |
| 配置不生效 | 验证 TOML/JS 语法，查看调试输出 (`DEBUG=1`) |

## 贡献

欢迎提交 Issue 和 PR！请遵循以下步骤：

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add amazing feature'`)
4. 推送分支 (`git push origin feature/amazing-feature`)
5. 创建 Pull Request

## 许可证

[MIT](LICENSE.md) © Claude Code Statusline Contributors

## 相关链接

- [Claude Code 文档](https://docs.anthropic.com/en/docs/claude-code)
- [Nerd Fonts](https://www.nerdfonts.com/)
- [256 Colors Cheat Sheet](https://jonasjacek.github.io/colors/)
