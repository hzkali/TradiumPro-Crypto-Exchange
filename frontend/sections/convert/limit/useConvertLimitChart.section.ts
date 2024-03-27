import { useSubscription } from "@apollo/client";
import { ApexOptions } from "apexcharts";
import useTranslation from "next-translate/useTranslation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  SpotTradeSubsRes,
  useGetChartDataForLimitConvertQuery,
} from "src/graphql/generated";
import { TradeEventDocument } from "src/graphql/subscription/trade.subscriptions";
import { APP_DEFAULT } from "src/helpers/backend/backend.coreconstants";
import { SETTINGS_SLUG } from "src/helpers/backend/backend.slugcontanst";
import { dateTimeDisplayer, noExponents } from "src/helpers/corefunctions";
import { RootState } from "src/store";
import useDarkMode from "use-dark-mode";
import colors from "../../../styles/colors.module.sass";
import { ChartTimeType, chartTimeText } from "../Convert.type";

export const useConvertLimitChart = (
  state: any,
  dispatch: any,
  decimal?: number
) => {
  const { t } = useTranslation("common");

  const { value: darkmodeValue } = useDarkMode();

  const appSettings = useSelector(
    (state: RootState) => state.appSettings?.appSettings
  );
  const decimalConvert =
    (appSettings &&
      appSettings[SETTINGS_SLUG.CURRENCY_DECIMAL_VALUE_FOR_CONVERT]) ||
    APP_DEFAULT.CRYPTO_VISUAL_DECIMAL;

  const chartTimeList = Object.keys(chartTimeText).map((item) => Number(item));

  const chartOptions: ApexOptions = {
    chart: {
      id: "area-datetime",
      type: "area",
      animations: {
        enabled: false,
      },
      height: 350,
      fontFamily: '"Poppins", sans-serif',
      zoom: {
        autoScaleYaxis: true,
      },
      toolbar: {
        show: false,
      },
      events: {
        click: (e, chart, config) => {
          const data = config.config.series[0].data[config.dataPointIndex];
          if (data && data.length > 0) {
            const [time, value] = [data[0], data[1]];
            console.log("conv: data", config, { time, value });
          }
        },
      },
    },
    theme: { mode: darkmodeValue ? "dark" : "light" },
    noData: {
      text: t("No Data Found!"),
      align: "center",
    },
    stroke: {
      show: true,
      width: 1.5,
      colors: [colors.p1],
    },
    annotations: {
      // yaxis: [
      //   {
      //     y: 30,
      //     borderColor: "#999",
      //     label: {
      //       text: "Support",
      //       style: {
      //         color: "#fff",
      //         background: "#00E396",
      //       },
      //     },
      //   },
      // ],
      // xaxis: [
      //   {
      //     x: new Date(2012, 10, 14).getTime(),
      //     borderColor: "#ff0",
      //   },
      // ],
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: false,
    },
    grid: {
      show: false,
    },
    xaxis: {
      type: "datetime",
      // min: new Date(2023,0,1).getTime(),
      // tickAmount: 4,
    },
    yaxis: {
      labels: { show: false },
    },
    tooltip: {
      x: {
        format: "dd MMM yyyy",
        show: false,
      },
      custom: (options) => {
        const { series, w, dataPointIndex } = options;
        const value = series[0][dataPointIndex];
        const amount = noExponents(value, decimal || decimalConvert);
        const dateTime = w.globals.seriesX[0][dataPointIndex];

        return `<div class="apex-tooltip-convert">
        <small>
          ${dateTimeDisplayer(dateTime)}
        </small>
    
        <span>
          ${amount}
        </span>
      </div>`;
      },
    },
    fill: {
      type: "gradient",
      colors: [colors.p1],
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.75,
        opacityTo: 0.75,
        stops: [0, 100],
      },
    },
  };

  // CHART RELATED QUERIES & FUNCTIONS
  const [convertLimitData, setConvertLimitData] = useState<[number, number][]>(
    []
  );

  const { isLoading: isLoadingChart, refetch: refetchChart } =
    useGetChartDataForLimitConvertQuery(
      {
        currency_pair: `${state.chartCurrencyPair?.base}_${state.chartCurrencyPair?.trade}`,
        days: state.chartTime ? Number(state.chartTime) : ChartTimeType.DAY,
      },
      {
        enabled:
          state.showChart &&
          !!(state.chartCurrencyPair?.base && state.chartCurrencyPair?.trade),
        onSuccess: ({ data }) => {
          const convertLimitDataArr: [number, number][] = [];
          data?.map((item) => {
            convertLimitDataArr.push([Number(item.timestamp), item.price]);
          });
          setConvertLimitData(convertLimitDataArr);
        },
        onError: () => {
          setConvertLimitData([]);
        },
      }
    );

  useSubscription(TradeEventDocument, {
    variables: {
      currency_pair: `${state.chartCurrencyPair?.base}_${state.chartCurrencyPair?.trade}`,
    },
    onSubscriptionData: ({ subscriptionData }) => {
      const trade: SpotTradeSubsRes =
        subscriptionData?.data?.s_spotTrade_spotTradeEvent;

      const tradePrice = Number(trade.price); // also the market price
      const tradeTime = new Date(trade.created_at).getTime();

      const tradeData: [number, number] = [tradeTime, tradePrice];
      const convertLimitDataArr = [...convertLimitData];
      convertLimitDataArr.unshift(tradeData);
      setConvertLimitData(convertLimitDataArr);
      dispatch({
        type: "update_marketPrice",
        v: tradePrice,
      });
    },
  });

  useEffect(() => {
    if (
      state.showChart &&
      state.chartCurrencyPair?.base &&
      state.chartCurrencyPair?.trade
    ) {
      refetchChart();
    }
  }, [state.chartCurrencyPair]);

  const handleChartTimeChange = (time: ChartTimeType) => {
    dispatch({ type: "update_chartTime", time: time });
  };

  const chartSeries = [
    {
      data: convertLimitData,
    },
  ];

  return {
    convertLimitData,
    isLoadingChart,
    chartSeries,
    chartTimeList,
    chartOptions,
    handleChartTimeChange,
  };
};
