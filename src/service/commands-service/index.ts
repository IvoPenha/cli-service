import { cliService } from '../cli-service';

import { CommandService } from './command-service';

export const commandService = new CommandService(cliService);

export * from './command-dto';
