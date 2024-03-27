import { Field, ObjectType } from '@nestjs/graphql';
import { Decimal } from '@prisma/client/runtime';
import { HiddenIdBaseModelBigInt } from '../../../libs/model/base.model';
import { B_CurrencyModel, F_CurrencyModel } from './currency.model';
import { User } from './user.model';

@ObjectType()
class WalletBaseModel extends HiddenIdBaseModelBigInt {
  @Field(() => Decimal)
  spot_available_balance: Decimal;

  @Field(() => Decimal)
  spot_in_order_balance: Decimal;

  @Field(() => Decimal)
  funding_available_balance?: Decimal;

  @Field(() => Decimal)
  funding_in_order_balance?: Decimal;

  @Field(() => Decimal)
  futures_available_balance?: Decimal;

  @Field(() => Decimal)
  futures_in_order_balance?: Decimal;
}

@ObjectType()
export class B_WalletModel extends WalletBaseModel {
  @Field(() => Decimal)
  funding_balance?: Decimal;
  @Field()
  status: number;
  @Field(() => B_CurrencyModel, { nullable: true })
  currency?: B_CurrencyModel;
}

@ObjectType()
export class F_WalletModel extends WalletBaseModel {
  @Field(() => F_CurrencyModel, { nullable: true })
  currency?: F_CurrencyModel;
}

@ObjectType()
export class B_UserWalletModel extends WalletBaseModel {
  @Field()
  status: number;

  @Field(() => B_CurrencyModel, { nullable: true })
  currency?: B_CurrencyModel;

  @Field()
  user?: User;
}
