#!/usr/bin/env node

import { Command } from 'commander';
import { banner } from './utils/logger';
import { askCommand } from './commands/ask';
import { execCommand } from './commands/exec';
import { historyCommand } from './commands/history';
import { configCommand } from './commands/config';
import { modelCommand } from './commands/model';
import { explainCmd } from './commands/explain';

const program = new Command();

program
  .name('smartshell')
  .description('🧠 SmartShell AI - 让自然语言秒变Shell命令')
  .version('1.0.0')
  .option('-v, --verbose', '显示详细日志')
  .hook('preAction', (thisCommand) => {
    if (thisCommand.args.length === 0 && thisCommand.opts().help) {
      banner();
    }
  });

// 注册子命令
program.addCommand(askCommand);
program.addCommand(execCommand);
program.addCommand(historyCommand);
program.addCommand(configCommand);
program.addCommand(modelCommand);
program.addCommand(explainCmd);

// 默认显示帮助
if (process.argv.length <= 2) {
  banner();
  program.help();
}

program.parse();
