import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';

import { AppModule } from './app.module';
import { GraphQLErrorsFilter } from './middlewares';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new GraphQLErrorsFilter());
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}
bootstrap();
