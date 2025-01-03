import { Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { WalletService } from '@services/wallet.service';

@Component({
  selector: 'app-wallet',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatInputModule,
    MatCardModule,
    MatIconModule,
  ],
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.scss'],
  providers: [WalletService],
})

export class WalletComponent implements OnInit {
  address: string | null = null;
  encryptedPrivateKey: string | null = null;
  balance: string | null = null;
  error: string | null = null;
  errorMessage: string | null = null;

  wallet: any = null;
  transactions: any[] = [];
  visibleTransactions: any[] = [];
  showSeeMore: boolean = false;
  showShowLess: boolean = false;

  showDepositModal = false;
  showWithdrawModal = false;
  amount: number = 0;
  successMessage: string | null = null;

  constructor(private walletService: WalletService) {}

  ngOnInit(): void {
    this.loadWallet();
    this.loadTransactionHistory();
  }

  loadWallet() {
    this.walletService.getWallet().subscribe({
      next: (data) => {
        this.wallet = data;
      },
      error: (err) => console.error('Failed to load wallet', err),
    });
  }

  createWallet() {
    this.walletService.createWallet().subscribe({
      next: (data) => {
        this.wallet = data;
        this.successMessage = 'Wallet created successfully!';
        setTimeout(() => (this.successMessage = null), 3000);
      },
      error: (err) => {
        if (err.status === 400) {
          this.errorMessage = 'Wallet already exists for this user.';
        } else {
          this.errorMessage = 'Failed to create wallet. Please try again.';
        }
        setTimeout(() => (this.errorMessage = null), 3000);
      },
    });
  }

  loadTransactionHistory() {
    if (!this.wallet) return;
    this.walletService.getTransactionHistory().subscribe({
      next: (data) => {
        this.transactions = data.map((transaction) => ({
          ...transaction,
          date: new Date(transaction.timestamp),
        }));
        this.updateVisibleTransactions();
      },
      error: (err) => console.error('Failed to load transaction history', err),
    });
  }

  updateVisibleTransactions() {
    this.visibleTransactions = this.transactions.slice(0, 4);
    this.showSeeMore = this.transactions.length > 4;
    this.showShowLess = false;
  }

  showAllTransactions() {
    this.visibleTransactions = [...this.transactions];
    this.showSeeMore = false;
    this.showShowLess = true;
  }

  showLessTransactions() {
    this.updateVisibleTransactions();
  }

  deposit() {
    if (this.amount > 0) {
      this.walletService.depositFunds(this.amount).subscribe({
        next: () => {
          this.loadWallet();
          this.loadTransactionHistory();
          this.successMessage = 'Deposit successful!';
          setTimeout(() => (this.successMessage = null), 3000);
          this.closeDepositModal();
        },
        error: (err) => console.error('Failed to deposit funds', err),
      });
    }
  }

  withdraw() {
    if (this.amount > 0) {
      this.walletService.withdrawFunds(this.amount).subscribe({
        next: () => {
          this.loadWallet();
          this.loadTransactionHistory();
          this.successMessage = 'Withdrawal successful!';
          setTimeout(() => (this.successMessage = null), 3000);
          this.closeWithdrawModal();
        },
        error: (err) => console.error('Failed to withdraw funds', err),
      });
    }
  }

  openDepositModal() {
    this.showDepositModal = true;
  }

  closeDepositModal() {
    this.showDepositModal = false;
    this.amount = 0;
  }

  openWithdrawModal() {
    this.showWithdrawModal = true;
  }

  closeWithdrawModal() {
    this.showWithdrawModal = false;
    this.amount = 0;
  }
}
