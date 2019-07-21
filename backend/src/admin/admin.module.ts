import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminSite } from './admin.service';

@Module({
  controllers: [AdminController],
  providers: [AdminSite],
  exports: [AdminSite],
})
export class AdminModule { }
