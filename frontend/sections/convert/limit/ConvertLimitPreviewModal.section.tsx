import useTranslation from "next-translate/useTranslation";
import cn from "classnames";
import styles from "../Convert.section.module.sass";
import { CustomModal } from "components/modal/CustomModal.component";
import { ConvertLimitFormType, State_Limit } from "../Convert.type";
import { FiCheckCircle } from "react-icons/fi";
import Link from "next/link";
import { WALLET_TYPE } from "src/helpers/backend/backend.coreconstants";
import { walletTypeText } from "src/helpers/corearrays";
import { formatAmountDecimal, noExponents } from "src/helpers/corefunctions";
import { SubmitButton } from "components/submit_button/SubmitButton.component";
import { WarningText } from "components/warning_text/WarningText.component";
import { useConvertLimitModal } from "./useConvertLimitForm.section";
import {
  QuoteDetailItem,
  QuoteDetailWrapper,
} from "components/quote/QuoteDetail.component";
import { QuoteFromTo } from "components/quote/QuoteFromTo.component";

export const ConvertLimitPreviewModal: React.FC<{
  visible: boolean;
  onClose: () => void;
  onOrderSuccess: () => void;
  state_limit: State_Limit;
  state_form: ConvertLimitFormType;
  walletType: WALLET_TYPE;
  expireTime: number;
}> = ({
  visible,
  onClose,
  onOrderSuccess,
  state_limit,
  state_form,
  walletType,
  expireTime,
}) => {
  const { t } = useTranslation("common");

  const {
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
  } = useConvertLimitModal({
    state_limit,
    state_form,
    walletType,
    expireTime,
  });

  const formatedFromAmount = Number(
    formatAmountDecimal(Number(state_form.from), Number(decimalConvert), true)
  );

  const formatedToAmount = Number(
    formatAmountDecimal(Number(state_form.to), Number(decimalConvert), true)
  );

  const submitCondRes =
    Number(formatedFromAmount) <= 0 ||
    Number(formatedToAmount) <= 0 ||
    Number(userWillGet) <= 0;

  const details = (
    <QuoteDetailWrapper>
      {/* expire */}
      <QuoteDetailItem title={t("Expires in")}>
        {expireTime + t(" Days")}
      </QuoteDetailItem>

      {/* rate */}
      <QuoteDetailItem title={t("Rate")}>
        1 {fromCoin} = {noExponents(Number(rate))} {toCoin}
      </QuoteDetailItem>

      {/* method / wallet type */}
      <QuoteDetailItem title={t("Wallet")}>
        {t(walletTypeText[walletType])}
      </QuoteDetailItem>

      {/* fee */}
      <QuoteDetailItem title={t("Convert Fee")}>
        {/* {noExponents(Number(fee))} {toCoin} */}
        {Number(fee) ? `${noExponents(fee)} ${toCoin}` : t("No Fees")}
      </QuoteDetailItem>

      {/* receivable */}
      <QuoteDetailItem
        title={t("You will get ")}
        className={cn(styles.receivable)}
      >
        {noExponents(Number(userWillGet))} {toCoin}
      </QuoteDetailItem>

      <QuoteDetailItem
        title={t("You will spend ")}
        className={cn(styles.receivable)}
      >
        {noExponents(Number(userWillSpend))} {fromCoin}
      </QuoteDetailItem>
    </QuoteDetailWrapper>
  );

  return (
    <>
      <CustomModal
        visible={visible}
        onClose={() => {
          onClose();
          setStep(1);
        }}
        title={step == 1 ? t("Confirm") : ""}
        outSideClose={false}
        showCloseButton={step == 1}
      >
        <div className={cn(styles.preview)}>
          {step == 1 && (
            <>
              <QuoteFromTo
                fromCoin={fromCoin}
                toCoin={toCoin}
                from_amount={noExponents(
                  formatAmountDecimal(
                    Number(state_form.from),
                    Number(decimalConvert),
                    true
                  ) || 0
                )}
                to_amount={noExponents(
                  formatAmountDecimal(
                    Number(state_form.to),
                    Number(decimalConvert),
                    true
                  ) || 0
                )}
              />

              {/* details box */}
              {details}

              {/* less balance err */}
              {submitCondRes && (
                <WarningText
                  text={t("Amount is too small, Please increase!")}
                  // className={cn('text-danger')}
                />
              )}

              <SubmitButton
                isLoading={isLoadingMutation}
                type="button"
                className={cn("mt-2")}
                btnText={t("Confirm Order")}
                disabled={submitCondRes}
                onClick={handlePlaceConvertLimitOrder}
              />
            </>
          )}

          {step == 2 && (
            <>
              {/* success */}
              <div className={cn("text-center", styles.success)}>
                <FiCheckCircle className={cn(styles.icon)} />

                <span className="h4 my-2">{t("Limit Order Placed")}</span>

                {/* <small>{t("You received")}</small>
              <strong>0.099999 {toCoin}</strong> */}

                <p className={cn(styles.subtitle)}>
                  {t("Your asset of ")}
                  <span>{`${noExponents(
                    Number(userWillSpend)
                  )} ${fromCoin}`}</span>
                  {t(
                    " will not be available for another transaction till the execution of your limit order. You can unlock your asset by cancelling the limit order."
                  )}
                </p>
              </div>

              <WarningText
                text={
                  <>
                    {t(
                      "Even if the limit price is reached, there is a chance that your order will not be filled. You can check and cancel your orders in "
                    )}

                    <Link href={"/orders/convert/open"}>
                      <a>{t("Order History")}.</a>
                    </Link>
                  </>
                }
              />

              <SubmitButton
                isLoading={false}
                type="button"
                className={cn("mt-3")}
                btnText={t("OK")}
                onClick={() => {
                  onOrderSuccess();
                  onClose();
                  setStep(1);
                }}
              />
            </>
          )}
        </div>
      </CustomModal>
    </>
  );
};
