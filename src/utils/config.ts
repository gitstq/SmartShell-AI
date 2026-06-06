import fs from 'fs-extra';
import path from 'path';
import os from 'os';

export interface ModelConfig {
  provider: 'openai' | 'anthropic' | 'google' | 'ollama';
  apiKey?: string;
  baseUrl?: string;
  model: string;
}

export interface AppConfig {
  defaultModel: string;
  models: Record<string, ModelConfig>;
  safetyMode: 'strict' | 'normal' | 'disabled';
  historyEnabled: boolean;
  maxHistoryItems: number;
  contextEnabled: boolean;
}

const CONFIG_DIR = path.join(os.homedir(), '.smartshell');
const CONFIG_FILE = path.join(CONFIG_DIR, 'config.json');

export const DEFAULT_CONFIG: AppConfig = {
  defaultModel: 'openai',
  models: {
    openai: {
      provider: 'openai',
      model: 'gpt-4o-mini',
    },
    anthropic: {
      provider: 'anthropic',
      model: 'claude-3-haiku-20240307',
    },
    google: {
      provider: 'google',
      model: 'gemini-1.5-flash',
    },
    ollama: {
      provider: 'ollama',
      baseUrl: 'http://localhost:11434',
      model: 'llama3.2',
    },
  },
  safetyMode: 'normal',
  historyEnabled: true,
  maxHistoryItems: 1000,
  contextEnabled: true,
};

export async function loadConfig(): Promise<AppConfig> {
  try {
    if (await fs.pathExists(CONFIG_FILE)) {
      const data = await fs.readJson(CONFIG_FILE);
      return { ...DEFAULT_CONFIG, ...data };
    }
  } catch {
    // ignore
  }
  return { ...DEFAULT_CONFIG };
}

export async function saveConfig(config: AppConfig): Promise<void> {
  await fs.ensureDir(CONFIG_DIR);
  await fs.writeJson(CONFIG_FILE, config, { spaces: 2 });
}

export function getConfigDir(): string {
  return CONFIG_DIR;
}
