import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface LoginResponse {
  user: {
    user_id: number;
    name: string;
    email: string;
    role: string;
  };
  access_token: string;
  token_type: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/users';

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, { email, password });
  }

  register(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, data);
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user_id');
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }
}



