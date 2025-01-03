import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private apiUrl = `http://127.0.0.1:8000/transactions`;

  constructor(private http: HttpClient) {}

  // Récupérer les transactions de l'utilisateur
  getUserTransactions(skip: number = 0, limit: number = 10): Observable<any> {
    return this.http.get(`${this.apiUrl}?skip=${skip}&limit=${limit}`);
  }

  addTransaction(transactionData: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, transactionData);
  }
}