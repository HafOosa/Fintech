import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Activity {
  date: string;
  type: string;
  detail: string;
  amount: string;
  currency: string;
}

@Component({
  selector: 'app-latest-activities',
  standalone: true,
  imports: [CommonModule],
  templateUrl:'./latest-activities.component.html',
  styles: [`
    
  `]
})
export class LatestActivitiesComponent {
  tabs = ['ALL', 'BTC', 'ETH', 'XRP', 'XEM'];
  selectedTab = 'ALL';
  
  activities: Activity[] = [
    {
      date: '2024/12/19 10:57:46',
      type: 'Deposit Japanese Yen',
      detail: 'Deposited money to the wallet', // Added this
      amount: '+10,000',
      currency: 'JPY'
    },
    {
      date: '2024/12/19 10:57:46',
      type: 'Bought Bitcoin',
      detail: 'Purchased BTC through the exchange', // Added this
      amount: '+0.00018147',
      currency: 'BTC'
    },
  ];
  
}
