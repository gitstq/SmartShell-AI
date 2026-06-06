import { Command } from 'commander';
import chalk from 'chalk';
import { loadConfig, saveConfig } from '../utils/config';
import { info, success } from '../utils/logger';

export const modelCommand = new Command('model')
  .alias('m')
  .description('🔄 模型管理')
  .option('-l, --list', '列出所有可用模型')
  .option('-s, --switch <model>', '切换到指定模型')
  .option('-a, --add', '添加新模型')
  .action(async (options) => {
    const config = await loadConfig();

    if (options.list || (!options.switch && !options.add)) {
      console.log(chalk.cyan('🤖 可用模型列表'));
      console.log(chalk.yellow('─'.repeat(50)));

      Object.entries(config.models).forEach(([key, model]) => {
        const isDefault = key === config.defaultModel;
        const hasKey = model.apiKey || model.provider === 'ollama';
        const status = hasKey ? chalk.green('●') : chalk.red('○');
        const marker = isDefault ? chalk.yellow(' [默认]') : '';

        console.log(`${status} ${chalk.cyan(key)}${marker}`);
        console.log(`   提供商: ${model.provider}`);
        console.log(`   模型: ${model.model}`);
        if (model.baseUrl) {
          console.log(`   地址: ${model.baseUrl}`);
        }
        console.log();
      });

      console.log(chalk.gray('● = 已配置  ○ = 未配置'));
      return;
    }

    if (options.switch) {
      const modelKey = options.switch;
      if (!config.models[modelKey]) {
        console.error(chalk.red(`❌ 未找到模型: ${modelKey}`));
        console.log(chalk.gray('可用模型:'), Object.keys(config.models).join(', '));
        process.exit(1);
      }

      config.defaultModel = modelKey;
      await saveConfig(config);
      success(`✅ 已切换到模型: ${chalk.cyan(modelKey)}`);
      return;
    }

    if (options.add) {
      console.log(chalk.cyan('➕ 添加新模型'));
      console.log(chalk.gray('功能开发中，请直接编辑配置文件'));
      console.log(chalk.gray(`配置文件: ~/.smartshell/config.json`));
    }
  });
