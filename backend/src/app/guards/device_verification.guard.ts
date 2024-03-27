import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { CODE, STATUS_ACTIVE } from '../helpers/coreconstants';
import { app, errorResponse, __ } from '../helpers/functions';
import { F_DeviceVerificationService } from '../modules/auth/frontend/f.device_verification.service';

@Injectable()
export class DeviceVerificationGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<any> {
    const req = GqlExecutionContext.create(context).getContext().req;
    const user = req.user;
    const token = req.header('dvctk');
    if (!token) {
      if (user.device_check_enabled === STATUS_ACTIVE) {
        throw new UnauthorizedException(
          errorResponse(
            __('Your device is not verified.'),
            null,
            CODE.VERIFY_DEVICE,
          ),
        );
      } else {
        throw new UnauthorizedException(
          errorResponse(__('Unauthorized'), null, CODE.UNAUTHORIZED),
        );
      }
    }
    const authService = app.get(F_DeviceVerificationService);
    if (await authService.checkDeviceToken(user.id, token)) {
      return true;
    } else {
      if (user.device_check_enabled === STATUS_ACTIVE) {
        throw new UnauthorizedException(
          errorResponse(
            __('Your device is not verified.'),
            null,
            CODE.VERIFY_DEVICE,
          ),
        );
      } else {
        throw new UnauthorizedException(
          errorResponse(__('Unauthorized'), null, CODE.UNAUTHORIZED),
        );
      }
    }
  }
}
