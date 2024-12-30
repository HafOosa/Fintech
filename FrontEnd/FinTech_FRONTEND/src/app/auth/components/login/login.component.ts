import { Component } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { CommonModule } from '@angular/common';
import { LoginResponse } from '../../services/auth/auth.service';
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
  imports: [RouterModule,CommonModule, ReactiveFormsModule, CryptoIconsComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent {
  loginForm: FormGroup;
  submitted = false;
  loginError = false;
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
        Validators.minLength(6)
      ]]
    });
  }

  // Toggle password visibility
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  // Form submission handler
  onSubmit() {
    this.submitted = true;
    this.loginError = false;

    if (this.loginForm.valid) {
      // Simulate login logic (replace with actual authentication service)
      const { email, password } = this.loginForm.value;
      
      // Utiliser le AuthService pour effectuer la connexion
      this.authService.login(email, password).subscribe({
        next: (response: LoginResponse) => {
          const userId = response.user.user_id;
          localStorage.setItem('token', response.access_token);
          localStorage.setItem('user_id', userId.toString());
          console.log('Login Successful', response);
          this.router.navigate([`/${userId}/dashboard`]);
        },
        error: (error) => {
          console.error('Login failed', error);
          this.loginError = true; // Afficher une erreur en cas de problème
        }
      });
    }
  }

  // Mock credential validation method
  private validateCredentials(email: string, password: string): boolean {
    // Placeholder for actual authentication logic
    // In real-world scenario, this would be handled by an AuthService
    return email === 'test@example.com' && password === 'Password123!';
  }

  // Forgot password navigation
  onForgotPassword() {
    this.router.navigate(['/forgot-password']);
  }

  // Getter methods for easy access in template
  get f() { return this.loginForm.controls; }
}
