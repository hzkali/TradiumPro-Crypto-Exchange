import MetaHeadSection, { setMetaData } from "components/meta/Meta.component";
import BasicLayout from "layouts/basic.layout";
import { GetServerSideProps, NextPage } from "next";
import useTranslation from "next-translate/useTranslation";
import { GiftCardsOverviewHero } from "sections/gift_cards/GiftCardsOverviewHero.section";
import { GiftCardsTemplatesList } from "sections/gift_cards/GiftCardsTemplatesList.section";
import { F_ComponentSection } from "src/graphql/generated";
import { PREBUILT_COMPONENT_SECTIONS } from "src/helpers/backend/backend.website_constants";
import { PAGE_TYPES } from "src/helpers/coreconstants";
import { commonSsrProcessing } from "src/middleware/commonSsrProcessing.middleware";
import { getComponentSectionContents } from "src/ssr/data";

const GiftCardTemplatesPage: NextPage<{
  data: any;
  heroSectionData: null | F_ComponentSection;
}> = ({ data, heroSectionData }) => {
  const { t } = useTranslation("common");

  const { metadata, settings } = setMetaData(data, {
    page_title: t("Gift Cards Templates"),
    title: t("Gift Cards Templates"),
    description: t("Gift Cards Templates"),
    url: "/gift-cards/templates",
  });

  return (
    <>
      <BasicLayout data={settings}>
        <MetaHeadSection metadata={metadata} settings={settings} />

        <GiftCardsOverviewHero data={heroSectionData} />
        <GiftCardsTemplatesList isMainPage />
      </BasicLayout>
    </>
  );
};

export default GiftCardTemplatesPage;

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
    PREBUILT_COMPONENT_SECTIONS.GIFT_CARD_TEMPLATES_HERO_SECTION
  );

  return {
    props: {
      data: data,
      heroSectionData: heroSectionData,
    },
  };
};
