import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'http://127.0.0.1:8000/users';

  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<any[]> {
    console.log('Sending GET request to:', this.apiUrl);
    return this.http.get<any[]>(this.apiUrl);
  }

  deleteUser(userId: number): Observable<void> {
    console.log('Sending DELETE request to:', `${this.apiUrl}/${userId}`);
    return this.http.delete<void>(`${this.apiUrl}/${userId}`);
  }

  // Ajout d'un utilisateur
  addUser(user: { first_name: string; last_name: string; email: string; password: string }): Observable<any> {
    return this.http.post<any>(this.apiUrl, user);
  }

  // Modification d'un utilisateur
  updateUser(userId: number, user: any): Observable<any> {
    console.log('Sending PUT request to:', `${this.apiUrl}/${userId}`, 'with data:', user);
    return this.http.put<any>(`${this.apiUrl}/${userId}`, user);
  }

  getUserById(userId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${userId}`);
  }

  changePassword(userId: number, newPassword: string) {
    const token = localStorage.getItem('accessToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  
    return this.http.put(`http://127.0.0.1:8000/users/${userId}/password`, { new_password: newPassword }, { headers });
  }
}