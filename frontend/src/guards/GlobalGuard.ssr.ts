import { GetServerSidePropsContext } from "next";
import {
  checkCurrencyAvailability,
  getBlockedCountries,
  getDataByIp,
  getSettingsData,
} from "src/ssr/data";
import requestIp from "request-ip";
import { IpLocationModel } from "src/graphql/generated";
import {
  SETTINGS_GROUP,
  SETTINGS_SLUG,
} from "src/helpers/backend/backend.slugcontanst";
import { getCookie, setCookies } from "cookies-next";
import { APP_DEFAULT } from "src/helpers/backend/backend.coreconstants";

export interface ssrGlobalGuardInterface {
  ip_data?: IpLocationModel | null;
  settings?: any;
  blockedCountries?: string[];
  redirect?: string;
}

export const ssrGlobalGuard = async (
  ctx: GetServerSidePropsContext,
  extra_setting_groups: string[] = [],
  extra_setting_slugs: string[] = []
): Promise<ssrGlobalGuardInterface> => {
  const ip_address = requestIp.getClientIp(ctx.req);
  const ip_data: IpLocationModel | undefined = await getDataByIp(
    String(ip_address)
  );
  let countryCurrCode = ip_data?.country_data?.currency;

  const blockedCountries: string[] = await getBlockedCountries();
  // const allowedCountries: string[] = await getAllowedCountries();

  const currencyCookie = getCookie("currency", <any>ctx);
  if (
    !currencyCookie ||
    currencyCookie == "undefined" ||
    currencyCookie == "null"
  ) {
    if (
      !countryCurrCode ||
      !(await checkCurrencyAvailability(countryCurrCode))
    ) {
      countryCurrCode = APP_DEFAULT.CURRENCY_CODE;
    }
    setCookies("currency", countryCurrCode, <any>ctx);
  }

  // const langFromUrl = ctx.locale;
  // const langFromIp = ip_data?.country_data?.language;
  // if(langFromUrl != langFromIp) {
  //   if(APP_LANGS.includes(String(langFromIp))) {
  //     return {
  //       redirect: `/${langFromIp}/${ctx.req.url}`
  //     }
  //   }
  // }

  const settings: any = await getSettingsData(
    [
      SETTINGS_GROUP.GENERAL,
      SETTINGS_GROUP.LOGO,
      SETTINGS_GROUP.SOCIAL,
      SETTINGS_GROUP.META,
      ...extra_setting_groups,
    ],
    [SETTINGS_SLUG.GOOGLE_ANALYTICS_MEASUREMENT_ID, ...extra_setting_slugs],
    ctx
  );

  const responseData = {
    ip_data: ip_data ?? null,
    settings: settings,
    blockedCountries: blockedCountries,
  };
  return responseData;
};
