import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';


interface DashboardData {
  accountBalance: number;
  cryptoBalances: Array<{
    name: string;
    symbol: string;
    balance: number;
  }>;
  recentTransactions: Array<{
    date: string;
    type: string;
    amount: number;
    currency: string;
    status: string;
  }>;
  lineChartData: Array<{
    name: string;
    series: Array<{
      name: string;
      value: number;
    }>;
  }>;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private dataUrl = '/data.json';
  private apiUrl = 'http://127.0.0.1:8000/wallets';
  private backendUrl = 'http://127.0.0.1:8000';
  private transactionUrl = 'http://127.0.0.1:8000/transactions'; 

  constructor(private http: HttpClient) {}

  getDashboardData(): Observable<DashboardData> {
    return this.http.get<DashboardData>(this.dataUrl);
  }

  getHistoricalChartData(): Observable<any[]> {
    return this.http.get<any[]>('http://127.0.0.1:8080/api/historical').pipe(
      tap(data => console.log('Raw data from API:', data)));
  }

  getWallet(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  getTransactionHistory(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/history`);
  }

  checkCryptoWalletExists() {
    return this.http.get<any>(`${this.backendUrl}/madt`, {});
  }

  // Recuperation du balance de l'adresse
  getBalance(address: string): Observable<any> {
    return this.http.get<any>(`${this.backendUrl}/balance/${address}`);
  }


  // Ajouter une transaction
  addTransaction(transactionData: any): Observable<any> {
    return this.http.post<any>(`${this.transactionUrl}`, transactionData);
  }

}
