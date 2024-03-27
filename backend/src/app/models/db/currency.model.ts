import { Field, HideField, Int, ObjectType } from '@nestjs/graphql';
import { Decimal } from '@prisma/client/runtime';
import { HiddenIdBaseModelInt } from '../../../libs/model/base.model';
import { FileUrlMiddleware } from '../../middlewares/url_related_field.middleware';
import { B_WalletModel, F_WalletModel } from './wallet.model';
import { F_CurrencyPaymentSettingModel } from './currency_payment_setting.model';

@ObjectType()
export class CurrencyBaseModel extends HiddenIdBaseModelInt {
  @Field(() => String)
  code: string;

  @Field(() => String, { nullable: true })
  name?: string;

  @Field(() => Int, { nullable: true })
  type?: number;

  @Field(() => String, { nullable: true })
  symbol?: string;

  @Field(() => Int)
  decimal: number;

  @Field({
    nullable: true,
    middleware: [FileUrlMiddleware],
  })
  logo?: string;

  @Field(() => Decimal, { nullable: true })
  usd_rate?: Decimal;

  @Field(() => Decimal, { nullable: true })
  min_deposit?: Decimal;

  @Field(() => Decimal, { nullable: true })
  max_deposit?: Decimal;

  @Field(() => Int, { nullable: true })
  deposit_fee_type?: number;

  @Field(() => Decimal, { nullable: true })
  deposit_fee?: Decimal;

  @Field(() => Decimal, { nullable: true })
  min_withdrawal?: Decimal;

  @Field(() => Decimal, { nullable: true })
  max_withdrawal?: Decimal;

  @Field(() => Int, { nullable: true })
  withdrawal_fee_type?: number;

  @Field(() => Decimal, { nullable: true })
  withdrawal_fee?: Decimal;

  @Field({ nullable: true })
  status?: number;

  @Field({ nullable: true })
  deposit_status?: number;

  @Field({ nullable: true })
  withdrawal_status?: number;

  @Field({ nullable: true })
  convert_status?: number;

  @Field({ nullable: true })
  buy_crypto_status?: number;

  @Field({ nullable: true })
  sell_crypto_status?: number;

  @Field({ nullable: true })
  p2p_status?: number;

  @Field({ nullable: true })
  futures_trade_status?: number;

  @Field({ nullable: true })
  market_cap?: Decimal;

  @Field(() => Decimal, { nullable: true })
  min_convert_amount?: Decimal;

  @Field(() => Decimal, { nullable: true })
  max_convert_amount?: Decimal;

  @Field(() => Int, { nullable: true })
  convert_fee_type?: number;

  @Field(() => Decimal, { nullable: true })
  convert_fee?: Decimal;

  @Field(() => Int, { nullable: true })
  buy_crypto_fee_type?: number;

  @Field(() => Decimal, { nullable: true })
  buy_crypto_fee?: Decimal;

  // gift card
  @Field(() => Int, { nullable: true })
  gift_card_status?: number;

  @Field(() => Decimal, { nullable: true })
  min_gift_card_amount?: Decimal;

  @Field(() => Decimal, { nullable: true })
  max_gift_card_amount?: Decimal;

  @Field(() => Int, { nullable: true })
  gift_card_fee_type?: number;

  @Field(() => Decimal, { nullable: true })
  gift_card_fee?: Decimal;

  @Field(() => Int, { nullable: true })
  transfer_status?: number;

  // p2p
  @Field(() => Decimal, { nullable: true })
  p2p_min_price_percent?: Decimal;

  @Field(() => Decimal, { nullable: true })
  p2p_max_price_percent?: Decimal;

  @Field(() => Decimal, { nullable: true })
  min_p2p_amount?: Decimal;

  @Field(() => Decimal, { nullable: true })
  max_p2p_amount?: Decimal;

  @Field(() => Decimal, { nullable: true })
  min_p2p_order_limit?: Decimal;

  @Field(() => Decimal, { nullable: true })
  max_p2p_order_limit?: Decimal;

  @Field(() => Int, { nullable: true })
  p2p_buyer_fee_type?: number;

  @Field(() => Decimal, { nullable: true })
  p2p_buyer_fee?: Decimal;

  @Field(() => Int, { nullable: true })
  p2p_seller_fee_type?: number;

  @Field(() => Decimal, { nullable: true })
  p2p_seller_fee?: Decimal;
}

@ObjectType()
export class B_CurrencyModel extends CurrencyBaseModel {
  @HideField()
  wallets?: B_WalletModel[];

  @Field(() => Int, { nullable: true })
  sync_rate_status?: number;

  @Field(() => Int, { nullable: true })
  wallet_status?: number;
}

@ObjectType()
export class F_CurrencyModel extends CurrencyBaseModel {
  @Field(() => [F_CurrencyPaymentSettingModel])
  payment_settings?: F_CurrencyPaymentSettingModel[];

  @Field(() => [F_WalletModel])
  wallets?: F_WalletModel[];
}
