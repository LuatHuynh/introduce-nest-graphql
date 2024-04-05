import { GraphQLError } from 'graphql';
import { HttpStatus } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Test, TestingModule } from '@nestjs/testing';

import {
  mockCreateDepartment,
  mockDepartment,
  mockUpdateDepartment,
} from '@mock/department';
import { Department } from '@entities';
import { ILike, IsNull, Not, Repository } from 'typeorm';
import { DepartmentErrMsg } from '@const/department/error';
import { DepartmentsService } from './departments.service';
import { MockType, repositoryMockFactory } from '@mock/repositoryPattern';

describe('DepartmentsService', () => {
  let service: DepartmentsService;
  let mockDepartmentRepository: MockType<Repository<Department>>;
  const departmentNotFoundException = new GraphQLError(
    DepartmentErrMsg.NOT_FOUND,
    {
      extensions: {
        code: HttpStatus.NOT_FOUND,
      },
    },
  );
  const departmentNameExistsException = new GraphQLError(
    DepartmentErrMsg.EXISTED_NAME,
    {
      extensions: {
        code: HttpStatus.CONFLICT,
      },
    },
  );

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DepartmentsService,
        {
          provide: getRepositoryToken(Department),
          useFactory: repositoryMockFactory,
        },
      ],
    }).compile();

    service = module.get<DepartmentsService>(DepartmentsService);
    mockDepartmentRepository = module.get<MockType<Repository<Department>>>(
      getRepositoryToken(Department),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Get department by ID', () => {
    it('should return a department with given ID (if exists)', async () => {
      mockDepartmentRepository.findOne.mockReturnValue(mockDepartment);

      const result = await service.getDepartmentById(mockDepartment.id);

      expect(result).toEqual(mockDepartment);
      expect(mockDepartmentRepository.findOne).toHaveBeenCalledWith({
        where: {
          id: mockDepartment.id,
        },
      });
    });

    it('should throw error if there is not department with given ID', async () => {
      mockDepartmentRepository.findOne.mockReturnValue(null);

      await expect(
        service.getDepartmentById(mockDepartment.id),
      ).rejects.toThrow(departmentNotFoundException);
      expect(mockDepartmentRepository.findOne).toHaveBeenCalledWith({
        where: {
          id: mockDepartment.id,
        },
      });
    });
  });

  describe('Create find by optional column for field with string value', () => {
    it('should return ILike() if field is a string', () => {
      expect(service.createFindByOptionalColumnForStringValue('a')).toEqual(
        ILike(`%a%`),
      );
    });
    it('should return IsNull() if field is null', () => {
      expect(service.createFindByOptionalColumnForStringValue(null)).toEqual(
        IsNull(),
      );
    });
    it('should return undefined if field is undefined', () => {
      expect(
        service.createFindByOptionalColumnForStringValue(undefined),
      ).toEqual(undefined);
    });
  });

  describe('Get departments with filter', () => {
    it('should return all departments if filter does not contain anything', async () => {
      mockDepartmentRepository.find.mockReturnValue([mockDepartment]);

      const result = await service.getDepartmentsWithFilter({});

      expect(result).toEqual([mockDepartment]);
      expect(mockDepartmentRepository.find).toHaveBeenCalledWith({
        where: {},
      });
    });

    it('should return departments which given filter', async () => {
      mockDepartmentRepository.find.mockReturnValue([mockDepartment]);

      const name = 'a';
      const email = 'h';
      const floor = 3;
      const phoneNumber = '077';
      const result = await service.getDepartmentsWithFilter({
        name: name,
        email: email,
        floor: floor,
        phoneNumber: phoneNumber,
      });

      expect(result).toEqual([mockDepartment]);
      expect(mockDepartmentRepository.find).toHaveBeenCalledWith({
        where: {
          name: ILike(`%${name}%`),
          floor: floor,
          email: ILike(`%${email}%`),
          phoneNumber: ILike(`%${phoneNumber}%`),
        },
      });
    });
  });

  describe('Get all departments', () => {
    it('should return all departments', async () => {
      mockDepartmentRepository.find.mockReturnValue([mockDepartment]);

      const result = await service.getDepartments();

      expect(result).toEqual([mockDepartment]);
      expect(mockDepartmentRepository.find).toHaveBeenCalled();
    });
  });

  describe('Create a department', () => {
    it('should return a new department', async () => {
      mockDepartmentRepository.exists.mockReturnValue(false);
      mockDepartmentRepository.create.mockReturnValue(mockCreateDepartment);
      mockDepartmentRepository.save.mockReturnValue(mockDepartment);

      const result = await service.createDepartment(mockCreateDepartment);

      expect(result).toEqual(mockDepartment);
      expect(mockDepartmentRepository.exists).toHaveBeenCalledWith({
        where: { name: ILike(mockCreateDepartment.name) },
        withDeleted: true,
      });
      expect(mockDepartmentRepository.create).toHaveBeenCalledWith(
        mockCreateDepartment,
      );
      expect(mockDepartmentRepository.save).toHaveBeenCalledWith(
        mockCreateDepartment,
      );
    });

    it('should throw error if new department name already exists', async () => {
      mockDepartmentRepository.exists.mockReturnValue(true);

      await expect(
        service.createDepartment(mockCreateDepartment),
      ).rejects.toThrow(departmentNameExistsException);
      expect(mockDepartmentRepository.exists).toHaveBeenCalledWith({
        where: { name: ILike(mockCreateDepartment.name) },
        withDeleted: true,
      });
    });
  });

  describe('Update a department', () => {
    it('should return the updated department', async () => {
      const updatedDepartment = {
        ...mockDepartment,
        ...mockUpdateDepartment,
      };
      mockDepartmentRepository.findOne.mockReturnValue(mockDepartment);
      mockDepartmentRepository.existsBy.mockReturnValue(false);

      const result = await service.updateDepartment(mockUpdateDepartment);

      expect(result).toEqual(updatedDepartment);
      expect(mockDepartmentRepository.findOne).toHaveBeenCalledWith({
        where: {
          id: mockUpdateDepartment.id,
        },
      });
      expect(mockDepartmentRepository.existsBy).toHaveBeenCalledWith({
        name: ILike(mockUpdateDepartment.name),
        id: Not(mockUpdateDepartment.id),
      });
      expect(mockDepartmentRepository.update).toHaveBeenCalledWith(
        {
          id: mockUpdateDepartment.id,
        },
        {
          ...mockUpdateDepartment,
        },
      );
    });

    it('should throw error if there is not department with given ID', async () => {
      mockDepartmentRepository.findOne.mockReturnValue(null);

      await expect(service.deleteDepartment(mockDepartment.id)).rejects.toThrow(
        departmentNotFoundException,
      );
      expect(mockDepartmentRepository.findOne).toHaveBeenCalledWith({
        where: {
          id: mockDepartment.id,
        },
      });
    });

    it('should throw error if updated department name has been already taken by another department', async () => {
      mockDepartmentRepository.existsBy.mockReturnValue(true);

      await expect(
        service.updateDepartment(mockUpdateDepartment),
      ).rejects.toThrow(departmentNameExistsException);
      expect(mockDepartmentRepository.existsBy).toHaveBeenCalledWith({
        name: ILike(mockUpdateDepartment.name),
        id: Not(mockUpdateDepartment.id),
      });
    });
  });

  describe('Delete department by ID', () => {
    it('should return the deleted department with given ID (if exists)', async () => {
      mockDepartmentRepository.findOne.mockReturnValue(mockDepartment);
      mockDepartmentRepository.softRemove.mockReturnValue(mockDepartment);

      const result = await service.deleteDepartment(mockDepartment.id);

      expect(result).toEqual(mockDepartment);
      expect(mockDepartmentRepository.findOne).toHaveBeenCalledWith({
        where: {
          id: mockDepartment.id,
        },
      });
      expect(mockDepartmentRepository.softRemove).toHaveBeenCalledWith(
        mockDepartment,
      );
    });

    it('should throw error if there is not department with given ID', async () => {
      mockDepartmentRepository.findOne.mockReturnValue(null);

      await expect(service.deleteDepartment(mockDepartment.id)).rejects.toThrow(
        departmentNotFoundException,
      );
      expect(mockDepartmentRepository.findOne).toHaveBeenCalledWith({
        where: {
          id: mockDepartment.id,
        },
      });
    });
  });
});
