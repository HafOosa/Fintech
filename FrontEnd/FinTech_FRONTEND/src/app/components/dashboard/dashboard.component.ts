import { Component, OnInit } from '@angular/core';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { DashboardService } from './dashboard.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    NgxChartsModule,
    CommonModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  accountBalance: number = 0;
  cryptoBalances: Array<{
    name: string;
    symbol: string;
    balance: number;
  }> = [];
  recentTransactions: Array<{
    date: string;
    type: string;
    amount: number;
    currency: string;
    status: string;
  }> = [];
  lineChartData: any[] = [];

  // Chart options
  view: [number, number] = [800, 400];
  legend: boolean = true;
  animations: boolean = true;
  xAxis: boolean = true;
  yAxis: boolean = true;
  showYAxisLabel: boolean = true;
  showXAxisLabel: boolean = true;
  xAxisLabel: string = 'Time';
  yAxisLabel: string = 'Price ($US)';
  timeline: boolean = true;

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  private loadDashboardData(): void {
    this.dashboardService.getDashboardData().subscribe({
      next: (data) => {
        this.accountBalance = data.accountBalance;
        this.cryptoBalances = data.cryptoBalances;
        this.recentTransactions = data.recentTransactions;
        this.lineChartData = data.lineChartData;
      },
      error: (error) => {
        console.error('Error loading dashboard data:', error);
      }
    });
  }

  viewAllTransactions(): void {
    console.log('View All Transactions clicked');
  }
}