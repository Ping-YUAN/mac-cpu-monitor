import { Component, Input, ViewEncapsulation } from '@angular/core';
import { ActivityType } from '../services/model.interface';

@Component({
  selector: 'cpu-monitor-activities-item',
  templateUrl: './activities-item.component.html',
  styleUrls: ['./activities-item.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ActivitiesItemComponent {
  activityIcon = '';
  @Input() activityDescription = '';

  private _activityType!: ActivityType;
  @Input()
  set activityType(type: ActivityType) {
    this._activityType = type;

    switch (type) {
      case ActivityType.SUCCESS:
        this.activityIcon = 'check_circle';
        break;
      case ActivityType.WARNING:
        this.activityIcon = 'warning';
        break;
      default:
        this.activityIcon = 'info';
    }
  }

  get activityType(): ActivityType {
    return this._activityType;
  }
  @Input() activityDate = '';
}
