import type { CliService, CommandService } from './service/';

export async function Program(cliService: CliService, commandService: CommandService) {
  const { option, variant } = cliService.start(process.argv);

  if (option) {
    await commandService.handleOption(option, variant);
    return;
  }

  await commandService.chooseExample();
}
