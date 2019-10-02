import { TypeOrmModule } from '@nestjs/typeorm'
import { Module, Inject } from '@nestjs/common'
import { EntitySchema } from 'typeorm'
import { injectionTokens } from '../../../src/tokens'
import DefaultAdminSite from '../../../src/adminSite'
import { EntityType } from '../../../src/types'
import AdminEntity from '../../adminUser.entity'

interface TestTypeOrmModuleConfig {
  entities: EntityType[]
}

@Module({})
export class TestTypeOrmModule {
  static forRoot(config: TestTypeOrmModuleConfig = { entities: [] }) {
    const typeOrmModule = TypeOrmModule.forRoot({
      entities: [
        AdminEntity,
        __dirname + '/../../**/*.entity.{js,ts}', // for use in the library
        __dirname + '/../../../dist/**/*.entity.{js,ts}', // for use locally in the exampleApp
        __dirname + '/../../../exampleApp/node_modules/nestjs-admin/dist/**/*.entity.{js,ts}', // for use in CI in the exampleApp
        ...config.entities,
      ],
      synchronize: true,
    })
    return {
      module: TestTypeOrmModule,
      imports: [typeOrmModule],
      exports: [typeOrmModule],
    }
  }
}
