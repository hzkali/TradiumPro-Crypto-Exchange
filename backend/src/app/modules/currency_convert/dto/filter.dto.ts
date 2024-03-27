import { ArgsType, Field, Int } from '@nestjs/graphql';
import { TimeFilter } from '../../../models/custom/common.input.model';
import { CONVERSION_FEATURES } from '../../../helpers/coreconstants';

@ArgsType()
export class CurrencyForConvertFilter {
  @Field(() => String, { nullable: true })
  query?: string;

  @Field(() => Int, { nullable: true })
  currency_type?: number;

  @Field(() => Int, { nullable: true })
  status?: number;

  @Field(() => String, { defaultValue: CONVERSION_FEATURES.CONVERT })
  feature?: CONVERSION_FEATURES;
}

@ArgsType()
export class F_CurrencyConvertHistoryFilter {
  @Field(() => String, { nullable: true })
  currency_code?: string;

  @Field(() => Int, { nullable: true })
  wallet_type?: number;

  @Field(() => Int, { nullable: true })
  convert_type?: number;

  @Field(() => TimeFilter, { nullable: true })
  time?: TimeFilter;

  @Field(() => Int, { nullable: true })
  status?: number;
}

@ArgsType()
export class B_CurrencyConvertHistoryFilter {
  @Field(() => String, { nullable: true })
  query?: string;

  @Field(() => Int, { nullable: true })
  wallet_type?: number;

  @Field(() => String, { nullable: true })
  currency_code?: string;

  @Field(() => Int, { nullable: true })
  convert_type?: number;

  @Field(() => Int, { nullable: true })
  status?: number;
}
