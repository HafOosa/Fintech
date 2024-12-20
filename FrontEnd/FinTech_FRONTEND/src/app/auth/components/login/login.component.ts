import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
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
    private router: Router
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
      
      // Mock authentication (replace with real service)
      if (this.validateCredentials(email, password)) {
        // Successful login
        console.log('Login Successful');
        // Navigate to dashboard or home page
        this.router.navigate(['/dashboard']);
      } else {
        // Failed login
        this.loginError = true;
      }
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