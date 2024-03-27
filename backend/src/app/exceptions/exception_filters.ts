import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { errorObj } from '../../configs/graphql.config';
import { DEFAULT_MAX_DATA_SIZE_IN_BYTE } from '../helpers/coreconstants';
import { __, errorResponse } from '../helpers/functions';
import { LOG_LEVEL_ERROR, newConsole } from '../../libs/log/log.service';
import { Response } from 'express';
import { ResponseModel } from '../models/custom/common.response.model';

@Catch()
export class AnyExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();
    const status = exception['status'];

    // newConsole.log('status: ', status);
    // newConsole.log('exception: ', exception);
    // newConsole.log('host: ', host);
    // newConsole.log('host url: ', host.getArgByIndex(0)['url']);
    // newConsole.log('host type: ', host.getType());

    const hostType: 'http' | 'https' | 'graphql' | 'ws' = host.getType();

    const res = catchExceptionalExceptionsAndProcessMessage(status);
    if (res.catched) {
      response
        .status(200)
        .setHeader('Access-Control-Allow-Origin', '*')
        .json({
          errors: [res.errResponse],
          data: null,
        });
    } else {
      writeLogAndEndResIfNeeded(exception, hostType, response);
    }
  }
}

function catchExceptionalExceptionsAndProcessMessage(status: number): {
  catched: boolean;
  errResponse: {
    message: string;
    messages?: string[];
    code?: number;
  };
} {
  let errResponse = {
    message: '',
    messages: [],
    code: 400,
  };
  let catched = false;

  // PayloadTooLargeException 413
  if (status == 413) {
    const message = `${__(
      'Request payload too large. Data exceeds Max Size',
    )} ${DEFAULT_MAX_DATA_SIZE_IN_BYTE / 1000 ** 2} MB`;
    errResponse = errorObj(message, [], status);
    catched = true;
  }

  return { catched, errResponse };
}

function writeLogAndEndResIfNeeded(
  exception: Error,
  hostType: 'http' | 'https' | 'graphql' | 'ws',
  res: Response,
) {
  // newConsole.log('exception msg: ', exception.message);
  // newConsole.log('exception response: ', exception['response']);

  if (hostType != 'graphql') {
    const errRespObj = errorResponse();
    if (exception['response']) {
      const resp: ResponseModel = exception['response'];
      errRespObj.message =
        resp.message ?? exception.message ?? errRespObj.message;
      errRespObj.code = resp.code ?? errRespObj.code;
    } else {
      const logMsg = exception.stack || exception.message;
      console.log(logMsg, LOG_LEVEL_ERROR);
    }
    if (res?.json) res.json(errRespObj);
  }
}
