import { BadRequestException } from '@nestjs/common';
import { FieldMiddleware, MiddlewareContext, NextFn } from '@nestjs/graphql';
import { CurrencyConvertService } from '../core.services/currency_conversion_api.service';
import { APP_DEFAULT } from '../helpers/coreconstants';
import { __, app } from '../helpers/functions';
import { LOG_LEVEL_ERROR } from '../../libs/log/log.service';
import { Decimal } from '@prisma/client/runtime';

export const ConvCurrMware: FieldMiddleware = async (
  ctx: MiddlewareContext,
  next: NextFn,
) => {
  const source = ctx.source;
  const currencyConvertService = app.get(CurrencyConvertService);
  const currency =
    ctx.context.req.headers['currency'] || APP_DEFAULT.CURRENCY_CODE;

  if (currency == 'undefined')
    throw new BadRequestException(
      'undefined' + __(' currency from request header'),
    );

  const fieldToConvert = ctx.info.fieldName.replace('_conversion', '');
  if (
    fieldToConvert == ctx.info.fieldName ||
    source[fieldToConvert] == undefined
  ) {
    throw new Error(`Invalid convert field name: ${fieldToConvert}`);
  }

  let amount_in_default_crypto = new Decimal(0);
  let amount_in_fiat = new Decimal(0);

  try {
    amount_in_default_crypto = await currencyConvertService.convertAmount(
      source.code,
      APP_DEFAULT.CRYPTO_CODE,
      Number(source[fieldToConvert]),
    );

    amount_in_fiat = await currencyConvertService.convertAmount(
      source.code,
      currency,
      Number(source[fieldToConvert]),
    );
  } catch (e) {
    console.log(e.message, LOG_LEVEL_ERROR);
  }

  return {
    amount_in_default_crypto: amount_in_default_crypto,
    amount_in_fiat: amount_in_fiat,
  };
};

export const ConvCurrInFiatMware: FieldMiddleware = async (
  ctx: MiddlewareContext,
  next: NextFn,
) => {
  const source = ctx.source;
  const currencyConvertService = app.get(CurrencyConvertService);
  const currency =
    ctx.context.req.headers['currency'] || APP_DEFAULT.CURRENCY_CODE;

  if (currency == 'undefined')
    throw new BadRequestException(
      'undefined' + __(' currency from request header'),
    );

  const fieldToConvert = ctx.info.fieldName.replace('_conversion', '');
  if (
    fieldToConvert == ctx.info.fieldName ||
    source[fieldToConvert] == undefined
  ) {
    throw new Error(`Invalid convert field name: ${fieldToConvert}`);
  }

  let amount_in_fiat = new Decimal(0);
  try {
    amount_in_fiat = await currencyConvertService.convertAmount(
      source.code,
      currency,
      Number(source[fieldToConvert]),
    );
  } catch (e) {
    console.log(e.message, LOG_LEVEL_ERROR);
  }

  return {
    amount_in_default_crypto: 0,
    amount_in_fiat: amount_in_fiat,
  };
};

export const MarketDataConvCurrInFiatMware: FieldMiddleware = async (
  ctx: MiddlewareContext,
  next: NextFn,
) => {
  const source = ctx.source;
  const currencyConvertService = app.get(CurrencyConvertService);
  const currency =
    ctx.context.req.headers['currency'] || APP_DEFAULT.CURRENCY_CODE;

  if (currency == 'undefined')
    throw new BadRequestException(
      'undefined' + __(' currency from request header'),
    );

  const fieldToConvert = ctx.info.fieldName.replace('_conversion', '');
  if (
    fieldToConvert == ctx.info.fieldName ||
    source[fieldToConvert] == undefined
  ) {
    throw new Error(`Invalid convert field name: ${fieldToConvert}`);
  }

  let from_code = source.trade_code;
  if (fieldToConvert.includes('volumefrom')) {
    from_code = source.base_code;
  }

  let amount_in_fiat = new Decimal(0);
  try {
    amount_in_fiat = await currencyConvertService.convertAmount(
      from_code,
      currency,
      Number(source[fieldToConvert]),
    );
  } catch (e) {
    console.log(e.message, LOG_LEVEL_ERROR);
  }

  return {
    amount_in_default_crypto: 0,
    amount_in_fiat: amount_in_fiat,
  };
};
