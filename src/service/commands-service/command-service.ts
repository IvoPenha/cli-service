import { generateCron } from '#/commands/cron';
import { generateCrud } from '#/commands/crud'; 
import type { CliService } from '../cli-service/cli-service';

export class CommandService {
  constructor(
    private readonly cliService: CliService
  ) {}
  
  examples = {
    "Crud": this.handleCrud,
    "Cron": this.handleCron,
  };
  async  handleCrud(
    variant?: {
      name: string;
      dbName: string;
    }
  ){
  

  if (variant?.name && variant?.dbName){
    generateCrud(variant);
    return;
  }

  const prompts = []

  if (!variant?.name){
    prompts.push({
      type: "input",
      name: "name",
      message: "Name of the CRUD(snake-case):",
    });
  }

  if (!variant?.dbName){
    prompts.push({
      type: "input",
      name: "dbName",
      message: "Name of the database table:",
    });
  }

  const answers = await this.cliService.prompt<{
    name: string;
    dbName: string;
  }>(prompts);

  if (!answers?.name || !answers)
    this.cliService.error('Name is required');
  generateCrud(answers);
}

 async handleCron({
  name
}: {
  name: string;
}){
  if (name){
    generateCron({name});
    return;
  }

  const answers = await this.cliService.prompt<{name:string}>([
    {
      type: "input",
      name: "name",
      message: "Name of the cron(snake-case):",
    },
  ])

  if (!answers || !answers?.name )
    this.cliService.error('Name is required');

  generateCron(answers);
}

 handleOption(option, variant?: {
  [key: string]: string;
}) {
  const name = variant?.name || variant?.n;
  const dbName = variant?.dbName || variant?.db;
  if(option == 'crud'){
    this.handleCrud(
      {name, dbName}
    );
  }
  if(option == 'cron'){
    this.handleCron(
      {name}
    );
  }
}

  async chooseExample() {
    const answers = await this.cliService.prompt<{
      selectedExample: keyof typeof this.examples;
    }>([
      {
        type: "list",
        name: "selectedExample",
        message: "Choose an example to run:",
        choices: Object.keys(this.examples),
      },
    ]);
    this.examples[answers.selectedExample]();
  }

}
