import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, ChartConfiguration, registerables } from 'chart.js';

@Component({
  selector: 'app-admin-overview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-overveiw.component.html',
  styleUrls: ['./admin-overveiw.component.scss']
})
export class AdminOverveiwComponent implements OnInit {
  @ViewChild('lineChart', { static: true }) lineChart!: ElementRef<HTMLCanvasElement>;
  @ViewChild('pieChart', { static: true }) pieChart!: ElementRef<HTMLCanvasElement>;

  constructor() {
    // Register Chart.js components
    Chart.register(...registerables);
  }

  ngOnInit(): void {
    this.createLineChart();
    this.createPieChart();
  }

  createLineChart() {
    const ctx = this.lineChart.nativeElement.getContext('2d');
    if (ctx) {
      new Chart(ctx, {
        type: 'line',
        data: {
          labels: ['January', 'February', 'March', 'April', 'May'],
          datasets: [
            {
              label: 'Crypto Transactions ($)',
              data: [1000, 1200, 1400, 1800, 1600],
              borderColor: '#4CAF50',
              borderWidth: 2,
              fill: false,
            },
            {
              label: 'Traditional Transactions ($)',
              data: [1500, 1700, 1900, 2200, 2100],
              borderColor: '#1E90FF',
              borderWidth: 2,
              fill: false,
            },
          ],
        },
        options: {
          responsive: true,
        },
      });
    }
  }

  createPieChart() {
    const ctx = this.pieChart.nativeElement.getContext('2d');
    if (ctx) {
      new Chart(ctx, {
        type: 'pie',
        data: {
          labels: ['Traditional Wallets', 'Crypto Wallets'],
          datasets: [
            {
              data: [60, 40],
              backgroundColor: ['#FFD700', '#8A2BE2'],
            },
          ],
        },
        options: {
          responsive: true,
        },
      });
    }
  }
}
