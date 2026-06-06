import { Command } from 'commander';
import ora from 'ora';
import chalk from 'chalk';
import { explainCommand } from '../core/ai';
import { loadConfig } from '../utils/config';
import { info, error } from '../utils/logger';

export const explainCmd = new Command('explain')
  .alias('x')
  .description('📖 解释Shell命令的含义')
  .argument('<command>', '要解释的命令')
  .option('-m, --model <model>', '指定使用的AI模型')
  .action(async (cmd: string, options) => {
    const config = await loadConfig();
    const modelKey = options.model || config.defaultModel;
    const modelConfig = config.models[modelKey];

    if (!modelConfig) {
      console.error(chalk.red(`❌ 未找到模型配置: ${modelKey}`));
      process.exit(1);
    }

    if (!modelConfig.apiKey && modelConfig.provider !== 'ollama') {
      console.error(chalk.red(`❌ 模型 ${modelKey} 未配置API密钥`));
      process.exit(1);
    }

    const spinner = ora('🤖 正在分析...').start();

    try {
      const explanation = await explainCommand(cmd, modelConfig);
      spinner.stop();

      console.log();
      console.log(chalk.cyan('📖 命令解释'));
      console.log(chalk.yellow('─'.repeat(50)));
      console.log(chalk.green(`$ ${cmd}`));
      console.log(chalk.yellow('─'.repeat(50)));
      console.log(explanation);
      console.log();
    } catch (err: any) {
      spinner.stop();
      error(`解释失败: ${err.message}`);
      process.exit(1);
    }
  });
