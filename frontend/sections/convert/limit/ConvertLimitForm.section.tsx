import cn from "classnames";
import { CustomTooltip } from "components/custom_tooltip/CustomTooltip.component";
import Loader from "components/loader/Loader.component";
import { CustomModal } from "components/modal/CustomModal.component";
import { TextInputConvert } from "components/text_input/TextInputConvert.component";
import { WarningText } from "components/warning_text/WarningText.component";
import useTranslation from "next-translate/useTranslation";
import { Dispatch, useEffect } from "react";
import { FiBarChart2 } from "react-icons/fi";
import { HiOutlineCog6Tooth } from "react-icons/hi2";
import { TbArrowsDownUp } from "react-icons/tb";
import Select from "react-select";
import { daysTextList } from "src/helpers/corearrays";
import {
  divideNumbers,
  formatAmountDecimal,
  noExponents,
} from "src/helpers/corefunctions";
import styles from "../Convert.section.module.sass";
import { Action_Limit, State_Limit } from "../Convert.type";
import { ConvertCurrencyModal } from "../ConvertCurrencyModal.section";
import { ConvertLimitPreviewModal } from "./ConvertLimitPreviewModal.section";
import { useConvertLimitForm } from "./useConvertLimitForm.section";
import { RadioWalletTypeInput } from "components/radio/RadioWalletTypeInput.component";
import { WALLET_TYPE } from "src/helpers/backend/backend.coreconstants";

export const ConvertLimitForm: React.FC<{
  state: State_Limit;
  dispatch: Dispatch<Action_Limit>;
  isLoadingValidData: boolean;
  decimalConvert: number;
  updatePair: (from_currency: string, to_currency: string) => void;
}> = ({ state, dispatch, isLoadingValidData, decimalConvert, updatePair }) => {
  const { t } = useTranslation("common");

  const {
    register,
    setValue,
    errors,
    values,
    previewDisable,
    handleUpdateCurrency,
    handleToggleFromTo,
    spotBalanceFrom,
    fundingBalanceFrom,
    spotBalanceTo,
    fundingBalanceTo,
    handleShowPreview,
    onConvertChange,
    onFromChange,
    onToChange,
    getMarketPrice,
    onOrderSuccess,
    onWalletTypeChange,
    wallet_type,
    decimalWallet,
  } = useConvertLimitForm(state, dispatch, decimalConvert, updatePair);

  const {
    showFromModal,
    showToModal,
    showPreview,
    from,
    to,
    showChart,
    expireTime,
    showSettings,
    chartCurrencyPair,
  } = state;

  // updating the convert input text when the chart data api is being called
  useEffect(() => {
    let marketPriceUpdated: number = Number(chartCurrencyPair?.market_price);

    if (chartCurrencyPair?.base != from?.code) {
      marketPriceUpdated = divideNumbers(
        1,
        Number(chartCurrencyPair?.market_price)
      );
    }

    marketPriceUpdated = Number(
      formatAmountDecimal(marketPriceUpdated, decimalConvert)
    );

    setValue("convert", noExponents(marketPriceUpdated), {
      shouldValidate: true,
    });
  }, [chartCurrencyPair?.market_price, from?.code]);

  return (
    <>
      <div className={cn(styles.limitForm, showChart && styles.chartIsOpen)}>
        {/* limit settings */}
        <div className={cn(styles.limitSettings)}>
          <FiBarChart2
            role="button"
            aria-label={t("toggle chart")}
            className={cn(styles.icon, {
              [styles.active]: showChart,
            })}
            onClick={() => dispatch({ type: "toggle_chart" })}
          />

          <HiOutlineCog6Tooth
            role="button"
            aria-label={t("show settings")}
            className={cn(styles.icon)}
            onClick={() => dispatch({ type: "toggle_settings_modal" })}
          />
        </div>

        {/* wallet type */}
        {/* <ConvertWalletTypes
          walletType={walletType}
          onWalletSelect={onWalletSelect}
        /> */}

        {isLoadingValidData && (
          <div className="my-3 loaderWrapper">
            <Loader />
          </div>
        )}

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
                    formatAmountDecimal(spotBalanceFrom, decimalConvert, true)
                  ),
                },
                {
                  id: String(WALLET_TYPE.FUNDING),
                  value: String(WALLET_TYPE.FUNDING),
                  text: t("Funding"),
                  balance: noExponents(
                    formatAmountDecimal(
                      fundingBalanceFrom,
                      decimalConvert,
                      true
                    )
                  ),
                },
              ]}
              onChange={(value) => onWalletTypeChange(Number(value))}
            />

            {/* from */}
            <TextInputConvert
              className={cn("mb-3")}
              label={t("From")}
              id={"from"}
              balance_coin={
                from
                  ? noExponents(
                      formatAmountDecimal(
                        wallet_type == WALLET_TYPE.SPOT
                          ? spotBalanceFrom
                          : fundingBalanceFrom,
                        decimalConvert,
                        true
                      )
                    )
                  : " "
              }
              coin={String(from?.code)}
              value={Number(values.from)}
              // usd_rate={1.2}
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
                onFromChange(
                  wallet_type == WALLET_TYPE.SPOT
                    ? spotBalanceFrom
                    : wallet_type == WALLET_TYPE.FUNDING
                    ? fundingBalanceFrom
                    : 1
                );
              }}
              placeholder={`${t("Min")} ${noExponents(from?.min)}/ ${t(
                "Max"
              )} ${noExponents(from?.max)}`}
              register={register("from", {
                valueAsNumber: true,
                // required: t("Amount is required"),
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
                    if (v && Number(v) > 0) {
                      if (wallet_type == WALLET_TYPE.SPOT) {
                        return (
                          Number(v) <= spotBalanceFrom ||
                          t("You do not have enough fund ")
                        );
                      }

                      if (wallet_type == WALLET_TYPE.FUNDING) {
                        return (
                          Number(v) <= fundingBalanceFrom ||
                          t("You do not have enough fund ")
                        );
                      }
                    }
                  },
                },
                onChange: (e) => {
                  onFromChange(e.target.value);
                },
              })}
              err={errors.from?.message}
            />

            {/* convert price */}
            <TextInputConvert
              className={cn("mb-3")}
              id={"convert"}
              label={t("Convert Price")}
              market_price={
                chartCurrencyPair
                  ? noExponents(
                      formatAmountDecimal(
                        Number(getMarketPrice()),
                        decimalConvert,
                        true
                      )
                    )
                  : undefined
              }
              // balance_coin={1}
              coin={String(to?.code)}
              value={Number(values.convert)}
              // usd_rate={1}
              // onCoinClick={() => dispatch({ type: "toggle_showFromModal" })}
              onBalanceClick={() => {
                const value = chartCurrencyPair
                  ? formatAmountDecimal(
                      Number(getMarketPrice()),
                      decimalConvert,
                      true
                    )
                  : "";
                setValue("convert", noExponents(Number(value)), {
                  shouldValidate: true,
                });
                onConvertChange(value);
              }}
              placeholder={t("Enter Price")}
              register={register("convert", {
                valueAsNumber: true,
                // required: t("Price is required"),
                min: {
                  value: formatAmountDecimal(
                    Number(getMarketPrice()),
                    decimalConvert
                  ),
                  // value: getMarketPrice(),
                  message: t(
                    "Price is less than the market rate which will be a loss."
                  ),
                },
                onChange: (e) => {
                  onConvertChange(e.target.value);
                },
              })}
              err={errors.convert?.message}
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
              id={"to"}
              label={t("To")}
              balance_coin={
                to
                  ? noExponents(
                      formatAmountDecimal(
                        wallet_type == WALLET_TYPE.SPOT
                          ? spotBalanceTo
                          : fundingBalanceTo,
                        decimalConvert,
                        true
                      )
                    )
                  : " "
              }
              coin={String(to?.code)}
              value={Number(values.to)}
              // usd_rate={11.2}
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
                onToChange(
                  wallet_type == WALLET_TYPE.SPOT
                    ? spotBalanceTo
                    : wallet_type == WALLET_TYPE.FUNDING
                    ? fundingBalanceTo
                    : 1
                );
              }}
              register={register("to", {
                valueAsNumber: true,
                onChange: (e) => {
                  onToChange(e.target.value);
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
                onClick={handleShowPreview}
              >
                {previewDisable ? t("Enter an amount") : t("Place Order")}
              </button>
            </div>
          </>
        )}
      </div>

      {/* settings - expires in */}
      <CustomModal
        visible={showSettings}
        onClose={() => dispatch({ type: "toggle_settings_modal" })}
        title={t("Setting")}
      >
        <div className={cn(styles.expireContent)}>
          <strong>
            {t("Expires in")}{" "}
            <CustomTooltip
              content={t(
                "The expiration time is the time which the order becomes invalid."
              )}
            />
          </strong>

          <Select
            className={cn(styles.select)}
            classNamePrefix={"custom-select"}
            isSearchable={false}
            placeholder={t("Select Side")}
            options={daysTextList}
            value={daysTextList.find((el) => el.value == expireTime)}
            onChange={(e) =>
              dispatch({ type: "setExpireTime", v: Number(e?.value) })
            }
            styles={{
              control: (baseStyles, state) => ({
                ...baseStyles,
                height: "30px !important",
                minHeight: "30px !important",
                lineHeight: "30px !important",
              }),
            }}
          />
        </div>
      </CustomModal>

      {/* from coin currency */}
      <ConvertCurrencyModal
        visible={showFromModal}
        onClose={() => dispatch({ type: "toggle_showFromModal" })}
        type={"from"}
        fromCode={String(from?.code)}
        onItemClick={(code) => handleUpdateCurrency(code, "from")}
      />

      {/* to coin currency */}
      <ConvertCurrencyModal
        visible={showToModal}
        onClose={() => dispatch({ type: "toggle_showToModal" })}
        type={"to"}
        fromCode={String(from?.code)}
        onItemClick={(code) => handleUpdateCurrency(code, "to")}
      />

      {/* show preview */}
      <ConvertLimitPreviewModal
        visible={showPreview}
        onClose={() => dispatch({ type: "toggle_showPreview" })}
        onOrderSuccess={onOrderSuccess}
        state_limit={state}
        state_form={values}
        walletType={wallet_type}
        expireTime={expireTime}
      />
    </>
  );
};
