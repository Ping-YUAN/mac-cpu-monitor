import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import express from 'express';
import path from 'path';

import { ApiModule } from './api/api.module';
import { AppController } from './app.controller';
import { CpuLoadGateway, CpuRestApiModule } from '@cpu-rest-api';
import { WsAdapter } from '@nestjs/platform-ws';

@Module({
  imports: [HttpModule, ApiModule, CpuRestApiModule],
  controllers: [AppController],
  providers: [CpuLoadGateway],
})
export class AppModule {
  static async createApp() {
    const app = await NestFactory.create(AppModule);
    app.useWebSocketAdapter(new WsAdapter(app));
    app.enableCors();
    app.use(express.static(path.join(__dirname, '../cpu-monitor')));

    const port = process.env.PORT || 4200;
    await app.listen(port);
  }
}
