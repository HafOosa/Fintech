import { Component, OnInit } from '@angular/core';
import { UserService } from '@services/user.service';
import { CommonModule } from '@angular/common';
import { trigger, style, transition, animate } from '@angular/animations';
import { FormsModule } from '@angular/forms'; // Import FormsModule pour [(ngModel)]
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-admin-dashboard',
  standalone: true, 
  imports: [CommonModule, FormsModule,RouterModule], 
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss'],
  animations: [
    trigger('fadeInAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate('0.5s ease-out', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
    ]),
  ],
})
export class AdminDashboardComponent implements OnInit {
  users: any[] = [];
  showAddUserModal = false;
  showEditUserModal = false;
  newUser = { first_name: '', last_name: '', email: '', password: '' };
  selectedUser: any = {};

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    console.log('AdminDashboardComponent initialized');
    this.loadUsers();
  }

  loadUsers() {
    console.log('Fetching users from the backend...');
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        console.log('Users loaded successfully:', users);
        this.users = users.filter(user => user.role !== 'admin');
        console.log('Filtered users:', this.users);
        this.users.sort((a, b) => a.user_id - b.user_id);
        console.log('Sorted users:', this.users);
      },
      error: (err) => {
        console.error('Failed to load users:', err);
      },
    });
  }

  deleteUser(userId: number) {
    console.log(`Attempting to delete user with ID: ${userId}`);
    this.userService.deleteUser(userId).subscribe({
      next: () => {
        console.log(`User with ID ${userId} deleted successfully`);
        this.loadUsers(); // Reload after deletion
      },
      error: (err) => {
        console.error(`Failed to delete user with ID ${userId}:`, err);
      },
    });
  }

    // Gestion du modal pour ajouter un utilisateur
    openAddUserModal() {
      this.showAddUserModal = true;
    }
  
    closeAddUserModal() {
      this.showAddUserModal = false;
      this.newUser = { first_name: '', last_name: '', email: '', password: '' };
    }
  
    addUser() {
      console.log('Adding user:', this.newUser);
      this.userService.addUser(this.newUser).subscribe({
        next: () => {
          console.log('User added successfully');
          this.loadUsers();
          this.closeAddUserModal();
        },
        error: (err) => console.error('Failed to add user', err),
      });
    }
  
    // Gestion du modal pour modifier un utilisateur
    openEditUserModal(user: any) {
      this.selectedUser = { ...user };
      this.showEditUserModal = true;
    }
  
    closeEditUserModal() {
      this.showEditUserModal = false;
      this.selectedUser = {};
    }
  
    editUser() {
      console.log('Editing user:', this.selectedUser);
      this.userService.updateUser(this.selectedUser.user_id, this.selectedUser).subscribe({
        next: () => {
          console.log('User updated successfully');
          const index = this.users.findIndex(user => user.user_id === this.selectedUser.user_id);
          if (index !== -1) {
            this.users[index] = { ...this.selectedUser };
          }
          this.closeEditUserModal();
        },
        error: (err) => console.error('Failed to update user', err),
      });
    }

    logout() {
      console.log('Logging out...');
      // Effectuez ici toute logique de nettoyage si nécessaire (comme supprimer des tokens)
      window.location.href = '/login'; // Redirection vers la page de connexion
    }
}
