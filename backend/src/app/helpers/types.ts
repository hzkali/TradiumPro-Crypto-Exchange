import { Decimal } from '@prisma/client/runtime';
import { ORDER_TYPE } from './coreconstants';
import { Field, ObjectType } from '@nestjs/graphql';

export type NodeWallet = {
  pvkey: string;
  address: string;
};

export class CoinSendParam {
  from: string;
  to: string;
  amount: number;
  pvkey: string;
  fromAdmin? = true;
}

export class FeeEstimationParam {
  from: string;
  to: string;
  amount: number;
  fromAdmin? = true;
}

export type CoinTxObj = {
  txHash: string;
};

export class NetworkFeeResponseData {
  fee: number;
  fee_coin_id: number;
  fee_currency_id: number;
}
@ObjectType()
export class TradeOrder {
  @Field()
  id: bigint;
  price: Decimal | string | number;
  pending_amount: Decimal | number | string;
  index_price?: Decimal | number | string;
  created_at: Date;
}

export class TradeData {
  matched_order: TradeOrder;
  price_taken_from: ORDER_TYPE;
  trade_price: Decimal | string | number;
  trade_amount: Decimal | string | number;
}

export class TradeAmountType {
  pending_amount: Decimal | number | string;
  trade_amount: Decimal | number | string;
  to_match_pending_amount: Decimal | number | string;
}

export class AmountCalculationRes {
  amount: Decimal | number;
  fee_amount: Decimal | number;
  total_amount: Decimal | number;
}
