import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Decimal } from '@prisma/client/runtime';
import { HiddenIdBaseModelBigInt } from '../../../libs/model/base.model';
import { User } from './user.model';
import {
  B_UserGiftCardModel,
  F_UserGiftCardModel,
} from './user_gift_card.model';
import { B_CurrencyModel, F_CurrencyModel } from './currency.model';

@ObjectType()
export class UserGiftCardTransferHistoryBaseModel extends HiddenIdBaseModelBigInt {
  @Field(() => String)
  uid: string;

  @Field(() => Decimal, { nullable: true })
  amount?: Decimal;

  @Field(() => Decimal, { nullable: true })
  fee?: Decimal;

  @Field(() => Decimal, { nullable: true })
  total_amount?: Decimal;

  @Field(() => String, { nullable: true })
  note?: string;

  @Field(() => Int)
  status: number;

  @Field(() => User, { nullable: true })
  from_user?: User;

  @Field(() => User, { nullable: true })
  to_user?: User;
}

@ObjectType()
export class B_UserGiftCardTransferHistoryModel extends UserGiftCardTransferHistoryBaseModel {
  @Field(() => B_UserGiftCardModel, { nullable: true })
  user_gift_card?: B_UserGiftCardModel;

  @Field(() => B_CurrencyModel, { nullable: true })
  currency?: B_CurrencyModel;
}

@ObjectType()
export class F_UserGiftCardTransferHistoryModel extends UserGiftCardTransferHistoryBaseModel {
  @Field(() => F_UserGiftCardModel, { nullable: true })
  user_gift_card?: F_UserGiftCardModel;

  @Field(() => F_CurrencyModel, { nullable: true })
  currency?: F_CurrencyModel;
}
