import { Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { WalletService } from '@services/wallet.service';

@Component({
  selector: 'app-wallet',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatInputModule,
    MatCardModule,
    MatIconModule,
  ],
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.scss'],
  providers: [WalletService],
})

export class WalletComponent implements OnInit {
  address: string | null = null;
  encryptedPrivateKey: string | null = null;
  balance: string | null = null;
  error: string | null = null;
  errorMessage: string | null = null;
  category: string = ''
  showFullAddress: boolean = false;
  showTransferModal: boolean = false;
  recipientWalletAddress: string = '';
  transferAmount: number | null = null;
  showCreateWalletModal = false;

  wallet: any = null;
  cryptowallet: any = null;
  transactions: any[] = [];
  visibleTransactions: any[] = [];
  showSeeMore: boolean = false;
  showShowLess: boolean = false;

  showDepositModal = false;
  showWithdrawModal = false;
  amount: number | null = null;
  successMessage: string | null = null;

  beneficiaries: any[] = [];
  selectedBeneficiary: string = '';
  newBeneficiaryName: string = '';
  newBeneficiaryWalletAddress: string = '';
  showAddBeneficiaryModal: boolean = false;


  // Mint Tokens inputs
  mintRecipient: string = '';
  mintAmount: number | null = null;
  showMintModal = false;

  // Transfer Tokens inputs
  fromAddress: string = '';
  privateKey: string = '';
  recipientAddress: string = '';

  constructor(private walletService: WalletService) {}


  ngOnInit(): void {
    this.loadWallet();
    this.CryptoWallet();
    this.loadTransactionHistory();
    this.loadBeneficiaries();
  }

    // Utility function to clear messages
    clearMessages() {
      this.successMessage = null;
      this.errorMessage = null;
    }

  loadWallet() {
    this.walletService.getWallet().subscribe({
      next: (data) => {
        this.wallet = data;
      },
      error: (err) => console.error('Failed to load wallet', err),
    });
  }
  CryptoWallet() {
    this.walletService.getCryptoWallet().subscribe({
      next: (data) => {
        this.cryptowallet = data;
      },
      error: (err) => console.error('Failed to load wallet', err),
    });
  }

  createWallet() {
    this.walletService.createWallet().subscribe({
      next: (data) => {
        this.wallet = data;
        this.successMessage = 'Wallet created successfully!';
        setTimeout(() => (this.successMessage = null), 3000);
      },
      error: (err) => {
        if (err.status === 400) {
          this.errorMessage = 'Wallet already exists for this user.';
        } else {
          this.errorMessage = 'Failed to create wallet. Please try again.';
        }
        setTimeout(() => (this.errorMessage = null), 3000);
      },
    });
  }

  loadTransactionHistory() {
    this.walletService.getTransactionHistory().subscribe({
      next: (data) => {
        this.transactions = data.map((transaction) => ({
          ...transaction,
          date: new Date(transaction.timestamp),
          category: transaction.category || 'Uncategorized',
        }));
        this.updateVisibleTransactions();
      },
      error: (err) => console.error('Failed to load transaction history', err),
    });
  }

  updateVisibleTransactions() {
    this.visibleTransactions = this.transactions.slice(0, 4);
    this.showSeeMore = this.transactions.length > 4;
    this.showShowLess = false;
  }

  showAllTransactions() {
    this.visibleTransactions = [...this.transactions];
    this.showSeeMore = false;
    this.showShowLess = true;
  }

  showLessTransactions() {
    this.updateVisibleTransactions();
  }

  deposit() {
    if (this.amount !== null && this.amount > 0) { // Vérifie si amount est défini et positif
      this.walletService.depositFunds(this.amount, this.category).subscribe({
        next: () => {
          this.loadWallet();
          this.loadTransactionHistory();
          this.successMessage = 'Deposit successful!';
          setTimeout(() => (this.successMessage = null), 3000);
          this.closeDepositModal();
        },
        error: (err) => console.error('Failed to deposit funds', err),
      });
    } else {
      this.successMessage = 'Please enter a valid amount.';
      setTimeout(() => (this.successMessage = null), 3000); // Affiche un message d'erreur
    }
  }

  withdraw() {
    if (this.amount !== null && this.amount > 0) { // Vérifie si amount est défini et positif
      this.walletService.withdrawFunds(this.amount, this.category).subscribe({
        next: () => {
          this.loadWallet();
          this.loadTransactionHistory();
          this.successMessage = 'Withdrawal successful!';
          setTimeout(() => (this.successMessage = null), 3000);
          this.closeWithdrawModal();
        },
        error: (err) => console.error('Failed to withdraw funds', err),
      });
    } else {
      this.successMessage = 'Please enter a valid amount.';
      setTimeout(() => (this.successMessage = null), 3000); // Affiche un message d'erreur
    }
  }

  openDepositModal() {
    this.showDepositModal = true;
  }

  closeDepositModal() {
    this.showDepositModal = false;
    this.amount = 0;
  }

  openWithdrawModal() {
    this.showWithdrawModal = true;
  }

  closeWithdrawModal() {
    this.showWithdrawModal = false;
    this.amount = 0;
  }


  toggleAddressVisibility() {
    this.showFullAddress = !this.showFullAddress;
  }

  openTransferModal() {
    this.showTransferModal = true;
  }

  closeTransferModal() {
    this.showTransferModal = false;
    this.recipientWalletAddress = '';
    this.transferAmount = 0;
  }

  transferFunds() {
    if (this.transferAmount !== null && this.transferAmount > 0 && this.recipientWalletAddress?.trim()) {
      const senderWalletAddress = this.wallet?.address; // Récupérer l'adresse du wallet connecté

      if (!senderWalletAddress) {
        this.successMessage = 'Votre wallet n’a pas été trouvé. Veuillez réessayer.';
        setTimeout(() => (this.successMessage = null), 3000);
        return;
      }

      console.log('Données envoyées :', {
        senderWalletAddress,
        recipientWalletAddress: this.recipientWalletAddress,
        amount: this.transferAmount,
      });

      this.walletService
        .transferFunds(this.recipientWalletAddress, this.transferAmount)
        .subscribe({
          next: () => {
            this.loadWallet();
            this.loadTransactionHistory();
            this.successMessage = 'Virement effectué avec succès !';
            setTimeout(() => (this.successMessage = null), 3000);
            this.closeTransferModal();
          },
          error: (err) => {
            console.error('Failed to transfer funds', err);
            this.successMessage = 'Échec du virement. Veuillez réessayer.';
            setTimeout(() => (this.successMessage = null), 3000);
          },
        });
    } else {
      this.successMessage = 'Veuillez entrer un montant valide et une adresse valide.';
      setTimeout(() => (this.successMessage = null), 3000);
    }
  }


  loadBeneficiaries() {
    this.walletService.getBeneficiaries().subscribe({
      next: (data) => (this.beneficiaries = data),
      error: (err) => console.error('Failed to load beneficiaries', err),
    });
  }

  addBeneficiary() {
    if (this.newBeneficiaryName && this.newBeneficiaryWalletAddress) {
      this.walletService.addBeneficiary(this.newBeneficiaryName, this.newBeneficiaryWalletAddress).subscribe({
        next: () => {
          this.loadBeneficiaries();
          this.showAddBeneficiaryModal = false;
          this.newBeneficiaryName = '';
          this.newBeneficiaryWalletAddress = '';
        },
        error: (err) => console.error('Failed to add beneficiary', err),
      });
    }
  }

  onBeneficiarySelected() {
    const selected = this.beneficiaries.find(
      (beneficiary) => beneficiary.wallet_address === this.selectedBeneficiary
    );
    if (selected) {
      this.recipientWalletAddress = selected.wallet_address;
    } else {
      this.recipientWalletAddress = ''; // Réinitialise si aucun bénéficiaire n'est sélectionné
    }
  }

   // Supprimer un bénéficiaire
   removeBeneficiary(beneficiaryId: number) {
    this.walletService.deleteBeneficiary(beneficiaryId).subscribe({
      next: () => this.loadBeneficiaries(),
      error: (err) => console.error('Failed to delete beneficiary', err),
    });
  }

    // Ouvrir le modal pour ajouter un bénéficiaire
  openAddBeneficiaryModal() {
    this.showAddBeneficiaryModal = true;
  }

  // Fermer le modal pour ajouter un bénéficiaire
  closeAddBeneficiaryModal() {
    this.showAddBeneficiaryModal = false;
  }


  /////////////////////////////////////////////////////////////////////////////////////////////////////////
  /*Crypto-wallets*/

  // Create Crypto Wallet
  // Create Crypto Wallet
   // Create Crypto Wallet
  // Backend Actions
  createCryptoWallet() {
    this.walletService.createCryptoWallet().subscribe({
      next: (data) => {
        this.wallet = data;
        this.successMessage = `Wallet created successfully! Address: ${data.address}`;
        this.closeCreateWalletModal();
        setTimeout(() => (this.successMessage = null), 3000);
      },
      error: (err) => {
        console.error('Error creating wallet:', err);
        this.errorMessage = 'Failed to create wallet. Please try again.';
        setTimeout(() => (this.errorMessage = null), 3000);
      }
    });
  }

  getBalance(address: string) {
    if (!address) {
      this.errorMessage = 'Address is required to fetch balance.';
      return;
    }
    this.walletService.getBalance(address).subscribe({
      next: (data) => {
        this.balance = data.balance;
        this.successMessage = `Balance: ${data.balance}`;
      },
      error: (err) => {
        console.error('Error fetching balance:', err);
        this.errorMessage = 'Failed to fetch balance. Please try again.';
      }
    });
  }

  mintTokens(to: string, amount: number | null) {
    if (!to || !amount || amount <= 0) {
      this.errorMessage = 'Valid recipient address and amount are required.';
      return;
    }
    this.walletService.mintTokens(to, amount).subscribe({
      next: (data) => {
        this.successMessage = `Tokens minted successfully! Transaction Hash: ${data.transaction_hash}`;
        this.closeMintModal();
      },
      error: (err) => {
        console.error('Error minting tokens:', err);
        this.errorMessage = 'Failed to mint tokens. Please try again.';
      }
    });
  }

  transferTokensFrom(fromAddress: string, privateKey: string, toAddress: string, amount: number | null) {
    if (!fromAddress || !privateKey || !toAddress || !amount || amount <= 0) {
      this.errorMessage = 'Valid details are required for transferring tokens.';
      return;
    }
    this.walletService.transferTokensFrom( toAddress, amount).subscribe({
      next: (data) => {
        this.successMessage = `Tokens transferred successfully! Transaction Hash: ${data.transaction_hash}`;
        this.closeTransferModal();
      },
      error: (err) => {
        console.error('Error transferring tokens:', err);
        this.errorMessage = 'Failed to transfer tokens. Please try again.';
      }
    });
  }

  openMintModal() {
    this.showMintModal = true;
  }

  closeMintModal() {
    this.showMintModal = false;
    this.clearMessages();
  }

  openCreateWalletModal() {
    this.showCreateWalletModal = true;
  }

  closeCreateWalletModal() {
    this.showCreateWalletModal = false;
    this.clearMessages();
  }


}
