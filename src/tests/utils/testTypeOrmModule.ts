import { TypeOrmModule } from '@nestjs/typeorm'
import { Module, Inject } from '@nestjs/common'
import { EntitySchema } from 'typeorm'
import { injectionTokens } from '../../../src/tokens'
import DefaultAdminSite from '../../../src/adminSite'
import { EntityType } from '../../../src/types'

interface TestTypeOrmModuleConfig {
  entities: EntityType[]
}

@Module({})
export class TestTypeOrmModule {
  static forRoot(config: TestTypeOrmModuleConfig = { entities: [] }) {
    const typeOrmModule = TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5434,
      username: 'seed',
      password: 'Ge0rgesMoustaki',
      database: 'seed',
      entities: [
        __dirname + '/../../**/*.entity.{js,ts}', // for use in the library
        __dirname + '/../../../dist/**/*.entity.{js,ts}', // for use in the exampleApp
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
