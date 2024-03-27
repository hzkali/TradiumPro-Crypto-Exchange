import { CurrencyVariablesForGiftCards } from "components/select_coin/SelectCurrencyForGiftCards.component";
import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useInView } from "react-intersection-observer";
import { useSelector } from "react-redux";
import {
  CodeVerifyInputs,
  CreateOrSendUserGiftCardInput,
  F_CurrencyModel,
  F_GiftCardTemplateModel,
  F_UserGiftCardModel,
  RecipientUserCredentialInput,
  useCreateOrSendUserGiftCardMutation,
  useGetGiftCardCategoriesQuery,
  useGetGiftCardTemplateListPaginateForStoreQuery,
  useGetGiftCardTemplateListPaginateQuery,
  useRedeemGiftCardMutation,
  useSendGiftCardMutation,
  useUserGiftCardListPaginateQuery,
} from "src/graphql/generated";
import {
  APP_DEFAULT,
  CURRENCY_TYPE,
  DB_QUERY_DEFAULT,
  FEE_TYPE,
  GIFT_CARD_ACTION,
  USER_CREDENTIALS,
  VERIFICATION_CODE_EVENT,
  WALLET_TYPE,
} from "src/helpers/backend/backend.coreconstants";
import { SETTINGS_SLUG } from "src/helpers/backend/backend.slugcontanst";
import {
  GIFT_CARD_FEATURES_FOR_RADIO,
  walletTypeText,
} from "src/helpers/corearrays";
import {
  DATA_TABLE_PAGE_INDEX_INITIAL,
  DEBOUNCE_TIME,
  QUERY_PARAM,
  STATUS_ACTIVE,
} from "src/helpers/coreconstants";
import {
  addNumbers,
  calculateFee,
  delayRefetch,
  formatAmountDecimal,
  getFundingBalance,
  getSpotBalance,
  getVerificationMethodFromPayload,
  getVerificationMethods,
  multiplyNumbers,
  noExponents,
  removeQueryParam,
  updateQueryParam,
} from "src/helpers/corefunctions";
import { useToast } from "src/hooks/useToast";
import { RootState } from "src/store";
import { TwoFaTypes } from "types/globalTypes";
import { useDebounce } from "use-debounce";

export const useGiftCardsTemplatesList = () => {
  const { t } = useTranslation("common");

  const { ref, inView } = useInView({
    threshold: 0,
    triggerOnce: true,
  });

  const router = useRouter();
  const queryCategory = router.query[QUERY_PARAM.CATEGORY];

  const [categoryUid, setCategoryUid] = useState("");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState(null);
  const [limit, setLimit] = useState(DB_QUERY_DEFAULT.LIMIT);
  const [page, setPage] = useState(DATA_TABLE_PAGE_INDEX_INITIAL);
  const [debounceQuery] = useDebounce(query, DEBOUNCE_TIME.DEFAULT);

  // categories
  const nullObject = {
    label: t("All"),
    value: null,
  };

  const [callCategory, setCallCategory] = useState(false);
  const [categoryQuery, setCategoryQuery] = useState(
    queryCategory ? String(queryCategory) : ""
  );
  const [debounceCategoryQuery] = useDebounce(
    categoryQuery,
    DEBOUNCE_TIME.DEFAULT
  );

  const { data: categoryListQuery } = useGetGiftCardCategoriesQuery(
    {
      limit: DB_QUERY_DEFAULT.LIMIT as number,
      query: debounceCategoryQuery,
    },
    {
      enabled: callCategory || !!queryCategory,
    }
  );

  const categories = categoryListQuery?.data.map((el) => ({
    value: el.uid,
    label: el.name,
  }));
  const categoryList: any = categories
    ? [nullObject, ...categories]
    : [nullObject];

  const handleCategoryChange = (item: any) => {
    setCategoryUid(item.value ? String(item.value) : "");

    item.value != null
      ? updateQueryParam(QUERY_PARAM.CATEGORY, item.label)
      : removeQueryParam(QUERY_PARAM.CATEGORY, router);
  };

  const defaultCategory =
    queryCategory &&
    categories?.find((el) => el.label == String(queryCategory));

  const { isLoading, isError, data, refetch } =
    useGetGiftCardTemplateListPaginateQuery(
      {
        category_uid:
          (defaultCategory && defaultCategory?.value
            ? defaultCategory.value
            : "") || categoryUid,
        query: debounceQuery,
        status: STATUS_ACTIVE,
        limit: limit as number,
        offset: (page - 1) * (limit as number),
      },
      {
        enabled: inView,
      }
    );

  const list = data?.data.nodes;
  const totalPages = Math.ceil(
    Number(data?.data.totalCount) / (limit as number)
  );

  return {
    categoryUid,
    setCategoryUid,
    query,
    debounceQuery,
    setQuery,
    status,
    setStatus,
    limit,
    setLimit,
    page,
    setPage,
    isLoading,
    isError,
    data,
    refetch,
    list,
    totalPages,
    ref,
    setCallCategory,
    setCategoryQuery,
    categoryList,
    handleCategoryChange,
    defaultCategory,
  };
};

export const useGiftCardsMyCardsList = () => {
  const { t } = useTranslation("common");

  const { ref, inView } = useInView({
    threshold: 0,
    triggerOnce: true,
  });

  const router = useRouter();
  const queryCategory = router.query[QUERY_PARAM.CATEGORY];

  const [categoryUid, setCategoryUid] = useState("");
  const [query, setQuery] = useState("");
  const [limit, setLimit] = useState(DB_QUERY_DEFAULT.LIMIT);
  const [page, setPage] = useState(DATA_TABLE_PAGE_INDEX_INITIAL);
  const [debounceQuery] = useDebounce(query, DEBOUNCE_TIME.DEFAULT);

  // categories
  const nullObject = {
    label: t("All"),
    value: null,
  };

  const [callCategory, setCallCategory] = useState(false);
  const [categoryQuery, setCategoryQuery] = useState(
    queryCategory ? String(queryCategory) : ""
  );
  const [debounceCategoryQuery] = useDebounce(
    categoryQuery,
    DEBOUNCE_TIME.DEFAULT
  );

  const { data: categoryListQuery } = useGetGiftCardCategoriesQuery(
    {
      limit: DB_QUERY_DEFAULT.LIMIT as number,
      query: debounceCategoryQuery,
    },
    {
      enabled: callCategory || !!queryCategory,
    }
  );

  const categories = categoryListQuery?.data.map((el) => ({
    value: el.uid,
    label: el.name,
  }));
  const categoryList: any = categories
    ? [nullObject, ...categories]
    : [nullObject];

  const handleCategoryChange = (item: any) => {
    setCategoryUid(item.value ? String(item.value) : "");

    item.value != null
      ? updateQueryParam(QUERY_PARAM.CATEGORY, item.label)
      : removeQueryParam(QUERY_PARAM.CATEGORY, router);
  };

  const defaultCategory =
    queryCategory &&
    categories?.find((el) => el.label == String(queryCategory));

  const { isLoading, isError, data, refetch } =
    useUserGiftCardListPaginateQuery(
      {
        category_uid: categoryUid,
        query: debounceQuery,
        limit: limit as number,
        offset: (page - 1) * (limit as number),
      },
      {
        enabled: inView,
      }
    );

  const list = data?.data.nodes;
  const totalPages = Math.ceil(
    Number(data?.data.totalCount) / (limit as number)
  );

  // console.log("gift: queryCat", queryCategory, defaultCategory);

  return {
    categoryUid,
    setCategoryUid,
    query,
    debounceQuery,
    setQuery,
    limit,
    setLimit,
    page,
    setPage,
    isLoading,
    isError,
    data,
    refetch,
    list,
    totalPages,
    ref,
    setCallCategory,
    setCategoryQuery,
    categoryList,
    handleCategoryChange,
    defaultCategory,
  };
};

export interface CreateOrSendUserGiftCardFormType
  extends Omit<CreateOrSendUserGiftCardInput, "wallet_type"> {
  wallet_type: string;
}

export const useGiftCardsBuyForm = (
  template_details: F_GiftCardTemplateModel
) => {
  const { t } = useTranslation("common");

  const { customToast } = useToast();

  const appSettings = useSelector(
    (state: RootState) => state.appSettings?.appSettings
  );

  const walletVisualDecimal =
    (appSettings &&
      appSettings[SETTINGS_SLUG.WALLET_BALANCE_DECIMAL_FOR_VISUAL]) ||
    APP_DEFAULT.CRYPTO_VISUAL_DECIMAL;

  const cryptoDecimal =
    appSettings &&
    appSettings[SETTINGS_SLUG.CURRENCY_DECIMAL_VALUE_FOR_GIFT_CARD];

  const [isBulk, setIsBulk] = useState(false);

  const {
    control,
    register,
    handleSubmit,
    resetField,
    setValue,
    watch,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<CreateOrSendUserGiftCardFormType>({
    mode: "all",
    defaultValues: {
      quantity: 1,
      template_uid: template_details.uid,
      wallet_type: String(WALLET_TYPE.SPOT),
      // action: GIFT_CARD_ACTION.CREATE,
      recipient_user_credential: {
        credential_type: USER_CREDENTIALS.EMAIL,
        credential_value: "",
      },
    },
  });

  const formValues = watch();
  const action = Number(formValues?.action);
  const isSend = action == GIFT_CARD_ACTION.SEND;
  const isCreate = action == GIFT_CARD_ACTION.CREATE;
  const wallet_type = Number(formValues.wallet_type);
  const formAmount = formValues.amount;

  const [currency, setCurrency] = useState<F_CurrencyModel | null>(null);
  const [showModal, setShowModal] = useState(false);

  const currencyDecimal =
    currency?.type == CURRENCY_TYPE.FIAT ? currency?.decimal : cryptoDecimal;

  const spotBalance = getSpotBalance(currency);
  const fundingBalance = getFundingBalance(currency);

  const onUpdateCurrency = (cur: F_CurrencyModel) => {
    // updateQueryParam(QUERY_PARAM.CURRENCY, cur.code);

    setValue("currency_code", cur.code);
    setCurrency(cur);
    setShowModal(false);
    resetField("amount");
  };

  const variables: CurrencyVariablesForGiftCards = {
    status: STATUS_ACTIVE,
    wallet_status: STATUS_ACTIVE,
    gift_card_status: STATUS_ACTIVE,
  };

  const _totalGiftCardFee = () => {
    return (
      calculateFee(
        currency?.gift_card_fee_type as FEE_TYPE,
        currency?.gift_card_fee,
        Number(multiplyNumbers(formValues.amount, Number(formValues.quantity)))
      ) || 0
    );
  };

  const totalGiftCardFee = _totalGiftCardFee();
  const totalAmount =
    Number(formValues?.action) == GIFT_CARD_ACTION.SEND
      ? addNumbers(
          Number(
            multiplyNumbers(formValues.amount, Number(formValues.quantity))
          ),
          totalGiftCardFee
        )
      : multiplyNumbers(formValues.amount, Number(formValues.quantity));

  const actionOptions = !isBulk
    ? GIFT_CARD_FEATURES_FOR_RADIO
    : GIFT_CARD_FEATURES_FOR_RADIO.filter(
        (el) => el.id != GIFT_CARD_ACTION.SEND
      );

  // submit form
  const [showDetails, setShowDetails] = useState(false);

  const onSubmit = (payload: CreateOrSendUserGiftCardFormType) => {
    const type = Number(payload.wallet_type);

    if (
      (type == WALLET_TYPE.SPOT && totalAmount > spotBalance) ||
      (type == WALLET_TYPE.FUNDING && totalAmount > fundingBalance)
    ) {
      //
    } else {
      setShowDetails(true);
    }
  };

  // set error for amount
  const handleAmountError = (type: number, action: number) => {
    const giftCardFee = calculateFee(
      currency?.gift_card_fee_type as FEE_TYPE,
      currency?.gift_card_fee,
      formAmount
    );
    const totalAmount = addNumbers(formAmount, giftCardFee);

    if (formAmount && formAmount > 0) {
      if (formAmount < Number(currency?.min_gift_card_amount)) {
        setError("amount", {
          type: "manual",
          message: t("Amount is too small"),
        });
      } else if (formAmount > Number(currency?.max_gift_card_amount)) {
        setError("amount", {
          type: "manual",
          message: t("Amount exceeded"),
        });
      } else if (
        action == GIFT_CARD_ACTION.CREATE &&
        ((type == WALLET_TYPE.SPOT && formAmount > spotBalance) ||
          (type == WALLET_TYPE.FUNDING && formAmount > fundingBalance))
      ) {
        setError("amount", {
          type: "manual",
          message: t("You do not have enough fund!"),
        });
      } else if (
        action == GIFT_CARD_ACTION.SEND &&
        ((type == WALLET_TYPE.SPOT && totalAmount > spotBalance) ||
          (type == WALLET_TYPE.FUNDING && totalAmount > fundingBalance))
      ) {
        setError("amount", {
          type: "manual",
          message:
            t(
              "You do not have enough fund! Total amount needed (including fee) "
            ) +
            totalAmount +
            " " +
            currency?.code,
        });
      } else {
        clearErrors("amount");
      }
    }
  };

  const showTotalBalanceError =
    formAmount &&
    isBulk &&
    isCreate &&
    ((wallet_type == WALLET_TYPE.SPOT && totalAmount > spotBalance) ||
      (wallet_type == WALLET_TYPE.FUNDING && totalAmount > fundingBalance))
      ? true
      : false;

  // gift store items
  const { data: listQuery } = useGetGiftCardTemplateListPaginateForStoreQuery({
    limit: DB_QUERY_DEFAULT.LIMIT as number,
    offset: DB_QUERY_DEFAULT.OFFSET as number,
    status: STATUS_ACTIVE,
    // category_uid: template_details.category?.uid,
  });

  const storeItems = listQuery?.data.nodes?.filter(
    (el) => el.uid != template_details.uid
  );
  const totalStoreItems = listQuery?.data.nodes?.find(
    (el) => el.uid == template_details.uid
  )
    ? Number(listQuery?.data.totalCount)
    : Number(listQuery?.data.totalCount) - 1;

  return {
    isBulk,
    setIsBulk,
    control,
    register,
    handleSubmit,
    resetField,
    setValue,
    errors,
    onSubmit,
    formValues,
    currency,
    showModal,
    setShowModal,
    onUpdateCurrency,
    variables,
    totalGiftCardFee,
    totalAmount,
    showDetails,
    setShowDetails,
    actionOptions,
    storeItems,
    totalStoreItems,
    spotBalance,
    fundingBalance,
    action,
    isSend,
    isCreate,
    walletVisualDecimal,
    currencyDecimal,
    wallet_type,
    handleAmountError,
    clearErrors,
    setError,
    formAmount,
    showTotalBalanceError,
  };
};

export const useGiftCardsCreateOrSendPreview = (closeModal?: () => void) => {
  const { customToast } = useToast();

  const router = useRouter();

  const {
    register,
    handleSubmit,
    resetField,
    formState: { errors },
  } = useForm<TwoFaTypes>({
    mode: "all",
  });

  const user = useSelector((state: RootState) => state.user?.user);
  const userSettings = user?.user_settings;
  const verificationMethods = getVerificationMethods(userSettings);
  const verificationEvent = VERIFICATION_CODE_EVENT.GIFT_CARD_SEND;

  const { isLoading, mutateAsync } = useCreateOrSendUserGiftCardMutation();

  const onSubmit = async (
    payload: TwoFaTypes,
    data: CreateOrSendUserGiftCardInput
  ) => {
    const code =
      payload?.email_verify_code ||
      payload?.phone_verify_code ||
      payload?.gauth_verify_code;

    const code_verify_input: CodeVerifyInputs | undefined = !code
      ? undefined
      : {
          code: String(code),
          event: verificationEvent,
          method: getVerificationMethodFromPayload(payload),
        };

    const dataToSend: CreateOrSendUserGiftCardInput = {
      amount: data.amount,
      currency_code: data.currency_code,
      action: Number(data.action),
      note: Number(data.action) == GIFT_CARD_ACTION.SEND ? data.note : "",
      quantity: data.quantity,
      template_uid: data.template_uid,
      wallet_type: data.wallet_type,

      ...(Number(data.action) == GIFT_CARD_ACTION.SEND && {
        recipient_user_credential: {
          credential_type:
            data.recipient_user_credential?.credential_type || "",
          credential_value:
            data.recipient_user_credential?.credential_value || "",
        },
      }),
    };
    // console.log("gift: final submit", code_verify_input, dataToSend);

    try {
      const res = await mutateAsync({
        code_verify_input: code_verify_input,
        data: dataToSend,
      });

      if (!res.data.success) {
        customToast(res.data.message, "errorMessage");
      } else {
        customToast(res.data.message, "success");
        closeModal && closeModal();
        router.push(
          Number(data.action) == GIFT_CARD_ACTION.CREATE
            ? "/gift-cards/my-cards"
            : "/gift-cards/templates"
        );
      }
    } catch (error) {
      customToast(error, "error");
    }
  };

  return {
    register,
    handleSubmit,
    resetField,
    errors,
    verificationMethods,
    verificationEvent,
    onSubmit,
    isLoading,
  };
};

export interface SendGiftCardFormType
  extends TwoFaTypes,
    RecipientUserCredentialInput {
  note?: string;
}

export const useGiftCardsMyCardItem = (
  item: F_UserGiftCardModel,
  refetch: Function
) => {
  const { t } = useTranslation("common");
  const { customToast } = useToast();

  const appSettings = useSelector(
    (state: RootState) => state.appSettings?.appSettings
  );
  const cryptoDecimal =
    appSettings &&
    appSettings[SETTINGS_SLUG.CURRENCY_DECIMAL_VALUE_FOR_GIFT_CARD];

  const currencyDecimal =
    item?.currency?.type == CURRENCY_TYPE.FIAT
      ? item?.currency?.decimal
      : cryptoDecimal;

  const [showDetails, setShowDetails] = useState(false);
  const [showSend, setShowSend] = useState(false);

  const handleResetModal = () => {
    setShowDetails(false);
    setShowSend(false);
  };

  const swalText =
    noExponents(
      formatAmountDecimal(
        multiplyNumbers(item.amount, Number(item?.quantity || 1)),
        Number(currencyDecimal),
        true
      )
    ) +
    ` ${item.currency?.code} ${t("will be added to your")} ${t(
      walletTypeText[item.wallet_type]
    )} ${t("wallet.")}`;

  const SwalData = {
    icon: "warning",
    title: t("Do you want to redeem?"),
    text: swalText,
    showCancelButton: true,
    showConfirmButton: true,
    confirmButtonText: t("Confirm"),
    allowOutsideClick: false,
    allowEscapeKey: false,
  };

  // redeem
  const { isLoading: isLoadingRedeem, mutateAsync: mutateAsyncRedeem } =
    useRedeemGiftCardMutation();

  const handleRedeem = async (id: string) => {
    try {
      const res = await mutateAsyncRedeem({ uid: id });

      if (!res.data.success) {
        customToast(res.data.message, "errorMessage");
      } else {
        customToast(res.data.message, "success");
        handleResetModal();
        delayRefetch(refetch);
      }
    } catch (error: any) {
      customToast(error, "error");
    }
  };

  // send
  const _giftCardFee = () => {
    return (
      calculateFee(
        item.currency?.gift_card_fee_type as FEE_TYPE,
        item.currency?.gift_card_fee,
        item.amount
      ) || 0
    );
  };

  const giftCardFee = _giftCardFee();
  const spotBalance = getSpotBalance(item.currency);
  const fundingBalance = getFundingBalance(item.currency);

  const {
    control,
    register,
    handleSubmit,
    resetField,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<SendGiftCardFormType>({
    mode: "all",
    defaultValues: {
      credential_type: USER_CREDENTIALS.EMAIL,
      credential_value: "",
    },
  });

  const formValues = watch();

  const handleStepTwo = () => {
    if (
      (item.wallet_type == WALLET_TYPE.SPOT && giftCardFee > spotBalance) ||
      (item.wallet_type == WALLET_TYPE.FUNDING && giftCardFee > fundingBalance)
    ) {
      const message = `${t(
        "You do not have enough balance to pay the fee "
      )} ${noExponents(giftCardFee, item.currency?.decimal)} ${
        item.currency?.code
      }`;
      customToast(message, "errorMessage");
    } else {
      setShowSend(true);
      setValue("credential_type", USER_CREDENTIALS.EMAIL);
      resetField("credential_value");
    }
  };

  const user = useSelector((state: RootState) => state.user?.user);
  const userSettings = user?.user_settings;
  const verificationMethods = getVerificationMethods(userSettings);
  const verificationEvent = VERIFICATION_CODE_EVENT.GIFT_CARD_SEND;

  const { isLoading, mutateAsync } = useSendGiftCardMutation();

  const onSubmit = async (payload: SendGiftCardFormType, id: string) => {
    const code_verify_input: CodeVerifyInputs = {
      code: String(
        payload?.email_verify_code ||
          payload?.phone_verify_code ||
          payload?.gauth_verify_code
      ),
      event: verificationEvent,
      method: getVerificationMethodFromPayload(payload),
    };

    const recipient_user_credential: RecipientUserCredentialInput = {
      credential_type: payload.credential_type,
      credential_value: payload.credential_value,
    };

    // console.log("gift: final submit", {
    //   code_verify_input,
    //   recipient_user_credential,
    //   uid: id,
    // });

    try {
      const res = await mutateAsync({
        code_verify_input: code_verify_input,
        note: payload.note,
        recipient_user_credential: recipient_user_credential,
        uid: id,
      });
      if (!res.data.success) {
        customToast(res.data.message, "errorMessage");
      } else {
        customToast(res.data.message, "success");
        handleResetModal();
        reset();
        delayRefetch(refetch);
      }
    } catch (error) {
      customToast(error, "error");
    }
  };

  return {
    showDetails,
    setShowDetails,
    showSend,
    setShowSend,
    SwalData,
    isLoadingRedeem,
    handleRedeem,
    control,
    register,
    handleSubmit,
    resetField,
    setValue,
    errors,
    verificationMethods,
    verificationEvent,
    onSubmit,
    formValues,
    isLoading,
    handleResetModal,
    handleStepTwo,
    giftCardFee,
    currencyDecimal,
  };
};
