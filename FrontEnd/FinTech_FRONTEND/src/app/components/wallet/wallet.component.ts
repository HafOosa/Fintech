import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-wallet',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatInputModule,
    MatCardModule,
    MatIconModule
  ],
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.scss'],
})
export class WalletComponent {
  address: string | null = null;
  encryptedPrivateKey: string | null = null;
  balance: string | null = null;
  error: string | null = null;

  createWallet(): void {
    // Simulate wallet creation logic
    this.address = '0x123456789ABCDEF'; // Example address
    this.encryptedPrivateKey = 'encrypted_key_example';
    this.error = null;
  }

  getBalance(): void {
    if (!this.address) {
      this.error = 'Please enter a valid wallet address.';
      this.balance = null;
      return;
    }

    // Simulate balance retrieval
    this.balance = '10 ETH'; // Example balance
    this.error = null;
  }
}
