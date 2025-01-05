import { Component, OnInit } from '@angular/core';
import {  NgxChartsModule } from '@swimlane/ngx-charts';
import { DashboardService } from './dashboard.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { TransactionService } from '@services/transaction-normale.service';
import { CryptoChartComponent } from "../crypto-chart/crypto-chart.component";
import { NewsComponent } from "../news/news.component";
import { CreditCardComponent } from '@components/creditcard/creditcard.component';
import { CryptoTableComponent } from './CryptoTableComponent.component';
import { DynamicChartComponent } from '../dynamic-chart/dynamic-chart.component';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CreditCardComponent,
    NgxChartsModule,
    CommonModule,
    NewsComponent,
    CryptoTableComponent,
    DynamicChartComponent

],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {




  userId!: string;
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
  normalTransactions: any[] = [];
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

  constructor(private dashboardService: DashboardService, private activatedRoute: ActivatedRoute, private transactionService: TransactionService,) {}

  ngOnInit(): void {
    this.userId = this.activatedRoute.snapshot.paramMap.get('userId') || localStorage.getItem('user_id') || '';

  if (!this.userId) {
    console.error('User ID not found');
    // Gérer le cas où l'ID est manquant (redirection ou affichage d'un message d'erreur)
  } else {
    console.log('User ID:', this.userId);
    console.log('User ID from URL:', this.activatedRoute.snapshot.paramMap.get('userId'));
    console.log('User ID from localStorage:', localStorage.getItem('user_id'));
    this.loadDashboardData();
    this.loadNormalTransactions();
  }
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

  // Charger les transactions normales
  private loadNormalTransactions(): void {
    this.transactionService.getUserTransactions(0, 10).subscribe(
      (response) => {
        this.normalTransactions = response.transactions;
      },
      (error) => {
        console.error('Error fetching normal transactions:', error);
        this.normalTransactions = []; // Assurez-vous que la variable est bien initialisée
      }
    );
  }

  // Charger les transactions récentes (méthode existante ou à définir)
  private loadRecentTransactions(): void {
    // Exemple pour charger des transactions récentes si nécessaire
  }

  viewAllTransactions(): void {
    console.log('View All Transactions clicked');
  }
  profiles = [
    { name: 'Michael Jordan', image: 'assets/profiles/michael.png' },
    { name: 'Edelyn Sandra', image: 'assets/profiles/edelyn.png' },
    { name: 'Ahmed Azhar', image: 'assets/profiles/ahmed.png' },
    { name: 'Celyn Gustav', image: 'assets/profiles/celyn.png' },
  ];

  cardNumber = '5995 7474 1103 7513'; // Example card number
  cardType = 'visa';
  currentCardBackground = Math.floor(Math.random() * 25 + 1);

}
