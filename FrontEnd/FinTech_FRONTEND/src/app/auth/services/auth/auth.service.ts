import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import  {jwtDecode} from 'jwt-decode';

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
  private apiUrl = 'http://127.0.0.1:7000/users';

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, { email, password }).pipe(
      tap((response) => {
        if (response.access_token) {
          localStorage.setItem('token', response.access_token);
          const decodedToken: any = jwtDecode(response.access_token);
          if (decodedToken && decodedToken.user_id) {
            localStorage.setItem('user_id', decodedToken.user_id.toString());
          } else {
            console.error('Error: user_id not found in token'); // Stocker `user_id`
          }
        }
      })
    );
  }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, {
      first_name: userData.firstName,
      last_name: userData.lastName, // Fusionner les prénoms et noms
      email: userData.email,
      password: userData.password,
    });
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user_id');
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    return !!token && this.isTokenValid();
  }

  isTokenValid(): boolean {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token);
        const currentTime = Math.floor(Date.now() / 1000); // Temps actuel en secondes
        return decodedToken.exp && decodedToken.exp > currentTime; // Vérifie l'expiration
      } catch (error) {
        console.error('Error decoding token:', error);
        return false;
      }
    }
    return false;
  }

  getUserIdFromToken(): number | null {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token); // Décodage du token
        return decodedToken.user_id || null; // Utilisez `user_id` au lieu de `sub`
      } catch (error) {
        console.error('Error decoding token:', error);
        return null;
      }
    }
    return null;
  }

  getUserRoleFromToken(): string | null {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token);
        return decodedToken.role || null; // Retourne le rôle s'il est présent
      } catch (error) {
        console.error('Error decoding token:', error);
        return null;
      }
    }
    return null;
  }

  isAdmin(): boolean {
    const token = localStorage.getItem('token');
    if (!token) return false;
    
    const decoded: any = jwtDecode(token);
    return decoded?.role === 'admin';
  }

  getUserById(userId: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.get(`${this.apiUrl}/${userId}`, { headers });
  }

  updateUser(userId: number, userData: any): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.put(`${this.apiUrl}/${userId}`, userData, { headers });
  }
}
