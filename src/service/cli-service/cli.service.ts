import chalk from 'chalk';
import figlet from 'figlet';
import inquirer from 'inquirer';
import * as ora from 'ora';

import { Status, type PromptDto } from '#/service/cli-service/cli.dto';

export class CliService {
  private loading: boolean = false;
  private tasks: string[] = [];
  private spinner: any;

  constructor() {
    this.listenForClose();
  }

  // proccessListener para fechadas forçadas
  listenForClose() {
    const signals = ['SIGINT', 'SIGTERM', 'SIGQUIT', 'SIGHUP'];
    process.on('exit', (protocol) => {
      !protocol && this.exit(Status.ERROR); 
    });
    signals.forEach(signal => {
      process.on(signal, (protocol?: number) => {
        if (protocol === 0) return;
        this.warn(signal);
        protocol ? this.thanksForUsing() : this.ClosedByForce();
      });
    });
 
  }

  start(): {
    option: string;
    variant: {
      [key: string]: string;
    };
  } {
    this.info(figlet.textSync('CIS - CLI', { horizontalLayout: 'full' }));
    const option = process.argv[2];

    // captura as outras opções de variaveis passando o --n ou --name e db ou --dbName
    const variants = process.argv.slice(3);
    const variant = variants.reduce((acc, item, index, arr) => {
      if (item.includes('--')) {
        acc[item.replace('--', '')] = arr[index + 1];
      }
      return acc;
    }, {});

    return { option, variant };
  }

  async prompt<T>(prompts: PromptDto[]): Promise<T> {
    return (await inquirer.prompt(prompts as any)) as T;
  }
  success(message: string) {
    console.log(chalk.green(message));
  }
  error(message: string) {
    console.log(chalk.red(message));
  }
  warn(message: string) {
    console.log(chalk.yellow(message));
  }
  info(message: string) {
    console.log(chalk.blue(message));
  }
  close() {
    process.exit(1);
  }
  exit(protocol: number) {
    if (protocol === Status.SUCCESS) {
      this.thanksForUsing(); 
    }

    if (protocol === Status.ERROR){
      this.ClosedByForce(); 
    }

    this.close();
  }
  thanksForUsing() {
    this.info('Everything is fine, thanks for using');
    this.success,(figlet.textSync('CIS You Next time', { horizontalLayout: 'full' }));     
  }
  ClosedByForce() {
    this.error('\n Closed by force');
    this.warn(figlet.textSync('CIS You Next time', { horizontalLayout: 'full' })); 
  }
  async done() { 
    this.exit(Status.SUCCESS);
  }
}
