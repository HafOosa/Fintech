import { Component } from '@angular/core';
import { WalletService } from '../../services/wallet.service';

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.css']
})
export class WalletComponent {
  address: string = '';
  encryptedPrivateKey: string = '';
  balance: string = '';
  error: string = '';

  constructor(private walletService: WalletService) {}

  createWallet(): void {
    this.walletService.createWallet().subscribe({
      next: (data) => {
        this.address = data.address;
        this.encryptedPrivateKey = data.encrypted_private_key;
      },
      error: (err) => this.error = err.message
    });
  }

  getBalance(): void {
    if (!this.address) {
      this.error = 'Wallet address is required.';
      return;
    }
    this.walletService.getBalance(this.address).subscribe({
      next: (data) => this.balance = `${data.balance} ETH`,
      error: (err) => this.error = err.message
    });
  }
}
