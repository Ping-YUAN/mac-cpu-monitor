import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';

import {
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexTitleSubtitle,
  ApexStroke,
  ApexGrid,
  ChartComponent,
  ApexYAxis,
} from 'ng-apexcharts';
import { map } from 'rxjs';
import { MachineLoaderService } from '../services/machine-loader.service';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  dataLabels: ApexDataLabels;
  grid: ApexGrid;
  colors: string[];
  stroke: ApexStroke;
  title: ApexTitleSubtitle;
  annotations: any;
};

@Component({
  selector: 'cpu-monitor-load-chart',
  templateUrl: './load-chart.component.html',
  styleUrls: ['./load-chart.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class LoadChartComponent implements OnInit {
  @ViewChild('chart') chart!: ChartComponent;
  chartOptions: ChartOptions = {
    series: [],
    chart: {
      type: 'line',
      zoom: {
        enabled: false,
      },
      animations: {
        enabled: true,
        easing: 'linear',
        dynamicAnimation: {
          speed: 1000,
        },
      },
      toolbar: {
        show: false,
      },
    },
    colors: ['#784aa5'],
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: 'straight',
    },
    title: {
      text: 'Load in past 10 minutes',
      align: 'left',
      style: {
        fontSize: '24px',
        fontFamily: "Roboto, 'Helvetica Neue', sans-serif",
      },
    },
    grid: {
      row: {
        colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
        opacity: 0.5,
      },
    },
    xaxis: {},
    yaxis: {
      title: {
        text: 'CPU Load',
        style: {
          fontSize: '16px',
        },
      },
      min: 0,
      max: 16,
    },

    annotations: {
      yaxis: [
        {
          y: 16,
          borderColor: '#FF0000',
          label: {
            borderColor: '#00E396',
            style: {
              color: '#fff',
              background: '#00E396',
            },
          },
        },
        {
          y: 12,
          y2: 16,
          borderColor: '#000',
          fillColor: '#FEB019',
          opacity: 0.2,
          label: {
            borderColor: 'transparent',
            style: {
              fontSize: '16px',
              color: '#333',
              background: 'transparent',
            },
            text: '',
          },
        },
      ],
    },
  };

  constructor(
    private machineServer: MachineLoaderService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.machineServer.currentServerCpuInfo$.subscribe((info) => {
      this.chartOptions.yaxis.max = info.cpuCount;
      this.chartOptions.annotations.yaxis[0].y = info.cpuCount;
      this.chartOptions.annotations.yaxis[1].y =
        info.cpuCount * this.machineServer.getWarningLimit();
      this.chartOptions.annotations.yaxis[1].y2 = info.cpuCount;
    });

    this.machineServer.warningTriggerLoad$.subscribe((warningLimt) => {
      this.chartOptions.annotations.yaxis[1] = {
        ...this.chartOptions.annotations.yaxis[1],
        ...{
          y: this.chartOptions.annotations.yaxis[0].y * Number(warningLimt),
        },
      }; //.y =
      this.chartOptions.annotations.yaxis =
        this.chartOptions.annotations.yaxis.slice();
      this.chartOptions.annotations = { ...this.chartOptions.annotations };
      this.cdr.markForCheck();
    });

    this.machineServer.currentServerLoads$
      .pipe(
        map((items) =>
          items.map((item) => {
            const date = new Date(item.date);
            return {
              load: item.load,
              time: `${date.getHours()}:${date.getMinutes()}: ${date.getSeconds()}`,
            };
          })
        ),
        map((data) => {
          return {
            series: [
              {
                name: 'CPU Load',
                data: data.map((item) => item.load),
              },
            ],
            xaxis: {
              title: {
                text: 'Time',
                style: {
                  fontSize: '16px',
                },
              },
              categories: data.map((item) => item.time),
            },
          };
        })
      )
      .subscribe((data) => {
        this.chartOptions.series = data.series;
        this.chartOptions.xaxis = data.xaxis;
      });
  }
}
