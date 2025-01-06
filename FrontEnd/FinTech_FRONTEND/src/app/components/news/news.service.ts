import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

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
  private readonly API_KEY = 'pub_64404ec3266e565440b90a57af30300b724c7'; //

  constructor(private http: HttpClient) {}

  getNews(): Observable<{ results: NewsItem[] }> {
    const params = {
      apikey: this.API_KEY,
      q: 'cryptocurrency OR blockchain',
      category: 'business',
      language: 'en',
    };
  
    return this.http.get<{ results: NewsItem[] }>(this.API_URL, { params }).pipe(
      map((response) => ({
        ...response,
        results: response.results
          .filter(
            (item: NewsItem) => item.description && item.image_url // Ensure both fields exist
          )
          .slice(0, 4), // Limit to the first 7 items
      }))
    );
  }
}  