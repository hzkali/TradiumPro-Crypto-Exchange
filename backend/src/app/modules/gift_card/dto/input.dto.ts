import {
  ArgsType,
  Field,
  Float,
  HideField,
  InputType,
  Int,
} from '@nestjs/graphql';
import { IsIn, IsInt, IsNotEmpty, MaxLength } from 'class-validator';
import { Unique } from '../../../../libs/decorators/unique.decorator';
import {
  GIFT_CARD_ACTION,
  STATUS_ACTIVE,
  STATUS_INACTIVE,
  USER_CREDENTIALS,
} from '../../../helpers/coreconstants';
import { __ } from '../../../helpers/functions';
import { FileUpload, GraphQLUpload } from 'graphql-upload';

// ===================== Gift card category input ============================ //
@InputType()
export class BaseGiftCardCategoryInput {
  @Field(() => Int)
  @IsNotEmpty({ message: () => __('Status is required') })
  @IsInt({ message: () => __('Invalid status value') })
  @IsIn([STATUS_ACTIVE, STATUS_INACTIVE], {
    message: () => __('Invalid status value'),
  })
  status: number;
}

@InputType()
export class GiftCardCategoryCreateInput extends BaseGiftCardCategoryInput {
  @Unique('GiftCardCategory', {
    message: () => __('This Category Name already exist'),
  })
  @MaxLength(500, { message: () => __('Name character max length is 500') })
  @IsNotEmpty({ message: () => __('Name is required') })
  @Field(() => String)
  name: string;
}

@InputType()
export class GiftCardCategoryUpdateInput extends BaseGiftCardCategoryInput {
  @IsNotEmpty({ message: () => __('Uid is required') })
  @Field(() => String)
  uid: string;

  @MaxLength(500, { message: () => __('Name character max length is 500') })
  @IsNotEmpty({ message: () => __('Name is required') })
  @Field(() => String)
  name: string;
}
//

// ===================== Gift card template input ============================ //

@InputType()
export class BaseGiftCardTemplateInput {
  @Field(() => String)
  @IsNotEmpty({ message: () => __('Category is required') })
  category_uid: string;

  @HideField()
  category_id: number;

  @Field(() => GraphQLUpload, { nullable: true })
  image?: FileUpload;

  @MaxLength(255, { message: () => __('Title character max length is 255') })
  @Field(() => String, { nullable: true })
  title?: string;

  @MaxLength(500, {
    message: () => __('Description character max length is 500'),
  })
  @Field(() => String, { nullable: true })
  description?: string;

  @Field(() => Int)
  @IsNotEmpty({ message: () => __('Status is required') })
  @IsInt({ message: () => __('Invalid status value') })
  @IsIn([STATUS_ACTIVE, STATUS_INACTIVE], {
    message: () => __('Invalid status value'),
  })
  status: number;
}

@InputType()
export class GiftCardTemplateCreateInput extends BaseGiftCardTemplateInput {}

@InputType()
export class GiftCardTemplateUpdateInput extends BaseGiftCardTemplateInput {
  @Field(() => String)
  @IsNotEmpty({ message: () => __('Uid is required') })
  uid: string;
}
//

@InputType()
export class RecipientUserCredentialInput {
  @Field(() => String)
  @IsNotEmpty({
    message: () => __('Credential type is required'),
  })
  credential_type: USER_CREDENTIALS;
  @Field()
  @IsNotEmpty({
    message: () => __('Credential value is required'),
  })
  credential_value: string;
}

@InputType()
export class CreateOrSendUserGiftCardInput {
  @Field(() => Int)
  @IsNotEmpty({ message: () => __('Action is required') })
  @IsIn([GIFT_CARD_ACTION.CREATE, GIFT_CARD_ACTION.SEND], {
    message: () => __('Invalid action'),
  })
  action: number;

  @Field(() => Int)
  @IsNotEmpty({ message: () => __('Wallet type is required') })
  wallet_type: number;

  @Field(() => String)
  @IsNotEmpty({ message: () => __('Template is required') })
  template_uid: string;

  @HideField()
  template_id: number;

  @Field(() => String)
  @IsNotEmpty({ message: () => __('Currency is required') })
  currency_code: string;

  @Field(() => Float)
  @IsNotEmpty({ message: () => __('Amount is required!') })
  amount: number;

  @Field(() => Int, { nullable: true })
  quantity?: number;

  @Field(() => RecipientUserCredentialInput, { nullable: true })
  recipient_user_credential?: RecipientUserCredentialInput;

  @Field(() => String, { defaultValue: '' })
  @MaxLength(255, {
    message: () => __("Note can't be more than 255 characters"),
  })
  note?: string;
}
