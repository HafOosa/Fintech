import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root' // Assurez-vous que le service est disponible globalement
})
export class AdminOverviewService {
  private apiUrl = 'http://localhost:8000/admin-overview/statistics';

  constructor(private http: HttpClient) {}

  getAdminStatistics(token: string): Observable<any> {
    return this.http.get<any>(this.apiUrl, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }
}
