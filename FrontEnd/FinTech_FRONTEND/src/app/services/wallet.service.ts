import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WalletService {
  private apiUrl = 'http://127.0.0.1:8000/wallets';

  constructor(private http: HttpClient) {}

  getWallet(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  createWallet(): Observable<any> {
    return this.http.post<any>(this.apiUrl, {});
  }

  depositFunds(amount: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/deposit`, { amount });
  }

  withdrawFunds(amount: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/withdraw`, { amount });
  }

  getTransactionHistory(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/history`);
  }
}




export class WalletServiceCrypto {
  private apiUrl = 'http://127.0.0.1:5000'; // Flask API URL

  constructor(private http: HttpClient) {}

  createWallet(): Observable<any> {
    return this.http.post(`${this.apiUrl}/wallet/create`, {});
  }

  getBalance(address: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/wallet/balance`, { params: { address } });
  }

  importWallet(encryptedKey: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/wallet/import`, { private_key: encryptedKey });
  }
}