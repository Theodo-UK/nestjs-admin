import * as dotenv from 'dotenv-safe'
dotenv.config()

import { NestFactory } from '@nestjs/core'
import { NestExpressApplication } from '@nestjs/platform-express'
import * as sassMiddleware from 'node-sass-middleware'
import { join } from 'path'
import { AppModule } from './app.module'
import { isDevEnvironment } from './utils/environment'

const publicFolder = join('libs', 'nestjs-admin', 'public')
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

  await app.listen(8000)
}
bootstrap()
