import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "src/graphql/generated";
import { UserType } from "types/authTypes";
// import { User } from "types/authTypes";

export interface initialUserType {
  user: User | undefined | null;
  isLoggedIn: boolean | undefined | null;
}

const initialState: initialUserType = {
  user: {
    avatar: "",
    created_at: "",
    email: "",
    phone: "",
    reg_type: 0,
    // social_id: "",
    status: 0,
    type: 0,
    // updated_at: "",
    usercode: "",
    nickname: "",
    user_infos: {
      city: "",
      country: "",
      created_at: "",
      dob: "",
      gender: 0,
      language: "",
      state: "",
      street1: "",
      street2: "",
      updated_at: "",
      // user_id: "",
      zip: "",
    },
    user_settings: {
      address_verified: 0,
      address_verify_reject_reason: "",
      advertising_enabled: 0,
      anti_phishing_code: "",
      created_at: "",
      default_deposit_wallet_type: 0,
      device_check_enabled: 0,
      email_marketing_enabled: 0,
      email_verified: 0,
      futures_trade_enabled: 0,
      google2fa_enabled: false,
      // google2fa_secret: "",
      identity_verified: 0,
      identity_verify_reject_reason: "",
      last_anti_phishing_updated_at: "",
      last_email_verified_at: "",
      // last_google2fa_enabled_at: "",
      last_identity_verified_at: "",
      last_login_time: "",
      last_phone_verified_at: "",
      market_analytics_enabled: 0,
      phone_verified: 0,
      login_twofa_enabled: 0,
      updated_at: "",
      // user_id: "",
    },
  },
  isLoggedIn: false,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (
      state: initialUserType,
      action: PayloadAction<User | undefined | null>
    ) => {
      state.user = action.payload;
      state.isLoggedIn = true;
    },
    logout: (state: initialUserType) => {
      state.user = initialState.user;
      state.isLoggedIn = false;
    },
  },
});

export const { setUser, logout } = userSlice.actions;
export default userSlice.reducer;
