import { NestFactory } from '@nestjs/core'
import { CliAdminModule } from './cliAdmin.module'
import { AdminUserService } from '../src/adminUser.service'

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(CliAdminModule)
  const adminUserService = app.get(AdminUserService)
  await adminUserService.promptAndCreate()
}

bootstrap()
