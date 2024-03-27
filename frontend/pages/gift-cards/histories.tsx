import MetaHeadSection, { setMetaData } from "components/meta/Meta.component";
import { OrdersWrapper } from "components/orders_wrapper/OrdersWrapper.component";
import BasicLayout from "layouts/basic.layout";
import { GetServerSideProps, NextPage } from "next";
import useTranslation from "next-translate/useTranslation";
import { GiftCardHistory } from "sections/gift_cards/history/GiftCardHistory.section";
import { PAGE_TYPES } from "src/helpers/coreconstants";
import { commonSsrProcessing } from "src/middleware/commonSsrProcessing.middleware";

const GiftCardsHistoryPage: NextPage<{ data: any }> = ({ data }) => {
  const { t } = useTranslation("common");

  const { metadata, settings } = setMetaData(data, {
    page_title: t("Gift Cards History"),
    title: t("Gift Cards History"),
    description: t("Gift Cards History"),
    url: "/gift-cards/histories/",
  });

  return (
    <>
      <BasicLayout data={settings} hideFooter>
        <MetaHeadSection metadata={metadata} settings={settings} />

        <OrdersWrapper title={t("Transfer History")} subTitle={t("Gift Card")}>
          {/* replace this component with your own component for history  */}
          <GiftCardHistory />
        </OrdersWrapper>
      </BasicLayout>
    </>
  );
};

export default GiftCardsHistoryPage;

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

  return {
    props: {
      data: data,
    },
  };
};
