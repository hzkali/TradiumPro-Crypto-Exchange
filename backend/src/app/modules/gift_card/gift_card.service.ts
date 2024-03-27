import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma, PrismaClient, UserGiftCard } from '@prisma/client';

import {
  __,
  addNumbers,
  app,
  calculateAmountAndFee,
  errorResponse,
  getDateXDaysAgo,
  getSettings,
  multiplyNumbers,
  prisma_client,
  processException,
  sendNotificationWithBalanceSub,
  sendToasterErrMsg,
  successResponse,
} from '../../helpers/functions';

import { PaginationLimitOffsetArgs } from '../../../libs/graphql/pagination/pagination.args';
import {
  F_GiftCardTemplateConnection,
  F_UserGiftCardConnection,
  F_UserGiftCardTransferHistoryConnection,
} from '../../models/custom/pagination.connections.model';
import { F_GiftCardCategoryModel } from '../../models/db/gift_card_category.model';
import { F_GiftCardTemplateModel } from '../../models/db/gift_card_template.model';
import {
  F_UserGiftCardTranferHistoryFilterArgs,
  GiftCardTemplateFilterArgs,
  UserGiftCardFilterArgs,
} from './dto/filter.dto';

import { Decimal } from '@prisma/client/runtime';
import { maxLength } from 'class-validator';
import { findManyOffsetLimitConnection } from '../../../libs/graphql/pagination/paginationLimitOffset';
import { LOG_LEVEL_ERROR, MyLogger } from '../../../libs/log/log.service';
import { BalanceUpdateService } from '../../core.services/balance_update.sevice';
import {
  CURRENCY_TYPE,
  EVENT_MODEL,
  GIFT_CARD_STATUS,
  LOG_FILES,
  WALLET_ACTIVITY_DESCRIPTION,
  WALLET_ACTIVITY_TITLE,
  WALLET_ACTIVITY_TX_TYPE,
} from '../../helpers/coreconstants';
import { USER_NOTIFICATIONS } from '../../helpers/notification_constants';
import { SETTINGS_SLUG } from '../../helpers/slugconstants';
import { AmountCalculationRes } from '../../helpers/types';
import { CodeVerifyInputs } from '../../models/custom/common.input.model';
import { ResponseModel } from '../../models/custom/common.response.model';
import { User } from '../../models/db/user.model';
import { F_UserGiftCardModel } from '../../models/db/user_gift_card.model';
import { F_UserGiftCardTransferHistoryModel } from '../../models/db/user_gift_card_transfer_history.model';
import { BalanceDebitQueue } from '../../queues/balance_debit.queue';
import { GiftCardRedeemQueue } from '../../queues/gift_card_redeem.queue';
import { WalletService } from '../wallet/wallet.service';
import {
  CreateOrSendUserGiftCardInput,
  RecipientUserCredentialInput,
} from './dto/input.dto';
import { GiftCardQueueData, GiftCardRedeemQueueData } from './dto/response.dto';
import { GiftCardValidationService } from './gift_card.validation';
@Injectable()
export class GiftCardService {
  private logger: MyLogger;
  constructor(private readonly validationService: GiftCardValidationService) {
    this.logger = new MyLogger(LOG_FILES.GIFT_CARD);
  }

  async getGiftCardCategories(
    where?: Prisma.GiftCardCategoryWhereInput,
    limit?: number,
  ): Promise<F_GiftCardCategoryModel[]> {
    try {
      const categories = await prisma_client.giftCardCategory.findMany({
        where: where ?? undefined,
        include: {
          gift_card_templates: true,
        },
        take: limit ?? undefined,
      });

      categories.forEach((category) => {
        category['template_count'] = category.gift_card_templates.length;
      });

      return categories;
    } catch (e) {
      processException(e);
    }
  }

  async getGiftCardTemplateList(
    where?: Prisma.GiftCardTemplateWhereInput,
    limit?: number,
  ): Promise<F_GiftCardTemplateModel[]> {
    try {
      return await prisma_client.giftCardTemplate.findMany({
        where: where ?? undefined,
        take: limit ?? undefined,
      });
    } catch (e) {
      processException(e);
    }
  }

  async getGiftCardTemplateListPaginate(
    paginate: PaginationLimitOffsetArgs,
    filter: GiftCardTemplateFilterArgs,
  ): Promise<F_GiftCardTemplateConnection> {
    try {
      return await findManyOffsetLimitConnection<F_GiftCardTemplateModel>(
        paginate.limit,
        paginate.offset,
        () =>
          prisma_client.giftCardTemplate.findMany({
            where: {
              ...this.filterGiftCardTemplate(filter),
            },
            include: {
              category: true,
            },
            orderBy: [{ id: 'desc' }],
            skip: paginate.offset ?? undefined,
            take: paginate.limit ?? undefined,
          }),
        () =>
          prisma_client.giftCardTemplate.count({
            where: {
              ...this.filterGiftCardTemplate(filter),
            },
          }),
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

  async getGiftCardTemplateDetails(
    uid: string,
  ): Promise<F_GiftCardTemplateModel> {
    try {
      const template = await prisma_client.giftCardTemplate.findFirst({
        where: {
          uid: uid,
        },
        include: {
          category: true,
        },
      });

      if (!template) {
        throw new BadRequestException(
          errorResponse(__('Invalid template uid!')),
        );
      }

      return template;
    } catch (error) {
      processException(error);
    }
  }

  async userGiftCardListPaginate(
    owner: User,
    paginate: PaginationLimitOffsetArgs,
    filter: UserGiftCardFilterArgs,
  ): Promise<F_UserGiftCardConnection> {
    try {
      return await findManyOffsetLimitConnection<F_UserGiftCardModel>(
        paginate.limit,
        paginate.offset,
        () =>
          prisma_client.userGiftCard.findMany({
            where: {
              ...this.filterUserGiftCard(filter, owner.id),
            },
            include: {
              currency: {
                include: {
                  wallets: {
                    where: {
                      user_id: owner.id,
                    },
                  },
                },
              },
              template: {
                include: {
                  category: true,
                },
              },
            },
            orderBy: [{ updated_at: 'desc' }],
            skip: paginate.offset ?? undefined,
            take: paginate.limit ?? undefined,
          }),
        () =>
          prisma_client.userGiftCard.count({
            where: {
              ...this.filterUserGiftCard(filter, owner.id),
            },
          }),
      );
    } catch (e) {
      processException(e);
    }
  }

  filterUserGiftCard(
    filter?: UserGiftCardFilterArgs,
    ower_id?: bigint,
  ): Prisma.UserGiftCardWhereInput {
    const where: Prisma.UserGiftCardWhereInput = {
      quantity: {
        gt: 0,
      },
      owner_id: ower_id ?? undefined,
      status: GIFT_CARD_STATUS.ACTIVE,
      template:
        filter?.category_uid || filter?.query
          ? {
              category: filter?.category_uid
                ? {
                    uid: filter.category_uid,
                  }
                : undefined,

              OR: filter?.query
                ? [
                    {
                      title: filter?.query
                        ? {
                            contains: filter.query,
                            mode: 'insensitive',
                          }
                        : undefined,
                    },
                    {
                      description: filter?.query
                        ? {
                            contains: filter.query,
                            mode: 'insensitive',
                          }
                        : undefined,
                    },
                  ]
                : undefined,
            }
          : undefined,
    };
    return where;
  }

  async giftCardTransferHistoryListPaginate(
    owner: User,
    paginate: PaginationLimitOffsetArgs,
    filter: F_UserGiftCardTranferHistoryFilterArgs,
  ): Promise<F_UserGiftCardTransferHistoryConnection> {
    try {
      return await findManyOffsetLimitConnection<F_UserGiftCardTransferHistoryModel>(
        paginate.limit,
        paginate.offset,
        () =>
          prisma_client.userGiftCardTransferHistory.findMany({
            where: {
              ...this.filterGiftCardTransferHistory(filter, owner.id),
            },
            include: {
              user_gift_card: {
                include: {
                  template: {
                    include: {
                      category: true,
                    },
                  },
                },
              },
              from_user: true,
              to_user: true,
              currency: true,
            },
            orderBy: [{ updated_at: 'desc' }],
            skip: paginate.offset ?? undefined,
            take: paginate.limit ?? undefined,
          }),
        () =>
          prisma_client.userGiftCardTransferHistory.count({
            where: {
              ...this.filterGiftCardTransferHistory(filter, owner.id),
            },
          }),
      );
    } catch (e) {
      processException(e);
    }
  }

  filterGiftCardTransferHistory(
    filter?: F_UserGiftCardTranferHistoryFilterArgs,
    owner_id?: bigint,
  ): Prisma.UserGiftCardTransferHistoryWhereInput {
    const where: Prisma.UserGiftCardTransferHistoryWhereInput = {
      OR: [{ from_user_id: owner_id }, { to_user_id: owner_id }],
      uid: filter?.query
        ? {
            contains: filter.query,
            mode: 'insensitive',
          }
        : undefined,
      currency: filter.currency_code
        ? {
            code: filter.currency_code,
          }
        : undefined,
      status: filter?.status ?? undefined,
    };

    if (filter?.time) {
      if (filter?.time.days) {
        where.created_at = {
          gt: getDateXDaysAgo(filter?.time.days),
        };
      } else if (filter?.time.date) {
        where.created_at = {
          gte: filter?.time.date.start_date,
          lte: filter?.time.date.end_date,
        };
      }
    }

    return where;
  }

  // Create or send user gift card
  async createOrSendUserGiftCard(
    user: User,
    data: CreateOrSendUserGiftCardInput,
    code_verify_input?: CodeVerifyInputs,
  ): Promise<ResponseModel> {
    try {
      const { quantity, note, wallet_type } = data;
      const { currency_id, template_id, recipient } =
        await this.validationService.validateCreateOrSendGiftCard(
          user,
          data,
          code_verify_input,
        );

      const user_gift_card = await this.createGiftCard({
        wallet_type: wallet_type,
        creator_id: user.id,
        owner_id: recipient ? recipient.id : user.id,
        template_id,
        currency_id,
        amount: new Decimal(data.amount),
        quantity: quantity ?? 1,
        status: GIFT_CARD_STATUS.PENDING,
      });

      const is_send = user_gift_card.creator_id != user_gift_card.owner_id;

      await app
        .get(BalanceDebitQueue)
        .processGiftCardCreateOrSendJob({ uid: user_gift_card.uid, note });

      if (is_send) {
        return successResponse(__('Gift card send in progress!'));
      }
      return successResponse(__('Gift card create in progress!'));
    } catch (error) {
      processException(error);
    }
  }

  // Cift card create or send process job called from balance debit queue
  async processGiftCardCreateOrSendJob(data: GiftCardQueueData) {
    // find user gift card
    let owner_id: bigint;
    let is_send = false;
    try {
      const { uid, note } = data;
      const gift_card = await this.validationService.findUserGiftCard(
        {
          uid: uid,
          status: GIFT_CARD_STATUS.PENDING,
        },
        {
          creator: true,
          owner: true,
          currency: true,
        },
      );
      if (!gift_card) {
        throw new Error(`Invalid gift card uid: ${uid}`);
      }

      owner_id = gift_card.owner_id;

      is_send = gift_card.creator_id !== gift_card.owner_id;

      const {
        quantity,
        amount,
        wallet_type,
        creator_id,
        currency_id,
        currency,
      } = gift_card;

      const total_quantity_amount = multiplyNumbers(quantity, Number(amount));
      let total_balance = total_quantity_amount;

      let amount_n_fee: AmountCalculationRes;

      if (is_send) {
        if (quantity != 1) {
          throw new Error('Quantity must be one for sending gift card!');
        }
        const currencyDecimal = await this.getCurrencyDecimal(
          currency?.type,
          currency?.decimal,
        );
        amount_n_fee = calculateAmountAndFee(
          total_quantity_amount,
          currency.gift_card_fee_type,
          currency.gift_card_fee,
          currencyDecimal,
        );
        total_balance = addNumbers(
          total_balance,
          Number(amount_n_fee.fee_amount),
        );
      }

      // validate wallet, wallet balance and wallet activity
      const walletService = app.get(WalletService);
      const vld_wallet_balance = await walletService.validateWalletBalance(
        creator_id,
        currency_id,
        wallet_type,
        total_balance,
        null,
        true,
      );

      if (!vld_wallet_balance.success)
        throw new Error(vld_wallet_balance.message);

      const { wallet } = vld_wallet_balance;

      const wallet_mismatch_res =
        await walletService.checkWalletActivityMismatch(wallet_type, wallet);
      if (!wallet_mismatch_res.success) {
        throw new Error(wallet_mismatch_res.message);
      }

      // Debit balance, active gift card and add transaction history
      const balanceUpdateService = new BalanceUpdateService(this.logger);
      await prisma_client.$transaction(async (prisma) => {
        // for gift card create
        await balanceUpdateService.userWalletBalanceUpdate(
          {
            related_model: EVENT_MODEL.USER_GIFT_CARD,
            model_id: String(gift_card.id),
            wallet_type: wallet_type,
            tx_type: WALLET_ACTIVITY_TX_TYPE.DEBIT,
            amount: new Decimal(total_quantity_amount),
            wallet_id: BigInt(wallet.id),
            user_id: BigInt(creator_id),
            activity_title: WALLET_ACTIVITY_TITLE.GIFT_CARD_CREATED,
            description:
              WALLET_ACTIVITY_DESCRIPTION.GIFT_CARD_CREATE_BALANCE_DEBIT,
          },
          true,
          prisma,
        );

        // for gift card transfer
        if (is_send && amount_n_fee && Number(amount_n_fee.fee_amount) > 0) {
          await balanceUpdateService.userWalletBalanceUpdate(
            {
              related_model: EVENT_MODEL.GIFT_CARD_TRANSFER,
              model_id: String(gift_card.id),
              wallet_type: wallet_type,
              tx_type: WALLET_ACTIVITY_TX_TYPE.DEBIT,
              amount: new Decimal(amount_n_fee.fee_amount),
              wallet_id: BigInt(wallet.id),
              user_id: BigInt(creator_id),
              activity_title: WALLET_ACTIVITY_TITLE.GIFT_CARD_SENT,
              description:
                WALLET_ACTIVITY_DESCRIPTION.GIFT_CARD_SEND_BALANCE_DEBIT,
            },
            true,
            prisma,
          );
        }

        await prisma.userGiftCard.update({
          where: {
            id: gift_card.id,
          },
          data: {
            status: GIFT_CARD_STATUS.ACTIVE,
          },
        });

        if (gift_card.owner_id != gift_card.creator_id && amount_n_fee) {
          await this.createGiftCardTransferHistory(
            gift_card,
            amount_n_fee,
            gift_card.creator_id,
            gift_card.owner_id,
            note,
            prisma,
          );
        }
      });

      // Send notification to creator and recipient
      const amount_txt = `${gift_card.amount} ${gift_card.currency.code}`;

      if (gift_card.owner_id != gift_card.creator_id) {
        await this.sendNotification(
          USER_NOTIFICATIONS.GIFT_CARD_SENT,
          gift_card.creator,
          amount_txt,
        );
        await this.sendNotification(
          USER_NOTIFICATIONS.GIFT_CARD_RECEIVED,
          gift_card.owner,
          amount_txt,
        );
      } else {
        await this.sendNotification(
          USER_NOTIFICATIONS.GIFT_CARD_CREATED,
          gift_card.creator,
          amount_txt,
        );
      }
    } catch (error) {
      this.logger.write(error.stack, LOG_LEVEL_ERROR);
      if (owner_id) {
        sendToasterErrMsg({
          user_id: owner_id,
          msg: is_send
            ? __('Gift card send failed!')
            : __('Gift card create failed!'),
        });
      }

      throw new Error(error.message);
    }
  }

  // Send user gift card
  async sendGiftCard(
    user: User,
    uid: string,
    recipient_user_credential: RecipientUserCredentialInput,
    code_verify_input: CodeVerifyInputs,
    note?: string,
  ): Promise<ResponseModel> {
    try {
      // find and validate user gift card
      const gift_card = await this.validationService.findUserGiftCard(
        {
          uid: uid,
          status: GIFT_CARD_STATUS.ACTIVE,
          quantity: {
            gt: 0,
          },
        },
        {
          currency: {
            select: {
              code: true,
              type: true,
              decimal: true,
              gift_card_fee_type: true,
              gift_card_fee: true,
            },
          },
        },
      );

      if (!gift_card) {
        throw new BadRequestException(errorResponse(__('Invalid gift card!')));
      }
      if (gift_card.owner_id != user.id) {
        throw new BadRequestException(
          errorResponse(__('You are not the owner of this gift card!')),
        );
      }

      if (note && !maxLength(note, 500)) {
        throw new BadRequestException(
          errorResponse(__('Note length must be less or equal 500')),
        );
      }

      const { amount, currency } = gift_card;

      const currencyDecimal = await this.getCurrencyDecimal(
        currency?.type,
        currency?.decimal,
      );

      const amount_n_fee = calculateAmountAndFee(
        amount,
        currency.gift_card_fee_type,
        Number(currency.gift_card_fee),
        currencyDecimal,
      );

      try {
        const walletService = app.get(WalletService);
        const vld_wallet_balance = await walletService.validateWalletBalance(
          gift_card.creator_id,
          gift_card.currency_id,
          gift_card.wallet_type,
          amount_n_fee.fee_amount,
          null,
          true,
        );
        if (!vld_wallet_balance.success)
          throw new BadRequestException(__('Insufficient fee balance!'));
      } catch (error) {
        throw new BadRequestException(errorResponse(error.message));
      }

      // validate send gift card and find recipient user
      await this.validationService.validateSendGiftCard(
        user,
        recipient_user_credential,
        code_verify_input,
      );

      await app.get(BalanceDebitQueue).processGiftCardSendJob({
        uid: gift_card.uid,
        recipient_user_credential,
        note,
      });

      return successResponse(__('Gift card sending in progress!'));
    } catch (error) {
      processException(error);
    }
  }

  async processGiftCardSendJob(data: GiftCardQueueData) {
    let owner_id: bigint;
    try {
      const { uid, recipient_user_credential, note } = data;
      // find and validate user gift card
      const gift_card = await this.validationService.findUserGiftCard(
        {
          uid: uid,
          status: GIFT_CARD_STATUS.ACTIVE,
          quantity: {
            gt: 0,
          },
        },
        {
          creator: true,
          owner: true,
          currency: true,
        },
      );

      if (!gift_card) {
        throw new Error('Invalid gift card!');
      }

      owner_id = gift_card.owner_id;

      const { amount, currency } = gift_card;

      const recipient = await this.validationService.checkRecipentAvailablity(
        recipient_user_credential,
      );

      if (BigInt(owner_id) === BigInt(recipient.id)) {
        this.logger.write(
          `Self transfer initiated. Gift uid: ${gift_card.uid} 
           Owner code: ${gift_card.owner.usercode}, 
           Recipient code: ${recipient.usercode}, 
           `,
          LOG_LEVEL_ERROR,
        );
        return;
      }

      const currencyDecimal = await this.getCurrencyDecimal(
        currency?.type,
        currency?.decimal,
      );

      const amount_n_fee = calculateAmountAndFee(
        Number(amount),
        currency.gift_card_fee_type,
        currency.gift_card_fee,
        currencyDecimal,
      );

      // validate wallet for fee amount
      const walletService = app.get(WalletService);
      const vld_wallet_balance = await walletService.validateWalletBalance(
        gift_card.creator_id,
        gift_card.currency_id,
        gift_card.wallet_type,
        amount_n_fee.fee_amount,
        null,
        true,
      );
      if (!vld_wallet_balance.success)
        throw new Error(vld_wallet_balance.message);

      const { wallet } = vld_wallet_balance;
      const wallet_mismatch_res =
        await walletService.checkWalletActivityMismatch(
          gift_card.wallet_type,
          wallet,
        );
      if (!wallet_mismatch_res.success) {
        throw new Error(wallet_mismatch_res.message);
      }

      // Debit fee amount
      const balanceUpdateService = new BalanceUpdateService(this.logger);
      await prisma_client.$transaction(async (prisma) => {
        if (amount_n_fee && Number(amount_n_fee.fee_amount) > 0) {
          await balanceUpdateService.userWalletBalanceUpdate(
            {
              related_model: EVENT_MODEL.GIFT_CARD_TRANSFER,
              model_id: String(gift_card.id),
              wallet_type: gift_card.wallet_type,
              tx_type: WALLET_ACTIVITY_TX_TYPE.DEBIT,
              amount: new Decimal(amount_n_fee.fee_amount),
              wallet_id: BigInt(wallet.id),
              user_id: BigInt(gift_card.owner_id),
              activity_title: WALLET_ACTIVITY_TITLE.GIFT_CARD_SENT,
              description:
                WALLET_ACTIVITY_DESCRIPTION.GIFT_CARD_SEND_BALANCE_DEBIT,
            },
            true,
            prisma,
          );
        }

        let updated_card: UserGiftCard;
        if (gift_card.quantity > 1) {
          updated_card = await this.createGiftCard(
            {
              wallet_type: gift_card.wallet_type,
              creator_id: gift_card.creator.id,
              owner_id: recipient.id,
              template_id: gift_card.template_id,
              currency_id: gift_card.currency_id,
              amount: gift_card.amount,
              quantity: 1,
              status: GIFT_CARD_STATUS.ACTIVE,
            },
            prisma,
          );
          await this.updateGiftCard(
            gift_card.id,
            {
              quantity: {
                decrement: 1,
              },
            },
            prisma,
          );
        } else {
          updated_card = await this.updateGiftCard(
            gift_card.id,
            {
              owner_id: recipient.id,
            },
            prisma,
          );
        }
        await this.createGiftCardTransferHistory(
          updated_card,
          amount_n_fee,
          owner_id,
          recipient.id,
          note,
          prisma,
        );
      });

      // Send notification to sender and receiver
      const amount_txt = `${gift_card.amount} ${gift_card.currency.code}`;
      await this.sendNotification(
        USER_NOTIFICATIONS.GIFT_CARD_SENT,
        gift_card.owner,
        amount_txt,
      );
      await this.sendNotification(
        USER_NOTIFICATIONS.GIFT_CARD_RECEIVED,
        recipient,
        amount_txt,
      );
    } catch (error) {
      this.logger.write(error.stack, LOG_LEVEL_ERROR);
      if (owner_id) {
        sendToasterErrMsg({
          user_id: owner_id,
          msg: __('Gift card send failed!'),
        });
      }
      throw new Error(error.message);
    }
  }

  // Redeem user gift card
  async redeemGiftCard(user: User, uid: string): Promise<ResponseModel> {
    try {
      const gift_card = await prisma_client.userGiftCard.findFirst({
        where: {
          uid: uid,
          status: GIFT_CARD_STATUS.ACTIVE,
          quantity: {
            gt: 0,
          },
        },
        select: {
          id: true,
          owner_id: true,
        },
      });

      if (!gift_card) {
        throw new BadRequestException(errorResponse(__('Invalid gift card!')));
      }

      if (gift_card.owner_id != user.id) {
        throw new BadRequestException(
          errorResponse(__('You are not the owner of this gift card!')),
        );
      }

      // Call gift card redeem job
      await app.get(GiftCardRedeemQueue).processGiftCardRedeemJob({
        uid: uid,
        user_id: gift_card.owner_id,
      });

      return successResponse('');
    } catch (error) {
      processException(error);
    }
  }

  async processRedeemGiftCardJob(
    data: GiftCardRedeemQueueData,
  ): Promise<ResponseModel> {
    try {
      const { uid } = data;
      const gift_card = await this.validationService.findUserGiftCard(
        {
          uid: uid,
          status: GIFT_CARD_STATUS.ACTIVE,
          quantity: {
            gt: 0,
          },
        },
        {
          currency: {
            select: {
              code: true,
            },
          },
          owner: true,
        },
      );

      if (!gift_card) {
        throw new Error('Invalid gift card!');
      }

      const total_quantitiy_amount = multiplyNumbers(
        Number(gift_card.quantity),
        Number(gift_card.amount),
      );

      // find wallet and wallet activity
      const walletService = new WalletService();
      const wallet = await walletService.findWallet(
        gift_card.currency_id,
        gift_card.owner_id,
      );
      const wallet_mismatch_res =
        await walletService.checkWalletActivityMismatch(
          gift_card.wallet_type,
          wallet,
        );

      if (!wallet_mismatch_res.success) {
        throw new Error(wallet_mismatch_res.message);
      }

      const balanceUpdateService = new BalanceUpdateService(this.logger);

      await prisma_client.$transaction(async (prisma) => {
        await balanceUpdateService.userWalletBalanceUpdate(
          {
            related_model: EVENT_MODEL.USER_GIFT_CARD,
            model_id: String(gift_card.id),
            wallet_type: gift_card.wallet_type,
            tx_type: WALLET_ACTIVITY_TX_TYPE.CREDIT,
            amount: new Decimal(total_quantitiy_amount),
            wallet_id: BigInt(wallet.id),
            user_id: BigInt(gift_card.owner_id),
            activity_title: WALLET_ACTIVITY_TITLE.GIFT_CARD_REDEEMED,
            description:
              WALLET_ACTIVITY_DESCRIPTION.GIFT_CARD_REDEEMED_BALANCE_CREDIT,
          },
          true,
          prisma,
        );
        await prisma.userGiftCard.update({
          where: {
            id: gift_card.id,
          },
          data: {
            status: GIFT_CARD_STATUS.REDEEMED,
          },
        });
      });

      const amount_txt = `${gift_card.amount} ${gift_card.currency.code}`;

      await this.sendNotification(
        USER_NOTIFICATIONS.GIFT_CARD_REDEEMED,
        gift_card.owner,
        amount_txt,
      );
      return successResponse(__('Gift card redeemed successfully!'));
    } catch (error) {
      this.logger.write(error.stack, LOG_LEVEL_ERROR);
      if (data.user_id) {
        sendToasterErrMsg({
          user_id: data.user_id,
          msg: __('Gift card redeem failed!'),
        });
      }
      throw new Error(error.message);
    }
  }

  private async getCurrencyDecimal(type: CURRENCY_TYPE, decimal?: number) {
    if (type == CURRENCY_TYPE.FIAT) {
      return decimal;
    }

    const gift_card_decimal = await getSettings(
      SETTINGS_SLUG.CRYPTO_DECIMAL_VALUE_FOR_GIFT_CARD,
    );

    return gift_card_decimal ? Number(gift_card_decimal) : undefined;
  }

  // Create transaction history for gift card create or send
  private async createGiftCardTransferHistory(
    user_gift_card: UserGiftCard,
    amount_n_fee: AmountCalculationRes,
    from_user_id: bigint,
    to_user_id: bigint,
    note?: string,
    prisma?: Omit<
      PrismaClient,
      '$connect' | '$disconnect' | '$on' | '$transaction' | '$use'
    >,
  ) {
    prisma = prisma ?? prisma_client;
    await prisma.userGiftCardTransferHistory.create({
      data: {
        from_user_id: from_user_id,
        to_user_id: to_user_id,
        user_gift_card_id: user_gift_card.id,
        currency_id: user_gift_card.currency_id,
        amount: new Decimal(amount_n_fee.amount),
        fee: new Decimal(amount_n_fee.fee_amount),
        total_amount: new Decimal(amount_n_fee.total_amount),
        note: note,
      },
    });
  }

  // Send internal and external notificaiton with balance update subscription
  private async sendNotification(
    notification: USER_NOTIFICATIONS,
    user: User,
    amount_txt: string,
  ) {
    await sendNotificationWithBalanceSub({
      notification: notification,
      user: user,
      is_external: true,
      is_balance_update: true,
      amount_txt,
    });
  }

  private async createGiftCard(
    payload: Prisma.UserGiftCardUncheckedCreateInput,
    prisma?: Omit<
      PrismaClient,
      '$connect' | '$disconnect' | '$on' | '$transaction' | '$use'
    >,
  ): Promise<UserGiftCard> {
    prisma = prisma ?? prisma_client;
    return await prisma.userGiftCard.create({
      data: payload,
    });
  }

  // update gift card
  private async updateGiftCard(
    id: bigint,
    data: Prisma.UserGiftCardUncheckedUpdateInput,
    prisma?: Omit<
      PrismaClient,
      '$connect' | '$disconnect' | '$on' | '$transaction' | '$use'
    >,
  ) {
    prisma = prisma ?? prisma_client;
    return await prisma.userGiftCard.update({
      where: {
        id: id,
      },
      data: data,
    });
  }
}
