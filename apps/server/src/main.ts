/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as express from 'express';
import * as path from 'path';
import { ApiModule } from './app/api/api.module';

import { AppModule } from './app/app.module';

async function bootstrap() {
  await AppModule.createApp();
  // const app = await NestFactory.create(AppModule);
  // const api = await NestFactory.create(ApiModule);

  // app.use('/api', api);

  // app.use(express.static(path.join(__dirname, '../cpu-monitor')));

  // const port = process.env.PORT || 4200;
  // await app.listen(port);

  // Logger.log(
  //   `🚀 Application is running on: http://localhost:${port}`
  // );
}

bootstrap();
