import { Injectable } from '@nestjs/common';
import { prisma_client, processException } from '../../../helpers/functions';
import { OrderBy } from '../../../models/custom/common.input.model';

import { findManyCursorConnection } from '@devoxa/prisma-relay-cursor-connection';
import { Prisma } from '@prisma/client';
import { pOptionsBigInt } from '../../../../libs/graphql/pagination/number_cursor';
import { PaginationArgs } from '../../../../libs/graphql/pagination/pagination.args';
import { B_ConvertHistoryConnection } from '../../../models/custom/pagination.connections.model';
import { B_CurrencyConvertHistory } from '../../../models/db/currency_convert_history.model';
import { B_CurrencyConvertHistoryFilter } from '../dto/filter.dto';
import { DB_QUERY_DEFAULT } from '../../../helpers/coreconstants';

@Injectable()
export class B_CurrencyConvertService {
  //backoffice
  async getConvertHistoryBackoffice(
    paginate: PaginationArgs,
    filter?: B_CurrencyConvertHistoryFilter,
    orderBy?: OrderBy,
  ): Promise<B_ConvertHistoryConnection> {
    try {
      return await findManyCursorConnection<
        B_CurrencyConvertHistory,
        Pick<Prisma.CurrencyConvertHistoryWhereUniqueInput, 'id'>
      >(
        (args) =>
          prisma_client.currencyConvertHistory.findMany({
            where: this.filterConvertHistoryBackoffice(filter),
            include: {
              user: true,
              from_currency: true,
              to_currency: true,
            },
            orderBy: [
              {
                [orderBy?.field || DB_QUERY_DEFAULT.ORDER_FIELD]:
                  orderBy?.direction || DB_QUERY_DEFAULT.ORDER_DIRECTION,
              },
            ],
            ...args,
          }),
        () =>
          prisma_client.currencyConvertHistory.count({
            where: this.filterConvertHistoryBackoffice(filter),
          }),
        paginate,
        pOptionsBigInt,
      );
    } catch (error) {
      processException(error);
    }
  }

  private filterConvertHistoryBackoffice(
    filter: B_CurrencyConvertHistoryFilter,
  ): Prisma.CurrencyConvertHistoryWhereInput {
    //
    const digit_query = !isNaN(Number(filter.query))
      ? Number(filter.query)
      : undefined;
    const where: Prisma.CurrencyConvertHistoryWhereInput = {
      status: filter?.status ?? undefined,
      convert_type: filter?.convert_type ?? undefined,
      wallet_type: filter?.wallet_type ?? undefined,
      OR: filter?.currency_code
        ? [
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
          ]
        : undefined,
    };

    if (filter?.query) {
      where.OR = [
        {
          uid: filter.query,
        },
        {
          price: digit_query,
        },
        {
          OR: [{ from_amount: digit_query }, { to_amount: digit_query }],
        },
        {
          OR: [
            {
              from_currency: {
                code: {
                  mode: 'insensitive',
                  equals: filter.query,
                },
              },
            },
            {
              to_currency: {
                code: {
                  mode: 'insensitive',
                  equals: filter.query,
                },
              },
            },
          ],
        },
        {
          user: {
            OR: [
              {
                usercode: filter.query,
              },
              {
                nickname: filter.query,
              },
            ],
          },
        },
      ];
    }
    return where;
  }

  //
}
