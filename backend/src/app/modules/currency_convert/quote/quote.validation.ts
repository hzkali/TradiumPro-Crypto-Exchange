import { BadRequestException, Injectable } from '@nestjs/common';
import {
  __,
  addNumbers,
  app,
  calculateFee,
  divideNumbers,
  errorResponse,
  formatAmountDecimal,
  getSettings,
  minusNumbers,
  multiplyNumbers,
  successResponse,
} from '../../../helpers/functions';

import { CurrencyConvertService } from '../../../core.services/currency_conversion_api.service';
import {
  CONVERSION_FEATURES,
  CONVERT_TYPE,
  CURRENCY_TYPE,
  DEFAULT_DECIMAL,
  PAY_TO_SYSTEM_METHOD_TYPES,
} from '../../../helpers/coreconstants';
import { SETTINGS_SLUG } from '../../../helpers/slugconstants';
import { F_CurrencyModel } from '../../../models/db/currency.model';
import { User } from '../../../models/db/user.model';
import { CurrencyConvertValidationService } from '../currency_convert.validation';
import { MarketCurrencyQuoteDto } from '../dto/input.dto';
import {
  CurrencyConvertAmountAndPriceRes,
  ValidateCurrencyQuoteReqRes,
} from '../dto/response.dto';
import { ResponseModel } from '../../../models/custom/common.response.model';

@Injectable()
export class QuoteValidationService {
  constructor(
    private readonly currencyConvertValidationService: CurrencyConvertValidationService,
  ) {}
  async validateQuoteReq(
    user: User,
    quote_dto: MarketCurrencyQuoteDto,
  ): Promise<ValidateCurrencyQuoteReqRes> {
    const {
      from_currency_code,
      to_currency_code,
      amount,
      amount_currency_code,
      wallet_type,
      feature,
    } = quote_dto;

    const { from_currency, to_currency } =
      await this.currencyConvertValidationService.validateCurrencyPair(
        feature,
        CONVERT_TYPE.MARKET,
        from_currency_code,
        to_currency_code,
      );

    await this.validateFeatureAndPayMethod(quote_dto);

    const validation_res = await this.validateAmountAndPrice(
      feature,
      from_currency,
      to_currency,
      amount,
      amount_currency_code,
    );

    const { price_n_amount_data } = validation_res;

    if (!validation_res.success)
      return {
        ...errorResponse(validation_res.message),
        price_n_amount_data: validation_res.price_n_amount_data,
      };

    const { from_amount } = price_n_amount_data;

    const wallet_validation_res =
      await this.currencyConvertValidationService.validateUserWallet(
        from_currency.id,
        to_currency.id,
        user.id,
        from_amount,
        wallet_type,
        quote_dto.method_type,
      );

    if (!wallet_validation_res.success)
      return {
        ...errorResponse(wallet_validation_res.message),
        price_n_amount_data,
      };

    const { from_wallet, to_wallet } = wallet_validation_res;

    return {
      ...successResponse(),
      from_currency,
      to_currency,
      from_wallet,
      to_wallet,
      price_n_amount_data,
    };
  }

  // Validate amount and price and return price data
  async validateAmountAndPrice(
    feature: CONVERSION_FEATURES,
    from_currency: F_CurrencyModel,
    to_currency: F_CurrencyModel,
    amount: number,
    amount_currency_code: string,
  ): Promise<CurrencyConvertAmountAndPriceRes> {
    const currencyConvertService = app.get(CurrencyConvertService);

    let from_amount: number;
    let to_amount: number;

    const { from_curr_decimal, to_curr_decimal } = await this.getDecimal(
      from_currency,
      to_currency,
    );

    let price = Number(
      await currencyConvertService.convertAmount(
        from_currency.code,
        to_currency.code,
        1,
      ),
    );
    price = formatAmountDecimal(price, to_curr_decimal);

    // for convert and sell_crypto feature same fee field of to_currency
    let fee_type = to_currency.convert_fee_type;
    let fee_value = Number(to_currency.convert_fee);

    if (feature == CONVERSION_FEATURES.BUY_CRYPTO) {
      fee_type = to_currency.buy_crypto_fee_type;
      fee_value = Number(to_currency.buy_crypto_fee);
    }

    let fee = 0;
    let total_to_amount = 0;

    if (from_currency.code == amount_currency_code) {
      //
      from_amount = amount;
      to_amount = multiplyNumbers(from_amount, price);
      fee = calculateFee(fee_type, fee_value, to_amount);
      to_amount = minusNumbers(to_amount, fee);
      total_to_amount = addNumbers(to_amount, fee);
      //
    } else if (to_currency.code == amount_currency_code) {
      //
      total_to_amount = amount;
      from_amount = divideNumbers(total_to_amount, price);
      fee = calculateFee(fee_type, fee_value, total_to_amount);
      to_amount = minusNumbers(total_to_amount, fee);

      /** codes for giving user to_amount exactly */
      /* to_amount = amount;
      fee = calculateFee(fee_type, fee_value, to_amount);
      const fee_with_to_amount = addNumbers(to_amount, fee);
      from_amount = divideNumbers(fee_with_to_amount, price);
      total_to_amount = fee_with_to_amount; */
      //
    } else {
      throw new BadRequestException(
        errorResponse(__('Invalid amount currency code!')),
      );
    }

    total_to_amount = formatAmountDecimal(total_to_amount, to_curr_decimal);
    from_amount = formatAmountDecimal(from_amount, from_curr_decimal);
    to_amount = formatAmountDecimal(to_amount, to_curr_decimal);
    fee = formatAmountDecimal(fee, to_curr_decimal);

    const price_n_amount_data = {
      from_amount,
      to_amount,
      total_to_amount,
      price,
      fee,
    };

    if (to_amount <= 0) {
      // if (
      //   to_crypto.convert_fee_type == FEE_TYPE.FIXED &&
      //   Number(to_crypto.convert_fee)
      // ) {
      //   return {
      //     ...errorResponse(
      //       __(
      //         'Convert fee is much higer than your convert crypto amount, contact to support!',
      //       ),
      //     ),
      //     price_n_amount_data: price_n_amount_data,
      //   };
      // } else {
      return {
        ...errorResponse(__('Amount is too small, Please increase!')),
        price_n_amount_data: price_n_amount_data,
      };
      // }
    }

    if (from_amount <= 0) {
      return {
        ...errorResponse(__('Amount is too small, Please increase!')),
        price_n_amount_data: price_n_amount_data,
      };
    }

    if (from_amount < Number(from_currency.min_convert_amount)) {
      return {
        ...errorResponse(__('From Amount less than the minimum amount!')),
        price_n_amount_data: price_n_amount_data,
      };
    }

    if (from_amount > Number(from_currency.max_convert_amount)) {
      return {
        ...errorResponse(__('From Amount higher than the maximum amount!')),
        price_n_amount_data: price_n_amount_data,
      };
    }

    return {
      ...successResponse(),
      price_n_amount_data,
    };
  }

  async getDecimal(
    from_currency: F_CurrencyModel,
    to_currency: F_CurrencyModel,
  ): Promise<{
    from_curr_decimal: number;
    to_curr_decimal: number;
  }> {
    let from_curr_decimal = 0;
    let to_curr_decimal = 0;

    const crypto_decimal_for_convert = Number(
      (await getSettings(SETTINGS_SLUG.CURRENCY_DECIMAL_VALUE_FOR_CONVERT)) ??
        DEFAULT_DECIMAL.CRYPTO_CURRENCY,
    );
    if (
      from_currency.type == CURRENCY_TYPE.CRYPTO &&
      to_currency.type == CURRENCY_TYPE.CRYPTO
    ) {
      from_curr_decimal = crypto_decimal_for_convert;
      to_curr_decimal = crypto_decimal_for_convert;
    } else if (
      from_currency.type == CURRENCY_TYPE.FIAT &&
      to_currency.type == CURRENCY_TYPE.FIAT
    ) {
      from_curr_decimal = from_currency.decimal;
      to_curr_decimal = to_currency.decimal;
    } else {
      if (
        from_currency.type == CURRENCY_TYPE.CRYPTO &&
        to_currency.type == CURRENCY_TYPE.FIAT
      ) {
        from_curr_decimal = crypto_decimal_for_convert;
        to_curr_decimal = to_currency.decimal;
      } else if (
        from_currency.type == CURRENCY_TYPE.FIAT &&
        to_currency.type == CURRENCY_TYPE.CRYPTO
      ) {
        from_curr_decimal = from_currency.decimal;
        to_curr_decimal = crypto_decimal_for_convert;
      }
    }

    return { from_curr_decimal, to_curr_decimal };
  }

  // Validate feature & pay method type
  async validateFeatureAndPayMethod(
    quote_dto: MarketCurrencyQuoteDto,
  ): Promise<ResponseModel> {
    if (!Object.values(CONVERSION_FEATURES).includes(quote_dto.feature)) {
      throw new BadRequestException(errorResponse(__('Inavlid Feature')));
    }

    if (quote_dto.feature == CONVERSION_FEATURES.BUY_CRYPTO) {
      if (!quote_dto.method_type) {
        throw new BadRequestException(
          errorResponse(__('Payment Method required!!')),
        );
      } else if (
        !Object.values(PAY_TO_SYSTEM_METHOD_TYPES).includes(
          quote_dto.method_type,
        )
      ) {
        throw new BadRequestException(
          errorResponse(__('Invalid Payment Method!!')),
        );
      }
    }

    return successResponse();
  }
}
