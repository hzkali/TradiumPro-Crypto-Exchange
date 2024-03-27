import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { CurrencyConvertEventsListener } from './listeners/convert_events.listener';
import { CoreEventsListener } from './listeners/core_events.listener';
import { CurrencyPairEventsListener } from './listeners/currency_pair_events.listener';
import { DepositEventsListener } from './listeners/deposit_events.listener';
import { OrderEventsListener } from './listeners/order_events.listener';
import { SignUpEventsListener } from './listeners/signup_events.listener';
import { TradeEventsListener } from './listeners/trade_events.listener';
import { UserKycVerificationEventsListener } from './listeners/user_kyc_verification_events.listener';
import { WalletEventsListener } from './listeners/wallet_events.listener';
import { WithdrawalEventsListener } from './listeners/withdrawal_events.listener';
import { P2pEventsListener } from './listeners/p2p_events.listener';
import { FuturesCurrencyPairEventsListener } from './listeners/futures_currency_pair_events.listener';
import { FuturesOrderEventsListener } from './listeners/futures_order_events.listener';
import { FuturesTradeEventsListener } from './listeners/futures_trade_events.listener';
import { FuturesPositionEventsListener } from './listeners/futures_position_events.listener';

@Module({
  imports: [
    EventEmitterModule.forRoot({
      wildcard: true,
      delimiter: '.',
      verboseMemoryLeak: true,
    }),
  ],
  providers: [
    CoreEventsListener,
    WalletEventsListener,
    DepositEventsListener,
    WithdrawalEventsListener,
    CurrencyPairEventsListener,
    OrderEventsListener,
    TradeEventsListener,
    SignUpEventsListener,
    UserKycVerificationEventsListener,
    CurrencyConvertEventsListener,
    P2pEventsListener,

    FuturesCurrencyPairEventsListener,
    FuturesOrderEventsListener,
    FuturesTradeEventsListener,
    FuturesPositionEventsListener,
  ],
})
export class EventModule {}
