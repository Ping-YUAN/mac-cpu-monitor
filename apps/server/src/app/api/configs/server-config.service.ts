import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { forkJoin, map, Observable, of, Subject, switchMap } from 'rxjs';
import {
  ServerClientInfo,
  ServerSystemInfo,
  ServiceServerConfig,
} from '@cpu-monitor-types';
import { serverInfoPath } from '@cpu-rest-api';
import { localServer } from './server-config.interface';

@Injectable()
export class ServerConfigService {
  private servers: ServiceServerConfig[] = [];
  private serversSystemInfo: (ServiceServerConfig & ServerSystemInfo)[] = [];
  serversSystemInfo$: Subject<any> = new Subject();

  constructor(private readonly http: HttpService) {
    try {
      const envServers = JSON.parse(process.env.SERVERS);

      if (envServers.length === 0) {
        this.servers = [localServer];
      } else {
        this.servers = envServers;
      }
    } catch (error) {
      this.servers = [localServer];
    }
  }

  getServerConfig(): Observable<ServerClientInfo[]> {
    if (this.serversSystemInfo && this.serversSystemInfo.length > 0) {
      return of(this.getServerClientInfoFromSystemInfo());
    } else {
      return forkJoin(
        this.servers.map((server) =>
          this.http.get(server.baseUrl + serverInfoPath).pipe(
            map((res) => {
              return {
                id: server.id,
                hostname: res.data.hostname,
                type: res.data.type,
                cpuCount: res.data.cpuCount,
                baseUrl: server.baseUrl,
              };
            })
          )
        )
      ).pipe(
        map((serversInfo) => {
          this.serversSystemInfo = serversInfo;
          this.serversSystemInfo$.next(this.serversSystemInfo);
          return this.getServerClientInfoFromSystemInfo();
        })
      );
    }
  }

  getServerSystemMeta(): (ServiceServerConfig & ServerSystemInfo)[] {
    return this.serversSystemInfo;
  }

  getServerClientInfoFromSystemInfo(): ServerClientInfo[] {
    return this.serversSystemInfo.map((server) => {
      return {
        name: server.hostname,
        type: server.type,
        id: server.id,
      };
    });
  }

  getServerSystemInfoById(id: string): Observable<ServerSystemInfo> {
    return this.getServerConfig().pipe(
      switchMap(() => {
        const systemInfoIdx = this.serversSystemInfo.findIndex(
          (item) => item.id === id
        );

        return of(this.serversSystemInfo[systemInfoIdx]);
      })
    );
  }
}
