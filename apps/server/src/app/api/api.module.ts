import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ApiController } from './api.controller';
import { ServerConfigService } from './configs/server-config.service';
import { MonitorCenterGateway } from './monitor-center.gateway';
// import { MonitorCenterGateway } from "./monitor-center.gateway";

@Module({
  imports: [HttpModule],
  controllers: [ApiController],
  providers: [ServerConfigService, MonitorCenterGateway],
})
export class ApiModule {}
