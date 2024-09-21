import { FileService } from '#/service/file-service/file.service';

import { cliService } from '../cli-service';

export const fileService = new FileService(cliService);
