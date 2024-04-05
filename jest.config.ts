import type { Config } from 'jest';
import { pathsToModuleNameMapper } from 'ts-jest';

import * as tsConfig from './tsconfig.json';

const config: Config = {
  preset: 'ts-jest',
  moduleDirectories: ['node_modules', '<rootDir>/src'],
  transformIgnorePatterns: ['<rootDir>/node_modules/'],
  moduleNameMapper: pathsToModuleNameMapper(tsConfig.compilerOptions.paths, {
    prefix: '<rootDir>',
  }),
  modulePathIgnorePatterns: ['<rootDir>/dist/'],
};

export default config;
