import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface cliendEndSettingsTypes {
  settings: {
    currency?: string;
    currency_symbol?: string;
    hideBalanceStatus?: boolean;
    hideZeroBalanceStatus?: boolean;
  } | null;
}

const initialState: cliendEndSettingsTypes = {
  settings: null,
};

export const clientEndUserSettingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    setClientEndUserSettings: (state, action: PayloadAction<any | null>) => {
      state.settings = { ...state.settings, ...action.payload };
    },
  },
});

export const { setClientEndUserSettings } = clientEndUserSettingsSlice.actions;

export default clientEndUserSettingsSlice.reducer;
