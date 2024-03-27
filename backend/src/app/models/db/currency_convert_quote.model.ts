import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Decimal } from '@prisma/client/runtime';
import { B_CurrencyModel, F_CurrencyModel } from './currency.model';

@ObjectType()
export class CurrencyConvertQuote {
  @Field(() => String)
  uid: string;

  @Field(() => Int)
  wallet_type: number;

  @Field(() => Decimal)
  from_amount: Decimal;

  @Field(() => Decimal)
  to_amount: Decimal;

  @Field(() => Decimal)
  total_to_amount: Decimal;

  @Field(() => Decimal)
  price: Decimal;

  @Field(() => Decimal)
  fee: Decimal;

  @Field(() => Date, { nullable: true })
  expires_at?: Date;

  @Field(() => Int)
  status: number;

  @Field(() => Int)
  refresh_timer: number;
}

@ObjectType()
export class B_CurrencyConvertQuote extends CurrencyConvertQuote {
  @Field(() => B_CurrencyModel, { nullable: true })
  from_currency?: B_CurrencyModel;

  @Field(() => B_CurrencyModel, { nullable: true })
  to_currency?: B_CurrencyModel;
}

@ObjectType()
export class F_CurrencyConvertQuote extends CurrencyConvertQuote {
  @Field(() => F_CurrencyModel, { nullable: true })
  from_currency?: F_CurrencyModel;

  @Field(() => F_CurrencyModel, { nullable: true })
  to_currency?: F_CurrencyModel;
}
