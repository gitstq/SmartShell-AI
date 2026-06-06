import { Command } from 'commander';
import ora from 'ora';
import chalk from 'chalk';
import inquirer from 'inquirer';
import { generateCommand } from '../core/ai';
import { addHistory, updateHistoryExecution } from '../core/history';
import { checkSafety, executeCommand } from '../core/safety';
import { loadConfig } from '../utils/config';
import { gatherContext, formatContext } from '../core/context';
import { info, success, warning, error } from '../utils/logger';

export const execCommand = new Command('exec')
  .alias('e')
  .description('⚡ 将自然语言描述转换为Shell命令并直接执行')
  .argument('<query>', '你的需求描述')
  .option('-m, --model <model>', '指定使用的AI模型')
  .option('-y, --yes', '跳过确认直接执行', false)
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

      console.log();
      console.log(chalk.cyan('💡 生成的命令:'));
      console.log(chalk.yellow('─'.repeat(50)));
      console.log(chalk.green(result.command));
      console.log(chalk.yellow('─'.repeat(50)));

      if (result.explanation) {
        console.log(chalk.gray('📖 说明:'), result.explanation);
      }

      // 安全检查
      const safety = checkSafety(result.command);
      if (safety.level === 'dangerous') {
        console.log();
        safety.warnings.forEach((w) => error(w));
        console.log(chalk.red('🚫 该命令被判定为高危操作，已阻止执行'));
        console.log(chalk.gray('如需执行，请手动复制命令并在确认安全后运行'));
        process.exit(1);
      }

      if (safety.warnings.length > 0) {
        console.log();
        safety.warnings.forEach((w) => warning(w));
      }

      // 确认执行
      let shouldExecute = options.yes;
      if (!shouldExecute && config.safetyMode !== 'disabled') {
        const { confirm } = await inquirer.prompt([
          {
            type: 'confirm',
            name: 'confirm',
            message: chalk.yellow('是否执行上述命令?'),
            default: false,
          },
        ]);
        shouldExecute = confirm;
      }

      if (!shouldExecute) {
        info('已取消执行');
        process.exit(0);
      }

      // 保存历史记录
      let historyId: number | undefined;
      if (config.historyEnabled) {
        historyId = addHistory({
          timestamp: Date.now(),
          query,
          command: result.command,
          executed: false,
          cwd: process.cwd(),
          model: modelKey,
        });
      }

      console.log();
      console.log(chalk.cyan('🚀 执行中...'));
      console.log(chalk.yellow('─'.repeat(50)));

      const execResult = await executeCommand(result.command, config);

      console.log(chalk.yellow('─'.repeat(50)));

      if (execResult.success) {
        success('✅ 命令执行成功');
      } else {
        error('❌ 命令执行失败');
      }

      // 更新历史记录
      if (historyId !== undefined) {
        updateHistoryExecution(historyId, execResult.success, execResult.output);
      }
    } catch (err: any) {
      spinner.stop();
      error(`执行失败: ${err.message}`);
      process.exit(1);
    }
  });
