import { registerAs } from '@nestjs/config';

export const ServicesConfig = registerAs('services', () => {
  return {
    nftStorage: {
      api_key: process.env.NFT_STORAGE_KEY,
    },
  };
});
