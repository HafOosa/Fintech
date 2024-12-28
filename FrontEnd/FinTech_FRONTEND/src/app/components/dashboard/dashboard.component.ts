import { HeaderComponent } from '../header/header.component';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from "../side-bar/side-bar.component";
import { CryptoCardComponent } from '../crypto-card/crypto-card.component';
import { LatestActivitiesComponent } from '../latest-activities/latest-activities.component';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule,CryptoCardComponent,LatestActivitiesComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush

})
export class DashboardComponent implements OnInit {
  // User account details
  accountBalance = 0;
  cryptoBalances = [
    { name: 'Bitcoin', balance: 0.5, symbol: 'BTC' },
    { name: 'Ethereum', balance: 2.3, symbol: 'ETH' }
  ];

  // Recent transactions
  recentTransactions = [
    { 
      date: new Date(), 
      type: 'Transfer', 
      amount: 100, 
      currency: 'USD',
      status: 'Completed' 
    }
  ];

  constructor() {}

  ngOnInit(): void {
    // Fetch user data, account balances, etc.
  }

  // Method to navigate to detailed transactions
  viewAllTransactions(): void {
    // Navigation logic
  }
}