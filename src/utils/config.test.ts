import { loadConfig, saveConfig, DEFAULT_CONFIG } from './config';
import fs from 'fs-extra';
import path from 'path';
import os from 'os';

const TEST_CONFIG_DIR = path.join(os.tmpdir(), 'smartshell-test');
const TEST_CONFIG_FILE = path.join(TEST_CONFIG_DIR, 'config.json');

// Mock config path
jest.mock('./config', () => {
  const original = jest.requireActual('./config');
  return {
    ...original,
    getConfigDir: () => TEST_CONFIG_DIR,
  };
});

describe('Config Module', () => {
  beforeEach(async () => {
    await fs.remove(TEST_CONFIG_DIR);
  });

  afterEach(async () => {
    await fs.remove(TEST_CONFIG_DIR);
  });

  test('should return default config when no config exists', async () => {
    const config = await loadConfig();
    expect(config.defaultModel).toBe('openai');
    expect(config.safetyMode).toBe('normal');
    expect(config.historyEnabled).toBe(true);
  });

  test('should save and load config', async () => {
    const customConfig = {
      ...DEFAULT_CONFIG,
      defaultModel: 'anthropic',
      safetyMode: 'strict' as const,
    };

    await saveConfig(customConfig);
    const loaded = await loadConfig();

    expect(loaded.defaultModel).toBe('anthropic');
    expect(loaded.safetyMode).toBe('strict');
  });
});
