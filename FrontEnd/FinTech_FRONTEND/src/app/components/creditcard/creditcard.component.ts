import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { WalletService } from '@services/wallet.service';

@Component({
  selector: 'app-credit-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './creditcard.component.html',
  styleUrls: ['./creditcard.component.scss'],
})
export class CreditCardComponent implements OnInit {
  cardNumber: string = '#### #### #### ####';
  cardHolder: string = 'John Doe';
  expiryDate: string = 'MM/YY';
  balance: number = 0;
  cardType: string = 'visa'; // Default card type (visa, mastercard, etc.)
  errorMessage: string | null = null;

  constructor(private walletService: WalletService) {}

  ngOnInit(): void {
    this.loadWalletDetails();
  }

  loadWalletDetails(): void {
    this.walletService.getWallet().subscribe({
      next: (wallet) => {
        this.cardNumber = wallet.address
          ? wallet.address.replace(/(.{4})/g, '$1 ').trim() // Format card number
          : this.cardNumber;
        this.cardHolder = wallet.user_id ? `User ${wallet.user_id}` : this.cardHolder;
        this.expiryDate = '12/25'; // Placeholder; adjust if real data available
        this.balance = wallet.balance || 0;
        this.cardType = this.detectCardType(this.cardNumber);
      },
      error: (err) => {
        console.error('Failed to load wallet details', err);
        this.errorMessage = 'Unable to fetch wallet details.';
      },
    });
  }

  detectCardType(cardNumber: string): string {
    if (/^4/.test(cardNumber)) return 'visa';
    if (/^5[1-5]/.test(cardNumber)) return 'mastercard';
    if (/^3[47]/.test(cardNumber)) return 'amex';
    if (/^6/.test(cardNumber)) return 'discover';
    return 'generic';
  }
}
