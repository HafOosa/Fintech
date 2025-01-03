import { Component, OnInit } from '@angular/core';
import { UserService } from '@services/user.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent implements OnInit {
  user: any = {
    name: '',
    email: '',
    password: '',
  };
  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadCurrentUser();
  }

  loadCurrentUser() {
    this.userService.getCurrentUser().subscribe({
      next: (data) => {
        this.user = {
          name: data.name,
          email: data.email,
          password: '', // Vide, car on ne veut pas afficher le mot de passe
        };
      },
      error: (err) => {
        console.error('Failed to load user', err);
        this.errorMessage = 'Erreur lors du chargement des paramètres.';
        setTimeout(() => (this.errorMessage = null), 3000);
      },
    });
  }

  updateSettings() {
    this.userService.updateUser(this.user.user_id, this.user).subscribe({
      next: () => {
        this.successMessage = 'Paramètres mis à jour avec succès.';
        setTimeout(() => (this.successMessage = null), 3000);
      },
      error: (err) => {
        console.error('Failed to update settings', err);
        if (err.status === 400) {
          this.errorMessage = 'Email déjà utilisé.';
        } else {
          this.errorMessage = 'Erreur lors de la mise à jour des paramètres.';
        }
        setTimeout(() => (this.errorMessage = null), 3000);
      },
    });
  }

  resetForm() {
    this.loadCurrentUser();
  }
}
