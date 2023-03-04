import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { ServerClientInfo } from '@cpu-monitor-types';
import { Observable } from 'rxjs';
import { MachineLoaderService } from '../services/machine-loader.service';
import { ConnectionStatus } from '../services/model.interface';

@Component({
  selector: 'cpu-monitor-nav',
  templateUrl: './monitor-nav.component.html',
  styleUrls: ['./monitor-nav.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class MonitorNavComponent implements OnInit {
  connectedStatus$!: Observable<ConnectionStatus>;
  serverList$!: Observable<ServerClientInfo[]>;
  selectedServerId = '';

  showHelp = false;
  @Output() showHelpOutput = new EventEmitter<boolean>();

  constructor(private machineLoaderService: MachineLoaderService) {}

  ngOnInit(): void {
    this.serverList$ = this.machineLoaderService.serverMachines$;
    this.connectedStatus$ = this.machineLoaderService.connectionStatus$;
    this.serverList$.subscribe((servers) => {
      this.selectedServerId = servers[0].id;
    });
  }

  onSelectionChange(id: string) {
    this.machineLoaderService.setCurrentMachine(id);
  }

  onHelpClicked(show: boolean) {
    this.showHelp = show;
    this.showHelpOutput.emit(this.showHelp);
  }
}
