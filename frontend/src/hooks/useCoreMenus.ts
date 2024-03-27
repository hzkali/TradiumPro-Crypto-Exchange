import useTranslation from "next-translate/useTranslation";

export const useCoreMenus = () => {
  const { t } = useTranslation("common");

  const CORE_MENU_LIST = [
    {
      title: t("Crypto"),
      dropdown: [
        {
          title: t("Buy"),
          url: `/crypto/buy`,
        },
        {
          title: t("Sell"),
          url: `/crypto/sell`,
        },
        {
          title: t("Deposit"),
          url: `/deposit/crypto`,
        },
        {
          title: t("Withdraw"),
          url: `/withdrawal/crypto`,
        },
        {
          title: t("History"),
          url: "/wallet/history/crypto",
        },
      ],
    },
    {
      title: t("Fiat"),
      dropdown: [
        {
          title: t("Deposit"),
          url: `/deposit/fiat`,
        },
        {
          title: t("Withdraw"),
          url: `/withdrawal/fiat`,
        },
        {
          title: t("History"),
          url: `/wallet/history/fiat`,
        },
      ],
    },
    {
      title: t("Wallet"),
      dropdown: [
        {
          title: t("Overview"),
          url: "/wallet/overview",
        },
        {
          title: t("Spot"),
          url: "/wallet/spot",
        },
        {
          title: t("Funding"),
          url: "/wallet/funding",
        },
        {
          title: t("Futures"),
          url: "/wallet/futures",
        },
        {
          title: t("History"),
          url: "/wallet/history/crypto",
        },
        {
          title: t("Address"),
          url: "/wallet/address-management",
        },
        {
          title: t("Issues"),
          url: "/wallet/issues",
        },
        // {
        //   title: t("Account Statement"),
        //   url: "/wallet/account-statement",
        // },
      ],
    },
    {
      title: t("Trade"),
      dropdown: [
        {
          title: t("Spot"),
          url: `/trade/spot`,
        },
        {
          title: t("Convert"),
          url: `/convert`,
        },
        {
          title: t("P2P"),
          url: `/p2p`,
        },
      ],
    },
    {
      title: t("Futures"),
      url: "/futures",
    },
    {
      title: t("History"),
      dropdown: [
        {
          title: t("Wallet"),
          url: "/wallet/history/crypto",
        },
        {
          title: t("Spot"),
          url: "/orders/spot/history",
        },
        {
          title: t("Futures"),
          url: "/orders/futures/history",
        },
        {
          title: t("Convert"),
          url: "/orders/convert/history",
        },
        {
          title: t("Buy/Sell"),
          url: "/orders/crypto/buy-history",
        },
        {
          title: t("Gift Cards"),
          url: "/gift-cards/histories",
        },
      ],
    },
    {
      title: t("Gift Cards"),
      dropdown: [
        {
          title: t("Overview"),
          url: "/gift-cards",
        },
        {
          title: t("Templates"),
          url: "/gift-cards/templates",
        },
        {
          title: t("My Cards"),
          url: "/gift-cards/my-cards",
        },
        {
          title: t("History"),
          url: "/gift-cards/histories",
        },
      ],
    },
    {
      title: t("Markets"),
      url: "/markets",
    },
  ];

  return { CORE_MENU_LIST };
};
