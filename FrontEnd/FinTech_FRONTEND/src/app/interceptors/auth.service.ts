import { HttpInterceptorFn } from '@angular/common/http';

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token'); // Récupération du token depuis le localStorage

  if (token) {
    // Ajouter l'en-tête Authorization avec le token
    const clonedRequest = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    });
    return next(clonedRequest);
  }

  // Passer la requête sans modification si aucun token
  return next(req);
};


