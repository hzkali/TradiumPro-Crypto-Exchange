import { Field, Int, ObjectType } from '@nestjs/graphql';
import { HiddenIdBaseModelInt } from '../../../libs/model/base.model';

@ObjectType()
export class GiftCardCategoryBaseModel extends HiddenIdBaseModelInt {
  @Field(() => String)
  uid: string;

  @Field(() => String)
  name: string;

  @Field(() => Int)
  status: number;
}

@ObjectType()
export class B_TemplateCountModel {
  @Field(() => Int)
  gift_card_templates: number;
}

@ObjectType()
export class B_GiftCardCategoryModel extends GiftCardCategoryBaseModel {
  @Field(() => B_TemplateCountModel, { nullable: true })
  _count?: B_TemplateCountModel;
}

@ObjectType()
export class F_GiftCardCategoryModel extends GiftCardCategoryBaseModel {
  @Field(() => Int, { defaultValue: 0 })
  template_count?: number;
}
