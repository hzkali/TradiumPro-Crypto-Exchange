import cn from "classnames";
import styles from "./GiftCards.section.module.sass";
import useTranslation from "next-translate/useTranslation";
import { F_GiftCardTemplateModel } from "src/graphql/generated";
import { useGiftCardsBuyForm } from "./useGiftCards.section";
import { ImageItemFill } from "components/images";
import { AiOutlineGift } from "react-icons/ai";
import { SubmitButton } from "components/submit_button/SubmitButton.component";
import TextInput from "components/text_input/TextInput.component";
import { TextAreaInput } from "components/textarea_input/TextAreaInput.component";
import { CustomModal } from "components/modal/CustomModal.component";
import { SelectCurrencyForGiftCards } from "components/select_coin/SelectCurrencyForGiftCards.component";
import { TextInputConvert } from "components/text_input/TextInputConvert.component";
import {
  addNumbers,
  calculateFee,
  decimalCheckForm,
  formatAmountDecimal,
  noExponents,
} from "src/helpers/corefunctions";
import {
  DB_QUERY_DEFAULT,
  FEE_TYPE,
  GIFT_CARD_ACTION,
  USER_CREDENTIALS,
  WALLET_TYPE,
} from "src/helpers/backend/backend.coreconstants";
import { RadioButtonGroup } from "components/radio_button_group/RadioButtonGroup.component";
import { RecipientUserCredential } from "components/recipient_user_credential/RecipientUserCredential.component";
import { GiftCardsCreateOrSendPreview } from "./GiftCardsCreateOrSendPreview.section";
import Link from "next/link";
import { QUERY_PARAM } from "src/helpers/coreconstants";
import { RadioWalletTypeInput } from "components/radio/RadioWalletTypeInput.component";

export const GiftCardsBuyForm: React.FC<{
  template_details: F_GiftCardTemplateModel;
  defaultCountryCode?: string;
}> = ({ template_details, defaultCountryCode }) => {
  const { t } = useTranslation("common");

  const {
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
    currencyDecimal,
    walletVisualDecimal,
    wallet_type,
    handleAmountError,
    clearErrors,
    setError,
    formAmount,
    showTotalBalanceError,
  } = useGiftCardsBuyForm(template_details);

  return (
    <>
      <section className={cn("section ")}>
        <div className={cn("container ")}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className={cn(styles.formWrapper)}
          >
            {/* card type section */}
            <div className={cn(styles.typeWrapper)}>
              <div
                className={cn(styles.type, {
                  [styles.active]: !isBulk,
                })}
                role="button"
                onClick={() => {
                  setValue("quantity", 1, { shouldValidate: true });
                  setIsBulk(false);
                }}
              >
                {t("Create Single")}
              </div>

              <div
                className={cn(styles.type, {
                  [styles.active]: isBulk,
                })}
                role="button"
                onClick={() => {
                  // @ts-ignore
                  setValue("action", String(GIFT_CARD_ACTION.CREATE), {
                    shouldValidate: true,
                  });

                  if (
                    formAmount &&
                    formAmount > 0 &&
                    ((wallet_type == WALLET_TYPE.SPOT &&
                      formAmount > spotBalance) ||
                      (wallet_type == WALLET_TYPE.FUNDING &&
                        formAmount > fundingBalance))
                  ) {
                    setError("amount", {
                      type: "manual",
                      message: t("You do not have enough fund!"),
                    });
                  } else clearErrors("amount");

                  setIsBulk(true);
                }}
              >
                {t("Create Bulk")}
              </div>
            </div>

            {/* template section */}
            <div className={cn(styles.templateWrapper)}>
              <div className={cn(styles.image)}>
                <ImageItemFill
                  src={template_details?.image || ""}
                  alt={template_details?.title || ""}
                />

                <div className={cn(styles.price)}>
                  <AiOutlineGift />

                  {noExponents(
                    formatAmountDecimal(formValues.amount || 0, currencyDecimal)
                  ) +
                    " " +
                    (currency?.code || "")}
                </div>
              </div>

              <h4 className="h4 mt-3 mb-2">{template_details?.title}</h4>

              <p>{template_details?.description}</p>

              {/* gift store */}
              {!storeItems?.length ? null : (
                <>
                  <div className="mt-4" />

                  <hr />

                  <h5 className={cn("h5 mt-4 mb-4", styles.storeTitle)}>
                    <AiOutlineGift />

                    {t(" Gift Card Store")}
                  </h5>
                </>
              )}

              {!storeItems?.length ? null : (
                <div className={cn(styles.storeWrapper)}>
                  {storeItems.map((item) => (
                    <Link
                      href={`/gift-cards/buy/${item.uid}`}
                      passHref
                      key={item.uid}
                    >
                      <div className={cn(styles.storeItem)}>
                        <ImageItemFill
                          src={item?.image || ""}
                          alt={item?.title || ""}
                        />
                      </div>
                    </Link>
                  ))}

                  {totalStoreItems > DB_QUERY_DEFAULT.LIMIT ? (
                    <Link href={`/gift-cards/templates`} passHref>
                      <div className={cn(styles.storeItem, styles.viewMore)}>
                        {t("View More")}
                      </div>
                    </Link>
                  ) : null}
                </div>
              )}
            </div>

            {/* form input section */}
            <div className={cn(styles.inputWrapper)}>
              {/* select currency & amount input */}
              <TextInputConvert
                className={cn("mb-3")}
                label={t("Amount")}
                disabled={!currency}
                id="amount"
                showBalance={false}
                // balance_coin={(currency && spotBalanceDisplay) || " "}
                coin={currency ? String(currency?.code) : t("Select")}
                onCoinClick={() => setShowModal(true)}
                placeholder={
                  currency
                    ? t(
                        `Min ${Number(
                          currency?.min_gift_card_amount
                        )} / Max ${Number(currency?.max_gift_card_amount)}`
                      )
                    : t("Enter amount")
                }
                register={register("amount", {
                  valueAsNumber: true,
                  required: t("Amount is required"),
                  max: {
                    value: Number(currency?.max_gift_card_amount),
                    message: t("Amount exceeded"),
                  },
                  min: {
                    value: Number(currency?.min_gift_card_amount),
                    message: t("Amount is too small"),
                  },
                  validate: {
                    decimalCheck: (v) => decimalCheckForm(v, currencyDecimal, t),
                    amountIsBigger: (v) => {
                      if (v && Number(v) > 0) {
                        if (isCreate) {
                          if (wallet_type == WALLET_TYPE.SPOT) {
                            return (
                              Number(v) <= spotBalance ||
                              t("You do not have enough fund!")
                            );
                          }
                          if (wallet_type == WALLET_TYPE.FUNDING) {
                            return (
                              Number(v) <= fundingBalance ||
                              t("You do not have enough fund!")
                            );
                          }
                        }

                        if (isSend) {
                          const _giftCardFee = () => {
                            if (currency && v) {
                              return calculateFee(
                                currency?.gift_card_fee_type as FEE_TYPE,
                                currency?.gift_card_fee,
                                Number(v)
                              );
                            } else return 0;
                          };

                          const giftCardFee = _giftCardFee();
                          const totalAmount = addNumbers(
                            Number(v),
                            giftCardFee
                          );

                          if (wallet_type == WALLET_TYPE.SPOT) {
                            return (
                              addNumbers(Number(v), giftCardFee) <=
                                spotBalance ||
                              t(
                                "You do not have enough fund! Total amount needed (including fee) "
                              ) +
                                totalAmount +
                                " " +
                                currency?.code
                            );
                          }

                          if (wallet_type == WALLET_TYPE.FUNDING) {
                            return (
                              addNumbers(Number(v), giftCardFee) <=
                                fundingBalance ||
                              t(
                                "You do not have enough fund! Total amount needed (including fee) "
                              ) +
                                totalAmount +
                                " " +
                                currency?.code
                            );
                          }
                        }
                      }
                    },
                  },
                })}
                err={errors.amount?.message}
              />

              {/* wallet select */}
              {currency && (
                <RadioWalletTypeInput
                  label={t("Select a wallet type")}
                  name={"wallet_type"}
                  err={errors.wallet_type?.message}
                  code={currency?.code}
                  register={register}
                  options={[
                    {
                      id: "spot",
                      value: String(WALLET_TYPE.SPOT),
                      text: t("Spot Wallet"),
                      balance: formatAmountDecimal(
                        spotBalance,
                        walletVisualDecimal,
                        true
                      ),
                    },
                    {
                      id: "funding",
                      value: String(WALLET_TYPE.FUNDING),
                      text: t("Funding Wallet"),
                      balance: formatAmountDecimal(
                        fundingBalance,
                        walletVisualDecimal,
                        true
                      ),
                    },
                  ]}
                  onChange={(value) => {
                    handleAmountError(Number(value), action);
                  }}
                />
              )}

              {/* quantity - if bulk */}
              {isBulk && (
                <TextInput
                  className={cn("mt-3")}
                  label={t("Quantity")}
                  placeholder={t("Enter Quantity")}
                  id="quantity"
                  type="number"
                  register={register("quantity", {
                    valueAsNumber: true,
                    required: t("Quantity is required"),
                    min: {
                      value: 1,
                      message: t("Quantity cannot be less than 1"),
                    },
                    validate: (v) =>
                      /^\d+$/.test(String(v)) || t("Invalid quantity"),
                  })}
                  err={errors.quantity?.message}
                />
              )}

              {/* select action */}
              <div className="mt-3">
                <label className="label">{t("Select an Action")}</label>

                <RadioButtonGroup
                  options={actionOptions}
                  name={"action"}
                  errMessage={t("You must select an action")}
                  register={register}
                  errors={errors}
                  onChange={(v) => {
                    resetField("recipient_user_credential.credential_value");
                    handleAmountError(wallet_type, Number(v));
                  }}
                />
              </div>

              {/* note & select recipient - if send */}
              {isSend && (
                <>
                  <TextAreaInput
                    className={cn("mt-3")}
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

                  <RecipientUserCredential
                    className={cn("mt-3")}
                    name={"recipient_user_credential.credential_value"}
                    register={register}
                    setValue={(v) => {
                      setValue("recipient_user_credential.credential_type", v);
                      resetField("recipient_user_credential.credential_value");
                    }}
                    control={control}
                    type={
                      formValues.recipient_user_credential
                        ?.credential_type as USER_CREDENTIALS
                    }
                    error={
                      // @ts-ignore
                      errors.recipient_user_credential?.credential_value
                        ?.message
                    }
                    defaultCountryCode={defaultCountryCode}
                  />
                </>
              )}

              {/* buttons */}
              <div className={cn(styles.submitSection, "mt-3")}>
                <div className={cn(styles.amountSection)}>
                  {/* fee  */}
                  {isSend && (
                    <p>
                      <strong>{t("Fees ")}</strong>

                      <span>
                        {!formValues.amount
                          ? 0 + " " + (currency?.code || "")
                          : noExponents(
                              formatAmountDecimal(
                                totalGiftCardFee,
                                currencyDecimal
                              )
                            ) +
                            " " +
                            (currency?.code || "")}
                      </span>
                    </p>
                  )}

                  <p className={styles.amount}>
                    <strong>{t("Total Amount")}</strong>

                    <span>
                      {(currency && formValues.amount
                        ? noExponents(
                            formatAmountDecimal(totalAmount, currencyDecimal)
                          )
                        : 0) +
                        " " +
                        (currency?.code || "")}
                    </span>
                  </p>

                  {showTotalBalanceError ? (
                    <p className="text-danger">
                      {t("You do not have enough fund!")}
                    </p>
                  ) : null}
                </div>

                {/* submit */}
                <SubmitButton
                  isLoading={false}
                  disabled={showTotalBalanceError}
                  className={cn(styles.button, "m-0")}
                  btnText={
                    isSend ? t("Send") : isCreate ? t("Create") : t("Submit")
                  }
                />
              </div>
            </div>
          </form>
        </div>
      </section>

      {/* select currency */}
      <CustomModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        title={t("Select a currency")}
      >
        <SelectCurrencyForGiftCards
          onItemClick={onUpdateCurrency}
          variables={variables}
          hideBalance={true}
        />
      </CustomModal>

      {/* show details */}
      <CustomModal
        visible={showDetails}
        onClose={() => setShowDetails(false)}
        title={(isCreate ? t("Create") : t("Send")) + t(" Gift Card")}
        outSideClose={false}
        isWider
      >
        <GiftCardsCreateOrSendPreview
          template_details={template_details}
          formValues={{
            ...formValues,
            wallet_type: Number(formValues.wallet_type),
          }}
          fees={totalGiftCardFee}
          totalAmount={totalAmount}
          decimal={currencyDecimal}
          closeModal={() => setShowDetails(false)}
        />
      </CustomModal>
    </>
  );
};
