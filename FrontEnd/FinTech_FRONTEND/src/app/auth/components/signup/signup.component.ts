import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth/auth.service';

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
  imports: [CommonModule, ReactiveFormsModule, CryptoIconsComponent],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {
  signupForm: FormGroup;
  submitted = false;

  constructor(private fb: FormBuilder, private authService: AuthService) {
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
      termsAccepted: [false, Validators.requiredTrue]
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
    if (this.signupForm.valid) {
      this.authService.register(this.signupForm.value).subscribe((response) => {
        console.log('Registration successful', response);
      });
    }
  }

  // Getter methods for easy access in template
  get f() { return this.signupForm.controls; }
}