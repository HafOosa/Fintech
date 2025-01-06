import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WalletService {
  private apiUrl = 'http://127.0.0.1:8000/wallets';
  private backendUrl = 'http://127.0.0.1:8000';

  constructor(private http: HttpClient) {}

  getWallet(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  createWallet(): Observable<any> {
    return this.http.post<any>(this.apiUrl, {});
  }

  depositFunds(amount: number, category: string): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/deposit`, { amount , category});
  }

  withdrawFunds(amount: number, category: string): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/withdraw`, { amount, category });
  }

  getTransactionHistory(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/history`);
  }

  transferFunds(recipientWalletAddress: string, amount: number): Observable<any> {
    return this.http.post<any[]>(`${this.apiUrl}/transfer`, {recipientWalletAddress, amount});
  }

  getBeneficiaries(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/beneficiaires`);
  }

  addBeneficiary(name: string, wallet_address: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/beneficiaires`, { name, wallet_address });
  }

  deleteBeneficiary(beneficiaryId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/beneficiaires/${beneficiaryId}`);
  }

//////////////////////////////////////////////////////////////////////////////////////



  // Create Crypto Wallet
  createCryptoWallet(): Observable<any> {
   this.http.post<any>(`${this.backendUrl}/create_wallet`, {});
    return this.http.post<any>(`${this.backendUrl}/create_wallet`, {});
  }
  getCryptoWallet(): Observable<any> {
    return this.http.get<any>(`${this.backendUrl}`);
  }
  // Get Balance
  getBalance(address: string): Observable<any> {
    return this.http.get<any>(`${this.backendUrl}/balance/${address}`);
  }

  // Mint Tokens
  mintTokens(to: string, amount: number): Observable<any> {
    return this.http.post<any>(`${this.backendUrl}/mint`, { to, amount });
  }

  // Transfer Tokens
  transferTokensFrom( toAddress: string, amount: number): Observable<any> {
      return this.http.post<any>(`${this.backendUrl}/transfer_from`, {

        to_address: toAddress,
        amount,
  });
}
}
