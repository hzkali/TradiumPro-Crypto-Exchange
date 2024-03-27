import MetaHeadSection, { setMetaData } from "components/meta/Meta.component";
import BasicLayout from "layouts/basic.layout";
import { GetServerSideProps, NextPage } from "next";
import useTranslation from "next-translate/useTranslation";
import { GiftCardsBuyForm } from "sections/gift_cards/GiftCardsBuyForm.section";
import { GiftCardsFaq } from "sections/gift_cards/GiftCardsFaq.section";
import { F_GiftCardTemplateModel } from "src/graphql/generated";
import { PAGE_TYPES, REDIRECT_URLS } from "src/helpers/coreconstants";
import { commonSsrProcessing } from "src/middleware/commonSsrProcessing.middleware";
import { getGiftCardsTemplateDetails } from "src/ssr/data";

const GiftCardPage: NextPage<{
  data: any;
  template_details: F_GiftCardTemplateModel;
}> = ({ data, template_details }) => {
  const { t } = useTranslation("common");

  const { metadata, settings } = setMetaData(data, {
    page_title: t("Gift Cards"),
    title: t("Gift Cards"),
    description: t("Gift Cards"),
    url: "/gift-cards",
  });

  return (
    <>
      <BasicLayout data={settings}>
        <MetaHeadSection metadata={metadata} settings={settings} />

        <GiftCardsBuyForm
          template_details={template_details}
          defaultCountryCode={data?.ip_data?.country_code}
        />

        <GiftCardsFaq />
      </BasicLayout>
    </>
  );
};

export default GiftCardPage;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
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

  const id = ctx.params?.id;

  const details = await getGiftCardsTemplateDetails(ctx, String(id));

  if (!details) {
    return {
      redirect: {
        permanent: false,
        destination: REDIRECT_URLS.GIFT_CARDS,
      },
    };
  }

  return {
    props: {
      data: data,
      template_details: details,
    },
  };
};
