import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { app } from '../../helpers/functions';
import { CurrencyConvertProcess } from '../../modules/currency_convert/currency_convert.process';
import {
  CURRENCY_CONVERT_QUEUE_ACTION,
  SYSTEM_QUEUES,
  SYSTEM_QUEUE_PROCESSORS,
} from '../queue.constants';

@Processor(SYSTEM_QUEUES.CURRENCY_CONVERT)
export class CurrencyConvertProcessor {
  @Process(SYSTEM_QUEUE_PROCESSORS.PROCESS_CURRENCY_CONVERT)
  async processCurrencyConvert(job: Job) {
    try {
      const { data, action } = job.data;
      const { convert_id, user_id } = data;
      if (action == CURRENCY_CONVERT_QUEUE_ACTION.EXECUTE) {
        await app
          .get(CurrencyConvertProcess)
          .executeOrExpireLimitCurrencyConvertQueue(
            BigInt(convert_id),
            BigInt(user_id),
          );
      } else if (action == CURRENCY_CONVERT_QUEUE_ACTION.CANCELL) {
        await app
          .get(CurrencyConvertProcess)
          .cancelLimitConvertQueue(BigInt(convert_id), BigInt(user_id));
      } else {
        throw new Error(
          `Action ${action} is invalid for process currency convert.`,
        );
      }
    } catch (error) {
      console.error(error.stack);
      throw error;
    }
  }
}
