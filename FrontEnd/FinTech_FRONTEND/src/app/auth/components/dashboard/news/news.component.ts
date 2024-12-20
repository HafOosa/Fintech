import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface NewsItem {
  title: string;
  time: string;
  category: string;
  preview: string;
}

@Component({
  selector: 'app-news',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="news-container">
      <div class="news-header">
        <h2>Crypto Newsfeed</h2>
        <button class="subscribe-btn">Subscribe</button>
      </div>
      <div class="news-list">
        <div class="news-item" *ngFor="let item of newsItems">
          <div class="news-meta">
            <span class="news-time">{{item.time}}</span>
            <span class="news-category">{{item.category}}</span>
          </div>
          <h3 class="news-title">{{item.title}}</h3>
          <p class="news-preview">{{item.preview}}</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .news-container {
      background: white;
      border-radius: 8px;
      padding: 1.5rem;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .news-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
    }
    .subscribe-btn {
      padding: 0.5rem 1rem;
      background: #1976d2;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    .news-item {
      padding: 1rem 0;
      border-bottom: 1px solid #eee;
    }
    .news-meta {
      display: flex;
      gap: 1rem;
      margin-bottom: 0.5rem;
    }
    .news-time {
      color: #666;
      font-size: 0.9rem;
    }
    .news-category {
      background: #e3f2fd;
      color: #1976d2;
      padding: 0.2rem 0.5rem;
      border-radius: 4px;
      font-size: 0.9rem;
    }
    .news-title {
      margin-bottom: 0.5rem;
      font-size: 1.1rem;
    }
    .news-preview {
      color: #666;
      font-size: 0.9rem;
    }
  `]
})
export class NewsComponent {
  newsItems: NewsItem[] = [
    {
      title: 'Beyond Bad Trades: Cybersecurity Risks to Cryptocurrency Exchange Users',
      time: 'Today 11:36',
      category: 'Security',
      preview: 'Cryptocurrency mining malware'}];
}