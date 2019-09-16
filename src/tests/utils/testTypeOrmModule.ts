import { TypeOrmModule } from '@nestjs/typeorm'
import { Module } from '@nestjs/common'

@Module({})
export class TestTypeOrmModule {
  static forRoot() {
    const typeOrmModule = TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5434,
      username: 'seed',
      password: 'Ge0rgesMoustaki',
      database: 'seed',
      entities: [__dirname + '/../../**/*.entity.{js,ts}'],
      synchronize: false,
    })
    return {
      module: TestTypeOrmModule,
      imports: [typeOrmModule],
      exports: [typeOrmModule],
    }
  }
}
