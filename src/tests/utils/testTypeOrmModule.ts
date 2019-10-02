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
    const typeOrmModule = TypeOrmModule.forRoot()
    return {
      module: TestTypeOrmModule,
      imports: [typeOrmModule],
      exports: [typeOrmModule],
    }
  }
}
