// import "../styles/css/bootstrap.min.css";
import "../styles/app.sass";
import "../styles/css/nprogress.css";
import { store } from "src/store";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { Toaster } from "react-hot-toast";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Provider } from "react-redux";
import AuthGuard from "src/guards/AuthGuard";
import { ApolloProvider } from "@apollo/client";
import { apolloClient } from "src/config/apollo.config";
import { AppProps } from "next/app";
import Script from "next/script";
import { SETTINGS_SLUG } from "src/helpers/backend/backend.slugcontanst";
// import "../sections/payment/Payment.css";

// react-query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

function TradexPro({ Component, pageProps }: AppProps) {
  const props: any = { ...pageProps };
  const settings = props?.data?.settings;

  return (
    <>
      {/* Google Analytics */}
      {settings && settings[SETTINGS_SLUG.GOOGLE_ANALYTICS_MEASUREMENT_ID] && (
        <>
          <Script
            strategy="lazyOnload"
            src={`https://www.googletagmanager.com/gtag/js?id=${
              settings[SETTINGS_SLUG.GOOGLE_ANALYTICS_MEASUREMENT_ID]
            }`}
          />

          <Script id="google-analytics-script" strategy="lazyOnload">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${
                settings[SETTINGS_SLUG.GOOGLE_ANALYTICS_MEASUREMENT_ID]
              }', {
              page_path: window.location.pathname,
              });
            `}
          </Script>
        </>
      )}

      <Provider store={store}>
        <Toaster
          position="top-right"
          reverseOrder={false}
          gutter={15}
          containerClassName=""
          containerStyle={{}}
          toastOptions={{
            style: {},
            error: {},
          }}
        />

        <GoogleOAuthProvider
          clientId={
            settings
              ? String(settings[SETTINGS_SLUG.GOOGLE_AUTH_CLIENT_ID] || "test")
              : "test"
          }
        >
          <ApolloProvider client={apolloClient}>
            <QueryClientProvider client={queryClient}>
              <AuthGuard pageProps={pageProps}>
                <Component {...pageProps} />

                <ReactQueryDevtools initialIsOpen={false} />
              </AuthGuard>
            </QueryClientProvider>
          </ApolloProvider>
        </GoogleOAuthProvider>
      </Provider>
    </>
  );
}

export default TradexPro;
