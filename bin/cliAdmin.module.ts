import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { getConnectionOptions } from 'typeorm'
import AdminUser from '../src/adminUser.entity'
import { AdminUserService } from '../src/adminUser.service'

@Module({
  providers: [AdminUserService], // @debt TODO "Import DefaultAdminAuthModule instead"
})
export class CliAdminModule {
  static async create() {
    const connectionOptions = await getConnectionOptions()
    const entities = connectionOptions.entities || []

    return {
      module: CliAdminModule,
      imports: [
        TypeOrmModule.forRoot({
          ...connectionOptions,
          entities: [...entities, AdminUser],
        }),
        TypeOrmModule.forFeature([AdminUser]),
      ],
    }
  }
}
