import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import {
  CURRENCY_CONVERT_QUEUE_ACTION,
  SYSTEM_QUEUES,
  SYSTEM_QUEUE_PROCESSORS,
  defaultJobOptions,
} from './queue.constants';

@Injectable()
export class CurrencyConvertQueue {
  constructor(
    @InjectQueue(SYSTEM_QUEUES.CURRENCY_CONVERT)
    private readonly currencyConvertQueue: Queue,
  ) {}

  async processLimitCurrencyConvertExecuteJob(
    convert_id: bigint,
    user_id: bigint,
  ) {
    try {
      await this.currencyConvertQueue.add(
        SYSTEM_QUEUE_PROCESSORS.PROCESS_CURRENCY_CONVERT,
        {
          data: {
            convert_id,
            user_id,
          },
          action: CURRENCY_CONVERT_QUEUE_ACTION.EXECUTE,
        },
        {
          ...defaultJobOptions,
        },
      );
    } catch (error) {
      console.error(error.stack);
    }
  }

  async cancelLimitCurrencyConvertJob(convert_id: bigint, user_id: bigint) {
    try {
      await this.currencyConvertQueue.add(
        SYSTEM_QUEUE_PROCESSORS.PROCESS_CURRENCY_CONVERT,
        {
          data: {
            convert_id,
            user_id,
          },
          action: CURRENCY_CONVERT_QUEUE_ACTION.CANCELL,
        },
        {
          ...defaultJobOptions,
        },
      );
    } catch (error) {
      console.error(error.stack);
    }
  }
}
