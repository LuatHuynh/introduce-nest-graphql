import { ParseUUIDPipe } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import {
  CreateDepartmentArgs,
  DepartmentFilterInput,
  UpdateDepartmentArgs,
} from '../dtos';
import { Department } from '@entities';
import { DepartmentsService } from '../services';

@Resolver((of) => Department)
export class DepartmentsResolver {
  constructor(private departmentsService: DepartmentsService) {}

  @Query((returns) => Department, { name: 'department' })
  async getDepartmentById(@Args('id', new ParseUUIDPipe()) id: string) {
    return await this.departmentsService.getDepartmentById(id);
  }

  @Query((returns) => [Department], { name: 'departments' })
  async getDepartments() {
    return await this.departmentsService.getDepartments();
  }

  @Query((returns) => [Department], { name: 'departmentsWithFilter' })
  async getDepartmentsWithFilter(
    @Args('filter') filter: DepartmentFilterInput,
  ) {
    return await this.departmentsService.getDepartmentsWithFilter(filter);
  }

  @Mutation((returns) => Department)
  async createDepartment(@Args('department') department: CreateDepartmentArgs) {
    return await this.departmentsService.createDepartment(department);
  }

  @Mutation((returns) => Department)
  async updateDepartment(
    @Args('department')
    department: UpdateDepartmentArgs,
  ) {
    return await this.departmentsService.updateDepartment(department);
  }

  @Mutation((returns) => Department)
  async deleteDepartment(@Args('id', new ParseUUIDPipe()) id: string) {
    return await this.departmentsService.deleteDepartment(id);
  }
}
