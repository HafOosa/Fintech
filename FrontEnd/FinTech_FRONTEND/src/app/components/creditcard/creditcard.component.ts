import { Component, OnInit } from '@angular/core';
import { WalletService } from '@services/wallet.service';
import { UserService } from '@services/user.service';
import { AuthService } from '@auth/services/auth/auth.service';

@Component({
  selector: 'app-credit-card',
  standalone: true,
  imports: [],
  templateUrl: './creditcard.component.html',
  styleUrls: ['./creditcard.component.scss'],
})
export class CreditCardComponent implements OnInit {
  cardNumber: string = '#### #### #### ####';
  maskedCardNumber: string = '#### #### #### ####'; // Masked version of cardNumber
  isCardMasked: boolean = true; // Controls whether the card number is masked or unmasked
  cardHolder: string = 'John Doe';
  expiryDate: string = 'MM/YY';
  balance: number = 0;
  cardType: string = 'visa';
  errorMessage: string | null = null;

  constructor(
    private walletService: WalletService,
    private userService: UserService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadCurrentUser();
    this.loadWalletDetails();
  }

  loadCurrentUser(): void {
    const userId = this.authService.getUserIdFromToken();
    if (userId) {
      this.userService.getUserById(userId).subscribe({
        next: (user) => {
          console.log('User Data:', user);
          
          // Ensure user.name is a valid string
          if (user && typeof user.name === 'string' && user.name.trim() !== '') {
            const nameParts = user.name.split(' ');
            const firstName = nameParts[0] || 'Unknown'; // Get the first part or fallback
            const lastName = nameParts.slice(1).join(' ') || 'User'; // Join remaining parts
            this.cardHolder = `${firstName} ${lastName}`;
          } else {
            this.cardHolder = 'Unknown User'; // Fallback if name is invalid
          }
        },
        error: (err) => {
          console.error('Failed to fetch user details:', err);
          this.cardHolder = 'Unknown User'; // Fallback on error
        },
      });
    } else {
      console.warn('User ID not found in token');
      this.cardHolder = 'Unknown User'; // Fallback if no user ID
    }
  }
  

  loadWalletDetails(): void {
    this.walletService.getWallet().subscribe({
      next: (wallet) => {
        console.log('Wallet Data:', wallet);
        this.cardNumber = wallet.address
          ? wallet.address.replace(/(.{4})/g, '$1 ').trim()
          : this.cardNumber;
        this.maskedCardNumber = this.maskCardNumber(this.cardNumber);
        this.balance = wallet.balance || 0;
        this.expiryDate = '12/25';
        this.cardType = this.detectCardType(this.cardNumber);
      },
      error: (err) => {
        console.error('Failed to load wallet details:', err);
        this.errorMessage = 'Unable to fetch wallet details.';
      },
    });
  }

  maskCardNumber(cardNumber: string): string {
    return cardNumber
      .split(' ')
      .map((chunk, index) => (index < cardNumber.split(' ').length - 1 ? '**' : chunk))
      .join(' ');
  }

  toggleCardMask(): void {
    this.isCardMasked = !this.isCardMasked;
    this.maskedCardNumber = this.isCardMasked ? this.maskCardNumber(this.cardNumber) : this.cardNumber;
  }

  detectCardType(cardNumber: string): string {
    if (/^4/.test(cardNumber)) return 'visa';
    if (/^5[1-5]/.test(cardNumber)) return 'mastercard';
    if (/^3[47]/.test(cardNumber)) return 'amex';
    if (/^6/.test(cardNumber)) return 'discover';
    return 'generic';
  }
}