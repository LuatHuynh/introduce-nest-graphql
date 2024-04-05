import { Department } from '@entities';
import {
  CreateDepartmentArgs,
  UpdateDepartmentArgs,
} from '@modules/departments/dtos';

export const mockCreateDepartment: CreateDepartmentArgs = {
  name: 'Human resources',
  floor: 3,
  email: 'hr@clv.com',
  phoneNumber: '0794515902',
};

export const mockDepartment: Department = {
  id: '2f59c375-aaee-4a17-9e5e-9ef78d8fcdff',
  name: 'Human resources',
  floor: 3,
  email: 'hr@clv.com',
  phoneNumber: '0794515902',
  updatedAt: new Date(),
};

export const mockUpdateDepartment: UpdateDepartmentArgs = {
  id: '2f59c375-aaee-4a17-9e5e-9ef78d8fcdff',
  name: 'HR',
  floor: 2,
};
