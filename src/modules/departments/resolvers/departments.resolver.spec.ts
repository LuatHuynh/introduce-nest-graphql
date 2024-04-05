import { GraphQLError } from 'graphql';
import { validate } from 'class-validator';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Test, TestingModule } from '@nestjs/testing';

import { Department } from '@entities';
import {
  CreateDepartmentArgs,
  DepartmentFilterInput,
  UpdateDepartmentArgs,
} from '../dtos';
import { DepartmentsService } from '../services';
import { plainToInstance } from 'class-transformer';
import { DepartmentErrMsg } from '@const/department/error';
import { repositoryMockFactory } from '@mock/repositoryPattern';
import { DepartmentsResolver } from '@modules/departments/resolvers';
import {
  mockCreateDepartment,
  mockDepartment,
  mockUpdateDepartment,
} from '@mock/department';
import { ArgumentMetadata, HttpStatus, ParseUUIDPipe } from '@nestjs/common';

describe('DepartmentsResolver', () => {
  let departmentsResolver: DepartmentsResolver;
  let departmentsService: DepartmentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DepartmentsResolver,
        DepartmentsService,
        {
          provide: getRepositoryToken(Department),
          useFactory: repositoryMockFactory,
        },
      ],
    }).compile();

    departmentsResolver = module.get<DepartmentsResolver>(DepartmentsResolver);
    departmentsService = module.get<DepartmentsService>(DepartmentsService);
  });

  it('should be defined', () => {
    expect(departmentsResolver).toBeDefined();
  });

  describe('Create a department', () => {
    it('should make a new department', async () => {
      jest
        .spyOn(departmentsService, 'createDepartment')
        .mockImplementation(async () => mockDepartment);
      expect(
        await departmentsResolver.createDepartment(mockCreateDepartment),
      ).toBe(mockDepartment);
    });

    it('name should not be empty', async () => {
      const importInfo: any = { name: ' ', floor: 1 };
      const ofImportDto = plainToInstance(CreateDepartmentArgs, importInfo);
      const errors = await validate(ofImportDto);
      expect(errors.length).not.toBe(0);
      expect(JSON.stringify(errors)).toContain(DepartmentErrMsg.EMPTY_NAME);
    });

    it('name should not be a number', async () => {
      const importInfo: any = { name: 4567, floor: 1 };
      const ofImportDto = plainToInstance(CreateDepartmentArgs, importInfo);
      const errors = await validate(ofImportDto);
      expect(errors.length).not.toBe(0);
      expect(JSON.stringify(errors)).toContain(DepartmentErrMsg.INVALID_NAME);
    });

    it('floor value should be a number', async () => {
      const importInfo: any = { name: 'R&D', floor: 'a' };
      const ofImportDto = plainToInstance(CreateDepartmentArgs, importInfo);
      const errors = await validate(ofImportDto);
      expect(errors.length).not.toBe(0);
      expect(JSON.stringify(errors)).toContain(DepartmentErrMsg.INVALID_FLOOR);
    });

    it('floor value should be greater than 0', async () => {
      const importInfo: any = { name: 'R&D', floor: -1 };
      const ofImportDto = plainToInstance(CreateDepartmentArgs, importInfo);
      const errors = await validate(ofImportDto);
      expect(errors.length).not.toBe(0);
      expect(JSON.stringify(errors)).toContain(DepartmentErrMsg.MINIMUM_FLOOR);
    });

    it('email can be null', async () => {
      const importInfo: any = { name: 'R&D', floor: 1, email: null };
      const ofImportDto = plainToInstance(CreateDepartmentArgs, importInfo);
      const errors = await validate(ofImportDto);
      expect(errors.length).toBe(0);
    });

    it('if exists, email should be valid', async () => {
      const importInfo: any = { name: 'R&D', floor: 1, email: 'abc' };
      const ofImportDto = plainToInstance(CreateDepartmentArgs, importInfo);
      const errors = await validate(ofImportDto);
      expect(errors.length).not.toBe(0);
      expect(JSON.stringify(errors)).toContain(DepartmentErrMsg.INVALID_EMAIL);
    });

    it('phone number can be null', async () => {
      const importInfo: any = { name: 'R&D', floor: 1, phoneNumber: null };
      const ofImportDto = plainToInstance(CreateDepartmentArgs, importInfo);
      const errors = await validate(ofImportDto);
      expect(errors.length).toBe(0);
    });

    it('if exists, phone number should not be empty', async () => {
      const importInfo: any = { name: 'R&D', floor: 1, phoneNumber: '' };
      const ofImportDto = plainToInstance(CreateDepartmentArgs, importInfo);
      const errors = await validate(ofImportDto);
      expect(errors.length).not.toBe(0);
      expect(JSON.stringify(errors)).toContain(
        DepartmentErrMsg.EMPTY_PHONE_NUMBER,
      );
    });
  });

  describe('Get department by ID', () => {
    it('should return a department if exists', async () => {
      jest
        .spyOn(departmentsService, 'getDepartmentById')
        .mockImplementation(async () => mockDepartment);
      expect(
        await departmentsResolver.getDepartmentById(
          '2f59c375-aaee-4a17-9e5e-9ef78d8fcdff',
        ),
      ).toBe(mockDepartment);
    });

    it('ID should be a uuid', async () => {
      const target = new ParseUUIDPipe();
      try {
        const uuid = await target.transform('a', {} as ArgumentMetadata);
        expect('a' === uuid).toBe(false);
      } catch (error) {
        expect(error.status).toEqual(HttpStatus.BAD_REQUEST);
      }
    });
  });

  describe('Get all departments', () => {
    it('should return departments array or empty array', async () => {
      jest
        .spyOn(departmentsService, 'getDepartments')
        .mockImplementation(async () => [mockDepartment]);
      expect(await departmentsResolver.getDepartments()).toEqual([
        mockDepartment,
      ]);
    });
  });

  describe('Get departments with filter', () => {
    it('should return all departments array or empty array', async () => {
      const filter: DepartmentFilterInput = { name: 'a', floor: 3 };
      jest
        .spyOn(departmentsService, 'getDepartmentsWithFilter')
        .mockImplementation(async () => [mockDepartment]);
      expect(
        await departmentsResolver.getDepartmentsWithFilter(filter),
      ).toEqual([mockDepartment]);
    });

    it('should return all departments array or empty array if there is nothing in filter', async () => {
      jest
        .spyOn(departmentsService, 'getDepartmentsWithFilter')
        .mockImplementation(async () => [mockDepartment]);
      expect(await departmentsResolver.getDepartmentsWithFilter({})).toEqual([
        mockDepartment,
      ]);
    });

    it('floor value should be a number', async () => {
      const importInfo: any = { floor: 'a' };
      const ofImportDto = plainToInstance(DepartmentFilterInput, importInfo);
      const errors = await validate(ofImportDto);
      expect(errors.length).not.toBe(0);
      expect(JSON.stringify(errors)).toContain(DepartmentErrMsg.INVALID_FLOOR);
    });

    it('floor value should be greater than 0', async () => {
      const importInfo: any = { floor: -1 };
      const ofImportDto = plainToInstance(DepartmentFilterInput, importInfo);
      const errors = await validate(ofImportDto);
      expect(errors.length).not.toBe(0);
      expect(JSON.stringify(errors)).toContain(DepartmentErrMsg.MINIMUM_FLOOR);
    });
  });

  describe('Update department', () => {
    it('department should be updated', async () => {
      jest
        .spyOn(departmentsService, 'updateDepartment')
        .mockImplementation(async () => ({
          ...mockDepartment,
          ...mockUpdateDepartment,
        }));
      expect(
        await departmentsResolver.updateDepartment(mockUpdateDepartment),
      ).toEqual({ ...mockDepartment, ...mockUpdateDepartment });
    });

    it('ID must be a uuid', async () => {
      const importInfo: UpdateDepartmentArgs = {
        ...mockUpdateDepartment,
        id: 'abc',
      };
      const ofImportDto = plainToInstance(UpdateDepartmentArgs, importInfo);
      const errors = await validate(ofImportDto);
      expect(errors.length).not.toBe(0);
      expect(JSON.stringify(errors)).toContain(DepartmentErrMsg.INVALID_ID);
    });

    it('name should not be empty', async () => {
      const importInfo: UpdateDepartmentArgs = {
        ...mockUpdateDepartment,
        name: ' ',
      };
      const ofImportDto = plainToInstance(UpdateDepartmentArgs, importInfo);
      const errors = await validate(ofImportDto);
      expect(errors.length).not.toBe(0);
      expect(JSON.stringify(errors)).toContain(DepartmentErrMsg.EMPTY_NAME);
    });

    it('floor value should be a number', async () => {
      const importInfo: any = { id: mockUpdateDepartment.id, floor: 'a' };
      const ofImportDto = plainToInstance(UpdateDepartmentArgs, importInfo);
      const errors = await validate(ofImportDto);
      expect(errors.length).not.toBe(0);
      expect(JSON.stringify(errors)).toContain(DepartmentErrMsg.INVALID_FLOOR);
    });

    it('floor value should be greater than 0', async () => {
      const importInfo: any = { id: mockUpdateDepartment.id, floor: -1 };
      const ofImportDto = plainToInstance(UpdateDepartmentArgs, importInfo);
      const errors = await validate(ofImportDto);
      expect(errors.length).not.toBe(0);
      expect(JSON.stringify(errors)).toContain(DepartmentErrMsg.MINIMUM_FLOOR);
    });

    it('email can be null', async () => {
      const importInfo: any = { id: mockUpdateDepartment.id, email: null };
      const ofImportDto = plainToInstance(UpdateDepartmentArgs, importInfo);
      const errors = await validate(ofImportDto);
      expect(errors.length).toBe(0);
    });

    it('if exists, email should be valid', async () => {
      const importInfo: any = { id: mockUpdateDepartment.id, email: 'a' };
      const ofImportDto = plainToInstance(UpdateDepartmentArgs, importInfo);
      const errors = await validate(ofImportDto);
      expect(errors.length).not.toBe(0);
      expect(JSON.stringify(errors)).toContain(DepartmentErrMsg.INVALID_EMAIL);
    });

    it('phone number can be null', async () => {
      const importInfo: any = {
        id: mockUpdateDepartment.id,
        phoneNumber: null,
      };
      const ofImportDto = plainToInstance(UpdateDepartmentArgs, importInfo);
      const errors = await validate(ofImportDto);
      expect(errors.length).toBe(0);
    });

    it('if exists, phone number should not be empty', async () => {
      const importInfo: any = { id: mockUpdateDepartment.id, phoneNumber: ' ' };
      const ofImportDto = plainToInstance(UpdateDepartmentArgs, importInfo);
      const errors = await validate(ofImportDto);
      expect(errors.length).not.toBe(0);
      expect(JSON.stringify(errors)).toContain(
        DepartmentErrMsg.EMPTY_PHONE_NUMBER,
      );
    });
  });

  describe('Delete department', () => {
    it('should return a department if exists', async () => {
      jest
        .spyOn(departmentsService, 'deleteDepartment')
        .mockImplementation(async () => mockDepartment);
      expect(
        await departmentsResolver.deleteDepartment(
          '2f59c375-aaee-4a17-9e5e-9ef78d8fcdff',
        ),
      ).toBe(mockDepartment);
    });

    it('ID should be a uuid', async () => {
      const target = new ParseUUIDPipe();
      try {
        const uuid = await target.transform('a', {} as ArgumentMetadata);
        expect('a' === uuid).toBe(false);
      } catch (error) {
        expect(error.status).toEqual(HttpStatus.BAD_REQUEST);
      }
    });
  });
});
