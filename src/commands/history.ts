import { Command } from 'commander';
import chalk from 'chalk';
import { getRecentHistory, searchHistory, clearHistory, getHistoryStats } from '../core/history';
import { info, success, warning } from '../utils/logger';

export const historyCommand = new Command('history')
  .alias('h')
  .description('📜 查看命令历史记录')
  .option('-s, --search <keyword>', '搜索历史记录')
  .option('-n, --limit <number>', '显示条数', '20')
  .option('--clear', '清空历史记录')
  .option('--stats', '显示统计信息')
  .action(async (options) => {
    if (options.clear) {
      clearHistory();
      success('✅ 历史记录已清空');
      return;
    }

    if (options.stats) {
      const stats = getHistoryStats();
      console.log(chalk.cyan('📊 历史统计'));
      console.log(chalk.yellow('─'.repeat(30)));
      console.log(`总记录数: ${stats.total}`);
      console.log(`已执行: ${stats.executed}`);
      console.log(`成功: ${stats.success}`);
      console.log(chalk.yellow('─'.repeat(30)));
      return;
    }

    const limit = parseInt(options.limit, 10) || 20;
    const entries = options.search
      ? searchHistory(options.search, limit)
      : getRecentHistory(limit);

    if (entries.length === 0) {
      info('暂无历史记录');
      return;
    }

    console.log(chalk.cyan(`📜 历史记录 (共 ${entries.length} 条)`));
    console.log(chalk.yellow('─'.repeat(70)));

    entries.forEach((entry, index) => {
      const date = new Date(entry.timestamp).toLocaleString('zh-CN');
      const status = entry.executed
        ? entry.success
          ? chalk.green('✅')
          : chalk.red('❌')
        : chalk.gray('⏸');

      console.log(`${chalk.gray(`#${index + 1}`)} ${status} ${chalk.gray(date)}`);
      console.log(`   ${chalk.cyan('Q:')} ${entry.query}`);
      console.log(`   ${chalk.green('C:')} ${entry.command}`);
      if (entry.model) {
        console.log(`   ${chalk.gray(`模型: ${entry.model}`)}`);
      }
      console.log();
    });
  });
