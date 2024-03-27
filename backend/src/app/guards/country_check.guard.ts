import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { CODE } from '../helpers/coreconstants';
import { errorResponse, __ } from '../helpers/functions';
import { CountryService } from '../modules/country/country.service';

@Injectable()
export class CountryCheckGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<any> {
    const ctx = GqlExecutionContext.create(context);
    const req = ctx.getContext().req;
    const countryAllowed = await new CountryService().validateCountryFromIp(
      req.ip,
    );
    if (countryAllowed) {
      return true;
    } else {
      throw new UnauthorizedException(
        errorResponse(
          __('This country is restricted.'),
          null,
          CODE.COUNTRY_RESTRICTED,
        ),
      );
    }
  }
}
