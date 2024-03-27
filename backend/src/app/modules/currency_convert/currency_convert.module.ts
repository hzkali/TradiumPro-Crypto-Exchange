import { Module } from '@nestjs/common';
import { WalletService } from '../wallet/wallet.service';
import { B_CurrencyConvertResolver } from './backoffice/b.currency_convert.resolver';
import { B_CurrencyConvertService } from './backoffice/b.currency_convert.service';
import { CurrencyConvertProcess } from './currency_convert.process';
import { CurrencyConvertResolver } from './currency_convert.resolver';
import { CurrencyConvertService } from './currency_convert.service';
import { CurrencyConvertValidationService } from './currency_convert.validation';
import { CurrencyQuoteService } from './quote/quote.service';
import { QuoteValidationService } from './quote/quote.validation';

@Module({
  imports: [],
  providers: [
    CurrencyConvertResolver,
    CurrencyConvertService,
    B_CurrencyConvertResolver,
    B_CurrencyConvertService,
    CurrencyConvertProcess,
    CurrencyQuoteService,
    QuoteValidationService,
    CurrencyConvertValidationService,
    WalletService,
  ],
})
export class CurrencyConvertModule {}
