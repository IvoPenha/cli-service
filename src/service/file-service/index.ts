import { cliService } from '../cli-service';
import { FileService } from './file-service';

export const fileService = new FileService(
  cliService
);