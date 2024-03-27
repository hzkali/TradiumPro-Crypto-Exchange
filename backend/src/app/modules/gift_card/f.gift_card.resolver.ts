import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { UseGuards } from '@nestjs/common';
import { GqlAuthAndDeviceGuard } from '../../../libs/auth/gql.auth_device.guard';
import { UserEntity } from '../../../libs/decorators/user.decorator';
import { PaginationLimitOffsetArgs } from '../../../libs/graphql/pagination/pagination.args';
import { STATUS_ACTIVE } from '../../helpers/coreconstants';
import { CodeVerifyInputs } from '../../models/custom/common.input.model';
import { ResponseModel } from '../../models/custom/common.response.model';
import {
  F_GiftCardTemplateConnection,
  F_UserGiftCardConnection,
  F_UserGiftCardTransferHistoryConnection,
} from '../../models/custom/pagination.connections.model';
import { F_GiftCardCategoryModel } from '../../models/db/gift_card_category.model';
import { F_GiftCardTemplateModel } from '../../models/db/gift_card_template.model';
import { User } from '../../models/db/user.model';
import {
  F_UserGiftCardTranferHistoryFilterArgs,
  GiftCardTemplateFilterArgs,
  UserGiftCardFilterArgs,
} from './dto/filter.dto';
import {
  CreateOrSendUserGiftCardInput,
  RecipientUserCredentialInput,
} from './dto/input.dto';
import { GiftCardService } from './gift_card.service';

@Resolver()
export class F_GiftCardResolver {
  constructor(private service: GiftCardService) {}

  // Gift card category
  @Query(() => [F_GiftCardCategoryModel])
  async q_f_giftCard_getGiftCardCategories(
    @Args('limit', { nullable: true }) limit: number,
    @Args('query', { nullable: true }) query: string,
  ): Promise<F_GiftCardCategoryModel[]> {
    return await this.service.getGiftCardCategories(
      {
        status: STATUS_ACTIVE,
        OR: query
          ? [{ name: { mode: 'insensitive', contains: query } }]
          : undefined,
      },
      limit,
    );
  }

  // =============== Gift card template ================== //

  @Query(() => F_GiftCardTemplateConnection)
  async q_f_giftCard_getGiftCardTemplateListPaginate(
    @Args() paginate: PaginationLimitOffsetArgs,
    @Args({ nullable: true }) filter: GiftCardTemplateFilterArgs,
  ): Promise<F_GiftCardTemplateConnection> {
    return await this.service.getGiftCardTemplateListPaginate(paginate, filter);
  }

  @Query(() => F_GiftCardTemplateModel)
  async q_f_giftCard_getGiftCardTemplateDetails(
    @Args('uid') uid: string,
  ): Promise<F_GiftCardTemplateModel> {
    return await this.service.getGiftCardTemplateDetails(uid);
  }

  // ================== User gift card ==================== //

  @UseGuards(GqlAuthAndDeviceGuard())
  @Query(() => F_UserGiftCardConnection)
  async q_f_giftCard_userGiftCardListPaginate(
    @Args() paginate: PaginationLimitOffsetArgs,
    @Args({ nullable: true }) filter: UserGiftCardFilterArgs,
    @UserEntity() user: User,
  ): Promise<F_UserGiftCardConnection> {
    return await this.service.userGiftCardListPaginate(user, paginate, filter);
  }

  @UseGuards(GqlAuthAndDeviceGuard())
  @Query(() => F_UserGiftCardTransferHistoryConnection)
  async q_f_giftCard_giftCardTransferHistoryListPaginate(
    @Args() paginate: PaginationLimitOffsetArgs,
    @Args({ nullable: true }) filter: F_UserGiftCardTranferHistoryFilterArgs,
    @UserEntity() user: User,
  ): Promise<F_UserGiftCardTransferHistoryConnection> {
    return await this.service.giftCardTransferHistoryListPaginate(
      user,
      paginate,
      filter,
    );
  }

  @UseGuards(GqlAuthAndDeviceGuard())
  @Mutation(() => ResponseModel)
  async m_f_giftCard_createOrSendUserGiftCard(
    @UserEntity() user: User,
    @Args({ name: 'data' }) data: CreateOrSendUserGiftCardInput,
    @Args({ name: 'code_verify_input', nullable: true })
    code_verify_input: CodeVerifyInputs,
  ): Promise<ResponseModel> {
    return await this.service.createOrSendUserGiftCard(
      user,
      data,
      code_verify_input,
    );
  }

  @UseGuards(GqlAuthAndDeviceGuard())
  @Mutation(() => ResponseModel)
  async m_f_giftCard_sendGiftCard(
    @UserEntity() user: User,
    @Args({ name: 'uid' }) uid: string,
    @Args({ name: 'recipient_user_credential' })
    recipient_user_credential: RecipientUserCredentialInput,
    @Args({ name: 'code_verify_input' })
    code_verify_input: CodeVerifyInputs,
    @Args({ name: 'note', nullable: true }) note?: string,
  ): Promise<ResponseModel> {
    return await this.service.sendGiftCard(
      user,
      uid,
      recipient_user_credential,
      code_verify_input,
      note,
    );
  }

  @UseGuards(GqlAuthAndDeviceGuard())
  @Mutation(() => ResponseModel)
  async m_f_giftCard_redeemGiftCard(
    @UserEntity() user: User,
    @Args({ name: 'uid' }) uid: string,
  ): Promise<ResponseModel> {
    return await this.service.redeemGiftCard(user, uid);
  }
}
