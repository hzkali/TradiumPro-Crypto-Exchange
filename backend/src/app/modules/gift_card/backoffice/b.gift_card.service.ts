import { findManyCursorConnection } from '@devoxa/prisma-relay-cursor-connection';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import {
  pOptionsBigInt,
  pOptionsInt,
} from '../../../../libs/graphql/pagination/number_cursor';
import { PaginationArgs } from '../../../../libs/graphql/pagination/pagination.args';
import {
  DB_QUERY_DEFAULT,
  STATUS_ACTIVE,
  STATUS_INACTIVE,
} from '../../../helpers/coreconstants';
import {
  IgnoreUnique,
  __,
  deleteImage,
  errorResponse,
  prisma_client,
  processException,
  successResponse,
  uploadImage,
} from '../../../helpers/functions';
import { ResponseModel } from '../../../models/custom/common.response.model';
import {
  B_GiftCardCategoryConnection,
  B_GiftCardTemplateConnection,
  B_UserGiftCardConnection,
  B_UserGiftCardTransferHistoryConnection,
} from '../../../models/custom/pagination.connections.model';

import { B_GiftCardCategoryModel } from '../../../models/db/gift_card_category.model';

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

import { B_GiftCardTemplateModel } from '../../../models/db/gift_card_template.model';
import { B_UserGiftCardTransferHistoryModel } from '../../../models/db/user_gift_card_transfer_history.model';
import { OrderBy } from '../../../models/custom/common.input.model';
import { B_UserGiftCardModel } from '../../../models/db/user_gift_card.model';

@Injectable()
export class B_GiftCardService {
  // ======================== Gift card template ======================= //
  async getGiftCardCategories(
    filter?: GiftCardCategoryFilterArgs,
    limit?: number,
  ): Promise<B_GiftCardCategoryModel[]> {
    try {
      return await prisma_client.giftCardCategory.findMany({
        where: this.filterGiftCardCategory(filter),
        take: limit ?? undefined,
      });
    } catch (e) {
      processException(e);
    }
  }

  async getGiftCardCategoryListPaginate(
    paginate: PaginationArgs,
    filter: GiftCardCategoryFilterArgs,
  ): Promise<B_GiftCardCategoryConnection> {
    try {
      return await findManyCursorConnection<
        B_GiftCardCategoryModel,
        Pick<Prisma.GiftCardCategoryWhereUniqueInput, 'id'>
      >(
        (args) =>
          prisma_client.giftCardCategory.findMany({
            where: {
              ...this.filterGiftCardCategory(filter),
            },
            include: { _count: { select: { gift_card_templates: true } } },
            orderBy: [{ id: 'desc' }],
            ...args,
          }),
        () =>
          prisma_client.giftCardCategory.count({
            where: {
              ...this.filterGiftCardCategory(filter),
            },
          }),
        paginate,
        pOptionsInt,
      );
    } catch (e) {
      processException(e);
    }
  }

  filterGiftCardCategory(
    filter: GiftCardCategoryFilterArgs,
  ): Prisma.GiftCardCategoryWhereInput {
    const where: Prisma.GiftCardCategoryWhereInput = {
      name: filter?.query
        ? {
            mode: 'insensitive',
            contains: filter.query,
          }
        : undefined,
      status: filter?.status ?? undefined,
    };
    return where;
  }

  async createGiftCardCategory(
    data: GiftCardCategoryCreateInput,
  ): Promise<ResponseModel> {
    try {
      await prisma_client.giftCardCategory.create({
        data: {
          ...data,
        },
      });
      return successResponse(__('Created Successfully.'));
    } catch (e) {
      processException(e);
    }
  }

  async updateGiftCardCategory(
    data: GiftCardCategoryUpdateInput,
  ): Promise<ResponseModel> {
    try {
      const category = await prisma_client.giftCardCategory.findFirst({
        where: {
          uid: data.uid,
        },
      });

      if (!category) {
        throw new BadRequestException(
          errorResponse(__('Invalid gift card category!')),
        );
      }

      if (data.name !== category.name) {
        const response = await IgnoreUnique(
          data.name,
          'GiftCardCategory',
          'name',
          category.id,
        );

        if (!response.success) {
          throw new BadRequestException(
            errorResponse(__('This gift card category name already exist')),
          );
        }
      }

      await prisma_client.giftCardCategory.update({
        where: {
          id: category.id,
        },
        data: {
          ...data,
        },
      });
      return successResponse(__('Updated Successfully.'));
    } catch (e) {
      processException(e);
    }
  }

  async toggleGiftCardCategoryStatus(uid: string): Promise<ResponseModel> {
    try {
      const category = await prisma_client.giftCardCategory.findFirst({
        where: {
          uid: uid,
        },
        select: {
          id: true,
          status: true,
        },
      });

      if (!category) {
        throw new BadRequestException(
          errorResponse(__('Invalid gift card category!')),
        );
      }

      await prisma_client.giftCardCategory.update({
        where: {
          id: category.id,
        },
        data: {
          status:
            category.status == STATUS_ACTIVE ? STATUS_INACTIVE : STATUS_ACTIVE,
        },
      });
      return successResponse(__('Updated Successfully.'));
    } catch (e) {
      processException(e);
    }
  }

  async deleteGiftCardCategory(uid: string): Promise<ResponseModel> {
    try {
      const category = await prisma_client.giftCardCategory.findFirst({
        where: {
          uid: uid,
        },
        include: {
          gift_card_templates: true,
        },
      });

      if (!category) {
        throw new BadRequestException(
          errorResponse(__('Invalid gift card category!')),
        );
      }

      if (category.gift_card_templates.length > 0) {
        throw new BadRequestException(
          errorResponse(
            __("This category can't be deleted beacuse it is used in template"),
          ),
        );
      }

      await prisma_client.giftCardCategory.delete({
        where: {
          uid: uid,
        },
      });
      return successResponse(__('Deleted Successfully.'));
    } catch (e) {
      processException(e);
    }
  }

  //======================== Gift card template ==================== //

  async getGiftCardTemplates(
    filter?: GiftCardTemplateFilterArgs,
    limit?: number,
  ): Promise<B_GiftCardTemplateModel[]> {
    try {
      return await prisma_client.giftCardTemplate.findMany({
        where: this.filterGiftCardTemplate(filter),
        take: limit ?? undefined,
      });
    } catch (e) {
      processException(e);
    }
  }

  async getGiftCardTemplateListPaginate(
    paginate: PaginationArgs,
    filter: GiftCardTemplateFilterArgs,
  ): Promise<B_GiftCardTemplateConnection> {
    try {
      return await findManyCursorConnection<
        B_GiftCardTemplateModel,
        Pick<Prisma.GiftCardTemplateWhereUniqueInput, 'id'>
      >(
        (args) =>
          prisma_client.giftCardTemplate.findMany({
            where: {
              ...this.filterGiftCardTemplate(filter),
            },
            include: {
              category: true,
            },
            orderBy: [{ id: 'desc' }],
            ...args,
          }),
        () =>
          prisma_client.giftCardTemplate.count({
            where: {
              ...this.filterGiftCardTemplate(filter),
            },
          }),
        paginate,
        pOptionsInt,
      );
    } catch (e) {
      processException(e);
    }
  }

  filterGiftCardTemplate(
    filter: GiftCardTemplateFilterArgs,
  ): Prisma.GiftCardTemplateWhereInput {
    const where: Prisma.GiftCardTemplateWhereInput = {
      title: filter?.query
        ? {
            mode: 'insensitive',
            contains: filter.query,
          }
        : undefined,
      status: filter?.status ?? undefined,
      category: filter.category_uid
        ? {
            uid: filter.category_uid,
          }
        : undefined,
    };
    return where;
  }

  async createGiftCardTemplate(
    data: GiftCardTemplateCreateInput,
  ): Promise<ResponseModel> {
    try {
      const category = await prisma_client.giftCardCategory.findFirst({
        where: { uid: data.category_uid },
        select: { id: true, name: true, status: true },
      });

      if (!category) {
        throw new BadRequestException(errorResponse(__('Category not found')));
      }

      if (category.status != STATUS_ACTIVE) {
        throw new BadRequestException(errorResponse(__('Category Inactive')));
      }

      if (!data.image) {
        throw new BadRequestException(errorResponse(__('Image required')));
      }

      data.category_id = category.id;
      delete data.category_uid;

      const imageUrl = await uploadImage(
        data.image,
        `gift_card/templates/${category.name.toLowerCase()}`,
      );

      await prisma_client.giftCardTemplate.create({
        data: {
          ...data,
          image: imageUrl,
        },
      });
      return successResponse(__('Created Successfully.'));
    } catch (e) {
      processException(e);
    }
  }

  async updateGiftCardTemplate(
    payload: GiftCardTemplateUpdateInput,
  ): Promise<ResponseModel> {
    try {
      const template = await prisma_client.giftCardTemplate.findFirst({
        where: { uid: payload.uid },
        include: { category: { select: { uid: true, name: true } } },
      });

      if (!template) {
        throw new BadRequestException(
          errorResponse(__('Template not found! Invalid uid')),
        );
      }

      payload['category_id'] = template.category_id;

      if (template.category.uid != payload.category_uid) {
        const category = await prisma_client.giftCardCategory.findFirst({
          where: { uid: payload.category_uid },
          select: { id: true, name: true, status: true },
        });

        if (!category) {
          throw new BadRequestException(
            errorResponse(__('Category not found')),
          );
        }

        if (category.status != STATUS_ACTIVE) {
          throw new BadRequestException(errorResponse(__('Category Inactive')));
        }

        payload['category_id'] = category.id;
      }

      delete payload.category_uid;

      let imageUrl = template.image;

      if (payload.image) {
        imageUrl = await uploadImage(
          payload.image,
          `gift_card/templates/${template.category.name.toLowerCase()}`,
        );
        if (imageUrl) {
          await deleteImage(template.image);
        }
      }

      await prisma_client.giftCardTemplate.update({
        where: { id: template.id },
        data: {
          ...payload,
          image: imageUrl || undefined,
        },
      });
      return successResponse(__('Updated Successfully.'));
    } catch (e) {
      processException(e);
    }
  }

  async toggleGiftCardTemplateStatus(uid: string): Promise<ResponseModel> {
    try {
      const template = await prisma_client.giftCardTemplate.findFirst({
        where: {
          uid: uid,
        },
        select: {
          id: true,
          status: true,
        },
      });

      if (!template) {
        throw new BadRequestException(
          errorResponse(__('Invalid gift card template!')),
        );
      }

      await prisma_client.giftCardTemplate.update({
        where: {
          id: template.id,
        },
        data: {
          status:
            template.status == STATUS_ACTIVE ? STATUS_INACTIVE : STATUS_ACTIVE,
        },
      });
      return successResponse(__('Updated Successfully.'));
    } catch (e) {
      processException(e);
    }
  }

  async deleteGiftCardTemplate(uid: string): Promise<ResponseModel> {
    try {
      const template = await prisma_client.giftCardTemplate.findFirst({
        where: {
          uid: uid,
        },
        include: {
          user_gift_cards: true,
        },
      });

      if (!template) {
        throw new BadRequestException(
          errorResponse(__('Invalid gift card category!')),
        );
      }

      if (template.user_gift_cards.length > 0) {
        throw new BadRequestException(
          errorResponse(
            __(
              "This template can't be deleted beacuse it is used in user gift card",
            ),
          ),
        );
      }

      await prisma_client.giftCardTemplate.delete({
        where: {
          uid: uid,
        },
      });
      return successResponse(__('Deleted Successfully.'));
    } catch (e) {
      processException(e);
    }
  }

  // ========================= User gift card tranfer history ========================== //

  async getUserGiftCardListPaginate(
    paginate: PaginationArgs,
    filter?: B_UserGiftCardFilterArgs,
    orderBy?: OrderBy,
  ): Promise<B_UserGiftCardConnection> {
    try {
      return await findManyCursorConnection<
        B_UserGiftCardModel,
        Pick<Prisma.UserGiftCardWhereUniqueInput, 'id'>
      >(
        (args) =>
          prisma_client.userGiftCard.findMany({
            where: this.filterGiftCard(filter),
            include: {
              owner: true,
              creator: true,
              currency: true,
              template: {
                include: {
                  category: true,
                },
              },
            },
            orderBy: [
              {
                [orderBy?.field ?? DB_QUERY_DEFAULT.ORDER_FIELD]:
                  orderBy?.direction ?? DB_QUERY_DEFAULT.ORDER_DIRECTION,
              },
            ],
            ...args,
          }),
        () =>
          prisma_client.userGiftCard.count({
            where: this.filterGiftCard(filter),
          }),
        paginate,
        pOptionsBigInt,
      );
    } catch (e) {
      processException(e);
    }
  }

  filterGiftCard(
    filter?: B_UserGiftCardFilterArgs,
  ): Prisma.UserGiftCardWhereInput {
    const where: Prisma.UserGiftCardWhereInput = {
      OR: filter?.query
        ? [
            {
              uid: {
                contains: filter.query,
                mode: 'insensitive',
              },
            },
            {
              owner: {
                OR: [
                  {
                    usercode: {
                      contains: filter.query,
                      mode: 'insensitive',
                    },
                  },
                  {
                    nickname: {
                      contains: filter.query,
                      mode: 'insensitive',
                    },
                  },
                ],
              },
            },
            {
              creator: {
                OR: [
                  {
                    usercode: {
                      contains: filter.query,
                      mode: 'insensitive',
                    },
                  },
                  {
                    nickname: {
                      contains: filter.query,
                      mode: 'insensitive',
                    },
                  },
                ],
              },
            },
          ]
        : undefined,
      currency: filter?.currency_code
        ? {
            code: filter.currency_code,
          }
        : undefined,
      status: filter?.status ?? undefined,
    };

    return where;
  }

  async getGiftCardTransferHistoryPaginate(
    paginate: PaginationArgs,
    filter?: B_UserGiftCardTranferHistoryFilterArgs,
    orderBy?: OrderBy,
  ): Promise<B_UserGiftCardTransferHistoryConnection> {
    try {
      return await findManyCursorConnection<
        B_UserGiftCardTransferHistoryModel,
        Pick<Prisma.UserGiftCardTransferHistoryWhereUniqueInput, 'id'>
      >(
        (args) =>
          prisma_client.userGiftCardTransferHistory.findMany({
            where: {
              ...this.filterGiftCardTransferHistory(filter),
            },
            include: {
              from_user: true,
              to_user: true,
              currency: true,
              user_gift_card: {
                include: {
                  template: true,
                  creator: true,
                },
              },
            },
            orderBy: [
              {
                [orderBy?.field ?? DB_QUERY_DEFAULT.ORDER_FIELD]:
                  orderBy?.direction ?? DB_QUERY_DEFAULT.ORDER_DIRECTION,
              },
            ],
            ...args,
          }),
        () =>
          prisma_client.userGiftCardTransferHistory.count({
            where: {
              ...this.filterGiftCardTransferHistory(filter),
            },
          }),
        paginate,
        pOptionsBigInt,
      );
    } catch (e) {
      processException(e);
    }
  }

  filterGiftCardTransferHistory(
    filter?: B_UserGiftCardTranferHistoryFilterArgs,
  ): Prisma.UserGiftCardTransferHistoryWhereInput {
    const where: Prisma.UserGiftCardTransferHistoryWhereInput = {
      OR: filter?.query
        ? [
            {
              uid: {
                contains: filter.query,
                mode: 'insensitive',
              },
            },
            {
              from_user: {
                OR: [
                  {
                    usercode: {
                      contains: filter.query,
                      mode: 'insensitive',
                    },
                  },
                  {
                    nickname: {
                      contains: filter.query,
                      mode: 'insensitive',
                    },
                  },
                ],
              },
            },
            {
              to_user: {
                OR: [
                  {
                    usercode: {
                      contains: filter.query,
                      mode: 'insensitive',
                    },
                  },
                  {
                    nickname: {
                      contains: filter.query,
                      mode: 'insensitive',
                    },
                  },
                ],
              },
            },
          ]
        : undefined,
      user_gift_card:
        filter.currency_code || filter.query
          ? {
              currency: filter?.currency_code
                ? {
                    code: filter.currency_code,
                  }
                : undefined,
            }
          : undefined,
      status: filter?.status ?? undefined,
    };

    return where;
  }
}
