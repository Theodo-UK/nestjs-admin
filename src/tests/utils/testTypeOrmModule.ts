import { TypeOrmModule } from '@nestjs/typeorm'
import { Module, Inject } from '@nestjs/common'
import { EntitySchema } from 'typeorm'
import { injectionTokens } from '../../../src/tokens'
import DefaultAdminSite from '../../../src/adminSite'
import { EntityType } from '../../../src/types'
import AdminUser from '../../../src/adminUser.entity'

interface TestTypeOrmModuleConfig {
  entities: EntityType[]
}

@Module({})
export class TestTypeOrmModule {
  static forRoot(config: TestTypeOrmModuleConfig = { entities: [] }) {
    const typeOrmModule = TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: parseInt(process.env.DB_PORT, 10),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [__dirname + '/dist/**/*.entity.js', AdminUser],
      migrations: ['dist/migration/*.js'],
      synchronize: true,
    })
    return {
      module: TestTypeOrmModule,
      imports: [typeOrmModule],
      exports: [typeOrmModule],
    }
  }
}
