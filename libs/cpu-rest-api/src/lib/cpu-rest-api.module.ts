import { Module } from '@nestjs/common';
import { CpuLoadGateway } from './cpu-load.gateway';
import { CpuRestApiController } from './cpu-rest-api.controller';

@Module({
  controllers: [CpuRestApiController],
  providers: [CpuLoadGateway],
  exports: [CpuLoadGateway],
})
export class CpuRestApiModule {}
