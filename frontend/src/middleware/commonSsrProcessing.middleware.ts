import { GetServerSidePropsContext } from "next";
import { ssrGlobalGuard } from "src/guards/GlobalGuard.ssr";
import { ssrAuthCheckToRedirect } from "src/guards/SsrAuthGurad";
import { PAGE_TYPES } from "src/helpers/coreconstants";

export const commonSsrProcessing = async (
  ctx: GetServerSidePropsContext,
  pageType: PAGE_TYPES,
  optionalData?: any,
  toPage?: string,
  extra_setting_groups?: string[],
  extra_setting_slugs?: string[]
) => {
  const globalData = await ssrGlobalGuard(
    ctx,
    extra_setting_groups,
    extra_setting_slugs
  );

  if (globalData.redirect) {
    return { data: globalData, redirectUrl: globalData.redirect };
  }

  if (pageType === PAGE_TYPES.GLOBAL) {
    return { data: globalData, redirectUrl: null };
  }

  const { redirectUrl } = await ssrAuthCheckToRedirect(
    ctx,
    globalData.ip_data,
    globalData.blockedCountries,
    pageType,
    optionalData,
    toPage
  );

  return { data: globalData, redirectUrl: redirectUrl };
};
