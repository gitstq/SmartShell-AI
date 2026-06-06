import { Command } from 'commander';
import ora from 'ora';
import chalk from 'chalk';
import { generateCommand } from '../core/ai';
import { addHistory } from '../core/history';
import { loadConfig } from '../utils/config';
import { gatherContext, formatContext } from '../core/context';
import { info, success } from '../utils/logger';

export const askCommand = new Command('ask')
  .alias('a')
  .description('🤖 将自然语言描述转换为Shell命令')
  .argument('<query>', '你的需求描述')
  .option('-m, --model <model>', '指定使用的AI模型')
  .option('-c, --context', '启用上下文感知', true)
  .action(async (query: string, options) => {
    const config = await loadConfig();
    const modelKey = options.model || config.defaultModel;
    const modelConfig = config.models[modelKey];

    if (!modelConfig) {
      console.error(chalk.red(`❌ 未找到模型配置: ${modelKey}`));
      console.log(chalk.gray('可用模型:'), Object.keys(config.models).join(', '));
      process.exit(1);
    }

    if (!modelConfig.apiKey && modelConfig.provider !== 'ollama') {
      console.error(chalk.red(`❌ 模型 ${modelKey} 未配置API密钥`));
      console.log(chalk.gray('使用 "smartshell config" 进行配置'));
      process.exit(1);
    }

    const spinner = ora('🤖 正在思考...').start();

    try {
      let contextStr: string | undefined;
      if (options.context && config.contextEnabled) {
        const ctx = await gatherContext();
        contextStr = formatContext(ctx);
      }

      const result = await generateCommand(query, modelConfig, contextStr);

      spinner.stop();

      // 保存历史记录
      if (config.historyEnabled) {
        addHistory({
          timestamp: Date.now(),
          query,
          command: result.command,
          executed: false,
          cwd: process.cwd(),
          model: modelKey,
        });
      }

      console.log();
      console.log(chalk.cyan('💡 生成的命令:'));
      console.log(chalk.yellow('─'.repeat(50)));
      console.log(chalk.green(result.command));
      console.log(chalk.yellow('─'.repeat(50)));

      if (result.explanation) {
        console.log();
        console.log(chalk.gray('📖 说明:'), result.explanation);
      }

      console.log();
      info('💡 提示: 使用 "smartshell exec" 直接执行，或复制上方命令');
    } catch (err: any) {
      spinner.stop();
      console.error(chalk.red('❌ 生成失败:'), err.message);
      process.exit(1);
    }
  });
