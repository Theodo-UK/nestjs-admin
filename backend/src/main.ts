import * as dotenv from 'dotenv-safe';
import * as nunjucks from 'nunjucks';
import { join } from 'path';
dotenv.config();

import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { EntityNotFoundFilter } from './exception/entity-not-found.filter';
import { QueryFailedFilter } from './exception/query-failed.filter';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Configure nunjucks for the admin
  // @architecture configuration "williamd: this should be done in the admin module"
  nunjucks.configure(join(__dirname, 'admin', 'views'), {
    autoescape: true,
    express: app,
    watch: true,
  });

  app.enableCors({ credentials: true, origin: process.env.FRONT_BASE_URL });
  app.use(cookieParser());

  app.useGlobalFilters(new EntityNotFoundFilter());
  app.useGlobalFilters(new QueryFailedFilter());

  await app.listen(8000);
}
bootstrap();
