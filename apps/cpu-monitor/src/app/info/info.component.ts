import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { MachineLoaderService } from '../services/machine-loader.service';

@Component({
  selector: 'cpu-monitor-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class InfoComponent implements OnInit {
  currentServerCpuCount$: Observable<string> = of('');
  currentServerLatestLod$: Observable<string> = of('');

  cpuCount = 1;
  currentCpuLoad = 0;
  loadIndex = '';

  get cpuOverLoadedCount() {
    return this.machineLoad.getCurrentMachineCpuOverLoadedCount().toString();
  }
  get cpuOverLoadMinues() {
    return this.machineLoad.getCurrentMachineCpuOverLoadedMinutes();
  }

  constructor(private machineLoad: MachineLoaderService) {}

  ngOnInit(): void {
    this.currentServerCpuCount$ = this.machineLoad.currentServerCpuInfo$.pipe(
      map((info) => {
        this.cpuCount = info.cpuCount;
        return info.cpuCount.toString();
      })
    );

    this.currentServerLatestLod$ =
      this.machineLoad.currentServerLatestLoad$.pipe(
        map((load) => {
          this.currentCpuLoad = load.load;
          this.normalizeCPULoad();
          return load.load.toFixed(1);
        })
      );
  }

  normalizeCPULoad() {
    if (!isNaN(this.cpuCount)) {
      this.loadIndex =
        Math.floor((this.currentCpuLoad / this.cpuCount) * 100).toString() +
        '%';
    } else {
      this.loadIndex = '0';
    }
  }
}
