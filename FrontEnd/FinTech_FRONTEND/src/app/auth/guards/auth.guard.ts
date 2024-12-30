import { Injectable } from '@angular/core';
import { CanActivate,ActivatedRouteSnapshot, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const token = localStorage.getItem('token');
    const storedUserId = localStorage.getItem('user_id');

    if (!token || !storedUserId) {
      this.router.navigate(['/login']);
      return false;
    }

    const routeUserId = route.paramMap.get('userId');
    if (routeUserId !== storedUserId) {
      this.router.navigate(['/login']);
      return false;
    }

    return true;
  }
}