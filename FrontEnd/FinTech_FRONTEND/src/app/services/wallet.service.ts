import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WalletService {
  private apiUrl = 'http://127.0.0.1:8000/wallets';
  private backendUrl = 'http://127.0.0.1:8000';

  constructor(private http: HttpClient) {}

  // Ajoutez une variable pour stocker et partager le montant total
  private totalTransferOutSubject = new BehaviorSubject<number>(0);
  totalTransferOut$ = this.totalTransferOutSubject.asObservable();

  getWallet(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

    // Calculer et mettre à jour le montant total des transferts sortants
  calculateTotalTransferOut(): void {
    this.getTransactionHistory().subscribe((transactions) => {
      const total = transactions
        .filter((transaction) => transaction.transaction_type === 'transfer_out')
        .reduce((sum, transaction) => sum + Math.abs(transaction.amount), 0);

      // Mettez à jour la valeur partagée
      this.totalTransferOutSubject.next(total);
    });
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

  updateWalletBalance(newBalance: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/update-balance`, { balance: newBalance });
  }




////////////////////////Crypto wallets services//////////////////////////////////////////



  // Recupere Crypto Wallet
  checkCryptoWalletExists() {
    return this.http.get<any>(`${this.backendUrl}/madt`, {});
  }


  //wallet_creation
  createCryptoWallet(): Observable<any> {
    return this.http.post<any>(`${this.backendUrl}/create_wallet`, {});
  }


  getCryptoWallet(): Observable<any> {
    return this.http.get<any>(`${this.backendUrl}`);
  }


  // Recuperation du balance de l'adresse
  getBalance(address: string): Observable<any> {
    return this.http.get<any>(`${this.backendUrl}/balance/${address}`);
  }


  // buy Tokens
  mintTokens(to: string, amount: number ): Observable<any> {
    return this.http.post<any>(`${this.backendUrl}/mint`, {to,amount});
  }

  // Transfer Tokens
  // Méthode pour transférer des tokens
  transferTokens(to_address: string, amount: number): Observable<any> {
    return this.http.post<any>(`${this.backendUrl}/transfer_from`, {to_address,amount});
  }
}
