import { prefixQueue } from '#/config';

import type { LoggerService } from '#/services/LoggerService';
import { QueueService } from '#/services/QueueService';
import type { SendHookService } from '#/services/SendHookService';

import { <%= className %>Job } from './<%= name %>.job';

const key = '<%= keyName %>_ACTION';
const cron = '* */24 * * *'; // a cada 24 horas

export function create<%= className %>ActionQueue(loggerService: LoggerService, sendHookService: SendHookService) {
  const <%= instanceName %>CheckJob = new <%= className %>Job(loggerService, sendHookService);
  const <%= instanceName %>ActionQueueService = new QueueService(key, [<%= instanceName %>CheckJob.createJob()], {
    concurrency: 1,
    prefix: prefixQueue
  });

  if (cron) {
    <%= instanceName %>ActionQueueService.addRepeatableOnInit('<%= className %>Action', { cron, key }).then(context => {
      loggerService.logging(`CRON ${key} ${context?.jobName} ${context?.cron}`);
    });
  }

  return { <%= instanceName %>ActionQueueService };
}
