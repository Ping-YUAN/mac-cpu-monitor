import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { randomUUID } from 'node:crypto';
import { Server, Socket } from 'socket.io';
import { ServerConfigService } from './configs/server-config.service';
import { WebSocket } from 'ws';
import { ServerCpuLoad } from '@cpu-monitor-types';
import { CPU_LOAD_SOCKET_PORT, serverSocketPath } from '@cpu-rest-api';

export const MONITOR_SOCKET_PORT = process.env.MONITOR_SOCKET_PORT
  ? Number(process.env.MONITOR_SOCKET_PORT)
  : 3838;

@WebSocketGateway(MONITOR_SOCKET_PORT, { path: '/monitor' })
export class MonitorCenterGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;

  private connections: Socket[] = [];
  private readonly clients: WebSocket[] = [];
  private cpuLoadSocketInitialized = false;
  constructor(private serverConfig: ServerConfigService) {}

  afterInit(server: Server) {
    console.log('WebSocket server monitor initialized');
    console.log(`Connecting websocket to cpu load servers`);
    if (!this.cpuLoadSocketInitialized) {
      this.serverConfig.serversSystemInfo$.subscribe((serversSystemMeta) => {
        serversSystemMeta.forEach((server) => {
          const baseUrl = new URL(server.baseUrl);
          const socketPath = `ws://${baseUrl.hostname}:${CPU_LOAD_SOCKET_PORT}${serverSocketPath}`;
          const socketClient = new WebSocket(socketPath);
          this.clients.push(socketClient);
          socketClient.on('open', () => {
            console.log('WebSocket connected');
          });

          socketClient.on('message', (data) => {
            this.sendToAll({
              id: server.id,
              load: Number(Number(data.toString()).toFixed(2)),
              date: new Date(),
            });
          });

          socketClient.on('close', () => {
            console.log('WebSocket disconnected');
          });
        });
      });
      this.cpuLoadSocketInitialized = true;
    }
  }

  handleConnection(client: any, ...args: any[]) {
    if (!client.id) {
      client.id = randomUUID();
    }
    console.log(
      `CPU moniotr Client ${client.id} connected. Connected Server ${this.connections.length};`
    );
    this.connections.push(client);
  }

  handleDisconnect(client: any) {
    console.log(`CPU moniotr Client ${client.id} disconnected`);
    const disconnectedIdx = this.connections.findIndex(
      (connection) => connection.id === client.id
    );
    this.connections.splice(disconnectedIdx);
  }

  sendToAll(load: ServerCpuLoad) {
    this.connections.forEach((connection) =>
      connection.send(JSON.stringify(load))
    );
  }
}
