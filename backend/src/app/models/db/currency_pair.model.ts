import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Decimal } from '@prisma/client/runtime';
import { HiddenIdBaseModelInt } from '../../../libs/model/base.model';
import { B_CurrencyModel } from './currency.model';
import { SystemTradingBotModel } from './system_trading_bot_settings.model';
import { B_BuyOrderModel } from './buy_orders.model';
import { B_SellOrderModel } from './sell_orders.model';
import { B_SpotTradeModel } from './spot_trade.model';

@ObjectType()
export class BaseCurrencyPairModel extends HiddenIdBaseModelInt {
  @Field()
  uid: string;

  @Field()
  code: string;

  @Field()
  base_currency_code: string;

  @Field()
  trade_currency_code: string;

  @Field()
  base_decimal: number;

  @Field()
  trade_decimal: number;

  @Field()
  maker_fee: Decimal;

  @Field()
  taker_fee: Decimal;

  @Field()
  min_price_percent?: Decimal;

  @Field()
  max_price_percent?: Decimal;

  @Field()
  min_base_amount: Decimal;

  @Field()
  max_base_amount: Decimal;

  @Field()
  is_default: number;

  @Field()
  status: number;
}

@ObjectType()
export class B_CurrencyPairModel extends BaseCurrencyPairModel {
  @Field({ nullable: true })
  base_currency?: B_CurrencyModel;

  @Field({ nullable: true })
  trade_currency?: B_CurrencyModel;

  @Field(() => [B_BuyOrderModel], { nullable: true })
  buy_orders?: B_BuyOrderModel[];

  @Field(() => [B_SellOrderModel], { nullable: true })
  sell_orders?: B_SellOrderModel[];

  @Field(() => [B_SpotTradeModel], { nullable: true })
  trades?: B_SpotTradeModel[];

  @Field(() => [SystemTradingBotModel], { nullable: true })
  bot_settings?: SystemTradingBotModel[];
}

@ObjectType()
export class F_CurrencyPairModel {
  @Field()
  uid: string;
  @Field()
  base: string;
  @Field()
  trade: string;
  @Field()
  code: string;
  @Field({ nullable: true })
  base_decimal?: number;
  @Field({ nullable: true })
  trade_decimal?: number;
  @Field({ nullable: true })
  prev_price?: Decimal;
  @Field({ nullable: true })
  market_price?: Decimal;

  @Field({ nullable: true })
  min_price_percent?: Decimal;
  @Field({ nullable: true })
  max_price_percent?: Decimal;
  @Field({ nullable: true })
  min_base_amount?: Decimal;
  @Field({ nullable: true })
  max_base_amount?: Decimal;

  @Field({ nullable: true })
  change?: Decimal;
  @Field({ nullable: true })
  volumefrom?: Decimal;
  @Field({ nullable: true })
  volumeto?: Decimal;
  @Field({ nullable: true })
  high?: Decimal;
  @Field({ nullable: true })
  low?: Decimal;
}

@ObjectType()
export class F_CurrencyPairOrderModel {
  @Field(() => Decimal)
  price: Decimal;

  @Field(() => Decimal)
  pending_amount: Decimal;

  @Field(() => Int)
  order_count: number;
}
