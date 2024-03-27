import { Module } from '@nestjs/common';
import { B_GiftCardResolver } from './backoffice/b.gift_card.resolver';
import { B_GiftCardService } from './backoffice/b.gift_card.service';
import { F_GiftCardResolver } from './f.gift_card.resolver';
import { GiftCardService } from './gift_card.service';
import { GiftCardValidationService } from './gift_card.validation';
import { WalletService } from '../wallet/wallet.service';

@Module({
  providers: [
    B_GiftCardResolver,
    B_GiftCardService,
    F_GiftCardResolver,
    GiftCardValidationService,
    GiftCardService,
    WalletService,
  ],
})
export class GiftCardModule {}
