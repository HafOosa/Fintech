import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-wallet',
  standalone: true,
  imports: [FormsModule, MatButtonModule, MatInputModule],
  template: `
    <div class="wallet">
      <h2>Wallet Management</h2>
      <button mat-raised-button color="primary" (click)="createWallet()">Create Wallet</button>
      <div *ngIf="address">
        <p><strong>Address:</strong> {{ address }}</p>
        <p><strong>Encrypted Private Key:</strong> {{ encryptedPrivateKey }}</p>
      </div>

      <h3>Check Balance</h3>
      <input matInput [(ngModel)]="address" placeholder="0x123..." />
      <button mat-raised-button color="accent" (click)="getBalance()">Get Balance</button>
      <p *ngIf="balance"><strong>Balance:</strong> {{ balance }}</p>
      <p *ngIf="error" class="error">{{ error }}</p>
    </div>
  `,
  styles: [`
    .wallet {
      margin: 20px;
    }
    .error {
      color: red;
    }
  `],
})
export class WalletComponent {
  address: string | null = null;
  encryptedPrivateKey: string | null = null;
  balance: string | null = null;
  error: string | null = null;

  createWallet(): void {
    // Logic for creating a wallet
    this.address = '0x123456789...'; // Example address
    this.encryptedPrivateKey = 'encrypted_key_example';
    this.error = null;
  }

  getBalance(): void {
    if (!this.address) {
      this.error = 'Please provide a valid wallet address.';
      return;
    }

    // Logic for getting the balance
    this.balance = '10 ETH'; // Example balance
    this.error = null;
  }
}
