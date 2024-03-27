import { setCookies } from "cookies-next";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import {
  useSignupMutation,
  useResetPasswordMutation,
  useVerifyAuthCodeMutation,
  useLoginMutation,
} from "src/graphql/generated";
import { SigninType, SignupType, VerificationType } from "types/authTypes";
import { logout, setUser } from "../reducer/authentication.reducer";
import {
  decryptMessage,
  getLocalStorageData,
  loginHelper,
  removeLocalData,
  setLocalData,
  setUserDataInLocalStorage,
} from "src/helpers/corefunctions";
import {
  CODE,
  VERIFICATION_CODE_METHOD,
  VERIFICATION_CODE_EVENT,
} from "src/helpers/backend/backend.coreconstants";
import useTranslation from "next-translate/useTranslation";
import { useForm } from "react-hook-form";
import {
  LOCALSTORAGE_DATA,
  QUERY_PARAM,
  REDIRECT_URLS,
  SOCIAL_AUTHORIZATION_TYPE,
} from "src/helpers/coreconstants";
import { getDataByUserCode, logoutHandlerMutation } from "src/ssr/data";
import { useToast } from "src/hooks/useToast";
import { useGeetest } from "src/hooks/useGeetest";

export const useVerifyAuthCode = () => {
  const { t } = useTranslation("common");
  const { isLoading, isError, mutateAsync } = useVerifyAuthCodeMutation();
  const router = useRouter();
  const dispatch = useDispatch();
  const [localDataJason, setlocalDataJason] = useState<string>();
  const userData = getLocalStorageData(LOCALSTORAGE_DATA.USERDATA);
  const usercode = userData?.usercode;
  const { customToast } = useToast();

  const getUserByCodeData = async () => {
    const data = await getDataByUserCode(userData?.usercode);
    if (data) {
      const margeLocalData = {
        ...userData,
        ...data?.user_settings,
        email: data?.email,
        phone: data?.phone,
      };
      const dataJson = JSON.stringify(margeLocalData);
      setLocalData(LOCALSTORAGE_DATA.USERDATA, margeLocalData);
      setlocalDataJason(dataJson);
    } else {
      router.push(REDIRECT_URLS.LOGIN);
    }
  };

  useEffect(() => {
    if (usercode) {
      getUserByCodeData();
    } else {
      router.push(REDIRECT_URLS.LOGIN);
    }
  }, []);

  const userDataCode = userData?.code;
  const VerifyButton =
    userDataCode == CODE.VERIFY_EMAIL
      ? t("Email")
      : userDataCode == CODE.VERIFY_PHONE
      ? t("Phone")
      : userDataCode == CODE.VERIFY_DEVICE
      ? t("Device")
      : t("unknown");

  let event = 0;
  if (userDataCode == CODE.VERIFY_DEVICE) {
    event = VERIFICATION_CODE_EVENT.DEVICE_VERIFICATION;
  } else if (userDataCode == CODE.VERIFY_EMAIL) {
    event = VERIFICATION_CODE_EVENT.SIGN_UP;
  } else if (userDataCode == CODE.VERIFY_PHONE) {
    event = VERIFICATION_CODE_EVENT.SIGN_UP;
  } else if (userDataCode == CODE.VERIFY_DEVICE) {
    event = VERIFICATION_CODE_EVENT.DEVICE_VERIFICATION;
  } else if (userDataCode == CODE.VERIFY_LOGIN_TWOFA) {
    event = VERIFICATION_CODE_EVENT.LOGIN_2FA;
  }

  const onSubmit = async (payload: VerificationType) => {
    const payloadData = {
      code: payload.email_verify_code
        ? payload.email_verify_code
        : "" || payload.phone_verify_code
        ? payload.phone_verify_code
        : payload.gauth_verify_code
        ? payload.gauth_verify_code
        : "",
      method: payload.email_verify_code
        ? VERIFICATION_CODE_METHOD.EMAIL
        : payload.phone_verify_code
        ? VERIFICATION_CODE_METHOD.SMS
        : payload.gauth_verify_code
        ? VERIFICATION_CODE_METHOD.GAUTH
        : 0,
      event:
        userData?.source === SOCIAL_AUTHORIZATION_TYPE.SIGN_UP
          ? VERIFICATION_CODE_EVENT.SIGN_UP
          : event,
      user_code: userData?.usercode,
    };

    // console.log(payload);
    // console.table(payloadData);

    try {
      const res = await mutateAsync(payloadData);
      const data = res.data;
      const accessToken = data?.accessToken;
      const success = data?.success;
      const message = data?.message;
      const deviceToken = data?.deviceToken;
      const deviceTokenExpireAt = data?.deviceTokenExpireAt;

      if (!success) {
        customToast(message, "warning");
      }

      if (success && accessToken) {
        setCookies("token", data?.accessToken, {
          expires: new Date(data?.expireAt),
        });
        if (deviceToken)
          setCookies("dvctk", deviceToken, {
            expires: new Date(deviceTokenExpireAt),
          });

        // @ts-ignore
        dispatch(setUser(data?.user));
        removeLocalData(LOCALSTORAGE_DATA.USERDATA);
        customToast(message, "success");

        const toPage = router.query[QUERY_PARAM.TO_PAGE];

        const formattedToPage = decodeURIComponent(String(toPage));

        const decryptedToPage = decryptMessage(
          formattedToPage,
          QUERY_PARAM.TO_PAGE
        );

        // router.push(decryptedToPage || REDIRECT_URLS.DASHBOARD);
        window
          ? (window.location.href = decryptedToPage || REDIRECT_URLS.DASHBOARD)
          : "";
      } else if (success) {
        customToast(message, "success");
        router.push(REDIRECT_URLS.LOGIN);
      }
    } catch (error: any) {
      console.error(error);
      customToast(error, "error");
    }
  };

  let securityUnavailable = true;
  if (
    userData?.code === CODE.VERIFY_EMAIL ||
    userData?.code === CODE.VERIFY_PHONE ||
    userData?.source === SOCIAL_AUTHORIZATION_TYPE.SIGN_UP
  )
    securityUnavailable = false;

  return {
    userData,
    VerifyButton,
    onSubmit,
    isLoading,
    isError,
    localDataJason,
    securityUnavailable,
  };
};

export const useChangePassword = () => {
  const { isLoading, isError, mutateAsync } = useResetPasswordMutation();
  const router = useRouter();
  const { customToast } = useToast();

  const onSubmit = async (payload: any) => {
    try {
      const response = await mutateAsync(payload);
      const success = response.data?.success;
      const message = String(response.data?.message);

      if (!success) {
        customToast(message, "error");
      } else {
        customToast(message, "success");
        router.push(REDIRECT_URLS.LOGIN);
      }
    } catch (error: any) {
      customToast(error, "error");
    }
  };
  return {
    onSubmit,
    isLoading,
    isError,
  };
};

export const useLoginUser = () => {
  const {
    control,
    register,
    handleSubmit,
    getValues,
    formState: { errors, isValid },
    reset,
  } = useForm<SigninType>({
    mode: "all",
  });

  const { customToast } = useToast();
  const { isLoading, data, isSuccess, mutateAsync } = useLoginMutation();
  const dispatch = useDispatch();

  const formRef = useRef<HTMLFormElement>(null);

  const loginFn = async (captcha_data: any) => {
    const payload = getValues();
    const login_data = {
      email: payload?.email,
      password: payload?.password,
      phone: payload.phone ? "+" + payload.phone : "",
    };

    // console.log("success: ", captcha_data, login_data, logData);

    try {
      const response = await mutateAsync({ login_data, captcha_data });
      // console.log("login response: ", response);
      loginHelper(
        response,
        dispatch,
        SOCIAL_AUTHORIZATION_TYPE.SIGN_IN,
        customToast
      );
    } catch (error: any) {
      customToast(error, "error");
    }
  };

  const { isGeetestEnabled } = useGeetest(loginFn, formRef);

  // console.log("isGeetestEnabled: ", isGeetestEnabled);

  const onSubmit = async (payload: SigninType) => {
    // if false run mutation
    // if true don't do nothing

    if (!isGeetestEnabled) {
      await loginFn(null);
    }
  };

  return {
    formRef,
    onSubmit,
    control,
    register,
    handleSubmit,
    errors,
    reset,
    isLoading,
    data,
    isSuccess,
    isValid,
  };
};

export const useSignupUser = () => {
  const {
    control,
    register,
    handleSubmit,
    getValues,
    formState: { errors, isValid },
    reset,
  } = useForm<SignupType>({
    mode: "all",
  });

  const {
    data: response,
    mutateAsync,
    isLoading,
    isError,
  } = useSignupMutation();

  const { customToast } = useToast();
  const router = useRouter();
  const referral_code = router.query.ref ? String(router.query.ref) : undefined;
  const formRef = useRef<HTMLFormElement>(null);

  const signUpFn = async (captcha_data: any) => {
    const payload = getValues();
    const data = {
      email: payload.email,
      phone: payload.phone ? "+" + payload.phone : "",
      password: payload.password,
      password_confirm: payload.password_confirm,
      referral_code: payload.referral_code,
    };

    try {
      const response = await mutateAsync({ data, captcha_data });
      const success = response.data?.success;
      const message = String(response.data?.message);

      // console.log("response: ", response);

      if (success) {
        setUserDataInLocalStorage(
          response.data,
          SOCIAL_AUTHORIZATION_TYPE.SIGN_UP
        );

        customToast(message, "success");
        router.push("/code-verification");
      }
    } catch (error: any) {
      customToast(error, "error");
    }
  };

  const { isGeetestEnabled } = useGeetest(signUpFn, formRef);

  const onSubmit = async (payload: SignupType) => {
    if (!isGeetestEnabled) {
      await signUpFn(null);
    }
  };

  return {
    onSubmit,
    isLoading,
    getValues,
    isError,
    response,
    control,
    register,
    handleSubmit,
    errors,
    reset,
    isValid,
    formRef,
    referral_code,
  };
};

export const useLogout = () => {
  const { t } = useTranslation("common");
  const dispatch = useDispatch();
  const { customToast } = useToast();

  const logOut = async () => {
    await logoutHandlerMutation(t("Logout Successful!"));

    dispatch(logout());
  };

  return {
    logOut,
  };
};
