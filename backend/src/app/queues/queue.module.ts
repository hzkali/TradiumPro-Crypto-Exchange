import { BullModule } from '@nestjs/bull';
import { Global, Module } from '@nestjs/common';
import { BalanceDebitQueue } from './balance_debit.queue';
import { BlockProcessingQueue } from './block_processing.queue';
import { CoinPoolWithdrawalQueue } from './coin_pool_withdrawal.queue';
import { CurrencyConvertQueue } from './currency_convert.queue';
// import { MatchOrCancelOrderQueue } from './match_or_cancel_order.queue';
import { BalanceDebitProcessor } from './processors/balance_debit.processor';
import { BlockProcessingProcessor } from './processors/block_processing.processor';
import { CoinPoolWithdrawalProcessor } from './processors/coin_pool_withdrawal.processor';
import { CurrencyConvertProcessor } from './processors/currency_convert.processor';
// import { MatchOrCancelOrderProcessor } from './processors/match_or_cancel_order.processor';
// import { FuturesOrderQueue } from './futures_order.queue';
import { FuturesPositionLiquidationQueue } from './futures_position_liquidation.queue';
import { GiftCardRedeemQueue } from './gift_card_redeem.queue';
import { ManualPaymentActionQueue } from './manual_payment_action.queue';
import { P2pAdvCloseQueue } from './p2p_adv_close.queue';
import { P2pUpdateProfileQueue } from './p2p_update_profile.queue';
import { PaymentQueue } from './payment.queue';
// import { FuturesOrderProcessor } from './processors/futures_order.processor';
import { FuturesPositionLiquidationProcessor } from './processors/futures_position_liquidation.processor';
import { GiftCardRedeemProcessor } from './processors/gift_card_redeem.processor';
import { ManualPaymentActionProcessor } from './processors/manual_payment_action.processor';
import { P2pAdvCloseProcessor } from './processors/p2p_adv_close.processor';
import { P2pUpdateProfileProcessor } from './processors/p2p_update_profile.processor';
import { PaymentProcessor } from './processors/payment.processor';
import { ReleaseOrCancelP2pOrderProcessor } from './processors/release_or_cancel_p2p_order.processor';
import { SystemWithdrawalProcessor } from './processors/system_withdrawal.processor';
import { TestProcessor } from './processors/test.processor';
import { WithdrawalProcessor } from './processors/withdrawal.processor';
import { SYSTEM_QUEUES } from './queue.constants';
import { ReleaseOrCancelP2POrderQueue } from './release_or_cancel_p2p_order.queue';
import { SystemWithdrawalQueue } from './system_withdrawal.queue';
import { TestQueue } from './test.queue';
import { WithdrawalQueue } from './withdrawal.queue';

@Global()
@Module({
  imports: [
    BullModule.registerQueue({
      name: SYSTEM_QUEUES.WITHDRAWAL,
    }),
    BullModule.registerQueue({
      name: SYSTEM_QUEUES.BALANCE_DEBIT,
    }),
    BullModule.registerQueue({
      name: SYSTEM_QUEUES.SYSTEM_WITHDRAWAL,
    }),
    BullModule.registerQueue({
      name: SYSTEM_QUEUES.COIN_POOL_WITHDRAWAL,
    }),
    BullModule.registerQueue({
      name: SYSTEM_QUEUES.BLOCK_PROCESSING,
    }),
    BullModule.registerQueue({
      name: SYSTEM_QUEUES.SPOT_ORDER,
    }),
    // BullModule.registerQueue({
    //   name: SYSTEM_QUEUES.MATCH_OR_CANCEL_ORDER,
    // }),
    // BullModule.registerQueue({
    //   name: SYSTEM_QUEUES.MONGO_CHART_DATA,
    // }),
    BullModule.registerQueue({
      name: SYSTEM_QUEUES.CURRENCY_CONVERT,
    }),

    BullModule.registerQueue({
      name: SYSTEM_QUEUES.PAYMENT,
    }),

    BullModule.registerQueue({
      name: SYSTEM_QUEUES.MANUAL_PAYMENT_ACTION,
    }),

    BullModule.registerQueue({
      name: SYSTEM_QUEUES.GIFT_CARD_REDEEM,
    }),

    BullModule.registerQueue({
      name: SYSTEM_QUEUES.RELEASE_OR_CANCEL_P2P_ORDER,
    }),

    BullModule.registerQueue({
      name: SYSTEM_QUEUES.P2P_UPDATE_PROFILE,
    }),

    BullModule.registerQueue({
      name: SYSTEM_QUEUES.P2P_ADV_CLOSE,
    }),

    // BullModule.registerQueue({
    //   name: SYSTEM_QUEUES.FUTURES_ORDER,
    // }),

    // BullModule.registerQueue({
    //   name: SYSTEM_QUEUES.FUTURES_POSITION_LIQUIDATION,
    // }),

    // BullModule.registerQueue({
    //   name: SYSTEM_QUEUES.FUTURES_MATCH_OR_CANCEL_ORDER,
    // }),

    BullModule.registerQueue({
      name: 'test',
    }),
  ],
  providers: [
    /* Web3Queue, Web3Processor */
    WithdrawalQueue,
    WithdrawalProcessor,
    BalanceDebitQueue,
    BalanceDebitProcessor,
    SystemWithdrawalQueue,
    SystemWithdrawalProcessor,
    CoinPoolWithdrawalQueue,
    CoinPoolWithdrawalProcessor,
    BlockProcessingQueue,
    BlockProcessingProcessor,
    // MatchOrCancelOrderQueue,
    // MatchOrCancelOrderProcessor,
    /* MongoChartDataQueue,
    MongoChartDataProcessor, */
    CurrencyConvertQueue,
    CurrencyConvertProcessor,
    PaymentQueue,
    PaymentProcessor,
    ManualPaymentActionQueue,
    ManualPaymentActionProcessor,

    GiftCardRedeemQueue,
    GiftCardRedeemProcessor,

    ReleaseOrCancelP2POrderQueue,
    ReleaseOrCancelP2pOrderProcessor,

    P2pUpdateProfileQueue,
    P2pUpdateProfileProcessor,

    P2pAdvCloseQueue,
    P2pAdvCloseProcessor,

    // FuturesOrderQueue,
    // FuturesOrderProcessor,

    // FuturesPositionLiquidationQueue,
    // FuturesPositionLiquidationProcessor,

    // FuturesMatchOrCancelOrderQueue,
    // FuturesMatchOrCancelOrderProcessor,

    TestQueue,
    TestProcessor,
  ],
  exports: [
    /* Web3Queue */
    WithdrawalQueue,
    BalanceDebitQueue,
    SystemWithdrawalQueue,
    CoinPoolWithdrawalQueue,
    BlockProcessingQueue,
    // MatchOrCancelOrderQueue,
    // MongoChartDataQueue,
    CurrencyConvertQueue,
    PaymentQueue,
    ManualPaymentActionQueue,
    GiftCardRedeemQueue,
    ReleaseOrCancelP2POrderQueue,
    P2pUpdateProfileQueue,
    P2pAdvCloseQueue,

    // FuturesOrderQueue,
    // FuturesPositionLiquidationQueue,
    // FuturesMatchOrCancelOrderQueue,

    TestQueue,
  ],
})
export class QueueModule {}
