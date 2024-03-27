import {
  CONVERT_TYPE,
  DAYS,
  WALLET_TYPE,
} from "src/helpers/backend/backend.coreconstants";

const t = (str: string) => str;

export type State_Convert = {
  type: CONVERT_TYPE;
};

export type Action_Convert = { type: "setType"; v: CONVERT_TYPE };

export type State_Market = {
  showFromModal: boolean;
  showToModal: boolean;
  showPreview: boolean;
  from: null | CoinData;
  to: null | CoinData;
};

export interface State_Limit {
  showFromModal: boolean;
  showToModal: boolean;
  showPreview: boolean;
  from: null | CoinData;
  to: null | CoinData;
  showChart: boolean;
  showSettings: boolean;
  expireTime: DAYS;
  chartTime: ChartTimeType;
  chartCurrencyPair: CurrencyPairCachedForLimit | null;
  marketPrice: number;
}

export type Action_Market =
  | { type: "toggle_fromTo" }
  | { type: "toggle_showFromModal" }
  | { type: "toggle_showToModal" }
  | { type: "toggle_showPreview" }
  | { type: "update_from_to"; from: CoinData; to: CoinData }
  | { type: "update_from"; from: CoinData }
  | { type: "update_to"; to: CoinData };

export type Action_Limit =
  | { type: "toggle_fromTo" }
  | { type: "toggle_showFromModal" }
  | { type: "toggle_showToModal" }
  | { type: "toggle_showPreview" }
  | { type: "update_from_to"; from: CoinData; to: CoinData }
  | { type: "update_from"; from: CoinData }
  | { type: "update_to"; to: CoinData }
  | { type: "toggle_chart" }
  | { type: "update_chartTime"; time: ChartTimeType }
  | { type: "setExpireTime"; v: number }
  | { type: "toggle_settings_modal" }
  | { type: "update_chartCurrencyPair"; pair: CurrencyPairCachedForLimit }
  | { type: "update_marketPrice"; v: number };

export interface ConvertMarketFormType {
  from: number | string;
  to: number | string;
  wallet_type: string;
}

export interface ConvertLimitFormType {
  from: number | string;
  to: number | string;
  convert: number | string;
  wallet_type: string;
}

export interface CoinData {
  code?: string;
  max: number;
  min: number;
  balance_spot?: number;
  balance_funding?: number;
  convert_fee_type?: number | null;
  convert_fee?: number | null;
}

export enum ChartTimeType {
  DAY = 1,
  // WEEK = 7,
  // MONTH = 30,
}

export const chartTimeText: any = {
  [ChartTimeType.DAY]: t("24 Hours"),
  // [ChartTimeType.WEEK]: t("Week"),
  // [ChartTimeType.MONTH]: t("Month"),
};
export const chartTimeSmallText: any = {
  [ChartTimeType.DAY]: t("24H"),
  // [ChartTimeType.WEEK]: t("1W"),
  // [ChartTimeType.MONTH]: t("1M"),
};

export interface QuoteDataType {
  fee: string;
  from_amount: string;
  inverse_price: string;
  price: string;
  quote_id?: string;
  refresh_timer: number | null | undefined;
  status: number;
  to_amount: string;
  total_to_amount: string;
  user_will_get: string;
  user_will_spend: string;
  message?: string;
  success?: boolean;
}

export interface CurrencyPairCachedForLimit {
  base: string;
  trade: string;
  market_price: number;
  change: number;
  base_decimal: number;
  trade_decimal: number;
}
