import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Department } from '@entities';
import { DepartmentsService } from './services';
import { DepartmentsResolver } from './resolvers';

@Module({
  imports: [TypeOrmModule.forFeature([Department])],
  providers: [DepartmentsService, DepartmentsResolver],
  exports: [DepartmentsService, TypeOrmModule],
})
export class DepartmentsModule {}
