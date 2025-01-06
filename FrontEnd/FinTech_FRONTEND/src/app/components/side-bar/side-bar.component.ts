import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { CryptoIconsComponent } from '../../auth/components/crypto-icons/crypto-icons.component';
import {jwtDecode} from 'jwt-decode';


@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.scss']
})

export class SidebarComponent implements OnInit {
  userId: string | null = null;
  isCollapsed = false;


  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken: any = jwtDecode(token);
      this.userId = decodedToken?.user_id || null;
    }
  
    // Redirigez l'utilisateur vers la page de connexion si le token ou userId est invalide
    if (!this.userId) {
      console.warn('User ID is null. Redirecting to login.');
    }
  }

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }

  debugLink() {
    console.log('Generated link:', ['/', this.userId, 'exchange']);
  }
}
