//user-analyse.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserAnalyseService {
  private apiUrl = 'http://127.0.0.1:8000/user-analysis';

  constructor(private http: HttpClient) {}

  getUserAnalysis(userId: number, token: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }
}
