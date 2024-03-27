export interface SigninType {
  email: string;
  phone: string;
  password: string;
}

export interface ForgotPasswordType {
  email?: string | null;
  phone?: string | null;
}
export interface SecurityVerificationType {
  verify_code: number;
}

export interface ForgotNewPasswordFieldType {
  password: string;
  password_confirm: string;
  code: string;
}

export interface LoginFormType {
  onScan: () => void;
}

export type AuthStepsType = 0 | 1 | 2;

export interface AuthGoNextType {
  goNext: () => void;
}

export interface LoginType {
  className?: string;
  content?: string;
  linkText?: string;
  linkUrl?: string;
  children?: React.ReactNode;
  data?: any;
}

export interface AuthPageType {
  className?: string;
  content?: string;
  linkText?: string;
  linkUrl?: string;
  children?: React.ReactNode;
  data?: any;
  type: 0 | 1;
}

export interface SignupType {
  email: string;
  phone: string;
  password: string;
  password_confirm: string;
  acceptTerms: boolean;
  referral_code?: string;
}

export interface VerificationType {
  phone_verify_code: string;
  email_verify_code: string;
  gauth_verify_code: string;
}

export interface UserType {
  avatar?: string | null;
  created_at?: string;
  email?: string;
  nickname?: string | null;
  phone?: string | null;
  reg_type: number;
  // social_id?: string | null;
  status: number;
  type: number;
  // updated_at?: string;
  user_infos?: UserInfosType;
  // // user_settings?: UserSettingsType;
  usercode: string;
  user_settings?: UserSettingsType;
}
export interface UserInfosType {
  city?: string | null;
  country?: string | null;
  created_at?: string;
  dob?: string | null;
  gender?: number;
  language?: string | null;
  state?: string | null;
  street1?: string | null;
  street2?: string | null;
  updated_at?: string;
  user_id: string;
  zip?: string | null;
}
export interface UserSettingsType {
  address_verified?: number;
  address_verify_reject_reason?: string;
  advertising_enabled?: number;
  anti_phishing_code?: string | null;
  created_at?: string;
  default_deposit_wallet_type?: number;
  device_check_enabled?: number;
  email_marketing_enabled?: number;
  email_verified?: number;
  google2fa_enabled?: boolean;
  google2fa_secret?: string | null;
  identity_verified?: number;
  identity_verify_reject_reason?: string;
  last_anti_phishing_updated_at?: string | null;
  last_email_verified_at?: string;
  last_google2fa_enabled_at?: string | null;
  last_identity_verified_at?: string | null;
  last_login_time?: string | null;
  last_phone_verified_at?: string | null;
  market_analytics_enabled?: number;
  phone_verified?: number;
  login_twofa_enabled?: number;
  updated_at?: string;
  user_id: string;
}
export type emailVerificationPayload = {
  email: string;
  verify_code: string;
};
export type phoneVerificationPayload = {
  phone: string;
  verify_code: string;
};
export type payloadType = {
  email_verify_code?: string;
  phone_verify_code?: string;
};

export type resetPasswordType = {
  password: string;
  password_confirm: string;
  code: string;
  email: string;
  phone: string;
};

export interface CodeVerificationType {
  phone_verify_code: string;
  email_verify_code: string;
  gauth_verify_code: string;
}

export interface CodeVerificationUserResponseType {
  email?: string;
  phone?: string;
  code: string;
  source: number;
  phone_verified: number;
  email_verified: number;
}
