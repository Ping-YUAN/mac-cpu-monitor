export interface ServerClientInfo {
  name: string;
  type: string;
  id: string;
}

export interface ServiceServerConfig {
  id: string;
  baseUrl: string;
}

export interface ServerSystemInfo {
  cpuCount: number;
  hostname: string;
  type: string;
  id?: string;
}

export interface ServerCpuLoad {
  id: string;
  load: number;
  date: Date;
}
