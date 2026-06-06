import chalk from 'chalk';

export function info(msg: string): void {
  console.log(chalk.blue('ℹ'), msg);
}

export function success(msg: string): void {
  console.log(chalk.green('✔'), msg);
}

export function warning(msg: string): void {
  console.log(chalk.yellow('⚠'), msg);
}

export function error(msg: string): void {
  console.log(chalk.red('✖'), msg);
}

export function banner(): void {
  console.log(chalk.cyan(`
   _____                      __    _____ __         ____ 
  / ___/____  ___  ___  _____/ /_  / ___// /_  ___  / / /_
  \\__ \\/ __ \\/ _ \\/ _ \\/ ___/ __ \\ \\__ \\/ __ \\/ _ \\/ / __/
 ___/ / / / /  __/  __/ /__/ / / /___/ / / / /  __/ / /_  
/____/_/ /_/\\___/\\___/\\___/_/ /_//____/_/ /_/\\___/_/\\__/  
                                                           
  `));
  console.log(chalk.gray('  🧠 SmartShell AI - 让自然语言秒变Shell命令\n'));
}
