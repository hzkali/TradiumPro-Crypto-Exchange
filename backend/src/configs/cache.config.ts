import { registerAs } from '@nestjs/config';
import { CacheConfigInterface } from './config.interface';

export const CacheConfig = registerAs(
  'cache',
  (): CacheConfigInterface => ({
    host: process.env.REDIS_HOST || 'localhost',
    port: Number(process.env.REDIS_PORT) || 6379,
    username: process.env.REDIS_USERNAME || undefined,
    password: process.env.REDIS_PASSWORD || undefined,
    db: Number(process.env.REDIS_DATABASE) || 0,
    ttl: 1000,
  }),
);
