import * as dotenv from 'dotenv-safe'
dotenv.config()

import { NestFactory } from '@nestjs/core'
import { NestExpressApplication } from '@nestjs/platform-express'
import * as cookieParser from 'cookie-parser'
import { AppModule } from './app.module'
import { join } from 'path'
import { EntityNotFoundFilter } from './exception/entity-not-found.filter'
import { QueryFailedFilter } from './exception/query-failed.filter'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)

  app.enableCors({ credentials: true, origin: process.env.FRONT_BASE_URL })
  app.use(cookieParser())

  app.useStaticAssets(join(__dirname, '..', 'public'), { prefix: '/static' })
  app.useGlobalFilters(new EntityNotFoundFilter())
  app.useGlobalFilters(new QueryFailedFilter())

  await app.listen(8000)
}
bootstrap()
