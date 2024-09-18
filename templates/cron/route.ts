import { loggerService } from '../_common-services/logger.service';
import { factorySendHookService } from '../_common-services/send-hook-service.factory';

import { create<%= className %>ActionQueue } from './<%= name %>.queue';

const sendHookService = factorySendHookService.create({ name: '<%= className %>Action', path: '/hook/<%= keyName %>' });

const { <%= instanceName %>ActionQueueService } = create<%= className %>ActionQueue(loggerService, sendHookService);

export { <%= instanceName %>ActionQueueService };
