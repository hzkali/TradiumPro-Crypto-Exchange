import { ObjectType } from '@nestjs/graphql';
import Paginated from '../../../libs/graphql/pagination/pagination';
import PaginatedLimitOffset from '../../../libs/graphql/pagination/paginationLimitOffset';
import { MarketDataResponseModel } from '../../modules/market_data/dto/response.dto';
import { AdminDepositModel } from '../db/admin_deposit.model';
import { AdminNetworkBalanceModel } from '../db/admin_network_balance.model';
import { AdminWalletKeyModel } from '../db/admin_wallet_key.model';
import {
  B_AllowedMethodModel,
  F_AllowedMethodModel,
} from '../db/allowed_method.model';
import { B_BannerModel } from '../db/banner.model';
import { B_BlogModel, F_BlogModel } from '../db/blog.model';
import { B_BlogCategoryModel } from '../db/blog_category.model';
import {
  B_BonusDistributionHistory,
  F_BonusDistributionHistory,
} from '../db/bonus_distribution_history.model';
import { B_BuyOrderModel } from '../db/buy_orders.model';
import { B_CoinModel } from '../db/coin.model';
import { B_CurrencyModel } from '../db/currency.model';
import {
  B_CurrencyConvertHistory,
  F_CurrencyConvertHistory,
} from '../db/currency_convert_history.model';
import { B_CurrencyPairModel } from '../db/currency_pair.model';
import { B_DepositModel, F_DepositModel } from '../db/deposit.model';
import { FaqModel } from '../db/faq.model';
import { B_FaqCategoryModel } from '../db/faq_category.model';
import {
  B_GiftCardCategoryModel,
  F_GiftCardCategoryModel,
} from '../db/gift_card_category.model';
import {
  B_GiftCardTemplateModel,
  F_GiftCardTemplateModel,
} from '../db/gift_card_template.model';
import { B_MenuModel } from '../db/menu.model';
import { B_NetworkModel } from '../db/network.model';
import { B_NetworkWithdrawalModel } from '../db/network_withdrawal.model';
import { NoticeModel } from '../db/notice.model';
import { B_NotifiedBlockModel } from '../db/notified_blocks.model';
import {
  B_P2pAdvertisementModel,
  F_P2pAdvertisementModel,
} from '../db/p2p_advertisement.model';
import { P2pEventReasonModel } from '../db/p2p_event_reason.model';
import { B_P2pOrderModel, F_P2pOrderModel } from '../db/p2p_order.model';
import { P2pOrderChatModel } from '../db/p2p_order_chat.model';
import { F_P2pOrderFeedbackModel } from '../db/p2p_order_feedback.model';
import { B_P2pOrderReportModel } from '../db/p2p_order_report.model';
import { P2pUserBlockModel } from '../db/p2p_user_block.model';
import { P2pUserFollowerModel } from '../db/p2p_user_follower.model';
import {
  B_PayMethodDetailsModel,
  F_PayMethodDetailsModel,
} from '../db/pay_method_details.model';
import { SecurityQuestionModel } from '../db/security_question.model';
import { B_SellOrderModel } from '../db/sell_orders.model';
import { F_SpotOrderModel } from '../db/spot_orders.model';
import { B_SpotTradeModel, F_SpotTradeModel } from '../db/spot_trade.model';
import { Staff } from '../db/staff.model';
import { StaffNotificationModel } from '../db/staff_notification.model';
import { User } from '../db/user.model';
import { B_UserBalanceMismatchModel } from '../db/userWalletBalanceMismatch.model';
import {
  B_UserActivityModel,
  UserActivityModel,
} from '../db/user_activity.model';
import {
  B_UserDepositDefaultWalletTypeHistoryModel,
  F_UserDepositDefaultWalletTypeHistoryModel,
} from '../db/user_deposit_default_wallet_type_history.model';
import { UserDeviceModel } from '../db/user_device.model';
import {
  B_UserGiftCardModel,
  F_UserGiftCardModel,
} from '../db/user_gift_card.model';
import {
  B_UserGiftCardTransferHistoryModel,
  F_UserGiftCardTransferHistoryModel,
} from '../db/user_gift_card_transfer_history.model';
import { UserKycAddressDetails } from '../db/user_kyc_address_details.model';
import { UserKycDetails } from '../db/user_kyc_details.model';
import { UserNetworkBalanceModel } from '../db/user_network_balance.model';
import { F_UserNotificationModel } from '../db/user_notification.model';
import { UserSecurityResetRequestModel } from '../db/user_security_reset_request.model';
import {
  B_UserWalletTransferHistoryModel,
  F_UserWalletTransferHistoryModel,
} from '../db/user_wallet_transfer_history.model';
import { B_UserWalletModel } from '../db/wallet.model';
import {
  B_WalletActivityModel,
  F_WalletActivityModel,
} from '../db/wallet_activities.model';
import {
  B_WalletIssueModel,
  F_WalletIssueModel,
} from '../db/wallet_issue.model';
import { B_WithdrawalModel, F_WithdrawalModel } from '../db/withdrawal.model';
import { F_WithdrawalAddressModel } from '../db/withdrawal_address.model';

import { B_FuturesCurrencyPairModel } from '../db/futures_currency_pair.model';
import { F_FuturesOrderModel } from '../db/futures_orders.model';
import { B_FuturesBuyOrderModel } from '../db/futures_buy_order.model';
import { B_FuturesSellOrderModel } from '../db/futures_sell_order.model';

import {
  B_FuturesTradeModel,
  F_FuturesTradeModel,
} from '../db/futures_trade.model';
import { F_FuturesPositionModel } from '../db/futures_position.model';

import {
  B_FuturesTransactionHistoryModel,
  F_FuturesTransactionHistoryModel,
} from '../db/futures_transaction_history.model';

import {
  B_FuturesPositionHistoryModel,
  F_FuturesPositionHistoryModel,
} from '../db/futures_position_history.model';
import { B_FuturesTradePositionProcessJobModel } from '../db/futures_trade_position_process_job.model';

@ObjectType()
export class UserDeviceConnection extends Paginated(UserDeviceModel) {}
@ObjectType()
export class SecurityQuestionConnection extends Paginated(
  SecurityQuestionModel,
) {}

@ObjectType()
export class UserActivityConnection extends Paginated(UserActivityModel) {}

@ObjectType()
export class B_UserActivityConnection extends Paginated(B_UserActivityModel) {}

@ObjectType()
export class UserConnection extends Paginated(User) {}

@ObjectType()
export class UserConnectionLimitOffset extends PaginatedLimitOffset(User) {}

@ObjectType()
export class StaffConnection extends Paginated(Staff) {}

@ObjectType()
export class UserSecurityRestRequestConnection extends Paginated(
  UserSecurityResetRequestModel,
) {}

@ObjectType()
export class UserKycDetailsConnection extends Paginated(UserKycDetails) {}

@ObjectType()
export class UserAddressDetailsConnection extends Paginated(
  UserKycAddressDetails,
) {}

@ObjectType()
export class CurrencyConnection extends Paginated(B_CurrencyModel) {}

@ObjectType()
export class NetworkConnection extends Paginated(B_NetworkModel) {}

@ObjectType()
export class CoinConnection extends Paginated(B_CoinModel) {}

@ObjectType()
export class WithdrawalAddressConnection extends PaginatedLimitOffset(
  F_WithdrawalAddressModel,
) {}

@ObjectType()
export class B_UserWalletConnection extends Paginated(B_UserWalletModel) {}

@ObjectType()
export class AdminWalletKeyConnection extends Paginated(AdminWalletKeyModel) {}
@ObjectType()
export class AdminNetworkBalanceConnection extends Paginated(
  AdminNetworkBalanceModel,
) {}

@ObjectType()
export class UserDepositConnection extends Paginated(B_DepositModel) {}

@ObjectType()
export class AdminDepositConnection extends Paginated(AdminDepositModel) {}

@ObjectType()
export class DepositConnection extends PaginatedLimitOffset(F_DepositModel) {}
@ObjectType()
export class WithdrawalConnection extends PaginatedLimitOffset(
  F_WithdrawalModel,
) {}

@ObjectType()
export class B_WithdrawalConnection extends Paginated(B_WithdrawalModel) {}
@ObjectType()
export class F_WalletActivityConnection extends PaginatedLimitOffset(
  F_WalletActivityModel,
) {}

@ObjectType()
export class B_WalletActivityConnection extends Paginated(
  B_WalletActivityModel,
) {}

@ObjectType()
export class WalletIssueConnection extends Paginated(B_WalletIssueModel) {}

@ObjectType()
export class F_WalletIssueConnection extends PaginatedLimitOffset(
  F_WalletIssueModel,
) {}

@ObjectType()
export class UserNetworkBalanceConnection extends Paginated(
  UserNetworkBalanceModel,
) {}

@ObjectType()
export class NetworkWithdrawalConnection extends Paginated(
  B_NetworkWithdrawalModel,
) {}
@ObjectType()
export class NotifiedBlockConnection extends Paginated(B_NotifiedBlockModel) {}

@ObjectType()
export class CurrencyPairConnection extends Paginated(B_CurrencyPairModel) {}

@ObjectType()
export class F_SpotOrderConnection extends PaginatedLimitOffset(
  F_SpotOrderModel,
) {}

@ObjectType()
export class B_BuyOrderConnection extends Paginated(B_BuyOrderModel) {}

@ObjectType()
export class B_SellOrderConnection extends Paginated(B_SellOrderModel) {}

@ObjectType()
export class B_SpotTradeConnection extends Paginated(B_SpotTradeModel) {}
@ObjectType()
export class F_SpotTradeConnection extends PaginatedLimitOffset(
  F_SpotTradeModel,
) {}

@ObjectType()
export class UserBalanceMismatchConnection extends Paginated(
  B_UserBalanceMismatchModel,
) {}

@ObjectType()
export class MarketDataConnection extends PaginatedLimitOffset(
  MarketDataResponseModel,
) {}

@ObjectType()
export class F_UserNotificationConnection extends Paginated(
  F_UserNotificationModel,
) {}

@ObjectType()
export class B_FaqCategoryConnection extends Paginated(B_FaqCategoryModel) {}
@ObjectType()
export class F_FaqConnection extends PaginatedLimitOffset(FaqModel) {}
@ObjectType()
export class B_FaqConnection extends Paginated(FaqModel) {}

@ObjectType()
export class F_BlogConnection extends Paginated(F_BlogModel) {}
@ObjectType()
export class B_BlogConnection extends Paginated(B_BlogModel) {}

@ObjectType()
export class B_BannerConnection extends Paginated(B_BannerModel) {}

@ObjectType()
export class B_BlogCategoryConnection extends Paginated(B_BlogCategoryModel) {}

@ObjectType()
export class B_MenuConnection extends Paginated(B_MenuModel) {}

@ObjectType()
export class B_NoticeConnection extends Paginated(NoticeModel) {}

@ObjectType()
export class B_BonusDistributionHistoryConnection extends Paginated(
  B_BonusDistributionHistory,
) {}

@ObjectType()
export class F_BonusDistributionHistoryConnection extends PaginatedLimitOffset(
  F_BonusDistributionHistory,
) {}
@ObjectType()
export class F_CurrencyConvertHistoryConnection extends PaginatedLimitOffset(
  F_CurrencyConvertHistory,
) {}

@ObjectType()
export class B_ConvertHistoryConnection extends Paginated(
  B_CurrencyConvertHistory,
) {}

@ObjectType()
export class B_AllowedMethodConnection extends Paginated(
  B_AllowedMethodModel,
) {}

@ObjectType()
export class F_AllowedMethodConnection extends Paginated(
  F_AllowedMethodModel,
) {}

@ObjectType()
export class B_PayMethodDetailsConnection extends Paginated(
  B_PayMethodDetailsModel,
) {}

@ObjectType()
export class F_PayMethodDetailsConnection extends PaginatedLimitOffset(
  F_PayMethodDetailsModel,
) {}

@ObjectType()
export class B_GiftCardCategoryConnection extends Paginated(
  B_GiftCardCategoryModel,
) {}

@ObjectType()
export class F_GiftCardCategoryConnection extends PaginatedLimitOffset(
  F_GiftCardCategoryModel,
) {}

@ObjectType()
export class B_GiftCardTemplateConnection extends Paginated(
  B_GiftCardTemplateModel,
) {}

@ObjectType()
export class F_GiftCardTemplateConnection extends PaginatedLimitOffset(
  F_GiftCardTemplateModel,
) {}

@ObjectType()
export class B_UserGiftCardConnection extends Paginated(B_UserGiftCardModel) {}

@ObjectType()
export class F_UserGiftCardConnection extends PaginatedLimitOffset(
  F_UserGiftCardModel,
) {}

@ObjectType()
export class B_UserGiftCardTransferHistoryConnection extends Paginated(
  B_UserGiftCardTransferHistoryModel,
) {}

@ObjectType()
export class F_UserGiftCardTransferHistoryConnection extends PaginatedLimitOffset(
  F_UserGiftCardTransferHistoryModel,
) {}

@ObjectType()
export class F_UserDepositDefaultWalletTypeHistoryConnection extends PaginatedLimitOffset(
  F_UserDepositDefaultWalletTypeHistoryModel,
) {}

@ObjectType()
export class B_UserDepositDefaultWalletTypeHistoryConnection extends Paginated(
  B_UserDepositDefaultWalletTypeHistoryModel,
) {}

@ObjectType()
export class F_UserWalletTransferHistoryConnection extends PaginatedLimitOffset(
  F_UserWalletTransferHistoryModel,
) {}

@ObjectType()
export class B_UserWalletTransferHistoryConnection extends Paginated(
  B_UserWalletTransferHistoryModel,
) {}

@ObjectType()
export class F_P2pAdvertisementConnection extends PaginatedLimitOffset(
  F_P2pAdvertisementModel,
) {}

@ObjectType()
export class B_P2pAdvertisementConnection extends Paginated(
  B_P2pAdvertisementModel,
) {}

@ObjectType()
export class F_P2pOrderConnection extends PaginatedLimitOffset(
  F_P2pOrderModel,
) {}

@ObjectType()
export class B_P2pOrderConnection extends Paginated(B_P2pOrderModel) {}

@ObjectType()
export class F_P2pUserBlockConnection extends PaginatedLimitOffset(
  P2pUserBlockModel,
) {}

@ObjectType()
export class F_P2pUserFollowerConnection extends PaginatedLimitOffset(
  P2pUserFollowerModel,
) {}

@ObjectType()
export class F_P2pUserFeedbackConnection extends PaginatedLimitOffset(
  F_P2pOrderFeedbackModel,
) {}

@ObjectType()
export class P2pOrderChatConnection extends Paginated(P2pOrderChatModel) {}

@ObjectType()
export class B_P2pOrderReportConnection extends Paginated(
  B_P2pOrderReportModel,
) {}

@ObjectType()
export class P2pEventReasonConnection extends Paginated(P2pEventReasonModel) {}

@ObjectType()
export class StaffNotificationConnection extends Paginated(
  StaffNotificationModel,
) {}

@ObjectType()
export class B_FuturesCurrencyPairConnection extends Paginated(
  B_FuturesCurrencyPairModel,
) {}

@ObjectType()
export class F_FuturesCurrencyPairConnection extends PaginatedLimitOffset(
  B_FuturesCurrencyPairModel,
) {}

@ObjectType()
export class F_FuturesOrderConnection extends PaginatedLimitOffset(
  F_FuturesOrderModel,
) {}

@ObjectType()
export class B_FuturesBuyOrderConnection extends Paginated(
  B_FuturesBuyOrderModel,
) {}

@ObjectType()
export class B_FuturesSellOrderConnection extends Paginated(
  B_FuturesSellOrderModel,
) {}

@ObjectType()
export class B_FuturesTradeConnection extends Paginated(B_FuturesTradeModel) {}

@ObjectType()
export class F_FuturesTradeConnection extends PaginatedLimitOffset(
  F_FuturesTradeModel,
) {}

@ObjectType()
export class F_FuturesPositionConnection extends PaginatedLimitOffset(
  F_FuturesPositionModel,
) {}

@ObjectType()
export class F_FuturesTransactionHistoryConnection extends PaginatedLimitOffset(
  F_FuturesTransactionHistoryModel,
) {}

@ObjectType()
export class B_FuturesTransactionHistoryConnection extends Paginated(
  B_FuturesTransactionHistoryModel,
) {}

@ObjectType()
export class F_FuturesPositionHistoryConnection extends PaginatedLimitOffset(
  F_FuturesPositionHistoryModel,
) {}

@ObjectType()
export class B_FuturesPositionHistoryConnection extends Paginated(
  B_FuturesPositionHistoryModel,
) {}

@ObjectType()
export class B_FuturesTradePositionProcessJobConnection extends Paginated(
  B_FuturesTradePositionProcessJobModel,
) {}
