import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth/auth.service';
import { Router, RouterLink } from '@angular/router';

import { 
  FormBuilder, 
  FormGroup, 
  Validators, 
  ReactiveFormsModule, 
  AbstractControl,
  ValidationErrors
} from '@angular/forms';
import { CryptoIconsComponent } from '../crypto-icons/crypto-icons.component';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CryptoIconsComponent,RouterLink],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {
  signupForm: FormGroup;
  submitted = false;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.signupForm = this.fb.group({
      firstName: ['', [
        Validators.required, 
        Validators.minLength(2),
        // Validators.pattern(/^[a-zA-Z]+$/)
      ]],
      lastName: ['', [
        Validators.required, 
        Validators.minLength(2),
        // Validators.pattern(/^[a-zA-Z]+$/)
      ]],
      email: ['', [
        Validators.required, 
        Validators.email
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(4),
        this.passwordStrengthValidator
      ]],
      confirmPassword: ['', [Validators.required]],
      termsAccepted: [true]
    }, { validators: this.passwordMatchValidator });
  }

  // Custom password strength validator
  passwordStrengthValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    
    if (!value) {
      return null;
    }

    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasNumber = /[0-9]/.test(value);
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(value);

    const passwordValid =   hasNumber; //Add (&& has somthing)

    return passwordValid ? null : { passwordStrength: true };
  }

  // Custom validator to check if passwords match
  passwordMatchValidator(group: FormGroup): ValidationErrors | null {
    const password = group.get('password');
    const confirmPassword = group.get('confirmPassword');

    return password && confirmPassword && password.value === confirmPassword.value 
      ? null 
      : { passwordMismatch: true };
  }

  // Form submission handler
  onSubmit() {
    this.submitted = true;
  
    if (this.signupForm.invalid) {
      console.log('Form is invalid:', this.signupForm.errors);
      console.log('Field errors:', {
        firstName: this.signupForm.get('firstName')?.errors,
        lastName: this.signupForm.get('lastName')?.errors,
        email: this.signupForm.get('email')?.errors,
        password: this.signupForm.get('password')?.errors,
        confirmPassword: this.signupForm.get('confirmPassword')?.errors,
        termsAccepted: this.signupForm.get('termsAccepted')?.errors,
      });
      return;
    }
  
    const formValue = this.signupForm.value;
  
    const userData = {
      firstName: formValue.firstName,
      lastName: formValue.lastName,
      email: formValue.email,
      password: formValue.password,
    };
  
    this.authService.register(userData).subscribe({
      next: (response) => {
        console.log('Registration successful:', response);
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Registration failed:', error);
      },
    });
  }
  

  // Getter methods for easy access in template
  get f() { return this.signupForm.controls; }
}