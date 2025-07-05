import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { Chart, registerables } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { SharedService } from '../shared/shared.service';

Chart.register(...registerables, ChartDataLabels);

@Component({
  selector: 'app-employees-chart',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './employees-chart.component.html',
  styleUrls: ['./employees-chart.component.css']
})
export class EmployeesChartComponent implements OnInit {
  chart: Chart<'pie', any> | undefined;

  config: any = {
    type: 'pie',
    data: {
      labels: [],
      datasets: [{
        label: 'Hours Worked',
        data: [],
        backgroundColor: [],
        borderColor: [
          'rgba(255, 255, 255, 1)'
        ],
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      layout: {
        padding: {
          top: 30,
          bottom: 30 
        }
      },
      plugins: {
        title: {
          display: true,
          text: 'Hours Worked by Employees',
          font: {
            size: 20
          },
          padding: {
            bottom: 20
          }
        },
        legend: {
          display: true,
          position: 'bottom',
          labels: {
            color: '#333'
          },
          padding: {
            top: 20
          }
        },
        tooltip: {
          callbacks: {
            label: function(context: any) {
              const label = context.label || '';
              const value = context.raw || 0;
              const total = context.chart.getDatasetMeta(0).total || 0;
              const percentage = ((value / total) * 100).toFixed(2);
              return `${label}: ${value} hours (${percentage}%)`;
            }
          }
        },
        datalabels: {
          color: '#fff',
          formatter: (value: number, context: any) => {
            const total = context.chart.getDatasetMeta(0).total || 0;
            const percentage = ((value / total) * 100).toFixed(2);
            return `${percentage}%`;
          },
          font: {
            weight: 'bold',
            size: 14
          },
          anchor: 'center',
          align: 'center' 
        }
      },
      animation: {
        duration: 1000,
        easing: 'easeOutBounce'
      }
    }
  };

  constructor(private sharedService: SharedService, @Inject(PLATFORM_ID) private platformId: Object) { }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.sharedService.data$.subscribe(data => {
        this.updateChartData(data);
      });
    }
  }

  private updateChartData(data: { name: string, totalTimeInHours: number }[]): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.config.data.labels = data.map(item => item.name);
    this.config.data.datasets[0].data = data.map(item => item.totalTimeInHours);
    

    this.config.data.datasets[0].backgroundColor = data.map(() => this.getRandomColor());

    if (this.chart) {
      this.chart.data.labels = this.config.data.labels;
      this.chart.data.datasets[0].data = this.config.data.datasets[0].data;
      this.chart.data.datasets[0].backgroundColor = this.config.data.datasets[0].backgroundColor;
      this.chart.update();
    } else {
      this.chart = new Chart('MyChart', this.config);
    }
  }

  private getRandomColor(): string {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgba(${r}, ${g}, ${b}, 0.9)`;
  }
}
