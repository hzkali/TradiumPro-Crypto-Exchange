import { configureStore } from "@reduxjs/toolkit";
import appSettingsSlice from "./reducer/appSettings.reducer";
import authenticationSlice from "./reducer/authentication.reducer";
import clientEndUserSettingsSlice from "./reducer/clientEndUserSettings.reducer";
import userNotificationSlice from "./reducer/notification.reducer";
import tradeSettingsSlice from "./reducer/tradeSettings.reducer";
import futuresSettingsSlice from "./reducer/futuresSettings.reducer";
import futuresDataSlice from "./reducer/futuresData.reducer";
import generalNoticeSlice from "./reducer/generalNotice.reducer";
import paymentDataSlice from "./reducer/paymentData.reducer";

export const store = configureStore({
  reducer: {
    user: authenticationSlice,
    appSettings: appSettingsSlice,
    clientEndUserSettings: clientEndUserSettingsSlice,
    tradeSettings: tradeSettingsSlice,
    futuresSettings: futuresSettingsSlice,
    futuresData: futuresDataSlice,
    userNotification: userNotificationSlice,
    generalNotice: generalNoticeSlice,
    paymentData: paymentDataSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
