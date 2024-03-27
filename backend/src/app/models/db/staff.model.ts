import {
  Field,
  FieldMiddleware,
  HideField,
  Int,
  MiddlewareContext,
  NextFn,
  ObjectType,
} from '@nestjs/graphql';
import { AuthenticatableInterface } from '../../../libs/auth/authenticatable.interface';
import { FileUrlMiddleware } from '../../middlewares/url_related_field.middleware';
import { g2faEnableCheckMiddleware } from '../../middlewares/g2fa_enable_check.field.middleware';
import { Role } from './role.model';
import { get_online_status } from '../../helpers/functions';

const OnlineStatusMW: FieldMiddleware = async (
  ctx: MiddlewareContext,
  next: NextFn,
) => {
  const staff = ctx.source;
  return get_online_status('staff', staff);
};

@ObjectType()
export class Staff implements AuthenticatableInterface {
  @Field(() => Int)
  id: number;
  @Field(() => Date, { nullable: true })
  createdAt?: Date;
  @Field(() => Date)
  @Field(() => Date, { nullable: true })
  updatedAt?: Date;

  @Field(() => String)
  username: string;
  @Field(() => String)
  email: string;
  @Field(() => String)
  name: string;
  @Field({ middleware: [FileUrlMiddleware] })
  avatar?: string;
  @Field(() => String, { nullable: true })
  description?: string;
  @Field(() => String, { nullable: true })
  phone?: string;
  emailVerifiedAt?: Date;
  isEmailVerified: boolean;
  @Field(() => String, { nullable: true })
  resetCode?: string;
  @HideField()
  google2fa_secret?: string;
  @Field({ middleware: [g2faEnableCheckMiddleware] })
  google2fa_enabled?: boolean;
  @Field(() => Int, { nullable: true })
  roleId?: number;
  @Field(() => Int, { middleware: [OnlineStatusMW] })
  online_status?: number;
  @Field(() => Int)
  status: number;
  @Field(() => Role)
  role?: Role;
  @HideField()
  password: string;
}
