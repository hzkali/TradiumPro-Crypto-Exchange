import { OnEvent } from '@nestjs/event-emitter';
import { CurrencyConvertHistory } from '@prisma/client';
import { LOG_LEVEL_ERROR, MyLogger } from '../../../libs/log/log.service';
import { CONVERSION_FEATURES, LOG_FILES } from '../../helpers/coreconstants';
import {
  noExponents,
  prisma_client,
  sendNotificationWithBalanceSub,
  sendToasterErrMsg,
} from '../../helpers/functions';
import { USER_NOTIFICATIONS } from '../../helpers/notification_constants';
import { EVENT_NAME } from '../event';

export class CurrencyConvertEventsListener {
  private logger: MyLogger;
  constructor() {
    this.logger = new MyLogger(LOG_FILES.EVENTS);
  }

  @OnEvent(EVENT_NAME.CONVERT_PLACED, {
    async: true,
  })
  async handleConvertOrderPlaceEvent(payload: CurrencyConvertHistory) {
    try {
      const { to_amount, user_id, to_currency_id } = payload;
      await this.sendExternalNotification(
        USER_NOTIFICATIONS.CONVERT_PLACED,
        user_id,
        to_currency_id,
        Number(to_amount),
      );
    } catch (error) {
      this.logger.write(error.stack, LOG_LEVEL_ERROR);
    }
  }

  @OnEvent(EVENT_NAME.CONVERT_COMPLETED, {
    async: true,
  })
  async handleConvertCompletedEvent(payload: CurrencyConvertHistory) {
    try {
      const { to_amount, user_id, to_currency_id, feature } = payload;
      await this.sendExternalNotification(
        feature == CONVERSION_FEATURES.SELL_CRYPTO
          ? USER_NOTIFICATIONS.SELL_CRYPTO_COMPLETED
          : USER_NOTIFICATIONS.CONVERT_COMPLETED,
        user_id,
        to_currency_id,
        Number(to_amount),
        true,
      );
    } catch (error) {
      this.logger.write(error.stack, LOG_LEVEL_ERROR);
    }
  }

  @OnEvent(EVENT_NAME.CONVERT_FAILED, {
    async: true,
  })
  async handleConvertFailedEvent(payload: {
    user_id: bigint;
    message: string;
  }) {
    try {
      const user = await prisma_client.user.findFirst({
        where: {
          id: BigInt(payload.user_id),
        },
        select: { usercode: true },
      });

      await sendToasterErrMsg({
        usercode: user.usercode,
        msg: payload.message,
      });
    } catch (error) {
      this.logger.write(error.stack, LOG_LEVEL_ERROR);
    }
  }

  @OnEvent(EVENT_NAME.CONVERT_CANCELLED, {
    async: true,
  })
  async handleConvertCancelEvent(payload: CurrencyConvertHistory) {
    try {
      const { to_amount, user_id, to_currency_id } = payload;
      await this.sendExternalNotification(
        USER_NOTIFICATIONS.CONVERT_CANCELLED,
        user_id,
        to_currency_id,
        Number(to_amount),
      );
    } catch (error) {
      this.logger.write(error.stack, LOG_LEVEL_ERROR);
    }
  }

  @OnEvent(EVENT_NAME.CONVERT_EXPIRED, {
    async: true,
  })
  async handleConvertExpiredEvent(payload: CurrencyConvertHistory) {
    try {
      const { to_amount, user_id, to_currency_id } = payload;
      await this.sendExternalNotification(
        USER_NOTIFICATIONS.CONVERT_EXPIRED,
        user_id,
        to_currency_id,
        Number(to_amount),
      );
    } catch (error) {
      this.logger.write(error.stack, LOG_LEVEL_ERROR);
    }
  }

  private async sendExternalNotification(
    notification: USER_NOTIFICATIONS,
    user_id: bigint,
    currency_id: number,
    amount: number,
    is_external?: boolean,
  ) {
    const currency = await this.findCurrency(currency_id);
    await sendNotificationWithBalanceSub({
      notification: notification,
      user_id: user_id,
      amount_txt: `${noExponents(amount)} ${currency?.code}`,
      is_balance_update: true,
      is_external,
    });
  }

  private findCurrency(currency_id: number) {
    return prisma_client.currency.findFirst({
      where: {
        id: Number(currency_id),
      },
      select: {
        code: true,
      },
    });
  }
}
