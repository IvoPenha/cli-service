import type { CliService } from './service/cli-service/cli-service';
import type { CommandService } from './service/commands-service/command-service';

export function Program(cliService: CliService, commandService: CommandService) {
  const { option, variant } = cliService.start(process.argv);

  if (option) {
    commandService.handleOption(option, variant);
    return;
  }

  commandService.chooseExample();
}
