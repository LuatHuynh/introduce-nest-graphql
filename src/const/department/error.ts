export enum DepartmentErrMsg {
  INVALID_NAME = 'Name is invalid string!',
  EMPTY_NAME = 'Name cannot be empty!',
  INVALID_FLOOR = 'Floor must be a number!',
  MINIMUM_FLOOR = 'Floor must be greater than 0!',
  INVALID_EMAIL = 'Email is invalid!',
  EMPTY_PHONE_NUMBER = 'Phone number cannot be empty!',
  INVALID_ID = 'ID is invalid (UUID expected)',
  NOT_FOUND = 'Department not found!',
  EXISTED_NAME = 'Department name already exists!',
}
