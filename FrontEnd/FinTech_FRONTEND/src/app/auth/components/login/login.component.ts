import { Component } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { CommonModule } from '@angular/common';
import { LoginResponse } from '../../services/auth/auth.service';
import {jwtDecode} from 'jwt-decode';
import { 
  FormBuilder, 
  FormGroup, 
  Validators, 
  ReactiveFormsModule 
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CryptoIconsComponent } from '../crypto-icons/crypto-icons.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule, CommonModule, ReactiveFormsModule, CryptoIconsComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;
  submitted = false;
  loginError = false;
  isLoading = false;
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [
        Validators.required, 
        Validators.email
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(4)
      ]]
    });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    this.submitted = true;
    this.loginError = false;
    this.isLoading = true; // Activer le chargement
  
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
  
      this.authService.login(email, password).subscribe({
        next: (response: LoginResponse) => {
          // Décoder le token pour récupérer le userId
          const decodedToken: any = jwtDecode(response.access_token);
          const userId = decodedToken?.user_id;
          const role = decodedToken?.role;
  
          if (userId) {
            // Stocker les informations nécessaires dans localStorage
            localStorage.setItem('token', response.access_token);
            localStorage.setItem('user_id', userId.toString());
            localStorage.setItem('role', response.user.role);
  
            console.log('Login Successful', response);
            console.log('User ID:', userId);
            console.log('Decoded Token:', decodedToken);
            console.log('Extracted User ID:', userId);

            if (role === 'admin') {
              this.router.navigate(['/admin']); // Redirection vers la page admin
            } else {
              this.router.navigate([`/${userId}/dashboard`]); // Redirection utilisateur
            }
            
          } else {
            console.error('Error: user_id not found in token');
            this.loginError = true;
          }
  
          this.isLoading = false; // Désactiver le chargement
        },
        error: (error) => {
          console.error('Login failed', error);
          this.loginError = true;
          this.isLoading = false; // Désactiver le chargement
  
          // Masquer le message d'erreur après 3 secondes
          setTimeout(() => {
            this.loginError = false;
          }, 3000);
        }
      });
    } else {
      console.error('Form is invalid');
      this.isLoading = false; // Désactiver le chargement
    }
  }

  onForgotPassword() {
    this.router.navigate(['/forgot-password']);
  }

  get f() { return this.loginForm.controls; }
}
