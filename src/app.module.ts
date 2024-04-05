import { join } from 'path';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpStatus, Module } from '@nestjs/common';
import { ApolloServerErrorCode } from '@apollo/server/errors';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';

import { config } from '@config';
import { Department } from '@entities';
import { DepartmentsModule } from '@modules/departments/departments.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      formatError(formattedError, _error: any) {
        //graphQL validation failed
        if (
          formattedError.extensions.code ===
          ApolloServerErrorCode.GRAPHQL_VALIDATION_FAILED
        ) {
          return {
            message: [formattedError.message],
            status: HttpStatus.BAD_REQUEST,
          };
        }

        //class validator throw error
        if (formattedError.extensions.originalError) {
          const originalError = formattedError.extensions.originalError as any;
          if (originalError.message?.constructor !== Array)
            originalError.message = [originalError.message];
          return {
            message: originalError.message || ['Bad request'],
            status: originalError.statusCode || HttpStatus.BAD_REQUEST,
          };
        }

        //others
        return {
          message: [formattedError.message],
          status:
            formattedError.extensions.code || HttpStatus.INTERNAL_SERVER_ERROR,
        };
      },
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: config.POSTGRES_HOST,
      username: config.POSTGRES_USER,
      password: config.POSTGRES_PASSWORD,
      database: config.POSTGRES_DB,
      port: config.POSTGRES_PORT,
      entities: ['dist/**/*.entity{.ts,.js}'],
    }),
    DepartmentsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
