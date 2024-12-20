import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private apiUrl = 'http://127.0.0.1:5000';

  constructor(private http: HttpClient) {}

  sendEth(data: { sender: string; private_key: string; recipient: string; amount: number }): Observable<any> {
    return this.http.post(`${this.apiUrl}/transaction/send_eth`, data);
  }

  sendToken(data: { token_address: string; sender: string; private_key: string; recipient: string; amount: number }): Observable<any> {
    return this.http.post(`${this.apiUrl}/transaction/send_token`, data);
  }
}
