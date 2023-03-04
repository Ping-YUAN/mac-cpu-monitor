import { Component, ViewEncapsulation } from '@angular/core';
import { MachineLoaderService } from './services/machine-loader.service';

@Component({
  selector: 'cpu-monitor-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent {
  docPath = '/assets/cpu-monitor.md';
  showHelp = false;

  constructor(private machineLoader: MachineLoaderService) {
    this.machineLoader.load();
  }

  onShowHelp($event: boolean) {
    this.showHelp = $event;
  }
}
