import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as bodyParser from 'body-parser';
import { Console } from 'console';
import * as session from 'express-session';
import { graphqlUploadExpress } from 'graphql-upload';
import * as passport from 'passport';
import { join } from 'path';
import { processStartingTasks } from './app/core.services/app_start_task.service';
import {
  APP_ENV,
  DEFAULT_MAX_DATA_SIZE_IN_BYTE,
  DEFAULT_MAX_FILE_UPLOADS_AT_A_TIME,
} from './app/helpers/coreconstants';
import { initCoreServices, setApp } from './app/helpers/functions';
import { SentryInterceptor } from './app/interceptors/sentry.interceptor';
import { CorsConfig } from './configs/config.interface';
import { logger } from './libs/log/log.service';
import { PrismaService } from './libs/prisma/prisma.service';
import { MainModule } from './main.module';
import fileStore = require('session-file-store');
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  logger();
  //const app = await NestFactory.create(AppModule);
  const app = await NestFactory.create<NestExpressApplication>(MainModule, {
    logger: console,
  });
  setApp(app);
  initCoreServices();
  app.useGlobalInterceptors(new SentryInterceptor());

  processStartingTasks();
  app.set('trust proxy', true);

  app.use(cookieParser());
  app.use(bodyParser.json({ limit: DEFAULT_MAX_DATA_SIZE_IN_BYTE }));
  app.use(
    bodyParser.urlencoded({
      limit: DEFAULT_MAX_DATA_SIZE_IN_BYTE,
      extended: true,
    }),
  );

  app.use(
    graphqlUploadExpress({
      maxFieldSize: DEFAULT_MAX_DATA_SIZE_IN_BYTE,
      maxFileSize: DEFAULT_MAX_DATA_SIZE_IN_BYTE,
      maxFiles: DEFAULT_MAX_FILE_UPLOADS_AT_A_TIME,
    }),
  );

  // Validation
  app.useGlobalPipes(new ValidationPipe());
  //

  //views
  app.setBaseViewsDir(join(__dirname, '../..', 'resources/views/'));
  app.setViewEngine('hbs');
  //

  //passport & session
  // app.set('trust proxy', 1); // trust first proxy
  const FileStore = fileStore(session);

  app.use(
    session({
      store: new FileStore({ path: './storage/sessions' }),
      secret: 'my-secret',
      resave: false,
      saveUninitialized: false,
      //cookie: { secure: true },
      cookie: {
        maxAge: 60 * 60 * 24 * 1000, //1 day
      },
    }),
  );
  app.use(passport.initialize());
  app.use(passport.session());
  //

  // Prisma Client Exception Filter for unhandled exceptions
  // const { httpAdapter } = app.get(HttpAdapterHost);
  // app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter));

  const prismaService: PrismaService = app.get(PrismaService);
  prismaService.enableShutdownHooks(app);

  const configService = app.get(ConfigService);
  const corsConfig = configService.get<CorsConfig>('cors');

  // Cors
  if (corsConfig.enabled) {
    let origins: any = '*';
    if (
      process.env.APP_ENV == APP_ENV.PRODUCTION &&
      process.env.ALLOWED_ORIGINS != ''
    )
      origins = process.env.ALLOWED_ORIGINS.split(',');
    app.enableCors({
      origin: origins,
    });
  }
  //

  const port = process.env.APP_PORT || 3000;
  await app.listen(port);
  console.log(
    `Server started at http://localhost:${port}`,
    undefined,
    undefined,
    undefined,
    2,
  );
  if (process.env.APP_DEBUG !== 'true') {
    new Console(process.stdout).log(
      `Server started at http://localhost:${port}`,
    );
  }
}

bootstrap();
