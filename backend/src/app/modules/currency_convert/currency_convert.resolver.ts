import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GqlAuthAndDeviceGuard } from '../../../libs/auth/gql.auth_device.guard';
import { UserEntity } from '../../../libs/decorators/user.decorator';
import { PaginationLimitOffsetArgs } from '../../../libs/graphql/pagination/pagination.args';
import { DB_QUERY_DEFAULT, STATUS_ACTIVE } from '../../helpers/coreconstants';
import { OrderBy } from '../../models/custom/common.input.model';
import { ResponseModel } from '../../models/custom/common.response.model';
import { F_CurrencyConvertHistoryConnection } from '../../models/custom/pagination.connections.model';
import { F_CurrencyModel } from '../../models/db/currency.model';
import { User } from '../../models/db/user.model';
import { CurrencyConvertService } from './currency_convert.service';
import {
  CurrencyForConvertFilter,
  F_CurrencyConvertHistoryFilter,
} from './dto/filter.dto';
import {
  LimitCurrencyConvertDto,
  MarketCurrencyQuoteDto,
} from './dto/input.dto';
import {
  ConvertPairData,
  CurrencyQuoteRes,
  LimitConvertChartDataRes,
} from './dto/response.dto';
import { CurrencyQuoteService } from './quote/quote.service';

@Resolver()
export class CurrencyConvertResolver {
  constructor(
    private readonly currencyConvertService: CurrencyConvertService,
    private readonly currencyQuoteService: CurrencyQuoteService,
  ) {}

  //Market currency convert
  @UseGuards(GqlAuthAndDeviceGuard())
  @Query(() => ConvertPairData)
  async q_f_convert_getMarketCurrencyDataByCode(
    @Args({ name: 'from_currency_code' }) from_currency_code: string,
    @Args({ name: 'to_currency_code' }) to_currency_code: string,
    @UserEntity() user: User,
  ): Promise<ConvertPairData> {
    return await this.currencyConvertService.getMarketCurrencyDataByCode(
      user,
      from_currency_code,
      to_currency_code,
    );
  }

  @UseGuards(GqlAuthAndDeviceGuard())
  @Query(() => [F_CurrencyModel], { nullable: true })
  async q_f_convert_getCurrencyListForMarketConvert(
    @Args({ nullable: true }) filter: CurrencyForConvertFilter,
    @Args({
      name: 'orderBy',
      type: () => OrderBy,
      nullable: true,
    })
    orderBy: OrderBy,
    @Args({ name: 'limit', nullable: true }) limit: number,
    @UserEntity() user: User,
  ): Promise<F_CurrencyModel[]> {
    filter.status = STATUS_ACTIVE;
    if (!orderBy) {
      orderBy = new OrderBy();
      orderBy.field = DB_QUERY_DEFAULT.ORDER_FIELD;
      orderBy.direction = DB_QUERY_DEFAULT.ORDER_DIRECTION;
    }
    return await this.currencyConvertService.getCurrencyListForMarketConvert(
      user,
      filter,
      orderBy,
      limit,
    );
  }

  @UseGuards(GqlAuthAndDeviceGuard())
  @Query(() => CurrencyQuoteRes)
  async q_f_convert_getCurrencyConvertQuote(
    @Args({ name: 'data' }) data: MarketCurrencyQuoteDto,
    @UserEntity() user: User,
  ): Promise<CurrencyQuoteRes> {
    return await this.currencyQuoteService.getCurrencyConvertQuote(user, data);
  }

  @UseGuards(GqlAuthAndDeviceGuard())
  @Mutation(() => ResponseModel)
  async m_f_convert_marketCurrencyConvert(
    @Args({ name: 'quote_id' }) quote_id: string,
  ): Promise<ResponseModel> {
    return await this.currencyConvertService.marketCurrencyConvert(quote_id);
  }

  // Limit currency convert
  @UseGuards(GqlAuthAndDeviceGuard())
  @Query(() => ConvertPairData)
  async q_f_convert_getValidCurrencyDataForLimitConvert(
    @Args({ name: 'from_currency_code' }) from_currency_code: string,
    @Args({ name: 'to_currency_code' }) to_currency_code: string,
    @UserEntity() user: User,
  ): Promise<ConvertPairData> {
    return await this.currencyConvertService.getValidCurrencyDataForLimitConvert(
      user,
      from_currency_code,
      to_currency_code,
    );
  }

  @UseGuards(GqlAuthAndDeviceGuard())
  @Query(() => [F_CurrencyModel], { nullable: true })
  async q_f_convert_getFromCurrencyListForLimitConvert(
    @Args({ nullable: true }) filter: CurrencyForConvertFilter,
    @Args({
      name: 'orderBy',
      type: () => OrderBy,
      nullable: true,
    })
    orderBy: OrderBy,
    @Args({ name: 'limit', nullable: true }) limit: number,
    @UserEntity() user: User,
  ): Promise<F_CurrencyModel[]> {
    filter.status = STATUS_ACTIVE;
    if (!orderBy) {
      orderBy = new OrderBy();
      orderBy.field = DB_QUERY_DEFAULT.ORDER_FIELD;
      orderBy.direction = DB_QUERY_DEFAULT.ORDER_DIRECTION;
    }
    return await this.currencyConvertService.getFromCurrencyListForLimitConvert(
      user,
      filter,
      orderBy,
      limit,
    );
  }

  @UseGuards(GqlAuthAndDeviceGuard())
  @Query(() => [F_CurrencyModel], { nullable: true })
  async q_f_convert_getToCurrencyListForLimitConvert(
    @Args({ name: 'from_currency_code', nullable: true })
    from_currency_code: string,
    @Args({ nullable: true }) filter: CurrencyForConvertFilter,
    @Args({
      name: 'orderBy',
      type: () => OrderBy,
      nullable: true,
    })
    orderBy: OrderBy,
    @Args({ name: 'limit', nullable: true }) limit: number,
  ): Promise<F_CurrencyModel[]> {
    return await this.currencyConvertService.getToCurrencyListForLimitConvert(
      from_currency_code,
      filter,
      orderBy,
      limit,
    );
  }

  @UseGuards(GqlAuthAndDeviceGuard())
  @Query(() => [LimitConvertChartDataRes])
  async q_f_convert_getChartDataForLimitConvert(
    @Args({ name: 'currency_pair' }) currency_pair: string,
    @Args({ name: 'days', nullable: true }) days?: number,
  ): Promise<LimitConvertChartDataRes[]> {
    return await this.currencyConvertService.getChartDataForLimitConvert(
      currency_pair,
      days,
    );
  }

  @UseGuards(GqlAuthAndDeviceGuard())
  @Mutation(() => ResponseModel)
  async m_f_convert_limitCurrencyConvert(
    @Args({ name: 'data' }) data: LimitCurrencyConvertDto,
    @UserEntity() user: User,
  ): Promise<ResponseModel> {
    return await this.currencyConvertService.limitCurrencyConvert(data, user);
  }

  @UseGuards(GqlAuthAndDeviceGuard())
  @Mutation(() => ResponseModel)
  async m_f_convert_cancelLimitCurrencyConvert(
    @Args({ name: 'convert_uid' }) convert_uid: string,
    @UserEntity() user: User,
  ): Promise<ResponseModel> {
    return await this.currencyConvertService.cancelLimitCurrencyConvert(
      convert_uid,
      user,
    );
  }

  // Currency convert history
  @UseGuards(GqlAuthAndDeviceGuard())
  @Query(() => F_CurrencyConvertHistoryConnection, { nullable: true })
  async q_f_convert_getConvertHistoryListPaginated(
    @Args() paginate: PaginationLimitOffsetArgs,
    @UserEntity() user: User,
    @Args({ nullable: true }) filter: F_CurrencyConvertHistoryFilter,
  ): Promise<F_CurrencyConvertHistoryConnection> {
    return await this.currencyConvertService.getConvertHistoryListPaginated(
      paginate,
      user,
      filter,
    );
  }
}
