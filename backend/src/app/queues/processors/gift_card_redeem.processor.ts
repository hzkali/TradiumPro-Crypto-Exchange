import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { SYSTEM_QUEUES, SYSTEM_QUEUE_PROCESSORS } from '../queue.constants';
import { app } from '../../helpers/functions';
import { GiftCardService } from '../../modules/gift_card/gift_card.service';

@Processor(SYSTEM_QUEUES.GIFT_CARD_REDEEM)
export class GiftCardRedeemProcessor {
  @Process(SYSTEM_QUEUE_PROCESSORS.PROCESS_GIFT_CARD_REDEEM)
  async redeemGiftCard(job: Job) {
    try {
      const { data } = job.data;
      await app.get(GiftCardService).processRedeemGiftCardJob(data);
    } catch (error) {
      console.error(error.stack);
      throw error;
    }
  }
}
