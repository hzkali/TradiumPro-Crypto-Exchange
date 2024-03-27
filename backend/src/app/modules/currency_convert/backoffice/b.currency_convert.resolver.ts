import { UseGuards } from '@nestjs/common';
import { Args, Query, Resolver } from '@nestjs/graphql';
import { GqlAuthGuard } from '../../../../libs/auth/gql.auth.guard';
import { PaginationArgs } from '../../../../libs/graphql/pagination/pagination.args';
import { RolePermissionGuard } from '../../../guards/role_permission.guard';
import { URL_KEY } from '../../../helpers/admin/permission_constant';
import { OrderBy } from '../../../models/custom/common.input.model';
import { B_ConvertHistoryConnection } from '../../../models/custom/pagination.connections.model';
import { B_CurrencyConvertHistoryFilter } from '../dto/filter.dto';
import { B_CurrencyConvertService } from './b.currency_convert.service';

@Resolver()
export class B_CurrencyConvertResolver {
  constructor(private readonly service: B_CurrencyConvertService) {}

  //backoffice
  @UseGuards(GqlAuthGuard('staff'))
  @UseGuards(new RolePermissionGuard(URL_KEY.CONVERT))
  @Query(() => B_ConvertHistoryConnection, { nullable: true })
  async q_b_convert_getConvertHistoryPaginated(
    @Args() paginate: PaginationArgs,
    @Args({ nullable: true }) filter: B_CurrencyConvertHistoryFilter,
    @Args({
      name: 'orderBy',
      type: () => OrderBy,
      nullable: true,
    })
    orderBy: OrderBy,
  ): Promise<B_ConvertHistoryConnection> {
    return await this.service.getConvertHistoryBackoffice(
      paginate,
      filter,
      orderBy,
    );
  }
  //
}
