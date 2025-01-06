import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'crypto-table',
  standalone: true,
  imports: [CommonModule],
  template: `
    <table class="crypto-table">
      <thead  >
        <tr>
          <th style=" color:rgb(235, 180, 30);">Crypto</th>
          <th style=" color:rgb(235, 180, 30);">Price</th>
          <th style=" color:rgb(235, 180, 30);">24h Change</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let crypto of cryptos">
          <td>{{ crypto.name }}</td>
          <td>{{ crypto.price | currency:'USD' }}</td>
          <td [class.positive]="crypto.change >= 0" [class.negative]="crypto.change < 0">
            {{ crypto.change }}%
          </td>
        </tr>
      </tbody>
    </table>
  `,
  styleUrls: ['./dashboard.component.scss']
})
export class CryptoTableComponent implements OnInit {
  cryptos: { name: string; price: number; change: number }[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchCryptoData();
  }

  fetchCryptoData() {
    const cryptoIds = ['bitcoin', 'ethereum', 'ripple', 'litecoin'];
    const url = `https://api.coingecko.com/api/v3/simple/price?ids=${cryptoIds.join(
      ','
    )}&vs_currencies=usd&include_24hr_change=true`;

    this.http.get<any>(url).subscribe((data) => {
      this.cryptos = cryptoIds.map((id) => ({
        name: id.charAt(0).toUpperCase() + id.slice(1),
        price: data[id].usd,
        change: data[id].usd_24h_change.toFixed(2),
      }));
    });
  }
}
