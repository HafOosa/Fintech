//user-analyse.component.ts
import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserAnalyseService } from '../../services/user-analyse.service';
import { Chart } from 'chart.js/auto';
import { DecimalPipe, NgIf, CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-analysis',
  standalone: true,
  templateUrl: './user-analyse.component.html',
  styleUrls: ['./user-analyse.component.scss'],
  imports: [DecimalPipe, NgIf, CommonModule],
})
export class UserAnalysisComponent implements OnInit, AfterViewInit {
  @ViewChild('transactionsChart') chartCanvas!: ElementRef;
  @ViewChild('secondChart') secondChartCanvas!: ElementRef;

  userId: number = 0;
  totalBalance: number = 0;
  transactions: { types: string[]; counts: number[] } | null = null;
  balanceHistory: { dates: string[]; balances: number[] } | null = null;
  error: string | null = null;
  private chart: Chart | null = null;
  private secondChart: Chart | null = null;

  constructor(
    private route: ActivatedRoute,
    private userAnalyseService: UserAnalyseService
  ) {}

  ngOnInit(): void {
    this.route.parent?.paramMap.subscribe(params => {
      const userId = params.get('userId');
      if (userId) {
        this.userId = Number(userId);
        this.loadUserData();
      }
    });
  }

  ngAfterViewInit(): void {
    if (this.transactions) {
      this.createOrUpdateCharts();
    }
  }

  private loadUserData(): void {
    const token = localStorage.getItem('token');
    if (!token) {
      this.error = 'Token non disponible';
      console.error('Token non disponible');
      return;
    }

    this.userAnalyseService.getUserAnalysis(this.userId, token).subscribe({
      next: (data) => {
        this.totalBalance = data.total_balance;
        this.transactions = data.transactions;
        this.balanceHistory = data.balance_history;
        this.createOrUpdateCharts();
      },
      error: (error) => {
        this.error = 'Erreur lors de la récupération des données utilisateur';
        console.error('API Error:', error);
      }
    });
  }

  private createOrUpdateCharts(): void {
    if (!this.transactions || !this.chartCanvas || !this.secondChartCanvas) return;

    if (this.chart) this.chart.destroy();
    if (this.secondChart) this.secondChart.destroy();

    const ctx = this.chartCanvas.nativeElement.getContext('2d');
    const ctx2 = this.secondChartCanvas.nativeElement.getContext('2d');

    // Premier graphique : Line Chart pour les types de transactions
    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: this.transactions.types,
        datasets: [{
          label: 'Number of Transactions',
          data: this.transactions.counts,
          backgroundColor: 'rgba(75, 192, 192, 0.2)', // Couleur de fond
          borderColor: 'rgba(75, 192, 192, 1)', // Couleur de la courbe
          borderWidth: 2,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: {
              color: '#ffffff'
            }
          }
        },
        scales: {
          x: {
            ticks: {
              color: '#ffffff'
            },
            grid: {
              color: 'rgba(255, 255, 255, 0.1)'
            }
          },
          y: {
            beginAtZero: true,
            ticks: {
              color: '#ffffff'
            },
            grid: {
              color: 'rgba(255, 255, 255, 0.1)'
            }
          }
        }
      }
    });

    // Deuxième graphique : Line Chart pour l'évolution des balances
    this.secondChart = new Chart(ctx2, {
      type: 'line',
      data: {
        labels: this.balanceHistory?.dates,
        datasets: [{
          label: 'Balance Over Time',
          data: this.balanceHistory ? this.balanceHistory.balances : [],
          backgroundColor: 'rgba(224, 230, 236, 0.81)', // Couleur de fond
          borderColor: 'rgba(127, 175, 223, 0.81)', // Couleur de la courbe
          borderWidth: 2,
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            labels: {
              color: '#ffffff'
            }
          }
        },
        scales: {
          x: {
            ticks: {
              color: '#ffffff'
            },
            grid: {
              color: 'rgba(255, 255, 255, 0.1)'
            }
          },
          y: {
            beginAtZero: true,
            ticks: {
              color: '#ffffff'
            },
            grid: {
              color: 'rgba(255, 255, 255, 0.1)'
            }
          }
        }
      }
    });
  }

}
