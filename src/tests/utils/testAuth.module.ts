import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';

@Module({})
export class TestAuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply((req: any, res: any, next: any) => {
        req.isAuthenticated = () => true;
        next();
      })
      .forRoutes('/admin/?');
  }
}
