import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MachineLoaderService } from '../services/machine-loader.service';
import { ActivityItem } from '../services/model.interface';

@Component({
  selector: 'cpu-monitor-activities',
  templateUrl: './activities.component.html',
  styleUrls: ['./activities.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ActivitiesComponent implements OnInit {
  activitiesList: ActivityItem[] = [];
  warningLimit = this.machineLoader.getWarningLimit();
  editWarningLimit = false;

  constructor(private machineLoader: MachineLoaderService) {}

  ngOnInit(): void {
    this.machineLoader.currentServerCpuInfo$.subscribe((_) => {
      this.activitiesList = this.machineLoader
        .getCurrentMachineExistingActivities()
        .reverse();
    });

    this.machineLoader.currentServerActivity$.subscribe((activity) => {
      this.activitiesList.unshift(activity);
      this.activitiesList.slice();
    });
  }

  setWarningTrigger() {
    this.machineLoader.setWarningLimit(this.warningLimit);
  }
}
