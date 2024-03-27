import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { RateLimitingThrottlerGuard } from '../libs/guards/rate_limit_throttle.guard';
import { IpLocationService } from './core.services/ip_location.service';
import { FilesystemResolver } from './filesystem/filesystem.resolver';
import { UserActivityModule } from './modules/activity/user_activity.module';
import { AuthModule } from './modules/auth/auth.module';
import { BlockNotifierModule } from './modules/block_notifier/block_notifier.module';
import { BlogModule } from './modules/blog/blog.module';
import { BonusModule } from './modules/bonus/bonus.module';
import { BuySellCryptoModule } from './modules/buy_sell_crypto/buy_sell_crypto.module';
import { CoinModule } from './modules/coin/coin.module';
import { CoinPoolModule } from './modules/coin_pool/coin_pool.module';
import { CountryModule } from './modules/country/country.module';
import { CurrencyModule } from './modules/currency/currency.module';
import { CurrencyConvertModule } from './modules/currency_convert/currency_convert.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { DepositModule } from './modules/deposit/deposit.module';
import { FaqModule } from './modules/faq/faq.module';
import { FuturesModule } from './modules/futures_trade/futures.module';
import { GiftCardModule } from './modules/gift_card/gift_card.module';
import { MarketDataModule } from './modules/market_data/market_data.module';
import { MessagingModule } from './modules/messaging/messaging.module';
import { MiscellaneousModule } from './modules/miscellaneous/miscellaneous.module';
import { NetworkModule } from './modules/network/network.module';
import { P2pModule } from './modules/p2p/p2p.module';
import { PaymentModule } from './modules/payment/payment.module';
import { PaymentMethodModule } from './modules/payment_method/payment_method.module';
import { ReportModule } from './modules/report/report.module';
import { RoleModule } from './modules/role/role.module';
import { SecurityQuestionModule } from './modules/security_question/security_question.module';
import { SecurityResetModule } from './modules/security_reset/security_reset.module';
import { BonusSettingModule } from './modules/setting/bonus_settings/bonus_settings.module';
import { SettingModule } from './modules/setting/setting.module';
import { CurrencyPairModule } from './modules/spot_trade/currency_pair/currency_pair.module';
import { SpotOrderModule } from './modules/spot_trade/spot_order/spot.order.module';
import { SpotTradeModule } from './modules/spot_trade/spot_trade.module';
import { StaffModule } from './modules/staff/staff.module';
import { StaffNotificationModule } from './modules/staff_notification/staff_notification.module';
import { SystemRevenueModule } from './modules/system_revenue/system_revenue.module';
import { SystemWalletModule } from './modules/system_wallet/system_wallet.module';
import { TransactionHistoryModule } from './modules/transaction_history/transaction_history.module';
import { UserModule } from './modules/user/user.module';
import { UserNotificationModule } from './modules/user_notification/user_notification.module';
import { UserSettingsModule } from './modules/user_settings/user_settings.module';
import { WalletModule } from './modules/wallet/wallet.module';
import { WalletIssueModule } from './modules/wallet_issues/wallet_issue.module';
import { WebsiteModule } from './modules/website/website.module';
import { WithdrawalModule } from './modules/withdrawal/withdrawal.module';

@Module({
  imports: [
    SettingModule,
    UserActivityModule,
    AuthModule,
    StaffModule,
    UserModule,
    DashboardModule,
    SecurityQuestionModule,
    SecurityResetModule,
    RoleModule,
    ReportModule,
    UserSettingsModule,
    FilesystemResolver,
    MiscellaneousModule,
    CountryModule,
    NetworkModule,
    CurrencyModule,
    CoinModule,
    WalletModule,
    DepositModule,
    WithdrawalModule,
    SystemWalletModule,
    TransactionHistoryModule,
    WalletIssueModule,
    CoinPoolModule,
    BlockNotifierModule,
    SpotOrderModule,
    SpotTradeModule,
    CurrencyPairModule,
    MarketDataModule,
    SystemRevenueModule,
    UserNotificationModule,
    WebsiteModule,
    FaqModule,
    BlogModule,
    BonusSettingModule,
    BonusModule,
    MessagingModule,
    CurrencyConvertModule,
    PaymentMethodModule,
    PaymentModule,
    BuySellCryptoModule,
    GiftCardModule,
    P2pModule,
    StaffNotificationModule,
    FuturesModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: RateLimitingThrottlerGuard,
    },
    IpLocationService,
  ],
  exports: [IpLocationService],
})
export class AppModule {}
