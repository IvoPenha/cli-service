import { getExecutionTime } from '#/helpers/dates';
import type { LoggerService } from '#/services/LoggerService';
import type { IJob, QueueService } from '#/services/QueueService';
import type { SendHookService } from '#/services/SendHookService';

export type <%= className %>ActionJobNames = '<%= className %>Action';
export type <%= className %>CheckJobPayload = {
  test?: boolean;
};
export type <%= className %>CheckQueueService = QueueService<<%= className %>ActionJobNames, <%= className %>CheckJobPayload>;

export type <%= className %>CheckJobResult = {
  lapsed: number;
};

const queueTimeout = 30000;

export class <%= className %>Job {
  constructor(
    private readonly loggerService: LoggerService,
    private readonly sendHookService: SendHookService
  ) {}

  async handler(_data: <%= className %>CheckJobPayload): Promise<<%= className %>CheckJobResult> {
    const startTime = process.hrtime();
    const response = await this.sendHookService.api.post('/manage', {}, { timeout: queueTimeout });

    if (!response?.data?.success) {
      throw new Error(`Error on <%= className %>CheckJob ${response?.status} ${response?.data?.message || 'TIMEOUT'}`);
    }

    const lapsed = getExecutionTime(startTime);
    this.loggerService.logDev('<%= className %>CheckJob', lapsed);
    return { lapsed };
  }

  createJob(): IJob<<%= className %>ActionJobNames, <%= className %>CheckJobPayload> {
    return {
      handle: async job => {
        const r = await this.handler(job?.data);
        return r;
      },
      name: '<%= className %>Action'
    };
  }
}
