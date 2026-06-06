import { Command } from 'commander';
import inquirer from 'inquirer';
import chalk from 'chalk';
import { loadConfig, saveConfig, AppConfig, DEFAULT_CONFIG } from '../utils/config';
import { info, success, warning } from '../utils/logger';

export const configCommand = new Command('config')
  .alias('c')
  .description('⚙️  配置管理')
  .option('--setup', '首次配置向导')
  .option('--show', '显示当前配置')
  .option('--reset', '恢复默认配置')
  .action(async (options) => {
    let config = await loadConfig();

    if (options.reset) {
      config = { ...DEFAULT_CONFIG };
      await saveConfig(config);
      success('✅ 配置已恢复为默认值');
      return;
    }

    if (options.show) {
      console.log(chalk.cyan('⚙️  当前配置'));
      console.log(chalk.yellow('─'.repeat(40)));
      console.log(`默认模型: ${chalk.green(config.defaultModel)}`);
      console.log(`安全模式: ${chalk.green(config.safetyMode)}`);
      console.log(`历史记录: ${config.historyEnabled ? chalk.green('启用') : chalk.red('禁用')}`);
      console.log(`上下文感知: ${config.contextEnabled ? chalk.green('启用') : chalk.red('禁用')}`);
      console.log(chalk.yellow('─'.repeat(40)));
      console.log(chalk.cyan('已配置模型:'));
      Object.entries(config.models).forEach(([key, model]) => {
        const hasKey = model.apiKey ? chalk.green('✓') : chalk.red('✗');
        console.log(`  ${hasKey} ${chalk.cyan(key)}: ${model.provider} / ${model.model}`);
      });
      return;
    }

    if (options.setup || Object.keys(config.models).length === 0) {
      console.log(chalk.cyan('🚀 SmartShell AI 配置向导'));
      console.log(chalk.gray('请按提示配置您的AI模型\n'));

      const answers = await inquirer.prompt([
        {
          type: 'list',
          name: 'defaultModel',
          message: '选择默认使用的AI模型:',
          choices: [
            { name: 'OpenAI (GPT-4o/GPT-4o-mini)', value: 'openai' },
            { name: 'Anthropic (Claude 3)', value: 'anthropic' },
            { name: 'Google (Gemini)', value: 'google' },
            { name: 'Ollama (本地模型)', value: 'ollama' },
          ],
          default: config.defaultModel,
        },
        {
          type: 'input',
          name: 'openaiKey',
          message: 'OpenAI API密钥 (不需要可留空):',
          when: (answers) => true,
          default: config.models.openai?.apiKey || '',
        },
        {
          type: 'input',
          name: 'anthropicKey',
          message: 'Anthropic API密钥 (不需要可留空):',
          default: config.models.anthropic?.apiKey || '',
        },
        {
          type: 'input',
          name: 'googleKey',
          message: 'Google API密钥 (不需要可留空):',
          default: config.models.google?.apiKey || '',
        },
        {
          type: 'input',
          name: 'ollamaUrl',
          message: 'Ollama服务地址:',
          default: config.models.ollama?.baseUrl || 'http://localhost:11434',
        },
        {
          type: 'list',
          name: 'safetyMode',
          message: '安全模式:',
          choices: [
            { name: '严格 - 所有命令都需要确认', value: 'strict' },
            { name: '普通 - 仅危险命令需要确认', value: 'normal' },
            { name: '禁用 - 直接执行所有命令', value: 'disabled' },
          ],
          default: config.safetyMode,
        },
      ]);

      config.defaultModel = answers.defaultModel;
      if (answers.openaiKey) config.models.openai.apiKey = answers.openaiKey;
      if (answers.anthropicKey) config.models.anthropic.apiKey = answers.anthropicKey;
      if (answers.googleKey) config.models.google.apiKey = answers.googleKey;
      if (answers.ollamaUrl) config.models.ollama.baseUrl = answers.ollamaUrl;
      config.safetyMode = answers.safetyMode;

      await saveConfig(config);
      success('✅ 配置已保存');
      info(`配置文件位置: ~/.smartshell/config.json`);
      return;
    }

    // 交互式配置菜单
    const { action } = await inquirer.prompt([
      {
        type: 'list',
        name: 'action',
        message: '选择配置项:',
        choices: [
          { name: '设置默认模型', value: 'default' },
          { name: '配置API密钥', value: 'apikey' },
          { name: '切换安全模式', value: 'safety' },
          { name: '启用/禁用历史记录', value: 'history' },
          { name: '启用/禁用上下文', value: 'context' },
          { name: '查看当前配置', value: 'show' },
        ],
      },
    ]);

    switch (action) {
      case 'default': {
        const { model } = await inquirer.prompt([
          {
            type: 'list',
            name: 'model',
            message: '选择默认模型:',
            choices: Object.keys(config.models),
          },
        ]);
        config.defaultModel = model;
        break;
      }
      case 'apikey': {
        const { provider, key } = await inquirer.prompt([
          {
            type: 'list',
            name: 'provider',
            message: '选择提供商:',
            choices: Object.keys(config.models),
          },
          {
            type: 'password',
            name: 'key',
            message: '输入API密钥:',
            mask: '*',
          },
        ]);
        config.models[provider].apiKey = key;
        break;
      }
      case 'safety': {
        const { mode } = await inquirer.prompt([
          {
            type: 'list',
            name: 'mode',
            message: '选择安全模式:',
            choices: ['strict', 'normal', 'disabled'],
          },
        ]);
        config.safetyMode = mode;
        break;
      }
      case 'history': {
        config.historyEnabled = !config.historyEnabled;
        info(`历史记录已${config.historyEnabled ? '启用' : '禁用'}`);
        break;
      }
      case 'context': {
        config.contextEnabled = !config.contextEnabled;
        info(`上下文感知已${config.contextEnabled ? '启用' : '禁用'}`);
        break;
      }
      case 'show': {
        console.log(JSON.stringify(config, null, 2));
        return;
      }
    }

    await saveConfig(config);
    success('✅ 配置已更新');
  });
