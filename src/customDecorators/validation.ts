import {
  ArgumentMetadata,
  ExecutionContext,
  HttpStatus,
  ParseUUIDPipe,
  createParamDecorator,
} from '@nestjs/common';
import { GraphQLError } from 'graphql';

import { config } from '@config';
import { DepartmentErrMsg } from '@const/department/error';

export const UuidIdArgs = createParamDecorator(
  async (data: string, ctx: ExecutionContext) => {
    const id = ctx.getArgByIndex(1)[data || ''] || '';
    const target = new ParseUUIDPipe({
      version: config.UUID_VERSION,
      exceptionFactory: (err: any) => {
        throw new GraphQLError(DepartmentErrMsg.INVALID_ID, {
          extensions: {
            code: HttpStatus.BAD_REQUEST,
          },
        });
      },
    });
    try {
      const rs = await target.transform(id, {} as ArgumentMetadata);
      return rs;
    } catch (error: any) {
      throw error;
    }
  },
);
