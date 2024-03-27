import { Field, Float, Int, ObjectType } from '@nestjs/graphql';
import { Currency, Wallet } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime';
import { ResponseModel } from '../../../models/custom/common.response.model';
import { F_CurrencyPairModel } from '../../../models/db/currency_pair.model';

export class CurrencyConvertAmountAndPrice {
  from_amount: number;
  to_amount: number;
  total_to_amount: number;
  price: number;
  fee: number;
  maket_price?: number;
}
export class ValidateCurrencyQuoteReqRes extends ResponseModel {
  from_currency?: Currency;
  to_currency?: Currency;
  from_wallet?: Wallet;
  to_wallet?: Wallet;
  price_n_amount_data?: CurrencyConvertAmountAndPrice;
}

export class ValidateLimitConvertRes extends ResponseModel {
  from_currency?: Currency;
  to_currency?: Currency;
  from_wallet?: Wallet;
  to_wallet?: Wallet;
  price_n_amount_data?: CurrencyConvertAmountAndPrice;
}

export class CurrencyPairValidationRes extends ResponseModel {
  from_currency?: Currency;
  to_currency?: Currency;
}

@ObjectType()
export class ConvertCurrencyData {
  @Field()
  code: string;
  @Field({ nullable: true })
  name?: string;
  @Field({ nullable: true })
  symbol?: string;
  @Field({ nullable: true })
  decimal?: number;
  @Field({ nullable: true })
  logo?: string;
  @Field({ nullable: true })
  min_convert_amount?: Decimal;
  @Field({ nullable: true })
  max_convert_amount?: Decimal;
  @Field({ nullable: true })
  convert_fee_type?: number;
  @Field({ nullable: true })
  convert_fee?: Decimal;
  @Field({ nullable: true })
  spot_available_balance?: Decimal;
  @Field({ nullable: true })
  funding_available_balance?: Decimal;
}

@ObjectType()
export class ConvertPairData {
  @Field(() => F_CurrencyPairModel, { nullable: true })
  currency_pair?: F_CurrencyPairModel;
  @Field(() => ConvertCurrencyData, { nullable: true })
  from_currency?: ConvertCurrencyData;
  @Field(() => ConvertCurrencyData, { nullable: true })
  to_currency?: ConvertCurrencyData;
  @Field({ nullable: true })
  pair?: string;
}

export class WalletValidationRes extends ResponseModel {
  from_wallet?: Wallet;
  to_wallet?: Wallet;
}

export class CurrencyConvertAmountAndPriceRes extends ResponseModel {
  price_n_amount_data?: CurrencyConvertAmountAndPrice;
}

@ObjectType()
export class CurrencyQuoteData {
  @Field(() => String, { nullable: true })
  quote_id?: string;

  @Field(() => String, { nullable: true })
  from_currency?: string;

  @Field(() => Decimal, { nullable: true })
  from_amount?: Decimal;

  @Field(() => String, { nullable: true })
  to_currency?: string;

  @Field(() => Decimal, { nullable: true })
  to_amount?: Decimal;

  @Field(() => Decimal, { nullable: true })
  total_to_amount?: Decimal;

  @Field(() => Decimal, { nullable: true })
  price?: Decimal;

  @Field(() => Decimal, { nullable: true })
  inverse_price?: Decimal;

  @Field(() => Date, { nullable: true })
  expires_at?: Date;

  @Field(() => Int, { nullable: true })
  refresh_timer?: number;

  @Field(() => Decimal, { nullable: true })
  user_will_get?: Decimal;

  @Field(() => Decimal, { nullable: true })
  user_will_spend?: Decimal;

  @Field(() => Decimal)
  fee: Decimal;

  @Field(() => Int, { nullable: true })
  status?: number;
}

@ObjectType()
export class CurrencyQuoteRes extends ResponseModel {
  @Field(() => CurrencyQuoteData, { nullable: true })
  quote?: CurrencyQuoteData;
}

@ObjectType()
export class LimitConvertChartDataRes {
  @Field(() => Float, { nullable: true })
  amount?: number;

  @Field(() => Float)
  price: number;

  @Field(() => Float, { nullable: true })
  total?: number;

  @Field(() => BigInt)
  timestamp: bigint;
}
