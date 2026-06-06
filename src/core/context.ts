import fs from 'fs-extra';
import path from 'path';
import { execSync } from 'child_process';

export interface ContextInfo {
  cwd: string;
  gitBranch?: string;
  gitStatus?: string;
  files: string[];
  packageJson?: any;
}

export async function gatherContext(maxFiles = 20): Promise<ContextInfo> {
  const cwd = process.cwd();
  const context: ContextInfo = {
    cwd,
    files: [],
  };

  // Git信息
  try {
    context.gitBranch = execSync('git branch --show-current', {
      cwd,
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'ignore'],
    }).trim();
  } catch {
    // 非Git仓库
  }

  try {
    context.gitStatus = execSync('git status --short', {
      cwd,
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'ignore'],
    }).trim();
  } catch {
    // 忽略
  }

  // 读取目录文件列表
  try {
    const entries = await fs.readdir(cwd, { withFileTypes: true });
    context.files = entries
      .filter((e) => !e.name.startsWith('.') && !e.name.startsWith('node_modules'))
      .slice(0, maxFiles)
      .map((e) => (e.isDirectory() ? `${e.name}/` : e.name));
  } catch {
    // 忽略
  }

  // 读取package.json
  try {
    const pkgPath = path.join(cwd, 'package.json');
    if (await fs.pathExists(pkgPath)) {
      context.packageJson = await fs.readJson(pkgPath);
    }
  } catch {
    // 忽略
  }

  return context;
}

export function formatContext(context: ContextInfo): string {
  const lines: string[] = [];
  lines.push(`当前目录: ${context.cwd}`);

  if (context.gitBranch) {
    lines.push(`Git分支: ${context.gitBranch}`);
  }

  if (context.gitStatus) {
    lines.push(`Git状态:\n${context.gitStatus}`);
  }

  if (context.packageJson) {
    lines.push(`项目名称: ${context.packageJson.name || 'N/A'}`);
    if (context.packageJson.scripts) {
      lines.push(`可用脚本: ${Object.keys(context.packageJson.scripts).join(', ')}`);
    }
  }

  if (context.files.length > 0) {
    lines.push(`目录文件: ${context.files.join(', ')}`);
  }

  return lines.join('\n');
}
