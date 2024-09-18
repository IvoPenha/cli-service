import { Program } from './program';
import { cliService } from './service';
import { commandService } from './service/commands-service';

Program(
  cliService,
  commandService
);