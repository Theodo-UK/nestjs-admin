import * as dotenv from 'dotenv-safe'
dotenv.config()

import { NestFactory } from '@nestjs/core'
import { NestExpressApplication } from '@nestjs/platform-express'
import * as cookieParser from 'cookie-parser'
import * as sassMiddleware from 'node-sass-middleware'
import { join } from 'path'
import { AppModule } from './app.module'
import { EntityNotFoundFilter } from './exception/entity-not-found.filter'
import { QueryFailedFilter } from './exception/query-failed.filter'
import { isDevEnvironment } from './utils/environment'

const publicFolder = join(__dirname, '..', 'public')
const assetPrefix = '/static'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)

  app.enableCors({ credentials: true, origin: process.env.FRONT_BASE_URL })
  app.use(cookieParser())

  app.useStaticAssets(publicFolder, { prefix: assetPrefix })

  app.use(
    sassMiddleware({
      src: publicFolder + '/scss',
      dest: publicFolder + '/css',
      prefix: assetPrefix + '/css',
      outputStyle: isDevEnvironment() ? 'compressed' : 'expanded',
      sourceMap: isDevEnvironment(),
      debug: isDevEnvironment(),
    }),
  )

  app.useGlobalFilters(new EntityNotFoundFilter())
  app.useGlobalFilters(new QueryFailedFilter())

  await app.listen(8000)
}
bootstrap()
