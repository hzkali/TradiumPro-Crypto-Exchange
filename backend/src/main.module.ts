import { GraphQLModule } from '@nestjs/graphql';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphqlConfig } from './configs/config.interface';
import { PrismaModule } from 'nestjs-prisma';
import { DateScalar } from './libs/graphql/scalars/date.scalar';
import { FilesystemModule } from './app/filesystem/filesystem.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join, resolve } from 'path';
import { BullModule } from '@nestjs/bull';
import { QueueOptions } from 'bull';
import { NotificationModule } from './libs/notification/notification.module';
import { MailModule } from './libs/mail/mail.module';

import { CorsConfig } from './configs/cors.config';
import { GraphQLConfig } from './configs/graphql.config';
import { JWTConfig } from './configs/security.config';
import { QueueConfig } from './configs/queue.config';
import { FilesystemConfig } from './configs/filesystem.config';
import { MailConfig } from './configs/mail.config';
import { AppConfig } from './configs/app.config';
import { ServicesConfig } from './configs/services.config';

import { CacheModule } from './libs/cache/cache.module';
import { Global, MiddlewareConsumer, Module } from '@nestjs/common';
import { CacheConfig } from './configs/cache.config';
import { AuthConfig } from './configs/auth.config';
import { AppModule } from './app/app.module';
import { ScheduleModule } from '@nestjs/schedule';
import { PrismaService } from './libs/prisma/prisma.service';
import { LocalizationModule } from '@squareboat/nestjs-localization/dist/src';
import { localization } from './app/middlewares/localization.middleware';
import { AppAuthMiddleware } from './app/middlewares/app_authentication.middleware';
import { LogviewerModule } from './libs/logviewer/logviewer.module';
import { LogAuthModule } from './libs/logviewer/auth/auth.module';
import { DecimalScalar } from './libs/graphql/scalars/decimal.scalar';
import { CronJobs } from './app/cron_jobs/cron_jobs.service';
import { HttpModule } from '@nestjs/axios';
import { ThrottlerModule } from '@nestjs/throttler';
import { ThrottlerStorageRedisService } from 'nestjs-throttler-storage-redis';
import { BigIntScalar } from './libs/graphql/scalars/bigint.scalar';
import { OTPModule } from './libs/otp/otp.module';
import { WalletNotifierModule } from './app/modules/wallet_notifier/wallet_notifier.module';
import { WalletNotfierMiddleware } from './app/middlewares/wallet_notifier.middleware';
import { IpLocationService } from './app/core.services/ip_location.service';
import { CurrencyConvertService } from './app/core.services/currency_conversion_api.service';
import { CoinGatewayModule } from './app/core.services/coin_services/coin_gateway.module';
import { RedisService } from './libs/redis/redis.service';
import { EventModule } from './app/events/event.module';
import { MyLogger, newConsole } from './libs/log/log.service';
import { RedisPubSubService } from './libs/pubsub/redis_pub_sub.service';
import { PrismaMongoService } from './libs/prisma/prisma_mongo.service';
import { APP_FILTER } from '@nestjs/core';
import { AnyExceptionFilter } from './app/exceptions/exception_filters';
import { QueueModule } from './app/queues/queue.module';
import { JsonValueScalar } from './libs/graphql/scalars/json_value.scalar';
import { SubscriptionModule } from './app/gql_subscriptions/subscription.module';

@Global()
@Module({
  imports: [
    // Core Modules
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        CorsConfig,
        AppConfig,
        GraphQLConfig,
        AuthConfig,
        JWTConfig,
        QueueConfig,
        FilesystemConfig,
        MailConfig,
        CacheConfig,
        ServicesConfig,
      ],
    }),
    ServeStaticModule.forRoot({
      rootPath: resolve('public'),
      exclude: ['/graphql*'],
    }),
    LocalizationModule.register({
      path: process.env.BASE_PROJECT_PATH
        ? join(process.env.BASE_PROJECT_PATH, 'resources/lang/')
        : join(__dirname, '../..', 'resources/lang/'),
      fallbackLang: 'en',
    }),
    GraphQLModule.forRootAsync({
      useFactory: async (configService: ConfigService) => {
        const graphqlConfig = configService.get<GraphqlConfig>('graphql');
        return {
          subscriptions: {
            // 'graphql-ws': true,
            'graphql-ws': {
              onConnect: graphqlConfig.wsOnConnect,
              onDisconnect: graphqlConfig.wsOnDisconnect,
            },
            // 'subscriptions-transport-ws': true,
            // 'subscriptions-transport-ws': {
            //   onConnect: graphqlConfig.wsOnConnect,
            // },
          },
          introspection: graphqlConfig.introspection,
          buildSchemaOptions: {
            numberScalarMode: 'integer',
          },
          sortSchema: graphqlConfig.sortSchema,
          autoSchemaFile:
            graphqlConfig.schemaDestination || './src/schema.graphql',
          debug: graphqlConfig.debug,
          playground: graphqlConfig.playgroundEnabled,
          formatError: graphqlConfig.formatError,
          context: ({ req, res, extra, connectionParams, connection }) => ({
            req,
            res,
            extra,
            connectionParams,
            connection,
          }), // extra, connectionParams & connection is for ws req data
        };
      },
      inject: [ConfigService],
    }),
    FilesystemModule,
    CacheModule,
    PrismaModule.forRoot({
      isGlobal: true,
    }),
    BullModule.forRootAsync({
      useFactory: async (configService: ConfigService) => {
        return configService.get<QueueOptions>('queue');
      },
      inject: [ConfigService],
      imports: [QueueModule],
    }),

    ThrottlerModule.forRoot({
      ttl: 60,
      limit: Number(process.env.REQUEST_LIMIT_PER_MINUTE || 0) || 60,
      storage: new ThrottlerStorageRedisService({
        host: process.env.REDIS_HOST || 'localhost',
        port: Number(process.env.REDIS_PORT) || 6379,
        username: process.env.REDIS_USERNAME || undefined,
        password: process.env.REDIS_PASSWORD || undefined,
        db: Number(process.env.REDIS_DATABASE) || 0,
      }),
    }),

    EventModule,
    SubscriptionModule,
    ScheduleModule.forRoot(),
    MailModule,
    NotificationModule,
    OTPModule,
    LogAuthModule,
    LogviewerModule,
    HttpModule,

    // Application Modules
    AppModule,
    CoinGatewayModule,
    WalletNotifierModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AnyExceptionFilter,
    },
    // GQL Custom Types
    DateScalar,
    DecimalScalar,
    BigIntScalar,
    JsonValueScalar,
    //
    PrismaService,
    PrismaMongoService,
    RedisService,
    IpLocationService,
    CurrencyConvertService,
    CronJobs,
    MyLogger,
    RedisPubSubService,
  ],
  exports: [
    PrismaService,
    PrismaMongoService,
    RedisService,
    IpLocationService,
    HttpModule,
    CurrencyConvertService,
    MyLogger,
    RedisPubSubService,
  ],
})
export class MainModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(localization).forRoutes('/');
    consumer.apply(AppAuthMiddleware).forRoutes('graphql');
    consumer.apply(WalletNotfierMiddleware).forRoutes('notifier');
  }
}
