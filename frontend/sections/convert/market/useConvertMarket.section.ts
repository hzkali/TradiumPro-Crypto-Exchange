import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import { useEffect, useReducer, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import {
  MarketCurrencyQuoteDto,
  useGetCurrencyConvertQuoteQuery,
  useGetCurrencyListForMarketConvertQuery,
  useGetMarketCurrencyDataByCodeQuery,
  useMarketCurrencyConvertMutation,
} from "src/graphql/generated";
import {
  APP_DEFAULT,
  STATUS_EXPIRED,
  WALLET_TYPE,
} from "src/helpers/backend/backend.coreconstants";
import { SETTINGS_SLUG } from "src/helpers/backend/backend.slugcontanst";
import {
  DEBOUNCE_TIME,
  LIMITS_FRONTEND,
  QUERY_PARAM,
} from "src/helpers/coreconstants";
import {
  formatAmountDecimal,
  updateQueryParam,
} from "src/helpers/corefunctions";
import { useToast } from "src/hooks/useToast";
import { RootState } from "src/store";
import { useDebounce } from "use-debounce";
import {
  Action_Market,
  ConvertMarketFormType,
  QuoteDataType,
  State_Market,
} from "../Convert.type";

const initStateMarket: State_Market = {
  showFromModal: false,
  showToModal: false,
  showPreview: false,
  from: null,
  to: null,
};

function reducerFnConvertMarket(state: State_Market, action: Action_Market) {
  switch (action.type) {
    case "toggle_fromTo":
      return {
        ...state,
        from: state.to,
        to: state.from,
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
    default:
      return state;
  }
}

export const useConvertMarket = (refetchBalance: boolean) => {
  const { t } = useTranslation("common");

  const { customToast } = useToast();

  const router = useRouter();
  const currencyPair = String(router.query[QUERY_PARAM.CURRENCY_PAIR]).split(
    "_"
  );
  const [_fromCoin, _toCoin] = [currencyPair[0], currencyPair[1]];

  const appSettings = useSelector(
    (state: RootState) => state.appSettings?.appSettings
  );
  const cryptoDecimalValueForConvert =
    (appSettings &&
      appSettings[SETTINGS_SLUG.CURRENCY_DECIMAL_VALUE_FOR_CONVERT]) ||
    APP_DEFAULT.CRYPTO_VISUAL_DECIMAL;

  const decimalWallet =
    (appSettings &&
      appSettings[SETTINGS_SLUG.WALLET_BALANCE_DECIMAL_FOR_VISUAL]) ||
    APP_DEFAULT.CRYPTO_VISUAL_DECIMAL;

  const [state, dispatch] = useReducer(reducerFnConvertMarket, initStateMarket);

  const spotBalanceFrom = state.from?.balance_spot || 0;
  const fundingBalanceFrom = state.from?.balance_funding || 0;

  const spotBalanceTo = state.to?.balance_spot || 0;
  const fundingBalanceTo = state.to?.balance_funding || 0;

  // console.log("conv: state ", { ...state });

  const {
    isLoading,
    isSuccess,
    data: dataQuery,
    refetch: refetchMarketCurrencyDataByCode,
  } = useGetMarketCurrencyDataByCodeQuery(
    {
      from_currency_code: String(_fromCoin),
      to_currency_code: String(_toCoin),
    },
    {
      retry: false,
      enabled: !!(_fromCoin && _toCoin),
      onError: (err) => {
        customToast(err, "error");
      },
      onSuccess: ({ data }) => {
        const [_from, _to] = [data.from_currency, data.to_currency];

        if (_from && _to) {
          dispatch({
            type: "update_from",
            from: {
              code: _from?.code,
              max: Number(_from?.max_convert_amount),
              min: Number(_from?.min_convert_amount),
              balance_spot: _from?.spot_available_balance,
              balance_funding: _from?.funding_available_balance,
            },
          });
          dispatch({
            type: "update_to",
            to: {
              code: _to?.code,
              max: Number(_to?.max_convert_amount),
              min: Number(_to?.min_convert_amount),
              balance_spot: _to?.spot_available_balance,
              balance_funding: _to?.funding_available_balance,
            },
          });

          updateQueryParam(QUERY_PARAM.CURRENCY_PAIR, String(data?.pair));
        }
      },
    }
  );

  const notValidCurrency =
    isSuccess &&
    (!dataQuery?.data.from_currency || !dataQuery?.data.to_currency);

  const {
    control,
    register,
    handleSubmit,
    getValues,
    setValue,
    watch,
    formState: { errors, isValid },
    reset,
    resetField,
    setError,
    clearErrors,
  } = useForm<ConvertMarketFormType>({
    mode: "all",
    defaultValues: {
      from: "",
      to: "",
      wallet_type: String(WALLET_TYPE.SPOT),
    },
  });

  const values = watch();
  const wallet_type = Number(values.wallet_type);
  const fromAmount = values.from;

  const previewDisable =
    (!values.from && !values.to) ||
    !!errors.from?.message ||
    !!errors.to?.message;

  const onSubmit = async (payload: ConvertMarketFormType) => {
    console.log("conv: ", payload);
  };

  const handleShowPreview = async () => {
    dispatch({ type: "toggle_showPreview" });
  };

  const handleToggleFromTo = () => {
    updateQueryParam(
      QUERY_PARAM.CURRENCY_PAIR,
      `${state.to?.code}_${state.from?.code}`
    );

    reset();
  };

  const handleUpdateCurrency = (coinCode: string, type: "from" | "to") => {
    if (type == "from") {
      if (coinCode == state.to?.code) {
        handleToggleFromTo();
        dispatch({ type: "toggle_showFromModal" });
      } else {
        updateQueryParam(
          QUERY_PARAM.CURRENCY_PAIR,
          `${coinCode}_${state.to?.code}`
        );

        resetField("from");
        dispatch({ type: "toggle_showFromModal" });
      }
    }

    if (type == "to") {
      if (coinCode == state.from?.code) {
        handleToggleFromTo();
        dispatch({ type: "toggle_showToModal" });
      } else {
        updateQueryParam(
          QUERY_PARAM.CURRENCY_PAIR,
          `${state.from?.code}_${coinCode}`
        );

        resetField("to");
        dispatch({ type: "toggle_showToModal" });
      }
    }
  };

  useEffect(() => {
    if (refetchBalance) {
      refetchMarketCurrencyDataByCode();
      reset();
    }
  }, [refetchBalance]);

  return {
    register,
    setValue,
    errors,
    values,
    resetField,
    setError,
    clearErrors,
    previewDisable,
    state,
    dispatch,
    handleUpdateCurrency,
    handleToggleFromTo,
    spotBalanceFrom,
    fundingBalanceFrom,
    spotBalanceTo,
    fundingBalanceTo,
    decimalWallet,
    handleShowPreview,
    isLoading,
    isSuccess,
    notValidCurrency,
    wallet_type,
    fromAmount,
  };
};

export const useConvertMarketModal = (
  state_market: State_Market,
  state_form: ConvertMarketFormType,
  walletType: WALLET_TYPE,
  onClose: () => void
) => {
  const { t } = useTranslation("common");

  const { customToast } = useToast();

  const appSettings = useSelector(
    (state: RootState) => state.appSettings?.appSettings
  );
  const cryptoDecimalValueForConvert =
    (appSettings &&
      appSettings[SETTINGS_SLUG.CURRENCY_DECIMAL_VALUE_FOR_CONVERT]) ||
    APP_DEFAULT.CRYPTO_VISUAL_DECIMAL;

  const [step, setStep] = useState(1);

  const { from, to } = state_market;
  const [fromCoin, toCoin] = [from?.code, to?.code];

  const [dataToSend, setDataToSend] = useState<MarketCurrencyQuoteDto>({
    amount: Number(state_form.from) || Number(state_form.to),
    amount_currency_code: state_form.from
      ? String(state_market.from?.code)
      : String(state_market.to?.code),
    from_currency_code: String(state_market.from?.code),
    to_currency_code: String(state_market.to?.code),
    wallet_type: walletType,
    quote_id: "",
  });

  const [quoteData, setQuoteData] = useState<null | QuoteDataType>(null);

  // enable api call
  const [enableQuery, setEnableQuery] = useState(true);

  // timer
  const [time, setTime] = useState<number>(0);
  // (Number(quoteData?.refresh_timer) + 1) * 1000 ||

  useEffect(() => {
    const update = () => {
      if (time) {
        if (time == 1000) {
          setTime(0);
        } else {
          setTime((prev) => (prev ? prev - 1000 : 0));
        }
      } else {
        return;
      }
    };

    const interval = setInterval(() => {
      // quoteData?.success &&
      //   quoteData?.status == CRYPTO_CONVERT_STATUS.ACTIVE &&
      update();
      // console.log("conv: time", time);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [time]);
  // quoteData?.refresh_timer

  // query
  const { isLoading: isLoadingQuote, isError: isErrorQuote } =
    useGetCurrencyConvertQuoteQuery(
      {
        data: dataToSend,
      },
      {
        retry: false,
        enabled: enableQuery,
        refetchInterval: (data) =>
          Number(data?.data.quote?.refresh_timer) * 1000 || false,
        onSuccess: async ({ data }) => {
          const quote = data.quote;

          setDataToSend((prev) => ({
            ...prev,
            quote_id: quote?.quote_id ? String(quote?.quote_id) : "",
          }));
          setQuoteData({
            fee: formatAmountDecimal(
              Number(quote?.fee),
              Number(cryptoDecimalValueForConvert),
              true
            ),
            from_amount: formatAmountDecimal(
              Number(quote?.from_amount),
              Number(cryptoDecimalValueForConvert),
              true
            ),
            inverse_price: formatAmountDecimal(
              Number(quote?.inverse_price),
              Number(cryptoDecimalValueForConvert),
              true
            ),
            price: formatAmountDecimal(
              Number(quote?.price),
              Number(cryptoDecimalValueForConvert),
              true
            ),
            quote_id: quote?.quote_id ? String(quote?.quote_id) : "",
            refresh_timer: quote?.refresh_timer,
            status: Number(quote?.status),
            to_amount: formatAmountDecimal(
              Number(quote?.to_amount),
              Number(cryptoDecimalValueForConvert),
              true
            ),
            user_will_get: formatAmountDecimal(
              Number(quote?.user_will_get),
              Number(cryptoDecimalValueForConvert),
              true
            ),
            total_to_amount: formatAmountDecimal(
              Number(quote?.total_to_amount),
              Number(cryptoDecimalValueForConvert),
              true
            ),
            user_will_spend: formatAmountDecimal(
              Number(quote?.user_will_spend),
              Number(cryptoDecimalValueForConvert),
              true
            ),
            message: data?.message ? data.message : "",
            success: data?.success,
          });

          setTime(Number(quoteData?.refresh_timer) * 1000 || 0);

          if (!data.success || quote?.status == STATUS_EXPIRED) {
            setEnableQuery(false);
            setTime(0);
          }
        },
        onError: async (err) => {
          customToast(err, "error");
          setQuoteData(null);
          setTime(0);
          setEnableQuery(false);
          onClose();
        },
      }
    );

  const {
    mutateAsync,
    isLoading: isLoadingConvert,
    isError: isErrorConvert,
  } = useMarketCurrencyConvertMutation();

  const handleConvertOrRefreshQuote = async () => {
    if (!quoteData?.success || quoteData?.status == STATUS_EXPIRED) {
      setEnableQuery(true);
    } else {
      setEnableQuery(false);
      setTime(0);
      // setStep(2);

      try {
        const res = await mutateAsync({
          quote_id: String(quoteData?.quote_id),
        });
        const data = res.data;

        if (!data.success) {
          customToast(data.message, "errorMessage");
        } else {
          setStep(2);
        }
      } catch (error) {
        customToast(error, "error");
      }
    }
  };

  const btnIsLoading = isLoadingQuote || isLoadingConvert;

  // console.log("conv: quoteData ", quoteData);
  // console.log("conv: dataToSend", dataToSend);

  return {
    step,
    setStep,
    fromCoin,
    toCoin,
    time,
    handleConvertOrRefreshQuote,
    quoteData,
    isLoadingQuote,
    btnIsLoading,
    isErrorConvert,
    isErrorQuote,
  };
};
