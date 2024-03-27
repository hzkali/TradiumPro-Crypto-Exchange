import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Decimal } from '@prisma/client/runtime';
import { HiddenIdBaseModelBigInt } from '../../../libs/model/base.model';
import { F_CurrencyModel } from './currency.model';
import { User } from './user.model';
import { Staff } from './staff.model';
import { ActionByStaffMiddleware } from '../../middlewares/deposit_withdrawal.middleware';

@ObjectType()
export class BaseCurrencyConvertHistory extends HiddenIdBaseModelBigInt {
  @Field(() => String)
  uid: string;

  @Field(() => Int)
  convert_type: number;

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

  @Field(() => Decimal, { nullable: true })
  market_price_was?: Decimal;

  @Field(() => Date, { nullable: true })
  expires_at?: Date;

  @Field(() => Int)
  status: number;

  @Field(() => String, { nullable: true })
  pay_method_type?: string;

  @Field(() => Int, { nullable: true })
  payment_status?: number;

  @Field(() => User, { nullable: true })
  user?: User;

  @Field(() => F_CurrencyModel, { nullable: true })
  from_currency?: F_CurrencyModel;

  @Field(() => F_CurrencyModel, { nullable: true })
  to_currency?: F_CurrencyModel;
}

@ObjectType()
export class B_CurrencyConvertHistory extends BaseCurrencyConvertHistory {
  @Field(() => String, { nullable: true })
  reason_note?: string;

  @Field(() => Int, { nullable: true })
  approved_by_staff_id?: number;

  @Field(() => Staff, {
    nullable: true,
    middleware: [ActionByStaffMiddleware],
  })
  approve_by?: Staff;
}

@ObjectType()
export class F_CurrencyConvertHistory extends BaseCurrencyConvertHistory {}
