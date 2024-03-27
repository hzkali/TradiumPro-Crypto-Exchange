/* eslint-disable @typescript-eslint/ban-types */
import { Field, HideField, ObjectType } from '@nestjs/graphql';
import { Decimal } from '@prisma/client/runtime';
import { User } from '../db/user.model';

@ObjectType()
export class CountModel {
  @Field({ description: 'count' })
  count?: number;
}

@ObjectType()
export class ResponseModel {
  @Field({ description: 'success' })
  success: boolean;

  @Field({ description: 'message', nullable: true })
  message?: string;

  @HideField()
  messages?: string[];

  @HideField()
  data?: object;

  @Field({ description: 'custom code' })
  code?: number;
}

@ObjectType()
export class DayWiseCountModel {
  @Field(() => Date, { nullable: true })
  date?: Date;

  @Field(() => BigInt, { nullable: true })
  timestamp?: bigint;

  @Field(() => BigInt)
  total_count: bigint;
}

@ObjectType()
export class DayWisePriceModel {
  @Field(() => Date, { nullable: true })
  date?: Date;

  @Field(() => BigInt, { nullable: true })
  timestamp?: bigint;

  @Field(() => Decimal)
  total_amount: Decimal;
}

@ObjectType()
export class MonthlyPriceModel {
  @Field(() => Date)
  month: Date;

  @Field(() => Decimal)
  total_amount: Decimal;
}

@ObjectType()
export class BalanceCountModel {
  @Field(() => Decimal, { defaultValue: 0 })
  total_balance: Decimal;
}

@ObjectType()
export class CurrencyConvertModel {
  @Field(() => Decimal)
  amount_in_default_crypto: Decimal;
  @Field(() => Decimal)
  amount_in_fiat: Decimal;
}

@ObjectType()
export class RelatedModelDetails {
  @Field(() => String, { nullable: true })
  uid?: string;
}

@ObjectType()
export class RelatedModelDetailsWithData {
  @Field(() => String, { nullable: true })
  uid?: string;
  @Field(() => String, { nullable: true })
  data?: string;
}

@ObjectType()
export class CheckUserAvailabilityResponse extends ResponseModel {
  @Field(() => User, { nullable: true })
  user?: User;
}
