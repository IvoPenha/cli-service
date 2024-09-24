import { Status, type CliService } from '#/service/cli-service';

import { generateCron, generateCrud } from './commands/';
import { copyFromPath } from './commands/copy';

interface Variant {
  [key: string]: string;
}

export class CommandService {
  constructor(private readonly cliService: CliService) { 
  }

  private commandHandlers = {
    cron: this.handleCron.bind(this),
    crud: this.handleCrud.bind(this),
    copy: this.handleCopy.bind(this)
  }

  private async getPromptsForCrud (variant: Variant): Promise<Variant>{
    const prompts = [];

    if (!variant.name) {
      prompts.push({
        message: 'Name of the CRUD (snake-case):',
        name: 'name',
        type: 'input'
      });
    }

    if (!variant.dbName) {
      prompts.push({
        message: 'Name of the database table:',
        name: 'dbName',
        type: 'input'
      });
    }

    const answers = await this.cliService.prompt<Variant>(prompts);

    this.handleCrud(answers); 

    return { ...variant, ...answers };
  }

  private async getPromptsForCron  (): Promise<{ name: string }>{
    const answers = await  this.cliService.prompt<{ name: string }>([
      {
        message: 'Name of the cron (snake-case):',
        name: 'name',
        type: 'input'
      }
    ]);

    this.handleCron(answers);

    return { ...answers };
  }

  private async getPromptsForCopy (): Promise<Variant>{
    const answers = await this.cliService.prompt<Variant>([
      {
        message: 'Destination path:',
        name: 'destPath',
        type: 'input'
      },
      {
        message: 'Directory path:',
        name: 'dirPath',
        type: 'input'
      },
      {
        message: 'Name of the directory (snake-case) - To be replaced:',
        name: 'dirName',
        type: 'input'
      },
      {
        message: 'Name of the copy (snake-case):',
        name: 'destName',
        type: 'input'
      },
    ]);

    this.handleCopy(answers);

    return { ...answers };
  }

  private examples = {
    Cron: this.getPromptsForCron.bind(this),
    Crud: this.getPromptsForCrud.bind(this),
    Copy: this.getPromptsForCopy.bind(this)
  };

  private validateName(name: string | undefined): void {
    if (!name) {
      this.cliService.error('Name is required');
      this.cliService.exit(Status.ERROR);
    }
  }

  async handleCrud(variant: Variant = {}): Promise<void> { 
    if (!variant.name || !variant.dbName) {
      const promptsReturn = await this.getPromptsForCrud(variant); 
      this.validateName(promptsReturn?.name);
      generateCrud({ dbName: promptsReturn.dbName, name: promptsReturn.name });
      return;
    }
    this.cliService.error(JSON.stringify(variant));
    this.validateName(variant.name);
    generateCrud({ dbName: variant.dbName, name: variant.name });
  }

  async handleCron(variant: { name: string }): Promise<void> {
    this.validateName(variant.name);
    generateCron(variant);
  }

  async handleCopy(variant: Variant): Promise<void> {
    if (!variant.destPath || !variant.dirPath) {
      const promptsReturn = await this.getPromptsForCopy(); 
      await copyFromPath({
        destPath: promptsReturn.destPath,
        dirPath: promptsReturn.dirPath, 
      });
      return;
    } 
    await copyFromPath({
      destPath: variant.destPath,
      dirPath: variant.dirPath, 
      destName: variant.destName,
      dirName: variant.dirName,
    });
    this.cliService.exit(Status.SUCCESS);
  }

  async handleOption(option: string, variant: Variant = {}): Promise<void> {
    const name = variant.name || variant.n;
    const dbName = variant.dbName || variant.db || variant.entity || variant.ent;
    const destPath = variant.destPath || variant.dest || variant.d;
    const dirPath = variant.dirPath || variant.dir || variant.dp;
    const destName = variant.destName || variant.dn;
    const dirName = variant.dirName || variant.dirN;

    const variables = { name, dbName, destPath, dirPath, destName, dirName };
 
    await this.commandHandlers[option]({ ...variables });
    return;
  }

  async chooseExample(): Promise<void> {
    const response = await this.cliService.prompt<{ selectedExample: keyof typeof this.examples }>([{
      choices: Object.keys(this.examples),
      message: 'Escolher exemplo para rodar:',
      name: 'selectedExample',
      type: 'list'
    }]);
    if (!response) {
      this.cliService.error('No example selected');
      this.cliService.exit(Status.ERROR);
    }

    const { selectedExample } = response;

    await this.examples[selectedExample]({}); 
  }
}
