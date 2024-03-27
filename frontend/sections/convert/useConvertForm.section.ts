import { useEffect, useState } from "react";
import {
  useGetFromCurrencyListForLimitConvertQuery,
  useGetToCurrencyListForLimitConvertQuery,
} from "src/graphql/generated";
import { DEBOUNCE_TIME, LIMITS_FRONTEND } from "src/helpers/coreconstants";
import { useDebounce } from "use-debounce";

export const useConvertCurrencyModal = (
  visible: boolean,
  type: "from" | "to",
  fromCode: string
) => {
  const [searchText, setSearchText] = useState("");

  const [debounceSearchText] = useDebounce(searchText, DEBOUNCE_TIME.DEFAULT);

  const handleSearchTextChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setSearchText(e.target.value);
  const handleClearSearchText = () => setSearchText("");

  const [list, setList] = useState<null | any[]>(null);

  useEffect(() => {
    if (!visible) setList(null);
  }, [visible]);

  // from
  const { isLoading: isLoadingFrom } =
    useGetFromCurrencyListForLimitConvertQuery(
      {
        query: debounceSearchText || null,
        limit: LIMITS_FRONTEND.CURRENCY_ITEM_LIMIT,
      },
      {
        enabled: visible && type == "from",
        onSuccess: ({ data }) => {
          data ? setList(data) : setList(null);
        },
        onError: () => setList(null),
      }
    );

  // to
  const { isLoading: isLoadingTo } = useGetToCurrencyListForLimitConvertQuery(
    {
      from_currency_code: fromCode,
      query: debounceSearchText || null,
      limit: LIMITS_FRONTEND.CURRENCY_ITEM_LIMIT,
    },
    {
      enabled: visible && type == "to",
      onSuccess: ({ data }) => {
        data ? setList(data) : setList(null);
      },
      onError: () => setList(null),
    }
  );

  return {
    isLoading: isLoadingFrom || isLoadingTo,
    list,
    handleSearchTextChange,
    handleClearSearchText,
    searchText,
  };
};
