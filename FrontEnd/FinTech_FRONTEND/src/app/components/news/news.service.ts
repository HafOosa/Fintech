import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

export interface NewsItem {
  title: string;
  description: string;
  link: string;
  image_url: string;
  pubDate: string;
  source_name: string;
}

@Injectable({
  providedIn: 'root',
})
export class NewsService {
  private readonly API_URL = 'https://newsdata.io/api/1/news';
  private readonly API_KEY = ''; //pub_64599045cf1d7cafadb1382095993da9b895d
  private readonly CACHE_KEY = 'cachedNews';

  constructor(private http: HttpClient) {}

  getNews(): Observable<{ results: NewsItem[] }> {
    const params = {
      apikey: this.API_KEY,
      q: 'Ethereum',
      category: 'business',
      language: 'en',
    };

    return this.http.get<{ results: NewsItem[] }>(this.API_URL, { params }).pipe(
      tap((response) => {
        // Cache the response in localStorage
        localStorage.setItem(this.CACHE_KEY, JSON.stringify(response.results));
      }),
      map((response) => ({
        ...response,
        results: response.results
          .filter(
            (item: NewsItem) => item.description && item.image_url // Ensure both fields exist
          )
          .slice(0, 5), // Limit to the first 3 items
      })),
      catchError((error) => {
        console.error('API Error:', error);

        // Fallback to cached data if available
        const cachedData = localStorage.getItem(this.CACHE_KEY);
        if (cachedData) {
          return of({
            results: JSON.parse(cachedData).slice(0, 3),
          });
        }

        // Return an empty array if no cache is available
        return of({ results: [] });
      })
    );
  }
}
