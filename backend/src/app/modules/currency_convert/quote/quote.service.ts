import { BadRequestException, Injectable } from '@nestjs/common';
import {
  __,
  addSeconds,
  divideNumbers,
  errorResponse,
  prisma_client,
  processException,
  subMinutes,
  successResponse,
} from '../../../helpers/functions';

import { CurrencyConvertQuote, Prisma } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime';
import {
  CURRENCY_CONVERT,
  STATUS_ACTIVE,
  STATUS_EXPIRED,
} from '../../../helpers/coreconstants';
import { User } from '../../../models/db/user.model';
import { MarketCurrencyQuoteDto } from '../dto/input.dto';
import {
  CurrencyConvertAmountAndPrice,
  CurrencyQuoteData,
  CurrencyQuoteRes,
} from '../dto/response.dto';
import { QuoteValidationService } from './quote.validation';

@Injectable()
export class CurrencyQuoteService {
  constructor(private readonly validationService: QuoteValidationService) {}

  async getCurrencyConvertQuote(
    user: User,
    currencyQuoteDto: MarketCurrencyQuoteDto,
  ): Promise<CurrencyQuoteRes> {
    try {
      const { quote_id } = currencyQuoteDto;

      const {
        success,
        message,
        from_currency,
        to_currency,
        price_n_amount_data,
      } = await this.validationService.validateQuoteReq(user, currencyQuoteDto);

      if (!success) {
        return {
          quote: this.prepareQuoteResData(
            currencyQuoteDto,
            price_n_amount_data,
          ),
          ...errorResponse(message),
        };
      }

      let quote: CurrencyConvertQuote;
      if (quote_id) {
        quote = await this.updateCurrencyQuote(
          currencyQuoteDto,
          price_n_amount_data,
        );
      } else {
        quote = await this.createCurrencyQuote(
          currencyQuoteDto,
          user.id,
          from_currency.id,
          to_currency.id,
          price_n_amount_data,
        );
      }

      return {
        quote: this.prepareQuoteResData(
          currencyQuoteDto,
          price_n_amount_data,
          quote,
        ),
        ...successResponse(''),
      };
    } catch (error) {
      processException(error);
    }
  }

  private prepareQuoteResData(
    cryptoQuoteDto: MarketCurrencyQuoteDto,
    convert_price?: CurrencyConvertAmountAndPrice,
    quote?: CurrencyConvertQuote,
  ): CurrencyQuoteData {
    const { from_amount, to_amount, total_to_amount, price, fee } =
      convert_price;
    const { from_currency_code, to_currency_code } = cryptoQuoteDto;
    const inverse_price = divideNumbers(1, Number(price));

    const data: CurrencyQuoteData = {
      quote_id: quote?.uid,
      from_currency: from_currency_code,
      from_amount: new Decimal(from_amount),
      to_currency: to_currency_code,
      to_amount: new Decimal(to_amount),
      total_to_amount: new Decimal(total_to_amount),
      price: new Decimal(price),
      inverse_price: new Decimal(inverse_price),
      expires_at: quote?.expires_at,
      refresh_timer: quote?.refresh_timer,
      user_will_get: new Decimal(to_amount),
      user_will_spend: new Decimal(from_amount),
      fee: new Decimal(fee),
      status: quote?.status,
    };

    return data;
  }

  async createCurrencyQuote(
    quote_dto: MarketCurrencyQuoteDto,
    user_id: bigint,
    from_currency_id: number,
    to_currency_id: number,
    price_n_amount_data: CurrencyConvertAmountAndPrice,
  ) {
    const { from_amount, to_amount, total_to_amount, price } =
      price_n_amount_data;
    return await prisma_client.currencyConvertQuote.create({
      data: {
        feature: quote_dto.feature,
        wallet_type: quote_dto.wallet_type,
        pay_method_type: quote_dto.method_type ?? undefined,
        user_id: user_id,
        from_currency_id: from_currency_id,
        from_amount: from_amount,
        to_currency_id: to_currency_id,
        to_amount: to_amount,
        total_to_amount: total_to_amount,
        fee: price_n_amount_data.fee,
        price: price,
        expires_at: addSeconds(
          new Date(),
          CURRENCY_CONVERT.PRICE_QUOTE_EXPIRATION_TIME_IN_SEC,
        ),
        refresh_timer: CURRENCY_CONVERT.PRICE_QUOTE_REFRESH_TIMER_IN_SEC,
        status: STATUS_ACTIVE,
      },
    });
  }

  async updateCurrencyQuote(
    quote_dto: MarketCurrencyQuoteDto,
    price_n_amount_data: CurrencyConvertAmountAndPrice,
  ) {
    const { quote_id } = quote_dto;
    const quote = await this.findOne(quote_id);
    if (quote.status == STATUS_ACTIVE) {
      const { from_amount, to_amount, total_to_amount, price, fee } =
        price_n_amount_data;
      let status = quote.status;
      if (new Date() > quote.expires_at) {
        status = STATUS_EXPIRED;
      }
      return await this.update(quote_id, {
        from_amount,
        to_amount,
        total_to_amount,
        fee,
        price,
        status,
      });
    } else {
      await this.delete(quote_id);
      quote_dto.quote_id = null;
      await this.createCurrencyQuote(
        quote_dto,
        quote.user_id,
        quote.from_currency_id,
        quote.to_currency_id,
        price_n_amount_data,
      );
    }
  }

  async findOne(quote_id: string): Promise<CurrencyConvertQuote> {
    const quote = await prisma_client.currencyConvertQuote.findFirst({
      where: {
        uid: quote_id,
      },
      include: {
        from_currency: true,
        to_currency: true,
      },
    });
    if (!quote)
      throw new BadRequestException(
        errorResponse(__('Invalid currency quote!')),
      );
    return quote;
  }

  async update(
    quote_id: string,
    payload: Prisma.CurrencyConvertQuoteUncheckedUpdateInput,
  ): Promise<CurrencyConvertQuote> {
    return await prisma_client.currencyConvertQuote.update({
      where: {
        uid: quote_id,
      },
      data: payload,
    });
  }

  async delete(quote_id: string): Promise<CurrencyConvertQuote> {
    return prisma_client.currencyConvertQuote.delete({
      where: {
        uid: quote_id,
      },
    });
  }

  async cleanQuoteData() {
    const now = new Date();
    await prisma_client.currencyConvertQuote.deleteMany({
      where: {
        expires_at: {
          lte: subMinutes(now, 300), // expired 5 hrs ago
        },
      },
    });
  }
}
