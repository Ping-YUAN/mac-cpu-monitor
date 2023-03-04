import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  ServerClientInfo,
  ServerCpuLoad,
  ServerSystemInfo,
} from '@cpu-monitor-types';
import { BehaviorSubject, Subject } from 'rxjs';
import { webSocket } from 'rxjs/webSocket';
import {
  ActivityItem,
  ActivityType,
  ConnectionStatus,
  ServerMachinesLoad,
} from './model.interface';

@Injectable({
  providedIn: 'root',
})
export class MachineLoaderService {
  serverMachines$: Subject<ServerClientInfo[]> = new Subject();

  private connectionStatus: ConnectionStatus = ConnectionStatus.CONNECTING;
  connectionStatus$: BehaviorSubject<ConnectionStatus> =
    new BehaviorSubject<ConnectionStatus>(this.connectionStatus);

  currentServerCpuInfo$: Subject<ServerSystemInfo> =
    new Subject<ServerSystemInfo>();
  currentServerLatestLoad$: Subject<ServerCpuLoad> =
    new Subject<ServerCpuLoad>();
  currentServerLoads$: Subject<ServerCpuLoad[]> = new Subject<
    ServerCpuLoad[]
  >();
  currentServerActivity$: Subject<ActivityItem> = new Subject<ActivityItem>();

  warningTriggerLoad$: Subject<number> = new Subject<number>();

  private currentServerCpuInfo!: ServerSystemInfo;
  private currentServerLatestLoad!: ServerCpuLoad;

  private warningTriggerLoad = 0.8;

  private subject = webSocket(`ws://localhost:3838/monitor`);
  private serverMachines: ServerClientInfo[] = [];
  private serverMachinesLoad: ServerMachinesLoad = {};

  constructor(private httpClient: HttpClient) {}

  load() {
    this.httpClient.get('api/servers').subscribe((body) => {
      this.serverMachines = body as any;
      this.serverMachines$.next(this.serverMachines);
      if (this.serverMachines.length > 0) {
        this.setCurrentMachine(this.serverMachines[0].id);
        this.serverMachines.forEach((item) => {
          this.serverMachinesLoad[item.id] = {
            cpus: 0,
            isOverLoaded: false,
            overLoadedStart: null,
            overLoadCount: 0,
            overLoadCumulate: 0,
            loadWatchStart: new Date(),
            loads: [],
            activities: [
              {
                type: ActivityType.INFO,
                description: 'Start to watch CPU Load for ' + item.name,
                activityDate: new Date().toString(),
              },
            ],
          };
        });

        this.setupMonitorSocket();
      }
    });
  }

  setupMonitorSocket() {
    this.subject.subscribe(
      (load) => {
        try {
          this.connectionStatus = ConnectionStatus.CONNECTED;
          this.connectionStatus$.next(this.connectionStatus);
          const loadData: ServerCpuLoad = JSON.parse(JSON.stringify(load));
          this.handleServerLoad(loadData);
          // eslint-disable-next-line no-empty
        } catch (err) {}
      },
      (err: any) => {
        console.log(err);
        this.socketClosed();
      },
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      () => {}
    );
  }

  socketClosed() {
    this.connectionStatus = ConnectionStatus.LOST_CONNECTION;
    this.connectionStatus$.next(this.connectionStatus);

    Object.keys(this.serverMachinesLoad).forEach((id) => {
      this.serverMachinesLoad[id].activities.unshift({
        activityDate: new Date().toString(),
        description: 'Socket closed. Stop to monitor CPU load',
        type: ActivityType.INFO,
      });
    });
  }

  setCurrentMachine(id: string) {
    this.httpClient.get('api/server/' + id).subscribe((serverSystemInfo) => {
      this.currentServerCpuInfo = serverSystemInfo as any;
      this.currentServerCpuInfo$.next(this.currentServerCpuInfo);
      if (this.currentServerCpuInfo && this.currentServerCpuInfo.id) {
        this.serverMachinesLoad[this.currentServerCpuInfo.id].cpus =
          this.currentServerCpuInfo.cpuCount;
      }
    });
  }

  setWarningLimit(limit: number) {
    if (limit >= 1 || limit < 0) {
      this.warningTriggerLoad = 0.8;
    } else {
      this.warningTriggerLoad = limit;
    }

    this.warningTriggerLoad$.next(this.warningTriggerLoad);
  }

  getWarningLimit(): number {
    return this.warningTriggerLoad;
  }

  getCurrentMachineCpuOverLoadedCount(): number {
    if (this.currentServerCpuInfo && this.currentServerCpuInfo.id) {
      return this.serverMachinesLoad[this.currentServerCpuInfo.id]
        .overLoadCount;
    }
    return 0;
  }

  getCurrentMachineCpuOverLoadedMinutes(): string {
    if (this.connectionStatus !== ConnectionStatus.CONNECTED) return '0';
    if (this.currentServerCpuInfo && this.currentServerCpuInfo.id) {
      let onGoingLoaded = 0;
      if (this.serverMachinesLoad[this.currentServerCpuInfo.id].isOverLoaded) {
        onGoingLoaded = this.getOverLoadMilleSeconds(
          new Date(),
          (this.serverMachinesLoad[this.currentServerCpuInfo.id] as any)
            .overLoadedStart
        );
      }
      const overloadMillesecond =
        this.serverMachinesLoad[this.currentServerCpuInfo.id].overLoadCumulate +
        onGoingLoaded;
      return this.getHumanReadableTimeDifference(overloadMillesecond);
    }
    return '0';
  }

  getCurrentMachineExistingActivities() {
    if (this.currentServerCpuInfo && this.currentServerCpuInfo.id) {
      return this.serverMachinesLoad[this.currentServerCpuInfo.id].activities;
    }
    return [];
  }

  handleServerLoad(load: ServerCpuLoad) {
    const dateIdx = this.serverMachinesLoad[load.id].loads.findIndex(
      (item) => item.date == load.date
    );

    if (dateIdx < 0) {
      this.serverMachinesLoad[load.id].loads.push(load);
    }

    if (this.currentServerCpuInfo.id === load.id) {
      this.currentServerLatestLoad = load;
      this.currentServerLatestLoad$.next(this.currentServerLatestLoad);
    }

    //keep only 10 mins data so load length max will be  60  => only keep the last 60 elements;
    if (this.serverMachinesLoad[load.id].loads.length > 60) {
      this.serverMachinesLoad[load.id].loads =
        this.serverMachinesLoad[load.id].loads.slice(-60);
    }

    this.currentServerLoads$.next(this.serverMachinesLoad[load.id].loads);

    this.checkActivity(load);
  }

  checkActivity(load: ServerCpuLoad) {
    if (this.serverMachinesLoad[load.id].isOverLoaded) {
      if (
        load.load <
        this.serverMachinesLoad[load.id].cpus * this.warningTriggerLoad
      ) {
        const overloadPeriod = this.getOverLoadMilleSeconds(
          load.date,
          (this.serverMachinesLoad[load.id] as any).overLoadedStart
        );
        this.currentServerActivity$.next({
          type: ActivityType.SUCCESS,
          description:
            'CPU load recovered.' +
            ' OverLoad total time: ' +
            this.getHumanReadableTimeDifference(overloadPeriod),
          activityDate: load.date.toString(),
        });
        this.serverMachinesLoad[load.id].isOverLoaded = false;
        this.serverMachinesLoad[load.id].overLoadedStart = null;
        this.serverMachinesLoad[load.id].overLoadCumulate += overloadPeriod;
      }
    } else {
      if (
        load.load >=
        this.serverMachinesLoad[load.id].cpus * this.warningTriggerLoad
      ) {
        this.currentServerActivity$.next({
          type: ActivityType.WARNING,
          description: 'Attention! CPU load reach the alert load',
          activityDate: load.date.toString(),
        });
        this.serverMachinesLoad[load.id].isOverLoaded = true;
        this.serverMachinesLoad[load.id].overLoadCount += 1;
        this.serverMachinesLoad[load.id].overLoadedStart = load.date;
      }
    }
  }

  getOverLoadMilleSeconds(date1: Date, date2: Date): number {
    const difference = new Date(date1).getTime() - new Date(date2).getTime();
    return difference;
  }

  getHumanReadableTimeDifference(time: number): string {
    let x = time / 1000;
    const seconds = x % 60;
    x /= 60;
    const minutes = x % 60;
    x /= 60;
    const hours = x % 24;
    x /= 24;
    const days = x;
    let miniutesString = '';

    if (!isNaN(days) && Math.floor(days) > 0) {
      miniutesString += `${days.toFixed(0)}d`;
    }
    if (!isNaN(hours) && Math.floor(hours) > 0) {
      miniutesString += `${hours.toFixed(0)}h`;
    }
    if (!isNaN(minutes) && Math.floor(minutes) > 0) {
      miniutesString += `${minutes.toFixed(0)}m`;
    }
    if (!isNaN(seconds) && Math.floor(seconds) > 0) {
      miniutesString += `${seconds.toFixed(0)}s`;
    }

    return miniutesString;
  }
}
