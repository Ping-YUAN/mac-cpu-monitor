import { Component, Input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'cpu-monitor-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class BannerComponent {
  private _bannerText = '';
  @Input()
  set bannerText(text: string | null) {
    if (text) {
      this._bannerText = text;
    } else {
      this._bannerText = '0';
    }
  }
  get bannerText(): string {
    return this._bannerText;
  }
  @Input() bannerName = '';
  @Input() bannerTooltip = '';
}
