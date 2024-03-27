import useTranslation from "next-translate/useTranslation";
import cn from "classnames";
import styles from "../Convert.section.module.sass";
import { ConvertMarketFormType, State_Market } from "../Convert.type";
import { FiCheckCircle } from "react-icons/fi";
import Link from "next/link";
import {
  STATUS_EXPIRED,
  WALLET_TYPE,
} from "src/helpers/backend/backend.coreconstants";
import { walletTypeText } from "src/helpers/corearrays";
import { useConvertMarketModal } from "./useConvertMarket.section";
import { WarningText } from "components/warning_text/WarningText.component";
import Loader from "components/loader/Loader.component";
import { noExponents } from "src/helpers/corefunctions";
import { SubmitButton } from "components/submit_button/SubmitButton.component";
import { TableNoData } from "components/table_no_data/TableNoData.component";
import { QuoteFromTo } from "components/quote/QuoteFromTo.component";
import {
  QuoteDetailItem,
  QuoteDetailWrapper,
} from "components/quote/QuoteDetail.component";

export const ConvertMarketPreviewModal: React.FC<{
  onClose: () => void;
  state_market: State_Market;
  state_form: ConvertMarketFormType;
  walletType: WALLET_TYPE;
}> = ({ onClose, state_market, state_form, walletType }) => {
  const { t } = useTranslation("common");

  const {
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
  } = useConvertMarketModal(state_market, state_form, walletType, onClose);

  const details = (
    <QuoteDetailWrapper>
      {/* rate */}
      <QuoteDetailItem title={t("Rate")}>
        1 {fromCoin} ={" "}
        {(noExponents(Number(quoteData?.price)) || "---") + " " + toCoin}
      </QuoteDetailItem>

      {/* rate inverse */}
      <QuoteDetailItem title={t("Inverse Rate")}>
        1 {toCoin} ={" "}
        {(noExponents(Number(quoteData?.inverse_price)) || "---") +
          " " +
          fromCoin}
      </QuoteDetailItem>

      {/* method / wallet type */}
      <QuoteDetailItem title={t("Wallet")}>
        {t(walletTypeText[walletType])}
      </QuoteDetailItem>

      {/* fee - will come from api, later */}
      <QuoteDetailItem title={t("Convert Fee")}>
        {!quoteData?.fee || !Number(quoteData?.fee)
          ? t("No Fees")
          : noExponents(Number(quoteData?.fee)) + " " + toCoin}
      </QuoteDetailItem>

      {/* receivable */}
      <QuoteDetailItem
        title={t("You will get ")}
        className={cn(styles.receivable)}
      >
        {" "}
        {(noExponents(Number(quoteData?.user_will_get)) || "---") +
          " " +
          toCoin}
      </QuoteDetailItem>

      <QuoteDetailItem
        title={t("You will spend ")}
        className={cn(styles.receivable)}
      >
        {" "}
        {(noExponents(Number(quoteData?.user_will_spend)) || "---") +
          " " +
          fromCoin}
      </QuoteDetailItem>
    </QuoteDetailWrapper>
  );

  return (
    <>
      <div className={cn(styles.preview)}>
        {isLoadingQuote && (
          <div className={cn(styles.loaderWrapper)}>
            <Loader />
          </div>
        )}

        {step == 1 && (
          <>
            <h4 className={cn("h4 mb-3")}> {t("Confirm")}</h4>

            {isErrorQuote && (
              <TableNoData
                text={t("Something went wrong!")}
                className={cn("text-danger my-4")}
              />
            )}

            {!isErrorQuote && (
              <>
                <QuoteFromTo
                  fromCoin={fromCoin}
                  toCoin={toCoin}
                  from_amount={
                    noExponents(Number(quoteData?.from_amount)) || "---"
                  }
                  to_amount={
                    noExponents(Number(quoteData?.total_to_amount)) || "---"
                  }
                />

                {/* details box */}
                {details}
              </>
            )}

            {/* less balance err */}
            {!quoteData?.success && quoteData?.message && (
              <WarningText
                iconSize={24}
                text={quoteData.message}
                // className={cn('text-danger')}
              />
            )}

            {/* btn */}
            <SubmitButton
              isLoading={btnIsLoading}
              type="button"
              className={cn("mt-2")}
              btnText={
                !quoteData?.success || quoteData?.status == STATUS_EXPIRED
                  ? t("Refresh Quote")
                  : t("Convert ") + (time ? `(${time / 1000}s)` : "")
              }
              onClick={handleConvertOrRefreshQuote}
              disabled={isErrorConvert || !quoteData?.success}
            />
          </>
        )}

        {step == 2 && (
          <>
            {/* success */}
            <div className={cn("text-center", styles.success)}>
              <FiCheckCircle className={cn(styles.icon)} />

              <span className="h4 my-2">{t("Order Placed")}</span>

              {/* <small>{t("You received")}</small>
              <strong>0.099999 {toCoin}</strong> */}

              <p>
                {t(
                  "Your convert order placed successfully. You will be notified when it is completed."
                )}
              </p>
            </div>

            {/* details box */}
            {details}

            {/* actions */}
            <div className={cn(styles.actions)}>
              <Link href={"/wallet/overview"}>
                <a
                  className={cn(
                    "button-small button-stroke",
                    styles.actionsItem
                  )}
                >
                  {t("View Wallet")}
                </a>
              </Link>

              <button
                type="button"
                className={cn("button-small", styles.actionsItem)}
                onClick={() => {
                  setStep(1);
                  onClose();
                }}
              >
                {t("OK")}
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
};
