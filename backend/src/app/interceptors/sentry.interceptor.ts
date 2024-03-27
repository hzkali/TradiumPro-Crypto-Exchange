import {
  CallHandler,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import * as Sentry from '@sentry/node';
import { getSettings } from '../helpers/functions';
import { SETTINGS_SLUG } from '../helpers/slugconstants';

const errorsToTrackInSentry = [InternalServerErrorException, TypeError];

const enableSentry = (err) => {
  // const sendToSentry = errorsToTrackInSentry.some((errorType) => {
  //   console.log(typeof errorType);
  //   console.log(err instanceof errorType);
  //   return err instanceof errorType;
  // });
  // if (sendToSentry) Sentry.captureException(err);

  if (
    (err.hasOwnProperty('response') &&
      !err.response.hasOwnProperty('success') &&
      !err.response.hasOwnProperty('data')) ||
    !err.hasOwnProperty('response')
  ) {
    Sentry.captureException(err);
  }
  return throwError(() => err);
};
@Injectable()
export class SentryInterceptor implements NestInterceptor {
  // constructor(){}
  async intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Promise<Observable<any>> {
    Sentry.init({
      dsn: (await getSettings(SETTINGS_SLUG.SENTRY_DSN)) ?? '',
      // integrations: [new BrowserTracing()],
      // tracesSampleRate: 1.0,
    });
    return next.handle().pipe(catchError(enableSentry));
    // return next.handle().pipe(catchError((err) => throwError(() => err)));
  }
}
