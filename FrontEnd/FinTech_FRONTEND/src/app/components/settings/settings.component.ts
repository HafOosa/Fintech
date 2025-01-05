import { Component, OnInit, ViewEncapsulation  } from '@angular/core';
import { UserService } from '@services/user.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '@auth/services/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [FormsModule, CommonModule,],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SettingsComponent implements OnInit {
  user: any = {
    name: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  };
  currentPassword = '';
  newPassword = '';
  selectedLanguage = 'en';
  successMessage: string | null = null;
  errorMessage: string | null = null;
  isDarkMode = false;
  isNotificationsEnabled = true;

  showEditProfileModal = false;
  showChangePasswordModal = false;
  showLanguageModal = false;

  constructor(private userService: UserService, private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.loadCurrentUser();
    const darkModeStatus = localStorage.getItem('darkMode');
    this.isDarkMode = darkModeStatus === 'enabled';
    if (this.isDarkMode) {
      document.body.classList.add('dark-mode');
    }
  }

  loadCurrentUser() {
    const userId = this.authService.getUserIdFromToken();
    if (userId) {
      this.userService.getUserById(userId).subscribe({
        next: (data) => {
          this.user = {
            ...data,
            firstName: data.name.split(' ')[0],
            lastName: data.name.split(' ')[1],
          };
        },
        error: (err) => {
          console.error('Failed to load user', err);
          this.errorMessage = 'Erreur lors du chargement des paramètres.';
          setTimeout(() => (this.errorMessage = null), 3000);
        },
      });
    } else {
      console.error('User ID not found in token');
    }
  }

  openEditProfileModal() {
    this.showEditProfileModal = true;
  }

  closeEditProfileModal() {
    this.showEditProfileModal = false;
  }

  openChangePasswordModal() {
    this.showChangePasswordModal = true;
  }

  closeChangePasswordModal() {
    this.showChangePasswordModal = false;
  }

  openLanguageModal() {
    this.showLanguageModal = true;
  }

  closeLanguageModal() {
    this.showLanguageModal = false;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']); // Redirige vers la page de login
  }

  toggleDarkMode(): void {
    if (this.isDarkMode) {
      document.body.classList.add('dark-mode');
      localStorage.setItem('darkMode', 'enabled');
    } else {
      document.body.classList.remove('dark-mode');
      localStorage.setItem('darkMode', 'disabled');
    }
    this.successMessage = `Dark Mode ${this.isDarkMode ? 'Enabled' : 'Disabled'}`;
    setTimeout(() => (this.successMessage = null), 3000);
  }

  toggleNotifications(): void {
    this.successMessage = `Notifications ${this.isNotificationsEnabled ? 'Enabled' : 'Disabled'}`;
    setTimeout(() => (this.successMessage = null), 3000);
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.user.profilePicture = e.target.result; // Assign the image data
      };
      reader.readAsDataURL(file);
    }
  }

  updateProfile() {
    const userId = this.authService.getUserIdFromToken();
    if (userId) {
      this.userService.updateUser(userId, {
        name: `${this.user.firstName} ${this.user.lastName}`,
        email: this.user.email,
        profilePicture: this.user.profilePicture,
      }).subscribe({
        next: () => {
          this.successMessage = 'Profile updated successfully.';
          this.closeEditProfileModal();
          setTimeout(() => (this.successMessage = null), 3000);
        },
        error: (err) => {
          console.error('Failed to update profile', err);
          this.errorMessage = 'Failed to update profile.';
          setTimeout(() => (this.errorMessage = null), 3000);
        },
      });
    }
  }

  updatePassword() {
    const userId = this.authService.getUserIdFromToken();
    if (userId) {
      this.userService.changePassword(userId, this.newPassword).subscribe({
        next: () => {
          this.successMessage = 'Password updated successfully.';
          this.closeChangePasswordModal();
          setTimeout(() => (this.successMessage = null), 3000);
        },
        error: (err) => {
          console.error('Failed to update password', err);
          this.errorMessage = 'Failed to update password.';
          setTimeout(() => (this.errorMessage = null), 3000);
        },
      });
    }
  }

  applyLanguage() {
    this.successMessage = `Language set to ${this.selectedLanguage.toUpperCase()}`;
    setTimeout(() => (this.successMessage = null), 3000);
    this.closeLanguageModal();
  }


}
