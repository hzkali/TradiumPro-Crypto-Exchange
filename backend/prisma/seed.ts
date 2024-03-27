import { PrismaClient } from '@prisma/client';
import { seedCurrencyPair } from './seeds/currency_pair.seeder';
import { seedCryptoCurrency } from './seeds/crypto_currency.seeder';
import { seedFiatCurrency } from './seeds/fiat_currency.seeder';

const prisma = new PrismaClient({ log: ['query'] });
//pass prisma from here to log or empty

async function main() {
  await seedCryptoCurrency(prisma);
  await seedFiatCurrency();
  await seedCurrencyPair(prisma);
}

main()
  .catch((e) => {
    console.error(e.stack);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
