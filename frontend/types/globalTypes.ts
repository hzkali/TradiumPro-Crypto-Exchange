// Exchange

import { CURRENCYPAIR_ITMES_TYPE } from "components/currency_pairs/CurrencyPairs.component.type";
import {
  FUTURES_TABLE_CONTENTS,
  FuturePositionListItemType,
} from "sections/futures/Futures.type";
import {
  F_FuturesCurrencyPairModel,
  FuturesCurrencyPairCrudSubsResponse,
  SpotTradeSubsRes,
} from "src/graphql/generated";
import {
  FUTURES_MARGIN_MODE,
  PAY_FORMULA,
} from "src/helpers/backend/backend.coreconstants";
import {
  TRADE_COLOR_DIRECTIONS,
  TRADE_COLOR_PREFERENCE,
  TRADE_LAYOUT_TYPES,
  TRADE_ORDER_VIEWS,
  TRADE_STYLE_SETTINGS,
} from "src/helpers/coreconstants";

// Component based

export interface CardType {
  className: string;
  item: CardItemType;
}

interface CardItemType {
  image: string;
  image2x: string;
  stage: string;
  title: string;
  content: string;
  url: string;
}

export interface CustomImageType {
  className?: string;
  src: string;
  srcDark: string;
  srcSet?: string;
  srcSetDark?: string;
  alt: string;
}

export interface ClassNameType {
  className?: string;
}

export type ToastMessageType =
  | "success"
  | "error"
  | "warning"
  | "errorMessage"
  | "info";

export interface SelectOptionType {
  label: JSX.Element | string;
  value: string | number | null;
}

export interface tradeSettingsStateType {
  styleSettings: TRADE_STYLE_SETTINGS;
  orderView: TRADE_ORDER_VIEWS;
  from_decimal: number;
  showAvg: boolean;
  basePrice: number;
  colorPreference: TRADE_COLOR_PREFERENCE;
  colorDirection: {
    up: TRADE_COLOR_DIRECTIONS;
    down: TRADE_COLOR_DIRECTIONS;
  };
  layoutType: TRADE_LAYOUT_TYPES;
  marketData: null | CURRENCYPAIR_ITMES_TYPE;
}

export interface futuresSettingsStateType {
  styleSettings: TRADE_STYLE_SETTINGS;
  orderView: TRADE_ORDER_VIEWS;
  basePrice: number;
  colorPreference: TRADE_COLOR_PREFERENCE;
  colorDirection: {
    up: TRADE_COLOR_DIRECTIONS;
    down: TRADE_COLOR_DIRECTIONS;
  };
  layoutType: TRADE_LAYOUT_TYPES;
  leverage: number;
  max_position_amount: null | number | string;
  marginMode: FUTURES_MARGIN_MODE;
  showMarginModeAndLeverageSettings: boolean;
  hideOtherSymbolStatus: {
    [FUTURES_TABLE_CONTENTS.POSITIONS]: boolean;
    [FUTURES_TABLE_CONTENTS.OPEN_ORDERS]: boolean;
    [FUTURES_TABLE_CONTENTS.ORDER_HISTORY]: boolean;
    [FUTURES_TABLE_CONTENTS.TRADE_HISTORY]: boolean;
    [FUTURES_TABLE_CONTENTS.POSITION_HISTORY]: boolean;
  };
  learnMoreSettings: {
    [key: string]: string;
  };
}

export interface futuresSettingsStateTypeWithoutLeverageAndMarginMode {
  styleSettings: TRADE_STYLE_SETTINGS;
  orderView: TRADE_ORDER_VIEWS;
  basePrice: number;
  colorPreference: TRADE_COLOR_PREFERENCE;
  colorDirection: {
    up: TRADE_COLOR_DIRECTIONS;
    down: TRADE_COLOR_DIRECTIONS;
  };
  layoutType: TRADE_LAYOUT_TYPES;
  showMarginModeAndLeverageSettings: boolean;
}

export interface futuresDataStateType {
  avbl: string | number;
  symbolDetails: F_FuturesCurrencyPairModel | null;
  sizeCurrency: string;
  min_bid_price?: number | undefined;
  max_ask_price?: number | undefined;
  costError: {
    buy: boolean;
    sell: boolean;
  };
  positions_list: FuturePositionListItemType[];
  futures_wallet_balance: number | string;
  futures_in_order_balance: number | string;
  futuresCurrencyPairSubsData: null | FuturesCurrencyPairCrudSubsResponse;
  myOrderTradeEventCount: number;
  futuresTradeSubsRes: null | SpotTradeSubsRes;
  symbolsList: F_FuturesCurrencyPairModel[];
  sumOfOrderAmounts: sumOfOrderAmountsType;
}

export type sumOfOrderAmountsType = {
  buy_order_amount: number;
  sell_order_amount: number;
  position_amount: number;
};

export interface TwoFaTypes {
  email_verify_code?: string;
  phone_verify_code?: string;
  gauth_verify_code?: string;
}

// generic use case filter type for currency data
export interface CurrencyFilterFields {
  // optionals
  status?: number;
  convert_status?: number;
  buy_crypto_status?: number;
  sell_crypto_status?: number;
  deposit_status?: number;
  p2p_status?: number;
  wallet_status?: number;
  withdrawal_status?: number;
  include_wallet?: boolean;
}

export interface CurrencyFilterWithPaymentFields extends CurrencyFilterFields {
  //required
  pay_formula: PAY_FORMULA;
}
