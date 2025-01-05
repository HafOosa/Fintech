import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HistoricalData, LivePrice } from './chart.types';

@Injectable({
  providedIn: 'root'
})
export class DynamicChartService {
  private readonly apiUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) {}

  getHistoricalData(startDate?: string, endDate?: string): Observable<HistoricalData[]> {
    const params: { [param: string]: string } = {};
    if (startDate) params['start_date'] = startDate;
    if (endDate) params['end_date'] = endDate;

    return this.http.get<HistoricalData[]>(`${this.apiUrl}/api/historical`, {
      params,
      responseType: 'json' as const
    });
  }

  getLivePrice(): Observable<LivePrice> {
    return this.http.get<LivePrice>(`${this.apiUrl}/api/live`);
  }
}
