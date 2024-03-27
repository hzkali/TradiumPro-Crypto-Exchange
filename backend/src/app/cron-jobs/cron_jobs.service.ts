/* eslint-disable prettier/prettier */
import { Cron, CronExpression } from '@nestjs/schedule';
import { LOG_LEVEL_ERROR } from '../../libs/log/log.service';
import { OnlinePaymentService } from '../core.services/payment_services/core.online_payment.service';
import { app, emitEvent, prisma_client } from '../helpers/functions';
import { BonusDistributionService } from '../modules/bonus/bonus_distribution.service';
import { CoinPoolService } from '../modules/coin_pool/coin_pool.service';
import { CurrencyService } from '../modules/currency/currency.service';
import { CurrencyConvertProcess } from '../modules/currency_convert/currency_convert.process';
import { CurrencyQuoteService } from '../modules/currency_convert/quote/quote.service';
import { FuturesPositionFundingService } from '../modules/futures_trade/position/futures.position.funding.service';
import { FuturesPositionService } from '../modules/futures_trade/position/futures.position.service';
import { F_P2pOrderActionService } from '../modules/p2p/order/f.order_action.service';
import { PaymentService } from '../modules/payment/payment.service';
import { SecurityResetService } from '../modules/security_reset/security_reset.service';
import { SystemRevenueProcessService } from '../modules/system_revenue/system_revenue.process.service';
import { F_UserNewCredentialVerifyService } from '../modules/user/frontend/f.user.new_credential_verify.service';
import { WalletIssueAutomationService } from '../modules/wallet_issues/automation/wallet_issue.automation';
import { STATUS_ACTIVE } from '../helpers/coreconstants';
import { EVENT_NAME } from '../events/event';
import { getIndexPrice } from '../modules/futures_trade/futures.helper';
import { getCurrencyPairCachedDataByPairs } from '../modules/spot_trade/currency_pair/currency_pair.helper';

export enum CustomCronExpression {
  EVERY_15_MINUTES = '0 */15 * * * *',
}

export class CronJobs {
  //USD rate sync cron
  @Cron(
    process.env.CURRENCY_RATE_SYNC_CRON_TIME_PATTERN ||
      CronExpression.EVERY_30_MINUTES,
  )
  async syncCurrenciesUsdRates() {
    try {
      await app.get(CurrencyService).syncUsdRates();
    } catch (e) {
      console.log(e.stack, LOG_LEVEL_ERROR);
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async cleanQuoteData() {
    try {
      const service = app.get(CurrencyQuoteService);
      await service.cleanQuoteData();
    } catch (e) {
      console.log(e.stack, LOG_LEVEL_ERROR);
    }
  }

  @Cron(CronExpression.EVERY_2_HOURS)
  async expireLimitconvert() {
    try {
      await app
        .get(CurrencyConvertProcess)
        .processLimitConvertExpirationCronJob();
    } catch (e) {
      console.log(e.stack, LOG_LEVEL_ERROR);
    }
  }
}
