import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GqlAuthGuard } from '../../../../libs/auth/gql.auth.guard';
import { PaginationArgs } from '../../../../libs/graphql/pagination/pagination.args';
import { RolePermissionGuard } from '../../../guards/role_permission.guard';
import { URL_KEY } from '../../../helpers/admin/permission_constant';
import { ResponseModel } from '../../../models/custom/common.response.model';
import {
  B_GiftCardCategoryConnection,
  B_GiftCardTemplateConnection,
  B_UserGiftCardConnection,
  B_UserGiftCardTransferHistoryConnection,
} from '../../../models/custom/pagination.connections.model';

import {
  B_UserGiftCardFilterArgs,
  B_UserGiftCardTranferHistoryFilterArgs,
  GiftCardCategoryFilterArgs,
  GiftCardTemplateFilterArgs,
} from '../dto/filter.dto';

import {
  GiftCardCategoryCreateInput,
  GiftCardCategoryUpdateInput,
  GiftCardTemplateCreateInput,
  GiftCardTemplateUpdateInput,
} from '../dto/input.dto';

import { B_GiftCardService } from './b.gift_card.service';
import { B_GiftCardCategoryModel } from '../../../models/db/gift_card_category.model';
import { B_GiftCardTemplateModel } from '../../../models/db/gift_card_template.model';
import { B_UserGiftCardTransferHistoryModel } from '../../../models/db/user_gift_card_transfer_history.model';
import { OrderBy } from '../../../models/custom/common.input.model';

@Resolver()
export class B_GiftCardResolver {
  constructor(private service: B_GiftCardService) {}

  // ========================= Gift card Category ===============================//

  @UseGuards(new RolePermissionGuard(URL_KEY.GIFT_CARD))
  @UseGuards(GqlAuthGuard('staff'))
  @Query(() => [B_GiftCardCategoryModel])
  async q_b_giftCard_getGiftCardCategorylist(
    @Args({ nullable: true }) filter: GiftCardCategoryFilterArgs,
    @Args('limit', { nullable: true }) limit: number,
  ): Promise<B_GiftCardCategoryModel[]> {
    return await this.service.getGiftCardCategories(filter, limit);
  }

  @UseGuards(new RolePermissionGuard(URL_KEY.GIFT_CARD))
  @UseGuards(GqlAuthGuard('staff'))
  @Query(() => B_GiftCardCategoryConnection)
  async q_b_giftCard_getGiftCardCategorylistPaginate(
    @Args() paginate: PaginationArgs,
    @Args({ nullable: true }) filter: GiftCardCategoryFilterArgs,
  ): Promise<B_GiftCardCategoryConnection> {
    return await this.service.getGiftCardCategoryListPaginate(paginate, filter);
  }

  @UseGuards(new RolePermissionGuard(URL_KEY.GIFT_CARD))
  @UseGuards(GqlAuthGuard('staff'))
  @Mutation(() => ResponseModel)
  async m_b_giftCard_createGiftCardCategory(
    @Args('data') data: GiftCardCategoryCreateInput,
  ): Promise<ResponseModel> {
    return await this.service.createGiftCardCategory(data);
  }

  @UseGuards(new RolePermissionGuard(URL_KEY.GIFT_CARD))
  @UseGuards(GqlAuthGuard('staff'))
  @Mutation(() => ResponseModel)
  async m_b_giftCard_updateGiftCardCategory(
    @Args('data') data: GiftCardCategoryUpdateInput,
  ): Promise<ResponseModel> {
    return await this.service.updateGiftCardCategory(data);
  }

  @UseGuards(GqlAuthGuard('staff'))
  @UseGuards(new RolePermissionGuard(URL_KEY.GIFT_CARD))
  @Mutation(() => ResponseModel)
  async m_b_giftCard_toggleGiftCardCategoryStatus(
    @Args('uid') uid: string,
  ): Promise<ResponseModel> {
    return await this.service.toggleGiftCardCategoryStatus(uid);
  }

  @UseGuards(new RolePermissionGuard(URL_KEY.GIFT_CARD))
  @UseGuards(GqlAuthGuard('staff'))
  @Mutation(() => ResponseModel)
  async m_b_giftCard_deleteGiftCardCategory(
    @Args('uid') uid: string,
  ): Promise<ResponseModel> {
    return await this.service.deleteGiftCardCategory(uid);
  }
  //

  // ========================= Gift card template ===============================//

  @UseGuards(new RolePermissionGuard(URL_KEY.GIFT_CARD))
  @UseGuards(GqlAuthGuard('staff'))
  @Query(() => [B_GiftCardTemplateModel])
  async q_b_giftCard_getGiftCardTemplatelist(
    @Args({ nullable: true }) filter: GiftCardTemplateFilterArgs,
    @Args('limit', { nullable: true }) limit: number,
  ): Promise<B_GiftCardTemplateModel[]> {
    return await this.service.getGiftCardTemplates(filter, limit);
  }

  @UseGuards(new RolePermissionGuard(URL_KEY.GIFT_CARD))
  @UseGuards(GqlAuthGuard('staff'))
  @Query(() => B_GiftCardTemplateConnection)
  async q_b_giftCard_getGiftCardTemplatelistPaginate(
    @Args() paginate: PaginationArgs,
    @Args({ nullable: true }) filter: GiftCardTemplateFilterArgs,
  ): Promise<B_GiftCardTemplateConnection> {
    return await this.service.getGiftCardTemplateListPaginate(paginate, filter);
  }

  @UseGuards(new RolePermissionGuard(URL_KEY.GIFT_CARD))
  @UseGuards(GqlAuthGuard('staff'))
  @Mutation(() => ResponseModel)
  async m_b_giftCard_createGiftCardTemplate(
    @Args('data') data: GiftCardTemplateCreateInput,
  ): Promise<ResponseModel> {
    return await this.service.createGiftCardTemplate(data);
  }

  @UseGuards(new RolePermissionGuard(URL_KEY.GIFT_CARD))
  @UseGuards(GqlAuthGuard('staff'))
  @Mutation(() => ResponseModel)
  async m_b_giftCard_updateGiftCardTemplate(
    @Args('data') data: GiftCardTemplateUpdateInput,
  ): Promise<ResponseModel> {
    return await this.service.updateGiftCardTemplate(data);
  }

  @UseGuards(GqlAuthGuard('staff'))
  @UseGuards(new RolePermissionGuard(URL_KEY.GIFT_CARD))
  @Mutation(() => ResponseModel)
  async m_b_giftCard_toggleGiftCardTemplateStatus(
    @Args('uid') uid: string,
  ): Promise<ResponseModel> {
    return await this.service.toggleGiftCardTemplateStatus(uid);
  }

  @UseGuards(new RolePermissionGuard(URL_KEY.GIFT_CARD))
  @UseGuards(GqlAuthGuard('staff'))
  @Mutation(() => ResponseModel)
  async m_b_giftCard_deleteGiftCardTemplate(
    @Args('uid') uid: string,
  ): Promise<ResponseModel> {
    return await this.service.deleteGiftCardTemplate(uid);
  }

  @UseGuards(new RolePermissionGuard(URL_KEY.GIFT_CARD))
  @UseGuards(GqlAuthGuard('staff'))
  @Query(() => B_UserGiftCardConnection)
  async q_b_giftCard_getUserGiftCardListPaginate(
    @Args() paginate: PaginationArgs,
    @Args({ nullable: true }) filter: B_UserGiftCardFilterArgs,
    @Args({
      name: 'orderBy',
      type: () => OrderBy,
      nullable: true,
    })
    orderBy: OrderBy,
  ): Promise<B_UserGiftCardConnection> {
    return await this.service.getUserGiftCardListPaginate(
      paginate,
      filter,
      orderBy,
    );
  }

  @UseGuards(new RolePermissionGuard(URL_KEY.GIFT_CARD))
  @UseGuards(GqlAuthGuard('staff'))
  @Query(() => B_UserGiftCardTransferHistoryConnection)
  async q_b_giftCard_getGiftCardTransferHistoryPaginate(
    @Args() paginate: PaginationArgs,
    @Args({ nullable: true }) filter: B_UserGiftCardTranferHistoryFilterArgs,
    @Args({
      name: 'orderBy',
      type: () => OrderBy,
      nullable: true,
    })
    orderBy: OrderBy,
  ): Promise<B_UserGiftCardTransferHistoryConnection> {
    return await this.service.getGiftCardTransferHistoryPaginate(
      paginate,
      filter,
      orderBy,
    );
  }
}
