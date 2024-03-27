import { ArgsType, Field, Int } from '@nestjs/graphql';
import { TimeFilter } from '../../../models/custom/common.input.model';
@ArgsType()
export class GiftCardCurrenciesFilterArgs {
  @Field(() => String, { nullable: true })
  query?: string;
}

@ArgsType()
export class GiftCardCategoryFilterArgs {
  @Field(() => String, { nullable: true })
  query?: string;

  @Field(() => Int, { nullable: true })
  status?: number;
}

@ArgsType()
export class GiftCardTemplateFilterArgs {
  @Field(() => String, { nullable: true })
  query?: string;

  @Field(() => String, { nullable: true })
  category_uid?: string;

  @Field(() => Int, { nullable: true })
  status?: number;
}

@ArgsType()
export class UserGiftCardFilterArgs {
  @Field(() => String, { nullable: true })
  query?: string;

  @Field(() => String, { nullable: true })
  category_uid?: string;
}

@ArgsType()
export class B_UserGiftCardFilterArgs {
  @Field(() => String, { nullable: true })
  query?: string;

  @Field(() => String, { nullable: true })
  category_uid?: string;

  @Field(() => String, { nullable: true })
  currency_code?: string;

  @Field(() => Int, { nullable: true })
  status?: number;
}

@ArgsType()
export class F_UserGiftCardTranferHistoryFilterArgs {
  @Field(() => String, { nullable: true })
  query?: string;

  @Field(() => String, { nullable: true })
  currency_code?: string;

  @Field(() => TimeFilter, { nullable: true })
  time?: TimeFilter;

  @Field(() => Int, { nullable: true })
  status?: number;
}

@ArgsType()
export class B_UserGiftCardTranferHistoryFilterArgs {
  @Field(() => String, { nullable: true })
  query?: string;

  @Field(() => String, { nullable: true })
  currency_code?: string;

  @Field(() => Int, { nullable: true })
  status?: number;
}
