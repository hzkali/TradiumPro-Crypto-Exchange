import { BadRequestException, Injectable } from '@nestjs/common';
import { MyLogger } from '../../../libs/log/log.service';
import { CurrencyConvertService } from '../../core.services/currency_conversion_api.service';
import {
  CONVERSION_FEATURES,
  CONVERT_TYPE,
  DEFAULT_DECIMAL,
  LOG_FILES,
  PAY_TO_SYSTEM_METHOD_TYPES,
  STATUS_ACTIVE,
  WALLET_TYPE,
} from '../../helpers/coreconstants';
import {
  __,
  addNumbers,
  app,
  calculateFee,
  errorResponse,
  formatAmountDecimal,
  getSettings,
  minusNumbers,
  multiplyNumbers,
  prisma_client,
  successResponse,
} from '../../helpers/functions';
import { SETTINGS_SLUG } from '../../helpers/slugconstants';
import { F_CurrencyModel } from '../../models/db/currency.model';
import { User } from '../../models/db/user.model';
import { WalletService } from '../wallet/wallet.service';
import { LimitCurrencyConvertDto } from './dto/input.dto';
import {
  CurrencyConvertAmountAndPrice,
  CurrencyConvertAmountAndPriceRes,
  CurrencyPairValidationRes,
  ValidateLimitConvertRes,
  WalletValidationRes,
} from './dto/response.dto';
import { Wallet } from '@prisma/client';

@Injectable()
export class CurrencyConvertValidationService {
  private logger: MyLogger;
  constructor(
    private readonly walletService: WalletService,
    logger?: MyLogger,
  ) {
    this.logger = logger?.logFile
      ? logger
      : new MyLogger(LOG_FILES.CURRENCY_CONVERT_LOG);
  }

  async validateLimitCurrencyConvert(
    data: LimitCurrencyConvertDto,
    user: User,
  ): Promise<ValidateLimitConvertRes> {
    const { from_currency_code, to_currency_code, amount, price, wallet_type } =
      data;

    const { from_currency, to_currency } = await this.validateCurrencyPair(
      CONVERSION_FEATURES.CONVERT,
      CONVERT_TYPE.LIMIT,
      from_currency_code,
      to_currency_code,
    );

    const validate_price_n_amount_res =
      await this.validateLimitConvertAmountAndPrice(
        from_currency,
        to_currency,
        Number(amount),
        Number(price),
      );

    if (!validate_price_n_amount_res.success)
      return validate_price_n_amount_res;

    const { price_n_amount_data } = validate_price_n_amount_res;

    const validate_wallet_res = await this.validateUserWallet(
      from_currency.id,
      to_currency.id,
      user.id,
      price_n_amount_data.from_amount,
      wallet_type,
    );

    if (!validate_wallet_res.success) return validate_wallet_res;

    const { from_wallet, to_wallet } = validate_wallet_res;

    return {
      ...successResponse(''),
      from_currency,
      to_currency,
      price_n_amount_data,
      from_wallet,
      to_wallet,
    };
  }

  // Validate currency pair
  async validateCurrencyPair(
    feature: CONVERSION_FEATURES,
    convert_type: CONVERT_TYPE,
    from_currency_code: string,
    to_currency_code: string,
  ): Promise<CurrencyPairValidationRes> {
    const [from_currency, to_currency] = await Promise.all([
      prisma_client.currency.findFirst({
        where: {
          code: from_currency_code,
          status: STATUS_ACTIVE,
          wallet_status: STATUS_ACTIVE,
          convert_status:
            convert_type == CONVERT_TYPE.LIMIT ? STATUS_ACTIVE : undefined,
        },
      }),
      prisma_client.currency.findFirst({
        where: {
          code: to_currency_code,
          status: STATUS_ACTIVE,
          wallet_status: STATUS_ACTIVE,
          convert_status:
            convert_type == CONVERT_TYPE.LIMIT ? STATUS_ACTIVE : undefined,
        },
      }),
    ]);

    if (!from_currency) {
      throw new BadRequestException(
        errorResponse(__('Invalid from currency!')),
      );
    }

    if (!to_currency) {
      throw new BadRequestException(errorResponse(__('Invalid to currency!')));
    }
    if (convert_type == CONVERT_TYPE.LIMIT) {
      return {
        ...successResponse(),
        from_currency,
        to_currency,
      };
    }

    let pair_err = false;
    if (
      feature == CONVERSION_FEATURES.CONVERT &&
      (from_currency.convert_status != STATUS_ACTIVE ||
        to_currency.convert_status != STATUS_ACTIVE)
    ) {
      pair_err = true;
    } else if (
      feature == CONVERSION_FEATURES.BUY_CRYPTO &&
      (from_currency.buy_crypto_status != STATUS_ACTIVE ||
        to_currency.buy_crypto_status != STATUS_ACTIVE)
    ) {
      pair_err = true;
    } else if (
      feature == CONVERSION_FEATURES.SELL_CRYPTO &&
      (from_currency.sell_crypto_status != STATUS_ACTIVE ||
        to_currency.sell_crypto_status != STATUS_ACTIVE)
    ) {
      pair_err = true;
    }

    if (pair_err) {
      throw new BadRequestException(
        errorResponse(__('Invalid currency pair!')),
      );
    }

    return {
      ...successResponse(),
      from_currency,
      to_currency,
    };
  }

  // Validate amount and price and return price data
  async validateLimitConvertAmountAndPrice(
    from_currency: F_CurrencyModel,
    to_currency: F_CurrencyModel,
    amount: number,
    price: number,
  ): Promise<CurrencyConvertAmountAndPriceRes> {
    let from_amount: number = amount;
    let to_amount: number;

    const convert_decimal = Number(
      (await getSettings(SETTINGS_SLUG.CURRENCY_DECIMAL_VALUE_FOR_CONVERT)) ??
        DEFAULT_DECIMAL.CRYPTO_CURRENCY,
    );

    const fee_type = to_currency.convert_fee_type;
    const fee_value = Number(to_currency.convert_fee);

    let fee = 0;
    let total_to_amount = 0;

    to_amount = multiplyNumbers(from_amount, price);
    fee = calculateFee(fee_type, fee_value, to_amount);
    to_amount = minusNumbers(to_amount, fee);
    total_to_amount = addNumbers(to_amount, fee);

    total_to_amount = formatAmountDecimal(total_to_amount, convert_decimal);
    from_amount = formatAmountDecimal(from_amount, convert_decimal);
    to_amount = formatAmountDecimal(to_amount, convert_decimal);
    fee = formatAmountDecimal(fee, convert_decimal);

    const price_n_amount_data: CurrencyConvertAmountAndPrice = {
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

    const currencyConvertService = app.get(CurrencyConvertService);
    let market_price = Number(
      await currencyConvertService.convertAmount(
        from_currency.code,
        to_currency.code,
        1,
      ),
    );
    market_price = formatAmountDecimal(price, convert_decimal);
    price_n_amount_data.maket_price = market_price;

    return {
      ...successResponse(),
      price_n_amount_data,
    };
  }

  // Validate user wallet
  async validateUserWallet(
    from_curr_id: number,
    to_curr_id: number,
    user_id: bigint,
    amount: number,
    wallet_type: WALLET_TYPE,
    pay_method_type?: PAY_TO_SYSTEM_METHOD_TYPES | string,
  ): Promise<WalletValidationRes> {
    let from_wallet: Wallet;
    let to_wallet: Wallet;

    try {
      from_wallet = await this.walletService.findWallet(
        from_curr_id,
        user_id,
        true,
      );
      to_wallet = await this.walletService.findWallet(to_curr_id, user_id);
    } catch (error) {
      return errorResponse(error.message);
    }

    if (
      !pay_method_type ||
      pay_method_type == PAY_TO_SYSTEM_METHOD_TYPES.WALLET_BALANCE
    ) {
      if (
        wallet_type == WALLET_TYPE.SPOT &&
        Number(amount) > Number(from_wallet.spot_available_balance)
      ) {
        return errorResponse(__('Insufficient wallet balance!'));
      } else if (
        wallet_type == WALLET_TYPE.FUNDING &&
        Number(amount) > Number(from_wallet.funding_available_balance)
      ) {
        return errorResponse(__('Insufficient wallet balance!'));
      } else if (
        wallet_type == WALLET_TYPE.FUTURES &&
        Number(amount) > Number(from_wallet.futures_available_balance)
      ) {
        return errorResponse(__('Insufficient wallet balance!'));
      }
    }

    return {
      ...successResponse(),
      from_wallet,
      to_wallet,
    };
  }
}
