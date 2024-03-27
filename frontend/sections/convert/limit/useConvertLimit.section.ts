import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import { useEffect, useReducer, useState } from "react";
import { useSelector } from "react-redux";
import { useGetValidCurrencyDataForLimitConvertQuery } from "src/graphql/generated";
import { APP_DEFAULT, DAYS } from "src/helpers/backend/backend.coreconstants";
import { SETTINGS_SLUG } from "src/helpers/backend/backend.slugcontanst";
import { QUERY_PARAM } from "src/helpers/coreconstants";
import { updateQueryParam } from "src/helpers/corefunctions";
import { useToast } from "src/hooks/useToast";
import { RootState } from "src/store";
import { Action_Limit, ChartTimeType, State_Limit } from "../Convert.type";

const initStateLimit: State_Limit = {
  showFromModal: false,
  showToModal: false,
  showPreview: false,
  from: null,
  to: null,
  showChart: true,
  showSettings: false,
  expireTime: DAYS.SEVEN,
  chartTime: ChartTimeType.DAY,
  chartCurrencyPair: null,
  marketPrice: 0,
};

function reducerFnConvertLimit(state: State_Limit, action: Action_Limit) {
  switch (action.type) {
    case "toggle_fromTo":
      return {
        ...state,
        from: state.to,
        to: state.from,
        // marketPrice: action.marketPrice,
      };
    case "toggle_showFromModal":
      return { ...state, showFromModal: !state.showFromModal };
    case "toggle_showToModal":
      return { ...state, showToModal: !state.showToModal };
    case "toggle_showPreview":
      return { ...state, showPreview: !state.showPreview };
    case "update_from_to":
      return { ...state, from: action.from, to: action.to };
    case "update_from":
      return { ...state, from: action.from };
    case "update_to":
      return { ...state, to: action.to };
    case "toggle_chart":
      return { ...state, showChart: !state.showChart };
    case "update_chartTime":
      return { ...state, chartTime: action.time };
    case "setExpireTime":
      return { ...state, expireTime: action.v };
    case "toggle_settings_modal":
      return { ...state, showSettings: !state.showSettings };
    case "update_chartCurrencyPair":
      return { ...state, chartCurrencyPair: action.pair };
    case "update_marketPrice":
      return { ...state, marketPrice: action.v };
    default:
      return state;
  }
}

export const useConvertLimit = (refetchBalance: boolean) => {
  const { t } = useTranslation("common");

  const { customToast } = useToast();
  const router = useRouter();

  const currencyPair = String(router.query[QUERY_PARAM.CURRENCY_PAIR]);
  const currencyPairArr = currencyPair.split("_");
  const [_fromCoin, _toCoin] = [currencyPairArr[0], currencyPairArr[1]];

  const appSettings = useSelector(
    (state: RootState) => state.appSettings?.appSettings
  );
  const decimalConvert =
    (appSettings &&
      appSettings[SETTINGS_SLUG.CURRENCY_DECIMAL_VALUE_FOR_CONVERT]) ||
    APP_DEFAULT.CRYPTO_VISUAL_DECIMAL;

  const [state, dispatch] = useReducer(reducerFnConvertLimit, initStateLimit);

  const [fromCoin, setFromCoin] = useState<string>("");
  const [toCoin, setToCoin] = useState<string>("");

  const [pairChanged, setPairChanged] = useState<boolean>(false);

  useEffect(() => {
    const prevPair = `${fromCoin}_${toCoin}`;
    if (prevPair != currencyPair) {
      setFromCoin(_fromCoin);
      setToCoin(_toCoin);
      setPairChanged(true);
    }
  }, [currencyPair]);

  const updatePair = (from: string, to: string) => {
    setPairChanged(false);
    updateQueryParam(QUERY_PARAM.CURRENCY_PAIR, `${from}_${to}`);
  };

  const { isLoading: isLoadingValidData, refetch: refetchValidCurrencyData } =
    useGetValidCurrencyDataForLimitConvertQuery(
      {
        from_currency_code: String(fromCoin),
        to_currency_code: String(toCoin),
      },
      {
        retry: false,
        enabled: pairChanged,
        onError: (err) => {
          customToast(err, "error");
        },
        onSuccess: ({ data }) => {
          const { currency_pair, from_currency, to_currency } = data;

          if (from_currency && to_currency) {
            dispatch({
              type: "update_from",
              from: {
                code: from_currency?.code,
                max: Number(from_currency?.max_convert_amount),
                min: Number(from_currency?.min_convert_amount),
                balance_spot: from_currency?.spot_available_balance,
                balance_funding: from_currency?.funding_available_balance,
                convert_fee_type: Number(from_currency?.convert_fee_type),
                convert_fee: Number(from_currency?.convert_fee),
              },
            });
            dispatch({
              type: "update_to",
              to: {
                code: to_currency?.code,
                max: Number(to_currency?.max_convert_amount),
                min: Number(to_currency?.min_convert_amount),
                balance_spot: to_currency?.spot_available_balance,
                balance_funding: to_currency?.funding_available_balance,
                convert_fee_type: Number(to_currency?.convert_fee_type),
                convert_fee: Number(to_currency?.convert_fee),
              },
            });
            if (currency_pair) {
              dispatch({
                type: "update_chartCurrencyPair",
                pair: {
                  base: currency_pair.base,
                  trade: currency_pair.trade,
                  base_decimal: Number(currency_pair.base_decimal),
                  trade_decimal: Number(currency_pair.trade_decimal),
                  market_price: Number(currency_pair.market_price),
                  change: Number(currency_pair.change),
                },
              });
              dispatch({
                type: "update_marketPrice",
                v: Number(currency_pair.market_price),
              });

              setFromCoin(from_currency?.code ?? "");
              setToCoin(to_currency?.code ?? "");
              updatePair(from_currency?.code ?? "", to_currency?.code ?? "");
            }
          }
        },
      }
    );

  useEffect(() => {
    if (refetchBalance) {
      refetchValidCurrencyData();
    }
  }, [refetchBalance]);

  return {
    state,
    dispatch,
    isLoadingValidData,
    decimalConvert,
    updatePair,
  };
};
