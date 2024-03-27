import { BadRequestException, Injectable } from '@nestjs/common';
import {
  __,
  app,
  errorResponse,
  getDateXDaysAfter,
  getDateXDaysAgo,
  getDateXHoursAgo,
  mongo_client,
  prisma_client,
  processException,
  successResponse,
} from '../../helpers/functions';
import { OrderBy } from '../../models/custom/common.input.model';
import { F_CurrencyModel } from '../../models/db/currency.model';

import { Prisma } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime';
import { PaginationLimitOffsetArgs } from '../../../libs/graphql/pagination/pagination.args';
import { findManyOffsetLimitConnection } from '../../../libs/graphql/pagination/paginationLimitOffset';
import { MyLogger } from '../../../libs/log/log.service';
import {
  CONVERSION_FEATURES,
  CONVERT_TYPE,
  CURRENCY_CONVERT_DEFAULT_PAIR,
  CURRENCY_CONVERT_STATUS,
  CURRENCY_TYPE,
  DB_QUERY_DEFAULT,
  LOG_FILES,
  STATUS_ACTIVE,
} from '../../helpers/coreconstants';
import { ResponseModel } from '../../models/custom/common.response.model';
import { F_CurrencyConvertHistoryConnection } from '../../models/custom/pagination.connections.model';
import { F_CurrencyPairModel } from '../../models/db/currency_pair.model';
import { User } from '../../models/db/user.model';
import { BalanceDebitQueue } from '../../queues/balance_debit.queue';
import { CurrencyConvertQueue } from '../../queues/currency_convert.queue';
import { getCurrencyPairCachedData } from '../spot_trade/currency_pair/currency_pair.helper';
import { CurrencyConvertValidationService } from './currency_convert.validation';
import {
  CurrencyForConvertFilter,
  F_CurrencyConvertHistoryFilter,
} from './dto/filter.dto';
import { LimitCurrencyConvertDto } from './dto/input.dto';
import {
  ConvertCurrencyData,
  ConvertPairData,
  CurrencyConvertAmountAndPrice,
  LimitConvertChartDataRes,
} from './dto/response.dto';
import { CurrencyQuoteService } from './quote/quote.service';

@Injectable()
export class CurrencyConvertService {
  private logger: MyLogger;
  constructor(
    private readonly quoteService: CurrencyQuoteService,
    private readonly currencyConvertValidationService: CurrencyConvertValidationService,
    logger?: MyLogger,
  ) {
    this.logger = logger?.logFile
      ? logger
      : new MyLogger(LOG_FILES.CURRENCY_CONVERT_LOG);
  }

  // ====================== Market currency convert api services ============================ //

  // Get market currency data by currency code
  async getMarketCurrencyDataByCode(
    user: User,
    from_currency_code: string,
    to_currency_code: string,
  ): Promise<ConvertPairData> {
    try {
      const currency_pair_data: ConvertPairData = {};

      if (from_currency_code == to_currency_code) {
        throw new BadRequestException(errorResponse(__('Invalid pair!')));
      }

      let [from_currency, to_currency] = await Promise.all([
        this.findCurrencyWithWallet(user.id, from_currency_code),
        this.findCurrencyWithWallet(user.id, to_currency_code),
      ]);

      if (!from_currency) {
        if (CURRENCY_CONVERT_DEFAULT_PAIR.FROM_CRYPTO != to_currency_code) {
          from_currency = await this.findCurrencyWithWallet(
            user.id,
            CURRENCY_CONVERT_DEFAULT_PAIR.FROM_CRYPTO,
          );
        }
        if (!from_currency) {
          from_currency = await this.findCurrencyWithWallet(user.id, null, {
            code: {
              not: to_currency_code,
            },
            status: STATUS_ACTIVE,
            convert_status: STATUS_ACTIVE,
          });
        }
      }

      if (!from_currency) {
        return currency_pair_data;
      }
      from_currency_code = from_currency.code;

      if (!to_currency) {
        if (CURRENCY_CONVERT_DEFAULT_PAIR.TO_CRYPTO != from_currency_code) {
          to_currency = await this.findCurrencyWithWallet(
            user.id,
            CURRENCY_CONVERT_DEFAULT_PAIR.TO_CRYPTO,
          );
        }
        if (!to_currency) {
          to_currency = await this.findCurrencyWithWallet(user.id, null, {
            code: {
              not: from_currency_code,
            },
            status: STATUS_ACTIVE,
            convert_status: STATUS_ACTIVE,
          });
        }
      }

      if (!to_currency) {
        return currency_pair_data;
      }
      to_currency_code = to_currency.code;

      currency_pair_data.pair = `${from_currency_code.toUpperCase()}_${to_currency_code.toUpperCase()}`;

      currency_pair_data.from_currency =
        this.prepareCurrencyData(from_currency);
      currency_pair_data.to_currency = this.prepareCurrencyData(to_currency);

      return currency_pair_data;
    } catch (error) {
      processException(error);
    }
  }

  async findCurrencyPairWithWallet(
    user_id: bigint,
    from_currency_code: string,
    to_currency_code: string,
  ) {
    return await Promise.all([
      this.findCurrencyWithWallet(user_id, from_currency_code),
      this.findCurrencyWithWallet(user_id, to_currency_code),
    ]);
  }

  async findCurrencyWithWallet(
    user_id: bigint,
    code?: string,
    where?: Prisma.CurrencyWhereInput,
  ): Promise<F_CurrencyModel> {
    return prisma_client.currency.findFirst({
      where: where ?? {
        code: code
          ? {
              mode: 'insensitive',
              equals: code,
            }
          : undefined,
        status: STATUS_ACTIVE,
        convert_status: STATUS_ACTIVE,
      },
      include: {
        wallets: {
          where: {
            user_id: user_id,
          },
        },
      },
      orderBy: [{ id: 'asc' }],
    });
  }

  async getCurrencyListForMarketConvert(
    user: User,
    filter?: CurrencyForConvertFilter,
    orderBy?: OrderBy,
    limit?: number,
  ): Promise<F_CurrencyModel[]> {
    try {
      return await prisma_client.currency.findMany({
        where: {
          status: STATUS_ACTIVE,
          type: filter?.currency_type ?? CURRENCY_TYPE.CRYPTO,
          wallet_status: STATUS_ACTIVE,
          convert_status:
            filter.feature == CONVERSION_FEATURES.CONVERT
              ? STATUS_ACTIVE
              : undefined,
          buy_crypto_status:
            filter.feature == CONVERSION_FEATURES.BUY_CRYPTO
              ? STATUS_ACTIVE
              : undefined,
          sell_crypto_status:
            filter.feature == CONVERSION_FEATURES.SELL_CRYPTO
              ? STATUS_ACTIVE
              : undefined,
          OR: filter?.query
            ? [
                {
                  code: {
                    mode: 'insensitive',
                    contains: filter?.query,
                  },
                },
                {
                  name: {
                    mode: 'insensitive',
                    contains: filter?.query,
                  },
                },
              ]
            : undefined,
        },
        include: {
          wallets: {
            where: {
              user_id: user.id,
            },
          },
        },
        orderBy: [
          orderBy ? { [orderBy.field]: orderBy.direction } : undefined,
          { id: 'desc' },
        ],
        take: limit || undefined,
      });
    } catch (error) {
      processException(error);
    }
  }

  // Market currency convert mutation service function
  async marketCurrencyConvert(quote_id: string): Promise<ResponseModel> {
    try {
      const quote = await this.quoteService.findOne(quote_id);
      if (quote.status != STATUS_ACTIVE) {
        throw new BadRequestException(errorResponse(__('Invalid quote!')));
      }
      await app.get(BalanceDebitQueue).processMarketCurrencyConvertJob({
        quote_id: quote.uid,
        user_id: quote.user_id,
      });
      return successResponse('');
    } catch (error) {
      processException(error);
    }
  }

  // ===================== Limit currency convert api services ============================ //

  async getValidCurrencyDataForLimitConvert(
    user: User,
    from_currency_code: string,
    to_currency_code: string,
  ): Promise<ConvertPairData> {
    try {
      from_currency_code = from_currency_code.toUpperCase();
      to_currency_code = to_currency_code.toUpperCase();

      const convert_pair_data: ConvertPairData = {};
      let currency_pair = await this.findCurrencyPairWithWalletForLimit(
        user.id,
        {
          base_currency_code: from_currency_code,
          trade_currency_code: to_currency_code,
        },
      );

      if (!currency_pair) {
        currency_pair = await this.findCurrencyPairWithWalletForLimit(user.id, {
          base_currency_code: to_currency_code,
          trade_currency_code: from_currency_code,
        });
      }

      if (!currency_pair) {
        let first_pair_of_from_currency_or_default_pair =
          await prisma_client.currencyPair.findFirst({
            where: {
              base_currency_code: from_currency_code,
              status: STATUS_ACTIVE,
              base_currency: {
                status: STATUS_ACTIVE,
                convert_status: STATUS_ACTIVE,
              },
              trade_currency: {
                status: STATUS_ACTIVE,
                convert_status: STATUS_ACTIVE,
              },
            },
            select: { base_currency_code: true, trade_currency_code: true },
            orderBy: [{ id: 'asc' }],
          });

        if (!first_pair_of_from_currency_or_default_pair) {
          first_pair_of_from_currency_or_default_pair =
            await prisma_client.currencyPair.findFirst({
              where: {
                trade_currency_code: from_currency_code,
                status: STATUS_ACTIVE,
                base_currency: {
                  status: STATUS_ACTIVE,
                  convert_status: STATUS_ACTIVE,
                },
                trade_currency: {
                  status: STATUS_ACTIVE,
                  convert_status: STATUS_ACTIVE,
                },
              },
              select: { base_currency_code: true, trade_currency_code: true },
              orderBy: [{ id: 'asc' }],
            });
        }

        if (!first_pair_of_from_currency_or_default_pair) {
          first_pair_of_from_currency_or_default_pair =
            await prisma_client.currencyPair.findFirst({
              where: {
                is_default: STATUS_ACTIVE,
                status: STATUS_ACTIVE,
                base_currency: {
                  status: STATUS_ACTIVE,
                  convert_status: STATUS_ACTIVE,
                },
                trade_currency: {
                  status: STATUS_ACTIVE,
                  convert_status: STATUS_ACTIVE,
                },
              },
              select: { base_currency_code: true, trade_currency_code: true },
              orderBy: [{ id: 'asc' }],
            });
        }

        if (!first_pair_of_from_currency_or_default_pair) {
          // search for any active pair
          first_pair_of_from_currency_or_default_pair =
            await prisma_client.currencyPair.findFirst({
              where: {
                status: STATUS_ACTIVE,
                base_currency: {
                  status: STATUS_ACTIVE,
                  convert_status: STATUS_ACTIVE,
                },
                trade_currency: {
                  status: STATUS_ACTIVE,
                  convert_status: STATUS_ACTIVE,
                },
              },
              select: { base_currency_code: true, trade_currency_code: true },
              orderBy: [{ id: 'asc' }],
            });
        }

        if (!first_pair_of_from_currency_or_default_pair) {
          throw new BadRequestException(
            errorResponse(__('Pair not found for Limit Convert')),
          );
        }

        currency_pair = await this.findCurrencyPairWithWalletForLimit(user.id, {
          base_currency_code:
            first_pair_of_from_currency_or_default_pair.base_currency_code,
          trade_currency_code:
            first_pair_of_from_currency_or_default_pair.trade_currency_code,
        });
      }

      if (!currency_pair) {
        throw new BadRequestException(
          errorResponse(__('Pair not found for Limit Convert')),
        );
      }

      const currency_pair_cached = getCurrencyPairCachedData(currency_pair.id);

      const currency_pair_cached_data: F_CurrencyPairModel = {
        uid: currency_pair.uid,
        base: currency_pair.base_currency_code,
        trade: currency_pair.trade_currency_code,
        code: currency_pair_cached.code,
        base_decimal: currency_pair_cached.base_decimal,
        trade_decimal: currency_pair_cached.trade_decimal,
        prev_price: new Decimal(currency_pair_cached.prev_price),
        market_price: new Decimal(currency_pair_cached.market_price),
        change: new Decimal(currency_pair_cached.change),
        volumefrom: new Decimal(currency_pair_cached.volumefrom),
        volumeto: new Decimal(currency_pair_cached.volumeto),
        high: new Decimal(currency_pair_cached.high),
        low: new Decimal(currency_pair_cached.low),
      };

      convert_pair_data.currency_pair = currency_pair_cached_data;

      if (
        currency_pair.base_currency_code == from_currency_code ||
        currency_pair.trade_currency_code == from_currency_code
      ) {
        if (currency_pair.base_currency_code == from_currency_code) {
          convert_pair_data.from_currency = this.prepareCurrencyData(
            currency_pair.base_currency,
          );
          convert_pair_data.to_currency = this.prepareCurrencyData(
            currency_pair.trade_currency,
          );
        } else {
          convert_pair_data.from_currency = this.prepareCurrencyData(
            currency_pair.trade_currency,
          );
          convert_pair_data.to_currency = this.prepareCurrencyData(
            currency_pair.base_currency,
          );
        }
      } else {
        convert_pair_data.from_currency = this.prepareCurrencyData(
          currency_pair.base_currency,
        );
        convert_pair_data.to_currency = this.prepareCurrencyData(
          currency_pair.trade_currency,
        );
      }

      convert_pair_data.pair = `${convert_pair_data.from_currency.code}_${convert_pair_data.to_currency.code}`;

      return convert_pair_data;
    } catch (error) {
      processException(error);
    }
  }

  private prepareCurrencyData(currency: F_CurrencyModel): ConvertCurrencyData {
    return {
      code: currency.code,
      name: currency.name,
      symbol: currency.symbol,
      decimal: currency.decimal,
      logo: currency.logo,
      min_convert_amount: new Decimal(currency.min_convert_amount),
      max_convert_amount: new Decimal(currency.max_convert_amount),
      convert_fee_type: currency.convert_fee_type,
      convert_fee: currency.convert_fee,
      spot_available_balance:
        currency?.wallets[0]?.spot_available_balance ?? new Decimal(0),
      funding_available_balance:
        currency?.wallets[0]?.funding_available_balance ?? new Decimal(0),
    };
  }

  async findCurrencyPairWithWalletForLimit(
    user_id: bigint,
    where?: Prisma.CurrencyPairWhereInput,
  ) {
    return await prisma_client.currencyPair.findFirst({
      where: {
        ...where,
        status: STATUS_ACTIVE,
        base_currency: {
          status: STATUS_ACTIVE,
          convert_status: STATUS_ACTIVE,
        },
        trade_currency: {
          status: STATUS_ACTIVE,
          convert_status: STATUS_ACTIVE,
        },
      },
      include: {
        base_currency: {
          include: {
            wallets: {
              where: {
                user_id: user_id,
              },
            },
          },
        },
        trade_currency: {
          include: {
            wallets: {
              where: {
                user_id: user_id,
              },
            },
          },
        },
      },
    });
  }

  async getFromCurrencyListForLimitConvert(
    user: User,
    filter?: CurrencyForConvertFilter,
    orderBy?: OrderBy,
    limit?: number,
  ): Promise<F_CurrencyModel[]> {
    try {
      return await prisma_client.currency.findMany({
        where: {
          status: STATUS_ACTIVE,
          convert_status: STATUS_ACTIVE,
          AND: [
            {
              OR: filter?.query
                ? [
                    {
                      code: {
                        mode: 'insensitive',
                        contains: filter?.query,
                      },
                    },
                    {
                      name: {
                        mode: 'insensitive',
                        contains: filter?.query,
                      },
                    },
                  ]
                : undefined,
            },
            {
              OR: [
                {
                  base_currency_pairs: {
                    some: {
                      status: STATUS_ACTIVE,
                    },
                  },
                },
                {
                  trade_currency_pairs: {
                    some: {
                      status: STATUS_ACTIVE,
                    },
                  },
                },
              ],
            },
          ],
        },
        include: {
          wallets: {
            where: {
              user_id: user.id,
            },
          },
        },
        orderBy: [
          orderBy ? { [orderBy.field]: orderBy.direction } : undefined,
          { id: 'desc' },
        ],
        take: limit || undefined,
      });
    } catch (error) {
      processException(error);
    }
  }

  async getToCurrencyListForLimitConvert(
    from_currency_code: string,
    filter?: CurrencyForConvertFilter,
    orderBy?: OrderBy,
    limit?: number,
  ): Promise<F_CurrencyModel[]> {
    try {
      const from_currency = await prisma_client.currency.findFirst({
        where: {
          code: from_currency_code,
          convert_status: STATUS_ACTIVE,
          status: STATUS_ACTIVE,
        },
      });

      if (!from_currency) {
        throw new BadRequestException(
          errorResponse(__('Invalid from currency!')),
        );
      }

      return await prisma_client.currency.findMany({
        where: {
          status: STATUS_ACTIVE,
          convert_status: STATUS_ACTIVE,
          id: {
            not: from_currency.id,
          },
          AND: [
            {
              OR: filter?.query
                ? [
                    {
                      code: {
                        mode: 'insensitive',
                        contains: filter?.query,
                      },
                    },
                    {
                      name: {
                        mode: 'insensitive',
                        contains: filter?.query,
                      },
                    },
                  ]
                : undefined,
            },
            {
              OR: [
                {
                  trade_currency_pairs: {
                    some: {
                      base_currency_id: from_currency.id,
                      status: STATUS_ACTIVE,
                    },
                  },
                },
                {
                  base_currency_pairs: {
                    some: {
                      trade_currency_id: from_currency.id,
                      status: STATUS_ACTIVE,
                    },
                  },
                },
              ],
            },
          ],
        },
        orderBy: [
          orderBy ? { [orderBy.field]: orderBy.direction } : undefined,
          { id: 'desc' },
        ],
        take: limit || undefined,
      });
    } catch (error) {
      processException(error);
    }
  }

  async getChartDataForLimitConvert(
    pair: string,
    days?: number,
  ): Promise<LimitConvertChartDataRes[]> {
    try {
      const base_code = pair.split('_')[0];
      const trade_code = pair.split('_')[1];
      const currency_pair = await prisma_client.currencyPair.findFirst({
        where: {
          base_currency_code: {
            mode: 'insensitive',
            equals: base_code,
          },
          trade_currency_code: {
            mode: 'insensitive',
            equals: trade_code,
          },
        },
        select: {
          id: true,
          base_currency_code: true,
          trade_currency_code: true,
        },
      });

      if (!currency_pair) {
        throw new BadRequestException(
          errorResponse(__('Invalid Currency Pair')),
        );
      }

      days = days || 1;
      const hours = days * 24;
      const from_timestamp = Number(getDateXHoursAgo(hours));
      return await mongo_client.trade.findMany({
        where: {
          currency_pair_id: currency_pair.id,
          timestamp: {
            gte: from_timestamp,
          },
        },
        select: {
          timestamp: true,
          price: true,
        },
        orderBy: [{ timestamp: 'desc' }],
      });
    } catch (error) {
      processException(error);
    }
  }

  // Limit currency convert mutation service function
  async limitCurrencyConvert(
    data: LimitCurrencyConvertDto,
    user: User,
  ): Promise<ResponseModel> {
    try {
      const {
        success,
        message,
        from_currency,
        to_currency,
        price_n_amount_data,
      } = await this.currencyConvertValidationService.validateLimitCurrencyConvert(
        data,
        user,
      );
      if (!success) {
        throw new BadRequestException(errorResponse(message));
      }

      const payload: Prisma.CurrencyConvertHistoryUncheckedCreateInput =
        this.prepareLimitCurrencyConvertData(
          user.id,
          data,
          from_currency.id,
          to_currency.id,
          price_n_amount_data,
        );

      const created_convert = await prisma_client.currencyConvertHistory.create(
        {
          data: {
            feature: CONVERSION_FEATURES.CONVERT,
            ...payload,
          },
        },
      );

      await app
        .get(BalanceDebitQueue)
        .processLimitCurrencyConvertJob(created_convert.id, user.id);

      return successResponse('');
    } catch (error) {
      processException(error);
    }
  }

  // Prepare limit currency convert data
  prepareLimitCurrencyConvertData(
    user_id: bigint,
    data: LimitCurrencyConvertDto,
    from_currency_id: number,
    to_currency_id: number,
    price_n_amount_data: CurrencyConvertAmountAndPrice,
  ): Prisma.CurrencyConvertHistoryUncheckedCreateInput {
    const { from_amount, to_amount, price, total_to_amount, fee, maket_price } =
      price_n_amount_data;
    const { expires_in, wallet_type } = data;
    const payload: Prisma.CurrencyConvertHistoryUncheckedCreateInput = {
      user_id: user_id,
      wallet_type: wallet_type,
      convert_type: CONVERT_TYPE.LIMIT,
      from_currency_id: from_currency_id,
      from_amount: new Decimal(from_amount),
      to_currency_id: to_currency_id,
      to_amount: new Decimal(to_amount),
      total_to_amount: new Decimal(total_to_amount),
      fee: new Decimal(fee),
      price: new Decimal(price),
      market_price_was: new Decimal(maket_price),
      expires_at: getDateXDaysAfter(expires_in),
      status: CURRENCY_CONVERT_STATUS.PENDING,
    };

    return payload;
  }

  // Cancell limit currency convert mutation service function
  async cancelLimitCurrencyConvert(
    convert_uid: string,
    user: User,
  ): Promise<ResponseModel> {
    try {
      const currency_convert =
        await prisma_client.currencyConvertHistory.findFirst({
          where: {
            uid: convert_uid,
            status: CURRENCY_CONVERT_STATUS.OPEN,
          },
        });

      if (!currency_convert) {
        throw new BadRequestException(
          errorResponse(__('Invalid convert uid!')),
        );
      }

      await app
        .get(CurrencyConvertQueue)
        .cancelLimitCurrencyConvertJob(currency_convert.id, user.id);

      return successResponse(
        __(
          'Cancel request placed successfully. You will be notified when it is done.',
        ),
      );
    } catch (error) {
      processException(error);
    }
  }

  // ================= Convert History Api Service ==================== //

  async getConvertHistoryListPaginated(
    paginate: PaginationLimitOffsetArgs,
    user: User,
    filter: F_CurrencyConvertHistoryFilter,
  ): Promise<F_CurrencyConvertHistoryConnection> {
    try {
      paginate.limit = paginate?.limit ?? DB_QUERY_DEFAULT.LIMIT;
      paginate.offset = paginate?.offset ?? DB_QUERY_DEFAULT.OFFSET;

      return await findManyOffsetLimitConnection<F_CurrencyConvertHistoryConnection>(
        paginate?.limit,
        paginate?.offset,
        async () => {
          return await prisma_client.currencyConvertHistory.findMany({
            where: {
              user_id: user.id,
              ...this.filterCurrencyConvertHistory(filter),
            },
            include: {
              from_currency: true,
              to_currency: true,
            },
            orderBy: {
              updated_at: 'desc',
            },
            take: paginate.limit || undefined,
            skip: paginate.offset || undefined,
          });
        },
        async () => {
          return await prisma_client.currencyConvertHistory.count({
            where: {
              user_id: user.id,
              ...this.filterCurrencyConvertHistory(filter),
            },
          });
        },
      );
    } catch (error) {
      processException(error);
    }
  }

  filterCurrencyConvertHistory(
    filter: F_CurrencyConvertHistoryFilter,
  ): Prisma.CurrencyConvertHistoryWhereInput {
    const where: Prisma.CurrencyConvertHistoryWhereInput = {
      feature: CONVERSION_FEATURES.CONVERT,
      status: filter?.status ?? { not: CURRENCY_CONVERT_STATUS.PENDING },
      wallet_type: filter?.wallet_type ?? undefined,
      convert_type: filter?.convert_type ?? undefined,
    };

    if (filter?.currency_code) {
      where.OR = [
        {
          from_currency: {
            code: {
              mode: 'insensitive',
              equals: filter.currency_code,
            },
          },
        },
        {
          to_currency: {
            code: {
              mode: 'insensitive',
              equals: filter.currency_code,
            },
          },
        },
      ];
    }

    if (filter?.time) {
      if (filter?.time.days) {
        where.updated_at = {
          gt: getDateXDaysAgo(filter?.time.days),
        };
      } else if (filter?.time.date) {
        where.updated_at = {
          gte: filter?.time.date.start_date,
          lte: filter?.time.date.end_date,
        };
      }
    }
    return where;
  }
}
