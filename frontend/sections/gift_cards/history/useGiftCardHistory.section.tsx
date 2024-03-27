import cn from "classnames";
import moment from "moment";
import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  F_UserGiftCardTransferHistoryModel,
  useGetCurrencyListForGiftCardsQuery,
  useGetGiftCardTransferHistoryListPaginateQuery,
} from "src/graphql/generated";
import { DAYS, STATUS_ACTIVE } from "src/helpers/backend/backend.coreconstants";

import {
  DATA_TABLE_PAGE_INDEX_INITIAL,
  DEBOUNCE_TIME,
  QUERY_PARAM,
} from "src/helpers/coreconstants";

import {
  dateTimeDisplayer,
  formatAmountDecimal,
  handleTimeObject,
  noExponents,
  queryDaysValidate,
  removeQueryParam,
  updateQueryParam,
} from "src/helpers/corefunctions";

import { RootState } from "src/store";
import { SelectOptionType } from "types/globalTypes";
import { GiftCardHistoryActions } from "./GiftCardHistoryActions.section";
import { useDebounce } from "use-debounce";

export const useGiftCardHistory = () => {
  const { t } = useTranslation("common");

  const isDynamic = true;

  const userData = useSelector((state: RootState) => state.user);
  const isLoggedin = userData?.isLoggedIn;

  const router = useRouter();

  // q params
  const queryDays = router.query[QUERY_PARAM.DAYS];
  const queryCode = router.query[QUERY_PARAM.CURRENCY];
  const queryTxID = router.query[QUERY_PARAM.TXID];

  // filters
  const nullObject: SelectOptionType = {
    label: t("All"),
    value: null,
  };

  // currency code
  const [currencyCodeList, setCurrencyCodeList] = useState([nullObject]);

  const [currencyCode, setCurrencyCode] = useState(
    currencyCodeList.find((el) => el.value == queryCode) || nullObject
  );

  useGetCurrencyListForGiftCardsQuery(
    { status: STATUS_ACTIVE },
    {
      enabled: !!isLoggedin,
      onSuccess: ({ data }) => {
        if (data) {
          const newList = data.map((el) => ({
            value: el.code,
            label: el.code,
          }));

          setCurrencyCodeList([nullObject, ...newList]);
        }
      },
    }
  );

  const handleCurrencyCodeChange = (e: any) => {
    setCurrencyCode(e);
  };

  // query
  const [txId, setTxId] = useState(queryTxID ? String(queryTxID) : "");
  const [debouncedTxId] = useDebounce(txId, DEBOUNCE_TIME.DEFAULT);

  useEffect(() => {
    if (!txId || txId.trim() == "") removeQueryParam(QUERY_PARAM.TXID, router);
  }, [txId]);

  // time filter
  const timeSelectOption = [
    {
      label: t("1 Day"),
      value: DAYS.ONE,
    },
    {
      label: t("7 Days"),
      value: DAYS.SEVEN,
    },
    {
      label: t("15 Days"),
      value: DAYS.FIFTEEN,
    },
    {
      label: t("30 Days"),
      value: DAYS.THIRTY,
    },
    {
      label: t("Customize Time"),
      value: "customized",
    },
  ];

  const [time, setTime] = useState(
    !queryDays
      ? handleTimeObject(DAYS.SEVEN, timeSelectOption)
      : handleTimeObject(queryDaysValidate(queryDays), timeSelectOption)
  ); //timeSelectOption[1]
  const [showTimeModal, setShowTimeModal] = useState(false);
  const handleToggleTimeModal = () => setShowTimeModal(!showTimeModal);

  type datesType = Date | null | undefined;

  // start from the past, end to the present
  const [dateRange, setDateRange] = useState<{
    start_date: datesType;
    end_date: datesType;
  }>({
    start_date: new Date(
      new Date().setDate(
        new Date().getDate() -
          Number(queryDaysValidate(queryDays) || time?.value)
      )
    ),
    end_date: new Date(),
  });

  const daysDuration = Math.ceil(
    moment
      .duration(moment(dateRange.end_date).diff(moment(dateRange.start_date)))
      .asDays()
  );

  const handleTimeChange = (e: any) => {
    if (e.value === "customized") {
      handleToggleTimeModal();

      setTime({
        label: t("Custom Days"),
        value: null, // daysDuration, //"customized",
      });

      removeQueryParam(QUERY_PARAM.DAYS, router);
    } else {
      setTime(e);

      setDateRange((prev) => {
        return {
          ...prev,
          end_date: new Date(),
          start_date: new Date(
            new Date().setDate(new Date().getDate() - Number(e?.value))
          ),
        };
      });

      updateQueryParam(QUERY_PARAM.DAYS, String(e.value));
    }
  };

  const handleDateRangeChange = (dates: datesType[]) => {
    const [start, end] = dates;

    setDateRange({
      start_date: start,
      end_date: end,
    });
  };

  // api helper vars
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(DATA_TABLE_PAGE_INDEX_INITIAL);

  // call api
  const {
    isLoading,
    isError,
    data: listQuery,
    refetch: refetchListQuery,
  } = useGetGiftCardTransferHistoryListPaginateQuery(
    {
      limit: limit,
      offset: (page - 1) * limit,
      currency_code: currencyCode.value ? String(currencyCode.value) : null,
      // query: debouncedTxId,
      time: {
        // days: dateRange.end_date && dateRange.start_date ? null : daysDuration,
        date:
          dateRange.end_date == null
            ? null
            : {
                end_date: new Date(dateRange.end_date.setHours(23, 59, 0)),
                start_date: new Date(
                  // @ts-ignore
                  dateRange?.start_date.setHours(0, 0, 0)
                ),
              },
      },
    },
    {
      enabled: !!isLoggedin,
    }
  );

  // go to def page after any filter changed
  useEffect(() => {
    setPage(DATA_TABLE_PAGE_INDEX_INITIAL);
  }, [limit, currencyCode.value, debouncedTxId, daysDuration]);

  const giftCardHistoryList = listQuery?.data?.nodes;
  const giftCardHistoryCount = listQuery?.data?.totalCount;

  const columns = [
    {
      dataField: "created_at",
      text: t("Date"),
      formatter: function (c: string, r: F_UserGiftCardTransferHistoryModel) {
        return <div className="w-150">{dateTimeDisplayer(r.created_at)}</div>;
      },
    },
    {
      dataField: "from_user",
      text: t("From User"),
      formatter: function (c: string, r: F_UserGiftCardTransferHistoryModel) {
        return (
          <div className="w-150">
            {r?.from_user?.usercode == userData?.user?.usercode
              ? t("Me")
              : r?.from_user?.nickname || r?.from_user?.usercode}
          </div>
        );
      },
    },
    {
      dataField: "to_user",
      text: t("To User"),
      formatter: function (c: string, r: F_UserGiftCardTransferHistoryModel) {
        return (
          <div className="w-150">
            {r?.to_user?.usercode == userData?.user?.usercode
              ? t("Me")
              : r?.to_user?.nickname || r?.to_user?.usercode}
          </div>
        );
      },
    },
    {
      dataField: "amount",
      text: t("Gift Amount"),
      formatter: function (c: string, r: F_UserGiftCardTransferHistoryModel) {
        const amount = formatAmountDecimal(
          Number(r?.amount),
          Number(r?.currency?.decimal),
          true
        );
        return (
          <div className="w-150">
            {noExponents(amount) + " " + r?.currency?.code}
          </div>
        );
      },
    },
    {
      dataField: "fee", // user will get + fee
      text: t("Fee"),
      formatter: function (c: string, r: F_UserGiftCardTransferHistoryModel) {
        const amount = formatAmountDecimal(
          Number(r?.fee),
          Number(r?.currency?.decimal),
          true
        );
        return (
          <div className="w-175">
            {noExponents(amount) + " " + r?.currency?.code}
          </div>
        );
      },
    },
    {
      dataField: "uid",
      text: t("Actions"),
      formatter: function (
        cell: string,
        r: F_UserGiftCardTransferHistoryModel
      ) {
        return <GiftCardHistoryActions item={r} refetch={refetchListQuery} />;
      },
    },
  ];

  const [item, setItem] = useState<
    F_UserGiftCardTransferHistoryModel | undefined
  >();
  const [showItemModal, setShowItemModal] = useState(false);
  const handleToggleModal = () => setShowItemModal(!showItemModal);

  const rowEvents = {
    onClick: (e: any, row: F_UserGiftCardTransferHistoryModel) => {
      setItem(row);
      handleToggleModal();
    },
  };

  return {
    limit,
    setLimit,
    page,
    setPage,
    isLoading,
    isError,
    giftCardHistoryList,
    giftCardHistoryCount,
    isDynamic,
    columns,
    timeSelectOption,
    time,
    handleTimeChange,
    showTimeModal,
    handleToggleTimeModal,
    dateRange,
    handleDateRangeChange,
    currencyCode,
    handleCurrencyCodeChange,
    currencyCodeList,
    item,
    showItemModal,
    handleToggleModal,
    rowEvents,
    refetchListQuery,
    txId,
    setTxId,
  };
};
