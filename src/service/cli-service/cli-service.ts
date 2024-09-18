import chalk from "chalk";
import figlet from "figlet";
import * as ora from "ora";
import inquirer from "inquirer";
import type { PromptDto } from './cli-dto';


export class CliService {
  private loading: boolean = false;
  private tasks: string[] = [];
  private spinner: any; 

  start(proccessArgV: string[]): {
    option: string;
    variant: {
      [key: string]: string;
    };
  } {
    console.log(
      chalk.blue(figlet.textSync("CIS - CLI", { horizontalLayout: "full" }))
    )
    const option = process.argv[2];

    // captura as outras opções de variaveis passando o --n ou --name e db ou --dbName
    const variants = process.argv.slice(3);
    const variant = variants.reduce((acc, item, index, arr) => {
      if (item.includes('--')){
        acc[item.replace('--', '')] = arr[index + 1];
      }
      return acc;
    }, {});

    return {option, variant};
  
  }

  async prompt<T>(
    prompts: PromptDto[]
  ) : Promise<T>{
    return await inquirer.prompt(prompts as any) as T;
  }

  success(message: string) {
    console.log(chalk.green(message));
  }
  error(message: string) {
    console.log(chalk.red(message));
  }
  async loadingStart({
    task
  }: {
    task: string;
  }) { 

    this.spinner = await ora.default(`Carregando ${task}`).start(); 
    this.loading = true;
  }
  async done() {
    if (this.loading) {
      this.spinner.succeed();
      this.loading = false;
    }
  }
  
}
