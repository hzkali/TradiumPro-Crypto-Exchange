/* eslint-disable prettier/prettier */
import { Field, FieldMiddleware, HideField, Int, MiddlewareContext, NextFn, ObjectType } from '@nestjs/graphql';
import { AuthenticatableInterface } from '../../../libs/auth/authenticatable.interface';
import { HiddenIdBaseModelBigInt } from '../../../libs/model/base.model';
import { FileUrlMiddleware } from '../../middlewares/url_related_field.middleware';
import { UserDeviceModel } from './user_device.model';
import { UserInfo } from './user_info.model';
import { UserKycAddressDetails } from './user_kyc_address_details.model';
import { UserKycDetails } from './user_kyc_details.model';
import { UserNotificationSetting } from './user_notification_setting.model';
import { UserSecurityQuestionModel } from './user_security_question.model';
import { UserSecurityResetRequestModel } from './user_security_reset_request.model';
import { UserSetting } from './user_setting.model';
import { UserVerifyCodes } from './user_verify_codes.model';
import { P2pUserModel } from './p2p_user.model';
import { get_online_status } from '../../helpers/functions';

const OnlineStatusMW: FieldMiddleware = async (
  ctx: MiddlewareContext,
  next: NextFn,
) => {
  const user = ctx.source;
  return get_online_status('user', user);
}

@ObjectType()
export class User
  extends HiddenIdBaseModelBigInt
  implements AuthenticatableInterface
{
  @HideField()
  static excludeAutoProcessSearchColumns = ['id', 'avatar', 'password'];

  usercode: string;
  fullname?: string;
  nickname?: string;
  email?: string;
  phone?: string;

  @HideField()
  password: string | null;
  status: number;
  @Field(() => Int, { middleware: [OnlineStatusMW] })
  online_status?: number;
  @Field({ middleware: [FileUrlMiddleware] })
  avatar?: string;
  type: number;
  reg_type: number;
  social_id?: string;

  user_infos?: UserInfo;
  user_settings?: UserSetting;
  user_verify_codes?: UserVerifyCodes[];
  referral_parent?: User;
  // referral_childs?: User[];
  user_devices?: UserDeviceModel[];
  user_notification_settings?: UserNotificationSetting;
  security_reset_requests?: UserSecurityResetRequestModel[];
  user_security_questions?: UserSecurityQuestionModel[];
  kyc_details?: UserKycDetails[];
  kyc_address_details?: UserKycAddressDetails[];

  @Field(()=> P2pUserModel, {nullable: true})
  p2p_profile?: Partial<P2pUserModel>;
}
