import cn from "classnames";
import styles from "./GiftCards.section.module.sass";
import useTranslation from "next-translate/useTranslation";
import Link from "next/link";
import { useGiftCardsTemplatesList } from "./useGiftCards.section";
import { CustomPagination } from "components/custom_paginaton/CustomPagination.component";
import { LoaderWrapper } from "components/loader/Loader.component";
import { TableNoData } from "components/table_no_data/TableNoData.component";
import { GiftCardsTemplateItem } from "./GiftCardsTemplateItem.section";
import TextInputNoForm from "components/text_input/TextInputNoForm.component";
import Select from "react-select";
import { NoDataCard } from "components/no_data_card/NoDataCard.component";

export const GiftCardsTemplatesList: React.FC<{
  isMainPage?: boolean;
}> = ({ isMainPage }) => {
  const { t } = useTranslation("common");

  const {
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
  } = useGiftCardsTemplatesList();

  return (
    <>
      <section ref={ref} className={cn("section ")}>
        <div className={cn("container ")}>
          {/* header */}
          <div className={cn(styles.templatesHeader)}>
            <div className={cn(styles.info)}>
              <h4 className="h4">{t("Gift Cards Templates")}</h4>
              <p className="p-0">{t("Save or send gift cards")}</p>
            </div>

            {isMainPage && (
              <div className={cn(styles.filters)}>
                <div>
                  <label htmlFor="query" className="label">
                    {t("Search")}
                  </label>

                  <TextInputNoForm
                    id={"query"}
                    placeholder={t("Search...")}
                    icon={query ? "close" : ""}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onIconClick={() => setQuery("")}
                  />
                </div>

                <div>
                  <label htmlFor="category" className="label">
                    {t("Category")}
                  </label>

                  <Select
                    classNamePrefix={"custom-select"}
                    isSearchable={true}
                    placeholder={t("Select Category")}
                    options={categoryList}
                    value={defaultCategory}
                    defaultValue={defaultCategory}
                    onChange={handleCategoryChange}
                    onMenuOpen={() => {
                      setCallCategory(true);
                      setCategoryQuery("");
                    }}
                    onMenuClose={() => setCallCategory(false)}
                    onInputChange={(newValue) => setCategoryQuery(newValue)}
                  />
                </div>
              </div>
            )}
          </div>

          {/* lists */}
          {isLoading && <LoaderWrapper className={cn(styles.loader)} />}

          {isError && (
            <TableNoData
              className={cn(styles.loader, styles.noData, "text-danger")}
              text={t("Something went wrong!")}
            />
          )}

          {list?.length == 0 ? (
            <NoDataCard />
          ) : (
            <div className={cn(styles.list)}>
              {list?.map((item) => {
                const _item: any = item;
                return <GiftCardsTemplateItem key={item.uid} item={_item} />;
              })}
            </div>
          )}

          {/* pagination / view more */}
          {!isMainPage && list?.length ? (
            <div className="text-center">
              <Link href={"/gift-cards/templates"}>
                <a className="button-stroke button-small mx-auto px-5">
                  {t("View More")}
                </a>
              </Link>
            </div>
          ) : null}

          {isMainPage && (
            <CustomPagination
              page={page}
              setPage={setPage}
              totalPages={totalPages}
              className={cn("justify-content-center")}
              showIcon
              // hideFirst
              // hideLast
            />
          )}
        </div>
      </section>
    </>
  );
};
