import cn from "classnames";
import Loader from "components/loader/Loader.component";
import useTranslation from "next-translate/useTranslation";
import dynamic from "next/dynamic";
import { Dispatch } from "react";
import { formatAmountDecimal } from "src/helpers/corefunctions";
import styles from "../Convert.section.module.sass";
import {
  Action_Limit,
  ChartTimeType,
  State_Limit,
  chartTimeSmallText,
  chartTimeText,
} from "../Convert.type";
import { useConvertLimitChart } from "./useConvertLimitChart.section";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

export const ConvertLimitChart: React.FC<{
  state: State_Limit;
  dispatch: Dispatch<Action_Limit>;
}> = ({ state, dispatch }) => {
  const { t } = useTranslation("common");

  const { showChart, chartTime, chartCurrencyPair, marketPrice } = state;

  const {
    chartTimeList,
    chartOptions,
    isLoadingChart,
    chartSeries,
    handleChartTimeChange,
  } = useConvertLimitChart(state, dispatch, chartCurrencyPair?.trade_decimal);

  return (
    <>
      {/* chart */}
      {showChart && (
        <div className={cn(styles.chartWrapper)}>
          {/* {isLoadingValidData && (
            <div className="my-3 loaderWrapper">
              <Loader />
            </div>
          )} */}

          {chartCurrencyPair && (
            <>
              {/* titles */}
              <div className={cn(styles.title)}>
                <strong>
                  {/* {from?.code}/{to?.code} */}
                  {`${chartCurrencyPair?.base ?? ""} / ${
                    chartCurrencyPair?.trade ?? ""
                  }`}
                </strong>{" "}
                <small>
                  1 {chartCurrencyPair?.base} ={" "}
                  {marketPrice
                    ? formatAmountDecimal(
                        marketPrice,
                        chartCurrencyPair?.trade_decimal
                      )
                    : 0}{" "}
                  {chartCurrencyPair?.trade}
                </small>
              </div>

              {/* info & times */}
              <div className={cn(styles.rateAndTime)}>
                {/* rate & info */}
                <div className={cn(styles.rateInfo)}>
                  {/* <div className={cn(styles.default)}>1.0000</div> */}

                  <div
                    className={cn(
                      styles.upDown,
                      Number(chartCurrencyPair?.change) >= 0
                        ? styles.success
                        : styles.err
                    )}
                  >
                    {Number(chartCurrencyPair?.change) >= 0 ? "+" : ""}
                    {chartCurrencyPair?.change ?? 0}%
                  </div>

                  <div className={cn(styles.time)}>
                    {t("Past ") + t(chartTimeText[chartTime])}
                  </div>
                </div>

                {/* chart time change */}
                <div className={cn(styles.chartTimes)}>
                  {chartTimeList.map((el) => (
                    <button
                      key={el}
                      type="button"
                      className={cn("button-smaller", {
                        [`button-stroke`]: el != chartTime,
                      })}
                      onClick={() => handleChartTimeChange(el as ChartTimeType)}
                    >
                      <small>{chartTimeSmallText[el]}</small>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* main chart */}
          <div className={cn(styles.chartContainer)}>
            {isLoadingChart ? (
              <div className="loaderWrapper">
                <Loader />
              </div>
            ) : (
              <ReactApexChart
                options={chartOptions}
                series={chartSeries || []}
                type="area"
                height={350}
              />
            )}
          </div>
        </div>
      )}
    </>
  );
};
