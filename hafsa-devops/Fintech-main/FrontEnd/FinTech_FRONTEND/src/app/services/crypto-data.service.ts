import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CryptoDataService {
  private apiUrl = 'http://127.0.0.1:5000';

  constructor(private http: HttpClient) {}

  getPrice(cryptoId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/crypto/price`, { params: { crypto_id: cryptoId } });
  }

  getChart(cryptoId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/crypto/chart`, { params: { crypto_id: cryptoId } });
  }
}
