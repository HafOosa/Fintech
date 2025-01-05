import { Component, OnInit } from '@angular/core';
import { NewsService, NewsItem } from './news.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-news',
  standalone: true,
  imports:[CommonModule],
  templateUrl:'./news.component.html',
  styleUrls: ['./news.component.scss'],
})
export class NewsComponent implements OnInit {
  newsItems: NewsItem[] = [];
  error: string = '';
  loading: boolean = false;

  constructor(private newsService: NewsService) {}

  ngOnInit() {
    this.loadNews();
  }

  private loadNews() {
    this.loading = true;
    this.newsService.getNews().subscribe({
      next: (news) => {
        this.newsItems = news.results.map((item: NewsItem) => ({
          ...item,
          pubDate: item.pubDate.replace(' ', 'T') + 'Z', // Transform to ISO format
        }));
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load crypto news. Please try again later.';
        this.loading = false;
        console.error('Error loading news:', err);
      },
    });
  }
}
