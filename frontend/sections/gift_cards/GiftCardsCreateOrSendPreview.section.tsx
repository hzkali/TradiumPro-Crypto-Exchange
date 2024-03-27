import cn from "classnames";
import styles from "./GiftCards.section.module.sass";
import useTranslation from "next-translate/useTranslation";
import {
  CreateOrSendUserGiftCardInput,
  F_GiftCardTemplateModel,
} from "src/graphql/generated";
import { useGiftCardsCreateOrSendPreview } from "./useGiftCards.section";
import { SecurityMethodTabs } from "components/security_method_tabs/SecurityMethodTabs.component";
import { SubmitButton } from "components/submit_button/SubmitButton.component";
import { TransactionHistoryDetailsModalItem } from "sections/history/transaction_history_tab_data/TransactionHistoryDetailsModalItem.section";
import { walletTypeText } from "src/helpers/corearrays";
import { GIFT_CARD_ACTION } from "src/helpers/backend/backend.coreconstants";
import { formatAmountDecimal, noExponents } from "src/helpers/corefunctions";

export const GiftCardsCreateOrSendPreview: React.FC<{
  template_details: F_GiftCardTemplateModel;
  formValues: CreateOrSendUserGiftCardInput;
  fees: number;
  totalAmount: number;
  decimal: any;
  closeModal?: () => void;
}> = ({
  template_details,
  formValues,
  fees,
  totalAmount,
  decimal,
  closeModal,
}) => {
  const { t } = useTranslation("common");

  const {
    register,
    handleSubmit,
    resetField,
    errors,
    verificationMethods,
    verificationEvent,
    onSubmit,
    isLoading,
  } = useGiftCardsCreateOrSendPreview(closeModal);

  const action = Number(formValues.action);

  return (
    <>
      <div className={cn("mb-3")}>
        {/* amount - unit */}
        <TransactionHistoryDetailsModalItem title={t("Amount")}>
          {formValues.amount + " " + formValues.currency_code}
        </TransactionHistoryDetailsModalItem>
        {/* quantity */}
        <TransactionHistoryDetailsModalItem
          title={t("Quantity")}
          hidden={Number(formValues.quantity) <= 1}
        >
          {formValues.quantity}
        </TransactionHistoryDetailsModalItem>
        {/* total fees */}
        <TransactionHistoryDetailsModalItem
          title={
            (Number(formValues.quantity) > 1 ? t("Total ") : "") + t("Fees")
          }
          hidden={action == GIFT_CARD_ACTION.CREATE}
        >
          {!fees
            ? t("No Fee")
            : noExponents(formatAmountDecimal(fees, decimal)) +
              " " +
              formValues.currency_code}
        </TransactionHistoryDetailsModalItem>
        {/* total amount - if send */}
        {(Number(formValues.quantity) > 1 ||
          action == GIFT_CARD_ACTION.SEND) && (
          <TransactionHistoryDetailsModalItem title={t("Total Amount")}>
            {noExponents(formatAmountDecimal(totalAmount, decimal)) +
              " " +
              formValues.currency_code}
          </TransactionHistoryDetailsModalItem>
        )}
        {/* recipient - if send */}
        <TransactionHistoryDetailsModalItem
          title={t("Recipient Credential Type")}
          hidden={action == GIFT_CARD_ACTION.CREATE}
          childClassName="text-capitalize"
        >
          {formValues.recipient_user_credential?.credential_type}
        </TransactionHistoryDetailsModalItem>
        <TransactionHistoryDetailsModalItem
          title={t("Recipient Credential Value")}
          hidden={action == GIFT_CARD_ACTION.CREATE}
        >
          {formValues.recipient_user_credential?.credential_value}
        </TransactionHistoryDetailsModalItem>
        {/* wallet */}
        <TransactionHistoryDetailsModalItem title={t("Wallet")}>
          {walletTypeText[formValues.wallet_type] + t(" Wallet")}
        </TransactionHistoryDetailsModalItem>
        {/* note */}
        {action == GIFT_CARD_ACTION.SEND && (
          <>
            <TransactionHistoryDetailsModalItem
              title={t("Note")}
              hidden={!formValues.note}
            />
            {formValues.note && <p className="px-3">{formValues.note}</p>}
          </>
        )}
      </div>

      <form
        className={cn("mt-3")}
        onSubmit={handleSubmit((d) => onSubmit(d, formValues))}
      >
        {action == GIFT_CARD_ACTION.SEND && (
          <SecurityMethodTabs
            tabsClassName="mt-4"
            methods={verificationMethods}
            register={register}
            errors={errors}
            resetField={resetField}
            showDidntReceiveCodeModal={true}
            verificationCodeEvent={verificationEvent}
          />
        )}

        <SubmitButton
          isLoading={isLoading}
          className="mt-1"
          btnText={t("Confirm & Submit")}
        />
      </form>
    </>
  );
};
