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

  constructor(private http: HttpClient) {}

  getDashboardData(): Observable<DashboardData> {
    return this.http.get<DashboardData>(this.dataUrl);
  }

  getHistoricalChartData(): Observable<any[]> {
    return this.http.get<any[]>('http://127.0.0.1:8080/api/historical').pipe(
      tap(data => console.log('Raw data from API:', data)));
  }
}
