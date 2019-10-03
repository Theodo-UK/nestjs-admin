import { TypeOrmModule } from '@nestjs/typeorm'
import { Module } from '@nestjs/common'

@Module({})
export class TestTypeOrmModule {
  static forRoot() {
    const typeOrmModule = TypeOrmModule.forRoot()
    return {
      module: TestTypeOrmModule,
      imports: [typeOrmModule],
      exports: [typeOrmModule],
    }
  }
}
