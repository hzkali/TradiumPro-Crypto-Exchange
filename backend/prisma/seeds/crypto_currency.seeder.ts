import { PrismaClient } from '@prisma/client';
import {
  CURRENCY_TYPE,
  STATUS_ACTIVE,
} from '../../src/app/helpers/coreconstants';

export async function seedCryptoCurrency(prisma?: PrismaClient) {
  const prismaFromExternal = prisma;
  prisma = prisma ?? new PrismaClient();

  await prisma.currency.createMany({
    data: [
      {
        name: 'Bitcoin',
        code: 'BTC',
        type: CURRENCY_TYPE.CRYPTO,
        status: STATUS_ACTIVE,
        futures_trade_status: STATUS_ACTIVE,
        sync_rate_status: STATUS_ACTIVE,
        decimal: 8,
        logo: 'images/tokens/btc.png',
      },
      {
        name: 'Ether',
        code: 'ETH',
        type: CURRENCY_TYPE.CRYPTO,
        status: STATUS_ACTIVE,
        futures_trade_status: STATUS_ACTIVE,
        sync_rate_status: STATUS_ACTIVE,
        decimal: 18,
        logo: 'images/tokens/eth.svg',
      },
      {
        name: 'Matic',
        code: 'MATIC',
        type: CURRENCY_TYPE.CRYPTO,
        status: STATUS_ACTIVE,
        futures_trade_status: STATUS_ACTIVE,
        sync_rate_status: STATUS_ACTIVE,
        decimal: 18,
        logo: 'images/tokens/matic.png',
      },
      {
        name: 'Tether USD',
        code: 'USDT',
        type: CURRENCY_TYPE.CRYPTO,
        status: STATUS_ACTIVE,
        futures_trade_status: STATUS_ACTIVE,
        sync_rate_status: STATUS_ACTIVE,
        decimal: 6,
        logo: 'images/tokens/usdt.png',
      },
    ],
    skipDuplicates: true,
  });

  if (!prismaFromExternal) await prisma.$disconnect();
}
