/* eslint-disable @typescript-eslint/ban-types */
import { Field, Float, Int, ObjectType } from '@nestjs/graphql';
import { Decimal } from '@prisma/client/runtime';

@ObjectType()
export class DashboardModel {
  @Field(() => Int, { nullable: true })
  total_network?: number;

  @Field(() => Int, { nullable: true })
  total_user?: number;

  @Field(() => Int, { nullable: true })
  total_withdrawal?: number;

  @Field(() => Int, { nullable: true })
  total_deposit?: number;

  @Field(() => Float, { nullable: true })
  total_revenue?: Decimal;

  @Field(() => Int, { nullable: true })
  total_buy_order?: number;

  @Field(() => Int, { nullable: true })
  total_sell_order?: number;

  @Field(() => Int, { nullable: true })
  total_trade?: number;
}
