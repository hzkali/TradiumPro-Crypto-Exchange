import {
  DEVICE_TYPE,
  EVENT_MODEL,
  P2P_ORDER_CANCEL_REASONS,
  P2P_ORDER_CANCEL_RESPONSIBLE_USER,
  P2P_ORDER_DISPUTE_REASONS,
  P2P_REPORT_REASONS,
  PAYMENT_GATEWAYS,
  PAY_TO_SYSTEM_METHOD_TYPES,
  PAY_TO_USER_METHOD_TYPES,
  REG_TYPE,
  SYSTEM_REVENUE_TYPE,
  USER_CREDENTIALS,
  VERIFICATION_CODE_EVENT,
  VERIFICATION_CODE_METHOD,
  WALLET_ACTIVITY_HISTORY_TYPE,
  WALLET_ISSUE_STATUS,
  WALLET_TYPE,
} from './coreconstants';

function __(str: string) {
  return str;
}

export const avatarList = [
  {
    id: 1,
    avatar_url: 'images/avatars/black-hat.png',
  },
  {
    id: 2,
    avatar_url: 'images/avatars/cap-man.png',
  },
  {
    id: 3,
    avatar_url: 'images/avatars/girl-avatar.png',
  },
  {
    id: 4,
    avatar_url: 'images/avatars/hat-avatar.png',
  },
  {
    id: 5,
    avatar_url: 'images/avatars/red-hat.png',
  },
  {
    id: 6,
    avatar_url: 'images/avatars/yellow-hat.png',
  },
];

export const countryList: any = {
  AF: 'Afghanistan',
  AL: 'Albania',
  DZ: 'Algeria',
  AS: 'American Samoa',
  AD: 'Andorra',
  AO: 'Angola',
  AI: 'Anguilla',
  AQ: 'Antarctica',
  AG: 'Antigua and Barbuda',
  AR: 'Argentina',
  AM: 'Armenia',
  AW: 'Aruba',
  AU: 'Australia',
  AT: 'Austria',
  AZ: 'Azerbaijan',
  BS: 'Bahamas',
  BH: 'Bahrain',
  BD: 'Bangladesh',
  BB: 'Barbados',
  BY: 'Belarus',
  BE: 'Belgium',
  BZ: 'Belize',
  BJ: 'Benin',
  BM: 'Bermuda',
  BT: 'Bhutan',
  BO: 'Bolivia (Plurinational State of)',
  BQ: 'Bonaire, Sint Eustatius and Saba',
  BA: 'Bosnia and Herzegovina',
  BW: 'Botswana',
  BV: 'Bouvet Island',
  BR: 'Brazil',
  IO: 'British Indian Ocean Territory',
  BN: 'Brunei Darussalam',
  BG: 'Bulgaria',
  BF: 'Burkina Faso',
  BI: 'Burundi',
  CV: 'Cabo Verde',
  KH: 'Cambodia',
  CM: 'Cameroon',
  CA: 'Canada',
  KY: 'Cayman Islands',
  CF: 'Central African Republic',
  TD: 'Chad',
  CL: 'Chile',
  CN: 'China',
  CX: 'Christmas Island',
  CC: 'Cocos (Keeling) Islands',
  CO: 'Colombia',
  KM: 'Comoros',
  CD: 'Congo (the Democratic Republic of the)',
  CG: 'Congo',
  CK: 'Cook Islands',
  CR: 'Costa Rica',
  HR: 'Croatia',
  CU: 'Cuba',
  CW: 'Curaçao',
  CY: 'Cyprus',
  CZ: 'Czechia',
  CI: "Côte d'Ivoire",
  DK: 'Denmark',
  DJ: 'Djibouti',
  DM: 'Dominica',
  DO: 'Dominican Republic',
  EC: 'Ecuador',
  EG: 'Egypt',
  SV: 'El Salvador',
  GQ: 'Equatorial Guinea',
  ER: 'Eritrea',
  EE: 'Estonia',
  SZ: 'Eswatini',
  ET: 'Ethiopia',
  FK: 'Falkland Islands [Malvinas]',
  FO: 'Faroe Islands',
  FJ: 'Fiji',
  FI: 'Finland',
  FR: 'France',
  GF: 'French Guiana',
  PF: 'French Polynesia',
  TF: 'French Southern Territories',
  GA: 'Gabon',
  GM: 'Gambia',
  GE: 'Georgia',
  DE: 'Germany',
  GH: 'Ghana',
  GI: 'Gibraltar',
  GR: 'Greece',
  GL: 'Greenland',
  GD: 'Grenada',
  GP: 'Guadeloupe',
  GU: 'Guam',
  GT: 'Guatemala',
  GG: 'Guernsey',
  GN: 'Guinea',
  GW: 'Guinea-Bissau',
  GY: 'Guyana',
  HT: 'Haiti',
  HM: 'Heard Island and McDonald Islands',
  VA: 'Holy See',
  HN: 'Honduras',
  HK: 'Hong Kong',
  HU: 'Hungary',
  IS: 'Iceland',
  IN: 'India',
  ID: 'Indonesia',
  IR: 'Iran (Islamic Republic of)',
  IQ: 'Iraq',
  IE: 'Ireland',
  IM: 'Isle of Man',
  IL: 'Israel',
  IT: 'Italy',
  JM: 'Jamaica',
  JP: 'Japan',
  JE: 'Jersey',
  JO: 'Jordan',
  KZ: 'Kazakhstan',
  KE: 'Kenya',
  KI: 'Kiribati',
  KP: "Korea (the Democratic People's Republic of)",
  KR: 'Korea (the Republic of)',
  KW: 'Kuwait',
  KG: 'Kyrgyzstan',
  LA: "Lao People's Democratic Republic",
  LV: 'Latvia',
  LB: 'Lebanon',
  LS: 'Lesotho',
  LR: 'Liberia',
  LY: 'Libya',
  LI: 'Liechtenstein',
  LT: 'Lithuania',
  LU: 'Luxembourg',
  MO: 'Macao',
  MG: 'Madagascar',
  MW: 'Malawi',
  MY: 'Malaysia',
  MV: 'Maldives',
  ML: 'Mali',
  MT: 'Malta',
  MH: 'Marshall Islands',
  MQ: 'Martinique',
  MR: 'Mauritania',
  MU: 'Mauritius',
  YT: 'Mayotte',
  MX: 'Mexico',
  FM: 'Micronesia (Federated States of)',
  MD: 'Moldova (the Republic of)',
  MC: 'Monaco',
  MN: 'Mongolia',
  ME: 'Montenegro',
  MS: 'Montserrat',
  MA: 'Morocco',
  MZ: 'Mozambique',
  MM: 'Myanmar',
  NA: 'Namibia',
  NR: 'Nauru',
  NP: 'Nepal',
  NL: 'Netherlands',
  NC: 'New Caledonia',
  NZ: 'New Zealand',
  NI: 'Nicaragua',
  NE: 'Niger',
  NG: 'Nigeria',
  NU: 'Niue',
  NF: 'Norfolk Island',
  MP: 'Northern Mariana Islands',
  NO: 'Norway',
  OM: 'Oman',
  PK: 'Pakistan',
  PW: 'Palau',
  PS: 'Palestine, State of',
  PA: 'Panama',
  PG: 'Papua New Guinea',
  PY: 'Paraguay',
  PE: 'Peru',
  PH: 'Philippines',
  PN: 'Pitcairn',
  PL: 'Poland',
  PT: 'Portugal',
  PR: 'Puerto Rico',
  QA: 'Qatar',
  MK: 'Republic of North Macedonia',
  RO: 'Romania',
  RU: 'Russian Federation',
  RW: 'Rwanda',
  RE: 'Réunion',
  BL: 'Saint Barthélemy',
  SH: 'Saint Helena, Ascension and Tristan da Cunha',
  KN: 'Saint Kitts and Nevis',
  LC: 'Saint Lucia',
  MF: 'Saint Martin (French part)',
  PM: 'Saint Pierre and Miquelon',
  VC: 'Saint Vincent and the Grenadines',
  WS: 'Samoa',
  SM: 'San Marino',
  ST: 'Sao Tome and Principe',
  SA: 'Saudi Arabia',
  SN: 'Senegal',
  RS: 'Serbia',
  SC: 'Seychelles',
  SL: 'Sierra Leone',
  SG: 'Singapore',
  SX: 'Sint Maarten (Dutch part)',
  SK: 'Slovakia',
  SI: 'Slovenia',
  SB: 'Solomon Islands',
  SO: 'Somalia',
  ZA: 'South Africa',
  GS: 'South Georgia and the South Sandwich Islands',
  SS: 'South Sudan',
  ES: 'Spain',
  LK: 'Sri Lanka',
  SD: 'Sudan',
  SR: 'Suriname',
  SJ: 'Svalbard and Jan Mayen',
  SE: 'Sweden',
  CH: 'Switzerland',
  SY: 'Syrian Arab Republic',
  TW: 'Taiwan',
  TJ: 'Tajikistan',
  TZ: 'Tanzania, United Republic of',
  TH: 'Thailand',
  TL: 'Timor-Leste',
  TG: 'Togo',
  TK: 'Tokelau',
  TO: 'Tonga',
  TT: 'Trinidad and Tobago',
  TN: 'Tunisia',
  TR: 'Turkey',
  TM: 'Turkmenistan',
  TC: 'Turks and Caicos Islands',
  TV: 'Tuvalu',
  UG: 'Uganda',
  UA: 'Ukraine',
  AE: 'United Arab Emirates',
  GB: 'United Kingdom of Great Britain and Northern Ireland',
  UM: 'United States Minor Outlying Islands',
  US: 'United States of America',
  UY: 'Uruguay',
  UZ: 'Uzbekistan',
  VU: 'Vanuatu',
  VE: 'Venezuela (Bolivarian Republic of)',
  VN: 'Viet Nam',
  VG: 'Virgin Islands (British)',
  VI: 'Virgin Islands (U.S.)',
  WF: 'Wallis and Futuna',
  EH: 'Western Sahara',
  YE: 'Yemen',
  ZM: 'Zambia',
  ZW: 'Zimbabwe',
  AX: 'Åland Islands',
};

export const addressDocumentType: { id: number; title: string }[] = [
  {
    id: 1,
    title: __('Municipality bill for uitlity services'),
  },
  {
    id: 2,
    title: __('Municipality rates & taxes statement'),
  },
  {
    id: 3,
    title: __('Internet service bill'),
  },
  {
    id: 4,
    title: __('Bank statement'),
  },
  {
    id: 5,
    title: __('Mortgage statement'),
  },
  {
    id: 6,
    title: __('Body corporate statement'),
  },
  {
    id: 7,
    title: __('Landline telephone bill'),
  },
];

export const REG_TYPE_METHOD = {
  [REG_TYPE.REGULAR]: 'Email/Phone Password',
  [REG_TYPE.GOOGLE]: 'Google',
  [REG_TYPE.APPLE]: 'Apple',
};

export const Credential_CodeMethod = {
  [USER_CREDENTIALS.EMAIL]: VERIFICATION_CODE_METHOD.EMAIL,
  [USER_CREDENTIALS.PHONE]: VERIFICATION_CODE_METHOD.SMS,
};

export const Credential_CodeEvent_NewVerify = {
  [USER_CREDENTIALS.EMAIL]: VERIFICATION_CODE_EVENT.NEW_EMAIL_VERIFICATION,
  [USER_CREDENTIALS.PHONE]: VERIFICATION_CODE_EVENT.NEW_PHONE_VERIFICATION,
};

export const APP_LANGS = ['en', 'es', 'bn'];

export const DEVICE_TYPES_FOR_MOBILE = [
  DEVICE_TYPE.FEATURE_PHONE,
  DEVICE_TYPE.PHABLET,
  DEVICE_TYPE.SMARTPHONE,
  DEVICE_TYPE.MOBILE,
];

export const walletActivityHistorySpecialCaseTypes = [
  WALLET_ACTIVITY_HISTORY_TYPE.DEPOSIT_WITHDRAWAL,
];

// prisma model name for dynamic data fetch
// for ex: model 'User' will be 'user'
export const RELATED_MODELS = {
  [EVENT_MODEL.DEPOSIT]: 'deposit',
  [EVENT_MODEL.WITHDRAWAL]: 'withdrawal',
  [EVENT_MODEL.SPOT_BUY_ORDER]: 'buyOrder',
  [EVENT_MODEL.SPOT_SELL_ORDER]: 'sellOrder',
  [EVENT_MODEL.TRADE]: 'trade',
  [EVENT_MODEL.BONUS]: 'bonusDistributionHistory',
  [EVENT_MODEL.CONVERT_BUY_SELL_CRYPTO]: 'currencyConvertHistory',
  [EVENT_MODEL.USER_GIFT_CARD]: 'userGiftCard',
  [EVENT_MODEL.GIFT_CARD_TRANSFER]: 'userGiftCardTransferHistory',
  [EVENT_MODEL.WALLET_TRANSFER]: 'userWalletTransferHistory',
  [EVENT_MODEL.P2P_ADVERTISEMENT]: 'p2PAdvertisement',
  [EVENT_MODEL.P2P_ORDER]: 'p2POrder',
  [EVENT_MODEL.P2P_ORDER_REPORT]: 'p2POrderReport',
  [EVENT_MODEL.FUTURES_TRADE]: 'futuresTrade',
  [EVENT_MODEL.FUTURES_POSITION]: 'futuresPosition',
};

export const relatedModelText = {
  [EVENT_MODEL.DEPOSIT]: 'Deposit',
  [EVENT_MODEL.WITHDRAWAL]: 'Withdrawal',
  [EVENT_MODEL.SPOT_BUY_ORDER]: 'Buy Order',
  [EVENT_MODEL.SPOT_SELL_ORDER]: 'Sell Order',
  [EVENT_MODEL.TRADE]: 'Trade',
  [EVENT_MODEL.BONUS]: 'Bonus',
  [EVENT_MODEL.CONVERT_BUY_SELL_CRYPTO]: 'Convert, Buy & Sell Crypto',
  [EVENT_MODEL.USER_GIFT_CARD]: 'User Gift Card',
  [EVENT_MODEL.GIFT_CARD_TRANSFER]: 'User Gift Card Transfer',
  [EVENT_MODEL.WALLET_TRANSFER]: 'User Wallet Transfer',
  [EVENT_MODEL.P2P_ADVERTISEMENT]: 'P2P Advertisement',
  [EVENT_MODEL.P2P_ORDER]: 'P2P Order',
  [EVENT_MODEL.P2P_ORDER_REPORT]: 'P2P Report',
  [EVENT_MODEL.FUTURES_TRADE]: 'Futures Trade',
  [EVENT_MODEL.FUTURES_POSITION]: 'Futures Position',
};

export const walletIssueStatus: any = {
  [WALLET_ISSUE_STATUS.PENDING]: 'Pending',
  [WALLET_ISSUE_STATUS.IN_PROGRESS]: 'In Progress',
  [WALLET_ISSUE_STATUS.RESOLVED]: 'Resolved',
  [WALLET_ISSUE_STATUS.CLOSED]: 'Closed',
};

export const walletTypeText: any = {
  [WALLET_TYPE.SPOT]: 'Spot',
  [WALLET_TYPE.FUNDING]: 'Funding',
  [WALLET_TYPE.FUTURES]: 'Futures',
};

export const CANDLE_INTERVALS = [
  // in minutes
  '1',
  '3',
  '5',
  '15',
  '30',
  '60',
  '120',
  '240',
  '360',
  '480',
  '720',
  //

  '1m',
  '3m',
  '5m',
  '15m',
  '30m',
  '1h',
  '2h',
  '4h',
  '6h',
  '8h',
  '12h',
  '1D',
  '3D',
  '1W',
  '1M',
];
export const systemRevenueTypeText = {
  [SYSTEM_REVENUE_TYPE.WITHDRAWAL]: 'withdrawal',
};

// export const commonExchangeList = ['binance', 'kucoin', 'poloniex', 'coinbase'];

export const commonExchangeList = [
  // 'aax',
  'binanceus',
  // 'bitflyer',
  'bybit',
  // 'btcmarkets',
  'binance',
  // 'bitbank',
  'bittrex',
  'bitfinex',
  // 'bithumb',
  // 'bitmex',
  'bitso',
  'bitstamp',
  'cexio',
  'coinbase',
  // 'coinone',
  // 'coinspro',
  // 'deribit',
  // 'erisx',
  // 'ftx',
  // 'gemini',
  // 'hitbtc',
  // 'huobi',
  // 'huobifutures',
  // 'itbit',
  // 'korbit',
  // 'kraken',
  'kucoin',
  // 'lmax',
  // 'okcoin',
  'okex',
  'poloniex',
];

export const IgnoredPayMethodTypesToCreateMethod = [
  PAY_TO_USER_METHOD_TYPES.PAYPAL,
];

export const IgnoredGatewaysForPayToSystemSettings = [PAYMENT_GATEWAYS.PAYPAL];

export const IgnoredPayMethodTypesForFiatDeposit = [
  PAY_TO_SYSTEM_METHOD_TYPES.WALLET_BALANCE,
];

export const OnlinePayMethodTypes = [
  PAY_TO_SYSTEM_METHOD_TYPES.ONLINE_PAYMENT,
  PAY_TO_USER_METHOD_TYPES.PAYPAL,
];

export const ManualPayMethodTypes = [
  PAY_TO_SYSTEM_METHOD_TYPES.BANK_DEPOSIT,
  PAY_TO_USER_METHOD_TYPES.BANK,
  PAY_TO_USER_METHOD_TYPES.MOBILE_BANKING,
];

export const orderCancelReasons: {
  id: number;
  responsible: number;
  title: string;
}[] = [
  {
    id: P2P_ORDER_CANCEL_REASONS.DONOT_WANT_TO_TRADE,
    responsible: P2P_ORDER_CANCEL_RESPONSIBLE_USER.BUYER,
    title: __('I do not want to trade anymore'),
  },
  {
    id: P2P_ORDER_CANCEL_REASONS.DONOT_MEET_THE_REQUIREMENTS,
    responsible: P2P_ORDER_CANCEL_RESPONSIBLE_USER.BUYER,
    title: __("I do not meet the requirements of the advertiser's trading"),
  },
  {
    id: P2P_ORDER_CANCEL_REASONS.BUYER_OTHER_REASONS,
    responsible: P2P_ORDER_CANCEL_RESPONSIBLE_USER.BUYER,
    title: __('Others'),
  },
  {
    id: P2P_ORDER_CANCEL_REASONS.SELLER_ASKING_EXTRA_FEES,
    responsible: P2P_ORDER_CANCEL_RESPONSIBLE_USER.SELLER,
    title: __('Seller is asking for extra fee'),
  },
];

export const orderReportReasons: {
  id: number;
  title: string;
}[] = [
  {
    id: P2P_REPORT_REASONS.REASON_1,
    title: __('Reason 1'),
  },
  {
    id: P2P_REPORT_REASONS.REASON_2,
    title: __('Reason 2'),
  },
  {
    id: P2P_REPORT_REASONS.REASON_2,
    title: __('Reason 3'),
  },
];

export const orderDisputeReasons: {
  id: number;
  title: string;
}[] = [
  {
    id: P2P_ORDER_DISPUTE_REASONS.REASON_1,
    title: __('Reason 1'),
  },
  {
    id: P2P_ORDER_DISPUTE_REASONS.REASON_2,
    title: __('Reason 2'),
  },
  {
    id: P2P_ORDER_DISPUTE_REASONS.REASON_2,
    title: __('Reason 3'),
  },
];
