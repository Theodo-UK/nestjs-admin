import { NestFactory } from '@nestjs/core'
import { AppModule } from '@/app.module'
import { AdminUserService } from '@app/nestjs-admin'

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule)
  const adminUserService = app.get(AdminUserService)
  await adminUserService.promptAndCreate()
}

bootstrap()
