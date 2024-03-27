import { Field, Float, InputType, Int } from '@nestjs/graphql';
import { IsIn, IsNotEmpty } from 'class-validator';
import {
  CONVERSION_FEATURES,
  PAY_TO_SYSTEM_METHOD_TYPES,
  WALLET_TYPE,
} from '../../../helpers/coreconstants';
import { __ } from '../../../helpers/functions';
@InputType()
export class MarketCurrencyQuoteDto {
  @Field(() => Int)
  @IsNotEmpty({ message: () => __('Wallet type is required!') })
  @IsIn(Object.values(WALLET_TYPE))
  wallet_type: WALLET_TYPE;

  @Field(() => String, { defaultValue: 'convert' })
  feature: CONVERSION_FEATURES;

  @Field(() => String, { nullable: true })
  method_type?: PAY_TO_SYSTEM_METHOD_TYPES;

  @IsNotEmpty({ message: () => __('From currency code is required!') })
  @Field(() => String)
  from_currency_code: string;

  @IsNotEmpty({ message: () => __('To currency code is required!') })
  @Field(() => String)
  to_currency_code: string;

  @IsNotEmpty({ message: () => __('Amount is required!') })
  @Field(() => Float)
  amount: number;

  @IsNotEmpty({ message: () => __('Amount currency code is required!') })
  @Field(() => String)
  amount_currency_code: string;

  @Field(() => String, { nullable: true })
  quote_id?: string;
}

@InputType()
export class LimitCurrencyConvertDto {
  @Field(() => Int)
  @IsNotEmpty({ message: () => __('Wallet type is required!') })
  @IsIn(Object.values(WALLET_TYPE))
  wallet_type: WALLET_TYPE;

  @IsNotEmpty({ message: () => __('From currency code is required!') })
  @Field(() => String)
  from_currency_code: string;

  @IsNotEmpty({ message: () => __('To currency code is required!') })
  @Field(() => String)
  to_currency_code: string;

  @IsNotEmpty({ message: () => __('Amount is required!') })
  @Field(() => Float)
  amount: number;

  @IsNotEmpty({ message: () => __('Price is required!') })
  @Field(() => Float)
  price: number;

  @IsNotEmpty({ message: () => __('Expires in days is required!') })
  @Field(() => Int)
  expires_in: number;
}
