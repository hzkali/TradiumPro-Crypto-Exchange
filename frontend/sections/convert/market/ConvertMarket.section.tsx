import cn from "classnames";
import styles from "../Convert.section.module.sass";
import useTranslation from "next-translate/useTranslation";
import { TextInputConvert } from "components/text_input/TextInputConvert.component";
import { TbArrowsDownUp } from "react-icons/tb";
import { ConvertMarketPreviewModal } from "./ConvertMarketPreviewModal.section";
import { WarningText } from "components/warning_text/WarningText.component";
import { WALLET_TYPE } from "src/helpers/backend/backend.coreconstants";
import { useConvertMarket } from "./useConvertMarket.section";
import { CustomModal } from "components/modal/CustomModal.component";
import Loader from "components/loader/Loader.component";
import { formatAmountDecimal, noExponents } from "src/helpers/corefunctions";
import { SelectConvertMarketCurrency } from "components/select_coin/convert/SelectConvertMarketCurrency.component";
import { RadioWalletTypeInput } from "components/radio/RadioWalletTypeInput.component";

export const ConvertMarket: React.FC<{
  refetchBalance: boolean;
}> = ({ refetchBalance }) => {
  const { t } = useTranslation("common");

  const {
    register,
    setValue,
    errors,
    values,
    resetField,
    setError,
    clearErrors,
    previewDisable,
    state,
    dispatch,
    handleUpdateCurrency,
    handleToggleFromTo,
    spotBalanceFrom,
    fundingBalanceFrom,
    spotBalanceTo,
    fundingBalanceTo,
    decimalWallet,
    handleShowPreview,
    isLoading,
    isSuccess,
    notValidCurrency,
    wallet_type,
    fromAmount,
  } = useConvertMarket(refetchBalance);

  const { showFromModal, showToModal, showPreview, from, to } = state;

  // console.log("conv: state", state);
  // console.log("conv: errors", values, errors);

  return (
    <>
      {isLoading && (
        <div className="loaderWrapper">
          <Loader />
        </div>
      )}

      {/* if any of from or to is not  */}
      {notValidCurrency && (
        <>
          <h4 className={cn("h4 px-1 py-4 text-danger")}>
            {t("No valid currency found for Convert. Contact to support.")}
          </h4>
        </>
      )}

      {/* if both from & to */}
      {from && to && (
        <>
          {/* wallet */}
          <RadioWalletTypeInput
            className="mb-3"
            // label={t("Select a wallet type")}
            name={"wallet_type"}
            err={errors.wallet_type?.message}
            code={from?.code}
            register={register}
            showBalance={false}
            options={[
              {
                id: String(WALLET_TYPE.SPOT),
                value: String(WALLET_TYPE.SPOT),
                text: t("Spot"),
                balance: noExponents(
                  formatAmountDecimal(spotBalanceFrom, decimalWallet, true)
                ),
              },
              {
                id: String(WALLET_TYPE.FUNDING),
                value: String(WALLET_TYPE.FUNDING),
                text: t("Funding"),
                balance: noExponents(
                  formatAmountDecimal(fundingBalanceFrom, decimalWallet, true)
                ),
              },
            ]}
            onChange={(value) => {
              const type = Number(value);
              const amount = Number(fromAmount);

              if (amount && amount > 0) {
                if (amount < Number(from?.min)) {
                  setError("from", {
                    type: "manual",
                    message: t("Amount is too small"),
                  });
                } else if (amount > Number(from?.max)) {
                  setError("from", {
                    type: "manual",
                    message: t("Amount exceeded"),
                  });
                } else if (
                  type == WALLET_TYPE.SPOT &&
                  amount > spotBalanceFrom
                ) {
                  setError("from", {
                    type: "manual",
                    message: t("You do not have enough fund "),
                  });
                } else if (
                  type == WALLET_TYPE.FUNDING &&
                  amount > fundingBalanceFrom
                ) {
                  setError("from", {
                    type: "manual",
                    message: t("You do not have enough fund "),
                  });
                } else {
                  clearErrors("from");
                }
              }
            }}
          />

          {/* from */}
          <TextInputConvert
            className={cn("mb-3")}
            label={t("From")}
            balance_coin={
              from
                ? noExponents(
                    formatAmountDecimal(
                      wallet_type == WALLET_TYPE.SPOT
                        ? spotBalanceFrom
                        : fundingBalanceFrom,
                      decimalWallet,
                      true
                    )
                  )
                : " "
            }
            coin={String(from?.code)}
            value={Number(values.from)}
            placeholder={`${t("Min")} ${noExponents(from?.min)}/ ${t(
              "Max"
            )} ${noExponents(from?.max)}`}
            onCoinClick={() => dispatch({ type: "toggle_showFromModal" })}
            onBalanceClick={() => {
              setValue(
                "from",
                wallet_type == WALLET_TYPE.SPOT
                  ? spotBalanceFrom
                  : wallet_type == WALLET_TYPE.FUNDING
                  ? fundingBalanceFrom
                  : "",
                { shouldValidate: true }
              );
              resetField("to");
            }}
            register={register("from", {
              valueAsNumber: true,
              // required: t("Balance is required"),
              max: {
                value: Number(from?.max),
                message: t("Amount exceeded"),
              },
              min: {
                value: Number(from?.min),
                message: t("Amount is too small"),
              },
              validate: {
                amountMoreThanBalance: (v) => {
                  if (isNaN(Number(v))) return;

                  return (
                    (wallet_type == WALLET_TYPE.SPOT &&
                      Number(v) <= spotBalanceFrom) ||
                    (wallet_type == WALLET_TYPE.FUNDING &&
                      Number(v) <= fundingBalanceFrom) ||
                    t("You do not have enough fund ")
                  );
                },
              },
              onChange: (e) => {
                resetField("to");
              },
            })}
            err={errors.from?.message}
          />

          {/* toggle */}
          <div className={cn(styles.toggleWrapper)}>
            <button
              type="button"
              className="button-circle button-stroke"
              aria-label={t("toggle")}
              onClick={handleToggleFromTo}
            >
              <TbArrowsDownUp />
            </button>
          </div>

          {/* to */}
          <TextInputConvert
            className={cn("mb-3")}
            label={t("To")}
            balance_coin={
              to
                ? noExponents(
                    formatAmountDecimal(
                      wallet_type == WALLET_TYPE.SPOT
                        ? spotBalanceTo
                        : fundingBalanceTo,
                      decimalWallet,
                      true
                    )
                  )
                : " "
            }
            coin={String(to?.code)}
            value={Number(values.to)}
            showBalance={true}
            // usd_rate={11.2}
            // placeholder={t(`Min ${Number(to?.min)} / Max ${Number(to?.max)}`)}
            onCoinClick={() => dispatch({ type: "toggle_showToModal" })}
            onBalanceClick={() => {
              setValue(
                "to",
                wallet_type == WALLET_TYPE.SPOT
                  ? spotBalanceTo
                  : wallet_type == WALLET_TYPE.FUNDING
                  ? fundingBalanceTo
                  : "",
                { shouldValidate: true }
              );
              resetField("from");
            }}
            register={register("to", {
              valueAsNumber: true,
              onChange: (e) => {
                resetField("from");
              },
            })}
            err={errors.to?.message}
          />

          {/* warning text */}
          {1 > 3 && (
            <WarningText
              className="my-3 mt-4"
              text={
                "Your Convert trade might be impacted due to a system upgrade on 2023-06-13 at 5AM(UTC) for {2} minutes. Please try again later or contact us if you encounter any issues."
              }
            />
          )}

          {/* preview button */}
          <div className={cn("text-center")}>
            <button
              type="button"
              className={cn("mt-3 button")}
              disabled={previewDisable}
              onClick={() => handleShowPreview()}
            >
              {previewDisable ? t("Enter an amount") : t("Preview Conversion")}
            </button>
          </div>
        </>
      )}

      {/* from coin currency */}
      <CustomModal
        visible={showFromModal}
        onClose={() => dispatch({ type: "toggle_showFromModal" })}
        title={t("Select a currency")}
      >
        <SelectConvertMarketCurrency
          onItemClick={(coin) => handleUpdateCurrency(coin?.code, "from")}
          hideBalance
        />
      </CustomModal>

      {/* to coin currency */}
      <CustomModal
        visible={showToModal}
        onClose={() => dispatch({ type: "toggle_showToModal" })}
        title={t("Select a currency")}
      >
        <SelectConvertMarketCurrency
          onItemClick={(coin) => handleUpdateCurrency(coin?.code, "to")}
        />
      </CustomModal>

      {/* show preview */}
      <CustomModal
        visible={showPreview}
        onClose={() => dispatch({ type: "toggle_showPreview" })}
        outSideClose={false}
      >
        <ConvertMarketPreviewModal
          onClose={() => dispatch({ type: "toggle_showPreview" })}
          state_market={state}
          state_form={values}
          walletType={Number(wallet_type)}
        />
      </CustomModal>
    </>
  );
};
