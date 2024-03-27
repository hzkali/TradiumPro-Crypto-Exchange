import cn from "classnames";
import styles from "./GiftCards.section.module.sass";
import useTranslation from "next-translate/useTranslation";
import { F_UserGiftCardModel } from "src/graphql/generated";
import { ImageItemFill } from "components/images";
import { AiOutlineGift } from "react-icons/ai";
import { useGiftCardsMyCardItem } from "./useGiftCards.section";
import { CustomModal } from "components/modal/CustomModal.component";
import { ImageCoin } from "components/image_coin/ImageCoin.component";
import { SwalAlert } from "components/swal_alert/SwalAlert.component";
import Icon from "components/icon/Icon.component";
import { SecurityMethodTabs } from "components/security_method_tabs/SecurityMethodTabs.component";
import { SubmitButton } from "components/submit_button/SubmitButton.component";
import { RecipientUserCredential } from "components/recipient_user_credential/RecipientUserCredential.component";
import { USER_CREDENTIALS } from "src/helpers/backend/backend.coreconstants";
import { TextAreaInput } from "components/textarea_input/TextAreaInput.component";
import {
  formatAmountDecimal,
  multiplyNumbers,
  noExponents,
} from "src/helpers/corefunctions";
import { walletTypeText } from "src/helpers/corearrays";
import { WarningText } from "components/warning_text/WarningText.component";

export const GiftCardsMyCardItem: React.FC<{
  item: F_UserGiftCardModel;
  refetch: Function;
  defaultCountryCode?: string;
}> = ({ item, refetch, defaultCountryCode }) => {
  const { t } = useTranslation("common");

  const {
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
  } = useGiftCardsMyCardItem(item, refetch);

  const currency = item.currency;

  return (
    <>
      <div className={cn(styles.item, styles.myCard)}>
        <ImageItemFill
          src={item.template?.image || ""}
          alt={item.template?.title || ""}
        />

        <div
          className={cn(styles.infoBox)}
          onClick={() => setShowDetails(true)}
        >
          <h5 className="h5 mb-1">{item.template?.title}</h5>

          <p>
            <strong>{t("Category: ")}</strong>
            {item.template?.category?.name}
          </p>
        </div>

        <div className={cn(styles.price)}>
          {/* <AiOutlineGift /> */}

          {noExponents(
            formatAmountDecimal(Number(item.amount), currencyDecimal, true)
          ) +
            " " +
            item.currency?.code}
        </div>
      </div>

      {/* details */}
      <CustomModal
        visible={showDetails}
        onClose={handleResetModal}
        outSideClose={false}
        outerClassName={cn(styles.detailsModal)}
      >
        {/* header */}
        <h4 className={cn("h4 mb-3", styles.modalTitle)}>
          {/* {showSend && (
            <button
              type="button"
              className="button-circle button-stroke button-smaller"
              onClick={() => setShowSend(false)}
              aria-label={t("See details")}
            >
              <Icon name="arrow-prev" />
            </button>
          )} */}

          {!showSend ? t("Gift Card Details") : t("Send Gift Card")}
        </h4>

        <div className={cn(styles.detailsWrapper)}>
          {/* template image */}
          <div>
            <div className={cn(styles.item, styles.inModal)}>
              <ImageItemFill
                src={item.template?.image || ""}
                alt={item.template?.title || ""}
              />

              <div className={cn(styles.price)}>
                {noExponents(
                  formatAmountDecimal(
                    Number(item.amount),
                    currencyDecimal,
                    true
                  )
                ) +
                  " " +
                  item.currency?.code}
              </div>
            </div>

            <div className={cn("mt-3", styles.actions)}>
              <SwalAlert
                data={SwalData}
                btnText={t("Redeem")}
                className={cn("button-small")}
                onConfirm={() => handleRedeem(item.uid)}
                disabled={showSend}
              />

              <button
                type="button"
                className={cn("button-small button-green")}
                onClick={() => {
                  !showSend ? handleStepTwo() : setShowSend(false);
                }}
              >
                {(showSend ? t("Cancel ") : "") + t("Send")}
              </button>
            </div>
          </div>

          <div className={cn(styles.info)}>
            {/* info */}
            {!showSend && (
              <div className={cn("")}>
                <h4 className="h4 mb-2">{item.template?.title}</h4>

                {item.template?.description && (
                  <p className="mb-2">{item.template?.description}</p>
                )}

                {/* category */}
                <p className="mb-2">
                  <strong>{t("Category: ")}</strong>
                  {item.template?.category?.name}
                </p>

                {/* currency */}
                <p className="mb-2 d-flex">
                  <strong>{t("Currency: ")}</strong>

                  <div className="coinWrapper ml-1">
                    <div className={cn("imageWrapper")}>
                      <ImageCoin
                        logo={item.currency?.logo}
                        alt={item.currency?.name || item.currency?.code || ""}
                        placeholder={
                          item.currency?.symbol || item.currency?.code
                        }
                      />
                    </div>
                    {`${currency?.code} - ${currency?.name}`}
                    {/* {currencyCode + " " + (item.currency?.name || "")} */}
                  </div>
                </p>

                {/* amount */}
                <p className="mb-2">
                  <strong>{t("Amount: ")}</strong>
                  {noExponents(
                    formatAmountDecimal(
                      Number(item.amount),
                      currencyDecimal,
                      true
                    )
                  ) +
                    " " +
                    currency?.code}
                </p>

                {/* quantity */}
                {Number(item.quantity) > 1 && (
                  <p className="mb-2">
                    <strong>{t("Quantity: ")}</strong>
                    {item.quantity}
                  </p>
                )}

                {/* wallet */}
                <p className="mb-2">
                  <strong>{t("Wallet: ")}</strong>
                  {walletTypeText[item.wallet_type] + t(" Wallet")}
                </p>
              </div>
            )}

            {showSend && (
              <>
                <form
                  className={cn("mt-")}
                  onSubmit={handleSubmit((d) => onSubmit(d, item.uid))}
                >
                  <WarningText
                    iconSize={20}
                    className="mb-3"
                    text={`${t("Fee of")} ${noExponents(
                      formatAmountDecimal(giftCardFee, currencyDecimal, true)
                    )} ${item.currency?.code} ${t(
                      "will be deducted from your"
                    )} ${t(walletTypeText[item.wallet_type])} ${t("wallet.")}`}
                  />

                  <RecipientUserCredential
                    className={cn("mt-")}
                    name={"credential_value"}
                    register={register}
                    setValue={(v) => {
                      setValue("credential_type", v);
                      resetField("credential_value");
                    }}
                    control={control}
                    type={formValues.credential_type as USER_CREDENTIALS}
                    error={errors.credential_value?.message}
                    defaultCountryCode={defaultCountryCode}
                  />

                  <TextAreaInput
                    className={cn("mt-")}
                    label={t("Note (Optional)")}
                    id={"note"}
                    placeholder={t("Type your note...")}
                    register={register("note", {
                      maxLength: {
                        value: 500,
                        message: t("Exceeded maximum length of 500 characters"),
                      },
                    })}
                    err={errors.note?.message}
                  />

                  <SecurityMethodTabs
                    tabsClassName="mt-3"
                    methods={verificationMethods}
                    register={register}
                    errors={errors}
                    resetField={resetField}
                    showDidntReceiveCodeModal={true}
                    verificationCodeEvent={verificationEvent}
                  />

                  <SubmitButton
                    isLoading={isLoading}
                    className="mt-0"
                    btnText={t("Send Gift Card")}
                  />
                </form>
              </>
            )}
          </div>
        </div>
      </CustomModal>
    </>
  );
};
