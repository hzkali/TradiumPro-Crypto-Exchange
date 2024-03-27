import MetaHeadSection, { setMetaData } from "components/meta/Meta.component";
import BasicLayout from "layouts/basic.layout";
import { GetServerSideProps, NextPage } from "next";
import useTranslation from "next-translate/useTranslation";
import { GiftCardsMyCardsList } from "sections/gift_cards/GiftCardsMyCardsList.section";
import { GiftCardsOverviewHero } from "sections/gift_cards/GiftCardsOverviewHero.section";
import { F_ComponentSection } from "src/graphql/generated";
import { PREBUILT_COMPONENT_SECTIONS } from "src/helpers/backend/backend.website_constants";
import { PAGE_TYPES } from "src/helpers/coreconstants";
import { commonSsrProcessing } from "src/middleware/commonSsrProcessing.middleware";
import { getComponentSectionContents } from "src/ssr/data";

const GiftCardMyCardPage: NextPage<{
  data: any;
  heroSectionData: null | F_ComponentSection;
}> = ({ data, heroSectionData }) => {
  const { t } = useTranslation("common");

  const { metadata, settings } = setMetaData(data, {
    page_title: t("My Gift Cards "),
    title: t("My Gift Cards "),
    description: t("My Gift Cards "),
    url: "/gift-cards/my-cards",
  });

  return (
    <>
      <BasicLayout data={settings}>
        <MetaHeadSection metadata={metadata} settings={settings} />

        <GiftCardsOverviewHero data={heroSectionData} />
        <GiftCardsMyCardsList
          isMainPage
          defaultCountryCode={data?.ip_data?.country_code}
        />
      </BasicLayout>
    </>
  );
};

export default GiftCardMyCardPage;

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

  const heroSectionData = await getComponentSectionContents(
    ctx,
    PREBUILT_COMPONENT_SECTIONS.MY_GIFT_CARDS_HERO_SECTION
  );

  return {
    props: {
      data: data,
      heroSectionData: heroSectionData,
    },
  };
};
