import * as chalk from 'chalk';
import { ILogger } from '../core/interfaces';

export class ConsoleLoggerAdapter implements ILogger {
  info(message: string): void {
    console.log(chalk.blue('ℹ'), message);
  }

  warn(message: string): void {
    console.log(chalk.yellow('⚠'), message);
  }

  error(message: string): void {
    console.error(chalk.red('✖'), message);
  }

  success(message: string): void {
    console.log(chalk.green('✔'), message);
  }
}
