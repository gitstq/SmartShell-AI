import { spawn } from 'child_process';
import { AppConfig } from '../utils/config';

const DANGEROUS_PATTERNS = [
  /rm\s+-rf\s+\/\s*$/i,
  /rm\s+-rf\s+\//i,
  />\s*\/dev\/null.*\bfb\b/i,
  /:(){ :|:& };:/,
  /mkfs\./,
  /dd\s+if=.*of=\/dev\/[sh]d/,
  />\s*\/etc\/passwd/,
  />\s*\/etc\/shadow/,
  /chmod\s+-R\s+777\s+\//,
  /chown\s+-R\s+.*\s+\//,
];

const MODERATE_PATTERNS = [
  /rm\s+-rf/i,
  /rm\s+-r/i,
  />\s*\//,
  /sudo\s+/,
  /chmod\s+777/,
];

export function checkSafety(command: string): {
  level: 'dangerous' | 'moderate' | 'safe';
  warnings: string[];
} {
  const warnings: string[] = [];

  for (const pattern of DANGEROUS_PATTERNS) {
    if (pattern.test(command)) {
      warnings.push('⚠️ 检测到高危命令，可能破坏系统！');
      return { level: 'dangerous', warnings };
    }
  }

  for (const pattern of MODERATE_PATTERNS) {
    if (pattern.test(command)) {
      warnings.push('⚠️ 该命令可能影响系统文件，请谨慎执行');
    }
  }

  if (command.includes('sudo')) {
    warnings.push('⚠️ 需要管理员权限，请确认您了解该命令的作用');
  }

  return {
    level: warnings.length > 0 ? 'moderate' : 'safe',
    warnings,
  };
}

export async function executeCommand(
  command: string,
  config: AppConfig
): Promise<{ success: boolean; output: string }> {
  return new Promise((resolve) => {
    const shell = process.platform === 'win32' ? 'cmd.exe' : 'bash';
    const shellFlag = process.platform === 'win32' ? '/c' : '-c';

    const child = spawn(shell, [shellFlag, command], {
      cwd: process.cwd(),
      env: process.env,
      stdio: ['ignore', 'pipe', 'pipe'],
    });

    let stdout = '';
    let stderr = '';

    child.stdout?.on('data', (data) => {
      stdout += data.toString();
      if (config.safetyMode !== 'strict') {
        process.stdout.write(data);
      }
    });

    child.stderr?.on('data', (data) => {
      stderr += data.toString();
      if (config.safetyMode !== 'strict') {
        process.stderr.write(data);
      }
    });

    child.on('close', (code) => {
      const success = code === 0;
      const output = stdout + (stderr ? `\n${stderr}` : '');
      resolve({ success, output });
    });

    child.on('error', (err) => {
      resolve({ success: false, output: err.message });
    });
  });
}
