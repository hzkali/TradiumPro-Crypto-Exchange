import { ConfigModule } from '@nestjs/config';
import { LocalizationModule } from '@squareboat/nestjs-localization/dist/src';
import { join } from 'path';
import { AppConfig } from '../../../src/configs/app.config';
import { AuthConfig } from '../../../src/configs/auth.config';
import { CacheConfig } from '../../../src/configs/cache.config';
import { CorsConfig } from '../../../src/configs/cors.config';
import { FilesystemConfig } from '../../../src/configs/filesystem.config';
import { GraphQLConfig } from '../../../src/configs/graphql.config';
import { MailConfig } from '../../../src/configs/mail.config';
import { QueueConfig } from '../../../src/configs/queue.config';
import { JWTConfig } from '../../../src/configs/security.config';
import { ServicesConfig } from '../../../src/configs/services.config';

export function TestModuleDependecy() {
  return [
    LocalizationModule.register({
      path: join(process.env.BASE_PROJECT_PATH ?? '', 'resources/lang/'),
      fallbackLang: 'en',
    }),
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
  ];
}
