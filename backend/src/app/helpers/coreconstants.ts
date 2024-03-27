function __(str: string) {
  return str;
}

export const WALLET_BALANCE_MISMATCH_TOLERANCE_DECIMAL = 9;

export const NULL_ETH_ADDRESS = '0x0000000000000000000000000000000000000000';

//common status
export const STATUS_NO = 0;
export const STATUS_YES = 1;

export const STATUS_INACTIVE = 0;
export const STATUS_ACTIVE = 1;

export const STATUS_PENDING = 0;
export const STATUS_DONE = 1;

export const STATUS_COMPLETED = 2;
export const STATUS_PROCESSING = 3;
export const STATUS_SKIPPED = 4;
export const STATUS_FAILED = 5;
export const STATUS_REJECTED = 6;
export const STATUS_EXPIRED = 7;
export const STATUS_DISABLED = 9;
export const STATUS_SUSPENDED = 10;
export const STATUS_DELETED = 11;
export const STATUS_BLOCKED = 12;

export enum CURRENCY_TYPE {
  CRYPTO = 1,
  FIAT = 2,
}

export enum USER_STATUS {
  INACTIVE = 0,
  ACTIVE = 1,
  DISABLED = 2,
  SUSPENDED = 3,
}

//
export enum APP_ENV {
  PRODUCTION = 'production',
  DEVELOPMENT = 'development',
  LOCAL = 'local',
}

// prefix, suffix or full keys
export enum CACHE_KEYS {
  WALLET_ADDRESSES = 'wallet_addresses',
  TOKEN_ADDRESSES = 'token_addresses',
  WITHDRAWAL_TXIDS = 'withdrawal_txids',
}

export enum CODE {
  STATUS_OK = 200,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  VERIFY_EMAIL = 901,
  VERIFY_PHONE = 902,
  VERIFY_DEVICE = 903,
  VERIFY_LOGIN_TWOFA = 904,
  USER_SUSPENDED = 905,
  ACCOUNT_NOT_ACTIVE = 906,
  USER_DISABLED = 907,
  COUNTRY_RESTRICTED = 1001,
}

export enum REGEX {
  BTC_TXID = '^[a-fA-F0-9]{64}$',
  ETH_TXHASH = '^0x[a-fA-F0-9]{64}$',
}

//file types
export const FILE_TYPE_IMAGE = 'image';
export const FILE_TYPE_DOCUMENT = 'document';
export const FILE_TYPE_VIDEO = 'video';
export const FILE_TYPE_AUDIO = 'audio';
export const FILE_TYPE_3D = '_3d';
//

export const DEFAULT_MAX_DATA_SIZE_IN_BYTE = 10000000; // 10 mb
export const DEFAULT_MAX_FILE_UPLOAD_SIZE_IN_BYTE = 2000000; // 2 mb
export const DEFAULT_MAX_FILE_UPLOADS_AT_A_TIME = 10;

export const NEWEST_OR_RECENT_IN_MIN = 4320;
export const BLOCK_CONFIRMATION_TO_WAIT = 4;

export const VERIFY_CODE_TYPE_AUTH = 1;

export const VERIFY_CODE_RESEND_TIME_IN_SEC = 60;

export const VERIFY_CODE_EXPIRATION_TIME_IN_MIN = 30;

export enum USER_TYPE {
  REGULAR = 1,
  ENTITY = 2,
  SYSTEM_BOT = 100,
}

export enum ACCOUNT_STATUS {
  PENDING = 1,
  SUCCESSFUL = 2,
}

export enum REG_TYPE {
  REGULAR = 1,
  GOOGLE = 2,
  APPLE = 3,
}
export enum GENDER {
  MALE = 1,
  FEMALE = 2,
  OTHERS = 3,
}
export enum VERIFICATION_CODE_METHOD {
  EMAIL = 1,
  SMS = 2,
  GAUTH = 3,
}

export enum SECURITY_RESET_METHOD {
  EMAIL = 'email',
  PHONE = 'phone',
  GAUTH = 'google2fa_secret',
}

export enum USER_CREDENTIALS {
  EMAIL = 'email',
  PHONE = 'phone',
  USERCODE = 'usercode',
}

export enum VERIFICATION_CODE_EVENT {
  SIGN_UP = 1,
  LOGIN_2FA = 2,
  FORGET_PASSWORD = 3,
  DEVICE_VERIFICATION = 4,
  PASSWORD_CHANGE = 5,
  RESET_SECURITY = 6,
  RESET_CREDENTIAL = 7,
  NEW_EMAIL_VERIFICATION = 8,
  NEW_PHONE_VERIFICATION = 9,
  USER_SECURITY_QUESTION_UPDATE = 10,
  DEVICE_VERIFICATION_ENABLE_DISABLE = 11,
  LOGIN_TWOFA_ENABLE_DISABLE = 12,
  RESET_ANTI_PHISHING_CODE = 13,
  LOGOUT_FROM_OTHER_DEVICE = 14,
  DISABLE_ACCOUNT = 15,
  USER_WITHDRAWAL_ADDRESS_CREATE = 16,
  USER_WITHDRAWAL_ADDRESS_DELETE = 17,
  USER_WITHDRAWAL_BALANCE = 18,
  USER_PAYMENT_METHOD_CRUD = 19,
  GIFT_CARD_SEND = 20,
}

// export enum DEVICE_TYPE {
//   WEB = 1,
//   MOBILE = 2,
// }

export enum DEVICE_TYPE {
  UNKNOWN = 'unknown',
  DESKTOP = 'desktop',
  SMARTPHONE = 'smartphone',
  MOBILE = 'mobile',
  TABLET = 'tablet',
  TELEVISION = 'television',
  SMART_DISPLAY = 'smart display',
  CAMERA = 'camera',
  CAR = 'car',
  CONSOLE = 'Console',
  PROTABLE_MEDIA_PLAYER = 'portable media player',
  PHABLET = 'phablet',
  WEARABLE = 'wearable',
  SMART_SPEAKER = 'smart speaker',
  FEATURE_PHONE = 'feature phone',
  PERIPHERAL = 'peripheral',
}

export enum SECURITY_RESET_STATUS {
  PROCESSING = 0,
  PENDING = 1,
  EXPIRED = 2,
  DONE = 3,
  FAILED = 4,
  REJECT = 5,
}

export enum SECURITY_RESET_STEPS {
  STEP_1_REQUESTED = 1,
  STEP_2_RESET_SUBMIT = 2,
  STEP_3_ANSWER_VERIFIED = 3,
}

export enum ACTIVITY_EVENT {
  LOGIN = 1,
  SECURITY = 2,
}

export enum ACTIVITY {
  //event login
  LOGIN = 1,
  LOGOUT = 2,

  //event security
  NEW_DEVICE_VERIFICATION = 3,
  RESET_PASSWORD = 4,
  CHANGE_PASSWORD = 5,
  RESET_SECURITY_METHOD = 6,
  RESET_CREDENTIAL = 7,
  RESET_ANTI_PHISHING_CODE = 8,
  DEVICE_VERIFICATION_ENABLE_DISABLE = 9,
  LOGIN_TWOFA_ENABLE_DISABLE = 10,
  USER_SECURITY_QUESTION_UPDATE = 11,
  KYC_VERIFICATION = 12,
  LOGOUT_FROM_OTHER_DEVICE = 13,
  DISABLE_ACCOUNT = 14,
}

export const MAXIMUM_RESET_VALUE_TRIES = 3;
export const MAXIMUM_ANSWER_TRIES = 3;

export enum ACTION {
  PROCESSING = 0,
  ACCEPT = 1,
  REJECT = 2,
  FAILED = 3,
  REFUND = 4,
  COMPLETE = 5,
  CANCEL = 6,
}

export enum SECURITY_QUESTION_LIMIT {
  MINIMUM = 1,
  MAXIMUM = 5,
}

export enum KYC_LEVEL {
  ID_VERIFICATION = 1,
  ADDRESS_VERIFICATION = 2,
}

export const RESET_SECURITY_EXPIRATION_IN_MINUTE = 15;
export const RESET_CREDENTIAL_EXPIRATION_IN_MINUTE = 15;

export enum FILESYSTEM_DISK {
  LOCAL = 'local',
  AWS_S3 = 's3',
}

export enum STREAMMING_TYPE {
  STREAM = 'stream',
  BUFFER = 'buffer',
}

export enum DB_QUERY_DEFAULT {
  ORDER_FIELD = 'updated_at',
  ORDER_DIRECTION = 'desc',
  LIMIT = 10,
  OFFSET = 0,
}

export enum APP_DEFAULT {
  LANG = 'en',
  CURRENCY_CODE = 'USD',
  CURRENCY_SYMBOL = '$',
  COUNTRY_CODE = 'US',
  CRYPTO_CODE = 'BTC',
  CURRENCY_PAIR = 'BTC_USDT',
  FUTURES_CURRENCY_PAIR = 'BTCUSDT',
  FIAT_VISUAL_DECIMAL = 8,
  CRYPTO_VISUAL_DECIMAL = 8,
  MAX_PENDING_ISSUE = 2,
  WALLET_ACTIVITY_HISTORY_DATA_MAX_LIMIT = 100,
}

export enum DEFAULT_DECIMAL {
  FIAT_CURRENCY = 8,
  CRYPTO_CURRENCY = 18,
}

export enum FEE_TYPE {
  PERCENTAGE = 1,
  FIXED = 2,
}

export enum WALLET_TYPE {
  SPOT = 1,
  FUNDING = 2,
  FUTURES = 3,
}

export enum TRADE_TYPE {
  SPOT = 1,
  P2P = 2,
  MARGIN = 3,
  FUTURE = 4,
}

export enum WALLET_ACTIVITY_TX_TYPE {
  CREDIT = 1,
  DEBIT = 2,
}

export enum EVENT_MODEL {
  DEPOSIT = 1,
  WITHDRAWAL = 2,
  SPOT_BUY_ORDER = 3,
  SPOT_SELL_ORDER = 4,
  TRADE = 5,
  BONUS = 6,
  CONVERT_BUY_SELL_CRYPTO = 7,
  USER_GIFT_CARD = 8,
  GIFT_CARD_TRANSFER = 9,
  WALLET_TRANSFER = 10,
  P2P_ADVERTISEMENT = 11,
  P2P_ORDER = 12,
  P2P_ORDER_REPORT = 13,
  FUTURES_TRADE = 14,
  FUTURES_POSITION = 15,
}

export enum WALLET_ACTIVITY_HISTORY_TYPE {
  DEPOSIT = 1,
  WITHDRAWAL = 2,
  DEPOSIT_WITHDRAWAL = 3,
  SPOT_BUY_ORDER = 4,
  SPOT_SELL_ORDER = 5,
  SPOT_TRADE = 6,
  SPOT_ORDER_TRADE = 7,
  BONUS = 8,
  CONVERT_BUY_SELL_CRYPTO = 9,
  GIFT_CARD = 10,
  WALLET_TRANSFER = 11,
  P2P_ADV_ORDER = 12,
  FUTURES_TRADE = 13,
}

export enum WALLET_ACTIVITY_TITLE {
  DEPOSIT = 'Deposit Received',
  WITHDRAWAL = 'Withdrawal Placed',
  ORDER_PLACED = 'Order Placed',
  ORDER_CANCELLED = 'Order Cancelled',
  TRADE = 'Trade Occurred',
  REFERRAL_SIGNUP_BONUS = 'Referral Signup Bonus Received',
  DEPOSIT_BONUS = 'Deposit Bonus Received',
  WITHDRAWAL_BONUS = 'Withdrawal Bonus Received',
  TRADE_BONUS = 'Trade Bonus Received',
  CONVERT_PLACED = 'Convert Placed',
  CONVERT = 'Convert Success',
  CONVERT_CANCELLED = 'Convert Cancelled',
  CONVERT_EXPIRED = 'Convert Expired',
  IN_ORDER_AMOUNT_SETTLEMENT = 'In Order Amount Settlement',
  BUY_CRYPTO = 'Buy Crypto Success',
  SELL_CRYPTO = 'Sell Crypto Success',
  GIFT_CARD_CREATED = 'Gift Card Created',
  GIFT_CARD_SENT = 'Gift Card Sent',
  GIFT_CARD_REDEEMED = 'Gift Card Redeemed',
  WALLET_TRANSFERRED = 'Wallet Transferred',
  P2P_ADVERTISEMENT_CREATED = 'P2P Adv Created',
  P2P_ADVERTISEMENT_UPDATED = 'P2P Adv Updated',
  P2P_ADVERTISEMENT_CLOSED = 'P2P Adv Closed',
  P2P_ORDER_PLACED = 'P2P Order Placed',
  P2P_ORDER_CANCELLED = 'P2P Order Cancelled',
  P2P_ORDER_COMPLETED = 'P2P Order Completed',
  WALLET_TRANSFER_P2P_ORDER_REPORT = 'Wallet Transferred for P2P Order Report',
  FUTURES_TRADE = 'Futures Trade Occurred',
  FUTURES_TRADE_REALIZED_PNL = 'Futures Trade Pnl Realized',
  FUTURES_TRADE_LIQUIDATED = 'Futures Trade Liquidated',
  FUTURES_TRADE_FUNDING_FEE_ADJUSTED = 'Futures Trade Funding Fee Adjusted',
}

export enum WALLET_ACTIVITY_DESCRIPTION {
  DEPOSIT_BALANCE_CREDIT = 'Balance Credited Due to Deposit Event',
  WITHDRAWAL_BALANCE_DEBIT = 'Balance Debited Due to Withdrawal Event',
  WITHDRAWAL_BALANCE_REFUNDED_BY_ADMIN = 'Balance Refunded Due to Refund Action By Admin',
  WITHDRAWAL_BALANCE_REFUNEDED_FOR_REJECTED = 'Balance Refunded Due to Withdrawal Rejected by Admin',
  WITHDRAWAL_BALANCE_REFUNEDED_FOR_FAILED = 'Balance Refunded Due to Withdrawal Failed',
  WITHDRAWAL_BALANCE_REFUNEDED_FOR_CANCELLED = 'Balance Refunded Due to Withdrawal Cancelled',
  DEPOSIT_BALANCE_ROLLBACKED_FOR_INTERNAL_WITHDRAWAL_FAILED = 'Deposit Balance Rollbacked Due to Internal Withdrawal Failed',
  DEPOSIT_BALANCE_REFUNEDED_FOR_FAILED = 'Balance Refunded Due to Deposit Failed',
  WITHDRAWAL_BALANCE_ROLLBACKED_FOR_INTERNAL_DEPOSIT_FAILED = 'Withdrawal Balance Rollbacked Due to Internal Deposit Failed',
  BUY_ORDER_BALANCE_DEBIT = 'Balance Debited Due to Buy Order Event',
  BUY_ORDER_BALANCE_CREDIT = 'Balance Credited Due to Buy Order Event',
  BUY_ORDER_CANCEL_BALANCE_CREDIT = 'Balance Credited Due to Buy Order Cancel Event',
  SELL_ORDER_BALANCE_DEBIT = 'Balance Debited Due to Sell Order Event',
  SELL_ORDER_BALANCE_CREDIT = 'Balance Credited Due to Sell Order Event',
  SELL_ORDER_CANCEL_BALANCE_CREDIT = 'Balance Credited Due to Sell Order Cancel Event',
  TRADE_BALANCE_CREDIT = 'Balance Credited Due to Trade Event',
  REFERRAL_SIGNUP_BONUS_CREDIT = 'Balance Credited Due to Referral Signup Bonus',
  DEPOSIT_BONUS_CREDIT = 'Balance Credited Due to Deposit Bonus',
  WITHDRAWAL_BONUS_CREDIT = 'Balance Credited Due to Withdrawal Bonus',
  TRADE_BONUS_CREDIT = 'Balance Credited Due to Trade Bonus',
  CONVERT_DEBIT = 'Balance Debited Due to Convert Placed',
  CONVERT_CREDIT = 'Balance Credited Due to Convert Success',
  CONVERT_CANCEL_BALANCE_CREDIT = 'Balance Credited Due to Convert Cancelled',
  CONVERT_EXPIRED_BALANCE_CREDIT = 'Balance Credited Due to Convert Expired',
  IN_ORDER_AMOUNT_SETTLEMENT = 'In Order Amount Mismatch Fixed',
  FIAT_DEPOSIT_BALANCE_CREDIT = 'Balance Credited Due to Fiat Deposit Event',
  BUY_CRYPTO_BALANCE_CREDIT = 'Balance Credited Due to Buy Crypto Event',
  BUY_CRYPTO_BALANCE_DEBIT = 'Balance Debited Due to Buy Crypto Event',
  SELL_CRYPTO_BALANCE_CREDIT = 'Balance Credited Due to Sell Crypto Event',
  SELL_CRYPTO_BALANCE_DEBIT = 'Balance Debited Due to Sell Crypto Event',
  GIFT_CARD_CREATE_BALANCE_DEBIT = 'Balance Debited Due to Gift Card Create Event',
  GIFT_CARD_SEND_BALANCE_DEBIT = 'Fee Balance Debited Due to Gift Card Send Event',
  GIFT_CARD_REDEEMED_BALANCE_CREDIT = 'Balance Credited Due to Gift Card Redeemed Event',
  WALLET_TRANSFER_BALANCE_CREDIT = 'Balance Credited Due to Wallet Transfer Event',
  WALLET_TRANSFER_BALANCE_DEBIT = 'Balance Debited Due to Wallet Transfer Event',
  P2P_ADVERTISEMENT_CREATE_BALANCE_DEBIT = 'Balance Debited Due to P2P Adv Create Event',
  P2P_ADVERTISEMENT_UPDATE_BALANCE_DEBIT = 'Balance Debited Due to P2P Adv Create Event',
  P2P_ADVERTISEMENT_CLOSE_BALANCE_CREDIT = 'Balance Credited Due to P2P Adv Closed Event',
  P2P_ORDER_PLACE_BALANCE_DEBIT = 'Balance Debited Due to P2P Order Placed Event',
  P2P_ORDER_COMPLETE_BALANCE_CREDIT = 'Balance Credited Due to P2P Order Complete Event',
  P2P_ORDER_CANCELLED_BALANCE_CREDIT = 'Balance Credited Due to P2P Order Cancelled Event',
  WALLET_TRANSFER_P2P_ORDER_REPORT_BALANCE_DEBIT = 'Balance Debited Due to P2P Order Report Wallet Transfer Event',
  WALLET_TRANSFER_P2P_ORDER_REPORT_BALANCE_CREDIT = 'Balance Credited Due to P2P Order Report Wallet Transfer Event',

  FUTURES_TRADE_COMMISSION_FEE_DEBIT = 'Commision Fee Debited Due to Futures Trade Event',
  FUTURES_TRADE_POSITION_CLOSE_BALANCE_CREDIT = 'Balance Credited Due to Futures Trade Position Close Event',
  FUTURES_TRADE_POSITION_CLOSE_BALANCE_DEBIT = 'Balance Debited Due to Futures Trade Position Close Event',
  FUTURES_TRADE_LIQUIDATION_BALANCE_DEBIT = 'Balance Debited Due to Futures Trade Liquidation Event',

  FUTURES_TRADE_FUNDING_FEE_DEBIT = 'Balance Debited Due to Futures Trade Funding Fee Debit Event',
  FUTURES_TRADE_FUNDING_FEE_CREDIT = 'Balance Credited Due to Futures Trade Funding Fee Credit Event',
}

export enum TRANSACTION_HISTORY_TYPE {
  DEPOSIT = 'deposits',
  WITHDRAWAL = 'withdrawals',
  TRANSFER = 'transfers',
}

export enum DAYS {
  ONE = 1,
  SEVEN = 7,
  FIFTEEN = 15,
  THIRTY = 30,
}

export enum DEPOSIT_STATUS {
  PENDING = 0,
  COMPLETED = 1,
  FAILED = 2,
  CANCELLED = 3,
}

export enum WITHDRAWAL_STATUS {
  PENDING = 0,
  AWAITING_FOR_APPROVAL = 1,
  PROCESSING = 2,
  SENT_TO_BLOCKCHAIN = 3, //for coin
  MONEY_SENT = 3, //for fiat
  COMPLETED = 4,
  FAILED = 5,
  REJECTED = 6,
  CANCELLED = 7,
}

export enum TRANSFER_TYPE {
  INTERNAL = 1,
  EXTERNAL = 2,
}

export enum WALLET_ISSUE_STATUS {
  PENDING = 1,
  IN_PROGRESS = 2,
  CLOSED = 3,
  RESOLVED = 4,
}

export enum NETWORK_WITHDRAWAL_ACCOUNT_TYPE {
  SYSTEM_WALLET = 1,
  COIN_POOL = 2,
}

export enum LOG_FILES {
  DEVICE_TYPE = 'device_type.log',
  NOTIFIER_SERVICE = 'notifier_service.log',
  EVENTS = 'events.log',
  WALLET_EVENTS = 'wallet_events.log',
  NOTIFIER = 'notifier.log',
  TOKEN_NOTIFIER = 'token_notifier.log',
  DEPOSIT = 'deposit.log',
  ADMIN_DEPOSIT = 'admin_deposit.log',
  WALLET_BALANCE_UPDATE = 'wallet_balance_update.log',
  WITHDRAWAL = 'withdrawal.log',
  NETWORK_WITHDRAWAL = 'network_withdrawal.log',
  BLOCK_PROCESSING = 'block_processing.log',
  WALLET_ISSUE_AUTOMATION = 'issue_automation.log',
  COIN_POOL = 'coin_pool.log',
  TRADE = 'trade.log',
  SYSTEM_REVENUE = 'system_revenue.log',
  BONUS = 'bonus.log',
  BULK_MAIL = 'bulk-mail.log',
  SYSTEM_TRADING_BOT = 'system_trading_bot.log',
  CHART_DATA_LOG = 'chart_data.log',
  CURRENCY_CONVERT_LOG = 'currency_convert.log',
  PAYMENT_LOG = 'payment.log',
  PAYMENT_WEBHOOK = 'payment_webhook.log',
  STRIPE_LOG = 'stripe.log',
  BRAINTREE_LOG = 'braintree.log',
  PAYPAL_LOG = 'paypal.log',
  GIFT_CARD = 'gift_card.log',
  WALLET_TRANSFER = 'wallet_transfer.log',
  P2P_LOG = 'p2p.log',
  FUTURES_TRADE_LOG = 'futures_trade.log',
}

export enum SYSTEM_SIGNAL {
  DO_NOT_REFUND = 'DO_NOT_REFUND',
  DO_NOT_FAIL = 'DO_NOT_FAIL',
}

export enum WITHDRAWAL_REASON_NOTE {
  WALLET_NOT_FOUND = 'System wallet not found',
  NETWORK_BALANCE_NOT_FOUND = 'System wallet not found for this Network',
  INSUFFICIENT_WALLET_BALANCE = 'System network balance is insufficient',
}

export const UPDATED_BY_SYSTEM = -1;

export enum ISSUE_AUTOMATION_ADMIN_MESSAGES {
  MIGHT_BE_INTERNAL_TX = 'Might be internal tx from smart contract or program.',
  MIGHT_BE_PENDING_IN_NODE = 'Might be still in pending queue in node.',
  MIGHT_BE_MULTIPLE_TRANSFER_IN_SAME_TX = 'Might be multiple internal transfer in same tx.',
  MIGHT_BE_SENT_WITHOUT_TRANSFER_EVENT = 'Might be sent internally without emitting Transfer Event.',
  OR_FAKE_ISSUE = 'or fake issue.',
  OR_WRONG_INFO = 'or wrong information.',
  CHECK_MANUALLY = 'Please check manually.',

  UNABLE_TO_FIND = 'Failed to find specific reason.',
  SYSTEM_FAILURE = 'System error happend, Check logs.',
  TX_NOT_FOUND = 'Tx ID/Hash not found in network.',
  TX_NOT_ADDED_IN_BLOCK = 'Tx ID/Hash not added in block yet.',
  WITHDRAWAL_MIGHT_FAILED = 'Withdrawal might be failed or reverted in blockchain. Please check...',
  TX_FAILED_IN_NETWORK = 'This transaction failed in network',
  DESTINATION_DOESNT_MATCH = "Destination address doesn't match with tx.",
  TX_OF_WRONG_TOKEN = 'Transaction of wrong token address.',
  AMOUNT_DOESNT_MATCH = "Amount doesn't match with tx.",
  MIGHT_BE_AMOUNT_MISMATCH = 'There might be amount mismatch. Please check ...',
  BLOCK_CONFIRMATION_NOT_MET = 'Block confirmation not met yet.',
  WE_ARE_BEHIND_IN_BLOCK_PROCESSING = 'We are behind in notifier block processing. Check the notifier block status.',
  VALID_ISSUE = 'All the data was valid.',
  WITHDRAWAL_PENDING_OR_FAILED = 'Check the Withdrawal Status. It is pending or stuck or failed.',
  SYSTEM_INTERNAL_TRANSACTION = 'This Transaction was created from System Wallet or Coin Pool. It will not be considered as User wallet balance deposit.',
}

export enum ISSUE_AUTOMATION_USER_MESSAGES {
  BLOCK_CONFIRMATION_NOT_MET = 'The Block Confirmation not met yet. Wait for the confirmation',
  DESPOISTED_SUCCESSFULLY = 'Your balance deposited successfully. Check your wallet',
  SYSTEM_INTERNAL_TRANSACTION = 'System Internal Transaction Found. You are not authorized of this. Invalid Issue!!',
}

export enum SYSTEM_MESSAGES {
  SYNC_MISSING_BALANCE = "If you have balance in blockchain, but can't see it here, then sync balance and try again.",
}

export enum ORDER_TYPE {
  BUY = 1,
  SELL = 2,
}

export enum ORDER_LIMIT_TYPE {
  LIMIT = 1,
  MARKET = 2,
  STOP_LIMIT = 3,
}

export enum ORDER_ACTION {
  INSERT = 1,
  UPDATE = 2,
  DELETE = 3,
}

export enum SPOT_ORDER_STATUS {
  PENDING = 0,
  OPEN = 1,
  COMPLETED = 2,
  FAILED = 3,
  CANCELLED = 4,
}

export enum CRUD_TYPE {
  INSERT = 1,
  UPDATE = 2,
  DELETE = 3,
}

export enum TRADE_FEE_TYPE {
  MAKER = 'Maker',
  TAKER = 'Taker',
}

export const PAIR_PRICE_FROM_LAST_TRADE_WILL_BE_VALID_TILL_HOURS_AGO = 1;

export enum MARKET_DATA_TYPE {
  SPOT = 1,
  FUTURE = 2,
}

export enum SYSTEM_REVENUE_TYPE {
  WITHDRAWAL = 1,
  TRADE = 2,
  CONVERT = 3,
  DEPOSIT = 4,
  BUY_CRYPTO = 5,
  SELL_CRYPTO = 6,
  GIFT_CARD = 7,
  P2P = 8,
  FUTURES_TRADE = 9,
}

export const SYSTEM_REVENUE_DEFAULT_SYNC_MONTH = 6;

export enum BALANCE_DEBIT_QUEUE {
  WITHDRAWAL = 1,
  SPOT_ORDER = 2,
  BOT_ORDER = 3,
  MARKET_CONVERT = 4,
  LIMIT_CONVERT = 5,
}

export enum CURRENCY_CONVERT_QUEUE {
  EXECUTE = 1,
  CANCELL = 2,
}

export enum MENU_POSITION {
  FOOTER_COLUMN_1 = 1,
  FOOTER_COLUMN_2 = 2,
  FOOTER_COLUMN_3 = 3,
  FOOTER_COLUMN_4 = 4,
  FOOTER_COLUMN_5 = 5,
}

export enum MENU_BIND_TYPE {
  HEADER = 0,
  URL = 1,
  PAGE = 2,
}

export enum NOTICE_TYPE {
  GENERAL_NOTICE = 1,
  SYSTEM_MESSAGE = 2,
  SYSTEM_ACTION_CMD = 3,
}

export enum GENERAL_NOTICE_ALERT_TYPE {
  WARNING = 1,
  INFO = 2,
  ERROR = 3,
}

export enum SYSTEM_ACTION_CMD {
  RELOAD = 1,
}

export const MAX_ACTIVE_NOTICE = 3;

export const BOT_WALLET_REFILL_BALANCE_AMOUNT = 100000;

export enum CONVERT_TYPE {
  MARKET = 1,
  LIMIT = 2,
}

export enum CONVERSION_FEATURES {
  CONVERT = 'convert',
  BUY_CRYPTO = 'buy_crypto',
  SELL_CRYPTO = 'sell_crypto',
}

export enum CURRENCY_CONVERT_DEFAULT_PAIR {
  FROM_CRYPTO = 'BTC',
  TO_CRYPTO = 'USDT',
}

export enum CURRENCY_CONVERT {
  PRICE_QUOTE_EXPIRATION_TIME_IN_SEC = 30,
  PRICE_QUOTE_REFRESH_TIMER_IN_SEC = 5,
}

export enum CURRENCY_CONVERT_STATUS {
  PENDING = 0,
  OPEN = 1,
  COMPLETED = 2,
  EXPIRED = 3,
  CANCELLED = 4,
  FAILED = 5,
}

export enum PAY_FORMULA {
  PAY_TO_SYSTEM = 'pay_to_system',
  PAY_TO_USER = 'pay_to_user',
}

export enum PAYMENT_TX_TYPE {
  ONLINE = 'online',
  MANUAL = 'manual',
}

export enum PAY_TO_SYSTEM_METHOD_TYPES {
  ONLINE_PAYMENT = 'online_payment',
  BANK_DEPOSIT = 'bank_deposit',
  WALLET_BALANCE = 'wallet_balance',
}

export enum PAY_TO_USER_METHOD_TYPES {
  PAYPAL = 'paypal',
  BANK = 'bank',
  MOBILE_BANKING = 'mobile_banking',
  DIGITAL_WALLET = 'digital_wallet',
  OTHERS = 'others',
}

export enum PAY_TO_SYSTEM_FEATURES {
  FIAT_DEPOSIT = 'fiat_deposit',
  BUY_CRYPTO = 'buy_crypto',
}

export enum PAY_TO_USER_FEATURES {
  FIAT_WITHDRAWAL = 'fiat_withdrawal',
  P2P = 'p2p',
}

export enum PAYMENT_GATEWAYS {
  STRIPE = 'stripe',
  BRAINTREE = 'braintree',
  PAYPAL = 'paypal',
}

export enum PAYMENT_STATUS {
  PENDING = 0,
  PROCESSING = 1,
  COMPLETED = 2,
  CANCELLED = 3,
  FAILED = 4,
}

export enum MANUAL_TX_STATUS {
  PENDING = 0,
  DOC_UPLOADED = 1,
  DOC_REJECTED = 2,
  COMPLETED = 3,
}

export enum GIFT_CARD_ACTION {
  CREATE = 1,
  SEND = 2,
}

export enum GIFT_CARD_STATUS {
  PENDING = 0,
  ACTIVE = 1,
  REDEEMED = 2,
}

export const ALERT_LAST_TIME_IN_MIN = 5;

export enum P2P_TYPE {
  BUY = 1,
  SELL = 2,
}

export enum P2P_ID_MUSK_PREFIX {
  ADV = 'ADV',
  ORD = 'ORD',
}

export enum USER_P2P_CONDITION_LIST {
  EMAIL_VERIFICATION = 'email_verified',
  PHONE_VERIFICATION = 'phone_verified',
  ID_VERIFICATION = 'identity_verified',
  ADDRESS_VERIFICATION = 'address_verified',
  TWO_FACTOR_AUTHENTICATION_ENABLED = 'login_twofa_enabled',
}

export enum P2P_FORM_VALIDATION {
  REMARKS_MAX_LENGTH = 1000,
  AUTO_REPLY_TEXT_MAX_LENGTH = 1000,
  REPORT_DESCRIPTION_MAX_LENGTH = 500,
  DISPUTE_DESCRIPTION_MAX_LENGTH = 500,
  CANCEL_DESCRIPTION_MAX_LENGTH = 500,
  CHAT_MAX_LENGTH = 500,
  FEEDBACK_MAX_LENGTH = 500,
}

export enum P2P_ADVERTISEMENT_STATUS {
  OFFLINE = 0,
  ONLINE = 1,
  COMPLETED = 2,
  CLOSED = 3,
}

export enum P2P_ADVERTISEMENT_ORDER {
  PRICE = 'price',
  TRADE = 'trade',
  COMPLETION_RATE = 'completion_rate',
}

export enum P2P_ORDER_STATUS {
  PROCESSING = 1,
  DISPUTED = 2,
  COMPLETED = 3,
  CANCELLED = 4,
  FAILED = 5,
}

export enum P2P_ORDER_PAYMENT_STATUS {
  PENDING = 0,
  EXPIRED = 1,
  WALLET_TRANSFERRED = 2,
  COMPLETED = 3,
  FAILED = 4,
}

export enum P2P_ORDER_DISPUTE_STATUS {
  PENDING = 0,
  STAFF_ASSIGNED = 1,
  IN_PROGRESS = 2,
  RELEASED = 3,
  REFUNDED = 4,
}

export enum P2P_ORDER_REPORT_STATUS {
  OPEN = 0,
  CLOSE = 1,
  RESOLVED = 2,
}

export enum P2P_ORDER_CANCEL_RESPONSIBLE_USER {
  BUYER = 1,
  SELLER = 2,
}

export enum P2P_REASON_EVENTS {
  ORDER_CANCEL = 1,
  ORDER_DISPUTE = 2,
  ORDER_REPORT = 3,
  BLOCK_USER = 4,
}

export enum P2P_ORDER_CANCEL_REASONS {
  DONOT_WANT_TO_TRADE = 1,
  DONOT_MEET_THE_REQUIREMENTS = 2,
  BUYER_OTHER_REASONS = 3,
  SELLER_ASKING_EXTRA_FEES = 4,
}

export enum P2P_ORDER_DISPUTE_REASONS {
  REASON_1 = 1,
  REASON_2 = 2,
  REASON_3 = 3,
}

export enum P2P_REPORT_REASONS {
  REASON_1 = 1,
  REASON_2 = 2,
  REASON_3 = 3,
}

export enum P2P_USER_BLOCK_REASONS {
  HARASSMENT = 1,
  BAD_CREDIBILITY = 2,
  MALICIOUS_FEEDBACK = 3,
  SCAM_SUSPICION = 4,
  OTHER = 5,
}
export enum P2P_USER_FOLLOW_TYPE {
  FOLLOWER = 1,
  FOLLOWING = 2,
}

export enum P2P_ORDER_FEEDBACK_TYPE {
  POSITIVE = 1,
  NEGATIVE = 2,
}

export enum P2P_ORDER_POSITIVE_FEEDBACK_TAGS {
  FAST_TRANSACTION = 1,
  POLITE_AND_FRIENDLY = 2,
  PATIENT = 3,
  SAFE_AND_TRUSTWORTHY = 4,
  GOOD_PRICE = 5,
}

export enum P2P_ORDER_NEGATIVE_FEEDBACK_TAGS {
  SLOW_TRANSACTION = 1,
  IMPOLITE = 2,
  IMPATIENT = 3,
  SUSPICIOUS_OR_SCAM = 4,
  CHARGED_EXTRA = 5,
}

export enum P2P_ORDER_ACTION {
  COMPLETE = 1,
  CANCEL = 2,
}

export enum P2P_ORDER_MESSAGE_TYPE {
  SYSTEM_MESSAGE = 1,
  USER_MESSAGE = 2,
  STAFF_MESSAGE = 3,
}

export enum P2P_ORDER_SYSTEM_MESSAGE {
  INITIAL = 'initial',
  TIME_ALMOST_END = 'time_almost_end',
  EPT_USED = 'ept_used',
  PAYMENT_NOTIFIED = 'payment_notified',
  ORDER_CANCELLED = 'order_cancelled',
  ORDER_COMPLETED = 'order_completed',
  ORDER_DISPUTED = 'order_disputed',
  WALLET_TRANSFER_FOR_ORDER_REPORT = 'wallet_transfer_for_order_report',
}

export enum P2P_ORDER_CANCEL_ACTION {
  BUYER = 1,
  EXPIRE = 2,
  STAFF = 3,
  REFUND = 4,
}

export enum P2P_ORDER_RELEASE_ACTION {
  SELLER = 1,
  STAFF = 2,
}

export enum FUTURES_TYPE {
  PERPETUAL = 1,
}

export enum FUTURES_COLLATERAL_TYPE {
  USDT_M = 1,
  COIN_M = 2,
}

export enum FUTURES_MARGIN_MODE {
  CROSS = 1,
  ISOLATED = 2,
}

export enum FUTURES_USDT_M_CURRENCY {
  USDT = 'USDT',
}

export enum FUTURES_ORDER_LIMIT_TYPE {
  LIMIT = 1,
  MARKET = 2,
  STOP_LIMIT = 3,
}

export enum FUTURES_ORDER_STATUS {
  PENDING = 0,
  OPEN = 1,
  PARTIALLY_FILLED = 2,
  FILLED = 3,
  CANCELLED = 4,
  FAILED = 5,
}

export enum FUTURES_ORDER_ACTION {
  INSERT = 1,
  UPDATE = 2,
  DELETE = 3,
  CANCELLED = 4,
}

export enum FUTURES_FUND_TRANSFER_WALLET_TYPE {
  SPOT_WALLET = 1,
  FUTURES_WALLET = 2,
}

export enum FUTURES_POSITION_STATUS {
  OPEN = 0,
  CLOSED = 1,
}

export enum FUTURES_POSITION_TYPE {
  BUY = 1,
  SELL = 2,
}

export enum FUTURES_POSITION_PROCESS_JOB_STATUS {
  START = 0,
  FINISHED = 1,
  FAILED = 2,
}

export enum FUTURES_POSITION_HISTORY_STATUS {
  CLOSED = 0,
  OPENED = 1,
  UPDATED = 2,
  LIQUIDATED = 3,
}

export enum FUTURES_TRANSACTION_TYPE {
  COMMISSION = 1,
  REALIZED_PNL = 2,
  FUNDING_FEE = 3,
}

export enum FUTURES_POSITION_TPSL_TYPE {
  TAKE_PROFIT = 1,
  STOP_LOSS = 2,
}

export enum FUTURES_POSITION_LIQUIDATION_ACTION {
  LIQUIDATION_PRICE = 1,
  MARGIN_RATIO = 2,
}
