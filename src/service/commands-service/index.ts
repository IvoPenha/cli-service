import { cliService } from '../cli-service';

import { CommandService } from '#/service/commands-service/command.service';

export const commandService = new CommandService(cliService);

export type { CommandService };

export * from '#/service/commands-service/command.dto';
