import { ServerCpuLoad } from '@cpu-monitor-types';

export enum ActivityType {
  SUCCESS = 'success',
  WARNING = 'warning',
  INFO = 'info',
}

export enum ConnectionStatus {
  CONNECTING = 'connecting',
  LOST_CONNECTION = 'lost',
  CONNECTED = 'connected',
}
export interface ActivityItem {
  type: ActivityType;
  description: string;
  activityDate: string;
}

export interface ServerMachineLoad {
  cpus: number;
  isOverLoaded: boolean;
  overLoadCount: number;
  overLoadCumulate: number; //cumulated overload millesecond => to convert into human readable;
  overLoadedStart: Date | null;
  loadWatchStart: Date;
  loads: ServerCpuLoad[];
  activities: ActivityItem[];
}

export interface ServerMachinesLoad {
  [id: string]: ServerMachineLoad;
}
