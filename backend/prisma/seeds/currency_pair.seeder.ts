import { PrismaClient } from '@prisma/client';
import { STATUS_ACTIVE } from '../../src/app/helpers/coreconstants';

export async function seedCurrencyPair(prisma?: PrismaClient) {
  const prismaFromExternal = prisma;
  prisma = prisma ?? new PrismaClient();

  await prisma.currencyPair.createMany({
    data: [
      {
        base_currency_id: 1,
        trade_currency_id: 4,
        base_currency_code: 'BTC',
        trade_currency_code: 'USDT',
        code: 'BTCUSDT',
        base_decimal: 8,
        trade_decimal: 6,
        maker_fee: 2,
        taker_fee: 3.5,
        min_base_amount: 0.000001,
        max_base_amount: 100000,
        min_price_percent: 20,
        max_price_percent: 20,
        is_default: STATUS_ACTIVE,
        status: STATUS_ACTIVE,
      },
    ],
    skipDuplicates: true,
  });

  if (!prismaFromExternal) await prisma.$disconnect();
}
