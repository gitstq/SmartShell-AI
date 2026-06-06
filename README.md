<div align="center">

# 🧠 SmartShell AI

**轻量级跨平台终端AI命令助手，让自然语言秒变Shell命令**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3+-blue.svg)](https://www.typescriptlang.org/)

[简体中文](#简体中文) | [繁體中文](#繁體中文) | [English](#english)

</div>

---

## 简体中文

### 🎉 项目介绍

SmartShell AI 是一款专为开发者打造的轻量级终端AI命令助手。在日常开发中，你是否经常：
- 🤔 忘记复杂的Shell命令语法？
- 🔍 在Google和StackOverflow之间反复搜索？
- ⚠️ 担心执行了错误的命令导致系统损坏？
- 📝 想要记录和复用常用的命令组合？

SmartShell AI 完美解决以上痛点！只需用自然语言描述你的需求，它就能智能生成精确的Shell命令，并支持安全执行、历史记录、多模型切换等强大功能。

**灵感来源**：2025年终端AI Agent生态爆发（Warp开源、Claude Code、Gemini CLI等），但现有工具普遍存在配置复杂、仅支持单一模型、缺乏跨平台统一体验等问题。SmartShell AI 致力于打造一个零配置、多模型、安全可控的终端AI助手。

**自研差异化亮点**：
- 🔄 **多模型热切换**：OpenAI、Claude、Gemini、Ollama本地模型一键切换
- 🧠 **智能上下文感知**：自动识别当前Git分支、项目结构、可用脚本
- 🛡️ **三级安全引擎**：危险命令自动拦截、可疑命令警告提示、普通命令直接执行
- 📜 **本地历史记录**：SQLite存储，支持模糊搜索和统计回顾
- ⚡ **零配置启动**：首次使用自动引导配置，无需手动编辑配置文件

### ✨ 核心特性

| 特性 | 说明 |
|------|------|
| 🤖 **自然语言转命令** | 用中文或英文描述需求，自动生成精确Shell命令 |
| 🔄 **多模型支持** | 支持OpenAI、Anthropic Claude、Google Gemini、Ollama本地模型 |
| 🛡️ **安全执行模式** | 三级安全检测：高危拦截、中危确认、低危直接执行 |
| 🧠 **上下文感知** | 自动读取当前目录结构、Git状态、package.json等信息 |
| 📜 **命令历史** | 本地SQLite存储，支持搜索、统计、复用 |
| 📖 **命令解释** | 反向解释任意Shell命令的功能和参数含义 |
| ⚙️ **交互式配置** | 向导式配置，无需手动编辑JSON文件 |
| 🌐 **跨平台** | 支持macOS、Linux、Windows全平台 |

### 🚀 快速开始

#### 环境要求
- Node.js >= 18.0.0
- npm 或 yarn

#### 安装

```bash
# 全局安装
npm install -g smartshell-ai

# 或使用 npx（无需安装）
npx smartshell-ai --help
```

#### 首次配置

```bash
# 启动配置向导
smartshell config --setup
```

#### 基本使用

```bash
# 自然语言生成命令
smartshell ask "查找当前目录下所有大于100MB的文件"

# 生成并直接执行
smartshell exec "显示当前Git仓库的最新提交记录"

# 解释命令
smartshell explain "find . -name '*.log' -mtime +7 -delete"

# 查看历史记录
smartshell history

# 切换AI模型
smartshell model --switch anthropic
```

### 📖 详细使用指南

#### 命令列表

| 命令 | 别名 | 功能 |
|------|------|------|
| `ask <query>` | `a` | 生成命令（不执行） |
| `exec <query>` | `e` | 生成并执行命令 |
| `explain <command>` | `x` | 解释命令含义 |
| `history` | `h` | 查看历史记录 |
| `model` | `m` | 模型管理 |
| `config` | `c` | 配置管理 |

#### 高级用法

```bash
# 使用指定模型
smartshell ask "部署Docker容器" --model openai

# 跳过确认直接执行（谨慎使用）
smartshell exec "列出所有运行中的进程" --yes

# 搜索历史记录
smartshell history --search "docker"

# 查看统计信息
smartshell history --stats
```

#### 支持的模型

| 提供商 | 默认模型 | 需要API密钥 |
|--------|----------|-------------|
| OpenAI | gpt-4o-mini | ✅ |
| Anthropic | claude-3-haiku | ✅ |
| Google | gemini-1.5-flash | ✅ |
| Ollama | llama3.2 | ❌（本地运行） |

### 💡 设计思路与迭代规划

**技术选型原因**：
- **TypeScript**：类型安全、生态丰富、跨平台编译
- **Commander.js**：成熟的CLI框架，社区活跃
- **SQLite**：零配置、轻量级本地存储
- **OpenAI/Anthropic/Google SDK**：直接调用官方API，稳定可靠

**后续迭代计划**：
- [ ] 支持更多模型（Mistral、Cohere、DeepSeek等）
- [ ] 命令模板系统（保存常用命令组合）
- [ ] 管道支持（多步骤命令链）
- [ ] 插件系统（自定义命令扩展）
- [ ] TUI界面（终端图形化界面）
- [ ] 团队协作（共享命令库）

### 📦 打包与部署

#### 从源码构建

```bash
# 克隆仓库
git clone https://github.com/gitstq/SmartShell-AI.git
cd SmartShell-AI

# 安装依赖
npm install

# 编译
npm run build

# 本地运行
npm start -- --help
```

#### 打包为可执行文件

```bash
# 打包当前平台
npm run package

# 打包所有平台（Linux/macOS/Windows）
npm run package:all
```

打包产物位于 `bin/` 目录下。

### 🤝 贡献指南

欢迎提交Issue和PR！请遵循以下规范：

- **Issue**：描述问题时请提供复现步骤和环境信息
- **PR**：使用 Angular 提交规范（`feat:`/`fix:`/`docs:`/`refactor:`）
- **代码风格**：使用 ESLint + Prettier，提交前运行 `npm run lint`

### 📄 开源协议

本项目采用 [MIT License](LICENSE) 开源协议。

---

## 繁體中文

### 🎉 項目介紹

SmartShell AI 是一款專為開發者打造的輕量級終端AI命令助手。在日常開發中，你是否經常：
- 🤔 忘記複雜的Shell命令語法？
- 🔍 在Google和StackOverflow之間反覆搜尋？
- ⚠️ 擔心執行了錯誤的命令導致系統損壞？
- 📝 想要記錄和復用常用的命令組合？

SmartShell AI 完美解決以上痛點！只需用自然語言描述你的需求，它就能智能生成精確的Shell命令，並支援安全執行、歷史記錄、多模型切換等強大功能。

**自研差異化亮點**：
- 🔄 **多模型熱切換**：OpenAI、Claude、Gemini、Ollama本地模型一鍵切換
- 🧠 **智能上下文感知**：自動識別當前Git分支、項目結構、可用腳本
- 🛡️ **三級安全引擎**：危險命令自動攔截、可疑命令警告提示、普通命令直接執行
- 📜 **本地歷史記錄**：SQLite存儲，支援模糊搜尋和統計回顧
- ⚡ **零配置啟動**：首次使用自動引導配置，無需手動編輯配置文件

### ✨ 核心特性

| 特性 | 說明 |
|------|------|
| 🤖 **自然語言轉命令** | 用中文或英文描述需求，自動生成精確Shell命令 |
| 🔄 **多模型支援** | 支援OpenAI、Anthropic Claude、Google Gemini、Ollama本地模型 |
| 🛡️ **安全執行模式** | 三級安全檢測：高危攔截、中危確認、低危直接執行 |
| 🧠 **上下文感知** | 自動讀取當前目錄結構、Git狀態、package.json等資訊 |
| 📜 **命令歷史** | 本地SQLite存儲，支援搜尋、統計、復用 |
| 📖 **命令解釋** | 反向解釋任意Shell命令的功能和參數含義 |
| ⚙️ **交互式配置** | 嚮導式配置，無需手動編輯JSON檔案 |
| 🌐 **跨平台** | 支援macOS、Linux、Windows全平台 |

### 🚀 快速開始

#### 環境要求
- Node.js >= 18.0.0
- npm 或 yarn

#### 安裝

```bash
# 全局安裝
npm install -g smartshell-ai

# 或使用 npx（無需安裝）
npx smartshell-ai --help
```

#### 首次配置

```bash
# 啟動配置嚮導
smartshell config --setup
```

#### 基本使用

```bash
# 自然語言生成命令
smartshell ask "查找當前目錄下所有大於100MB的檔案"

# 生成並直接執行
smartshell exec "顯示當前Git倉庫的最新提交記錄"

# 解釋命令
smartshell explain "find . -name '*.log' -mtime +7 -delete"

# 查看歷史記錄
smartshell history

# 切換AI模型
smartshell model --switch anthropic
```

### 📖 詳細使用指南

#### 命令列表

| 命令 | 別名 | 功能 |
|------|------|------|
| `ask <query>` | `a` | 生成命令（不執行） |
| `exec <query>` | `e` | 生成並執行命令 |
| `explain <command>` | `x` | 解釋命令含義 |
| `history` | `h` | 查看歷史記錄 |
| `model` | `m` | 模型管理 |
| `config` | `c` | 配置管理 |

#### 進階用法

```bash
# 使用指定模型
smartshell ask "部署Docker容器" --model openai

# 跳過確認直接執行（謹慎使用）
smartshell exec "列出所有運行中的進程" --yes

# 搜尋歷史記錄
smartshell history --search "docker"

# 查看統計資訊
smartshell history --stats
```

### 📦 打包與部署

#### 從原始碼構建

```bash
# 克隆倉庫
git clone https://github.com/gitstq/SmartShell-AI.git
cd SmartShell-AI

# 安裝依賴
npm install

# 編譯
npm run build

# 本地運行
npm start -- --help
```

#### 打包為可執行檔案

```bash
# 打包當前平台
npm run package

# 打包所有平台（Linux/macOS/Windows）
npm run package:all
```

### 🤝 貢獻指南

歡迎提交Issue和PR！請遵循以下規範：

- **Issue**：描述問題時請提供復現步驟和環境資訊
- **PR**：使用 Angular 提交規範（`feat:`/`fix:`/`docs:`/`refactor:`）
- **代碼風格**：使用 ESLint + Prettier，提交前運行 `npm run lint`

### 📄 開源協議

本項目採用 [MIT License](LICENSE) 開源協議。

---

## English

### 🎉 Introduction

SmartShell AI is a lightweight cross-platform terminal AI command assistant built for developers. Do you often:
- 🤔 Forget complex Shell command syntax?
- 🔍 Search back and forth between Google and StackOverflow?
- ⚠️ Worry about executing wrong commands that damage your system?
- 📝 Want to record and reuse common command combinations?

SmartShell AI perfectly solves these pain points! Just describe your needs in natural language, and it will intelligently generate precise Shell commands, with support for safe execution, history tracking, multi-model switching, and more.

**Differentiation Highlights**:
- 🔄 **Multi-Model Hot Switching**: One-click switching between OpenAI, Claude, Gemini, and Ollama local models
- 🧠 **Smart Context Awareness**: Auto-detect current Git branch, project structure, available scripts
- 🛡️ **Three-Level Safety Engine**: Auto-block dangerous commands, warn suspicious ones, execute safe ones directly
- 📜 **Local History**: SQLite storage with fuzzy search and statistics
- ⚡ **Zero-Config Startup**: Guided setup on first use, no manual config file editing

### ✨ Core Features

| Feature | Description |
|---------|-------------|
| 🤖 **Natural Language to Command** | Describe needs in English or Chinese, get precise Shell commands |
| 🔄 **Multi-Model Support** | OpenAI, Anthropic Claude, Google Gemini, Ollama local models |
| 🛡️ **Safe Execution Mode** | Three-level safety: block high-risk, confirm moderate, execute low-risk |
| 🧠 **Context Awareness** | Auto-read current directory, Git status, package.json |
| 📜 **Command History** | Local SQLite storage with search, stats, and reuse |
| 📖 **Command Explanation** | Explain any Shell command's function and parameters |
| ⚙️ **Interactive Config** | Wizard-style setup, no manual JSON editing |
| 🌐 **Cross-Platform** | macOS, Linux, Windows support |

### 🚀 Quick Start

#### Requirements
- Node.js >= 18.0.0
- npm or yarn

#### Installation

```bash
# Global install
npm install -g smartshell-ai

# Or use npx (no installation needed)
npx smartshell-ai --help
```

#### First-Time Setup

```bash
# Launch setup wizard
smartshell config --setup
```

#### Basic Usage

```bash
# Generate command from natural language
smartshell ask "find all files larger than 100MB in current directory"

# Generate and execute directly
smartshell exec "show latest git commit history"

# Explain a command
smartshell explain "find . -name '*.log' -mtime +7 -delete"

# View history
smartshell history

# Switch AI model
smartshell model --switch anthropic
```

### 📖 Detailed Usage Guide

#### Command Reference

| Command | Alias | Description |
|---------|-------|-------------|
| `ask <query>` | `a` | Generate command (without executing) |
| `exec <query>` | `e` | Generate and execute command |
| `explain <command>` | `x` | Explain command meaning |
| `history` | `h` | View command history |
| `model` | `m` | Model management |
| `config` | `c` | Configuration management |

#### Advanced Usage

```bash
# Use specific model
smartshell ask "deploy Docker container" --model openai

# Skip confirmation (use with caution)
smartshell exec "list all running processes" --yes

# Search history
smartshell history --search "docker"

# View statistics
smartshell history --stats
```

#### Supported Models

| Provider | Default Model | API Key Required |
|----------|---------------|------------------|
| OpenAI | gpt-4o-mini | ✅ |
| Anthropic | claude-3-haiku | ✅ |
| Google | gemini-1.5-flash | ✅ |
| Ollama | llama3.2 | ❌ (local) |

### 💡 Design & Roadmap

**Tech Stack Rationale**:
- **TypeScript**: Type safety, rich ecosystem, cross-platform compilation
- **Commander.js**: Mature CLI framework with active community
- **SQLite**: Zero-config, lightweight local storage
- **Official SDKs**: Direct API calls to OpenAI/Anthropic/Google for stability

**Roadmap**:
- [ ] More models (Mistral, Cohere, DeepSeek, etc.)
- [ ] Command templates (save common command combinations)
- [ ] Pipeline support (multi-step command chains)
- [ ] Plugin system (custom command extensions)
- [ ] TUI interface (terminal graphical interface)
- [ ] Team collaboration (shared command library)

### 📦 Build & Deploy

#### Build from Source

```bash
# Clone repo
git clone https://github.com/gitstq/SmartShell-AI.git
cd SmartShell-AI

# Install dependencies
npm install

# Compile
npm run build

# Run locally
npm start -- --help
```

#### Package as Executable

```bash
# Package for current platform
npm run package

# Package for all platforms (Linux/macOS/Windows)
npm run package:all
```

Output binaries are in the `bin/` directory.

### 🤝 Contributing

Issues and PRs are welcome! Please follow these guidelines:

- **Issue**: Provide reproduction steps and environment info
- **PR**: Use Angular commit convention (`feat:`/`fix:`/`docs:`/`refactor:`)
- **Code Style**: Use ESLint + Prettier, run `npm run lint` before commit

### 📄 License

This project is licensed under the [MIT License](LICENSE).

---

<div align="center">

**Made with ❤️ by gitstq**

⭐ Star this repo if you find it helpful!

</div>
