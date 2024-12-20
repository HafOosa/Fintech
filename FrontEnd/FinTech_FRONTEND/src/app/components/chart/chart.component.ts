import { Component, OnInit } from '@angular/core';
import { CryptoDataService } from '../../services/crypto-data.service';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent implements OnInit {
  constructor(private cryptoDataService: CryptoDataService) {}

  ngOnInit(): void {
    this.loadChart('bitcoin');
  }

  loadChart(cryptoId: string): void {
    this.cryptoDataService.getChart(cryptoId).subscribe((data) => {
      const prices = data.prices.map((entry: number[]) => entry[1]);
      const labels = data.prices.map((entry: number[]) => new Date(entry[0]).toLocaleDateString());

      new Chart('cryptoChart', {
        type: 'line',
        data: {
          labels: labels,
          datasets: [{
            label: `${cryptoId.toUpperCase()} Price`,
            data: prices,
            borderColor: '#42A5F5',
            backgroundColor: 'rgba(66, 165, 245, 0.5)'
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              display: true,
              position: 'top'
            }
          }
        }
      });
    });
  }
}
