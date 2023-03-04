import { Controller, Get, Param } from '@nestjs/common';
import { ServerConfigService } from './configs/server-config.service';
import { Observable } from 'rxjs';
import { ServerClientInfo, ServerSystemInfo } from '@cpu-monitor-types';

@Controller('api')
export class ApiController {
  constructor(private readonly serverConfig: ServerConfigService) {}

  @Get('/servers')
  getServers(): Observable<ServerClientInfo[]> {
    return this.serverConfig.getServerConfig();
  }

  @Get('/server/:id')
  getServerInfoById(@Param('id') id: string): Observable<ServerSystemInfo> {
    return this.serverConfig.getServerSystemInfoById(id);
  }
}
