import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import * as OS from 'node:os';
import { randomUUID } from 'node:crypto';

export const CPU_LOAD_SOCKET_PORT = process.env.CPU_LOAD_SOCKET_PORT
  ? Number(process.env.CPU_LOAD_SOCKET_PORT)
  : 8383;

@WebSocketGateway(CPU_LOAD_SOCKET_PORT, { path: '/cpu-load' })
export class CpuLoadGateway {
  @WebSocketServer() server: Server;

  private connections: Socket[] = [];

  constructor() {
    setInterval((_) => {
      if (this.connections.length > 0) {
        this.sendCupLoadToAllConnections(this.connections);
      }
    }, 10000);
  }

  @SubscribeMessage('cpu-average-load')
  handleMessage(client: any, payload: any): string {
    return 'Hello world!';
  }

  afterInit(server: Server) {
    console.log('WebSocket server cpu load initialized');
  }

  handleConnection(client: any, ...args: any[]) {
    if (!client.id) {
      client.id = randomUUID();
    }
    console.log(`CPU load subscribe Client ${client.id} connected`);
    this.connections.push(client);
  }

  handleDisconnect(client: any) {
    console.log(`CPU load subscribe  Client ${client.id} disconnected`);
    const disconnectedIdx = this.connections.findIndex(
      (connection) => connection.id === client.id
    );
    this.connections.splice(disconnectedIdx);
  }

  sendCupLoadToAllConnections(connections: Socket[]) {
    connections.forEach((connection) => {
      connection.send(this.getCupLoad());
    });
  }

  getCupLoad() {
    return OS.loadavg()[1];
  }
}
