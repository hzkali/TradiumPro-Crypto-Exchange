import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: any = {
  appSettings: null,
};

export const appSettingsSlice = createSlice({
  name: "appSettings",
  initialState,
  reducers: {
    setAppSettings: (state, action: PayloadAction<any | null>) => {
      state.appSettings = action.payload;
    },
  },
});

export const { setAppSettings } = appSettingsSlice.actions;
export default appSettingsSlice.reducer;
