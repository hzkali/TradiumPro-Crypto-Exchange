import useTranslation from "next-translate/useTranslation";
import { Dispatch, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import {
  LimitCurrencyConvertDto,
  useLimitCurrencyConvertMutation,
} from "src/graphql/generated";
import {
  APP_DEFAULT,
  WALLET_TYPE,
} from "src/helpers/backend/backend.coreconstants";
import { SETTINGS_SLUG } from "src/helpers/backend/backend.slugcontanst";
import {
  calculateFee,
  divideNumbers,
  formatAmountDecimal,
  minusNumbers,
  multiplyNumbers,
  noExponents,
} from "src/helpers/corefunctions";
import { useToast } from "src/hooks/useToast";
import { RootState } from "src/store";
import {
  Action_Limit,
  ConvertLimitFormType,
  State_Limit,
} from "../Convert.type";

export const useConvertLimitForm = (
  state: State_Limit,
  dispatch: Dispatch<Action_Limit>,
  decimalConvert: number,
  updatePair: (from_currency: string, to_currency: string) => void
) => {
  const { t } = useTranslation("common");

  const { customToast } = useToast();

  const appSettings = useSelector(
    (state: RootState) => state.appSettings?.appSettings
  );

  const decimalWallet =
    (appSettings &&
      appSettings[SETTINGS_SLUG.WALLET_BALANCE_DECIMAL_FOR_VISUAL]) ||
    APP_DEFAULT.CRYPTO_VISUAL_DECIMAL;

  const spotBalanceFrom = state.from?.balance_spot
    ? Number(state.from?.balance_spot)
    : 0;
  const fundingBalanceFrom = state.from?.balance_funding
    ? Number(state.from?.balance_funding)
    : 0;
  const spotBalanceTo = state.to?.balance_spot
    ? Number(state.to?.balance_spot)
    : 0;
  const fundingBalanceTo = state.to?.balance_funding
    ? Number(state.to?.balance_funding)
    : 0;

  const getMarketPrice = () => {
    let marketPrice: string | number = "";

    if (state.chartCurrencyPair?.base == state.from?.code)
      marketPrice = Number(state.marketPrice);
    else marketPrice = divideNumbers(1, Number(state.marketPrice));

    return isNaN(marketPrice) ? "" : marketPrice;
  };

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
    trigger,
    setError,
    clearErrors,
  } = useForm<ConvertLimitFormType>({
    mode: "all",
    defaultValues: {
      from: "",
      to: "",
      convert: "",
      wallet_type: String(WALLET_TYPE.SPOT),
    },
  });

  const values = watch();
  const wallet_type = Number(values.wallet_type);
  const fromAmount = values.from;

  const previewDisable =
    !values.from ||
    !values.to ||
    !values.convert ||
    !!errors.from?.message ||
    !!errors.to?.message ||
    !!errors.convert?.message;

  const onOrderSuccess = () => {
    reset();
    resetField("from");
    resetField("to");
    resetField("convert");
  };

  const onSubmit = async (payload: LimitCurrencyConvertDto) => {};

  const handleShowPreview = async () => {
    const tr = await trigger();

    tr && dispatch({ type: "toggle_showPreview" });
  };

  const handleToggleFromTo = () => {
    dispatch({ type: "toggle_fromTo" });
    updatePair(state.to?.code ?? "", state.from?.code ?? "");
    resetField("from");
    resetField("to");
  };

  const handleUpdateCurrency = (coinCode: string, type: "from" | "to") => {
    if (type == "from") {
      if (coinCode == state.to?.code) {
        handleToggleFromTo();
        dispatch({ type: "toggle_showFromModal" });
      } else {
        resetField("from");
        updatePair(coinCode, state.to?.code ?? "");
        dispatch({ type: "toggle_showFromModal" });
      }
    }

    if (type == "to") {
      if (coinCode == state.from?.code) {
        handleToggleFromTo();
        dispatch({ type: "toggle_showToModal" });
      } else {
        resetField("to");
        updatePair(state.from?.code ?? "", coinCode);
        dispatch({ type: "toggle_showToModal" });
      }
    }
  };

  const onConvertChange = (val: string) => {
    const value = Number(val);

    if (values.from && !values.to) {
      const v = Number(
        formatAmountDecimal(
          multiplyNumbers(Number(values.from), value),
          decimalConvert
        )
      );

      setValue("to", val == "" ? "" : noExponents(v), {
        shouldValidate: true,
        shouldTouch: true,
        // shouldDirty: true,
      });
    } else if (values.to && !values.from) {
      const v = Number(
        formatAmountDecimal(
          divideNumbers(Number(values.to), value),
          decimalConvert
        )
      );

      setValue("from", val == "" ? "" : noExponents(v), {
        shouldValidate: true,
        shouldTouch: true,
        // shouldDirty: true,
      });
    } else if (values.from && values.to) {
      const v = Number(
        formatAmountDecimal(
          multiplyNumbers(Number(values.from), value),
          decimalConvert
        )
      );

      setValue("to", val == "" ? "" : noExponents(v), {
        shouldValidate: true,
        shouldTouch: true,
        // shouldDirty: true,
      });
    }
  };

  const onFromChange = (val: number) => {
    if (!values.convert) resetField("to");
    else {
      const v = Number(
        formatAmountDecimal(
          multiplyNumbers(val, Number(values.convert)),
          decimalConvert,
          true
        )
      );

      setValue("to", !val ? "" : noExponents(v), {
        shouldValidate: true,
        shouldTouch: true,
        // shouldDirty: true,
      });
    }
  };

  const onToChange = (value: number) => {
    if (!values.convert) {
      setValue("from", "", {
        shouldValidate: true,
        shouldTouch: true,
        // shouldDirty: true,
      });
    } else {
      const v = formatAmountDecimal(
        divideNumbers(value, Number(values.convert)),
        decimalConvert,
        true
      );

      setValue("from", !value ? "" : noExponents(v), {
        shouldValidate: true,
        shouldTouch: true,
        // shouldDirty: true,
      });
    }
  };

  const onWalletTypeChange = (type: number) => {
    const amount = Number(fromAmount);

    if (amount && amount > 0) {
      if (amount < Number(state.from?.min)) {
        setError("from", {
          type: "manual",
          message: t("Amount is too small"),
        });
      } else if (amount > Number(state.from?.max)) {
        setError("from", {
          type: "manual",
          message: t("Amount exceeded"),
        });
      } else if (type == WALLET_TYPE.SPOT && amount > spotBalanceFrom) {
        setError("from", {
          type: "manual",
          message: t("You do not have enough fund "),
        });
      } else if (type == WALLET_TYPE.FUNDING && amount > fundingBalanceFrom) {
        setError("from", {
          type: "manual",
          message: t("You do not have enough fund "),
        });
      } else {
        clearErrors("from");
      }
    }
  };

  return {
    register,
    setValue,
    errors,
    values,
    previewDisable,
    handleUpdateCurrency,
    handleToggleFromTo,
    spotBalanceFrom,
    fundingBalanceFrom,
    spotBalanceTo,
    fundingBalanceTo,
    handleShowPreview,
    onConvertChange,
    onFromChange,
    onToChange,
    getMarketPrice,
    decimalConvert,
    onOrderSuccess,
    onWalletTypeChange,
    wallet_type,
    decimalWallet,
  };
};

interface ConvertLimitModalHookType {
  state_limit: State_Limit;
  state_form: ConvertLimitFormType;
  walletType: WALLET_TYPE;
  expireTime: number;
}

export const useConvertLimitModal = ({
  state_limit,
  state_form,
  walletType,
  expireTime,
}: ConvertLimitModalHookType) => {
  const { customToast } = useToast();

  const appSettings = useSelector(
    (state: RootState) => state.appSettings?.appSettings
  );
  const decimalConvert =
    (appSettings &&
      appSettings[SETTINGS_SLUG.CURRENCY_DECIMAL_VALUE_FOR_CONVERT]) ||
    APP_DEFAULT.CRYPTO_VISUAL_DECIMAL;

  const [step, setStep] = useState(1);

  const { from, to } = state_limit;
  const [fromCoin, toCoin] = [from?.code, to?.code];

  let fee = 0;

  if (to?.convert_fee_type && to.convert_fee) {
    fee = calculateFee(
      to?.convert_fee_type,
      to.convert_fee,
      Number(state_form.to)
    );
    fee = Number(formatAmountDecimal(fee, Number(decimalConvert), true));
  }

  const rate = formatAmountDecimal(
    Number(state_form.convert),
    Number(decimalConvert),
    true
  );

  const inverseRate = formatAmountDecimal(
    divideNumbers(1, Number(state_form.convert)),
    Number(decimalConvert),
    true
  );

  const userWillGet = formatAmountDecimal(
    minusNumbers(Number(state_form.to), fee),
    Number(decimalConvert),
    true
  );

  const userWillSpend = formatAmountDecimal(
    Number(state_form.from),
    Number(decimalConvert),
    true
  );

  const dataToSubmit: LimitCurrencyConvertDto = {
    from_currency_code: fromCoin ?? "",
    amount: Number(
      formatAmountDecimal(Number(state_form.from), Number(decimalConvert), true)
    ),
    price: Number(
      formatAmountDecimal(
        Number(state_form.convert),
        Number(decimalConvert),
        true
      )
    ),
    to_currency_code: String(toCoin),
    wallet_type: walletType,
    expires_in: expireTime,
  };

  const { mutateAsync, isLoading: isLoadingMutation } =
    useLimitCurrencyConvertMutation();

  const handlePlaceConvertLimitOrder = async () => {
    try {
      const res = await mutateAsync({ data: dataToSubmit });
      const data = res.data;

      if (!data.success) {
        customToast(data.message, "errorMessage");
      } else {
        setStep(2);
      }
    } catch (error) {
      customToast(error, "error");
    }
  };

  return {
    step,
    setStep,
    fromCoin,
    toCoin,
    fee,
    rate,
    inverseRate,
    userWillGet,
    userWillSpend,
    decimalConvert,
    handlePlaceConvertLimitOrder,
    isLoadingMutation,
  };
};
