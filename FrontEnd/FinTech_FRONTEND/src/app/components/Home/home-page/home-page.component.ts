import { MatToolbarModule } from '@angular/material/toolbar';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { RouterModule } from '@angular/router';
import { CryptoIconsComponent } from '@auth/components/crypto-icons/crypto-icons.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    MatCardModule,CryptoIconsComponent
  ],
  templateUrl: './home-page.component.html', // Move HTML here for clarity
  styleUrls: ['./home-page.component.scss'],
})
export class HomePageComponent {
  currentYear = new Date().getFullYear();

  isDarkTheme = false; // State for theme toggle

  features = [
    {
      icon: 'account_balance_wallet',
      title: 'Double Portefeuille',
      description: 'Gérez votre argent traditionnel et vos cryptomonnaies dans une seule application',
    },
    {
      icon: 'currency_bitcoin',
      title: 'Trading Crypto',
      description: 'Échangez facilement vos cryptomonnaies avec des frais minimaux',
    },
    {
      icon: 'security',
      title: 'Sécurité Maximale',
      description: 'Vos actifs sont protégés par les meilleurs standards de sécurité',
    },
  ];

  footerSections = [
    {
      title: 'À propos',
      links: [
        { text: 'Notre mission', url: '#' },
        { text: "L'équipe", url: '#' },
        { text: 'Carrières', url: '#' },
      ],
    },
    {
      title: 'Produits',
      links: [
        { text: 'Portefeuille', url: '#' },
        { text: 'Exchange', url: '#' },
        { text: 'Cartes', url: '#' },
      ],
    },
    {
      title: 'Support',
      links: [
        { text: "Centre d'aide", url: '#' },
        { text: 'Contact', url: '#' },
        { text: 'FAQ', url: '#' },
      ],
    },
    {
      title: 'Légal',
      links: [
        { text: 'Confidentialité', url: '#' },
        { text: 'Conditions', url: '#' },
        { text: 'Licences', url: '#' },
      ],
    },
  ];

  toggleTheme(): void {
    this.isDarkTheme = !this.isDarkTheme;
    document.body.classList.toggle('dark-theme', this.isDarkTheme);
  }
}
