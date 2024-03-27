import { getCookie, setCookies } from "cookies-next";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getSettingsData, getUser } from "src/ssr/data";
import { setUser } from "src/store/reducer/authentication.reducer";
import { Router, useRouter } from "next/router";
import NProgress from "nprogress";
import {
  SETTINGS_GROUP,
  SETTINGS_SLUG,
} from "src/helpers/backend/backend.slugcontanst";
import { setAppSettings } from "src/store/reducer/appSettings.reducer";
import { getLocalStorageData, setLocalData } from "src/helpers/corefunctions";
import {
  LOCALSTORAGE_DATA,
  NOTIFICATION_LIST_LOADER_TIMEOUT,
  TOASTER_MSG_TYPE,
} from "src/helpers/coreconstants";
import { setClientEndUserSettings } from "src/store/reducer/clientEndUserSettings.reducer";
import {
  futuresSettingsStateType,
  tradeSettingsStateType,
} from "types/globalTypes";
import { setTradeSettingsUpdate } from "src/store/reducer/tradeSettings.reducer";
import { UserNotificationEventDocument } from "src/graphql/subscription/userNotification.subscriptions";
import { useToast } from "src/hooks/useToast";
import { AppInitialProps } from "next/app";
import {
  APP_DEFAULT,
  NOTICE_TYPE,
  SYSTEM_ACTION_CMD,
} from "src/helpers/backend/backend.coreconstants";
import { useSubscription } from "@apollo/client";
import {
  setNotificationHeadRefetch,
  setNotificationListRefetch,
  setNotificationListLoading,
} from "src/store/reducer/notification.reducer";
import { UserSystemMessageEventDocument } from "src/graphql/subscription/userSystemMessage.subscriptions";
import { UserSystemNoticesEventDocument } from "src/graphql/subscription/userSystemNotices.subscriptions";
import { setNewNoticeUpdate } from "src/store/reducer/generalNotice.reducer";
import { Currencies } from "src/helpers/backend/backend.country_data.helper";
import { USER_NOTIFY_TYPE } from "src/helpers/backend/backend.notification_constants";
import { setFuturesSettingsUpdate } from "src/store/reducer/futuresSettings.reducer";

const AuthGuard: React.FC<{
  pageProps: AppInitialProps | any;
  children: any;
}> = ({ pageProps, children }) => {
  const countryData = pageProps?.data?.ip_data?.country_data;
  const { customToast } = useToast();
  const router = useRouter();

  const [userData, setUserDate] = useState<any>();

  const dispatch = useDispatch();

  const getUserData = async () => {
    try {
      const data = await getUser();
      setUserDate(data.data);
      dispatch(setUser(data.data));
    } catch (err) {
      console.error(err);
    }
  };

  const appSettings = async () => {
    try {
      const settings = await getSettingsData(
        [
          SETTINGS_GROUP.APPLICATION,
          SETTINGS_GROUP.GENERAL,
          SETTINGS_GROUP.BUSINESS,
        ],
        [SETTINGS_SLUG.USER_KYC_IS_ENABLED]
      );

      dispatch(setAppSettings(settings));
    } catch (error) {
      dispatch(setAppSettings(null));
    }
  };

  useEffect(() => {
    const token = getCookie("token");
    token && getUserData();
    appSettings();
  }, []);

  // hide balance status
  useEffect(() => {
    const hideBalanceStatusFromLocal = !!Number(
      getLocalStorageData(LOCALSTORAGE_DATA.HIDE_BALANCE_STATUS)
    );

    dispatch(
      setClientEndUserSettings({
        hideBalanceStatus: !hideBalanceStatusFromLocal ? false : true,
      })
    );
  }, []);

  // hide zero balance status
  useEffect(() => {
    const hideZeroBalanceStatusFromLocal = !!Number(
      getLocalStorageData(LOCALSTORAGE_DATA.HIDE_ZERO_BALANCE_STATUS)
    );

    dispatch(
      setClientEndUserSettings({
        hideZeroBalanceStatus: !hideZeroBalanceStatusFromLocal ? false : true,
      })
    );
  }, []);

  // set theme in local storage
  useEffect(() => {
    const getTheme = getLocalStorageData(LOCALSTORAGE_DATA.THEME);

    if (getTheme) {
      document.body.dataset.theme = getTheme;
    }
  }, []);

  // check and set trade settings
  useEffect(() => {
    const ts: tradeSettingsStateType | undefined = getLocalStorageData(
      LOCALSTORAGE_DATA.TRADE_SETTINGS
    ); // ts for trade settings

    if (ts) dispatch(setTradeSettingsUpdate(ts));
  }, []);

  // check and set futures settings
  useEffect(() => {
    const fs: futuresSettingsStateType | undefined = getLocalStorageData(
      LOCALSTORAGE_DATA.FUTURES_SETTINGS
    ); // fs for futures settings

    if (fs)
      dispatch(
        setFuturesSettingsUpdate({
          styleSettings: fs.styleSettings,
          orderView: fs.orderView,
          basePrice: fs.basePrice,
          colorPreference: fs.colorPreference,
          colorDirection: fs.colorDirection,
          layoutType: fs.layoutType,
          showMarginModeAndLeverageSettings:
            fs.showMarginModeAndLeverageSettings,
        })
      );
  }, []);

  // set fiat currency code & symbol in redux
  useEffect(() => {
    let currency_code = getCookie("currency") || countryData?.currency;
    if (!currency_code) {
      currency_code = APP_DEFAULT.CURRENCY_CODE;
    }
    const symbol = Currencies[currency_code]?.symbol ?? "";
    setCookies("currency", currency_code);
    dispatch(
      setClientEndUserSettings({
        currency: currency_code,
        currency_symbol: symbol,
      })
    );
  }, [countryData]);

  //  notification subscriptions
  useSubscription(UserNotificationEventDocument, {
    variables: {
      usercode: userData?.usercode || undefined,
    },
    onSubscriptionData: ({ subscriptionData }) => {
      const res = subscriptionData?.data?.s_user_userNotificationEvent;
      if (res) {
        if (res.success) {
          if (
            res.notify_type == USER_NOTIFY_TYPE.REFETCH ||
            res.notify_type == USER_NOTIFY_TYPE.SHOW_ALERT_N_REFETCH
          ) {
            dispatch(setNotificationListLoading(true));
            dispatch(setNotificationHeadRefetch(true));
            dispatch(setNotificationListRefetch(true));

            setTimeout(() => {
              dispatch(setNotificationListRefetch(false));
              dispatch(setNotificationHeadRefetch(false));
            }, 100);
            setTimeout(() => {
              dispatch(setNotificationListLoading(false));
            }, NOTIFICATION_LIST_LOADER_TIMEOUT);
          }

          if (
            res.notify_type == USER_NOTIFY_TYPE.SHOW_ALERT ||
            res.notify_type == USER_NOTIFY_TYPE.SHOW_ALERT_N_REFETCH
          ) {
            customToast(res.message, TOASTER_MSG_TYPE.SUCCESS_MSG);
          }
        } else {
          customToast(res.message, TOASTER_MSG_TYPE.ERROR_MSG);
        }
      }
    },
  });

  // system core message for user
  useSubscription(UserSystemMessageEventDocument, {
    variables: {},
    onSubscriptionData: ({ subscriptionData }) => {
      const res = subscriptionData?.data?.s_core_systemMessageForUser;

      if (res) {
        dispatch(setNotificationListLoading(true));
        dispatch(setNotificationHeadRefetch(true));
        dispatch(setNotificationListRefetch(true));

        setTimeout(() => {
          dispatch(setNotificationHeadRefetch(false));
          dispatch(setNotificationListRefetch(false));
        }, 100);
        setTimeout(() => {
          dispatch(setNotificationListLoading(false));
        }, NOTIFICATION_LIST_LOADER_TIMEOUT);
      } else {
        customToast(res.message, TOASTER_MSG_TYPE.ERROR_MSG);
      }
    },
  });

  // system notice
  useSubscription(UserSystemNoticesEventDocument, {
    variables: {},
    onSubscriptionData: ({ subscriptionData }) => {
      const res = subscriptionData?.data?.s_core_systemNoticeForUser;

      if (res) {
        if (res.type == NOTICE_TYPE.SYSTEM_ACTION_CMD) {
          processSystemActionCmd(res.alert_type);
          return;
        }

        dispatch(setNewNoticeUpdate(true));
        setTimeout(() => {
          dispatch(setNewNoticeUpdate(false));
        }, 100);
      } else {
        customToast(res.message, "error");
      }
    },
  });

  const processSystemActionCmd = (cmd: SYSTEM_ACTION_CMD) => {
    const trade_page_urls = ["/trade/spot", "/futures/trade"];
    if (cmd == SYSTEM_ACTION_CMD.RELOAD) {
      if (
        trade_page_urls.find((url: string) => router.pathname.includes(url))
      ) {
        setTimeout(() => window?.location?.reload(), 3000);
      }
    }
  };

  useEffect(() => {
    Router.events.on("routeChangeStart", () => NProgress.start());
    Router.events.on("routeChangeComplete", () => NProgress.done());
    Router.events.on("routeChangeError", () => NProgress.done());
  }, []);

  return children;
};

export default AuthGuard;
