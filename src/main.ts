import * as dotenv from 'dotenv-safe'
dotenv.config()

import { NestFactory } from '@nestjs/core'
import { NestExpressApplication } from '@nestjs/platform-express'
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

  app.use(
    sassMiddleware({
      src: publicFolder + '/scss',
      dest: publicFolder + '/css',
      prefix: assetPrefix + '/css',
      outputStyle: isDevEnvironment() ? 'expanded' : 'compressed',
      sourceMap: isDevEnvironment(),
      debug: isDevEnvironment(),
    }),
  )
  app.useStaticAssets(publicFolder, { prefix: assetPrefix })

  // needs to be after the sassMiddleware
  app.useStaticAssets(publicFolder, { prefix: assetPrefix })

  app.useGlobalFilters(new EntityNotFoundFilter())
  app.useGlobalFilters(new QueryFailedFilter())

  await app.listen(8000)
}
bootstrap()
