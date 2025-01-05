import { Component, OnInit, OnDestroy, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { DynamicChartService } from './dynamic-chart.service';
import { ChartSeries, HistoricalData, LivePrice } from './chart.types';
import { Subject, interval } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-dynamic-chart',
  standalone: true,
  imports: [CommonModule, NgxChartsModule],
  templateUrl: './dynamic-chart.component.html',
  styleUrls: ['./dynamic-chart.component.scss']
})
export class DynamicChartComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  // Utilisation des signals pour la gestion d'état
  chartData = signal<ChartSeries[]>([{
    name: 'ETH/USDT',
    series: []
  }]);

  // Chart configuration
  view = signal<[number, number]>([700, 600]);
  customColors = signal([
    { name: 'ETH/USDT', value: '#2980b9' }
  ]);

  // Chart options
  readonly gradient = true;
  readonly showXAxis = true;
  readonly showYAxis = true;
  readonly showXAxisLabel = true;
  readonly showYAxisLabel = true;
  readonly xAxisLabel = '';
  readonly yAxisLabel = 'Price ($US)';
  readonly timeline = true;
  readonly autoScale = true;

  constructor(private chartService: DynamicChartService) {}

  ngOnInit(): void {
    this.loadHistoricalData();
    this.startLiveUpdates();
  }

  private loadHistoricalData(): void {
    this.chartService.getHistoricalData().subscribe({
      next: (data: HistoricalData[]) => {
        const series = data.map((item: HistoricalData) => ({
          name: new Date(item.date + ' ' + item.time).toISOString(),
          value: item.price
        }));

        this.chartData.set([{
          name: 'ETH/USDT',
          series
        }]);
      },
      error: (error: Error) => console.error('Error loading historical data:', error)
    });
  }

  private startLiveUpdates(): void {
    interval(60000)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.chartService.getLivePrice().subscribe({
          next: (data: LivePrice) => {
            if (data.price) {
              const currentData = this.chartData();
              const newSeries = [...currentData[0].series];

              newSeries.push({
                name: new Date().toISOString(),
                value: data.price
              });

              if (newSeries.length > 100) {
                newSeries.shift();
              }

              this.chartData.set([{
                name: 'ETH/USDT',
                series: newSeries
              }]);
            }
          },
          error: (error: Error) => console.error('Error loading live price:', error)
        });
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  viewAllTime(): void {
    this.chartService.getHistoricalData().subscribe(data => {
      this.updateChartData(data, 'year');
    });
  }

  viewYear(): void {
    const end = new Date(); // Date actuelle
    const start = new Date(); // Date il y a 1 an
    start.setFullYear(start.getFullYear() - 1);

    // Formatage des dates en chaîne de caractères (YYYY-MM-DD)
    const startDate = start.toISOString().split('T')[0];
    const endDate = end.toISOString().split('T')[0];

    // Appel à l'API pour récupérer les données dans cette plage
    this.chartService.getHistoricalData(startDate, endDate).subscribe(data => {
      this.updateChartData(data, 'month'); // Affiche les données mensuelles avec la courbe lissée
    });
  }


  viewWeek(): void {
    const start = new Date();
    start.setDate(start.getDate() - 7);
    this.chartService.getHistoricalData().subscribe(data => {
      const filtered = data.filter(item => new Date(item.date) >= start);
      this.updateChartData(filtered, 'day');
    });
  }

  view24h(): void {
    const end = new Date(); // Date actuelle
    const start = new Date(); // Date il y a 24 heures
    start.setHours(start.getHours() - 24);

    // Convertir les dates au format ISO compatible avec le backend
    const startDate = start.toISOString();
    const endDate = end.toISOString();

    // Appeler l'API avec les dates calculées
    this.chartService.getHistoricalData(startDate, endDate).subscribe(data => {
      this.updateChartData(data, 'hour'); // Mettre à jour les données avec un format spécifique pour 24h
    });
  }




  private updateChartData(data: HistoricalData[], timeUnit: 'year' | 'month' | 'day' | 'hour'): void {
    const series = data.map(item => ({
      name: timeUnit === 'hour' ? item.time : item.date, // Afficher uniquement l'heure pour 'hour'
      value: item.price
    }));

    this.chartData.set([{ name: 'ETH/USDT', series }]);
  }

}
