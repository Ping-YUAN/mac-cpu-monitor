import { ServerSystemInfo } from '@cpu-monitor-types';
import { Controller, Get } from '@nestjs/common';
import * as OS from 'node:os';

@Controller('cpu-monitor')
export class CpuRestApiController {
  @Get('/server-info')
  getCpuInfo(): ServerSystemInfo {
    return {
      cpuCount: OS.cpus().length,
      hostname: OS.hostname(),
      type: OS.type(),
    };
  }
}
