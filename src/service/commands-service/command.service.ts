import type { CliService } from '#/service/cli-service';

import { generateCron, generateCrud } from './commands/';

interface Variant {
  [key: string]: string;
}

export class CommandService {
  constructor(private readonly cliService: CliService) {}

  examples = {
    Cron: this.handleCron,
    Crud: this.handleCrud
  };

  private async getPromptsForCrud(variant: Variant): Promise<Variant> {
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
    return { ...variant, ...answers };
  }

  private async getPromptsForCron(): Promise<{ name: string }> {
    return await this.cliService.prompt<{ name: string }>([
      {
        message: 'Name of the cron (snake-case):',
        name: 'name',
        type: 'input'
      }
    ]);
  }

  private validateName(name: string | undefined): void {
    if (!name) {
      this.cliService.error('Name is required');
    }
  }

  async handleCrud(variant: Variant = {}): Promise<void> {
    if (!variant.name || !variant.dbName) {
      variant = await this.getPromptsForCrud(variant);
    }
    this.validateName(variant.name);
    generateCrud({ dbName: variant.dbName, name: variant.name });
  }

  async handleCron(variant: { name: string }): Promise<void> {
    this.validateName(variant.name);
    generateCron(variant);
  }

  async handleOption(option: string, variant: Variant = {}): Promise<void> {
    const name = variant.name || variant.n;
    const dbName = variant.dbName || variant.db || variant.entity || variant.ent;

    if (option === 'crud') {
      await this.handleCrud({ dbName, name });
    } else if (option === 'cron') {
      await this.handleCron({ name: name || '' });
    }
  }

  async chooseExample(): Promise<void> {
    const { selectedExample } = await this.cliService.prompt<{ selectedExample: keyof typeof this.examples }>({
      choices: Object.keys(this.examples),
      message: 'Escolher exemplo para rodar:',
      name: 'selectedExample',
      type: 'list'
    });

    console.info(`Running example: ${selectedExample}`);

    console.log(
      this.examples[selectedExample].toString()
    )

    await this.examples[selectedExample]({});
  }
}
