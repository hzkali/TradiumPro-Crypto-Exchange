import { Injectable } from '@nestjs/common';
import {
  __,
  app,
  emitEvent,
  errorResponse,
  prisma_client,
  successResponse,
} from '../../helpers/functions';

import { Decimal } from '@prisma/client/runtime';
import { LOG_LEVEL_ERROR, MyLogger } from '../../../libs/log/log.service';
import { BalanceUpdateService } from '../../core.services/balance_update.sevice';
import { EVENT_NAME } from '../../events/event';
import {
  CONVERSION_FEATURES,
  CONVERT_TYPE,
  CURRENCY_CONVERT_STATUS,
  EVENT_MODEL,
  LOG_FILES,
  STATUS_COMPLETED,
  WALLET_ACTIVITY_DESCRIPTION,
  WALLET_ACTIVITY_TITLE,
  WALLET_ACTIVITY_TX_TYPE,
  WALLET_TYPE,
} from '../../helpers/coreconstants';
import { ResponseModel } from '../../models/custom/common.response.model';
import { CurrencyConvertValidationService } from './currency_convert.validation';
import { CurrencyQuoteService } from './quote/quote.service';

import { CurrencyConvertHistory } from '@prisma/client';
import { CurrencyConvertQueue } from '../../queues/currency_convert.queue';
import { WalletService } from '../wallet/wallet.service';

@Injectable()
export class CurrencyConvertProcess {
  private logger: MyLogger;
  constructor(
    private readonly quoteService: CurrencyQuoteService,
    private readonly currencyConvertValidationService: CurrencyConvertValidationService,
    logger?: MyLogger,
  ) {
    this.logger = logger?.logFile
      ? logger
      : new MyLogger(LOG_FILES.CURRENCY_CONVERT_LOG);
  }

  //======================== Market Convert Process ===============================//
  // Process market currency convert queue
  async processMarketCurrencyConvertQueue(
    quote_id: string,
    user_id: bigint,
  ): Promise<ResponseModel> {
    user_id = BigInt(user_id);
    try {
      const quote = await this.quoteService.findOne(quote_id);
      const {
        feature,
        wallet_type,
        from_currency_id,
        to_currency_id,
        from_amount,
        to_amount,
        total_to_amount,
        price,
        pay_method_type,
      } = quote;
      const { success, message, from_wallet, to_wallet } =
        await this.currencyConvertValidationService.validateUserWallet(
          from_currency_id,
          to_currency_id,
          user_id,
          Number(from_amount),
          wallet_type,
          pay_method_type,
        );
      if (!success) {
        throw new Error(message);
      }
      const balanceUpdateService = new BalanceUpdateService();

      const res = await app
        .get(WalletService)
        .checkWalletActivityMismatch(wallet_type, from_wallet);

      if (!res.success) throw new Error(res.message);

      const history = await prisma_client.$transaction(async (prisma) => {
        const history = await prisma.currencyConvertHistory.create({
          data: {
            feature: feature,
            user_id: user_id,
            convert_type: CONVERT_TYPE.MARKET,
            wallet_type: wallet_type,
            from_currency_id: from_currency_id,
            to_currency_id: to_currency_id,
            fee: quote.fee,
            from_amount: from_amount,
            to_amount: to_amount,
            total_to_amount: total_to_amount,
            price: price,
            market_price_was: price,
            expires_at: new Date(),
            status: CURRENCY_CONVERT_STATUS.COMPLETED,
          },
        });

        await balanceUpdateService.userWalletBalanceUpdate(
          {
            related_model: EVENT_MODEL.CONVERT_BUY_SELL_CRYPTO,
            model_id: String(history.id),
            wallet_type: history.wallet_type,
            tx_type: WALLET_ACTIVITY_TX_TYPE.DEBIT,
            amount: new Decimal(from_amount),
            wallet_id: BigInt(from_wallet.id),
            user_id: BigInt(user_id),
            activity_title:
              feature == CONVERSION_FEATURES.SELL_CRYPTO
                ? WALLET_ACTIVITY_TITLE.SELL_CRYPTO
                : WALLET_ACTIVITY_TITLE.CONVERT_PLACED,
            description:
              feature == CONVERSION_FEATURES.SELL_CRYPTO
                ? WALLET_ACTIVITY_DESCRIPTION.SELL_CRYPTO_BALANCE_DEBIT
                : WALLET_ACTIVITY_DESCRIPTION.CONVERT_DEBIT,
          },
          true,
          prisma,
        );
        await balanceUpdateService.userWalletBalanceUpdate(
          {
            related_model: EVENT_MODEL.CONVERT_BUY_SELL_CRYPTO,
            model_id: String(history.id),
            wallet_type: history.wallet_type,
            tx_type: WALLET_ACTIVITY_TX_TYPE.CREDIT,
            amount: new Decimal(to_amount),
            wallet_id: BigInt(to_wallet.id),
            user_id: BigInt(user_id),
            activity_title:
              feature == CONVERSION_FEATURES.SELL_CRYPTO
                ? WALLET_ACTIVITY_TITLE.SELL_CRYPTO
                : WALLET_ACTIVITY_TITLE.CONVERT_PLACED,
            description:
              feature == CONVERSION_FEATURES.SELL_CRYPTO
                ? WALLET_ACTIVITY_DESCRIPTION.SELL_CRYPTO_BALANCE_CREDIT
                : WALLET_ACTIVITY_DESCRIPTION.CONVERT_CREDIT,
          },
          true,
          prisma,
        );
        await prisma.currencyConvertQuote.update({
          where: {
            uid: quote_id,
          },
          data: {
            status: STATUS_COMPLETED,
          },
        });

        return history;
      });

      emitEvent(EVENT_NAME.CONVERT_COMPLETED, history);

      return successResponse('Market Convert successful!');
    } catch (error) {
      this.logger.write(error.stack, LOG_LEVEL_ERROR);
      emitEvent(EVENT_NAME.CONVERT_FAILED, {
        user_id: user_id,
        ...errorResponse(__('Something went wrong. Convert Failed!!')),
      });
      throw new Error(error.message);
    }
  }

  //======================== Limit Convert Process ===============================//
  // Process limit currency convert queue
  async processLimitCurrencyConvertQueue(
    convert_id: bigint,
    user_id: bigint,
  ): Promise<ResponseModel> {
    try {
      let currency_convert = await this.findCurrencyConvert(BigInt(convert_id));
      const {
        id,
        from_currency_id,
        to_currency_id,
        user_id,
        from_amount,
        wallet_type,
      } = currency_convert;

      const { success, message, from_wallet } =
        await this.currencyConvertValidationService.validateUserWallet(
          from_currency_id,
          to_currency_id,
          user_id,
          Number(from_amount),
          wallet_type,
        );

      if (!success) {
        throw new Error(message);
      }

      const res = await app
        .get(WalletService)
        .checkWalletActivityMismatch(wallet_type, from_wallet);
      if (!res.success) throw new Error(res.message);

      const balanceUpdateService = new BalanceUpdateService();

      currency_convert = await prisma_client.$transaction(async (prisma) => {
        const history = await prisma.currencyConvertHistory.update({
          where: {
            id: currency_convert.id,
          },
          data: {
            status: CURRENCY_CONVERT_STATUS.OPEN,
          },
        });

        await balanceUpdateService.userWalletBalanceUpdate(
          {
            related_model: EVENT_MODEL.CONVERT_BUY_SELL_CRYPTO,
            model_id: String(id),
            wallet_type: wallet_type,
            tx_type: WALLET_ACTIVITY_TX_TYPE.DEBIT,
            amount: new Decimal(from_amount),
            wallet_id: BigInt(from_wallet.id),
            user_id: BigInt(user_id),
            activity_title: WALLET_ACTIVITY_TITLE.CONVERT_PLACED,
            description: WALLET_ACTIVITY_DESCRIPTION.CONVERT_DEBIT,
          },
          true,
          prisma,
        );

        await balanceUpdateService.updateWalletInOrderBalance(
          wallet_type,
          from_wallet.id,
          from_amount,
          WALLET_ACTIVITY_TX_TYPE.CREDIT,
          prisma,
        );
        return history;
      });
      emitEvent(EVENT_NAME.CONVERT_PLACED, currency_convert);
      return successResponse(__('Convert order placed successfully.'));
    } catch (error) {
      this.logger.write(error.stack, LOG_LEVEL_ERROR);
      emitEvent(EVENT_NAME.CONVERT_FAILED, {
        user_id: user_id,
        ...errorResponse(__('Something went wrong. Convert Failed!!')),
      });
      throw new Error(error.message);
    }
  }

  // Execute or Expire limit currency convert queue
  async executeOrExpireLimitCurrencyConvertQueue(
    convert_id: bigint,
    user_id: bigint,
  ): Promise<ResponseModel> {
    try {
      let currency_convert = await this.findCurrencyConvert(
        BigInt(convert_id),
        CURRENCY_CONVERT_STATUS.OPEN,
      );

      if (
        currency_convert.expires_at &&
        new Date() > currency_convert.expires_at
      ) {
        await this.expireLimitCurrencyConvert(currency_convert);
        emitEvent(EVENT_NAME.CONVERT_EXPIRED, currency_convert);
        return successResponse(__('Limit currency convert expired.'));
      } else {
        currency_convert = await this.executeLimitCurrencyConvert(
          currency_convert,
        );
        emitEvent(EVENT_NAME.CONVERT_COMPLETED, currency_convert);
        return successResponse(__('Converted Successful.'));
      }
    } catch (error) {
      this.logger.write(error.stack, LOG_LEVEL_ERROR);
      emitEvent(EVENT_NAME.CONVERT_FAILED, {
        user_id: user_id,
        ...errorResponse(__('Something went wrong. Convert Failed!!')),
      });
      throw new Error(error.message);
    }
  }

  // Expire limit currency convert
  async expireLimitCurrencyConvert(currency_convert: CurrencyConvertHistory) {
    const balanceUpdateService = new BalanceUpdateService();
    const walletService = app.get(WalletService);
    const { id, user_id, wallet_type, from_amount, from_currency_id } =
      currency_convert;

    const from_wallet = await walletService.findWallet(
      from_currency_id,
      user_id,
    );

    const in_order_mismatch_res =
      await walletService.handleInOrderBalanceMismatchWhileDebit(
        from_wallet.spot_in_order_balance,
        from_amount,
        WALLET_TYPE.SPOT,
        from_wallet,
      );

    await prisma_client.$transaction(async (prisma) => {
      await prisma.currencyConvertHistory.update({
        where: {
          id: id,
        },
        data: {
          status: CURRENCY_CONVERT_STATUS.EXPIRED,
        },
      });

      // Revert from wallet balance by credit
      await balanceUpdateService.userWalletBalanceUpdate(
        {
          related_model: EVENT_MODEL.CONVERT_BUY_SELL_CRYPTO,
          model_id: String(id),
          wallet_type: wallet_type,
          tx_type: WALLET_ACTIVITY_TX_TYPE.CREDIT,
          amount: new Decimal(from_amount),
          wallet_id: BigInt(from_wallet.id),
          user_id: BigInt(user_id),
          activity_title: WALLET_ACTIVITY_TITLE.CONVERT_EXPIRED,
          description:
            WALLET_ACTIVITY_DESCRIPTION.CONVERT_EXPIRED_BALANCE_CREDIT,
        },
        true,
        prisma,
      );

      // Revert from wallet in order balance by debit
      await balanceUpdateService.updateWalletInOrderBalance(
        wallet_type,
        from_wallet.id,
        in_order_mismatch_res === 0 ? 0 : from_amount,
        WALLET_ACTIVITY_TX_TYPE.DEBIT,
        prisma,
        in_order_mismatch_res === 0 ? 'direct_update' : 'inc_dec',
      );
    });
  }

  // Execute limit currency convert
  async executeLimitCurrencyConvert(
    currency_convert: CurrencyConvertHistory,
  ): Promise<CurrencyConvertHistory> {
    const balanceUpdateService = new BalanceUpdateService();
    const walletService = app.get(WalletService);
    const {
      id,
      user_id,
      wallet_type,
      from_amount,
      to_amount,
      from_currency_id,
      to_currency_id,
    } = currency_convert;

    const [from_wallet, to_wallet] = await Promise.all([
      walletService.findWallet(from_currency_id, user_id),
      walletService.findWallet(to_currency_id, user_id),
    ]);

    const in_order_mismatch_res =
      await walletService.handleInOrderBalanceMismatchWhileDebit(
        from_wallet.spot_in_order_balance,
        from_amount,
        WALLET_TYPE.SPOT,
        from_wallet,
      );

    return await prisma_client.$transaction(async (prisma) => {
      const history = await prisma.currencyConvertHistory.update({
        where: {
          id: id,
        },
        data: {
          status: CURRENCY_CONVERT_STATUS.COMPLETED,
        },
      });

      // balance credited to to_wallet
      await balanceUpdateService.userWalletBalanceUpdate(
        {
          related_model: EVENT_MODEL.CONVERT_BUY_SELL_CRYPTO,
          model_id: String(id),
          wallet_type: wallet_type,
          tx_type: WALLET_ACTIVITY_TX_TYPE.CREDIT,
          amount: new Decimal(to_amount),
          wallet_id: BigInt(to_wallet.id),
          user_id: BigInt(user_id),
          activity_title: WALLET_ACTIVITY_TITLE.CONVERT,
          description: WALLET_ACTIVITY_DESCRIPTION.CONVERT_CREDIT,
        },
        true,
        prisma,
      );

      // in order balance debited from from_wallet
      await balanceUpdateService.updateWalletInOrderBalance(
        wallet_type,
        from_wallet.id,
        in_order_mismatch_res === 0 ? 0 : from_amount,
        WALLET_ACTIVITY_TX_TYPE.DEBIT,
        prisma,
        in_order_mismatch_res === 0 ? 'direct_update' : 'inc_dec',
      );

      return history;
    });
  }

  // Cancel limit currency convert queue
  async cancelLimitConvertQueue(
    convert_id: bigint,
    user_id: bigint,
  ): Promise<ResponseModel> {
    try {
      let currency_convert = await this.findCurrencyConvert(
        BigInt(convert_id),
        CURRENCY_CONVERT_STATUS.OPEN,
      );

      const { id, from_currency_id, user_id, from_amount, wallet_type } =
        currency_convert;

      const walletService = app.get(WalletService);

      const from_wallet = await walletService.findWallet(
        from_currency_id,
        user_id,
      );

      const in_order_mismatch_res =
        await walletService.handleInOrderBalanceMismatchWhileDebit(
          from_wallet.spot_in_order_balance,
          from_amount,
          WALLET_TYPE.SPOT,
          from_wallet,
        );

      const balanceUpdateService = new BalanceUpdateService();

      currency_convert = await prisma_client.$transaction(async (prisma) => {
        const history = await prisma.currencyConvertHistory.update({
          where: {
            id: currency_convert.id,
          },
          data: {
            status: CURRENCY_CONVERT_STATUS.CANCELLED,
          },
        });

        // Revert from wallet balance by credit
        await balanceUpdateService.userWalletBalanceUpdate(
          {
            related_model: EVENT_MODEL.CONVERT_BUY_SELL_CRYPTO,
            model_id: String(id),
            wallet_type: wallet_type,
            tx_type: WALLET_ACTIVITY_TX_TYPE.CREDIT,
            amount: new Decimal(from_amount),
            wallet_id: BigInt(from_wallet.id),
            user_id: BigInt(user_id),
            activity_title: WALLET_ACTIVITY_TITLE.CONVERT_CANCELLED,
            description:
              WALLET_ACTIVITY_DESCRIPTION.CONVERT_CANCEL_BALANCE_CREDIT,
          },
          true,
          prisma,
        );
        // Revert from wallet in order balance by debit
        await balanceUpdateService.updateWalletInOrderBalance(
          wallet_type,
          from_wallet.id,
          in_order_mismatch_res === 0 ? 0 : from_amount,
          WALLET_ACTIVITY_TX_TYPE.DEBIT,
          prisma,
          in_order_mismatch_res === 0 ? 'direct_update' : 'inc_dec',
        );
        return history;
      });
      emitEvent(EVENT_NAME.CONVERT_CANCELLED, currency_convert);
      return successResponse(__('Convert Cancelled Successfully.'));
    } catch (error) {
      this.logger.write(error.stack, LOG_LEVEL_ERROR);
      emitEvent(EVENT_NAME.CONVERT_FAILED, {
        user_id: user_id,
        ...errorResponse(__('Something went wrong. Convert Cancel Failed!!')),
      });
      throw new Error(error.message);
    }
  }

  async findCurrencyConvert(
    convert_id: bigint,
    status?: CURRENCY_CONVERT_STATUS,
  ): Promise<CurrencyConvertHistory> {
    const currency_convert =
      await prisma_client.currencyConvertHistory.findFirst({
        where: {
          id: BigInt(convert_id),
          status: status || CURRENCY_CONVERT_STATUS.PENDING,
        },
      });

    if (!currency_convert)
      throw new Error(`Invalid convert id. Id: ${convert_id}`);

    return currency_convert;
  }

  async processLimitConvertExpirationCronJob() {
    const now = new Date();
    const openConverts = await prisma_client.currencyConvertHistory.findMany({
      where: {
        status: CURRENCY_CONVERT_STATUS.OPEN,
        expires_at: {
          lt: now,
        },
      },
    });

    const currencyConvertQueue = app.get(CurrencyConvertQueue);
    const currency_convert_promises = [];
    for (let i = 0; i < openConverts?.length; i++) {
      currency_convert_promises.push(
        currencyConvertQueue.processLimitCurrencyConvertExecuteJob(
          openConverts[i].id,
          openConverts[i].user_id,
        ),
      );
    }
    await Promise.all(currency_convert_promises);
  }
}
