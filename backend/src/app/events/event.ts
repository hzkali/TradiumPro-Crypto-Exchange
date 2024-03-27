import { Decimal } from '@prisma/client/runtime';
import { TradeOrder } from '../helpers/types';
import { B_SpotTradeModel } from '../models/db/spot_trade.model';
import { User } from '../models/db/user.model';
import { B_WithdrawalModel } from '../models/db/withdrawal.model';
import { USER_NOTIFICATIONS } from '../helpers/notification_constants';

export enum EVENT_NAME {
  SIGNUP = 'signup',
  USER_WALLET_ADDRESS_CREATED = 'user_wallet_address.created',
  USER_KYC_VERIFICATION = 'user_kyc_verification',
  ADMIN_WALLET_DATA_CHANGE = 'admin_wallet.change',
  COIN_TOKEN_DATA_CHANGE = 'coin_token_data.change',
  DEPOSIT_FOR_USER = 'deposit_for.user',
  USER_WALLET_BALANCE_UPDATE = 'user_wallet_balance_update',
  NETWORK_CREATED = 'network.created',
  WITHDRAWAL_SENT_TO_BLOCKCHAIN = 'withdrawal.sent_to_blockchain',
  NETWORK_WITHDRAWAL_FINISHED = 'withdrawal.network.finished',
  WITHDRAWAL_COMPLETED = 'withdrawal.completed',
  CURRENCY_PAIR_CREATED = 'currency_pair.created',
  CURRENCY_PAIR_DELETED = 'currency_pair.deleted',
  CURRENCY_PAIR_UPDATED = 'currency_pair.updated',
  CURRENCY_PAIR_STATUS_UPDATED = 'currency_pair.status_updated',
  CURRENCY_PAIR_PRICE_UPDATED = 'currency_pair.price_updated',
  ORDER_CREATED = 'order.created',
  ORDER_UPDATED = 'order.updated',
  ORDER_DELETED = 'order.deleted',
  ORDER_CANCELLED = 'order.cancelled',
  TRADE = 'trade',
  CONVERT_PLACED = 'convert.placed',
  CONVERT_COMPLETED = 'convert.completed',
  CONVERT_FAILED = 'convert.failed',
  CONVERT_CANCELLED = 'convert.cancelled',
  CONVERT_EXPIRED = 'convert.expired',
  P2P_ADV_CREATED = 'p2p.adv_created',
  P2P_ORDER_PLACED = 'p2p.order_placed',
  P2P_ORDER_ACTION = 'p2p.order_action',
  P2P_ORDER_CHAT = 'p2p.order_chat',

  FUTURES_CURR_PAIR_INDEX_PRICE_UPDATE = 'futures_curr_pair.inded_price_updated',
  FUTURES_CURR_PAIR_CRUD = 'futures_curr_pair.crud',
  FUTURES_CURR_PAIR_PRICE_UPDATED = 'futures_curr_pair.price_updated',
  FUTURES_CURR_PAIR_POSITION_PROCESS = 'futures_curr_pair.position_process',

  FUTURES_ORDER_CRUD = 'futures_order.crud',
  FUTURES_ORDER_SUBSCRIPTION = 'futures.order_subscription',
  FUTURES_ORDER_MATCH = 'futures.order_match',
  FUTURES_TRADE = 'futures.trade',
  FUTURES_POSITION = 'futures.position',

  FUTURES_CURR_PAIR_MARGIN_RATIO_PROCESS = 'futures.curr_pair_margin_ratio_process',

  FUTURES_POSITION_TPSL_PROCESS = 'futures.position_tpsl_process',
  FUTURES_POSITION_LIQ_PRICE_PROCESS = 'futures.position_liq_price_process',
  FUTURES_POSITION_MARGIN_RATIO_PROCESS = 'futures.position_margin_ratio_process',

  FUTURES_POSITION_LIQUIDATION = 'futures.position_liquidation',
}

export type OrderCreatedEventDataType = {
  user_id: bigint;
  order_type: number;
  currency_pair_id: number;
  order: TradeOrder;
};

export type OrderUpDelEventDataType = {
  usercode: string;
  order_type: number;
  currency_pair_id: number;
  order: TradeOrder;
  used_amount: Decimal;
};

export type TradeEventDataType = {
  trade: B_SpotTradeModel;
};

export type WithdrawalCompleteEventDataType = {
  withdrawal: B_WithdrawalModel;
};

export type SignupEventDataType = {
  user: User;
};

export type UserKycVerificationEventDataType = {
  user: User;
};

export type UserNotificationEventType = {
  notification: USER_NOTIFICATIONS;
  user_id: bigint;
  is_balance_update?: boolean;
  external_notification?: boolean;
  currency?: string;
  amount?: Decimal;
};
