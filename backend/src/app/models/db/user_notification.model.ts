import {
  Field,
  FieldMiddleware,
  Int,
  MiddlewareContext,
  NextFn,
  ObjectType,
} from '@nestjs/graphql';
import { HiddenIdBaseModelBigInt } from '../../../libs/model/base.model';
import { USER_NOTIFICATION_EVENT_GROUP } from '../../helpers/notification_constants';

const StatusMW: FieldMiddleware = async (
  ctx: MiddlewareContext,
  next: NextFn,
) => {
  const notif: F_UserNotificationModel = ctx.source;
  let status = await next();
  if (notif.event == USER_NOTIFICATION_EVENT_GROUP.SYSTEM_MESSAGE) {
    status = notif.notice?.users_status[0]?.status ?? status;
  }
  return status;
};

@ObjectType()
export class UserNotificationBaseModel extends HiddenIdBaseModelBigInt {
  @Field(() => String)
  uid: string;

  @Field(() => String)
  event: string;

  @Field(() => String)
  title: string;

  @Field(() => String, { nullable: true })
  description?: string;

  @Field(() => Int, { middleware: [StatusMW] })
  status: number;
}

@ObjectType()
class NoticeUserStatus {
  @Field()
  status: number;
}

@ObjectType()
class NoticeStatus {
  @Field(() => [NoticeUserStatus])
  users_status: NoticeUserStatus[];
}

@ObjectType()
export class F_UserNotificationModel extends UserNotificationBaseModel {
  @Field(() => NoticeStatus, { nullable: true })
  notice?: NoticeStatus;
}
