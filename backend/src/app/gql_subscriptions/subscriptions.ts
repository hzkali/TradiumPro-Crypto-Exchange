import { Field, Int, ObjectType } from '@nestjs/graphql';
import { ResponseModel } from '../models/custom/common.response.model';
import { USER_NOTIFY_TYPE } from '../helpers/notification_constants';

export enum GQL_SUBSCRIPTION {
  USER_NOTIFICATION_EVENT = 's_user_userNotificationEvent',
  // USER_TOASTER_MESSAGE = 's_user_userToasterMessage',
  BALANCE_UPDATE_EVENT = 's_wallet_balanceUpdateEvent',
  CURRENCY_PAIR_CRUD_EVENT = 's_currencyPair_crudEvent',
  SPOT_ORDER_EVENT = 's_spotOrder_spotOrderEvent',
  SPOT_TRADE_EVENT = 's_spotTrade_spotTradeEvent',
  USER_ORDER_TRADE_EVENT = 's_spotTrade_userOrderTradeEvent',
  SYSTEM_NOTICE_EVENT = 's_core_systemNoticeForUser',
  SYSTEM_MESSAGE_EVENT = 's_core_systemMessageForUser',
  SPOT_ORDER_EVENT_FOR_BACKOFFICE = 's_spotOrder_orderEventForBackOffice',
  SPOT_TRADE_EVENT_FOR_BACKOFFICE = 's_spotTrade_tradeEventForBackOffice',
  P2P_ORDER_EVENT = 's_p2p_orderEvent',
  P2P_CHAT_EVENT = 's_p2p_chatEvent',
  USER_ONLINE_STATUS = 's_core_userOnlineStatus',
  STAFF_ONLINE_STATUS = 's_core_staffOnlineStatus',
  STAFF_NOTIFICATION_EVENT = 's_staff_staffNotificationEvent',

  FUTURES_CURRENCY_PAIR_CRUD_EVENT = 's_futuresCurrencyPair_crudEvent',
  FUTURES_ORDER_EVENT = 's_futuresTrade_futuresOrderEvent',
  FUTURES_TRADE_EVENT = 's_futuresTrade_futuresTradeEvent',
  FUTURES_MY_ORDER_TRADE_EVENT = 's_futuresTrade_myOrderTradeEvent',
  FUTURES_ORDER_EVENT_FOR_BACKOFFICE = 's_futuresTrade_orderEventForBackOffice',
  FUTURES_TRADE_EVENT_FOR_BACKOFFICE = 's_futuresTrade_tradeEventForBackOffice',
}

@ObjectType()
export class UserNotificationSubsRes extends ResponseModel {
  @Field(() => String)
  usercode: string;

  @Field(() => Int, { defaultValue: USER_NOTIFY_TYPE.REFETCH })
  notify_type: number;

  @Field(() => Int, { nullable: true })
  action?: number;
}

@ObjectType()
export class StaffNotificationSubsRes extends ResponseModel {
  @Field(() => String)
  username: string;

  @Field(() => Int, { defaultValue: USER_NOTIFY_TYPE.REFETCH })
  notify_type: number;

  @Field(() => Int, { nullable: true })
  action?: number;
}

@ObjectType()
export class OnlineStatusSubRes {
  @Field(() => String)
  user_identifier: string;

  @Field(() => Int)
  status: number;
}
