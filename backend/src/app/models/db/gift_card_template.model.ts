import { Field, Int, ObjectType } from '@nestjs/graphql';
import { HiddenIdBaseModelInt } from '../../../libs/model/base.model';
import { FileUrlMiddleware } from '../../middlewares/url_related_field.middleware';
import {
  B_GiftCardCategoryModel,
  F_GiftCardCategoryModel,
} from './gift_card_category.model';

@ObjectType()
export class GiftCardTemplateBaseModel extends HiddenIdBaseModelInt {
  @Field(() => String)
  uid: string;

  @Field(() => String, { nullable: true })
  title?: string;

  @Field(() => String, { nullable: true })
  description?: string;

  @Field({
    nullable: true,
    middleware: [FileUrlMiddleware],
  })
  image?: string;

  @Field(() => Int)
  status: number;
}

@ObjectType()
export class B_GiftCardTemplateModel extends GiftCardTemplateBaseModel {
  @Field(() => B_GiftCardCategoryModel, { nullable: true })
  category?: B_GiftCardCategoryModel;
}

@ObjectType()
export class F_GiftCardTemplateModel extends GiftCardTemplateBaseModel {
  @Field(() => F_GiftCardCategoryModel, { nullable: true })
  category?: F_GiftCardCategoryModel;
}
