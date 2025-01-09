import { Component, OnInit} from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-crypto-converter',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './crypto-converter.component.html',
  styleUrl: './crypto-converter.component.scss'
})
export class CryptoConverterComponent implements OnInit {
  amount: number = 0;
  fromCurrency: string = 'USD';
  toCurrency: string = 'BTC';
  fromCurrencyName: string = 'USD - US Dollar';
  resultMessage: string = '';
  userId: string | null = null;

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('userId');
    console.log('User ID in CryptoConverter:', this.userId);
  }

  updateFromCurrencyName() {
    const currencyNames: { [key: string]: string } = {
      USD: 'USD - US Dollar',
      EUR: 'EUR - Euro',
      GBP: 'GBP - British Pound',
      CAD: 'CAD - Canadian Dollar',
      AUD: 'AUD - Australian Dollar',
      JPY: 'JPY - Japanese Yen',
      INR: 'INR - India Rupee',
      NZD: 'NZD - New Zealand Dollar',
      CHF: 'CHF - Swiss Franc',
      ZAR: 'ZAR - South African Rand',
      BGN: 'BGN - Bulgarian Lev',
      SGD: 'SGD - Singapore Dollar',
      HKD: 'HKD - Hong Kong Dollar',
      SEK: 'SEK - Swedish Krona',
      THB: 'THB - Thai Baht',
      HUF: 'HUF - Hungarian Forint',
      CNY: 'CNY - Chinese Yuan Renminbi',
      NOK: 'NOK - Norwegian Krone',
      MXN: 'MXN - Mexican Peso',
      GHS: 'GHS - Ghanians Cedi',
      NGN: 'NGN - Nigerian Naira'
    };
  
    this.fromCurrencyName = currencyNames[this.fromCurrency] || this.fromCurrency;
  }

  convertCurrency() {
    const apiKey = '';//685419b6bedfb725bb6af07ed3dd6fef8f20a83f05c066d1eb20a10c563c7801
    const apiUrl = `https://min-api.cryptocompare.com/data/price?fsym=${this.toCurrency}&tsyms=${this.fromCurrency}&api_key=${apiKey}`;

    this.http.get(apiUrl).subscribe(
      (data: any) => {
        const rate = data[this.fromCurrency];
        const convertedAmount = (this.amount / rate).toFixed(8);
        this.resultMessage = `Converted ${this.amount} ${this.fromCurrency} ≈ ${convertedAmount} ${this.toCurrency}`;
        setTimeout(() => {
          this.resultMessage = '';
        }, 7000);
      },
      
      (error) => {
        this.resultMessage = 'Error: Unable to fetch exchange rate.';
        console.error(error);

        setTimeout(() => {
          this.resultMessage = '';
        }, 7000);
      }
    );
  }
}
