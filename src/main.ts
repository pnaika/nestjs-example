import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from "@nestjs/common";
import * as config from 'config';

async function bootstrap() {
  const logger = new Logger('bootstrap');
  const app = await NestFactory.create(AppModule);

  if (process.env.NODE_ENV === 'development') {
    logger.log(`Application Started in DEV mode`);
    app.enableCors();
  }

  const serverConfig = process.env.port || config.get('server');
  const port = serverConfig.port;

  await app.listen(port);
  logger.log(`Application Started at port ${port}`)
}
bootstrap();
