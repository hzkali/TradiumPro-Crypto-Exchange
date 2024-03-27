// eslint-disable-next-line @typescript-eslint/no-var-requires
const Queue = require('bull');
import { JobOptions, Queue as QueueType } from 'bull';
import { app } from '../helpers/functions';
import { ConfigService } from '@nestjs/config';

export function createManualQueue(name: string): QueueType {
  return new Queue(name, app.get(ConfigService).get('queue'));
}

export const defaultJobOptions: JobOptions = {
  removeOnComplete: true,
  removeOnFail: true,
};

export enum SYSTEM_QUEUES {
  BALANCE_DEBIT = 'balance_debit',
  WITHDRAWAL = 'withdrawal',
  SYSTEM_WITHDRAWAL = 'system_withdrawal',
  COIN_POOL_WITHDRAWAL = 'coin_pool_withdrawal',
  BLOCK_PROCESSING = 'block_processing',
  SPOT_ORDER = 'spot_order',
  MATCH_OR_CANCEL_ORDER = 'match_or_cancel_order',
  MONGO_CHART_DATA = 'mongo_chart_data',
  CURRENCY_CONVERT = 'currency_convert',
  PAYMENT = 'payment',
  MANUAL_PAYMENT_ACTION = 'manual_payment_action',
  GIFT_CARD_REDEEM = 'gift_card_redeem',
  RELEASE_OR_CANCEL_P2P_ORDER = 'release_or_cancel_p2p_order',
  P2P_UPDATE_PROFILE = 'p2p_update_profile',
  P2P_ADV_CLOSE = 'p2p_adv_close',
  FUTURES_ORDER = 'futures_order',
  FUTURES_MATCH_OR_CANCEL_ORDER = 'futures_match_or_cancel_order',
  FUTURES_POSITION = 'futures_position',
  FUTURES_POSITION_LIQUIDATION = 'futures_position_liquidation',
}

export enum SYSTEM_QUEUE_PROCESSORS {
  PROCESS_BALANCE_DEBIT = 'process_balance_debit',
  PROCESS_SELL_BALANCE_DEBIT = 'process_sell_balance_debit',
  PROCESS_WITHDRAWAL = 'process_withdrawal',
  PROCESS_SYSTEM_WITHDRAWAL = 'process_system_withdrawal',
  PROCESS_COIN_POOL_WITHDRAWAL = 'process_coin_pool_withdrawal',
  PROCESS_BLOCK_PROCESSING = 'process_block_processing',
  PROCESS_MATCH_OR_CANCEL_ORDER = 'process_match_or_cancel_order',
  PROCESS_MONGO_CHART_DATA = 'process_mongo_chart_data',
  PROCESS_CURRENCY_CONVERT = 'process_currency_convert',
  PROCESS_PAYMENT = 'process_payment',
  PROCESS_MANUAL_PAYMENT_ACTION = 'process_manual_payment_action',
  PROCESS_GIFT_CARD_REDEEM = 'process_gift_card_redeem',
  PROCESS_RELEASE_OR_CANCEL_P2P_ORDER = 'process_release_or_cancel_p2p_order',
  PROCESS_P2P_UPDATE_PROFILE = 'process_p2p_update_profile',
  PROCESS_P2P_ADV_CLOSE = 'process_p2p_adv_close',
  PROCESS_FUTURES_ORDER = 'process_futures_order',
  PROCESS_FUTURES_POSITION = 'process_futures_position',
  PROCESS_FUTURES_POSITION_LIQUIDATION = 'process_futures_position_liquidation',
}

export enum BALANCE_DEBIT_QUEUE_ACTION {
  WITHDRAWAL = 1,
  SPOT_ORDER = 2,
  BOT_ORDER = 3,
  MARKET_CONVERT = 4,
  LIMIT_CONVERT = 5,
  GIFT_CARD_CREATE_SEND = 6,
  GIFT_CARD_SEND = 7,
  WALLET_TRANSFER = 8,
  CREATE_P2P_ADV = 9,
  UPDATE_P2P_ADV = 10,
  CREATE_P2P_ORDER = 11,
  WALLET_TRANSFER_FOR_P2P_ORDER_REPORT = 12,
}

export enum CURRENCY_CONVERT_QUEUE_ACTION {
  EXECUTE = 1,
  CANCELL = 2,
}

export enum MATCH_CANCELL_ORDER_QUEUE_ACTION {
  MATCH = 1,
  CANCELL = 2,
}

export enum RELEASE_CANCELL_ORDER_QUEUE_ACTION {
  RELEASE = 1,
  CANCELL = 2,
}

export enum PAYMENT_QUEUE_ACTION {
  FIAT_DEPOSIT = 1,
  BUY_CRYPTO = 2,
}

export enum MANUAL_PAYMENT_ACTIONS {
  FIAT_DEPOSIT_MAKE_PAYMENT_PROCESSING = 1,
  FIAT_DEPOSIT_CANCEL,
  FIAT_DEPOSIT_FAIL,
  FIAT_DEPOSIT_APPROVE,

  BUY_CRYPTO_MAKE_PAYMENT_PROCESSING,
  BUY_CRYPTO_CANCEL,
  BUY_CRYPTO_FAIL,
  BUY_CRYPTO_APPROVE,

  FIAT_WITHDRAWAL_MAKE_PAYMENT_PROCESSING,
  FIAT_WITHDRAWAL_CANCEL,
  FIAT_WITHDRAWAL_COMPLETE,
}

export enum FUTURES_ORDER_ACTION {
  FUTURES_ORDER = 1,
  FUTURES_BOT_ORDER = 2,
}

export enum FUTURES_POSITION_LIQUIDATIN_ACTION {
  CURR_PAIR_MARGIN_RATIO = 1,
  POSITION_LIQUIDATION_PRICE = 2,
  POSITION_MARGIN_RATIO = 3,
}
