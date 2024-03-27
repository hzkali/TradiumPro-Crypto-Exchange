import { calculateAvailableBalance } from '../src/app/modules/futures_trade/futures.helper';

const liq = calculateAvailableBalance({
  wallet_balance: 12506.6064,
  sum_of_pnl: 0.4,
  sum_of_margin: 10.42,
});

console.log(liq);
