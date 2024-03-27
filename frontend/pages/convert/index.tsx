import { FiatCryptoHeader } from "components/fiat_crypto_header/FiatCryptoHeader.component";
import MetaHeadSection, { setMetaData } from "components/meta/Meta.component";
import BasicLayout from "layouts/basic.layout";
import { GetServerSideProps, NextPage } from "next";
import useTranslation from "next-translate/useTranslation";
import { ConvertSection } from "sections/convert/ConvertSection.section";
import { CURRENCY_CONVERT_DEFAULT_PAIR } from "src/helpers/backend/backend.coreconstants";
import {
  PAGE_TYPES,
  QUERY_PARAM,
  REDIRECT_URLS,
} from "src/helpers/coreconstants";
import { commonSsrProcessing } from "src/middleware/commonSsrProcessing.middleware";

const ConvertPage: NextPage<{ data: any }> = ({ data }) => {
  const { t } = useTranslation("common");

  const { metadata, settings } = setMetaData(data, {
    page_title: t("Convert"),
    title: t("Convert"),
    description: t("Convert"),
    url: "/convert",
  });

  return (
    <>
      <BasicLayout data={settings}>
        <MetaHeadSection metadata={metadata} settings={settings} />

        <FiatCryptoHeader
          title={t("Convert")}
          secondaryLinkText={t("Convert History")}
          secondaryLink="/orders/convert/history"
          backArrow={false}
        />
        <ConvertSection />
      </BasicLayout>
    </>
  );
};

export default ConvertPage;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const pair = ctx.query[QUERY_PARAM.CURRENCY_PAIR];
  const defaultPair = `${CURRENCY_CONVERT_DEFAULT_PAIR.FROM_CRYPTO}_${CURRENCY_CONVERT_DEFAULT_PAIR.TO_CRYPTO}`; // will come from coreconstants

  if (!pair) {
    return {
      redirect: {
        permanent: false,
        destination: `/convert?${QUERY_PARAM.CURRENCY_PAIR}=${defaultPair}`,
      },
    };
  } else if (pair.includes("_") == false) {
    return {
      redirect: {
        permanent: false,
        destination: REDIRECT_URLS.ERROR_PAGE,
      },
    };
  } else if (String(pair).split("_")[0] == String(pair).split("_")[1]) {
    return {
      redirect: {
        permanent: false,
        destination: `/convert?${QUERY_PARAM.CURRENCY_PAIR}=${defaultPair}`,
      },
    };
  }

  const { data, redirectUrl } = await commonSsrProcessing(
    ctx,
    PAGE_TYPES.AUTHENTICATED,
    null,
    ctx.resolvedUrl
  );

  if (redirectUrl) {
    return {
      redirect: {
        permanent: false,
        destination: redirectUrl,
      },
    };
  }

  return {
    props: {
      data: data,
    },
  };
};
