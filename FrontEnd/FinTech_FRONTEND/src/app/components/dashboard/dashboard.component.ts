import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {  NgxChartsModule } from '@swimlane/ngx-charts';
import { DashboardService } from './dashboard.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { CryptoChartComponent } from "../crypto-chart/crypto-chart.component";
import { NewsComponent } from "../news/news.component";
import { CreditCardComponent } from '@components/creditcard/creditcard.component';
import { CryptoTableComponent } from './CryptoTableComponent.component';
import { DynamicChartComponent } from '../dynamic-chart/dynamic-chart.component';
import { WalletService } from '@services/wallet.service';
import { TransactionService } from '@services/transaction-normale.service';
import { ReactiveFormsModule } from '@angular/forms';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CreditCardComponent,
    NgxChartsModule,
    CommonModule,
    NewsComponent,
    CryptoTableComponent,
    DynamicChartComponent

],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
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


  // Amount/transactions normale Section:
  balance: any | null = null;
  wallet : any = { balance: 0 };
  transactions: any[] = [];
  totalTransferOut: number = 0;

  //Crypto-wallets Section:
  address: string | null = null;
  cryptowallet: any = null;
  hasCryptoWallet: boolean = false;

  //transactions :
  showTransactionModal: boolean = false; // Contrôle la visibilité du modal
  transactionForm: FormGroup; // Formulaire de transaction
  transactionTypes: string[] = ['Payment', 'Bank Transfer']; // Types de transaction disponibles
  transactionSuccess: boolean = false; // Indique si la transaction a réussi
  transactionError: boolean = false; // Indique si une erreur s'est produite


  constructor(private dashboardService: DashboardService, private activatedRoute: ActivatedRoute, private fb: FormBuilder, private transactionService: TransactionService, private walletService: WalletService) {
       // Initialiser le formulaire
       this.transactionForm = this.fb.group({
        transaction_type: ['', Validators.required],
        montant: ['', [Validators.required, Validators.min(1)]],
        recipient: ['', Validators.required],
        destination_address: ['', Validators.required]
    });
  }

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
    this.loadWallet();
    this.walletService.totalTransferOut$.subscribe((total) => {
      this.totalTransferOut = total;
    });
    this.walletService.calculateTotalTransferOut();
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

  loadWallet() {
    this.dashboardService.getWallet().subscribe({
      next: (data) => {
        console.log('Wallet data:', data); // Vérifiez la réponse ici
        this.wallet = data;
      },
      error: (err) => console.error('Failed to load wallet', err),
    });
  }

  


  //CRypto wallets:
  checkWalletExists() {
    this.dashboardService.checkCryptoWalletExists().subscribe({
      next: (wallet) => {
        this.hasCryptoWallet = true;
        this.cryptowallet = wallet;
  
        if (wallet.wallet_id) {
          this.getBalance(wallet.wallet_id); // Récupérer la balance après avoir obtenu l'adresse
        } else {
          console.error('Wallet ID is undefined');
        }
      },
      error: (err) => {
        if (err.status === 404) {
          this.hasCryptoWallet = false; // Pas de portefeuille trouvé
          this.balance = 'No wallet found';
        } else {
          console.error('Error checking wallet existence:', err);
        }
      }
    });
  }

  getBalance(address: string) {
    if (!address) {
      console.error('Address is undefined or empty');
      this.balance = 'Failed to fetch balance';
      return;
    }
  
    this.dashboardService.getBalance(address).subscribe({
      next: (data) => {
        this.balance = data.balance; // Met à jour la balance
      },
      error: (err) => {
        console.error('Error fetching balance:', err);
        this.balance = 'Failed to fetch balance';
      },
    });
  }


  //transactions :
  openTransactionModal(): void {
    this.showTransactionModal = true;
  }


  closeTransactionModal() {
    this.showTransactionModal = false;
    this.transactionForm.reset();
    this.transactionSuccess = false;
    this.transactionError = false;
  }

  onSubmit(): void {
    if (this.transactionForm.valid) {
      const transactionData = this.transactionForm.value;

      this.transactionService.addTransaction(transactionData).subscribe({
        next: (response) => {
          console.log('Transaction Successful:', response);
          this.transactionSuccess = true;
          // Recharger les transactions après une soumission réussie
          this.loadNormalTransactions();
          setTimeout(() => (this.transactionSuccess = false), 3000);
          this.closeTransactionModal();
        },
        error: (error) => {
          console.error('Transaction Failed:', error);
          this.transactionError = true;
          setTimeout(() => (this.transactionError = false), 3000);
        }
      });
    } else {
      console.error('Form is invalid');
    }
  }

}
