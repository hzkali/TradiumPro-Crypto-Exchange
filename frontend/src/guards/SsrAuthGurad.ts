import { log } from "console";
import { GetServerSidePropsContext } from "next";
import { IpLocationModel, User } from "src/graphql/generated";
import { STATUS_DONE } from "src/helpers/backend/backend.coreconstants";
import { RESTRICTED_ENTITY_TYPE } from "src/helpers/corearrays";
import { PAGE_TYPES, REDIRECT_URLS } from "src/helpers/coreconstants";
import {
  coreLogoutTask,
  getAbsUrlPath,
  getUserKycSettings,
  prepareSsrRedirectUrl,
} from "src/helpers/corefunctions";
import { getUser } from "src/ssr/data";
import { UserType } from "types/authTypes";

export const ssrAuthCheckToRedirect = async (
  ctx: GetServerSidePropsContext,
  ip_data: IpLocationModel | undefined | null,
  blockedCountries?: string[],
  pageType?: any,
  kycSettingsData?: {
    kycIsEnabled: boolean;
    kycIsMust: boolean;
  },
  toPage?: string
): Promise<{
  redirectUrl: string | null;
}> => {
  const user: UserType = (await getUser(ctx))?.data;
  const userKycStatus = Number(user?.user_settings?.identity_verified);

  if (!kycSettingsData) {
    kycSettingsData = await getUserKycSettings();
  }

  const forceRedirectToKyc =
    kycSettingsData.kycIsEnabled &&
    kycSettingsData.kycIsMust &&
    userKycStatus != STATUS_DONE;

  const path = getAbsUrlPath(ctx);
  // console.log("PATH: ", ctx.req.url);
  // console.log("ABS PATH: ", path);
  // console.log("forceRedirectToKyc: ", forceRedirectToKyc);

  let redirectUrl: string | null = null;

  if (pageType === PAGE_TYPES.AUTHENTICATION_PROCESS) {
    if (user) {
      redirectUrl = prepareSsrRedirectUrl(REDIRECT_URLS.DASHBOARD, ctx, toPage);
    } else {
      redirectUrl = null;
    }
  } else if (pageType === PAGE_TYPES.AUTHENTICATED) {
    if (
      !ip_data?.country_code ||
      (blockedCountries && blockedCountries.includes(ip_data.country_code))
    ) {
      coreLogoutTask("", "", ctx);
      redirectUrl = prepareSsrRedirectUrl(
        `${REDIRECT_URLS.RESTRICTED_ENTITY}${RESTRICTED_ENTITY_TYPE.COUNTRY}`,
        ctx
      );
    } else if (!user) {
      redirectUrl = prepareSsrRedirectUrl(REDIRECT_URLS.LOGIN, ctx, toPage);
    } else if (path != REDIRECT_URLS.IDENTIFICATION && forceRedirectToKyc) {
      redirectUrl = prepareSsrRedirectUrl(REDIRECT_URLS.IDENTIFICATION, ctx);
    } else {
      redirectUrl = null;
    }
  }

  return { redirectUrl };
};
