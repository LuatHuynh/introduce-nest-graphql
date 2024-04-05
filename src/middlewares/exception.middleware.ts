import { GraphQLError } from 'graphql';
import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';

@Catch(GraphQLError)
export class GraphQLErrorsFilter implements ExceptionFilter {
  //add logger if needed
  catch(err: GraphQLError, _host: ArgumentsHost) {
    throw err;
  }
}
