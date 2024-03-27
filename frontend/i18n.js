const { APP_LANGS, DEFAULT_LANG } = require("./src/helpers/core");

// let APP_LANGS = ["en"];
// const apiBaseUrl = () => {
//   let apiBaseUrl = process.env.NEXT_PUBLIC_API_URL ?? '';
//   apiBaseUrl = apiBaseUrl && apiBaseUrl.split('/graphql')[0];
//   return apiBaseUrl;
// };

// (async () => {
//   const response = await fetch(`${apiBaseUrl()}/app/langs`);
//   const langs = await response.json();
//   console.log(langs);
//   APP_LANGS = langs;
// })()

module.exports = {
  locales: APP_LANGS, //["en", "es", "bn"],
  defaultLocale: DEFAULT_LANG,
  keySeparator: false,
  pages: {
    "*": ["common"],
  },
};
