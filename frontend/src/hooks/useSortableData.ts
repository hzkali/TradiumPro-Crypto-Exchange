import { useState, useMemo } from "react";
import { sortObjectArrayForNumber } from "src/helpers/corefunctions";

export type configType = null | {
  key: string;
  direction: string;
};

export interface useSortableDataType<T> {
  items: T[];
  sortConfig: configType;
  requestSort: (key: string) => void;
}

export function useSortableData<T>(
  items: T[],
  config: configType = null
): useSortableDataType<T> {
  const [sortConfig, setSortConfig] = useState(config);

  const sortedItems = useMemo(() => {
    let sortableItems = [...items];
    if (sortConfig !== null) {
      sortObjectArrayForNumber(
        sortConfig.key,
        sortConfig.direction,
        sortableItems
      );
    }
    return sortableItems;
  }, [items, sortConfig]);

  const requestSort = (key: string) => {
    let direction = "asc";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "asc"
    ) {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  return { items: sortedItems, requestSort, sortConfig };
}
