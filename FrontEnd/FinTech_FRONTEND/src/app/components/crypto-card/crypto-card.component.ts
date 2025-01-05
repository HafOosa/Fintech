import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

interface CryptoData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  currency: string;
}

@Component({
  selector: 'app-crypto-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="crypto-card">
      <div class="crypto-info">
        <div class="crypto-icon">
          <img src="assets/crypto-icons/{{data.symbol.toLowerCase()}}.svg" [alt]="data.symbol">
        </div>
        <div class="crypto-details">
          <span class="symbol">{{data.symbol}}</span>
          <span class="name">{{data.name}} </span>
        </div>
      </div>
      <div class="price-info">
        <div class="price">{{data.currency}}{{data.price.toLocaleString()}}</div>
        <div class="change" [class.positive]="data.change > 0" [class.negative]="data.change < 0">
          {{data.change > 0 ? '+' : ''}}{{data.change}}%
        </div>
      </div>
 
      <div class="chart-preview">
        <!-- Placeholder for mini chart -->
       
        <svg viewBox="0 0 100 30" class="mini-chart">
          <path [class.positive]="data.change > 0" [class.negative]="data.change < 0"
                d="M0 15 L10 10 L20 20 L30 15 L40 25 L50 20 L60 30 L70 25 L80 15 L90 20 L100 15"/>
        </svg>
      </div>
    </div>
  `,
  styles: [`
    .crypto-card {
      background: white;
      border-radius: 8px;
      padding: 1rem;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .crypto-info {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 1rem;
    }
    .crypto-icon img {
      width: 32px;
      height: 32px;
    }
    .crypto-details {
      display: flex;
      flex-direction: column;
    }
    .symbol {
      font-weight: bold;
      font-size: 1.1rem;
    }
    .name {
      color: #666;
      font-size: 0.9rem;
    }
    .price {
      font-size: 1.2rem;
      font-weight: bold;
    }
    .change {
      font-size: 0.9rem;
    }
    .positive {
      color: #00c853;
    }
    .negative {
      color: #ff3d00;
    }
    .mini-chart {
      width: 100%;
      height: 30px;
    }
    .mini-chart path {
      fill: none;
      stroke-width: 2;
      stroke: #666;
    }
    .mini-chart path.positive {
      stroke: #00c853;
    }
    .mini-chart path.negative {
      stroke: #ff3d00;
    }
  `]
})
export class CryptoCardComponent {
  @Input() data!: CryptoData;
}