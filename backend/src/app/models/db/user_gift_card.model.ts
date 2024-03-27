import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Decimal } from '@prisma/client/runtime';
import { HiddenIdBaseModelBigInt } from '../../../libs/model/base.model';
import { User } from './user.model';
import { B_CurrencyModel, F_CurrencyModel } from './currency.model';
import {
  B_GiftCardTemplateModel,
  F_GiftCardTemplateModel,
} from './gift_card_template.model';

@ObjectType()
export class UserGiftCardBaseModel extends HiddenIdBaseModelBigInt {
  @Field(() => String)
  uid: string;

  @Field(() => Int)
  wallet_type: number;

  @Field(() => Decimal, { nullable: true })
  amount?: Decimal;

  @Field(() => Int, { nullable: true })
  quantity?: number;

  @Field(() => Int)
  status: number;

  @Field(() => User, { nullable: true })
  creator?: User;

  @Field(() => User, { nullable: true })
  owner?: User;
}

@ObjectType()
export class B_UserGiftCardModel extends UserGiftCardBaseModel {
  @Field(() => B_GiftCardTemplateModel, { nullable: true })
  template?: B_GiftCardTemplateModel;

  @Field(() => B_CurrencyModel, { nullable: true })
  currency?: B_CurrencyModel;
}

@ObjectType()
export class F_UserGiftCardModel extends UserGiftCardBaseModel {
  @Field(() => F_GiftCardTemplateModel, { nullable: true })
  template?: F_GiftCardTemplateModel;

  @Field(() => F_CurrencyModel, { nullable: true })
  currency?: F_CurrencyModel;
}
