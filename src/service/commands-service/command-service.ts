import { generateCron } from '#/commands/cron';
import { generateCrud } from '#/commands/crud';

import type { CliService } from '../cli-service/cli-service';

export class CommandService {
  constructor(private readonly cliService: CliService) {}

  examples = {
    Cron: this.handleCron,
    Crud: this.handleCrud
  };
  async handleCrud(variant?: { name: string; dbName: string }) {
    if (variant?.name && variant?.dbName) {
      generateCrud(variant);
      return;
    }

    const prompts = [];

    if (!variant?.name) {
      prompts.push({
        message: 'Name of the CRUD(snake-case):',
        name: 'name',
        type: 'input'
      });
    }

    if (!variant?.dbName) {
      prompts.push({
        message: 'Name of the database table:',
        name: 'dbName',
        type: 'input'
      });
    }

    const answers = await this.cliService.prompt<{
      name: string;
      dbName: string;
    }>(prompts);

    if (!answers?.name || !answers) this.cliService.error('Name is required');
    generateCrud(answers);
  }

  async handleCron({ name }: { name: string }) {
    if (name) {
      generateCron({ name });
      return;
    }

    const answers = await this.cliService.prompt<{ name: string }>([
      {
        message: 'Name of the cron(snake-case):',
        name: 'name',
        type: 'input'
      }
    ]);

    if (!answers || !answers?.name) this.cliService.error('Name is required');

    generateCron(answers);
  }

  handleOption(
    option,
    variant?: {
      [key: string]: string;
    }
  ) {
    const name = variant?.name || variant?.n;
    const dbName = variant?.dbName || variant?.db;
    if (option == 'crud') {
      this.handleCrud({ dbName, name });
    }
    if (option == 'cron') {
      this.handleCron({ name });
    }
  }

  async chooseExample() {
    const answers = await this.cliService.prompt<{
      selectedExample: keyof typeof this.examples;
    }>([
      {
        choices: Object.keys(this.examples),
        message: 'Choose an example to run:',
        name: 'selectedExample',
        type: 'list'
      }
    ]);
    this.examples[answers.selectedExample]();
  }
}
