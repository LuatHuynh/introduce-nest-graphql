import { GraphQLError } from 'graphql';
import { InjectRepository } from '@nestjs/typeorm';
import { HttpStatus, Injectable } from '@nestjs/common';
import { ILike, IsNull, Not, Repository } from 'typeorm';

import {
  CreateDepartmentArgs,
  DepartmentFilterInput,
  UpdateDepartmentArgs,
} from '../dtos';
import { Department } from '@entities';
import { DepartmentErrMsg } from '@const/department/error';

@Injectable()
export class DepartmentsService {
  constructor(
    @InjectRepository(Department)
    private readonly departmentRepository: Repository<Department>,
  ) {}

  async getDepartmentById(id: string) {
    const department = await this.departmentRepository.findOne({
      where: {
        id: id,
      },
    });
    if (!department)
      throw new GraphQLError(DepartmentErrMsg.NOT_FOUND, {
        extensions: {
          code: HttpStatus.NOT_FOUND,
        },
      });
    return department;
  }

  createFindByOptionalColumnForStringValue(field?: string) {
    return field
      ? ILike(`%${field}%`)
      : typeof field === 'undefined'
        ? field
        : IsNull();
  }

  async getDepartmentsWithFilter(filter: DepartmentFilterInput) {
    const departments = await this.departmentRepository.find({
      where: {
        name: filter.name ? ILike(`%${filter.name}%`) : filter.name,
        floor: filter.floor,
        email: this.createFindByOptionalColumnForStringValue(filter.email),
        phoneNumber: this.createFindByOptionalColumnForStringValue(
          filter.phoneNumber,
        ),
      },
    });

    return departments;
  }

  async getDepartments() {
    return await this.departmentRepository.find();
  }

  async createDepartment(createDepartmentDto: CreateDepartmentArgs) {
    const existedDepartment = await this.departmentRepository.exists({
      where: { name: ILike(createDepartmentDto.name) },
      withDeleted: true,
    });
    if (existedDepartment)
      throw new GraphQLError(DepartmentErrMsg.EXISTED_NAME, {
        extensions: {
          code: HttpStatus.CONFLICT,
        },
      });

    const department = this.departmentRepository.create({
      ...createDepartmentDto,
    });

    return await this.departmentRepository.save(department);
  }

  async updateDepartment(d: UpdateDepartmentArgs) {
    const department = await this.getDepartmentById(d.id);

    const existedOtherDepartmentByName =
      await this.departmentRepository.existsBy({
        name: ILike(d.name),
        id: Not(d.id),
      });
    if (existedOtherDepartmentByName)
      throw new GraphQLError(DepartmentErrMsg.EXISTED_NAME, {
        extensions: {
          code: HttpStatus.CONFLICT,
        },
      });

    await this.departmentRepository.update(
      {
        id: department.id,
      },
      {
        ...d,
      },
    );

    const updatedDepartment = {
      ...department,
      ...d,
    };

    return updatedDepartment;
  }

  async deleteDepartment(id: string) {
    const department = await this.getDepartmentById(id);
    return await this.departmentRepository.softRemove(department);
  }
}
