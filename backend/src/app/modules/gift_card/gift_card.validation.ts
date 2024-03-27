import { BadRequestException, Injectable } from '@nestjs/common';
import {
  prisma_client,
  processException,
  __,
  errorResponse,
  app,
  calculateAmountAndFee,
  multiplyNumbers,
  successResponse,
  addNumbers,
} from '../../helpers/functions';

import { User } from '../../models/db/user.model';
import {
  CreateOrSendUserGiftCardInput,
  RecipientUserCredentialInput,
} from './dto/input.dto';
import { CodeVerifyInputs } from '../../models/custom/common.input.model';
import {
  GIFT_CARD_ACTION,
  STATUS_ACTIVE,
  VERIFICATION_CODE_EVENT,
} from '../../helpers/coreconstants';
import { F_AuthCodeVerificationService } from '../auth/frontend/f.auth.code_verification.service';
import { WalletService } from '../wallet/wallet.service';
import { ResponseModel } from '../../models/custom/common.response.model';
import { Currency, Prisma } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime';

@Injectable()
export class GiftCardValidationService {
  async validateCreateOrSendGiftCard(
    user: User,
    data: CreateOrSendUserGiftCardInput,
    code_verify_input?: CodeVerifyInputs,
  ) {
    const {
      action,
      recipient_user_credential,
      currency_code,
      wallet_type,
      template_uid,
      amount,
    } = data;

    if (data?.quantity <= 0) {
      throw new BadRequestException(errorResponse(__('Invalid Quantity!')));
    }

    if (data.amount <= 0) {
      throw new BadRequestException(errorResponse(__('Invalid Amount!')));
    }

    if (!data.quantity) data.quantity = 1;

    const currency = await this.findCurrency(currency_code);
    if (!currency) {
      throw new BadRequestException(errorResponse(__('Invalid currency!')));
    }

    const template = await this.findTemplate(template_uid);
    if (!template) {
      throw new BadRequestException(errorResponse(__('Invalid template!')));
    }

    this.validateMinMax(currency, amount);

    let total_quantity_amount = multiplyNumbers(
      Number(amount),
      Number(data.quantity),
    );

    let recipient: User;
    if (action == GIFT_CARD_ACTION.SEND) {
      if (data.quantity != 1) {
        throw new BadRequestException(
          __('You can not send multiple gift card!'),
        );
      }
      const calculate_amount = calculateAmountAndFee(
        amount,
        currency.gift_card_fee_type,
        Number(currency.gift_card_fee),
        currency.decimal,
      );

      total_quantity_amount = addNumbers(
        total_quantity_amount,
        Number(calculate_amount.fee_amount),
      );

      recipient = await this.validateSendGiftCard(
        user,
        recipient_user_credential,
        code_verify_input,
      );
    }

    try {
      const vld_wallet_balance = await app
        .get(WalletService)
        .validateWalletBalance(
          user.id,
          currency.id,
          wallet_type,
          total_quantity_amount,
          null,
          true,
        );

      if (!vld_wallet_balance.success)
        throw new BadRequestException(
          errorResponse(vld_wallet_balance.message),
        );
    } catch (error) {
      throw new BadRequestException(errorResponse(error.message));
    }

    return {
      currency_id: currency.id,
      template_id: template.id,
      recipient: recipient,
    };
  }

  async validateSendGiftCard(
    user: User,
    recipient_user_credential: RecipientUserCredentialInput,
    code_verify_input: CodeVerifyInputs,
  ): Promise<User> {
    if (!recipient_user_credential) {
      throw new BadRequestException(
        errorResponse(__('Recipient user is required!')),
      );
    }

    if (!code_verify_input)
      throw new BadRequestException(
        errorResponse(__('Verification Code is required!')),
      );

    if (code_verify_input.event !== VERIFICATION_CODE_EVENT.GIFT_CARD_SEND) {
      throw new BadRequestException(errorResponse('Invalid event!'));
    }
    await app
      .get(F_AuthCodeVerificationService)
      .checkVerifyCodeAndUpdate(user, code_verify_input);

    const recipient = await this.checkRecipentAvailablity(
      recipient_user_credential,
    );

    if (user.id == recipient.id) {
      throw new BadRequestException(errorResponse(__('Invalid recipient!')));
    }

    return recipient;
  }

  private validateMinMax(
    currency: Currency,
    amount: Decimal | number,
  ): ResponseModel {
    if (Number(amount) > Number(currency.max_gift_card_amount)) {
      throw new BadRequestException(
        errorResponse(__('Amount is higher than max gift card amount')),
      );
    }

    if (Number(amount) < Number(currency.min_gift_card_amount)) {
      throw new BadRequestException(
        errorResponse(__('Amount is lower than min gift card amount')),
      );
    }

    return successResponse('');
  }

  async checkRecipentAvailablity(
    recipient_user_credential: RecipientUserCredentialInput,
  ): Promise<User> {
    try {
      const { credential_type, credential_value } = recipient_user_credential;
      const recipient = await prisma_client.user.findFirst({
        where: {
          [credential_type]: credential_value,
          status: STATUS_ACTIVE,
        },
        include: {
          user_settings: true,
        },
      });

      if (!recipient) {
        throw new BadRequestException(errorResponse(__('Invalid recipient!')));
      }

      return recipient;
    } catch (error) {
      processException(error);
    }
  }

  public async findCurrency(code: string) {
    return await prisma_client.currency.findFirst({
      where: {
        code: code,
        status: STATUS_ACTIVE,
        gift_card_status: STATUS_ACTIVE,
      },
    });
  }

  public async findTemplate(uid: string) {
    return await prisma_client.giftCardTemplate.findFirst({
      where: {
        uid: uid,
        status: STATUS_ACTIVE,
      },
    });
  }

  public async findUserGiftCard(
    where?: Prisma.UserGiftCardWhereInput,
    include?: Prisma.UserGiftCardInclude,
  ) {
    return await prisma_client.userGiftCard.findFirst({
      where: where || undefined,
      include: include || undefined,
    });
  }
}
