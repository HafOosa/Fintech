import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WalletService {
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
