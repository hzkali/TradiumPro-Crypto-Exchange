import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

import {
  SYSTEM_QUEUES,
  SYSTEM_QUEUE_PROCESSORS,
  defaultJobOptions,
} from './queue.constants';
import { GiftCardRedeemQueueData } from '../modules/gift_card/dto/response.dto';

@Injectable()
export class GiftCardRedeemQueue {
  constructor(
    @InjectQueue(SYSTEM_QUEUES.GIFT_CARD_REDEEM)
    private readonly queue: Queue,
  ) {}

  async processGiftCardRedeemJob(data: GiftCardRedeemQueueData) {
    try {
      await this.queue.add(
        SYSTEM_QUEUE_PROCESSORS.PROCESS_GIFT_CARD_REDEEM,
        {
          data: data,
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
