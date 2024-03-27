import cn from "classnames";
import { CustomModal } from "components/modal/CustomModal.component";
import useTranslation from "next-translate/useTranslation";
import dynamic from "next/dynamic";
import DatePicker from "react-datepicker";
import Select from "react-select";
import styles from "../../orders_pages/SpotOrdersPages.section.module.sass";
import { useGiftCardHistory } from "./useGiftCardHistory.section";


const DataTableNoSsr = dynamic(
  () => import("../../../components/data_table/DataTable.component"),
  {
    ssr: false,
  }
);

export const GiftCardHistory: React.FC = () => {
  const { t } = useTranslation("common");

  const {
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
    txId,
    setTxId,
  } = useGiftCardHistory();

  return (
    <>
      <div className={cn(styles.selectBoxes, "mb-3")}>
        <div className={cn("w-m-150", styles.selectBox)}>
          <label className={cn("label")}>{t("Currency")}</label>
          <Select
            classNamePrefix={"custom-select"}
            isSearchable={true}
            placeholder={t("Select Currency")}
            options={currencyCodeList}
            value={currencyCode}
            onChange={handleCurrencyCodeChange}
          />
        </div>

        <div className={cn("w-m-150", styles.selectBox)}>
          <label className={cn("label")}>{t("Time")}</label>
          <Select
            classNamePrefix={"custom-select"}
            options={timeSelectOption}
            isSearchable={false}
            placeholder={t("Select Time")}
            value={time}
            onChange={handleTimeChange}
          />
        </div>
      </div>

      {/* data table */}
      <DataTableNoSsr
        _key={"uid"}
        isDynamic={isDynamic}
        items={giftCardHistoryList || []}
        columns={columns}
        count={Number(giftCardHistoryCount)}
        isLoading={isLoading}
        isError={isError}
        noSearch={true}
        searchText={txId}
        setSearchText={setTxId}
        limit={limit}
        setLimit={setLimit}
        page={page}
        setPage={setPage}
        sidePadding={false}
        // toolbarClassName={cn(styles.toolbarClassName)}
        noDataText={t("No Data Available!")}
        customPaginationClassName={cn("bottom-20")}
        // rowEvents={rowEvents}
      />

      {/* datepicker */}
      <CustomModal
        visible={showTimeModal}
        onClose={handleToggleTimeModal}
        title={t("Customize time range")}
        outerClassName={cn(styles.datePickerModal)}
      >
        <p className="mb-3">{t("Select your time range within 12 months.")}</p>

        <DatePicker
          selected={dateRange.end_date}
          onChange={handleDateRangeChange}
          startDate={dateRange.start_date}
          endDate={dateRange.end_date}
          maxDate={new Date()}
          minDate={new Date(new Date().setDate(new Date().getDate() - 365))}
          monthsShown={2}
          dateFormatCalendar={"MMM yyyy"}
          selectsRange
          inline
        />
      </CustomModal>
    </>
  );
};
