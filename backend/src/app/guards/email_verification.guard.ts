import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Observable } from 'rxjs';
import { STATUS_DONE } from '../helpers/coreconstants';
import { errorResponse, __ } from '../helpers/functions';

@Injectable()
export class EmailVerificationGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const req = ctx.getContext().req;
    if (req.user.user_settings.email_verified === STATUS_DONE) {
      return true;
    } else {
      throw new UnauthorizedException(
        errorResponse(__('Email not verified! Please verify your email.')),
      );
    }
  }
}
