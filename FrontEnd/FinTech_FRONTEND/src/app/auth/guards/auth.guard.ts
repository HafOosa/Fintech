import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const token = localStorage.getItem('token');

    if (token) {
      try {
        const decodedToken: any = jwtDecode(token);
        const currentTime = Math.floor(Date.now() / 1000); // Temps actuel en secondes

        if (decodedToken.exp && decodedToken.exp > currentTime) {
          console.log('AuthGuard: Access granted');

          const userRole = decodedToken.role;
          const userId = decodedToken.user_id;

          const targetUrl = state.url; // Obtenez l'URL cible
          console.log('AuthGuard: Target URL', targetUrl);

          if (userRole === 'admin' && !targetUrl.startsWith('/admin')) {
            console.log('AuthGuard: Redirecting admin to admin dashboard');
            this.router.navigate(['/admin']);
            return false; // Empêcher l'accès à d'autres routes


          } else if (userRole === 'user' && targetUrl.startsWith('/admin')) {
            console.error('AuthGuard: User attempting to access admin dashboard');
            this.router.navigate([`/${userId}/dashboard`]);
            return false; // Empêcher l'accès pour les utilisateurs
          }

          return true;
          
        } else {
          console.error('AuthGuard: Token expired');
          this.router.navigate(['/login']);
          return false;
        }
      } catch (error) {
        console.error('AuthGuard: Error decoding token', error);
        this.router.navigate(['/login']);
        return false;
      }
    } else {
      console.error('AuthGuard: No token found');
      this.router.navigate(['/login']);
      return false;
    }
  }
}
