import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'boxs',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="total-balance">
      <h2>Bitcoin Price</h2>
      <p class="balance">{{ bitcoinPrice | currency }}</p>
    </div>
    <div class="total-balance">
      <h2>24h Change</h2>
      <p class="balance">{{ bitcoinChange }}%</p>
    </div>
  `,
  styleUrls: ['./dashboard.component.scss']
})
export class boxsComponent implements OnInit {
  bitcoinPrice: number | null = null;
  bitcoinChange: number | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchBitcoinData();
  }

  fetchBitcoinData() {
    this.http
      .get<any>('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_24hr_change=true')
      .subscribe((data) => {
        this.bitcoinPrice = data.bitcoin.usd;
        this.bitcoinChange = data.bitcoin.usd_24h_change.toFixed(2);
      });
  }
}
