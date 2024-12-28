import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import Chart from 'chart.js/auto';
import 'chartjs-chart-financial';

@Component({
  selector: 'app-crypto-chart',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="chart-container">
      <div class="chart-header">
        <div class="chart-controls">
          <div class="currency-selector">
            <span class="selected-currency">BTC/JPY</span>
            <span class="price">¥721,882</span>
            <span class="change negative">-4.66%</span>
          </div>
          <div class="chart-metrics">
            <div class="metric">
              <span class="label">High</span>
              <span class="value">¥725,974</span>
            </div>
            <div class="metric">
              <span class="label">Low</span>
              <span class="value">¥718,000</span>
            </div>
            <div class="metric">
              <span class="label">24h Volume</span>
              <span class="value">677.7 BTC</span>
            </div>
          </div>
        </div>
        <div class="time-controls">
          <button class="time-button" *ngFor="let period of timePeriods" 
                  [class.active]="selectedPeriod === period"
                  (click)="selectPeriod(period)">
            {{period}}
          </button>
        </div>
      </div>
      <canvas id="cryptoChart"></canvas>
    </div>
  `,
  styleUrls: ['./crypto-chart.component.scss'],
})
export class CryptoChartComponent implements OnInit, AfterViewInit {
  timePeriods = ['1h', '4h', '1d', '1w', '1m'];
  selectedPeriod = '1d';
  chart: any;

  ngOnInit() {
    this.selectedPeriod = '1d';
  }

  ngAfterViewInit() {
    this.createChart();
  }

  selectPeriod(period: string) {
    this.selectedPeriod = period;
    // Add logic to update the chart based on the selected time period
    console.log(`Selected Period: ${period}`);
  }

  private createChart() {
    const canvas = document.getElementById('cryptoChart') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      this.chart = new Chart(ctx, {
        type: 'candlestick',
        data: {
          datasets: [
            {
              label: 'BTC/JPY',
              data: this.generateDummyData(),
              borderColor: '#00c853',
              backgroundColor: '#ff3d00',
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              display: true,
            },
          },
          scales: {
            x: {
              type: 'time',
              time: {
                unit: 'hour',
              },
            },
            y: {
              position: 'right',
              ticks: {
                callback: (value) => `¥${value}`,
              },
            },
          },
        },
      });
    }
  }

  private generateDummyData() {
    const now = Date.now();
    return Array.from({ length: 24 }, (_, i) => ({
      x: new Date(now - (24 - i) * 3600000),
      o: Math.random() * 1000 + 700000,
      h: Math.random() * 1000 + 701000,
      l: Math.random() * 1000 + 699000,
      c: Math.random() * 1000 + 700000,
    }));
  }
}
