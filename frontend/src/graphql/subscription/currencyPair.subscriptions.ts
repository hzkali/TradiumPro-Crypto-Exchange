import { gql } from "@apollo/client";

export const CurrencyPairEventDocument = gql`
  subscription {
    s_currencyPair_crudEvent {
      crud_type
      payload {
        uid
        base
        trade
        prev_price
        market_price
        change
        volumefrom
        volumeto
        high
        low
        base_decimal
        trade_decimal
        max_base_amount
        max_price_percent
        min_base_amount
        min_price_percent
      }
    }
  }
`;

export const CurrencyPairEventDocumentForMultiCharts = gql`
  subscription {
    s_currencyPair_crudEvent {
      crud_type
      payload {
        uid
        base
        trade
        market_price
        prev_price
        change
        volumeto
        trade_decimal
      }
    }
  }
`;